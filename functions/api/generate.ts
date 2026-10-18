import { buildGenerateMessages, curatedOnboardingContext, type GenerateLang } from './generateGrounding.ts';

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
  return text.replace(ZERO_WIDTH, '').replace(/[\u2018\u2019]/g, "'").normalize('NFKC');
}

function foldGenerated(text: string): string {
  return normalizeGeneratedText(text)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
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

function deniesLogAction(folded: string): boolean {
  return /\binstead of log\b|\bthay cho log\b|\bdo not use\b|\bdon't use\b|\bkhong dung log\b|\bkhong co log\b|\bonly available on enterprise\b|\bchi co tren enterprise\b|\benterprise-only\b/.test(
    folded,
  );
}

/**
 * Log named as the WAF action or mode. This is the class, not a verb list:
 * a mode, a chosen action, the action left sitting on Log, or Log as an item
 * in an action list (including when the list ends on a period).
 */
function namesLogAsWafAction(sentence: string): boolean {
  const folded = withoutLogin(foldGenerated(sentence));
  if (deniesLogAction(folded)) return false;
  if (/\blog\s+mode\b|\bin\s+log\s+mode\b|\bmode\s+log\b/.test(folded)) return true;
  if (/\b(?:chon|select|pick|choose)\s+log\b/.test(folded)) return true;
  if (/\b(?:hanh dong|action)\s*[:=,]?\s*log\b/.test(folded)) return true;
  if (/\blog\s+(?:action|mode)\b/.test(folded)) return true;
  if (/\bto\s+log\b|\bsang\s+log\b/.test(folded)) return true;
  // "để ở Log", "ở Log", "leave it at Log" — the action is left on Log.
  if (/\bo\s+log\b/.test(folded)) return true;
  if (/\b(?:leave|keep|put|set|place)\b[\s\S]{0,24}\bat\s+log\b/.test(folded)) return true;
  // Log as one list item. A trailing period still ends the item: "Block, Challenge, Log."
  return (
    /(?:^|[,/;|]|\b(?:and|or|va|hoac)\s+)\s*log\b\s*(?:[,/;|]|[.!?…]|$|\s+\b(?:and|or|va|hoac)\b)/.test(folded) &&
    /\b(?:block|challenge|skip|allow|action|hanh dong)\b/.test(folded)
  );
}

const LOWER_PLAN = /\b(?:free|pro|business)\b/;
const ENTERPRISE_ONLY_FEATURE = /\blog\b|\bsdd\b|sensitive data/;
const AVAILABILITY_GRANT =
  /\b(?:available|support(?:s|ed)?|includ(?:e|es|ed)|comes with|can use|co the|ho tro|bao gom|di kem|kem theo|co san|has|have|offers)\b|\bco\b/;
const GRANT_NEGATION =
  /\b(?:not|no|never|cannot|can't|dont|don't|doesn't|doesnt|isn't|isnt|without|khong|chua|chang)\b(?:\s+\w+){0,5}\s+(?:available|support|includ|come|co\b|has\b|have\b|offer|ho tro|bao gom|dung\b|use\b|san\b)/;

/**
 * Enterprise-only Log or Sensitive Data Detection described as available,
 * supported, or included on Free, Pro, or Business.
 * "Log is available on Enterprise" and "does not support Log" stay.
 */
function claimsFeatureOnLowerPlan(sentence: string, prompt: string): boolean {
  const folded = withoutLogin(foldGenerated(sentence));
  if (!ENTERPRISE_ONLY_FEATURE.test(folded) || !AVAILABILITY_GRANT.test(folded)) return false;
  if (deniesLogAction(folded) || GRANT_NEGATION.test(folded)) return false;
  const namesLower = LOWER_PLAN.test(folded);
  const namesEnterprise = /\benterprise\b/.test(folded);
  if (namesEnterprise && !namesLower) return false;
  if (namesLower) return true;
  return statedPlan(prompt) !== 'enterprise';
}

function offersProOrBusiness(folded: string): boolean {
  return (
    /\b(?:upgrad\w*|nang cap|need|needs|required|requires|switch to|move to|chuyen sang|len goi|phai co)\b[\s\S]{0,60}\b(?:pro|business)\b/.test(
      folded,
    ) ||
    /\b(?:pro|business)\b[\s\S]{0,40}\b(?:is required|required|for|de co|de dung|de bat)\b/.test(folded)
  );
}

