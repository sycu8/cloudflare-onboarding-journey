import type { LocalizedString } from '../i18n/types';
import { tracks, type Track, type TrackLesson, type TrackModule } from './tracks';
import { getDiagramBySlug } from './referenceDiagrams';
import type { ReferenceDiagram } from './referenceDiagrams';
import { trackLessonBestPractices, type BestPracticeNote } from './trackLessonBestPractices';

export type { BestPracticeNote };

export type FlatTrackLesson = TrackLesson & {
  id: string;
  trackSlug: Track['slug'];
  trackTitle: LocalizedString;
  moduleId: string;
  moduleTitle: LocalizedString;
  moduleDescription: LocalizedString;
  lessonIndex: number;
  moduleIndex: number;
  totalLessonsInModule: number;
};

export type DocsLink = {
  label: LocalizedString;
  url: string;
};

export type ApiLink = {
  label: LocalizedString;
  url: string;
  method?: string;
};

export type TrackLessonEnrichment = {
  steps: { vi: string[]; en: string[] };
  deepDive: LocalizedString;
  docsLinks: DocsLink[];
  apiLinks?: ApiLink[];
  diagramSlugs?: string[];
  productSlugs?: string[];
  bestPracticeNote?: BestPracticeNote;
};

const CF_API = 'https://developers.cloudflare.com/api';
const ZT_ONBOARD = 'https://zerotrust.cfsase.workers.dev';

function flattenModule(
  track: Track,
  mod: TrackModule,
  moduleIndex: number,
): FlatTrackLesson[] {
  return mod.lessons.map((lesson, lessonIndex) => ({
    ...lesson,
    id: `${mod.id}-l${lessonIndex + 1}`,
    trackSlug: track.slug,
    trackTitle: track.title,
    moduleId: mod.id,
    moduleTitle: mod.title,
    moduleDescription: mod.description,
    lessonIndex,
    moduleIndex,
    totalLessonsInModule: mod.lessons.length,
  }));
}

export function getTrackLessons(trackSlug: Track['slug']): FlatTrackLesson[] {
  const track = tracks.find((t) => t.slug === trackSlug);
  if (!track) return [];
  return track.modules.flatMap((mod, i) => flattenModule(track, mod, i));
}

export function getAllFlatTrackLessons(): FlatTrackLesson[] {
  return tracks.flatMap((track) =>
    track.modules.flatMap((mod, i) => flattenModule(track, mod, i)),
  );
}

export function getFlatTrackLesson(
  trackSlug: string,
  lessonId: string,
): FlatTrackLesson | undefined {
  return getTrackLessons(trackSlug as Track['slug']).find((l) => l.id === lessonId);
}

export function getAdjacentLessons(
  trackSlug: Track['slug'],
  lessonId: string,
): { prev?: FlatTrackLesson; next?: FlatTrackLesson } {
  const all = getTrackLessons(trackSlug);
  const idx = all.findIndex((l) => l.id === lessonId);
  if (idx < 0) return {};
  return { prev: all[idx - 1], next: all[idx + 1] };
}

