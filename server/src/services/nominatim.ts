import { config } from '../config.js';
import { fetchUpstream } from '../lib/http.js';
import { upstreamFailure } from '../lib/errors.js';

type NominatimSearchResult = {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address?: Record<string, string>;
};

type NominatimReverseResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
  name?: string;
  address?: Record<string, string>;
};

export type GeocodeHit = {
  name: string;
  detail: string;
  location: { lat: number; lng: number };
};

export type ReverseHit = {
  name: string;
  detail: string;
};

export async function geocodeForward(q: string, limit: number): Promise<GeocodeHit[]> {
  const url = new URL('/search', config.NOMINATIM_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', String(limit));

  const res = await fetchUpstream({
    url: url.toString(),
    service: 'nominatim',
  });

  let raw: unknown;
  try {
    raw = await res.json();
  } catch (err) {
    throw upstreamFailure('Nominatim returned non-JSON', err);
  }

  if (!Array.isArray(raw)) {
    throw upstreamFailure('Nominatim search response not an array');
  }

  return (raw as NominatimSearchResult[]).map((r) => normalizeForwardHit(r));
}

export async function geocodeReverse(lat: number, lng: number): Promise<ReverseHit | null> {
  const url = new URL('/reverse', config.NOMINATIM_URL);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '14');

  const res = await fetchUpstream({
    url: url.toString(),
    service: 'nominatim',
  });

  let raw: NominatimReverseResult;
  try {
    raw = (await res.json()) as NominatimReverseResult;
  } catch (err) {
    throw upstreamFailure('Nominatim returned non-JSON', err);
  }

  if (!raw || (!raw.address && !raw.display_name)) return null;

  return {
    name: pickName(raw),
    detail: pickDetail(raw),
  };
}

function normalizeForwardHit(r: NominatimSearchResult): GeocodeHit {
  return {
    name: pickName(r),
    detail: pickDetail(r),
    location: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) },
  };
}

function pickName(r: { name?: string; address?: Record<string, string>; display_name?: string }): string {
  const a = r.address ?? {};
  const candidates = [
    r.name,
    a.neighbourhood,
    a.suburb,
    a.village,
    a.town,
    a.city,
    a.county,
  ];
  for (const c of candidates) {
    if (c && c.length > 0) return c;
  }
  if (r.display_name) return r.display_name.split(',')[0]!.trim();
  return '';
}

function pickDetail(r: { address?: Record<string, string>; display_name?: string }): string {
  const a = r.address ?? {};
  const parts = [
    a.city ?? a.town ?? a.village,
    a.state,
    a.country_code?.toUpperCase(),
  ].filter((x): x is string => Boolean(x));
  if (parts.length > 0) return parts.join(', ');
  if (r.display_name) {
    return r.display_name.split(',').slice(1, 4).join(',').trim();
  }
  return '';
}
