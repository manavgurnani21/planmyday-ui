import { useCallback, useEffect, useState } from 'react';
import { InterestSelector } from './screens/InterestSelector';
import { Results } from './screens/Results';
import { ManualLocation } from './screens/ManualLocation';
import { reverseGeocode } from './api/client';
import { DEFAULT_LOCATION, getBrowserLocation } from './lib/geo';

const DEFAULT_INTERESTS = ['outdoors', 'food', 'arts'];

export default function App() {
  const [screen, setScreen] = useState('interests');
  const [location, setLocation] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    label: DEFAULT_LOCATION.label,
    detail: DEFAULT_LOCATION.detail,
    source: 'default',
  });
  const [interests, setInterests] = useState(DEFAULT_INTERESTS);
  const [radiusMi, setRadiusMi] = useState(5);
  const [openNow, setOpenNow] = useState(false);
  const [locating, setLocating] = useState(false);

  const useCurrentLocation = useCallback(async () => {
    setLocating(true);
    try {
      const coords = await getBrowserLocation();
      let label = `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`;
      let detail = '';
      try {
        const r = await reverseGeocode(coords);
        if (r?.name) {
          label = r.name;
          detail = r.detail ?? '';
        }
      } catch {
        // keep coordinate label
      }
      setLocation({ ...coords, label, detail, source: 'gps' });
      return true;
    } catch {
      // user denied or geolocation failed — keep default
      return false;
    } finally {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    // Try once on first load. Silent failure → keep UC Davis default.
    useCurrentLocation();
  }, [useCurrentLocation]);

  const setManualLocation = useCallback((next) => {
    setLocation({ ...next, source: 'manual' });
  }, []);

  const goToResults = useCallback(() => setScreen('results'), []);
  const goToInterests = useCallback(() => setScreen('interests'), []);
  const goToLocation = useCallback(() => setScreen('location'), []);

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center gap-8">
          <button
            onClick={goToInterests}
            className="flex items-center gap-2"
            aria-label="Go to interests"
          >
            <div className="w-7 h-7 rounded-lg bg-ink-900" />
            <span className="font-semibold text-ink-900 tracking-tight text-lg">
              PlanMyDay
            </span>
          </button>
          <nav className="flex items-center gap-1 ml-auto">
            <NavBtn active={screen === 'interests'} onClick={goToInterests}>
              Interests
            </NavBtn>
            <NavBtn active={screen === 'results'} onClick={goToResults}>
              Results
            </NavBtn>
            <NavBtn active={screen === 'location'} onClick={goToLocation}>
              Location
            </NavBtn>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {screen === 'interests' && (
          <InterestSelector
            interests={interests}
            onChange={setInterests}
            location={location}
            locating={locating}
            onChangeLocation={goToLocation}
            onSubmit={goToResults}
          />
        )}
        {screen === 'results' && (
          <Results
            location={location}
            interests={interests}
            radiusMi={radiusMi}
            onChangeRadius={setRadiusMi}
            openNow={openNow}
            onToggleOpenNow={() => setOpenNow((v) => !v)}
            onChangeLocation={goToLocation}
            onChangeInterests={setInterests}
          />
        )}
        {screen === 'location' && (
          <ManualLocation
            location={location}
            onSelect={(next) => {
              setManualLocation(next);
              setScreen('interests');
            }}
            onUseCurrentLocation={async () => {
              const ok = await useCurrentLocation();
              if (ok) setScreen('interests');
            }}
            onBack={goToInterests}
            locating={locating}
          />
        )}
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-ink-900 text-white'
          : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'
      }`}
    >
      {children}
    </button>
  );
}
