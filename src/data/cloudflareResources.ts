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
  'Design guide': { vi: 'Hướng dẫn thiết kế', en: 'Design guide' },
  'Learning path': { vi: 'Lộ trình học', en: 'Learning path' },
  'Reference architecture': { vi: 'Kiến trúc tham chiếu', en: 'Reference architecture' },
  'Reference architecture diagram': { vi: 'Sơ đồ kiến trúc', en: 'Reference architecture diagram' },
  'Solution guide': { vi: 'Hướng dẫn giải pháp', en: 'Solution guide' },
  Tutorial: { vi: 'Tutorial', en: 'Tutorial' },
  Video: { vi: 'Video', en: 'Video' },
};

export const cloudflareResourceTrackLabels: Record<CloudflareResourceTrack, LocalizedString> = {
  'application-services': { vi: 'Application Services', en: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  'cross-cutting': { vi: 'Chung / đa lĩnh vực', en: 'Cross-cutting' },
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
  'c1-1-l1': ['identity', 'idp', 'okta', 'entra', 'groups'],
  'c1-1-l2': ['access application', 'pilot', 'saas', 'self-hosted'],
  'c1-2-l1': ['identity provider', 'mfa', 'sso', 'saml', 'oauth'],
  'c1-2-l2': ['access polic', 'ztna', 'replace vpn', 'tunnel', 'cloudflare access'],
  'c1-3-l1': ['gateway', 'dns filter', 'swg', 'secure browsing', 'warp client', 'traffic policies'],
  'c1-3-l2': ['casb', 'dlp', 'shadow it', 'data loss'],
  'c1-4-l1': ['rollout', 'implementation', 'department', 'zero trust deployment'],
  'c1-4-l2': ['analytics', 'zero trust analytics', 'kpi'],
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
        : null;

  return cloudflareResources
    .map((r) => ({ r, score: scoreResourceForLesson(r, lessonId) + (r.track === trackHint ? 1 : 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title))
    .slice(0, limit)
    .map(({ r }) => r);
}
