import type { LocalizedString } from '../i18n/types';

export type DeliveryTopic = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  steps: LocalizedString[];
  dashboardPath?: string;
  docsHref: string;
};

export const contentDeliveryIntro: LocalizedString = {
  vi: 'Hướng dẫn tăng tốc website với Cloudflare: CDN, cache rules, tối ưu delivery và đo lường — song song bảo mật trên cùng proxy (orange cloud). Phù hợp SME sau khi đã onboard DNS/SSL.',
  en: 'Speed up websites with Cloudflare: CDN, cache rules, delivery optimizations, and measurement — on the same proxied (orange cloud) path as security. Ideal for SMEs after DNS/SSL onboarding.',
};

export const contentDeliveryMentalModel: LocalizedString = {
  vi: 'Static/cacheable → phục vụ từ PoP gần user (HIT). Dynamic/personalized → forward origin (MISS) nhưng vẫn được bảo vệ WAF/Bot tại edge. Mục tiêu: giảm byte và round-trip tới origin mà không cache nhầm session/cart.',
  en: 'Static/cacheable → served from a nearby PoP (HIT). Dynamic/personalized → forwarded to origin (MISS) but still protected by edge WAF/Bot. Goal: fewer bytes and round trips to origin without caching sessions or carts by mistake.',
};

export const deliveryTopics: DeliveryTopic[] = [
  {
    id: 'cdn-basics',
    title: { vi: 'CDN & cache mặc định', en: 'CDN & default caching' },
    summary: {
      vi: 'Cloudflare cache theo extension file; HTML thường không cache mặc định. Bật proxy (orange cloud) để traffic đi qua edge.',
      en: 'Cloudflare caches by file extension; HTML is not cached by default. Enable proxy (orange cloud) so traffic hits the edge.',
    },
    steps: [
      {
        vi: 'Xác nhận record website/API đã proxied',
        en: 'Confirm website/API records are proxied',
      },
      {
        vi: 'Caching > Overview: xem cache status, hit ratio',
        en: 'Caching > Overview: review cache status and hit ratio',
      },
      {
        vi: 'Cache static: CSS, JS, fonts, images — TTL hợp lý (ví dụ 1 ngày–1 tuần)',
        en: 'Cache static assets: CSS, JS, fonts, images — sensible TTL (e.g. 1 day–1 week)',
      },
      {
        vi: 'Không cache trang có cookie session, cart, admin đã đăng nhập',
        en: 'Do not cache pages with session cookies, cart, or logged-in admin',
      },
    ],
    dashboardPath: 'Caching > Overview, Caching > Cache Rules',
    docsHref: 'https://developers.cloudflare.com/cache/',
  },
  {
    id: 'cache-rules',
    title: { vi: 'Cache Rules (thay Page Rules cũ)', en: 'Cache Rules (replaces legacy Page Rules)' },
    summary: {
      vi: 'Điều kiện theo host, path, cookie, header — action: Bypass, Eligible, TTL custom, Serve stale.',
      en: 'Match on host, path, cookie, header — actions: Bypass, Eligible, custom TTL, Serve stale.',
    },
    steps: [
      {
        vi: 'Rule 1: Bypass cache cho /admin, /api/user, /checkout*',
        en: 'Rule 1: Bypass cache for /admin, /api/user, /checkout*',
      },
      {
        vi: 'Rule 2: Cache Everything (cẩn thận) chỉ cho path tĩnh đã kiểm tra',
        en: 'Rule 2: Cache Everything (carefully) only for verified static paths',
      },
      {
        vi: 'Cookie bypass: cache key tách theo session khi cần (Business+)',
        en: 'Cookie bypass: separate cache keys by session when needed (Business+)',
      },
      {
        vi: 'Sau deploy: purge cache hoặc purge by URL khi đổi asset',
        en: 'After deploy: purge cache or purge by URL when assets change',
      },
    ],
    dashboardPath: 'Caching > Cache Rules',
    docsHref: 'https://developers.cloudflare.com/cache/how-to/cache-rules/',
  },
  {
    id: 'tiered-argo',
    title: { vi: 'Tiered Cache & Argo Smart Routing', en: 'Tiered Cache & Argo Smart Routing' },
    summary: {
      vi: 'Tiered Cache giảm request tới origin (upper-tier PoP). Argo chọn đường mạng nhanh nhất tới origin — add-on, hữu ích user xa origin.',
      en: 'Tiered Cache reduces origin requests (upper-tier PoP). Argo picks the fastest path to origin — add-on, helps users far from origin.',
    },
    steps: [
      {
        vi: 'Bật Tiered Cache (thường kèm Argo) nếu hit ratio thấp và origin tải cao',
        en: 'Enable Tiered Cache (often with Argo) if hit ratio is low and origin load is high',
      },
      {
        vi: 'Theo dõi origin bandwidth trước/sau trong Analytics',
        en: 'Monitor origin bandwidth before/after in Analytics',
      },
      {
        vi: 'Argo: cân nhắc chi phí vs latency cho API động (Argo không cache response)',
        en: 'Argo: weigh cost vs latency for dynamic APIs (Argo does not cache responses)',
      },
    ],
    dashboardPath: 'Caching > Tiered Cache, Traffic > Argo',
    docsHref: 'https://developers.cloudflare.com/argo-smart-routing/',
  },
  {
    id: 'speed-optimization',
    title: { vi: 'Speed — Auto Minify, compression, HTTP/3', en: 'Speed — Auto Minify, compression, HTTP/3' },
    summary: {
      vi: 'Tối ưu delivery tự động: minify CSS/JS/HTML, Brotli, Early Hints, HTTP/2 & HTTP/3.',
      en: 'Automatic delivery tweaks: minify CSS/JS/HTML, Brotli, Early Hints, HTTP/2 and HTTP/3.',
    },
    steps: [
      {
        vi: 'Speed > Optimization: bật Auto Minify (test staging trước — có thể break inline JS)',
        en: 'Speed > Optimization: enable Auto Minify (test in staging first — can break inline JS)',
      },
      {
        vi: 'Bật Brotli, Early Hints cho LCP tốt hơn',
        en: 'Enable Brotli and Early Hints for better LCP',
      },
      {
        vi: 'Network: HTTP/3 (QUIC) nếu client hỗ trợ',
        en: 'Network: HTTP/3 (QUIC) where clients support it',
      },
    ],
    dashboardPath: 'Speed > Optimization, Network',
    docsHref: 'https://developers.cloudflare.com/speed/',
  },
  {
    id: 'images',
    title: { vi: 'Cloudflare Images & resize', en: 'Cloudflare Images & resizing' },
    summary: {
      vi: 'Transform ảnh tại edge (format WebP/AVIF, resize) — giảm payload và tải origin.',
      en: 'Transform images at the edge (WebP/AVIF, resize) — smaller payloads and less origin load.',
    },
    steps: [
      {
        vi: 'Dùng /cdn-cgi/image/ hoặc Workers để resize theo viewport',
        en: 'Use /cdn-cgi/image/ or Workers to resize per viewport',
      },
      {
        vi: 'Lazy-load phía HTML; Cloudflare xử lý format phía edge',
        en: 'Lazy-load in HTML; let Cloudflare handle formats at the edge',
      },
    ],
    dashboardPath: 'Images',
    docsHref: 'https://developers.cloudflare.com/images/',
  },
  {
    id: 'measure',
    title: { vi: 'Đo lường & Web Analytics', en: 'Measurement & Web Analytics' },
    summary: {
      vi: 'Cache Analytics, Speed overview, Core Web Vitals (Web Analytics) — chứng minh cải thiện cho stakeholder.',
      en: 'Cache Analytics, Speed overview, Core Web Vitals (Web Analytics) — prove improvements to stakeholders.',
    },
    steps: [
      {
        vi: 'Caching > Analytics: hit/miss theo colo',
        en: 'Caching > Analytics: hit/miss by colo',
      },
      {
        vi: 'Speed > Observatory hoặc Web Analytics cho LCP/FCP/CLS',
        en: 'Speed > Observatory or Web Analytics for LCP/FCP/CLS',
      },
      {
        vi: 'So sánh origin request rate trước và sau tối ưu cache',
        en: 'Compare origin request rate before and after cache tuning',
      },
    ],
    dashboardPath: 'Caching > Analytics, Speed',
    docsHref: 'https://developers.cloudflare.com/web-analytics/',
  },
];

