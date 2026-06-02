import type { LocalizedString } from '../i18n/types';

export const CLOUDFLARE_GITHUB_ORG = 'https://github.com/cloudflare';

export type GitHubRepoCategory =
  | 'workers'
  | 'zero-trust'
  | 'ai'
  | 'docs'
  | 'infrastructure'
  | 'examples';

export type GitHubRepo = {
  name: string;
  href: string;
  description: LocalizedString;
  /** What learners can try — mini “bài ví dụ” */
  exampleUse: LocalizedString;
  stars: number;
  language?: string;
  license?: string;
  category: GitHubRepoCategory;
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'cross-cutting';
  pinned?: boolean;
  topics?: string[];
};

export const githubIntro: LocalizedString = {
  vi: 'Cloudflare open source trên GitHub — repo chính thức để học qua code, README và ví dụ. Chọn repo theo lộ trình hoặc chủ đề bên dưới.',
  en: 'Official Cloudflare open source on GitHub — learn from code, READMEs, and examples. Pick a repo by track or topic below.',
};

export const githubCategories: Record<
  GitHubRepoCategory,
  { label: LocalizedString; description: LocalizedString }
> = {
  workers: {
    label: { vi: 'Workers & Platform', en: 'Workers & Platform' },
    description: {
      vi: 'Runtime, CLI Wrangler, SDK và framework deploy lên edge.',
      en: 'Runtime, Wrangler CLI, SDKs, and deploy-to-edge frameworks.',
    },
  },
  'zero-trust': {
    label: { vi: 'Zero Trust & Tunnel', en: 'Zero Trust & Tunnel' },
    description: {
      vi: 'Kết nối an toàn, WARP client, tunnel tới app nội bộ.',
      en: 'Secure connectivity, WARP client, tunnels to internal apps.',
    },
  },
  ai: {
    label: { vi: 'AI & Agents', en: 'AI & Agents' },
    description: {
      vi: 'Agents SDK, vibe coding, MCP — build AI trên stack Cloudflare.',
      en: 'Agents SDK, vibe coding, MCP — build AI on the Cloudflare stack.',
    },
  },
  docs: {
    label: { vi: 'Tài liệu', en: 'Documentation' },
    description: {
      vi: 'Nguồn docs chính thức — đối chiếu khi học trong hub.',
      en: 'Official docs source — cross-check while learning in the hub.',
    },
  },
  infrastructure: {
    label: { vi: 'Hạ tầng & Core', en: 'Infrastructure & Core' },
    description: {
      vi: 'Protocol, crypto, HTML rewriter — hiểu nền tảng phía sau edge.',
      en: 'Protocols, crypto, HTML rewriter — understand what powers the edge.',
    },
  },
  examples: {
    label: { vi: 'Ví dụ & Demo', en: 'Examples & Demos' },
    description: {
      vi: 'Project mẫu clone được — học bằng cách chạy và sửa code.',
      en: 'Cloneable sample projects — learn by running and changing code.',
    },
  },
};

