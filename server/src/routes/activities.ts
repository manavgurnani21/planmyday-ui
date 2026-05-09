import { Router } from 'express';
import { ActivitiesQuery, type ActivityResult } from '../schemas/activities.js';
import { getValidated, validateQuery } from '../middleware/validate.js';
import { fetchActivities, type OverpassElement } from '../services/overpass.js';
import {
  CATEGORIES,
  TAG_TO_CATEGORIES,
  type CategoryId,
  getCategory,
} from '../domain/categories.js';
import { haversineMi, milesToMeters, type LatLng } from '../domain/distance.js';
import { alignmentScore } from '../domain/scoring.js';
import { isOpenNow } from '../domain/openHours.js';
import { decodeCursor, encodeCursor } from '../domain/cursor.js';

export const activitiesRouter = Router();

activitiesRouter.get(
  '/activities',
  validateQuery(ActivitiesQuery),
  async (req, res, next) => {
    try {
      const q = getValidated<ActivitiesQuery>(req);
      const offset = decodeCursor(q.cursor);

      const elements = await fetchActivities({
        lat: q.lat,
        lng: q.lng,
        radiusMeters: milesToMeters(q.radius_mi),
        interests: q.interests,
      });

      const userLoc: LatLng = { lat: q.lat, lng: q.lng };
      const scored = elements
        .map((el) => mapElement(el, userLoc, q.interests))
        .filter((a): a is ActivityResult => a !== null)
        .filter((a) => (q.open_now ? a.open_now === true : true))
        .sort((a, b) =>
          b.score !== a.score ? b.score - a.score : a.distance_mi - b.distance_mi,
        );

      const window = scored.slice(offset, offset + q.limit);
      const nextOffset = offset + window.length;
      const next_cursor =
        nextOffset < scored.length ? encodeCursor(nextOffset) : null;

      res.json({
        results: window,
        next_cursor,
        total_estimate: scored.length,
      });
    } catch (err) {
      next(err);
    }
  },
);

function mapElement(
  el: OverpassElement,
  userLoc: LatLng,
  selected: readonly CategoryId[],
): ActivityResult | null {
  const tags = el.tags ?? {};
  const name = tags.name?.trim();
  if (!name) return null;

  const coords = elementCoords(el);
  if (!coords) return null;

  const matchedTags = collectMatchedTagValues(tags);
  if (matchedTags.length === 0) return null;

  const primaryCategory = pickPrimaryCategory(matchedTags, selected);
  if (!primaryCategory) return null;

  const primaryTag = matchedTags.find((t) =>
    TAG_TO_CATEGORIES.get(t)?.includes(primaryCategory),
  );
  const category_label =
    (primaryTag && getCategory(primaryCategory)?.tagLabels[primaryTag]) ||
    getCategory(primaryCategory)?.defaultLabel ||
    primaryCategory;

  const hoursRaw = tags.opening_hours ?? null;
  const open = isOpenNow(hoursRaw);

  return {
    id: `osm:${el.type}:${el.id}`,
    name,
    category: primaryCategory,
    category_label,
    distance_mi: round(haversineMi(userLoc, coords), 2),
    score: round(alignmentScore(matchedTags, selected), 4),
    open_now: open,
    website: tags.website ?? tags['contact:website'] ?? null,
    location: { lat: coords.lat, lng: coords.lng },
    address: composeAddress(tags),
    hours_raw: hoursRaw,
  };
}

function elementCoords(el: OverpassElement): LatLng | null {
  if (typeof el.lat === 'number' && typeof el.lon === 'number') {
    return { lat: el.lat, lng: el.lon };
  }
  if (el.center) {
    return { lat: el.center.lat, lng: el.center.lon };
  }
  return null;
}

const KNOWN_TAG_KEYS = ['amenity', 'leisure', 'tourism', 'sport', 'shop'] as const;

function collectMatchedTagValues(tags: Record<string, string>): string[] {
  const matched: string[] = [];
  for (const key of KNOWN_TAG_KEYS) {
    const v = tags[key];
    if (v && TAG_TO_CATEGORIES.has(v)) matched.push(v);
  }
  return matched;
}

function pickPrimaryCategory(
  matchedTags: readonly string[],
  selected: readonly CategoryId[],
): CategoryId | null {
  // Prefer a selected category that this activity touches; fall back to any
  // category the matched tags map to.
  for (const t of matchedTags) {
    const cats = TAG_TO_CATEGORIES.get(t) ?? [];
    for (const c of cats) {
      if (selected.includes(c)) return c;
    }
  }
  for (const t of matchedTags) {
    const cats = TAG_TO_CATEGORIES.get(t) ?? [];
    if (cats.length > 0) return cats[0]!;
  }
  return null;
}

function composeAddress(tags: Record<string, string>): string | null {
  const parts: string[] = [];
  const street = [tags['addr:housenumber'], tags['addr:street']]
    .filter(Boolean)
    .join(' ');
  if (street) parts.push(street);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:state']) parts.push(tags['addr:state']);
  return parts.length > 0 ? parts.join(', ') : null;
}

const round = (n: number, places: number) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};
