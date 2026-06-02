import type { Language, LocalizedString } from './types';
import { en } from './en';
import { vi } from './vi';

export type Dictionary = typeof vi;

export const dictionaries: Record<Language, Dictionary> = {
  vi,
  en: en as unknown as Dictionary,
};

export function pickLocalizedText(text: LocalizedString, lang: Language) {
  return lang === 'en' ? text.en : text.vi;
}

