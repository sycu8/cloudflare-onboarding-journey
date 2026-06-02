import type { LocalizedString } from '../i18n/types';

export const CLOUDSECOP_TAG_URL = 'https://cloudsecop.net/tag/cloudflare/';
export const CLOUDSECOP_ATTRIBUTION = {
  vi: 'Nội dung đọc thêm từ blog CloudSecOp (KhaVan) — kinh nghiệm triển khai thực tế, bổ sung cho tài liệu chính thức Cloudflare.',
  en: 'Further reading from the CloudSecOp blog (KhaVan) — practical deployment notes that complement official Cloudflare docs.',
};

export type CloudsecopSeriesId = 'developer-handbook' | 'cloudflare-one-handbook';

export type CloudsecopSeries = {
  id: CloudsecopSeriesId;
  title: LocalizedString;
  description: LocalizedString;
  href: string;
  relatedTrack: 'developer-platform' | 'cloudflare-one';
  partCount: number;
};

export type CloudsecopArticle = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  readMinutes: number;
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'cross-cutting';
  seriesId?: CloudsecopSeriesId;
  seriesPart?: number;
  tags: string[];
};

export function cloudsecopArticleUrl(slug: string): string {
  return `https://cloudsecop.net/blog/${slug}/`;
}

export const cloudsecopSeries: CloudsecopSeries[] = [
  {
    id: 'developer-handbook',
    title: {
      vi: 'Cloudflare Developer Platform Handbook',
      en: 'Cloudflare Developer Platform Handbook',
    },
    description: {
      vi: '20 bài từ Workers runtime tới migration AWS — viết từ kinh nghiệm vận hành blog production trên stack Cloudflare.',
      en: '20 posts from Workers runtime to AWS migration — written from running a production blog on Cloudflare.',
    },
    href: 'https://cloudsecop.net/series/cloudflare-developer/',
    relatedTrack: 'developer-platform',
    partCount: 20,
  },
  {
    id: 'cloudflare-one-handbook',
    title: { vi: 'Cloudflare One Handbook', en: 'Cloudflare One Handbook' },
    description: {
      vi: '20 bài Zero Trust / SASE: Access, Gateway, Tunnel, WARP, DLP, CASB, Email Security — context triển khai doanh nghiệp.',
      en: '20 Zero Trust / SASE posts: Access, Gateway, Tunnel, WARP, DLP, CASB, Email Security — enterprise deployment context.',
    },
    href: 'https://cloudsecop.net/series/cloudflare-one/',
    relatedTrack: 'cloudflare-one',
    partCount: 20,
  },
];

