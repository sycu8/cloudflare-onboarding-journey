import type { LocalizedString } from '../i18n/types';

export type GuideBullet = {
  text: LocalizedString;
};

export type PracticalGuideSection = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  bullets: GuideBullet[];
  docsPath?: string;
};

/** Condensed from Basic Configuration Guide lab material. */
export const basicConfigurationSections: PracticalGuideSection[] = [
  {
    id: 'dns',
    title: { vi: 'Cấu hình DNS', en: 'DNS configuration' },
    summary: {
      vi: 'DNS map tên miền dễ nhớ → IP. Cloudflare hoạt động reverse proxy qua bản ghi proxied (orange cloud).',
      en: 'DNS maps friendly names to IPs. Cloudflare reverse-proxies proxied (orange cloud) records.',
    },
    docsPath: '/dns/manage-dns-records/',
    bullets: [
      { text: { vi: 'Thêm bản ghi A/AAAA trỏ origin; bật Proxy (orange cloud) cho web traffic.', en: 'Add A/AAAA to origin; enable Proxy (orange cloud) for web traffic.' } },
      { text: { vi: 'Khi proxy bật: dig/traceroute trả IP Cloudflare, origin IP được che.', en: 'With proxy on: lookups show Cloudflare IPs; origin is hidden.' } },
      { text: { vi: 'Tắt proxy (gray cloud) → origin IP lộ — chỉ dùng khi cần DNS-only (mail, verify).', en: 'Gray cloud exposes origin IP — use for DNS-only cases (mail, verification).' } },
      { text: { vi: 'Cloudflare terminate session phía user, mở session mới tới origin.', en: 'Cloudflare terminates the client session and opens a new one to origin.' } },
    ],
  },
  {
    id: 'ssl',
    title: { vi: 'Cấu hình TLS (SSL)', en: 'TLS (SSL) configuration' },
    summary: {
      vi: 'Mã hóa user ↔ Cloudflare ↔ origin. Universal Certificate cover apex + một cấp subdomain (*.example.com).',
      en: 'Encrypts user ↔ Cloudflare ↔ origin. Universal cert covers apex + one subdomain level.',
    },
    docsPath: '/ssl/edge-certificates/universal-ssl/',
    bullets: [
      { text: { vi: 'Bật Always Use HTTPS — chặn HTTP plaintext vô tình.', en: 'Enable Always Use HTTPS — block accidental plaintext HTTP.' } },
      { text: { vi: 'Minimum TLS 1.2 cho PCI/finance; TLS 1.0/1.1 đã lỗi thời.', en: 'Minimum TLS 1.2 for PCI/finance; TLS 1.0/1.1 are outdated.' } },
      { text: { vi: 'Subdomain cấp 2+ (sub2.sub1.example.com) cần Advanced Certificate nếu không nằm trong wildcard.', en: 'Deep subdomains may need Advanced Certificate if outside wildcard scope.' } },
      { text: { vi: 'Cipher suites = bộ thuật toán trong TLS handshake.', en: 'Cipher suites are algorithms used during TLS handshake.' } },
    ],
  },
  {
    id: 'waf-lab',
    title: { vi: 'Cấu hình WAF (lab)', en: 'WAF configuration (lab)' },
    summary: {
      vi: 'Managed Ruleset bảo vệ nhanh; Custom rules và Rate limiting cho policy riêng.',
      en: 'Managed Ruleset for quick protection; custom rules and rate limiting for your policies.',
    },
    docsPath: '/waf/',
    bullets: [
      { text: { vi: 'Bật Cloudflare Managed Ruleset — chặn path nhạy cảm (.git, secrets) ngay.', en: 'Enable Managed Ruleset — blocks sensitive paths (.git, secrets) quickly.' } },
      { text: { vi: 'Actions: Block, Managed Challenge, JS Challenge, Interactive Challenge, Log.', en: 'Actions: Block, Managed Challenge, JS Challenge, Interactive Challenge, Log.' } },
      { text: { vi: 'Managed Challenge cấp cookie cf_clearance — request sau không bị challenge lại.', en: 'Managed Challenge sets cf_clearance — subsequent requests skip re-challenge.' } },
      { text: { vi: 'Rate limiting: ví dụ 5 req/phút/IP cho /login — block 429 khi vượt ngưỡng.', en: 'Rate limiting: e.g. 5 req/min/IP on /login — 429 when exceeded.' } },
      { text: { vi: 'Xem Security → Analytics → Events để phân tích block theo IP, country, rule.', en: 'Use Security → Analytics → Events to analyze blocks by IP, country, rule.' } },
    ],
  },
  {
    id: 'bot-lab',
    title: { vi: 'Bot Management (lab)', en: 'Bot Management (lab)' },
    summary: {
      vi: 'Bot score + JS Detections + template rules (verified bots, definite bots, scraping).',
      en: 'Bot score + JS Detections + template rules (verified bots, definite bots, scraping).',
    },
    docsPath: '/bots/',
    bullets: [
      { text: { vi: 'Bật JavaScript Detections (Security → Settings → Bot Traffic).', en: 'Enable JavaScript Detections (Security → Settings → Bot Traffic).' } },
      { text: { vi: 'Rule 1: Skip verified bots → không challenge Googlebot/Bingbot.', en: 'Rule 1: Skip verified bots — don’t challenge Googlebot/Bingbot.' } },
      { text: { vi: 'Rule 2: Block bot score = 1 (definitely automated).', en: 'Rule 2: Block bot score = 1 (definitely automated).' } },
      { text: { vi: 'Rule 3: Managed Challenge score 2–29 (likely automated).', en: 'Rule 3: Managed Challenge for scores 2–29 (likely automated).' } },
      { text: { vi: 'Anti-scraping: bắt đầu với Log/Challenge, sau đó Block khi đã tin rule.', en: 'Anti-scraping: start with Log/Challenge, then Block once validated.' } },
    ],
  },
  {
    id: 'cache-lab',
    title: { vi: 'Cache tuning (lab)', en: 'Cache tuning (lab)' },
    summary: {
      vi: 'Cache Rules kiểm soát TTL, cache key, stale content — không cần sửa code origin.',
      en: 'Cache Rules control TTL, cache keys, stale content — no origin code changes.',
    },
    docsPath: '/cache/how-to/cache-rules/',
    bullets: [
      { text: { vi: 'cf-cache-status: HIT / MISS / REVALIDATED / DYNAMIC.', en: 'cf-cache-status: HIT / MISS / REVALIDATED / DYNAMIC.' } },
      { text: { vi: 'Cache khi: static content, Cache-Control public/max-age, GET/HEAD, TTL rõ, không phụ thuộc cookie cá nhân.', en: 'Cache when: static, Cache-Control public/max-age, GET/HEAD, clear TTL, not user-specific.' } },
      { text: { vi: 'Cache Rule: Edge TTL, Browser TTL, Cache Key, Serve Stale, Respect Strong ETags.', en: 'Cache Rule settings: Edge TTL, Browser TTL, Cache Key, Serve Stale, ETags.' } },
      { text: { vi: 'Header age cho biết thời gian object đã ở cache.', en: 'The age header shows how long an object has been cached.' } },
    ],
  },
  {
    id: 'lb-lab',
    title: { vi: 'Load Balancer (lab)', en: 'Load Balancer (lab)' },
    summary: {
      vi: 'Phân phối traffic qua nhiều origin, health monitor, failover.',
      en: 'Distribute traffic across origins with health monitors and failover.',
    },
    docsPath: '/load-balancing/',
    bullets: [
      { text: { vi: 'Tạo Load Balancer hostname (lb.example.com) + Origin Pool (nhiều IP).', en: 'Create LB hostname + origin pool with multiple endpoints.' } },
      { text: { vi: 'Monitor kiểm tra health — pool tự loại origin down.', en: 'Monitors check health — pool removes failed origins.' } },
      { text: { vi: 'Session Affinity (cookie + client IP) giữ user trên cùng origin.', en: 'Session Affinity (cookie + client IP) sticks users to one origin.' } },
    ],
  },
  {
    id: 'rules-lab',
    title: { vi: 'Transform & security headers', en: 'Transform & security headers' },
    summary: {
      vi: 'Response Header Transform Rules hoặc Managed Transforms cho security headers.',
      en: 'Response Header Transform Rules or Managed Transforms for security headers.',
    },
    docsPath: '/rules/transform/',
    bullets: [
      { text: { vi: 'Transform rule: thêm X-Frame-Options: SAMEORIGIN cho mọi response.', en: 'Transform rule: add X-Frame-Options: SAMEORIGIN to all responses.' } },
      { text: { vi: 'Managed Transforms → “Add security headers” nhanh hơn rule thủ công.', en: 'Managed Transforms → “Add security headers” faster than manual rules.' } },
      { text: { vi: 'Xác minh bằng curl -I hoặc DevTools Network.', en: 'Verify with curl -I or DevTools Network.' } },
    ],
  },
];

