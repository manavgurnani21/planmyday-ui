import { config } from '../config.js';
import { fetchUpstream } from '../lib/http.js';
import { upstreamFailure } from '../lib/errors.js';
import { CATEGORIES, type CategoryId } from '../domain/categories.js';

export type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  /** Present for way/relation results when `out center` is used. */
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

type BuildQueryArgs = {
  lat: number;
  lng: number;
  radiusMeters: number;
  interests: readonly CategoryId[];
};

/**
 * Build an Overpass QL query that finds nodes/ways/relations within `radiusMeters`
 * of (lat,lng) carrying any of the OSM tags associated with the selected categories.
 *
 * Tags appear under multiple OSM keys (`leisure=park`, `amenity=cafe`,
 * `tourism=museum`, `sport=climbing`, …). To stay simple and robust we union
 * across the keys we know category tags live on.
 */
export function buildActivitiesQuery({
  lat,
  lng,
  radiusMeters,
  interests,
}: BuildQueryArgs): string {
  const tagSet = new Set<string>();
  for (const id of interests) {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat) continue;
    for (const t of cat.tags) tagSet.add(t);
  }

  if (tagSet.size === 0) {
    // Caller should validate first — defensive only.
    throw new Error('No interests resolved to tags');
  }

  const tagRegex = [...tagSet].map(escapeRegex).join('|');
  const around = `around:${Math.round(radiusMeters)},${lat},${lng}`;

  // The keys we union over — covers all the tags in CATEGORIES.
  const KEYS = ['amenity', 'leisure', 'tourism', 'sport', 'shop'];

  const filters = KEYS.map(
    (k) =>
      `  node["${k}"~"^(${tagRegex})$"](${around});\n` +
      `  way["${k}"~"^(${tagRegex})$"](${around});\n` +
      `  relation["${k}"~"^(${tagRegex})$"](${around});`,
  ).join('\n');

  return `[out:json][timeout:25];\n(\n${filters}\n);\nout center tags;`;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function fetchActivities(args: BuildQueryArgs): Promise<OverpassElement[]> {
  const body = `data=${encodeURIComponent(buildActivitiesQuery(args))}`;
  const res = await fetchUpstream({
    url: config.OVERPASS_URL,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    service: 'overpass',
  });

  let json: OverpassResponse;
  try {
    json = (await res.json()) as OverpassResponse;
  } catch (err) {
    throw upstreamFailure('Overpass returned non-JSON', err);
  }

  if (!Array.isArray(json.elements)) {
    throw upstreamFailure('Overpass response missing elements');
  }
  return json.elements;
}
