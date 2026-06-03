import { useEffect } from 'react';

type ToolResult = { content: Array<{ type: string; text: string }> };

type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ToolResult | unknown>;
};

type ModelContext = {
  registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => void | (() => void);
  provideContext?: (options: { tools: ModelContextTool[] }) => void | (() => void);
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

function toolResult(data: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data) }],
  };
}

const TRACKS = [
  { id: 'application-services', label: 'Application Services' },
  { id: 'developer-platform', label: 'Developer Platform' },
  { id: 'cloudflare-one', label: 'Cloudflare One' },
];

function buildTools(): ModelContextTool[] {
  const origin = location.origin;
  return [
    {
      name: 'list_learning_tracks',
      description: 'List Cloudflare Starter Hub learning tracks with URLs.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async () =>
        toolResult({
          tracks: TRACKS.map((t) => ({ ...t, url: `${origin}/tracks/${t.id}/` })),
        }),
    },
    {
      name: 'get_site_config',
      description: 'Fetch hub feature flags from GET /api/site-config.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async () => {
        const res = await fetch('/api/site-config');
        if (!res.ok) throw new Error(`site-config HTTP ${res.status}`);
        return toolResult(await res.json());
      },
    },
    {
      name: 'search_use_cases',
      description: 'Return use-case hub paths (protect website, API, AI, Zero Trust, etc.).',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string', description: 'Optional keyword filter' } },
        additionalProperties: false,
      },
      execute: async (input) => {
        const slugs = [
          'protect-website',
          'secure-api',
          'defend-ddos-attacks',
          'accelerate-content-delivery',
          'build-ai-applications',
          'replace-vpn',
        ];
        const q = String(input.query || '')
          .toLowerCase()
          .trim();
        const filtered = q ? slugs.filter((s) => s.includes(q)) : slugs;
        return toolResult({
          useCases: filtered.map((slug) => ({ slug, url: `${origin}/use-cases/${slug}/` })),
          index: `${origin}/use-cases/`,
        });
      },
    },
  ];
}

/** Fallback registration after hydration if head script ran before modelContext existed. */
export default function WebMcpTools() {
  useEffect(() => {
    const mc = navigator.modelContext;
    if (!mc) return;

    const tools = buildTools();
    if (typeof mc.provideContext === 'function') {
      mc.provideContext({ tools });
      return;
    }

    if (typeof mc.registerTool === 'function') {
      const controller = new AbortController();
      for (const tool of tools) {
        mc.registerTool(tool, { signal: controller.signal });
      }
      return () => controller.abort();
    }
  }, []);

  return null;
}
