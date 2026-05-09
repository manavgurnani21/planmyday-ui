import { CATEGORIES } from '../data/mockData';
import { Icon } from './Icons';
import { googleMapsDirectionsUrl } from '../lib/geo';

const ScoreBar = ({ value }) => {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-ink-100 overflow-hidden">
        <div className="h-full bg-accent-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-ink-600 tabular-nums">
        {pct}% match
      </span>
    </div>
  );
};

function websiteUrl(raw) {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export const ActivityCard = ({
  activity,
  compact = false,
  origin,
  active = false,
  onSelect,
}) => {
  const cat = CATEGORIES.find((c) => c.id === activity.category);
  const label = activity.category_label ?? activity.categoryLabel;
  const distance = activity.distance_mi ?? activity.distanceMi;
  const open = activity.open_now ?? activity.openNow;
  const directionsHref = activity.location
    ? googleMapsDirectionsUrl(activity.location, origin)
    : null;
  const website = websiteUrl(activity.website);

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl border transition-shadow cursor-pointer ${
        compact ? 'p-4' : 'p-5'
      } ${
        active
          ? 'border-ink-900 shadow-pop'
          : 'border-ink-100 shadow-card hover:shadow-pop'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {cat && <span className={`w-2 h-2 rounded-full ${cat.dot}`} />}
            <span className="text-xs font-medium text-ink-600 uppercase tracking-wide">
              {label || cat?.name}
            </span>
            {open === true && (
              <span className="text-xs font-medium text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full">
                Open now
              </span>
            )}
            {open === false && (
              <span className="text-xs font-medium text-ink-600 bg-ink-100 px-2 py-0.5 rounded-full">
                Closed
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-ink-900 truncate">
            {activity.name}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-ink-600">
            <span className="tabular-nums">{distance?.toFixed?.(1) ?? distance} mi</span>
            <span className="text-ink-200">·</span>
            <ScoreBar value={activity.score} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {directionsHref && (
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 transition-colors"
          >
            <Icon name="arrow" className="w-4 h-4" />
            Directions
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-ink-50 border border-ink-100 text-sm font-medium text-ink-800 hover:bg-ink-100 transition-colors"
          >
            <Icon name="external" className="w-4 h-4" />
            <span className="truncate max-w-[140px]">{activity.website}</span>
          </a>
        )}
      </div>
    </div>
  );
};
