/**
 * Smoke test: all static routes + internal links + API health.
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));

function runNodeScript(name) {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', join(scriptsDir, name)], {
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runNodeScript('test-retired-ai-models.mjs');
runNodeScript('test-generate-grounding.mjs');

const BASE = (process.argv[2] || 'http://127.0.0.1:4321').replace(/\/$/, '');
const IS_LOCAL_PREVIEW = /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(BASE);
/** Deploy hash / branch aliases on Pages lack R2 bindings for /assets/* (503). */
const IS_EPHEMERAL_PAGES = (() => {
  try {
    const host = new URL(BASE).hostname;
    return (
      /\.cloudflare-starter-hub(-uat)?\.pages\.dev$/i.test(host) &&
      !/^cloudflare-starter-hub(-uat)?\.pages\.dev$/i.test(host)
    );
  } catch {
    return false;
  }
})();
const R2_ASSET_PREVIEW = IS_LOCAL_PREVIEW || IS_EPHEMERAL_PAGES;

const SMOKE_UA = 'cloudflare-starter-hub-smoke/1.0 (+https://onboarding.orangecloud.vn)';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function siteFetch(url, options = {}, attempt = 1) {
  const { headers, ...rest } = options;
  const res = await fetch(url, {
    redirect: 'follow',
    ...rest,
    headers: {
      'User-Agent': SMOKE_UA,
      ...headers,
    },
  });
  if (res.status === 429 && attempt < 2) {
    await sleep(2000);
    return siteFetch(url, options, attempt + 1);
  }
  return res;
}

const ROUTES = [
  '/',
  '/start-here',
  '/content-roadmap',
  '/cheatsheets/ai-protection-portfolio',
  '/roadmaps',
  '/roadmaps/sales',
  '/roadmaps/solution-engineer',
  '/roadmaps/developer',
  '/roadmaps/it-admin',
  '/roadmaps/startup-founder',
  '/roadmaps/student',
  '/search',
  '/first-week',
  '/cloudflare-101',
  '/choose-your-path',
  '/tracks',
  '/tracks/application-services',
  '/tracks/application-services/as-1-l1',
  '/tracks/developer-platform/dp-1-l1',
  '/tracks/developer-platform/dp-5-l1',
  '/tracks/developer-platform/dp-5-l5',
  '/tracks/cloudflare-one/c1-1-l1',
  '/tracks/cloudflare-one/c1-2-l1',
  '/tracks/cloudflare-one/c1-3-l1',
  '/tracks/cloudflare-one/c1-5-l1',
  '/tracks/cloudflare-one/c1-7-l1',
  '/tracks/cloudflare-one/c1-8-l1',
  '/tracks/operational-excellence',
  '/tracks/operational-excellence/oe-1-l1',
  '/tracks/developer-platform',
  '/tracks/developer-platform/labs/',
  '/tracks/developer-platform/labs/workers/',
  '/tracks/developer-platform/labs/workers/01-getting-started/',
  '/tracks/cloudflare-one',
  '/use-cases/',
  '/use-cases/application-services/',
  '/use-cases/developer-platform/',
  '/use-cases/cloudflare-one/',
  '/use-cases/protect-website/',
  '/use-cases/secure-api/',
  '/use-cases/defend-ddos-attacks/',
  '/use-cases/build-serverless-app/',
  '/use-cases/deploy-static-site/',
  '/use-cases/replace-vpn/',
  '/use-cases/secure-remote-users/',
  '/use-cases/secure-saas-access/',
  '/use-cases/accelerate-content-delivery/',
  '/use-cases/ecommerce-security-performance/',
  '/use-cases/media-streaming-delivery/',
  '/use-cases/build-ai-applications/',
  '/use-cases/govern-enterprise-ai/',
  '/use-cases/operate-cloudflare-workloads/',
  '/use-cases/operational-excellence/',
  '/use-cases/ai-security-adoption/',
  '/use-cases/build-saas-platform/',
  '/use-cases/company-wide-security/',
  '/checklists/beginner-cloudflare-checklist',
  '/quiz/beginner-readiness',
  '/glossary',
  '/blog/',
  '/blog/cdn-la-gi-cloudflare-cache-cho-nguoi-moi/',
  '/blog/waf-bao-ve-website-cho-nguoi-moi/',
  '/blog/cloudflare-workers-la-gi-cho-nguoi-moi/',
  '/blog/workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu/',
  '/blog/ai-gateway-kiem-soat-va-bao-ve-traffic-ai/',
  '/blog/developer-platform-xay-ung-dung-khong-can-quan-ly-server/',
  '/products',
  '/products/workers',
  '/products/waf',
  '/products/zero-trust',
  '/resources',
  '/changelog',
  '/status',
  '/plans',
  '/enterprise',
  '/demo-guides',
  '/content-delivery',
  '/solutions',
  '/solutions/application-security',
  '/solutions/cloudflare-one-sase',
  '/solutions/email-security',
  '/workshop',
  '/privacy',
  '/thank-you',
  '/docs/api/',
  '/auth.md',
  '/.well-known/api-catalog',
  '/.well-known/openapi.json',
  '/.well-known/oauth-authorization-server',
  '/.well-known/oauth-protected-resource',
  '/.well-known/agent-skills/index.json',
  '/.well-known/mcp/server-card.json',
  '/.well-known/agent-card.json',
];

