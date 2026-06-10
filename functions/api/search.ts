import { aiSearchSystemPrompt, isAiSearchConfigured, queryAiSearch, type AiSearchEnv } from '../../src/lib/server/aiSearch';
import { jsonResponse, readJson } from '../../src/lib/server/json';
import { checkRateLimit, rateLimitedResponse, recordRateLimitHit } from '../../src/lib/server/rateLimit';
import { searchQuerySchema } from '../../src/lib/validation/schemas';

type Env = AiSearchEnv & {
  SITE_CONFIG?: KVNamespace;
  RATE_LIMIT_SALT?: string;
};

function clientIp(request: Request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || '';
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return jsonResponse(
    {
      ok: true,
      aiSearchEnabled: isAiSearchConfigured(env),
      instantSearchEnabled: true,
      indexPath: '/search-index.json',
    },
    { headers: { 'cache-control': 'public, max-age=60' } },
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson(request);
  const parsed = searchQuerySchema.safeParse(body);
  if (!parsed.success) {
    const lang = body && typeof body === 'object' && (body as { lang?: string }).lang === 'en' ? 'en' : 'vi';
    return jsonResponse(
      {
        ok: false,
        error: 'validation_error',
        message: lang === 'en' ? 'Invalid search query.' : 'Truy vấn tìm kiếm không hợp lệ.',
      },
      { status: 400 },
    );
  }

  const { q, lang, mode } = parsed.data;

  if (mode === 'instant') {
    return jsonResponse({
      ok: true,
      mode: 'instant',
      message: 'Use /search-index.json for instant search on the client.',
    });
  }

  if (!isAiSearchConfigured(env)) {
    return jsonResponse(
      {
        ok: false,
        error: 'ai_search_unavailable',
        message:
          lang === 'en'
            ? 'AI Search is not configured. Use instant search or see docs/AI-SEARCH-SETUP.md.'
            : 'AI Search chưa được cấu hình. Dùng tìm kiếm nhanh hoặc xem docs/AI-SEARCH-SETUP.md.',
      },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const bucket = Math.floor(Date.now() / 60_000);
  const rlKey = `rl:search:${ip || 'noip'}:${bucket}`;
  const rl = await checkRateLimit({ kv: env.SITE_CONFIG, key: rlKey, max: 30 });
  if (!rl.allowed) return rateLimitedResponse(lang);

  try {
    const ai = await queryAiSearch(env, q, lang);
    await recordRateLimitHit({ kv: env.SITE_CONFIG, key: rlKey, windowSeconds: 120 });

    if (!ai) {
      return jsonResponse(
        {
          ok: false,
          error: 'ai_search_failed',
          message: lang === 'en' ? 'AI Search returned no results.' : 'AI Search không trả về kết quả.',
        },
        { status: 503 },
      );
    }

    return jsonResponse(
      {
        ok: true,
        mode: 'ai',
        query: ai.query,
        results: ai.results,
        systemPrompt: aiSearchSystemPrompt(lang),
      },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  } catch (e) {
    console.error('search ai error', e);
    return jsonResponse(
      {
        ok: false,
        error: 'ai_search_error',
        message: lang === 'en' ? 'AI Search failed. Try again later.' : 'AI Search lỗi. Thử lại sau.',
      },
      { status: 500 },
    );
  }
};
