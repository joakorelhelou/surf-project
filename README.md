# Surf Forecast

A surf forecasting app that shows real-time wave, wind, and tide data for the world's best surf spots. Available as a **Progressive Web App** and as a native **Android app** (via Capacitor).

---

## Features

- **Interactive world map** — browse 37 iconic surf spots across all continents
- **Geolocation** — map automatically centers on your current location at startup
- **Conditions score** — per-hour surf quality rating (0–100%) combining swell power, swell direction, wind speed, and offshore angle
- **7-day wave forecast** — height, period, direction, and wave power (kW/m) for every 3 hours of daylight
- **7-day wind forecast** — speed, gusts, and direction with compass rose indicators
- **Tide chart** — high/low tide times for spots with a NOAA buoy station
- **Spot search** — fuzzy search bar to jump to any spot instantly
- **"How it Works" modal** — explains the scoring algorithm to the user

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Map | React-Leaflet + OpenStreetMap (no API key required) |
| Marine & weather data | [Open-Meteo](https://open-meteo.com/) (free, no API key) |
| Tide data | [NOAA CO-OPS API](https://tidesandcurrents.noaa.gov/api/) (free, no API key) |
| Data fetching | TanStack Query (React Query v5) |
| Native app wrapper | Capacitor 5 |
| Android geolocation | `@capacitor/geolocation` |

> All external APIs are **free and require no authentication**.

---

## Project Structure

```
surf-project/
├── public/
│   └── spots.json          # Spot database (37 world-class breaks)
├── src/
│   ├── api/
│   │   ├── openMeteo.ts    # Marine + wind data fetching
│   │   └── noaa.ts         # Tide data fetching
│   ├── components/
│   │   ├── Forecast/
│   │   │   ├── ConditionsCard.tsx  # Hourly score with best windows
│   │   │   ├── WaveCard.tsx        # 7-day wave table
│   │   │   ├── WindCard.tsx        # 7-day wind table
│   │   │   ├── TideCard.tsx        # High/low tide chart
│   │   │   └── ForecastPanel.tsx   # Side panel container
│   │   ├── Map/
│   │   │   ├── SurfMap.tsx         # Leaflet map + geolocation
│   │   │   └── SpotMarker.tsx      # Custom map markers
│   │   ├── SpotSearch.tsx          # Search bar
│   │   └── HowItWorksModal.tsx     # Scoring explainer modal
│   ├── hooks/
│   │   ├── useMarineData.ts        # React Query hook for wave+wind
│   │   └── useTideData.ts          # React Query hook for tides
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── conditionsScore.ts      # Surf quality scoring algorithm
│   └── App.tsx
├── android/                        # Capacitor Android project
├── capacitor.config.ts
├── vite.config.ts
└── tailwind.config.ts
```

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

For Android builds only:
- **Java JDK** 17 (required by Gradle)
- **Android SDK** with Build Tools 32+ and Platform 33+ (install via Android Studio or `sdkmanager`)
- **Android Studio** (optional, for opening the project and running on emulator)

---

## Web App — Development

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev
```

## Web App — Production Build

```bash
npm run build
# Output is in dist/
```

To preview the production build locally:
```bash
npm run preview
```

---

## Android App — Build & Deploy

### 1. Build the web assets and sync to Android

```bash
npm run build
npx cap sync android
```

### 2. Open in Android Studio (recommended for first-time setup)

```bash
npx cap open android
```

From Android Studio you can:
- Run on a connected device or emulator
- Generate a signed APK/AAB for release

### 3. Build a debug APK from the command line

```bash
# From the android/ directory
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Android Permissions

The app requests the following permissions (declared in `AndroidManifest.xml`):

| Permission | Reason |
|---|---|
| `INTERNET` | Fetch wave, wind, and tide data from public APIs |
| `ACCESS_FINE_LOCATION` | Center the map on the user's GPS location |
| `ACCESS_COARSE_LOCATION` | Fallback for network-based location |

Location permission is requested at runtime when the app first opens the map.

---

## Adding a New Surf Spot

Edit [public/spots.json](public/spots.json) and add an entry:

```json
{
  "id": "unique-kebab-case-id",
  "name": "Spot Display Name",
  "country": "Country or Region",
  "lat": 0.0000,
  "lng": 0.0000,
  "noaa_station": null,
  "shore_direction": 270
}
```

- `noaa_station`: set to a [NOAA CO-OPS station ID](https://tidesandcurrents.noaa.gov/stations.html) if there is one nearby, otherwise `null` (tide card will show "unavailable")
- `shore_direction`: compass bearing (°) that the break faces **toward the ocean** — used by the conditions scoring algorithm to determine offshore vs. onshore wind

---

## Conditions Scoring Algorithm

Each hourly slot receives a **0–100% surf quality score** computed from:

| Factor | Weight | Notes |
|---|---|---|
| Swell power (height × period) | 35% | Peaks around 2–3 m / 14 s groundswell |
| Swell direction | 15% | How directly the swell hits the break's shore angle |
| Swell quality | 10% | Ratio of swell height to total wave height |
| Wind speed | 20% | Glassy < 8 km/h scores highest; > 25 km/h scores 0 |
| Offshore wind angle | 20% | Offshore (wind blowing out to sea) scores highest; dampened when wind is calm to avoid penalizing glassy days |

**Flat-day floor:** if swell height < 0.3 m the score is capped at 10 regardless of wind.

Score labels: **Excellent** ≥ 75 · **Good** ≥ 55 · **Fair** ≥ 35 · **Poor** < 35

See [src/utils/conditionsScore.ts](src/utils/conditionsScore.ts) for the full implementation.

---

## License

MIT
