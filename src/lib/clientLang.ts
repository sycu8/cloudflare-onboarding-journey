import { pickLocalizedText } from '../i18n';
import { normalizeLanguage } from '../i18n/storage';
import type { Language, LocalizedString } from '../i18n/types';

export function getDocumentLang(): Language {
  if (typeof document === 'undefined') return 'vi';
  return normalizeLanguage(document.documentElement.dataset.lang);
}

export function localized(ls: LocalizedString, lang?: Language): string {
  return pickLocalizedText(ls, lang ?? getDocumentLang());
}

export function langLocale(lang: Language): string {
  if (lang === 'en') return 'en-US';
  if (lang === 'km') return 'km-KH';
  return 'vi-VN';
}

export function trilingual(
  vi: string,
  en: string,
  km?: string,
  lang?: Language,
): string {
  const l = lang ?? getDocumentLang();
  if (l === 'en') return en;
  if (l === 'km') return km ?? en;
  return vi;
}
