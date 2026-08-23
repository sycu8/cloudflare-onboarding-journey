import type { BlogPost } from '../blog';

/** Entry · Developer Platform — rewritten from Cloudflare R2 / storage themes on blog.cloudflare.com */
export const postR2LuuFileKhongPhiEgressChoNguoiMoi: BlogPost = {
  slug: 'r2-luu-file-khong-phi-egress-cho-nguoi-moi',
  date: '2026-08-25',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'R2 là gì? Lưu file trên Cloudflare mà không “sợ” phí egress',
    en: 'What is R2? Object storage on Cloudflare without egress sticker shock',
  },
  description: {
    vi: 'Giải thích Cloudflare R2 cho người mới: lưu ảnh, backup, static assets; so với ổ đĩa hosting; và cách gắn Workers qua binding mà không lo phí tải xuống egress điên cuồng.',
    en: 'Explain Cloudflare R2 for beginners: images, backups, static assets; vs classic hosting disks; and wiring Workers via bindings without scary download egress fees.',
  },
  excerpt: {
    vi: 'R2 là kho object trên Cloudflare — giống S3 nhưng không tính phí egress khi phục vụ qua mạng Cloudflare. Hợp ảnh user, backup, và file tĩnh cho Workers/Pages.',
    en: 'R2 is Cloudflare object storage — S3-like but without egress fees when served through Cloudflare’s network. Great for user images, backups, and static files for Workers/Pages.',
  },
  keywords: {
    vi: 'Cloudflare R2 là gì, object storage, không phí egress, lưu file ảnh, Workers binding R2, học Developer Platform',
    en: 'what is Cloudflare R2, object storage, zero egress, image storage, Workers R2 binding, Developer Platform beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Object storage là gì — và vì sao không chỉ dùng ổ đĩa hosting?',
        en: 'What is object storage — and why not only a hosting disk?',
      },
      paragraphs: [
        {
          vi: 'Hosting truyền thống thường gắn ổ đĩa với một máy chủ: dung lượng có hạn, backup và scale khó khi traffic tăng. Object storage (như R2) lưu file dưới dạng object có key — ảnh.png, backup/2026-08.zip — trong bucket, truy cập qua API HTTP(S), scale độc lập với app server.',
          en: 'Traditional hosting ties disk space to one server: limited capacity, harder backup and scale when traffic grows. Object storage (like R2) stores files as keyed objects — image.png, backup/2026-08.zip — in a bucket, accessed via HTTP(S) APIs, scaling separately from your app server.',
        },
        {
          vi: 'R2 tương thích API kiểu S3: nhiều công cụ và SDK quen thuộc. Khác biệt nổi bật trên blog.cloudflare.com về storage: không tính phí egress (tải dữ liệu ra) khi phục vụ qua mạng Cloudflare — tránh “hóa đơn bất ngờ” khi ảnh viral.',
          en: 'R2 speaks S3-compatible APIs: familiar tools and SDKs. A standout difference in Cloudflare Blog storage posts: no egress fees when serving through Cloudflare’s network — avoiding “surprise bills” when an image goes viral.',
        },
        {
          vi: 'Use case điển hình: ảnh upload user, video ngắn, export backup database, static asset cho site, log archive. Không phù hợp thay database quan hệ — dùng D1 hoặc DB chuyên dụng cho dữ liệu có cấu trúc và query phức tạp.',
          en: 'Typical uses: user uploads, short video, database backup exports, site static assets, log archives. Not a replacement for relational databases — use D1 or a dedicated DB for structured data and complex queries.',
        },
      ],
      diagramSlug: 'storing-user-generated-content',
    },
    {
      heading: {
        vi: 'Egress là gì — và R2 giúp gì cho ví tiền?',
        en: 'What is egress — and how does R2 help your budget?',
      },
      paragraphs: [
        {
          vi: 'Egress là lưu lượng dữ liệu “ra khỏi” nhà cung cấp cloud khi user tải file. Một số nhà cung cấp object storage giá storage rẻ nhưng egress đắt — site càng nổi tiếng, bill càng leo. R2 được thiết kế với mô hình: trả cho storage và operation, không phạt egress qua Cloudflare.',
          en: 'Egress is data leaving a cloud provider when users download files. Some object stores price storage cheaply but egress expensively — the more popular the site, the higher the bill. R2 is designed around paying for storage and operations, not punishing egress through Cloudflare.',
        },
        {
          vi: 'Lưu ý thực tế: egress-free áp dụng khi bạn phục vụ qua Workers, CDN, hoặc các đường tích hợp Cloudflare — không phải “mọi cách tải từ Internet đều miễn phí mãi mãi”. Đọc pricing và docs trước khi thiết kế kiến trúc tải file trực tiếp từ R2 public bucket ra ngoài mạng CF.',
          en: 'Reality check: zero egress applies when you serve via Workers, CDN, or Cloudflare-integrated paths — not “every possible Internet download is free forever.” Read pricing and docs before designing direct public-bucket downloads outside the CF network.',
        },
        {
          vi: 'So với giữ ảnh trên cùng VPS chạy WordPress: R2 tách storage khỏi compute — VPS restart không làm mất file; scale CDN/Worker không cần copy ảnh sang máy mới. Phù hợp lộ trình Developer Platform trên hub.',
          en: 'Vs keeping images on the same VPS running WordPress: R2 separates storage from compute — VPS restarts do not wipe files; scaling CDN/Workers does not require copying images to new machines. Fits the Developer Platform track on this hub.',
        },
      ],
      diagramSlug: 'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
    },
    {
      heading: {
        vi: 'Gắn R2 với Workers — binding thay vì hard-code key',
        en: 'Attach R2 to Workers — bindings instead of hard-coded keys',
      },
      paragraphs: [
        {
          vi: 'Trong wrangler.toml hoặc dashboard, bạn khai báo binding R2 (ví dụ MY_BUCKET) gắn với bucket. Worker gọi env.MY_BUCKET.put(key, file) hoặc .get(key) — credential do platform inject, không nằm trong source frontend.',
          en: 'In wrangler.toml or the dashboard, declare an R2 binding (e.g. MY_BUCKET) tied to a bucket. The Worker calls env.MY_BUCKET.put(key, file) or .get(key) — credentials are injected by the platform, not in frontend source.',
        },
        {
          vi: 'Pattern upload an toàn: browser gửi file tới Worker (hoặc presigned URL ngắn hạn do Worker cấp) → Worker validate loại file/kích thước → put R2 → trả URL public hoặc signed. Không expose secret S3 key trong JavaScript client.',
          en: 'Safer upload pattern: browser sends file to Worker (or a short-lived presigned URL from Worker) → Worker validates type/size → put to R2 → return public or signed URL. Never expose S3 secrets in client JavaScript.',
        },
        {
          vi: 'Kết hợp Image Resizing hoặc CDN: lưu bản gốc trên R2, phục vụ biến thể resize qua Cloudflare — giảm bandwidth và tăng tốc mobile. Bài CDN trên hub giải thích cache; R2 giải thích “file gốc nằm ở đâu”.',
          en: 'Combine Image Resizing or CDN: store originals on R2, serve resized variants through Cloudflare — less bandwidth, faster mobile. The CDN post on this hub explains cache; R2 explains “where the original file lives.”',
        },
        {
          vi: 'Pages có thể đọc static từ build output; R2 cho nội dung động user tạo. Nhiều app full-stack: Pages UI + Worker API + R2 storage — xem diagram fullstack trên hub.',
          en: 'Pages can serve static build output; R2 holds dynamic user-generated content. Many full-stack apps: Pages UI + Worker API + R2 storage — see the fullstack diagram on this hub.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu tuần đầu — và lỗi thường gặp',
        en: 'Your first week — and common mistakes',
      },
      paragraphs: [
        {
          vi: 'Tuần 1: tạo bucket test; upload vài file qua dashboard hoặc wrangler; viết Worker GET trả một object; thử public access vs private + signed URL. Đọc docs lifecycle nếu cần xóa log cũ tự động.',
          en: 'Week 1: create a test bucket; upload files via dashboard or wrangler; write a GET Worker returning one object; try public access vs private plus signed URLs. Read lifecycle docs if you need automatic old-log deletion.',
        },
        {
          vi: 'Lỗi phổ biến: bucket public toàn bộ — lộ file nhạy cảm; không giới hạn kích thước upload — bị spam; quên CORS khi frontend gọi trực tiếp; nhầm R2 thay SQL. Sao lưu: R2 không thay chiến lược backup ứng dụng — vẫn cần versioning hoặc export định kỳ.',
          en: 'Common mistakes: fully public buckets leaking sensitive files; no upload size limits — spam abuse; missing CORS for direct frontend calls; treating R2 as SQL. Backups: R2 does not replace app backup strategy — still version or export on a schedule.',
        },
        {
          vi: 'Tiếp theo: bài Pages vs Workers, Developer Platform overview, use case build serverless app. Một demo upload avatar nhỏ học R2 nhanh hơn đọc mười trang pricing.',
          en: 'Next: Pages vs Workers post, Developer Platform overview, build-serverless-app use case. A tiny avatar-upload demo teaches R2 faster than ten pages of pricing.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'R2 có thay hosting WordPress không?',
        en: 'Can R2 replace WordPress hosting?',
      },
      answer: {
        vi: 'Không trực tiếp. WordPress cần PHP và database trên server. R2 phù hợp lưu media, backup, hoặc static asset — kết hợp với hosting/Worker xử lý logic.',
        en: 'Not directly. WordPress needs PHP and a database on a server. R2 fits media, backups, or static assets — combined with hosting or Workers for logic.',
      },
    },
    {
      question: {
        vi: 'File trên R2 có tự cache CDN không?',
        en: 'Are R2 files automatically CDN-cached?',
      },
      answer: {
        vi: 'Khi bạn phục vụ qua Worker hoặc custom domain gắn Cloudflare với cache rule phù hợp, có thể cache edge. Bucket private + signed URL thì cache phức tạp hơn — thiết kế cố ý.',
        en: 'When served through a Worker or a Cloudflare custom domain with sensible cache rules, edge cache is possible. Private buckets plus signed URLs make caching trickier — design intentionally.',
      },
    },
    {
      question: {
        vi: 'R2 và S3 khác nhau chính ở đâu cho người mới?',
        en: 'What is the main R2 vs S3 difference for beginners?',
      },
      answer: {
        vi: 'API tương thích S3 nhưng R2 nằm trong ecosystem Cloudflare (bindings, zero egress qua CF). Nếu bạn đã dùng Workers/Pages, R2 thường ít ma sát hơn mang thêm một nhà cung cấp riêng.',
        en: 'S3-compatible API but R2 lives in Cloudflare’s ecosystem (bindings, zero egress via CF). If you already use Workers/Pages, R2 usually adds less friction than another separate vendor.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — R2 topics',
      href: 'https://blog.cloudflare.com/tag/r2/',
    },
    {
      title: 'The Cloudflare Blog — Storage topics',
      href: 'https://blog.cloudflare.com/tag/storage/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['r2', 'workers'],
  relatedPostSlugs: [
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'pages-vs-workers-khi-nao-dung-gi',
  ],
  hubLinks: [
    { href: '/products/workers/', label: { vi: 'Workers (trang sản phẩm)', en: 'Workers (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: app serverless', en: 'Use case: build serverless app' } },
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: [
    'storing-user-generated-content',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
};
