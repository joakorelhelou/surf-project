import type { HourlyWind } from '../../types';

function degToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

function windEmoji(speed: number): string {
  if (speed < 8) return '🌤️';
  if (speed < 24) return '🌬️';
  if (speed < 40) return '💨';
  return '🌀';
}

interface WindCardProps {
  wind: HourlyWind;
}

export default function WindCard({ wind }: WindCardProps) {
  const entries = wind.time.map((t, i) => ({
    time: t,
    speed: wind.wind_speed_10m[i],
    dir: wind.wind_direction_10m[i],
    gust: wind.wind_gusts_10m[i],
  }));

  const display = entries.filter((e, i) => {
    if (i % 3 !== 0) return false;
    const hour = new Date(e.time).getHours();
    return hour >= 6 && hour <= 21;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>💨</span> Wind (7 days)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">Time</th>
              <th className="text-right pb-2 font-medium">Speed (km/h)</th>
              <th className="text-right pb-2 font-medium">Gust</th>
              <th className="text-right pb-2 font-medium">Direction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {display.map((e) => (
              <tr key={e.time} className="hover:bg-gray-50 transition-colors">
                <td className="py-1.5 text-gray-600 text-xs">{formatTime(e.time)}</td>
                <td className="py-1.5 text-right">
                  <span className="mr-1">{windEmoji(e.speed ?? 0)}</span>
                  <span className="font-semibold text-gray-800">
                    {e.speed != null ? e.speed.toFixed(0) : '—'}
                  </span>
                </td>
                <td className="py-1.5 text-right text-gray-600">
                  {e.gust != null ? `${e.gust.toFixed(0)} km/h` : '—'}
                </td>
                <td className="py-1.5 text-right text-gray-600">
                  {e.dir != null ? degToCompass(e.dir) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
