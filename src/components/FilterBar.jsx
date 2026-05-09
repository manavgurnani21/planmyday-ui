import { useState } from 'react';
import { CATEGORIES } from '../data/mockData';
import { Icon } from './Icons';
import { RADII_MI } from '../lib/geo';

export const FilterBar = ({
  interests = [],
  onChangeInterests,
  openNow = false,
  onToggleOpenNow,
  totalCount = 0,
}) => {
  const allOn = interests.length === CATEGORIES.length;

  const togglePill = (id) => {
    if (interests.includes(id)) {
      onChangeInterests(interests.filter((x) => x !== id));
    } else {
      onChangeInterests([...interests, id]);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChangeInterests(CATEGORIES.map((c) => c.id))}
        className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium ${
          allOn
            ? 'bg-ink-900 text-white'
            : 'bg-white border border-ink-200 text-ink-800 hover:bg-ink-50'
        }`}
      >
        All
        <span className="text-xs opacity-70">{totalCount}</span>
      </button>
      {CATEGORIES.map((c) => {
        const active = interests.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => togglePill(c.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors ${
              active
                ? 'bg-ink-900 text-white'
                : 'bg-white border border-ink-200 text-ink-800 hover:bg-ink-50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.name}
          </button>
        );
      })}
      <div className="shrink-0 h-6 w-px bg-ink-200 mx-1" />
      <button
        onClick={onToggleOpenNow}
        aria-pressed={openNow}
        className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors ${
          openNow
            ? 'bg-accent-500 border border-accent-500 text-white'
            : 'bg-accent-50 border border-accent-100 text-accent-700 hover:bg-accent-100'
        }`}
      >
        <Icon name="clock" className="w-4 h-4" />
        Open now
      </button>
    </div>
  );
};

const RadiusMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-ink-50 border border-ink-200 text-sm font-medium text-ink-800 hover:bg-ink-100"
      >
        <Icon name="sliders" className="w-4 h-4 text-ink-600" />
        {value} mi
        <Icon name="chevron" className="w-4 h-4 text-ink-400" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute z-40 mt-1 right-0 w-36 rounded-xl bg-white border border-ink-200 shadow-pop overflow-hidden">
            {RADII_MI.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 h-10 text-sm flex items-center justify-between hover:bg-ink-50 ${
                  r === value ? 'bg-ink-50 font-semibold text-ink-900' : 'text-ink-800'
                }`}
              >
                <span>{r} mi</span>
                {r === value && <Icon name="check" className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const TopBar = ({
  sidebarOpen,
  onToggleSidebar,
  location,
  onChangeLocation,
  radiusMi,
  onChangeRadius,
  interests,
  onChangeInterests,
  openNow,
  onToggleOpenNow,
  totalCount = 0,
}) => {
  const locText = location?.detail
    ? `${location.label}, ${location.detail}`
    : location?.label || 'Set location';

  return (
    <div className="bg-white border-b border-ink-200 sticky top-16 z-30">
      <div className="max-w-none mx-auto px-8 py-4 flex items-center gap-4 flex-wrap">
        <button
          onClick={onChangeLocation}
          className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-ink-50 border border-ink-200 text-sm font-medium text-ink-800 min-w-0 hover:bg-ink-100"
        >
          <Icon name="pin" className="w-4 h-4 text-ink-600 shrink-0" />
          <span className="truncate max-w-[240px]">{locText}</span>
          <Icon name="chevron" className="w-4 h-4 text-ink-400 shrink-0" />
        </button>
        <RadiusMenu value={radiusMi} onChange={onChangeRadius} />

        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-ink-200">
          <FilterBar
            interests={interests}
            onChangeInterests={onChangeInterests}
            openNow={openNow}
            onToggleOpenNow={onToggleOpenNow}
            totalCount={totalCount}
          />
        </div>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`ml-auto inline-flex items-center gap-2 h-10 px-3 rounded-xl border text-sm font-medium transition-colors ${
              sidebarOpen
                ? 'bg-ink-900 text-white border-ink-900 hover:bg-ink-800'
                : 'bg-white text-ink-800 border-ink-200 hover:bg-ink-50'
            }`}
          >
            <Icon name="list" className="w-4 h-4" />
            {sidebarOpen ? 'Hide list' : 'Show list'}
          </button>
        )}
      </div>
      <div className="md:hidden px-8 pb-3">
        <FilterBar
          interests={interests}
          onChangeInterests={onChangeInterests}
          openNow={openNow}
          onToggleOpenNow={onToggleOpenNow}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};
