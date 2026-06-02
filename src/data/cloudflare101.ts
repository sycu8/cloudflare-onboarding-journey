import type { LocalizedString } from '../i18n/types';

/** Aligned with [Cloudflare Developer Docs](https://developers.cloudflare.com/) product groupings */
export type Cf101Product = {
  id: string;
  name: LocalizedString;
  summary: LocalizedString;
  docsPath?: string;
};

export type Cf101Category = {
  id: string;
  title: LocalizedString;
  intro: LocalizedString;
  products: Cf101Product[];
};

export const cf101Foundations: Cf101Product[] = [
  {
    id: 'dns',
    name: { vi: 'DNS', en: 'DNS' },
    summary: {
      vi: 'Hệ thống ánh xạ tên miền tới server hoặc dịch vụ phía sau. Trên Cloudflare, bạn quản lý bản ghi DNS và có thể bật proxy (đám mây cam) để traffic đi qua edge.',
      en: 'Maps domain names to servers or services. On Cloudflare you manage DNS records and can enable the proxied (orange cloud) mode so traffic flows through the edge.',
    },
    docsPath: '/dns/',
  },
  {
    id: 'proxy',
    name: { vi: 'Proxy (orange cloud)', en: 'Proxy (orange cloud)' },
    summary: {
      vi: 'Khi bản ghi được proxy, mọi request HTTP/S đi qua Cloudflare trước origin — cho phép WAF, cache, routing và analytics mà không đổi IP origin công khai.',
      en: 'When a record is proxied, HTTP/S requests hit Cloudflare before the origin — enabling WAF, cache, routing, and analytics without exposing the origin IP.',
    },
    docsPath: '/fundamentals/concepts/how-cloudflare-works/',
  },
  {
    id: 'edge',
    name: { vi: 'Edge', en: 'Edge' },
    summary: {
      vi: 'Lớp xử lý gần người dùng (hàng trăm thành phố). Kiểm tra bảo mật, cache, Workers và routing có thể chạy tại đây thay vì chỉ ở data center của bạn.',
      en: 'Processing close to users (hundreds of cities). Security checks, cache, Workers, and routing can run here instead of only in your data center.',
    },
  },
  {
    id: 'origin',
    name: { vi: 'Origin', en: 'Origin' },
    summary: {
      vi: 'Server, ứng dụng, bucket hoặc backend mà Cloudflare bảo vệ, tăng tốc hoặc kết nối tới (VPS, cloud, on-prem, Workers là origin cho Pages Functions, v.v.).',
      en: 'The server, app, bucket, or backend Cloudflare protects, accelerates, or connects to (VPS, cloud, on-prem; Workers can be origin for Pages Functions, etc.).',
    },
  },
];

