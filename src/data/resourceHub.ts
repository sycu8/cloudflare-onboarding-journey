import type { LocalizedString } from '../i18n/types';

export const CLOUDFLARE_RESOURCE_HUB_URL = 'https://www.cloudflare.com/resource-hub/';

export type ResourceHubCategory = 'learn' | 'build' | 'community' | 'operations' | 'explore';

export type ResourceHubItem = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  href: string;
  category: ResourceHubCategory;
  relatedTrack?: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'cross-cutting';
  /** Link stays in this hub (anchor or internal route) */
  internal?: boolean;
  featured?: boolean;
};

export const resourceHubIntro: LocalizedString = {
  vi: 'Chỉ mục tài nguyên chính thức từ Cloudflare Resource Hub — docs, blog, community, case studies và nhiều hơn. Hub này tổ chức lại theo lộ trình beginner.',
  en: 'Official index from the Cloudflare Resource Hub — docs, blog, community, case studies, and more. This hub reorganizes them for a beginner journey.',
};

export const resourceHubCategoryLabels: Record<ResourceHubCategory, LocalizedString> = {
  learn: { vi: 'Học & tài liệu', en: 'Learn & docs' },
  build: { vi: 'Build & triển khai', en: 'Build & deploy' },
  community: { vi: 'Cộng đồng & cập nhật', en: 'Community & updates' },
  operations: { vi: 'Vận hành & hỗ trợ', en: 'Operations & support' },
  explore: { vi: 'Khám phá thêm', en: 'Explore more' },
};

