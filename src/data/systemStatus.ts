import type { LocalizedString } from '../i18n/types';

/** Official Cloudflare system status & incidents (Statuspage). */
export const CLOUDFLARE_STATUS_URL = 'https://new.cloudflarestatus.com/';
export const CLOUDFLARE_STATUS_LEGACY_URL = 'https://www.cloudflarestatus.com/';
export const CLOUDFLARE_STATUS_RSS_URL = 'https://www.cloudflarestatus.com/history.rss';
export const CLOUDFLARE_STATUS_API_SUMMARY = 'https://new.cloudflarestatus.com/api/v2/summary.json';
export const CLOUDFLARE_STATUS_API_INCIDENTS = 'https://new.cloudflarestatus.com/api/v2/incidents.json';

export const STATUS_LAST_REVIEWED = '2026-06-02';

export const statusIntro: LocalizedString = {
  vi: 'Tổng hợp trạng thái hệ thống và sự cố Cloudflare — nguồn chính thức new.cloudflarestatus.com. Trang hub tải dữ liệu live qua API công khai; luôn mở trang status gốc khi vận hành production hoặc báo cáo sự cố.',
  en: 'Cloudflare system status and incidents — official source new.cloudflarestatus.com. This hub page loads live data from the public API; always open the official status page for production operations or incident reporting.',
};

export const statusSourceNote: LocalizedString = {
  vi: `Nguồn: ${CLOUDFLARE_STATUS_URL} · Hub review: ${STATUS_LAST_REVIEWED}. Dữ liệu live có thể khác snapshot tĩnh khi có incident mới.`,
  en: `Source: ${CLOUDFLARE_STATUS_URL} · Hub review: ${STATUS_LAST_REVIEWED}. Live data may differ from static snapshots when new incidents occur.`,
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

/** Fallback when live API is unreachable (snapshot from official status page). */
export const statusSnapshot = {
  pageStatus: {
    indicator: 'minor' as const,
    description: 'Minor Service Outage',
  },
  activeIncidents: [
    {
      id: 'china-challenge',
      name: 'Customers with traffic using China Network may see an increased in Challenge failures',
      status: 'monitoring',
      impact: 'minor',
      updatedAt: '2026-06-02T07:16:03Z',
      components: ['Challenge Platform', 'Turnstile'],
      active: true,
    },
    {
      id: 'letsencrypt-tls',
      name: 'Issue with TLS certificates using Lets Encrypt CA',
      status: 'identified',
      impact: 'minor',
      updatedAt: '2026-06-02T12:00:00Z',
      components: ['SSL Certificate Provisioning'],
      active: true,
    },
    {
      id: 'custom-hostname-api',
      name: 'Custom Hostname API issue',
      status: 'monitoring',
      impact: 'minor',
      updatedAt: '2026-05-31T18:00:00Z',
      components: ['SSL for SaaS Provisioning'],
      active: true,
    },
  ] satisfies StatusSnapshotIncident[],
  recentResolved: [
    {
      id: 'access-delays',
      name: 'Cloudflare Access Configuration Delays',
      status: 'resolved',
      impact: 'minor',
      updatedAt: '2026-06-02T14:28:00Z',
      components: ['Cloudflare Access'],
      active: false,
    },
    {
      id: 'us-east-network',
      name: 'Network performance issues in US Eastern region',
      status: 'resolved',
      impact: 'none',
      updatedAt: '2026-06-02T12:00:00Z',
      components: ['Network'],
      active: false,
    },
    {
      id: 'miami-5xx',
      name: 'Cloudflare is investigating an increased level of HTTP 5xx errors in the Miami and Bogota areas',
      status: 'resolved',
      impact: 'minor',
      updatedAt: '2026-06-02T04:32:00Z',
      components: ['Network'],
      active: false,
    },
    {
      id: 'dashboard-api',
      name: 'Cloudflare Dashboard and Cloudflare API service issues',
      status: 'resolved',
      impact: 'minor',
      updatedAt: '2026-06-02T01:18:00Z',
      components: ['Dashboard', 'API'],
      active: false,
    },
  ] satisfies StatusSnapshotIncident[],
};

export function incidentOfficialUrl(id: string): string {
  return `${CLOUDFLARE_STATUS_URL.replace(/\/$/, '')}/incidents/${id}`;
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