export const cf101Categories: Cf101Category[] = [
  {
    id: 'compute',
    title: { vi: 'Compute', en: 'Compute' },
    intro: {
      vi: 'Chạy code và workload serverless trên mạng lưới Cloudflare — không cần quản lý máy chủ hay vùng (region) riêng.',
      en: 'Run code and serverless workloads on Cloudflare’s network — no servers or regions to manage.',
    },
    products: [
      {
        id: 'workers',
        name: { vi: 'Workers', en: 'Workers' },
        summary: {
          vi: 'Hàm serverless chạy tại edge: API, middleware, rewrite request, cron, webhook. Ngôn ngữ JS/TS/Wasm; binding tới KV, D1, R2, AI.',
          en: 'Edge serverless functions: APIs, middleware, request rewrites, cron, webhooks. JS/TS/Wasm; bindings to KV, D1, R2, AI.',
        },
        docsPath: '/workers/',
      },
      {
        id: 'pages',
        name: { vi: 'Pages', en: 'Pages' },
        summary: {
          vi: 'Deploy site tĩnh và full-stack (Astro, React, v.v.) kèm Pages Functions. Phù hợp frontend + API nhẹ; CI từ Git.',
          en: 'Deploy static sites and full-stack apps (Astro, React, etc.) with Pages Functions. Great for frontends and light APIs; Git CI.',
        },
        docsPath: '/pages/',
      },
      {
        id: 'containers',
        name: { vi: 'Containers', en: 'Containers' },
        summary: {
          vi: 'Chạy container image trên nền Workers — dùng khi cần runtime hoặc dependency không gói gọn trong isolate Workers.',
          en: 'Run container images on the Workers platform — when you need runtimes or deps that do not fit a Workers isolate.',
        },
        docsPath: '/containers/',
      },
      {
        id: 'durable-objects',
        name: { vi: 'Durable Objects', en: 'Durable Objects' },
        summary: {
          vi: 'State có singleton/coordination (chat room, game session, rate limit toàn cục). Mỗi object có storage SQLite và WebSocket.',
          en: 'Stateful coordination (chat rooms, game sessions, global rate limits). Each object has SQLite storage and WebSockets.',
        },
        docsPath: '/durable-objects/',
      },
      {
        id: 'queues',
        name: { vi: 'Queues', en: 'Queues' },
        summary: {
          vi: 'Hàng đợi message giữa Workers — xử lý bất đồng bộ, retry, tách producer/consumer.',
          en: 'Message queues between Workers — async processing, retries, producer/consumer separation.',
        },
        docsPath: '/queues/',
      },
      {
        id: 'workflows',
        name: { vi: 'Workflows', en: 'Workflows' },
        summary: {
          vi: 'Điều phối bước dài hạn, durable (human-in-the-loop, chờ API, retry có trạng thái).',
          en: 'Long-running, durable orchestration (human-in-the-loop, waiting on APIs, stateful retries).',
        },
        docsPath: '/workflows/',
      },
      {
        id: 'browser-rendering',
        name: { vi: 'Browser Rendering', en: 'Browser Rendering' },
        summary: {
          vi: 'Headless browser tại edge — screenshot, PDF, scrape, test UI mà không tự host Chrome.',
          en: 'Headless browsers at the edge — screenshots, PDFs, scraping, UI tests without hosting Chrome yourself.',
        },
        docsPath: '/browser-rendering/',
      },
      {
        id: 'workers-for-platforms',
        name: { vi: 'Cloudflare for Platforms', en: 'Cloudflare for Platforms' },
        summary: {
          vi: 'Cho phép khách hàng của bạn chạy script/tenant trên Workers (multi-tenant SaaS).',
          en: 'Let your customers run scripts/tenants on Workers (multi-tenant SaaS).',
        },
        docsPath: '/cloudflare-for-platforms/',
      },
    ],
  },
  {
    id: 'ai',
    title: { vi: 'AI', en: 'AI' },
    intro: {
      vi: 'Suy luận AI, agent và tìm kiếm trên dữ liệu của bạn — gọi từ Workers hoặc API, không tự quản GPU.',
      en: 'AI inference, agents, and search over your data — call from Workers or APIs without managing GPUs.',
    },
    products: [
      {
        id: 'workers-ai',
        name: { vi: 'Workers AI', en: 'Workers AI' },
        summary: {
          vi: 'Model inference (LLM, embedding, vision) qua binding Workers — trả tiền theo usage, chạy gần user.',
          en: 'Model inference (LLM, embeddings, vision) via Workers bindings — pay per use, runs near users.',
        },
        docsPath: '/workers-ai/',
      },
      {
        id: 'ai-gateway',
        name: { vi: 'AI Gateway', en: 'AI Gateway' },
        summary: {
          vi: 'Lớp quản trị request tới nhiều provider (OpenAI, Anthropic, …): cache, log, rate limit, chi phí.',
          en: 'Govern requests to multiple providers (OpenAI, Anthropic, …): cache, logs, rate limits, cost.',
        },
        docsPath: '/ai-gateway/',
      },
      {
        id: 'agents',
        name: { vi: 'Agents', en: 'Agents' },
        summary: {
          vi: 'SDK xây agent có state, tool calling, WebSocket — chạy trên Workers + Durable Objects.',
          en: 'SDK for stateful agents with tool calling and WebSockets — on Workers + Durable Objects.',
        },
        docsPath: '/agents/',
      },
      {
        id: 'vectorize',
        name: { vi: 'Vectorize', en: 'Vectorize' },
        summary: {
          vi: 'Vector database cho RAG / semantic search — lưu embedding, query từ Workers AI hoặc model ngoài.',
          en: 'Vector database for RAG / semantic search — store embeddings, query from Workers AI or external models.',
        },
        docsPath: '/vectorize/',
      },
      {
        id: 'ai-search',
        name: { vi: 'AI Search', en: 'AI Search' },
        summary: {
          vi: 'Tìm kiếm có ngữ nghĩa trên tài liệu/knowledge base đã index — bổ sung cho Vectorize + Workers AI.',
          en: 'Semantic search over indexed docs/knowledge bases — complements Vectorize + Workers AI.',
        },
        docsPath: '/ai-search/',
      },
      {
        id: 'sandbox',
        name: { vi: 'Sandbox SDK', en: 'Sandbox SDK' },
        summary: {
          vi: 'Môi trường cách ly chạy code không tin cậy (agent chạy script user) an toàn trên Workers.',
          en: 'Isolated environments for untrusted code (agents running user scripts) safely on Workers.',
        },
        docsPath: '/sandbox/',
      },
    ],
  },
  {
    id: 'storage',
    title: { vi: 'Storage & Databases', en: 'Storage & Databases' },
    intro: {
      vi: 'Lưu file, key-value và SQL serverless — truy cập trực tiếp từ Workers, không quản connection pool phức tạp.',
      en: 'Files, key-value, and serverless SQL — accessed from Workers without heavy connection pooling.',
    },
    products: [
      {
        id: 'r2',
        name: { vi: 'R2', en: 'R2' },
        summary: {
          vi: 'Object storage (S3-compatible) — ảnh, backup, asset; egress miễn phí so với nhiều cloud khác.',
          en: 'S3-compatible object storage — images, backups, assets; no egress fees vs many clouds.',
        },
        docsPath: '/r2/',
      },
      {
        id: 'd1',
        name: { vi: 'D1', en: 'D1' },
        summary: {
          vi: 'SQLite serverless, replicate globally — bảng quan hệ nhỏ/vừa, workshop signup, config app.',
          en: 'Serverless SQLite, globally replicated — small/medium relational data, signups, app config.',
        },
        docsPath: '/d1/',
      },
      {
        id: 'kv',
        name: { vi: 'KV', en: 'KV' },
        summary: {
          vi: 'Key-value eventually consistent — feature flags, cache config, session nhẹ; đọc cực nhanh tại edge.',
          en: 'Eventually consistent key-value — feature flags, config cache, light sessions; very fast edge reads.',
        },
        docsPath: '/kv/',
      },
      {
        id: 'hyperdrive',
        name: { vi: 'Hyperdrive', en: 'Hyperdrive' },
        summary: {
          vi: 'Tăng tốc kết nối tới Postgres/MySQL bên ngoài từ Workers — pooling và routing gần DB.',
          en: 'Accelerate external Postgres/MySQL from Workers — pooling and routing closer to the DB.',
        },
        docsPath: '/hyperdrive/',
      },
      {
        id: 'pipelines',
        name: { vi: 'Pipelines', en: 'Pipelines' },
        summary: {
          vi: 'Ingest và xử lý stream dữ liệu (logs, events) vào R2 hoặc warehouse.',
          en: 'Ingest and process data streams (logs, events) into R2 or warehouses.',
        },
        docsPath: '/pipelines/',
      },
    ],
  },
  {
    id: 'media',
    title: { vi: 'Media', en: 'Media' },
    intro: {
      vi: 'Tối ưu, lưu trữ và phát video/ảnh — giảm tải origin và CDN tự xử lý format/kích thước.',
      en: 'Optimize, store, and deliver images and video — less origin load; CDN handles formats and sizes.',
    },
    products: [
      {
        id: 'images',
        name: { vi: 'Images', en: 'Images' },
        summary: {
          vi: 'Resize, format (WebP/AVIF), watermark qua URL hoặc API — không cần pipeline ảnh riêng trên origin.',
          en: 'Resize, formats (WebP/AVIF), watermarks via URL or API — no separate image pipeline on origin.',
        },
        docsPath: '/images/',
      },
      {
        id: 'stream',
        name: { vi: 'Stream', en: 'Stream' },
        summary: {
          vi: 'Video on-demand và live — upload, encode, player embed; phân phối qua mạng Cloudflare.',
          en: 'On-demand and live video — upload, encode, embeddable player; delivered on Cloudflare’s network.',
        },
        docsPath: '/stream/',
      },
      {
        id: 'realtime',
        name: { vi: 'Realtime', en: 'Realtime' },
        summary: {
          vi: 'WebRTC SFU/TURN — gọi video, streaming tương tác độ trễ thấp mà không tự vận hành media server.',
          en: 'WebRTC SFU/TURN — low-latency calls and interactive streaming without running your own media servers.',
        },
        docsPath: '/realtime/',
      },
    ],
  },
  {
    id: 'app-security',
    title: { vi: 'Application Security', en: 'Application Security' },
    intro: {
      vi: 'Bảo vệ website và API công khai trước tấn công, bot và lỗ hổng — áp dụng tại proxy (orange cloud).',
      en: 'Protect public websites and APIs from attacks, bots, and abuse — at the proxied (orange cloud) layer.',
    },
    products: [
      {
        id: 'waf',
        name: { vi: 'WAF', en: 'WAF' },
        summary: {
          vi: 'Web Application Firewall — rule OWASP, custom rule, managed ruleset chặn SQLi, XSS trước app.',
          en: 'Web Application Firewall — OWASP, custom and managed rulesets block SQLi, XSS before your app.',
        },
        docsPath: '/waf/',
      },
      {
        id: 'ddos',
        name: { vi: 'DDoS Protection', en: 'DDoS Protection' },
        summary: {
          vi: 'Mitigate flood L3/L4/L7 tự động — included khi proxy qua Cloudflare.',
          en: 'Automatic L3/L4/L7 flood mitigation — included when traffic is proxied.',
        },
        docsPath: '/ddos-protection/',
      },
      {
        id: 'ssl',
        name: { vi: 'SSL/TLS', en: 'SSL/TLS' },
        summary: {
          vi: 'Certificate miễn phí, TLS 1.3, HSTS, mTLS — mã hóa user ↔ edge và edge ↔ origin.',
          en: 'Free certs, TLS 1.3, HSTS, mTLS — encrypt user ↔ edge and edge ↔ origin.',
        },
        docsPath: '/ssl/',
      },
      {
        id: 'bots',
        name: { vi: 'Bots', en: 'Bots' },
        summary: {
          vi: 'Phân loại bot tốt/xấu, challenge, block scraping và credential stuffing.',
          en: 'Classify good vs bad bots, challenges, block scraping and credential stuffing.',
        },
        docsPath: '/bots/',
      },
      {
        id: 'api-shield',
        name: { vi: 'API Shield', en: 'API Shield' },
        summary: {
          vi: 'Schema validation, mTLS, discovery cho API — bảo vệ endpoint machine-to-machine.',
          en: 'Schema validation, mTLS, API discovery — protect machine-to-machine endpoints.',
        },
        docsPath: '/api-shield/',
      },
      {
        id: 'page-shield',
        name: { vi: 'Page Shield', en: 'Page Shield' },
        summary: {
          vi: 'Giám sát script bên thứ ba trên trang — phát hiện Magecart / supply-chain client-side.',
          en: 'Monitor third-party scripts on pages — detect Magecart-style client-side supply-chain risk.',
        },
        docsPath: '/page-shield/',
      },
      {
        id: 'turnstile',
        name: { vi: 'Turnstile', en: 'Turnstile' },
        summary: {
          vi: 'CAPTCHA thay thế thân thiện user — verify token server-side trên form đăng ký/login.',
          en: 'User-friendly CAPTCHA alternative — verify tokens server-side on signup/login forms.',
        },
        docsPath: '/turnstile/',
      },
    ],
  },
  {
    id: 'cloudflare-one',
    title: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    intro: {
      vi: 'Zero Trust cho doanh nghiệp — truy cập app nội bộ, duyệt web an toàn, thay/thế VPN truyền thống.',
      en: 'Enterprise Zero Trust — access private apps, secure browsing, replace traditional VPN patterns.',
    },
    products: [
      {
        id: 'access',
        name: { vi: 'Access', en: 'Access' },
        summary: {
          vi: 'ZTNA — xác thực user/device trước khi vào app private (SSO, policy, không mở toàn mạng).',
          en: 'ZTNA — authenticate users/devices before private apps (SSO, policy, no full network access).',
        },
        docsPath: '/cloudflare-one/access/',
      },
      {
        id: 'tunnel',
        name: { vi: 'Tunnel', en: 'Tunnel' },
        summary: {
          vi: 'Kết nối outbound `cloudflared` — expose app nội bộ không mở port inbound; tên cũ Argo Tunnel.',
          en: 'Outbound `cloudflared` connections — expose internal apps without inbound ports; formerly Argo Tunnel.',
        },
        docsPath: '/cloudflare-one/connections/connect-networks/',
      },
      {
        id: 'gateway',
        name: { vi: 'Gateway', en: 'Gateway' },
        summary: {
          vi: 'Secure Web Gateway (SWG) — filter DNS/HTTP, malware, DLP policy khi user ra Internet.',
          en: 'Secure Web Gateway (SWG) — filter DNS/HTTP, malware, DLP policies for Internet browsing.',
        },
        docsPath: '/cloudflare-one/policies/gateway/',
      },
      {
        id: 'browser-isolation',
        name: { vi: 'Browser Isolation', en: 'Browser Isolation' },
        summary: {
          vi: 'Chạy trình duyệt từ xa — tách malware/web không tin cậy khỏi máy user.',
          en: 'Remote browser execution — isolate untrusted web/malware from the user device.',
        },
        docsPath: '/cloudflare-one/policies/browser-isolation/',
      },
      {
        id: 'warp',
        name: { vi: 'WARP', en: 'WARP' },
        summary: {
          vi: 'Client đưa traffic thiết bị vào Cloudflare One (VPN nhẹ, device posture).',
          en: 'Client routes device traffic into Cloudflare One (lightweight VPN, device posture).',
        },
        docsPath: '/cloudflare-one/connections/connect-devices/warp/',
      },
    ],
  },
  {
    id: 'delivery',
    title: { vi: 'Delivery & Performance', en: 'Delivery & Performance' },
    intro: {
      vi: 'Tăng tốc nội dung và đo lường — thường dùng cùng Application Security trên cùng zone.',
      en: 'Speed up content and measure performance — often used with Application Security on the same zone.',
    },
    products: [
      {
        id: 'cache',
        name: { vi: 'Cache / CDN', en: 'Cache / CDN' },
        summary: {
          vi: 'Cache tĩnh và rule tùy chỉnh — giảm hit origin, purge theo URL/tag.',
          en: 'Static caching and custom rules — fewer origin hits, purge by URL/tag.',
        },
        docsPath: '/cache/',
      },
      {
        id: 'speed',
        name: { vi: 'Speed', en: 'Speed' },
        summary: {
          vi: 'Minify, Brotli, Early Hints, HTTP/3 — tối ưu delivery tự động.',
          en: 'Minify, Brotli, Early Hints, HTTP/3 — automatic delivery optimizations.',
        },
        docsPath: '/speed/',
      },
      {
        id: 'load-balancing',
        name: { vi: 'Load Balancing', en: 'Load Balancing' },
        summary: {
          vi: 'Phân tải health-checked giữa nhiều origin/data center.',
          en: 'Health-checked load distribution across origins and data centers.',
        },
        docsPath: '/load-balancing/',
      },
      {
        id: 'zaraz',
        name: { vi: 'Zaraz', en: 'Zaraz' },
        summary: {
          vi: 'Tag manager phía server/edge — giảm script third-party chạy trên browser.',
          en: 'Server/edge tag manager — fewer third-party scripts in the browser.',
        },
        docsPath: '/zaraz/',
      },
    ],
  },
];

export const developerDocsHome = 'https://developers.cloudflare.com/';

export function docsUrl(path?: string): string | undefined {
  if (!path) return undefined;
  return `https://developers.cloudflare.com${path}`;
}
