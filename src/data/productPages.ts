import type { LocalizedString } from '../i18n/types';
import {
  cf101Categories,
  cf101Foundations,
  docsUrl,
  type Cf101Product,
} from './cloudflare101';
import { glossary, type GlossaryTerm } from './glossary';

export type ProductSource = 'cf101' | 'glossary' | 'both';
export type ProductTrack = 'application-services' | 'developer-platform' | 'cloudflare-one';

export type ProductNewbieDetail = {
  whatIs: LocalizedString;
  whyItMatters: LocalizedString;
  whenToUse: { vi: string[]; en: string[] };
  simpleExample: LocalizedString;
  commonConfusion?: LocalizedString;
};

export type ProductPage = {
  slug: string;
  name: LocalizedString;
  summary: LocalizedString;
  categoryId: string;
  categoryLabel: LocalizedString;
  source: ProductSource;
  docsPath?: string;
  docsUrl?: string;
  relatedTrack: ProductTrack;
  glossaryTerm?: string;
  detail: ProductNewbieDetail;
  diagramSlugs: string[];
  relatedProductSlugs: string[];
};

/** Glossary display term → URL slug (cf101 id or glossary-only slug). */
export const glossaryTermToSlug: Record<string, string> = {
  DNS: 'dns',
  Proxy: 'proxy',
  Edge: 'edge',
  Origin: 'origin',
  CDN: 'cdn',
  Cache: 'cache',
  WAF: 'waf',
  DDoS: 'ddos',
  Bot: 'bots',
  'Rate limiting': 'rate-limiting',
  'API security': 'api-security',
  Worker: 'workers',
  Pages: 'pages',
  KV: 'kv',
  D1: 'd1',
  R2: 'r2',
  'Durable Objects': 'durable-objects',
  'Workers AI': 'workers-ai',
  'AI Gateway': 'ai-gateway',
  Vectorize: 'vectorize',
  'Zero Trust': 'zero-trust',
  ZTNA: 'ztna',
  SWG: 'swg',
  CASB: 'casb',
  DLP: 'dlp',
  SASE: 'sase',
  'Cloudflare WAN': 'cloudflare-wan',
  Turnstile: 'turnstile',
  'Web Analytics': 'web-analytics',
  Hyperdrive: 'hyperdrive',
  'Cloudflare Tunnel': 'tunnel',
  Workflows: 'workflows',
  Agents: 'agents',
};

const foundationsLabel: LocalizedString = {
  vi: 'Nền tảng',
  en: 'Foundations',
};

/** Diagram slug → product slugs (seeded from official ref-arch concept tags). */
const diagramProductSlugs: Record<string, string[]> = {
  'ai-composable': ['workers-ai', 'ai-gateway', 'agents'],
  'ai-rag': ['workers-ai', 'vectorize', 'ai-search'],
  'bot-management': ['bots', 'waf', 'rate-limiting'],
  'fullstack-application': ['workers', 'pages', 'd1', 'r2', 'kv', 'durable-objects'],
  'serverless-global-apis': ['workers', 'd1', 'r2'],
  'distributed-web-performance-architecture': ['cache', 'cdn', 'speed'],
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2': ['images', 'r2', 'cache'],
  'secure-access-to-saas-applications-with-sase': ['access', 'gateway', 'sase', 'zero-trust'],
  'augment-access-with-serverless': ['access', 'workers', 'ztna'],
  'cloudflare-one-appliance-deployment': ['warp', 'gateway'],
  'securing-data-in-transit': ['gateway', 'dlp', 'casb', 'ssl'],
  'securing-data-at-rest': ['casb', 'dlp'],
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit': ['ddos', 'cloudflare-wan'],
  'storing-user-generated-content': ['r2', 'workers'],
};

