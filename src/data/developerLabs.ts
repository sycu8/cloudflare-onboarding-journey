import type { LocalizedString } from '../i18n/types';

/** Official guided labs — https://labs.cloudflare.dev/ */
export const DEVELOPER_LABS_URL = 'https://labs.cloudflare.dev/';
export const DEVELOPER_LABS_DISCORD_URL = 'https://discord.gg/cloudflaredev';

export type DeveloperLabId = 'workers' | 'mcp' | 'agents' | 'sandbox-sdk';

export type DeveloperLabStep = {
  id: string;
  durationMin?: number;
  title: LocalizedString;
  summary: LocalizedString;
};

export const DEVELOPER_LABS_HUB_PATH = '/tracks/developer-platform/labs/';

export function developerLabHubPath(labId: DeveloperLabId, stepId?: string): string {
  return stepId ? `${DEVELOPER_LABS_HUB_PATH}${labId}/${stepId}/` : `${DEVELOPER_LABS_HUB_PATH}${labId}/`;
}

export type DeveloperLabTrack = {
  id: DeveloperLabId;
  number: string;
  path: `/${DeveloperLabId}`;
  /** Hub article index for this lab track */
  href: string;
  /** Original labs.cloudflare.dev URL */
  sourceHref: string;
  title: LocalizedString;
  outcome: LocalizedString;
  description: LocalizedString;
  tags: string[];
  labCount: number;
  /** Hub modules this lab complements (e.g. dp-1, dp-3) */
  hubModuleIds: string[];
  whenInHub: LocalizedString;
  labs: DeveloperLabStep[];
};

export const developerLabsIntro: LocalizedString = {
  vi: '23 bài lab guided từ labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — đọc từng bước ngay trên hub. Bổ sung lộ trình, không thay docs hay bài học trong track.',
  en: '23 guided labs from labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — follow each step on this hub. Complements this track; it does not replace docs or the in-track lessons.',
  km: '23 guided labs from labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — follow each step on this hub. Complements this track; it does not replace docs or the in-track lessons.',
};

