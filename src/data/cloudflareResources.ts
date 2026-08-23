import type { LocalizedString } from '../i18n/types';
import catalog from './cloudflareResources.data.json';

export const CLOUDFLARE_RESOURCES_URL = 'https://developers.cloudflare.com/resources/';
export const RESOURCES_LAST_SYNCED = '2026-06-03';

export type CloudflareResourceContentType =
  | 'Design guide'
  | 'Learning path'
  | 'Reference architecture'
  | 'Reference architecture diagram'
  | 'Solution guide'
  | 'Tutorial'
  | 'Video';

export type CloudflareResourceTrack =
  | 'application-services'
  | 'developer-platform'
  | 'cloudflare-one'
  | 'operational-excellence'
  | 'cross-cutting';

export type CloudflareResource = {
  slug: string;
  title: string;
  path: string;
  url: string;
  contentType: CloudflareResourceContentType;
  track: CloudflareResourceTrack;
};

export const cloudflareResources: CloudflareResource[] = catalog as CloudflareResource[];

export const cloudflareResourceContentTypeLabels: Record<
  CloudflareResourceContentType,
  LocalizedString
> = {
  'Design guide': { vi: 'Hướng dẫn thiết kế', en: 'Design guide', km: 'មគ្គុទ្ទេសករណ៍រចនា' },
  'Learning path': { vi: 'Lộ trình học', en: 'Learning path', km: 'ផ្លូវសិក្សា' },
  'Reference architecture': { vi: 'Kiến trúc tham chiếu', en: 'Reference architecture', km: 'ស្ថាបត្យកម្មយោង' },
  'Reference architecture diagram': {
    vi: 'Sơ đồ kiến trúc',
    en: 'Reference architecture diagram',
    km: 'គំនូសស្ថាបត្យកម្មយោង',
  },
  'Solution guide': { vi: 'Hướng dẫn giải pháp', en: 'Solution guide', km: 'មគ្គុទ្ទេសករណ៍ដំណោះស្រាយ' },
  Tutorial: { vi: 'Tutorial', en: 'Tutorial', km: 'Tutorial' },
  Video: { vi: 'Video', en: 'Video', km: 'វីដេអូ' },
};

export const cloudflareResourceTrackLabels: Record<CloudflareResourceTrack, LocalizedString> = {
  'application-services': {
    vi: 'Application Services',
    en: 'Application Services',
    km: 'Application Services',
  },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform', km: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One', km: 'Cloudflare One' },
  'operational-excellence': {
    vi: 'Operational Excellence',
    en: 'Operational Excellence',
    km: 'Operational Excellence',
  },
  'cross-cutting': { vi: 'Chung / đa lĩnh vực', en: 'Cross-cutting', km: 'ឆ្លងកាត់ / ពហុវិស័យ' },
};

export function getResourcesByTrack(track: CloudflareResourceTrack): CloudflareResource[] {
  return cloudflareResources.filter((r) => r.track === track);
}

export function getResourcesByContentType(type: CloudflareResourceContentType): CloudflareResource[] {
  return cloudflareResources.filter((r) => r.contentType === type);
}

