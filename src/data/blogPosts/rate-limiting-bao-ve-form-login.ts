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
          vi: 'Rate limiting đặt quy tắc: ví dụ “mỗi IP chỉ được 10 request POST tới `/api/login` trong 60 giây”. Vượt ngưỡng → block, challenge (Turnstile), hoặc log. Cloudflare áp dụng ở edge — trước khi request chạm origin — giống lễ tân không cho cùng một người gõ cửa liên tục.',
          en: 'Rate limiting sets a rule: for example “each IP may only POST to `/api/login` 10 times per 60 seconds.” Above the threshold → block, challenge (Turnstile), or log. Cloudflare applies this at the edge — before the request hits the origin — like a receptionist stopping the same person from knocking endlessly.',
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
          vi: 'Rule 1: POST tới `/login` hoặc `/api/auth/*` — ví dụ 10 request / phút / IP, action block hoặc challenge. Rule 2: POST tới form public (signup, contact) — ví dụ 20 request / phút / IP. Ghi log trước khi block cứng nếu bạn chưa chắc ngưỡng.',
          en: 'Rule 1: POST to `/login` or `/api/auth/*` — e.g. 10 requests per minute per IP, action block or challenge. Rule 2: POST to public forms (signup, contact) — e.g. 20 requests per minute per IP. Log before hard block if you are unsure of thresholds.',
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
        vi: 'Tính năng và ngưỡng phụ thuộc gói Cloudflare — xem pricing và docs hiện tại. Người mới vẫn nên đọc rule templates và Security Events dù ở gói thấp.',
        en: 'Features and thresholds depend on your Cloudflare plan — check current pricing and docs. Beginners should still read rule templates and Security Events even on lower tiers.',
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