const AGENT_JSON_ROUTES = [
  { path: '/.well-known/api-catalog', type: 'linkset' },
  { path: '/.well-known/agent-skills/index.json', type: 'json' },
  { path: '/.well-known/mcp/server-card.json', type: 'json' },
  { path: '/.well-known/agent-card.json', type: 'json' },
  { path: '/.well-known/oauth-authorization-server', type: 'json' },
];

const API_ROUTES = ['/api/workshop-events', '/api/site-config', '/api/search'];

const ASSET_ROUTES = [
  '/assets/favicon.svg',
  '/assets/og-image.svg',
  '/ref-diagrams/ai/ai-rag/0.webp',
  '/ref-diagrams/serverless/fullstack-application/0.webp',
  '/ref-diagrams/content-delivery/distributed-web-performance-architecture/0.webp',
];
const CSS_ROUTES = ['/styles/site.css'];

const FAIL_PATTERNS = [
  /Astro island hydration error/i,
  /document is not defined/i,
  /Cannot find module/i,
  /404: Not found/i,
  /<title>404/i,
];

function extractInternalLinks(html, fromPath) {
  const links = new Set();
  const re = /href="(\/[^"#?]*)/g;
  let m;
  while ((m = re.exec(html))) {
    let path = m[1];
    if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
    links.add(path);
  }
  return [...links];
}

async function fetchPath(path, { redirect = 'follow' } = {}) {
  const url = `${BASE}${path}`;
  const res = await siteFetch(url, { redirect });
  const text = await res.text();
  return { path, url, status: res.status, text, ok: res.ok };
}

/** Retry directory-style paths with a trailing slash when the bare path 404s. */
async function fetchPathResolved(path, options) {
  const first = await fetchPath(path, options);
  if (first.ok || path.endsWith('/') || path.includes('.')) return first;
  const second = await fetchPath(`${path}/`, options);
  return second.ok ? second : first;
}

const PROTECTED_ROUTES = ['/admin', '/workshop/admin'];

const errors = [];
const warnings = [];

console.log(`\nSmoke test → ${BASE}\n`);

for (const path of ROUTES) {
  try {
    if (!IS_LOCAL_PREVIEW) await sleep(15);
    const { status, text, ok } = await fetchPath(path);
    if (!ok) {
      if (!IS_LOCAL_PREVIEW && status === 429) {
        warnings.push(`${path} → HTTP 429 (rate limited)`);
        continue;
      }
      errors.push(`${path} → HTTP ${status}`);
      continue;
    }
    for (const pat of FAIL_PATTERNS) {
      if (pat.test(text)) errors.push(`${path} → matched error pattern ${pat}`);
    }
    if (!text.includes('<main')) warnings.push(`${path} → missing <main>`);
    console.log(`✓ ${path}`);
  } catch (e) {
    errors.push(`${path} → ${e.message}`);
  }
}

