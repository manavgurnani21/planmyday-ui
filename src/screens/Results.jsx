import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityCard } from '../components/ActivityCard';
import { TopBar } from '../components/FilterBar';
import { Icon } from '../components/Icons';
import { MapView } from '../components/MapView';
import { searchActivities } from '../api/client';

export const Results = ({
  location,
  interests,
  radiusMi,
  onChangeRadius,
  openNow,
  onToggleOpenNow,
  onChangeLocation,
  onChangeInterests,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [results, setResults] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [recenterToken, setRecenterToken] = useState(0);
  const reqId = useRef(0);
  const cardRefs = useRef(new Map());

  const fetchInitial = useCallback(async () => {
    if (!location) return;
    const myId = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await searchActivities({
        lat: location.lat,
        lng: location.lng,
        radiusMi,
        interests,
        openNow,
        limit: 20,
      });
      if (reqId.current !== myId) return;
      setResults(res.results ?? []);
      setCursor(res.next_cursor ?? null);
      setTotal(res.total_estimate ?? res.results?.length ?? 0);
      setActiveId(res.results?.[0]?.id ?? null);
    } catch (e) {
      if (reqId.current !== myId) return;
      setError(e?.message || 'Failed to load activities');
      setResults([]);
      setCursor(null);
      setTotal(0);
    } finally {
      if (reqId.current === myId) setLoading(false);
    }
  }, [location, radiusMi, interests, openNow]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Scroll the active card into view when the user picks a pin on the map.
  useEffect(() => {
    if (!activeId) return;
    const node = cardRefs.current.get(activeId);
    node?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await searchActivities({
        lat: location.lat,
        lng: location.lng,
        radiusMi,
        interests,
        openNow,
        limit: 20,
        cursor,
      });
      setResults((prev) => [...prev, ...(res.results ?? [])]);
      setCursor(res.next_cursor ?? null);
      setTotal(res.total_estimate ?? total);
    } catch (e) {
      setError(e?.message || 'Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore, location, radiusMi, interests, openNow, total]);

  const remaining = Math.max(0, total - results.length);

  return (
    <div className="flex-1 bg-ink-50 flex flex-col min-h-0">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        location={location}
        onChangeLocation={onChangeLocation}
        radiusMi={radiusMi}
        onChangeRadius={onChangeRadius}
        interests={interests}
        onChangeInterests={onChangeInterests}
        openNow={openNow}
        onToggleOpenNow={onToggleOpenNow}
        totalCount={total}
      />

      <div className="relative flex-1 min-h-[700px]">
        <MapView
          center={location}
          results={results}
          activeId={activeId}
          onSelect={setActiveId}
          recenterToken={recenterToken}
        />

        {sidebarOpen && (
          <aside className="absolute top-4 left-4 bottom-4 w-[400px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-pop border border-ink-200 flex flex-col overflow-hidden z-[500]">
            <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-medium text-ink-600 uppercase tracking-wide">
                  {loading
                    ? 'Searching…'
                    : `${total} nearby · sorted by match`}
                </div>
                <h2 className="text-lg font-semibold text-ink-900 tracking-tight mt-0.5 truncate">
                  {location?.label || 'Your location'}
                </h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Hide list"
                className="shrink-0 w-8 h-8 rounded-lg hover:bg-ink-50 inline-flex items-center justify-center text-ink-600"
              >
                <Icon name="chevron" className="w-4 h-4 rotate-90" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {loading && results.length === 0 && <ListSkeleton />}
              {!loading && results.length === 0 && !error && (
                <EmptyState
                  onChangeRadius={() =>
                    onChangeRadius(Math.min(25, (radiusMi || 5) * 2))
                  }
                />
              )}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
                  {error}
                </div>
              )}
              {results.map((a) => (
                <div
                  key={a.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(a.id, el);
                    else cardRefs.current.delete(a.id);
                  }}
                >
                  <ActivityCard
                    activity={a}
                    compact
                    origin={location}
                    active={a.id === activeId}
                    onSelect={() => setActiveId(a.id)}
                  />
                </div>
              ))}
              {cursor && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full mt-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 bg-white text-sm font-medium text-ink-800 hover:bg-ink-50 disabled:opacity-60"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  {loadingMore
                    ? 'Loading…'
                    : `Load more${remaining ? ` · ${remaining} remaining` : ''}`}
                </button>
              )}
            </div>
          </aside>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-[500] inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white shadow-pop border border-ink-200 text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            <Icon name="list" className="w-4 h-4" />
            Show list · {total}
          </button>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[500]">
          <button
            onClick={() => setRecenterToken((t) => t + 1)}
            className="w-10 h-10 rounded-xl bg-white shadow-card border border-ink-100 flex items-center justify-center text-ink-800 hover:bg-ink-50"
            aria-label="Recenter"
            title="Recenter"
          >
            <Icon name="locate" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ListSkeleton = () => (
  <div className="space-y-3">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-ink-100 p-4 animate-pulse"
      >
        <div className="h-3 w-24 bg-ink-100 rounded mb-3" />
        <div className="h-4 w-3/4 bg-ink-100 rounded mb-2" />
        <div className="h-3 w-1/2 bg-ink-100 rounded" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ onChangeRadius }) => (
  <div className="p-6 text-center">
    <div className="mx-auto w-12 h-12 rounded-2xl bg-ink-100 flex items-center justify-center mb-3">
      <Icon name="search" className="w-5 h-5 text-ink-600" />
    </div>
    <div className="font-semibold text-ink-900">Nothing nearby</div>
    <p className="text-sm text-ink-600 mt-1">
      Try widening your radius or picking different interests.
    </p>
    <button
      onClick={onChangeRadius}
      className="mt-4 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-ink-900 text-white text-sm font-medium hover:bg-ink-800"
    >
      Widen radius
    </button>
  </div>
);
