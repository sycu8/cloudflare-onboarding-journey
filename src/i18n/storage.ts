import type { Language } from './types';

export const LANGUAGE_STORAGE_KEY = 'cfhub_language' as const;

const VALID: Language[] = ['vi', 'en', 'km'];

export function normalizeLanguage(value: unknown): Language {
  if (typeof value === 'string' && VALID.includes(value as Language)) {
    return value as Language;
  }
  return 'vi';
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'vi';
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return 'vi';
  }
}

export function setStoredLanguage(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export const LANGUAGE_CYCLE: Language[] = ['vi', 'en', 'km'];

export function nextLanguage(current: Language): Language {
  const idx = LANGUAGE_CYCLE.indexOf(current);
  return LANGUAGE_CYCLE[(idx + 1) % LANGUAGE_CYCLE.length] ?? 'vi';
}

export function languageLabel(lang: Language): string {
  if (lang === 'en') return 'EN';
  if (lang === 'km') return 'KM';
  return 'VI';
}

export function languageSwitchAria(current: Language): string {
  const next = nextLanguage(current);
  if (next === 'en') return 'Switch to English';
  if (next === 'km') return 'Switch to Khmer';
  return 'Switch to Vietnamese';
}
