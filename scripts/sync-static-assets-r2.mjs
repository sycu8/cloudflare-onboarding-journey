/**
 * Upload branding/static images from public/ to R2 (remote).
 * Keys: static/<filename> — served at /assets/<filename> via Pages Function.
 *
 * Usage: node scripts/sync-static-assets-r2.mjs
 * Requires: wrangler logged in, bucket cloudflare-starter-hub-resources
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BUCKET = 'cloudflare-starter-hub-resources';
const PREFIX = 'static';

const FILES = [
  { file: 'favicon.svg', contentType: 'image/svg+xml' },
  { file: 'favicon.ico', contentType: 'image/x-icon' },
  { file: 'og-image.svg', contentType: 'image/svg+xml' },
  { file: 'logo-cloudflare.svg', contentType: 'image/svg+xml' },
];

const publicDir = join(process.cwd(), 'public');

for (const { file, contentType } of FILES) {
  const localPath = join(publicDir, file);
  if (!existsSync(localPath)) {
    console.warn(`skip (missing): ${file}`);
    continue;
  }
  const objectPath = `${BUCKET}/${PREFIX}/${file}`;
  console.log(`upload: ${objectPath}`);
  execFileSync(
    'npx',
    [
      'wrangler',
      'r2',
      'object',
      'put',
      objectPath,
      `--file=${localPath}`,
      `--content-type=${contentType}`,
      '--remote',
    ],
    { stdio: 'inherit', shell: true },
  );
}

console.log('Done. Assets available at /assets/<filename> after deploy.');
