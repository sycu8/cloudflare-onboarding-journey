/**
 * Sync Cloudflare Resources catalog from developers.cloudflare.com/resources/
 * Usage: node scripts/sync-cloudflare-resources.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const RESOURCES_URL = 'https://developers.cloudflare.com/resources/';
const CACHE_HTML = 'scripts/cache/resources-index.md';
const OUT_JSON = 'src/data/cloudflareResources.data.json';
const OUT_TS = 'src/data/cloudflareResources.ts';

const CONTENT_TYPES = [
  'Design guide',
  'Learning path',
  'Reference architecture',
  'Reference architecture diagram',
  'Solution guide',
  'Tutorial',
  'Video',
];

/** Map resource path segments to hub track slugs */
function inferTrack(path) {
  const p = path.toLowerCase();
  if (
    /cloudflare-one|zero-trust|access|gateway|warp|tunnel|sase|casb|dlp|swg|ztna|replace-vpn|remote-browser|browser-isolation/.test(
      p,
    )
  )
    return 'cloudflare-one';
  if (
    /workers|pages|d1|kv|r2|queues|workflows|durable-objects|hyperdrive|vectorize|workers-ai|sandbox|containers|pulumi|wrangler/.test(
      p,
    )
  )
    return 'developer-platform';
  if (
    /waf|ssl|cache|cdn|dns|bot|turnstile|rate-limit|api-shield|load-balanc|magic-transit|network-firewall|origin|speed|images|terraform|encrypt|protect-website|protect.*form|account-takeover/.test(
      p,
    )
  )
    return 'application-services';
  return 'cross-cutting';
}

function inferContentType(title, path) {
  const p = path.toLowerCase();
  if (p.includes('/reference-architecture/diagrams/')) return 'Reference architecture diagram';
  if (p.includes('/reference-architecture/design-guides/')) return 'Design guide';
  if (p.includes('/reference-architecture/architectures/')) return 'Reference architecture';
  if (p.includes('/reference-architecture/')) return 'Reference architecture';
  if (p.includes('/learning-paths/')) return 'Learning path';
  if (p.includes('/use-cases/solutions/')) return 'Solution guide';
  if (p.includes('/video/') || p.includes('/stream/') || title.toLowerCase().includes('in this video'))
    return 'Video';
  if (
    p.includes('/tutorial') ||
    p.includes('/tutorials/') ||
    p.includes('/get-started/') ||
    p.includes('/implementation-guides/')
  )
    return 'Tutorial';
  return 'Tutorial';
}

function slugFromPath(path) {
  const parts = path.replace(/\/$/, '').split('/').filter(Boolean);
  return parts.slice(-1)[0] || parts.join('-');
}

