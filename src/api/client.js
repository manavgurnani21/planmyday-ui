// Thin client for the endpoints in docs/api-contracts.md.
// All requests go through the Vite proxy at /api → backend on
// VITE_API_PROXY_TARGET (default http://localhost:3001). On any failure
// the error propagates and the UI surfaces an empty/unavailable state —
// we deliberately do NOT substitute placeholder data so users never see
// names that aren't tied to their actual location.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(
  /\/$/,
  ''
);

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
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
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
  return getJSON('/activities', params);
}

// ---------- /geocode ----------

export async function geocode({ q, limit = 5 }) {
  if (!q || !q.trim()) return { results: [] };
  return getJSON('/geocode', { q, limit });
}

// ---------- /reverse-geocode ----------

export async function reverseGeocode({ lat, lng }) {
  return getJSON('/reverse-geocode', { lat, lng });
}

export { ApiError };