const glossaryOnlyProducts: Omit<ProductPage, 'detail' | 'diagramSlugs' | 'relatedProductSlugs'>[] = [
  {
    slug: 'cdn',
    name: { vi: 'CDN', en: 'CDN' },
    summary: {
      vi: 'Mạng phân phối nội dung — phục vụ file gần người dùng để site nhanh hơn và origin nhẹ hơn.',
      en: 'Content delivery network — serves files close to users so sites feel faster and origins stay lighter.',
    },
    categoryId: 'delivery',
    categoryLabel: { vi: 'Delivery & Performance', en: 'Delivery & Performance' },
    source: 'glossary',
    docsPath: '/learning-paths/cdn/concepts/how-cdn-works/',
    relatedTrack: 'application-services',
    glossaryTerm: 'CDN',
  },
  {
    slug: 'rate-limiting',
    name: { vi: 'Rate limiting', en: 'Rate limiting' },
    summary: {
      vi: 'Giới hạn số request theo thời gian — chặn abuse và bảo vệ API/origin khỏi bị quá tải.',
      en: 'Caps requests per time window — stops abuse and protects APIs/origins from overload.',
    },
    categoryId: 'app-security',
    categoryLabel: { vi: 'Application Security', en: 'Application Security' },
    source: 'glossary',
    docsPath: '/waf/rate-limiting-rules/',
    relatedTrack: 'application-services',
    glossaryTerm: 'Rate limiting',
  },
  {
    slug: 'api-security',
    name: { vi: 'API security', en: 'API security' },
    summary: {
      vi: 'Tập hợp kiểm soát bảo vệ API: xác thực, rate limit, schema validation, bot management, logging.',
      en: 'Controls that protect APIs: auth, rate limits, schema validation, bot management, logging.',
    },
    categoryId: 'app-security',
    categoryLabel: { vi: 'Application Security', en: 'Application Security' },
    source: 'glossary',
    docsPath: '/api-shield/',
    relatedTrack: 'application-services',
    glossaryTerm: 'API security',
  },
  {
    slug: 'zero-trust',
    name: { vi: 'Zero Trust', en: 'Zero Trust' },
    summary: {
      vi: 'Không tin mặc định — mỗi truy cập phải được xác minh theo identity, thiết bị và policy.',
      en: 'Never trust by default — every access is verified by identity, device, and policy.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/learning-paths/zero-trust/concepts/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'Zero Trust',
  },
  {
    slug: 'ztna',
    name: { vi: 'ZTNA', en: 'ZTNA' },
    summary: {
      vi: 'Zero Trust Network Access — truy cập app nội bộ theo policy thay vì mở toàn bộ mạng như VPN.',
      en: 'Zero Trust Network Access — policy-based private app access instead of full-network VPN.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/learning-paths/zero-trust/concepts/what-is-ztna/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'ZTNA',
  },
  {
    slug: 'swg',
    name: { vi: 'SWG (Secure Web Gateway)', en: 'SWG (Secure Web Gateway)' },
    summary: {
      vi: 'Bảo vệ người dùng khi duyệt Internet — lọc DNS/HTTP, chặn malware và áp policy.',
      en: 'Protects users browsing the Internet — DNS/HTTP filtering, malware blocking, and policy.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/cloudflare-one/policies/gateway/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'SWG',
  },
  {
    slug: 'casb',
    name: { vi: 'CASB', en: 'CASB' },
    summary: {
      vi: 'Cloud Access Security Broker — phát hiện và kiểm soát rủi ro khi dùng SaaS.',
      en: 'Cloud Access Security Broker — discover and control risks across SaaS apps.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/cloudflare-one/casb/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'CASB',
  },
  {
    slug: 'dlp',
    name: { vi: 'DLP', en: 'DLP' },
    summary: {
      vi: 'Data Loss Prevention — giảm rủi ro rò rỉ dữ liệu nhạy cảm qua web, email hoặc SaaS.',
      en: 'Data Loss Prevention — reduces sensitive data leakage via web, email, or SaaS.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/cloudflare-one/policies/data-loss-prevention/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'DLP',
  },
  {
    slug: 'sase',
    name: { vi: 'SASE', en: 'SASE' },
    summary: {
      vi: 'Secure Access Service Edge — kết hợp networking + Zero Trust để bảo vệ user và kết nối tới app/data.',
      en: 'Secure Access Service Edge — networking + Zero Trust to protect users and reach apps/data.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/learning-paths/sase-network-security/concepts/what-is-sase/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'SASE',
  },
  {
    slug: 'cloudflare-wan',
    name: { vi: 'Cloudflare WAN', en: 'Cloudflare WAN' },
    summary: {
      vi: 'Kết nối WAN hiện đại trên mạng Cloudflare — routing + security thay cho MPLS truyền thống.',
      en: 'Modern WAN on Cloudflare’s network — routing + security instead of legacy MPLS alone.',
    },
    categoryId: 'cloudflare-one',
    categoryLabel: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    source: 'glossary',
    docsPath: '/magic-wan/',
    relatedTrack: 'cloudflare-one',
    glossaryTerm: 'Cloudflare WAN',
  },
  {
    slug: 'web-analytics',
    name: { vi: 'Web Analytics', en: 'Web Analytics' },
    summary: {
      vi: 'Analytics nhẹ cho website — đo traffic và hiệu năng mà không cần script nặng trên browser.',
      en: 'Lightweight site analytics — measure traffic and performance without heavy browser scripts.',
    },
    categoryId: 'delivery',
    categoryLabel: { vi: 'Delivery & Performance', en: 'Delivery & Performance' },
    source: 'glossary',
    docsPath: '/web-analytics/',
    relatedTrack: 'developer-platform',
    glossaryTerm: 'Web Analytics',
  },
];

const relatedByCategory: Record<string, string[]> = {
  foundations: ['dns', 'proxy', 'edge', 'origin'],
  compute: ['workers', 'pages', 'durable-objects'],
  ai: ['workers-ai', 'vectorize', 'ai-gateway'],
  storage: ['r2', 'd1', 'kv'],
  media: ['images', 'stream'],
  'app-security': ['waf', 'ddos', 'bots', 'turnstile'],
  'cloudflare-one': ['access', 'tunnel', 'gateway', 'zero-trust'],
  delivery: ['cache', 'cdn', 'speed'],
};

function glossaryBySlug(): Map<string, GlossaryTerm> {
  const map = new Map<string, GlossaryTerm>();
  for (const t of glossary) {
    const slug = glossaryTermToSlug[t.term];
    if (slug) map.set(slug, t);
  }
  return map;
}

function buildDiagramIndex(): Map<string, string[]> {
  const index = new Map<string, string[]>();
  const add = (productSlug: string, diagramSlug: string) => {
    const list = index.get(productSlug) ?? [];
    if (!list.includes(diagramSlug)) list.push(diagramSlug);
    index.set(productSlug, list);
  };
  for (const [diagramSlug, products] of Object.entries(diagramProductSlugs)) {
    for (const p of products) add(p, diagramSlug);
  }
  return index;
}

function buildDetail(
  name: LocalizedString,
  summary: LocalizedString,
  categoryId: string,
  glossaryDef?: LocalizedString,
): ProductNewbieDetail {
  const label = name.en;
  const whatIs: LocalizedString = glossaryDef
    ? {
        vi: `${glossaryDef.vi} ${summary.vi}`,
        en: `${glossaryDef.en} ${summary.en}`,
      }
    : {
        vi: `${name.vi} là một phần của hệ sinh thái Cloudflare. ${summary.vi}`,
        en: `${name.en} is part of the Cloudflare ecosystem. ${summary.en}`,
      };

  const categoryWhy: Record<string, LocalizedString> = {
    foundations: {
      vi: 'Nắm bốn khái niệm này giúp bạn đọc mọi tài liệu Cloudflare mà không bị lạc giữa DNS, proxy, edge và origin.',
      en: 'These four ideas help you read any Cloudflare doc without getting lost between DNS, proxy, edge, and origin.',
    },
    compute: {
      vi: 'Bạn chạy code gần user mà không tự quản server — phù hợp API, automation và logic tại edge.',
      en: 'Run code close to users without managing servers — great for APIs, automation, and edge logic.',
    },
    ai: {
      vi: 'Thêm AI vào app mà không tự host GPU — inference và RAG chạy trên mạng Cloudflare.',
      en: 'Add AI to apps without hosting GPUs — inference and RAG run on Cloudflare’s network.',
    },
    storage: {
      vi: 'Lưu file, config và SQL nhỏ gọn — gắn trực tiếp vào Workers/Pages qua binding.',
      en: 'Store files, config, and small SQL — bind directly to Workers/Pages.',
    },
    media: {
      vi: 'Ảnh và video nặng làm chậm origin — Cloudflare tối ưu và phát trực tiếp từ edge.',
      en: 'Heavy images and video slow origins — Cloudflare optimizes and delivers from the edge.',
    },
    'app-security': {
      vi: 'Website/API công khai luôn bị quét tấn công — lớp bảo vệ tại proxy chặn sớm trước app của bạn.',
      en: 'Public sites/APIs are constantly probed — proxy-layer protection blocks threats before your app.',
    },
    'cloudflare-one': {
      vi: 'Nhân viên làm việc từ mọi nơi — Zero Trust thay VPN “mở toàn mạng” bằng truy cập theo policy.',
      en: 'People work from anywhere — Zero Trust replaces “full network” VPN with policy-based access.',
    },
    delivery: {
      vi: 'User cảm nhận tốc độ ngay từ lần tải đầu — cache và tối ưu delivery giảm tải origin.',
      en: 'Users feel speed on first load — caching and delivery optimizations reduce origin load.',
    },
  };

  const whenTemplates: Record<string, { vi: string[]; en: string[] }> = {
    foundations: {
      vi: [
        'Khi đọc tài liệu Cloudflare và gặp từ edge, origin, proxy',
        'Trước khi bật orange cloud hoặc deploy Workers',
        'Khi debug “request đi đâu trước khi tới server?”',
      ],
      en: [
        'When reading Cloudflare docs and seeing edge, origin, or proxy',
        'Before enabling the orange cloud or deploying Workers',
        'When debugging “where does the request go before my server?”',
      ],
    },
    default: {
      vi: [
        `Khi bạn cần giải pháp ${label} trên Cloudflare thay vì tự host`,
        'Khi team mới bắt đầu và muốn bản free/low-ops để thử',
        'Khi tài liệu chính thức gợi ý sản phẩm này cho use case của bạn',
      ],
      en: [
        `When you need ${label} on Cloudflare instead of self-hosting`,
        'When your team is starting out and wants a low-ops free tier to experiment',
        'When official docs recommend this product for your use case',
      ],
    },
  };

  const whyKey = categoryId in categoryWhy ? categoryId : 'foundations';
  const whenKey = categoryId in whenTemplates ? categoryId : 'default';

  return {
    whatIs,
    whyItMatters: categoryWhy[whyKey] ?? categoryWhy.foundations,
    whenToUse: whenTemplates[whenKey] ?? whenTemplates.default,
    simpleExample: {
      vi: `Ví dụ: một team SME bật ${name.vi} cho website onboarding — họ thấy lợi ích ngay mà chưa cần kiến trúc phức tạp.`,
      en: `Example: an SME team enables ${name.en} for an onboarding site — they see value quickly without a complex architecture.`,
    },
    commonConfusion: {
      vi: `Đừng nhầm ${name.vi} với toàn bộ nền tảng Cloudflare — đây là một mảnh ghép; kết hợp với DNS/proxy và sản phẩm liên quan.`,
      en: `Don’t confuse ${name.en} with the entire Cloudflare platform — it’s one piece; combine it with DNS/proxy and related products.`,
    },
  };
}

function fromCf101(
  product: Cf101Product,
  categoryId: string,
  categoryLabel: LocalizedString,
  glossaryMap: Map<string, GlossaryTerm>,
  diagramIndex: Map<string, string[]>,
): ProductPage {
  const g = glossaryMap.get(product.id);
  const source: ProductSource = g ? 'both' : 'cf101';
  const summary = g
    ? { vi: `${g.definition.vi} ${product.summary.vi}`, en: `${g.definition.en} ${product.summary.en}` }
    : product.summary;

  return {
    slug: product.id,
    name: product.name,
    summary,
    categoryId,
    categoryLabel,
    source,
    docsPath: product.docsPath,
    docsUrl: docsUrl(product.docsPath),
    relatedTrack: g?.relatedTrack ?? trackForCategory(categoryId),
    glossaryTerm: g?.term,
    detail: buildDetail(product.name, product.summary, categoryId, g?.definition),
    diagramSlugs: diagramIndex.get(product.id) ?? [],
    relatedProductSlugs: (relatedByCategory[categoryId] ?? []).filter((s) => s !== product.id).slice(0, 4),
  };
}

function trackForCategory(categoryId: string): ProductTrack {
  if (categoryId === 'cloudflare-one') return 'cloudflare-one';
  if (categoryId === 'compute' || categoryId === 'ai' || categoryId === 'storage') return 'developer-platform';
  return 'application-services';
}

function buildRegistry(): ProductPage[] {
  const glossaryMap = glossaryBySlug();
  const diagramIndex = buildDiagramIndex();
  const bySlug = new Map<string, ProductPage>();

  for (const p of cf101Foundations) {
    bySlug.set(p.id, fromCf101(p, 'foundations', foundationsLabel, glossaryMap, diagramIndex));
  }
  for (const cat of cf101Categories) {
    for (const p of cat.products) {
      bySlug.set(p.id, fromCf101(p, cat.id, cat.title, glossaryMap, diagramIndex));
    }
  }
  for (const partial of glossaryOnlyProducts) {
    const g = glossaryMap.get(partial.slug);
    bySlug.set(partial.slug, {
      ...partial,
      docsUrl: docsUrl(partial.docsPath),
      detail: buildDetail(partial.name, partial.summary, partial.categoryId, g?.definition),
      diagramSlugs: diagramIndex.get(partial.slug) ?? [],
      relatedProductSlugs: (relatedByCategory[partial.categoryId] ?? [])
        .filter((s) => s !== partial.slug)
        .slice(0, 4),
    });
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.en.localeCompare(b.name.en));
}

export const productPages: ProductPage[] = buildRegistry();

export function getProductBySlug(slug: string): ProductPage | undefined {
  return productPages.find((p) => p.slug === slug);
}

export function getProductSlugForGlossaryTerm(term: string): string | undefined {
  return glossaryTermToSlug[term];
}

export function getProductsByCategory(categoryId: string): ProductPage[] {
  return productPages.filter((p) => p.categoryId === categoryId);
}

export const productCategoryOrder: { id: string; label: LocalizedString }[] = [
  { id: 'foundations', label: foundationsLabel },
  ...cf101Categories.map((c) => ({ id: c.id, label: c.title })),
];
