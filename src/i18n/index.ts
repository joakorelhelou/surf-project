import { en } from './en';
import { es } from './es';

export type Lang = 'en' | 'es';
export type Dictionary = typeof en;

const stored = localStorage.getItem('lang') as Lang | null;
export const currentLang: Lang = stored ?? 'es';
export const t: Dictionary = currentLang === 'en' ? en : (es as unknown as Dictionary);

export function setLang(lang: Lang): void {
  localStorage.setItem('lang', lang);
  window.location.reload();
}

/** Returns the translated score label for the current language. */
export function getScoreLabel(score: number): string {
  if (score >= 75) return t.conditions.excellent;
  if (score >= 55) return t.conditions.good;
  if (score >= 35) return t.conditions.fair;
  return t.conditions.poor;
}
