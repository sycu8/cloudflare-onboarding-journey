import { jsonResponse } from '../../src/lib/server/json';
import { listPublishedEvents, mapEvent } from '../../src/lib/server/workshopEvents';

type Env = {
  DB: D1Database;
};

/** Public workshop schedule — published upcoming events only. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const now = new Date().toISOString();

  if (!env.DB) {
    return jsonResponse(
      { ok: true, events: [], dbReady: false },
      { headers: { 'cache-control': 'public, max-age=60' } },
    );
  }

  try {
    const rows = await listPublishedEvents(env.DB, now);
    return jsonResponse(
      { ok: true, events: rows.map(mapEvent) },
      { headers: { 'cache-control': 'public, max-age=60' } },
    );
  } catch (e) {
    console.error('workshop-events list error', e);
    return jsonResponse(
      { ok: true, events: [], dbReady: false },
      { headers: { 'cache-control': 'public, max-age=30' } },
    );
  }
};
