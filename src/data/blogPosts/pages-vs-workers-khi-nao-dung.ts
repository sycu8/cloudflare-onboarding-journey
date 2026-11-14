import type { BlogPost } from '../blog';

/** Entry · Workers — rewritten from Cloudflare Pages / Workers themes on blog.cloudflare.com */
export const postPagesVsWorkersKhiNaoDungGi: BlogPost = {
  slug: 'pages-vs-workers-khi-nao-dung-gi',
  date: '2026-08-21',
  topic: 'workers',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Pages và Workers: khi nào dùng cái nào?',
    en: 'Pages vs Workers: when to use which?',
  },
  description: {
    vi: 'So sánh Cloudflare Pages và Workers cho người mới: site tĩnh/frontend vs API và logic edge, và vì sao nhiều dự án thực tế dùng cả hai.',
    en: 'Compare Cloudflare Pages and Workers for beginners: static/frontend sites vs edge APIs and logic, and why many real projects use both.',
  },
  excerpt: {
    vi: 'Pages thuận tiện deploy site tĩnh và frontend; Workers chạy code xử lý request tùy ý. Nhiều app hiện đại: Pages làm “mặt tiền”, Workers làm API và logic phía sau.',
    en: 'Pages is great for static sites and frontends; Workers runs custom request-handling code. Many modern apps: Pages as the storefront, Workers as APIs and backend logic.',
  },
  keywords: {
    vi: 'Cloudflare Pages, Cloudflare Workers, Pages vs Workers, deploy static site, serverless edge, học Developer Platform',
    en: 'Cloudflare Pages, Cloudflare Workers, Pages vs Workers, deploy static site, serverless edge, Developer Platform beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Hai công cụ, một nền tảng — bắt đầu từ câu hỏi “bạn đang ship gì?”',
        en: 'Two tools, one platform — start with “what are you shipping?”',
      },
      paragraphs: [
        {
          vi: 'Cloudflare Pages và Workers đều thuộc Developer Platform: bạn deploy lên mạng edge toàn cầu mà không tự quản lý máy chủ vật lý. Khác biệt nằm ở mô hình mental: Pages tối ưu cho file tĩnh và build frontend (HTML, CSS, JS, framework như Astro/React/Vue); Workers tối ưu cho đoạn code chạy mỗi khi có HTTP request — redirect, API, xác thực, ghép dữ liệu.',
          en: 'Cloudflare Pages and Workers both live on the Developer Platform: you deploy to a global edge network without running physical servers. The mental model differs: Pages optimizes for static files and frontend builds (HTML, CSS, JS, frameworks like Astro/React/Vue); Workers optimizes for code that runs on each HTTP request — redirects, APIs, auth, data glue.',
        },
        {
          vi: 'Câu hỏi đầu tiên: “Người dùng chủ yếu tải trang đã build sẵn, hay mỗi request cần logic riêng?” Nếu là portfolio, blog, landing marketing — Pages thường đủ và rất nhanh để bắt đầu. Nếu là API JSON, webhook, hoặc middleware phức tạp — Workers (hoặc Pages Functions) phù hợp hơn.',
          en: 'First question: “Do users mostly load prebuilt pages, or does each request need custom logic?” For a portfolio, blog, or marketing landing — Pages is often enough and very fast to start. For JSON APIs, webhooks, or complex middleware — Workers (or Pages Functions) fits better.',
        },
        {
          vi: 'Blog.cloudflare.com thường mô tả Pages và Workers như hai cánh của cùng một nhà: nhiều tutorial full-stack kết hợp Pages deploy frontend + Worker xử lý form/API. Bạn không bắt buộc chọn một và loại bỏ hẳn cái kia.',
          en: 'The Cloudflare Blog often describes Pages and Workers as two wings of the same house: many full-stack tutorials combine Pages for the frontend plus a Worker for forms/APIs. You are not forced to pick one and banish the other.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
    {
      heading: {
        vi: 'Cloudflare Pages phù hợp khi nào?',
        en: 'When is Cloudflare Pages the right fit?',
      },
      paragraphs: [
        {
          vi: 'Pages shine với site tĩnh hoặc JAMstack: build trên CI (Git push), Cloudflare phục vụ file từ edge, HTTPS và preview branch có sẵn. Hub này chính là ví dụ Astro build ra static + Functions — pattern quen thuộc với Pages.',
          en: 'Pages shines for static or JAMstack sites: build in CI (git push), Cloudflare serves files from the edge with HTTPS and preview branches built in. This hub itself is an Astro static build plus Functions — a familiar Pages pattern.',
        },
        {
          vi: 'Bạn có ít hoặc không có server “luôn bật”. Mỗi deploy là một phiên bản file. Thay đổi nội dung = build lại và publish — không SSH vào máy. Phù hợp team nhỏ, tài liệu, marketing, và prototype UI nhanh.',
          en: 'You have little or no always-on server. Each deploy is a version of files. Content changes mean rebuild and publish — no SSH into a box. Great for small teams, docs, marketing, and fast UI prototypes.',
        },
        {
          vi: 'Pages cũng hỗ trợ Functions (serverless handlers gắn với project Pages) cho API nhẹ — nhưng khi logic phình to, nhiều route, hoặc cần bindings phức tạp, team thường tách Worker riêng hoặc dùng Workers làm backend chính.',
          en: 'Pages also supports Functions (serverless handlers attached to a Pages project) for light APIs — but when logic grows, routes multiply, or bindings get complex, teams often split a dedicated Worker or use Workers as the main backend.',
        },
      ],
    },
    {
      heading: {
        vi: 'Cloudflare Workers phù hợp khi nào?',
        en: 'When is Cloudflare Workers the right fit?',
      },
      paragraphs: [
        {
          vi: 'Workers là “hàm của bạn chạy tại edge” cho mọi request khớp route. Use case điển hình: API REST nhỏ, xác thực token, rewrite URL, A/B test header, proxy an toàn tới dịch vụ nội bộ, xử lý webhook từ Stripe/GitHub.',
          en: 'Workers are “your function runs at the edge” for every matching request. Typical uses: small REST APIs, token auth, URL rewrites, header-based A/B tests, safe proxies to internal services, webhooks from Stripe/GitHub.',
        },
        {
          vi: 'Workers nối với R2, D1, KV, Durable Objects, Workers AI qua bindings — không cần hard-code secret trong trình duyệt. Đây là lý do nhiều ứng dụng “không server” thật sự đặt logic nhạy cảm trên Worker, còn Pages chỉ phục vụ UI.',
          en: 'Workers connect to R2, D1, KV, Durable Objects, and Workers AI via bindings — without hard-coding secrets in the browser. That is why many “serverless” apps put sensitive logic on a Worker while Pages serves only the UI.',
        },
        {
          vi: 'Nếu bạn đã đọc bài Workers giới thiệu trên hub, hãy coi Workers là động cơ; Pages là showroom. Động cơ có thể chạy một mình (API-only), showroom có thể đứng một mình (site tĩnh thuần) — kết hợp khi cần cả hai.',
          en: 'If you read the Workers intro on this hub, treat Workers as the engine and Pages as the showroom. The engine can run alone (API-only); the showroom can stand alone (pure static) — combine when you need both.',
        },
        {
          vi: 'Chi phí và giới hạn: cả hai đều có free tier hào phóng cho học tập; production cần đọc pricing và giới hạn CPU/time per request của Workers. Đừng chạy job nặng giờ trên Worker — dùng queue hoặc dịch vụ phù hợp.',
          en: 'Cost and limits: both have generous free tiers for learning; production needs pricing docs and Workers CPU/time limits. Do not run hour-long jobs on a Worker — use queues or a fitting service instead.',
        },
      ],
    },
    {
      heading: {
        vi: 'Mô hình kết hợp thực tế — và lộ trình học tiếp',
        en: 'Real-world combos — and what to learn next',
      },
      paragraphs: [
        {
          vi: 'Mô hình 1 — Pages + Worker API: UI trên Pages, fetch tới worker.example.com/api. Mô hình 2 — Monorepo: frontend Pages, folder worker riêng deploy song song. Mô hình 3 — Chỉ Workers phục vụ HTML từ R2 hoặc template — ít phổ biến với người mới nhưng hợp lệ.',
          en: 'Pattern 1 — Pages + Worker API: UI on Pages, fetch worker.example.com/api. Pattern 2 — Monorepo: frontend on Pages, separate worker folder deployed alongside. Pattern 3 — Workers-only serving HTML from R2 or templates — less common for beginners but valid.',
        },
        {
          vi: 'Chọn Pages khi 80% công việc là nội dung và UI đã build. Chọn Workers khi 80% là logic request, tích hợp bên thứ ba, hoặc dữ liệu động. Phân vân? Bắt đầu Pages cho landing, thêm Worker khi form hoặc API xuất hiện — đúng với cách nhiều startup tiến hóa.',
          en: 'Choose Pages when 80% of the work is content and built UI. Choose Workers when 80% is request logic, third-party integration, or dynamic data. Unsure? Start with Pages for the landing page, add a Worker when forms or APIs appear — how many startups evolve.',
        },
        {
          vi: 'Tiếp theo trên hub: đọc Developer Platform overview, thử deploy static site use case, rồi bài Workers AI nếu bạn muốn thêm chatbot. Mỗi bước nhỏ, một repo demo — học edge tốt nhất bằng deploy thật.',
          en: 'Next on this hub: read the Developer Platform overview, try the deploy-static-site use case, then the Workers AI post if you want a chatbot. Small steps, one demo repo — you learn the edge best by deploying for real.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Pages Functions có thay hẳn Workers không?',
        en: 'Do Pages Functions fully replace Workers?',
      },
      answer: {
        vi: 'Không hẳn. Functions tiện cho API nhỏ gắn với project Pages. Workers độc lập linh hoạt hơn cho routing phức tạp, nhiều service, hoặc microservice riêng. Nhiều team dùng cả hai.',
        en: 'Not entirely. Functions are handy for small APIs tied to a Pages project. Standalone Workers are more flexible for complex routing, many services, or separate microservices. Many teams use both.',
      },
    },
    {
      question: {
        vi: 'Tôi chỉ có landing HTML — có cần Workers không?',
        en: 'I only have an HTML landing — do I need Workers?',
      },
      answer: {
        vi: 'Thường không. Pages (hoặc static hosting qua Pages) đủ. Chỉ thêm Worker khi bạn cần form backend, auth, hoặc API động.',
        en: 'Usually no. Pages (or static hosting via Pages) is enough. Add a Worker only when you need a form backend, auth, or dynamic APIs.',
      },
    },
    {
      question: {
        vi: 'Deploy Pages và Workers có chung domain không?',
        en: 'Can Pages and Workers share one domain?',
      },
      answer: {
        vi: 'Có. Ví dụ www trỏ Pages, api subdomain trỏ Worker. Hoặc Worker làm reverse proxy trước origin/Pages. Cấu hình DNS và route trong dashboard hoặc wrangler.',
        en: 'Yes. Example: www points to Pages, api subdomain to a Worker. Or a Worker reverse-proxies before origin/Pages. Configure DNS and routes in the dashboard or wrangler.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Pages topics',
      href: 'https://blog.cloudflare.com/tag/pages/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['pages', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'r2-luu-file-khong-phi-egress-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/workers/', label: { vi: 'Workers là gì? (trang sản phẩm)', en: 'What are Workers? (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/deploy-static-site/', label: { vi: 'Use case: deploy site tĩnh', en: 'Use case: deploy static site' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: app serverless', en: 'Use case: build serverless app' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: ['fullstack-application', 'serverless-global-apis'],
};
