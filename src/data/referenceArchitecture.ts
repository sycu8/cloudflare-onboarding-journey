import type { LocalizedString } from '../i18n/types';

export const REFERENCE_ARCHITECTURE_HUB_URL = 'https://www.cloudflare.com/architecture/';
export const REFERENCE_ARCHITECTURE_DOCS_URL = 'https://developers.cloudflare.com/reference-architecture/';

export type ReferenceDocType =
  | 'reference-architecture'
  | 'diagram'
  | 'design-guide'
  | 'implementation-guide';

export type ReferenceSolution =
  | 'sase-zero-trust'
  | 'app-modernization'
  | 'network-modernization'
  | 'platform-consolidation'
  | 'data-storage'
  | 'protect-surface';

export type ReferenceArchitectureItem = {
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  docType: ReferenceDocType;
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'cross-cutting';
  solutions: ReferenceSolution[];
  officialPath: string;
  featured?: boolean;
};

export const referenceArchitectureIntro: LocalizedString = {
  vi: 'Sơ đồ và tài liệu kiến trúc chính thức từ Cloudflare Architecture Center — kèm hình ảnh từ Reference Diagrams (developers.cloudflare.com/reference-architecture/diagrams).',
  en: 'Official diagrams and reference docs from the Cloudflare Architecture Center — with figures from Reference Diagrams (developers.cloudflare.com/reference-architecture/diagrams).',
};

export const referenceDocTypeLabels: Record<ReferenceDocType, LocalizedString> = {
  'reference-architecture': { vi: 'Kiến trúc tham chiếu', en: 'Reference architecture' },
  diagram: { vi: 'Sơ đồ kiến trúc', en: 'Architecture diagram' },
  'design-guide': { vi: 'Hướng dẫn thiết kế', en: 'Design guide' },
  'implementation-guide': { vi: 'Hướng dẫn triển khai', en: 'Implementation guide' },
};

export const referenceSolutionLabels: Record<ReferenceSolution, LocalizedString> = {
  'sase-zero-trust': { vi: 'SASE / Zero Trust', en: 'SASE / Zero Trust' },
  'app-modernization': { vi: 'Hiện đại hóa ứng dụng', en: 'App modernization' },
  'network-modernization': { vi: 'Hiện đại hóa mạng', en: 'Network modernization' },
  'platform-consolidation': { vi: 'Hợp nhất nền tảng', en: 'Platform consolidation' },
  'data-storage': { vi: 'Lưu trữ dữ liệu', en: 'Data storage' },
  'protect-surface': { vi: 'Bảo vệ bề mặt tấn công', en: 'Protect attack surface' },
};

