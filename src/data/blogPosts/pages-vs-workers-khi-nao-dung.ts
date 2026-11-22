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
    vi: 'Workers Static Assets được Cloudflare khuyến nghị cho dự án mới, kể cả site tĩnh; Pages vẫn được hỗ trợ. Một ứng dụng có thể dùng Workers cho cả frontend và API, hoặc kết hợp Pages với Worker API.',
    en: 'Cloudflare recommends Workers Static Assets for new projects, including static sites; Pages remains supported. Apps can serve both frontend and APIs from Workers, or combine Pages with a Worker API.',
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
          vi: 'Với dự án mới, Cloudflare khuyến nghị Workers Static Assets cho site tĩnh, SPA và ứng dụng full-stack: không cần Worker script nếu chỉ phục vụ file tĩnh. Pages vẫn được hỗ trợ và phù hợp với các dự án Pages hiện có; API, webhook hay middleware có thể đặt trên Workers hoặc Pages Functions.',
          en: 'For new projects, Cloudflare recommends Workers Static Assets for static sites, SPAs, and full-stack apps: a purely static site needs no Worker script. Pages remains supported and can still suit existing Pages projects; APIs, webhooks, and middleware can use Workers or Pages Functions.',
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
          vi: 'Mô hình 1 — Workers Static Assets cho frontend, kèm Worker xử lý API và bindings trong một ứng dụng. Mô hình 2 — Pages hiện có + Worker API riêng. Mô hình 3 — Monorepo deploy nhiều dịch vụ độc lập nếu thực sự cần tách vòng đời.',
          en: 'Pattern 1 — Workers Static Assets for the frontend, with a Worker for APIs and bindings in one app. Pattern 2 — an existing Pages frontend plus a separate Worker API. Pattern 3 — a monorepo with independent services when separate release lifecycles are needed.',
        },
        {
          vi: 'Với dự án mới, Cloudflare khuyến nghị Workers Static Assets — kể cả landing tĩnh; không cần Worker script nếu chỉ phục vụ file. Pages vẫn được hỗ trợ cho các dự án Pages hiện có. Có thể thêm API và bindings trong cùng một ứng dụng Workers khi cần.',
          en: 'For new projects, Cloudflare recommends Workers Static Assets — including static landing pages; a purely static site needs no Worker script. Pages remains supported for existing Pages projects. You can add APIs and bindings in the same Workers app when needed.',
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
        vi: 'Với dự án mới, dùng Workers Static Assets: site tĩnh thuần không cần Worker script. Pages vẫn được hỗ trợ nếu bạn đã có dự án Pages. Chỉ cần thêm logic Worker khi có form, xác thực hoặc API động.',
        en: 'For a new project, use Workers Static Assets: a purely static site needs no Worker script. Pages remains supported if you already have a Pages project. Add Worker logic only when you need a form backend, auth, or dynamic APIs.',
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
    { title: 'Cloudflare official docs (verified 2026-11-22)', href: 'https://developers.cloudflare.com/workers/best-practices/workers-best-practices/' },
    {
      title: 'The Cloudflare Blog — Pages topics',
      href: 'https://blog.cloudflare.com/tag/cloudflare-pages/',
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
