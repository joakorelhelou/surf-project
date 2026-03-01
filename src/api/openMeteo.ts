import type { MarineData, HourlyMarine, HourlyWind } from '../types';

const MARINE_BASE = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast';

async function fetchMarine(lat: number, lng: number): Promise<HourlyMarine> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    hourly: 'wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${MARINE_BASE}?${params}`);
  if (!res.ok) throw new Error(`Marine API error: ${res.status}`);
  const json = await res.json();
  return json.hourly as HourlyMarine;
}

async function fetchWind(lat: number, lng: number): Promise<HourlyWind> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    hourly: 'wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${WEATHER_BASE}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const json = await res.json();
  return json.hourly as HourlyWind;
}

export async function fetchMarineData(lat: number, lng: number): Promise<MarineData> {
  const [hourly, wind] = await Promise.all([
    fetchMarine(lat, lng),
    fetchWind(lat, lng),
  ]);
  return { hourly, wind };
}
