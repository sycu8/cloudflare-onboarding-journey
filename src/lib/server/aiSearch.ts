import type { AiSearchHit } from '../../types/search';

type AiSearchChunk = {
  id?: string;
  score?: number;
  text?: string;
  item?: {
    key?: string;
    metadata?: Record<string, unknown>;
  };
};

type AiSearchResponse = {
  search_query?: string;
  chunks?: AiSearchChunk[];
};

type AiSearchInstance = {
  search: (opts: {
    query?: string;
    messages?: Array<{ role: string; content: string }>;
    ai_search_options?: {
      retrieval?: {
        max_num_results?: number;
        retrieval_type?: 'vector' | 'keyword' | 'hybrid';
        match_threshold?: number;
      };
    };
  }) => Promise<AiSearchResponse>;
};

type AiSearchNamespace = {
  get: (id: string) => AiSearchInstance;
};

export type AiSearchEnv = {
  HUB_SEARCH?: AiSearchInstance;
  AI_SEARCH?: AiSearchNamespace;
  AI_SEARCH_INSTANCE?: string;
  PUBLIC_SITE_URL?: string;
};

export function isAiSearchConfigured(env: AiSearchEnv) {
  return Boolean(env.HUB_SEARCH || (env.AI_SEARCH && env.AI_SEARCH_INSTANCE));
}

function hrefFromChunkKey(key: string | undefined, origin: string) {
  if (!key) return '/';
  try {
    if (key.startsWith('http://') || key.startsWith('https://')) {
      const url = new URL(key);
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    }
  } catch {
    /* ignore */
  }
  if (key.startsWith('/')) return key.endsWith('/') ? key : `${key}/`;
  return '/';
}

function titleFromChunk(chunk: AiSearchChunk, href: string) {
  const metaTitle = chunk.item?.metadata?.title;
  if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle.trim();
  const key = chunk.item?.key;
  if (key) {
    try {
      const path = key.startsWith('http') ? new URL(key).pathname : key;
      const last = path.split('/').filter(Boolean).pop();
      if (last) return last.replace(/[-_]/g, ' ');
    } catch {
      /* ignore */
    }
  }
  return href;
}

function snippetFromText(text: string | undefined, max = 220) {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

export async function queryAiSearch(
  env: AiSearchEnv,
  query: string,
  lang: 'vi' | 'en',
): Promise<{ query: string; results: AiSearchHit[] } | null> {
  if (!isAiSearchConfigured(env)) return null;

  const instance =
    env.HUB_SEARCH ??
    (env.AI_SEARCH && env.AI_SEARCH_INSTANCE ? env.AI_SEARCH.get(env.AI_SEARCH_INSTANCE) : null);
  if (!instance) return null;

  const origin = (env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');

  const response = await instance.search({
    query,
    ai_search_options: {
      retrieval: {
        retrieval_type: 'hybrid',
        max_num_results: 8,
        match_threshold: 0.35,
      },
    },
  });

  const chunks = response.chunks ?? [];
  const results: AiSearchHit[] = chunks.map((chunk, index) => {
    const href = hrefFromChunkKey(chunk.item?.key, origin);
    return {
      id: chunk.id ?? `ai-${index}`,
      href,
      title: titleFromChunk(chunk, href),
      snippet: snippetFromText(chunk.text),
      score: chunk.score ?? 0,
      source: chunk.item?.key,
    };
  });

  return {
    query: response.search_query ?? query,
    results: results.filter((r) => r.snippet || r.title),
  };
}

export function aiSearchSystemPrompt(lang: 'vi' | 'en') {
  return lang === 'en'
    ? 'You are a helpful assistant for the Cloudflare Starter Hub learning site. Answer using only the retrieved context. Prefer linking to hub pages when relevant. Be concise and beginner-friendly.'
    : 'Bạn là trợ lý cho Cloudflare Starter Hub. Trả lời dựa trên ngữ cảnh được truy xuất. Ưu tiên hướng dẫn người mới và ngắn gọn.';
}
