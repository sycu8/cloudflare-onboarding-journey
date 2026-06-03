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
  // ── Cloudflare One ──
  'c1-1-l1': {
    steps: {
      vi: [
        'Liệt kê users: employee, contractor, partner.',
        'Map groups trong Google Workspace / Azure AD / Okta.',
        'Xác định ai cần app nào (Eng, Sales, All).',
        'Document trong spreadsheet trước khi cấu hình Access.',
      ],
      en: [
        'List users: employees, contractors, partners.',
        'Map groups in Google Workspace / Azure AD / Okta.',
        'Define who needs which apps (Eng, Sales, All).',
        'Document in a spreadsheet before configuring Access.',
      ],
    },
    deepDive: {
      vi: 'Zero Trust bắt đầu từ identity — policy theo group IdP dễ maintain hơn policy per-user.',
      en: 'Zero Trust starts with identity — IdP group policies are easier to maintain than per-user rules.',
    },
    docsLinks: [
      { label: { vi: 'Zero Trust setup', en: 'Zero Trust setup' }, url: 'https://developers.cloudflare.com/cloudflare-one/setup/' },
    ],
    productSlugs: ['zero-trust', 'access'],
  },
  'c1-1-l2': {
    steps: {
      vi: [
        'Inventory SaaS (Notion, Jira) và private app (admin, SSH).',
        'Chọn 1 app ít rủi ro cho pilot (wiki staging).',
        'Ghi hostname/IP và protocol (HTTP, SSH, RDP).',
        'Xác định ai trong pilot group được truy cập.',
      ],
      en: [
        'Inventory SaaS (Notion, Jira) and private apps (admin, SSH).',
        'Pick one low-risk app for pilot (staging wiki).',
        'Record hostname/IP and protocol (HTTP, SSH, RDP).',
        'Define who in the pilot group may access.',
      ],
    },
    deepDive: {
      vi: 'Pilot nhỏ giúp học policy và rollback — tránh rollout VPN replacement big-bang.',
      en: 'A small pilot teaches policy and rollback — avoid big-bang VPN replacement rollouts.',
    },
    docsLinks: [
      { label: { vi: 'Access applications', en: 'Access applications' }, url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/applications/' },
    ],
    diagramSlugs: ['secure-access-to-saas-applications-with-sase'],
    productSlugs: ['access', 'tunnel'],
  },
  'c1-2-l1': {
    steps: {
      vi: [
        'Zero Trust → Settings → Authentication → Add IdP.',
        'Chọn Google / Azure / Okta — làm theo wizard OAuth/SAML.',
        'Test login flow với admin account.',
        'Bật MFA bắt buộc tại IdP trước Access policy.',
      ],
      en: [
        'Zero Trust → Settings → Authentication → Add IdP.',
        'Choose Google / Azure / Okta — follow OAuth/SAML wizard.',
        'Test login flow with an admin account.',
        'Require MFA at IdP before Access policies.',
      ],
    },
    deepDive: {
      vi: 'Access tin IdP của bạn — MFA tại IdP là lớp bảo mật quan trọng nhất.',
      en: 'Access trusts your IdP — MFA at the IdP is the most important security layer.',
    },
    docsLinks: [
      { label: { vi: 'Identity providers', en: 'Identity providers' }, url: 'https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/' },
    ],
    productSlugs: ['access', 'zero-trust'],
  },
  'c1-2-l2': {
    steps: {
      vi: [
        'Access → Applications → Add application (Self-hosted hoặc SaaS).',
        'Policy: Allow group Eng → staging; Allow All → wiki.',
        'Require device posture (nếu có) cho app nhạy cảm.',
        'Review Access logs sau 1 tuần pilot.',
      ],
      en: [
        'Access → Applications → Add application (Self-hosted or SaaS).',
        'Policy: Allow Eng group → staging; Allow All → wiki.',
        'Require device posture (if available) for sensitive apps.',
        'Review Access logs after a one-week pilot.',
      ],
    },
    deepDive: {
      vi: 'ZTNA = quyền theo app, không phải toàn mạng — mỗi policy nên có owner và review date.',
      en: 'ZTNA = per-app access, not full network — each policy should have an owner and review date.',
    },
    docsLinks: [
      { label: { vi: 'Access policies', en: 'Access policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/access-controls/policies/' },
    ],
    diagramSlugs: ['secure-access-to-saas-applications-with-sase', 'augment-access-with-serverless'],
    productSlugs: ['access', 'ztna'],
  },
  'c1-3-l1': {
    steps: {
      vi: [
        'Gateway → DNS policies: block malware/phishing categories.',
        'Deploy WARP client trên laptop pilot users.',
        'Test DNS filtering với domain test.',
        'Monitor Gateway logs cho false block.',
      ],
      en: [
        'Gateway → DNS policies: block malware/phishing categories.',
        'Deploy WARP client on pilot user laptops.',
        'Test DNS filtering with a test domain.',
        'Monitor Gateway logs for false blocks.',
      ],
    },
    deepDive: {
      vi: 'SWG bảo vệ user khi ra Internet — bổ sung ZTNA (vào app) bằng kiểm soát browsing.',
      en: 'SWG protects users on the Internet — complementing ZTNA (app access) with browsing controls.',
    },
    docsLinks: [
      { label: { vi: 'Gateway DNS policies', en: 'Gateway DNS policies' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/dns-policies/' },
    ],
    diagramSlugs: ['securing-data-in-transit'],
    productSlugs: ['gateway', 'swg', 'warp'],
  },
  'c1-3-l2': {
    steps: {
      vi: [
        'Sau ZTNA ổn định: bật CASB scan SaaS (Shadow IT).',
        'Gateway HTTP policies: block upload PII ra SaaS không approved.',
        'DLP profiles: credit card, national ID patterns.',
        'Pilot DLP với log-only trước block.',
      ],
      en: [
        'After stable ZTNA: enable CASB SaaS scanning (Shadow IT).',
        'Gateway HTTP policies: block PII uploads to unapproved SaaS.',
        'DLP profiles: credit card, national ID patterns.',
        'Pilot DLP in log-only before block.',
      ],
    },
    deepDive: {
      vi: 'CASB + DLP là lớp tiếp theo — đừng bật cùng lúc với ZTNA pilot để tránh overwhelm support.',
      en: 'CASB + DLP are the next layer — don’t enable alongside ZTNA pilot to avoid overwhelming support.',
    },
    docsLinks: [
      { label: { vi: 'CASB', en: 'CASB' }, url: 'https://developers.cloudflare.com/cloudflare-one/casb/' },
      { label: { vi: 'DLP', en: 'DLP' }, url: 'https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/' },
    ],
    diagramSlugs: ['securing-data-in-transit', 'securing-data-at-rest'],
    productSlugs: ['casb', 'dlp'],
  },
  'c1-4-l1': {
    steps: {
      vi: [
        'Chọn phòng ban wave 2 (Sales, Finance) sau pilot thành công.',
        'Communication plan + office hours tuần rollout.',
        'Rollback: giữ VPN read-only song song 2 tuần.',
        'Thu thập feedback ticket và fix policy.',
      ],
      en: [
        'Pick department wave 2 (Sales, Finance) after successful pilot.',
        'Communication plan + rollout week office hours.',
        'Rollback: keep VPN read-only in parallel for 2 weeks.',
        'Collect feedback tickets and fix policies.',
      ],
    },
    deepDive: {
      vi: 'Rollout theo wave giảm rủi ro — VPN song song là safety net quan trọng.',
      en: 'Wave rollout reduces risk — parallel VPN is an important safety net.',
    },
    docsLinks: [
      { label: { vi: 'Zero Trust deployment', en: 'Zero Trust deployment' }, url: 'https://developers.cloudflare.com/cloudflare-one/implementation-guides/' },
    ],
    productSlugs: ['zero-trust', 'warp'],
  },
  'c1-4-l2': {
    steps: {
      vi: [
        'Track: VPN ticket volume, time-to-grant new app access.',
        'Security: malware blocks, DLP incidents.',
        'Review Access/Gateway policies hàng quý.',
        'Document wins cho stakeholder buy-in.',
      ],
      en: [
        'Track: VPN ticket volume, time-to-grant new app access.',
        'Security: malware blocks, DLP incidents.',
        'Review Access/Gateway policies quarterly.',
        'Document wins for stakeholder buy-in.',
      ],
    },
    deepDive: {
      vi: 'Zero Trust cần KPI rõ — giảm VPN ticket và thời gian cấp quyền là chứng cứ thuyết phục.',
      en: 'Zero Trust needs clear KPIs — fewer VPN tickets and faster app access prove value.',
    },
    docsLinks: [
      { label: { vi: 'Zero Trust analytics', en: 'Zero Trust analytics' }, url: 'https://developers.cloudflare.com/cloudflare-one/insights/analytics/' },
    ],
    productSlugs: ['zero-trust'],
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
