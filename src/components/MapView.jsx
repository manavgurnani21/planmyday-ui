import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '../data/mockData';

// Bundlers strip Leaflet's default marker images — point them at the CDN.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TAILWIND_DOT_HEX = {
  'bg-emerald-500': '#10b981',
  'bg-amber-500': '#f59e0b',
  'bg-violet-500': '#8b5cf6',
  'bg-fuchsia-500': '#d946ef',
  'bg-sky-500': '#0ea5e9',
  'bg-orange-500': '#f97316',
};

function pinIcon({ color = '#10b981', label, featured }) {
  const ring = featured ? '#0f1314' : '#ffffff';
  const text = featured ? '#ffffff' : '#0f1314';
  const bg = featured ? '#0f1314' : '#ffffff';
  const html = `
    <div style="
      display:inline-flex;align-items:center;gap:4px;
      padding:3px 9px 3px 4px;border-radius:9999px;
      background:${bg};color:${text};
      box-shadow:0 8px 24px rgba(15,19,20,0.18);
      border:1px solid ${ring};
      font:600 11px/1 -apple-system,BlinkMacSystemFont,Inter,Segoe UI,system-ui,sans-serif;
      font-variant-numeric:tabular-nums;
      white-space:nowrap;
    ">
      <span style="width:8px;height:8px;border-radius:9999px;background:${color};display:inline-block"></span>
      <span>${label}</span>
    </div>`;
  return L.divIcon({
    className: 'pmd-pin',
    html,
    iconSize: null,
    iconAnchor: [24, 28],
  });
}

function userIcon() {
  const html = `
    <div style="position:relative;width:16px;height:16px">
      <div style="position:absolute;inset:0;border-radius:9999px;background:#3b82f6;border:3px solid #fff;box-shadow:0 8px 24px rgba(15,19,20,0.18)"></div>
      <div style="position:absolute;inset:-10px;border-radius:9999px;background:rgba(59,130,246,0.18);animation:pmd-pulse 2s ease-out infinite"></div>
    </div>`;
  return L.divIcon({
    className: 'pmd-user',
    html,
    iconSize: null,
    iconAnchor: [8, 8],
  });
}

function CenterController({ center, recenterToken }) {
  const map = useMap();
  const lastCenter = useRef(null);
  const lastToken = useRef(recenterToken);

  useEffect(() => {
    const key = `${center.lat.toFixed(5)}|${center.lng.toFixed(5)}`;
    if (lastCenter.current !== key) {
      lastCenter.current = key;
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);

  useEffect(() => {
    if (lastToken.current !== recenterToken) {
      lastToken.current = recenterToken;
      map.flyTo([center.lat, center.lng], 14, { duration: 0.6 });
    }
  }, [recenterToken, center, map]);

  return null;
}

export function MapView({
  center,
  results = [],
  activeId,
  onSelect,
  zoom = 14,
  recenterToken = 0,
}) {
  const catById = useMemo(() => {
    const m = new Map();
    for (const c of CATEGORIES) m.set(c.id, c);
    return m;
  }, []);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom
      zoomControl={false}
      className="absolute inset-0 z-0"
      style={{ background: '#e8efe8' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CenterController center={center} recenterToken={recenterToken} />

      <Marker position={[center.lat, center.lng]} icon={userIcon()} />

      {results.map((a) => {
        const cat = catById.get(a.category);
        const color = (cat?.dot && TAILWIND_DOT_HEX[cat.dot]) || '#0f1314';
        const featured = a.id === activeId;
        return (
          <Marker
            key={a.id}
            position={[a.location.lat, a.location.lng]}
            icon={pinIcon({
              color,
              label: `${a.distance_mi}mi`,
              featured,
            })}
            eventHandlers={{
              click: () => onSelect?.(a.id),
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: '#4d5658' }}>
                  {a.category_label} · {a.distance_mi} mi
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
