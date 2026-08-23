import type { LocalizedString } from '../i18n/types';
import { postCdnCache } from './blogPosts/cdn-cache';
import { postWafBeginner } from './blogPosts/waf-beginner';
import { postWorkersIntro } from './blogPosts/workers-intro';
import { postWorkersAi } from './blogPosts/workers-ai';
import { postAiGateway } from './blogPosts/ai-gateway';
import { postDeveloperPlatform } from './blogPosts/developer-platform';
import { postDnsProxyDamMayCamChoNguoiMoi } from './blogPosts/dns-proxy-dam-may-cam';
import { postDdosLaGiCloudflareBaoVeTheNao } from './blogPosts/ddos-la-gi-cloudflare-bao-ve';
import { postPagesVsWorkersKhiNaoDungGi } from './blogPosts/pages-vs-workers-khi-nao-dung';
import { postVectorizeRagTimKiemTriThucDonGian } from './blogPosts/vectorize-rag-tim-kiem-tri-thuc';
import { postR2LuuFileKhongPhiEgressChoNguoiMoi } from './blogPosts/r2-luu-file-khong-phi-egress';
import { postCacheRulesVsPageRulesNguoiMoi } from './blogPosts/cache-rules-vs-page-rules';
import { postAiGatewayChiPhiToken } from './blogPosts/ai-gateway-chi-phi-token';
import { postObservabilityLogsWorkersChoNguoiMoi } from './blogPosts/observability-logs-workers-cho-nguoi-moi';
import { postImageOptimizationCdnTocDo } from './blogPosts/image-optimization-cdn-toc-do';
import { postRateLimitingBaoVeFormLogin } from './blogPosts/rate-limiting-bao-ve-form-login';
import { postSandboxChayCodeAnToan } from './blogPosts/sandbox-chay-code-an-toan';
import { postBotManagementPhanBietNguoiVaBot } from './blogPosts/bot-management-phan-biet-nguoi';
import { postD1SqliteEdgeChoAppNho } from './blogPosts/d1-sqlite-edge-cho-app';
import { postAgentsSdkAgentAiTrenCloudflare } from './blogPosts/agents-sdk-agent-ai-tren';
import { postWranglerDeployTuMayTinhLenEdge } from './blogPosts/wrangler-deploy-tu-may-tinh';
import { postSslTlsHttpsCloudflareChoNguoiMoi } from './blogPosts/ssl-tls-https-cloudflare-cho';
import { postKvKeyValueEdgeKhi } from './blogPosts/kv-key-value-edge-khi';
import { postAiSecurityPromptInjectionNguoi } from './blogPosts/ai-security-prompt-injection-nguoi';
import { postLoadBalancingHaWebsiteDon } from './blogPosts/load-balancing-ha-website-don';
import { postZeroTrustAccessThayVpn } from './blogPosts/zero-trust-access-thay-vpn';
import { postWorkflowsTacVuDaiTren } from './blogPosts/workflows-tac-vu-dai-tren';

export type BlogTopic = 'ai' | 'security' | 'cdn' | 'workers' | 'developer-platform';
export type BlogLevel = 'entry' | 'intermediate';

export type BlogSection = {
  heading: LocalizedString;
  paragraphs: LocalizedString[];
  /** Optional mid-article official diagram slug from referenceDiagrams */
  diagramSlug?: string;
  /** Optional local screenshot under /images/blog/ or /ref-diagrams/ */
  image?: BlogImage;
};

export type BlogFaq = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type BlogSource = {
  title: string;
  href: string;
};

export type BlogHubLink = {
  href: string;
  label: LocalizedString;
};

/** Local or hub image (prefer committed /ref-diagrams or /images/blog screenshots). */
export type BlogImage = {
  src: string;
  alt: LocalizedString;
  caption?: LocalizedString;
  /** e.g. Cloudflare Dashboard · Security → WAF */
  credit?: LocalizedString;
};

export type BlogPost = {
  slug: string;
  date: string;
  updated?: string;
  topic: BlogTopic;
  level: BlogLevel;
  readingMinutes: number;
  title: LocalizedString;
  description: LocalizedString;
  excerpt: LocalizedString;
  keywords: LocalizedString;
  sections: BlogSection[];
  faq: BlogFaq[];
  sources: BlogSource[];
  relatedTrack?:
    | 'application-services'
    | 'developer-platform'
    | 'cloudflare-one'
    | 'ai-security-adoption'
    | 'operational-excellence';
  relatedProductSlugs?: string[];
  relatedPostSlugs: string[];
  hubLinks: BlogHubLink[];
  /**
   * Official Cloudflare Reference Architecture diagram slugs
   * (files under public/ref-diagrams — see src/data/referenceDiagrams.ts).
   */
  diagramSlugs?: string[];
  /** Extra screenshots (Dashboard UI, etc.) stored under public/images/blog/ */
  images?: BlogImage[];
};

