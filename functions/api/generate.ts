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

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF\u2060\u180E]/g;

/**
 * Concrete nameserver hostnames after NFKC and zero-width stripping.
 * Matches ns1, _ns1, ns1a, ns-1, and <label>.ns on cloudflare.com or .net.
 * dash.cloudflare.com and developers.cloudflare.com do not match.
 */
const INVENTED_NAMESERVER =
  /(?<![a-z0-9])(?:_?ns(?:-?\d+[a-z]?)?|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.ns)\.cloudflare\.(?:com|net)/i;

export function nameserverOverviewInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Copy the two nameservers shown on the zone Overview page.'
    : 'Hãy copy hai nameserver đang hiện trên trang Overview của zone.';
}

export function logEnterpriseInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Log is only available on Enterprise. On Free, Pro, and Business, use Managed Challenge instead of Log.'
    : 'Log chỉ có trên Enterprise. Trên Free, Pro và Business, hãy dùng Managed Challenge thay cho Log.';
}

function enterpriseFeatureInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Log and Sensitive Data Detection are Enterprise-only. Do not upgrade to Pro or Business for them. Use Managed Challenge instead of Log.'
    : 'Log và Sensitive Data Detection chỉ có trên Enterprise. Đừng nâng cấp lên Pro hoặc Business để có chúng. Hãy dùng Managed Challenge thay cho Log.';
}

/** Strip characters that hide a hostname, then fold full-width ASCII to ASCII. */
export function normalizeGeneratedText(text: string): string {
  return text.replace(ZERO_WIDTH, '').normalize('NFKC');
}