export type WafBestPractice = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  note?: LocalizedString;
};

/** Condensed from WAF custom rules best-practice catalog. */
export const wafBestPractices: WafBestPractice[] = [
  {
    id: 'rule-order',
    title: { vi: 'Thứ tự rule WAF', en: 'WAF rule order' },
    summary: {
      vi: 'Cloudflare xử lý rule từ trên xuống — rule match đầu tiên dừng chain. Rule chặn mạnh đặt trên; rule nới lỏng đặt dưới.',
      en: 'Cloudflare evaluates top-to-bottom — first match wins. Strict block rules on top; permissive rules below.',
    },
  },
  {
    id: 'bad-file-types',
    title: { vi: 'Chặn file type nguy hiểm', en: 'Block dangerous file types' },
    summary: {
      vi: 'Chặn URL chứa extension nguy hiểm (.sql, .bak, .env) có thể lộ database/config.',
      en: 'Block URLs with risky extensions (.sql, .bak, .env) that may leak data.',
    },
  },
  {
    id: 'sensitive-files',
    title: { vi: 'Chặn truy cập file nhạy cảm', en: 'Block sensitive file access' },
    summary: {
      vi: 'Bảo vệ password files, secrets, backup paths khỏi bot và scanner.',
      en: 'Protect password files, secrets, and backup paths from bots and scanners.',
    },
  },
  {
    id: 'sqli',
    title: { vi: 'Chặn SQL injection', en: 'Block SQL injection' },
    summary: {
      vi: 'Match pattern như 1=1-- trong query/body — payload phổ biến của SQLi.',
      en: 'Match patterns like 1=1-- in query/body — common SQLi payloads.',
    },
  },
  {
    id: 'directory-traversal',
    title: { vi: 'Chặn directory traversal', en: 'Stop directory traversal' },
    summary: {
      vi: 'Block %2e%2e%2f (../) — truy cập thư mục cha trái phép.',
      en: 'Block %2e%2e%2f (../) — unauthorized parent directory access.',
    },
    note: { vi: '%2e = . , %2f = /', en: '%2e = . , %2f = /' },
  },
  {
    id: 'php-uploads',
    title: { vi: 'Chặn upload PHP / EXE', en: 'Block PHP / EXE uploads' },
    summary: {
      vi: 'Ngăn upload executable (PHP, EXE) qua web — giảm malware/RCE.',
      en: 'Prevent web uploads of executables (PHP, EXE) — reduces malware/RCE risk.',
    },
  },
  {
    id: 'old-browsers',
    title: { vi: 'Challenge trình duyệt cũ', en: 'Challenge old browsers' },
    summary: {
      vi: 'Browser cũ thường có lỗ hổng hoặc bot giả mạo UA — dùng Managed Challenge.',
      en: 'Old browsers have known vulns or fake UAs — use Managed Challenge.',
    },
  },
  {
    id: 'hotlinking',
    title: { vi: 'Chặn image hotlinking', en: 'Stop image hotlinking' },
    summary: {
      vi: 'Referer khác domain + path ảnh (.jpg, .png, .webp) → block hoặc dùng Hotlink Protection.',
      en: 'Foreign referer on image paths → block, or enable Hotlink Protection.',
    },
  },
  {
    id: 'xmlrpc',
    title: { vi: 'Chặn XML-RPC (WordPress)', en: 'Block XML-RPC (WordPress)' },
    summary: {
      vi: 'Vector brute-force và DDoS phổ biến trên WordPress.',
      en: 'Common brute-force and DDoS vector on WordPress.',
    },
  },
  {
    id: 'empty-ua',
    title: { vi: 'Chặn User-Agent rỗng', en: 'Block empty User-Agent' },
    summary: {
      vi: 'Trình duyệt hợp lệ luôn gửi UA — rỗng thường là bot độc hại.',
      en: 'Legitimate browsers send a UA — empty often means malicious bots.',
    },
  },
  {
    id: 'managed-ruleset',
    title: { vi: 'Ưu tiên Managed Ruleset', en: 'Prefer Managed Ruleset' },
    summary: {
      vi: 'Cloudflare tự chặn traffic xấu (kể cả free plan) — không cần rule threat score thủ công.',
      en: 'Cloudflare blocks bad traffic automatically (including free plan) — skip manual threat-score rules.',
    },
  },
];
