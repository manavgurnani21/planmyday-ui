import { CATEGORIES } from '../data/mockData';
import { Icon } from './Icons';

export const FilterBar = ({ activeIds = ['outdoors', 'food', 'arts'] }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-ink-900 text-white text-sm font-medium">
        All
        <span className="text-xs opacity-70">6</span>
      </button>
      {CATEGORIES.filter((c) => activeIds.includes(c.id)).map((c) => (
        <button
          key={c.id}
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-ink-200 text-sm font-medium text-ink-800 hover:bg-ink-50"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          {c.name}
        </button>
      ))}
      <div className="shrink-0 h-6 w-px bg-ink-200 mx-1" />
      <button className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-accent-50 border border-accent-100 text-sm font-medium text-accent-700">
        <Icon name="clock" className="w-4 h-4" />
        Open now
      </button>
    </div>
  );
};

export const TopBar = ({
  sidebarOpen,
  onToggleSidebar,
  location = 'Park Slope, Brooklyn',
}) => {
  return (
    <div className="bg-white border-b border-ink-200 sticky top-16 z-30">
      <div className="max-w-none mx-auto px-8 py-4 flex items-center gap-4 flex-wrap">
        <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-ink-50 border border-ink-200 text-sm font-medium text-ink-800 min-w-0">
          <Icon name="pin" className="w-4 h-4 text-ink-600 shrink-0" />
          <span className="truncate">{location}</span>
          <Icon name="chevron" className="w-4 h-4 text-ink-400 shrink-0" />
        </button>
        <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-ink-50 border border-ink-200 text-sm font-medium text-ink-800">
          <Icon name="sliders" className="w-4 h-4 text-ink-600" />
          5 mi
        </button>

        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-ink-200">
          <FilterBar />
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
        <FilterBar />
      </div>
    </div>
  );
};
