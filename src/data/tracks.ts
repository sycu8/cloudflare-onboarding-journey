import type { LocalizedString } from '../i18n/types';

export type TrackLesson = {
  title: LocalizedString;
  body: LocalizedString;
  tip?: LocalizedString;
  hubLink?: string;
};

export type TrackModule = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  duration?: LocalizedString;
  lessons: TrackLesson[];
};

export type TrackTool = {
  title: LocalizedString;
  description: LocalizedString;
  href: string;
};

export type Track = {
  slug:
    | 'application-services'
    | 'developer-platform'
    | 'cloudflare-one'
    | 'ai-security-adoption'
    | 'operational-excellence';
  title: LocalizedString;
  headline: LocalizedString;
  promise: LocalizedString;
  description: LocalizedString;
  whoIsThisFor: LocalizedString;
  mentalModel: LocalizedString;
  outcomes: { vi: string[]; en: string[] };
  keyConcepts: string[];
  tools?: TrackTool[];
  modules: TrackModule[];
  recommendedSequence: { vi: string[]; en: string[] };
  relatedUseCases: { href: string; label: LocalizedString }[];
  cta: { href: string; label: LocalizedString };
  commonMistakes?: { vi: { title: string; detail: string }[]; en: { title: string; detail: string }[] };
};

