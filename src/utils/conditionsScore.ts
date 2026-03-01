export interface ConditionsInput {
  waveHeight: number;      // metres — total wave height (used for display + quality ratio)
  swellHeight: number;     // metres — swell component (used for power calc)
  swellPeriod: number;     // seconds
  swellDirection: number;  // degrees FROM (meteorological convention)
  windSpeed: number;       // km/h
  windDirection: number;   // degrees FROM (meteorological convention)
  shoreDirection: number;  // degrees the break faces toward the ocean
}

/** Angular difference between two bearings, normalized to [0, 180] */
function angularDiff(a: number, b: number): number {
  let diff = Math.abs((a - b + 360) % 360);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(v: number, inLo: number, inHi: number, outLo: number, outHi: number): number {
  return outLo + ((v - inLo) / (inHi - inLo)) * (outHi - outLo);
}

/**
 * Wave power score (0–100).
 * Power proxy = swellHeight² × swellPeriod (proportional to true energy flux kW/m).
 * Sweet spot: P ≈ 25–60 (e.g. 1.8 m @ 14 s = 45, 2 m @ 14 s = 56).
 * Scores high for solid, organised groundswell; falls off for weak or dangerously large surf.
 */
function scoreSwellPower(swellHeight: number, swellPeriod: number): number {
  const p = swellHeight * swellHeight * swellPeriod;
  if (p < 1)   return 0;
  if (p < 4)   return clamp(lerp(p,   1,   4,  0,  25),  0,  25);
  if (p < 12)  return clamp(lerp(p,   4,  12, 25,  60), 25,  60);
  if (p < 30)  return clamp(lerp(p,  12,  30, 60,  85), 60,  85);
  if (p < 60)  return clamp(lerp(p,  30,  60, 85, 100), 85, 100);
  if (p < 120) return clamp(lerp(p,  60, 120, 100, 70), 70, 100);
  if (p < 200) return clamp(lerp(p, 120, 200,  70, 25), 25,  70);
  return 10;
}

/**
 * Swell direction score (0–100).
 * Highest when swell comes directly from the direction the shore faces.
 * Uses cosine similarity: straight-on = 100, side-shore = 50, backwash = 0.
 */
function scoreSwellDirection(swellDirection: number, shoreDirection: number): number {
  const diff = angularDiff(swellDirection, shoreDirection);
  return ((Math.cos((diff * Math.PI) / 180) + 1) / 2) * 100;
}

/** Swell quality score (0–100). Higher swell/wave ratio = cleaner, more organised ocean. */
function scoreSwellQuality(swellHeight: number, waveHeight: number): number {
  if (waveHeight <= 0) return 0;
  return clamp((swellHeight / waveHeight) * 100, 0, 100);
}

/** Wind speed score (0–100). Lighter = better. Speed in km/h. */
function scoreWindSpeed(speed: number): number {
  if (speed < 8)  return 100;
  if (speed < 16) return clamp(lerp(speed,  8, 16, 100, 80), 80, 100);
  if (speed < 24) return clamp(lerp(speed, 16, 24,  80, 55), 55,  80);
  if (speed < 32) return clamp(lerp(speed, 24, 32,  55, 30), 30,  55);
  if (speed < 40) return clamp(lerp(speed, 32, 40,  30, 10), 10,  30);
  return 0;
}

/**
 * Offshore wind score (0–100).
 * Wind is offshore when it blows FROM the land side (opposite of shore_direction).
 * Cosine similarity: offshore = 100, cross-shore = 50, onshore = 0.
 */
function scoreOffshoreAngle(windDirection: number, shoreDirection: number): number {
  const offshoreWindFrom = (shoreDirection + 180) % 360;
  const diff = angularDiff(windDirection, offshoreWindFrom);
  return ((Math.cos((diff * Math.PI) / 180) + 1) / 2) * 100;
}

/**
 * Returns a conditions quality score from 0 to 100.
 *
 * Weights:
 *   Wave power (H²×T)       35% — combines height and period into one energy metric
 *   Swell direction          15% — how directly the swell hits this break
 *   Swell quality            10% — swell vs total wave ratio (cleanliness)
 *   Wind speed               20% — lighter is better
 *   Wind direction (offshore) 20% — offshore grooming vs onshore chop
 */
export function scoreConditions(input: ConditionsInput): number {
  const { waveHeight, swellHeight, swellPeriod, swellDirection, windSpeed, windDirection, shoreDirection } = input;

  const s = {
    swellPower:   scoreSwellPower(swellHeight, swellPeriod),
    swellDir:     scoreSwellDirection(swellDirection, shoreDirection),
    swellQuality: scoreSwellQuality(swellHeight, waveHeight),
    windSpeed:    scoreWindSpeed(windSpeed),
    offshore:     scoreOffshoreAngle(windDirection, shoreDirection),
  };

  // Fix 2: offshore direction only matters when wind is strong enough to affect the surface.
  // At glassy conditions the direction is irrelevant; scale linearly from neutral (50) at
  // calm up to the real score at 20+ km/h.
  const windEffect = clamp(windSpeed / 20, 0, 1);
  const effectiveOffshore = s.offshore * windEffect + 50 * (1 - windEffect);

  const raw = Math.round(
    s.swellPower   * 0.35 +
    s.swellDir     * 0.15 +
    s.swellQuality * 0.10 +
    s.windSpeed    * 0.20 +
    effectiveOffshore * 0.20
  );

  // Fix 1: flat day floor — negligible swell means nothing to surf regardless of wind.
  if (swellHeight < 0.3) return Math.min(raw, 10);

  return raw;
}

/** Generates a 2–3 sentence plain-English explanation for a set of conditions. */
export function describeConditions(input: ConditionsInput): string {
  const { waveHeight, swellHeight, swellPeriod, swellDirection, windSpeed, windDirection, shoreDirection } = input;

  // --- Wave sentence ---
  const heightDesc =
    waveHeight < 0.3 ? 'flat'
    : waveHeight < 0.6 ? `very small at ${waveHeight.toFixed(1)} m`
    : waveHeight < 1.0 ? `small at ${waveHeight.toFixed(1)} m`
    : waveHeight < 1.5 ? `chest-high at ${waveHeight.toFixed(1)} m`
    : waveHeight < 2.5 ? `solid at ${waveHeight.toFixed(1)} m`
    : waveHeight < 4.0 ? `large at ${waveHeight.toFixed(1)} m`
    : `very large at ${waveHeight.toFixed(1)} m`;

  const periodDesc =
    swellPeriod < 6  ? 'choppy with little power'
    : swellPeriod < 8  ? `a short ${swellPeriod.toFixed(0)}-second period (wind swell)`
    : swellPeriod < 10 ? `a moderate ${swellPeriod.toFixed(0)}-second period`
    : swellPeriod < 12 ? `a good ${swellPeriod.toFixed(0)}-second period`
    : swellPeriod < 14 ? `a long ${swellPeriod.toFixed(0)}-second groundswell period`
    : `an excellent ${swellPeriod.toFixed(0)}-second groundswell period`;

  const qualityRatio = waveHeight > 0 ? swellHeight / waveHeight : 0;
  const qualityDesc =
    qualityRatio > 0.7 ? ', mostly clean and organised'
    : qualityRatio > 0.4 ? ', a decent mix of swell and chop'
    : waveHeight > 0.3 ? ', mostly choppy with little organised swell'
    : '';

  const swellDirScore = scoreSwellDirection(swellDirection, shoreDirection);
  const swellDirDesc =
    swellDirScore > 85 ? '' // don't mention when perfect
    : swellDirScore > 65 ? ' The swell angle is slightly off but still rideable.'
    : swellDirScore > 40 ? ' The swell is arriving at a significant angle, reducing wave quality at this break.'
    : ' The swell is mostly side-shore — poor angle for this break.';

  const waveSentence =
    waveHeight < 0.3
      ? 'The ocean is essentially flat with no surfable waves.'
      : `Waves are ${heightDesc} with ${periodDesc}${qualityDesc}.${swellDirDesc}`;

  // --- Wind sentence ---
  const offshoreScore = scoreOffshoreAngle(windDirection, shoreDirection);
  const windDirDesc =
    offshoreScore > 70 ? 'blowing offshore, grooming the wave faces'
    : offshoreScore > 50 ? 'cross-shore — not ideal but manageable'
    : offshoreScore > 30 ? 'partly onshore, roughening the surface'
    : 'onshore, blowing into the waves and making them messy';

  const windSentence =
    windSpeed < 8
      ? 'The surface is glassy — perfect wind conditions.'
      : `Wind is ${windSpeed.toFixed(0)} km/h and ${windDirDesc}.`;

  // --- Summary sentence: identify the biggest drag on the score ---
  const swellDirScoreVal = scoreSwellDirection(swellDirection, shoreDirection);
  // Mirror fix 2: dampen offshore contribution when wind is calm (glassy)
  const windEffect = clamp(windSpeed / 20, 0, 1);
  const effectiveOffshoreRatio = (offshoreScore * windEffect + 50 * (1 - windEffect)) / 100;
  const weighted = [
    { name: 'wave power',      ratio: scoreSwellPower(swellHeight, swellPeriod)   / 100 },
    { name: 'swell direction', ratio: swellDirScoreVal                             / 100 },
    { name: 'swell quality',   ratio: scoreSwellQuality(swellHeight, waveHeight)  / 100 },
    { name: 'wind speed',      ratio: scoreWindSpeed(windSpeed)                   / 100 },
    { name: 'wind direction',  ratio: effectiveOffshoreRatio                               },
  ];

  const worst = weighted.reduce((a, b) => (a.ratio < b.ratio ? a : b));
  const best  = weighted.reduce((a, b) => (a.ratio > b.ratio ? a : b));
  const total = scoreConditions(input);

  const summarySentence =
    total >= 75 ? `Overall excellent conditions — ${best.name} is the standout highlight.`
    : total >= 55 ? `A decent session is on offer, though ${worst.name} is holding the score back.`
    : total >= 35 ? `Fair at best — ${worst.name} is the main limiting factor right now.`
    : `Poor conditions, mainly due to ${worst.name}.`;

  return `${waveSentence} ${windSentence} ${summarySentence}`;
}

export function scoreLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 55) return 'Good';
  if (score >= 35) return 'Fair';
  return 'Poor';
}

/** Returns a Tailwind text + bg color pair for the score. */
export function scoreColor(score: number): { bar: string; text: string } {
  if (score >= 75) return { bar: 'bg-emerald-500', text: 'text-emerald-700' };
  if (score >= 55) return { bar: 'bg-green-400',   text: 'text-green-700'   };
  if (score >= 35) return { bar: 'bg-yellow-400',  text: 'text-yellow-700'  };
  return { bar: 'bg-red-400', text: 'text-red-600' };
}
