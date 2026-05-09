import { useState } from 'react';
import { ACTIVITIES, CATEGORIES } from '../data/mockData';
import { ActivityCard } from '../components/ActivityCard';
import { TopBar } from '../components/FilterBar';
import { Icon } from '../components/Icons';

const MapMock = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #e8efe8 0%, #dde6dd 60%, #d4dfd6 100%)',
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0 30 L100 28" stroke="#fff" strokeWidth="0.4" />
        <path d="M0 60 L100 65" stroke="#fff" strokeWidth="0.6" />
        <path d="M0 80 L100 78" stroke="#fff" strokeWidth="0.3" />
        <path d="M20 0 L18 100" stroke="#fff" strokeWidth="0.4" />
        <path d="M55 0 L60 100" stroke="#fff" strokeWidth="0.5" />
        <path d="M85 0 L82 100" stroke="#fff" strokeWidth="0.3" />
        <path
          d="M30 35 L48 32 L52 50 L34 54 Z"
          fill="#cfe3cf"
          opacity="0.9"
        />
        <path
          d="M62 60 L80 58 L82 72 L64 75 Z"
          fill="#cfe3cf"
          opacity="0.9"
        />
        <path
          d="M0 88 L100 92 L100 100 L0 100 Z"
          fill="#cfdde8"
          opacity="0.9"
        />
      </svg>

      {ACTIVITIES.map((a, i) => {
        const cat = CATEGORIES.find((c) => c.id === a.category);
        const featured = i === 0;
        return (
          <div
            key={a.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${a.pin.x}%`, top: `${a.pin.y}%` }}
          >
            <div
              className={`relative ${
                featured ? 'scale-110' : ''
              } transition-transform`}
            >
              <div
                className={`flex items-center gap-1 pl-1 pr-2.5 py-1 rounded-full ${
                  featured
                    ? 'bg-ink-900 text-white shadow-pop'
                    : 'bg-white text-ink-900 shadow-card'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                <span className="text-xs font-semibold tabular-nums">
                  {a.distanceMi}mi
                </span>
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 ${
                  featured ? 'bg-ink-900' : 'bg-white'
                }`}
              />
            </div>
          </div>
        );
      })}

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '50%' }}
      >
        <div className="w-4 h-4 rounded-full bg-blue-500 border-[3px] border-white shadow-pop" />
        <div className="absolute inset-0 -m-3 rounded-full bg-blue-500/15 animate-pulse" />
      </div>
    </div>
  );
};

export const Results = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex-1 bg-ink-50 flex flex-col min-h-0">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="relative flex-1 min-h-[700px]">
        <MapMock />

        {/* Overlay sidebar */}
        {sidebarOpen && (
          <aside className="absolute top-4 left-4 bottom-4 w-[400px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-pop border border-ink-200 flex flex-col overflow-hidden z-20">
            <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-medium text-ink-600 uppercase tracking-wide">
                  {ACTIVITIES.length} nearby · sorted by match
                </div>
                <h2 className="text-lg font-semibold text-ink-900 tracking-tight mt-0.5 truncate">
                  Park Slope, Brooklyn
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
              {ACTIVITIES.map((a) => (
                <ActivityCard key={a.id} activity={a} compact />
              ))}
              <button className="w-full mt-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 bg-white text-sm font-medium text-ink-800 hover:bg-ink-50">
                <Icon name="plus" className="w-4 h-4" />
                Load more · 14 remaining
              </button>
            </div>
          </aside>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white shadow-pop border border-ink-200 text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            <Icon name="list" className="w-4 h-4" />
            Show list · {ACTIVITIES.length}
          </button>
        )}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button className="w-10 h-10 rounded-xl bg-white shadow-card border border-ink-100 flex items-center justify-center text-ink-800 hover:bg-ink-50">
            <Icon name="plus" className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white shadow-card border border-ink-100 flex items-center justify-center text-ink-800 hover:bg-ink-50">
            <Icon name="locate" className="w-4 h-4" />
          </button>
        </div>

        {/* Map attribution */}
        <div className="absolute bottom-3 right-3 text-[10px] text-ink-700/60 bg-white/70 backdrop-blur px-2 py-0.5 rounded">
          © OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
};