/** Curated from https://github.com/cloudflare (pinned + high-signal repos) */
export const githubRepos: GitHubRepo[] = [
  {
    name: 'workers-sdk',
    href: `${CLOUDFLARE_GITHUB_ORG}/workers-sdk`,
    description: {
      vi: 'Home của Wrangler — CLI deploy và dev Workers, Pages, D1, R2.',
      en: 'Home of Wrangler — CLI to develop and deploy Workers, Pages, D1, R2.',
    },
    exampleUse: {
      vi: 'Clone repo → đọc README Wrangler → chạy `npm create cloudflare@latest` theo hướng dẫn trong docs.',
      en: 'Clone the repo → read the Wrangler README → run `npm create cloudflare@latest` as documented.',
    },
    stars: 4100,
    language: 'TypeScript',
    license: 'Apache-2.0',
    category: 'workers',
    relatedTrack: 'developer-platform',
    pinned: true,
    topics: ['Wrangler', 'Workers'],
  },
  {
    name: 'workerd',
    href: `${CLOUDFLARE_GITHUB_ORG}/workerd`,
    description: {
      vi: 'JavaScript/Wasm runtime chạy Cloudflare Workers — V8 isolates tại edge.',
      en: 'The JavaScript/Wasm runtime behind Cloudflare Workers — V8 isolates at the edge.',
    },
    exampleUse: {
      vi: 'Đọc kiến trúc runtime để hiểu cold start, limit CPU/subrequest khác với Node server.',
      en: 'Read runtime architecture to understand cold starts and CPU/subrequest limits vs Node.',
    },
    stars: 8300,
    language: 'C++',
    category: 'infrastructure',
    relatedTrack: 'developer-platform',
    pinned: true,
  },
  {
    name: 'workers-rs',
    href: `${CLOUDFLARE_GITHUB_ORG}/workers-rs`,
    description: {
      vi: 'Viết Workers 100% Rust qua WebAssembly.',
      en: 'Write Cloudflare Workers in 100% Rust via WebAssembly.',
    },
    exampleUse: {
      vi: 'Làm ví dụ “Hello Worker” bằng Rust nếu team bạn ưu tiên Rust thay vì JS/TS.',
      en: 'Build a “Hello Worker” in Rust if your team prefers Rust over JS/TS.',
    },
    stars: 3500,
    language: 'Rust',
    category: 'workers',
    relatedTrack: 'developer-platform',
    pinned: true,
  },
  {
    name: 'cloudflared',
    href: `${CLOUDFLARE_GITHUB_ORG}/cloudflared`,
    description: {
      vi: 'Cloudflare Tunnel client — đưa service nội bộ ra Internet an toàn không mở port.',
      en: 'Cloudflare Tunnel client — expose internal services without opening inbound ports.',
    },
    exampleUse: {
      vi: 'Cài cloudflared local → tạo tunnel tới app staging → kết hợp với Access policy trong hub.',
      en: 'Install cloudflared locally → tunnel to a staging app → pair with Access policies from the hub.',
    },
    stars: 14400,
    language: 'Go',
    category: 'zero-trust',
    relatedTrack: 'cloudflare-one',
    pinned: true,
    topics: ['Tunnel', 'Zero Trust'],
  },
  {
    name: 'quiche',
    href: `${CLOUDFLARE_GITHUB_ORG}/quiche`,
    description: {
      vi: 'Implementation QUIC + HTTP/3 — giao thức hiện đại cho web nhanh và mã hóa.',
      en: 'QUIC and HTTP/3 implementation — modern protocol for fast, encrypted web.',
    },
    exampleUse: {
      vi: 'Đọc để hiểu vì sao HTTP/3 và QUIC liên quan performance Application Services.',
      en: 'Read to understand how HTTP/3 and QUIC relate to Application Services performance.',
    },
    stars: 11500,
    language: 'Rust',
    category: 'infrastructure',
    relatedTrack: 'application-services',
    pinned: true,
  },
  {
    name: 'foundations',
    href: `${CLOUDFLARE_GITHUB_ORG}/foundations`,
    description: {
      vi: 'Rust service foundations — pattern vận hành service nội bộ Cloudflare.',
      en: 'Rust service foundations — operational patterns inside Cloudflare services.',
    },
    exampleUse: {
      vi: 'Tham khảo cách tổ chức config, logging, health check cho service Rust production.',
      en: 'Reference config, logging, and health-check patterns for production Rust services.',
    },
    stars: 1600,
    language: 'Rust',
    category: 'infrastructure',
    relatedTrack: 'cross-cutting',
    pinned: true,
  },
  {
    name: 'cloudflare-docs',
    href: `${CLOUDFLARE_GITHUB_ORG}/cloudflare-docs`,
    description: {
      vi: 'Source tài liệu developers.cloudflare.com — MDX, ví dụ, changelog.',
      en: 'Source for developers.cloudflare.com — MDX, examples, changelog.',
    },
    exampleUse: {
      vi: 'Tìm ví dụ wrangler.jsonc và snippet API đúng version khi làm lab trong lộ trình Developer Platform.',
      en: 'Find wrangler.jsonc examples and API snippets for Developer Platform labs.',
    },
    stars: 4780,
    language: 'MDX',
    license: 'CC-BY-4.0',
    category: 'docs',
    relatedTrack: 'cross-cutting',
    topics: ['documentation'],
  },
  {
    name: 'agents',
    href: `${CLOUDFLARE_GITHUB_ORG}/agents`,
    description: {
      vi: 'Build và deploy AI Agents trên Cloudflare (Durable Objects, WebSocket, tools).',
      en: 'Build and deploy AI Agents on Cloudflare (Durable Objects, WebSocket, tools).',
    },
    exampleUse: {
      vi: 'Fork template agents → thêm 1 tool gọi D1 → deploy lên Workers — bài lab AI cơ bản.',
      en: 'Fork the agents template → add one D1 tool → deploy to Workers — basic AI lab.',
    },
    stars: 5000,
    language: 'TypeScript',
    license: 'MIT',
    category: 'ai',
    relatedTrack: 'developer-platform',
    topics: ['Agents SDK', 'Workers AI'],
  },
  {
    name: 'vibesdk',
    href: `${CLOUDFLARE_GITHUB_ORG}/vibesdk`,
    description: {
      vi: 'Nền tảng vibe coding open source trên full Cloudflare stack (Workers AI, R2, D1…).',
      en: 'Open-source vibe coding platform on the full Cloudflare stack (Workers AI, R2, D1…).',
    },
    exampleUse: {
      vi: 'Deploy bản demo → so sánh kiến trúc với use case “build serverless app” trong hub.',
      en: 'Deploy the demo → compare architecture with the hub’s “build serverless app” use case.',
    },
    stars: 5050,
    language: 'TypeScript',
    license: 'MIT',
    category: 'examples',
    relatedTrack: 'developer-platform',
    topics: ['AI', 'Pages'],
  },
  {
    name: 'vinext',
    href: `${CLOUDFLARE_GITHUB_ORG}/vinext`,
    description: {
      vi: 'Vite plugin tái hiện API Next.js — deploy full-stack app lên Workers.',
      en: 'Vite plugin reimplementing the Next.js API — deploy full-stack apps on Workers.',
    },
    exampleUse: {
      vi: 'Migrate side project Next.js nhỏ sang vinext → đo bundle và cold start so với Pages.',
      en: 'Migrate a small Next.js side project to vinext → compare bundle size and cold starts vs Pages.',
    },
    stars: 8120,
    language: 'TypeScript',
    license: 'MIT',
    category: 'workers',
    relatedTrack: 'developer-platform',
  },
  {
    name: 'agentic-inbox',
    href: `${CLOUDFLARE_GITHUB_ORG}/agentic-inbox`,
    description: {
      vi: 'Email client + AI agent self-hosted hoàn toàn trên Workers.',
      en: 'Self-hosted email client with an AI agent entirely on Workers.',
    },
    exampleUse: {
      vi: 'Study bindings: IMAP Worker, R2 attachments, D1 threads, Workers AI classify — map vào lộ trình storage.',
      en: 'Study bindings: IMAP Worker, R2 attachments, D1 threads, Workers AI classify — map to the storage track.',
    },
    stars: 3827,
    language: 'TypeScript',
    license: 'Apache-2.0',
    category: 'examples',
    relatedTrack: 'developer-platform',
  },
  {
    name: 'mcp',
    href: `${CLOUDFLARE_GITHUB_ORG}/mcp`,
    description: {
      vi: 'MCP server cho Cloudflare API — tích hợp tooling với AI assistant.',
      en: 'MCP server for the Cloudflare API — integrate tooling with AI assistants.',
    },
    exampleUse: {
      vi: 'Chạy MCP local → thử lệnh quản lý zone/DNS từ IDE — hiểu automation Application Services.',
      en: 'Run MCP locally → try zone/DNS commands from your IDE — learn Application Services automation.',
    },
    stars: 490,
    language: 'TypeScript',
    license: 'Apache-2.0',
    category: 'ai',
    relatedTrack: 'cross-cutting',
  },
  {
    name: 'lol-html',
    href: `${CLOUDFLARE_GITHUB_ORG}/lol-html`,
    description: {
      vi: 'Streaming HTML parser/rewriter với CSS selector — dùng trong Workers.',
      en: 'Streaming HTML parser/rewriter with CSS selectors — used in Workers.',
    },
    exampleUse: {
      vi: 'Thử rewrite HTML tại edge (nonce CSP, inject analytics) — liên kết bài CloudSecOp lol-html.',
      en: 'Try edge HTML rewrite (CSP nonce, analytics inject) — pairs with the CloudSecOp lol-html post.',
    },
    stars: 2006,
    language: 'Rust',
    license: 'BSD-3-Clause',
    category: 'infrastructure',
    relatedTrack: 'application-services',
  },
  {
    name: 'circl',
    href: `${CLOUDFLARE_GITHUB_ORG}/circl`,
    description: {
      vi: 'Thư viện crypto tái sử dụng — post-quantum và curve hiện đại.',
      en: 'Interoperable cryptographic library — post-quantum and modern curves.',
    },
    exampleUse: {
      vi: 'Đọc overview để hiểu TLS/crypto layer — bổ sung khái niệm SSL/TLS trong lộ trình Application Services.',
      en: 'Read the overview for TLS/crypto context — complements SSL/TLS in the Application Services track.',
    },
    stars: 1671,
    language: 'Go',
    category: 'infrastructure',
    relatedTrack: 'application-services',
  },
  {
    name: 'speedtest',
    href: `${CLOUDFLARE_GITHUB_ORG}/speedtest`,
    description: {
      vi: 'Component đo tốc độ mạng tới edge Cloudflare.',
      en: 'Component to measure network speed against Cloudflare’s edge.',
    },
    exampleUse: {
      vi: 'Nhúng widget speedtest vào trang demo → giải thích CDN/edge proximity cho stakeholder.',
      en: 'Embed the speedtest widget on a demo page → explain CDN/edge proximity to stakeholders.',
    },
    stars: 697,
    language: 'JavaScript',
    license: 'MIT',
    category: 'examples',
    relatedTrack: 'application-services',
  },
  {
    name: 'moltworker',
    href: `${CLOUDFLARE_GITHUB_ORG}/moltworker`,
    description: {
      vi: 'Chạy OpenClaw agent trên Cloudflare Workers.',
      en: 'Run OpenClaw agents on Cloudflare Workers.',
    },
    exampleUse: {
      vi: 'So sánh pattern với repo `agents` — chọn template phù hợp chat vs automation.',
      en: 'Compare patterns with the `agents` repo — pick the right template for chat vs automation.',
    },
    stars: 9913,
    language: 'TypeScript',
    license: 'Apache-2.0',
    category: 'ai',
    relatedTrack: 'developer-platform',
  },
  {
    name: 'pint',
    href: `${CLOUDFLARE_GITHUB_ORG}/pint`,
    description: {
      vi: 'Prometheus rule linter/validator.',
      en: 'Prometheus rule linter and validator.',
    },
    exampleUse: {
      vi: 'Dùng khi thiết lập alert cho Workers/logs — liên kết observability trong lộ trình dev.',
      en: 'Use when setting alerts for Workers/logs — ties to observability in the dev track.',
    },
    stars: 1023,
    language: 'Go',
    license: 'Apache-2.0',
    category: 'infrastructure',
    relatedTrack: 'cross-cutting',
  },
];

