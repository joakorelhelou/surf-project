import { useState } from 'react';
import type { HourlyMarine, HourlyWind } from '../../types';
import {
  scoreConditions,
  scoreColor,
  describeConditions,
  describeConditionsEs,
  type ConditionsInput,
} from '../../utils/conditionsScore';
import { t, currentLang, getScoreLabel } from '../../i18n';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(t.locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

function timeOnly(iso: string): string {
  return new Date(iso).toLocaleString(t.locale, { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return t.conditions.today;
  if (d.toDateString() === tomorrow.toDateString()) return t.conditions.tomorrow;
  return d.toLocaleString(t.locale, { weekday: 'long', month: 'short', day: 'numeric' });
}

function dayKey(iso: string): string {
  return new Date(iso).toDateString();
}

interface ConditionsCardProps {
  hourly: HourlyMarine;
  wind: HourlyWind;
  shoreDirection: number;
}

interface Entry {
  time: string;
  score: number;
  input: ConditionsInput;
}

export default function ConditionsCard({ hourly, wind, shoreDirection }: ConditionsCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const entries: Entry[] = hourly.time.map((time, i) => {
    const input: ConditionsInput = {
      waveHeight:     hourly.wave_height[i]          ?? 0,
      swellHeight:    hourly.swell_wave_height[i]    ?? 0,
      swellPeriod:    hourly.swell_wave_period[i]    ?? 0,
      swellDirection: hourly.swell_wave_direction[i] ?? 0,
      windSpeed:      wind.wind_speed_10m[i]         ?? 0,
      windDirection:  wind.wind_direction_10m[i]     ?? 0,
      shoreDirection,
    };
    return { time, score: scoreConditions(input), input };
  });

  // Every-3-hour display entries, daylight hours only (06:00–21:00)
  const display = entries.filter((e, i) => {
    if (i % 3 !== 0) return false;
    const hour = new Date(e.time).getHours();
    return hour >= 6 && hour <= 21;
  });

  // Best windows: top 5 slots by score (min 35), sorted by time for display
  const bestWindows = [...display]
    .filter((e) => e.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Group display entries by calendar day
  const grouped: { label: string; key: string; entries: (Entry & { displayIdx: number })[] }[] = [];
  display.forEach((e, displayIdx) => {
    const key = dayKey(e.time);
    const last = grouped[grouped.length - 1];
    if (!last || last.key !== key) {
      grouped.push({ label: dayLabel(e.time), key, entries: [{ ...e, displayIdx }] });
    } else {
      last.entries.push({ ...e, displayIdx });
    }
  });

  function handleRowClick(displayIdx: number) {
    setSelectedIdx(selectedIdx === displayIdx ? null : displayIdx);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>⭐</span> {t.conditions.title}
      </h3>

      {/* Best windows summary */}
      {bestWindows.length > 0 && (
        <div className="mb-4 p-3 bg-ocean-50 rounded-xl border border-ocean-100">
          <p className="text-xs font-semibold text-ocean-700 mb-2 uppercase tracking-wide">{t.conditions.bestWindows}</p>
          <div className="flex flex-wrap gap-2">
            {bestWindows.map((e) => {
              const { bar, text } = scoreColor(e.score);
              return (
                <div key={e.time} className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${bar}`} />
                  <span className="text-xs text-gray-600">{formatTime(e.time)}</span>
                  <span className={`text-xs font-bold tabular-nums ${text}`}>{e.score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly rows grouped by day */}
      <div className="space-y-4">
        {grouped.map((day) => (
          <div key={day.key}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 px-2">
              {day.label}
            </div>
            <div className="space-y-1">
              {day.entries.map(({ displayIdx, ...e }) => {
                const { bar, text } = scoreColor(e.score);
                const label = getScoreLabel(e.score);
                const isOpen = selectedIdx === displayIdx;

                return (
                  <div key={e.time}>
                    <button
                      onClick={() => handleRowClick(displayIdx)}
                      className={`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 transition-colors text-left ${
                        isOpen ? 'bg-gray-50' : 'hover:bg-gray-50'
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span className="w-14 shrink-0 text-xs text-gray-500">{timeOnly(e.time)}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${bar}`}
                          style={{ width: `${e.score}%` }}
                        />
                      </div>
                      <span className={`w-8 text-right font-semibold tabular-nums ${text}`}>
                        {e.score}%
                      </span>
                      <span className={`w-16 text-xs font-medium ${text}`}>{label}</span>
                      <span className="text-gray-300 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
                    </button>

                    {isOpen && (
                      <div className="mx-2 mb-2 mt-0.5 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {currentLang === 'es' ? describeConditionsEs(e.input) : describeConditions(e.input)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
