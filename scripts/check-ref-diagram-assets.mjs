/**
 * Guard against broken reference-diagram images.
 *
 * Reference diagrams must be served from locally-committed copies under
 * `public/ref-diagrams/`. Hotlinking Cloudflare's `developers.cloudflare.com/_astro/*`
 * assets is unsafe: those URLs are content-hashed and 404 as soon as Cloudflare rebuilds
 * their docs — which is exactly how production diagrams silently broke before.
 *
 * Modes:
 *   (default)  Validate src/data/referenceDiagrams.data.json — every diagram image must
 *              declare a `file` that exists under public/ref-diagrams/. Runs before the build.
 *   --dist     Scan the built dist/ HTML for any remote `_astro` image hotlink. Runs after
 *              the build as a final safety net.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const REMOTE_HOTLINK = 'developers.cloudflare.com/_astro/';

function fail(msg, details) {
  console.error(`\n✗ ${msg}`);
  for (const d of details ?? []) console.error(`  - ${d}`);
  console.error('');
  process.exit(1);
}

function checkData() {
  const dataPath = join(root, 'src', 'data', 'referenceDiagrams.data.json');
  const diagrams = JSON.parse(readFileSync(dataPath, 'utf8'));
  const problems = [];
  let images = 0;

  for (const d of diagrams) {
    for (const [i, img] of (d.images ?? []).entries()) {
      images += 1;
      if (!img.file) {
        problems.push(`${d.slug}[${i}] has no local "file" (would fall back to a remote hotlink)`);
        continue;
      }
      const abs = join(root, 'public', 'ref-diagrams', img.file);
      if (!existsSync(abs)) {
        problems.push(`${d.slug}[${i}] file "${img.file}" is missing under public/ref-diagrams/`);
      }
    }
  }

  if (problems.length > 0) {
    fail(
      `Reference diagram assets check failed (${problems.length}/${images} images). ` +
        `Run "npm run diagrams:sync" to download the missing local copies.`,
      problems,
    );
  }
  console.log(`✓ Reference diagram assets: ${images} image(s), all resolve to committed local files.`);
}

function walkHtml(dir, acc) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walkHtml(p, acc);
    else if (entry.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function checkDist() {
  const distDir = join(root, 'dist');
  if (!existsSync(distDir)) fail('dist/ missing — run the build before --dist check.');
  const offenders = [];
  for (const file of walkHtml(distDir, [])) {
    if (readFileSync(file, 'utf8').includes(REMOTE_HOTLINK)) {
      offenders.push(file.replace(root + '/', ''));
    }
  }
  if (offenders.length > 0) {
    fail(
      `Built HTML hotlinks remote Cloudflare "_astro" image assets (these 404 when hashes rotate).`,
      offenders,
    );
  }
  console.log('✓ Built HTML contains no remote "_astro" image hotlinks.');
}

if (process.argv.includes('--dist')) checkDist();
else checkData();