function foldGenerated(text: string): string {
  return normalizeGeneratedText(text)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

export type StatedPlan = 'enterprise' | 'business' | 'pro' | 'free' | 'unknown';

/** Plan the learner says they are on. A bare "Enterprise-only" mention stays unknown. */
export function statedPlan(prompt: string): StatedPlan {
  const folded = foldGenerated(prompt);
  const re =
    /\b(?:i am on|im on|i'm on|on the|on a|using|goi|dang dung|toi dung|dung goi)\s+(?:the\s+|goi\s+)?(enterprise|business|pro|free)\b|\b(enterprise|business|pro|free)\s+plan\b|\bplan\s+(enterprise|business|pro|free)\b|\b(?:for|as a)\s+(?:a\s+)?(enterprise|business|pro|free)\s+(?:user|customer|zone|account)\b/g;
  let found: StatedPlan = 'unknown';
  for (const match of folded.matchAll(re)) {
    const plan = match[1] || match[2] || match[3] || match[4];
    if (plan === 'enterprise' || plan === 'business' || plan === 'pro' || plan === 'free') found = plan;
  }
  return found;
}

function splitSentences(line: string): string[] {
  return line.split(/(?<=[.!?])\s+/).filter((part) => part.length > 0);
}

function rewriteSentences(text: string, edit: (sentence: string) => string): string {
  return text
    .split('\n')
    .map((line) => {
      const collapsed: string[] = [];
      for (const sentence of splitSentences(line).map(edit)) {
        if (collapsed[collapsed.length - 1] === sentence) continue;
        collapsed.push(sentence);
      }
      return collapsed.join(' ');
    })
    .join('\n');
}

function hasInventedNameserver(sentence: string): boolean {
  return INVENTED_NAMESERVER.test(normalizeGeneratedText(sentence));
}

/** Replace each sentence or bullet that contains an invented nameserver hostname. */
export function rewriteInventedNameservers(text: string, lang: Lang): string {
  const instruction = nameserverOverviewInstruction(lang);
  return rewriteSentences(normalizeGeneratedText(text), (sentence) => {
    if (!hasInventedNameserver(sentence)) return sentence;
    const bullet = sentence.match(/^(\s*[-*]\s+)/);
    return `${bullet?.[1] ?? ''}${instruction}`;
  });
}

function withoutLogin(folded: string): string {
  return folded.replace(/\blog(?:ging)?\s+in\b/g, ' ').replace(/\blogin\b/g, ' ');
}

function recommendsLogAction(sentence: string): boolean {
  const folded = withoutLogin(foldGenerated(sentence));
  if (/\binstead of log\b|\bthay cho log\b|\bdo not use\b|\bdon't use\b|\bkhong dung\b|\bkhong co log\b/.test(folded)) {
    return false;
  }
  if (/\benterprise\b/.test(folded) && /\bmanaged challenge\b/.test(folded)) return false;
  return (
    /\baction\s*[:=]?\s*log\b/.test(folded) ||
    /\blog\s+action\b/.test(folded) ||
    /\b(?:change|set|switch|use|enable|turn|doi|dung|dat|chuyen|bat|hay|de)\b[\s\S]{0,80}\blog\b/.test(folded) ||
    /\bto\s+log\b/.test(folded) ||
    /\bsang\s+log\b/.test(folded)
  );
}

function misstatesEnterpriseFeature(sentence: string): boolean {
  const folded = withoutLogin(foldGenerated(sentence));
  if (/\b(?:do not|don't|dung|khong|never)\b[\s\S]{0,40}\b(?:upgrad\w*|nang cap)\b/.test(folded)) return false;
  if (!/\blog\b|sensitive data|\bsdd\b/.test(folded)) return false;
  const offersLowerPlan =
    /\b(?:upgrad\w*|nang cap|need|needs|required|requires|switch to|move to|chuyen sang|len goi|phai co)\b[\s\S]{0,60}\b(?:pro|business)\b/.test(
      folded,
    ) ||
    /\b(?:pro|business)\b[\s\S]{0,40}\b(?:is required|required|for|de co|de dung|de bat)\b[\s\S]{0,30}\b(?:log|sensitive data|sdd)\b/.test(
      folded,
    );
  return offersLowerPlan;
}

/**
 * Log is Enterprise-only. If the answer tells a non-Enterprise (or unknown-plan)
 * learner to use it, replace that sentence and state the Managed Challenge alternative.
 * Also drop advice to buy Pro or Business for Log or Sensitive Data Detection.
 */
export function rewritePlanGatedActions(text: string, lang: Lang, prompt: string): string {
  const plan = statedPlan(prompt);
  const logLine = logEnterpriseInstruction(lang);
  const featureLine = enterpriseFeatureInstruction(lang);
  let mentionedLog = false;
  const rewritten = rewriteSentences(normalizeGeneratedText(text), (sentence) => {
    if (misstatesEnterpriseFeature(sentence)) {
      mentionedLog = true;
      const bullet = sentence.match(/^(\s*[-*]\s+)/);
      return `${bullet?.[1] ?? ''}${featureLine}`;
    }
    if (plan !== 'enterprise' && recommendsLogAction(sentence)) {
      mentionedLog = true;
      const bullet = sentence.match(/^(\s*[-*]\s+)/);
      return `${bullet?.[1] ?? ''}${logLine}`;
    }
    return sentence;
  });
  if (mentionedLog && plan !== 'enterprise' && !rewritten.includes(logLine) && !rewritten.includes(featureLine)) {
    return `${rewritten.trim()}\n${logLine}`;
  }
  return rewritten;
}

export function guardGenerateText(text: string, lang: Lang, prompt = ''): string {
  return rewritePlanGatedActions(rewriteInventedNameservers(text, lang), lang, prompt);
}

function rewriteChoice(choice: unknown, lang: Lang, prompt: string): unknown {
  if (!choice || typeof choice !== 'object') return choice;
  const next = { ...(choice as Record<string, unknown>) };
  if (typeof next.text === 'string') next.text = guardGenerateText(next.text, lang, prompt);
  if (next.message && typeof next.message === 'object') {
    const message = { ...(next.message as Record<string, unknown>) };
    if (typeof message.content === 'string') {
      message.content = guardGenerateText(message.content, lang, prompt);
    }
    next.message = message;
  }
  return next;
}

/** Apply output guards to the string shapes the generator UI renders. */
export function guardGenerateResult(result: unknown, lang: Lang, prompt = ''): unknown {
  if (typeof result === 'string') return guardGenerateText(result, lang, prompt);
  if (!result || typeof result !== 'object') return result;
  const next = { ...(result as Record<string, unknown>) };
  if (typeof next.response === 'string') next.response = guardGenerateText(next.response, lang, prompt);
  if (Array.isArray(next.choices)) next.choices = next.choices.map((choice) => rewriteChoice(choice, lang, prompt));
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

  return json({ result: guardGenerateResult(result, lang, prompt) });
};
