import type { RoleId, RoleRoadmap, RoleRoadmapStep } from '../types/roadmap';

const CF_DOCS = 'https://developers.cloudflare.com';

const salesSteps: RoleRoadmapStep[] = [
  {
    id: 'sales-week-1',
    week: 1,
    titleVi: 'Nền tảng: Cloudflare là gì và giải quyết vấn đề gì?',
    titleEn: 'Foundation: What Cloudflare is and what problems it solves',
    objectiveVi:
      'Nắm mental model cơ bản để giải thích Cloudflare cho khách hàng không kỹ thuật — không chỉ là DNS.',
    topics: ['Connectivity Cloud', 'Edge vs Origin', 'Ba lộ trình sản phẩm', 'Giá trị kinh doanh'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/'],
    recommendedProducts: ['DNS', 'CDN', 'Workers'],
    exercisesVi: [
      'Vẽ sơ đồ User → Cloudflare → Origin và giải thích bằng lời của bạn trong 2 phút.',
      'Đọc Start Here và ghi 3 câu hỏi khách hàng thường hỏi bạn nhất — đối chiếu với hub.',
      'Liệt kê 2 lợi ích kinh doanh (tốc độ, bảo mật, chi phí) cho từng track.',
    ],
    expectedOutcomeVi:
      'Bạn tự tin mở đầu cuộc gọi bằng câu chuyện “lớp kết nối” thay vì liệt kê tính năng.',
    sourceUrls: [
      `${CF_DOCS}/fundamentals/`,
      `${CF_DOCS}/fundamentals/concepts/how-cloudflare-works/`,
      'https://www.cloudflare.com/learning-paths/',
    ],
  },
  {
    id: 'sales-week-2',
    week: 2,
    titleVi: 'Application Services: bán bảo vệ và tăng tốc website/API',
    titleEn: 'Application Services: selling protection and performance',
    objectiveVi:
      'Hiểu đủ sâu để map nhu cầu khách (website chậm, bị tấn công, API lộ) sang sản phẩm phù hợp.',
    topics: ['DNS & Proxy', 'CDN & Cache', 'WAF & DDoS', 'Use case bảo vệ website'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/application-services/',
      '/use-cases/protect-website/',
      '/products/',
      '/glossary/',
    ],
    recommendedProducts: ['DNS', 'CDN', 'WAF', 'DDoS Protection', 'Bot Management'],
    exercisesVi: [
      'Đọc 1 use case “bảo vệ website” và viết pitch 30 giây cho khách e-commerce.',
      'Tra glossary 5 thuật ngữ: proxy, cache, WAF, bot, rate limiting.',
      'So sánh 2 tình huống: chỉ cần CDN vs cần thêm WAF — ghi dấu hiệu phân biệt.',
    ],
    expectedOutcomeVi:
      'Bạn phân loại được lead “cần tốc độ” vs “cần bảo mật” và đề xuất bước tiếp theo hợp lý.',
    sourceUrls: [
      `${CF_DOCS}/learning-paths/application-security/`,
      `${CF_DOCS}/dns/`,
      `${CF_DOCS}/waf/`,
    ],
  },
  {
    id: 'sales-week-3',
    week: 3,
    titleVi: 'Developer Platform & Cloudflare One: mở rộng câu chuyện bán hàng',
    titleEn: 'Developer Platform & Cloudflare One: broadening the sales story',
    objectiveVi:
      'Nhận diện khi nào khách cần build mới (serverless) hoặc thay VPN / Zero Trust — không bỏ lỡ cơ hội.',
    topics: ['Workers & Pages', 'Zero Trust', 'ZTNA', 'Serverless use case', 'Thay VPN'],
    existingRoutes: [
      '/tracks/developer-platform/',
      '/tracks/cloudflare-one/',
      '/use-cases/developer-platform/',
      '/use-cases/cloudflare-one/',
      '/use-cases/build-serverless-app/',
      '/use-cases/replace-vpn/',
    ],
    recommendedProducts: ['Workers', 'Pages', 'Zero Trust', 'Access', 'Gateway'],
    exercisesVi: [
      'Đọc use case “build serverless app” — tóm tắt 3 lợi ích cho CTO startup.',
      'Đọc use case “thay VPN” — liệt kê 3 pain point VPN mà Cloudflare One giải quyết.',
      'Chọn 1 khách hàng giả định (startup / doanh nghiệp remote) và gợi ý track phù hợp.',
    ],
    expectedOutcomeVi:
      'Bạn qualifying được khách theo 3 track và không nhầm Workers với hosting truyền thống.',
    sourceUrls: [
      `${CF_DOCS}/workers/`,
      `${CF_DOCS}/pages/`,
      `${CF_DOCS}/cloudflare-one/`,
    ],
  },
  {
    id: 'sales-week-4',
    week: 4,
    titleVi: 'Gói dịch vụ, demo và chốt bước tiếp theo với khách',
    titleEn: 'Plans, demos, and advancing the customer conversation',
    objectiveVi:
      'Biết so sánh gói, dùng demo guide và resource hub để chuyển từ “tò mò” sang POC hoặc trial.',
    topics: ['So sánh gói Free/Pro/Business', 'Demo dashboard', 'Quiz readiness', 'Tài nguyên bán hàng'],
    existingRoutes: [
      '/plans/',
      '/demo-guides/',
      '/quiz/beginner-readiness/',
      '/resources/',
      '/checklists/beginner-cloudflare-checklist/',
    ],
    recommendedProducts: ['Plans & Billing', 'Analytics', 'Logpush'],
    exercisesVi: [
      'Đọc trang Plans và ghi khi nào nên đề xuất Pro vs Business cho SMB.',
      'Lướt Demo Guides — chọn 1 flow demo phù hợp khách tuần 2 của bạn.',
      'Làm quiz beginner readiness; ghi 2 điểm yếu cần ôn trước khi gặp SE.',
    ],
    expectedOutcomeVi:
      'Bạn có checklist trước/sau demo và biết khi nào mời Solution Engineer vào cuộc gọi.',
    sourceUrls: [
      `${CF_DOCS}/fundamentals/subscriptions-and-billing/`,
      'https://www.cloudflare.com/plans/',
      `${CF_DOCS}/fundamentals/api/`,
    ],
  },
];

const solutionEngineerSteps: RoleRoadmapStep[] = [
  {
    id: 'se-week-1',
    week: 1,
    titleVi: 'Kiến trúc Connectivity Cloud và phương pháp discovery',
    titleEn: 'Connectivity Cloud architecture and discovery methodology',
    objectiveVi:
      'Xây mental model end-to-end và học cách đặt câu hỏi discovery trước khi đề xuất sản phẩm.',
    topics: ['Edge network', 'Proxy flow', 'Ba track', 'Discovery questions', 'Reference architecture'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/', '/resources/'],
    recommendedProducts: ['DNS', 'CDN', 'Workers'],
    exercisesVi: [
      'Vẽ luồng request từ user tới origin qua Cloudflare — ghi điểm can thiệp (cache, WAF, Workers).',
      'Đọc 1 tài liệu Reference Architecture trên Resources và tóm tắt 5 thành phần.',
      'Soạn 10 câu hỏi discovery cho khách có website + API + nhân viên remote.',
    ],
    expectedOutcomeVi: 'Bạn mô tả được kiến trúc tổng thể mà không nhảy thẳng vào cấu hình chi tiết.',
    sourceUrls: [
      `${CF_DOCS}/reference-architecture/`,
      `${CF_DOCS}/fundamentals/concepts/how-cloudflare-works/`,
    ],
  },
  {
    id: 'se-week-2',
    week: 2,
    titleVi: 'Application Services: DNS, proxy, cache và routing',
    titleEn: 'Application Services: DNS, proxy, cache, and routing',
    objectiveVi:
      'Thiết kế và giải thích cấu hình DNS/proxy/cache cho website hoặc API production.',
    topics: ['DNS records', 'Orange cloud', 'Cache rules', 'SSL/TLS', 'Load balancing'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/protect-website/',
      '/use-cases/secure-api/',
      '/products/',
      '/glossary/',
    ],
    recommendedProducts: ['DNS', 'CDN', 'SSL/TLS', 'Load Balancing', 'Argo Smart Routing'],
    exercisesVi: [
      'Đọc track Application Services module 1–2 và map từng lesson với 1 quyết định thiết kế.',
      'Tra glossary: origin, edge, cache, TTL — viết 1 đoạn giải thích cho khách.',
      'Phác thảo cấu hình DNS cho domain có www + API subdomain (proxy on/off).',
    ],
    expectedOutcomeVi:
      'Bạn giải thích được khi nào bật proxy, rule cache nào hợp lý, và rủi ro DNS sai.',
    sourceUrls: [
      `${CF_DOCS}/dns/`,
      `${CF_DOCS}/cache/`,
      `${CF_DOCS}/ssl/`,
    ],
  },
  {
    id: 'se-week-3',
    week: 3,
    titleVi: 'Bảo mật ứng dụng: WAF, bot, DDoS và API',
    titleEn: 'Application security: WAF, bots, DDoS, and APIs',
    objectiveVi:
      'Đề xuất lớp bảo vệ phù hợp mức độ rủi ro — từ rule cơ bản đến chống DDoS và bot.',
    topics: ['WAF managed rules', 'Custom rules', 'Bot Management', 'DDoS', 'API Shield'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/defend-ddos-attacks/',
      '/use-cases/secure-api/',
      '/demo-guides/',
    ],
    recommendedProducts: ['WAF', 'DDoS Protection', 'Bot Management', 'API Shield', 'Rate Limiting'],
    exercisesVi: [
      'Đọc use case chống DDoS — liệt kê 3 metric chứng minh hiệu quả cho khách.',
      'Xem demo guide Application Security — ghi 5 màn hình cần show trong workshop.',
      'Viết đề xuất WAF: 3 rule ưu tiên cho e-commerce có form đăng nhập.',
    ],
    expectedOutcomeVi:
      'Bạn phân biệt được incident DDoS, bot scrape và lỗ hổng ứng dụng — đề xuất đúng lớp bảo vệ.',
    sourceUrls: [
      `${CF_DOCS}/waf/`,
      `${CF_DOCS}/ddos-protection/`,
      `${CF_DOCS}/bots/`,
    ],
  },
  {
    id: 'se-week-4',
    week: 4,
    titleVi: 'Developer Platform: Workers, storage và triển khai',
    titleEn: 'Developer Platform: Workers, storage, and deployment',
    objectiveVi:
      'Thiết kế giải pháp serverless hợp lý — khi nào Workers, Pages, KV, D1, R2.',
    topics: ['Workers runtime', 'Pages', 'KV', 'D1', 'R2', 'Durable Objects'],
    existingRoutes: [
      '/tracks/developer-platform/',
      '/use-cases/build-serverless-app/',
      '/use-cases/deploy-static-site/',
      '/products/',
    ],
    recommendedProducts: ['Workers', 'Pages', 'KV', 'D1', 'R2', 'Durable Objects'],
    exercisesVi: [
      'Đọc use case deploy static site — so sánh Pages vs hosting truyền thống (3 tiêu chí).',
      'Đọc use case build serverless — chọn storage (KV/D1/R2) cho 2 scenario khác nhau.',
      'Hoàn thành 2 lesson đầu track Developer Platform và ghi 3 pattern hay gặp.',
    ],
    expectedOutcomeVi:
      'Bạn vẽ được sơ đồ serverless đơn giản và giải thích trade-off chi phí / độ phức tạp.',
    sourceUrls: [
      `${CF_DOCS}/workers/`,
      `${CF_DOCS}/pages/`,
      `${CF_DOCS}/d1/`,
      `${CF_DOCS}/r2/`,
    ],
  },
  {
    id: 'se-week-5',
    week: 5,
    titleVi: 'Cloudflare One: Zero Trust, Access và thay VPN',
    titleEn: 'Cloudflare One: Zero Trust, Access, and replacing VPN',
    objectiveVi:
      'Thiết kế truy cập an toàn cho user remote, SaaS và tài nguyên nội bộ không cần VPN truyền thống.',
    topics: ['Zero Trust', 'Access policies', 'Gateway', 'Device posture', 'Private network'],
    existingRoutes: [
      '/tracks/cloudflare-one/',
      '/use-cases/replace-vpn/',
      '/use-cases/secure-remote-users/',
      '/use-cases/secure-saas-access/',
      '/demo-guides/',
    ],
    recommendedProducts: ['Zero Trust', 'Access', 'Gateway', 'Tunnel', 'WARP'],
    exercisesVi: [
      'Đọc use case thay VPN — vẽ before/after: VPN hub vs Zero Trust per-app.',
      'Xem demo guide Cloudflare One — soạn agenda demo 30 phút cho IT manager.',
      'Viết 3 policy Access mẫu: nhóm sales, engineering, contractor.',
    ],
    expectedOutcomeVi:
      'Bạn trình bày được lộ trình pilot Zero Trust 2 tuần cho doanh nghiệp 50–200 nhân sự.',
    sourceUrls: [
      `${CF_DOCS}/cloudflare-one/`,
      `${CF_DOCS}/cloudflare-one/policies/access/`,
      `${CF_DOCS}/cloudflare-one/connections/connect-apps/`,
    ],
  },
  {
    id: 'se-week-6',
    week: 6,
    titleVi: 'Tổng hợp giải pháp, POC và bàn giao cho khách hàng',
    titleEn: 'Solution synthesis, POC, and customer handoff',
    objectiveVi:
      'Ghép nhiều sản phẩm thành đề xuất thống nhất, chạy POC nhỏ và chuẩn bị tài liệu bàn giao.',
    topics: ['Solution design', 'POC scope', 'Plans & sizing', 'Checklist triển khai', 'Tài nguyên'],
    existingRoutes: [
      '/plans/',
      '/resources/',
      '/checklists/beginner-cloudflare-checklist/',
      '/quiz/beginner-readiness/',
      '/use-cases/',
    ],
    recommendedProducts: ['Analytics', 'Logpush', 'Workers', 'WAF', 'Zero Trust'],
    exercisesVi: [
      'Viết 1-page solution proposal: website + API + remote access cho khách giả định.',
      'Chọn gói Plans phù hợp và giải thích 3 lý do — không chỉ vì giá.',
      'Làm quiz beginner readiness; lập checklist 15 mục trước go-live.',
    ],
    expectedOutcomeVi:
      'Bạn có template đề xuất + POC + checklist có thể tái sử dụng cho khách hàng tiếp theo.',
    sourceUrls: [
      `${CF_DOCS}/learning-paths/`,
      `${CF_DOCS}/fundamentals/setup/`,
      'https://www.cloudflare.com/plans/',
    ],
  },
];

const developerSteps: RoleRoadmapStep[] = [
  {
    id: 'dev-week-1',
    week: 1,
    titleVi: 'Nền tảng mạng và mental model Developer Platform',
    titleEn: 'Networking basics and Developer Platform mental model',
    objectiveVi:
      'Hiểu request/response, edge vs origin — nền tảng trước khi viết Workers hoặc deploy Pages.',
    topics: ['HTTP basics', 'Edge computing', 'Workers runtime', 'Dev environment'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/', '/glossary/'],
    recommendedProducts: ['Workers', 'DNS', 'CDN'],
    exercisesVi: [
      'Đọc Cloudflare 101 phần Developer Platform — ghi 5 thuật ngữ mới vào sổ.',
      'Tra glossary: Worker, edge, origin, KV — giải thích bằng tiếng Việt đơn giản.',
      'Liệt kê 3 loại app bạn muốn build và match với Workers vs Pages.',
    ],
    expectedOutcomeVi: 'Bạn biết Workers chạy ở edge và khác gì so với server VPS truyền thống.',
    sourceUrls: [
      `${CF_DOCS}/workers/`,
      `${CF_DOCS}/workers/get-started/guide/`,
      `${CF_DOCS}/fundamentals/concepts/how-cloudflare-works/`,
    ],
  },
  {
    id: 'dev-week-2',
    week: 2,
    titleVi: 'Workers: routing, middleware và tích hợp API',
    titleEn: 'Workers: routing, middleware, and API integration',
    objectiveVi: 'Viết Worker xử lý request, proxy API và áp dụng pattern routing cơ bản.',
    topics: ['Fetch API', 'Routes', 'Environment variables', 'Error handling', 'Cron Triggers'],
    existingRoutes: [
      '/tracks/developer-platform/',
      '/use-cases/build-serverless-app/',
      '/use-cases/secure-api/',
      '/products/',
    ],
    recommendedProducts: ['Workers', 'Workers Routes', 'Workers AI'],
    exercisesVi: [
      'Hoàn thành 3 lesson đầu track Developer Platform về Workers.',
      'Đọc use case secure API — sketch Worker đứng trước origin và validate header.',
      'Viết pseudocode Worker: redirect, CORS, và cache header đơn giản.',
    ],
    expectedOutcomeVi: 'Bạn mô tả được luồng code Worker từ request tới response mà không cần nhìn dashboard.',
    sourceUrls: [
      `${CF_DOCS}/workers/runtime-apis/fetch/`,
      `${CF_DOCS}/workers/configuration/routing/`,
      `${CF_DOCS}/workers/examples/`,
    ],
  },
  {
    id: 'dev-week-3',
    week: 3,
    titleVi: 'Storage: KV, D1 và R2 — chọn đúng công cụ',
    titleEn: 'Storage: KV, D1, and R2 — picking the right tool',
    objectiveVi: 'Phân biệt KV (key-value), D1 (SQL) và R2 (object) — chọn binding phù hợp dự án.',
    topics: ['KV', 'D1', 'R2', 'Bindings', 'Consistency trade-offs'],
    existingRoutes: ['/tracks/developer-platform/', '/products/', '/glossary/'],
    recommendedProducts: ['KV', 'D1', 'R2'],
    exercisesVi: [
      'Đọc product pages KV, D1, R2 — điền bảng so sánh: use case, latency, query type.',
      'Thiết kế schema D1 đơn giản cho app todo hoặc guestbook.',
      'Chọn storage cho app upload ảnh + metadata — giải thích vì sao không dùng KV alone.',
    ],
    expectedOutcomeVi: 'Bạn không mặc định D1 cho mọi thứ — biết khi nào R2 hoặc KV hợp lý hơn.',
    sourceUrls: [
      `${CF_DOCS}/kv/`,
      `${CF_DOCS}/d1/`,
      `${CF_DOCS}/r2/`,
    ],
  },
  {
    id: 'dev-week-4',
    week: 4,
    titleVi: 'Pages: deploy frontend và full-stack nhỏ',
    titleEn: 'Pages: deploying frontends and small full-stack apps',
    objectiveVi: 'Deploy static site hoặc full-stack app với Pages và Functions.',
    topics: ['Pages project', 'Git integration', 'Pages Functions', 'Preview deployments', 'Custom domains'],
    existingRoutes: [
      '/tracks/developer-platform/',
      '/use-cases/deploy-static-site/',
      '/use-cases/build-serverless-app/',
      '/resources/',
    ],
    recommendedProducts: ['Pages', 'Workers', 'R2'],
    exercisesVi: [
      'Đọc use case deploy static site — liệt kê 5 bước từ repo tới production.',
      'Hoàn thành lesson Pages trong track — ghi chú preview vs production.',
      'Phác thảo cấu trúc repo: frontend Pages + API Worker hoặc Functions.',
    ],
    expectedOutcomeVi: 'Bạn có thể mô tả pipeline deploy từ git push tới URL production trên Pages.',
    sourceUrls: [
      `${CF_DOCS}/pages/`,
      `${CF_DOCS}/pages/functions/`,
      `${CF_DOCS}/pages/get-started/`,
    ],
  },
  {
    id: 'dev-week-5',
    week: 5,
    titleVi: 'Nâng cao: Durable Objects, AI và pattern production',
    titleEn: 'Advanced: Durable Objects, AI, and production patterns',
    objectiveVi:
      'Làm quen stateful edge (Durable Objects) và Workers AI — khi nào cần vượt Worker stateless.',
    topics: ['Durable Objects', 'WebSockets', 'Workers AI', 'Vectorize', 'Observability'],
    existingRoutes: ['/tracks/developer-platform/', '/products/', '/resources/'],
    recommendedProducts: ['Durable Objects', 'Workers AI', 'AI Gateway', 'Vectorize'],
    exercisesVi: [
      'Đọc product Durable Objects — nêu 1 use case cần state (chat room, counter, lock).',
      'Skim 1 tutorial Workers AI trên Developer Docs — tóm tắt input/output flow.',
      'Liệt kê 3 điều cần monitor khi Worker lên production (errors, latency, quotas).',
    ],
    expectedOutcomeVi:
      'Bạn biết khi nào refactor sang Durable Objects thay vì nhồi logic vào một Worker.',
    sourceUrls: [
      `${CF_DOCS}/durable-objects/`,
      `${CF_DOCS}/workers-ai/`,
      `${CF_DOCS}/workers/observability/`,
    ],
  },
  {
    id: 'dev-week-6',
    week: 6,
    titleVi: 'Dự án cuối: build, bảo vệ và checklist go-live',
    titleEn: 'Capstone: build, protect, and go-live checklist',
    objectiveVi:
      'Hoàn thiện mini-project full-stack, thêm lớp bảo vệ cơ bản và tự đánh giá sẵn sàng production.',
    topics: ['Capstone project', 'WAF basics', 'Secrets', 'Checklist', 'Quiz'],
    existingRoutes: [
      '/use-cases/build-serverless-app/',
      '/checklists/beginner-cloudflare-checklist/',
      '/quiz/beginner-readiness/',
      '/tracks/application-services/',
      '/plans/',
    ],
    recommendedProducts: ['Workers', 'Pages', 'D1', 'WAF', 'DNS'],
    exercisesVi: [
      'Hoàn thành mini-project: 1 Pages site + 1 API Worker + storage — ghi README tiếng Việt.',
      'Đọc checklist beginner — đánh dấu mục đã làm và mục còn thiếu cho project.',
      'Làm quiz beginner readiness — ôn lại phần sai và cập nhật README.',
    ],
    expectedOutcomeVi:
      'Bạn có 1 project portfolio trên Cloudflare và checklist go-live tự tin chia sẻ.',
    sourceUrls: [
      `${CF_DOCS}/workers/tutorials/`,
      `${CF_DOCS}/pages/tutorials/`,
      `${CF_DOCS}/learning-paths/workers/`,
    ],
  },
];

const itAdminSteps: RoleRoadmapStep[] = [
  {
    id: 'it-week-1',
    week: 1,
    titleVi: 'Nền tảng hạ tầng: DNS, traffic và vai trò Cloudflare',
    titleEn: "Infrastructure foundation: DNS, traffic, and Cloudflare's role",
    objectiveVi:
      'Hiểu Cloudflare trong stack hiện tại — DNS, proxy, certificate — trước khi đụng Zero Trust.',
    topics: ['DNS', 'Proxy', 'SSL/TLS', 'Traffic flow', 'Account structure'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/', '/glossary/'],
    recommendedProducts: ['DNS', 'SSL/TLS', 'CDN'],
    exercisesVi: [
      'Vẽ sơ đồ traffic: user → firewall hiện tại → origin — đánh dấu chỗ gắn Cloudflare.',
      'Tra glossary 5 thuật ngữ: DNS, proxy, origin, certificate, TTL.',
      'Liệt kê domain/subdomain đang quản lý và phân loại public vs internal.',
    ],
    expectedOutcomeVi: 'Bạn giải thích được cho team vì sao đổi DNS không đồng nghĩa “chuyển hosting”.',
    sourceUrls: [
      `${CF_DOCS}/dns/`,
      `${CF_DOCS}/ssl/`,
      `${CF_DOCS}/fundamentals/setup/account-setup/`,
    ],
  },
  {
    id: 'it-week-2',
    week: 2,
    titleVi: 'Vận hành Application Services cho domain production',
    titleEn: 'Operating Application Services for production domains',
    objectiveVi:
      'Cấu hình DNS an toàn, cache hợp lý và SSL — giảm sự cố do misconfiguration.',
    topics: ['DNS records', 'Proxy settings', 'Cache', 'SSL modes', 'Redirects'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/protect-website/',
      '/products/',
      '/checklists/beginner-cloudflare-checklist/',
    ],
    recommendedProducts: ['DNS', 'CDN', 'SSL/TLS', 'Page Rules', 'Transform Rules'],
    exercisesVi: [
      'Đọc checklist beginner — hoàn thành các mục liên quan DNS và SSL.',
      'Hoàn thành 2 lesson Application Services về DNS và SSL.',
      'Viết runbook 1 trang: thêm subdomain mới với proxy bật và cert full.',
    ],
    expectedOutcomeVi: 'Bạn có runbook DNS/SSL tái sử dụng khi onboard domain mới.',
    sourceUrls: [
      `${CF_DOCS}/dns/manage-dns-records/`,
      `${CF_DOCS}/ssl/origin-configuration/`,
      `${CF_DOCS}/cache/`,
    ],
  },
  {
    id: 'it-week-3',
    week: 3,
    titleVi: 'Bảo mật perimeter: WAF, DDoS và giám sát',
    titleEn: 'Perimeter security: WAF, DDoS, and monitoring',
    objectiveVi:
      'Bật và vận hành lớp bảo vệ — WAF rule, alert DDoS, đọc analytics cơ bản.',
    topics: ['WAF', 'DDoS', 'Firewall rules', 'Bot signals', 'Analytics'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/defend-ddos-attacks/',
      '/demo-guides/',
      '/resources/',
    ],
    recommendedProducts: ['WAF', 'DDoS Protection', 'Firewall Rules', 'Bot Management', 'Analytics'],
    exercisesVi: [
      'Đọc use case chống DDoS — liệt kê 3 alert cần cấu hình.',
      'Xem demo guide Application Security — ghi thứ tự bật WAF cho site staging.',
      'Soạn 5 firewall rule ưu tiên: chặn country, rate limit login, allow office IP.',
    ],
    expectedOutcomeVi: 'Bạn có baseline security enabled và biết xem log khi có spike traffic.',
    sourceUrls: [
      `${CF_DOCS}/waf/`,
      `${CF_DOCS}/ddos-protection/`,
      `${CF_DOCS}/analytics/`,
    ],
  },
  {
    id: 'it-week-4',
    week: 4,
    titleVi: 'Cloudflare One: triển khai Zero Trust thay VPN',
    titleEn: 'Cloudflare One: deploying Zero Trust to replace VPN',
    objectiveVi:
      'Pilot Access + Gateway cho nhóm nhỏ — policy theo identity, không chỉ IP VPN.',
    topics: ['Zero Trust', 'Access', 'Gateway', 'Tunnel', 'WARP client'],
    existingRoutes: [
      '/tracks/cloudflare-one/',
      '/use-cases/replace-vpn/',
      '/use-cases/secure-remote-users/',
      '/demo-guides/',
    ],
    recommendedProducts: ['Zero Trust', 'Access', 'Gateway', 'Tunnel', 'WARP'],
    exercisesVi: [
      'Đọc track Cloudflare One module 1 — map từng bước với checklist triển khai nội bộ.',
      'Đọc use case thay VPN — viết kế hoạch pilot 10 user trong 1 tuần.',
      'Xem demo guide Cloudflare One — chụp/ghi lại flow thêm 1 Access application.',
    ],
    expectedOutcomeVi: 'Bạn có kế hoạch pilot Zero Trust có owner, timeline và tiêu chí rollback.',
    sourceUrls: [
      `${CF_DOCS}/cloudflare-one/setup/`,
      `${CF_DOCS}/cloudflare-one/policies/access/`,
      `${CF_DOCS}/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/`,
    ],
  },
  {
    id: 'it-week-5',
    week: 5,
    titleVi: 'Vận hành lâu dài: gói dịch vụ, tài nguyên và đánh giá',
    titleEn: 'Long-term operations: plans, resources, and assessment',
    objectiveVi:
      'Chuẩn hóa vận hành: so sánh gói, tài liệu nội bộ, tự đánh giá kiến thức trước mở rộng.',
    topics: ['Plan sizing', 'Runbooks', 'Resource hub', 'Incident response', 'Knowledge check'],
    existingRoutes: [
      '/plans/',
      '/resources/',
      '/checklists/beginner-cloudflare-checklist/',
      '/quiz/beginner-readiness/',
      '/use-cases/',
    ],
    recommendedProducts: ['Logpush', 'Analytics', 'Zero Trust', 'WAF'],
    exercisesVi: [
      'Đọc Plans — ghi recommendation gói cho org size và số domain của bạn.',
      'Hoàn thành checklist beginner còn thiếu — export thành tài liệu nội bộ.',
      'Làm quiz beginner readiness; lập kế hoạch ôn 1 tuần cho phần điểm thấp.',
    ],
    expectedOutcomeVi:
      'Bạn có bộ tài liệu vận hành (runbook + checklist + plan note) sẵn sàng cho audit hoặc handover.',
    sourceUrls: [
      `${CF_DOCS}/fundamentals/subscriptions-and-billing/`,
      `${CF_DOCS}/fundamentals/api/`,
      `${CF_DOCS}/learning-paths/cloudflare-one/`,
    ],
  },
];

const startupFounderSteps: RoleRoadmapStep[] = [
  {
    id: 'founder-week-1',
    week: 1,
    titleVi: 'Định hướng sản phẩm: chọn track và mental model nhanh',
    titleEn: 'Product direction: pick a track and quick mental model',
    objectiveVi:
      'Trong 1 tuần hiểu Cloudflare giúp startup gì — ship nhanh, bảo vệ, scale mà không đội infra lớn.',
    topics: ['Startup priorities', 'Ba track', 'Build vs buy', 'Time-to-market'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/', '/use-cases/'],
    recommendedProducts: ['Workers', 'Pages', 'DNS'],
    exercisesVi: [
      'Viết 1 đoạn pitch: startup bạn giải quyết vấn đề gì — cần speed, security hay cả hai?',
      'Đọc 1 use case mỗi track — chọn track chính cho 6 tháng tới.',
      'Liệt kê 3 rủi ro nếu không có CDN/WAF từ ngày đầu (dù chỉ có landing page).',
    ],
    expectedOutcomeVi: 'Bạn chọn được primary track và 1 metric thành công cho tháng đầu (vd. time-to-deploy).',
    sourceUrls: [
      `${CF_DOCS}/fundamentals/`,
      `${CF_DOCS}/workers/`,
      `${CF_DOCS}/pages/`,
    ],
  },
  {
    id: 'founder-week-2',
    week: 2,
    titleVi: 'Ship nhanh: Pages, Workers và MVP',
    titleEn: 'Ship fast: Pages, Workers, and your MVP',
    objectiveVi: 'Đưa MVP lên internet với Pages/Workers — ưu tiên tốc độ hơn perfection.',
    topics: ['Pages deploy', 'Workers API', 'Free tier', 'Preview URLs', 'Custom domain'],
    existingRoutes: [
      '/tracks/developer-platform/',
      '/use-cases/deploy-static-site/',
      '/use-cases/build-serverless-app/',
      '/products/',
    ],
    recommendedProducts: ['Pages', 'Workers', 'KV', 'D1'],
    exercisesVi: [
      'Đọc use case deploy static site — timeline 48h đưa landing + waitlist lên production.',
      'Phác thảo kiến trúc MVP: frontend Pages + 1 Worker endpoint — không over-engineer.',
      'Hoàn thành 2 lesson Developer Platform về Pages/Workers.',
    ],
    expectedOutcomeVi: 'Bạn có blueprint MVP deploy được trong vài ngày, không cần thuê DevOps full-time.',
    sourceUrls: [
      `${CF_DOCS}/pages/get-started/`,
      `${CF_DOCS}/workers/get-started/guide/`,
      `${CF_DOCS}/workers/platform/pricing/`,
    ],
  },
  {
    id: 'founder-week-3',
    week: 3,
    titleVi: 'Bảo vệ và tin cậy khi có user thật',
    titleEn: 'Protect and build trust as real users arrive',
    objectiveVi:
      'Thêm DNS qua Cloudflare, SSL, WAF cơ bản — tránh incident khi bắt đầu marketing.',
    topics: ['DNS onboarding', 'SSL', 'WAF managed rules', 'DDoS', 'Uptime'],
    existingRoutes: [
      '/tracks/application-services/',
      '/use-cases/protect-website/',
      '/use-cases/secure-api/',
      '/checklists/beginner-cloudflare-checklist/',
    ],
    recommendedProducts: ['DNS', 'SSL/TLS', 'WAF', 'CDN'],
    exercisesVi: [
      'Đọc checklist beginner — ưu tiên mục bảo mật trước khi chạy ads.',
      'Đọc use case protect website — liệt kê 5 bước tối thiểu cho production.',
      'Viết 1 trang “incident playbook” đơn giản: site down hoặc bị spam request.',
    ],
    expectedOutcomeVi: 'Domain production có SSL + proxy + WAF baseline trước khi scale marketing.',
    sourceUrls: [
      `${CF_DOCS}/learning-paths/application-security/`,
      `${CF_DOCS}/ssl/`,
      `${CF_DOCS}/waf/`,
    ],
  },
  {
    id: 'founder-week-4',
    week: 4,
    titleVi: 'Chi phí, gói dịch vụ và lộ trình scale',
    titleEn: 'Cost, plans, and your scaling roadmap',
    objectiveVi:
      'Hiểu khi nào nâng gói, dùng tài nguyên hub và tự đánh giá sẵn sàng gọi vốn / enterprise pilot.',
    topics: ['Plan comparison', 'Cost drivers', 'Analytics', 'Next features', 'Resources'],
    existingRoutes: [
      '/plans/',
      '/resources/',
      '/quiz/beginner-readiness/',
      '/demo-guides/',
      '/use-cases/',
    ],
    recommendedProducts: ['Workers', 'Pages', 'R2', 'Workers AI'],
    exercisesVi: [
      'Đọc Plans — ước tính chi phí khi 10x traffic (Workers requests, bandwidth).',
      'Làm quiz beginner readiness — xác định gap kiến thức trước khi tuyển engineer.',
      'Viết roadmap 3 tháng: feature tiếp theo + sản phẩm Cloudflare cần thêm.',
    ],
    expectedOutcomeVi:
      'Bạn có bảng chi phí dự kiến và roadmap sản phẩm–hạ tầng align với giai đoạn startup.',
    sourceUrls: [
      'https://www.cloudflare.com/plans/',
      `${CF_DOCS}/workers/platform/pricing/`,
      `${CF_DOCS}/pages/platform/pricing/`,
    ],
  },
];

const studentSteps: RoleRoadmapStep[] = [
  {
    id: 'student-week-1',
    week: 1,
    titleVi: 'Internet, Cloudflare và bắt đầu học đúng cách',
    titleEn: 'The Internet, Cloudflare, and learning the right way',
    objectiveVi:
      'Xây nền tảng: request web hoạt động thế nào, Cloudflare đứng ở đâu — không học vẹt thuật ngữ.',
    topics: ['HTTP/DNS basics', 'Edge vs origin', 'Học có hệ thống', 'Glossary'],
    existingRoutes: ['/start-here/', '/cloudflare-101/', '/content-roadmap/', '/glossary/'],
    recommendedProducts: ['DNS', 'CDN', 'Workers'],
    exercisesVi: [
      'Đọc Start Here và Cloudflare 101 — tóm tắt 5 ý chính bằng tiếng Việt của bạn.',
      'Tra glossary 8 thuật ngữ — viết 1 câu ví dụ đời thường cho mỗi từ.',
      'Vẽ sơ đồ khi bạn mở một website trên trình duyệt — chỉ rõ DNS và CDN.',
    ],
    expectedOutcomeVi: 'Bạn giải thích được cho bạn cùng lớp Cloudflare khác hosting thế nào.',
    sourceUrls: [
      `${CF_DOCS}/fundamentals/concepts/how-cloudflare-works/`,
      `${CF_DOCS}/learning-paths/`,
      `${CF_DOCS}/dns/troubleshooting/faq/`,
    ],
  },
  {
    id: 'student-week-2',
    week: 2,
    titleVi: 'Chọn track và hoàn thành module đầu tiên',
    titleEn: 'Choose a track and finish the first module',
    objectiveVi:
      'Chọn 1 trong 3 track theo sở thích (web, code, mạng) và hoàn thành module 1 có ghi chú.',
    topics: ['Track selection', 'First lessons', 'Note-taking', 'Use case preview'],
    existingRoutes: [
      '/tracks/application-services/',
      '/tracks/developer-platform/',
      '/tracks/cloudflare-one/',
      '/use-cases/',
    ],
    recommendedProducts: ['Workers', 'WAF', 'Zero Trust'],
    exercisesVi: [
      'Đọc phần “ai phù hợp” của cả 3 track — chọn 1 và giải thích lý do.',
      'Hoàn thành toàn bộ module 1 track đã chọn — ghi chú 1 trang.',
      'Đọc 1 use case liên quan track — liệt kê 3 kỹ năng cần học thêm.',
    ],
    expectedOutcomeVi: 'Bạn có track chính, sổ ghi chú module 1 và danh sách kỹ năng cần học.',
    sourceUrls: [
      `${CF_DOCS}/learning-paths/application-security/`,
      `${CF_DOCS}/learning-paths/workers/`,
      `${CF_DOCS}/learning-paths/cloudflare-one/`,
    ],
  },
  {
    id: 'student-week-3',
    week: 3,
    titleVi: 'Thực hành: use case, sản phẩm và tài nguyên',
    titleEn: 'Hands-on: use cases, products, and resources',
    objectiveVi:
      'Áp dụng lý thuyết vào 1 tình huống cụ thể — đọc use case, tra product, mở tài liệu chính thức.',
    topics: ['Use case study', 'Product deep dive', 'Official docs', 'Demo exploration'],
    existingRoutes: [
      '/use-cases/',
      '/products/',
      '/resources/',
      '/demo-guides/',
      '/tracks/developer-platform/',
    ],
    recommendedProducts: ['Pages', 'Workers', 'KV', 'D1'],
    exercisesVi: [
      'Chọn 1 use case end-to-end — viết tóm tắt 200 từ: vấn đề, giải pháp, sản phẩm dùng.',
      'Đọc 2 product pages liên quan — so sánh khi nào dùng cái nào.',
      'Mở 1 link Developer Docs từ Resources — làm theo tutorial nhỏ hoặc đọc kỹ 15 phút.',
    ],
    expectedOutcomeVi: 'Bạn có 1 bài tóm tắt use case có thể đưa vào portfolio hoặc báo cáo môn học.',
    sourceUrls: [
      `${CF_DOCS}/workers/tutorials/`,
      `${CF_DOCS}/pages/tutorials/`,
      `${CF_DOCS}/reference-architecture/`,
    ],
  },
  {
    id: 'student-week-4',
    week: 4,
    titleVi: 'Tổng kết: quiz, checklist và bước tiếp theo',
    titleEn: 'Wrap-up: quiz, checklist, and next steps',
    objectiveVi:
      'Tự đánh giá, hoàn thiện checklist và lập kế hoạch học tiếp (chứng chỉ, project, internship).',
    topics: ['Self-assessment', 'Checklist', 'Portfolio', 'Next learning path'],
    existingRoutes: [
      '/quiz/beginner-readiness/',
      '/checklists/beginner-cloudflare-checklist/',
      '/resources/',
      '/content-roadmap/',
    ],
    recommendedProducts: ['Workers', 'Pages', 'DNS', 'WAF'],
    exercisesVi: [
      'Làm quiz beginner readiness — ghi điểm và 3 chủ đề cần ôn lại.',
      'Hoàn thành checklist beginner — chụp/ghi lại mục đã tick.',
      'Viết kế hoạch 4 tuần tiếp: 1 project nhỏ + 2 tutorial Developer Docs.',
    ],
    expectedOutcomeVi:
      'Bạn có portfolio outline, điểm quiz và lộ trình học tiếp rõ ràng sau 4 tuần.',
    sourceUrls: [
      `${CF_DOCS}/learning-paths/`,
      `${CF_DOCS}/workers/get-started/guide/`,
      'https://www.cloudflare.com/learning-paths/',
    ],
  },
];

export const roleRoadmaps: RoleRoadmap[] = [
  {
    roleId: 'sales',
    roleNameVi: 'Sales / Pre-sales',
    roleNameEn: 'Sales / Pre-sales',
    descriptionVi:
      'Lộ trình 4 tuần cho người bán hàng hoặc pre-sales: hiểu đủ sâu để qualifying khách, kể câu chuyện giá trị và biết khi nào cần Solution Engineer — không cần biết code.',
    bestForVi: [
      'Account Executive, BDR, pre-sales mới vào Cloudflare',
      'Người cần nói chuyện với khách SMB và mid-market',
      'Team muốn thống nhất ngôn ngữ sản phẩm trước khi demo',
    ],
    totalWeeks: 4,
    startingLevel: 'zero',
    finalOutcomeVi:
      'Tự tin dẫn cuộc gọi discovery, map nhu cầu sang đúng track/sản phẩm và chuẩn bị demo hoặc handoff SE.',
    primaryTrack: 'mixed',
    steps: salesSteps,
  },
  {
    roleId: 'solution-engineer',
    roleNameVi: 'Solution Engineer',
    roleNameEn: 'Solution Engineer',
    descriptionVi:
      'Lộ trình 6 tuần cho SE: từ kiến trúc Connectivity Cloud tới thiết kế giải pháp đa sản phẩm, demo và POC có thể bàn giao.',
    bestForVi: [
      'Solution Engineer, Sales Engineer, kiến trúc sư giải pháp',
      'Kỹ sư đã biết mạng/web muốn chuyên sâu portfolio Cloudflare',
      'Người làm workshop và proof-of-concept cho khách hàng',
    ],
    totalWeeks: 6,
    startingLevel: 'basic',
    finalOutcomeVi:
      'Thiết kế và trình bày được giải pháp end-to-end (app + security + Zero Trust) kèm POC scope và checklist go-live.',
    primaryTrack: 'mixed',
    steps: solutionEngineerSteps,
  },
  {
    roleId: 'developer',
    roleNameVi: 'Developer',
    roleNameEn: 'Developer',
    descriptionVi:
      'Lộ trình 6 tuần cho developer: từ mental model edge tới Workers, storage, Pages và dự án portfolio trên Developer Platform.',
    bestForVi: [
      'Lập trình viên frontend/backend muốn học serverless trên edge',
      'Sinh viên CNTT làm đồ án trên Cloudflare',
      'Dev đã dùng AWS/Vercel muốn thêm Workers vào stack',
    ],
    totalWeeks: 6,
    startingLevel: 'technical',
    finalOutcomeVi:
      'Deploy được mini-project full-stack (Pages + Worker + storage) và hiểu pattern production cơ bản.',
    primaryTrack: 'developer-platform',
    steps: developerSteps,
  },
  {
    roleId: 'it-admin',
    roleNameVi: 'IT Admin / Sysadmin',
    roleNameEn: 'IT Admin / Sysadmin',
    descriptionVi:
      'Lộ trình 5 tuần cho IT vận hành: DNS/SSL production, WAF/DDoS và pilot Zero Trust thay VPN — tập trung runbook và checklist.',
    bestForVi: [
      'Sysadmin, IT manager, người quản lý domain và certificate',
      'Team infra muốn thêm Cloudflare vào perimeter hiện tại',
      'Admin đang tìm lộ trình thay VPN an toàn hơn',
    ],
    totalWeeks: 5,
    startingLevel: 'basic',
    finalOutcomeVi:
      'Vận hành domain production an toàn, có baseline WAF và kế hoạch pilot Zero Trust có tài liệu nội bộ.',
    primaryTrack: 'cloudflare-one',
    steps: itAdminSteps,
  },
  {
    roleId: 'startup-founder',
    roleNameVi: 'Startup Founder',
    roleNameEn: 'Startup Founder',
    descriptionVi:
      'Lộ trình 4 tuần cho founder technical hoặc semi-technical: ship MVP nhanh, bảo vệ khi có user, và hiểu chi phí scale.',
    bestForVi: [
      'Founder solo hoặc team nhỏ chưa có DevOps chuyên trách',
      'Startup pre-seed/seed cần landing + API + bảo mật tối thiểu',
      'Người muốn tránh over-engineer infra từ ngày đầu',
    ],
    totalWeeks: 4,
    startingLevel: 'basic',
    finalOutcomeVi:
      'Có MVP trên Cloudflare, baseline bảo mật và bảng chi phí/direction 3 tháng align với product.',
    primaryTrack: 'mixed',
    steps: startupFounderSteps,
  },
  {
    roleId: 'student',
    roleNameVi: 'Sinh viên / Người mới học',
    roleNameEn: 'Student / New learner',
    descriptionVi:
      'Lộ trình 4 tuần thân thiện người mới: nền tảng Internet, chọn track, thực hành use case và tự đánh giá bằng quiz/checklist.',
    bestForVi: [
      'Sinh viên CNTT, mạng, an toàn thông tin',
      'Người tự học muốn portfolio hoặc chứng chỉ sau này',
      'Intern mới vào team dùng Cloudflare',
    ],
    totalWeeks: 4,
    startingLevel: 'zero',
    finalOutcomeVi:
      'Hiểu mental model Cloudflare, hoàn thành module 1 một track, có bài tóm tắt use case và kế hoạch học tiếp.',
    primaryTrack: 'mixed',
    steps: studentSteps,
  },
];

export const allRoleIds: RoleId[] = roleRoadmaps.map((roadmap) => roadmap.roleId);

export function getRoleRoadmap(roleId: string): RoleRoadmap | undefined {
  return roleRoadmaps.find((roadmap) => roadmap.roleId === roleId);
}
