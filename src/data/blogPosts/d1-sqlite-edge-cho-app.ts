import type { BlogPost } from '../blog';

/** Entry · Workers — rewritten from Cloudflare D1 / edge SQL blog themes */
export const postD1SqliteEdgeChoAppNho: BlogPost = {
  slug: 'd1-sqlite-edge-cho-app-nho',
  date: '2026-08-31',
  topic: 'workers',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'D1 là gì? Database SQL nhẹ cho app nhỏ trên Workers',
    en: 'What is D1? Lightweight SQL for small apps on Workers',
  },
  description: {
    vi: 'Giải thích Cloudflare D1 cho người mới: khi nào cần SQL thay vì KV, ví dụ đăng ký workshop và bình luận, và cách migrations hoạt động với Wrangler.',
    en: 'A beginner guide to Cloudflare D1: when SQL beats KV, workshop signup and comments examples, and how migrations work with Wrangler.',
  },
  excerpt: {
    vi: 'D1 là SQLite trên edge — phù hợp bảng quan hệ nhỏ (signup, quiz, metadata) gắn với Workers. Không thay Postgres lớn, nhưng rất tiện cho side project và MVP.',
    en: 'D1 is SQLite at the edge — great for small relational tables (signups, quizzes, metadata) tied to Workers. It does not replace a large Postgres, but it is ideal for side projects and MVPs.',
  },
  keywords: {
    vi: 'Cloudflare D1 là gì, SQLite edge, database Workers, học D1 cơ bản, SQL serverless',
    en: 'what is Cloudflare D1, edge SQLite, Workers database, learn D1 basics, serverless SQL',
  },
  sections: [
    {
      heading: {
        vi: 'Khi nào app cần SQL thay vì chỉ KV hoặc R2?',
        en: 'When does an app need SQL instead of only KV or R2?',
      },
      paragraphs: [
        {
          vi: 'Workers KV giống tủ khóa–giá trị: đọc nhanh theo key, không có JOIN hay query phức tạp. R2 lưu file (ảnh, PDF, backup). Nhưng nhiều tính năng cần bảng quan hệ: “mỗi user có nhiều đăng ký workshop”, “đếm số người theo sự kiện”, “lọc bình luận theo ngày”. Đó là lúc SQL hợp lý.',
          en: 'Workers KV is like a key–value locker: fast reads by key, no JOINs or complex queries. R2 stores files (images, PDFs, backups). Many features need relational tables: “each user has many workshop signups,” “count attendees per event,” “filter comments by date.” That is when SQL makes sense.',
        },
        {
          vi: 'D1 là dịch vụ SQL của Cloudflare, dựa trên SQLite, gắn với Workers qua binding. Các bài trên blog.cloudflare.com về D1 thường nhấn mạnh: bạn viết SQL quen thuộc, chạy gần logic ứng dụng trên edge — không phải tự dựng cluster database chỉ để lưu vài nghìn dòng.',
          en: 'D1 is Cloudflare’s SQL service, built on SQLite, bound to Workers. D1 posts on blog.cloudflare.com often stress: you write familiar SQL, run it near app logic at the edge — without building a database cluster for a few thousand rows.',
        },
        {
          vi: 'Ví dụ trên hub này: form đăng ký workshop ghi vào bảng `signups` với `event_id`, `email`, `created_at`. Admin xem danh sách theo sự kiện — một câu `SELECT` đơn giản. KV vẫn hữu ích cho feature flag hoặc cache, nhưng không thay thế query quan hệ.',
          en: 'Example on this hub: a workshop signup form writes to a `signups` table with `event_id`, `email`, `created_at`. An admin lists rows per event — a simple `SELECT`. KV still helps for feature flags or cache, but it does not replace relational queries.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
    {
      heading: {
        vi: 'D1 hoạt động cùng Workers như thế nào?',
        en: 'How does D1 work alongside Workers?',
      },
      paragraphs: [
        {
          vi: 'Bạn tạo database D1 trong dashboard hoặc bằng `wrangler d1 create`. Trong `wrangler.toml`, khai báo binding — ví dụ `DB` — rồi trong Worker gọi `env.DB.prepare("SELECT ...").bind(...).all()`. Request người dùng chạy code Worker; Worker đọc/ghi D1 trong cùng luồng xử lý.',
          en: 'Create a D1 database in the dashboard or with `wrangler d1 create`. Declare a binding in `wrangler.toml` — e.g. `DB` — then in the Worker call `env.DB.prepare("SELECT ...").bind(...).all()`. User requests run Worker code; the Worker reads and writes D1 in the same request path.',
        },
        {
          vi: 'Schema thay đổi qua migrations: file SQL trong thư mục `migrations/`, áp dụng local bằng `wrangler d1 migrations apply <name> --local` và production khi deploy. Điều này giống workflow Rails hoặc Django — chỉ nhẹ hơn vì database nhỏ và gắn edge.',
          en: 'Schema changes go through migrations: SQL files under `migrations/`, applied locally with `wrangler d1 migrations apply <name> --local` and to production on deploy. This feels like Rails or Django workflows — lighter because the database is small and edge-attached.',
        },
        {
          vi: 'Local dev: `wrangler dev` có thể dùng D1 local với dữ liệu giả. Trên hub, nếu `/api/workshop-events` trả `dbReady: false`, thường là chưa chạy migrations local — không phải lỗi “SQL khó”.',
          en: 'Local dev: `wrangler dev` can use local D1 with sample data. On this hub, if `/api/workshop-events` returns `dbReady: false`, you often have not run local migrations — not “SQL is hard.”',
        },
      ],
    },
    {
      heading: {
        vi: 'Ba pattern phổ biến cho app nhỏ',
        en: 'Three common patterns for small apps',
      },
      paragraphs: [
        {
          vi: 'Một — đăng ký sự kiện hoặc waitlist: bảng `signups` với unique constraint trên email + event để tránh trùng. Hai — kết quả quiz hoặc khảo sát: lưu `answers` JSON hoặc cột chuẩn hóa, aggregate bằng SQL. Ba — metadata nội dung: bài blog draft, tag, trạng thái publish — khi bạn không muốn rebuild static site mỗi lần sửa một trường.',
          en: 'One — event signup or waitlist: a `signups` table with a unique constraint on email + event to prevent duplicates. Two — quiz or survey results: store `answers` as JSON or normalized columns, aggregate with SQL. Three — content metadata: draft posts, tags, publish state — when you do not want to rebuild a static site for every field edit.',
        },
        {
          vi: 'D1 không phải lựa chọn cho analytics hàng tỷ dòng hoặc workload ghi cực nặng đồng thời. Blog và docs Cloudflare thường gợi ý: bắt đầu D1 cho MVP, khi scale hoặc cần Postgres đầy đủ thì đồng bộ hoặc chuyển dần — nhưng nhiều side project không bao giờ cần bước đó.',
          en: 'D1 is not for billion-row analytics or extreme concurrent write loads. Cloudflare blog and docs often suggest: start with D1 for an MVP, sync or migrate when you need full Postgres at scale — though many side projects never need that step.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu an toàn: migrations, backup và secrets',
        en: 'Start safely: migrations, backups, and secrets',
      },
      paragraphs: [
        {
          vi: 'Luôn version schema bằng migrations — không sửa bảng production tay trong dashboard rồi quên. Test query trên dataset nhỏ local trước. Với email hoặc PII, cân nhắc mã hóa cột nhạy cảm và retention policy; D1 không tự thay bạn tuân thủ GDPR hay luật địa phương.',
          en: 'Always version schema with migrations — do not hand-edit production tables in the dashboard and forget. Test queries on a small local dataset first. For email or PII, consider encrypting sensitive columns and retention policies; D1 does not automatically make you GDPR or local-law compliant.',
        },
        {
          vi: 'Đọc trang sản phẩm D1 và lộ trình Developer Platform trên hub, rồi mở bài gốc trên blog.cloudflare.com khi cần chi tiết replication hoặc pricing mới. Câu hỏi tự kiểm tra: “Query này có cần JOIN hoặc aggregate không?” Nếu có, D1 hoặc SQL bên ngoài hợp lý hơn KV.',
          en: 'Read the D1 product page and Developer Platform track on this hub, then open original blog.cloudflare.com posts for replication or pricing updates. Self-check: “Does this query need JOINs or aggregates?” If yes, D1 or external SQL fits better than KV.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'D1 khác Workers KV chỗ nào?',
        en: 'How is D1 different from Workers KV?',
      },
      answer: {
        vi: 'KV tối ưu đọc key đơn, eventual consistency, không có SQL. D1 là SQLite quan hệ: SELECT/WHERE/JOIN, phù hợp dữ liệu có cấu trúc và query linh hoạt hơn.',
        en: 'KV optimizes single-key reads, is eventually consistent, and has no SQL. D1 is relational SQLite: SELECT/WHERE/JOIN, suited to structured data and flexible queries.',
      },
    },
    {
      question: {
        vi: 'D1 có thay thế PostgreSQL production lớn không?',
        en: 'Can D1 replace a large production PostgreSQL?',
      },
      answer: {
        vi: 'Thường không cho workload enterprise nặng. D1 phù hợp app edge nhỏ và vừa. Khi cần Postgres đầy đủ, nhiều team dùng Hyperdrive hoặc DB bên ngoài kết hợp Workers.',
        en: 'Usually not for heavy enterprise workloads. D1 fits small and mid edge apps. When you need full Postgres, many teams use Hyperdrive or an external DB with Workers.',
      },
    },
    {
      question: {
        vi: 'Làm sao deploy schema D1 lên production?',
        en: 'How do you deploy D1 schema to production?',
      },
      answer: {
        vi: 'Commit file migration SQL, chạy `wrangler d1 migrations apply <database> --remote` (hoặc trong CI). Binding trong `wrangler.toml` phải trùng tên Worker production.',
        en: 'Commit migration SQL files, run `wrangler d1 migrations apply <database> --remote` (or in CI). The binding name in `wrangler.toml` must match production Workers.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — D1 topics',
      href: 'https://blog.cloudflare.com/tag/d1/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['d1', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/d1/', label: { vi: 'D1 là gì? (trang sản phẩm)', en: 'What is D1? (product page)' } },
    { href: '/products/workers/', label: { vi: 'Workers — nơi chạy logic SQL', en: 'Workers — where SQL logic runs' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: app serverless', en: 'Use case: build a serverless app' } },
    { href: '/roadmaps/developer/', label: { vi: 'Roadmap Developer', en: 'Developer roadmap' } },
  ],
  diagramSlugs: ['fullstack-application', 'serverless-global-apis'],
};