/** Per-lesson enrichment: steps, docs, API, diagrams. */
export const trackLessonEnrichment: Record<string, TrackLessonEnrichment> = {
  // ── Application Services ──
  'as-1-l1': {
    steps: {
      vi: [
        'Đăng nhập Cloudflare Dashboard → Add a site → nhập domain.',
        'Cloudflare quét DNS hiện có (hoặc import zone file).',
        'Review từng record: A/AAAA/CNAME trỏ đúng origin; ghi chú MX, TXT, SRV.',
        'Đổi nameserver tại registrar theo hướng dẫn — chỉ sau khi đã review.',
      ],
      en: [
        'Log in to Cloudflare Dashboard → Add a site → enter your domain.',
        'Cloudflare scans existing DNS (or import a zone file).',
        'Review each record: A/AAAA/CNAME point to the right origin; note MX, TXT, SRV.',
        'Change nameservers at your registrar as instructed — only after review.',
      ],
    },
    deepDive: {
      vi: 'Bước này không chỉ “thêm domain” — bạn đang chuyển quyền điều phối DNS sang Cloudflare. Sai một record có thể làm email ngừng hoạt động hoặc traffic đi nhầm server.',
      en: 'This step is not just “add domain” — you are handing DNS control to Cloudflare. One wrong record can break email or send traffic to the wrong server.',
    },
    docsLinks: [
      { label: { vi: 'Onboard a domain', en: 'Onboard a domain' }, url: 'https://developers.cloudflare.com/fundamentals/setup/manage-domains/add-site/' },
      { label: { vi: 'DNS records overview', en: 'DNS records overview' }, url: 'https://developers.cloudflare.com/dns/manage-dns-records/' },
    ],
    apiLinks: [
      { label: { vi: 'List DNS records', en: 'List DNS records' }, url: `${CF_API}/resources/dns/subresources/records/methods/list/`, method: 'GET' },
      { label: { vi: 'Create zone', en: 'Create zone' }, url: `${CF_API}/resources/zones/methods/create/`, method: 'POST' },
    ],
    diagramSlugs: ['distributed-web-performance-architecture'],
    productSlugs: ['dns'],
  },
  'as-1-l2': {
    steps: {
      vi: [
        'Mở DNS → Records cho zone vừa onboard.',
        'Bật proxy (đám mây cam) cho record website/API public (A, AAAA, CNAME).',
        'Giữ DNS only (xám) cho MX, internal hostname, record không cần qua edge.',
        'Verify bằng `dig` hoặc browser — traffic HTTP/S phải qua Cloudflare.',
      ],
      en: [
        'Open DNS → Records for your onboarded zone.',
        'Enable proxy (orange cloud) on public website/API records (A, AAAA, CNAME).',
        'Keep DNS only (grey) for MX, internal hostnames, records that should not hit the edge.',
        'Verify with `dig` or browser — HTTP/S traffic should pass through Cloudflare.',
      ],
    },
    deepDive: {
      vi: 'Proxy là công tắc bật WAF, cache, SSL edge. Không proxy = Cloudflare chỉ trả lời DNS, không bảo vệ hay tăng tốc HTTP.',
      en: 'Proxy is the switch for WAF, cache, and edge SSL. Without proxy, Cloudflare only answers DNS — no HTTP protection or acceleration.',
    },
    docsLinks: [
      { label: { vi: 'Proxy status', en: 'Proxy status' }, url: 'https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/' },
      { label: { vi: 'How Cloudflare works', en: 'How Cloudflare works' }, url: 'https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/' },
    ],
    productSlugs: ['proxy', 'dns'],
  },
  'as-2-l1': {
    steps: {
      vi: [
        'SSL/TLS → Overview: chọn Full (strict) nếu origin có cert hợp lệ.',
        'Tránh Flexible khi origin chỉ chấp nhận HTTPS (gây redirect loop).',
        'Bật Always Use HTTPS + Automatic HTTPS Rewrites.',
        'Test http:// và https:// — không lỗi cert trên browser.',
      ],
      en: [
        'SSL/TLS → Overview: choose Full (strict) when origin has a valid cert.',
        'Avoid Flexible when origin expects HTTPS only (can cause redirect loops).',
        'Enable Always Use HTTPS + Automatic HTTPS Rewrites.',
        'Test http:// and https:// — no certificate errors in the browser.',
      ],
    },
    deepDive: {
      vi: 'SSL mode quyết định mã hóa giữa user↔Cloudflare và Cloudflare↔origin. Đây là nguồn lỗi phổ biến nhất sau khi bật proxy.',
      en: 'SSL mode controls encryption user↔Cloudflare and Cloudflare↔origin. This is the most common issue after enabling proxy.',
    },
    docsLinks: [
      { label: { vi: 'Encryption modes', en: 'Encryption modes' }, url: 'https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/' },
    ],
    productSlugs: ['ssl'],
  },
  'as-2-l2': {
    steps: {
      vi: [
        'Tạo Origin Certificate (15 năm) nếu origin chưa có cert public.',
        'Cài cert trên origin / load balancer.',
        'Firewall origin: chỉ cho phép IP Cloudflare (hoặc Authenticated Origin Pulls).',
        'Test truy cập trực tiếp IP origin — phải bị chặn hoặc từ chối.',
      ],
      en: [
        'Create an Origin Certificate (15-year) if origin lacks a public cert.',
        'Install the cert on origin / load balancer.',
        'Origin firewall: allow Cloudflare IPs only (or use Authenticated Origin Pulls).',
        'Test direct origin IP access — should be blocked or refused.',
      ],
    },
    deepDive: {
      vi: 'Attacker có thể bỏ qua WAF nếu biết IP origin. Origin lockdown là lớp bảo vệ bắt buộc cho production.',
      en: 'Attackers can bypass the WAF if they know your origin IP. Origin lockdown is essential for production.',
    },
    docsLinks: [
      { label: { vi: 'Origin CA certificates', en: 'Origin CA certificates' }, url: 'https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/' },
      { label: { vi: 'IP ranges', en: 'IP ranges' }, url: 'https://developers.cloudflare.com/fundamentals/reference/cloudflare-ip-addresses/' },
    ],
    productSlugs: ['ssl', 'waf'],
  },
  'as-3-l1': {
    steps: {
      vi: [
        'Security → WAF → Managed rules: bật OWASP/Core ruleset.',
        'Chạy Simulate/Log 24–48h trước khi Block.',
        'Tạo custom rule cho path /admin, /api nếu cần.',
        'Review Security Events để tinh chỉnh false positive.',
      ],
      en: [
        'Security → WAF → Managed rules: enable OWASP/Core rulesets.',
        'Run Simulate/Log for 24–48h before Block.',
        'Add custom rules for /admin, /api if needed.',
        'Review Security Events to tune false positives.',
      ],
    },
    deepDive: {
      vi: 'WAF chặn SQLi, XSS, exploit phổ biến tại edge — trước khi request tới app. Managed rules là baseline nhanh nhất.',
      en: 'WAF blocks SQLi, XSS, and common exploits at the edge — before requests hit your app. Managed rules are the fastest baseline.',
    },
    docsLinks: [
      { label: { vi: 'WAF managed rules', en: 'WAF managed rules' }, url: 'https://developers.cloudflare.com/waf/managed-rules/' },
    ],
    apiLinks: [
      { label: { vi: 'List firewall rules', en: 'List firewall rules' }, url: `${CF_API}/resources/firewall/subresources/rules/methods/list/`, method: 'GET' },
    ],
    diagramSlugs: ['bot-management'],
    productSlugs: ['waf'],
  },
  'as-3-l2': {
    steps: {
      vi: [
        'Security → WAF → Rate limiting rules: tạo rule cho /login, /signup.',
        'Đặt ngưỡng (ví dụ 10 req/phút/IP) và action Block hoặc Challenge.',
        'Thêm rule cho API search/autocomplete nếu bị abuse.',
        'Monitor rate limit events sau deploy.',
      ],
      en: [
        'Security → WAF → Rate limiting rules: create rules for /login, /signup.',
        'Set threshold (e.g. 10 req/min/IP) and Block or Challenge action.',
        'Add rules for API search/autocomplete if abused.',
        'Monitor rate limit events after deploy.',
      ],
    },
    deepDive: {
      vi: 'Rate limiting bảo vệ credential stuffing và brute force — bổ sung cho WAF signature-based rules.',
      en: 'Rate limiting protects against credential stuffing and brute force — complementing signature-based WAF rules.',
    },
    docsLinks: [
      { label: { vi: 'Rate limiting rules', en: 'Rate limiting rules' }, url: 'https://developers.cloudflare.com/waf/rate-limiting-rules/' },
    ],
    productSlugs: ['rate-limiting', 'waf'],
  },
  'as-3-l3': {
    steps: {
      vi: [
        'Security → Bots: xem Bot Analytics và score distribution.',
        'Bật Super Bot Fight Mode hoặc Bot Management (plan cho phép).',
        'Challenge traffic score thấp trên form public.',
        'Allowlist bot hợp lệ (monitoring, SEO) nếu cần.',
      ],
      en: [
        'Security → Bots: review Bot Analytics and score distribution.',
        'Enable Super Bot Fight Mode or Bot Management (plan permitting).',
        'Challenge low-score traffic on public forms.',
        'Allowlist legitimate bots (monitoring, SEO) if needed.',
      ],
    },
    deepDive: {
      vi: 'Bot traffic chiếm phần lớn Internet — phân biệt crawler tốt và scraper xấu giúp giảm tải origin.',
      en: 'Bot traffic is a large share of the Internet — separating good crawlers from bad scrapers reduces origin load.',
    },
    docsLinks: [
      { label: { vi: 'Bot Management', en: 'Bot Management' }, url: 'https://developers.cloudflare.com/bots/' },
    ],
    diagramSlugs: ['bot-management'],
    productSlugs: ['bots'],
  },
  'as-4-l1': {
    steps: {
      vi: [
        'Caching → Configuration: xem Cache Rules mặc định.',
        'Mở Caching → Cache Rules: cache static (/assets/*, *.css, *.js).',
        'Bypass cache cho /admin, /checkout, cookie session.',
        'Kiểm tra response header `CF-Cache-Status`: HIT vs MISS.',
      ],
      en: [
        'Caching → Configuration: review default Cache Rules.',
        'Caching → Cache Rules: cache static paths (/assets/*, *.css, *.js).',
        'Bypass cache for /admin, /checkout, session cookies.',
        'Check response header `CF-Cache-Status`: HIT vs MISS.',
      ],
    },
    deepDive: {
      vi: 'CDN cache giảm latency và chi phí origin — nhưng cache nhầm HTML có session sẽ lộ data user.',
      en: 'CDN cache cuts latency and origin cost — but caching session HTML leaks user data.',
    },
    docsLinks: [
      { label: { vi: 'Cache Rules', en: 'Cache Rules' }, url: 'https://developers.cloudflare.com/cache/how-to/cache-rules/' },
      { label: { vi: 'CDN concepts', en: 'CDN concepts' }, url: 'https://developers.cloudflare.com/cache/concepts/cdn/' },
    ],
    diagramSlugs: ['distributed-web-performance-architecture'],
    productSlugs: ['cache', 'cdn'],
  },
  'as-4-l2': {
    steps: {
      vi: [
        'Tạo Cache Rule: Bypass cho path dynamic.',
        'Rule cache Everything hoặc Edge TTL cho /assets/*.',
        'Sau mỗi deploy frontend: Caching → Purge → Purge by URL hoặc tag.',
        'Document quy trình purge cho team release.',
      ],
      en: [
        'Create Cache Rule: Bypass for dynamic paths.',
        'Cache Everything or Edge TTL rule for /assets/*.',
        'After each frontend deploy: Caching → Purge → by URL or tag.',
        'Document purge process for the release team.',
      ],
    },
    deepDive: {
      vi: 'Purge sai lúc có thể spike origin — purge đúng URL/tag giữ cache hiệu quả sau release.',
      en: 'Bad purge timing can spike origin load — targeted URL/tag purge keeps cache effective after releases.',
    },
    docsLinks: [
      { label: { vi: 'Purge cache', en: 'Purge cache' }, url: 'https://developers.cloudflare.com/cache/how-to/purge-cache/' },
    ],
    apiLinks: [
      { label: { vi: 'Purge files', en: 'Purge files' }, url: `${CF_API}/resources/cache/subresources/cache/subresources/purge/methods/purge/`, method: 'POST' },
    ],
    productSlugs: ['cache'],
  },
  'as-4-l3': {
    steps: {
      vi: [
        'Speed → Optimization: bật Brotli, Early Hints, HTTP/3.',
        'Speed → Optimization → Image: Polish/resize nếu dùng legacy; hoặc Cloudflare Images.',
        'Convert ảnh lớn sang WebP/AVIF tại edge.',
        'Re-test LCP trên PageSpeed hoặc Web Analytics.',
      ],
      en: [
        'Speed → Optimization: enable Brotli, Early Hints, HTTP/3.',
        'Speed → Optimization → Image: Polish/resize or Cloudflare Images.',
        'Convert large images to WebP/AVIF at the edge.',
        'Re-test LCP on PageSpeed or Web Analytics.',
      ],
    },
    deepDive: {
      vi: 'Speed optimizations thường “free win” — không đổi code app, chỉ bật tại dashboard.',
      en: 'Speed optimizations are often free wins — no app code changes, just dashboard toggles.',
    },
    docsLinks: [
      { label: { vi: 'Speed optimizations', en: 'Speed optimizations' }, url: 'https://developers.cloudflare.com/speed/' },
      { label: { vi: 'Images', en: 'Images' }, url: 'https://developers.cloudflare.com/images/' },
    ],
    diagramSlugs: ['optimizing-image-delivery-with-cloudflare-image-resizing-and-r2'],
    productSlugs: ['speed', 'images'],
  },
  'as-4-l4': {
    steps: {
      vi: [
        'Caching → Analytics: theo dõi hit ratio theo thời gian.',
        'Web Analytics hoặc RUM: đo LCP, INP, CLS.',
        'Chụp baseline trước/sau thay đổi cache.',
        'Báo cáo stakeholder bằng số liệu cụ thể.',
      ],
      en: [
        'Caching → Analytics: track hit ratio over time.',
        'Web Analytics or RUM: measure LCP, INP, CLS.',
        'Capture before/after baselines for cache changes.',
        'Report to stakeholders with concrete metrics.',
      ],
    },
    deepDive: {
      vi: 'Đo lường chứng minh giá trị CDN — hit ratio cao và CWV tốt hơn là KPI rõ ràng.',
      en: 'Measurement proves CDN value — higher hit ratio and better CWV are clear KPIs.',
    },
    docsLinks: [
      { label: { vi: 'Cache analytics', en: 'Cache analytics' }, url: 'https://developers.cloudflare.com/cache/performance-review/cache-analytics/' },
      { label: { vi: 'Web Analytics', en: 'Web Analytics' }, url: 'https://developers.cloudflare.com/web-analytics/' },
    ],
    productSlugs: ['web-analytics', 'cache'],
  },
  // ── Developer Platform ──
  'dp-1-l1': {
    steps: {
      vi: [
        'Dashboard → Workers & Pages → Create → Pages → Connect Git.',
        'Chọn repo, branch production (main), framework preset (Astro/React…).',
        'Deploy lần đầu — kiểm tra URL *.pages.dev.',
        'Mở PR test — xác nhận preview deployment URL.',
      ],
      en: [
        'Dashboard → Workers & Pages → Create → Pages → Connect Git.',
        'Pick repo, production branch (main), framework preset (Astro/React…).',
        'First deploy — verify *.pages.dev URL.',
        'Open a test PR — confirm preview deployment URL.',
      ],
    },
    deepDive: {
      vi: 'Pages = hosting + CI tích hợp. Preview URL mỗi PR là workflow review không cần staging server riêng.',
      en: 'Pages = hosting + built-in CI. Per-PR preview URLs replace separate staging servers for reviews.',
    },
    docsLinks: [
      { label: { vi: 'Pages Git integration', en: 'Pages Git integration' }, url: 'https://developers.cloudflare.com/pages/get-started/git-integration/' },
      { label: { vi: 'Direct Upload / Wrangler', en: 'Direct Upload / Wrangler' }, url: 'https://developers.cloudflare.com/pages/get-started/direct-upload/' },
    ],
    diagramSlugs: ['fullstack-application'],
    productSlugs: ['pages'],
  },
  'dp-1-l2': {
    steps: {
      vi: [
        'Settings → Builds: `npm run build`, output `dist` (hoặc `build`).',
        'Thêm Environment variables: API_URL, PUBLIC_* cho build.',
        'Node version ≥ 18 trong build config.',
        'Re-deploy sau khi sửa env — build log phải pass.',
      ],
      en: [
        'Settings → Builds: `npm run build`, output `dist` (or `build`).',
        'Add environment variables: API_URL, PUBLIC_* for build.',
        'Node version ≥ 18 in build config.',
        'Re-deploy after env changes — build log must pass.',
      ],
    },
    deepDive: {
      vi: 'Sai output directory là lỗi #1 Pages — Astro dùng `dist`, Create React App dùng `build`.',
      en: 'Wrong output directory is the #1 Pages mistake — Astro uses `dist`, CRA uses `build`.',
    },
    docsLinks: [
      { label: { vi: 'Build configuration', en: 'Build configuration' }, url: 'https://developers.cloudflare.com/pages/configuration/build-configuration/' },
    ],
    productSlugs: ['pages'],
  },
  'dp-2-l1': {
    steps: {
      vi: [
        'Tạo thư mục `functions/` cạnh output static.',
        'Thêm `functions/api/hello.ts` export `onRequestGet`.',
        'Deploy — gọi `https://<site>/api/hello`.',
        'Binding D1/KV trong Pages project settings nếu cần.',
      ],
      en: [
        'Create a `functions/` folder beside static output.',
        'Add `functions/api/hello.ts` exporting `onRequestGet`.',
        'Deploy — call `https://<site>/api/hello`.',
        'Bind D1/KV in Pages project settings if needed.',
      ],
    },
    deepDive: {
      vi: 'Pages Functions chạy trên Workers runtime — API gắn với site, không cần server riêng.',
      en: 'Pages Functions run on the Workers runtime — APIs colocated with your site, no separate server.',
    },
    docsLinks: [
      { label: { vi: 'Pages Functions', en: 'Pages Functions' }, url: 'https://developers.cloudflare.com/pages/functions/' },
    ],
    diagramSlugs: ['fullstack-application', 'serverless-global-apis'],
    productSlugs: ['pages', 'workers'],
  },
  'dp-2-l2': {
    steps: {
      vi: [
        '`wrangler init` hoặc dashboard Create Worker.',
        'Viết fetch handler: routing theo pathname/hostname.',
        'Deploy `wrangler deploy` — gán custom domain hoặc route `*.example.com/*`.',
        'Dùng `wrangler tail` khi debug.',
      ],
      en: [
        '`wrangler init` or dashboard Create Worker.',
        'Write fetch handler: route by pathname/hostname.',
        'Deploy with `wrangler deploy` — attach custom domain or route `*.example.com/*`.',
        'Use `wrangler tail` when debugging.',
      ],
    },
    deepDive: {
      vi: 'Worker độc lập phù hợp middleware toàn zone, BFF, hoặc multi-tenant routing — linh hoạt hơn Pages Functions.',
      en: 'Standalone Workers suit zone-wide middleware, BFFs, or multi-tenant routing — more flexible than Pages Functions.',
    },
    docsLinks: [
      { label: { vi: 'Workers get started', en: 'Workers get started' }, url: 'https://developers.cloudflare.com/workers/get-started/guide/' },
    ],
    apiLinks: [
      { label: { vi: 'Upload Worker script', en: 'Upload Worker script' }, url: `${CF_API}/resources/workers/subresources/scripts/methods/update/`, method: 'PUT' },
    ],
    diagramSlugs: ['serverless-global-apis'],
    productSlugs: ['workers'],
  },
  'dp-3-l1': {
    steps: {
      vi: [
        'Tạo KV namespace: `wrangler kv namespace create APP_CONFIG`.',
        'Binding trong wrangler.toml / Pages settings.',
        'Đọc/ghi từ Worker: `env.KV.put(key, value)`.',
        'Dùng cho flags, cache config — không cho ledger tài chính.',
      ],
      en: [
        'Create KV namespace: `wrangler kv namespace create APP_CONFIG`.',
        'Bind in wrangler.toml / Pages settings.',
        'Read/write from Worker: `env.KV.put(key, value)`.',
        'Use for flags, config cache — not financial ledgers.',
      ],
    },
    deepDive: {
      vi: 'KV eventually consistent, đọc cực nhanh tại edge — ideal cho read-heavy config.',
      en: 'KV is eventually consistent with extremely fast edge reads — ideal for read-heavy config.',
    },
    docsLinks: [
      { label: { vi: 'KV get started', en: 'KV get started' }, url: 'https://developers.cloudflare.com/kv/get-started/' },
    ],
    apiLinks: [
      { label: { vi: 'Write KV value', en: 'Write KV value' }, url: `${CF_API}/resources/kv/subresources/namespaces/subresources/values/methods/update/`, method: 'PUT' },
    ],
    productSlugs: ['kv'],
  },
  'dp-3-l2': {
    steps: {
      vi: [
        '`wrangler d1 create my-db` — lấy database_id.',
        'Viết migration SQL trong `migrations/`.',
        '`wrangler d1 migrations apply my-db --remote`.',
        'Query từ Worker qua binding `env.DB.prepare()`.',
      ],
      en: [
        '`wrangler d1 create my-db` — get database_id.',
        'Write migration SQL in `migrations/`.',
        '`wrangler d1 migrations apply my-db --remote`.',
        'Query from Worker via binding `env.DB.prepare()`.',
      ],
    },
    deepDive: {
      vi: 'D1 = SQLite serverless — phù hợp bảng quan hệ nhỏ/vừa, signup form, analytics nhẹ.',
      en: 'D1 is serverless SQLite — great for small/medium relational data, signups, light analytics.',
    },
    docsLinks: [
      { label: { vi: 'D1 get started', en: 'D1 get started' }, url: 'https://developers.cloudflare.com/d1/get-started/' },
    ],
    apiLinks: [
      { label: { vi: 'Query D1', en: 'Query D1' }, url: `${CF_API}/resources/d1/subresources/database/subresources/query/methods/query/`, method: 'POST' },
    ],
    diagramSlugs: ['fullstack-application'],
    productSlugs: ['d1'],
  },
  'dp-3-l3': {
    steps: {
      vi: [
        'Dashboard → R2 → Create bucket.',
        'Binding `R2_BUCKET` trong Worker/Pages.',
        'Upload object: `bucket.put(key, stream)`.',
        'Serve public qua custom domain hoặc signed URL.',
      ],
      en: [
        'Dashboard → R2 → Create bucket.',
        'Bind `R2_BUCKET` in Worker/Pages.',
        'Upload object: `bucket.put(key, stream)`.',
        'Serve publicly via custom domain or signed URL.',
      ],
    },
    deepDive: {
      vi: 'R2 = S3-compatible, egress miễn phí — lý tưởng asset, backup, user upload.',
      en: 'R2 is S3-compatible with zero egress fees — ideal for assets, backups, user uploads.',
    },
    docsLinks: [
      { label: { vi: 'R2 get started', en: 'R2 get started' }, url: 'https://developers.cloudflare.com/r2/get-started/' },
    ],
    diagramSlugs: ['storing-user-generated-content', 'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2'],
    productSlugs: ['r2'],
  },
  'dp-4-l1': {
    steps: {
      vi: [
        'Analytics → Web Analytics → Add site (snippet hoặc automatic qua zone).',
        'Workers/Pages: bật Observability hoặc `wrangler tail`.',
        'Log structured JSON từ API routes.',
        'Alert khi error rate tăng (Logpush nếu cần).',
      ],
      en: [
        'Analytics → Web Analytics → Add site (snippet or automatic via zone).',
        'Workers/Pages: enable Observability or `wrangler tail`.',
        'Log structured JSON from API routes.',
        'Alert on error rate spikes (Logpush if needed).',
      ],
    },
    deepDive: {
      vi: 'Edge app cần observability khác server truyền thống — tail logs và analytics là bước vận hành cơ bản.',
      en: 'Edge apps need different observability than traditional servers — tail logs and analytics are baseline ops.',
    },
    docsLinks: [
      { label: { vi: 'Workers Observability', en: 'Workers Observability' }, url: 'https://developers.cloudflare.com/workers/observability/' },
      { label: { vi: 'Web Analytics', en: 'Web Analytics' }, url: 'https://developers.cloudflare.com/web-analytics/' },
    ],
    productSlugs: ['web-analytics', 'workers'],
  },
  'dp-4-l2': {
    steps: {
      vi: [
        'Turnstile dashboard → Create widget → copy site key + secret.',
        'Embed widget trên form; gửi token tới API.',
        'Server verify: POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`.',
        'Chỉ ghi DB sau khi verify success.',
      ],
      en: [
        'Turnstile dashboard → Create widget → copy site key + secret.',
        'Embed widget on form; send token to API.',
        'Server verify: POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`.',
        'Only write to DB after successful verify.',
      ],
    },
    deepDive: {
      vi: 'Turnstile thay CAPTCHA khó chịu — bảo vệ form public mà UX tốt hơn.',
      en: 'Turnstile replaces painful CAPTCHAs — protects public forms with better UX.',
    },
    docsLinks: [
      { label: { vi: 'Turnstile server-side', en: 'Turnstile server-side' }, url: 'https://developers.cloudflare.com/turnstile/get-started/server-side-validation/' },
    ],
    productSlugs: ['turnstile'],
  },
  'dp-5-l1': {
    steps: {
      vi: [
        'Tạo Worker bằng `wrangler init` hoặc dùng Worker hiện có từ dp-2.',
        'Thêm Workers AI binding tên `AI` vào cấu hình Worker.',
        'Gọi một model cho một task cụ thể (ví dụ classification hoặc text generation) từ handler server-side.',
        'Log model, latency và lỗi; test input hợp lệ, input rỗng và input quá dài trước khi thêm UI.',
      ],
      en: [
        'Create a Worker with `wrangler init` or use the Worker from dp-2.',
        'Add a Workers AI binding named `AI` to the Worker configuration.',
        'Call a model for one specific task (for example classification or text generation) from a server-side handler.',
        'Log the model, latency, and errors; test valid, empty, and overlong input before adding a UI.',
      ],
    },
    deepDive: {
      vi: 'Adoption tốt bắt đầu bằng một capability đo được, không phải chatbot chung chung. Giữ inference trong Worker để client không có quyền gọi model/binding trực tiếp.',
      en: 'Healthy adoption starts with one measurable capability, not a generic chatbot. Keep inference in the Worker so the client cannot call a model or binding directly.',
    },
    docsLinks: [
      { label: { vi: 'Workers AI — Get started', en: 'Workers AI — Get started' }, url: 'https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/' },
      { label: { vi: 'Chọn text generation model', en: 'Choose a text generation model' }, url: 'https://developers.cloudflare.com/workers-ai/guides/tutorials/how-to-choose-the-right-text-generation-model/' },
    ],
    diagramSlugs: ['ai-composable'],
    productSlugs: ['workers-ai'],
  },
  'dp-5-l2': {
    steps: {
      vi: [
        'Tạo AI Gateway và đặt tên theo environment (development, staging, production).',
        'Route một model call từ Worker qua gateway thay vì gọi provider trực tiếp.',
        'Gắn request metadata không nhạy cảm: feature, environment và authenticated user/tenant ID đã được pseudonymize nếu cần.',
        'Review logs, cache behavior, lỗi và usage trước khi thêm provider hoặc fallback khác.',
      ],
      en: [
        'Create an AI Gateway and name it for the environment (development, staging, production).',
        'Route one model call from the Worker through the gateway instead of calling a provider directly.',
        'Attach non-sensitive request metadata: feature, environment, and a pseudonymized authenticated user or tenant ID where needed.',
        'Review logs, cache behavior, errors, and usage before adding another provider or fallback.',
      ],
    },
    deepDive: {
      vi: 'Gateway là control plane cho adoption: giúp team so sánh model và quan sát usage mà không copy provider logic hoặc credential khắp codebase. Không log prompt/response nhạy cảm chỉ để debug.',
      en: 'A gateway is an adoption control plane: it helps teams compare models and observe usage without copying provider logic or credentials across the codebase. Do not log sensitive prompts or responses just for debugging.',
    },
    docsLinks: [
      { label: { vi: 'AI Gateway — Get started', en: 'AI Gateway — Get started' }, url: 'https://developers.cloudflare.com/ai-gateway/get-started/' },
      { label: { vi: 'Tạo AI Gateway đầu tiên với Workers', en: 'Create a first AI Gateway with Workers' }, url: 'https://developers.cloudflare.com/ai-gateway/tutorials/create-first-aig-workers/' },
    ],
    diagramSlugs: ['ai-multivendor-observability-control'],
    productSlugs: ['ai-gateway', 'workers-ai'],
  },
  'dp-5-l3': {
    steps: {
      vi: [
        'Lưu provider key, gateway token và credential tool bằng `wrangler secret put`; không đưa chúng vào client bundle hoặc repo.',
        'Xác thực user/tenant trước AI endpoint và authorize mỗi action theo policy server-side.',
        'Rate limit endpoint theo identity và cost/risk; bảo vệ form/chat public bằng Turnstile khi phù hợp.',
        'Validate mọi tool argument theo schema; deny-by-default cho action ghi, external request hoặc truy cập dữ liệu nhạy cảm.',
      ],
      en: [
        'Store provider keys, gateway tokens, and tool credentials with `wrangler secret put`; never put them in a client bundle or repository.',
        'Authenticate the user or tenant before an AI endpoint and authorize every action with server-side policy.',
        'Rate-limit the endpoint by identity and cost or risk; protect public chat or forms with Turnstile where appropriate.',
        'Validate every tool argument against a schema; deny by default for writes, external requests, or sensitive-data access.',
      ],
    },
    deepDive: {
      vi: 'Prompt injection không được giải quyết chỉ bằng prompt. Treat model output là untrusted input: nó không thể tự cấp quyền, chọn tool unrestricted hay vượt qua authorization của app.',
      en: 'Prompt injection is not solved by a prompt alone. Treat model output as untrusted input: it must not grant itself access, choose an unrestricted tool, or bypass application authorization.',
    },
    docsLinks: [
      { label: { vi: 'Workers secrets', en: 'Workers secrets' }, url: 'https://developers.cloudflare.com/workers/configuration/secrets/' },
      { label: { vi: 'AI Gateway guardrails', en: 'AI Gateway guardrails' }, url: 'https://developers.cloudflare.com/ai-gateway/features/guardrails/' },
      { label: { vi: 'Turnstile server-side validation', en: 'Turnstile server-side validation' }, url: 'https://developers.cloudflare.com/turnstile/get-started/server-side-validation/' },
    ],
    productSlugs: ['ai-gateway', 'turnstile'],
  },
  'dp-5-l4': {
    steps: {
      vi: [
        'Xác định document nào được ingest và ACL nào áp dụng cho từng user/tenant trước khi tạo embedding.',
        'Lưu original documents trong R2; chunk document có metadata source, version và access scope.',
        'Tạo embeddings và upsert vào Vectorize; tách ingestion job khỏi query path.',
        'Ở query time: authorize user trước, retrieve only allowed chunks, đưa sources vào prompt và đánh giá grounded answer.',
      ],
      en: [
        'Define which documents are ingested and which ACL applies to every user or tenant before creating embeddings.',
        'Store original documents in R2; chunk documents with source, version, and access-scope metadata.',
        'Create embeddings and upsert them to Vectorize; keep ingestion jobs separate from the query path.',
        'At query time: authorize the user first, retrieve only allowed chunks, put sources in the prompt, and evaluate grounded answers.',
      ],
    },
    deepDive: {
      vi: 'RAG tăng chất lượng câu trả lời nhưng không thay thế authorization hoặc data lifecycle. Embedding có thể tiết lộ semantic information, nên enforce tenant/ACL filter trước retrieval và có retention/deletion plan.',
      en: 'RAG improves answer quality but does not replace authorization or a data lifecycle. Embeddings can reveal semantic information, so enforce tenant or ACL filters before retrieval and have a retention and deletion plan.',
    },
    docsLinks: [
      { label: { vi: 'Vectorize — Get started', en: 'Vectorize — Get started' }, url: 'https://developers.cloudflare.com/vectorize/get-started/' },
      { label: { vi: 'Build a RAG AI', en: 'Build a RAG AI' }, url: 'https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/' },
    ],
    diagramSlugs: ['ai-rag'],
    productSlugs: ['vectorize', 'workers-ai', 'r2'],
  },
  'dp-5-l5': {
    steps: {
      vi: [
        'Chọn một workflow stateful thật sự cần Agent (ví dụ conversation/session); nếu chỉ là API call stateless, bắt đầu bằng Worker thường.',
        'Định nghĩa từng tool bằng input/output schema, timeout, audit log và permission tối thiểu.',
        'Implement authorization bên trong tool/server; không tin model sẽ chọn user, tenant hay resource đúng.',
        'Viết skills như knowledge/instructions có version, test tool failure path và add human approval cho action có tác động cao.',
      ],
      en: [
        'Choose a workflow that truly needs an Agent (for example a conversation or session); if it is only a stateless API call, start with a regular Worker.',
        'Define each tool with an input/output schema, timeout, audit log, and minimum permissions.',
        'Implement authorization inside the tool or server; do not trust the model to select the correct user, tenant, or resource.',
        'Write skills as versioned knowledge and instructions, test tool failure paths, and add human approval for high-impact actions.',
      ],
    },
    deepDive: {
      vi: 'Agent = model + state + tools + policy, không phải chỉ model call. Tool nhỏ, deterministic và auditable giảm blast radius; MCP/skills mở rộng capability nhưng không được mang secrets hoặc bypass permission.',
      en: 'An agent is model + state + tools + policy, not merely a model call. Small, deterministic, auditable tools reduce blast radius; MCP and skills extend capability but must not carry secrets or bypass permissions.',
    },
    docsLinks: [
      { label: { vi: 'Agents — Get started', en: 'Agents — Get started' }, url: 'https://developers.cloudflare.com/agents/getting-started/' },
      { label: { vi: 'Build a chat agent', en: 'Build a chat agent' }, url: 'https://developers.cloudflare.com/agents/getting-started/build-a-chat-agent/' },
      { label: { vi: 'Community MCP server', en: 'Community MCP server' }, url: 'https://developers.cloudflare.com/agents/community-mcp-server/' },
    ],
    diagramSlugs: ['enterprise-ai-agent-workspace'],
    productSlugs: ['agents', 'durable-objects'],
  },
  // ── Cloudflare One (aligned with zerotrust.cfsase.workers.dev) ──
  'c1-1-l1': {
    steps: {
      vi: [
        'Đọc overview: 9 mô-đun, checklist team name / pilot group / app đầu tiên / plan tier.',
        'Nhớ spine: Identity → Posture → Access → Gateway → DLP → AI controls, cộng inbound AI crawler (M7d).',
        'Chọn phase-1: VPN replacement (ZTNA) hoặc SWG trước — không làm tất cả cùng lúc.',
        'Ghi quyết định managed vs BYOD (ảnh hưởng split tunnel) và Free/PAYG vs Enterprise (DLP/WAN).',
      ],
      en: [
        'Read the overview: 9 modules, checklist for team name / pilot group / first app / plan tier.',
        'Remember the spine: Identity → Posture → Access → Gateway → DLP → AI controls, plus inbound AI crawlers (M7d).',
        'Pick phase-1: VPN replacement (ZTNA) or SWG first — do not do everything at once.',
        'Record managed vs BYOD (drives split tunnel) and Free/PAYG vs Enterprise (DLP/WAN).',
      ],
    },
    deepDive: {
      vi: 'Mọi service chạy trên cùng anycast edge nên traffic được verify, filter và route một lần gần user — không backhaul. Golden rule xuyên suốt: pilot → validate → expand.',
      en: 'Every service runs on the same anycast edge, so traffic is verified, filtered, and routed in one pass near the user — no backhaul. The golden rule throughout: pilot → validate → expand.',
    },
    docsLinks: [
      { label: { vi: 'Kiến trúc và quy trình (follow-along)', en: 'Architecture & workflow (follow-along)' }, url: `${ZT_ONBOARD}/architecture.html` },
      { label: { vi: 'Tổng quan onboarding', en: 'Onboarding overview' }, url: `${ZT_ONBOARD}/overview.html` },
      { label: { vi: 'Thiết lập Cloudflare One', en: 'Cloudflare One setup' }, url: 'https://developers.cloudflare.com/cloudflare-one/setup/' },
      { label: { vi: 'Kiến trúc tham chiếu SASE', en: 'SASE reference architecture' }, url: 'https://developers.cloudflare.com/reference-architecture/architectures/sase/' },
    ],
    diagramSlugs: ['secure-access-to-saas-applications-with-sase'],
    productSlugs: ['zero-trust', 'sase'],
  },
  'c1-1-l2': {
    steps: {
      vi: [
        'Đăng ký https://dash.cloudflare.com/sign-up, xác thực email, bật 2FA (My Profile → Authentication).',
        'Mở Zero Trust (`https://dash.cloudflare.com/one/`), chọn team name (chữ thường, số, gạch ngang) và plan.',
        'Ghi team domain `https://<team>.cloudflareaccess.com`. Restrict Cloudflare IdP to account members.',
        'Incognito: mở team domain, đăng nhập Cloudflare — org đã live trước khi nối IdP công ty.',
      ],
      en: [
        'Sign up at https://dash.cloudflare.com/sign-up, verify email, enable 2FA (My Profile → Authentication).',
        'Open Zero Trust (`https://dash.cloudflare.com/one/`), choose a team name (lowercase, numbers, hyphens) and a plan.',
        'Write down the team domain `https://<team>.cloudflareaccess.com`. Restrict the Cloudflare IdP to account members.',
        'In incognito: open the team domain and sign in with Cloudflare — the org is live before a corporate IdP.',
      ],
    },
    deepDive: {
      vi: 'Account = billing/admin container; team/org = instance Zero Trust; team name = nhãn vĩnh viễn trong URL. Đổi team name phá enrollment và Access. Domain không bắt buộc để bắt đầu.',
      en: 'Account = billing/admin container; team/org = the Zero Trust instance; team name = the permanent label in the URL. Changing the team name breaks enrollment and Access. A domain is not required to start.',
    },
    docsLinks: [
      { label: { vi: 'Module 1 — Account setup', en: 'Module 1 — Account setup' }, url: `${ZT_ONBOARD}/module-1-account-setup.html` },
      { label: { vi: 'Create a Zero Trust organization', en: 'Create a Zero Trust organization' }, url: 'https://developers.cloudflare.com/cloudflare-one/setup/#2-create-a-zero-trust-organization' },
    ],
    productSlugs: ['zero-trust'],
  },
  'c1-1-l3': {
    steps: {
      vi: [
        'Phân biệt: admin cần account role; employee chỉ cần enrollment + Access policy.',
        'Mời Super Admin thứ hai; daily work dùng role hẹp hơn Super Admin.',
        'Giữ Cloudflare login hoặc OTP làm break-glass nếu sau này Access bọc dashboard.',
        'Account-owned API tokens có expiry; review audit log sau mỗi thay đổi quyền.',
      ],
      en: [
        'Separate concerns: admins need account roles; employees only need enrollment + Access policies.',
        'Invite a second Super Admin; use narrower roles than Super Admin for daily work.',
        'Keep Cloudflare login or OTP as break-glass if Access later wraps the dashboard.',
        'Use account-owned API tokens with expiry; review audit logs after every permission change.',
      ],
    },
    deepDive: {
      vi: 'User groups trên account giúp on/offboard admin không sửa từng role. Organizations (Enterprise/MSSP) tách nhiều account. Break-glass identity phải luôn thỏa policy Access trên dashboard.',
      en: 'Account user groups make admin on/offboarding a group change, not per-role edits. Organizations (Enterprise/MSSP) separate multiple accounts. The break-glass identity must always satisfy any Access policy on the dashboard.',
    },
    docsLinks: [
      { label: { vi: 'Module 1b — Account administration', en: 'Module 1b — Account administration' }, url: `${ZT_ONBOARD}/module-1b-account-administration.html` },
      { label: { vi: 'Account members & roles', en: 'Account members & roles' }, url: 'https://developers.cloudflare.com/fundamentals/manage-members/' },
    ],
    productSlugs: ['zero-trust'],
  },
  'c1-2-l1': {
    steps: {
      vi: [
        'Copy callback `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback` (Google: thêm JS origin = team domain).',
        'IdP admin: đăng ký app riêng (không gallery SaaS), dán callback, tạo client secret, cấp quyền user/group + admin consent.',
        'Cloudflare One → Settings → Authentication → Add IdP; dán client ID, tenant, secret.',
        'Lưu secret một lần; đặt calendar reminder trước ngày hết hạn.',
      ],
      en: [
        'Copy the callback `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback` (Google: also JS origin = team domain).',
        'In the IdP: register your own app (not a gallery SaaS app), paste the callback, create a client secret, grant user/group permissions + admin consent.',
        'Cloudflare One → Settings → Authentication → Add IdP; paste client ID, tenant, and secret.',
        'The secret is shown once; set a calendar reminder before it expires.',
      ],
    },
    deepDive: {
      vi: 'Entra cần Graph delegated: email, offline_access, openid, profile, User.Read, Directory.Read.All, GroupMember.Read.All. Okta/Google có wizard tương tự. Cloudflare login mặc định vẫn giữ song song.',
      en: 'Entra needs Graph delegated: email, offline_access, openid, profile, User.Read, Directory.Read.All, GroupMember.Read.All. Okta/Google have similar wizards. Default Cloudflare login can stay alongside the corporate IdP.',
    },
    docsLinks: [
      { label: { vi: 'Module 2 — Identity provider', en: 'Module 2 — Identity provider' }, url: `${ZT_ONBOARD}/module-2-identity-provider.html` },
      { label: { vi: 'Identity providers', en: 'Identity providers' }, url: 'https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/' },
    ],
    productSlugs: ['access', 'zero-trust'],
  },
  'c1-2-l2': {
    steps: {
      vi: [
        'Nhấn Test trên IdP — phải thấy email và groups của bạn.',
        'Bật MFA bắt buộc tại Entra / Okta / Google trước Access policy.',
        'Bật SCIM khi sẵn sàng để offboard xóa group membership tự động.',
        'Viết policy theo IdP group; giữ Cloudflare login/OTP làm break-glass.',
      ],
      en: [
        'Click Test on the IdP — you should see your email and groups.',
        'Require MFA at Entra / Okta / Google before Access policies.',
        'Enable SCIM when ready so offboarding removes group membership automatically.',
        'Write policies against IdP groups; keep Cloudflare login/OTP as break-glass.',
      ],
    },
    deepDive: {
      vi: 'Không có group claims thì mọi “Allow Engineering” sẽ fail im lặng hoặc phải fallback per-user. Access tin IdP — MFA tại IdP là lớp mạnh nhất.',
      en: 'Without group claims, every “Allow Engineering” rule silently fails or falls back to per-user lists. Access trusts your IdP — MFA at the IdP is the strongest layer.',
    },
    docsLinks: [
      { label: { vi: 'Module 2 — Test & MFA', en: 'Module 2 — Test & MFA' }, url: `${ZT_ONBOARD}/module-2-identity-provider.html` },
      { label: { vi: 'SCIM provisioning', en: 'SCIM provisioning' }, url: 'https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/' },
    ],
    productSlugs: ['access', 'zero-trust'],
  },
  'c1-3-l1': {
    steps: {
      vi: [
        'Settings → WARP Client → Device enrollment permissions → Allow emails ending in `@company.com` + IdP Module 2.',
        'Cài Cloudflare One Client từ https://one.one.one.one/ (Windows/macOS/mobile).',
        'Chọn login Cloudflare Zero Trust, nhập team name, đăng nhập IdP — không dùng consumer 1.1.1.1.',
        'Dashboard: thiết bị Connected. Cài Cloudflare root CA trước HTTP inspection.',
      ],
      en: [
        'Settings → WARP Client → Device enrollment permissions → Allow emails ending in `@company.com` + Module 2 IdP.',
        'Install the Cloudflare One Client from https://one.one.one.one/ (Windows/macOS/mobile).',
        'Choose Cloudflare Zero Trust login, enter the team name, sign in via IdP — not consumer 1.1.1.1.',
        'Dashboard: device Connected. Install the Cloudflare root CA before HTTP inspection.',
      ],
    },
    deepDive: {
      vi: 'Client là on-ramp mã hóa và nguồn posture. MDM (Intune/Jamf) cho rollout; service token cho server/fleet im lặng. Pilot một laptop trước mass deploy.',
      en: 'The client is the encrypted on-ramp and the source of posture. Use MDM (Intune/Jamf) for rollout; service tokens for silent server/fleet enroll. Pilot one laptop before mass deploy.',
    },
    docsLinks: [
      { label: { vi: 'Module 3 — Device enrollment', en: 'Module 3 — Device enrollment' }, url: `${ZT_ONBOARD}/module-3-device-enrollment.html` },
      { label: { vi: 'Cloudflare One Client (WARP)', en: 'Cloudflare One Client (WARP)' }, url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/' },
    ],
    diagramSlugs: ['securing-data-in-transit'],
    productSlugs: ['warp', 'zero-trust'],
  },
  'c1-3-l2': {
    steps: {
      vi: [
        'Default profile: Gateway with WARP, Switch Locked on, Auto connect 1 phút, captive portal on.',
        'Managed: Split Tunnels Exclude. BYOD: profile mới, Include chỉ app/mạng công ty.',
        'Match rules theo group/OS; profile hẹp đặt trên profile rộng.',
        'Verify trên device: Settings → xem profile đang apply. Prefer IP/CIDR hơn domain.',
      ],
      en: [
        'Default profile: Gateway with WARP, Switch Locked on, Auto connect 1 minute, captive portal on.',
        'Managed: Split Tunnels Exclude. BYOD: new profile, Include only company apps/networks.',
        'Match rules by group/OS; put narrow profiles above broad ones.',
        'Verify on the device: Settings → confirm which profile applied. Prefer IP/CIDR over domains.',
      ],
    },
    deepDive: {
      vi: 'Đổi Exclude↔Include xóa list. Split tunnel chỉ ảnh hưởng IP, không DNS. Local Domain Fallback không qua Gateway. Identity selector không match thiết bị enroll bằng service token.',
      en: 'Switching Exclude↔Include wipes the list. Split tunnels affect IP traffic, not DNS. Local Domain Fallback bypasses Gateway. Identity selectors do not match service-token-enrolled devices.',
    },
    docsLinks: [
      { label: { vi: 'Module 3b — Device profiles', en: 'Module 3b — Device profiles' }, url: `${ZT_ONBOARD}/module-3b-device-profiles.html` },
      { label: { vi: 'Device profiles', en: 'Device profiles' }, url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/device-profiles/' },
    ],
    productSlugs: ['warp', 'gateway'],
  },
  'c1-3-l3': {
    steps: {
      vi: [
        'Tạo WARP client check: disk encrypted, firewall, OS version (pilot: disk encryption).',
        'Enterprise: thêm service-provider check (CrowdStrike/Intune) — Tanium không dùng trong Gateway.',
        'Gắn check vào Access policy (app nhạy cảm) và/hoặc Gateway network policy.',
        'Logs → Access/Gateway: thiết bị fail check bị chặn; compliant đi qua.',
      ],
      en: [
        'Create a WARP client check: disk encrypted, firewall, OS version (pilot: disk encryption).',
        'Enterprise: add a service-provider check (CrowdStrike/Intune) — Tanium is not supported in Gateway.',
        'Attach the check to Access policies (sensitive apps) and/or Gateway network policies.',
        'Logs → Access/Gateway: failing devices are blocked; compliant devices pass.',
      ],
    },
    deepDive: {
      vi: 'Posture tái sử dụng: sửa một check, mọi policy tham chiếu cập nhật. Continuous evaluation = Zero Trust thật. Client cert hỗ trợ `${serial_number}` / `${device_uuid}`.',
      en: 'Posture is reusable: edit one check and every referencing policy updates. Continuous evaluation is the actual Zero Trust payoff. Client certs support `${serial_number}` / `${device_uuid}`.',
    },
    docsLinks: [
      { label: { vi: 'Module 3c — Posture checks', en: 'Module 3c — Posture checks' }, url: `${ZT_ONBOARD}/module-3c-posture-checks.html` },
      { label: { vi: 'Device posture', en: 'Device posture' }, url: 'https://developers.cloudflare.com/cloudflare-one/identity/devices/' },
    ],
    productSlugs: ['warp', 'access'],
  },
  'c1-4-l1': {
    steps: {
      vi: [
        'Zero Trust → Networks → Tunnels → Create cloudflared; tên theo location.',
        'Chạy lệnh install (token = secret) trên host reach app; mở outbound TCP 7844.',
        'Public hostname: subdomain + domain zone Cloudflare → URL local (`localhost:3000`).',
        'Checkpoint: connector Healthy. Thêm connector thứ hai cho HA.',
      ],
      en: [
        'Zero Trust → Networks → Tunnels → Create cloudflared; name it after the location.',
        'Run the install command (token = secret) on a host that can reach the app; allow outbound TCP 7844.',
        'Public hostname: subdomain + a Cloudflare zone domain → local URL (`localhost:3000`).',
        'Checkpoint: connector Healthy. Add a second connector for HA.',
      ],
    },
    deepDive: {
      vi: 'Tunnel outbound-only — không mở inbound firewall. Chỉ cloudflared proxy public hostname tới private app. Chưa gắn Access thì hostname vẫn public — khóa ở bài sau.',
      en: 'Tunnel is outbound-only — no inbound firewall holes. Only cloudflared proxies public hostnames to private apps. Until Access is attached, the hostname is still public — lock it in the next lesson.',
    },
    docsLinks: [
      { label: { vi: 'Module 4 — ZTNA Access', en: 'Module 4 — ZTNA Access' }, url: `${ZT_ONBOARD}/module-4-ztna-access.html` },
      { label: { vi: 'Cloudflare Tunnel', en: 'Cloudflare Tunnel' }, url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/' },
    ],
    diagramSlugs: ['secure-access-to-saas-applications-with-sase'],
    productSlugs: ['tunnel', 'access'],
  },
  'c1-4-l2': {
    steps: {
      vi: [
        'Access controls → Applications → Self-hosted; cùng hostname với Tunnel; session 24h (ngắn hơn nếu nhạy cảm).',
        'Policy Allow: IdP group + (tuỳ chọn) posture; không Allow Everyone.',
        'Instant authentication nếu một IdP; Authenticate with Cloudflare One Client cho user đã enroll.',
        'Tạo Access Group tái sử dụng; test incognito; review Access logs sau 1 tuần pilot.',
      ],
      en: [
        'Access controls → Applications → Self-hosted; same hostname as the Tunnel; session 24h (shorter if sensitive).',
        'Allow policy: IdP group + (optional) posture; not Allow Everyone.',
        'Instant authentication with a single IdP; Authenticate with Cloudflare One Client for enrolled users.',
        'Create reusable Access Groups; test in incognito; review Access logs after a one-week pilot.',
      ],
    },
    deepDive: {
      vi: 'ZTNA = quyền theo app. Rule group gom posture + email/group. Nhiều hostname phụ thuộc (iframe) nên nằm trong một application. Terraform khi số app tăng.',
      en: 'ZTNA = per-app access. Rule groups bundle posture + email/group. Interdependent hostnames (iframes) belong in one application. Use Terraform as the app count grows.',
    },
    docsLinks: [
      { label: { vi: 'Module 4 — Access policies', en: 'Module 4 — Access policies' }, url: `${ZT_ONBOARD}/module-4-ztna-access.html` },
      { label: { vi: 'Access policies', en: 'Access policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/policies/' },
      { label: { vi: 'Access applications', en: 'Access applications' }, url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/applications/' },
    ],
    diagramSlugs: ['secure-access-to-saas-applications-with-sase', 'augment-access-with-serverless'],
    productSlugs: ['access', 'ztna'],
  },
  'c1-4-l3': {
    steps: {
      vi: [
        'Chọn connector: Tunnel (app/CIDR), Mesh (any-to-any), Appliance (cả site).',
        'Tunnel: public hostname và/hoặc private network route; host ra được :7844.',
        'Mesh: node trên Linux host; verify map và ping qua mesh.',
        'Appliance: on-ramp cả chi nhánh — kết hợp với Tunnel cho app cụ thể.',
      ],
      en: [
        'Pick a connector: Tunnel (apps/CIDRs), Mesh (any-to-any), Appliance (whole site).',
        'Tunnel: public hostnames and/or private network routes; host must reach :7844.',
        'Mesh: a node on a Linux host; verify the map and ping across the mesh.',
        'Appliance: on-ramp a whole branch — combine with Tunnel for specific apps.',
      ],
    },
    deepDive: {
      vi: 'Tunnel một chiều (đưa app tới Cloudflare). Mesh hai chiều giữa site/device. Appliance cho cả văn phòng. Đừng mở inbound “cho dễ” — đó là VPN cũ.',
      en: 'Tunnel is one-way (bring the app to Cloudflare). Mesh is bidirectional between sites/devices. Appliance covers a whole office. Do not open inbound “to make it easy” — that is the old VPN.',
    },
    docsLinks: [
      { label: { vi: 'Module 4b — Connectors', en: 'Module 4b — Connectors' }, url: `${ZT_ONBOARD}/module-4b-connectors.html` },
      { label: { vi: 'Connectors', en: 'Connectors' }, url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/' },
    ],
    productSlugs: ['tunnel', 'cloudflare-wan'],
  },
  'c1-5-l1': {
    steps: {
      vi: [
        'Gateway → Firewall policies → DNS: Block Security Categories (malware, phishing, C2, cryptomining, DNS tunneling…).',
        'Pilot device: mở `https://malware.testcategory.com` — phải thấy block page.',
        'Thêm Network policies; rồi HTTP với TLS decryption sau khi root CA đã cài.',
        'Do Not Inspect cho cert-pinning và Microsoft 365. Log/monitor trước Block rộng.',
      ],
      en: [
        'Gateway → Firewall policies → DNS: Block Security Categories (malware, phishing, C2, cryptomining, DNS tunneling…).',
        'On a pilot device: open `https://malware.testcategory.com` — you should see the block page.',
        'Add Network policies; then HTTP with TLS decryption after the root CA is installed.',
        'Do Not Inspect for certificate pinning and Microsoft 365. Log/monitor before wide Blocks.',
      ],
    },
    deepDive: {
      vi: 'DNS lọc trước khi TCP — an toàn để bắt đầu. HTTP inspection mở DLP và AI prompt scan. DNS Locations bảo vệ office không cần WARP.',
      en: 'DNS filtering happens before TCP — the safest first step. HTTP inspection unlocks DLP and AI prompt scanning. DNS Locations protect offices without WARP.',
    },
    docsLinks: [
      { label: { vi: 'Module 5 — Gateway', en: 'Module 5 — Gateway' }, url: `${ZT_ONBOARD}/module-5-gateway.html` },
      { label: { vi: 'Gateway traffic policies', en: 'Gateway traffic policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/traffic-policies/' },
      { label: { vi: 'Gateway DNS policies', en: 'Gateway DNS policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/dns-policies/' },
    ],
    diagramSlugs: ['securing-data-in-transit'],
    productSlugs: ['gateway', 'swg', 'warp'],
  },
  'c1-5-l2': {
    steps: {
      vi: [
        'Xác định SaaS nào allowlist IP công ty — cần dedicated egress.',
        'Tạo egress policy theo identity/group; gán dedicated IPs.',
        'Nếu allowlist lệch vì IPv6, tắt IPv6 trên device profile.',
        'Pilot: so sánh IP public trước/sau (`https://one.one.one.one/help` hoặc whatsmyip).',
      ],
      en: [
        'List which SaaS apps allowlist company IPs — those need dedicated egress.',
        'Create egress policies by identity/group; assign dedicated IPs.',
        'If the allowlist misses you because of IPv6, disable IPv6 on the device profile.',
        'Pilot: compare public IP before/after (`https://one.one.one.one/help` or whatsmyip).',
      ],
    },
    deepDive: {
      vi: 'Egress control nằm cuối stack Gateway. Dedicated IP là entitlement — xác nhận plan trước khi hứa với chủ SaaS.',
      en: 'Egress control sits at the end of the Gateway stack. Dedicated IPs are an entitlement — confirm the plan before promising them to a SaaS owner.',
    },
    docsLinks: [
      { label: { vi: 'Module 5b — Egress policies', en: 'Module 5b — Egress policies' }, url: `${ZT_ONBOARD}/module-5b-egress-policies.html` },
      { label: { vi: 'Egress policies', en: 'Egress policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/egress-policies/' },
    ],
    productSlugs: ['gateway', 'swg'],
  },
  'c1-5-l3': {
    steps: {
      vi: [
        'Bật Browser Isolation cho category hoặc hostname rủi ro (kèm identity).',
        'Tắt copy/paste, upload, print trên session isolated nếu data-sensitive.',
        'Clientless isolation cho contractor không cài WARP (không có posture).',
        'Test journey: login SaaS, upload file, clipboard — rồi mới isolate cả category.',
      ],
      en: [
        'Enable Browser Isolation for risky categories or hostnames (scoped by identity).',
        'Disable copy/paste, upload, and print on isolated sessions when data is sensitive.',
        'Use clientless isolation for contractors without WARP (no device posture).',
        'Test the journey: SaaS login, file upload, clipboard — then isolate a whole category.',
      ],
    },
    deepDive: {
      vi: 'RBI tách browsing khỏi endpoint. Kết hợp DLP trên isolated session cho AI upload. Không thay WARP cho toàn workforce — dùng có chọn lọc.',
      en: 'RBI isolates browsing from the endpoint. Combine DLP on isolated sessions for AI uploads. It does not replace WARP for the whole workforce — use it selectively.',
    },
    docsLinks: [
      { label: { vi: 'Module 5c — Browser Isolation', en: 'Module 5c — Browser Isolation' }, url: `${ZT_ONBOARD}/module-5c-remote-browser-isolation.html` },
      { label: { vi: 'Remote Browser Isolation', en: 'Remote Browser Isolation' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/' },
    ],
    productSlugs: ['browser-isolation', 'swg', 'warp'],
  },
  'c1-5-l4': {
    steps: {
      vi: [
        'Bật CASB / Shadow IT discovery; inventory AI SaaS và owner/data type.',
        'Review findings: token, user, unsanctioned file sharing.',
        'Với mỗi tool: allow + guardrail, isolate, hoặc block — luôn có sanctioned alternative trước block.',
        'Feeds Module 7 (AI controls) và Module 6 (DLP trên destination đó).',
      ],
      en: [
        'Enable CASB / Shadow IT discovery; inventory AI SaaS and owner/data type.',
        'Review findings: tokens, users, unsanctioned file sharing.',
        'For each tool: allow + guardrails, isolate, or block — have a sanctioned alternative before blocking.',
        'This feeds Module 7 (AI controls) and Module 6 (DLP on those destinations).',
      ],
    },
    deepDive: {
      vi: 'Visibility trước enforcement. Block mù Shadow AI = usage trên điện thoại. Radar là intelligence, không phải policy engine.',
      en: 'Visibility before enforcement. Blind-blocking Shadow AI just moves usage onto phones. Radar is intelligence, not a policy engine.',
    },
    docsLinks: [
      { label: { vi: 'Module 5d — Shadow IT', en: 'Module 5d — Shadow IT' }, url: `${ZT_ONBOARD}/module-5d-shadow-it.html` },
      { label: { vi: 'CASB', en: 'CASB' }, url: 'https://developers.cloudflare.com/cloudflare-one/applications/scan-apps/' },
    ],
    diagramSlugs: ['securing-data-at-rest'],
    productSlugs: ['casb', 'dlp'],
  },
  'c1-6-l1': {
    steps: {
      vi: [
        'Xác nhận Enterprise và TLS decryption đang on — không thì DLP profile không xuất hiện.',
        'Zero Trust → DLP → Profiles: bật Financial / PII / Credentials / Source Code (hoặc custom regex).',
        'Confidence Medium; minimum match count 1 cho high-risk.',
        'HTTP policy Allow + DLP profile, mọi destination, 1–2 tuần — chỉ log.',
      ],
      en: [
        'Confirm Enterprise and that TLS decryption is on — otherwise DLP profiles will not appear.',
        'Zero Trust → DLP → Profiles: enable Financial / PII / Credentials / Source Code (or custom regex).',
        'Confidence Medium; minimum match count 1 for high-risk.',
        'HTTP policy Allow + DLP profile, all destinations, 1–2 weeks — log only.',
      ],
    },
    deepDive: {
      vi: 'DLP chỉ thấy payload đã decrypt. Monitor-first tránh false positive. Context words gần pattern tăng confidence (ví dụ “SSN” cạnh 9 số).',
      en: 'DLP only sees decrypted payloads. Monitor-first avoids false positives. Nearby context words raise confidence (for example “SSN” next to nine digits).',
    },
    docsLinks: [
      { label: { vi: 'Module 6 — DLP', en: 'Module 6 — DLP' }, url: `${ZT_ONBOARD}/module-6-dlp.html` },
      { label: { vi: 'Data loss prevention', en: 'Data loss prevention' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/' },
    ],
    diagramSlugs: ['securing-data-in-transit', 'securing-data-at-rest'],
    productSlugs: ['dlp', 'gateway'],
  },
  'c1-6-l2': {
    steps: {
      vi: [
        'Tune profile: tắt detector noisy, tăng confidence/match count.',
        'Block hoặc Isolate khi DLP match tới unsanctioned AI / personal email / public file share.',
        'Giữ Allow+log cho destination sanctioned.',
        'Review DLP logs theo tuần; profile tái sử dụng — sửa một lần, mọi policy đổi.',
      ],
      en: [
        'Tune the profile: disable noisy detectors, raise confidence/match count.',
        'Block or Isolate on DLP match to unsanctioned AI / personal email / public file shares.',
        'Keep Allow+log for sanctioned destinations.',
        'Review DLP logs weekly; profiles are reusable — edit once, every policy updates.',
      ],
    },
    deepDive: {
      vi: 'Enforce hẹp theo destination trước, không Block toàn internet. Kết hợp RBI khi cần cho user vẫn xem nhưng không paste/upload.',
      en: 'Enforce narrowly by destination first, not Block-the-whole-internet. Combine RBI when users should still view but not paste/upload.',
    },
    docsLinks: [
      { label: { vi: 'Module 6 — Enforce DLP', en: 'Module 6 — Enforce DLP' }, url: `${ZT_ONBOARD}/module-6-dlp.html` },
      { label: { vi: 'DLP profiles', en: 'DLP profiles' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/dlp-profiles/' },
    ],
    productSlugs: ['dlp', 'casb'],
  },
  'c1-7-l1': {
    steps: {
      vi: [
        'Từ Shadow IT: danh sách AI sanctioned vs unsanctioned.',
        'Gateway HTTP: allow ChatGPT/Gemini/Claude có DLP trên prompt; isolate hoặc block tool còn lại.',
        'RBI cho workflow upload source code / PII vào AI.',
        'Đừng hard-block ChatGPT nếu chưa có alternative — mất visibility.',
      ],
      en: [
        'From Shadow IT: list sanctioned vs unsanctioned AI.',
        'Gateway HTTP: allow ChatGPT/Gemini/Claude with DLP on prompts; isolate or block the rest.',
        'Use RBI for workflows that upload source code / PII into AI.',
        'Do not hard-block ChatGPT without an alternative — you lose visibility.',
      ],
    },
    deepDive: {
      vi: 'Bốn lớp: discover (5d) → control apps (7) → protect prompts (6+7) → govern MCP agents (7b). App bạn build dùng AI Gateway/WAF (7c), không nhầm với SWG nhân viên.',
      en: 'Four layers: discover (5d) → control apps (7) → protect prompts (6+7) → govern MCP agents (7b). Apps you build use AI Gateway/WAF (7c), not the employee SWG.',
    },
    docsLinks: [
      { label: { vi: 'Module 7 — AI controls', en: 'Module 7 — AI controls' }, url: `${ZT_ONBOARD}/module-7-ai-controls.html` },
      { label: { vi: 'Holistic AI security learning path', en: 'Holistic AI security learning path' }, url: 'https://developers.cloudflare.com/learning-paths/holistic-ai-security/' },
    ],
    productSlugs: ['casb', 'dlp', 'swg'],
  },
  'c1-7-l2': {
    steps: {
      vi: [
        'Quyết định từng MCP server: Access làm OAuth (server validate JWT) hay OAuth sẵn có của server.',
        'Access → MCP servers: add server, policy visibility trên portal.',
        'Tạo MCP portal: subdomain, curate tools/prompts, portal URL.',
        'Human: Managed OAuth. Agent: service token. Xác nhận tool call trong Access logs.',
      ],
      en: [
        'Decide per MCP server: Access as OAuth (server validates JWT) or the server’s own OAuth.',
        'Access → MCP servers: add the server, visibility policies on the portal.',
        'Create an MCP portal: subdomain, curated tools/prompts, portal URL.',
        'Humans: Managed OAuth. Agents: service tokens. Confirm tool calls in Access logs.',
      ],
    },
    deepDive: {
      vi: 'Policy portal chỉ ẩn tool — user vẫn hit URL trực tiếp nếu Access không phải OAuth provider. Independent MFA không enforce qua portal. Server third-party không sửa code thì dùng OAuth của họ.',
      en: 'Portal policies only hide tools — users can still hit the direct URL unless Access is the OAuth provider. Independent MFA is not enforced through a portal. Third-party servers you cannot change should keep their own OAuth.',
    },
    docsLinks: [
      { label: { vi: 'Module 7b — Secure AI & MCP', en: 'Module 7b — Secure AI & MCP' }, url: `${ZT_ONBOARD}/module-7b-mcp-portals.html` },
      { label: { vi: 'MCP server portals', en: 'MCP server portals' }, url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/' },
    ],
    diagramSlugs: ['enterprise-ai-agent-workspace'],
    productSlugs: ['access', 'agents'],
  },
  'c1-7-l3': {
    steps: {
      vi: [
        'Tạo AI Gateway; trỏ app/agent vào gateway endpoint; xác nhận request trong AI → AI Gateway.',
        'Bật Authenticated Gateway (token); BYOK / Store Keys cho provider key.',
        'Guardrails cho unsafe content; DLP profile (Enterprise) trên request — response scan làm chậm streaming.',
        'Cost/rate limit; `cf-aig-collect-log-payload: false` nếu không được persist prompt. Gateway riêng cho RAG.',
      ],
      en: [
        'Create an AI Gateway; point the app/agent at the gateway endpoint; confirm requests under AI → AI Gateway.',
        'Enable Authenticated Gateway (token); BYOK / Store Keys for the provider key.',
        'Guardrails for unsafe content; DLP profiles (Enterprise) on the request — response scanning slows streaming.',
        'Cost/rate limits; `cf-aig-collect-log-payload: false` if you must not persist prompts. Dedicated gateway for RAG.',
      ],
    },
    deepDive: {
      vi: 'AI Gateway là control API-layer: không WARP, không TLS decrypt. Phù hợp backend, batch, agent. Guardrails ≠ DLP. Token gateway ≠ provider API key.',
      en: 'AI Gateway is an API-layer control: no WARP, no TLS decrypt. It fits backends, batch jobs, and agents. Guardrails ≠ DLP. The gateway token ≠ the provider API key.',
    },
    docsLinks: [
      { label: { vi: 'Module 7c — AI Gateway', en: 'Module 7c — AI Gateway' }, url: `${ZT_ONBOARD}/module-7c-ai-gateway.html` },
      { label: { vi: 'AI Gateway', en: 'AI Gateway' }, url: 'https://developers.cloudflare.com/ai-gateway/' },
    ],
    productSlugs: ['ai-gateway', 'dlp'],
  },
  'c1-7-l4': {
    steps: {
      vi: [
        'Security → AI Audit / Crawlers: xem crawler nào hit site.',
        'Policy theo purpose: Training / Agent / Search — Allow, Block, hoặc Block on pages with ads.',
        'Enforce robots.txt; WAF custom rule nếu cần per-path.',
        'Tuỳ chọn Pay Per Crawl (HTTP 402). Review default mới từ 15 Sep 2026 cho domain mới.',
      ],
      en: [
        'Security → AI Audit / Crawlers: see which crawlers hit the site.',
        'Policy by purpose: Training / Agent / Search — Allow, Block, or Block on pages with ads.',
        'Enforce robots.txt; WAF custom rules if you need per-path control.',
        'Optional Pay Per Crawl (HTTP 402). Review new defaults from 15 Sep 2026 for new domains.',
      ],
    },
    deepDive: {
      vi: 'Đây là làn inbound (crawler → content của bạn), không phải SWG nhân viên. Free plan nhận diện theo user-agent; Bot Management bắt crawler không self-identify.',
      en: 'This is the inbound lane (crawlers → your content), not employee SWG. The Free plan identifies crawlers by user-agent; Bot Management catches crawlers that do not self-identify.',
    },
    docsLinks: [
      { label: { vi: 'Module 7d — Agentic Internet', en: 'Module 7d — Agentic Internet' }, url: `${ZT_ONBOARD}/module-7d-agentic-internet.html` },
      { label: { vi: 'AI crawl control', en: 'AI crawl control' }, url: 'https://developers.cloudflare.com/ai-crawl-control/' },
      { label: { vi: 'Cloudflare Radar', en: 'Cloudflare Radar' }, url: 'https://radar.cloudflare.com/' },
    ],
    productSlugs: ['bots', 'waf'],
  },
  'c1-8-l1': {
    steps: {
      vi: [
        'Pre-flight: MSS clamping trên WAN/firewall — quên thì HTTP OK, HTTPS treo.',
        'Chọn on-ramp: IPsec / GRE / Connector / CNI. Maintenance window + rollback.',
        'Tạo hai tunnel; match PSK, lifetime, proposal trên firewall; health check Healthy.',
        'Một site, IP space không overlap với site khác.',
      ],
      en: [
        'Pre-flight: MSS clamping on the WAN/firewall — skip it and HTTP works while HTTPS hangs.',
        'Pick an on-ramp: IPsec / GRE / Connector / CNI. Maintenance window + rollback.',
        'Create two tunnels; match PSK, lifetime, and proposals on the firewall; health checks Healthy.',
        'One site first, with IP space that does not overlap another site.',
      ],
    },
    deepDive: {
      vi: 'Cloudflare WAN thay MPLS/VPN mesh cho cả site, không chỉ laptop. Đụng production routing — console access bắt buộc. Enterprise entitlement.',
      en: 'Cloudflare WAN replaces MPLS/VPN meshes for whole sites, not just laptops. It touches production routing — console access is mandatory. Enterprise entitlement.',
    },
    docsLinks: [
      { label: { vi: 'Module 8 — Cloudflare WAN', en: 'Module 8 — Cloudflare WAN' }, url: `${ZT_ONBOARD}/module-8-magic-wan.html` },
      { label: { vi: 'Cloudflare WAN', en: 'Cloudflare WAN' }, url: 'https://developers.cloudflare.com/magic-wan/' },
    ],
    productSlugs: ['cloudflare-wan', 'sase'],
  },
  'c1-8-l2': {
    steps: {
      vi: [
        'Static routes cho site ổn định, hoặc BGP khi nhiều site thay đổi — đưa subnet vào Magic routing table.',
        'Magic Firewall baseline; gửi site traffic qua Gateway (DNS/HTTP/DLP giống WARP).',
        'Test: ping/HTTPS, failover tunnel, Gateway block page từ site.',
        'Logpush Access+Gateway; retire MPLS/VPN theo wave sau khi failover đã chứng minh.',
      ],
      en: [
        'Static routes for stable sites, or BGP when many sites change — put subnets in the Magic routing table.',
        'Magic Firewall baseline; send site traffic through Gateway (DNS/HTTP/DLP like WARP).',
        'Test: ping/HTTPS, tunnel failover, Gateway block page from the site.',
        'Logpush Access+Gateway; retire MPLS/VPN in waves after failover is proven.',
      ],
    },
    deepDive: {
      vi: 'Go-live: SIEM, pilot, expand, retire VPN. Overlapping RFC1918 giữa chi nhánh là lỗi cổ điển — re-IP hoặc unique ranges trước.',
      en: 'Go-live: SIEM, pilot, expand, retire VPN. Overlapping RFC1918 between branches is the classic failure — re-IP or unique ranges first.',
    },
    docsLinks: [
      { label: { vi: 'Module 8 — Routing & Gateway', en: 'Module 8 — Routing & Gateway' }, url: `${ZT_ONBOARD}/module-8-magic-wan.html` },
      { label: { vi: 'Configuration runbook', en: 'Configuration runbook' }, url: `${ZT_ONBOARD}/configuration-runbook.html` },
      { label: { vi: 'Magic WAN on-ramps', en: 'Magic WAN on-ramps' }, url: 'https://developers.cloudflare.com/magic-wan/configuration/manually/third-party/' },
    ],
    productSlugs: ['cloudflare-wan', 'gateway'],
  },

};

function buildDefaultEnrichment(lesson: TrackLesson, track: Track): TrackLessonEnrichment {
  const sentencesVi = lesson.body.vi.split(/(?<=[.!?])\s+/).filter(Boolean);
  const sentencesEn = lesson.body.en.split(/(?<=[.!?])\s+/).filter(Boolean);
  return {
    steps: {
      vi: sentencesVi.length >= 2 ? sentencesVi : [lesson.body.vi, 'Kiểm tra kết quả trên dashboard.', 'Ghi chú lại thay đổi cho team.'],
      en: sentencesEn.length >= 2 ? sentencesEn : [lesson.body.en, 'Verify results in the dashboard.', 'Document changes for your team.'],
    },
    deepDive: lesson.body,
    docsLinks: [
      {
        label: { vi: 'Cloudflare Developer Docs', en: 'Cloudflare Developer Docs' },
        url: 'https://developers.cloudflare.com/',
      },
    ],
  };
}

export function getLessonEnrichment(lesson: FlatTrackLesson): TrackLessonEnrichment {
  const base =
    trackLessonEnrichment[lesson.id] ??
    buildDefaultEnrichment(lesson, tracks.find((t) => t.slug === lesson.trackSlug)!);
  const bestPracticeNote = trackLessonBestPractices[lesson.id];
  return bestPracticeNote ? { ...base, bestPracticeNote } : base;
}

export function getLessonDiagrams(lesson: FlatTrackLesson): ReferenceDiagram[] {
  const enrichment = getLessonEnrichment(lesson);
  const slugs = enrichment.diagramSlugs ?? [];
  return slugs.map((s) => getDiagramBySlug(s)).filter((d): d is ReferenceDiagram => !!d);
}

export function getLessonHeroImage(lesson: FlatTrackLesson): string | undefined {
  const diagrams = getLessonDiagrams(lesson);
  return diagrams[0]?.primaryImageUrl;
}
