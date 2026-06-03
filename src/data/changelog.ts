import type { LocalizedString } from '../i18n/types';

/** Official product changelog — primary source for “what shipped recently”. */
export const CLOUDFLARE_CHANGELOG_URL = 'https://developers.cloudflare.com/changelog/';
export const CLOUDFLARE_CHANGELOG_RSS_URL = 'https://developers.cloudflare.com/changelog/rss/index.xml';
export const CLOUDFLARE_CHANGELOG_LLMS_URL = 'https://developers.cloudflare.com/changelog/llms.txt';
export const CLOUDFLARE_RSS_FEEDS_URL =
  'https://developers.cloudflare.com/fundamentals/new-features/available-rss-feeds/';

export const CHANGELOG_LAST_REVIEWED = '2026-06-02';

export const changelogIntro: LocalizedString = {
  vi: 'Tóm tắt các thay đổi sản phẩm Cloudflare gần đây — lấy từ Developer Changelog chính thức. Dùng để biết tính năng mới trước khi đọc docs hoặc cập nhật lab; luôn mở bài gốc để xem chi tiết triển khai.',
  en: 'Summaries of recent Cloudflare product changes — sourced from the official Developer Changelog. Use this to spot what shipped before diving into docs or labs; always open the original post for implementation details.',
};

export const changelogSourceNote: LocalizedString = {
  vi: `Nguồn: ${CLOUDFLARE_CHANGELOG_URL} · Cập nhật lại trong hub: ${CHANGELOG_LAST_REVIEWED}. Danh sách dưới đây là chọn lọc; RSS có đầy đủ mọi sản phẩm.`,
  en: `Source: ${CLOUDFLARE_CHANGELOG_URL} · Hub review date: ${CHANGELOG_LAST_REVIEWED}. The list below is curated; RSS has every product update.`,
};

export type ChangelogProduct =
  | 'agents'
  | 'workers'
  | 'cloudflare-one'
  | 'r2'
  | 'realtime'
  | 'security'
  | 'cache'
  | 'observability'
  | 'browser'
  | 'email'
  | 'images'
  | 'tunnel';

export type ChangelogEntry = {
  id: string;
  date: string;
  title: LocalizedString;
  summary: LocalizedString;
  href: string;
  products: ChangelogProduct[];
  productLabels: string[];
  relatedTrack?: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'cross-cutting';
  featured?: boolean;
};

