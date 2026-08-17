import type { BlogPost } from '../blog';

/** Entry · CDN — rewritten from Cloudflare CDN / cache themes on blog.cloudflare.com */
export const postCdnCache: BlogPost = {
  slug: 'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  date: '2026-08-05',
  topic: 'cdn',
  level: 'entry',
  readingMinutes: 6,
  title: {
    vi: 'CDN là gì? Hiểu Cloudflare Cache như đang giải thích cho bạn bè',
    en: 'What is a CDN? Understanding Cloudflare Cache in plain language',
  },
  description: {
    vi: 'Giải thích CDN và Cloudflare Cache cho người mới: vì sao website nhanh hơn, giảm tải server gốc, và khi nào nên (hoặc không nên) cache.',
    en: 'A beginner-friendly explainer of CDNs and Cloudflare Cache: why sites feel faster, how origin load drops, and when caching helps or hurts.',
  },
  excerpt: {
    vi: 'CDN giống mạng kho hàng gần người dùng. Cloudflare Cache giữ bản sao nội dung tĩnh gần bạn — trang mở nhanh hơn, server gốc đỡ “mệt”.',
    en: 'Think of a CDN as warehouses near your users. Cloudflare Cache keeps copies of static content close by — pages load faster and origin servers work less.',
  },
  keywords: {
    vi: 'CDN là gì, Cloudflare Cache, tăng tốc website, edge cache, content delivery network, học Cloudflare cơ bản',
    en: 'what is a CDN, Cloudflare Cache, speed up website, edge cache, content delivery network, Cloudflare beginner',
  },
  sections: [
    {
      heading: {
        vi: 'CDN giải quyết vấn đề gì trong đời thực?',
        en: 'What problem does a CDN solve in real life?',
      },
      paragraphs: [
        {
          vi: 'Hãy tưởng tượng bạn bán hàng online ở Việt Nam, nhưng server (máy chủ gốc — origin) đặt ở Mỹ. Mỗi lần khách mở ảnh sản phẩm, dữ liệu phải “bay” nửa vòng Trái Đất. Trang chậm, khách bỏ đi, server gốc phải trả lời mọi request dù ảnh gần như không đổi.',
          en: 'Imagine your online store serves customers in Vietnam, but the origin server sits in the US. Every product image travels halfway around the world. Pages feel slow, shoppers leave, and the origin answers every request even when the image barely changes.',
        },
        {
          vi: 'CDN (Content Delivery Network) là mạng máy chủ phân tán khắp thế giới. Cloudflare đặt bản sao nội dung gần người dùng hơn — gọi là edge. Khi ai đó ở Hà Nội mở trang, họ thường nhận file từ điểm gần mình thay vì lúc nào cũng hỏi server ở Mỹ.',
          en: 'A CDN (Content Delivery Network) is a global mesh of servers. Cloudflare keeps copies of content closer to users — at the edge. Someone in Hanoi often gets files from a nearby point of presence instead of always hitting a US origin.',
        },
        {
          vi: 'Trên blog.cloudflare.com, các bài về CDN và cache thường nhấn mạnh một ý: tốc độ không chỉ là “cho đẹp” — nó gắn với trải nghiệm, chi phí băng thông origin, và khả năng chịu traffic đột biến khi có chiến dịch hoặc tin nóng.',
          en: 'On blog.cloudflare.com, CDN and cache posts often stress one idea: speed is not cosmetic — it ties to experience, origin bandwidth cost, and surviving traffic spikes during campaigns or viral moments.',
        },
      ],
      diagramSlug: 'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2'
    },
    {
      heading: {
        vi: 'Cloudflare Cache hoạt động như thế nào (không cần thuật ngữ nặng)?',
        en: 'How Cloudflare Cache works (without heavy jargon)',
      },
      paragraphs: [
        {
          vi: 'Khi bạn bật proxy (đám mây cam) cho website, request của người dùng đi qua mạng Cloudflare trước. Với nội dung phù hợp để cache — ảnh, CSS, JavaScript, một số trang HTML tĩnh — Cloudflare có thể lưu bản sao và trả lại lần sau mà không cần hỏi origin.',
          en: 'When you orange-cloud (proxy) a site, user requests hit Cloudflare’s network first. For cacheable content — images, CSS, JavaScript, some static HTML — Cloudflare can store a copy and answer later without asking the origin.',
        },
        {
          vi: 'Bạn có thể hình dung như tủ lạnh văn phòng: lần đầu ai đó mang đồ ăn từ siêu thị (origin) về; lần sau đồng nghiệp lấy từ tủ lạnh (cache) — nhanh hơn và đỡ phải đi siêu thị lại. Cache “hết hạn” hoặc bị xóa khi bạn cập nhật nội dung quan trọng.',
          en: 'Picture an office fridge: the first person brings food from the supermarket (origin); coworkers later grab it from the fridge (cache) — faster, fewer supermarket trips. Cache expires or gets purged when you publish important updates.',
        },
        {
          vi: 'Không phải mọi thứ đều nên bỏ vào tủ lạnh. Trang giỏ hàng, trang tài khoản, API trả dữ liệu cá nhân — nếu cache sai, người A có thể thấy dữ liệu người B. Đó là lý do Cloudflare và tài liệu chính thức luôn phân biệt nội dung tĩnh (an toàn hơn để cache) và nội dung động (cần quy tắc rõ).',
          en: 'Not everything belongs in the fridge. Cart pages, account pages, and APIs with personal data — if cached wrongly, user A could see user B’s data. That is why Cloudflare and official docs separate static content (safer to cache) from dynamic content (needs clear rules).',
        },
      ],
    },
    {
      heading: {
        vi: 'Ba lợi ích dễ đo được khi dùng CDN đúng cách',
        en: 'Three easy-to-feel benefits when you use a CDN well',
      },
      paragraphs: [
        {
          vi: 'Một: thời gian mở trang giảm vì file nặng được phục vụ gần người dùng. Hai: origin “nhàn” hơn — ít request ảnh/CSS trùng lặp — hữu ích khi bạn dùng hosting nhỏ hoặc server tự quản. Ba: khi traffic tăng đột ngột, CDN hấp thụ phần lớn request tĩnh, giúp site ít “sập” hơn so với chỉ dựa vào một máy chủ.',
          en: 'One: pages open faster because heavy files are served near users. Two: the origin rests — fewer repeat image/CSS hits — helpful on small hosting or self-managed servers. Three: during spikes, the CDN absorbs most static requests so the site is less likely to fall over than with a single origin alone.',
        },
        {
          vi: 'Nếu bạn đang học lộ trình Application Services trên hub này, CDN/cache là viên gạch nền trước khi đi sâu WAF, DDoS hay tối ưu API. Hiểu cache giúp bạn tránh lỗi phổ biến: “bật mọi thứ cache hết” rồi phát hiện form hoặc session bị lỗi.',
          en: 'If you are following the Application Services track on this hub, CDN/cache is a foundation brick before deeper WAF, DDoS, or API tuning. Understanding cache helps you avoid the classic mistake: “cache everything” and then break forms or sessions.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu an toàn trong tuần đầu',
        en: 'A safe first-week starting point',
      },
      paragraphs: [
        {
          vi: 'Với người mới: ưu tiên cache tài nguyên tĩnh rõ ràng; kiểm tra trang đăng nhập và giỏ hàng vẫn đúng sau khi bật; học cách purge (xóa cache) khi deploy bản mới. Đọc thêm trang Content Delivery và bài sản phẩm CDN trên hub, rồi mở bài gốc trên blog.cloudflare.com khi muốn hiểu sâu cơ chế edge.',
          en: 'For beginners: prefer clearly static assets; verify login and cart pages still behave after enabling cache; learn how to purge when you deploy. Read the Content Delivery page and the CDN product explainer on this hub, then open the original Cloudflare Blog posts when you want deeper edge mechanics.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu Cloudflare giữ bản sao này 1 giờ, có ai bị lộ dữ liệu riêng không?” Nếu câu trả lời là có hoặc “không chắc”, hãy để nội dung đó ở chế độ không cache hoặc dùng quy tắc chặt hơn trước khi tối ưu thêm.',
          en: 'Self-check question: “If Cloudflare kept this copy for an hour, could someone see private data?” If the answer is yes or “not sure,” leave that content uncached or use stricter rules before you optimize further.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'CDN và hosting khác nhau chỗ nào?',
        en: 'How is a CDN different from hosting?',
      },
      answer: {
        vi: 'Hosting (origin) lưu và chạy ứng dụng của bạn. CDN chủ yếu phân phối bản sao nội dung gần người dùng. Nhiều site dùng cả hai: origin tạo trang, CDN tăng tốc và giảm tải.',
        en: 'Hosting (origin) stores and runs your app. A CDN mainly distributes copies of content near users. Many sites use both: origin builds the page, CDN speeds delivery and reduces load.',
      },
    },
    {
      question: {
        vi: 'Có nên cache toàn bộ website không?',
        en: 'Should you cache the entire website?',
      },
      answer: {
        vi: 'Không nên mặc định. Cache mạnh với ảnh, CSS, JS và trang tĩnh; thận trọng với trang cá nhân hóa, giỏ hàng và API. Sai cache nguy hiểm hơn chậm một chút.',
        en: 'Not by default. Cache aggressively for images, CSS, JS, and static pages; be careful with personalized pages, carts, and APIs. Wrong cache is worse than being a bit slower.',
      },
    },
    {
      question: {
        vi: 'Cloudflare Cache có thay thế tối ưu ảnh không?',
        en: 'Does Cloudflare Cache replace image optimization?',
      },
      answer: {
        vi: 'Cache giúp giao ảnh nhanh hơn, nhưng ảnh vẫn nên có kích thước hợp lý. Cache và tối ưu ảnh bổ sung cho nhau, không thay thế nhau.',
        en: 'Cache delivers images faster, but images should still be reasonably sized. Caching and image optimization complement each other; neither replaces the other.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — CDN & performance topics',
      href: 'https://blog.cloudflare.com/tag/cdn/',
    },
    {
      title: 'The Cloudflare Blog — Cache topics',
      href: 'https://blog.cloudflare.com/tag/cache/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['cdn'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
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
