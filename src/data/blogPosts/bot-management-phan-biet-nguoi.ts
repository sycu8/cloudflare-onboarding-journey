import type { BlogPost } from '../blog';

/** Intermediate · Security — rewritten from Cloudflare bot management / Turnstile blog themes */
export const postBotManagementPhanBietNguoiVaBot: BlogPost = {
  slug: 'bot-management-phan-biet-nguoi-va-bot',
  date: '2026-08-29',
  topic: 'security',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Bot trên website: phân biệt khách thật và bot xấu trên Cloudflare',
    en: 'Website bots: telling real visitors from bad bots on Cloudflare',
  },
  description: {
    vi: 'Giải thích bot tốt và bot xấu, Turnstile cho form, và khi nào cần Bot Management — viết lại từ góc nhìn blog.cloudflare.com cho người học trung cấp.',
    en: 'Explain good vs bad bots, Turnstile for forms, and when Bot Management helps — rewritten from blog.cloudflare.com themes for intermediate learners.',
  },
  excerpt: {
    vi: 'Không phải mọi bot đều xấu — Google cần crawl site bạn. Vấn đề là bot quét hàng loạt, credential stuffing và spam form. Cloudflare giúp phân loại và chặn đúng chỗ.',
    en: 'Not every bot is bad — Google needs to crawl your site. The problem is mass scanners, credential stuffing, and form spam. Cloudflare helps classify and block in the right places.',
  },
  keywords: {
    vi: 'bot management Cloudflare, Turnstile, phân biệt bot và người, chống spam form, bảo mật website trung cấp',
    en: 'Cloudflare bot management, Turnstile, bots vs humans, anti form spam, intermediate website security',
  },
  sections: [
    {
      heading: {
        vi: 'Bot là gì — và vì sao “chặn hết bot” là sai hướng?',
        en: 'What is a bot — and why “block all bots” is the wrong move',
      },
      paragraphs: [
        {
          vi: 'Bot là chương trình tự động gửi HTTP request thay vì con người bấm chuột. Một số bot rất hữu ích: công cụ tìm kiếm index nội dung, giám sát uptime, hoặc đối tác tích hợp API theo hợp đồng. Nếu bạn chặn mù quáng, SEO có thể tụt và dịch vụ hợp pháp ngừng hoạt động.',
          en: 'A bot is software that sends HTTP requests without a human clicking. Some bots are helpful: search engines index content, uptime monitors ping your site, or partners call APIs under contract. Block blindly and SEO may drop while legitimate integrations break.',
        },
        {
          vi: 'Bot xấu thì khác: quét lỗ hổng hàng loạt, thử mật khẩu đã lộ (credential stuffing), gửi spam qua form đăng ký, hoặc “cào” dữ liệu giá cạnh tranh. Các bài trên blog.cloudflare.com về bots thường nhấn mạnh: vấn đề không phải “có bot hay không” mà là phân loại hành vi và ưu tiên bảo vệ endpoint nhạy cảm.',
          en: 'Bad bots differ: mass vulnerability scans, credential stuffing, signup-form spam, or scraping competitor pricing. Cloudflare Blog posts on bots often stress that the issue is not “bots yes or no” but classifying behavior and protecting sensitive endpoints first.',
        },
        {
          vi: 'Trên hub này, bot controls thường đi cùng WAF và rate limiting trong lộ trình Application Services. Hiểu bot giúp bạn không lặp lại lỗi phổ biến: bật challenge cho toàn site rồi phàn nàn API mobile bị lỗi — trong khi chỉ cần bảo vệ `/login` và form đăng ký.',
          en: 'On this hub, bot controls usually sit alongside WAF and rate limiting in the Application Services track. Understanding bots helps you avoid the classic mistake: challenging the entire site and breaking mobile APIs — when only `/login` and signup forms needed protection.',
        },
      ],
      diagramSlug: 'bot-management',
    },
    {
      heading: {
        vi: 'Turnstile: xác minh “người thật” mà không làm khách bực mình',
        en: 'Turnstile: proving humans without annoying visitors',
      },
      paragraphs: [
        {
          vi: 'CAPTCHA kiểu cũ bắt người dùng chọn đèn giao thông — trải nghiệm tệ trên mobile. Turnstile là giải pháp thay thế của Cloudflare: widget nhẹ chạy trên form (đăng ký workshop, liên hệ, checkout) để xác minh request có khả năng đến từ người thật.',
          en: 'Old CAPTCHAs made users pick traffic lights — a poor mobile experience. Turnstile is Cloudflare’s alternative: a lightweight widget on forms (workshop signup, contact, checkout) to verify the request likely comes from a real person.',
        },
        {
          vi: 'Luồng điển hình: trình duyệt tải Turnstile → người dùng gửi form kèm token → server Worker hoặc origin gọi API siteverify của Cloudflare → chỉ khi hợp lệ mới ghi database hoặc gửi email. Token không được commit vào Git; secret key để trong biến môi trường hoặc Wrangler secret.',
          en: 'Typical flow: browser loads Turnstile → user submits the form with a token → your Worker or origin calls Cloudflare’s siteverify API → only then write to the database or send email. Never commit tokens; keep the secret key in environment variables or Wrangler secrets.',
        },
        {
          vi: 'Turnstile không thay thế WAF hay Bot Management cho toàn site — nó tập trung vào điểm “con người phải bấm gửi”. Với team nhỏ, đây thường là bước ROI cao nhất trước khi mua thêm sản phẩm enterprise.',
          en: 'Turnstile does not replace WAF or site-wide Bot Management — it focuses on “a human clicked submit” moments. For small teams, this is often the highest-ROI step before buying additional enterprise products.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bot Management và bot score: khi traffic lớn hoặc tấn công có chủ đích',
        en: 'Bot Management and bot score: when traffic is large or attacks are targeted',
      },
      paragraphs: [
        {
          vi: 'Bot Management (và các chế độ như Super Bot Fight Mode trên một số gói) dùng tín hiệu từ mạng Cloudflare — fingerprint, hành vi, danh tiếng IP — để gán bot score. Request điểm thấp có thể bị challenge, rate limit hoặc chặn trước khi chạm origin.',
          en: 'Bot Management (and modes like Super Bot Fight Mode on some plans) uses signals from Cloudflare’s network — fingerprints, behavior, IP reputation — to assign a bot score. Low-scoring requests may be challenged, rate limited, or blocked before they reach origin.',
        },
        {
          vi: 'Khác với Turnstile trên một form, Bot Management nhìn toàn bộ hostname: API bị quét, endpoint admin bị dò, hoặc spike login thất bại. Kết hợp với WAF managed rules, bạn có lớp “lọc hành vi” bổ sung cho rule theo chữ ký tấn công.',
          en: 'Unlike Turnstile on one form, Bot Management watches the whole hostname: scanned APIs, probed admin paths, or spikes in failed logins. Combined with WAF managed rules, you add a behavioral filter on top of signature-based rules.',
        },
        {
          vi: 'Theo các case study trên blog.cloudflare.com, doanh nghiệp thường bật Bot Management sau khi thấy log origin đầy request lạ hoặc chi phí hosting tăng vì bot cào dữ liệu. Bắt đầu từ Security → Events trong dashboard để xem traffic bị challenge thay vì đoán.',
          en: 'Case studies on blog.cloudflare.com often show teams enabling Bot Management after origin logs fill with odd requests or hosting costs rise from scraping bots. Start in Security → Events in the dashboard to see challenged traffic instead of guessing.',
        },
      ],
    },
    {
      heading: {
        vi: 'Lộ trình thực tế: baseline tuần đầu cho team vừa và nhỏ',
        en: 'A practical path: first-week baseline for small and mid-size teams',
      },
      paragraphs: [
        {
          vi: 'Tuần 1: bật WAF managed rules baseline (nếu chưa có), thêm Turnstile cho form public quan trọng, bật rate limiting cho `/login` và API đăng ký. Tuần 2–3: xem Security analytics — nếu bot score và challenge events cao liên tục, cân nhắc Bot Management hoặc rule bot chuyên sâu hơn.',
          en: 'Week 1: enable WAF managed baseline (if missing), add Turnstile to important public forms, rate limit `/login` and signup APIs. Weeks 2–3: review Security analytics — if bot scores and challenge events stay high, consider Bot Management or deeper bot rules.',
        },
        {
          vi: 'Luôn whitelist (hoặc rule nới) cho monitoring nội bộ và webhook đối tác đã biết. Ghi lại trong runbook: “Bot Google được phép; bot quét CVE bị chặn; form workshop cần Turnstile.” Câu hỏi tự kiểm tra: “Nếu chặn request này, khách thật hoặc SEO có bị ảnh hưởng không?”',
          en: 'Always allowlist (or relax rules for) known internal monitoring and partner webhooks. Document in a runbook: “Googlebot allowed; CVE scanners blocked; workshop form requires Turnstile.” Self-check: “If I block this request, do real customers or SEO suffer?”',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Turnstile có thay thế Bot Management không?',
        en: 'Does Turnstile replace Bot Management?',
      },
      answer: {
        vi: 'Không. Turnstile bảo vệ điểm form cụ thể. Bot Management phân tích traffic toàn site và API. Nhiều dự án dùng cả hai: Turnstile cho đăng ký, Bot Management cho lớp mạng rộng hơn.',
        en: 'No. Turnstile protects specific form endpoints. Bot Management analyzes site-wide and API traffic. Many projects use both: Turnstile for signups, Bot Management for a broader network layer.',
      },
    },
    {
      question: {
        vi: 'Bot Google có bị chặn khi bật Bot Management không?',
        en: 'Will Googlebot get blocked when Bot Management is on?',
      },
      answer: {
        vi: 'Cloudflare nhận diện nhiều bot tốt đã biết. Vẫn nên kiểm tra Search Console và log sau khi bật rule mới. Nếu bạn custom rule quá gắt, hãy allowlist user-agent hoặc ASN đã xác minh.',
        en: 'Cloudflare recognizes many known good bots. Still verify Search Console and logs after new rules. If custom rules are too strict, allowlist verified user agents or ASNs.',
      },
    },
    {
      question: {
        vi: 'Bot Management liên quan gì tới WAF?',
        en: 'How does Bot Management relate to WAF?',
      },
      answer: {
        vi: 'WAF lọc request theo pattern tấn công (SQLi, XSS…). Bot Management thêm lớp hành vi và danh tiếng. Chúng bổ sung nhau trên cùng proxy Cloudflare — không thay thế nhau.',
        en: 'WAF filters requests by attack patterns (SQLi, XSS, etc.). Bot Management adds behavior and reputation signals. They complement each other on the same Cloudflare proxy — neither replaces the other.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Bots topics',
      href: 'https://blog.cloudflare.com/tag/bots/',
    },
    {
      title: 'The Cloudflare Blog — Security topics',
      href: 'https://blog.cloudflare.com/tag/security/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['bots', 'turnstile', 'waf'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
  ],
  hubLinks: [
    { href: '/products/bots/', label: { vi: 'Bot Management (trang sản phẩm)', en: 'Bot Management (product page)' } },
    { href: '/products/turnstile/', label: { vi: 'Turnstile là gì?', en: 'What is Turnstile?' } },
    { href: '/products/waf/', label: { vi: 'WAF — lớp bảo vệ ứng dụng', en: 'WAF — application protection layer' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect a website' } },
  ],
  diagramSlugs: ['bot-management', 'securing-data-in-transit'],
};