export const blogTopicLabels: Record<BlogTopic, LocalizedString> = {
  ai: { vi: 'AI', en: 'AI', km: 'AI' },
  security: { vi: 'Bảo mật', en: 'Security', km: 'សុវត្ថិភាព' },
  cdn: { vi: 'CDN', en: 'CDN', km: 'CDN' },
  workers: { vi: 'Workers', en: 'Workers', km: 'Workers' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform', km: 'Developer Platform' },
};

export const blogLevelLabels: Record<BlogLevel, LocalizedString> = {
  entry: { vi: 'Cơ bản', en: 'Entry', km: 'កម្រិតចាប់ផ្តើម' },
  intermediate: { vi: 'Trung cấp', en: 'Intermediate', km: 'កម្រិតមធ្យម' },
};

export const blogIntro: LocalizedString = {
  vi: 'Blog giải thích Cloudflare bằng ngôn ngữ dễ hiểu — AI, Security, CDN, Workers và Developer Platform. Mỗi bài viết lại góc nhìn từ blog.cloudflare.com cho người mới và người học trung cấp, kèm liên kết học tiếp trên hub.',
  en: 'Plain-language Cloudflare explainers — AI, Security, CDN, Workers, and the Developer Platform. Each post rewrites ideas from blog.cloudflare.com for beginners and intermediate learners, with links to keep learning on this hub.',
};

export const blogSourceNote: LocalizedString = {
  vi: 'Nội dung được viết lại để dễ hiểu hơn; luôn đọc bài gốc trên blog.cloudflare.com và docs chính thức khi cần chi tiết kỹ thuật hoặc cập nhật mới nhất.',
  en: 'Content is rewritten for clarity; always read the original posts on blog.cloudflare.com and official docs for technical detail or the latest updates.',
};

/** All scheduled blog posts (6 seed + 21 bi-daily queue). */
export const blogPosts: BlogPost[] = [
  postCdnCache,
  postWafBeginner,
  postWorkersIntro,
  postWorkersAi,
  postAiGateway,
  postDeveloperPlatform,
  postDnsProxyDamMayCamChoNguoiMoi,
  postDdosLaGiCloudflareBaoVeTheNao,
  postPagesVsWorkersKhiNaoDungGi,
  postVectorizeRagTimKiemTriThucDonGian,
  postR2LuuFileKhongPhiEgressChoNguoiMoi,
  postCacheRulesVsPageRulesNguoiMoi,
  postBotManagementPhanBietNguoiVaBot,
  postD1SqliteEdgeChoAppNho,
  postAgentsSdkAgentAiTrenCloudflare,
  postWranglerDeployTuMayTinhLenEdge,
  postSslTlsHttpsCloudflareChoNguoiMoi,
  postKvKeyValueEdgeKhi,
  postAiSecurityPromptInjectionNguoi,
  postLoadBalancingHaWebsiteDon,
  postZeroTrustAccessThayVpn,
  postWorkflowsTacVuDaiTren,
  postAiGatewayChiPhiToken,
  postObservabilityLogsWorkersChoNguoiMoi,
  postImageOptimizationCdnTocDo,
  postRateLimitingBaoVeFormLogin,
  postSandboxChayCodeAnToan,
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  const bySlug = post.relatedPostSlugs
    .map((s) => getBlogPost(s))
    .filter((p): p is BlogPost => Boolean(p));
  if (bySlug.length >= limit) return bySlug.slice(0, limit);
  const rest = blogPosts.filter(
    (p) => p.slug !== post.slug && !bySlug.some((r) => r.slug === p.slug),
  );
  return [...bySlug, ...rest].slice(0, limit);
}

export function getBlogPostsByTopic(topic: BlogTopic): BlogPost[] {
  return blogPosts.filter((p) => p.topic === topic);
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}/`;
}

/** Approximate word count for a language (space-separated tokens). */
export function countBlogWords(post: BlogPost, lang: 'vi' | 'en'): number {
  const parts: string[] = [
    post.title[lang],
    post.description[lang],
    ...post.sections.flatMap((s) => [s.heading[lang], ...s.paragraphs.map((p) => p[lang])]),
    ...post.faq.flatMap((f) => [f.question[lang], f.answer[lang]]),
  ];
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}
