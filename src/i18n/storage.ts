import type { Language } from './types';

export const LANGUAGE_STORAGE_KEY = 'cfhub_language' as const;

export function normalizeLanguage(value: unknown): Language {
  return value === 'en' ? 'en' : 'vi';
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