export const tracks: Track[] = [
  {
    slug: 'application-services',
    title: { vi: 'Application Services', en: 'Application Services' },
    headline: {
      vi: 'Bảo vệ và tăng tốc website, application và API',
      en: 'Protect and accelerate websites, applications, and APIs',
    },
    promise: {
      vi: 'Bảo vệ và tăng tốc website, application và API.',
      en: 'Protect and accelerate websites, applications, and APIs.',
    },
    description: {
      vi: 'Lộ trình này dành cho team đã có website, web app, mobile backend hoặc API public. Bạn sẽ học cách đặt Cloudflare phía trước application để cải thiện bảo mật, tốc độ, độ tin cậy và khả năng quan sát traffic.',
      en: 'This path is for teams with a website, web app, mobile backend, or public API. You will learn to put Cloudflare in front of your application to improve security, speed, reliability, and traffic visibility.',
    },
    whoIsThisFor: {
      vi: 'Phù hợp nếu bạn là IT, Security, DevOps, developer vận hành production, hoặc chủ doanh nghiệp có website/app đang chạy thật.',
      en: 'A good fit if you are IT, Security, DevOps, a developer operating production, or a business owner with a live website or app.',
    },
    mentalModel: {
      vi: 'User → Cloudflare (DNS + proxy + security + cache) → Origin (server/app/API của bạn). Cloudflare xử lý gần user trước khi request tới origin.',
      en: 'User → Cloudflare (DNS + proxy + security + cache) → Origin (your server/app/API). Cloudflare processes traffic near users before it reaches origin.',
    },
    outcomes: {
      vi: [
        'Hiểu record DNS nào nên proxy và record nào để DNS only',
        'Cấu hình SSL/TLS không gây redirect loop',
        'Bật baseline WAF/DDoS và rate limit cho path nhạy cảm',
        'Tối ưu cache cho static mà không phá session động',
        'Đọc analytics để biết traffic bất thường',
      ],
      en: [
        'Know which DNS records to proxy vs DNS only',
        'Configure SSL/TLS without redirect loops',
        'Enable baseline WAF/DDoS and rate limits on sensitive paths',
        'Optimize cache for static assets without breaking dynamic sessions',
        'Use analytics to spot abnormal traffic',
      ],
    },
    keyConcepts: ['DNS', 'Proxy', 'SSL/TLS', 'CDN/cache', 'WAF', 'DDoS protection', 'Bot protection', 'Rate limiting', 'API security'],
    modules: [
      {
        id: 'as-1',
        title: { vi: 'Phần 1: Đưa domain lên Cloudflare', en: 'Part 1: Onboard your domain' },
        description: {
          vi: 'Thiết lập nền tảng DNS và hiểu traffic sẽ đi qua đâu.',
          en: 'Set up DNS foundations and understand where traffic will flow.',
        },
        duration: { vi: '~30 phút', en: '~30 min' },
        lessons: [
          {
            title: { vi: 'Thêm domain và review DNS records', en: 'Add domain and review DNS records' },
            body: {
              vi: 'Import hoặc tạo zone cho domain. Liệt kê A/AAAA, CNAME, MX và ghi chú record nào trỏ tới origin thật. Đừng proxy MX hoặc record nội bộ không cần qua Cloudflare.',
              en: 'Import or create a zone. List A/AAAA, CNAME, MX records and note which point to your real origin. Do not proxy MX or internal records that should not pass through Cloudflare.',
            },
            tip: {
              vi: 'Chụp screenshot bảng DNS trước khi đổi nameserver — tiện khi rollback.',
              en: 'Screenshot your DNS table before changing nameservers — useful for rollback.',
            },
            hubLink: '/cloudflare-101',
          },
          {
            title: { vi: 'Bật proxy (orange cloud) đúng record', en: 'Enable proxy on the right records' },
            body: {
              vi: 'Proxy các record phục vụ HTTP/HTTPS public (website, API gateway). Giữ DNS only cho record chỉ dùng nội bộ hoặc dịch vụ đặc biệt.',
              en: 'Proxy records serving public HTTP/HTTPS (website, API gateway). Keep DNS only for internal-only or special services.',
            },
            hubLink: '/glossary',
          },
        ],
      },
      {
        id: 'as-2',
        title: { vi: 'Phần 2: SSL/TLS và kết nối origin', en: 'Part 2: SSL/TLS and origin connection' },
        description: {
          vi: 'Tránh lỗi chứng chỉ và đảm bảo traffic mã hóa end-to-end phù hợp mô hình của bạn.',
          en: 'Avoid certificate errors and ensure encryption fits your architecture.',
        },
        duration: { vi: '~25 phút', en: '~25 min' },
        lessons: [
          {
            title: { vi: 'Chọn SSL/TLS mode phù hợp', en: 'Choose the right SSL/TLS mode' },
            body: {
              vi: 'Full (strict) khi origin có cert hợp lệ. Tránh Flexible nếu origin chỉ nhận HTTPS. Kiểm tra redirect HTTP→HTTPS.',
              en: 'Use Full (strict) when origin has a valid cert. Avoid Flexible if origin expects HTTPS. Verify HTTP→HTTPS redirects.',
            },
            tip: {
              vi: 'Test bằng curl hoặc browser incognito sau mỗi thay đổi mode.',
              en: 'Test with curl or an incognito browser after each mode change.',
            },
          },
          {
            title: { vi: 'Origin certificate và bypass', en: 'Origin certificates and bypass' },
            body: {
              vi: 'Chặn truy cập trực tiếp IP origin nếu có thể (firewall chỉ cho phép Cloudflare). Điều này ngăn attacker bỏ qua WAF.',
              en: 'Block direct origin IP access when possible (firewall allow Cloudflare only). This prevents attackers from bypassing the WAF.',
            },
          },
        ],
      },
      {
        id: 'as-3',
        title: { vi: 'Phần 3: Bảo mật baseline', en: 'Part 3: Baseline security' },
        description: {
          vi: 'WAF, DDoS, bot và rate limiting cho path quan trọng.',
          en: 'WAF, DDoS, bots, and rate limiting for critical paths.',
        },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          {
            title: { vi: 'Bật WAF managed rules', en: 'Enable WAF managed rules' },
            body: {
              vi: 'Bắt đầu ở chế độ log/simulate nếu lo ngại false positive, sau đó chuyển block. Ưu tiên bảo vệ login, admin, API public.',
              en: 'Start in log/simulate if worried about false positives, then move to block. Prioritize login, admin, and public API paths.',
            },
            hubLink: '/use-cases/secure-api',
          },
          {
            title: { vi: 'Rate limiting cho login và form', en: 'Rate limiting for login and forms' },
            body: {
              vi: 'Giới hạn request theo IP hoặc cookie cho /login, /signup, OTP, search. Giảm credential stuffing và abuse.',
              en: 'Limit requests per IP or cookie on /login, /signup, OTP, search. Reduces credential stuffing and abuse.',
            },
          },
          {
            title: { vi: 'Bot protection cơ bản', en: 'Basic bot protection' },
            body: {
              vi: 'Phân biệt bot xấu (scrape, spam) và traffic hợp lệ. Kết hợp challenge hoặc block theo score.',
              en: 'Separate bad bots (scraping, spam) from legitimate traffic. Combine challenges or blocks by score.',
            },
            hubLink: '/demo-guides#application-security',
          },
        ],
      },
      {
        id: 'as-4',
        title: { vi: 'Phần 4: Content delivery & tăng tốc website', en: 'Part 4: Content delivery & website speed' },
        description: {
          vi: 'CDN, cache rules, Speed, Argo/Tiered Cache và đo lường — giảm tải origin, cải thiện LCP.',
          en: 'CDN, cache rules, Speed, Argo/Tiered Cache, and measurement — less origin load, better LCP.',
        },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          {
            title: { vi: 'CDN & cache hit/miss', en: 'CDN & cache hit/miss' },
            body: {
              vi: 'Hiểu HIT tại PoP vs MISS về origin. Cache static assets; không cache HTML có session.',
              en: 'Understand PoP HIT vs MISS to origin. Cache static assets; do not cache HTML with sessions.',
            },
            hubLink: '/content-delivery#cdn-basics',
          },
          {
            title: { vi: 'Cache Rules & purge', en: 'Cache Rules & purge' },
            body: {
              vi: 'Bypass /admin, /checkout; TTL cho /assets/*; purge sau mỗi release frontend.',
              en: 'Bypass /admin, /checkout; TTL for /assets/*; purge after each frontend release.',
            },
            hubLink: '/content-delivery#cache-rules',
          },
          {
            title: { vi: 'Speed & Images', en: 'Speed & Images' },
            body: {
              vi: 'Brotli, Early Hints, HTTP/3; resize ảnh WebP/AVIF tại edge.',
              en: 'Brotli, Early Hints, HTTP/3; resize images to WebP/AVIF at the edge.',
            },
            hubLink: '/content-delivery#speed-optimization',
          },
          {
            title: { vi: 'Đo hit ratio & Core Web Vitals', en: 'Measure hit ratio & Core Web Vitals' },
            body: {
              vi: 'Caching Analytics + Web Analytics — báo cáo trước/sau cho stakeholder.',
              en: 'Caching Analytics + Web Analytics — before/after reports for stakeholders.',
            },
            hubLink: '/content-delivery#measure',
          },
        ],
      },
    ],
    recommendedSequence: {
      vi: [
        'Add domain vào Cloudflare',
        'Review DNS records',
        'Enable proxy cho các record phù hợp',
        'Configure SSL/TLS đúng cách',
        'Bật baseline security',
        'Review caching behavior',
        'Thêm WAF/rate limiting cho các path rủi ro',
        'Monitor analytics và logs',
      ],
      en: [
        'Add domain to Cloudflare',
        'Review DNS records',
        'Enable proxy on selected records',
        'Configure SSL/TLS correctly',
        'Turn on baseline security',
        'Review caching behavior',
        'Add WAF/rate limiting for risky paths',
        'Monitor analytics and logs',
      ],
    },
    relatedUseCases: [
      { href: '/use-cases/protect-website/', label: { vi: 'Bảo vệ website', en: 'Protect a website' } },
      { href: '/use-cases/secure-api/', label: { vi: 'Bảo vệ API', en: 'Secure an API' } },
      { href: '/use-cases/defend-ddos-attacks/', label: { vi: 'Chống DDoS', en: 'Defend DDoS' } },
    ],
    cta: { href: '/use-cases/application-services', label: { vi: 'Tình huống Application Services', en: 'Application Services use cases' } },
  },
  {
    slug: 'developer-platform',
    title: { vi: 'Developer Platform', en: 'Developer Platform' },
    headline: {
      vi: 'Build và deploy app trên Cloudflare',
      en: 'Build and deploy apps on Cloudflare',
    },
    promise: {
      vi: 'Build và deploy apps trên Cloudflare.',
      en: 'Build and deploy apps on Cloudflare.',
    },
    description: {
      vi: 'Lộ trình cho developer muốn deploy frontend, API, backend serverless hoặc app có AI. Bạn sẽ đi từ static site trên Pages đến Worker, storage (KV/D1/R2) và tích hợp cơ bản.',
      en: 'For developers deploying frontends, APIs, serverless backends, or AI apps. You will go from a static Pages site to Workers, storage (KV/D1/R2), and basic integrations.',
    },
    whoIsThisFor: {
      vi: 'Developer, full-stack engineer, hoặc team build internal tool / MVP / side project muốn ship nhanh không quản lý server.',
      en: 'Developers, full-stack engineers, or teams building internal tools, MVPs, or side projects who want to ship fast without managing servers.',
    },
    mentalModel: {
      vi: 'User → Cloudflare edge (Pages / Workers) → KV / D1 / R2 / external API. Code chạy gần user, data lưu trên platform bindings.',
      en: 'User → Cloudflare edge (Pages / Workers) → KV / D1 / R2 / external API. Code runs near users; data lives in platform bindings.',
    },
    outcomes: {
      vi: [
        'Deploy site static hoặc full-stack trên Pages',
        'Tạo API route bằng Pages Functions hoặc Worker',
        'Chọn đúng storage: KV vs D1 vs R2',
        'Xử lý lỗi và logging cơ bản trên edge',
        'Build và bảo mật AI feature với Workers AI, AI Gateway và Vectorize',
        'Thiết kế Agent với tools hẹp và credential theo least privilege',
      ],
      en: [
        'Deploy a static or full-stack site on Pages',
        'Create an API route with Pages Functions or a Worker',
        'Pick the right storage: KV vs D1 vs R2',
        'Handle errors and basic edge logging',
        'Build and secure an AI feature with Workers AI, AI Gateway, and Vectorize',
        'Design an Agent with narrow tools and least-privilege credentials',
      ],
    },
    keyConcepts: ['Pages', 'Workers', 'KV', 'D1', 'R2', 'Durable Objects', 'Workers AI', 'AI Gateway', 'Vectorize'],
    modules: [
      {
        id: 'dp-1',
        title: { vi: 'Phần 1: Deploy đầu tiên với Pages', en: 'Part 1: First deploy with Pages' },
        description: {
          vi: 'Đưa frontend lên Cloudflare Pages và hiểu preview/production.',
          en: 'Ship a frontend on Cloudflare Pages and understand preview vs production.',
        },
        duration: { vi: '~40 phút', en: '~40 min' },
        lessons: [
          {
            title: { vi: 'Tạo project Pages từ Git hoặc CLI', en: 'Create a Pages project from Git or CLI' },
            body: {
              vi: 'Kết nối repo GitHub/GitLab hoặc dùng `wrangler pages deploy`. Mỗi PR có preview URL — rất hữu ích cho review.',
              en: 'Connect GitHub/GitLab or use `wrangler pages deploy`. Each PR gets a preview URL — great for reviews.',
            },
            hubLink: '/use-cases/build-serverless-app',
          },
          {
            title: { vi: 'Cấu hình build và output', en: 'Configure build and output' },
            body: {
              vi: 'Đặt build command (`npm run build`) và thư mục output (`dist`). Kiểm tra biến môi trường cho API URL.',
              en: 'Set build command (`npm run build`) and output directory (`dist`). Check env vars for API URLs.',
            },
          },
        ],
      },
      {
        id: 'dp-2',
        title: { vi: 'Phần 2: API trên edge', en: 'Part 2: APIs on the edge' },
        description: {
          vi: 'Thêm logic serverless nhỏ không cần server riêng.',
          en: 'Add small serverless logic without a separate server.',
        },
        duration: { vi: '~50 phút', en: '~50 min' },
        lessons: [
          {
            title: { vi: 'Pages Functions cho route `/api/*`', en: 'Pages Functions for `/api/*` routes' },
            body: {
              vi: 'Đặt handler trong `functions/` để xử lý form, webhook, proxy nhẹ. Phù hợp logic gắn với site Pages.',
              en: 'Put handlers in `functions/` for forms, webhooks, light proxying. Good for logic tied to your Pages site.',
            },
          },
          {
            title: { vi: 'Worker độc lập khi cần routing phức tạp', en: 'Standalone Worker for complex routing' },
            body: {
              vi: 'Dùng Worker khi cần middleware, auth edge, hoặc nhiều hostname. Worker là đơn vị compute linh hoạt nhất.',
              en: 'Use a Worker when you need middleware, edge auth, or multiple hostnames. Workers are the most flexible compute unit.',
            },
          },
        ],
      },
      {
        id: 'dp-3',
        title: { vi: 'Phần 3: Chọn storage đúng', en: 'Part 3: Pick the right storage' },
        description: {
          vi: 'KV, D1 và R2 — khi nào dùng cái nào.',
          en: 'KV, D1, and R2 — when to use each.',
        },
        duration: { vi: '~35 phút', en: '~35 min' },
        lessons: [
          {
            title: { vi: 'KV cho config và cache nhẹ', en: 'KV for config and light cache' },
            body: {
              vi: 'Lưu feature flags, session token ngắn, rate limit counter. Không dùng KV cho giao dịch tài chính cần consistency cao.',
              en: 'Store feature flags, short session tokens, rate limit counters. Avoid KV for financial transactions needing strong consistency.',
            },
            hubLink: '/glossary',
          },
          {
            title: { vi: 'D1 cho dữ liệu có schema', en: 'D1 for structured data' },
            body: {
              vi: 'Workshop signup, quiz results, user preferences — bảng SQL nhỏ. Chạy migration với `wrangler d1 migrations`.',
              en: 'Workshop signups, quiz results, user prefs — small SQL tables. Run migrations with `wrangler d1 migrations`.',
            },
          },
          {
            title: { vi: 'R2 cho file và tài liệu', en: 'R2 for files and assets' },
            body: {
              vi: 'PDF, slides, upload user — object storage. Có thể phục vụ public hoặc signed URL sau này.',
              en: 'PDFs, slides, user uploads — object storage. Serve public or via signed URLs later.',
            },
          },
        ],
      },
      {
        id: 'dp-4',
        title: { vi: 'Phần 4: Vận hành và bước tiếp', en: 'Part 4: Operate and level up' },
        description: {
          vi: 'Analytics, bảo vệ form, và hướng AI.',
          en: 'Analytics, form protection, and AI next steps.',
        },
        duration: { vi: '~30 phút', en: '~30 min' },
        lessons: [
          {
            title: { vi: 'Web Analytics và log Workers', en: 'Web Analytics and Worker logs' },
            body: {
              vi: 'Bật Cloudflare Web Analytics cho traffic. Dùng `wrangler tail` hoặc observability khi debug API.',
              en: 'Enable Cloudflare Web Analytics for traffic. Use `wrangler tail` or observability when debugging APIs.',
            },
          },
          {
            title: { vi: 'Turnstile cho form public', en: 'Turnstile for public forms' },
            body: {
              vi: 'Chống bot trên đăng ký workshop, contact form. Verify token server-side trước khi ghi D1.',
              en: 'Stop bots on workshop signup and contact forms. Verify tokens server-side before writing to D1.',
            },
            hubLink: '/workshop',
          },
        ],
      },
      {
        id: 'dp-5',
        title: { vi: 'Phần 5: AI trên Developer Platform', en: 'Part 5: AI on the Developer Platform' },
        description: {
          vi: 'Từ inference đầu tiên đến AI security, RAG và agent có tools/skills.',
          en: 'From first inference to AI security, RAG, and agents with tools and skills.',
        },
        duration: { vi: '~110 phút', en: '~110 min' },
        lessons: [
          {
            title: { vi: 'Inference đầu tiên với Workers AI', en: 'First inference with Workers AI' },
            body: {
              vi: 'Thêm AI binding vào Worker, gọi model từ server-side và trả response tối thiểu. Bắt đầu bằng một task rõ ràng trước khi thêm chat UI hoặc nhiều provider.',
              en: 'Add an AI binding to a Worker, call a model server-side, and return a minimal response. Start with one clear task before adding a chat UI or multiple providers.',
            },
            hubLink: '/use-cases/build-ai-applications',
          },
          {
            title: { vi: 'Adopt AI có kiểm soát với AI Gateway', en: 'Adopt AI deliberately with AI Gateway' },
            body: {
              vi: 'Đặt AI Gateway giữa app và model provider để quan sát request, cache khi phù hợp và thay provider mà không làm lộ credential ở client.',
              en: 'Place AI Gateway between your app and model providers to observe requests, cache where appropriate, and change providers without exposing credentials in the client.',
            },
          },
          {
            title: { vi: 'Baseline bảo mật cho ứng dụng AI', en: 'AI application security baseline' },
            body: {
              vi: 'Giữ key ở Worker secrets, xác thực người dùng trước endpoint AI, rate limit input, validate tool input và áp dụng guardrails cho data/response nhạy cảm.',
              en: 'Keep keys in Worker secrets, authenticate users before AI endpoints, rate-limit input, validate tool input, and apply guardrails to sensitive data and responses.',
            },
            hubLink: '/cheatsheets/ai-protection-portfolio#ai-gateway',
          },
          {
            title: { vi: 'RAG với Vectorize và storage', en: 'RAG with Vectorize and storage' },
            body: {
              vi: 'Tách luồng ingest và query: lưu tài liệu trong R2, tạo embeddings vào Vectorize, retrieve context có nguồn trước khi gọi model. Đừng coi vector search là quyền truy cập dữ liệu.',
              en: 'Separate ingestion from queries: store documents in R2, create embeddings in Vectorize, and retrieve sourced context before calling the model. Do not treat vector search as data authorization.',
            },
          },
          {
            title: { vi: 'Agents: tools, skills và quyền hạn tối thiểu', en: 'Agents: tools, skills, and least privilege' },
            body: {
              vi: 'Dùng Agents SDK cho state/session khi cần. Mỗi tool cần schema input rõ ràng, authorization ở server và scope nhỏ; skill là hướng dẫn/versioned knowledge, không phải quyền truy cập bí mật.',
              en: 'Use the Agents SDK for state and sessions when needed. Give every tool a clear input schema, server-side authorization, and narrow scope; skills are versioned guidance and knowledge, not secret access.',
            },
          },
        ],
      },
    ],
    recommendedSequence: {
      vi: [
        'Deploy static site với Pages',
        'Thêm một API route',
        'Build một Worker endpoint nhỏ',
        'Lưu dữ liệu đơn giản trong KV hoặc D1',
        'Upload files lên R2',
        'Thêm basic analytics và error handling',
        'Ship một Workers AI feature có mục tiêu rõ ràng',
        'Thêm AI Gateway observability và security controls',
        'Chỉ build RAG hoặc agent khi data/tool boundaries rõ ràng',
      ],
      en: [
        'Deploy a static site with Pages',
        'Add one API route',
        'Build a small Worker endpoint',
        'Store simple data in KV or D1',
        'Upload files to R2',
        'Add basic analytics and error handling',
        'Ship one focused Workers AI feature',
        'Add AI Gateway observability and security controls',
        'Build RAG or an agent only when its data and tool boundaries are clear',
      ],
    },
    relatedUseCases: [
      { href: '/use-cases/build-serverless-app/', label: { vi: 'Build serverless app', en: 'Build a serverless app' } },
      { href: '/use-cases/deploy-static-site/', label: { vi: 'Deploy static site', en: 'Deploy static site' } },
      { href: '/use-cases/build-ai-applications/', label: { vi: 'Build ứng dụng AI', en: 'Build AI applications' } },
    ],
    commonMistakes: {
      vi: [
        {
          title: 'Sai thư mục build output trên Pages',
          detail: 'Astro dùng `dist`, Create React App dùng `build` — sai output khiến site trắng hoặc 404. Kiểm tra build log trước khi merge.',
        },
        {
          title: 'Chọn nhầm storage (KV cho dữ liệu quan hệ)',
          detail: 'KV không phù hợp giao dịch cần consistency. Dùng D1 cho bảng SQL; R2 cho file; KV cho flags/config.',
        },
        {
          title: 'Secret/API key lộ ở client',
          detail: 'Chỉ `PUBLIC_*` được embed build. Token Turnstile secret, DB credentials phải ở Pages Functions/Worker env.',
        },
        {
          title: 'Không verify Turnstile server-side',
          detail: 'Chỉ embed widget chưa đủ — attacker gửi POST trực tiếp tới API. Luôn verify token trước khi ghi D1.',
        },
        {
          title: 'Bỏ qua observability khi debug edge',
          detail: 'Worker/Pages Function lỗi khó thấy trên server truyền thống. Dùng `wrangler tail`, logs và error handling rõ ràng.',
        },
      ],
      en: [
        {
          title: 'Wrong Pages build output directory',
          detail: 'Astro uses `dist`, CRA uses `build` — wrong output causes blank sites or 404s. Check build logs before merging.',
        },
        {
          title: 'Wrong storage choice (KV for relational data)',
          detail: 'KV is wrong for consistency-critical transactions. Use D1 for SQL tables; R2 for files; KV for flags/config.',
        },
        {
          title: 'Secrets/API keys exposed in the client',
          detail: 'Only `PUBLIC_*` belongs in the build. Turnstile secrets and DB credentials belong in Pages Functions/Worker env.',
        },
        {
          title: 'No server-side Turnstile verification',
          detail: 'Embedding the widget is not enough — attackers POST directly to your API. Always verify tokens before writing to D1.',
        },
        {
          title: 'Skipping observability when debugging edge code',
          detail: 'Worker/Pages Function errors are invisible like traditional servers. Use `wrangler tail`, logs, and explicit error handling.',
        },
      ],
    },
    cta: { href: '/use-cases/developer-platform', label: { vi: 'Tình huống Developer Platform', en: 'Developer Platform use cases' } },
  },
  {
    slug: 'cloudflare-one',
    title: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    headline: {
      vi: 'Triển khai Zero Trust theo từng mô-đun: identity, thiết bị, ZTNA, Gateway, DLP, AI và Cloudflare WAN',
      en: 'Deploy Zero Trust module by module: identity, devices, ZTNA, Gateway, DLP, AI, and Cloudflare WAN',
    },
    promise: {
      vi: 'Bảo vệ users, access, SaaS và networks — follow-along từ tài khoản đến go-live.',
      en: 'Secure users, access, SaaS, and networks — follow along from account to go-live.',
    },
    description: {
      vi: 'Lộ trình Zero Trust / SASE bám theo hướng dẫn onboarding Cloudflare One: tài khoản, identity, Cloudflare One Client, Access (ZTNA), Gateway, DLP, kiểm soát AI và (tuỳ chọn) Cloudflare WAN. Làm theo thứ tự — mỗi mô-đun xây trên mô-đun trước. Pilot → validate → expand; dừng sau bất kỳ phần nào vẫn có giá trị.',
      en: 'A Zero Trust / SASE path aligned with the Cloudflare One onboarding guide: account, identity, Cloudflare One Client, Access (ZTNA), Gateway, DLP, AI controls, and (optionally) Cloudflare WAN. Work in order — each module builds on the last. Pilot → validate → expand; stopping after any module still leaves something useful.',
    },
    whoIsThisFor: {
      vi: 'IT admin, security, identity hoặc founder cần bảo vệ nhân viên, remote work, SaaS và app nội bộ — thay VPN hoặc bổ sung SWG/DLP. Không cần kinh nghiệm Cloudflare trước.',
      en: 'IT admins, security, identity, or founders securing employees, remote work, SaaS, and internal apps — replacing VPN or adding SWG/DLP. No prior Cloudflare experience required.',
    },
    mentalModel: {
      vi: 'User/device (hoặc chi nhánh Cloudflare WAN) → Cloudflare edge: (1) Identity (2) Posture (3) Access/ZTNA (4) Gateway (5) DLP (6) AI controls → Internet / SaaS / private app (qua Tunnel). Kiểm tra mọi request; không mở toàn mạng như VPN.',
      en: 'User/device (or a Cloudflare WAN site) → Cloudflare edge: (1) Identity (2) Posture (3) Access/ZTNA (4) Gateway (5) DLP (6) AI controls → Internet / SaaS / private app (via Tunnel). Check every request; no full-network access like VPN.',
    },
    outcomes: {
      vi: [
        'Tạo tổ chức Cloudflare One, chọn team name (URL đăng nhập) và break-glass admin',
        'Kết nối IdP (Entra ID / Okta / Google), kiểm tra group claims và bật MFA',
        'Enroll Cloudflare One Client (WARP), cấu hình device profile và posture',
        'Publish app nội bộ đầu tiên bằng Tunnel + Access — không mở inbound firewall',
        'Bật Gateway theo lớp DNS → Network → HTTP/TLS; Shadow IT và RBI khi sẵn sàng',
        'Pilot DLP log-only rồi enforce; quản trị AI (không cấm mù) gồm MCP và AI Gateway',
      ],
      en: [
        'Create a Cloudflare One organization, lock in the team name (login URL), and keep a break-glass admin',
        'Connect an IdP (Entra ID / Okta / Google), verify group claims, and require MFA',
        'Enroll the Cloudflare One Client (WARP), configure device profiles, and add posture checks',
        'Publish a first private app with Tunnel + Access — no inbound firewall ports',
        'Roll out Gateway in layers: DNS → Network → HTTP/TLS; add Shadow IT and RBI when ready',
        'Pilot DLP in log-only then enforce; govern AI (do not blind-ban) including MCP and AI Gateway',
      ],
    },
    keyConcepts: [
      'Zero Trust',
      'ZTNA',
      'Identity provider',
      'Cloudflare One Client',
      'Device posture',
      'Cloudflare Tunnel',
      'SWG',
      'Gateway',
      'Browser Isolation',
      'CASB',
      'DLP',
      'AI controls',
      'MCP portals',
      'AI Gateway',
      'Cloudflare WAN',
    ],
    tools: [
      {
        title: { vi: 'Hướng dẫn onboarding Zero Trust (follow-along)', en: 'Zero Trust onboarding guide (follow-along)' },
        description: {
          vi: 'Từng bước click-by-click: account, identity, thiết bị, ZTNA, Gateway, DLP, AI và Cloudflare WAN. Có bản tiếng Việt. Đây là hướng dẫn cộng đồng — không phải tài liệu chính thức của Cloudflare.',
          en: 'Click-by-click modules: account, identity, devices, ZTNA, Gateway, DLP, AI, and Cloudflare WAN. Vietnamese available. Community guide — not an official Cloudflare publication.',
        },
        href: 'https://zerotrust.cfsase.workers.dev/',
      },
      {
        title: { vi: 'Configuration runbook', en: 'Configuration runbook' },
        description: {
          vi: 'Bảng tham chiếu nhanh: đường dẫn dashboard, field và giá trị mẫu cho từng mô-đun khi bạn đã hiểu luồng.',
          en: 'Quick reference: dashboard paths, fields, and sample values for each module once you know the flow.',
        },
        href: 'https://zerotrust.cfsase.workers.dev/configuration-runbook.html',
      },
      {
        title: { vi: 'Best-practice guide', en: 'Best-practice guide' },
        description: {
          vi: 'Thứ tự rollout, 10 golden rules, và chiến lược pilot → validate → expand cho từng phase.',
          en: 'Rollout order, 10 golden rules, and the pilot → validate → expand strategy for each phase.',
        },
        href: 'https://zerotrust.cfsase.workers.dev/best-practice-guide.html',
      },
    ],
    modules: [
      {
        id: 'c1-1',
        title: { vi: 'Phần 1: Kiến trúc và tài khoản', en: 'Part 1: Architecture and account' },
        description: {
          vi: 'Bức tranh SASE, checklist trước khi bắt đầu, tạo tổ chức Cloudflare One và quản trị admin least-privilege.',
          en: 'The SASE picture, pre-start checklist, creating the Cloudflare One organization, and least-privilege admins.',
        },
        duration: { vi: '~50 phút', en: '~50 min' },
        lessons: [
          {
            title: { vi: 'Kiến trúc & thứ tự triển khai', en: 'Architecture & rollout order' },
            body: {
              vi: 'Zero Trust thay mô hình “lâu đài + hào” (VPN + firewall) bằng kiểm tra mọi request. Traffic đi một lần qua identity, posture, Access, Gateway, DLP và AI controls tại edge. Làm theo phase: Foundation → Devices → Access → Web filtering → Data & AI → Network; luôn pilot → validate → expand.',
              en: 'Zero Trust replaces castle-and-moat (VPN + firewall) with check-every-request. Traffic passes identity, posture, Access, Gateway, DLP, and AI controls in one pass at the edge. Phases: Foundation → Devices → Access → Web filtering → Data & AI → Network; always pilot → validate → expand.',
            },
            tip: {
              vi: 'Nhiều team làm Mô-đun 1–3 tuần đầu (identity + thiết bị), Access và Gateway tuần hai, DLP/AI/WAN sau.',
              en: 'Many teams do Modules 1–3 in week one (identity + devices), Access and Gateway in week two, then DLP/AI/WAN later.',
            },
            hubLink: '/use-cases/cloudflare-one',
          },
          {
            title: { vi: 'Tạo account, team name và Cloudflare One', en: 'Create the account, team name, and Cloudflare One' },
            body: {
              vi: 'Đăng ký dash.cloudflare.com, xác thực email, bật 2FA cho admin. Mở Zero Trust, chọn team name (trở thành `https://<team>.cloudflareaccess.com`) và plan. Team name rất khó đổi — chọn tên ngắn, bền. Cloudflare tự là IdP mặc định; Restrict to account members rồi test login tại team domain.',
              en: 'Sign up at dash.cloudflare.com, verify email, and enable admin 2FA. Open Zero Trust, pick a team name (it becomes `https://<team>.cloudflareaccess.com`) and a plan. The team name is hard to change — choose a short, durable name. Cloudflare is the default IdP; Restrict to account members, then test login at the team domain.',
            },
            tip: {
              vi: 'Cần phương thức thanh toán kể cả Free — Free không bị tính phí. Domain không bắt buộc để bắt đầu Zero Trust.',
              en: 'A payment method is required even on Free — you are not charged on Free. A domain is not required to start Zero Trust.',
            },
            hubLink: '/glossary',
          },
          {
            title: { vi: 'Admin, vai trò và break-glass', en: 'Admins, roles, and break-glass' },
            body: {
              vi: 'Admin nhận account role; nhân viên dùng dịch vụ chỉ cần enrollment + Access policy — không cần role trên account. Mời ít nhất hai Super Admin, dùng role hẹp cho daily work, và giữ Cloudflare login / OTP làm đường break-glass nếu Access khóa dashboard. Token API account-owned + expiry; xem audit log sau mỗi thay đổi admin.',
              en: 'Admins get account roles; employees using the service only need enrollment + Access policies — not an account role. Invite at least two Super Admins, use narrower roles for daily work, and keep Cloudflare login / OTP as break-glass if Access ever wraps the dashboard. Prefer account-owned API tokens with expiry; review audit logs after every admin change.',
            },
            tip: {
              vi: 'Nếu gắn Access lên chính dashboard admin, identity break-glass phải luôn thỏa policy — nếu không một rule sai khóa cả team.',
              en: 'If you put Access in front of the admin dashboard, the break-glass identity must always satisfy that policy — otherwise a bad rule locks everyone out.',
            },
          },
        ],
      },
      {
        id: 'c1-2',
        title: { vi: 'Phần 2: Identity provider', en: 'Part 2: Identity provider' },
        description: {
          vi: 'Kết nối đăng nhập công ty — nền cho mọi policy Access, enrollment và Gateway sau này.',
          en: 'Connect corporate login — the foundation for every later Access, enrollment, and Gateway policy.',
        },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          {
            title: { vi: 'Kết nối Entra ID, Okta hoặc Google', en: 'Connect Entra ID, Okta, or Google' },
            body: {
              vi: 'Callback URL: `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback`. Đăng ký app trên IdP (không chọn gallery SaaS), dán callback, copy client ID / tenant / secret, cấp quyền đọc user và group, Grant admin consent, rồi Add IdP trong Cloudflare One → Settings → Authentication. Google còn cần JavaScript origin = team domain.',
              en: 'Callback URL: `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback`. Register an app in the IdP (not a gallery SaaS app), paste the callback, copy client ID / tenant / secret, grant user and group read permissions, Grant admin consent, then Add IdP in Cloudflare One → Settings → Authentication. Google also needs the JavaScript origin = team domain.',
            },
            tip: {
              vi: 'Secret IdP chỉ hiện một lần và khi hết hạn mọi login dừng — đặt reminder gia hạn trước expiry.',
              en: 'The IdP secret is shown once; when it expires all logins stop — set a reminder to rotate before expiry.',
            },
            hubLink: '/demo-guides#cloudflare-one',
          },
          {
            title: { vi: 'Test group claims, MFA và SCIM', en: 'Test group claims, MFA, and SCIM' },
            body: {
              vi: 'Dùng Test trên IdP: phải thấy email và groups. Bật MFA bắt buộc tại IdP trước khi enforce Access. Bật SCIM khi sẵn sàng để group/user đồng bộ khi offboard. Policy nên tham chiếu group IdP, không phải từng user. Cloudflare login mặc định vẫn giữ làm break-glass.',
              en: 'Use Test on the IdP: you should see email and groups. Require MFA at the IdP before enforcing Access. Enable SCIM when ready so groups and users sync on offboarding. Policies should reference IdP groups, not individual users. Keep default Cloudflare login as break-glass.',
            },
            tip: {
              vi: 'Identity là nền — đừng viết policy theo group trước khi Test hiện group claims.',
              en: 'Identity is the foundation — do not write group-based policies until Test shows group claims.',
            },
            hubLink: '/use-cases/secure-saas-access',
          },
        ],
      },
      {
        id: 'c1-3',
        title: { vi: 'Phần 3: Thiết bị — Cloudflare One Client', en: 'Part 3: Devices — Cloudflare One Client' },
        description: {
          vi: 'Enrollment, device profile (mode, split tunnel, BYOD) và posture — on-ramp + tín hiệu sức khỏe thiết bị.',
          en: 'Enrollment, device profiles (mode, split tunnel, BYOD), and posture — the on-ramp plus device-health signals.',
        },
        duration: { vi: '~60 phút', en: '~60 min' },
        lessons: [
          {
            title: { vi: 'Enrollment và cài Cloudflare One Client', en: 'Enrollment and installing the Cloudflare One Client' },
            body: {
              vi: 'Trước khi cài: Settings → WARP Client → Device enrollment permissions — Allow email ending in `@yourcompany.com` với IdP vừa nối. Nếu bỏ bước này, client báo “not allowed to enroll.” Cài WARP/Cloudflare One Client, chọn login to Cloudflare Zero Trust (không phải consumer 1.1.1.1), nhập team name, đăng nhập IdP. Dashboard phải hiện thiết bị Connected.',
              en: 'Before installing: Settings → WARP Client → Device enrollment permissions — Allow emails ending in `@yourcompany.com` with the IdP you connected. Skip this and the client says “not allowed to enroll.” Install the WARP / Cloudflare One Client, choose login to Cloudflare Zero Trust (not consumer 1.1.1.1), enter the team name, and sign in via IdP. The dashboard should list the device as Connected.',
            },
            tip: {
              vi: 'App chính thức là Cloudflare One Client; menu và binary vẫn ghi WARP — cùng một thứ. Cài root CA trước khi bật HTTP inspection.',
              en: 'The official name is Cloudflare One Client; menus and the binary still say WARP — same app. Install the root CA before you turn on HTTP inspection.',
            },
            hubLink: '/use-cases/secure-remote-users',
          },
          {
            title: { vi: 'Device profiles, split tunnel và BYOD', en: 'Device profiles, split tunnel, and BYOD' },
            body: {
              vi: 'Laptop công ty: Default profile → Gateway with WARP, Switch Locked on, Auto connect 1 phút. Split tunnel Exclude (full protection). BYOD: profile riêng, Include mode chỉ company apps/networks — Exclude trên máy cá nhân đưa browsing cá nhân qua công ty. Profile cụ thể đặt trên profile rộng. Prefer CIDR hơn domain trong split tunnel.',
              en: 'Company laptops: Default profile → Gateway with WARP, Switch Locked on, Auto connect 1 minute. Split tunnel Exclude (full protection). BYOD: a separate profile in Include mode listing only company apps/networks — Exclude on personal devices routes private browsing through the company. Put specific profiles above broad ones. Prefer CIDRs over domains in split tunnel lists.',
            },
            tip: {
              vi: 'Đổi Exclude ↔ Include xóa danh sách — copy entries trước. Local Domain Fallback không đi qua Gateway (mất log/filter).',
              en: 'Switching Exclude ↔ Include wipes the list — copy entries first. Local Domain Fallback bypasses Gateway (no logs or filtering).',
            },
          },
          {
            title: { vi: 'Device posture checks', en: 'Device posture checks' },
            body: {
              vi: 'Tạo check tái sử dụng (disk encryption, firewall, OS version, client certificate, EDR). Gắn vào Access và/hoặc Gateway. Posture được đánh giá lại liên tục — thiết bị hết compliant mất quyền. Tanium không dùng được trong Gateway policy (chỉ Access). Service-token enrollment không match selector identity — dùng OS hoặc managed network.',
              en: 'Create reusable checks (disk encryption, firewall, OS version, client certificate, EDR). Attach them to Access and/or Gateway. Posture is re-evaluated continuously — a device that drops out of compliance loses access. Tanium is not supported in Gateway policies (Access only). Service-token enrollment cannot match identity selectors — use OS or managed network instead.',
            },
            tip: {
              vi: 'Gói check phổ biến vào Access Group để một thay đổi áp dụng mọi app.',
              en: 'Bundle common checks into an Access Group so one change applies across apps.',
            },
          },
        ],
      },
      {
        id: 'c1-4',
        title: { vi: 'Phần 4: ZTNA — Access và connectors', en: 'Part 4: ZTNA — Access and connectors' },
        description: {
          vi: 'Publish app theo identity, không theo toàn mạng — Tunnel outbound, policy group, Mesh/Appliance khi cần site-to-site.',
          en: 'Publish apps by identity, not by whole network — outbound Tunnel, group policies, Mesh/Appliance when you need site-to-site.',
        },
        duration: { vi: '~60 phút', en: '~60 min' },
        lessons: [
          {
            title: { vi: 'Tunnel outbound và public hostname', en: 'Outbound Tunnel and public hostname' },
            body: {
              vi: 'Networks → Tunnels → Create cloudflared. Chạy connector trên host reach được app (outbound TCP 7844). Token là secret. Map public hostname (ví dụ `wiki.yourcompany.com`) → `localhost:port`. Checkpoint: connector Healthy. Cần zone trên Cloudflare cho hostname tự host.',
              en: 'Networks → Tunnels → Create cloudflared. Run the connector on a host that can reach the app (outbound TCP 7844). The install token is a secret. Map a public hostname (for example `wiki.yourcompany.com`) → `localhost:port`. Checkpoint: connector Healthy. You need a Cloudflare zone for a self-hosted hostname.',
            },
            tip: {
              vi: 'Đặt tên tunnel theo location (`datacenter-1`). HA = thêm connector vào cùng tunnel.',
              en: 'Name the tunnel after the location (`datacenter-1`). HA = add another connector to the same tunnel.',
            },
            hubLink: '/use-cases/replace-vpn',
          },
          {
            title: { vi: 'Access application và policy theo group', en: 'Access application and group policies' },
            body: {
              vi: 'Access controls → Applications → Self-hosted. Cùng hostname với Tunnel. Session 24h (ngắn hơn cho app nhạy cảm). Policy Allow: email ending in / IdP group + posture nếu cần. Instant auth khi một IdP; Authenticate with Cloudflare One Client cho user đã enroll. Dùng Access Group / rule group, không Allow Everyone.',
              en: 'Access controls → Applications → Self-hosted. Same hostname as the Tunnel. Session 24h (shorter for sensitive apps). Allow policy: emails ending in / IdP group + posture if needed. Instant auth with a single IdP; Authenticate with Cloudflare One Client for already-enrolled users. Use Access Groups / rule groups — not Allow Everyone.',
            },
            tip: {
              vi: 'App có iframe/nhiều hostname — khai báo nhiều domain trong một Access application. IaC (Terraform) khi số app tăng.',
              en: 'Apps with iframes or many hostnames — list multiple domains in one Access application. Use IaC (Terraform) as the app count grows.',
            },
            hubLink: '/use-cases/replace-vpn',
          },
          {
            title: { vi: 'Chọn connector: Tunnel, Mesh hay Appliance', en: 'Pick a connector: Tunnel, Mesh, or Appliance' },
            body: {
              vi: 'Tunnel: app/server và CIDR riêng, một chiều tới Cloudflare. Mesh (ex-WARP Connector): any-to-any giữa host/device/site. Appliance: cả chi nhánh. Có thể kết hợp. Host tunnel phải ra được Cloudflare:7844.',
              en: 'Tunnel: apps/servers and private CIDRs, one-way to Cloudflare. Mesh (formerly WARP Connector): any-to-any between hosts, devices, and sites. Appliance: a whole branch. They can be combined. Tunnel hosts must reach Cloudflare on 7844.',
            },
            tip: {
              vi: 'Quy tắc: Tunnel cho app, Mesh cho host-to-host, Appliance cho cả site — đừng dùng Tunnel inbound thay outbound.',
              en: 'Rule of thumb: Tunnel for apps, Mesh for host-to-host, Appliance for a whole site — never replace outbound Tunnel with inbound ports.',
            },
          },
        ],
      },
      {
        id: 'c1-5',
        title: { vi: 'Phần 5: Gateway — lọc web và Shadow IT', en: 'Part 5: Gateway — web filtering and Shadow IT' },
        description: {
          vi: 'DNS trước, rồi Network, rồi HTTP/TLS. Egress, Browser Isolation và khám phá SaaS/AI khi đã ổn định.',
          en: 'DNS first, then Network, then HTTP/TLS. Add egress, Browser Isolation, and SaaS/AI discovery once that is stable.',
        },
        duration: { vi: '~90 phút', en: '~90 min' },
        lessons: [
          {
            title: { vi: 'Gateway theo lớp: DNS → Network → HTTP', en: 'Gateway in layers: DNS → Network → HTTP' },
            body: {
              vi: 'DNS policies: Block Security Categories (malware, phishing, C2, cryptomining…). Test `malware.testcategory.com` — phải ra block page. Rồi Network, rồi HTTP với TLS decryption (cần root CA). Do Not Inspect cho cert-pinning và Microsoft 365. Start log/monitor rồi mới Block hàng loạt.',
              en: 'DNS policies: Block Security Categories (malware, phishing, C2, cryptomining…). Test `malware.testcategory.com` — you should hit a block page. Then Network, then HTTP with TLS decryption (needs the root CA). Do Not Inspect for certificate pinning and Microsoft 365. Start in log/monitor before wide Blocks.',
            },
            tip: {
              vi: 'DNS Locations bảo vệ office không cần client. HTTP inspection là engine cho DLP và AI prompt scanning.',
              en: 'DNS Locations protect offices without the client. HTTP inspection is the engine for DLP and AI prompt scanning.',
            },
            hubLink: '/use-cases/secure-remote-users',
          },
          {
            title: { vi: 'Egress policies và phiên bản IP', en: 'Egress policies and IP version' },
            body: {
              vi: 'Dedicated egress IPs khi SaaS allowlist theo IP công ty. Policy egress theo identity/group. Tắt IPv6 trên profile nếu destination dual-stack làm lệch IP allowlist. Kiểm tra IP thoát trên pilot device sau khi bật.',
              en: 'Dedicated egress IPs when SaaS allowlists your company IPs. Scope egress policies by identity/group. Disable IPv6 on the profile if dual-stack destinations bypass the allowlist. Verify the egress IP on a pilot device after enabling.',
            },
          },
          {
            title: { vi: 'Remote Browser Isolation (RBI)', en: 'Remote Browser Isolation (RBI)' },
            body: {
              vi: 'Cô lập browsing rủi ro trên browser remote — clipboard, upload, print có thể tắt. Clientless cho contractor/BYOD không cài client (không có device posture). Dùng cho upload AI rủi ro cao hoặc site untrusted. Test user journey trước khi isolate cả category.',
              en: 'Isolate risky browsing in a remote browser — clipboard, upload, and print can be disabled. Clientless covers contractors/BYOD with no client (no device posture). Use it for high-risk AI uploads or untrusted sites. Test the user journey before isolating a whole category.',
            },
            hubLink: '/cheatsheets/ai-protection-portfolio#swg-rbi',
          },
          {
            title: { vi: 'Shadow IT và khám phá AI SaaS', en: 'Shadow IT and AI SaaS discovery' },
            body: {
              vi: 'CASB / Shadow IT: inventory SaaS và AI tools đang dùng, owner và độ nhạy dữ liệu. Đừng block mù khi chưa có sanctioned alternative — người dùng sẽ sang điện thoại và bạn mất visibility. Discover → allow có guardrail / isolate / block có chủ đích.',
              en: 'CASB / Shadow IT: inventory SaaS and AI tools in use, owners, and data sensitivity. Do not blind-block without a sanctioned alternative — people switch to phones and you lose visibility. Discover → allow with guardrails / isolate / block on purpose.',
            },
            hubLink: '/cheatsheets/ai-protection-portfolio#casb',
          },
        ],
      },
      {
        id: 'c1-6',
        title: { vi: 'Phần 6: DLP — bảo vệ dữ liệu', en: 'Part 6: DLP — data protection' },
        description: {
          vi: 'Phát hiện PII, secret, source code trên HTTP đã giải mã — monitor trước, block sau. Thường cần Enterprise.',
          en: 'Detect PII, secrets, and source code on decrypted HTTP — monitor first, block second. Typically Enterprise.',
        },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          {
            title: { vi: 'DLP profile và chạy log-only', en: 'DLP profiles and log-only' },
            body: {
              vi: 'Cần TLS decryption (Mô-đun 5). DLP Profiles: Credentials and Secrets, Financial, PII, Source Code — hoặc custom regex/dictionary. Confidence Medium; tăng nếu noisy. HTTP policy Allow + DLP profile trên mọi destination = log-only 1–2 tuần. Tune false positive trước Block.',
              en: 'Needs TLS decryption (Part 5). DLP Profiles: Credentials and Secrets, Financial, PII, Source Code — or custom regex/dictionaries. Confidence Medium; raise it if noisy. HTTP policy Allow + DLP profile on all destinations = log-only for 1–2 weeks. Tune false positives before Block.',
            },
            tip: {
              vi: 'Vàng cho DLP: monitor first, block second. Block ngay gây false positive và ticket.',
              en: 'Golden rule for DLP: monitor first, block second. Immediate Block floods false positives and tickets.',
            },
          },
          {
            title: { vi: 'Enforce trên destination rủi ro cao', en: 'Enforce on high-risk destinations' },
            body: {
              vi: 'Sau baseline: Block (hoặc Isolate) khi DLP match tới unsanctioned file sharing / AI / personal email. Giữ Allow+log cho destination đã phê duyệt. Gắn profile tái sử dụng; sửa một profile là mọi policy đổi. Review DLP logs theo cadence.',
              en: 'After a baseline: Block (or Isolate) on DLP match to unsanctioned file sharing / AI / personal email. Keep Allow+log for sanctioned destinations. Reuse profiles; editing one profile updates every policy. Review DLP logs on a cadence.',
            },
            hubLink: '/use-cases/govern-enterprise-ai',
          },
        ],
      },
      {
        id: 'c1-7',
        title: { vi: 'Phần 7: Kiểm soát AI, MCP và crawler', en: 'Part 7: AI controls, MCP, and crawlers' },
        description: {
          vi: 'Govern AI workforce (đừng cấm), MCP portals, AI Gateway cho app/agent, và AI crawler trên content public.',
          en: 'Govern workforce AI (do not ban), MCP portals, AI Gateway for apps/agents, and AI crawlers on your public content.',
        },
        duration: { vi: '~70 phút', en: '~70 min' },
        lessons: [
          {
            title: { vi: 'Govern AI: thấy, cho phép an toàn, chặn data leak', en: 'Govern AI: see it, allow safely, stop data leaks' },
            body: {
              vi: 'Cấm ChatGPT khiến người dùng sang điện thoại — mất visibility. Dùng Gateway/CASB để thấy tool, allow sanctioned với DLP trên prompt, RBI cho upload rủi ro, block hoặc isolate tool không phê duyệt. Suite: Shadow AI (5d) → control apps → DLP prompts → MCP agents → AI Gateway cho app bạn build.',
              en: 'Banning ChatGPT pushes people onto phones — you lose visibility. Use Gateway/CASB to see tools, allow sanctioned ones with DLP on prompts, RBI for risky uploads, and block or isolate unsanctioned tools. Suite: Shadow AI (5d) → control apps → DLP prompts → MCP agents → AI Gateway for apps you build.',
            },
            tip: {
              vi: 'Golden rule: govern, don’t ban.',
              en: 'Golden rule: govern, don’t ban.',
            },
            hubLink: '/cheatsheets/ai-protection-portfolio#radar-sase',
          },
          {
            title: { vi: 'MCP portals: Access cho AI agents', en: 'MCP portals: Access for AI agents' },
            body: {
              vi: 'Đưa MCP server nội bộ sau Access; portal một URL với tool đã curate, identity per-user và log. Managed OAuth chỉ khi server validate JWT Access (`Cf-Access-Jwt-Assertion`). Policy trên portal chỉ ẩn tool — enforce thật = Access làm OAuth provider. Agent tự trị dùng service token; tool call vào Access/Gateway logs.',
              en: 'Put internal MCP servers behind Access; one portal URL with curated tools, per-user identity, and logs. Enable Managed OAuth only if the server validates the Access JWT (`Cf-Access-Jwt-Assertion`). Portal policies only hide tools — real enforcement is Access as the OAuth provider. Autonomous agents use service tokens; tool calls land in Access/Gateway logs.',
            },
            hubLink: '/cheatsheets/ai-protection-portfolio#ai-gateway',
          },
          {
            title: { vi: 'AI Gateway: auth, DLP, cost cho model call', en: 'AI Gateway: auth, DLP, and cost for model calls' },
            body: {
              vi: 'AI Gateway ngồi trước model provider — không cần WARP hay TLS decrypt. Authenticated Gateway + token; BYOK để key không nằm trong app. Guardrails = an toàn nội dung; DLP = PII/secret (Enterprise). Response scanning buffer full body (chậm streaming). Không cache/rate-limit gateway dùng cho AI Search/RAG.',
              en: 'AI Gateway sits in front of model providers — no WARP or TLS decrypt required. Authenticated Gateway + token; BYOK so keys never live in the app. Guardrails = content safety; DLP = PII/secrets (Enterprise). Response scanning buffers the full body (hurts streaming). Do not cache or rate-limit a gateway used for AI Search/RAG.',
            },
          },
          {
            title: { vi: 'Agentic Internet: AI crawler trên site của bạn', en: 'Agentic Internet: AI crawlers on your site' },
            body: {
              vi: 'AI Audit xem crawler nào hit content. Policy theo purpose (Training / Agent / Search): allow, block, hoặc block trên trang có ads. Default mới (domain mới từ 15 Sep 2026): Training/Agent blocked trên trang ads; Search allowed. Enforce robots.txt; Pay Per Crawl trả 402 nếu crawler chưa đồng ý trả. Lớp inbound — tách với SWG cho nhân viên.',
              en: 'AI Audit shows which crawlers hit your content. Policy by purpose (Training / Agent / Search): allow, block, or block on pages with ads. New defaults (new domains from 15 Sep 2026): Training/Agent blocked on ad pages; Search allowed. Enforce robots.txt; Pay Per Crawl returns 402 until the crawler agrees to pay. This is the inbound lane — separate from SWG for employees.',
            },
          },
        ],
      },
      {
        id: 'c1-8',
        title: { vi: 'Phần 8: Cloudflare WAN (tuỳ chọn)', en: 'Part 8: Cloudflare WAN (optional)' },
        description: {
          vi: 'Nối office, DC và cloud vào Cloudflare để cả site — không chỉ laptop WARP — được lọc và định tuyến. Enterprise; đụng production network.',
          en: 'Connect offices, DCs, and cloud to Cloudflare so whole sites — not only WARP laptops — are filtered and routed. Enterprise; this touches production networking.',
        },
        duration: { vi: '~90 phút', en: '~90 min' },
        lessons: [
          {
            title: { vi: 'On-ramp, MSS clamping và tunnel dư thừa', en: 'On-ramp, MSS clamping, and redundant tunnels' },
            body: {
              vi: 'Chọn GRE / IPsec / Connector / CNI. Làm MSS clamping trước — quên thì HTTP chạy còn HTTPS treo. Tạo hai tunnel, match PSK/lifetime trên firewall, health check Healthy. Một site trước; có console + rollback. IP overlap giữa site (`192.168.1.0/24` hai nơi) phá routing.',
              en: 'Choose GRE / IPsec / Connector / CNI. Do MSS clamping first — skip it and HTTP works while HTTPS hangs. Create two tunnels, match PSK/lifetime on the firewall, health checks Healthy. One site first; have console access and a rollback. Overlapping site IPs (`192.168.1.0/24` in two places) break routing.',
            },
            tip: {
              vi: 'Lịch maintenance window. BGP khi nhiều site thay đổi; static route cho site ổn định.',
              en: 'Schedule a maintenance window. Use BGP when many sites change; static routes for stable sites.',
            },
            hubLink: '/use-cases/secure-remote-users',
          },
          {
            title: { vi: 'Routing, Magic Firewall và gửi traffic qua Gateway', en: 'Routing, Magic Firewall, and sending traffic through Gateway' },
            body: {
              vi: 'Static hoặc BGP vào Magic routing table. Magic Firewall baseline. Gửi site traffic qua Gateway để DNS/HTTP/DLP giống user WARP. Test connectivity, HTTPS (MSS), failover tunnel, rồi mới retire MPLS/VPN site-to-site. Logpush Access+Gateway từ đầu.',
              en: 'Static or BGP into the Magic routing table. Magic Firewall baseline. Send site traffic through Gateway so DNS/HTTP/DLP match WARP users. Test connectivity, HTTPS (MSS), and tunnel failover before retiring MPLS/site-to-site VPN. Turn on Logpush for Access+Gateway from day one.',
            },
          },
        ],
      },
    ],
    recommendedSequence: {
      vi: [
        'Đọc kiến trúc + checklist (team name, pilot 5–25 user, app đầu tiên, plan tier)',
        'Tạo Cloudflare One, 2FA admin, Restrict Cloudflare IdP, break-glass Super Admin',
        'Kết nối IdP, Test email+groups, MFA tại IdP, SCIM khi sẵn sàng',
        'Enrollment permission → cài Cloudflare One Client trên laptop pilot',
        'Device profile (managed vs BYOD) + posture tái sử dụng',
        'Tunnel + Access cho một private app; Access Group thay snowflake',
        'Gateway DNS (block malware) → Network → HTTP/TLS với Do Not Inspect',
        'Shadow IT / AI discovery; DLP log-only rồi block destination rủi ro',
        'Govern AI (MCP, AI Gateway) — không cấm mù; crawler policy cho site public',
        'Tuỳ chọn: Cloudflare WAN một site, failover, rồi expand; retire VPN theo wave',
      ],
      en: [
        'Read architecture + checklist (team name, 5–25 user pilot, first app, plan tier)',
        'Create Cloudflare One, admin 2FA, restrict Cloudflare IdP, break-glass Super Admin',
        'Connect the IdP, Test email+groups, MFA at the IdP, SCIM when ready',
        'Enrollment permission → install Cloudflare One Client on a pilot laptop',
        'Device profiles (managed vs BYOD) + reusable posture',
        'Tunnel + Access for one private app; Access Groups instead of snowflakes',
        'Gateway DNS (block malware) → Network → HTTP/TLS with Do Not Inspect exceptions',
        'Shadow IT / AI discovery; DLP log-only then block high-risk destinations',
        'Govern AI (MCP, AI Gateway) — do not blind-ban; crawler policy for public sites',
        'Optional: Cloudflare WAN one site, prove failover, then expand; retire VPN in waves',
      ],
    },
    relatedUseCases: [
      { href: '/use-cases/replace-vpn/', label: { vi: 'Thay thế VPN', en: 'Replace VPN' } },
      { href: '/use-cases/secure-remote-users/', label: { vi: 'Kết nối user an toàn', en: 'Secure user connections' } },
      { href: '/use-cases/secure-saas-access/', label: { vi: 'Truy cập SaaS', en: 'Secure SaaS access' } },
      { href: '/use-cases/govern-enterprise-ai/', label: { vi: 'Quản trị AI doanh nghiệp', en: 'Govern enterprise AI' } },
    ],
    commonMistakes: {
      vi: [
        {
          title: 'Big-bang thay vì pilot → validate → expand',
          detail: 'Kiến trúc tham chiếu SASE khuyên 1–2 use case (thay VPN, rồi SWG). Mỗi phase: nhóm 5–25 user, rollback, rồi mới expand. Cutover một đêm gây outage.',
        },
        {
          title: 'Team name chọn bừa',
          detail: 'Team name thành `https://<name>.cloudflareaccess.com` — đổi sau phá login URL, Access app và enrollment. Chọn tên ngắn, bền trước Module 1.',
        },
        {
          title: 'Bỏ MFA tại IdP hoặc không Test group claims',
          detail: 'Access chỉ mạnh bằng IdP. Bật MFA ở Entra/Okta/Google và xác nhận Test hiện groups trước khi viết policy theo group.',
        },
        {
          title: 'TLS inspect / DLP / AI prompt scan không có Do Not Inspect',
          detail: 'HTTP inspection cần root CA. Cert-pinned apps và Microsoft 365 cần exception. DLP/AI chỉ thấy traffic đã decrypt. Log-only trước Block.',
        },
        {
          title: 'BYOD chạy Exclude / full tunnel',
          detail: 'Exclude trên máy cá nhân đưa browsing riêng tư qua công ty. BYOD dùng Include chỉ app/mạng công ty; managed laptop mới Exclude.',
        },
        {
          title: 'Mở inbound thay vì Tunnel outbound; không break-glass',
          detail: 'cloudflared chỉ cần outbound 7844. Giữ ≥2 Super Admin và Cloudflare login/OTP nếu Access bọc dashboard. Token API account-owned, có expiry.',
        },
        {
          title: 'Cấm AI thay vì govern',
          detail: 'Block ChatGPT đẩy usage sang điện thoại — mất log. Discover → allow có DLP/RBI → block có chủ đích. MCP cần Access làm OAuth, không chỉ ẩn trên portal.',
        },
      ],
      en: [
        {
          title: 'Big-bang instead of pilot → validate → expand',
          detail: 'The SASE reference architecture recommends one or two use cases (VPN replacement, then SWG). Each phase: 5–25 users, a rollback, then expand. Overnight cutovers cause outages.',
        },
        {
          title: 'Picking the team name casually',
          detail: 'The team name becomes `https://<name>.cloudflareaccess.com` — changing it later breaks login URLs, Access apps, and enrollment. Choose a short, durable name before Module 1.',
        },
        {
          title: 'Skipping MFA at the IdP or not Testing group claims',
          detail: 'Access is only as strong as your IdP. Require MFA in Entra/Okta/Google and confirm Test shows groups before writing group-based policies.',
        },
        {
          title: 'TLS inspect / DLP / AI prompt scan without Do Not Inspect',
          detail: 'HTTP inspection needs the root CA. Certificate-pinned apps and Microsoft 365 need exceptions. DLP/AI only see decrypted traffic. Log-only before Block.',
        },
        {
          title: 'BYOD on Exclude / full tunnel',
          detail: 'Exclude on personal devices routes private browsing through the company. BYOD uses Include for company apps/networks only; managed laptops use Exclude.',
        },
        {
          title: 'Inbound ports instead of outbound Tunnel; no break-glass',
          detail: 'cloudflared only needs outbound 7844. Keep ≥2 Super Admins and Cloudflare login/OTP if Access wraps the dashboard. Use account-owned API tokens with expiry.',
        },
        {
          title: 'Banning AI instead of governing it',
          detail: 'Blocking ChatGPT pushes usage onto phones — you lose logs. Discover → allow with DLP/RBI → block on purpose. MCP needs Access as OAuth, not merely hiding tools on a portal.',
        },
      ],
    },
    cta: { href: '/use-cases/cloudflare-one', label: { vi: 'Tình huống Cloudflare One', en: 'Cloudflare One use cases' } },
  },
  {
    slug: 'ai-security-adoption',
    title: { vi: 'AI Security & Adoption', en: 'AI Security & Adoption' },
    headline: { vi: 'Adopt AI an toàn từ user đến ứng dụng', en: 'Adopt AI safely from users to applications' },
    promise: { vi: 'Quản trị Shadow AI, bảo vệ data và ship AI app có kiểm soát.', en: 'Govern Shadow AI, protect data, and ship controlled AI applications.' },
    description: { vi: 'Lộ trình riêng cho AI adoption kết hợp SASE controls (CASB, SWG, RBI, DLP) với AI Gateway, WAF và agent/RAG security.', en: 'A dedicated AI-adoption path combining SASE controls (CASB, SWG, RBI, DLP) with AI Gateway, WAF, and agent/RAG security.' },
    whoIsThisFor: { vi: 'Security, IT, platform và application teams cùng triển khai AI.', en: 'Security, IT, platform, and application teams rolling out AI together.' },
    mentalModel: { vi: 'User/device → Zero Trust policy → sanctioned AI → AI Gateway/app controls → model/tool/data.', en: 'User/device → Zero Trust policy → sanctioned AI → AI Gateway/app controls → model/tool/data.' },
    outcomes: { vi: ['Inventory Shadow AI và policy theo risk', 'Áp SWG/RBI/CASB/DLP cho AI SaaS', 'Bảo vệ AI app với Gateway, WAF và bot controls', 'Thiết kế RAG/agent có authorization rõ ràng'], en: ['Inventory Shadow AI and policy by risk', 'Apply SWG/RBI/CASB/DLP to AI SaaS', 'Protect AI apps with Gateway, WAF, and bot controls', 'Design RAG/agents with clear authorization'] },
    keyConcepts: ['Shadow AI', 'CASB', 'SWG', 'RBI', 'DLP', 'AI Gateway', 'Firewall for AI', 'RAG', 'Agents'],
    modules: [
      { id: 'asa-1', title: { vi: 'Phần 1: Quản trị AI doanh nghiệp', en: 'Part 1: Enterprise AI governance' }, description: { vi: 'Visibility, policy và SaaS controls.', en: 'Visibility, policy, and SaaS controls.' }, lessons: [
        { title: { vi: 'CASB: Shadow AI và posture', en: 'CASB: Shadow AI and posture' }, body: { vi: 'Inventory AI SaaS, review token/user findings và remediation theo data sensitivity.', en: 'Inventory AI SaaS, review token/user findings, and remediate by data sensitivity.' }, hubLink: '/cheatsheets/ai-protection-portfolio#casb' },
        { title: { vi: 'SWG và RBI cho web AI', en: 'SWG and RBI for web AI' }, body: { vi: 'Discover, allow/block/steer AI destinations; isolate browsing/upload risk cao.', en: 'Discover, allow/block/steer AI destinations; isolate high-risk browsing/uploads.' }, hubLink: '/cheatsheets/ai-protection-portfolio#swg-rbi' },
      ]},
      { id: 'asa-2', title: { vi: 'Phần 2: AI application controls', en: 'Part 2: AI application controls' }, description: { vi: 'Gateway, WAF và security baseline.', en: 'Gateway, WAF, and the security baseline.' }, lessons: [
        { title: { vi: 'AI Gateway: routing và audit', en: 'AI Gateway: routing and audit' }, body: { vi: 'Route provider, observe usage và apply guardrails mà không đưa credential ra client.', en: 'Route providers, observe usage, and apply guardrails without exposing credentials to clients.' }, hubLink: '/cheatsheets/ai-protection-portfolio#ai-gateway' },
        { title: { vi: 'WAF, bots và prompt protection', en: 'WAF, bots, and prompt protection' }, body: { vi: 'Treat model output as untrusted; validate tools, rate limit endpoint và apply Firewall for AI policies.', en: 'Treat model output as untrusted; validate tools, rate-limit endpoints, and apply Firewall for AI policies.' }, hubLink: '/cheatsheets/ai-protection-portfolio#app-security' },
      ]},
      { id: 'asa-3', title: { vi: 'Phần 3: Build AI có trách nhiệm', en: 'Part 3: Build AI responsibly' }, description: { vi: 'RAG và agent với data/tool boundaries.', en: 'RAG and agents with data/tool boundaries.' }, lessons: [
        { title: { vi: 'RAG với Vectorize và access scope', en: 'RAG with Vectorize and access scope' }, body: { vi: 'Authorize trước retrieval; metadata ACL và source citation không phải optional.', en: 'Authorize before retrieval; ACL metadata and source citation are not optional.' } },
        { title: { vi: 'Agents, tools và least privilege', en: 'Agents, tools, and least privilege' }, body: { vi: 'Tool nhỏ, typed, auditable; model không được tự cấp quyền hay secret.', en: 'Tools should be small, typed, and auditable; a model must not grant itself access or secrets.' } },
      ]},
    ],
    recommendedSequence: { vi: ['Inventory Shadow AI', 'Pilot Access/SWG', 'Add CASB/DLP', 'Govern app-owned AI with Gateway/WAF', 'Build RAG/agents with scoped tools'], en: ['Inventory Shadow AI', 'Pilot Access/SWG', 'Add CASB/DLP', 'Govern app-owned AI with Gateway/WAF', 'Build RAG/agents with scoped tools'] },
    relatedUseCases: [{ href: '/use-cases/govern-enterprise-ai/', label: { vi: 'Quản trị AI doanh nghiệp', en: 'Govern enterprise AI' } }, { href: '/use-cases/build-ai-applications/', label: { vi: 'Build AI app', en: 'Build AI app' } }],
    cta: { href: '/cheatsheets/ai-protection-portfolio', label: { vi: 'Mở AI protection cheatsheet', en: 'Open AI protection cheatsheet' } },
  },
  {
    slug: 'operational-excellence',
    title: { vi: 'Operational Excellence', en: 'Operational Excellence' },
    headline: { vi: 'Vận hành Cloudflare an toàn, ổn định và hiệu quả', en: 'Operate Cloudflare safely, reliably, and efficiently' },
    promise: { vi: 'Biến signals thành quyết định: observe, respond, release, recover và improve.', en: 'Turn signals into decisions: observe, respond, release, recover, and improve.' },
    description: { vi: 'Lộ trình cross-product cho DevOps, SRE, IT và platform teams: observability, incident response, release safety, resilience, performance và cost.', en: 'A cross-product path for DevOps, SRE, IT, and platform teams: observability, incident response, release safety, resilience, performance, and cost.' },
    whoIsThisFor: { vi: 'DevOps/SRE, IT admin, platform engineer hoặc technical lead đã có workload trên Cloudflare.', en: 'DevOps/SRE, IT admins, platform engineers, or technical leads with workloads on Cloudflare.' },
    mentalModel: { vi: 'Signals → triage → runbook → safe change → verify → learn. Dùng dashboard, logs và status để giảm thời gian phát hiện/phục hồi, không chỉ “xem metric”.', en: 'Signals → triage → runbook → safe change → verify → learn. Use dashboards, logs, and status to reduce detection/recovery time, not merely to “view metrics”.' },
    outcomes: { vi: ['Thiết kế signals và logs hữu ích cho zone, Worker, Zero Trust và AI', 'Triage incident với status, Security Events và runbook', 'Release có preview, rollback, purge/cache plan và secret hygiene', 'Lập kế hoạch resilience, performance và cost review định kỳ'], en: ['Design useful signals and logs for zones, Workers, Zero Trust, and AI', 'Triage incidents with status, Security Events, and runbooks', 'Release with preview, rollback, purge/cache plans, and secret hygiene', 'Plan resilience, performance, and recurring cost reviews'] },
    keyConcepts: ['Observability', 'Logpush', 'Runbooks', 'Rollback', 'Health checks', 'Core Web Vitals', 'SLOs', 'Cost'],
    tools: [
      {
        title: { vi: 'Trợ lý viết Support case', en: 'Support case assistant' },
        description: {
          vi: 'Khi cần mở ticket với Cloudflare Support: mô tả lỗi hoặc dán screenshot, công cụ gợi ý nguyên nhân, hướng dẫn kiểm tra và thu thập bằng chứng theo mức ưu tiên P1–P4, rồi tạo bản nháp case (EN/VI). Hợp với bước incident response và runbook. Dữ liệu chỉ nằm trong trình duyệt — không nhập secret/API key.',
          en: 'When you need to open a Cloudflare Support ticket: describe the error or attach a screenshot; it suggests likely causes, guides your checks, collects P1–P4 evidence, and generates a case draft (EN/VI). Pairs with the incident-response and runbook steps. Data stays in your browser — never enter secrets/API keys.',
        },
        href: 'https://helpr.orangecloud.vn/',
      },
    ],
    modules: [
      { id: 'oe-1', title: { vi: 'Phần 1: Observability & logging', en: 'Part 1: Observability & logging' }, description: { vi: 'Signals từ traffic, application, security và AI.', en: 'Signals from traffic, applications, security, and AI.' }, duration: { vi: '~60 phút', en: '~60 min' }, lessons: [
        { title: { vi: 'Zone và traffic analytics', en: 'Zone and traffic analytics' }, body: { vi: 'Chọn baseline cho traffic, cache hit/miss, 4xx/5xx và latency trước khi đặt alert.', en: 'Establish baselines for traffic, cache hit/miss, 4xx/5xx, and latency before creating alerts.' }, hubLink: '/content-delivery#measure' },
        { title: { vi: 'Workers/Pages logs và traces', en: 'Workers/Pages logs and traces' }, body: { vi: 'Dùng structured logs, request ID và traces để nối lỗi user-facing với code path.', en: 'Use structured logs, request IDs, and traces to connect user-facing errors to code paths.' } },
        { title: { vi: 'Security Events và Logpush', en: 'Security Events and Logpush' }, body: { vi: 'Triage WAF, DDoS và bot events; export log khi cần retention hoặc correlation bên ngoài.', en: 'Triage WAF, DDoS, and bot events; export logs when you need retention or external correlation.' } },
        { title: { vi: 'AI Gateway usage signals', en: 'AI Gateway usage signals' }, body: { vi: 'Theo dõi model, latency, error và cost signal mà không log prompt nhạy cảm không cần thiết.', en: 'Track model, latency, error, and cost signals without unnecessarily logging sensitive prompts.' } },
      ]},
      { id: 'oe-2', title: { vi: 'Phần 2: Incident response', en: 'Part 2: Incident response' }, description: { vi: 'Triage có bằng chứng và giao tiếp rõ ràng.', en: 'Evidence-based triage and clear communication.' }, duration: { vi: '~50 phút', en: '~50 min' }, lessons: [
        { title: { vi: 'Status và correlation', en: 'Status and correlation' }, body: { vi: 'Khi error spike, kiểm tra Cloudflare Status cùng metric và deployment timeline trước khi kết luận root cause.', en: 'When errors spike, check Cloudflare Status alongside metrics and deployment timelines before concluding root cause.' }, hubLink: '/status' },
        { title: { vi: 'Triage security incident', en: 'Triage a security incident' }, body: { vi: 'Phân biệt attack, false positive và app regression; preserve evidence trước khi thay policy.', en: 'Separate attacks, false positives, and app regressions; preserve evidence before changing policy.' } },
        { title: { vi: 'Runbook và stakeholder communication', en: 'Runbooks and stakeholder communication' }, body: { vi: 'Define owner, severity, update cadence, rollback criteria và post-incident actions trước incident tiếp theo.', en: 'Define owners, severity, update cadence, rollback criteria, and post-incident actions before the next incident.' } },
      ]},
      { id: 'oe-3', title: { vi: 'Phần 3: Release & deployment safety', en: 'Part 3: Release & deployment safety' }, description: { vi: 'Ship nhanh nhưng reversible.', en: 'Ship quickly while staying reversible.' }, duration: { vi: '~45 phút', en: '~45 min' }, lessons: [
        { title: { vi: 'Preview → production → rollback', en: 'Preview → production → rollback' }, body: { vi: 'Test preview URL, define production checks và giữ rollback path rõ ràng trước release.', en: 'Test preview URLs, define production checks, and keep a clear rollback path before release.' } },
        { title: { vi: 'Environment, secrets và change control', en: 'Environments, secrets, and change control' }, body: { vi: 'Tách config theo environment; secret không nằm trong source; log ai thay đổi gì và khi nào.', en: 'Separate configuration by environment; never place secrets in source; record who changed what and when.' } },
        { title: { vi: 'Cache purge và coordinated release', en: 'Cache purge and coordinated release' }, body: { vi: 'Version asset, purge đúng scope và kiểm tra cache behavior sau frontend/API release.', en: 'Version assets, purge the right scope, and verify cache behavior after frontend/API releases.' } },
      ]},
      { id: 'oe-4', title: { vi: 'Phần 4: Resilience & availability', en: 'Part 4: Resilience & availability' }, description: { vi: 'Giảm blast radius và phục hồi nhanh.', en: 'Reduce blast radius and recover quickly.' }, duration: { vi: '~45 phút', en: '~45 min' }, lessons: [
        { title: { vi: 'Health checks và load balancing', en: 'Health checks and load balancing' }, body: { vi: 'Định nghĩa health signal có ý nghĩa cho user và test failover trước khi cần dùng.', en: 'Define health signals meaningful to users and test failover before you need it.' } },
        { title: { vi: 'DDoS và availability patterns', en: 'DDoS and availability patterns' }, body: { vi: 'Kết hợp proxy, DDoS protection, WAF/rate limit và origin hardening để giữ service available.', en: 'Combine proxying, DDoS protection, WAF/rate limiting, and origin hardening to keep services available.' } },
        { title: { vi: 'Rollout theo wave', en: 'Wave-based rollout' }, body: { vi: 'Mở rộng policy hoặc Zero Trust deployment theo nhóm nhỏ, feedback loop và rollback plan.', en: 'Expand policy or Zero Trust deployments through small groups, feedback loops, and rollback plans.' } },
      ]},
      { id: 'oe-5', title: { vi: 'Phần 5: Performance & cost', en: 'Part 5: Performance & cost' }, description: { vi: 'Review liên tục thay vì tối ưu một lần.', en: 'Continuously review instead of optimizing once.' }, duration: { vi: '~40 phút', en: '~40 min' }, lessons: [
        { title: { vi: 'Core Web Vitals và cache metrics', en: 'Core Web Vitals and cache metrics' }, body: { vi: 'Đo LCP/FCP/CLS, hit ratio và origin request để ưu tiên công việc performance.', en: 'Measure LCP/FCP/CLS, hit ratio, and origin requests to prioritize performance work.' }, hubLink: '/content-delivery#measure' },
        { title: { vi: 'Plan sizing và cost drivers', en: 'Plan sizing and cost drivers' }, body: { vi: 'Review usage, product limits và cost driver trước khi scale workload hoặc bật add-on.', en: 'Review usage, product limits, and cost drivers before scaling workloads or enabling add-ons.' }, hubLink: '/plans' },
        { title: { vi: 'Operational review cadence', en: 'Operational review cadence' }, body: { vi: 'Lập monthly review cho changelog, incidents, policy exceptions, SLO và backlog reliability.', en: 'Create a monthly review for changelog, incidents, policy exceptions, SLOs, and reliability backlog.' }, hubLink: '/changelog' },
      ]},
    ],
    recommendedSequence: { vi: ['Thiết lập baseline signals', 'Viết runbook cho incident phổ biến', 'Chuẩn hóa preview/release/rollback', 'Test health/failover', 'Review performance và cost định kỳ'], en: ['Establish baseline signals', 'Write runbooks for common incidents', 'Standardize preview/release/rollback', 'Test health/failover', 'Review performance and cost regularly'] },
    relatedUseCases: [{ href: '/use-cases/operate-cloudflare-workloads/', label: { vi: 'Vận hành workload Cloudflare', en: 'Operate Cloudflare workloads' } }, { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Tăng tốc content delivery', en: 'Accelerate content delivery' } }, { href: '/use-cases/defend-ddos-attacks/', label: { vi: 'Giữ service online khi DDoS', en: 'Keep services online during DDoS' } }],
    cta: { href: '/status', label: { vi: 'Xem system status', en: 'View system status' } },
  },
];

export function getTrack(slug: Track['slug']) {
  const t = tracks.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown track: ${slug}`);
  return t;
}

export function getOtherTracks(slug: Track['slug']): Track[] {
  return tracks.filter((t) => t.slug !== slug);
}

export const ACTIVE_TRACK_STORAGE_KEY = 'cfhub_active_track';
