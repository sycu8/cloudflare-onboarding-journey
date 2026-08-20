import type { LocalizedString } from '../i18n/types';
import raw from './zeroTrustOnboarding.data.json';

export const ZT_ONBOARDING_SOURCE = raw.source;
export const ZT_ONBOARDING_IMPORTED_AT = raw.importedAt;
export const ZT_ONBOARDING_ATTRIBUTION = raw.attribution;

export type OnboardingPage = {
  page: string;
  href: string;
  sourceUrl: string;
  sourceUrlVi: string;
  titleEn: string;
  titleVi: string;
  ledeEn: string;
  ledeVi: string;
  htmlEn: string;
  htmlVi: string;
  viFromSource: boolean;
};

export const onboardingPages = raw.pages as OnboardingPage[];

const byHref = new Map(onboardingPages.map((p) => [p.href, p]));
const byPage = new Map(onboardingPages.map((p) => [p.page, p]));

export function getOnboardingPageByHref(href: string): OnboardingPage | undefined {
  return byHref.get(href);
}

export function getOnboardingPageByFile(page: string): OnboardingPage | undefined {
  return byPage.get(page);
}

const LESSON_PAGE_ALIASES: Record<string, string> = {
  'c1-2-l2': 'module-2-identity-provider.html',
  'c1-4-l2': 'module-4-ztna-access.html',
  'c1-4-l3': 'module-4b-connectors.html',
  'c1-6-l2': 'module-6-dlp.html',
  'c1-8-l2': 'module-8-magic-wan.html',
};

export function getOnboardingPageForLesson(lessonId: string): OnboardingPage | undefined {
  const aliased = LESSON_PAGE_ALIASES[lessonId];
  if (aliased) return getOnboardingPageByFile(aliased);
  return getOnboardingPageByHref(`/tracks/cloudflare-one/${lessonId}`);
}

export function onboardingTitle(page: OnboardingPage): LocalizedString {
  return {
    vi: page.titleVi || page.titleEn,
    en: page.titleEn,
  };
}

export function onboardingLede(page: OnboardingPage): LocalizedString {
  return {
    vi: page.ledeVi || page.ledeEn,
    en: page.ledeEn,
  };
}

export function onboardingHtml(page: OnboardingPage): LocalizedString {
  return {
    vi: page.htmlVi || page.htmlEn,
    en: page.htmlEn,
  };
}

export type SourceDiagram = {
  id: string;
  src: { vi: string; en: string };
  alt: LocalizedString;
  caption: LocalizedString;
  pageUrl: string;
};

const IMG = '/images/tracks/cloudflare-one';

export const cloudflareOneSourceDiagrams: SourceDiagram[] = [
  {
    id: 'architecture',
    src: { vi: `${IMG}/architecture.vi.svg`, en: `${IMG}/architecture.svg` },
    alt: {
      vi: 'Kiến trúc tham chiếu Cloudflare Zero Trust đầy đủ: mặt phẳng quản trị và quan sát phía trên; nguồn và on-ramp bên trái đi qua lớp bảo mật SASE của Cloudflare (danh tính và posture, Access/ZTNA, Gateway SWG, Shadow IT, Browser Isolation, DLP, kiểm soát AI/MCP/AI Gateway, kiểm soát egress, Magic Firewall) tới đích bên phải; và làn Agentic Internet chiều vào phía dưới cho kiểm soát AI crawler.',
      en: 'Cloudflare Zero Trust complete reference architecture: a management and observability plane on top; sources and on-ramps on the left connecting through Cloudflare’s SASE security stack (identity & posture, Access/ZTNA, Gateway SWG, Shadow IT, Browser Isolation, DLP, AI controls/MCP/AI Gateway, egress control, Magic Firewall) to destinations on the right; and an inbound Agentic Internet lane for AI crawler control at the bottom.',
    },
    caption: {
      vi: 'Kiến trúc tham chiếu đầy đủ — mặt phẳng quản trị (trên), xương sống Zero Trust chiều ra (giữa), và làn Agentic Internet chiều vào (dưới). Huy hiệu gắn từng khối với module tương ứng.',
      en: 'Complete reference architecture — management plane (top), outbound Zero Trust spine (middle), and the inbound Agentic Internet lane (bottom). Badges map each element to its module.',
    },
    pageUrl: '/tracks/cloudflare-one/c1-1-l1',
  },
  {
    id: 'workflow',
    src: { vi: `${IMG}/workflow.vi.svg`, en: `${IMG}/workflow.svg` },
    alt: {
      vi: 'Quy trình onboarding Cloudflare Zero Trust qua sáu phase — Nền tảng, Thiết bị, Access, Lọc web, Dữ liệu và AI, Mạng — kết thúc bằng Go-live.',
      en: 'Cloudflare Zero Trust onboarding workflow across six phases — Foundation, Devices, Access, Web filtering, Data & AI, Network — ending in Go-live.',
    },
    caption: {
      vi: 'Quy trình onboarding — sáu phase từ nền tảng tài khoản đến kết nối mạng, rồi go-live. Mọi phase: pilot → validate → expand.',
      en: 'Onboarding workflow — six phases from account foundation to network connectivity, then go-live. At every phase: pilot → validate → expand.',
    },
    pageUrl: '/tracks/cloudflare-one/c1-1-l1',
  },
  {
    id: 'aisecurity',
    src: { vi: `${IMG}/aisecurity.vi.svg`, en: `${IMG}/aisecurity.svg` },
    alt: {
      vi: 'Bảo mật AI và MCP defense-in-depth: user và AI agent đi qua bốn lớp — khám phá shadow AI, kiểm soát AI app, bảo vệ prompt bằng DLP, quản trị MCP agent — trước khi tới AI model và MCP server.',
      en: 'Cloudflare AI and MCP security defense-in-depth: users and AI agents pass through four layers — discover shadow AI, control AI apps, protect prompts with DLP, govern MCP agents — before reaching AI models and MCP servers.',
    },
    caption: {
      vi: 'Bảo mật AI và MCP — bốn lớp defense-in-depth giữa user/agent và nhà cung cấp AI, cộng AI Security for Apps (WAF) cho AI mà bạn xây.',
      en: 'AI & MCP security — four defense-in-depth layers between users/agents and AI providers, plus AI Security for Apps (WAF) for the AI you build.',
    },
    pageUrl: '/tracks/cloudflare-one/c1-1-l1',
  },
];
