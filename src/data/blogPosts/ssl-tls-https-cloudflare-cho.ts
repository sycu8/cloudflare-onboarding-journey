import type { BlogPost } from '../blog';

/** Entry · Security — rewritten from Cloudflare SSL/TLS / HTTPS blog themes */
export const postSslTlsHttpsCloudflareChoNguoiMoi: BlogPost = {
  slug: 'ssl-tls-https-cloudflare-cho-nguoi-moi',
  date: '2026-09-06',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'HTTPS và SSL trên Cloudflare: khóa cửa website giải thích cho người mới',
    en: 'HTTPS and SSL on Cloudflare: locking your website door, explained for beginners',
  },
  description: {
    vi: 'Giải thích HTTPS, chứng chỉ SSL tự động, chế độ Flexible vs Full, tránh redirect loop — viết lại từ blog.cloudflare.com cho người mới bảo mật.',
    en: 'Explain HTTPS, automatic SSL certificates, Flexible vs Full modes, and avoiding redirect loops — rewritten from blog.cloudflare.com for security beginners.',
  },
  excerpt: {
    vi: 'HTTPS mã hóa đường đi giữa trình duyệt và server. Cloudflare cấp chứng chỉ miễn phí và giúp bạn chọn cách mã hóa tới origin — chọn sai dễ gặp vòng lặp redirect hoặc cảnh báo “không bảo mật”.',
    en: 'HTTPS encrypts traffic between browser and server. Cloudflare issues free certificates and helps you choose how to encrypt to origin — wrong choices cause redirect loops or “not secure” warnings.',
  },
  keywords: {
    vi: 'HTTPS Cloudflare, SSL TLS là gì, Flexible Full Strict, chứng chỉ miễn phí, bảo mật website người mới',
    en: 'Cloudflare HTTPS, what is SSL TLS, Flexible Full Strict, free certificate, beginner website security',
  },
  sections: [
    {
      heading: {
        vi: 'HTTPS giải quyết vấn đề gì — nói không cần chứng chỉ kỹ thuật?',
        en: 'What does HTTPS fix — without certificate jargon?',
      },
      paragraphs: [
        {
          vi: 'HTTP gửi dữ liệu dạng văn bản thuần — ai ngồi giữa mạng Wi‑Fi công cộng và server có thể đọc hoặc sửa (đặc biệt nguy hiểm với mật khẩu và cookie đăng nhập). HTTPS bọc traffic trong TLS: trình duyệt và server thỏa thuận khóa, nội dung đi “kín” trên đường truyền.',
          en: 'HTTP sends plain text — anyone between a public Wi‑Fi and your server can read or tamper (especially dangerous for passwords and login cookies). HTTPS wraps traffic in TLS: browser and server agree on keys, and content travels encrypted on the wire.',
        },
        {
          vi: 'Thanh địa chỉ hiện ổ khóa không chỉ là “cho đẹp”. Google và trình duyệt hiện đại ưu tiên site HTTPS; form trên HTTP có thể bị cảnh báo. Các bài trên blog.cloudflare.com về SSL thường nhắc: mã hóa in-transit là lớp cơ bản trước WAF hay bot management.',
          en: 'The address-bar padlock is not decoration. Modern browsers favor HTTPS sites; forms on HTTP may trigger warnings. SSL posts on blog.cloudflare.com often note: encrypting data in transit is the baseline before WAF or bot management.',
        },
        {
          vi: 'Cloudflare proxy (đám mây cam) tự cấp chứng chỉ edge cho tên miền của bạn — visitor tới Cloudflare đã HTTPS mà không cần bạn mua cert đắt tiền cho từng subdomain thử nghiệm.',
          en: 'With Cloudflare proxy (orange cloud), edge certificates for your domain are issued automatically — visitors hit HTTPS to Cloudflare without you buying expensive certs for every trial subdomain.',
        },
      ],
      diagramSlug: 'securing-data-in-transit',
    },
    {
      heading: {
        vi: 'Flexible, Full và Full (strict): chọn sai là redirect loop',
        en: 'Flexible, Full, and Full (strict): wrong choice means redirect loops',
      },
      paragraphs: [
        {
          vi: 'SSL/TLS encryption mode mô tả đoạn Cloudflare ↔ origin (server gốc). Flexible: visitor → Cloudflare là HTTPS, Cloudflare → origin là HTTP. Dễ bật nhanh nhưng origin không được mã hóa — không khuyến nghị lâu dài.',
          en: 'SSL/TLS encryption mode describes the Cloudflare ↔ origin leg. Flexible: visitor → Cloudflare is HTTPS, Cloudflare → origin is HTTP. Quick to enable but origin traffic is not encrypted — not recommended long term.',
        },
        {
          vi: 'Full: Cloudflare → origin cũng HTTPS, nhưng chấp nhận chứng chỉ tự ký hoặc hết hạn trên origin. Full (strict): origin phải có chứng chỉ hợp lệ (Let’s Encrypt, Origin CA của Cloudflare, hoặc CA thương mại). Đây là mục tiêu production cho hầu hết site.',
          en: 'Full: Cloudflare → origin is also HTTPS, but accepts self-signed or expired origin certs. Full (strict): origin must present a valid certificate (Let’s Encrypt, Cloudflare Origin CA, or commercial CA). This is the production target for most sites.',
        },
        {
          vi: 'Redirect loop kinh điển: origin luôn redirect HTTP → HTTPS, nhưng mode đang Flexible (Cloudflare gọi origin bằng HTTP) — vòng lặp vô hạn. Cách sửa: bật HTTPS trên origin + chuyển sang Full (strict), hoặc tạm Full nếu đang dùng cert tự ký có chủ đích.',
          en: 'Classic redirect loop: origin always redirects HTTP → HTTPS, but mode is Flexible (Cloudflare calls origin over HTTP) — infinite loop. Fix: enable HTTPS on origin + switch to Full (strict), or temporarily Full if you intentionally use a self-signed cert.',
        },
      ],
    },
    {
      heading: {
        vi: 'Chứng chỉ tự động và Origin CA: việc Cloudflare làm giúp bạn',
        en: 'Automatic certs and Origin CA: what Cloudflare does for you',
      },
      paragraphs: [
        {
          vi: 'Universal SSL trên edge: sau khi proxy bật, Cloudflare phát hành cert cho `example.com` và thường cả wildcard `*.example.com` trên gói phù hợp — renewal tự động. Bạn không upload file `.crt` thủ công cho visitor-facing cert.',
          en: 'Universal SSL at the edge: once proxy is on, Cloudflare issues certs for `example.com` and often `*.example.com` on eligible plans — renewed automatically. You do not manually upload visitor-facing `.crt` files.',
        },
        {
          vi: 'Giữa Cloudflare và origin, Origin CA (miễn phí trong tài khoản) tạo cert dài hạn chỉ tin bởi Cloudflare — lý tưởng khi origin không public Internet hoặc bạn chỉ muốn Cloudflare là điểm vào duy nhất. Kết hợp Full (strict) để đóng cả hai đầu.',
          en: 'Between Cloudflare and origin, Origin CA (free in your account) issues long-lived certs trusted only by Cloudflare — ideal when origin is not public or Cloudflare is the only entry point. Pair with Full (strict) to encrypt both legs.',
        },
        {
          vi: 'HSTS (HTTP Strict Transport Security) buộc trình duyệt chỉ dùng HTTPS — tăng bảo mật nhưng khó rollback. Chỉ bật khi chắc mọi subdomain và origin đã HTTPS ổn định; hub checklist người mới gợi ý thử trên staging trước.',
          en: 'HSTS forces browsers to use HTTPS only — stronger security, harder rollback. Enable only when every subdomain and origin is stably on HTTPS; the hub beginner checklist suggests staging first.',
        },
      ],
    },
    {
      heading: {
        vi: 'Baseline tuần đầu: proxy, mode, và kiểm tra nhanh',
        en: 'First-week baseline: proxy, mode, and a quick check',
      },
      paragraphs: [
        {
          vi: 'Bước 1: DNS record web (A/CNAME) bật proxy cam. Bước 2: SSL/TLS → Overview xem cert edge đã Active. Bước 3: chọn Full (strict) sau khi origin có HTTPS hợp lệ. Bước 4: mở site ẩn danh, kiểm tra form đăng nhập và redirect www/non-www. Bước 5: đọc bài WAF và CDN trên hub — HTTPS là lớp 1, không phải toàn bộ bảo mật.',
          en: 'Step 1: orange-cloud proxy on web DNS (A/CNAME). Step 2: SSL/TLS → Overview, confirm edge cert is Active. Step 3: choose Full (strict) once origin has valid HTTPS. Step 4: open the site in a private window, test login forms and www/non-www redirects. Step 5: read WAF and CDN posts on this hub — HTTPS is layer one, not all security.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu ai đó sniff traffic giữa Cloudflare và origin, họ thấy gì?” Ở Flexible, họ thấy HTTP — đổi mode trước khi xử lý dữ liệu nhạy cảm. Mở tag ssl trên blog.cloudflare.com khi cần tin TLS 1.3 hoặc cipher suite mới.',
          en: 'Self-check: “If someone sniffed traffic between Cloudflare and origin, what would they see?” On Flexible, HTTP — change mode before handling sensitive data. Open the ssl tag on blog.cloudflare.com for TLS 1.3 or cipher updates.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Cloudflare SSL có miễn phí không?',
        en: 'Is Cloudflare SSL free?',
      },
      answer: {
        vi: 'Chứng chỉ edge Universal SSL miễn phí trên plan phổ biến khi domain được proxy. Origin CA cũng miễn phí cho đoạn Cloudflare–origin. Gói trả phí thêm tính năng nâng cao, không phải HTTPS cơ bản.',
        en: 'Universal edge SSL is free on common plans when the domain is proxied. Origin CA is also free for the Cloudflare–origin leg. Paid plans add advanced features, not basic HTTPS.',
      },
    },
    {
      question: {
        vi: 'Flexible có dùng được production không?',
        en: 'Is Flexible OK for production?',
      },
      answer: {
        vi: 'Chỉ tạm thời khi origin chưa có HTTPS. Production nên Full (strict) để mã hóa end-to-end qua Cloudflare và tránh lỗ hổng giữa edge và origin.',
        en: 'Only temporarily while origin lacks HTTPS. Production should use Full (strict) to encrypt through Cloudflare and close the gap between edge and origin.',
      },
    },
    {
      question: {
        vi: 'HTTPS xong có cần WAF không?',
        en: 'After HTTPS, do you still need a WAF?',
      },
      answer: {
        vi: 'Có — HTTPS bảo vệ đường truyền, không chặn SQL injection hay bot xấu. WAF và bot controls bổ sung cho lớp ứng dụng; hub có bài riêng cho từng phần.',
        en: 'Yes — HTTPS protects the wire, not SQL injection or bad bots. WAF and bot controls add application-layer defense; the hub has dedicated posts for each.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — SSL topics',
      href: 'https://blog.cloudflare.com/tag/ssl/',
    },
    {
      title: 'The Cloudflare Blog — Security topics',
      href: 'https://blog.cloudflare.com/tag/security/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['ssl'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'bot-management-phan-biet-nguoi-va-bot',
  ],
  hubLinks: [
    { href: '/products/ssl/', label: { vi: 'SSL/TLS (trang sản phẩm)', en: 'SSL/TLS (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect a website' } },
    { href: '/checklists/beginner-cloudflare-checklist/', label: { vi: 'Checklist người mới', en: 'Beginner checklist' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: ['securing-data-in-transit', 'bot-management'],
};
