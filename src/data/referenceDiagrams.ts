import type { LocalizedString } from '../i18n/types';
import rawData from './referenceDiagrams.data.json';

export const REF_ARCH_DIAGRAMS_URL = 'https://developers.cloudflare.com/reference-architecture/diagrams/';
export const REF_ARCH_DIAGRAMS_LLMS_URL = 'https://developers.cloudflare.com/reference-architecture/llms.txt';
export const DIAGRAMS_LAST_SYNCED = '2026-06-02';

export type DiagramCategory =
  | 'ai'
  | 'bots'
  | 'content-delivery'
  | 'iot'
  | 'network'
  | 'sase'
  | 'security'
  | 'serverless'
  | 'storage';

export type DiagramTrack =
  | 'application-services'
  | 'developer-platform'
  | 'cloudflare-one'
  | 'cross-cutting';

type RawDiagram = (typeof rawData)[number];

export type ReferenceDiagram = {
  slug: string;
  category: DiagramCategory;
  categoryLabel: LocalizedString;
  title: LocalizedString;
  summary: LocalizedString;
  concepts: string[];
  pageUrl: string;
  images: { url: string; alt: LocalizedString }[];
  primaryImageUrl: string;
  relatedTrack: DiagramTrack;
  featured?: boolean;
};

export const diagramCategoryLabels: Record<DiagramCategory, LocalizedString> = {
  ai: { vi: 'AI', en: 'Artificial Intelligence (AI)' },
  bots: { vi: 'Bots', en: 'Bots' },
  'content-delivery': { vi: 'Content delivery', en: 'Content Delivery' },
  iot: { vi: 'IoT', en: 'Internet of Things (IoT)' },
  network: { vi: 'Network', en: 'Network' },
  sase: { vi: 'SASE / Cloudflare One', en: 'Secure Access Service Edge (SASE)' },
  security: { vi: 'Security', en: 'Security' },
  serverless: { vi: 'Serverless', en: 'Serverless' },
  storage: { vi: 'Storage', en: 'Storage' },
};

const categoryTrack: Record<DiagramCategory, DiagramTrack> = {
  ai: 'developer-platform',
  bots: 'application-services',
  'content-delivery': 'application-services',
  iot: 'cross-cutting',
  network: 'application-services',
  sase: 'cloudflare-one',
  security: 'cross-cutting',
  serverless: 'developer-platform',
  storage: 'developer-platform',
};

/** Key terms validated against official diagram pages (developers.cloudflare.com). */
const conceptOverlay: Record<string, string[]> = {
  'ai-rag': ['RAG', 'Vectorize', 'Workers AI', 'Knowledge seeding', 'Embeddings'],
  'ai-composable': ['Workers AI', 'AI Gateway', 'External LLM', 'Composable stack'],
  'bot-management': ['Bot score', 'Super Bot Fight Mode', 'WAF', 'Rate limiting'],
  'distributed-web-performance-architecture': ['CDN', 'Cache', 'Core Web Vitals', 'Smart Shield', 'Argo'],
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2': [
    'Image Resizing',
    'R2',
    'Transformations',
    'Cache',
  ],
  'fullstack-application': ['Workers', 'Pages', 'D1', 'R2', 'KV', 'Durable Objects'],
  'serverless-global-apis': ['Workers', 'D1', 'R2', 'Global API', 'Edge compute'],
  'secure-access-to-saas-applications-with-sase': ['SASE', 'Gateway', 'Access', 'Device posture', 'SaaS'],
  'augment-access-with-serverless': ['Access', 'External Evaluation', 'Workers', 'ZTNA'],
  'cloudflare-one-appliance-deployment': ['Cloudflare One Client', 'WARP', 'MDM', 'On-prem appliance'],
  'securing-data-in-transit': ['Gateway', 'DLP', 'TLS', 'CASB', 'Inline inspection'],
  'securing-data-at-rest': ['CASB', 'SaaS API', 'Data at rest', 'DLP'],
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit': ['Magic Transit', 'DDoS', 'Anycast', 'Hybrid cloud'],
  'storing-user-generated-content': ['R2', 'Workers', 'UGC', 'Object storage'],
};

