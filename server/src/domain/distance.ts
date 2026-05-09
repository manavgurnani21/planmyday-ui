const EARTH_RADIUS_MI = 3958.7613;
const toRad = (deg: number) => (deg * Math.PI) / 180;

export type LatLng = { lat: number; lng: number };

export function haversineMi(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.min(1, Math.sqrt(h)));
}

export const milesToMeters = (mi: number) => mi * 1609.344;
