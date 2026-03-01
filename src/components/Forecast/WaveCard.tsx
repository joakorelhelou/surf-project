import type { HourlyMarine } from '../../types';
import { t } from '../../i18n';

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

/** Wave power ≈ 0.5 × H² × T (kW/m), standard deep-water approximation */
function wavePower(swellHeight: number, swellPeriod: number): { kw: number; className: string } {
  const kw = 0.5 * swellHeight * swellHeight * swellPeriod;
  const className =
    kw < 0.5  ? 'text-gray-400'
    : kw < 2  ? 'text-gray-500'
    : kw < 6  ? 'text-yellow-600'
    : kw < 15 ? 'text-green-600'
    : kw < 40 ? 'text-emerald-600 font-semibold'
    :           'text-red-500 font-semibold';
  return { kw, className };
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(t.locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

interface WaveCardProps {
  hourly: HourlyMarine;
}

export default function WaveCard({ hourly }: WaveCardProps) {
  // Map all 7-day hourly entries
  const entries = hourly.time.map((time, i) => ({
    time,
    waveHeight: hourly.wave_height[i],
    wavePeriod: hourly.wave_period[i],
    waveDir: hourly.wave_direction[i],
    swellHeight: hourly.swell_wave_height[i],
    swellPeriod: hourly.swell_wave_period[i] ?? hourly.wave_period[i],
  }));

  // Show every 3 hours, daylight hours only (06:00–21:00)
  const display = entries.filter((e, i) => {
    if (i % 3 !== 0) return false;
    const hour = new Date(e.time).getHours();
    return hour >= 6 && hour <= 21;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>🌊</span> {t.waves.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">{t.waves.colTime}</th>
              <th className="text-right pb-2 font-medium">{t.waves.colHeight}</th>
              <th className="text-right pb-2 font-medium">{t.waves.colPeriod}</th>
              <th className="text-right pb-2 font-medium">{t.waves.colDirection}</th>
              <th className="text-right pb-2 font-medium">{t.waves.colPower}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {display.map((e) => (
              <tr key={e.time} className="hover:bg-gray-50 transition-colors">
                <td className="py-1.5 text-gray-600 text-xs">{formatTime(e.time)}</td>
                <td className="py-1.5 text-right font-semibold text-ocean-700">
                  {e.waveHeight != null ? `${e.waveHeight.toFixed(1)}m` : '—'}
                </td>
                <td className="py-1.5 text-right text-gray-700">
                  {e.wavePeriod != null ? `${e.wavePeriod.toFixed(0)}s` : '—'}
                </td>
                <td className="py-1.5 text-right text-gray-600">
                  {e.waveDir != null ? degToCompass(e.waveDir) : '—'}
                </td>
                <td className="py-1.5 text-right">
                  {e.swellHeight != null && e.swellPeriod != null
                    ? (() => { const { kw, className } = wavePower(e.swellHeight, e.swellPeriod); return <span className={className}>{kw.toFixed(1)}</span>; })()
                    : <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
