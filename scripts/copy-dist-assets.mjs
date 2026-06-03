/**
 * Mirror public static files into dist/assets for astro preview and fallback hosting.
 * Copies the main Astro CSS bundle to /styles/site.css (stable URL for Access-friendly delivery).
 * Production still prefers R2 via functions/assets when RESOURCES_BUCKET is bound.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
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

const astroCssDir = join(root, 'dist', '_astro');
const stylesDir = join(root, 'dist', 'styles');
if (existsSync(astroCssDir)) {
  const cssFiles = readdirSync(astroCssDir).filter((f) => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    const mainCss = cssFiles.sort(
      (a, b) => statSync(join(astroCssDir, b)).size - statSync(join(astroCssDir, a)).size,
    )[0];
    mkdirSync(stylesDir, { recursive: true });
    cpSync(join(astroCssDir, mainCss), join(stylesDir, 'site.css'));
    console.log(`✓ dist/styles/site.css (from _astro/${mainCss})`);
  }
}
