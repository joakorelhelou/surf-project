export const en = {
  brand: '🏄 Surf Forecast',
  locale: 'en-US' as const,
  search: {
    placeholder: 'Search surf spots…',
  },
  conditions: {
    title: 'Conditions (7 days)',
    bestWindows: 'Best windows',
    today: 'Today',
    tomorrow: 'Tomorrow',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  },
  waves: {
    title: 'Waves (7 days)',
    colTime: 'Time',
    colHeight: 'Height',
    colPeriod: 'Period',
    colDirection: 'Direction',
    colPower: 'Power (kW/m)',
  },
  wind: {
    title: 'Wind (7 days)',
    colTime: 'Time',
    colSpeed: 'Speed (km/h)',
    colGust: 'Gust',
    colDir: 'Dir',
  },
  tides: {
    title: 'Tides (48h)',
    high: 'High Tide',
    low: 'Low Tide',
    unavailable: 'Tide data unavailable for this location (no NOAA station).',
  },
  forecast: {
    closeLabel: 'Close forecast',
  },
  howItWorks: {
    triggerLabel: 'How the score works',
    title: 'How the Score Works',
    subtitle: 'Understanding surf conditions at a glance',
    intro1: 'Every hour we combine five ocean and weather signals into a single number from',
    introBold1: '0 to 100%',
    intro2: '. Higher means better surfing conditions. The',
    introBold2: 'Best Windows',
    intro3: 'banner at the top of the forecast instantly shows you the top time slots to paddle out.',
    scoreLegend: 'Score legend',
    footer:
      'Data comes from the Open-Meteo Marine & Weather APIs. Forecasts are updated every few hours. The score is a guide — local knowledge, tides, and crowd levels always matter too.',
    labels: [
      { label: 'Excellent', desc: 'Go surf — conditions are firing.' },
      { label: 'Good',      desc: 'Solid session, minor compromises.' },
      { label: 'Fair',      desc: 'Rideable but not ideal.' },
      { label: 'Poor',      desc: 'Flat, blown-out, or too big.' },
    ],
    factors: [
      {
        title: 'Wave Power',
        description: 'Energy of the swell — height² × period',
        detail:
          'This is the single most important factor. It combines swell height and period into one energy number: H² × T (proportional to actual wave power in kW/m). A 1.8 m wave at 14 s carries roughly 45 units of power — excellent surf. A 0.5 m wave at 8 s carries only 2 units — barely surfable. The score peaks at a "sweet spot" of solid, organised groundswell (roughly 1.5–3 m at 12–18 s) and falls off for dangerously large surf.',
      },
      {
        title: 'Swell Direction',
        description: 'How directly the swell hits the break',
        detail:
          'Even a powerful swell is useless if it arrives from the wrong direction. Each spot has a known orientation — the compass bearing the break faces toward the ocean. The score is highest when the swell travels straight toward that bearing (head-on = 100%) and drops smoothly as the angle increases. A swell running side-shore scores around 50%; one going in the opposite direction scores near 0%.',
      },
      {
        title: 'Swell Quality',
        description: 'How organised the ocean energy is',
        detail:
          'Not all wave height is useful. This factor measures how much of the total wave height comes from the organised swell versus local wind chop. A high ratio means the water surface is smooth and the waves are predictable. When the ocean is dominated by disorganised chop (from strong local winds), this score drops even if the waves look big.',
      },
      {
        title: 'Wind Speed',
        description: 'Strength of the wind',
        detail:
          'Light winds (under 8 km/h) leave the surface glassy and score 100. As wind picks up, it roughens the water and blows spray off the wave faces. Over 40 km/h the surface becomes messy and the score drops to zero.',
      },
      {
        title: 'Wind Direction',
        description: 'Whether wind grooms or ruins the waves',
        detail:
          'Offshore wind blows from the land out to sea — it grooms wave faces and holds them up, giving clean barrels. Onshore wind blows the other way, collapsing waves before they break properly. This factor carries 20% weight because direction is just as important as speed — a strong offshore wind is often better than a light onshore one. Each spot has a known shore orientation so the app can tell which is which.',
      },
    ],
  },
};
