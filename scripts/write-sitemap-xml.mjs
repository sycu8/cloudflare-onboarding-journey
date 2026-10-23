/**
 * @astrojs/sitemap emits sitemap-index.xml + sitemap-N.xml.
 * Crawlers request /sitemap.xml, which otherwise 404s. This writes one urlset
 * and repeats vi/en hreflang on every URL (both languages live on the same page).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const chunks = readdirSync(dist)
  .filter((name) => /^sitemap-\d+\.xml$/.test(name))
  .sort();

if (chunks.length === 0) {
  console.error('write-sitemap-xml: no dist/sitemap-N.xml chunks (run astro build first)');
  process.exit(1);
}

/** @type {{ loc: string, lastmod?: string }[]} */
const urls = [];

for (const file of chunks) {
  const xml = readFileSync(join(dist, file), 'utf8');
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    if (/\/(?:admin|workshop\/admin)(?:\/|$)/.test(loc) || /\/404(?:\.html)?$/.test(loc)) continue;
    const lastmod = block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    urls.push(lastmod ? { loc, lastmod } : { loc });
  }
}

if (urls.length === 0) {
  console.error('write-sitemap-xml: chunks contained no <url> entries');
  process.exit(1);
}

const body = urls
  .map(({ loc, lastmod }) => {
    const lines = ['  <url>', `    <loc>${loc}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    for (const lang of ['vi', 'en', 'x-default']) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc}"/>`);
    }
    lines.push('  </url>');
    return lines.join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

writeFileSync(join(dist, 'sitemap.xml'), xml);
console.log(`✓ dist/sitemap.xml (${urls.length} urls)`);
