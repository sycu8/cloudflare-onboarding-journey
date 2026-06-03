import { assetMime, R2_STATIC_PREFIX } from '../../src/lib/assets';

const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable';

export const onRequestGet: PagesFunction<{
  RESOURCES_BUCKET?: R2Bucket;
}> = async ({ env, params, request }) => {
  const path = params.path;
  if (!path || path.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  const bucket = env.RESOURCES_BUCKET;
  if (!bucket) {
    return new Response('Asset storage not configured', { status: 503 });
  }

  const key = `${R2_STATIC_PREFIX}${path}`;
  const object = await bucket.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', assetMime(path));
  }
  headers.set('Cache-Control', CACHE_IMMUTABLE);
  headers.set('CDN-Cache-Control', CACHE_IMMUTABLE);
  headers.set('X-Content-Type-Options', 'nosniff');

  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  headers.set('ETag', object.httpEtag);

  return new Response(object.body, { headers });
};
