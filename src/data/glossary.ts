import type { LocalizedString } from '../i18n/types';

export type GlossaryTerm = {
  term: string;
  category: 'Core' | 'App Security' | 'Developer Platform' | 'Zero Trust' | 'AI' | 'Analytics';
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one';
  definition: LocalizedString;
};

export const glossary: GlossaryTerm[] = [
  {
    term: 'DNS',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'DNS là hệ thống ánh xạ domain name đến server hoặc service phía sau.',
      en: 'DNS maps a domain name to the server or service behind it.',
    },
  },
  {
    term: 'Proxy',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Khi một DNS record được proxy qua Cloudflare, traffic sẽ đi qua Cloudflare trước khi đến origin để áp dụng security/performance/routing/visibility.',
      en: 'When a DNS record is proxied through Cloudflare, traffic goes through Cloudflare before the origin so Cloudflare can apply security, performance, routing, and visibility.',
    },
  },
  {
    term: 'Edge',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Edge là lớp xử lý của Cloudflare gần user. Security checks, caching, routing và compute có thể diễn ra tại đây.',
      en: 'The edge is where Cloudflare processes traffic close to users. Security checks, caching, routing, and compute can happen here.',
    },
  },
  {
    term: 'Origin',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Origin là server, application, storage hoặc backend mà Cloudflare bảo vệ hoặc kết nối đến.',
      en: 'Origin is the server, application, storage, or backend that Cloudflare protects or connects to.',
    },
  },
  {
    term: 'CDN',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'CDN giúp phục vụ nội dung gần user hơn để tăng tốc và giảm tải cho origin.',
      en: 'A CDN serves content closer to users to improve speed and reduce origin load.',
    },
  },
  {
    term: 'Cache',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Cache lưu bản sao nội dung để trả lời nhanh hơn cho request sau, giảm latency và giảm tải origin.',
      en: 'Cache stores copies of content to respond faster to future requests, reducing latency and origin load.',
    },
  },
  {
    term: 'WAF',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'WAF giúp chặn các kiểu tấn công web phổ biến trước khi chúng đến application.',
      en: 'A WAF blocks common web attack patterns before they reach your application.',
    },
  },
  {
    term: 'DDoS',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'DDoS protection giúp hấp thụ và giảm thiểu lượng traffic tấn công lớn nhằm làm gián đoạn service.',
      en: 'DDoS protection absorbs and mitigates large attack traffic designed to disrupt services.',
    },
  },
  {
    term: 'Bot',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Bot traffic là traffic tự động. Bot protection phân biệt automation có ích và automation gây hại (scraping, spam, credential stuffing).',
      en: 'Bot traffic is automated traffic. Bot protection distinguishes useful automation from harmful automation (scraping, spam, credential stuffing).',
    },
  },
  {
    term: 'Rate limiting',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Rate limiting giới hạn số request theo thời gian để giảm abuse và bảo vệ origin/API.',
      en: 'Rate limiting caps requests per time window to reduce abuse and protect your origin/API.',
    },
  },
  {
    term: 'API security',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'API security là tập hợp kiểm soát bảo vệ API: auth, rate limiting, schema validation, bot management, logging.',
      en: 'API security combines controls to protect APIs: auth, rate limiting, schema validation, bot management, logging.',
    },
  },
  {
    term: 'Worker',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Worker là serverless code chạy trên Cloudflare, thường dùng để build API, middleware, edge logic hoặc backend nhẹ.',
      en: 'A Worker is serverless code on Cloudflare, used for APIs, middleware, edge logic, or lightweight backends.',
    },
  },
  {
    term: 'Pages',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Pages là nền tảng deploy website và full-stack application trên Cloudflare.',
      en: 'Pages is Cloudflare’s platform for deploying websites and full-stack applications.',
    },
  },
  {
    term: 'KV',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'KV là key-value storage phù hợp cho config, feature flags, cache nhẹ (không dùng cho transactional state).',
      en: 'KV is key-value storage for config, feature flags, and lightweight caching (not for transactional state).',
    },
  },
  {
    term: 'D1',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'D1 là database SQL (SQLite) serverless của Cloudflare, phù hợp lưu dữ liệu có schema và query.',
      en: 'D1 is Cloudflare’s serverless SQL (SQLite) database for schema-based data and queries.',
    },
  },
  {
    term: 'R2',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'R2 là object storage dùng lưu files (PDF, slides, assets) với pattern download/caching tốt.',
      en: 'R2 is object storage for files (PDFs, slides, assets) with good download/caching patterns.',
    },
  },
  {
    term: 'Durable Objects',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Durable Objects dùng cho state nhất quán theo entity (chat room, session, counter, coordination).',
      en: 'Durable Objects provide consistent per-entity state for coordination (chat rooms, sessions, counters).',
    },
  },
  {
    term: 'Workers AI',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Workers AI chạy inference (LLM/embeddings/vision) trên Cloudflare và tích hợp qua binding.',
      en: 'Workers AI runs inference (LLMs/embeddings/vision) on Cloudflare and integrates via bindings.',
    },
  },
  {
    term: 'AI Gateway',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'AI Gateway giúp quản trị calls tới AI providers (routing, caching, observability, cost).',
      en: 'AI Gateway governs AI calls (routing, caching, observability, cost).',
    },
  },
  {
    term: 'Vectorize',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Vectorize là vector database để làm semantic search/RAG trên nội dung học.',
      en: 'Vectorize is a vector database for semantic search/RAG over your learning content.',
    },
  },
  {
    term: 'Zero Trust',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Zero Trust không tin mặc định: mỗi request được xác minh theo identity, device, context và policy.',
      en: 'Zero Trust does not trust by default: each request is verified by identity, device, context, and policy.',
    },
  },
  {
    term: 'ZTNA',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'ZTNA cho phép user truy cập private apps theo policy, tránh mở quyền truy cập toàn mạng như VPN.',
      en: 'ZTNA enables policy-based access to private apps without broad network access like VPN.',
    },
  },
  {
    term: 'SWG',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Secure Web Gateway bảo vệ users khi duyệt Internet bằng kiểm soát DNS/HTTP, malware/phishing và policy.',
      en: 'Secure Web Gateway protects users browsing the Internet via DNS/HTTP controls, malware/phishing protection, and policy.',
    },
  },
  {
    term: 'CASB',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'CASB giúp phát hiện, đánh giá và kiểm soát rủi ro khi sử dụng SaaS applications.',
      en: 'CASB helps discover, assess, and control risks across SaaS applications.',
    },
  },
  {
    term: 'DLP',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'DLP giúp giảm rủi ro rò rỉ dữ liệu nhạy cảm.',
      en: 'DLP reduces the risk of sensitive data leakage.',
    },
  },
  {
    term: 'SASE',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'SASE kết hợp networking + security (Zero Trust) để bảo vệ users và kết nối đến apps/data.',
      en: 'SASE combines networking + security (Zero Trust) to protect users and connect to apps/data.',
    },
  },
  {
    term: 'Cloudflare WAN',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Cloudflare WAN (trước đây là Magic WAN) hiện đại hoá kết nối WAN, kết hợp routing + security trên mạng Cloudflare.',
      en: 'Cloudflare WAN (formerly Magic WAN) modernizes WAN connectivity with routing + security on Cloudflare’s network.',
    },
  },
  {
    term: 'Turnstile',
    category: 'App Security',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Turnstile là giải pháp chống bot cho form. Token phải được verify server-side trước khi ghi DB.',
      en: 'Turnstile is bot protection for forms. Tokens must be verified server-side before writing to DB.',
    },
  },
  {
    term: 'Web Analytics',
    category: 'Analytics',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Cloudflare Web Analytics cung cấp analytics nhẹ cho website mà không cần JS nặng.',
      en: 'Cloudflare Web Analytics provides lightweight site analytics without heavy JS.',
    },
  },
  {
    term: 'Hyperdrive',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Hyperdrive tăng tốc kết nối từ Workers tới Postgres/MySQL hiện có — giữ database bạn đang dùng.',
      en: 'Hyperdrive speeds Workers connections to your existing Postgres/MySQL — keep your current database.',
    },
  },
  {
    term: 'Cloudflare Tunnel',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Tunnel outbound (`cloudflared`) kết nối app nội bộ tới Cloudflare mà không mở port inbound — tên cũ: Argo Tunnel.',
      en: 'Outbound tunnel (`cloudflared`) connects internal apps to Cloudflare without inbound ports — formerly Argo Tunnel.',
    },
  },
  {
    term: 'Workflows',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Workflows orchestrate job nhiều bước, durable trên Cloudflare — phù hợp pipeline dài hơn một request.',
      en: 'Workflows orchestrate multi-step durable jobs on Cloudflare — for pipelines longer than one request.',
    },
  },
  {
    term: 'Agents',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Agents SDK giúp build trợ lý có state (chat, tools) trên Workers + Durable Objects.',
      en: 'The Agents SDK builds stateful assistants (chat, tools) on Workers + Durable Objects.',
    },
  },
];

