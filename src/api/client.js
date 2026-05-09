// Thin client for the endpoints in docs/api-contracts.md.
// Until the backend proxy is up, calls fall back to local mock data so the UI
// stays demoable. Toggle off with VITE_API_FALLBACK=false.
import { ACTIVITIES, CATEGORIES } from '../data/mockData';
import { haversineMi } from '../lib/geo';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(
  /\/$/,
  ''
);
const FALLBACK_ENABLED = import.meta.env.VITE_API_FALLBACK !== 'false';

class ApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.cause = cause;
  }
}

async function getJSON(path, params) {
  const url = new URL(BASE_URL + path, window.location.origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, { status: res.status });
  }
  return res.json();
}

// ---------- /activities ----------

export async function searchActivities({
  lat,
  lng,
  radiusMi = 5,
  interests,
  openNow = false,
  limit = 20,
  cursor,
}) {
  const params = {
    lat,
    lng,
    radius_mi: radiusMi,
    interests: Array.isArray(interests) ? interests.join(',') : interests,
    open_now: openNow ? 'true' : undefined,
    limit,
    cursor,
  };
  try {
    return await getJSON('/activities', params);
  } catch (err) {
    if (!FALLBACK_ENABLED) throw err;
    return mockSearchActivities({
      lat,
      lng,
      radiusMi,
      interests: params.interests?.split(',').filter(Boolean) ?? [],
      openNow,
      limit,
      cursor,
    });
  }
}

// ---------- /geocode ----------

export async function geocode({ q, limit = 5 }) {
  if (!q || !q.trim()) return { results: [] };
  try {
    return await getJSON('/geocode', { q, limit });
  } catch (err) {
    if (!FALLBACK_ENABLED) throw err;
    return mockGeocode(q, limit);
  }
}

// ---------- /reverse-geocode ----------

export async function reverseGeocode({ lat, lng }) {
  try {
    return await getJSON('/reverse-geocode', { lat, lng });
  } catch (err) {
    if (!FALLBACK_ENABLED) throw err;
    return mockReverseGeocode(lat, lng);
  }
}

// ---------- mock fallbacks ----------

function mockSearchActivities({
  lat,
  lng,
  radiusMi,
  interests,
  openNow,
  limit,
  cursor,
}) {
  const center = { lat, lng };
  const interestSet = new Set(interests);
  const all = ACTIVITIES.flatMap((seed, i) => {
    const cat = CATEGORIES.find((c) => c.id === seed.category);
    const offsetMi = seed.distanceMi || 0.5 + i * 0.3;
    // Spread mock pins around the user's chosen center so the map looks
    // sensible at different default locations.
    const dLat = ((seed.pin?.y ?? 50) - 50) / 800;
    const dLng = ((seed.pin?.x ?? 50) - 50) / 600;
    const loc = { lat: center.lat + dLat, lng: center.lng + dLng };
    const dist = haversineMi(center, loc);
    return [
      {
        id: `mock:${seed.id}`,
        name: seed.name,
        category: seed.category,
        category_label: seed.categoryLabel,
        distance_mi: Number(dist.toFixed(2)),
        score: seed.score,
        open_now: seed.openNow,
        website: seed.website,
        location: loc,
        address: null,
        hours_raw: null,
        _tags: cat?.tags ?? [],
      },
    ];
  });

  const filtered = all
    .filter((a) => a.distance_mi <= radiusMi)
    .filter(
      (a) => interestSet.size === 0 || interestSet.has(a.category)
    )
    .filter((a) => !openNow || a.open_now)
    .sort((x, y) => y.score - x.score || x.distance_mi - y.distance_mi);

  const start = cursor ? Number(cursor) : 0;
  const slice = filtered.slice(start, start + limit);
  const nextStart = start + slice.length;
  const next_cursor = nextStart < filtered.length ? String(nextStart) : null;

  return {
    results: slice,
    next_cursor,
    total_estimate: filtered.length,
  };
}

function mockGeocode(q, limit) {
  const PLACES = [
    { name: 'UC Davis', detail: 'Davis, CA, USA', location: { lat: 38.5418, lng: -121.7494 } },
    { name: 'Davis', detail: 'California, USA', location: { lat: 38.5449, lng: -121.7405 } },
    { name: 'Sacramento', detail: 'California, USA', location: { lat: 38.5816, lng: -121.4944 } },
    { name: 'Park Slope', detail: 'Brooklyn, NY, USA', location: { lat: 40.6710, lng: -73.9814 } },
    { name: 'Williamsburg', detail: 'Brooklyn, NY, USA', location: { lat: 40.7081, lng: -73.9571 } },
    { name: 'Lower East Side', detail: 'Manhattan, NY, USA', location: { lat: 40.7155, lng: -73.9844 } },
    { name: 'Long Island City', detail: 'Queens, NY, USA', location: { lat: 40.7447, lng: -73.9485 } },
    { name: 'San Francisco', detail: 'California, USA', location: { lat: 37.7749, lng: -122.4194 } },
  ];
  const needle = q.toLowerCase();
  const results = PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.detail.toLowerCase().includes(needle)
  ).slice(0, limit);
  return { results };
}

function mockReverseGeocode(lat, lng) {
  // Anything within ~1° of UC Davis gets the Davis label, otherwise return
  // a generic coordinate label.
  const davis = { lat: 38.5418, lng: -121.7494 };
  if (Math.abs(lat - davis.lat) < 0.5 && Math.abs(lng - davis.lng) < 0.5) {
    return { name: 'UC Davis', detail: 'Davis, CA' };
  }
  return {
    name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
    detail: 'Approximate location',
  };
}

export { ApiError };