const viSummaryOverlay: Record<string, string> = {
  'ai-rag':
    'RAG kết hợp retrieval (Vectorize/KV) với Workers AI để chatbot trả lời chính xác hơn — seeding knowledge và query path tách biệt.',
  'bot-management':
    'Luồng phát hiện, chấm điểm và xử lý bot traffic trên edge — nền tảng cho WAF, rate limit và Bot Management.',
  'distributed-web-performance-architecture':
    'Pattern L7: data flow, cache tiers, deployment models — giảm latency và cải thiện Core Web Vitals.',
  'fullstack-application':
    'Ví dụ fullstack trên Developer Platform — Workers/Pages, storage và AI services trong một kiến trúc thực tế.',
  'secure-access-to-saas-applications-with-sase':
    'Zero Trust cho SaaS: policy theo identity, device posture và network context qua Cloudflare One.',
  'securing-data-in-transit':
    'Bảo vệ data in transit với Gateway/DLP — inspect TLS traffic trước khi tới SaaS hoặc Internet.',
};

const featuredSlugs = new Set([
  'fullstack-application',
  'ai-rag',
  'bot-management',
  'distributed-web-performance-architecture',
  'secure-access-to-saas-applications-with-sase',
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  'serverless-global-apis',
  'augment-access-with-serverless',
]);

function toDiagram(raw: RawDiagram): ReferenceDiagram {
  const category = raw.category as DiagramCategory;
  const images = raw.images.map((img) => ({
    url: img.url,
    alt: { vi: img.alt || raw.title, en: img.alt || raw.title },
  }));
  const viSummary = viSummaryOverlay[raw.slug];
  return {
    slug: raw.slug,
    category,
    categoryLabel: diagramCategoryLabels[category] ?? { vi: category, en: category },
    title: { vi: raw.title, en: raw.title },
    summary: {
      vi: viSummary ?? raw.desc,
      en: raw.desc,
    },
    concepts: conceptOverlay[raw.slug] ?? [],
    pageUrl: raw.pageUrl,
    images,
    primaryImageUrl: images[0]?.url ?? '',
    relatedTrack: categoryTrack[category] ?? 'cross-cutting',
    featured: featuredSlugs.has(raw.slug),
  };
}

export const referenceDiagrams: ReferenceDiagram[] = rawData.map(toDiagram);

