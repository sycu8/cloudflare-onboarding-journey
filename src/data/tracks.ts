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
  slug: 'application-services' | 'developer-platform' | 'cloudflare-one';
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
          },
        ],
      },
      {
        id: 'as-4',
        title: { vi: 'Phần 4: Performance và cache', en: 'Part 4: Performance and caching' },
        description: {
          vi: 'Tăng tốc static, giữ dynamic an toàn.',
          en: 'Speed up static assets while keeping dynamic routes safe.',
        },
        duration: { vi: '~35 phút', en: '~35 min' },
        lessons: [
          {
            title: { vi: 'Cache rules cho static assets', en: 'Cache rules for static assets' },
            body: {
              vi: 'Cache CSS/JS/images với TTL hợp lý. Bypass cache cho trang có cookie session, cart, personalized content.',
              en: 'Cache CSS/JS/images with sensible TTL. Bypass cache for session cookies, cart, and personalized pages.',
            },
            hubLink: '/use-cases/protect-website',
          },
          {
            title: { vi: 'Theo dõi analytics và logs', en: 'Monitor analytics and logs' },
            body: {
              vi: 'Xem top paths, status code, country, bot score. Thiết lập alert khi traffic tăng đột biến hoặc 5xx tăng.',
              en: 'Review top paths, status codes, countries, bot scores. Set alerts for traffic spikes or rising 5xx.',
            },
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
      { href: '/use-cases/protect-website', label: { vi: 'Bảo vệ website', en: 'Protect a website' } },
      { href: '/use-cases/secure-api', label: { vi: 'Bảo vệ API', en: 'Secure an API' } },
    ],
    cta: { href: '/use-cases/protect-website', label: { vi: 'Đọc tình huống: Bảo vệ website', en: 'Read use case: Protect a website' } },
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
        'Hiểu khi nào dùng Workers AI (không bắt buộc ngay)',
      ],
      en: [
        'Deploy a static or full-stack site on Pages',
        'Create an API route with Pages Functions or a Worker',
        'Pick the right storage: KV vs D1 vs R2',
        'Handle errors and basic edge logging',
        'Know when to use Workers AI (optional early on)',
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
    ],
    recommendedSequence: {
      vi: [
        'Deploy static site với Pages',
        'Thêm một API route',
        'Build một Worker endpoint nhỏ',
        'Lưu dữ liệu đơn giản trong KV hoặc D1',
        'Upload files lên R2',
        'Thêm basic analytics và error handling',
        'Thử một AI API use case',
      ],
      en: [
        'Deploy a static site with Pages',
        'Add one API route',
        'Build a small Worker endpoint',
        'Store simple data in KV or D1',
        'Upload files to R2',
        'Add basic analytics and error handling',
        'Try an AI API use case',
      ],
    },
    relatedUseCases: [
      { href: '/use-cases/build-serverless-app', label: { vi: 'Build serverless app', en: 'Build a serverless app' } },
    ],
    cta: { href: '/use-cases/build-serverless-app', label: { vi: 'Đọc tình huống: Build serverless app', en: 'Read use case: Build a serverless app' } },
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
    keyConcepts: ['Zero Trust', 'ZTNA', 'SWG', 'CASB', 'DLP', 'Email security', 'Remote Browser Isolation', 'Magic WAN'],
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
    ],
    recommendedSequence: {
      vi: [
        'Xác định users và identity provider',
        'Liệt kê private apps và SaaS apps',
        'Chọn first use case: VPN replacement hoặc secure browsing',
        'Define access policies',
        'Test với một nhóm user nhỏ',
        'Mở rộng sang nhiều apps và users hơn',
        'Bổ sung DLP, CASB, email security hoặc network modernization',
      ],
      en: [
        'Identify users and identity provider',
        'List private apps and SaaS apps',
        'Choose first use case: VPN replacement or secure browsing',
        'Define access policies',
        'Test with a small user group',
        'Expand to more apps and users',
        'Add DLP, CASB, email, or network modernization',
      ],
    },
    relatedUseCases: [
      { href: '/use-cases/replace-vpn', label: { vi: 'Thay thế VPN', en: 'Replace VPN' } },
      { href: '/use-cases/secure-remote-users', label: { vi: 'Bảo vệ remote users', en: 'Secure remote users' } },
    ],
    cta: { href: '/use-cases/replace-vpn', label: { vi: 'Đọc tình huống: Thay thế VPN', en: 'Read use case: Replace VPN' } },
  },
];

export function getTrack(slug: Track['slug']) {
  const t = tracks.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown track: ${slug}`);
  return t;
}
