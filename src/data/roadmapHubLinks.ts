import type { LocalizedString } from '../i18n/types';

/** Friendly labels for hub routes used in role roadmaps and content topics. */
export const roadmapHubLinks: Record<string, LocalizedString> = {
  '/start-here/': { vi: 'Bắt đầu tại đây', en: 'Start here' },
  '/cloudflare-101/': { vi: 'Cloudflare 101', en: 'Cloudflare 101' },
  '/content-roadmap/': { vi: 'Lộ trình nội dung', en: 'Content Roadmap' },
  '/first-week/': { vi: 'Lộ trình 7 ngày', en: '7-day path' },
  '/choose-your-path/': { vi: 'Chọn lộ trình', en: 'Choose your path' },
  '/tracks/': { vi: 'Lộ trình học', en: 'Learning tracks' },
  '/tracks/application-services/': { vi: 'Application Services', en: 'Application Services' },
  '/tracks/developer-platform/': { vi: 'Developer Platform', en: 'Developer Platform' },
  '/tracks/cloudflare-one/': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  '/use-cases/': { vi: 'Use cases', en: 'Use cases' },
  '/use-cases/application-services/': { vi: 'Use cases — Application Services', en: 'Use cases — Application Services' },
  '/use-cases/developer-platform/': { vi: 'Use cases — Developer Platform', en: 'Use cases — Developer Platform' },
  '/use-cases/cloudflare-one/': { vi: 'Use cases — Cloudflare One', en: 'Use cases — Cloudflare One' },
  '/use-cases/protect-website/': { vi: 'Bảo vệ website', en: 'Protect website' },
  '/use-cases/secure-api/': { vi: 'Bảo mật API', en: 'Secure API' },
  '/use-cases/build-serverless-app/': { vi: 'Build serverless app', en: 'Build serverless app' },
  '/use-cases/replace-vpn/': { vi: 'Thay VPN', en: 'Replace VPN' },
  '/use-cases/secure-remote-users/': { vi: 'Bảo mật remote users', en: 'Secure remote users' },
  '/use-cases/secure-saas-access/': { vi: 'Truy cập SaaS an toàn', en: 'Secure SaaS access' },
  '/products/': { vi: 'Sản phẩm', en: 'Products' },
  '/glossary/': { vi: 'Thuật ngữ', en: 'Glossary' },
  '/plans/': { vi: 'So sánh gói', en: 'Plans' },
  '/demo-guides/': { vi: 'Demo guides', en: 'Demo guides' },
  '/quiz/beginner-readiness/': { vi: 'Quiz beginner', en: 'Beginner quiz' },
  '/resources/': { vi: 'Tài nguyên', en: 'Resources' },
  '/resources#cloudflare-resources': { vi: 'Cloudflare Resources catalog', en: 'Cloudflare Resources catalog' },
  '/checklists/beginner-cloudflare-checklist/': { vi: 'Checklist beginner', en: 'Beginner checklist' },
};

export function getHubLinkLabel(href: string): LocalizedString {
  const normalized = href.endsWith('/') || href.includes('#') ? href : `${href}/`;
  return roadmapHubLinks[normalized] ?? roadmapHubLinks[href] ?? { vi: href, en: href };
}
