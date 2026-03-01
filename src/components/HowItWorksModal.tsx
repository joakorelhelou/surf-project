import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Factor {
  icon: string;
  title: string;
  weight: string;
  description: string;
  detail: string;
}

const factors: Factor[] = [
  {
    icon: '⚡',
    title: 'Wave Power',
    weight: '35%',
    description: 'Energy of the swell — height² × period',
    detail:
      'This is the single most important factor. It combines swell height and period into one energy number: H² × T (proportional to actual wave power in kW/m). A 1.8 m wave at 14 s carries roughly 45 units of power — excellent surf. A 0.5 m wave at 8 s carries only 2 units — barely surfable. The score peaks at a "sweet spot" of solid, organised groundswell (roughly 1.5–3 m at 12–18 s) and falls off for dangerously large surf.',
  },
  {
    icon: '🧭',
    title: 'Swell Direction',
    weight: '15%',
    description: 'How directly the swell hits the break',
    detail:
      'Even a powerful swell is useless if it arrives from the wrong direction. Each spot has a known orientation — the compass bearing the break faces toward the ocean. The score is highest when the swell travels straight toward that bearing (head-on = 100%) and drops smoothly as the angle increases. A swell running side-shore scores around 50%; one going in the opposite direction scores near 0%.',
  },
  {
    icon: '✨',
    title: 'Swell Quality',
    weight: '10%',
    description: 'How organised the ocean energy is',
    detail:
      'Not all wave height is useful. This factor measures how much of the total wave height comes from the organised swell versus local wind chop. A high ratio means the water surface is smooth and the waves are predictable. When the ocean is dominated by disorganised chop (from strong local winds), this score drops even if the waves look big.',
  },
  {
    icon: '💨',
    title: 'Wind Speed',
    weight: '20%',
    description: 'Strength of the wind',
    detail:
      'Light winds (under 8 km/h) leave the surface glassy and score 100. As wind picks up, it roughens the water and blows spray off the wave faces. Over 40 km/h the surface becomes messy and the score drops to zero.',
  },
  {
    icon: '🌬️',
    title: 'Wind Direction',
    weight: '20%',
    description: 'Whether wind grooms or ruins the waves',
    detail:
      'Offshore wind blows from the land out to sea — it grooms wave faces and holds them up, giving clean barrels. Onshore wind blows the other way, collapsing waves before they break properly. This factor carries 20% weight because direction is just as important as speed — a strong offshore wind is often better than a light onshore one. Each spot has a known shore orientation so the app can tell which is which.',
  },
];

const labels = [
  { range: '75–100%', label: 'Excellent', color: 'bg-emerald-500', desc: 'Go surf — conditions are firing.' },
  { range: '55–74%', label: 'Good',      color: 'bg-green-400',   desc: 'Solid session, minor compromises.' },
  { range: '35–54%', label: 'Fair',      color: 'bg-yellow-400',  desc: 'Rideable but not ideal.' },
  { range: '0–34%',  label: 'Poor',      color: 'bg-red-400',     desc: 'Flat, blown-out, or too big.' },
];

export default function HowItWorksModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-ocean-700 shadow-sm border border-ocean-100 hover:bg-white transition-colors"
        aria-label="How the score works"
        title="How the score works"
      >
        ?
      </button>

      {/* Portal — renders at document.body, escaping any parent transform/overflow */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl flex flex-col"
            style={{ width: 'min(860px, calc(100vw - 3rem))', maxHeight: 'calc(100vh - 3rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-10 py-6 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">How the Score Works</h2>
                <p className="text-base text-gray-500 mt-1">Understanding surf conditions at a glance</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-6 mt-0.5 w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold leading-none transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-10 py-8 space-y-8">
              {/* Intro */}
              <p className="text-base text-gray-600 leading-relaxed">
                Every hour we combine five ocean and weather signals into a single number from{' '}
                <span className="font-semibold text-gray-800">0 to 100%</span>. Higher means better
                surfing conditions. The{' '}
                <span className="font-semibold text-gray-800">Best Windows</span> banner at the top
                of the forecast instantly shows you the top time slots to paddle out.
              </p>

              {/* Factors */}
              <div className="space-y-7">
                {factors.map((f) => (
                  <div key={f.title} className="flex gap-6">
                    <div className="text-3xl shrink-0 mt-0.5">{f.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1.5">
                        <span className="text-lg font-semibold text-gray-900">{f.title}</span>
                        <span className="text-sm text-gray-400">{f.description}</span>
                        <span className="ml-auto text-sm font-bold text-ocean-600 bg-ocean-50 px-3 py-0.5 rounded-full shrink-0">
                          {f.weight}
                        </span>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score legend */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">Score legend</h3>
                <div className="space-y-3">
                  {labels.map((l) => (
                    <div key={l.label} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full shrink-0 ${l.color}`} />
                      <span className="text-base font-semibold text-gray-800 w-24 shrink-0">{l.label}</span>
                      <span className="text-sm text-gray-400 w-20 shrink-0">{l.range}</span>
                      <span className="text-base text-gray-600">{l.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
                Data comes from the Open-Meteo Marine &amp; Weather APIs. Forecasts are updated every
                few hours. The score is a guide — local knowledge, tides, and crowd levels always
                matter too.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