for (const path of PROTECTED_ROUTES) {
  try {
    const { status } = await fetchPath(path, { redirect: 'manual' });
    if (status === 302 || status === 303 || status === 308 || status === 401 || status === 403) {
      console.log(`✓ (protected) ${path} → HTTP ${status}`);
      continue;
    }
    if (status >= 200 && status < 300) {
      warnings.push(`${path} → publicly reachable (HTTP ${status}); configure Cloudflare Access`);
      console.log(`⚠ (protected) ${path} → HTTP ${status} (no Access redirect yet)`);
      continue;
    }
    errors.push(`${path} → HTTP ${status}`);
  } catch (e) {
    errors.push(`${path} → ${e.message}`);
  }
}

for (const path of CSS_ROUTES) {
  try {
    const res = await siteFetch(`${BASE}${path}`, { redirect: 'follow' });
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (res.status === 302 || res.status === 303) {
      errors.push(`${path} → HTTP ${res.status} (Access may block static CSS — see docs/WORKSHOP-ADMIN-ACCESS.md)`);
    } else if (!res.ok) {
      errors.push(`${path} → HTTP ${res.status}`);
    } else if (ct.includes('text/html')) {
      errors.push(`${path} → HTML soft-404 (CSS missing — redeploy or fix Access bypass)`);
    } else if (!ct.includes('text/css')) {
      errors.push(`${path} → expected text/css, got ${ct || '(none)'}`);
    } else {
      console.log(`✓ ${path}`);
    }
  } catch (e) {
    errors.push(`${path} → ${e.message}`);
  }
}

for (const path of ASSET_ROUTES) {
  try {
    const res = await siteFetch(`${BASE}${path}`, { redirect: 'follow' });
    if (!res.ok) {
      if (R2_ASSET_PREVIEW && res.status === 503 && path.startsWith('/assets/')) {
        warnings.push(`${path} → HTTP 503 (R2 /assets/* unavailable on Pages preview URL)`);
      } else {
        errors.push(`${path} → HTTP ${res.status}`);
      }
    }
    else {
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('image/')) warnings.push(`${path} → unexpected content-type ${ct}`);
      const cc = (res.headers.get('cache-control') || '').toLowerCase();
      if (!cc.includes('immutable')) warnings.push(`${path} → expected immutable Cache-Control, got ${cc || '(none)'}`);
      console.log(`✓ ${path}`);
    }
  } catch (e) {
    errors.push(`${path} → ${e.message}`);
  }
}

try {
  const homeRes = await siteFetch(`${BASE}/`, { redirect: 'follow' });
  const link = homeRes.headers.get('link') || '';
  if (!link.includes('api-catalog')) errors.push('headers / → missing Link rel=api-catalog');
  else console.log('✓ (link) / Link api-catalog');
} catch (e) {
  errors.push(`headers / Link → ${e.message}`);
}

for (const { path, type } of AGENT_JSON_ROUTES) {
  try {
    const res = await siteFetch(`${BASE}${path}`, {
      redirect: 'follow',
      headers: { Accept: 'application/linkset+json, application/json' },
    });
    if (!res.ok) {
      errors.push(`agent ${path} → HTTP ${res.status}`);
      continue;
    }
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) errors.push(`agent ${path} → HTML soft-404`);
    else if (type === 'linkset' && !ct.includes('linkset') && !ct.includes('json')) {
      errors.push(`agent ${path} → expected linkset/json, got ${ct}`);
    } else console.log(`✓ (agent) ${path}`);
  } catch (e) {
    errors.push(`agent ${path} → ${e.message}`);
  }
}

const HEADER_CHECKS = [
  { path: '/use-cases/', expect: (cc) => cc.includes('stale-while-revalidate'), label: 'HTML SWR' },
  { path: '/sitemap-index.xml', expect: (cc) => cc.includes('max-age=3600'), label: 'sitemap TTL' },
  { path: '/sitemap.xml', expect: (cc) => cc.includes('max-age=3600'), label: 'sitemap.xml TTL' },
  { path: '/robots.txt', expect: (cc) => cc.includes('max-age=86400'), label: 'robots TTL' },
];

