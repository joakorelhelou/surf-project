import type { TidePrediction } from '../../types';
import { t } from '../../i18n';

interface TideCardProps {
  predictions: TidePrediction[] | null;
  unavailable?: boolean;
}

function formatTideTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'));
  return d.toLocaleString(t.locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function TideCard({ predictions, unavailable }: TideCardProps) {
  if (unavailable || predictions === null) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>🌊</span> {t.tides.title}
        </h3>
        <p className="text-sm text-gray-400 italic">
          {t.tides.unavailable}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>🌊</span> {t.tides.title}
      </h3>
      <div className="space-y-2">
        {predictions.map((p, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl px-3 py-2 ${
              p.type === 'H'
                ? 'bg-ocean-50 border border-ocean-100'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{p.type === 'H' ? '⬆️' : '⬇️'}</span>
              <div>
                <div className="text-xs font-medium text-gray-700">
                  {p.type === 'H' ? t.tides.high : t.tides.low}
                </div>
                <div className="text-xs text-gray-500">{formatTideTime(p.t)}</div>
              </div>
            </div>
            <div className={`text-sm font-bold ${p.type === 'H' ? 'text-ocean-700' : 'text-gray-600'}`}>
              {parseFloat(p.v).toFixed(2)} ft
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