function misstatesEnterpriseFeature(sentence: string, fullText: string): boolean {
  const folded = withoutLogin(foldGenerated(sentence));
  if (/\b(?:do not|don't|dung|khong|never)\b[\s\S]{0,40}\b(?:upgrad\w*|nang cap)\b/.test(folded)) return false;
  if (!offersProOrBusiness(folded)) return false;
  const featureHere = /\blog\b|sensitive data|\bsdd\b/.test(folded);
  const featureNearby = /\blog\b|sensitive data|\bsdd\b|enterprise-only|chi co tren enterprise/.test(
    withoutLogin(foldGenerated(fullText)),
  );
  const vagueFeatures =
    /\bthese features\b|\bthose features\b|\bthis feature\b|\bcac tinh nang\b|\btinh nang nay\b|\btinh nang do\b|\bnhung tinh nang\b/.test(
      folded,
    );
  return featureHere || (vagueFeatures && featureNearby);
}

function saveClaimIsNegated(folded: string): boolean {
  return /\b(?:not|no|never|cannot|can't|dont|don't|doesn't|doesnt|isn't|isnt|without|khong|chua|chang)\b/.test(
    folded,
  );
}

/** Save is said to turn every rule on. A sentence that already negates that claim stays. */
function misstatesSave(sentence: string): boolean {
  const folded = foldGenerated(sentence);
  if (!/\bsave\b/.test(folded) || !/\brules?\b/.test(folded) || !/\b(?:all|every|moi|tat ca)\b/.test(folded)) {
    return false;
  }
  return !saveClaimIsNegated(folded);
}

export function saveSubsetInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Save does not enable every rule. The deployment runs a subset of rules.'
    : 'Save không bật mọi rule. Bản deployment chỉ chạy một phần rule.';
}

function statesLogLimit(text: string): boolean {
  const folded = foldGenerated(text);
  return /only available on enterprise|chi co tren enterprise|enterprise-only/.test(folded) && /managed challenge/.test(folded);
}

/**
 * Log is Enterprise-only. If the answer tells a non-Enterprise (or unknown-plan)
 * learner to use it, replace that sentence and state the Managed Challenge alternative.
 * Also drop advice to buy Pro or Business for Log or Sensitive Data Detection.
 */
function cleanupGaps(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').replace(/\s+$/g, ''))
    .filter((line) => line.trim() !== '')
    .join('\n')
    .trim();
}

export function rewritePlanGatedActions(text: string, lang: Lang, prompt: string): string {
  const plan = statedPlan(prompt);
  const logLine = logEnterpriseInstruction(lang);
  const featureLine = enterpriseFeatureInstruction(lang);
  const saveLine = saveSubsetInstruction(lang);
  const source = normalizeGeneratedText(text);
  let sawUpsell = false;
  let sawFeature = false;
  let sawLogGrant = false;
  let sawLogAction = false;
  let sawSave = false;
  const rewritten = rewriteSentences(source, (sentence) => {
    if (misstatesSave(sentence)) {
      sawSave = true;
      return '';
    }
    if (misstatesEnterpriseFeature(sentence, source)) {
      sawUpsell = true;
      return '';
    }
    if (claimsFeatureOnLowerPlan(sentence, prompt)) {
      const folded = withoutLogin(foldGenerated(sentence));
      if (/\bsdd\b|sensitive data/.test(folded)) sawFeature = true;
      if (/\blog\b/.test(folded)) sawLogGrant = true;
      return '';
    }
    if (plan !== 'enterprise' && namesLogAsWafAction(sentence)) {
      sawLogAction = true;
      return '';
    }
    return sentence;
  });
  const parts = [cleanupGaps(rewritten)];
  const remaining = parts[0] ?? '';
  if ((sawUpsell || sawFeature) && !statesFeatureLimit(remaining)) {
    parts.push(featureLine);
  } else if ((sawLogGrant || sawLogAction) && !statesLogLimit(remaining) && (sawLogGrant || plan !== 'enterprise')) {
    parts.push(logLine);
  }
  if (sawSave && !foldGenerated(parts.join('\n')).includes(foldGenerated(saveLine))) {
    parts.push(saveLine);
  }
  return parts.filter(Boolean).join('\n');
}

function statesFeatureLimit(text: string): boolean {
  const folded = foldGenerated(text);
  return /enterprise-only|chi co tren enterprise/.test(folded) && /sensitive data|\bsdd\b/.test(folded);
}

export function registrarPasteInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'At the registrar, paste the two nameservers you copied from the zone Overview page. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/'
    : 'Tại registrar, dán hai nameserver vừa copy từ trang Overview của zone. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/';
}

export function owaspFreeInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'The OWASP Core Ruleset is not on the Free plan. It needs Pro or above. Free keeps the Cloudflare Free Managed Ruleset and custom rules. On Pro or above, turn it on at Security → Settings. https://developers.cloudflare.com/waf/managed-rules/'
    : 'OWASP Core Ruleset không có trên gói Free và cần Pro trở lên. Free giữ Cloudflare Free Managed Ruleset và custom rules. Từ Pro trở lên, bật tại Security → Settings. https://developers.cloudflare.com/waf/managed-rules/';
}

