import { jsonResponse, readJson } from '../../src/lib/server/json';
import { hashIp, hashUserAgent, randomId } from '../../src/lib/server/crypto';
import { rateLimitOrThrow, rateLimitedResponse } from '../../src/lib/server/rateLimit';
import { quizSubmissionSchema } from '../../src/lib/validation/schemas';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  RATE_LIMIT_SALT?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: unknown;
  try {
    payload = await readJson(request, 30_000);
  } catch {
    return jsonResponse({ ok: false, error: 'validation_error' }, { status: 400 });
  }

  const parsed = quizSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: 'validation_error' }, { status: 400 });
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const ua = request.headers.get('User-Agent');
  const salt = env.RATE_LIMIT_SALT || 'cfhub_v1';
  const ipHash = await hashIp(ip, salt);
  const uaHash = await hashUserAgent(ua, salt);

  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  const rlKey = `rl:quiz:${ipHash || 'noip'}:${bucket}`;
  const rl = await rateLimitOrThrow({
    kv: env.SITE_CONFIG,
    key: rlKey,
    windowSeconds: 5 * 60,
    max: 20,
  });
  if (!rl.allowed) return rateLimitedResponse(parsed.data.language);

  const id = randomId('quiz');
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO quiz_submissions (
        id, quiz_id, score, total_questions, selected_path, language, created_at, ip_hash, user_agent_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        parsed.data.quizId,
        parsed.data.score,
        parsed.data.totalQuestions,
        parsed.data.selectedPath || null,
        parsed.data.language,
        createdAt,
        ipHash,
        uaHash,
      )
      .run();
  } catch (e) {
    console.error('quiz-submission db error', e);
    return jsonResponse({ ok: false, error: 'server_error' }, { status: 500 });
  }

  return jsonResponse({ ok: true }, { status: 200 });
};

