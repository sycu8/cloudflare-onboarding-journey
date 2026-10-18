import { assetUrl } from './assets';

/** Shared SEO defaults — page-level title/description passed via BaseLayout */
export const siteSeo = {
  name: 'Cloudflare Starter Hub',
  origin: 'https://onboarding.orangecloud.vn',
  themeColor: '#F6821F',
  defaultImage: assetUrl('og-image.svg'),
  locale: 'vi_VN',
  localeAlternate: 'en_US',
} as const;

/**
 * Person node on the apex. Referenced by @id only.
 * Do not add worksFor, jobTitle, or any Cloudflare role — employment stays in visible text on orangecloud.vn.
 */
export const personId = 'https://orangecloud.vn/#person';

export function websiteId(origin: string | URL): string {
  return new URL('/#website', origin).href;
}

/**
 * Match astro.config `trailingSlash: 'always'` without slashing files such as `/auth.md`.
 * `404.html` is not a directory index: Pages serves it at `/404` (no slash).
 */
export function canonicalPathname(path: string): string {
  const raw = path || '/';
  if (raw === '/404' || raw === '/404/' || raw === '/404.html') return '/404';
  if (raw.endsWith('/') || /\.[a-z0-9]+$/i.test(raw)) return raw;
  return `${raw}/`;
}

export function canonicalUrl(path: string, origin: string | URL): URL {
  return new URL(canonicalPathname(path), origin);
}

export function websiteJsonLd(origin: string | URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(origin),
    name: 'OrangeCloud Onboarding',
    url: new URL('/', origin).href,
    inLanguage: 'vi',
    description:
      'Vietnamese learning hub for Cloudflare: learning paths, product explainers, checklists and FAQs. Personal project maintained by Cường Lê Sỹ. Not a publication of Cloudflare, Inc.',
    author: { '@id': personId },
    publisher: { '@id': personId },
  };
}

export type PageSeo = {
  title: { vi: string; en: string; km?: string };
  description: { vi: string; en: string; km?: string };
};

export function formatTitle(pageTitle: string, siteName = siteSeo.name) {
  return `${pageTitle} · ${siteName}`;
}
