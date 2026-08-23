import { pickPageMeta } from '../i18n';
import type { Language } from '../i18n/types';

/** Sync html lang, document title, and meta description from data-* on <html> */
export function applyPageLang(lang: Language) {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang;

  const titleVi = root.dataset.seoTitleVi ?? '';
  const titleEn = root.dataset.seoTitleEn ?? '';
  const titleKm = root.dataset.seoTitleKm ?? titleEn;
  const title = pickPageMeta({ vi: titleVi, en: titleEn, km: titleKm }, lang);
  if (title) document.title = title;

  const descVi = root.dataset.seoDescVi ?? '';
  const descEn = root.dataset.seoDescEn ?? '';
  const descKm = root.dataset.seoDescKm ?? descEn;
  const desc = pickPageMeta({ vi: descVi, en: descEn, km: descKm }, lang);
  const meta = document.querySelector('meta[name="description"]');
  if (meta && desc) meta.setAttribute('content', desc);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && desc) ogDesc.setAttribute('content', desc);
}