/** Curated from https://labs.cloudflare.dev/ (Workers, MCP, Agents, Sandbox SDK). */
export const developerLabTracks: DeveloperLabTrack[] = [
  {
    id: 'workers',
    number: '01',
    path: '/workers',
    href: developerLabHubPath('workers'),
    sourceHref: `${DEVELOPER_LABS_URL}workers`,
    title: { vi: 'Cloudflare Workers', en: 'Cloudflare Workers', km: 'Cloudflare Workers' },
    outcome: {
      vi: 'Ship Bookmark API',
      en: 'Ship a Bookmark API',
      km: 'Ship a Bookmark API',
    },
    description: {
      vi: 'Routing, KV, D1 và Workers AI — xây Bookmark API từ zero rồi deploy.',
      en: 'Routing, KV, D1, and Workers AI — build a Bookmark API from scratch, then deploy.',
      km: 'Routing, KV, D1, and Workers AI — build a Bookmark API from scratch, then deploy.',
    },
    tags: ['HTTP APIs', 'KV', 'D1', 'Workers AI'],
    labCount: 7,
    hubModuleIds: ['dp-1', 'dp-3', 'dp-5'],
    whenInHub: {
      vi: 'Sau Phần 1 (Worker + Wrangler) và Phần 3 (KV/D1). Lab AI + Gateway khớp Phần 5.',
      en: 'After Part 1 (Worker + Wrangler) and Part 3 (KV/D1). The AI + Gateway labs match Part 5.',
      km: 'After Part 1 (Worker + Wrangler) and Part 3 (KV/D1). The AI + Gateway labs match Part 5.',
    },
    labs: [
      {
        id: '01-getting-started',
        durationMin: 10,
        title: { vi: 'Bắt đầu: auth, C3, đọc code, test', en: 'Getting started: auth, C3, read the code, test' },
        summary: {
          vi: 'Đăng nhập Cloudflare, tạo project Bookmark API, hiểu file, chạy local.',
          en: 'Sign in to Cloudflare, create the Bookmark API project, read the files, run locally.',
        },
      },
      {
        id: '02-add-routes-and-crud-endpoints',
        durationMin: 20,
        title: { vi: 'Routes và CRUD', en: 'Routes and CRUD' },
        summary: {
          vi: 'Type Bookmark, router, handler create/list/get/delete — test luôn error case.',
          en: 'Bookmark type, router, create/list/get/delete handlers — including error cases.',
        },
      },
      {
        id: '03-persistent-storage-with-kv',
        durationMin: 15,
        title: { vi: 'KV lưu bền', en: 'Persistent KV storage' },
        summary: {
          vi: 'Tạo namespace KV, đổi handler sang binding, kiểm tra data còn sau restart.',
          en: 'Create a KV namespace, switch handlers to the binding, confirm data survives restart.',
        },
      },
      {
        id: '04-d1-database-with-kv-caching',
        durationMin: 20,
        title: { vi: 'D1 + cache KV', en: 'D1 + KV cache' },
        summary: {
          vi: 'Schema SQL, tag, filter; KV làm cache đọc — đo cache hit.',
          en: 'SQL schema, tags, filters; KV as a read cache — check cache hits.',
        },
      },
      {
        id: '05-ai-powered-summaries',
        durationMin: 20,
        title: { vi: 'Tóm tắt bằng Workers AI', en: 'AI-powered summaries' },
        summary: {
          vi: 'AI binding, cột summary trên D1, generate khi tạo bookmark.',
          en: 'AI binding, a D1 summary column, generate on bookmark create.',
        },
      },
      {
        id: '06-ai-gateway',
        durationMin: 10,
        title: { vi: 'AI Gateway', en: 'AI Gateway' },
        summary: {
          vi: 'Đưa inference qua Gateway — cache, rate limit, xem analytics dashboard.',
          en: 'Route inference through Gateway — cache, rate limit, read dashboard analytics.',
        },
      },
      {
        id: '07-deploy-to-production',
        durationMin: 5,
        title: { vi: 'Deploy production', en: 'Deploy to production' },
        summary: {
          vi: 'Tạo resource remote, wrangler deploy, wrangler tail, rollback khi cần.',
          en: 'Create remote resources, wrangler deploy, wrangler tail, roll back if needed.',
        },
      },
    ],
  },
  {
    id: 'mcp',
    number: '02',
    path: '/mcp',
    href: developerLabHubPath('mcp'),
    sourceHref: `${DEVELOPER_LABS_URL}mcp`,
    title: { vi: 'Model Context Protocol', en: 'Model Context Protocol', km: 'Model Context Protocol' },
    outcome: {
      vi: 'Ship MCP server + AI assistant',
      en: 'Ship an MCP server + AI assistant',
      km: 'Ship an MCP server + AI assistant',
    },
    description: {
      vi: 'Remote MCP trên Workers: tool có type, Zod, API ngoài và KV.',
      en: 'Remote MCP on Workers: typed tools, Zod, external APIs, and KV.',
      km: 'Remote MCP on Workers: typed tools, Zod, external APIs, and KV.',
    },
    tags: ['Custom Tools', 'Zod', 'External APIs', 'KV'],
    labCount: 7,
    hubModuleIds: ['dp-3', 'dp-5'],
    whenInHub: {
      vi: 'Sau Phần 5 (tools/agent) và khi đã quen KV ở Phần 3. Luyện schema + authorization phía server.',
      en: 'After Part 5 (tools/agents) and once KV from Part 3 is familiar. Practice schemas and server-side authorization.',
      km: 'After Part 5 (tools/agents) and once KV from Part 3 is familiar. Practice schemas and server-side authorization.',
    },
    labs: [
      {
        id: '01-getting-started-with-mcp-server',
        durationMin: 20,
        title: { vi: 'Tạo MCP server và Inspector', en: 'Create the MCP server and Inspector' },
        summary: {
          vi: 'Scaffold server trên Workers, test kết nối bằng MCP Inspector.',
          en: 'Scaffold the server on Workers, test the connection with MCP Inspector.',
        },
      },
      {
        id: '02-adding-custom-tools',
        durationMin: 25,
        title: { vi: 'Tool tùy chỉnh', en: 'Custom tools' },
        summary: {
          vi: 'Thêm tool (random number) có schema — gọi và xem response typed.',
          en: 'Add a typed tool (random number) — call it and inspect the typed response.',
        },
      },
      {
        id: '03-external-api-integration',
        durationMin: 30,
        title: { vi: 'Tích hợp API ngoài', en: 'External API integration' },
        summary: {
          vi: 'Gọi drand (hoặc API tương đương) từ tool — validate input bằng Zod.',
          en: 'Call drand (or an equivalent API) from a tool — validate input with Zod.',
        },
      },
      {
        id: '04-deploy-to-cloudflare-workers',
        durationMin: 25,
        title: { vi: 'Deploy lên Workers', en: 'Deploy to Workers' },
        summary: {
          vi: 'wrangler deploy, thử trên AI Playground.',
          en: 'wrangler deploy, then try it in the AI Playground.',
        },
      },
      {
        id: '05-cloudflare-kv-storage',
        durationMin: 30,
        title: { vi: 'KV cho tool', en: 'KV for tools' },
        summary: {
          vi: 'Namespace KV + tool đọc/ghi — state không mất giữa session.',
          en: 'KV namespace + read/write tools — state survives across sessions.',
        },
      },
      {
        id: '06-building-a-persistent-todo-app',
        durationMin: 45,
        title: { vi: 'Todo bền trên KV', en: 'Persistent todo app' },
        summary: {
          vi: 'Bộ tool todo (add/list/done) — deploy và kiểm tra persistence.',
          en: 'Todo tools (add/list/done) — deploy and confirm persistence.',
        },
      },
      {
        id: '07-youre-an-mcp-builder-now',
        durationMin: 15,
        title: { vi: 'Bạn đã là MCP builder', en: "You're an MCP Builder Now" },
        summary: {
          vi: 'Nhìn lại pattern MCP, gợi ý tool tiếp theo, dùng AI để ship server mới.',
          en: 'Review the MCP pattern, pick a next tool, use AI to ship another server.',
        },
      },
    ],
  },
  {
    id: 'agents',
    number: '03',
    path: '/agents',
    href: developerLabHubPath('agents'),
    sourceHref: `${DEVELOPER_LABS_URL}agents`,
    title: { vi: 'Agents SDK', en: 'Agents SDK', km: 'Agents SDK' },
    outcome: {
      vi: 'Ship agent có state',
      en: 'Ship a stateful agent',
      km: 'Ship a stateful agent',
    },
    description: {
      vi: 'Agent stateful: memory, schedule task, WebSocket realtime.',
      en: 'A stateful agent: memory, scheduled tasks, and realtime WebSockets.',
      km: 'A stateful agent: memory, scheduled tasks, and realtime WebSockets.',
    },
    tags: ['Agents SDK', 'State', 'Scheduling', 'WebSockets'],
    labCount: 2,
    hubModuleIds: ['dp-5', 'dp-6'],
    whenInHub: {
      vi: 'Sau bài Agents ở Phần 5. Phần 6 (Durable Objects) giải thích state theo object phía sau SDK.',
      en: 'After the Agents lesson in Part 5. Part 6 (Durable Objects) explains the per-object state behind the SDK.',
      km: 'After the Agents lesson in Part 5. Part 6 (Durable Objects) explains the per-object state behind the SDK.',
    },
    labs: [
      {
        id: '01-getting-started-with-the-agent-starter',
        durationMin: 20,
        title: { vi: 'Agent starter: tools và schedule', en: 'Agent starter: tools and scheduling' },
        summary: {
          vi: 'Tạo agent, xem tool có sẵn, đọc cách schedule task.',
          en: 'Create an agent, inspect the bundled tools, read how tasks are scheduled.',
        },
      },
      {
        id: '02-exploring-the-agents-repo',
        durationMin: 20,
        title: { vi: 'Clone repo Agents và build', en: 'Clone the Agents repo and build' },
        summary: {
          vi: 'Clone source, npm install, build — sẵn sàng sửa tool / memory.',
          en: 'Clone the source, npm install, build — ready to change tools or memory.',
        },
      },
    ],
  },
  {
    id: 'sandbox-sdk',
    number: '04',
    path: '/sandbox-sdk',
    href: developerLabHubPath('sandbox-sdk'),
    sourceHref: `${DEVELOPER_LABS_URL}sandbox-sdk`,
    title: { vi: 'Sandbox SDK', en: 'Sandbox SDK', km: 'Sandbox SDK' },
    outcome: {
      vi: 'Ship AI code executor an toàn',
      en: 'Ship a secure AI code executor',
      km: 'Ship a secure AI code executor',
    },
    description: {
      vi: 'Chạy code trong container cô lập, preview live, gắn Workers AI — từ zero.',
      en: 'Run code in isolated containers, live preview, Workers AI — from scratch.',
      km: 'Run code in isolated containers, live preview, Workers AI — from scratch.',
    },
    tags: ['Secure Execution', 'AI Code Generation', 'Containers', 'Workers AI'],
    labCount: 7,
    hubModuleIds: ['dp-4', 'dp-5'],
    whenInHub: {
      vi: 'Sau Phần 5 (AI) và Phần 4 (vận hành/secret). Lab bảo mật khớp golden rules: secret không lên client.',
      en: 'After Part 5 (AI) and Part 4 (operate/secrets). The security labs match the golden rules: secrets stay off the client.',
      km: 'After Part 5 (AI) and Part 4 (operate/secrets). The security labs match the golden rules: secrets stay off the client.',
    },
    labs: [
      {
        id: '01-getting-started-with-sandbox-sdk',
        durationMin: 20,
        title: { vi: 'Project sandbox đầu tiên', en: 'First sandbox project' },
        summary: {
          vi: 'Scaffold, đọc cấu trúc, chạy local, exec lệnh đầu tiên.',
          en: 'Scaffold, read the layout, run locally, exec the first command.',
        },
      },
      {
        id: '02-core-commands-files',
        durationMin: 20,
        title: { vi: 'exec() và file', en: 'exec() and files' },
        summary: {
          vi: 'API exec(), thao tác file, endpoint tùy chỉnh, xử lý lỗi.',
          en: 'The exec() API, file ops, a custom endpoint, and error handling.',
        },
      },
      {
        id: '03-building-a-code-executor',
        durationMin: 25,
        title: { vi: 'Code executor', en: 'Code executor' },
        summary: {
          vi: 'Context chạy code, runCode(), nhận input động, bắt exception.',
          en: 'A code context, runCode(), dynamic input, catch execution errors.',
        },
      },
      {
        id: '04-ai-powered-code-generation',
        durationMin: 30,
        title: { vi: 'Sinh code bằng Workers AI', en: 'AI-powered code generation' },
        summary: {
          vi: 'AI binding + endpoint /vibe — pipeline generate → execute.',
          en: 'AI binding + /vibe endpoint — generate → execute pipeline.',
        },
      },
      {
        id: '05-live-app-preview',
        durationMin: 30,
        title: { vi: 'Live preview', en: 'Live app preview' },
        summary: {
          vi: 'Cài deps, start server trong sandbox, expose port, stream log.',
          en: 'Install deps, start a server in the sandbox, expose a port, stream logs.',
        },
      },
      {
        id: '06-security-best-practices',
        durationMin: 25,
        title: { vi: 'Bảo mật sandbox', en: 'Sandbox security' },
        summary: {
          vi: 'Validate input, isolate theo user, env/secret, auth — sandbox không phải ACL.',
          en: 'Validate input, per-user isolation, env/secrets, auth — a sandbox is not an ACL.',
        },
      },
      {
        id: '07-deploy-to-production',
        durationMin: 15,
        title: { vi: 'Deploy và lifecycle', en: 'Deploy and lifecycle' },
        summary: {
          vi: 'Deploy, cleanup sandbox, config production, monitor.',
          en: 'Deploy, clean up sandboxes, production config, monitor.',
        },
      },
    ],
  },
];