/** Keywords → lesson IDs for deployment example mapping */
const LESSON_KEYWORDS: Record<string, string[]> = {
  'as-1-l1': ['onboard', 'add-site', 'add a site', 'nameserver', 'dns migration', 'bind'],
  'as-1-l2': ['proxy', 'orange cloud', 'cname setup', 'partial zone'],
  'as-2-l1': ['encrypt', 'https', 'ssl/tls', 'full (strict)', 'always use https', 'hsts'],
  'as-2-l2': ['origin ca', 'origin certificate', 'origin server'],
  'as-3-l1': ['waf', 'managed rules', 'streamlined waf'],
  'as-3-l2': ['rate limit', 'ratelimit', 'credential stuffing', 'account takeover', 'login'],
  'as-3-l3': ['bot management', 'bot fight', 'turnstile', 'malicious bot'],
  'as-4-l1': ['cdn', 'tiered cache', 'cache hit', 'distributed web performance'],
  'as-4-l2': ['cache rule', 'purge', 'cache performance', 'cache analytics'],
  'as-4-l3': ['speed', 'image', 'early hints', 'brotli', 'optimize mobile'],
  'as-4-l4': ['cache analytics', 'web analytics', 'core web vitals', 'performance review'],
  'dp-1-l1': ['pages', 'git integration', 'deploy', 'migrate from netlify', 'migrate from vercel'],
  'dp-1-l2': ['build configuration', 'wrangler pages deploy'],
  'dp-2-l1': ['pages functions', 'api route', 'front end using pages functions'],
  'dp-2-l2': ['worker', 'express.js', 'custom domain', 'routing', 'serverless global api'],
  'dp-3-l1': ['kv', 'feature flag', 'config'],
  'dp-3-l2': ['d1', 'prisma', 'sqlite', 'migration', 'staff directory', 'todo list'],
  'dp-3-l3': ['r2', 'object storage', 'upload', 'signed url', 'user generated content'],
  'dp-4-l1': ['observability', 'wrangler tail', 'web analytics', 'logs'],
  'dp-4-l2': ['turnstile', 'protect your forms', 'siteverify', 'form'],
  'dp-5-l1': ['workers ai', 'text generation model', 'model inference', 'ai binding'],
  'dp-5-l2': ['ai gateway', 'aig', 'model routing', 'ai observability'],
  'dp-5-l3': ['ai gateway', 'guardrails', 'turnstile', 'ai security', 'tenant control'],
  'dp-5-l4': ['retrieval augmented generation', 'rag', 'vectorize', 'embeddings'],
  'dp-5-l5': ['agents', 'chat agent', 'mcp', 'model context protocol', 'durable objects'],
  'c1-5-l1': ['gateway', 'dns filter', 'swg', 'secure browsing', 'traffic policies'],
  'c1-5-l2': ['egress', 'dedicated egress', 'gateway'],
  'c1-5-l3': ['browser isolation', 'remote browser', 'isolate'],
  'c1-5-l4': ['casb', 'shadow it', 'shadow ai', 'saas posture'],
  'oe-1-l1': ['analytics', 'traffic', 'cache analytics', 'core web vitals'],
  'oe-1-l2': ['observability', 'wrangler tail', 'logs', 'traces'],
  'oe-1-l3': ['logpush', 'security events', 'waf', 'bot management'],
  'oe-1-l4': ['ai gateway', 'observability', 'ai analytics'],
  'oe-2-l1': ['status', 'incident', 'outage'],
  'oe-2-l2': ['security events', 'ddos', 'waf', 'bot'],
  'oe-3-l1': ['preview', 'deploy', 'pages', 'workers'],
  'oe-3-l2': ['wrangler', 'secrets', 'environment'],
  'oe-3-l3': ['purge', 'cache rule', 'release'],
  'oe-4-l1': ['load balancing', 'health monitor', 'failover'],
  'oe-4-l2': ['ddos', 'always online', 'waf'],
  'oe-5-l1': ['core web vitals', 'cache analytics', 'performance review'],
  'oe-5-l2': ['plans', 'cost', 'usage'],
  'oe-5-l3': ['changelog', 'operational review', 'analytics'],
  'c1-1-l1': ['sase', 'zero trust', 'reference architecture'],
  'c1-1-l2': ['zero trust organization', 'team name', 'setup'],
  'c1-1-l3': ['members', 'roles', 'super administrator'],
  'c1-2-l1': ['identity provider', 'idp', 'okta', 'entra', 'sso', 'saml', 'oauth'],
  'c1-2-l2': ['mfa', 'scim', 'groups', 'identity'],
  'c1-3-l1': ['warp', 'warp client', 'device enrollment', 'cloudflare one client'],
  'c1-3-l2': ['device profile', 'split tunnel', 'byod'],
  'c1-3-l3': ['device posture', 'posture check'],
  'c1-4-l1': ['cloudflare tunnel', 'cloudflared', 'private network'],
  'c1-4-l2': ['access polic', 'ztna', 'replace vpn', 'cloudflare access'],
  'c1-4-l3': ['connector', 'warp connector', 'mesh', 'magic wan'],
  'c1-6-l1': ['dlp', 'data loss', 'tls decryption'],
  'c1-6-l2': ['dlp', 'data loss prevention'],
  'c1-7-l1': ['ai security', 'shadow ai', 'casb'],
  'c1-7-l2': ['mcp', 'model context protocol', 'access'],
  'c1-7-l3': ['ai gateway', 'aig', 'guardrails'],
  'c1-7-l4': ['ai crawler', 'bot management', 'radar'],
  'c1-8-l1': ['magic wan', 'ipsec', 'gre', 'cloudflare wan'],
  'c1-8-l2': ['magic wan', 'magic firewall', 'bgp'],
  'c1-9-l1': ['best practice', 'zero trust', 'sase', 'rollout'],
  'c1-9-l2': ['runbook', 'configuration', 'cloudflare one', 'gateway'],
};

function scoreResourceForLesson(resource: CloudflareResource, lessonId: string): number {
  const keywords = LESSON_KEYWORDS[lessonId] ?? [];
  const haystack = `${resource.title} ${resource.path}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw.toLowerCase())) score += kw.length > 8 ? 3 : 2;
  }
  if (resource.contentType === 'Tutorial') score += 1;
  if (resource.contentType === 'Solution guide') score += 1;
  return score;
}

/** Curated tutorials for homepage — one mix per track, beginner-friendly. */
const FEATURED_DEPLOYMENT_SLUGS = [
  'add-multiple-sites-automation',
  'protecting-sp-networks-from-ddos',
  'deploy-an-express-app',
  'build-a-jamstack-app',
  'build-an-api-with-pages-functions',
  'clientless-access-private-dns',
] as const;

export function getFeaturedDeploymentExamples(): CloudflareResource[] {
  const bySlug = new Map(cloudflareResources.map((r) => [r.slug, r]));
  return FEATURED_DEPLOYMENT_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (r): r is CloudflareResource => Boolean(r),
  );
}

export function getDeploymentExamplesForLesson(
  lessonId: string,
  limit = 4,
): CloudflareResource[] {
  const trackHint = lessonId.startsWith('as-')
    ? 'application-services'
    : lessonId.startsWith('dp-')
      ? 'developer-platform'
      : lessonId.startsWith('c1-')
        ? 'cloudflare-one'
        : lessonId.startsWith('oe-')
          ? 'operational-excellence'
        : null;

  return cloudflareResources
    .map((r) => ({ r, score: scoreResourceForLesson(r, lessonId) + (r.track === trackHint ? 1 : 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title))
    .slice(0, limit)
    .map(({ r }) => r);
}
