# Surf Forecast — CLAUDE.md

## Project Overview
A surf forecast web app that also ships as an Android APK via Capacitor.
- Map of global surf spots (React-Leaflet + OpenStreetMap)
- Wave/wind forecasts from Open-Meteo (free, no API key)
- Tide predictions from NOAA CO-OPS (free, public domain)
- Packaged for Android via Capacitor WebView wrapper

## Tech Stack
- **React 18 + TypeScript** via Vite 4
- **Tailwind CSS** for styling
- **React-Leaflet** for the interactive map
- **TanStack Query (React Query) v5** for data fetching and caching
- **Capacitor v5** for Android APK

## Dev Commands

> **Note:** This machine has Node.js v16 via VS only. Use PowerShell or add the VS Node dir to PATH:
> `C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs`
>
> If you have Node 18+ installed globally, use `npm run` commands normally.

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run android` | Build + sync + open Android Studio |
| `npx cap sync` | Copy `dist/` to android and update plugins |
| `npx cap open android` | Open in Android Studio |

## Project Structure
```
src/
├── api/
│   ├── openMeteo.ts   # Open-Meteo marine + wind fetchers
│   └── noaa.ts        # NOAA tide predictions fetcher
├── components/
│   ├── Map/
│   │   ├── SurfMap.tsx       # Leaflet map container
│   │   └── SpotMarker.tsx    # Individual spot markers
│   ├── Forecast/
│   │   ├── ForecastPanel.tsx # Root panel (wave + wind + tide)
│   │   ├── WaveCard.tsx      # Wave height/period/direction table
│   │   ├── WindCard.tsx      # Wind speed/direction/gusts table
│   │   └── TideCard.tsx      # High/low tide timeline
│   └── SpotSearch.tsx        # Search bar with autocomplete
├── hooks/
│   ├── useMarineData.ts  # TanStack Query for Open-Meteo
│   └── useTideData.ts    # TanStack Query for NOAA
├── types/
│   └── index.ts          # Spot, MarineData, TideData types
├── App.tsx               # Layout + spot selection state
└── main.tsx
public/
└── spots.json            # 25 curated global surf spots
```

## Key Data Sources
- **Open-Meteo Marine API** — `marine-api.open-meteo.com/v1/marine` — wave height/period/direction
- **Open-Meteo Weather API** — `api.open-meteo.com/v1/forecast` — wind speed/direction/gusts
- **NOAA CO-OPS** — `api.tidesandcurrents.noaa.gov/api/prod/datagetter` — tide predictions (where available)

## Adding Surf Spots
Edit `public/spots.json`. Fields:
- `id` (string, kebab-case)
- `name`, `country` (strings)
- `lat`, `lng` (numbers)
- `noaa_station` (string NOAA station ID, or `null` if unavailable)

## Android Build
Requires Android Studio + Android SDK.
```bash
npm run build       # produce dist/
npx cap sync        # copy dist/ into android/ + update plugins
npx cap open android  # open Android Studio
```