/** Curated articles from https://cloudsecop.net/tag/cloudflare/ */
export const cloudsecopArticles: CloudsecopArticle[] = [
  // —— Developer Platform Handbook (01–20) ——
  {
    slug: 'cloudflare-developer-platform-la-gi',
    title: {
      vi: 'Cloudflare developer platform là gì, và vì sao khác Lambda',
      en: 'What the Cloudflare developer platform is — and why it differs from Lambda',
    },
    excerpt: {
      vi: 'Mental model đầu tiên: Workers, D1, R2, KV, Queues, DOs, Workers AI, Vectorize — nền tảng edge-native so với Lambda.',
      en: 'First mental model: Workers, D1, R2, KV, Queues, DOs, Workers AI, Vectorize — edge-native vs Lambda.',
    },
    readMinutes: 9,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 1,
    tags: ['Workers', 'mental model'],
  },
  {
    slug: 'workers-runtime-mental-model',
    title: {
      vi: 'Workers runtime mental model: lifecycle, context, limit',
      en: 'Workers runtime mental model: lifecycle, context, limits',
    },
    excerpt: {
      vi: 'fetch handler, waitUntil, subrequest, CPU vs wall time, cold start — 6 ngộ nhận khi chuyển từ Node/Lambda.',
      en: 'fetch handler, waitUntil, subrequests, CPU vs wall time, cold starts — six Node/Lambda misconceptions.',
    },
    readMinutes: 7,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 2,
    tags: ['Workers'],
  },
  {
    slug: 'mental-model-3-binding',
    title: {
      vi: 'Mental model 3 tầng binding: Request, Identity, Storage',
      en: 'The 3-binding mental model: Request, Identity, Storage',
    },
    excerpt: {
      vi: 'Khung chọn storage đúng cho mọi Worker — áp dụng trực tiếp lên app production.',
      en: 'A frame for picking the right storage on every Worker — applied to a live app.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 3,
    tags: ['Workers', 'KV', 'D1', 'R2'],
  },
  {
    slug: 'wrangler-miniflare-dev-loop',
    title: {
      vi: 'Wrangler và Miniflare dev loop: từ init tới deploy trong 30 phút',
      en: 'Wrangler + Miniflare dev loop: init to deploy in 30 minutes',
    },
    excerpt: {
      vi: 'wrangler init, dev local, vitest, D1 migration, secret, deploy 300+ PoP — vòng đời từ folder trống.',
      en: 'wrangler init, local dev, vitest, D1 migrations, secrets, deploy to 300+ PoPs.',
    },
    readMinutes: 6,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 4,
    tags: ['Wrangler', 'Miniflare'],
  },
  {
    slug: 'kv-deep-dive',
    title: { vi: 'KV deep-dive: cache toàn cầu, eventual consistency, vs D1', en: 'KV deep-dive: global cache, consistency, vs D1' },
    excerpt: {
      vi: '5 pattern đúng, 3 anti-pattern, gotcha consistency khi dùng KV ở production.',
      en: 'Five good patterns, three anti-patterns, and real consistency gotchas.',
    },
    readMinutes: 6,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 5,
    tags: ['KV'],
  },
  {
    slug: 'd1-production-patterns',
    title: { vi: 'D1 trong production: primary-replica, batch, và 7 gotcha', en: 'D1 in production: primary-replica, batch, 7 gotchas' },
    excerpt: {
      vi: 'Sessions API, 5 query method, migration an toàn — bài học từ vận hành D1 thật.',
      en: 'Sessions API, five query methods, safe migrations — lessons from real D1 ops.',
    },
    readMinutes: 6,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 6,
    tags: ['D1'],
  },
  {
    slug: 'r2-object-storage',
    title: { vi: 'R2 object storage: S3-compat, egress free, và 4 access pattern', en: 'R2: S3-compat, zero egress, four access patterns' },
    excerpt: {
      vi: 'So sánh R2 vs S3, migration, gotcha consistency và lifecycle.',
      en: 'R2 vs S3, migration, consistency and lifecycle gotchas.',
    },
    readMinutes: 7,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 7,
    tags: ['R2'],
  },
  {
    slug: 'queues-durable-objects',
    title: {
      vi: 'Queues và Durable Objects: async messaging và single-writer state',
      en: 'Queues and Durable Objects: async messaging and single-writer state',
    },
    excerpt: {
      vi: 'Khi nào Queue vs DO, retry/DLQ, pattern coordination — 2 primitive khó nhất trên Workers.',
      en: 'When to use Queues vs DOs, retry/DLQ, coordination patterns.',
    },
    readMinutes: 7,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 8,
    tags: ['Queues', 'Durable Objects'],
  },
  {
    slug: 'router-choice-hono-itty',
    title: { vi: 'Router cho Workers: vanilla, Itty, hay Hono', en: 'Worker routers: vanilla, Itty, or Hono' },
    excerpt: {
      vi: 'Bundle size, middleware, Zod — vì sao blog này chọn vanilla với 40+ route.',
      en: 'Bundle size, middleware, Zod — why vanilla at 40+ routes.',
    },
    readMinutes: 6,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 9,
    tags: ['Workers'],
  },
  {
    slug: 'orm-d1-drizzle-prisma',
    title: { vi: 'ORM cho D1: Drizzle, Prisma, hay raw SQL', en: 'ORMs for D1: Drizzle, Prisma, or raw SQL' },
    excerpt: {
      vi: '0KB SQL thô vs Drizzle 10KB vs Prisma 500KB WASM — khi nào ORM không đáng.',
      en: 'Raw SQL vs Drizzle vs Prisma WASM — when an ORM hurts more than it helps.',
    },
    readMinutes: 6,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 10,
    tags: ['D1', 'Drizzle', 'Prisma'],
  },
  {
    slug: 'astro-remix-sveltekit-workers',
    title: {
      vi: 'Astro, Remix, SvelteKit trên Workers: adapter và trade-off',
      en: 'Astro, Remix, SvelteKit on Workers: adapters and trade-offs',
    },
    excerpt: {
      vi: 'SSG vs SSR vs hybrid — setup thực tế và lý do chọn Astro cho blog.',
      en: 'SSG vs SSR vs hybrid — real setup and why Astro for this blog.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 11,
    tags: ['Pages', 'Astro'],
  },
  {
    slug: 'ci-cd-wrangler-github-actions',
    title: { vi: 'CI/CD với Wrangler + GitHub Actions: pipeline, smoke test', en: 'CI/CD with Wrangler + GitHub Actions' },
    excerpt: {
      vi: 'test → build → deploy → smoke, 19 assertion, rollback 10 giây — full workflow file.',
      en: 'test → build → deploy → smoke, 19 assertions, 10-second rollback.',
    },
    readMinutes: 9,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 12,
    tags: ['Wrangler', 'CI/CD'],
  },
  {
    slug: 'workers-ai-model-catalog',
    title: {
      vi: 'Workers AI + AI Gateway: catalog, pricing, vs Bedrock/OpenAI',
      en: 'Workers AI + AI Gateway: catalog, pricing, vs Bedrock/OpenAI',
    },
    excerpt: {
      vi: 'Inference edge GPU, proxy multi-provider, cache + rate limit + retry production.',
      en: 'Edge inference, multi-provider proxy, cache, rate limits, production retry.',
    },
    readMinutes: 10,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 13,
    tags: ['Workers AI', 'AI Gateway'],
  },
  {
    slug: 'vectorize-rag-pattern',
    title: { vi: 'Vectorize + RAG: embeddings, top-K, hybrid search edge', en: 'Vectorize + RAG: embeddings, top-K, hybrid search' },
    excerpt: {
      vi: 'Pipeline ingest/query, chunking, hybrid search D1, reranking trọn edge.',
      en: 'Ingest/query pipelines, chunking, D1 hybrid search, edge reranking.',
    },
    readMinutes: 9,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 14,
    tags: ['Vectorize', 'RAG'],
  },
  {
    slug: 'durable-objects-realtime',
    title: {
      vi: 'Durable Objects cho realtime: chat, collab, game state',
      en: 'Durable Objects for realtime: chat, collab, game state',
    },
    excerpt: {
      vi: '1 roomId = 1 instance, WebSocket hibernation — 6 pattern và khi nào DO là quá mức.',
      en: 'One roomId = one instance, WebSocket hibernation — six patterns and when DO is overkill.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 15,
    tags: ['Durable Objects'],
  },
  {
    slug: 'stream-images-media',
    title: {
      vi: 'Stream và Images: media pipeline ở edge, khi nào dùng product nào',
      en: 'Stream and Images: edge media pipelines',
    },
    excerpt: {
      vi: 'Video HLS/DASH, upload-transform-deliver, cf.image — pipeline và pricing.',
      en: 'HLS/DASH video, transform-deliver images, cf.image pipelines and pricing.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 16,
    tags: ['Stream', 'Images'],
  },
  {
    slug: 'logs-analytics-tail-workers',
    title: {
      vi: 'Observability cho Worker: Logs, Tail Workers, Analytics',
      en: 'Worker observability: Logs, Tail Workers, Analytics',
    },
    excerpt: {
      vi: '4 tầng: Workers Logs, Tail, Logpush, Analytics Engine — debug production.',
      en: 'Four layers: Workers Logs, Tail, Logpush, Analytics Engine — production debugging.',
    },
    readMinutes: 9,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 17,
    tags: ['observability'],
  },
  {
    slug: 'secrets-csp-bot-management',
    title: {
      vi: 'Security cho Worker: secrets, CSP, Bot Management, Turnstile',
      en: 'Worker security: secrets, CSP, Bot Management, Turnstile',
    },
    excerpt: {
      vi: 'Defense-in-depth: WAF, Turnstile, Access JWT, Zod validation, anti-pattern.',
      en: 'Defense-in-depth: WAF, Turnstile, Access JWT, Zod validation, anti-patterns.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 18,
    tags: ['security', 'Turnstile'],
  },
  {
    slug: 'cost-model-production',
    title: {
      vi: 'Cost model Cloudflare Developer Platform: tier, so sánh AWS',
      en: 'Cloudflare Developer Platform cost model vs AWS',
    },
    excerpt: {
      vi: 'Pricing từng primitive, breakpoint, 3 scenario: blog, SaaS 10k user, 100M req/tháng.',
      en: 'Per-primitive pricing, breakpoints, blog / 10k-user SaaS / 100M req scenarios.',
    },
    readMinutes: 11,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 19,
    tags: ['pricing'],
  },
  {
    slug: 'migration-aws-to-cloudflare',
    title: {
      vi: 'Migration AWS/Vercel sang Cloudflare: playbook thực tế',
      en: 'Migrating AWS/Vercel to Cloudflare: a real playbook',
    },
    excerpt: {
      vi: 'Mapping primitive, 3 chiến lược, cutover, rollback, 10 pitfall từ migration thật.',
      en: 'Primitive mapping, three strategies, cutover, rollback, ten real pitfalls.',
    },
    readMinutes: 10,
    relatedTrack: 'developer-platform',
    seriesId: 'developer-handbook',
    seriesPart: 20,
    tags: ['migration'],
  },
  // —— Cloudflare One Handbook (01–20) ——
  {
    slug: 'cloudflare-one-la-gi',
    title: { vi: 'Cloudflare One là gì, và vì sao SASE quan trọng', en: 'What Cloudflare One is — and why SASE matters' },
    excerpt: {
      vi: '6 nhóm capability, so sánh Zscaler/Netskope, mental model trước triển khai.',
      en: 'Six capability groups, vs Zscaler/Netskope, mental model before deployment.',
    },
    readMinutes: 25,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 1,
    tags: ['SASE', 'Zero Trust'],
  },
  {
    slug: 'sase-sse-zero-trust-thuat-ngu',
    title: {
      vi: 'SASE, SSE, Zero Trust, ZTNA: phân biệt thuật ngữ trước khi sa lầy',
      en: 'SASE, SSE, Zero Trust, ZTNA: terminology without confusion',
    },
    excerpt: {
      vi: 'Phạm vi từng thuật ngữ, decision tree chọn đúng trong RFP và design doc.',
      en: 'Scope of each term and a small decision tree for RFPs and design docs.',
    },
    readMinutes: 16,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 2,
    tags: ['SASE', 'ZTNA'],
  },
  {
    slug: 'mental-model-client-identity-policy-resource',
    title: {
      vi: 'Mental model 4 tầng: Client, Identity, Policy, Resource',
      en: 'Four-layer mental model: Client, Identity, Policy, Resource',
    },
    excerpt: {
      vi: 'Mọi request Zero Trust đi qua 4 tầng — framework triển khai và truy nguyên.',
      en: 'Every Zero Trust request crosses four layers — deploy and troubleshoot framework.',
    },
    readMinutes: 17,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 3,
    tags: ['Zero Trust'],
  },
  {
    slug: 'cloudflare-access-ztna-co-ban',
    title: { vi: 'Cloudflare Access: ZTNA cơ bản trong 30 phút', en: 'Cloudflare Access: ZTNA basics in 30 minutes' },
    excerpt: {
      vi: '5 bước: app, IdP, policy, Tunnel, test — thay VPN cho app nội bộ.',
      en: 'Five steps: app, IdP, policy, Tunnel, test — VPN replacement for internal apps.',
    },
    readMinutes: 16,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 4,
    tags: ['Access', 'ZTNA'],
  },
  {
    slug: 'identity-provider-integration',
    title: { vi: 'Integrate IdP: Okta, Entra ID, Google Workspace, SAML generic', en: 'Integrating IdPs with Access' },
    excerpt: {
      vi: 'OIDC vs SAML, group claim, multi-IdP, checklist trước production.',
      en: 'OIDC vs SAML, group claims, multi-IdP, pre-production checklist.',
    },
    readMinutes: 17,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 5,
    tags: ['Access', 'IdP'],
  },
  {
    slug: 'service-tokens-mtls-cho-non-human',
    title: {
      vi: 'Service tokens và mTLS: authentication cho CI/CD, bot, device',
      en: 'Service tokens and mTLS for non-human clients',
    },
    excerpt: {
      vi: 'Phân biệt service token vs mTLS, rotate, audit, anti-pattern.',
      en: 'Service tokens vs mTLS, rotation, audit, anti-patterns.',
    },
    readMinutes: 13,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 6,
    tags: ['Access'],
  },
  {
    slug: 'scim-va-group-sync',
    title: { vi: 'SCIM và group sync: tự động off-board khi nhân viên nghỉ', en: 'SCIM and group sync for offboarding' },
    excerpt: {
      vi: 'IdP đẩy cập nhật realtime — đóng cửa sổ truy cập khi off-board.',
      en: 'IdP pushes realtime updates — close the access window on offboarding.',
    },
    readMinutes: 17,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 7,
    tags: ['SCIM'],
  },
  {
    slug: 'cloudflare-tunnel-deep-dive',
    title: { vi: 'Cloudflare Tunnel deep-dive: đưa internal service ra ngoài', en: 'Cloudflare Tunnel deep-dive' },
    excerpt: {
      vi: 'cloudflared, ingress, HA, SSH/RDP/SMB — nền tảng kết nối Zero Trust.',
      en: 'cloudflared, ingress, HA, SSH/RDP/SMB — Zero Trust connectivity foundation.',
    },
    readMinutes: 14,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 8,
    tags: ['Tunnel'],
  },
  {
    slug: 'warp-client-va-device-enrollment',
    title: { vi: 'WARP client và device enrollment flow', en: 'WARP client and device enrollment' },
    excerpt: {
      vi: 'Split tunnel, posture, MDM deploy, truy nguyên 6 trường hợp thường gặp.',
      en: 'Split tunnel, posture, MDM rollout, six common troubleshooting cases.',
    },
    readMinutes: 14,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 9,
    tags: ['WARP'],
  },
  {
    slug: 'magic-wan-va-bgp-over-gre',
    title: { vi: 'Magic WAN: kết nối site và cloud qua Cloudflare backbone', en: 'Magic WAN: site and cloud connectivity' },
    excerpt: {
      vi: 'IPsec, GRE, CNI, BGP — thay SD-WAN/MPLS, Magic Firewall.',
      en: 'IPsec, GRE, CNI, BGP — SD-WAN/MPLS replacement, Magic Firewall.',
    },
    readMinutes: 15,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 10,
    tags: ['Magic WAN'],
  },
  {
    slug: 'gateway-dns-filtering',
    title: { vi: 'Gateway DNS filtering: lớp đầu tiên của Secure Web Gateway', en: 'Gateway DNS filtering: first SWG layer' },
    excerpt: {
      vi: 'Resolver, policy order, DoH, threat intel, log SIEM, checklist production.',
      en: 'Resolver, policy order, DoH, threat intel, SIEM logs, production checklist.',
    },
    readMinutes: 18,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 11,
    tags: ['Gateway', 'SWG'],
  },
  {
    slug: 'gateway-http-filtering-va-tls-decryption',
    title: {
      vi: 'Gateway HTTP filtering và TLS decryption: khi DNS không đủ',
      en: 'Gateway HTTP filtering and TLS decryption',
    },
    excerpt: {
      vi: 'Root CA MDM/GPO, cert pinning, DLP inline, playbook triển khai.',
      en: 'Root CA via MDM/GPO, cert pinning, inline DLP, deployment playbook.',
    },
    readMinutes: 20,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 12,
    tags: ['Gateway'],
  },
  {
    slug: 'network-policy-l4-non-http',
    title: { vi: 'Network policy L4: chặn non-HTTP, DoH bypass và app rule', en: 'L4 network policies and DoH bypass' },
    excerpt: {
      vi: 'Chặn SSH/RDP/SMTP, DoH bypass, app rule SaaS — playbook siết chặt.',
      en: 'Block SSH/RDP/SMTP, DoH bypass, SaaS app rules — tightening playbook.',
    },
    readMinutes: 15,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 13,
    tags: ['Gateway'],
  },
  {
    slug: 'logs-pipeline-logpush-siem',
    title: { vi: 'Logs pipeline: Logpush, R2, SIEM và cross-layer correlation', en: 'Logs pipeline: Logpush, R2, SIEM' },
    excerpt: {
      vi: 'Dataset, retention hot/warm/cold, chi phí, rule phát hiện SIEM mẫu.',
      en: 'Datasets, hot/warm/cold retention, cost control, sample SIEM rules.',
    },
    readMinutes: 12,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 14,
    tags: ['logs', 'SIEM'],
  },
  {
    slug: 'dex-digital-experience-monitoring',
    title: { vi: 'DEX: Digital Experience Monitoring và proactive SLO', en: 'DEX and proactive SLOs' },
    excerpt: {
      vi: 'Chẩn đoán DNS/TCP/TLS/TTFB khi control plane UP nhưng user chậm.',
      en: 'DNS/TCP/TLS/TTFB diagnosis when the control plane is up but users are slow.',
    },
    readMinutes: 15,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 15,
    tags: ['DEX'],
  },
  {
    slug: 'device-posture-continuous-verification',
    title: {
      vi: 'Device posture và continuous verification mọi request',
      en: 'Device posture and continuous verification',
    },
    excerpt: {
      vi: 'WARP check, EDR integration, continuous verification trong Access policy.',
      en: 'WARP checks, EDR integration, continuous verification in Access policies.',
    },
    readMinutes: 17,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 16,
    tags: ['posture'],
  },
  {
    slug: 'browser-isolation-rbi-deep-dive',
    title: {
      vi: 'Browser Isolation (RBI): render risky web trong sandbox remote',
      en: 'Remote Browser Isolation (RBI) deep-dive',
    },
    excerpt: {
      vi: 'NVR architecture, data controls, compliance, cost model.',
      en: 'NVR architecture, data controls, compliance, cost model.',
    },
    readMinutes: 15,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 17,
    tags: ['RBI'],
  },
  {
    slug: 'casb-saas-posture-misconfig',
    title: {
      vi: 'CASB: posture và misconfig SaaS (GWorkspace, M365, SF)',
      en: 'CASB: SaaS posture and misconfigurations',
    },
    excerpt: {
      vi: 'Inline vs API, 8000 finding tuần đầu, shadow IT, khi nào không dùng CASB.',
      en: 'Inline vs API, first-week finding shock, shadow IT, when not to use CASB.',
    },
    readMinutes: 18,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 18,
    tags: ['CASB'],
  },
  {
    slug: 'dlp-data-loss-prevention-deep-dive',
    title: { vi: 'DLP: pattern, classification và 55% false positive', en: 'DLP: patterns, classification, false positives' },
    excerpt: {
      vi: 'Tinh chỉnh FP 55% → 3%, profile CCCD Việt Nam, Gateway vs CASB API.',
      en: 'Tuning FP from 55% to 3%, Vietnam CCCD profile, Gateway vs CASB API.',
    },
    readMinutes: 14,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 19,
    tags: ['DLP'],
  },
  {
    slug: 'email-security-area1-deep-dive',
    title: {
      vi: 'Email Security: chặn phishing, BEC, và bài toán DMARC forwarder',
      en: 'Email Security: phishing, BEC, DMARC forwarder traps',
    },
    excerpt: {
      vi: 'MX inline vs API journaling, homoglyph FP, user report → retract < 1h.',
      en: 'MX inline vs API journaling, homoglyph FP, user report → retract under 1h.',
    },
    readMinutes: 15,
    relatedTrack: 'cloudflare-one',
    seriesId: 'cloudflare-one-handbook',
    seriesPart: 20,
    tags: ['Email Security'],
  },
  // —— Standalone / cross-cutting ——
  {
    slug: 'd1-schema-tips',
    title: { vi: 'Năm lưu ý về schema D1 mình rút ra từ những bài học đau thương', en: 'Five D1 schema lessons learned the hard way' },
    excerpt: {
      vi: 'Composite PK, index đúng pattern, FTS, sharding, backup — ~50M rows thực tế.',
      en: 'Composite PKs, indexes, FTS, sharding, backups — ~50M real rows.',
    },
    readMinutes: 11,
    relatedTrack: 'developer-platform',
    tags: ['D1'],
  },
  {
    slug: 'cloudflare-agents-production-patterns',
    title: {
      vi: 'cloudflare/agents trên Workers + Durable Objects — production patterns',
      en: 'cloudflare/agents on Workers + Durable Objects',
    },
    excerpt: {
      vi: 'Hibernation, tool calling, multi-agent WebSocket, schedule() — ~$0.04/agent/tháng.',
      en: 'Hibernation, tool calling, multi-agent WebSocket, schedule() — ~$0.04/agent/month.',
    },
    readMinutes: 7,
    relatedTrack: 'developer-platform',
    tags: ['Agents SDK'],
  },
  {
    slug: 'mcp-server-cloudflare-vs-bedrock-agentcore',
    title: {
      vi: 'MCP server: Cloudflare Workers vs AWS Bedrock AgentCore',
      en: 'MCP server: Cloudflare Workers vs AWS Bedrock AgentCore',
    },
    excerpt: {
      vi: 'Latency, cost, auth OAuth — so sánh và khi nào chọn stack nào.',
      en: 'Latency, cost, OAuth auth — comparison and when to pick each stack.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    tags: ['MCP'],
  },
  {
    slug: 'agentic-inbox-self-host-email',
    title: {
      vi: 'Agentic Inbox: self-host email assistant trên Cloudflare stack',
      en: 'Agentic Inbox: self-hosted email assistant on Cloudflare',
    },
    excerpt: {
      vi: 'IMAP Worker, R2 attachment, Workers AI classify, D1 thread — $5/tháng vs Superhuman.',
      en: 'IMAP Worker, R2 attachments, Workers AI classify, D1 threads — $5/mo vs Superhuman.',
    },
    readMinutes: 10,
    relatedTrack: 'developer-platform',
    tags: ['Workers AI'],
  },
  {
    slug: 'vibesdk-cloudflare-ai-coding-platform',
    title: {
      vi: 'VibeSDK: build AI coding platform riêng trên Cloudflare stack',
      en: 'VibeSDK: your own AI coding platform on Cloudflare',
    },
    excerpt: {
      vi: 'Workers + Workers AI + AI Gateway + Containers + R2 + D1 — AI Gateway cache cắt 60% LLM cost.',
      en: 'Workers + Workers AI + AI Gateway + Containers + R2 + D1 — Gateway cache cuts 60% LLM cost.',
    },
    readMinutes: 9,
    relatedTrack: 'developer-platform',
    tags: ['AI'],
  },
  {
    slug: 'wildebeest-mastodon-on-cloudflare',
    title: {
      vi: 'Wildebeest: self-host Mastodon trên Cloudflare stack',
      en: 'Wildebeest: self-hosted Mastodon on Cloudflare',
    },
    excerpt: {
      vi: 'ActivityPub trên Workers + D1 + R2 + KV — $0-5/tháng vs $50-200 VPS.',
      en: 'ActivityPub on Workers + D1 + R2 + KV — $0-5/mo vs $50-200 VPS.',
    },
    readMinutes: 8,
    relatedTrack: 'developer-platform',
    tags: ['Workers'],
  },
  {
    slug: 'workers-assets-static-site',
    title: {
      vi: 'Chuyển blog tĩnh từ Cloudflare Pages sang Workers Assets',
      en: 'Moving a static blog from Pages to Workers Assets',
    },
    excerpt: {
      vi: 'Đánh đổi thực tế và cấu hình cần biết trước khi migrate.',
      en: 'Real trade-offs and config to know before migrating.',
    },
    readMinutes: 10,
    relatedTrack: 'developer-platform',
    tags: ['Pages', 'Workers'],
  },
  {
    slug: 'lol-html-streaming-rewriter',
    title: {
      vi: 'lol-html: streaming HTML rewriter trên Workers — 3 production patterns',
      en: 'lol-html streaming HTML rewriter on Workers',
    },
    excerpt: {
      vi: 'CSP nonce per request, rewrite analytics URL, A/B inject tại edge.',
      en: 'Per-request CSP nonce, analytics URL rewrite, A/B inject at the edge.',
    },
    readMinutes: 7,
    relatedTrack: 'application-services',
    tags: ['Workers', 'HTML'],
  },
  {
    slug: 'bedrock-workers-oidc-case-study',
    title: {
      vi: 'Bedrock từ Workers qua OIDC federation — case study production',
      en: 'Bedrock from Workers via OIDC federation — production case study',
    },
    excerpt: {
      vi: 'RS256 JWT → STS AssumeRoleWithWebIdentity → Bedrock — số liệu latency thực.',
      en: 'RS256 JWT → STS AssumeRoleWithWebIdentity → Bedrock — real latency numbers.',
    },
    readMinutes: 9,
    relatedTrack: 'cross-cutting',
    tags: ['Workers', 'AWS'],
  },
  {
    slug: 'aws-secrets-manager-vs-cloudflare-secrets',
    title: {
      vi: 'AWS Secrets Manager vs Cloudflare Secrets Store',
      en: 'AWS Secrets Manager vs Cloudflare Secrets Store',
    },
    excerpt: {
      vi: 'Khi nào chọn cái nào, replication pattern, chi phí.',
      en: 'When to pick each, replication patterns, cost.',
    },
    readMinutes: 7,
    relatedTrack: 'developer-platform',
    tags: ['secrets'],
  },
  {
    slug: 'cloudflare-access-vs-aws-iam-idc',
    title: {
      vi: 'Cloudflare Access vs AWS IAM Identity Center cho team admin',
      en: 'Cloudflare Access vs AWS IAM Identity Center',
    },
    excerpt: {
      vi: 'Pattern thực dụng: Okta/Entra SSO cả hai, SCIM, per-app policy.',
      en: 'Pragmatic pattern: Okta/Entra SSO to both, SCIM, per-app policies.',
    },
    readMinutes: 8,
    relatedTrack: 'cloudflare-one',
    tags: ['Access', 'AWS'],
  },
  {
    slug: 'zero-trust-notes',
    title: { vi: 'Ghi chép sau 3 tháng triển khai Zero Trust', en: 'Notes after 3 months of Zero Trust rollout' },
    excerpt: {
      vi: 'Điều hiệu quả, không như kỳ vọng, bài học vận hành hàng ngàn user.',
      en: 'What worked, what did not, ops lessons at thousands of users.',
    },
    readMinutes: 18,
    relatedTrack: 'cloudflare-one',
    tags: ['Zero Trust', 'operations'],
  },
  {
    slug: 'cloudflared-internals-from-source',
    title: {
      vi: 'cloudflared internals — build from source, ingress patterns, debugging',
      en: 'cloudflared internals — build, ingress, debugging',
    },
    excerpt: {
      vi: 'Build Go source, ingress.yaml advanced, tunnel info JSON monitoring.',
      en: 'Build from Go source, advanced ingress.yaml, tunnel info JSON monitoring.',
    },
    readMinutes: 6,
    relatedTrack: 'cloudflare-one',
    tags: ['Tunnel'],
  },
  {
    slug: 'boringtun-wireguard-warp',
    title: {
      vi: 'Boringtun: WireGuard userspace cho WARP',
      en: 'Boringtun: WireGuard userspace for WARP',
    },
    excerpt: {
      vi: 'Kiến trúc WARP client, userspace WG vs kernel module trên mobile/edge.',
      en: 'WARP client architecture, userspace WG vs kernel modules on mobile/edge.',
    },
    readMinutes: 7,
    relatedTrack: 'cloudflare-one',
    tags: ['WARP'],
  },
  {
    slug: 'flan-vulnerability-scanner',
    title: {
      vi: 'Flan: vulnerability scanner Cloudflare dùng trong production',
      en: 'Flan: Cloudflare’s production vulnerability scanner',
    },
    excerpt: {
      vi: 'nmap NSE + Vulners API, integrate CI gate CVE.',
      en: 'nmap NSE + Vulners API, CI CVE gate integration.',
    },
    readMinutes: 9,
    relatedTrack: 'cross-cutting',
    tags: ['security'],
  },
  {
    slug: 'pingora-vs-aws-alb-nlb',
    title: { vi: 'Pingora vs AWS ALB/NLB', en: 'Pingora vs AWS ALB/NLB' },
    excerpt: {
      vi: 'Khi nào self-host reverse proxy bằng pingora-core thắng ALB managed.',
      en: 'When self-hosted pingora-core beats managed ALB.',
    },
    readMinutes: 9,
    relatedTrack: 'application-services',
    tags: ['Pingora'],
  },
  {
    slug: 'ebpf-exporter-cloudflare-pattern',
    title: {
      vi: 'eBPF metrics cho production — Cloudflare ebpf_exporter pattern',
      en: 'eBPF metrics — Cloudflare’s ebpf_exporter pattern',
    },
    excerpt: {
      vi: 'Kernel metrics qua Prometheus không sidecar — so sánh CloudWatch/Datadog.',
      en: 'Kernel metrics via Prometheus without sidecars — vs CloudWatch/Datadog.',
    },
    readMinutes: 8,
    relatedTrack: 'cross-cutting',
    tags: ['observability'],
  },
  {
    slug: 'cspm-across-multiple-landing-zones',
    title: { vi: 'Chạy CSPM trên hơn chục AWS Landing Zone', en: 'CSPM across many AWS Landing Zones' },
    excerpt: {
      vi: 'Prowler song song, finding vào D1, artifact R2 — dashboard SecOps.',
      en: 'Parallel Prowler, findings in D1, artifacts in R2 — SecOps dashboard.',
    },
    readMinutes: 11,
    relatedTrack: 'cross-cutting',
    tags: ['CSPM', 'D1', 'R2'],
  },
  {
    slug: 'cfssl-pki-toolkit-production',
    title: { vi: 'CFSSL trong production — PKI toolkit cho internal CA', en: 'CFSSL in production — internal CA PKI' },
    excerpt: {
      vi: 'cfssl init, intermediate CA, OCSP — so sánh AWS Private CA $400/tháng.',
      en: 'cfssl init, intermediate CA, OCSP — vs AWS Private CA $400/mo.',
    },
    readMinutes: 8,
    relatedTrack: 'cross-cutting',
    tags: ['PKI'],
  },
];

const applicationServicesSlugs = [
  'lol-html-streaming-rewriter',
  'pingora-vs-aws-alb-nlb',
  'secrets-csp-bot-management',
  'logs-analytics-tail-workers',
];

export function getCloudsecopArticlesForTrack(
  track: 'application-services' | 'developer-platform' | 'cloudflare-one',
  limit = 6,
): CloudsecopArticle[] {
  if (track === 'application-services') {
    const picked = applicationServicesSlugs
      .map((slug) => cloudsecopArticles.find((a) => a.slug === slug))
      .filter((a): a is CloudsecopArticle => Boolean(a));
    const rest = cloudsecopArticles.filter(
      (a) => a.relatedTrack === 'application-services' && !applicationServicesSlugs.includes(a.slug),
    );
    return [...picked, ...rest].slice(0, limit);
  }
  return cloudsecopArticles.filter((a) => a.relatedTrack === track).slice(0, limit);
}

export function getCloudsecopSeriesForTrack(
  track: 'developer-platform' | 'cloudflare-one',
): CloudsecopSeries | undefined {
  return cloudsecopSeries.find((s) => s.relatedTrack === track);
}

export const cloudsecopIntro: LocalizedString = CLOUDSECOP_ATTRIBUTION;
