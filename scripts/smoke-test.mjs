/**
 * Smoke test: all static routes + internal links + API health.
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 */
const BASE = (process.argv[2] || 'http://127.0.0.1:4321').replace(/\/$/, '');

const ROUTES = [
  '/',
  '/start-here',
  '/first-week',
  '/cloudflare-101',
  '/choose-your-path',
  '/tracks',
  '/tracks/application-services',
  '/tracks/application-services/as-1-l1',
  '/tracks/developer-platform/dp-1-l1',
  '/tracks/cloudflare-one/c1-2-l1',
  '/tracks/developer-platform',
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
  '/use-cases/build-saas-platform/',
  '/use-cases/company-wide-security/',
  '/checklists/beginner-cloudflare-checklist',
  '/quiz/beginner-readiness',
  '/glossary',
  '/products',
  '/products/workers',
  '/products/waf',
  '/products/zero-trust',
  '/resources',
  '/changelog',
  '/status',
  '/plans',
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

const ASSET_ROUTES = ['/assets/favicon.svg', '/assets/og-image.svg'];
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
  const res = await fetch(url, { redirect });
  const text = await res.text();
  return { path, url, status: res.status, text, ok: res.ok };
}

const PROTECTED_ROUTES = ['/admin', '/workshop/admin'];

const errors = [];
const warnings = [];

console.log(`\nSmoke test → ${BASE}\n`);

for (const path of ROUTES) {
  try {
    const { status, text, ok } = await fetchPath(path);
    if (!ok) {
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
    if (status === 302 || status === 303 || status === 401 || status === 403) {
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
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
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
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
    if (!res.ok) errors.push(`${path} → HTTP ${res.status}`);
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
  const homeRes = await fetch(`${BASE}/`, { redirect: 'follow' });
  const link = homeRes.headers.get('link') || '';
  if (!link.includes('api-catalog')) errors.push('headers / → missing Link rel=api-catalog');
  else console.log('✓ (link) / Link api-catalog');
} catch (e) {
  errors.push(`headers / Link → ${e.message}`);
}

for (const { path, type } of AGENT_JSON_ROUTES) {
  try {
    const res = await fetch(`${BASE}${path}`, {
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
  { path: '/robots.txt', expect: (cc) => cc.includes('max-age=86400'), label: 'robots TTL' },
];

for (const { path, expect, label } of HEADER_CHECKS) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
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
  const home = await fetch(`${BASE}/`, { redirect: 'follow' });
  const html = await home.text();
  const astroCss = html.match(/href="(\/_astro\/[^"]+\.css)"/);
  if (astroCss) {
    const res = await fetch(`${BASE}${astroCss[1]}`, { redirect: 'follow' });
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

// Link crawl from homepage + resources
const crawlRoots = ['/', '/resources'];
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
    const { status, ok } = await fetchPath(path);
    if (!ok) errors.push(`discovered link ${path} → HTTP ${status}`);
    else console.log(`✓ (link) ${path}`);
  } catch (e) {
    errors.push(`discovered link ${path} → ${e.message}`);
  }
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
