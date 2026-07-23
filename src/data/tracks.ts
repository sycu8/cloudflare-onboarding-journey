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

export type Track = {
  slug: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'ai-security-adoption';
  title: LocalizedString;
  headline: LocalizedString;
  promise: LocalizedString;
  description: LocalizedString;
  whoIsThisFor: LocalizedString;
  mentalModel: LocalizedString;
  outcomes: { vi: string[]; en: string[] };
  keyConcepts: string[];
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
      vi: 'Bảo vệ users, access, SaaS và mạng doanh nghiệp',
      en: 'Secure users, access, SaaS, and corporate networks',
    },
    promise: {
      vi: 'Bảo vệ users, access, SaaS và networks.',
      en: 'Secure users, access, SaaS, and networks.',
    },
    description: {
      vi: 'Lộ trình Zero Trust / SASE cho team cần bảo vệ nhân viên, remote work, SaaS và ứng dụng nội bộ — thay thế hoặc bổ sung VPN truyền thống.',
      en: 'A Zero Trust / SASE path for teams securing employees, remote work, SaaS, and internal apps — replacing or complementing traditional VPN.',
    },
    whoIsThisFor: {
      vi: 'IT admin, security team, hoặc founder cần kiểm soát ai truy cập app nội bộ/SaaS từ bên ngoài office.',
      en: 'IT admins, security teams, or founders who need to control access to internal/SaaS apps from outside the office.',
    },
    mentalModel: {
      vi: 'User/device → Cloudflare Zero Trust (identity + policy) → Private app / SaaS / Internet (qua SWG). Không mở toàn bộ mạng như VPN.',
      en: 'User/device → Cloudflare Zero Trust (identity + policy) → Private app / SaaS / Internet (via SWG). No full network access like VPN.',
    },
    outcomes: {
      vi: [
        'Kết nối identity provider (Google, Microsoft, Okta…)',
        'Publish app nội bộ đầu tiên với policy rõ ràng',
        'Pilot với nhóm user nhỏ trước khi rollout',
        'Hiểu SWG vs ZTNA vs CASB — dùng đúng công cụ',
        'Có checklist mở rộng DLP/CASB sau pilot',
      ],
      en: [
        'Connect an identity provider (Google, Microsoft, Okta…)',
        'Publish a first internal app with clear policies',
        'Pilot with a small user group before rollout',
        'Understand SWG vs ZTNA vs CASB — use the right tool',
        'Have a checklist to expand DLP/CASB after pilot',
      ],
    },
    keyConcepts: ['Zero Trust', 'ZTNA', 'SWG', 'CASB', 'DLP', 'Email security', 'Remote Browser Isolation', 'Cloudflare WAN'],
    modules: [
      {
        id: 'c1-1',
        title: { vi: 'Phần 1: Chuẩn bị Zero Trust', en: 'Part 1: Zero Trust preparation' },
        description: {
          vi: 'Inventory users, apps và identity trước khi cấu hình.',
          en: 'Inventory users, apps, and identity before configuring.',
        },
        duration: { vi: '~30 phút', en: '~30 min' },
        lessons: [
          {
            title: { vi: 'Liệt kê users và nhóm', en: 'List users and groups' },
            body: {
              vi: 'Ai cần truy cập gì: engineering, sales, contractor. Map với groups trong IdP để policy dễ quản lý.',
              en: 'Who needs what: engineering, sales, contractors. Map to IdP groups for easier policies.',
            },
          },
          {
            title: { vi: 'Danh sách ứng dụng: SaaS và private', en: 'App inventory: SaaS and private' },
            body: {
              vi: 'Ví dụ: Jira, Notion, internal admin, SSH bastion. Ưu tiên 1 app ít rủi ro cho pilot (internal wiki, staging).',
              en: 'Examples: Jira, Notion, internal admin, SSH bastion. Pick one low-risk app for pilot (internal wiki, staging).',
            },
            hubLink: '/use-cases/replace-vpn',
          },
        ],
      },
      {
        id: 'c1-2',
        title: { vi: 'Phần 2: ZTNA — thay thế VPN từng bước', en: 'Part 2: ZTNA — replace VPN step by step' },
        description: {
          vi: 'Cấp quyền theo application, không theo toàn mạng.',
          en: 'Grant access per application, not per entire network.',
        },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          {
            title: { vi: 'Kết nối Identity Provider', en: 'Connect your Identity Provider' },
            body: {
              vi: 'Tích hợp Google Workspace, Azure AD hoặc Okta. Bật MFA ở IdP trước khi enforce policy trên Cloudflare.',
              en: 'Integrate Google Workspace, Azure AD, or Okta. Enable MFA at the IdP before enforcing Cloudflare policies.',
            },
            hubLink: '/demo-guides#cloudflare-one',
          },
          {
            title: { vi: 'Policy: ai được vào app nào', en: 'Policies: who can access which app' },
            body: {
              vi: 'Ví dụ: group Eng → staging admin; group All → company wiki. Log mọi session để audit.',
              en: 'Example: Eng group → staging admin; All → company wiki. Log sessions for audit.',
            },
            hubLink: '/use-cases/replace-vpn',
          },
        ],
      },
      {
        id: 'c1-3',
        title: { vi: 'Phần 3: Secure browsing (SWG)', en: 'Part 3: Secure browsing (SWG)' },
        description: {
          vi: 'Kiểm soát Internet browsing cho remote users.',
          en: 'Control Internet browsing for remote users.',
        },
        duration: { vi: '~35 phút', en: '~35 min' },
        lessons: [
          {
            title: { vi: 'DNS filtering và malware', en: 'DNS filtering and malware' },
            body: {
              vi: 'Chặn category rủi ro, phishing domain. Kết hợp với agent WARP trên laptop user.',
              en: 'Block risky categories and phishing domains. Combine with the WARP agent on user laptops.',
            },
            hubLink: '/use-cases/secure-remote-users',
          },
          {
            title: { vi: 'CASB và DLP (khi sẵn sàng)', en: 'CASB and DLP (when ready)' },
            body: {
              vi: 'Sau khi ZTNA ổn định, thêm kiểm soát upload/download SaaS và dữ liệu nhạy cảm.',
              en: 'After ZTNA is stable, add controls for SaaS uploads/downloads and sensitive data.',
            },
          },
        ],
      },
      {
        id: 'c1-4',
        title: { vi: 'Phần 4: Mở rộng và vận hành', en: 'Part 4: Expand and operate' },
        description: {
          vi: 'Rollout rộng hơn và đo lường thành công.',
          en: 'Broader rollout and measuring success.',
        },
        duration: { vi: '~25 phút', en: '~25 min' },
        lessons: [
          {
            title: { vi: 'Mở rộng theo từng phòng ban', en: 'Expand department by department' },
            body: {
              vi: 'Tránh big-bang. Mỗi wave có support channel và rollback plan.',
              en: 'Avoid big-bang cutovers. Each wave needs a support channel and rollback plan.',
            },
          },
          {
            title: { vi: 'Chỉ số theo dõi', en: 'Metrics to track' },
            body: {
              vi: 'Số ticket VPN giảm, thời gian cấp quyền app mới, số sự cố malware. Review policy hàng quý.',
              en: 'Fewer VPN tickets, time to grant new app access, malware incidents. Review policies quarterly.',
            },
          },
        ],
      },
      {
        id: 'c1-5',
        title: { vi: 'Phần 5: Quản trị AI theo SASE', en: 'Part 5: Govern AI with SASE' },
        description: { vi: 'Shadow AI, SWG/RBI, CASB/DLP và rollout theo rủi ro.', en: 'Shadow AI, SWG/RBI, CASB/DLP, and risk-based rollout.' },
        duration: { vi: '~45 phút', en: '~45 min' },
        lessons: [
          { title: { vi: 'CASB: Shadow AI và SaaS posture', en: 'CASB: Shadow AI and SaaS posture' }, body: { vi: 'Inventory AI SaaS chưa được phê duyệt, review findings về token/user và ưu tiên remediation theo data sensitivity.', en: 'Inventory unsanctioned AI SaaS, review token/user findings, and prioritize remediation by data sensitivity.' }, hubLink: '/cheatsheets/ai-protection-portfolio#casb' },
          { title: { vi: 'SWG + RBI: kiểm soát web AI', en: 'SWG + RBI: govern web AI' }, body: { vi: 'Dùng policy web để discover, allow/block hoặc steer AI destinations; dùng Browser Isolation cho browsing hoặc upload risk cao.', en: 'Use web policy to discover, allow/block, or steer AI destinations; use Browser Isolation for high-risk browsing or uploads.' }, hubLink: '/cheatsheets/ai-protection-portfolio#swg-rbi' },
          { title: { vi: 'Radar, AI Gateway và rollout order', en: 'Radar, AI Gateway, and rollout order' }, body: { vi: 'Radar cung cấp intelligence, không enforce policy. Rollout identity/Access → SWG → CASB/DLP; app team dùng AI Gateway và WAF cho AI endpoint.', en: 'Radar provides intelligence, not policy enforcement. Roll out identity/Access → SWG → CASB/DLP; app teams use AI Gateway and WAF for AI endpoints.' }, hubLink: '/cheatsheets/ai-protection-portfolio#radar-sase' },
        ],
      },
    ],
    recommendedSequence: {
      vi: [
        'Xác định users và identity provider',
        'Liệt kê private apps và SaaS apps',
        'Chọn first use case: VPN replacement hoặc secure browsing',
        'Define access policies',
        'Test với một nhóm user nhỏ',
        'Mở rộng sang nhiều apps và users hơn',
        'Inventory Shadow AI và pilot SWG policy cho AI destinations',
        'Bổ sung DLP, CASB, email security hoặc network modernization',
      ],
      en: [
        'Identify users and identity provider',
        'List private apps and SaaS apps',
        'Choose first use case: VPN replacement or secure browsing',
        'Define access policies',
        'Test with a small user group',
        'Expand to more apps and users',
        'Inventory Shadow AI and pilot SWG policy for AI destinations',
        'Add DLP, CASB, email, or network modernization',
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
          title: 'Cutover VPN big-bang không pilot',
          detail: 'Rollout toàn công ty một đêm dễ gây outage. Pilot 1 app + 1 nhóm nhỏ; giữ VPN read-only song song vài tuần.',
        },
        {
          title: 'Access policy quá rộng (Allow Everyone)',
          detail: 'Zero Trust thất bại nếu policy như VPN cũ. Gắn quyền theo IdP group + app cụ thể; review policy hàng quý.',
        },
        {
          title: 'Bỏ qua MFA tại Identity Provider',
          detail: 'Access chỉ mạnh bằng IdP. Bật MFA bắt buộc ở Google/Azure/Okta trước khi enforce Cloudflare policy.',
        },
        {
          title: 'Bật CASB/DLP trước khi ZTNA ổn định',
          detail: 'Thêm quá nhiều lớp cùng lúc làm support quá tải. Xong Access + WARP pilot trước; CASB/DLP ở wave 2.',
        },
        {
          title: 'Không triển khai WARP trên mọi thiết bị user',
          detail: 'SWG/DNS policy không áp dụng nếu traffic không qua Cloudflare One client. MDM hoặc onboarding checklist cho laptop.',
        },
        {
          title: 'Tunnel inbound thay vì outbound `cloudflared`',
          detail: 'Mở port inbound vào datacenter tăng attack surface. Ưu tiên Tunnel outbound; firewall chỉ cho Cloudflare.',
        },
      ],
      en: [
        {
          title: 'Big-bang VPN cutover without a pilot',
          detail: 'Company-wide overnight cutovers cause outages. Pilot one app + small group; keep VPN read-only in parallel for weeks.',
        },
        {
          title: 'Overly broad Access policies (Allow Everyone)',
          detail: 'Zero Trust fails if policies mirror old VPN. Tie access to IdP groups + specific apps; review policies quarterly.',
        },
        {
          title: 'Skipping MFA at the Identity Provider',
          detail: 'Access is only as strong as your IdP. Require MFA in Google/Azure/Okta before enforcing Cloudflare policies.',
        },
        {
          title: 'Enabling CASB/DLP before ZTNA is stable',
          detail: 'Too many layers at once overwhelms support. Finish Access + WARP pilot first; CASB/DLP in wave 2.',
        },
        {
          title: 'Not deploying WARP on all user devices',
          detail: 'SWG/DNS policies do not apply if traffic bypasses the Cloudflare One client. Use MDM or a laptop onboarding checklist.',
        },
        {
          title: 'Inbound tunnels instead of outbound `cloudflared`',
          detail: 'Opening inbound ports into the datacenter increases attack surface. Prefer outbound Tunnel; firewall allow Cloudflare only.',
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