for (const { path, expect, label } of HEADER_CHECKS) {
  try {
    const res = await siteFetch(`${BASE}${path}`, { redirect: 'follow' });
    if (!res.ok) {
      errors.push(`headers ${path} → HTTP ${res.status}`);
      continue;
    }
    const cc = (res.headers.get('cache-control') || '').toLowerCase();
    if (!expect(cc)) errors.push(`headers ${path} → ${label} failed (${cc || 'none'})`);
    else console.log(`✓ (cache) ${path}`);
  } catch (e) {
    errors.push(`headers ${path} → ${e.message}`);
  }
}

try {
  const home = await siteFetch(`${BASE}/`, { redirect: 'follow' });
  const html = await home.text();
  const astroCss = html.match(/href="(\/_astro\/[^"]+\.css)"/);
  if (astroCss) {
    const res = await siteFetch(`${BASE}${astroCss[1]}`, { redirect: 'follow' });
    const cc = (res.headers.get('cache-control') || '').toLowerCase();
    if (!cc.includes('immutable')) errors.push(`/_astro CSS → expected immutable, got ${cc || 'none'}`);
    else console.log(`✓ (cache) ${astroCss[1]}`);
  }
} catch (e) {
  errors.push(`/_astro CSS headers → ${e.message}`);
}

for (const path of API_ROUTES) {
  try {
    const { status, text, ok } = await fetchPath(path);
    if (status >= 500) errors.push(`${path} → HTTP ${status}`);
    else if (ok) {
      try {
        const json = JSON.parse(text);
        if (json.ok === false) warnings.push(`${path} → ok:false (${json.error || 'unknown'})`);
      } catch {
        /* non-json API on static preview */
      }
    } else if (status === 404) warnings.push(`${path} → HTTP 404 (static preview — use wrangler pages dev)`);
    else if (status !== 401 && status !== 503)
      warnings.push(`${path} → HTTP ${status}`);
  } catch (e) {
    warnings.push(`${path} → ${e.message}`);
  }
}

// Link crawl from homepage + resources (skip when rate limits are likely, e.g. post-deploy CI)
const crawlRoots = process.env.SMOKE_SKIP_LINK_CRAWL ? [] : ['/', '/resources'];
const seen = new Set(ROUTES);
const toCheck = [];

for (const root of crawlRoots) {
  const { text, ok } = await fetchPath(root);
  if (!ok) continue;
  for (const link of extractInternalLinks(text, root)) {
    if (!seen.has(link) && !link.startsWith('/api')) {
      seen.add(link);
      toCheck.push(link);
    }
  }
}

for (const path of toCheck) {
  try {
    if (!IS_LOCAL_PREVIEW) await sleep(75);
    const { status, ok } = await fetchPathResolved(path);
    if (!ok) {
      if (R2_ASSET_PREVIEW && status === 503 && path.startsWith('/assets/')) {
        warnings.push(`discovered link ${path} → HTTP 503 (R2 /assets/* unavailable on Pages preview URL)`);
      } else if (status === 429) {
        warnings.push(`discovered link ${path} → HTTP 429 (rate limited; retry manually if needed)`);
      } else {
        errors.push(`discovered link ${path} → HTTP ${status}`);
      }
    }
    else console.log(`✓ (link) ${path}`);
  } catch (e) {
    errors.push(`discovered link ${path} → ${e.message}`);
  }
}

const PERSON_ID = 'https://orangecloud.vn/#person';

function canonicalHref(html) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/i);
  return m ? m[1] : '';
}

/** Path only — UAT builds use PUBLIC_SITE_URL=https://uat.onboarding.orangecloud.vn. */
const CANONICAL_CHECKS = [
  ['/', '/'],
  ['/glossary', '/glossary/'],
  ['/products/workers', '/products/workers/'],
  ['/changelog', '/changelog/'],
  ['/tracks/application-services', '/tracks/application-services/'],
  ['/blog/dns-proxy-dam-may-cam-cho-nguoi-moi/', '/blog/dns-proxy-dam-may-cam-cho-nguoi-moi/'],
];

