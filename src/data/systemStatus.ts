import type { LocalizedString } from '../i18n/types';

/** Official Cloudflare status site. Machine-readable Statuspage API under /api/v2/. */
export const CLOUDFLARE_STATUS_URL = 'https://www.cloudflarestatus.com/';
export const CLOUDFLARE_STATUS_HISTORY_URL = 'https://www.cloudflarestatus.com/history';
export const CLOUDFLARE_STATUS_RSS_URL = 'https://www.cloudflarestatus.com/history.rss';
export const CLOUDFLARE_STATUS_API_SUMMARY = 'https://www.cloudflarestatus.com/api/v2/summary.json';
export const CLOUDFLARE_STATUS_API_INCIDENTS = 'https://www.cloudflarestatus.com/api/v2/incidents.json';
export const HUB_STATUS_API = '/api/cloudflare-status';

export const STATUS_LAST_REVIEWED = '2026-06-02';

export const statusIntro: LocalizedString = {
  vi: 'Trạng thái và sự cố chỉ lấy từ www.cloudflarestatus.com. Sự cố đang mở lấy từ trang tổng quan; sự cố đã qua lấy từ lịch sử. Hub không viết lại nội dung sự cố.',
  en: 'Status and incidents come only from www.cloudflarestatus.com. Open incidents come from the overview; past incidents come from history. This hub does not rewrite incident text.',
};

export const statusSourceNote: LocalizedString = {
  vi: `Nguồn: ${CLOUDFLARE_STATUS_URL} và ${CLOUDFLARE_STATUS_HISTORY_URL}. Nếu không tải được, trang này không hiện sự cố cũ.`,
  en: `Source: ${CLOUDFLARE_STATUS_URL} and ${CLOUDFLARE_STATUS_HISTORY_URL}. If loading fails, this page does not show old incidents.`,
};

export const statusLoadError: LocalizedString = {
  vi: 'Không tải được trạng thái trực tiếp — hãy xem www.cloudflarestatus.com',
  en: "Couldn't load live status — check www.cloudflarestatus.com",
};

export type StatusTrackFilter =
  | 'all'
  | 'application-services'
  | 'developer-platform'
  | 'cloudflare-one';

export const statusTrackLabels: Record<StatusTrackFilter, LocalizedString> = {
  all: { vi: 'Tất cả', en: 'All' },
  'application-services': { vi: 'Application Services', en: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
};

/** Keyword match for hub track filters (incident title + affected components). */
export const statusTrackKeywords: Record<Exclude<StatusTrackFilter, 'all'>, string[]> = {
  'application-services': [
    'dns',
    'cdn',
    'cache',
    'waf',
    'ssl',
    'tls',
    'certificate',
    'turnstile',
    'challenge',
    'bot',
    'firewall',
    'api',
    'dashboard',
    'http',
    'network',
    'images',
    'stream',
    'email routing',
    'magic transit',
  ],
  'developer-platform': [
    'workers',
    'r2',
    'd1',
    'kv',
    'pages',
    'queues',
    'durable',
    'hyperdrive',
    'pipelines',
    'containers',
    'sandbox',
    'ai',
    'vectorize',
    'browser',
  ],
  'cloudflare-one': [
    'zero trust',
    'cloudflare one',
    'warp',
    'gateway',
    'access',
    'tunnel',
    'cloudflared',
    'mesh',
    'casb',
    'dlp',
  ],
};

export type StatusSnapshotIncident = {
  id: string;
  name: string;
  status: string;
  impact: string;
  updatedAt: string;
  components: string[];
  active: boolean;
};

const INCIDENT_ID = /^[a-z0-9]+$/i;

export function incidentOfficialUrl(id: string): string {
  if (!INCIDENT_ID.test(id)) {
    throw new Error('invalid_incident_id');
  }
  return `https://www.cloudflarestatus.com/incidents/${id}`;
}

export function matchesStatusTrack(
  track: Exclude<StatusTrackFilter, 'all'>,
  incident: { name: string; components?: string[] },
): boolean {
  const haystack = `${incident.name} ${(incident.components ?? []).join(' ')}`.toLowerCase();
  return statusTrackKeywords[track].some((kw) => haystack.includes(kw));
}

export const impactLabels: Record<string, LocalizedString> = {
  none: { vi: 'Không ảnh hưởng', en: 'No impact' },
  minor: { vi: 'Nhẹ', en: 'Minor' },
  major: { vi: 'Nặng', en: 'Major' },
  critical: { vi: 'Nghiêm trọng', en: 'Critical' },
};

export const incidentStatusLabels: Record<string, LocalizedString> = {
  investigating: { vi: 'Đang điều tra', en: 'Investigating' },
  identified: { vi: 'Đã xác định', en: 'Identified' },
  monitoring: { vi: 'Đang theo dõi', en: 'Monitoring' },
  resolved: { vi: 'Đã xử lý', en: 'Resolved' },
  postmortem: { vi: 'Postmortem', en: 'Postmortem' },
};

export const pageIndicatorLabels: Record<string, LocalizedString> = {
  none: { vi: 'Mọi hệ thống hoạt động bình thường', en: 'All systems operational' },
  minor: { vi: 'Sự cố nhẹ', en: 'Minor service outage' },
  major: { vi: 'Sự cố lớn', en: 'Major service outage' },
  critical: { vi: 'Sự cố nghiêm trọng', en: 'Critical service outage' },
};
