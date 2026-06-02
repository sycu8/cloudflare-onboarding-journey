import { jsonResponse } from '../../src/lib/server/json';

export const onRequestGet: PagesFunction<{
  SITE_CONFIG?: KVNamespace;
}> = async ({ env }) => {
  const kv = env.SITE_CONFIG;

  const workshopEnabledRaw = kv ? await kv.get('workshopEnabled') : null;
  const announcementBannerRaw = kv ? await kv.get('announcementBanner') : null;
  const resourceDownloadsEnabledRaw = kv ? await kv.get('resourceDownloadsEnabled') : null;

  const workshopEnabled = workshopEnabledRaw === 'false' ? false : true;
  const resourceDownloadsEnabled = resourceDownloadsEnabledRaw === 'true' ? true : false;

  return jsonResponse(
    {
      ok: true,
      workshopEnabled,
      resourceDownloadsEnabled,
      announcementBanner: announcementBannerRaw
        ? (() => {
            try {
              return JSON.parse(announcementBannerRaw);
            } catch {
              return null;
            }
          })()
        : null,
    },
    {
      headers: {
        'cache-control': 'public, max-age=60',
      },
    },
  );
};

