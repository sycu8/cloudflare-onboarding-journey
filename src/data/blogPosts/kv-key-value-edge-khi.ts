import type { BlogPost } from '../blog';

/** Entry · Workers — rewritten from Workers KV blog themes */
export const postKvKeyValueEdgeKhi: BlogPost = {
  slug: 'kv-key-value-edge-khi-nao-dung',
  date: '2026-09-08',
  topic: 'workers',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Workers KV là gì? Tủ khóa-giá trị nhanh gần người dùng — khi nào nên dùng',
    en: 'What is Workers KV? A fast key-value locker near users — when to use it',
  },
  description: {
    vi: 'Giải thích Workers KV cho người mới: lưu cấu hình, flag và dữ liệu đọc nhiều trên edge; khác gì D1/SQL; và khi nào KV là lựa chọn đúng thay vì database quan hệ.',
    en: 'A beginner guide to Workers KV: storing config, flags, and other read-heavy data at the edge; how it differs from D1/SQL; and when KV is the right choice instead of a relational database.',
  },
  excerpt: {
    vi: 'KV giống tủ khóa nhỏ ở mỗi chi nhánh: đặt một giá trị, lấy lại nhanh — lý tưởng cho flag cấu hình và dữ liệu đọc nhiều, không phải bảng SQL phức tạp.',
    en: 'KV is like a small locker at every branch: store a value, read it back fast — ideal for config flags and read-heavy data, not complex SQL tables.',
  },
  keywords: {
    vi: 'Workers KV là gì, key-value edge, lưu cấu hình Workers, KV vs D1, học Cloudflare KV cơ bản',
    en: 'what is Workers KV, edge key-value, Workers config storage, KV vs D1, Cloudflare KV beginner',
  },
  sections: [
    {
      heading: {
        vi: 'KV giải quyết vấn đề gì mà file JSON trên server không đủ?',
        en: 'What problem does KV solve that a JSON file on a server cannot?',
      },
      paragraphs: [
        {
          vi: 'Nhiều app cần lưu thứ đơn giản: “bật tính năng mới chưa?”, “banner thông báo là gì?”, “phiên bản cấu hình hiện tại”. Ban đầu bạn có thể nhét vào file config hoặc biến môi trường. Nhưng khi Worker chạy trên hàng trăm điểm edge, mỗi lần đổi banner lại phải deploy lại toàn bộ — hoặc mọi request phải về một server trung tâm để đọc file.',
          en: 'Many apps need to store simple things: “is the new feature on?”, “what is the announcement banner?”, “what is the current config version?”. At first you might tuck that into a config file or environment variable. But when a Worker runs across hundreds of edge locations, every banner change means redeploying everything — or every request returns to one central server to read a file.',
        },
        {
          vi: 'Workers KV là kho lưu trữ key-value toàn cầu, được thiết kế cho đọc nhanh và phân tán. Bạn ghi một cặp khóa-giá trị (ví dụ `feature:new-checkout` → `true`), và Worker ở gần người dùng có thể đọc lại mà không cần round-trip về origin. Trên blog.cloudflare.com, các bài về KV và Workers thường nhấn mạnh mô hình “đọc nhiều, ghi ít” — phù hợp cấu hình, cache metadata, hoặc preference không cần nhất quán ngay.',
          en: 'Workers KV is a globally distributed key-value store built for fast reads. You write a key-value pair (for example `feature:new-checkout` → `true`), and a Worker near the user can read it back without a round trip to origin. Cloudflare Blog posts on KV and Workers often stress a “read-heavy, write-light” model — good for configuration, cache metadata, or preferences that do not need immediate consistency.',
        },
        {
          vi: 'Hãy tưởng tượng KV như bảng thông báo ở mỗi chi nhánh cửa hàng: trụ sở cập nhật một lần, các chi nhánh đọc nhanh. Không phải cơ sở dữ liệu để chạy báo cáo phức tạp hay join nhiều bảng — đó là vai trò của D1 hoặc hệ thống SQL bên ngoài.',
          en: 'Picture KV as a notice board at every store branch: headquarters updates once, branches read quickly. It is not the database for complex reports or multi-table joins — that is D1’s job or an external SQL system.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
    {
      heading: {
        vi: 'Ba use case thực tế cho người mới trên Developer Platform',
        en: 'Three real use cases for beginners on the Developer Platform',
      },
      paragraphs: [
        {
          vi: 'Một: feature flags và cấu hình runtime đọc nhiều, ghi ít. Hai: preference không nhạy cảm hoặc cache kết quả API đã xử lý với TTL phù hợp. Ba: metadata cho nội dung — mapping slug → bài viết hoặc redirect. KV không cung cấp phép tăng bộ đếm nguyên tử và không phù hợp làm rate-limit counter chính xác hay session cần thu hồi ngay; cân nhắc Rate Limiting binding (giới hạn xấp xỉ, tính riêng theo từng location) hoặc Durable Objects khi cần giới hạn chặt hay cập nhật nguyên tử.',
          en: 'One: read-heavy, rarely updated feature flags and configuration. Two: non-sensitive preferences and cached API results with suitable TTLs. Three: content metadata such as slug mappings or redirects. KV has no atomic increment and is not suitable for precise rate-limit counters or sessions needing immediate revocation; consider the Rate Limiting binding (approximate, per Cloudflare location) or Durable Objects when you need a strict limit or atomic updates.',
        },
        {
          vi: 'KV gắn vào Worker qua binding — giống cách bạn đã học với R2 hay D1. Code gọi `env.MY_KV.get("key")` thay vì hard-code giá trị. Điều này giữ secret và cấu hình ra khỏi frontend, đồng thời cho phép nhiều Worker dùng chung một namespace KV khi cần.',
          en: 'KV attaches to a Worker via a binding — like R2 or D1. Code calls `env.MY_KV.get("key")` instead of hard-coding values. That keeps secrets and config out of the frontend and lets multiple Workers share one KV namespace when needed.',
        },
        {
          vi: 'Nếu bạn đang theo lộ trình Developer Platform trên hub này, hãy coi KV là “ngăn kéo nhỏ” bên cạnh “tủ lớn” R2 (file) và “bảng tính” D1 (SQL). Mỗi công cụ có chỗ riêng; chọn sai thường dẫn tới chậm, khó query, hoặc chi phí không cần thiết.',
          en: 'If you are on the Developer Platform track on this hub, treat KV as a “small drawer” next to R2’s “big cabinet” (files) and D1’s “spreadsheet” (SQL). Each tool has its place; picking wrong often means slow queries, awkward data models, or unnecessary cost.',
        },
      ],
    },
    {
      heading: {
        vi: 'KV vs D1 vs R2: chọn đúng từ đầu tránh đau đầu sau',
        en: 'KV vs D1 vs R2: choose right early to avoid pain later',
      },
      paragraphs: [
        {
          vi: 'D1 là SQL dựa trên SQLite, có primary database tại một khu vực; read replicas tùy chọn có thể phục vụ truy vấn đọc gần người dùng khi dùng Sessions API, còn thao tác ghi về primary. R2 lưu object như ảnh, PDF và backup. KV phù hợp đọc nhanh theo key, không có JOIN.',
          en: 'D1 is SQLite-based SQL with a primary database in one region; optional read replicas can serve nearby reads when using the Sessions API, while writes go to the primary. R2 stores objects such as images, PDFs, and backups. KV suits fast key lookups without JOINs.',
        },
        {
          vi: 'Một lỗi phổ biến: nhét toàn bộ “database” vào KV bằng JSON khổng lồ dưới một key. KV có tính eventual consistency: nơi khác có thể thấy dữ liệu cũ tới 60 giây hoặc lâu hơn, tùy cache TTL (mặc định 60 giây, tối thiểu 30 giây) và cả cache kết quả key chưa tồn tại. Với SQL quan hệ, cân nhắc D1; với state cần phối hợp và cập nhật nguyên tử, cân nhắc Durable Objects.',
          en: 'A common mistake: stuffing a database into one giant JSON value. KV is eventually consistent: other locations may observe stale values for up to 60 seconds or longer depending on cache TTL (default 60 seconds, minimum 30 seconds), including cached misses. Consider D1 for relational SQL, or Durable Objects for coordinated, atomic state updates.',
        },
        {
          vi: 'Ngược lại, đừng dùng D1 chỉ để lưu một flag boolean đọc hàng triệu lần mỗi ngày — KV sẽ rẻ và nhanh hơn cho pattern đó. Blog Cloudflare về kiến trúc fullstack thường minh họa KV, D1, R2, và Workers cùng nhau trong một ứng dụng — mỗi thứ một lớp, không thay thế hoàn toàn nhau.',
          en: 'Conversely, do not use D1 just to store one boolean flag read millions of times a day — KV is cheaper and faster for that pattern. Cloudflare Blog fullstack architecture posts often show KV, D1, R2, and Workers together in one app — each layer has a role; none fully replaces the others.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu an toàn: checklist tuần đầu với KV',
        en: 'A safe start: first-week KV checklist',
      },
      paragraphs: [
        {
          vi: 'Một: bắt đầu với một namespace và vài key có tên rõ ràng (`config:banner`, không phải `x1`). Hai: đặt TTL cho dữ liệu tạm (cache API, preference ngắn không cần thu hồi ngay). Ba: không lưu mật khẩu thô hay dữ liệu cực nhạy cảm mà không mã hóa — KV không thay thế vault chuyên dụng. Bốn: test hành vi “đọc sau khi ghi” trong staging; hiểu eventual consistency trước khi production.',
          en: 'One: start with one namespace and a few clearly named keys (`config:banner`, not `x1`). Two: set TTL on temporary data (API cache, or short-lived preferences that do not need immediate revocation). Three: do not store raw passwords or highly sensitive data without encryption — KV is not a dedicated vault. Four: test read-after-write behavior in staging; understand eventual consistency before production.',
        },
        {
          vi: 'Đọc trang sản phẩm KV và lộ trình Developer Platform trên hub; mở bài gốc trên blog.cloudflare.com khi bạn cần giới hạn kích thước value hoặc chiến lược list keys. Nếu bạn đã đọc bài Workers và D1 trong chuỗi blog này, hãy thử project nhỏ: Worker đọc flag từ KV và đổi response HTML — bạn sẽ “cảm” được edge storage trong vài phút.',
          en: 'Read the KV product page and Developer Platform track on this hub; open original posts on blog.cloudflare.com when you need value size limits or list-key strategies. If you have read the Workers and D1 posts in this blog series, try a tiny project: a Worker reads a flag from KV and changes the HTML response — you will feel edge storage in minutes.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu hai người ghi cùng key trong 1 giây, tôi chấp nhận kết quả nào?” Nếu câu trả lời là “phải biết chính xác ngay”, KV có thể không phải công cụ đúng cho key đó — cân nhắc D1 hoặc Durable Objects.',
          en: 'Self-check: “If two people write the same key within one second, which result must win?” If the answer is “I must know exactly, immediately,” KV may not be the right tool for that key — consider D1 or Durable Objects.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'KV có thay thế database SQL không?',
        en: 'Can KV replace a SQL database?',
      },
      answer: {
        vi: 'Không cho hầu hết app có bảng và truy vấn phức tạp. KV phù hợp key-value đơn giản, đọc nhiều. Dùng D1 hoặc database bên ngoài khi cần SQL, quan hệ, và nhất quán mạnh hơn.',
        en: 'Not for most apps with tables and complex queries. KV fits simple, read-heavy key-value patterns. Use D1 or an external database when you need SQL, relations, and stronger consistency.',
      },
    },
    {
      question: {
        vi: 'Ghi KV có hiện lập tức trên mọi edge không?',
        en: 'Are KV writes instantly visible on every edge?',
      },
      answer: {
        vi: 'KV sử dụng eventual consistency: sau khi ghi, các khu vực khác có thể tiếp tục thấy giá trị cũ tới 60 giây hoặc hơn tùy cache TTL (mặc định 60 giây, tối thiểu 30 giây). Phù hợp cấu hình và cache đọc nhiều; không dùng cho số dư hay bộ đếm cần chính xác, đồng bộ tức thời.',
        en: 'KV is eventually consistent: after a write, other regions can continue seeing stale values for up to 60 seconds or longer depending on cache TTL (default 60 seconds, minimum 30 seconds). It suits read-heavy configuration and caches, not exact balances or counters requiring immediate consistency.',
      },
    },
    {
      question: {
        vi: 'Nên học KV trước hay D1 trước?',
        en: 'Should I learn KV or D1 first?',
      },
      answer: {
        vi: 'Nếu app chỉ cần flag/cấu hình, bắt đầu KV. Nếu cần form đăng ký, bảng dữ liệu, hoặc SQL, học D1 trước. Nhiều project production dùng cả hai.',
        en: 'If your app only needs flags/config, start with KV. If you need signups, tabular data, or SQL, learn D1 first. Many production projects use both.',
      },
    },
  ],
  sources: [
    { title: 'Cloudflare official docs (verified 2026-11-22)', href: 'https://developers.cloudflare.com/kv/concepts/how-kv-works/' },
    {
      title: 'Cloudflare Workers KV (Cloudflare Docs)',
      href: 'https://developers.cloudflare.com/kv/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['kv', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/kv/', label: { vi: 'KV là gì? (trang sản phẩm)', en: 'What is KV? (product page)' } },
    { href: '/products/workers/', label: { vi: 'Workers là gì? (trang sản phẩm)', en: 'What are Workers? (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: ứng dụng serverless', en: 'Use case: build a serverless app' } },
    { href: '/products/d1/', label: { vi: 'So sánh với D1 (SQL edge)', en: 'Compare with D1 (edge SQL)' } },
  ],
  diagramSlugs: [
    'fullstack-application',
    'serverless-global-apis',
  ],
};
