import { jsonResponse } from '../../src/lib/server/json';
import {
  CLOUDFLARE_STATUS_API_INCIDENTS,
  CLOUDFLARE_STATUS_API_SUMMARY,
  incidentOfficialUrl,
} from '../../src/data/systemStatus';

type RawIncident = {
  id?: string;
  name?: string;
  status?: string;
  impact?: string;
  created_at?: string;
  updated_at?: string;
  shortlink?: string;
  components?: { name?: string }[];
};

type SummaryJson = {
  page?: { updated_at?: string };
  status?: { indicator?: string; description?: string };
  incidents?: RawIncident[];
  scheduled_maintenances?: {
    id?: string;
    name?: string;
    status?: string;
    impact?: string;
    scheduled_for?: string;
    scheduled_until?: string;
  }[];
};

const CACHE_SECONDS = 90;

function componentsOf(incident: RawIncident): string[] {
  return (incident.components ?? []).map((c) => c.name).filter((name): name is string => Boolean(name));
}

function officialUrl(incident: RawIncident): string | null {
  const short = incident.shortlink;
  if (typeof short === 'string' && short.startsWith('https://www.cloudflarestatus.com/incidents/')) {
    return short;
  }
  try {
    return incidentOfficialUrl(incident.id ?? '');
  } catch {
    return null;
  }
}

function normalize(incident: RawIncident) {
  const url = officialUrl(incident);
  const name = incident.name ?? '';
  if (!url || !name) return null;
  const status = incident.status ?? '';
  return {
    id: incident.id ?? '',
    name,
    status,
    impact: incident.impact ?? 'none',
    startedAt: incident.created_at ?? incident.updated_at ?? '',
    updatedAt: incident.updated_at ?? incident.created_at ?? '',
    components: componentsOf(incident),
    url,
    active: status !== 'resolved' && status !== 'postmortem',
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`status_${response.status}`);
  return (await response.json()) as T;
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const cacheKey = new Request(new URL('/api/cloudflare-status', request.url).href, { method: 'GET' });
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    const [summary, history] = await Promise.all([
      fetchJson<SummaryJson>(CLOUDFLARE_STATUS_API_SUMMARY),
      fetchJson<{ incidents?: RawIncident[] }>(CLOUDFLARE_STATUS_API_INCIDENTS),
    ]);

    const active = (summary.incidents ?? [])
      .map(normalize)
      .filter((incident): incident is NonNullable<typeof incident> => Boolean(incident?.active));
    const recent = (history.incidents ?? [])
      .map(normalize)
      .filter((incident): incident is NonNullable<typeof incident> => Boolean(incident && !incident.active))
      .slice(0, 30);

    const maintenance = (summary.scheduled_maintenances ?? []).flatMap((item) => {
      if (item.status !== 'in_progress' || !item.id || !item.name) return [];
      let url: string;
      try {
        url = incidentOfficialUrl(item.id);
      } catch {
        return [];
      }
      return [{
        id: item.id,
        name: item.name,
        status: item.status,
        url,
        scheduledFor: item.scheduled_for ?? '',
        scheduledUntil: item.scheduled_until ?? '',
      }];
    });

    const body = {
      ok: true,
      source: 'https://www.cloudflarestatus.com/',
      history: 'https://www.cloudflarestatus.com/history',
      updatedAt: summary.page?.updated_at ?? new Date().toISOString(),
      indicator: summary.status?.indicator ?? 'none',
      description: summary.status?.description ?? '',
      active,
      recent,
      maintenance,
    };

    const response = jsonResponse(body, {
      headers: { 'cache-control': `public, max-age=${CACHE_SECONDS}` },
    });
    await cache.put(cacheKey, response.clone());
    return response;
  } catch {
    return jsonResponse(
      { ok: false, error: 'status_unavailable' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  }
};
