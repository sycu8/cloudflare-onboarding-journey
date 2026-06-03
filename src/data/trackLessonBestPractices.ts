import type { LocalizedString } from '../i18n/types';

export type BestPracticeNote = {
  text: LocalizedString;
  sourceTitle: LocalizedString;
  sourceUrl: string;
};

const WORKERS_BP = 'https://developers.cloudflare.com/workers/best-practices/workers-best-practices/';
const DNS_BP =
  'https://developers.cloudflare.com/learning-paths/dns-best-practices/concepts/summary-considerations/';
const SSL_GUIDE = 'https://developers.cloudflare.com/use-cases/solutions/encrypt-all-keep-site-secure/';
const WAF_DESIGN =
  'https://developers.cloudflare.com/reference-architecture/design-guides/streamlined-waf-deployment-across-zones-and-applications/';
const BOT_MGMT = 'https://developers.cloudflare.com/bots/get-started/bot-management/';
const CDN_ARCH = 'https://developers.cloudflare.com/reference-architecture/architectures/cdn/';
const CACHE_PERF = 'https://developers.cloudflare.com/cache/performance-review/cache-performance/';
const D1_INDEXES = 'https://developers.cloudflare.com/d1/best-practices/use-indexes/';
const ACCESS_BP =
  'https://developers.cloudflare.com/learning-paths/clientless-access/access-application/best-practices/';
const GATEWAY_BP = 'https://developers.cloudflare.com/cloudflare-one/traffic-policies/get-started/';

