import { CATEGORIES } from '../data/mockData';
import { Icon } from '../components/Icons';

export const InterestSelector = ({
  interests = [],
  onChange,
  location,
  locating = false,
  onChangeLocation,
  onSubmit,
}) => {
  const toggle = (id) => {
    if (interests.includes(id)) {
      onChange(interests.filter((x) => x !== id));
    } else {
      onChange([...interests, id]);
    }
  };

  const canSubmit = interests.length > 0;
  const locText = location?.label
    ? location.detail
      ? `${location.label}, ${location.detail}`
      : location.label
    : 'Locating…';

  return (
    <div className="flex-1 bg-ink-50">
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-24">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-white border border-ink-200 text-xs font-medium text-ink-600 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Step 1 of 2 · Pick your vibe
          </span>
          <h1 className="text-5xl md:text-6xl font-semibold text-ink-900 tracking-tight leading-[1.05]">
            What are you up for today?
          </h1>
          <p className="mt-4 text-lg text-ink-600 max-w-xl">
            Pick a few interests and we'll surface the best places nearby —
            parks, cafes, museums, and more.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const selected = interests.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={selected}
                className={`relative text-left p-6 rounded-2xl border transition-all ${
                  selected
                    ? 'border-ink-900 bg-white shadow-card'
                    : 'border-ink-200 bg-white/60 hover:bg-white hover:border-ink-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.accent} mb-4 flex items-center justify-center`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                </div>
                <div className="font-semibold text-ink-900 text-lg">
                  {c.name}
                </div>
                <div className="text-sm text-ink-600 mt-1">{c.blurb}</div>
                {selected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-ink-900 flex items-center justify-center">
                    <Icon name="check" className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-5 rounded-2xl bg-white border border-ink-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center">
              <Icon name="locate" className="w-5 h-5 text-ink-700" />
            </div>
            <div>
              <div className="font-medium text-ink-900 text-sm">
                {location?.source === 'gps'
                  ? 'Using your current location'
                  : location?.source === 'manual'
                    ? 'Searching from'
                    : 'Default location'}
                {locating ? ' · locating…' : ''}
              </div>
              <div className="text-xs text-ink-600">
                {locText}
                <span className="mx-2 text-ink-300">·</span>
                <button
                  onClick={onChangeLocation}
                  className="text-ink-900 font-medium underline-offset-2 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
            className={`inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold transition-colors shadow-pop ${
              canSubmit
                ? 'bg-ink-900 text-white hover:bg-ink-800'
                : 'bg-ink-200 text-ink-600 cursor-not-allowed shadow-none'
            }`}
          >
            Find activities
            <span className={canSubmit ? 'text-white/60 font-normal' : 'text-ink-600 font-normal'}>
              · {interests.length} selected
            </span>
            <Icon name="arrow" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