export function developerLabHref(track: DeveloperLabTrack): string {
  return track.href;
}

export function developerLabSourceHref(track: DeveloperLabTrack): string {
  return track.sourceHref;
}

export function getDeveloperLabTracks(): DeveloperLabTrack[] {
  return developerLabTracks;
}

export function getLabsForHubModule(moduleId: string): DeveloperLabTrack[] {
  return developerLabTracks.filter((lab) => lab.hubModuleIds.includes(moduleId));
}

export function getDeveloperLabsForTrackSlug(
  slug: string,
): DeveloperLabTrack[] {
  return slug === 'developer-platform' ? developerLabTracks : [];
}

export const developerLabsHubModuleLabels: Record<string, LocalizedString> = {
  'dp-0': { vi: 'Phần 0', en: 'Part 0' },
  'dp-1': { vi: 'Phần 1', en: 'Part 1' },
  'dp-2': { vi: 'Phần 2', en: 'Part 2' },
  'dp-3': { vi: 'Phần 3', en: 'Part 3' },
  'dp-4': { vi: 'Phần 4', en: 'Part 4' },
  'dp-5': { vi: 'Phần 5', en: 'Part 5' },
  'dp-6': { vi: 'Phần 6', en: 'Part 6' },
  'dp-7': { vi: 'Phần 7', en: 'Part 7' },
};
