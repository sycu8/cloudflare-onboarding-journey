import type { BlogPost } from '../blog';

/** Entry · Security — rewritten from Cloudflare WAF / application security blog themes */
export const postWafBeginner: BlogPost = {
  slug: 'waf-bao-ve-website-cho-nguoi-moi',
  date: '2026-08-06',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'WAF là gì? Bảo vệ website Cloudflare theo cách người không chuyên IT cũng hiểu',
    en: 'What is a WAF? Cloudflare website protection explained for non-specialists',
  },
  description: {
    vi: 'Giải thích Web Application Firewall (WAF) trên Cloudflare: lọc request xấu trước khi tới server, khác gì antivirus, và bước baseline nên bật trước.',
    en: 'Explain Cloudflare’s Web Application Firewall (WAF): filtering bad requests before they reach your server, how it differs from antivirus, and a sensible baseline to enable first.',
  },
  excerpt: {
    vi: 'WAF giống bảo vệ cửa ra vào của website: xem ai đang gõ cửa, chặn hành vi đáng ngờ, rồi mới cho vào bên trong (origin).',
    en: 'A WAF is like a doorman for your website: it checks who is knocking, blocks suspicious behavior, then lets safe traffic through to your origin.',
  },
  keywords: {
    vi: 'WAF là gì, Cloudflare WAF, bảo vệ website, firewall ứng dụng web, chống tấn SQL, bảo mật cho người mới',
    en: 'what is a WAF, Cloudflare WAF, website protection, web application firewall, SQL injection, beginner security',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao website cần “người gác cổng”, không chỉ mật khẩu admin?',
        en: 'Why websites need a doorman — not only an admin password',
      },
      paragraphs: [
        {
          vi: 'Nhiều chủ doanh nghiệp nghĩ bảo mật website chỉ là mật khẩu mạnh và chứng chỉ HTTPS. Những thứ đó quan trọng, nhưng phần lớn tấn công tự động không cần biết mật khẩu của bạn. Chúng gửi hàng loạt request thử lỗi phổ biến: chèn mã độc vào form, dò đường dẫn quản trị, lợi dụng lỗ hổng plugin cũ.',
          en: 'Many business owners think website security is only a strong password and HTTPS. Those matter, but most automated attacks never need your password. They fire waves of requests probing common flaws: injecting malicious code into forms, guessing admin paths, abusing outdated plugins.',
        },
        {
          vi: 'WAF (Web Application Firewall) đứng giữa Internet và ứng dụng của bạn. Trên Cloudflare, khi site được proxy, WAF có thể kiểm tra request theo quy tắc — managed rules do Cloudflare duy trì, hoặc quy tắc bạn tự thêm — trước khi request chạm origin.',
          en: 'A WAF (Web Application Firewall) sits between the Internet and your application. On Cloudflare, once a site is proxied, the WAF can inspect requests against rules — Cloudflare-managed rulesets or your own — before traffic reaches origin.',
        },
        {
          vi: 'Các bài trên blog.cloudflare.com về application security thường nhắc: tấn công thay đổi theo mùa (bot, CVE mới, chiến dịch quét hàng loạt). Managed rules giúp bạn không phải tự theo dõi mọi lỗ hổng một mình — đây là lý do WAF managed hữu ích với team nhỏ.',
          en: 'Cloudflare Blog posts on application security often note that attacks shift over time (bots, new CVEs, mass scanning). Managed rules mean you are not tracking every vulnerability alone — which is why a managed WAF helps small teams.',
        },
      ],
    },
    {
      heading: {
        vi: 'WAF khác antivirus và khác “firewall văn phòng” thế nào?',
        en: 'How is a WAF different from antivirus or an office firewall?',
      },
      paragraphs: [
        {
          vi: 'Antivirus thường bảo vệ máy tính cá nhân khỏi file độc. Firewall văn phòng thường kiểm soát cổng mạng trong công ty. WAF tập trung vào HTTP/HTTPS — ngôn ngữ của website và API: đường dẫn, tham số, header, body request.',
          en: 'Antivirus usually protects a personal computer from malicious files. An office firewall often controls network ports inside a company. A WAF focuses on HTTP/HTTPS — the language of websites and APIs: paths, parameters, headers, and request bodies.',
        },
        {
          vi: 'Ví dụ đơn giản: ai đó gửi form liên hệ nhưng nhét đoạn mã thử SQL injection vào ô “Họ tên”. Server yếu có thể hiểu nhầm và lộ dữ liệu. WAF nhận diện mẫu tấn công kiểu này và chặn trước. Bạn không cần nhớ tên kỹ thuật — chỉ cần biết: có một lớp lọc thông minh trước cửa hàng online của bạn.',
          en: 'Simple example: someone submits a contact form but stuffs a SQL injection probe into the “Name” field. A weak server might mis-handle it and leak data. A WAF recognizes that attack pattern and blocks it. You do not need the jargon — just know a smarter filter sits in front of your storefront.',
        },
        {
          vi: 'WAF không thay thế việc cập nhật WordPress/plugin, sao lưu, hay phân quyền admin. Nó là lớp giảm rủi ro và mua thời gian. Kết hợp WAF + vá lỗi phần mềm + backup vẫn là bộ ba thực tế cho hầu hết website vừa và nhỏ.',
          en: 'A WAF does not replace updating WordPress/plugins, backups, or admin least-privilege. It reduces risk and buys time. WAF + patching + backups remains a practical trio for most small and mid-size sites.',
        },
      ],
    },
    {
      heading: {
        vi: 'Baseline nên bật trước khi “tinh chỉnh nâng cao”',
        en: 'A baseline to enable before advanced tuning',
      },
      paragraphs: [
        {
          vi: 'Với người mới trên Cloudflare: đảm bảo DNS đang proxy (đám mây cam) cho hostname cần bảo vệ; bật managed rules ở mức hợp lý; cân nhắc rate limiting cho đường dẫn đăng nhập hoặc API nhạy cảm; theo dõi Security events vài ngày đầu để phát hiện chặn nhầm (false positive).',
          en: 'For Cloudflare beginners: make sure DNS is proxied (orange cloud) for hostnames you want protected; enable managed rules at a sensible level; consider rate limiting on login paths or sensitive APIs; watch Security events for a few days to catch false positives.',
        },
        {
          vi: 'Nếu bạn bán hàng hoặc nhận form, hãy thử chính luồng thanh toán/đăng ký sau khi bật rule. An ninh tốt là an ninh bạn vẫn dùng được sản phẩm. Hub này có trang sản phẩm WAF, use case bảo vệ website, và lộ trình Application Services để bạn luyện theo từng bước.',
          en: 'If you sell products or accept forms, test checkout/signup yourself after enabling rules. Good security is security you can still operate. This hub has a WAF product page, a protect-website use case, and the Application Services track for step-by-step practice.',
        },
        {
          vi: 'Khi đã quen WAF, bài tiếp theo trong chuỗi blog — về Workers và Developer Platform — giúp bạn hiểu thêm cách chặn hoặc xử lý logic ngay tại edge. Còn nếu bạn quan tâm bot và AI abuse, hãy đọc các bài AI Gateway và AI security trong blog này.',
          en: 'Once you are comfortable with WAF basics, the next posts in this series — Workers and the Developer Platform — show how logic can run at the edge. If you care about bots and AI abuse, continue with the AI Gateway and AI security posts in this blog.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Website nhỏ có cần WAF không?',
        en: 'Do small websites need a WAF?',
      },
      answer: {
        vi: 'Có — tấn công tự động không phân biệt bạn là tập đoàn hay cửa hàng nhỏ. WAF managed giúp giảm rủi ro phổ biến với ít công vận hành hơn tự viết mọi rule.',
        en: 'Yes — automated attacks do not care whether you are an enterprise or a small shop. A managed WAF reduces common risk with less ops work than writing every rule yourself.',
      },
    },
    {
      question: {
        vi: 'WAF có làm chậm website không?',
        en: 'Will a WAF slow my site down?',
      },
      answer: {
        vi: 'Trên Cloudflare, kiểm tra diễn ra trên mạng edge toàn cầu, thường đi kèm proxy/CDN. Trải nghiệm thực tế thường là bảo vệ + tốc độ tốt hơn so với origin trần, miễn là cấu hình hợp lý.',
        en: 'On Cloudflare, inspection happens on the global edge network, usually alongside proxy/CDN. In practice you often get protection plus better performance than a bare origin — when configuration is sensible.',
      },
    },
    {
      question: {
        vi: 'False positive là gì?',
        en: 'What is a false positive?',
      },
      answer: {
        vi: 'Khi WAF chặn nhầm request hợp lệ (ví dụ form có ký tự đặc biệt). Vì vậy cần theo dõi log vài ngày đầu và tinh chỉnh rule thay vì tắt hết bảo vệ.',
        en: 'When the WAF blocks a legitimate request by mistake (for example a form with special characters). That is why you should watch logs early and tune rules instead of turning protection off entirely.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — WAF topics',
      href: 'https://blog.cloudflare.com/tag/waf/',
    },
    {
      title: 'The Cloudflare Blog — Security topics',
      href: 'https://blog.cloudflare.com/tag/security/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['waf'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
    'cloudflare-workers-la-gi-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/waf/', label: { vi: 'WAF là gì? (trang sản phẩm)', en: 'What is WAF? (product page)' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect a website' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/checklists/beginner-cloudflare-checklist/', label: { vi: 'Checklist người mới', en: 'Beginner checklist' } },
    { href: '/glossary/', label: { vi: 'Thuật ngữ bảo mật', en: 'Security glossary' } },
  ],
};