/** Official best-practice notes per lesson — content paraphrased from source docs only. */
export const trackLessonBestPractices: Record<string, BestPracticeNote> = {
  // ── Application Services ──
  'as-1-l1': {
    text: {
      vi: 'Trước khi đổi nameserver: lên kế hoạch kỹ, hạ TTL trước, gỡ DS record DNSSEC nếu đang bật, kiểm tra lại import record và chuẩn bị kế hoạch rollback.',
      en: 'Before changing nameservers: plan carefully, lower TTLs in advance, remove DS records if DNSSEC is enabled, double-check imported records, and prepare a rollback plan.',
    },
    sourceTitle: { vi: 'DNS — Key considerations and best practices summary', en: 'DNS — Key considerations and best practices summary' },
    sourceUrl: DNS_BP,
  },
  'as-1-l2': {
    text: {
      vi: 'Sau khi DNS ổn định, kiểm tra kỹ từ nhiều vị trí và cho mọi dịch vụ quan trọng trước khi bật proxy — rồi mới tận dụng thêm tính năng bảo mật/hiệu năng của Cloudflare.',
      en: 'After DNS is stable, test thoroughly from multiple locations and for all critical services before enabling proxy — then explore Cloudflare security and performance features.',
    },
    sourceTitle: { vi: 'DNS — Key considerations and best practices summary', en: 'DNS — Key considerations and best practices summary' },
    sourceUrl: DNS_BP,
  },
  'as-2-l1': {
    text: {
      vi: 'Để mã hóa end-to-end, dùng Full (strict): cả kết nối visitor→Cloudflare và Cloudflare→origin đều HTTPS, origin cert được xác thực. Bật Always Use HTTPS để chuyển mọi HTTP sang HTTPS.',
      en: 'For end-to-end encryption, use Full (strict): both visitor→Cloudflare and Cloudflare→origin use HTTPS with origin certificate validation. Enable Always Use HTTPS to redirect all HTTP to HTTPS.',
    },
    sourceTitle: {
      vi: 'Enforce HTTPS and encrypt all traffic',
      en: 'Enforce HTTPS and encrypt all traffic',
    },
    sourceUrl: SSL_GUIDE,
  },
  'as-2-l2': {
    text: {
      vi: 'Nếu origin chưa có cert hợp lệ, cài Cloudflare Origin CA (miễn phí, tối đa 15 năm) rồi chuyển encryption mode sang Full (strict).',
      en: 'If your origin lacks a valid certificate, install a free Cloudflare Origin CA certificate (valid up to 15 years), then set encryption mode to Full (strict).',
    },
    sourceTitle: {
      vi: 'Enforce HTTPS and encrypt all traffic',
      en: 'Enforce HTTPS and encrypt all traffic',
    },
    sourceUrl: SSL_GUIDE,
  },
  'as-3-l1': {
    text: {
      vi: 'Triển khai Cloudflare Managed Ruleset ở mức Account khi có nhiều zone — ruleset đã được Cloudflare tinh chỉnh để giảm false positive. App mới có thể bắt đầu ở chế độ Log trước khi chuyển Default.',
      en: 'Deploy the Cloudflare Managed Ruleset at the Account level when you have multiple zones — rulesets are pre-tuned to minimize false positives. New apps can start in Log mode before switching to Default.',
    },
    sourceTitle: {
      vi: 'Streamlined WAF deployment across zones and applications',
      en: 'Streamlined WAF deployment across zones and applications',
    },
    sourceUrl: WAF_DESIGN,
  },
  'as-3-l2': {
    text: {
      vi: 'Cách triển khai Managed Rules ở Account level cũng áp dụng cho Rate Limiting Rules — ưu tiên cấu hình Account thay vì lặp lại trên từng zone.',
      en: 'The Account-level approach for Managed Rules also applies to Rate Limiting Rules — prefer Account-level configuration over repeating rules per zone.',
    },
    sourceTitle: {
      vi: 'Streamlined WAF deployment across zones and applications',
      en: 'Streamlined WAF deployment across zones and applications',
    },
    sourceUrl: WAF_DESIGN,
  },
  'as-3-l3': {
    text: {
      vi: 'Bot Management gán bot score 1–99 cho mỗi request; score dưới 30 thường là bot. Dùng WAF custom rules theo path (ví dụ login) thay vì chặn toàn site — có thể dùng rule templates sẵn có.',
      en: 'Bot Management assigns a bot score of 1–99 per request; scores below 30 are commonly associated with bot traffic. Use path-specific WAF custom rules (e.g. login) instead of blanket blocks — rule templates are available.',
    },
    sourceTitle: { vi: 'Bot Management — Get started', en: 'Bot Management — Get started' },
    sourceUrl: BOT_MGMT,
  },
  'as-4-l1': {
    text: {
      vi: 'Bật Tiered Cache (có trên mọi gói) — cache gần user hơn, giảm request về origin và tăng cache hit ratio.',
      en: 'Enable Tiered Cache (included on every plan) — content is cached closer to users, reducing origin requests and improving cache hit ratios.',
    },
    sourceTitle: {
      vi: 'Content Delivery Network (CDN) Reference Architecture',
      en: 'Content Delivery Network (CDN) Reference Architecture',
    },
    sourceUrl: CDN_ARCH,
  },
  'as-4-l2': {
    text: {
      vi: 'Dùng Cache Rules để mở rộng cache cho HTML hoặc path cụ thể. Với cache Miss, cân nhắc Tiered Cache hoặc custom cache key (ví dụ bỏ qua query string).',
      en: 'Use Cache Rules to extend caching to HTML or specific paths. For cache Misses, enable Tiered Cache or create a custom cache key (e.g. ignore query strings).',
    },
    sourceTitle: { vi: 'Cache performance', en: 'Cache performance' },
    sourceUrl: CACHE_PERF,
  },
  'as-4-l3': {
    text: {
      vi: 'Nên bật Tiered Cache trước khi dùng Cache Reserve — Tiered Cache gom request trước khi chạm Reserve, giảm read/storage trùng lặp.',
      en: 'Enable Tiered Cache before using Cache Reserve — Tiered Cache funnels requests before Cache Reserve, reducing redundant reads and duplicate storage.',
    },
    sourceTitle: {
      vi: 'Content Delivery Network (CDN) Reference Architecture',
      en: 'Content Delivery Network (CDN) Reference Architecture',
    },
    sourceUrl: CDN_ARCH,
  },
  'as-4-l4': {
    text: {
      vi: 'Dùng Cache Analytics để tìm nội dung Revalidated/Miss — tăng Edge Cache TTL qua Cache Rule hoặc bật Tiered Cache tùy nguyên nhân.',
      en: 'Use Cache Analytics to find Revalidated/Missed content — increase Edge Cache TTL via Cache Rules or enable Tiered Cache depending on the cause.',
    },
    sourceTitle: { vi: 'Cache performance', en: 'Cache performance' },
    sourceUrl: CACHE_PERF,
  },
  // ── Developer Platform ──
  'dp-1-l1': {
    text: {
      vi: 'Mỗi Wrangler environment là deployment riêng (`{name}-{env}`). Binding và vars phải khai báo theo từng environment — không kế thừa tự động.',
      en: 'Each Wrangler environment is a separate deployment (`{name}-{env}`). Bindings and vars must be declared per environment — they are not inherited automatically.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-1-l2': {
    text: {
      vi: 'Secret (API key, token) không được đặt trong wrangler config hay source — dùng `wrangler secret put`. Biến không nhạy cảm đặt trong `vars`; local dev dùng `.env` và thêm vào `.gitignore`.',
      en: 'Secrets (API keys, tokens) must never appear in Wrangler config or source — use `wrangler secret put`. Non-sensitive config belongs in `vars`; use a `.env` file for local dev and add it to `.gitignore`.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-2-l1': {
    text: {
      vi: 'Luôn `await` hoặc `ctx.waitUntil()` mọi Promise — nếu không, Worker có thể kết thúc trước khi tác vụ nền hoàn tất.',
      en: 'Always `await` or use `ctx.waitUntil()` for every Promise — otherwise the Worker may terminate before background work completes.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-2-l2': {
    text: {
      vi: 'Custom domain: Worker là origin, DNS/SSL tự động. Route: Worker chạy trước origin — cần DNS record proxied (orange cloud); thiếu record sẽ gây ERR_NAME_NOT_RESOLVED.',
      en: 'Custom domain: the Worker is the origin with automatic DNS/SSL. Route: the Worker runs in front of an origin — you need a proxied DNS record (orange cloud); missing records cause ERR_NAME_NOT_RESOLVED.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-3-l1': {
    text: {
      vi: 'Dùng binding (KV, R2, D1…) trực tiếp trong Worker — không gọi REST API Cloudflare từ trong Worker (thêm latency, auth và phức tạp không cần thiết).',
      en: 'Use bindings (KV, R2, D1, etc.) directly in Workers — do not call the Cloudflare REST API from within a Worker (adds latency, auth, and unnecessary complexity).',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-3-l2': {
    text: {
      vi: 'Tạo index cho cột thường dùng trong WHERE (email, user_id) hoặc ràng buộc UNIQUE. Chỉ index cột được query thường xuyên — index cũng cần ghi khi bảng thay đổi.',
      en: 'Create indexes on columns used in WHERE clauses (email, user_id) or UNIQUE constraints. Index only frequently queried columns — indexes are updated on every table write.',
    },
    sourceTitle: { vi: 'D1 — Use indexes', en: 'D1 — Use indexes' },
    sourceUrl: D1_INDEXES,
  },
  'dp-3-l3': {
    text: {
      vi: 'Truy cập R2 qua binding `env.MY_BUCKET` — không dùng REST API từ Worker. Binding không cần network hop hay authentication.',
      en: 'Access R2 via the `env.MY_BUCKET` binding — do not use the REST API from a Worker. Bindings require no network hop or authentication.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-4-l1': {
    text: {
      vi: 'Bật Workers Logs và Traces trước khi lên production — dùng structured JSON trong `console.log` để tìm kiếm/lọc trên dashboard Observability.',
      en: 'Enable Workers Logs and Traces before production — use structured JSON in `console.log` for searchable, filterable logs in the Observability dashboard.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  'dp-4-l2': {
    text: {
      vi: 'Secret Turnstile và credential khác lưu bằng `wrangler secret put`, không đặt trong source hay client build. Chỉ biến `PUBLIC_*` được embed phía client.',
      en: 'Store Turnstile secrets and other credentials with `wrangler secret put`, not in source or client builds. Only `PUBLIC_*` variables belong in the client.',
    },
    sourceTitle: { vi: 'Workers Best Practices', en: 'Workers Best Practices' },
    sourceUrl: WORKERS_BP,
  },
  // ── Cloudflare One ──
  'c1-1-l1': {
    text: {
      vi: 'Nếu nhiều policy trùng rule, tạo rule group (ví dụ "corporate users" với posture + email, hoặc "developers" tham chiếu group IdP) rồi tái sử dụng across policies.',
      en: 'If many policies share duplicate rules, build a rule group (e.g. "corporate users" with posture and emails, or "developers" referencing an IdP group) and reuse it across policies.',
    },
    sourceTitle: { vi: 'Access application — Best practices', en: 'Access application — Best practices' },
    sourceUrl: ACCESS_BP,
  },
  'c1-1-l2': {
    text: {
      vi: 'App nội bộ có nhiều service phụ thuộc (iframe, embedded) — cân nhắc khai báo nhiều top-level domain trong một Access application thay vì tách rời.',
      en: 'Internal apps with interdependent services (iFrames, embedded systems) — consider specifying multiple top-level domains in a single Access application.',
    },
    sourceTitle: { vi: 'Access application — Best practices', en: 'Access application — Best practices' },
    sourceUrl: ACCESS_BP,
  },
  'c1-2-l1': {
    text: {
      vi: 'Rule group có thể gom yêu cầu device posture và email cụ thể, hoặc tham chiếu group trong IdP — giúp policy dễ maintain hơn rule từng user.',
      en: 'Rule groups can combine device posture requirements and specific emails, or reference an IdP group — easier to maintain than per-user rules.',
    },
    sourceTitle: { vi: 'Access application — Best practices', en: 'Access application — Best practices' },
    sourceUrl: ACCESS_BP,
  },
  'c1-2-l2': {
    text: {
      vi: 'Trước production, đọc Application paths để hiểu wildcard/path. Policy trùng lặp → dùng rule group. Mục tiêu đơn giản hóa nhiều domain → một domain chính/app + IaC (Terraform) cho phần còn lại.',
      en: 'Before production, review Application paths to understand wildcards. Duplicate policy rules → use rule groups. To streamline many domains → one primary domain per app and automate the rest with IaC (Terraform).',
    },
    sourceTitle: { vi: 'Access application — Best practices', en: 'Access application — Best practices' },
    sourceUrl: ACCESS_BP,
  },
  'c1-3-l1': {
    text: {
      vi: 'Triển khai Gateway theo phase: bắt đầu DNS filtering (resolver hoặc WARP DNS-only), chặn category malware/phishing, xem DNS log — rồi mới thêm network/HTTP inspection.',
      en: 'Roll out Gateway in phases: start with DNS filtering (resolver or WARP DNS-only), block malware/phishing categories, review DNS logs — then add network/HTTP inspection.',
    },
    sourceTitle: { vi: 'Gateway traffic policies — Get started', en: 'Gateway traffic policies — Get started' },
    sourceUrl: GATEWAY_BP,
  },
  'c1-3-l2': {
    text: {
      vi: 'HTTP inspection (CASB/DLP) cần cài root cert và bật TLS decryption; tạo Do Not Inspect cho app dùng certificate pinning. Cấu hình DLP profile sau khi HTTPS inspection sẵn sàng.',
      en: 'HTTP inspection (CASB/DLP) requires installing the root certificate and enabling TLS decryption; create Do Not Inspect policies for certificate-pinning apps. Configure DLP profiles after HTTPS inspection is ready.',
    },
    sourceTitle: { vi: 'Gateway traffic policies — Get started', en: 'Gateway traffic policies — Get started' },
    sourceUrl: GATEWAY_BP,
  },
  'c1-4-l1': {
    text: {
      vi: 'Không cần hoàn thành mọi phase Gateway cùng lúc — chọn phase phù hợp timeline và yêu cầu bảo mật; rollout từng wave thay vì big-bang.',
      en: 'You do not need to complete every Gateway phase at once — choose phases that match your security requirements and timeline; roll out in waves rather than big-bang.',
    },
    sourceTitle: { vi: 'Gateway traffic policies — Get started', en: 'Gateway traffic policies — Get started' },
    sourceUrl: GATEWAY_BP,
  },
  'c1-4-l2': {
    text: {
      vi: 'Một domain chính mỗi Access application giúp policy rõ ràng; triển khai nhiều app/domain lặp lại nên tự động hóa bằng Terraform hoặc IaC khác.',
      en: 'One primary domain per Access application keeps policies clear; automate repetitive multi-app/domain deployments with Terraform or other IaC.',
    },
    sourceTitle: { vi: 'Access application — Best practices', en: 'Access application — Best practices' },
    sourceUrl: ACCESS_BP,
  },
};