/** Curated from https://www.cloudflare.com/resource-hub/ */
export const resourceHubItems: ResourceHubItem[] = [
  {
    id: 'ai-gateway',
    title: { vi: 'AI Gateway', en: 'AI Gateway' },
    description: {
      vi: 'Quản trị request AI đa provider — observability, cache và kiểm soát chi phí.',
      en: 'Govern multi-provider AI requests — observability, caching, and cost control.',
    },
    href: 'https://developers.cloudflare.com/ai-gateway/',
    category: 'build',
    relatedTrack: 'developer-platform',
    featured: true,
  },
  {
    id: 'developer-docs',
    title: { vi: 'Developer Documentation', en: 'Developer Documentation' },
    description: {
      vi: 'Tài liệu sản phẩm, tutorial và ví dụ cho mọi dịch vụ Cloudflare.',
      en: 'Product docs, tutorials, and examples for every Cloudflare service.',
    },
    href: 'https://developers.cloudflare.com/',
    category: 'learn',
    relatedTrack: 'cross-cutting',
    featured: true,
  },
  {
    id: 'api-reference',
    title: { vi: 'API Reference', en: 'API Reference' },
    description: {
      vi: 'Endpoint, schema và chi tiết xác thực cho Cloudflare APIs.',
      en: 'Endpoints, schemas, and auth details for Cloudflare APIs.',
    },
    href: 'https://developers.cloudflare.com/api/',
    category: 'build',
    relatedTrack: 'developer-platform',
  },
  {
    id: 'learning-center',
    title: { vi: 'Learning Center', en: 'Learning Center' },
    description: {
      vi: 'Giải thích khái niệm và hướng dẫn thực hành cho kiến trúc web hiện đại.',
      en: 'Concept explainers and practical guides for modern web architecture.',
    },
    href: '/resources#learning-center',
    category: 'learn',
    relatedTrack: 'application-services',
    internal: true,
    featured: true,
  },
  {
    id: 'reference-architecture',
    title: { vi: 'Reference Architectures', en: 'Reference Architectures' },
    description: {
      vi: 'Pattern kiến trúc và best practices — SASE, CDN, Workers, Zero Trust.',
      en: 'Architecture patterns and best practices — SASE, CDN, Workers, Zero Trust.',
    },
    href: '/resources#reference-architecture',
    category: 'learn',
    relatedTrack: 'cross-cutting',
    internal: true,
    featured: true,
  },
  {
    id: 'blog',
    title: { vi: 'Cloudflare Blog', en: 'Cloudflare Blog' },
    description: {
      vi: 'Cập nhật sản phẩm, launch và bài kỹ thuật sâu.',
      en: 'Product updates, launches, and technical deep dives.',
    },
    href: 'https://blog.cloudflare.com/',
    category: 'community',
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'engineering-blog',
    title: { vi: 'Engineering Blog', en: 'Engineering Blog' },
    description: {
      vi: 'Chi tiết triển khai và câu chuyện kỹ thuật phía sau sản phẩm.',
      en: 'Implementation details and behind-the-scenes engineering stories.',
    },
    href: 'https://blog.cloudflare.com/tag/engineering/',
    category: 'community',
    relatedTrack: 'developer-platform',
  },
  {
    id: 'case-studies',
    title: { vi: 'Case Studies', en: 'Case Studies' },
    description: {
      vi: 'Cách các team dùng Cloudflare production trên nhiều ngành.',
      en: 'How teams use Cloudflare in production across industries.',
    },
    href: 'https://www.cloudflare.com/case-studies/',
    category: 'learn',
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'community',
    title: { vi: 'Community', en: 'Community' },
    description: {
      vi: 'Kết nối builder khác và nhận trợ giúp từ cộng đồng Cloudflare.',
      en: 'Connect with other builders and get help from the Cloudflare community.',
    },
    href: 'https://community.cloudflare.com/',
    category: 'community',
    relatedTrack: 'cross-cutting',
    featured: true,
  },
  {
    id: 'events',
    title: { vi: 'Events', en: 'Events' },
    description: {
      vi: 'Talk, webinar và sự kiện trực tiếp từ Cloudflare.',
      en: 'Talks, webinars, and in-person sessions from Cloudflare.',
    },
    href: 'https://www.cloudflare.com/events/',
    category: 'community',
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'radar',
    title: { vi: 'Cloudflare Radar', en: 'Cloudflare Radar' },
    description: {
      vi: 'Xu hướng traffic Internet và bảo mật theo thời gian thực.',
      en: 'Internet traffic and security trends in near real time.',
    },
    href: 'https://radar.cloudflare.com/',
    category: 'explore',
    relatedTrack: 'application-services',
  },
  {
    id: 'support',
    title: { vi: 'Support', en: 'Support' },
    description: {
      vi: 'Trung tâm trợ giúp, knowledge base và kênh hỗ trợ chính thức.',
      en: 'Help center, knowledge base, and official support channels.',
    },
    href: 'https://support.cloudflare.com/',
    category: 'operations',
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'status',
    title: { vi: 'Status', en: 'Status' },
    description: {
      vi: 'Trạng thái dịch vụ Cloudflare và sự cố đang diễn ra.',
      en: 'Cloudflare service status and ongoing incidents.',
    },
    href: 'https://www.cloudflarestatus.com/',
    category: 'operations',
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'global-network',
    title: { vi: 'Global Network', en: 'Global Network' },
    description: {
      vi: 'Bản đồ và khả năng mạng toàn cầu của Cloudflare (330+ cities).',
      en: 'Map and capabilities of Cloudflare’s global network (330+ cities).',
    },
    href: 'https://www.cloudflare.com/network/',
    category: 'explore',
    relatedTrack: 'application-services',
  },
  {
    id: 'enterprise',
    title: { vi: 'Enterprise', en: 'Enterprise' },
    description: {
      vi: 'Tài nguyên và khả năng Cloudflare cho doanh nghiệp lớn.',
      en: 'Cloudflare resources and capabilities for large organizations.',
    },
    href: 'https://www.cloudflare.com/enterprise/',
    category: 'explore',
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'startups',
    title: { vi: 'Startups', en: 'Startups' },
    description: {
      vi: 'Chương trình và tài nguyên cho startup build trên Cloudflare.',
      en: 'Programs and resources for startups building on Cloudflare.',
    },
    href: 'https://www.cloudflare.com/startups/',
    category: 'explore',
    relatedTrack: 'developer-platform',
  },
];

export function getResourceHubByCategory(category: ResourceHubCategory): ResourceHubItem[] {
  return resourceHubItems.filter((i) => i.category === category);
}

export function getFeaturedResourceHubItems(limit = 6): ResourceHubItem[] {
  return resourceHubItems.filter((i) => i.featured).slice(0, limit);
}

export function getResourceHubForTrack(
  track: 'application-services' | 'developer-platform' | 'cloudflare-one',
  limit = 5,
): ResourceHubItem[] {
  return resourceHubItems
    .filter((i) => i.relatedTrack === track || i.relatedTrack === 'cross-cutting')
    .slice(0, limit);
}
