import { buildGenerateMessages, type GenerateLang } from './generateGrounding.ts';

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
/** Explicit output cap for a short lesson (5 bullets + one next step). */
const MAX_TOKENS = 512;

type Lang = GenerateLang;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function aiFailureMessage(lang: Lang) {
  return lang === 'en'
    ? 'Workers AI did not return a response. Please try again.'
    : 'Workers AI không trả về phản hồi. Vui lòng thử lại.';
}

/**
 * Concrete Cloudflare nameserver hostnames. A zone is assigned its own
 * `<name>.ns.cloudflare.com` pair; `ns1.cloudflare.com` is not that pair.
 * `developers.cloudflare.com` and `dash.cloudflare.com` do not match.
 */
const INVENTED_NAMESERVER =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.ns\.cloudflare\.com|ns\d*\.cloudflare\.com)\b/gi;

export function nameserverOverviewInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'copy the two nameservers shown on the zone Overview page'
    : 'copy hai nameserver đang hiện trên trang Overview của zone';
}

/** Replace invented nameserver hostnames with the Overview-page instruction. */
export function rewriteInventedNameservers(text: string, lang: Lang): string {
  return text.replace(INVENTED_NAMESERVER, nameserverOverviewInstruction(lang));
}

function rewriteChoice(choice: unknown, lang: Lang): unknown {
  if (!choice || typeof choice !== 'object') return choice;
  const next = { ...(choice as Record<string, unknown>) };
  if (typeof next.text === 'string') next.text = rewriteInventedNameservers(next.text, lang);
  if (next.message && typeof next.message === 'object') {
    const message = { ...(next.message as Record<string, unknown>) };
    if (typeof message.content === 'string') {
      message.content = rewriteInventedNameservers(message.content, lang);
    }
    next.message = message;
  }
  return next;
}

/** Apply the nameserver guard to the string shapes the generator UI renders. */
export function guardGenerateResult(result: unknown, lang: Lang): unknown {
  if (typeof result === 'string') return rewriteInventedNameservers(result, lang);
  if (!result || typeof result !== 'object') return result;
  const next = { ...(result as Record<string, unknown>) };
  if (typeof next.response === 'string') next.response = rewriteInventedNameservers(next.response, lang);
  if (Array.isArray(next.choices)) next.choices = next.choices.map((choice) => rewriteChoice(choice, lang));
  return next;
}

/** True when Workers AI returns nothing usable or an error payload (including code 5028). */
export function aiResponseFailed(result: unknown): boolean {
  if (result == null) return true;
  if (typeof result === 'string') return result.trim().length === 0;
  if (typeof result !== 'object') return false;

  const value = result as {
    error?: unknown;
    errors?: unknown;
    success?: unknown;
    response?: unknown;
  };

  if (value.success === false) return true;
  if (Array.isArray(value.errors) && value.errors.length > 0) return true;
  if (value.error != null && value.error !== '') return true;
  if (
    'response' in value &&
    (value.response == null || (typeof value.response === 'string' && value.response.trim() === ''))
  ) {
    return true;
  }
  return false;
}

export const onRequestPost: PagesFunction<{
  AI: {
    run: (model: string, input: unknown) => Promise<unknown>;
  };
}> = async ({ request, env }) => {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const lang: Lang = body?.lang === 'en' ? 'en' : 'vi';

  if (!prompt) {
    return json({ error: 'Missing prompt' }, 400);
  }

  if (!env?.AI || typeof env.AI.run !== 'function') {
    return json(
      {
        error:
          lang === 'en' ? 'Workers AI is not available right now.' : 'Workers AI hiện không sẵn sàng.',
      },
      503,
    );
  }

  let result: unknown;
  try {
    result = await env.AI.run(MODEL, {
      max_tokens: MAX_TOKENS,
      messages: buildGenerateMessages(prompt, lang),
    });
  } catch (err) {
    console.error('Workers AI generate failed', err instanceof Error ? err.message : 'unknown');
    return json({ error: aiFailureMessage(lang) }, 502);
  }

  if (aiResponseFailed(result)) {
    return json({ error: aiFailureMessage(lang) }, 502);
  }

  return json({ result: guardGenerateResult(result, lang) });
};
