/**
 * Scrape reference architecture diagram images from developers.cloudflare.com
 * Usage: node scripts/scrape-ref-arch-diagrams.mjs
 */
import { writeFileSync } from 'node:fs';

function cleanImageEntry(raw) {
  const match = raw.match(/^(https:\/\/developers\.cloudflare\.com\/_astro\/[^\s"]+\.(?:svg|webp|png)[^\s"]*)/);
  const url = match?.[1] ?? raw.split(' ')[0];
  const altMatch = raw.match(/"([^"]+)"/);
  const alt = altMatch?.[1] ?? '';
  return { url, alt };
}

const llms = await fetch('https://developers.cloudflare.com/reference-architecture/llms.txt').then((r) =>
  r.text(),
);
const mdUrls = [
  ...llms.matchAll(/\((https:\/\/developers\.cloudflare\.com\/reference-architecture\/diagrams\/[^)]+index\.md)\)/g),
].map((m) => m[1]);

const out = [];
for (const mdUrl of mdUrls) {
  const pageUrl = mdUrl.replace(/index\.md$/, '');
  const md = await fetch(mdUrl, { headers: { Accept: 'text/markdown' } }).then((r) => r.text());
  const title = (md.match(/^title:\s*(.+)$/m) || [])[1]?.trim() || '';
  const desc = (md.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || '';
  const rawImgs = [
    ...md.matchAll(
      /!\[[^\]]*\]\((https:\/\/developers\.cloudflare\.com\/_astro\/[^)]+\.(?:svg|webp|png)[^)]*)\)/g,
    ),
  ].map((m) => m[1]);
  const images = rawImgs.map(cleanImageEntry);
  const category = pageUrl.split('/diagrams/')[1]?.split('/')[0] || '';
  if (images.length) {
    out.push({ slug: pageUrl.split('/').filter(Boolean).pop(), category, title, desc, pageUrl, images });
  }
  await new Promise((r) => setTimeout(r, 80));
}

writeFileSync('src/data/referenceDiagrams.data.json', JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} diagrams to src/data/referenceDiagrams.data.json`);