export const deliveryChecklist: { vi: string; en: string }[] = [
  { vi: 'Proxy đúng bản ghi A/AAAA/CNAME cho website', en: 'Proxy the correct A/AAAA/CNAME records for the site' },
  { vi: 'SSL Full (strict) + HTTP→HTTPS redirect', en: 'SSL Full (strict) + HTTP→HTTPS redirect' },
  { vi: 'Cache rules: bypass dynamic, cache static assets', en: 'Cache rules: bypass dynamic paths, cache static assets' },
  { vi: 'Purge plan khi release (URL hoặc tag nếu Enterprise)', en: 'Purge plan on release (URL or tags on Enterprise)' },
  { vi: 'Bật Brotli + HTTP/3', en: 'Enable Brotli + HTTP/3' },
  { vi: 'Review Images / polish cho media nặng', en: 'Review Images / polish for heavy media' },
  { vi: 'Theo dõi hit ratio & Core Web Vitals 2 tuần', en: 'Monitor hit ratio & Core Web Vitals for 2 weeks' },
];

export const deliveryMistakes: { title: LocalizedString; detail: LocalizedString }[] = [
  {
    title: { vi: 'Cache trang đã đăng nhập', en: 'Caching logged-in pages' },
    detail: {
      vi: 'User A thấy nội dung user B — bypass cache khi có session cookie.',
      en: 'User A sees User B’s content — bypass cache when session cookies are present.',
    },
  },
  {
    title: { vi: 'Quên purge sau deploy', en: 'Forgetting purge after deploy' },
    detail: {
      vi: 'CSS/JS cũ vẫn phục vụ từ edge — purge by URL hoặc toàn zone sau release.',
      en: 'Old CSS/JS still served from edge — purge by URL or whole zone after release.',
    },
  },
  {
    title: { vi: 'Chỉ nhìn TTFB, bỏ qua LCP', en: 'Only watching TTFB, ignoring LCP' },
    detail: {
      vi: 'Tối ưu ảnh hero và critical CSS — Web Analytics cho bức tranh đầy đủ.',
      en: 'Optimize hero images and critical CSS — use Web Analytics for the full picture.',
    },
  },
];
