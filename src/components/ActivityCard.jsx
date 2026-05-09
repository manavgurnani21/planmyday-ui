import { CATEGORIES } from '../data/mockData';
import { Icon } from './Icons';

const ScoreBar = ({ value }) => {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-ink-100 overflow-hidden">
        <div
          className="h-full bg-accent-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-ink-600 tabular-nums">
        {pct}% match
      </span>
    </div>
  );
};

export const ActivityCard = ({ activity, compact = false }) => {
  const cat = CATEGORIES.find((c) => c.id === activity.category);

  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-ink-100 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
            <span className="text-xs font-medium text-ink-600 uppercase tracking-wide">
              {activity.categoryLabel}
            </span>
            {activity.openNow ? (
              <span className="text-xs font-medium text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full">
                Open now
              </span>
            ) : (
              <span className="text-xs font-medium text-ink-600 bg-ink-100 px-2 py-0.5 rounded-full">
                Closed
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-ink-900 truncate">
            {activity.name}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-ink-600">
            <span className="tabular-nums">{activity.distanceMi} mi</span>
            <span className="text-ink-200">·</span>
            <ScoreBar value={activity.score} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 transition-colors">
          <Icon name="arrow" className="w-4 h-4" />
          Directions
        </button>
        {activity.website && (
          <button className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-ink-50 border border-ink-100 text-sm font-medium text-ink-800 hover:bg-ink-100 transition-colors">
            <Icon name="external" className="w-4 h-4" />
            <span className="truncate max-w-[140px]">{activity.website}</span>
          </button>
        )}
      </div>
    </div>
  );
};
