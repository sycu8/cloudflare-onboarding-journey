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
  '/tracks/developer-platform',
  '/tracks/cloudflare-one',
  '/use-cases/protect-website',
  '/use-cases/secure-api',
  '/use-cases/build-serverless-app',
  '/use-cases/replace-vpn',
  '/use-cases/secure-remote-users',
  '/checklists/beginner-cloudflare-checklist',
  '/quiz/beginner-readiness',
  '/glossary',
  '/resources',
  '/plans',
  '/workshop',
  '/workshop/admin',
  '/privacy',
  '/thank-you',
];

const API_ROUTES = ['/api/workshop-events', '/api/site-config'];

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

async function fetchPath(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  return { path, url, status: res.status, text, ok: res.ok };
}

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