export const changelogProductLabels: Record<ChangelogProduct, LocalizedString> = {
  agents: { vi: 'Agents', en: 'Agents' },
  workers: { vi: 'Workers', en: 'Workers' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  r2: { vi: 'R2 & data', en: 'R2 & data' },
  realtime: { vi: 'Realtime', en: 'Realtime' },
  security: { vi: 'Security', en: 'Security' },
  cache: { vi: 'Cache / CDN', en: 'Cache / CDN' },
  observability: { vi: 'Logs & observability', en: 'Logs & observability' },
  browser: { vi: 'Browser Run', en: 'Browser Run' },
  email: { vi: 'Email', en: 'Email' },
  images: { vi: 'Images', en: 'Images' },
  tunnel: { vi: 'Tunnel', en: 'Tunnel' },
};

/**
 * Curated from https://developers.cloudflare.com/changelog/ (Jun 2026 snapshot).
 * Full history and all products: RSS + official index.
 */
export const changelogEntries: ChangelogEntry[] = [
  {
    id: 'agents-sdk-0-14',
    date: '2026-06-02',
    title: {
      vi: 'Agents SDK v0.14.0: Skills, messengers, scheduled tasks, Workflows',
      en: 'Agents SDK v0.14.0: Agent Skills, messengers, scheduled tasks, Workflows',
    },
    summary: {
      vi: 'Think agents: Agent Skills (R2/bundled), Telegram messengers, scheduled task DSL, ThinkWorkflow với structured output; chat recovery mạnh hơn (isRecovering, stall timeout); MCP resumable streams.',
      en: 'Think agents: Agent Skills (R2/bundled), Telegram messengers, scheduled task DSL, ThinkWorkflow with structured output; stronger durable chat recovery (isRecovering, stall timeout); MCP resumable streams.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-06-02-agents-sdk-v0140/',
    products: ['agents', 'workers'],
    productLabels: ['Agents', 'Workers'],
    relatedTrack: 'developer-platform',
    featured: true,
  },
  {
    id: 'turnstile-events-logpush',
    date: '2026-06-01',
    title: {
      vi: 'Dataset Logpush mới: Turnstile Events',
      en: 'New Turnstile Events Logpush dataset',
    },
    summary: {
      vi: 'Logpush bổ sung Turnstile Events (ASN, action, sitekey, UA, v.v.) — dùng cho phân tích bot/human và SIEM.',
      en: 'Logpush adds Turnstile Events (ASN, action, sitekey, UA, etc.) for bot/human analytics and SIEM pipelines.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-06-01-log-fields-updated/',
    products: ['observability', 'security'],
    productLabels: ['Logs', 'Turnstile'],
    relatedTrack: 'application-services',
  },
  {
    id: 'one-client-ui-beta',
    date: '2026-05-29',
    title: {
      vi: 'Cloudflare One Client UI mới (beta 2026.5.1155.1)',
      en: 'New Cloudflare One Client UI (beta 2026.5.1155.1)',
    },
    summary: {
      vi: 'macOS/Windows beta: UI WARP mới, captive portal trong client, DNS search suffixes, VNET theo profile, emergency disconnect bằng file local, DNSSEC passthrough, MDM organization configs.',
      en: 'macOS/Windows beta: new WARP UI, in-client captive portal, DNS search suffixes, per-profile VNET, local-file emergency disconnect, DNSSEC passthrough, MDM organization configs.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-warp-macos-beta/',
    products: ['cloudflare-one'],
    productLabels: ['Cloudflare One Client'],
    relatedTrack: 'cloudflare-one',
    featured: true,
  },
  {
    id: 'sandbox-named-tunnels',
    date: '2026-05-29',
    title: {
      vi: 'Sandbox: chia sẻ preview qua Tunnel (quick & named)',
      en: 'Share sandbox previews through Cloudflare Tunnel',
    },
    summary: {
      vi: '`sandbox.tunnels.get(port)` — quick `*.trycloudflare.com` hoặc named tunnel persistent trên zone của bạn; destroy() dọn tunnel + DNS.',
      en: '`sandbox.tunnels.get(port)` — quick `*.trycloudflare.com` or persistent named tunnels on your zone; destroy() tears down tunnel + DNS.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-sandbox-named-tunnels/',
    products: ['agents', 'workers'],
    productLabels: ['Sandbox', 'Agents'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'logpush-fields-may-29',
    date: '2026-05-29',
    title: {
      vi: 'Logpush: thêm field Gateway HTTP & HTTP requests',
      en: 'Logpush: new Gateway HTTP and HTTP request fields',
    },
    summary: {
      vi: 'DEX Device State thêm DeviceRegistrationProfileID; Gateway HTTP có Added/Deleted/SetHeaders; HTTP requests có MatchedRules.',
      en: 'DEX Device State adds DeviceRegistrationProfileID; Gateway HTTP gets Added/Deleted/SetHeaders; HTTP requests get MatchedRules.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-log-fields-updated/',
    products: ['observability', 'cloudflare-one'],
    productLabels: ['Logs', 'Gateway'],
    relatedTrack: 'cross-cutting',
  },
  {
    id: 'radar-pq-tls-bugs',
    date: '2026-05-29',
    title: {
      vi: 'Radar: phát hiện lỗi TLS trong PQ checker',
      en: 'TLS bug detection in Radar post-quantum checker',
    },
    summary: {
      vi: 'Checker PQ báo Split ClientHello, HRR failure, Unknown Keyshare — kèm hướng dẫn khắc phục và API support.',
      en: 'PQ checker reports Split ClientHello, HRR failure, Unknown Keyshare — with remediation guidance and API support.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-radar-pq-tls-bug-detection/',
    products: ['security'],
    productLabels: ['Radar'],
    relatedTrack: 'application-services',
  },
  {
    id: 'realtime-ws-reconnect',
    date: '2026-05-29',
    title: {
      vi: 'Realtime SFU: WebSocket adapter tự reconnect',
      en: 'Realtime WebSocket adapter auto-reconnects',
    },
    summary: {
      vi: 'Stream mode egress: retry endpoint 5s, buffer audio/video “live-first” khi reconnect ngắn — transcription/recording ít đứt hơn.',
      en: 'Stream mode egress: 5s endpoint retry, live-first audio/video buffering on brief reconnects — better for transcription/recording pipelines.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-websocket-adapter-auto-reconnect/',
    products: ['realtime'],
    productLabels: ['Realtime SFU'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'security-insights-scans',
    date: '2026-05-29',
    title: {
      vi: 'Security Insights: quét thường xuyên hơn, mặc định bật',
      en: 'Security Insights: more frequent default scans',
    },
    summary: {
      vi: 'Free 7 ngày, Pro/Business 3 ngày, Enterprise hàng ngày; mọi account/zone được quét mặc định; on-demand scan theo zone/insight.',
      en: 'Free every 7 days, Pro/Business every 3 days, Enterprise daily; all accounts/zones scanned by default; on-demand scans per zone/insight.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-29-security-insights-default-scans/',
    products: ['security'],
    productLabels: ['Security Center'],
    relatedTrack: 'application-services',
  },
  {
    id: 'browser-run-quickaction-workers',
    date: '2026-05-28',
    title: {
      vi: 'Browser Run Quick Actions gọi trực tiếp từ Workers',
      en: 'Browser Run Quick Actions from Workers',
    },
    summary: {
      vi: '`env.BROWSER.quickAction()` — screenshot, PDF, markdown, scrape… không cần token HTTP; compatibility_date ≥ 2026-03-24.',
      en: '`env.BROWSER.quickAction()` — screenshot, PDF, markdown, scrape, etc. without HTTP tokens; requires compatibility_date ≥ 2026-03-24.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-use-browser-run-quick-actions-directly-from-workers/',
    products: ['browser', 'workers'],
    productLabels: ['Browser Run', 'Workers'],
    relatedTrack: 'developer-platform',
    featured: true,
  },
  {
    id: 'mesh-ha-replica-ui',
    date: '2026-05-28',
    title: {
      vi: 'Cloudflare Mesh: quản lý replica HA trên dashboard',
      en: 'Mesh HA replica management in dashboard',
    },
    summary: {
      vi: 'Tab replica, badge active/passive, Mesh IP từng replica, promote to active một click.',
      en: 'Replica tabs, active/passive badges, per-replica Mesh IPs, one-click promote to active.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-mesh-ha-replica-ui/',
    products: ['cloudflare-one', 'tunnel'],
    productLabels: ['Cloudflare Mesh', 'Cloudflare One'],
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'wrangler-containers-ssh-proxy',
    date: '2026-05-28',
    title: {
      vi: 'Wrangler: SSH ProxyCommand cho Containers',
      en: 'Wrangler SSH ProxyCommand for Containers',
    },
    summary: {
      vi: '`ssh -o ProxyCommand="wrangler containers ssh %h" cloudchamber@<INSTANCE_ID>` — SSH vào container đang chạy.',
      en: 'Use `wrangler containers ssh` as OpenSSH ProxyCommand to reach a running Container instance.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-ssh-proxy-command/',
    products: ['workers'],
    productLabels: ['Containers', 'Wrangler'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'email-named-recipients',
    date: '2026-05-28',
    title: {
      vi: 'Email Service: recipient có display name',
      en: 'Email Service: named recipient addresses',
    },
    summary: {
      vi: 'to/cc/bcc/replyTo/from hỗ trợ `{ email, name }` — tương thích chuỗi plain cũ.',
      en: 'to/cc/bcc/replyTo/from accept `{ email, name }` objects — plain strings still supported.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-named-email-recipients/',
    products: ['email', 'workers'],
    productLabels: ['Email Service'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'pipelines-r2-pricing',
    date: '2026-05-28',
    title: {
      vi: 'Công bố giá Pipelines, R2 SQL, R2 Data Catalog',
      en: 'Pipelines, R2 SQL, and R2 Data Catalog pricing announced',
    },
    summary: {
      vi: 'Pipelines: ingress free, SQL transform & sink theo GB; R2 SQL $2.50/TB scanned; Data Catalog ops + compaction — billing chưa bật, báo trước ≥30 ngày.',
      en: 'Pipelines: free ingress, per-GB transforms/sinks; R2 SQL $2.50/TB scanned; Data Catalog ops + compaction — billing not enabled yet, 30+ days notice promised.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-11-pipelines-pricing-announced/',
    products: ['r2', 'workers'],
    productLabels: ['Pipelines', 'R2 SQL', 'R2 Data Catalog'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'r2-data-catalog-dashboard',
    date: '2026-05-28',
    title: {
      vi: 'R2 Data Catalog: dashboard riêng + metrics',
      en: 'R2 Data Catalog dedicated dashboard',
    },
    summary: {
      vi: 'Overview catalogs, wizard 3 bước, snapshot expiration, charts compaction/requests/storage.',
      en: 'Catalog overview, 3-step wizard, snapshot expiration, compaction/requests/storage charts.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-r2-data-catalog-dashboard/',
    products: ['r2'],
    productLabels: ['R2 Data Catalog'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'realtimekit-track-recording',
    date: '2026-05-28',
    title: {
      vi: 'RealtimeKit: ghi âm theo từng participant',
      en: 'RealtimeKit per-participant track recording',
    },
    summary: {
      vi: 'WebM riêng từng user qua `user_ids` — transcription và workflow regulated; cần SDK version tối thiểu.',
      en: 'Separate WebM per user via `user_ids` — useful for transcription and regulated workflows; minimum SDK versions apply.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-28-realtimekit-track-recording/',
    products: ['realtime'],
    productLabels: ['RealtimeKit'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'gateway-regex-ai',
    date: '2026-05-27',
    title: {
      vi: 'Cloudflare One: viết regex bằng ngôn ngữ tự nhiên',
      en: 'Natural-language regex in Cloudflare One Gateway',
    },
    summary: {
      vi: 'Policy selector regex: mô tả tiếng Anh → regex + validate; giải thích regex có sẵn; feedback trong dashboard.',
      en: 'Regex policy selectors: plain-English description → generated regex + validation; explain existing patterns; in-dashboard feedback.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-27-cloudy-regex-assistance/',
    products: ['cloudflare-one', 'security'],
    productLabels: ['Gateway', 'Cloudflare One'],
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'images-transformation-flows',
    date: '2026-05-27',
    title: {
      vi: 'Images: Transformation flows (provider & custom)',
      en: 'Images: Transformation flows',
    },
    summary: {
      vi: 'Automation theo điều kiện URL/extension — provider flow (Fastly) hoặc custom (format, width=auto, thư mục).',
      en: 'Condition-based image automation — provider flows (Fastly) or custom rules (format, width=auto, paths).',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-27-transformation-flows/',
    products: ['images', 'cache'],
    productLabels: ['Cloudflare Images'],
    relatedTrack: 'application-services',
  },
  {
    id: 'cloudflared-prechecks',
    date: '2026-05-27',
    title: {
      vi: 'cloudflared: pre-check connectivity khi khởi động',
      en: 'cloudflared connectivity pre-checks at startup',
    },
    summary: {
      vi: '≥2026.5.2: DNS, UDP/TCP 7844, api.cloudflare.com — bảng Pass/Warn/Fail + remediation; thoát sớm nếu block hoàn toàn.',
      en: '≥2026.5.2: DNS, UDP/TCP 7844, api.cloudflare.com — Pass/Warn/Fail table + hints; early exit on hard blocks.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-27-cloudflared-connectivity-prechecks/',
    products: ['tunnel', 'cloudflare-one'],
    productLabels: ['Cloudflare Tunnel'],
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'one-client-ga',
    date: '2026-05-26',
    title: {
      vi: 'Cloudflare One Client GA 2026.4.1390.0 (macOS/Windows/Linux)',
      en: 'Cloudflare One Client GA 2026.4.1390.0',
    },
    summary: {
      vi: 'UI client mới GA; `warp-cli mdm refresh`; sửa proxy stall; xem known issues theo nền tảng trên bài changelog.',
      en: 'New client UI GA; `warp-cli mdm refresh`; proxy stall fix; platform-specific known issues on the changelog post.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-26-warp-macos-ga/',
    products: ['cloudflare-one'],
    productLabels: ['Cloudflare One Client'],
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'cache-bypass-status',
    date: '2026-05-26',
    title: {
      vi: 'Cache: BYPASS cho mọi response không cache được',
      en: 'BYPASS status for all uncacheable responses',
    },
    summary: {
      vi: 'MISS chỉ còn cho cacheable nhưng chưa có trên edge; analytics hit ratio chính xác hơn — traffic origin không đổi.',
      en: 'MISS reserved for cacheable-but-not-cached; analytics hit ratio more accurate — origin traffic unchanged.',
    },
    href: 'https://developers.cloudflare.com/changelog/post/2026-05-26-bypass-status-for-uncacheable-responses/',
    products: ['cache'],
    productLabels: ['Cache / CDN'],
    relatedTrack: 'application-services',
    featured: true,
  },
];

export function getFeaturedChangelogEntries(limit = 4): ChangelogEntry[] {
  return changelogEntries.filter((e) => e.featured).slice(0, limit);
}

export function getChangelogByProduct(product: ChangelogProduct): ChangelogEntry[] {
  return changelogEntries.filter((e) => e.products.includes(product));
}

export function getChangelogByTrack(
  track: NonNullable<ChangelogEntry['relatedTrack']>,
  limit = 6,
): ChangelogEntry[] {
  return changelogEntries.filter((e) => e.relatedTrack === track).slice(0, limit);
}