/** Moving a domain onto Cloudflare, including a registrar such as Mắt Bão. */
function isZoneCutoverPrompt(prompt: string): boolean {
  const folded = foldGenerated(prompt);
  if (/nameserver|mat bao|onboard|add a site|add a domain|doi nameserver|change nameserver/.test(folded)) return true;
  if (/\b(?:point|move|chuyen)\b[\s\S]{0,24}\b(?:domain|ten mien)\b/.test(folded)) return true;
  return /registrar/.test(folded) && /\b(?:dns|domain|ten mien|nameserver|cloudflare)\b/.test(folded);
}

function statesRegistrarPaste(text: string): boolean {
  const folded = foldGenerated(text);
  if (!/registrar/.test(folded)) return false;
  return /paste|\bdan\b|doi nameserver|change nameserver|update (?:your |the )?nameserver|add the nameserver/.test(
    folded,
  );
}

function asksOwaspOnFree(prompt: string): boolean {
  const folded = foldGenerated(prompt);
  if (!/\bowasp\b|core ruleset|core rule/.test(folded)) return false;
  const plan = statedPlan(prompt);
  if (plan === 'pro' || plan === 'business' || plan === 'enterprise') return false;
  return plan === 'free' || /\bfree\b/.test(folded);
}

function statesOwaspGate(text: string): boolean {
  const folded = foldGenerated(text);
  if (!/\bowasp\b|core ruleset|core rule/.test(folded)) return false;
  return /pro or above|pro tro len|needs pro\b|can pro\b|not on the free|khong co tren/.test(folded);
}

/** Tells a Free learner to turn OWASP on, without the Pro+ gate. */
function instructsOwaspOnFree(sentence: string): boolean {
  const folded = foldGenerated(sentence);
  if (!/\bowasp\b|core ruleset|core rule/.test(folded) && !/\benable it\b|\bturn it on\b|\bbat no\b/.test(folded)) {
    return false;
  }
  if (/\b(?:not|never|khong|chua|don't|do not|avoid)\b/.test(folded)) return false;
  if (/pro or above|pro tro len|needs pro\b|can pro\b/.test(folded)) return false;
  return /\b(?:enable|deploy|activate|switch on|turn on|bat|kich hoat)\b/.test(folded);
}

/**
 * A cutover answer must say to paste the Overview nameservers at the registrar.
 * An OWASP-on-Free answer must state the documented Pro+ gate.
 */
export function ensureRequiredSteps(text: string, lang: Lang, prompt: string): string {
  let next = text;
  if (asksOwaspOnFree(prompt)) {
    let removed = false;
    next = rewriteSentences(next, (sentence) => {
      if (!instructsOwaspOnFree(sentence)) return sentence;
      removed = true;
      return '';
    });
    next = cleanupGaps(next);
    if (removed || !statesOwaspGate(next)) {
      const line = owaspFreeInstruction(lang);
      if (!foldGenerated(next).includes(foldGenerated(line))) next = [next, line].filter(Boolean).join('\n');
    }
  }
  if (isZoneCutoverPrompt(prompt) && !statesRegistrarPaste(next)) {
    next = [next, registrarPasteInstruction(lang)].filter(Boolean).join('\n');
  }
  return next;
}

/** True when the model declined instead of giving the dashboard steps. */
export function isBareRefusal(text: string): boolean {
  const folded = foldGenerated(text);
  const hasSteps =
    /overview|nameserver|security\s*→|managed challenge|full \(strict\)|orange cloud|dam may|ban ghi|free managed ruleset/.test(
      folded,
    );
  if (hasSteps) return false;
  return /\b(?:khong chac|khong biet|khong the|khong ro|toi khong|i am not sure|im not sure|i'm not sure|not sure|do not know|don't know|cannot help|can't help|unable to|xin loi)\b/.test(
    folded,
  );
}

export function curatedStepsFallback(prompt: string, lang: Lang): string {
  const notes = curatedOnboardingContext(prompt, lang);
  if (!notes) return '';
  const body = notes.split('\n\n').slice(1).join('\n\n').trim();
  if (!body) return '';
  const intro =
    lang === 'en'
      ? 'Follow these Cloudflare dashboard steps:'
      : 'Làm theo các bước sau trên dashboard Cloudflare:';
  return `${intro}\n${body}`;
}

export function guardGenerateText(text: string, lang: Lang, prompt = ''): string {
  let guarded = rewritePlanGatedActions(rewriteInventedNameservers(text, lang), lang, prompt);
  if (isBareRefusal(guarded)) {
    const fallback = curatedStepsFallback(prompt, lang);
    if (fallback) guarded = fallback;
  }
  return ensureRequiredSteps(guarded, lang, prompt);
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