export type GitHubLearningPath = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  repoNames: string[];
  relatedTrack: GitHubRepo['relatedTrack'];
};

/** Mini learning paths — “bài ví dụ” gợi ý theo repo */
export const githubLearningPaths: GitHubLearningPath[] = [
  {
    id: 'first-worker',
    title: { vi: 'Ví dụ 1: Worker đầu tiên với Wrangler', en: 'Example 1: First Worker with Wrangler' },
    description: {
      vi: 'Bắt đầu từ workers-sdk và cloudflare-docs — tạo project, dev local, deploy.',
      en: 'Start with workers-sdk and cloudflare-docs — create a project, dev locally, deploy.',
    },
    repoNames: ['workers-sdk', 'cloudflare-docs', 'workerd'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'zero-trust-tunnel',
    title: { vi: 'Ví dụ 2: Tunnel + Access', en: 'Example 2: Tunnel + Access' },
    description: {
      vi: 'Dùng cloudflared kết hợp lộ trình Cloudflare One — publish app nội bộ không VPN.',
      en: 'Use cloudflared with the Cloudflare One track — publish internal apps without VPN.',
    },
    repoNames: ['cloudflared', 'cloudflare-docs'],
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'ai-agents',
    title: { vi: 'Ví dụ 3: AI Agents trên edge', en: 'Example 3: AI Agents on the edge' },
    description: {
      vi: 'Fork agents hoặc vibesdk — thêm tool, binding D1/R2, deploy production nhỏ.',
      en: 'Fork agents or vibesdk — add a tool, D1/R2 bindings, deploy a small production app.',
    },
    repoNames: ['agents', 'vibesdk', 'agentic-inbox', 'mcp'],
    relatedTrack: 'developer-platform',
  },
  {
    id: 'edge-html',
    title: { vi: 'Ví dụ 4: Transform HTML tại edge', en: 'Example 4: Transform HTML at the edge' },
    description: {
      vi: 'lol-html + Workers — CSP nonce, rewrite URL — bảo mật Application Services.',
      en: 'lol-html + Workers — CSP nonce, URL rewrite — Application Services security.',
    },
    repoNames: ['lol-html', 'workers-sdk', 'circl'],
    relatedTrack: 'application-services',
  },
];

export function getGitHubRepo(name: string): GitHubRepo | undefined {
  return githubRepos.find((r) => r.name === name);
}

export function getGitHubReposForTrack(
  track: 'application-services' | 'developer-platform' | 'cloudflare-one',
  limit = 6,
): GitHubRepo[] {
  const primary = githubRepos.filter((r) => r.relatedTrack === track);
  const pinned = primary.filter((r) => r.pinned);
  const rest = primary.filter((r) => !r.pinned);
  return [...pinned, ...rest].slice(0, limit);
}

export function getGitHubReposByCategory(category: GitHubRepoCategory): GitHubRepo[] {
  return githubRepos.filter((r) => r.category === category);
}
