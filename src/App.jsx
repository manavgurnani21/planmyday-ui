import { useState } from 'react';
import { InterestSelector } from './screens/InterestSelector';
import { Results } from './screens/Results';
import { ManualLocation } from './screens/ManualLocation';

const SCREENS = [
  { id: 'interests', label: 'Interests' },
  { id: 'results', label: 'Results' },
  { id: 'location', label: 'Location' },
];

export default function App() {
  const [screen, setScreen] = useState('interests');

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink-900" />
            <span className="font-semibold text-ink-900 tracking-tight text-lg">
              PlanMyDay
            </span>
          </div>
          <nav className="flex items-center gap-1 ml-auto">
            {SCREENS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScreen(s.id)}
                className={`px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
                  screen === s.id
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {screen === 'interests' && <InterestSelector />}
        {screen === 'results' && <Results />}
        {screen === 'location' && <ManualLocation />}
      </main>
    </div>
  );
}
