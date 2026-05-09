// UC Davis Memorial Union — used as the default location when geolocation
// is unavailable or denied.
export const DEFAULT_LOCATION = {
  lat: 38.5418,
  lng: -121.7494,
  label: 'UC Davis',
  detail: 'Davis, CA',
};

export const RADII_MI = [1, 5, 10, 25];

const EARTH_R_MI = 3958.7613;

export function haversineMi(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_R_MI * Math.asin(Math.sqrt(h));
}

export function googleMapsDirectionsUrl(dest, origin) {
  const params = new URLSearchParams({
    api: '1',
    destination: `${dest.lat},${dest.lng}`,
  });
  if (origin) params.set('origin', `${origin.lat},${origin.lng}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function getBrowserLocation({ timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('geolocation_unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => reject(err),
      { timeout: timeoutMs, maximumAge: 60_000, enableHighAccuracy: false }
    );
  });
}
