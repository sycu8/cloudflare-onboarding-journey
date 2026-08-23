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
      km: 'DNS ភ្ជាប់ domain name ទៅ server ឬ service ខាងក្រោយ។',
    },
  },
  {
    term: 'Proxy',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Khi một DNS record được proxy qua Cloudflare, traffic sẽ đi qua Cloudflare trước khi đến origin để áp dụng security/performance/routing/visibility.',
      en: 'When a DNS record is proxied through Cloudflare, traffic goes through Cloudflare before the origin so Cloudflare can apply security, performance, routing, and visibility.',
      km: 'ពេល DNS record ត្រូវបាន proxy តាម Cloudflare, traffic ឆ្លងកាត់ Cloudflare មុន origin ដើម្បីអនុវត្ត security, performance, routing និង visibility។',
    },
  },
  {
    term: 'Edge',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Edge là lớp xử lý của Cloudflare gần user. Security checks, caching, routing và compute có thể diễn ra tại đây.',
      en: 'The edge is where Cloudflare processes traffic close to users. Security checks, caching, routing, and compute can happen here.',
      km: 'Edge គឺទីតាំង Cloudflare ដំណើរការក្បែរអ្នកប្រើ។ Security check, cache, routing និង compute អាចកើតឡើងនៅទីនេះ។',
    },
  },
  {
    term: 'Origin',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Origin là server, application, storage hoặc backend mà Cloudflare bảo vệ hoặc kết nối đến.',
      en: 'Origin is the server, application, storage, or backend that Cloudflare protects or connects to.',
      km: 'Origin គឺ server, application, storage ឬ backend ដែល Cloudflare ការពារ ឬភ្ជាប់ទៅ។',
    },
  },
  {
    term: 'CDN',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'CDN giúp phục vụ nội dung gần user hơn để tăng tốc và giảm tải cho origin.',
      en: 'A CDN serves content closer to users to improve speed and reduce origin load.',
      km: 'CDN ផ្តល់ content ក្បែរអ្នកប្រើប្រាស់ដើម្បីបង្កើនល្បឿន និងកាត់បន្ថយ origin load។',
    },
  },
  {
    term: 'Cache',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Cache lưu bản sao nội dung để trả lời nhanh hơn cho request sau, giảm latency và giảm tải origin.',
      en: 'Cache stores copies of content to respond faster to future requests, reducing latency and origin load.',
      km: 'Cache រក្សាទុក copy content ដើម្បីឆ្លើយ request បន្ទាប់បានលឿនជាង, កាត់បន្ថយ latency និង origin load។',
    },
  },
  {
    term: 'WAF',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'WAF giúp chặn các kiểu tấn công web phổ biến trước khi chúng đến application.',
      en: 'A WAF blocks common web attack patterns before they reach your application.',
      km: 'WAF ទប់ស្កត់ web attack pattern ទូទៅមុនពេលដល់ application របស់អ្នក។',
    },
  },
  {
    term: 'DDoS',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'DDoS protection giúp hấp thụ và giảm thiểu lượng traffic tấn công lớn nhằm làm gián đoạn service.',
      en: 'DDoS protection absorbs and mitigates large attack traffic designed to disrupt services.',
      km: 'DDoS protection ទទួល និងកាត់បន្ថយ attack traffic ធំដែលបំពេញគោលបំណង disrupt service។',
    },
  },
  {
    term: 'Bot',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Bot traffic là traffic tự động. Bot protection phân biệt automation có ích và automation gây hại (scraping, spam, credential stuffing).',
      en: 'Bot traffic is automated traffic. Bot protection distinguishes useful automation from harmful automation (scraping, spam, credential stuffing).',
      km: 'Bot traffic គឺ traffic ដែល automated។ Bot protection បំបែក automation ដែលមានប្រយោជន៍ និង automation ដែលគ្រោះថ្នាក់ (scraping, spam, credential stuffing)។',
    },
  },
  {
    term: 'Rate limiting',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Rate limiting giới hạn số request theo thời gian để giảm abuse và bảo vệ origin/API.',
      en: 'Rate limiting caps requests per time window to reduce abuse and protect your origin/API.',
      km: 'Rate limiting កំណត់ចំនួន request ក្នុង time window ដើម្បីកាត់បន្ថយ abuse និងការពារ origin/API របស់អ្នក។',
    },
  },
  {
    term: 'API security',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'API security là tập hợp kiểm soát bảo vệ API: auth, rate limiting, schema validation, bot management, logging.',
      en: 'API security combines controls to protect APIs: auth, rate limiting, schema validation, bot management, logging.',
      km: 'API security រួម control ដើម្បីការពារ API៖ auth, rate limiting, schema validation, bot management, logging។',
    },
  },
  {
    term: 'Worker',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Worker là serverless code chạy trên Cloudflare, thường dùng để build API, middleware, edge logic hoặc backend nhẹ.',
      en: 'A Worker is serverless code on Cloudflare, used for APIs, middleware, edge logic, or lightweight backends.',
      km: 'Worker គឺ serverless code លើ Cloudflare — ប្រើសម្រាប់ API, middleware, edge logic ឬ lightweight backend។',
    },
  },
  {
    term: 'Pages',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Pages là nền tảng deploy website và full-stack application trên Cloudflare.',
      en: 'Pages is Cloudflare’s platform for deploying websites and full-stack applications.',
      km: 'Pages គឺ platform របស់ Cloudflare សម្រាប់ deploy website និង full-stack application។',
    },
  },
  {
    term: 'KV',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'KV là key-value storage phù hợp cho config, feature flags, cache nhẹ (không dùng cho transactional state).',
      en: 'KV is key-value storage for config, feature flags, and lightweight caching (not for transactional state).',
      km: 'KV គឺ key-value storage សម្រាប់ config, feature flag និង lightweight cache (មិនសម្រាប់ transactional state)។',
    },
  },
  {
    term: 'D1',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'D1 là database SQL (SQLite) serverless của Cloudflare, phù hợp lưu dữ liệu có schema và query.',
      en: 'D1 is Cloudflare’s serverless SQL (SQLite) database for schema-based data and queries.',
      km: 'D1 គឺ serverless SQL (SQLite) database របស់ Cloudflare សម្រាប់ទិន្នន័យមាន schema និង query។',
    },
  },
  {
    term: 'R2',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'R2 là object storage dùng lưu files (PDF, slides, assets) với pattern download/caching tốt.',
      en: 'R2 is object storage for files (PDFs, slides, assets) with good download/caching patterns.',
      km: 'R2 គឺ object storage សម្រាប់ file (PDF, slide, asset) ជាមួយ download/cache pattern ល្អ។',
    },
  },
  {
    term: 'Durable Objects',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Durable Objects dùng cho state nhất quán theo entity (chat room, session, counter, coordination).',
      en: 'Durable Objects provide consistent per-entity state for coordination (chat rooms, sessions, counters).',
      km: 'Durable Objects ផ្តល់ state ស្ថិរភាពតាម entity សម្រាប់ coordination (chat room, session, counter)។',
    },
  },
  {
    term: 'Workers AI',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Workers AI chạy inference (LLM/embeddings/vision) trên Cloudflare và tích hợp qua binding.',
      en: 'Workers AI runs inference (LLMs/embeddings/vision) on Cloudflare and integrates via bindings.',
      km: 'Workers AI ដំណើរការ inference (LLM/embedding/vision) លើ Cloudflare ហើយ integrate តាម binding។',
    },
  },
  {
    term: 'AI Gateway',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'AI Gateway giúp quản trị calls tới AI providers (routing, caching, observability, cost).',
      en: 'AI Gateway governs AI calls (routing, caching, observability, cost).',
      km: 'AI Gateway គ្រប់គ្រង AI call (routing, cache, observability, cost)។',
    },
  },
  {
    term: 'Vectorize',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Vectorize là vector database để làm semantic search/RAG trên nội dung học.',
      en: 'Vectorize is a vector database for semantic search/RAG over your learning content.',
      km: 'Vectorize គឺ vector database សម្រាប់ semantic search/RAG លើ learning content របស់អ្នក។',
    },
  },
  {
    term: 'Zero Trust',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Zero Trust không tin mặc định: mỗi request được xác minh theo identity, device, context và policy.',
      en: 'Zero Trust does not trust by default: each request is verified by identity, device, context, and policy.',
      km: 'Zero Trust មិន trust by default — request នីមួយៗត្រូវផ្ទៀងផ្ទាត់តាម identity, device, context និង policy។',
    },
  },
  {
    term: 'ZTNA',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'ZTNA cho phép user truy cập private apps theo policy, tránh mở quyền truy cập toàn mạng như VPN.',
      en: 'ZTNA enables policy-based access to private apps without broad network access like VPN.',
      km: 'ZTNA អនុញ្ញាត access ទៅ private app តាម policy ដោយគ្មាន network access ធំដូច VPN។',
    },
  },
  {
    term: 'SWG',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Secure Web Gateway bảo vệ users khi duyệt Internet bằng kiểm soát DNS/HTTP, malware/phishing và policy.',
      en: 'Secure Web Gateway protects users browsing the Internet via DNS/HTTP controls, malware/phishing protection, and policy.',
      km: 'Secure Web Gateway ការពារអ្នកប្រើប្រាស់ពេល browse Internet តាម DNS/HTTP control, malware/phishing protection និង policy។',
    },
  },
  {
    term: 'CASB',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'CASB giúp phát hiện, đánh giá và kiểm soát rủi ro khi sử dụng SaaS applications.',
      en: 'CASB helps discover, assess, and control risks across SaaS applications.',
      km: 'CASB ជួយរក, វាយតម្លៃ និងគ្រប់គ្រង risk ក្នុង SaaS application។',
    },
  },
  {
    term: 'DLP',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'DLP giúp giảm rủi ro rò rỉ dữ liệu nhạy cảm.',
      en: 'DLP reduces the risk of sensitive data leakage.',
      km: 'DLP កាត់បន្ថយ risk នៃ sensitive data leakage។',
    },
  },
  {
    term: 'SASE',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'SASE kết hợp networking + security (Zero Trust) để bảo vệ users và kết nối đến apps/data.',
      en: 'SASE combines networking + security (Zero Trust) to protect users and connect to apps/data.',
      km: 'SASE រួម networking + security (Zero Trust) ដើម្បីការពារអ្នកប្រើ និងភ្ជាប់ទៅ app/data។',
    },
  },
  {
    term: 'Cloudflare WAN',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Cloudflare WAN (trước đây là Magic WAN) hiện đại hoá kết nối WAN, kết hợp routing + security trên mạng Cloudflare.',
      en: 'Cloudflare WAN (formerly Magic WAN) modernizes WAN connectivity with routing + security on Cloudflare’s network.',
      km: 'Cloudflare WAN (ពីមុន Magic WAN) ធ្វើឱ្យ WAN connectivity ទំនើបជាមួយ routing + security លើ network Cloudflare។',
    },
  },
  {
    term: 'Turnstile',
    category: 'App Security',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Turnstile là giải pháp chống bot cho form. Token phải được verify server-side trước khi ghi DB.',
      en: 'Turnstile is bot protection for forms. Tokens must be verified server-side before writing to DB.',
      km: 'Turnstile គឺ bot protection សម្រាប់ form។ Token ត្រូវផ្ទៀងផ្ទាត់ server-side មុន write ទៅ DB។',
    },
  },
  {
    term: 'Web Analytics',
    category: 'Analytics',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Cloudflare Web Analytics cung cấp analytics nhẹ cho website mà không cần JS nặng.',
      en: 'Cloudflare Web Analytics provides lightweight site analytics without heavy JS.',
      km: 'Cloudflare Web Analytics ផ្តល់ site analytics ស្រាលដោយគ្មាន JS ធ្ងន់។',
    },
  },
  {
    term: 'Hyperdrive',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Hyperdrive tăng tốc kết nối từ Workers tới Postgres/MySQL hiện có — giữ database bạn đang dùng.',
      en: 'Hyperdrive speeds Workers connections to your existing Postgres/MySQL — keep your current database.',
      km: 'Hyperdrive បង្កើនល្បឿន Workers connection ទៅ Postgres/MySQL ដែលមានស្រាប់ — រក្សា database បច្ចុប្បន្នរបស់អ្នក។',
    },
  },
  {
    term: 'Cloudflare Tunnel',
    category: 'Zero Trust',
    relatedTrack: 'cloudflare-one',
    definition: {
      vi: 'Tunnel outbound (`cloudflared`) kết nối app nội bộ tới Cloudflare mà không mở port inbound — tên cũ: Argo Tunnel.',
      en: 'Outbound tunnel (`cloudflared`) connects internal apps to Cloudflare without inbound ports — formerly Argo Tunnel.',
      km: 'Outbound tunnel (`cloudflared`) ភ្ជាប់ internal app ទៅ Cloudflare ដោយគ្មាន inbound port — ពីមុន Argo Tunnel។',
    },
  },
  {
    term: 'Workflows',
    category: 'Developer Platform',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Workflows orchestrate job nhiều bước, durable trên Cloudflare — phù hợp pipeline dài hơn một request.',
      en: 'Workflows orchestrate multi-step durable jobs on Cloudflare — for pipelines longer than one request.',
      km: 'Workflows orchestrate job multi-step durable លើ Cloudflare — សម្រាប់ pipeline វែងជាង request តែមួយ។',
    },
  },
  {
    term: 'Agents',
    category: 'AI',
    relatedTrack: 'developer-platform',
    definition: {
      vi: 'Agents SDK giúp build trợ lý có state (chat, tools) trên Workers + Durable Objects.',
      en: 'The Agents SDK builds stateful assistants (chat, tools) on Workers + Durable Objects.',
      km: 'Agents SDK បង្កើត stateful assistant (chat, tool) លើ Workers + Durable Objects។',
    },
  },
  {
    term: 'TTL',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Time To Live — thời gian resolver hoặc cache giữ bản ghi/nội dung trước khi hết hạn.',
      en: 'Time To Live — how long a resolver or cache keeps a record or object before expiry.',
      km: 'Time To Live — រយៈពេល resolver ឬ cache រក្សា record ឬ object មុន expiry។',
    },
  },
  {
    term: 'Orange Cloud',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'DNS record được proxy — traffic đi qua Cloudflare (bảo mật, cache, WAF).',
      en: 'Proxied DNS record — traffic flows through Cloudflare for security, cache, and WAF.',
      km: 'Proxied DNS record — traffic ឆ្លងកាត់ Cloudflare សម្រាប់ security, cache និង WAF។',
    },
  },
  {
    term: 'Gray Cloud',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'DNS only — Cloudflare chỉ phân giải DNS, traffic không qua proxy.',
      en: 'DNS-only — Cloudflare resolves DNS but traffic bypasses the proxy.',
      km: 'DNS-only — Cloudflare resolve DNS ប៉ុន្តែ traffic bypass proxy។',
    },
  },
  {
    term: 'Anycast',
    category: 'Core',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Một IP được quảng bá từ nhiều POP — routing tới edge gần người dùng nhất.',
      en: 'One IP announced from many POPs — routes to the nearest edge.',
      km: 'IP តែមួយ announce ពី POP ច្រើន — route ទៅ edge ដែលជិតបំផុត។',
    },
  },
  {
    term: 'Bot Score',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Điểm 1–99 đánh giá khả năng request là bot: 1 = chắc chắn bot, 30–99 = likely human.',
      en: 'Score 1–99 estimating automation: 1 = definitely bot, 30–99 = likely human.',
      km: 'Score 1–99 ប៉ាន់ស្មាន automation៖ 1 = bot ប្រាកដ, 30–99 = likely human។',
    },
  },
  {
    term: 'Managed Challenge',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Cloudflare tự chọn cơ chế xác minh (JS, interactive) và cấp cookie cf_clearance khi pass.',
      en: 'Cloudflare picks verification (JS, interactive) and sets cf_clearance when passed.',
      km: 'Cloudflare ជ្រើស verification (JS, interactive) ហើយ set cf_clearance ពេល pass។',
    },
  },
  {
    term: 'Managed Ruleset',
    category: 'App Security',
    relatedTrack: 'application-services',
    definition: {
      vi: 'Bộ rule WAF do Cloudflare duy trì và cập nhật — chặn OWASP, CVE, path nhạy cảm.',
      en: 'Cloudflare-maintained WAF rules — blocks OWASP patterns, CVEs, sensitive paths.',
      km: 'WAF rule ដែល Cloudflare maintain — block OWASP pattern, CVE និង sensitive path។',
    },
  },
];
