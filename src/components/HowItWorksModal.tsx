import { useState } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../i18n';

// Icons and weights are language-independent; text comes from the dictionary.
const FACTOR_META = [
  { icon: '⚡', weight: '35%' },
  { icon: '🧭', weight: '15%' },
  { icon: '✨', weight: '10%' },
  { icon: '💨', weight: '20%' },
  { icon: '🌬️', weight: '20%' },
];

const LABEL_COLORS = [
  'bg-emerald-500',
  'bg-green-400',
  'bg-yellow-400',
  'bg-red-400',
];

const LABEL_RANGES = ['75–100%', '55–74%', '35–54%', '0–34%'];

export default function HowItWorksModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-ocean-700 shadow-sm border border-ocean-100 hover:bg-white transition-colors"
        aria-label={t.howItWorks.triggerLabel}
        title={t.howItWorks.triggerLabel}
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
                <h2 className="text-2xl font-bold text-gray-900">{t.howItWorks.title}</h2>
                <p className="text-base text-gray-500 mt-1">{t.howItWorks.subtitle}</p>
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
                {t.howItWorks.intro1}{' '}
                <span className="font-semibold text-gray-800">{t.howItWorks.introBold1}</span>
                {t.howItWorks.intro2}{' '}
                <span className="font-semibold text-gray-800">{t.howItWorks.introBold2}</span>{' '}
                {t.howItWorks.intro3}
              </p>

              {/* Factors */}
              <div className="space-y-7">
                {t.howItWorks.factors.map((f, i) => (
                  <div key={f.title} className="flex gap-6">
                    <div className="text-3xl shrink-0 mt-0.5">{FACTOR_META[i].icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1.5">
                        <span className="text-lg font-semibold text-gray-900">{f.title}</span>
                        <span className="text-sm text-gray-400">{f.description}</span>
                        <span className="ml-auto text-sm font-bold text-ocean-600 bg-ocean-50 px-3 py-0.5 rounded-full shrink-0">
                          {FACTOR_META[i].weight}
                        </span>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score legend */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">{t.howItWorks.scoreLegend}</h3>
                <div className="space-y-3">
                  {t.howItWorks.labels.map((l, i) => (
                    <div key={l.label} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full shrink-0 ${LABEL_COLORS[i]}`} />
                      <span className="text-base font-semibold text-gray-800 w-24 shrink-0">{l.label}</span>
                      <span className="text-sm text-gray-400 w-20 shrink-0">{LABEL_RANGES[i]}</span>
                      <span className="text-base text-gray-600">{l.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
                {t.howItWorks.footer}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
