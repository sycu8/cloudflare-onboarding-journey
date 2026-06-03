/**
 * Mirror public static files into dist/assets for astro preview and fallback hosting.
 * Production still prefers R2 via functions/assets when RESOURCES_BUCKET is bound.
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicDir = join(root, 'public');
const outDir = join(root, 'dist', 'assets');
const files = ['favicon.svg', 'favicon.ico', 'og-image.svg', 'logo-cloudflare.svg'];

if (!existsSync(join(root, 'dist'))) {
  console.error('dist/ missing — run npm run build first');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
for (const file of files) {
  const src = join(publicDir, file);
  if (existsSync(src)) {
    cpSync(src, join(outDir, file));
    console.log(`✓ dist/assets/${file}`);
  }
}
