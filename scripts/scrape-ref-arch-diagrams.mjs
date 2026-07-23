/**
 * Scrape reference architecture diagram images from developers.cloudflare.com
 * Usage: node scripts/scrape-ref-arch-diagrams.mjs
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const OUTPUT_FILE = 'src/data/referenceDiagrams.data.json';
const ASSET_DIR = 'public/ref-diagrams';

function cleanImageEntry(raw) {
  const match = raw.match(/^(https:\/\/developers\.cloudflare\.com\/_astro\/[^\s"]+\.(?:svg|webp|png)[^\s"]*)/);
  const url = match?.[1] ?? raw.split(' ')[0];
  const altMatch = raw.match(/"([^"]+)"/);
  const alt = altMatch?.[1] ?? '';
  return { url, alt };
}

function imageFile(category, slug, index, sourceUrl) {
  const sourceExtension = new URL(sourceUrl).pathname.match(/\.(svg|webp|png)$/i)?.[1]?.toLowerCase();
  if (!sourceExtension) throw new Error(`Unsupported diagram image format: ${sourceUrl}`);
  // Some browsers reject the upstream SVG diagrams despite valid XML and image
  // responses. WebP avoids that renderer-specific failure while remaining compact.
  const extension = sourceExtension === 'svg' ? 'webp' : sourceExtension;
  return `${category}/${slug}/${index}.${extension}`;
}

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${url}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function downloadAsset(asset) {
  const source = await fetchBuffer(asset.sourceUrl);
  const body = asset.sourceUrl.endsWith('.svg')
    ? await sharp(source).webp({ quality: 90 }).toBuffer()
    : source;
  return { ...asset, body };
}

const llms = await fetch('https://developers.cloudflare.com/reference-architecture/llms.txt').then((r) =>
  r.text(),
);
const mdUrls = [
  ...llms.matchAll(/\((https:\/\/developers\.cloudflare\.com\/reference-architecture\/diagrams\/[^)]+index\.md)\)/g),
].map((m) => m[1]);

const out = [];
const assets = [];
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
  // The documentation footer includes the Cloudflare logo as a markdown image.
  // It is not part of a reference architecture diagram.
  const images = rawImgs
    .map(cleanImageEntry)
    .filter((image) => !/\/logo\.[^/]+$/.test(image.url));
  const category = pageUrl.split('/diagrams/')[1]?.split('/')[0] || '';
  const slug = pageUrl.split('/').filter(Boolean).pop();
  if (images.length) {
    const localImages = images.map((image, index) => {
      const file = imageFile(category, slug, index, image.url);
      assets.push({ file, sourceUrl: image.url });
      return { sourceUrl: image.url, file, alt: image.alt };
    });
    out.push({ slug, category, title, desc, pageUrl, images: localImages });
  }
  await new Promise((r) => setTimeout(r, 80));
}

const downloadedAssets = await Promise.all(
  assets.map(downloadAsset),
);

rmSync(ASSET_DIR, { recursive: true, force: true });
for (const asset of downloadedAssets) {
  const path = join(ASSET_DIR, asset.file);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, asset.body);
}

writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} diagrams and ${downloadedAssets.length} local images`);
