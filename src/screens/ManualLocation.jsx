import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icons';
import { geocode } from '../api/client';

const DEFAULT_SUGGESTIONS = [
  { name: 'UC Davis', detail: 'Davis, CA, USA', location: { lat: 38.5418, lng: -121.7494 } },
  { name: 'Davis', detail: 'California, USA', location: { lat: 38.5449, lng: -121.7405 } },
  { name: 'Sacramento', detail: 'California, USA', location: { lat: 38.5816, lng: -121.4944 } },
  { name: 'San Francisco', detail: 'California, USA', location: { lat: 37.7749, lng: -122.4194 } },
];

export const ManualLocation = ({
  location,
  onSelect,
  onUseCurrentLocation,
  onBack,
  locating = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Debounced /geocode lookup.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setError(null);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(async () => {
      setSearching(true);
      setError(null);
      try {
        const r = await geocode({ q, limit: 8 });
        if (!cancelled) setResults(r.results ?? []);
      } catch {
        if (!cancelled) {
          // Surface a soft message — we don't fall back to fake suggestions
          // tied to the wrong region.
          setError("Couldn't reach the location service. Try again in a moment.");
          setResults([]);
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  const list = useMemo(() => {
    if (results === null) return DEFAULT_SUGGESTIONS;
    return results;
  }, [results]);

  const pickResult = (r) => {
    if (
      !r?.location ||
      typeof r.location.lat !== 'number' ||
      typeof r.location.lng !== 'number'
    ) {
      setError('That place is missing coordinates — try another suggestion.');
      return;
    }
    onSelect({
      lat: r.location.lat,
      lng: r.location.lng,
      label: r.name ?? 'Selected location',
      detail: r.detail ?? '',
    });
  };

  const submit = () => {
    const first = list.find(
      (r) =>
        r?.location &&
        typeof r.location.lat === 'number' &&
        typeof r.location.lng === 'number'
    );
    if (first) pickResult(first);
  };

  return (
    <div className="flex-1 bg-ink-50">
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-24">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-900 mb-8"
        >
          <Icon name="chevron" className="w-4 h-4 rotate-90" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink-900 tracking-tight leading-tight">
              Where are you?
            </h1>
            <p className="mt-3 text-ink-600 text-lg max-w-lg">
              {location?.source === 'gps'
                ? `We have you at ${location.label}. Pick somewhere else if you'd rather plan from there.`
                : "We couldn't read your device location. Enter a city or neighborhood to find activities nearby."}
            </p>

            <form
              className="mt-8 relative"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <Icon
                name="search"
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-ink-200 bg-white text-ink-900 placeholder-ink-400 focus:outline-none focus:border-ink-900 text-base"
                placeholder="Search city or address"
              />
            </form>

            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={submit}
                disabled={list.length === 0}
                className="flex-1 h-12 rounded-xl bg-ink-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
                <Icon name="arrow" className="w-4 h-4" />
              </button>
              <button
                onClick={onUseCurrentLocation}
                disabled={locating}
                className="h-12 px-4 rounded-xl bg-white border border-ink-200 inline-flex items-center justify-center gap-2 text-sm font-medium text-ink-800 hover:bg-ink-100/60 disabled:opacity-50"
              >
                <Icon name="locate" className="w-4 h-4" />
                {locating ? 'Locating…' : 'Use current location'}
              </button>
            </div>

            <div className="mt-10">
              <div className="text-xs font-medium text-ink-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                {results === null ? 'Suggestions' : 'Results'}
                {searching && (
                  <span className="text-ink-400 normal-case tracking-normal">searching…</span>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-ink-200 shadow-card overflow-hidden">
                {error && (
                  <div className="px-5 py-4 text-sm text-ink-600 text-center">
                    {error}
                  </div>
                )}
                {list.length === 0 && !searching && !error && (
                  <div className="px-5 py-6 text-sm text-ink-600 text-center">
                    No matches. Try a different city or neighborhood.
                  </div>
                )}
                {list.map((s, i) => (
                  <button
                    key={`${s.name}-${i}`}
                    onClick={() => pickResult(s)}
                    className={`w-full px-5 py-4 flex items-center gap-3 hover:bg-ink-50 text-left ${
                      i !== list.length - 1 ? 'border-b border-ink-100' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center shrink-0">
                      <Icon name="pin" className="w-4 h-4 text-ink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-ink-900">{s.name}</div>
                      <div className="text-sm text-ink-600">{s.detail}</div>
                    </div>
                    <Icon
                      name="arrow"
                      className="w-4 h-4 text-ink-400 shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-2xl bg-white border border-ink-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center mb-4">
                <Icon name="pin" className="w-5 h-5 text-ink-700" />
              </div>
              <h3 className="font-semibold text-ink-900">
                Why we need your location
              </h3>
              <p className="text-sm text-ink-600 mt-2 leading-relaxed">
                PlanMyDay uses your location to find nearby parks, cafes,
                museums, and more. We never store it — your search stays in
                your browser.
              </p>
              <div className="mt-5 pt-5 border-t border-ink-100 text-xs text-ink-600 leading-relaxed">
                Powered by{' '}
                <span className="font-medium text-ink-800">Nominatim</span> and
                OpenStreetMap.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