/** Curated from https://www.cloudflare.com/architecture/ and developers.cloudflare.com/reference-architecture */
export const referenceArchitectureItems: ReferenceArchitectureItem[] = [
  {
    slug: 'sase',
    title: { vi: 'Evolving to a SASE architecture with Cloudflare', en: 'Evolving to a SASE architecture with Cloudflare' },
    summary: {
      vi: 'Hợp nhất security và networking trên một control plane — thay patchwork appliance bằng Cloudflare One.',
      en: 'Consolidate security and networking on one control plane — replace appliance patchwork with Cloudflare One.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust', 'platform-consolidation'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/sase/',
    featured: true,
  },
  {
    slug: 'security-architecture',
    title: { vi: 'Cloudflare Security Architecture', en: 'Cloudflare Security Architecture' },
    summary: {
      vi: 'Cách mạng và nền tảng Cloudflare được thiết kế về security, vận hành và dịch vụ cho doanh nghiệp.',
      en: 'How Cloudflare’s network and platform are designed for security, operations, and enterprise services.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'application-services',
    solutions: ['protect-surface', 'platform-consolidation'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/security/',
    featured: true,
  },
  {
    slug: 'cdn',
    title: { vi: 'CDN Reference Architecture', en: 'CDN Reference Architecture' },
    summary: {
      vi: 'Thách thức web app truyền thống, cách CDN Cloudflare giải quyết, và thiết kế kiến trúc CDN.',
      en: 'Traditional web app challenges, how Cloudflare CDN solves them, and CDN architecture design.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'application-services',
    solutions: ['app-modernization', 'protect-surface'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/cdn/',
    featured: true,
  },
  {
    slug: 'load-balancing',
    title: { vi: 'Load Balancing Reference Architecture', en: 'Load Balancing Reference Architecture' },
    summary: {
      vi: 'Global và local traffic management — cho team vận hành web, hosting và network.',
      en: 'Global and local traffic management — for web, hosting, and network teams.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'application-services',
    solutions: ['app-modernization', 'network-modernization'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/load-balancing/',
  },
  {
    slug: 'magic-transit',
    title: { vi: 'Magic Transit Reference Architecture', en: 'Magic Transit Reference Architecture' },
    summary: {
      vi: 'Kiến trúc và tùy chọn triển khai Magic Transit — DDoS protection ở tầng network.',
      en: 'Magic Transit architecture and deployment options — network-layer DDoS protection.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'application-services',
    solutions: ['network-modernization', 'protect-surface'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/magic-transit/',
  },
  {
    slug: 'email-security',
    title: { vi: 'Email Security deployments', en: 'Email Security deployments' },
    summary: {
      vi: 'Kiến trúc chính của Cloudflare Email Security — phishing, BEC, DMARC.',
      en: 'Core architecture of Cloudflare Email Security — phishing, BEC, DMARC.',
    },
    docType: 'reference-architecture',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust', 'protect-surface'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/architectures/email-security-deployments/',
  },
  {
    slug: 'secure-app-delivery',
    title: { vi: 'Securely deliver applications with Cloudflare', en: 'Securely deliver applications with Cloudflare' },
    summary: {
      vi: 'Bộ dịch vụ performance, security, reliability, development và Zero Trust cho ứng dụng.',
      en: 'Performance, security, reliability, development, and Zero Trust services for applications.',
    },
    docType: 'design-guide',
    relatedTrack: 'application-services',
    solutions: ['app-modernization', 'protect-surface'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/design-guides/secure-application-delivery/',
    featured: true,
  },
  {
    slug: 'ztna-policies',
    title: { vi: 'Designing ZTNA access policies', en: 'Designing ZTNA access policies' },
    summary: {
      vi: 'Best practices xây policy Cloudflare Access / ZTNA hiệu quả.',
      en: 'Best practices for effective Cloudflare Access / ZTNA policies.',
    },
    docType: 'design-guide',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/design-guides/designing-ztna-access-policies/',
  },
  {
    slug: 'vpn-migration',
    title: { vi: 'Migrate from VPN to Zero Trust', en: 'Migrate from VPN to Zero Trust' },
    summary: {
      vi: 'Chuyển từ VPN concentrator sang ZTNA cloud — bảo mật và chi phí tốt hơn.',
      en: 'Move from VPN concentrators to cloud ZTNA — better security and cost.',
    },
    docType: 'design-guide',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust', 'network-modernization'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/design-guides/network-vpn-migration/',
  },
  {
    slug: 'zero-trust-startups',
    title: { vi: 'Zero Trust for startups', en: 'Zero Trust for startups' },
    summary: {
      vi: 'Xây nền tảng Zero Trust sớm với Cloudflare — đơn giản, đôi khi miễn phí.',
      en: 'Build Zero Trust early with Cloudflare — simple, sometimes free.',
    },
    docType: 'design-guide',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/design-guides/zero-trust-for-startups/',
  },
  {
    slug: 'waf-deployment',
    title: { vi: 'Streamlined WAF deployment', en: 'Streamlined WAF deployment' },
    summary: {
      vi: 'Triển khai WAF thống nhất trên nhiều zone và application.',
      en: 'Deploy WAF consistently across zones and applications.',
    },
    docType: 'design-guide',
    relatedTrack: 'application-services',
    solutions: ['protect-surface'],
    officialPath:
      'https://developers.cloudflare.com/reference-architecture/design-guides/streamlined-waf-deployment-across-zones-and-applications/',
  },
  {
    slug: 'fullstack-workers',
    title: { vi: 'Fullstack applications on Workers', en: 'Fullstack applications on Workers' },
    summary: {
      vi: 'Ví dụ kiến trúc fullstack thực tế — Workers, storage, compute phối hợp.',
      en: 'A practical fullstack architecture — Workers, storage, and compute together.',
    },
    docType: 'diagram',
    relatedTrack: 'developer-platform',
    solutions: ['app-modernization', 'data-storage'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/diagrams/serverless/fullstack-application/',
    featured: true,
  },
  {
    slug: 'ai-rag',
    title: { vi: 'RAG architecture diagram', en: 'RAG architecture diagram' },
    summary: {
      vi: 'Retrieval Augmented Generation — kết hợp retrieval và generative models trên Cloudflare.',
      en: 'Retrieval Augmented Generation — retrieval plus generative models on Cloudflare.',
    },
    docType: 'diagram',
    relatedTrack: 'developer-platform',
    solutions: ['app-modernization', 'data-storage'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-rag/',
  },
  {
    slug: 'serverless-global-apis',
    title: { vi: 'Serverless global APIs', en: 'Serverless global APIs' },
    summary: {
      vi: 'Kiến trúc API serverless toàn cầu — Workers, D1, R2 tương tác thế nào.',
      en: 'Global serverless API architecture — how Workers, D1, and R2 interact.',
    },
    docType: 'diagram',
    relatedTrack: 'developer-platform',
    solutions: ['app-modernization'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/diagrams/serverless/serverless-global-apis/',
  },
  {
    slug: 'bot-management',
    title: { vi: 'Bot management diagram', en: 'Bot management diagram' },
    summary: {
      vi: 'Phát hiện và giảm thiểu bot traffic — bảo vệ domain khỏi bot xấu.',
      en: 'Detect and mitigate bot traffic — protect domains from bad bots.',
    },
    docType: 'diagram',
    relatedTrack: 'application-services',
    solutions: ['protect-surface'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/diagrams/bots/bot-management/',
  },
  {
    slug: 'distributed-web-performance',
    title: { vi: 'Distributed web performance', en: 'Distributed web performance' },
    summary: {
      vi: 'Pattern L7 giảm latency, tăng cache hit, cải thiện Core Web Vitals.',
      en: 'L7 pattern to cut latency, raise cache efficiency, and improve Core Web Vitals.',
    },
    docType: 'diagram',
    relatedTrack: 'application-services',
    solutions: ['app-modernization'],
    officialPath:
      'https://developers.cloudflare.com/reference-architecture/diagrams/content-delivery/distributed-web-performance-architecture/',
  },
  {
    slug: 'saas-access-sase',
    title: { vi: 'Secure SaaS access with SASE', en: 'Secure SaaS access with SASE' },
    summary: {
      vi: 'Zero Trust cho SaaS — policy theo device, identity, network location.',
      en: 'Zero Trust for SaaS — policies by device, identity, and network location.',
    },
    docType: 'diagram',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust'],
    officialPath:
      'https://developers.cloudflare.com/reference-architecture/diagrams/sase/secure-access-to-saas-applications-with-sase/',
  },
  {
    slug: 'r2-egress-free',
    title: { vi: 'Egress-free storage multi-cloud', en: 'Egress-free storage multi-cloud' },
    summary: {
      vi: 'Dùng R2 để object storage đa cloud không phí egress.',
      en: 'Use R2 for multi-cloud object storage without egress fees.',
    },
    docType: 'diagram',
    relatedTrack: 'developer-platform',
    solutions: ['data-storage'],
    officialPath:
      'https://developers.cloudflare.com/reference-architecture/diagrams/storage/egress-free-storage-multi-cloud/',
  },
  {
    slug: 'impl-zero-trust',
    title: { vi: 'Zero Trust implementation guides', en: 'Zero Trust implementation guides' },
    summary: {
      vi: 'Tổng hợp hướng dẫn triển khai Zero Trust từng bước trên Cloudflare.',
      en: 'Step-by-step Zero Trust implementation guides on Cloudflare.',
    },
    docType: 'implementation-guide',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/implementation-guides/zero-trust/',
  },
  {
    slug: 'learning-replace-vpn',
    title: { vi: 'Learning path: Replace your VPN', en: 'Learning path: Replace your VPN' },
    summary: {
      vi: 'Lộ trình học chính thức thay VPN bằng Cloudflare Zero Trust.',
      en: 'Official learning path to replace VPN with Cloudflare Zero Trust.',
    },
    docType: 'implementation-guide',
    relatedTrack: 'cloudflare-one',
    solutions: ['sase-zero-trust'],
    officialPath: 'https://developers.cloudflare.com/learning-paths/replace-vpn/concepts/',
  },
  {
    slug: 'find-by-solution',
    title: { vi: 'Find by solution area', en: 'Find by solution area' },
    summary: {
      vi: 'Duyệt tài liệu theo use case: SASE, CDN, Workers, data storage…',
      en: 'Browse docs by use case: SASE, CDN, Workers, data storage…',
    },
    docType: 'reference-architecture',
    relatedTrack: 'cross-cutting',
    solutions: ['platform-consolidation'],
    officialPath: 'https://developers.cloudflare.com/reference-architecture/by-solution/',
  },
];

export function getFeaturedReferenceItems(limit = 6): ReferenceArchitectureItem[] {
  return referenceArchitectureItems.filter((i) => i.featured).slice(0, limit);
}

export function getReferenceItemsForTrack(
  track: 'application-services' | 'developer-platform' | 'cloudflare-one',
  limit = 6,
): ReferenceArchitectureItem[] {
  const primary = referenceArchitectureItems.filter((i) => i.relatedTrack === track);
  const featured = primary.filter((i) => i.featured);
  const rest = primary.filter((i) => !i.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getReferenceItemsByType(docType: ReferenceDocType): ReferenceArchitectureItem[] {
  return referenceArchitectureItems.filter((i) => i.docType === docType);
}
