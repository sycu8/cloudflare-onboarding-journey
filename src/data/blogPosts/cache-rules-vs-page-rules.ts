import type { BlogPost } from '../blog';

/** Intermediate · CDN — rewritten from Cloudflare Cache / CDN themes on blog.cloudflare.com */
export const postCacheRulesVsPageRulesNguoiMoi: BlogPost = {
  slug: 'cache-rules-vs-page-rules-nguoi-moi',
  date: '2026-08-27',
  topic: 'cdn',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Cache Rules: kiểm soát cache không phá giỏ hàng',
    en: 'Cache Rules: control caching without breaking carts',
  },
  description: {
    vi: 'Hướng dẫn Cache Rules cho người mới đã biết CDN cơ bản: quy tắc theo đường dẫn, bypass login/giỏ hàng, so với Page Rules cũ, và purge khi deploy.',
    en: 'Cache Rules for learners who know CDN basics: path-based rules, bypassing login/cart, how they differ from legacy Page Rules, and purging on deploy.',
  },
  excerpt: {
    vi: 'Cache Rules cho phép “cache ảnh/CSS, không cache /cart” — rõ ràng hơn bật cache toàn site. Hiểu thứ tự rule và purge để deploy không khiến khách thấy bản cũ.',
    en: 'Cache Rules let you “cache images/CSS, not /cart” — clearer than caching the whole site. Learn rule order and purge so deploys do not show stale pages.',
  },
  keywords: {
    vi: 'Cache Rules Cloudflare, Page Rules, bypass cache login, purge cache, CDN trung cấp, không cache giỏ hàng',
    en: 'Cloudflare Cache Rules, Page Rules, bypass cache login, purge cache, intermediate CDN, do not cache cart',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao “cache mặc định” không đủ cho site thật?',
        en: 'Why “default cache” is not enough for real sites',
      },
      paragraphs: [
        {
          vi: 'CDN cache giúp site nhanh — nhưng site thương mại, SaaS, hoặc có đăng nhập cần quy tắc tinh: ảnh sản phẩm cache lâu; trang /account, /checkout, /api/me không cache; HTML marketing có thể cache ngắn. Không phân biệt → khách A thấy giỏ của khách B, hoặc form login lỗi — lỗi nguy hiểm hơn chậm vài trăm ms.',
          en: 'CDN cache speeds sites up — but shops, SaaS, and logged-in experiences need fine rules: product images cache long; /account, /checkout, /api/me do not; marketing HTML might cache briefly. Without separation → user A sees user B’s cart or broken login — worse than a few hundred ms delay.',
        },
        {
          vi: 'Cloudflare Cache Rules (và các rule engine mới) thay dần Page Rules cũ cho nhiều use case cache: biểu thức theo hostname, path, header, cookie; hành động bypass, edge TTL, cache key tùy chỉnh. Blog.cloudflare.com về cache thường khuyên dùng Cache Rules cho cấu hình mới.',
          en: 'Cloudflare Cache Rules (and newer rule engines) gradually replace legacy Page Rules for many cache cases: expressions by hostname, path, header, cookie; actions like bypass, edge TTL, custom cache keys. Cloudflare Blog cache posts often recommend Cache Rules for new config.',
        },
        {
          vi: 'Bài này giả định bạn đã đọc giới thiệu CDN trên hub và site đang proxied (đám mây cam). Nếu chưa, quay lại bài DNS/proxy và CDN cơ bản trước — rule không có tác dụng đúng trên DNS only.',
          en: 'This post assumes you read the hub CDN intro and your site is proxied (orange cloud). If not, revisit DNS/proxy and CDN basics first — rules do not apply correctly on DNS-only.',
        },
      ],
      diagramSlug: 'distributed-web-performance-architecture',
    },
    {
      heading: {
        vi: 'Cache Rules hoạt động thế nào — thứ tự và match',
        en: 'How Cache Rules work — order and matching',
      },
      paragraphs: [
        {
          vi: 'Mỗi rule có điều kiện (when) và hành động (then): ví dụ “URI Path contains /static/” → Cache eligibility: eligible, Edge TTL 1 tháng. Rule khác: “URI Path starts with /cart” → Bypass cache. Cloudflare đánh giá theo thứ tự ưu tiên bạn sắp — rule cụ thể hơn nên đứng trước rule chung.',
          en: 'Each rule has a condition (when) and action (then): e.g. “URI Path contains /static/” → Cache eligibility: eligible, Edge TTL 1 month. Another rule: “URI Path starts with /cart” → Bypass cache. Cloudflare evaluates in your priority order — more specific rules should sit above broad ones.',
        },
        {
          vi: 'Bạn có thể match cookie session (wordpress_logged_in, sessionid) để bypass cache cho user đã login — hữu ích khi HTML trang chủ giống nhau nhưng header khác. Cẩn thận: match cookie sai có thể bypass quá nhiều và mất lợi ích CDN.',
          en: 'You can match session cookies (wordpress_logged_in, sessionid) to bypass cache for logged-in users — useful when homepage HTML looks the same but headers differ. Careful: wrong cookie matches bypass too much and waste CDN benefits.',
        },
        {
          vi: 'Cache Rules khác Page Rules ở chỗ tập trung vào cache/CDN, tích hợp dashboard Rules mới, và biểu thức linh hoạt hơn. Page Rules cũ có thể vẫn tồn tại trên zone legacy — tránh trùng mâu thuẫn (một chỗ cache, một chỗ bypass). Khi migrate, ghi lại hành vi cũ rồi test từng luồng.',
          en: 'Cache Rules differ from Page Rules by focusing on cache/CDN, fitting the new Rules dashboard, and richer expressions. Legacy zones may still have Page Rules — avoid conflicting overlap (one caches, one bypasses). When migrating, document old behavior then test each flow.',
        },
        {
          vi: 'Developer tip: sau khi thêm rule, dùng curl -I hoặc DevTools Network xem header CF-Cache-Status (HIT, MISS, BYPASS, DYNAMIC) — học nhanh hơn đoán trong dashboard.',
          en: 'Developer tip: after adding rules, use curl -I or DevTools Network for CF-Cache-Status (HIT, MISS, BYPASS, DYNAMIC) — faster than guessing in the dashboard.',
        },
      ],
    },
    {
      heading: {
        vi: 'Mẫu rule an toàn: static, HTML, login, API',
        en: 'Safe rule patterns: static, HTML, login, API',
      },
      paragraphs: [
        {
          vi: 'Static assets (/assets/*, *.css, *.js, *.woff2, ảnh sản phẩm): cache edge dài, respect origin nếu origin gửi Cache-Control hợp lý. Marketing pages (/blog/*, landing): cache ngắn hoặc stale-while-revalidate nếu nội dung đổi thường xuyên.',
          en: 'Static assets (/assets/*, *.css, *.js, *.woff2, product images): long edge cache, respect origin when origin sends sensible Cache-Control. Marketing pages (/blog/*, landing): short cache or stale-while-revalidate if content changes often.',
        },
        {
          vi: 'Bypass bắt buộc: /cart, /checkout, /account, /admin, /api/* trả dữ liệu user-specific, webhook endpoints. WordPress: bypass wp-admin và thường cả trang có comment form động. Shopify/Woo: theo doc nền tảng — đừng copy rule blog WordPress mù quáng.',
          en: 'Mandatory bypass: /cart, /checkout, /account, /admin, /api/* returning user-specific data, webhook endpoints. WordPress: bypass wp-admin and often comment-heavy pages. Shopify/Woo: follow platform docs — do not blindly copy WordPress blog rules.',
        },
        {
          vi: 'API JSON public (read-only) đôi khi cache được với TTL ngắn và cache key có query — chỉ khi bạn chắc không lộ dữ liệu riêng. Nghi ngờ → bypass. WAF và cache là hai lớp: rule cache không thay thế kiểm tra authorization trên origin.',
          en: 'Public read-only JSON APIs can sometimes cache with short TTL and query-aware cache keys — only when sure no private data leaks. When unsure → bypass. WAF and cache are separate layers: cache rules do not replace origin authorization checks.',
        },
      ],
    },
    {
      heading: {
        vi: 'Purge khi deploy — và checklist sau khi đổi rule',
        en: 'Purge on deploy — and checklist after rule changes',
      },
      paragraphs: [
        {
          vi: 'Deploy frontend mới mà quên purge: user vẫn thấy JS/CSS cũ từ edge — bug “ghost” khó debug. Thói quen: purge by tag hoặc prefix /assets/* sau mỗi release quan trọng; hoặc dùng version query (?v=20260827). CI có thể gọi API purge tự động.',
          en: 'Deploy new frontend without purge: users keep old JS/CSS from edge — ghost bugs are hard to debug. Habit: purge by tag or /assets/* prefix after major releases; or versioned query strings (?v=20260827). CI can call the purge API automatically.',
        },
        {
          vi: 'Sau khi sửa Cache Rules: test đăng nhập, thêm giỏ hàng, thanh toán sandbox; mở tab ẩn danh và tab đã login song song; kiểm tra API mobile app nếu có. Ghi lại rule đã thêm — team sau sẽ cảm ơn.',
          en: 'After editing Cache Rules: test login, add-to-cart, sandbox checkout; open incognito and logged-in tabs side by side; check mobile app APIs if any. Document rules you added — future you will thank you.',
        },
        {
          vi: 'Đọc thêm trang Content Delivery (mục Cache Rules) trên hub, bài CDN cơ bản, và WAF nếu bạn vừa siết cache vừa mở rộng surface API. Cache đúng là nghệ thuật cân bằng tốc độ và đúng dữ liệu — không phải nút “max speed” một lần.',
          en: 'Read the hub Content Delivery section (Cache Rules), the CDN basics post, and WAF if you tighten cache while expanding API surface. Good caching balances speed and correct data — not a one-time “max speed” button.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Cache Rules có xóa Page Rules cũ ngay không?',
        en: 'Should you delete old Page Rules immediately?',
      },
      answer: {
        vi: 'Không vội. Tạo Cache Rules tương đương, test kỹ, rồi tắt Page Rules trùng chức năng từng cái. Giữ ghi chú để rollback nếu checkout lỗi sau deploy.',
        en: 'Not in a rush. Build equivalent Cache Rules, test thoroughly, then disable overlapping Page Rules one by one. Keep notes to rollback if checkout breaks after deploy.',
      },
    },
    {
      question: {
        vi: 'Purge Everything có nguy hiểm không?',
        en: 'Is Purge Everything dangerous?',
      },
      answer: {
        vi: 'Không xóa origin — chỉ xóa bản copy edge. Site có thể chậm tạm thời (MISS) khi cache làm lại. Dùng khi cần; hàng ngày prefer purge theo URL/tag để ít ảnh hưởng traffic.',
        en: 'It does not delete origin — only edge copies. The site may be briefly slower (MISS) while cache rebuilds. Use when needed; day-to-day prefer URL/tag purge for less traffic impact.',
      },
    },
    {
      question: {
        vi: 'HTML động có cache được không?',
        en: 'Can dynamic HTML be cached?',
      },
      answer: {
        vi: 'Có thể với edge side includes hoặc cache theo segment — nâng cao. Người mới nên bypass HTML cá nhân hóa; chỉ cache phần static rõ ràng. Sai ở đây gây lộ dữ liệu nhanh hơn mọi lỗi performance khác.',
        en: 'Possible with edge includes or segmented cache — advanced. Beginners should bypass personalized HTML; cache only clearly static parts. Mistakes here leak data faster than any performance bug.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Cache topics',
      href: 'https://blog.cloudflare.com/tag/cache/',
    },
    {
      title: 'The Cloudflare Blog — CDN topics',
      href: 'https://blog.cloudflare.com/tag/cdn/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['cdn', 'cache'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'dns-proxy-dam-may-cam-cho-nguoi-moi',
    'waf-bao-ve-website-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/content-delivery/', label: { vi: 'Content Delivery (Cache Rules)', en: 'Content Delivery (Cache Rules)' } },
    { href: '/products/cdn/', label: { vi: 'CDN là gì? (trang sản phẩm)', en: 'What is CDN? (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Use case: tăng tốc nội dung', en: 'Use case: accelerate content delivery' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
};
