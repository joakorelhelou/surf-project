export interface Spot {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  noaa_station: string | null;
  shore_direction: number; // compass bearing (°) the break faces toward the ocean
}

export interface HourlyMarine {
  time: string[];
  wave_height: number[];
  wave_period: number[];
  wave_direction: number[];
  swell_wave_height: number[];
  swell_wave_period: number[];
  swell_wave_direction: number[];
}

export interface HourlyWind {
  time: string[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
}

export interface MarineData {
  hourly: HourlyMarine;
  wind: HourlyWind;
}

export interface TidePrediction {
  t: string; // timestamp "YYYY-MM-DD HH:mm"
  v: string; // value in feet
  type: 'H' | 'L';
}

export interface TideData {
  predictions: TidePrediction[];
}
