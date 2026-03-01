import type { TideData } from '../types';

const NOAA_BASE = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

function todayString(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}${mm}${dd}`;
}

export async function fetchTideData(stationId: string): Promise<TideData> {
  const params = new URLSearchParams({
    station: stationId,
    product: 'predictions',
    datum: 'MLLW',
    time_zone: 'lst_ldt',
    interval: 'hilo',
    units: 'english',
    format: 'json',
    begin_date: todayString(),
    range: '48',
  });

  const res = await fetch(`${NOAA_BASE}?${params}`);
  if (!res.ok) throw new Error(`NOAA API error: ${res.status}`);
  const json = await res.json();

  if (json.error) throw new Error(json.error.message ?? 'NOAA error');
  return { predictions: json.predictions };
}