let canonicalOrigin = '';
for (const [path, expectedPath] of CANONICAL_CHECKS) {
  try {
    const { status, text, ok } = await fetchPathResolved(path);
    const href = canonicalHref(text);
    let pathname = '';
    let origin = '';
    try {
      const url = new URL(href);
      pathname = url.pathname;
      origin = url.origin;
    } catch {
      /* missing or relative */
    }
    if (!canonicalOrigin && origin) canonicalOrigin = origin;
    if (!ok) errors.push(`canonical ${path} → HTTP ${status}`);
    else if (pathname !== expectedPath) {
      errors.push(`canonical ${path} → ${href || '(missing)'} (expected path ${expectedPath})`);
    } else if (canonicalOrigin && origin !== canonicalOrigin) {
      errors.push(`canonical ${path} → origin ${origin} (expected ${canonicalOrigin})`);
    } else console.log(`✓ (canonical) ${path}`);
  } catch (e) {
    errors.push(`canonical ${path} → ${e.message}`);
  }
}

try {
  const home = await fetchPath('/');
  if (!home.ok) errors.push(`seo / → HTTP ${home.status}`);
  else {
    const before = errors.length;
    if (/<meta name="twitter:site"/i.test(home.text)) errors.push('seo / → twitter:site is still present');
    if (!home.text.includes('Not a Cloudflare, Inc. publication.')) {
      errors.push('seo / → missing non-affiliation disclaimer');
    }
    if (!home.text.includes(PERSON_ID)) errors.push(`seo / → WebSite JSON-LD missing ${PERSON_ID}`);
    if (/"worksFor"\s*:/.test(home.text) || /"jobTitle"\s*:/.test(home.text)) {
      errors.push('seo / → schema includes a Cloudflare role (worksFor or jobTitle)');
    }
    if (!/hreflang="vi"/i.test(home.text) || !/hreflang="en"/i.test(home.text)) {
      errors.push('seo / → missing vi/en hreflang');
    }
    if (!/"@type":"FAQPage"/.test(home.text)) errors.push('seo / → missing FAQPage');
    if (!home.text.includes('https://orangecloud.vn/')) errors.push('seo / → missing hub link');
    if (errors.length === before) console.log('✓ (seo) homepage schema, disclaimer, no twitter:site');
  }
} catch (e) {
  errors.push(`seo / → ${e.message}`);
}

try {
  const post = await fetchPath('/blog/dns-proxy-dam-may-cam-cho-nguoi-moi/');
  if (!post.ok) errors.push(`seo blog post → HTTP ${post.status}`);
  else if (!/"@type":"BlogPosting"/.test(post.text)) errors.push('seo blog post → missing BlogPosting');
  else if (!post.text.includes(PERSON_ID)) errors.push('seo blog post → BlogPosting does not reference the Person @id');
  else if (/"worksFor"\s*:/.test(post.text) || /"jobTitle"\s*:/.test(post.text)) {
    errors.push('seo blog post → schema includes a Cloudflare role');
  } else if (/<meta name="twitter:site"/i.test(post.text)) {
    errors.push('seo blog post → twitter:site is still present');
  } else console.log('✓ (seo) blog post BlogPosting');
} catch (e) {
  errors.push(`seo blog post → ${e.message}`);
}

try {
  const missing = await fetchPath('/this-page-does-not-exist-xyz/');
  if (missing.status !== 404) errors.push(`soft-404 /this-page-does-not-exist-xyz/ → HTTP ${missing.status} (expected 404)`);
  else if (!/noindex/i.test(missing.text)) errors.push('soft-404 page → missing noindex');
  else if (!missing.text.includes('Not a Cloudflare, Inc. publication.')) {
    errors.push('soft-404 page → missing disclaimer');
  } else {
    let pathname = '';
    try {
      pathname = new URL(canonicalHref(missing.text)).pathname;
    } catch {
      pathname = '';
    }
    if (pathname !== '/404') {
      errors.push(`soft-404 page → canonical ${canonicalHref(missing.text) || '(missing)'} (expected path /404)`);
    } else console.log('✓ (seo) unknown URL returns 404');
  }
} catch (e) {
  errors.push(`soft-404 → ${e.message}`);
}

