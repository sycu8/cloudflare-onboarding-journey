import type { Language } from '../i18n/types';

/** Sync html lang, document title, and meta description from data-* on <html> */
export function applyPageLang(lang: Language) {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang;

  const title = lang === 'en' ? root.dataset.seoTitleEn : root.dataset.seoTitleVi;
  if (title) document.title = title;

  const desc = lang === 'en' ? root.dataset.seoDescEn : root.dataset.seoDescVi;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && desc) meta.setAttribute('content', desc);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && desc) ogDesc.setAttribute('content', desc);
}
