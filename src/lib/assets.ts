/**
 * Static image URLs — served from R2 via `/assets/*` in production (Pages Function).
 * In dev, falls back to files in `public/` for `astro dev` without wrangler.
 */
const ASSET_FILES = ['favicon.svg', 'favicon.ico', 'og-image.svg', 'logo-cloudflare.svg'] as const;

export type StaticAssetFile = (typeof ASSET_FILES)[number];

const MIME: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

/** R2 object key prefix (see `scripts/sync-static-assets-r2.mjs`). */
export const R2_STATIC_PREFIX = 'static/';

export function assetUrl(filename: StaticAssetFile | string): string {
  const external = import.meta.env.PUBLIC_ASSETS_BASE_URL?.replace(/\/$/, '');
  if (external) {
    return `${external}/${R2_STATIC_PREFIX}${filename}`;
  }
  if (import.meta.env.PROD) {
    return `/assets/${filename}`;
  }
  return `/${filename}`;
}

export function assetMime(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.'));
  return MIME[ext] ?? 'application/octet-stream';
}

export const staticAssetManifest = ASSET_FILES;