function parseResourcesHtml(html) {
  /** @type {Map<string, { title: string; path: string }>} */
  const byPath = new Map();

  // Card links: <a href="/path/">Title</a> inside resource listing
  const cardRe =
    /<a[^>]+href="(\/(?:reference-architecture|learning-paths|use-cases|workers|pages|cloudflare-one|waf|cache|dns|bots|turnstile|d1|kv|r2|queues|workflows|hyperdrive|vectorize|terraform|fundamentals|ssl|rate-limit|api-shield|load-balancing|magic-transit|cloudflare-network-firewall|email-security|stream|images|speed|sandbox|containers|agents|ai-gateway|pulumi|browser-rendering|durable-objects|secrets-store|version-management|waiting-room|zaraz)[^"#?]*)"/gi;

  let m;
  while ((m = cardRe.exec(html))) {
    const path = m[1].replace(/\/$/, '');
    if (path === '/resources') continue;
    if (!byPath.has(path)) byPath.set(path, { title: '', path });
  }

  // Extract titles near links — Starlight cards often have title in link text or data attributes
  const linkTitleRe =
    /<a[^>]+href="(\/(?:reference-architecture|learning-paths|use-cases|workers|pages|cloudflare-one|waf|cache|dns|bots|turnstile|d1|kv|r2|queues|workflows|hyperdrive|vectorize|terraform|fundamentals|ssl|rate-limit|api-shield|load-balancing|magic-transit|cloudflare-network-firewall|email-security|stream|images|speed|sandbox|containers|agents|ai-gateway|pulumi|browser-rendering|durable-objects|secrets-store|version-management|waiting-room|zaraz)[^"#?]*)"[^>]*>([^<]{4,200})<\/a>/gi;

  while ((m = linkTitleRe.exec(html))) {
    const path = m[1].replace(/\/$/, '');
    const title = m[2].replace(/\s+/g, ' ').trim();
    if (title.length < 4 || title.includes('Skip to') || title.includes('Log in')) continue;
    const existing = byPath.get(path);
    if (existing) {
      if (!existing.title || title.length > existing.title.length) existing.title = title;
    } else {
      byPath.set(path, { title, path });
    }
  }

  // Fallback: parse embedded JSON if present (Astro islands)
  const jsonLdRe = /"url"\s*:\s*"https:\/\/developers\.cloudflare\.com([^"]+)"/g;
  while ((m = jsonLdRe.exec(html))) {
    const path = m[1].replace(/\/$/, '');
    if (!path || path === '/resources') continue;
    if (!byPath.has(path)) byPath.set(path, { title: '', path });
  }

  return [...byPath.values()];
}

async function main() {
  let html;
  try {
    html = readFileSync(CACHE_HTML, 'utf8');
    if (!html.includes('Resources | Cloudflare Docs')) throw new Error('stale cache');
  } catch {
    console.log('Fetching', RESOURCES_URL);
    const res = await fetch(RESOURCES_URL);
    html = await res.text();
    writeFileSync(CACHE_HTML, html);
  }

  let items = parseResourcesHtml(html);
  console.log(`Parsed ${items.length} resource links from HTML`);

  // Enrich titles from uploaded catalog text (fallback for cards without link text)
  if (items.filter((i) => !i.title).length > items.length * 0.5) {
    console.log('Many titles missing — fetching individual pages for metadata…');
    const limited = items.slice(0, 400);
    for (const item of limited) {
      if (item.title) continue;
      const url = `https://developers.cloudflare.com${item.path}/`;
      try {
        const page = await fetch(url);
        const text = await page.text();
        const titleMatch = text.match(/<title>([^<|]+)/);
        if (titleMatch) {
          item.title = titleMatch[1].replace(/\s*·.*$/, '').trim();
        }
        await new Promise((r) => setTimeout(r, 50));
      } catch {
        /* ignore */
      }
    }
    items = limited;
  }

  const resources = items
    .filter((i) => i.title || i.path.split('/').length >= 3)
    .map((item) => {
      const title = item.title || slugFromPath(item.path).replace(/-/g, ' ');
      const contentType = inferContentType(title, item.path);
      return {
        slug: slugFromPath(item.path),
        title,
        path: item.path,
        url: `https://developers.cloudflare.com${item.path.replace(/\/$/, '')}/`,
        contentType,
        track: inferTrack(item.path),
      };
    })
    .filter((r, i, arr) => arr.findIndex((x) => x.path === r.path) === i)
    .sort((a, b) => a.title.localeCompare(b.title));

  writeFileSync(OUT_JSON, JSON.stringify(resources, null, 2));
  console.log(`Wrote ${resources.length} resources to ${OUT_JSON}`);

  const ts = `import type { LocalizedString } from '../i18n/types';
import catalog from './cloudflareResources.data.json';

export const CLOUDFLARE_RESOURCES_URL = '${RESOURCES_URL}';
export const RESOURCES_LAST_SYNCED = '${new Date().toISOString().slice(0, 10)}';

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
  const haystack = \`\${resource.title} \${resource.path}\`.toLowerCase();
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
`;

  writeFileSync(OUT_TS, ts);
  console.log(`Wrote ${OUT_TS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
