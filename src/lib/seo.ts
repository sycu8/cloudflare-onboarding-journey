import { assetUrl } from './assets';

/** Shared SEO defaults — page-level title/description passed via BaseLayout */
export const siteSeo = {
  name: 'Cloudflare Starter Hub',
  origin: 'https://onboarding.orangecloud.vn',
  themeColor: '#F6821F',
  twitterHandle: '@cloudflare',
  defaultImage: assetUrl('og-image.svg'),
  locale: 'vi_VN',
  localeAlternate: 'en_US',
} as const;

export type PageSeo = {
  title: { vi: string; en: string };
  description: { vi: string; en: string };
};

export function formatTitle(pageTitle: string, siteName = siteSeo.name) {
  return `${pageTitle} · ${siteName}`;
}