try {
  const llmsRes = await siteFetch(`${BASE}/llms.txt`, { redirect: 'manual' });
  const llmsText = await llmsRes.text();
  const llmsType = (llmsRes.headers.get('content-type') || '').toLowerCase();
  if (llmsRes.status !== 200) errors.push(`/llms.txt → HTTP ${llmsRes.status}`);
  else if (llmsType.includes('text/html') || llmsText.includes('<html')) {
    errors.push('/llms.txt → HTML soft-404');
  } else if (!llmsType.includes('text/plain')) {
    errors.push(`/llms.txt → expected text/plain, got ${llmsType || '(none)'}`);
  } else if (!llmsText.includes('Not a publication of Cloudflare, Inc.')) {
    errors.push('/llms.txt → missing non-affiliation line');
  } else console.log('✓ (seo) /llms.txt');
} catch (e) {
  errors.push(`/llms.txt → ${e.message}`);
}

try {
  const robotsRes = await siteFetch(`${BASE}/robots.txt`, { redirect: 'follow' });
  const robotsText = await robotsRes.text();
  const signal = 'Content-Signal: ai-train=no, search=yes, ai-input=no';
  if (!robotsRes.ok) errors.push(`/robots.txt → HTTP ${robotsRes.status}`);
  else if (!robotsText.includes(signal)) errors.push(`/robots.txt → Content-Signal changed (${robotsText.trim()})`);
  else if (/ai-input=yes/.test(robotsText)) errors.push('/robots.txt → ai-input=yes must stay no');
  else if (!/Sitemap:\s+\S+\/sitemap\.xml/i.test(robotsText)) errors.push('/robots.txt → missing Sitemap sitemap.xml');
  else console.log('✓ (seo) robots Content-Signal unchanged');

try {
  const sitemapRes = await siteFetch(`${BASE}/sitemap.xml`, { redirect: 'follow' });
  const sitemapXml = await sitemapRes.text();
  if (!sitemapRes.ok) errors.push(`/sitemap.xml → HTTP ${sitemapRes.status}`);
  else if (!sitemapXml.includes('<urlset')) errors.push('/sitemap.xml → missing urlset');
  else if (!sitemapXml.includes('hreflang="vi"') || !sitemapXml.includes('hreflang="en"')) {
    errors.push('/sitemap.xml → missing vi/en hreflang');
  } else console.log('✓ (seo) /sitemap.xml');
} catch (e) {
  errors.push(`/sitemap.xml → ${e.message}`);
}

try {
  const tracks = await fetchPath('/tracks/');
  if (!tracks.ok) errors.push(`seo /tracks/ → HTTP ${tracks.status}`);
  else if (!/"@type":"Course"/.test(tracks.text)) errors.push('seo /tracks/ → missing Course');
  else console.log('✓ (seo) /tracks/ Course');
} catch (e) {
  errors.push(`seo /tracks/ → ${e.message}`);
}

try {
  const week = await fetchPath('/first-week/');
  if (!week.ok) errors.push(`seo /first-week/ → HTTP ${week.status}`);
  else if (!/"@type":"HowTo"/.test(week.text)) errors.push('seo /first-week/ → missing HowTo');
  else console.log('✓ (seo) /first-week/ HowTo');
} catch (e) {
  errors.push(`seo /first-week/ → ${e.message}`);
}

if (IS_LOCAL_PREVIEW) {
  try {
    const preview = await siteFetch(`${BASE}/`, { redirect: 'follow' });
    const tag = preview.headers.get('x-robots-tag') || '';
    if (!/noindex/i.test(tag)) errors.push('non-canonical host → missing X-Robots-Tag: noindex');
    else console.log('✓ (seo) non-canonical host X-Robots-Tag');
  } catch (e) {
    errors.push(`non-canonical X-Robots-Tag → ${e.message}`);
  }
}
} catch (e) {
  errors.push(`/robots.txt → ${e.message}`);
}

console.log('\n--- Summary ---');
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}
if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log('All route checks passed.\n');
