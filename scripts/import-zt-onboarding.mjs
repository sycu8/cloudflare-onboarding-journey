/**
 * Import follow-along pages from zerotrust.cfsase.workers.dev into
 * src/data/zeroTrustOnboarding.data.json (EN + VI where the source is translated).
 *
 * Usage: node scripts/import-zt-onboarding.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'https://zerotrust.cfsase.workers.dev';
const OUT_JSON = join(root, 'src/data/zeroTrustOnboarding.data.json');
const ASSET_DIR = join(root, 'public/images/tracks/cloudflare-one');

export const PAGE_TO_HREF = {
  'overview.html': '/tracks/cloudflare-one',
  'architecture.html': '/tracks/cloudflare-one/c1-1-l1',
  'module-1-account-setup.html': '/tracks/cloudflare-one/c1-1-l2',
  'module-1b-account-administration.html': '/tracks/cloudflare-one/c1-1-l3',
  'module-2-identity-provider.html': '/tracks/cloudflare-one/c1-2-l1',
  'module-3-device-enrollment.html': '/tracks/cloudflare-one/c1-3-l1',
  'module-3b-device-profiles.html': '/tracks/cloudflare-one/c1-3-l2',
  'module-3c-posture-checks.html': '/tracks/cloudflare-one/c1-3-l3',
  'module-4-ztna-access.html': '/tracks/cloudflare-one/c1-4-l1',
  'module-4b-connectors.html': '/tracks/cloudflare-one/c1-4-l2',
  'module-5-gateway.html': '/tracks/cloudflare-one/c1-5-l1',
  'module-5b-egress-policies.html': '/tracks/cloudflare-one/c1-5-l2',
  'module-5c-remote-browser-isolation.html': '/tracks/cloudflare-one/c1-5-l3',
  'module-5d-shadow-it.html': '/tracks/cloudflare-one/c1-5-l4',
  'module-6-dlp.html': '/tracks/cloudflare-one/c1-6-l1',
  'module-7-ai-controls.html': '/tracks/cloudflare-one/c1-7-l1',
  'module-7b-mcp-portals.html': '/tracks/cloudflare-one/c1-7-l2',
  'module-7c-ai-gateway.html': '/tracks/cloudflare-one/c1-7-l3',
  'module-7d-agentic-internet.html': '/tracks/cloudflare-one/c1-7-l4',
  'module-8-magic-wan.html': '/tracks/cloudflare-one/c1-8-l1',
  'best-practice-guide.html': '/tracks/cloudflare-one/c1-9-l1',
  'configuration-runbook.html': '/tracks/cloudflare-one/c1-9-l2',
};

const PAGES = Object.keys(PAGE_TO_HREF);
const LOCAL_ASSETS = new Set(['architecture.svg', 'workflow.svg', 'aisecurity.svg']);

function stripArticle(html) {
  const m = html.match(/<article class="md">([\s\S]*?)<\/article>/);
  if (!m) throw new Error('No article.md found');
  return m[1].trim();
}

function isUntranslatedVi(html) {
  return /chưa được dịch sang tiếng Việt|đang hiển thị nội dung tiếng Anh/i.test(html);
}

function rewrite(html, lang) {
  let out = html;
  out = out.replace(
    /<blockquote>\s*<p>\s*🌐\s*Trang này chưa được dịch[\s\S]*?<\/blockquote>/gi,
    '',
  );
  out = out.replace(/\s*on\w+="[^"]*"/gi, '');
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  for (const [page, href] of Object.entries(PAGE_TO_HREF)) {
    const viHref = lang === 'vi' && href === '/tracks/cloudflare-one' ? href : href;
    out = out.replaceAll(`href="/vi/${page}"`, `href="${viHref}"`);
    out = out.replaceAll(`href="/${page}"`, `href="${href}"`);
  }
  out = out.replace(/src="\/assets\/(architecture|workflow|aisecurity)\.svg"/g, (_, name) => {
    const file = lang === 'vi' ? `${name}.vi.svg` : `${name}.svg`;
    return `src="/images/tracks/cloudflare-one/${file}"`;
  });
  out = out.replace(/href="\/vi\/"/g, 'href="/tracks/cloudflare-one"');
  out = out.replace(/href="\/"/g, 'href="/tracks/cloudflare-one"');
  return out.trim();
}

function firstParagraph(html) {
  const m = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function titleFromH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchPage(lang, page) {
  const url = lang === 'vi' ? `${SOURCE}/vi/${page}` : `${SOURCE}/${page}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'cloudflare-starter-hub-import' } });
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.text();
}

async function downloadAssets() {
  mkdirSync(ASSET_DIR, { recursive: true });
  for (const file of LOCAL_ASSETS) {
    const dest = join(ASSET_DIR, file);
    if (existsSync(dest) && readFileSync(dest).length > 100) continue;
    const res = await fetch(`${SOURCE}/assets/${file}`);
    if (!res.ok) throw new Error(`asset ${file} HTTP ${res.status}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
}

export async function importOnboarding() {
  await downloadAssets();
  const pages = [];
  for (const page of PAGES) {
    const enHtml = rewrite(stripArticle(await fetchPage('en', page)), 'en');
    const viRaw = stripArticle(await fetchPage('vi', page));
    const viTranslated = !isUntranslatedVi(viRaw);
    const viHtml = viTranslated ? rewrite(viRaw, 'vi') : '';
    pages.push({
      page,
      href: PAGE_TO_HREF[page],
      sourceUrl: `${SOURCE}/${page}`,
      sourceUrlVi: `${SOURCE}/vi/${page}`,
      titleEn: titleFromH1(enHtml),
      titleVi: viTranslated ? titleFromH1(viHtml) : '',
      ledeEn: firstParagraph(enHtml),
      ledeVi: viTranslated ? firstParagraph(viHtml) : '',
      htmlEn: enHtml,
      htmlVi: viHtml,
      viFromSource: viTranslated,
    });
    console.log(`${page} en=${enHtml.length} vi=${viHtml.length || 'needs-translation'}`);
  }
  const payload = {
    source: SOURCE,
    importedAt: new Date().toISOString().slice(0, 10),
    attribution:
      'Community Cloudflare Zero Trust onboarding guide (zerotrust.cfsase.workers.dev) — not an official Cloudflare publication.',
    pages,
  };
  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${OUT_JSON}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  await importOnboarding();
}
