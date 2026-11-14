import type { BlogPost } from '../blog';

/** Entry · Security — rate limiting for forms and login */
export const postRateLimitingBaoVeFormLogin: BlogPost = {
  slug: 'rate-limiting-bao-ve-form-login',
  date: '2026-09-24',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Rate limiting: chặn spam form và dò mật khẩu đơn giản',
    en: 'Rate limiting: a simple brake on form spam and password guessing',
    km: 'Rate limiting៖ របាំងសាមញ្ញបញ្ហ spam form និងការទាយពាក្យសម្ងាត់',
  },
  description: {
    vi: 'Giải thích rate limiting cho người mới: giới hạn request theo IP/path, bảo vệ form đăng ký và login, kết hợp WAF, và tránh false positive.',
    en: 'Rate limiting for beginners: cap requests by IP/path, protect signup forms and login, combine with WAF, and watch false positives.',
  },
  excerpt: {
    vi: 'Spam form và brute-force login không cần hack phức tạp — chỉ cần gửi nhiều request. Rate limiting là “cửa sổ đếm”: quá N lần trong T giây thì chặn hoặc challenge.',
    en: 'Form spam and login brute force do not need fancy hacks — just many requests. Rate limiting is a “counting window”: more than N times in T seconds means block or challenge.',
    km: 'Spam form និង brute-force login មិនត្រូវការ hack ស្មុគស្មាញ — គ្រាន់តែ request ច្រើន។ Rate limiting គឺ "បង្អួចរាប់"៖ លើស N ដងក្នុង T វិនាទី នោះ block ឬ challenge។',
  },
  keywords: {
    vi: 'rate limiting Cloudflare, chặn spam form, bảo vệ login, WAF rate limit, brute force',
    en: 'Cloudflare rate limiting, block form spam, protect login, WAF rate limit, brute force',
  },
  sections: [
    {
      heading: {
        vi: 'Rate limiting giải quyết vấn đề gì?',
        en: 'What problem does rate limiting solve?',
      },
      paragraphs: [
        {
          vi: 'Hình dung form đăng ký workshop hoặc trang login: attacker (hoặc bot) gửi hàng nghìn request trong vài phút — spam database, làm chậm origin, hoặc thử từng mật khẩu trong danh sách. Server gốc phải xử lý mỗi request; không có giới hạn, một IP có thể “ăn” tài nguyên như hàng trăm user thật.',
          en: 'Picture a workshop signup form or login page: an attacker (or bot) sends thousands of requests in minutes — spamming the database, slowing the origin, or trying passwords from a list. The origin must handle each request; without limits, one IP can consume resources like hundreds of real users.',
        },
        {
          vi: 'Hạn mức phụ thuộc gói. Free: 1 rule, chỉ field Path và Verified Bot, chu kỳ đếm 10 giây. Ví dụ hợp Free: Path = /login, một số request mỗi 10 giây, action Managed Challenge. Matching Method (POST) từ Business. Action Log chỉ có trên Enterprise; gói khác bắt đầu bằng Managed Challenge rồi xem Security Events trước khi Block. Cloudflare áp dụng ở edge, trước khi request chạm origin.',
          en: 'Limits depend on the plan. Free: 1 rule, only the Path and Verified Bot fields, and a 10-second counting period. A Free-safe example: Path = /login, a small number of requests per 10 seconds, action Managed Challenge. Matching on Method (POST) starts at Business. The Log action is Enterprise only; other plans start with Managed Challenge and check Security Events before Block. Cloudflare applies this at the edge, before the request hits the origin.',
        },
        {
          vi: 'Trên blog.cloudflare.com, bài security và WAF thường nhắc rate limiting cùng bot management: không phải silver bullet, nhưng là lớp rẻ và hiệu quả cho abuse phổ biến. Hub có trang sản phẩm Rate limiting và lộ trình Application Services.',
          en: 'On blog.cloudflare.com, security and WAF posts often mention rate limiting alongside bot management: not a silver bullet, but a cheap effective layer for common abuse. The hub has a Rate limiting product page and Application Services track.',
        },
      ],
      diagramSlug: 'bot-management',
    },
    {
      heading: {
        vi: 'Giới hạn theo IP, path và kết hợp WAF',
        en: 'Limits by IP, path, and combining with WAF',
      },
      paragraphs: [
        {
          vi: 'Theo IP: phổ biến nhất — mỗi địa chỉ nguồn có ngưỡng riêng. Theo path: `/api/signup` nghiêm hơn `/` vì abuse tập trung endpoint. Theo header hoặc API key khi bạn có client đã xác thực — tránh một partner API làm quá tải.',
          en: 'By IP: most common — each source address gets its own threshold. By path: `/api/signup` stricter than `/` because abuse targets endpoints. By header or API key when you have authenticated clients — so one partner API cannot overload you.',
        },
        {
          vi: 'WAF (Web Application Firewall) lọc payload xấu (SQL injection, XSS); rate limiting lọc volume. Form login thường cần cả hai: WAF chặn payload lạ, rate limit chặn volume cao. Tutorial Turnstile + WAF + Bot Management trên docs Cloudflare minh họa stack cho login — hub trỏ tới use case bảo vệ website.',
          en: 'A WAF filters bad payloads (SQL injection, XSS); rate limiting filters volume. Login forms often need both: WAF blocks weird payloads, rate limits block high volume. The Turnstile + WAF + Bot Management tutorial on Cloudflare docs illustrates the login stack — the hub points to protect-website use cases.',
        },
        {
          vi: 'Super Bot Fight Mode hoặc Bot Management (tùy gói) thêm điểm số bot — rate limit theo `cf.bot_management.score` khi bạn cần rule tinh hơn “chặn mọi IP”. Sơ đồ bot-management trên reference architecture gắn bots, WAF, và rate limiting trong một bức tranh.',
          en: 'Super Bot Fight Mode or Bot Management (plan-dependent) add bot scores — rate limit by `cf.bot_management.score` when you need finer rules than “block every IP.” The bot-management reference architecture diagram ties bots, WAF, and rate limiting into one picture.',
        },
      ],
    },
    {
      heading: {
        vi: 'False positive: đừng chặn user thật sau chiến dịch marketing',
        en: 'False positives: do not block real users after a marketing campaign',
      },
      paragraphs: [
        {
          vi: 'Rate limit quá chặt có thể chặn công ty (một IP outbound) hoặc trường học — nhiều user cùng IP. Giải pháp: ngưỡng cao hơn cho GET, chặt hơn cho POST login; whitelist IP nội bộ nếu cần; dùng challenge thay vì block cứng để user thật vượt qua Turnstile.',
          en: 'Overly tight limits can block a company (one outbound IP) or a school — many users share one IP. Fixes: higher thresholds for GET, stricter for POST login; whitelist internal IPs if needed; use challenge instead of hard block so real users pass Turnstile.',
        },
        {
          vi: 'Luôn monitor sau khi bật rule mới: dashboard Security Events cho biết rule nào kích hoạt bao nhiêu. Nếu spike block trùng giờ traffic marketing, hãy điều chỉnh ngưỡng hoặc thêm exception có thời hạn.',
          en: 'Always monitor after enabling a new rule: Security Events dashboard shows which rules fire how often. If block spikes match marketing traffic hours, adjust thresholds or add a time-bound exception.',
        },
        {
          vi: 'Workshop signup trên hub dùng Turnstile dev-bypass local — production nên có Turnstile thật + rate limit trên endpoint signup. Đó là mô hình defense in depth cho form public.',
          en: 'Workshop signup on this hub uses Turnstile dev-bypass locally — production should have real Turnstile + rate limits on the signup endpoint. That is a defense-in-depth model for public forms.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu với hai rule đơn giản',
        en: 'Start with two simple rules',
      },
      paragraphs: [
        {
          vi: 'Free chỉ có 1 rule và chu kỳ 10 giây, nên đừng viết “10 request mỗi phút” cho gói Free. Trên Free: Path = /login, chu kỳ 10 giây, Managed Challenge. Pro có 2 rule và chu kỳ tới 1 phút. Field Method (POST) từ Business. Action Log chỉ có trên Enterprise.',
          en: 'Free has 1 rule and a 10-second period, so do not write “10 requests per minute” for Free. On Free: Path = /login, a 10-second period, Managed Challenge. Pro has 2 rules and periods up to 1 minute. The Method field (POST) starts at Business. The Log action is Enterprise only.',
        },
        {
          vi: 'Đọc trang Rate limiting và WAF trên hub; bài WAF cho người mới giải thích lớp bảo vệ chung. Khi cần sâu hơn, mở blog.cloudflare.com/tag/security/ và docs rate limiting rules.',
          en: 'Read Rate limiting and WAF pages on the hub; the beginner WAF post explains the general protection layer. For depth, open blog.cloudflare.com/tag/security/ and rate limiting rules docs.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Rate limiting có thay Turnstile không?',
        en: 'Can rate limiting replace Turnstile?',
      },
      answer: {
        vi: 'Không hoàn toàn. Rate limit chặn volume; Turnstile phân biệt human vs bot tốt hơn cho form. Nhiều site dùng cả hai.',
        en: 'Not fully. Rate limits stop volume; Turnstile better separates humans from bots on forms. Many sites use both.',
      },
    },
    {
      question: {
        vi: 'Rate limiting áp dụng cho API Workers không?',
        en: 'Does rate limiting apply to Workers APIs?',
      },
      answer: {
        vi: 'Có — qua WAF rate limiting rules trên zone proxy, hoặc logic rate limit trong Worker (KV/Durable Objects) cho API riêng. Chọn theo mức độ kiểm soát bạn cần.',
        en: 'Yes — via WAF rate limiting rules on a proxied zone, or rate limit logic in a Worker (KV/Durable Objects) for custom APIs. Choose based on control you need.',
      },
    },
    {
      question: {
        vi: 'Free plan có rate limiting không?',
        en: 'Is rate limiting on the Free plan?',
      },
      answer: {
        vi: 'Có. Free có 1 rate limiting rule, chu kỳ đếm 10 giây, và chỉ field Path cùng Verified Bot. Pro có 2 rule và chu kỳ tới 1 phút. Action Log chỉ có trên Enterprise.',
        en: 'Yes. Free has 1 rate limiting rule with a 10-second counting period, and only the Path and Verified Bot fields. Pro has 2 rules and periods up to 1 minute. The Log action is Enterprise only.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Security topics',
      href: 'https://blog.cloudflare.com/tag/security/',
    },
    {
      title: 'The Cloudflare Blog — WAF topics',
      href: 'https://blog.cloudflare.com/tag/waf/',
    },
    {
      title: 'Rate limiting rules (Cloudflare Docs)',
      href: 'https://developers.cloudflare.com/waf/rate-limiting-rules/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['rate-limiting', 'waf'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'observability-logs-workers-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/rate-limiting/', label: { vi: 'Rate limiting (trang sản phẩm)', en: 'Rate limiting (product page)' } },
    { href: '/products/waf/', label: { vi: 'WAF (trang sản phẩm)', en: 'WAF (product page)' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect a website' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/products/turnstile/', label: { vi: 'Turnstile cho form', en: 'Turnstile for forms' } },
  ],
  diagramSlugs: [
    'bot-management',
    'securing-data-in-transit',
  ],
};