export const hubPageDiagramSlugs: Record<string, string[]> = {
  '/start-here': [
    'bot-management',
    'fullstack-application',
    'secure-access-to-saas-applications-with-sase',
  ],
  '/content-delivery': [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
  '/cloudflare-101': ['ai-composable', 'bot-management', 'fullstack-application'],
};

export const trackDiagramSlugs: Record<
  Exclude<DiagramTrack, 'cross-cutting'>,
  string[]
> = {
  'application-services': [
    'distributed-web-performance-architecture',
    'bot-management',
    'securing-data-in-transit',
  ],
  'developer-platform': ['fullstack-application', 'ai-rag', 'serverless-global-apis'],
  'cloudflare-one': [
    'secure-access-to-saas-applications-with-sase',
    'augment-access-with-serverless',
    'cloudflare-one-appliance-deployment',
  ],
};

export const useCaseDiagramSlugs: Record<string, string[]> = {
  'protect-website': ['bot-management', 'distributed-web-performance-architecture'],
  'secure-api': ['securing-data-in-transit', 'bot-management'],
  'build-serverless-app': ['fullstack-application', 'serverless-global-apis'],
  'replace-vpn': [
    'secure-access-to-saas-applications-with-sase',
    'sase-clientless-access-private-dns',
  ],
  'secure-remote-users': [
    'cloudflare-one-appliance-deployment',
    'zero-trust-and-virtual-desktop-infrastructure',
  ],
  'defend-ddos-attacks': ['bot-management', 'distributed-web-performance-architecture'],
  'deploy-static-site': ['fullstack-application', 'serverless-global-apis'],
  'secure-saas-access': [
    'secure-access-to-saas-applications-with-sase',
    'sase-clientless-access-private-dns',
  ],
};

/** Map Reference Architecture hub card slug → diagram slug (when paths differ). */
export const refArchItemDiagramSlug: Record<string, string> = {
  'fullstack-workers': 'fullstack-application',
  'ai-rag': 'ai-rag',
  'serverless-global-apis': 'serverless-global-apis',
  'bot-management': 'bot-management',
  'distributed-web-performance': 'distributed-web-performance-architecture',
  'saas-access-sase': 'secure-access-to-saas-applications-with-sase',
  'r2-egress-free': 'egress-free-storage-multi-cloud',
  cdn: 'distributed-web-performance-architecture',
  sase: 'secure-access-to-saas-applications-with-sase',
};

export function getDiagramBySlug(slug: string): ReferenceDiagram | undefined {
  return referenceDiagrams.find((d) => d.slug === slug);
}

export function getDiagramForRefArchItem(itemSlug: string): ReferenceDiagram | undefined {
  const diagramSlug = refArchItemDiagramSlug[itemSlug];
  if (diagramSlug) return getDiagramBySlug(diagramSlug);
  return referenceDiagrams.find((d) => d.slug === itemSlug);
}

export function getDiagramsByCategory(category: DiagramCategory): ReferenceDiagram[] {
  return referenceDiagrams.filter((d) => d.category === category);
}

export function getFeaturedDiagrams(limit = 8): ReferenceDiagram[] {
  return referenceDiagrams.filter((d) => d.featured).slice(0, limit);
}

export function getDiagramsForTrack(
  track: Exclude<DiagramTrack, 'cross-cutting'>,
  limit = 3,
): ReferenceDiagram[] {
  return trackDiagramSlugs[track]
    .map((slug) => getDiagramBySlug(slug))
    .filter((d): d is ReferenceDiagram => !!d)
    .slice(0, limit);
}

export function getDiagramsForHubPage(path: string): ReferenceDiagram[] {
  const slugs = hubPageDiagramSlugs[path] ?? [];
  return slugs.map((s) => getDiagramBySlug(s)).filter((d): d is ReferenceDiagram => !!d);
}

export function getDiagramsForUseCase(useCaseSlug: string): ReferenceDiagram[] {
  const slugs = useCaseDiagramSlugs[useCaseSlug] ?? [];
  return slugs.map((s) => getDiagramBySlug(s)).filter((d): d is ReferenceDiagram => !!d);
}

/** Diagrams whose official concept tags mention this product (see productPages diagramProductSlugs). */
export function getDiagramsForProduct(productSlug: string, limit = 2): ReferenceDiagram[] {
  const matches: ReferenceDiagram[] = [];
  for (const d of referenceDiagrams) {
    const tagged = diagramProductSlugsFromConcepts(d.slug);
    if (tagged.includes(productSlug)) matches.push(d);
  }
  if (matches.length > 0) return matches.slice(0, limit);
  return referenceDiagrams
    .filter((d) => d.slug.includes(productSlug.replace(/-/g, '')) || d.concepts.some((c) =>
      c.toLowerCase().replace(/\s+/g, '-') === productSlug ||
      c.toLowerCase().replace(/\s+/g, '-') === productSlug.replace(/s$/, ''),
    ))
    .slice(0, limit);
}

/** Inline mirror of productPages diagramProductSlugs to avoid circular imports. */
const productDiagramMap: Record<string, string[]> = {
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

function diagramProductSlugsFromConcepts(diagramSlug: string): string[] {
  return productDiagramMap[diagramSlug] ?? [];
}
