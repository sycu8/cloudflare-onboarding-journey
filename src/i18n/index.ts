import type { Language, LocalizedString, PageMeta } from './types';
import { en } from './en';
import { km } from './km';
import { vi } from './vi';

export type Dictionary = typeof vi;

export const dictionaries: Record<Language, Dictionary> = {
  vi,
  en: en as unknown as Dictionary,
  km: km as unknown as Dictionary,
};

export function pickLocalizedText(text: LocalizedString, lang: Language): string {
  if (lang === 'en') return text.en;
  if (lang === 'km') return text.km ?? text.en;
  return text.vi;
}

export function pickPageMeta(text: PageMeta, lang: Language): string {
  if (lang === 'en') return text.en;
  if (lang === 'km') return text.km ?? text.en;
  return text.vi;
}
