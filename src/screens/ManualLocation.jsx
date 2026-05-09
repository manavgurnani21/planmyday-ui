import { Icon } from '../components/Icons';

const SUGGESTIONS = [
  { name: 'Park Slope', detail: 'Brooklyn, NY' },
  { name: 'Williamsburg', detail: 'Brooklyn, NY' },
  { name: 'Lower East Side', detail: 'Manhattan, NY' },
  { name: 'Long Island City', detail: 'Queens, NY' },
];

export const ManualLocation = () => {
  return (
    <div className="flex-1 bg-ink-50">
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-24">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-900 mb-8">
          <Icon name="chevron" className="w-4 h-4 rotate-90" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink-900 tracking-tight leading-tight">
              Where are you?
            </h1>
            <p className="mt-3 text-ink-600 text-lg max-w-lg">
              We couldn't read your device location. Enter a city or
              neighborhood to find activities nearby.
            </p>

            <div className="mt-8 relative">
              <Icon
                name="search"
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-ink-200 bg-white text-ink-900 placeholder-ink-400 focus:outline-none focus:border-ink-900 text-base"
                placeholder="Search city or address"
                defaultValue="Park"
              />
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 h-12 rounded-xl bg-ink-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-ink-800">
                Search
                <Icon name="arrow" className="w-4 h-4" />
              </button>
              <button className="h-12 px-4 rounded-xl bg-white border border-ink-200 inline-flex items-center justify-center gap-2 text-sm font-medium text-ink-800 hover:bg-ink-100/60">
                <Icon name="locate" className="w-4 h-4" />
                Use current location
              </button>
            </div>

            <div className="mt-10">
              <div className="text-xs font-medium text-ink-600 uppercase tracking-wide mb-3">
                Suggestions
              </div>
              <div className="bg-white rounded-2xl border border-ink-200 shadow-card overflow-hidden">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s.name}
                    className={`w-full px-5 py-4 flex items-center gap-3 hover:bg-ink-50 text-left ${
                      i !== SUGGESTIONS.length - 1
                        ? 'border-b border-ink-100'
                        : ''
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
