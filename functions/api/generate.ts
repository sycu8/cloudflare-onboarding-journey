import { buildGenerateMessages, curatedOnboardingContext, type GenerateLang } from './generateGrounding.ts';
import { claimCheckMessages, parseClaimVerdicts, reviewPlanClaims } from './planFeatures.ts';

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
  /(?<![a-z0-9])(?:_?ns(?:-?\d+[a-z]?|-[a-z0-9]+)?|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.ns)\.cloudflare\.(?:com|net)/i;

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
  return text
    .replace(ZERO_WIDTH, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .normalize('NFKC');
}

function foldGenerated(text: string): string {
  // Keep đừng distinct from dùng. Both would otherwise fold to "dung".
  const marked = normalizeGeneratedText(text).replace(/đừng/gi, ' dungneg ');
  return marked.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd');
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

function hideLogpush(folded: string): string {
  return folded.replace(/logpush/g, ' ');
}

function splitClauses(folded: string): string[] {
  return folded.split(/\s*(?:,|;|\b(?:but|however|nhung)\b)\s*/).filter((part) => part.length > 0);
}

/**
 * Clause-level denial that does not use without / chưa / đừng.
 * Those three only deny a claim when that claim is what they govern.
 */
function hardClauseNegated(clause: string): boolean {
  return /\b(?:not|no|never|cannot|can't|dont|don't|doesn't|doesnt|isn't|isnt|khong|chang|neither)\b|\binstead of\b|\bthay cho\b|\benterprise-only\b|\bchi co tren enterprise\b|\bonly available on enterprise\b/.test(
    clause,
  );
}

/**
 * without negates the words that follow it.
 * chưa and đừng also negate a claim that sits immediately before them
 * ("OWASP chưa có", "Log thì đừng").
 */
function softNegatorDenies(clause: string, claim: RegExp): boolean {
  const re = /\b(?:without|chua|dungneg)\b/g;
  for (const match of clause.matchAll(re)) {
    const after = clause.slice(match.index, match.index + 48);
    const word = match[0];
    const before =
      word === 'without' ? '' : clause.slice(Math.max(0, match.index - 32), match.index + word.length);
    if (claim.test(after) || (before && claim.test(before))) return true;
  }
  return false;
}

function claimIsDenied(clause: string, claim: RegExp): boolean {
  if (!claim.test(clause)) return false;
  return hardClauseNegated(clause) || softNegatorDenies(clause, claim);
}

function plainLine(folded: string): string {
  return folded.replace(/\*\*|__/g, '');
}

/** Log as a label: a bullet, a bold item, a quote, or parentheses. */
function isLogActionLabel(folded: string): boolean {
  const plain = plainLine(folded);
  return (
    /(?:^|\n)\s*(?:[-*]\s+)?log\s*:/.test(plain) ||
    /(?:^|\n)\s*[-*]\s+log\s*[.!?…]?\s*$/.test(plain) ||
    /["']log["']/.test(plain) ||
    /\(\s*log(?:\s+action)?\s*\)/.test(plain)
  );
}

/**
 * Log named as the WAF action or mode. This is the class, not a verb list:
 * a mode, a chosen action, the action left sitting on Log, or Log as an item
 * in an action list (including when the list ends on a period).
 */
function namesLogAsWafAction(sentence: string): boolean {
  const folded = hideLogpush(withoutLogin(foldGenerated(sentence)));
  if (!/\blog\b/.test(folded)) return false;
  if (splitClauses(folded).every((clause) => !/\blog\b/.test(clause) || claimIsDenied(clause, /\blog\b/))) return false;
  if (isLogActionLabel(folded)) return true;
  if (/\blog\s+mode\b|\bin\s+log\s+mode\b|\bmode\s+log\b/.test(folded)) return true;
  if (/\b(?:chon|select|pick|choose|use|using|dung|su dung)\s+["'(]*log\b/.test(folded)) return true;
  if (/\b(?:hanh dong|action)\s*[:=,]?\s*log\b/.test(folded)) return true;
  // "hành động là Log" and "action is Log", including a short phrase between them.
  if (/\b(?:hanh dong|action)\b[\s\S]{0,40}\b(?:la|is)\s+["'(]*log\b/.test(folded)) return true;
  if (/\blog\s+(?:action|mode)\b/.test(folded)) return true;
  if (/\bto\s+log\b|\bsang\s+log\b|\bde\s+log\b/.test(folded)) return true;
  // "để ở Log", "ở Log", "leave it at Log" — the action is left on Log.
  if (/\bo\s+log\b/.test(folded)) return true;
  if (/\b(?:leave|keep|put|set|place)\b[\s\S]{0,24}\bat\s+log\b/.test(folded)) return true;
  // Log as one list item. A trailing period still ends the item: "Block, Challenge, Log."
  return (
    /(?:^|[,/;|]|\b(?:and|or|va|hoac)\s+)\s*log\b\s*(?:[,/;|]|[.!?…]|$|\s+\b(?:and|or|va|hoac)\b)/.test(folded) &&
    /\b(?:block|challenge|skip|allow|action|hanh dong)\b/.test(folded)
  );
}

/**
 * A non-Enterprise plan paired with the WAF Log action in the same clause.
 * Logpush is not the Log action. A clause that denies the pairing stays.
 */
function pairsLowerPlanWithLog(sentence: string, prompt: string): boolean {
  const folded = hideLogpush(withoutLogin(foldGenerated(sentence)));
  if (!/\blog\b/.test(folded)) return false;
  if (isLogActionLabel(folded) && statedPlan(prompt) !== 'enterprise') {
    const labelClause =
      splitClauses(plainLine(folded)).find((clause) => /(?:^|\s)log\s*:|["']log["']|\(\s*log\b/.test(clause)) ??
      folded;
    if (!claimIsDenied(labelClause, /\blog\b/)) return true;
  }
  const plan = statedPlan(prompt);
  return splitClauses(folded).some((clause) => {
    if (!/\blog\b/.test(clause) || claimIsDenied(clause, /\blog\b/)) return false;
    if (LOWER_PLAN.test(clause)) return true;
    return plan !== 'enterprise' && namesLogAsWafAction(clause);
  });
}

const LOWER_PLAN = /\b(?:free|pro|business)\b/;

const ENABLE_VERB = /\b(?:enable|deploy|activate|switch on|turn on|bat|kich hoat|ships with|included|includes|include|co)\b/;

const SDD_CLAIM =
  /\bsdd\b|sensitive data|card detection|credit card|payment card|the tin dung|phat hien the|du lieu nhay cam/;

const BOT_MGMT = /\bbot management\b|\bbot mgmt\b|bot-management/;

/** SDD, including card detection, paired with a lower plan or an enable verb off Enterprise. */
function misstatesSdd(sentence: string, prompt: string): boolean {
  const folded = foldGenerated(sentence);
  if (!SDD_CLAIM.test(folded)) return false;
  const plan = statedPlan(prompt);
  const sentenceHasLower = LOWER_PLAN.test(folded);
  return splitClauses(folded).some((clause) => {
    if (!SDD_CLAIM.test(clause) || claimIsDenied(clause, SDD_CLAIM)) return false;
    if (/\benterprise\b/.test(clause) && !LOWER_PLAN.test(clause)) return false;
    if (LOWER_PLAN.test(clause) || sentenceHasLower) return true;
    return plan !== 'enterprise' && ENABLE_VERB.test(clause);
  });
}

/** Bot Management offered on Free, Pro, or Business. Super Bot Fight Mode stays. */
function misstatesBotManagement(sentence: string, prompt: string): boolean {
  const folded = foldGenerated(sentence);
  if (!BOT_MGMT.test(folded)) return false;
  const plan = statedPlan(prompt);
  return splitClauses(folded).some((clause) => {
    if (!BOT_MGMT.test(clause) || claimIsDenied(clause, BOT_MGMT)) return false;
    if (/\benterprise\b/.test(clause) && !LOWER_PLAN.test(clause)) return false;
    if (LOWER_PLAN.test(clause)) return true;
    return plan !== 'enterprise' && ENABLE_VERB.test(clause);
  });
}

/** A dashboard control named Logging. Payload logging and Logpush are real. */
function inventsLoggingToggle(sentence: string): boolean {
  const folded = foldGenerated(sentence);
  if (/logpush|payload logging/.test(folded)) return false;
  return splitClauses(folded).some((clause) => {
    if (!/\blogging\b/.test(clause) || claimIsDenied(clause, /\blogging\b/)) return false;
    return (
      /\blogging toggle\b|\blogging switch\b|\blogging setting\b|\blogging option\b|\blogging\s*:/.test(clause) ||
      ENABLE_VERB.test(clause)
    );
  });
}

/** Logpush described as missing on a lower plan, or as something that needs Enterprise. */
function misstatesLogpush(sentence: string, fullText: string): boolean {
  const folded = foldGenerated(sentence);
  const aboutLogpush = /\blogpush\b/.test(foldGenerated(fullText));
  if (!aboutLogpush) return false;
  if (/\blogpush\b/.test(folded)) {
    return splitClauses(folded).some((clause) => {
      if (!/logpush/.test(clause)) return false;
      const grants =
        /\b(?:available|included|includes|include|co san|usage-based|dung bao nhieu)\b/.test(clause) &&
        !claimIsDenied(clause, /logpush/);
      const exclusive =
        /\benterprise\b/.test(clause) &&
        (/\b(?:only|required|requires|need|needs|must|phai|can|exclusive|chi|alone|tinh nang)\b/.test(clause) ||
          /\(\s*enterprise\s*\)/.test(clause) ||
          !grants);
      if (exclusive && !(grants && LOWER_PLAN.test(clause) && !/\bonly\b|\bchi\b|\balone\b/.test(clause))) return true;
      return claimIsDenied(clause, /logpush/) && LOWER_PLAN.test(clause);
    });
  }
  // "You need Enterprise." after a Logpush denial is the same false claim.
  return splitClauses(folded).some((clause) => {
    if (hardClauseNegated(clause)) return false;
    if (/\blog\b|sensitive data|\bsdd\b|bot management|\bwaf\b/.test(clause)) return false;
    return /\b(?:need|needs|require|requires|required|must|only|phai|can)\b[\s\S]{0,40}\benterprise\b|\benterprise\b[\s\S]{0,30}\b(?:only|required)\b/.test(
      clause,
    );
  });
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
  if (/\b(?:do not|don't|dung|dungneg|khong|never)\b[\s\S]{0,40}\b(?:upgrad\w*|nang cap)\b/.test(folded)) return false;
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

function isAllRulesClaim(clause: string): boolean {
  return /\brules?\b/.test(clause) && /\b(?:all|every|moi|tat ca)\b/.test(clause);
}

/**
 * Save is said to turn every rule on. "After Save, every rule runs" still counts
 * when Save sits in a neighboring clause. Negation counts only inside the clause
 * that claims all rules, so "Save enables all rules, not a subset" stays false.
 */
function misstatesSave(sentence: string): boolean {
  const clauses = splitClauses(foldGenerated(sentence));
  if (!clauses.some((clause) => /\bsav(?:e|ing)\b/.test(clause))) return false;
  return clauses.some((clause) => isAllRulesClaim(clause) && !claimIsDenied(clause, /\b(?:all|every|moi|tat ca)\b/));
}

function statesSaveLimit(sentence: string): boolean {
  const clauses = splitClauses(foldGenerated(sentence));
  if (!clauses.some((clause) => /\bsav(?:e|ing)\b/.test(clause))) return false;
  const claims = clauses.filter(isAllRulesClaim);
  return claims.length > 0 && claims.every((clause) => claimIsDenied(clause, /\b(?:all|every|moi|tat ca)\b/));
}

export function saveSubsetInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Save does not enable every rule. The deployment runs a subset of rules.'
    : 'Save không bật mọi rule. Bản deployment chỉ chạy một phần rule.';
}

function subsetSentence(lang: Lang): string {
  return lang === 'en' ? 'The deployment runs a subset of rules.' : 'Bản deployment chỉ chạy một phần rule.';
}

const INVENTED_ACTION = /\b(?:simulate|quarantine|monitor|tarpit|captcha|sinkhole|observe)\b/;

function knownActionsInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Real WAF actions are Block, Managed Challenge, JS Challenge, Interactive Challenge, and Skip. Log is Enterprise-only. Simulate is not an action.'
    : 'Action WAF thật là Block, Managed Challenge, JS Challenge, Interactive Challenge và Skip. Log chỉ có trên Enterprise. Simulate không phải action.';
}

/** A named WAF action that is not in the plan-feature table (LG7). */
function inventsWafAction(sentence: string): boolean {
  const folded = hideLogpush(withoutLogin(foldGenerated(sentence)));
  if (!INVENTED_ACTION.test(folded)) return false;
  if (/\bnot an action\b|\bkhong phai action\b/.test(folded)) return false;
  if (claimIsDenied(folded, INVENTED_ACTION)) return false;
  return (
    /\b(?:action|hanh dong|mode)\b[\s\S]{0,48}(?:simulate|quarantine|monitor|tarpit|captcha|sinkhole|observe)\b/.test(
      folded,
    ) ||
    /\b(?:use|using|chon|select|pick|choose|set|dung|dat)\s+(?:the\s+|action\s+)?(?:simulate|quarantine|monitor|tarpit|captcha|sinkhole|observe)\b/.test(
      folded,
    )
  );
}

function hasSubsetPoint(text: string): boolean {
  return /subset of rules|mot phan rule/.test(foldGenerated(text));
}

function appendMissing(base: string, addition: string): string {
  const have = foldGenerated(base);
  const missing = splitSentences(addition).filter((sentence) => sentence && !have.includes(foldGenerated(sentence)));
  if (!missing.length) return base;
  return [base, missing.join(' ')].filter(Boolean).join('\n');
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
  let sawSdd = false;
  let sawLog = false;
  let sawSave = false;
  let sawSaveLimit = false;
  let sawBot = false;
  let sawLogging = false;
  let sawLogpush = false;
  const rewritten = rewriteSentences(source, (sentence) => {
    if (inventsWafAction(sentence)) return knownActionsInstruction(lang);
    if (misstatesSave(sentence)) {
      sawSave = true;
      return '';
    }
    if (statesSaveLimit(sentence)) sawSaveLimit = true;
    if (misstatesLogpush(sentence, source)) {
      sawLogpush = true;
      return '';
    }
    if (inventsLoggingToggle(sentence)) {
      sawLogging = true;
      return '';
    }
    if (misstatesBotManagement(sentence, prompt)) {
      sawBot = true;
      return '';
    }
    if (misstatesEnterpriseFeature(sentence, source)) {
      sawUpsell = true;
      return '';
    }
    if (misstatesSdd(sentence, prompt)) {
      sawSdd = true;
      return '';
    }
    if (pairsLowerPlanWithLog(sentence, prompt) || (plan !== 'enterprise' && namesLogAsWafAction(sentence))) {
      sawLog = true;
      return '';
    }
    return sentence;
  });
  let next = cleanupGaps(rewritten);
  if (sawUpsell || sawSdd) next = appendMissing(next, featureLine);
  else if (sawLog && plan !== 'enterprise') next = appendMissing(next, logLine);
  if (sawSave) next = appendMissing(next, saveLine);
  else if (sawSaveLimit && !hasSubsetPoint(next)) next = appendMissing(next, subsetSentence(lang));
  if (sawBot) next = appendMissing(next, botManagementInstruction(lang));
  if (sawLogging) next = appendMissing(next, loggingToggleInstruction(lang));
  if (sawLogpush) next = appendMissing(next, logpushInstruction(lang));
  return next.trim();
}

function botManagementInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Bot Management is an Enterprise add-on. On Pro and Business, use Super Bot Fight Mode instead. https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/'
    : 'Bot Management là add-on Enterprise. Trên Pro và Business, hãy dùng Super Bot Fight Mode. https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/';
}

function loggingToggleInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'There is no Logging toggle. Logpush exports logs on Free, Pro, and Business. The WAF Log action is Enterprise-only.'
    : 'Không có công tắc tên Logging. Logpush xuất log trên Free, Pro và Business. Action Log của WAF chỉ có trên Enterprise.';
}

function logpushInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'Logpush is available on Free, Pro, and Business with usage-based pricing. Only the WAF custom-rule Log action is Enterprise-only. https://developers.cloudflare.com/logs/logpush/pricing/'
    : 'Logpush có trên Free, Pro và Business theo giá dùng bao nhiêu tính bấy nhiêu. Chỉ action Log của custom rule WAF là Enterprise-only. https://developers.cloudflare.com/logs/logpush/pricing/';
}

export function registrarPasteInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'At the registrar, paste the two nameservers you copied from the zone Overview page. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/'
    : 'Tại registrar, dán hai nameserver vừa copy từ trang Overview của zone. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/';
}

export function owaspFreeInstruction(lang: Lang): string {
  return lang === 'en'
    ? 'The Cloudflare Managed Ruleset and the OWASP Core Ruleset are not on the Free plan. Each needs Pro or above. Free keeps the Cloudflare Free Managed Ruleset and custom rules. https://developers.cloudflare.com/waf/managed-rules/'
    : 'Cloudflare Managed Ruleset và OWASP Core Ruleset không có trên gói Free. Cả hai cần Pro trở lên. Free giữ Cloudflare Free Managed Ruleset và custom rules. https://developers.cloudflare.com/waf/managed-rules/';
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

function asksPaidRulesetOnFree(prompt: string): boolean {
  const folded = foldGenerated(prompt);
  const plan = statedPlan(prompt);
  if (plan === 'pro' || plan === 'business' || plan === 'enterprise') return false;
  const topic = /\bowasp\b|core ruleset|core rule|cloudflare managed ruleset/.test(folded);
  if (!topic) return false;
  return plan === 'free' || /\bfree\b/.test(folded);
}

function statesPaidRulesetGate(text: string): boolean {
  const folded = foldGenerated(text);
  if (!/\bowasp\b|core ruleset|core rule|cloudflare managed ruleset/.test(folded)) return false;
  return /pro or above|pro tro len|needs pro\b|can pro\b|not on the free|khong co tren/.test(folded);
}

function isFreeManagedOnly(clause: string): boolean {
  return /free managed ruleset/.test(clause) && !/cloudflare managed ruleset/.test(clause.replace(/free managed ruleset/g, ' '));
}

/** Tells a Free learner to turn on OWASP or the Cloudflare Managed Ruleset. */
function recommendsPaidRulesetOnFree(sentence: string, prompt: string): boolean {
  const folded = foldGenerated(sentence);
  const plan = statedPlan(prompt);
  if ((plan === 'pro' || plan === 'business' || plan === 'enterprise') && !/\bfree\b/.test(folded)) return false;
  if (/\b(?:upgrad\w*|nang cap)\b/.test(folded) && /\bpro\b/.test(folded)) return false;
  if (/needs pro\b|pro or above|pro tro len|can pro\b|not on the free|khong co tren/.test(folded)) return false;
  const onFree = plan === 'free' || /\bfree\b/.test(folded) || /\bfree\b/.test(foldGenerated(prompt));
  if (!onFree) return false;
  const rulesetClause = (clause: string) =>
    /\bowasp\b|core ruleset|core rule/.test(clause) ||
    (/cloudflare managed ruleset/.test(clause) && !isFreeManagedOnly(clause));
  for (const clause of splitClauses(folded)) {
    const pronoun = /\benable it\b|\bturn it on\b|\bbat no\b/.test(clause) && asksPaidRulesetOnFree(prompt);
    if (!rulesetClause(clause) && !pronoun) continue;
    if (claimIsDenied(clause, /\bowasp\b|core ruleset|core rule|cloudflare managed ruleset/)) continue;
    if (ENABLE_VERB.test(clause) || pronoun) return true;
    if (/\bfree\b/.test(clause) && rulesetClause(clause) && /\b(?:include|includes|included|has|have|available|co)\b/.test(clause)) {
      return true;
    }
  }
  return false;
}

function isOverviewCopy(folded: string): boolean {
  return /overview/.test(folded) && /copy|chep/.test(folded);
}

function isRegistrarStep(folded: string): boolean {
  if (isOverviewCopy(folded) && /registrar|mat bao/.test(folded)) return false;
  if (/doi nameserver|change nameserver|set nameserver|cap nhat nameserver|thay nameserver/.test(folded)) return true;
  return /nameserver/.test(folded) && /registrar|mat bao/.test(folded) && /paste|\bdan\b|nhap|set|change|doi|thay/.test(folded);
}

function copiesNamesFromRegistrar(folded: string): boolean {
  return (
    /nameserver/.test(folded) &&
    /(?:from|tu)\s+(?:the\s+)?(?:registrar|mat bao)/.test(folded) &&
    /copy|chep|lay|get|take|paste|\bdan\b|nhap/.test(folded)
  );
}

function isTemporalBackwards(folded: string): boolean {
  return (
    /overview/.test(folded) &&
    (/(?:doi nameserver|change nameserver|registrar|mat bao)[\s\S]{0,80}(?:truoc|before|first)[\s\S]{0,80}overview/.test(
      folded,
    ) ||
      /(?:truoc|first|dau tien)[\s\S]{0,50}(?:doi nameserver|change nameserver)[\s\S]{0,80}overview/.test(folded))
  );
}

type NameserverKind = 'overview' | 'registrar' | 'backwards' | 'other';

function classifyNameserverSentence(sentence: string): NameserverKind {
  const folded = foldGenerated(sentence);
  if (copiesNamesFromRegistrar(folded) || isTemporalBackwards(folded)) return 'backwards';
  if (isOverviewCopy(folded)) return 'overview';
  if (isRegistrarStep(folded)) return 'registrar';
  return 'other';
}

/**
 * Replace nameserver steps that run the registrar change before the Overview copy,
 * or that take the names from the registrar. A missing paste step is appended later.
 */
export function correctBackwardsNameservers(text: string, lang: Lang, prompt: string): string {
  if (!isZoneCutoverPrompt(prompt)) return text;
  const lines = text.split('\n');
  const sequence = lines.flatMap((line) => splitSentences(line).map((sentence) => classifyNameserverSentence(sentence)));
  let seenOverview = false;
  let backwards = false;
  for (const kind of sequence) {
    if (kind === 'backwards' || (kind === 'registrar' && !seenOverview)) backwards = true;
    if (kind === 'overview') seenOverview = true;
  }
  if (!backwards) return text;
  let inserted = false;
  const rebuilt = lines.map((line) => {
    const kept: string[] = [];
    for (const sentence of splitSentences(line)) {
      const kind = classifyNameserverSentence(sentence);
      if (kind === 'other') {
        kept.push(sentence);
        continue;
      }
      if (!inserted) {
        inserted = true;
        kept.push(nameserverOverviewInstruction(lang), registrarPasteInstruction(lang));
      }
    }
    return kept.join(' ');
  });
  return cleanupGaps(rebuilt.join('\n'));
}

/**
 * Remove a Free-plan recommendation of OWASP or the Cloudflare Managed Ruleset,
 * then add the Pro+ gate once. Append a registrar paste step only when the
 * cutover answer never states one.
 */
export function ensureRequiredSteps(text: string, lang: Lang, prompt: string): string {
  let removed = false;
  let next = rewriteSentences(text, (sentence) => {
    if (!recommendsPaidRulesetOnFree(sentence, prompt)) return sentence;
    removed = true;
    return '';
  });
  next = cleanupGaps(next);
  if ((removed || asksPaidRulesetOnFree(prompt)) && !statesPaidRulesetGate(next)) {
    next = appendMissing(next, owaspFreeInstruction(lang));
  }
  if (isZoneCutoverPrompt(prompt) && !statesRegistrarPaste(next)) {
    next = appendMissing(next, registrarPasteInstruction(lang));
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

/** Instructions aimed at the model, not dashboard steps a learner should follow. */
function isModelFacingStep(step: string): boolean {
  const folded = foldGenerated(step);
  return /name the plan before|noi ro plan truoc|do not tell the learner|dungneg bao nguoi hoc|say the next step once|noi buoc tiep theo mot lan|use only those steps|use only these steps|chi dung cac buoc/.test(
    folded,
  );
}

export function curatedStepsFallback(prompt: string, lang: Lang): string {
  const notes = curatedOnboardingContext(prompt, lang);
  if (!notes) return '';
  const body = notes.split('\n\n').slice(1).join('\n\n').trim();
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      const content = line.replace(/^\s*-\s*/, '').trim();
      return content.length > 0 && !isModelFacingStep(content);
    });
  if (!lines.length) return '';
  const intro =
    lang === 'en'
      ? 'Follow these Cloudflare dashboard steps:'
      : 'Làm theo các bước sau trên dashboard Cloudflare:';
  return `${intro}\n${lines.join('\n')}`;
}

export function guardGenerateText(text: string, lang: Lang, prompt = ''): string {
  let guarded = rewritePlanGatedActions(rewriteInventedNameservers(text, lang), lang, prompt);
  if (isBareRefusal(guarded)) {
    const fallback = curatedStepsFallback(prompt, lang);
    if (fallback) guarded = fallback;
  }
  guarded = correctBackwardsNameservers(guarded, lang, prompt);
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

const CLAIM_CHECK_TIMEOUT_MS = 8000;

function modelText(result: unknown): string {
  if (typeof result === 'string') return result;
  if (!result || typeof result !== 'object') return '';
  const value = result as {
    response?: unknown;
    choices?: Array<{ message?: { content?: unknown }; text?: unknown }>;
  };
  if (typeof value.response === 'string') return value.response;
  const content = value.choices?.[0]?.message?.content ?? value.choices?.[0]?.text;
  return typeof content === 'string' ? content : '';
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('claim-check-timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function reviewText(
  text: string,
  lang: Lang,
  run: (model: string, input: unknown) => Promise<unknown>,
): Promise<string> {
  return reviewPlanClaims(text, lang, async (sentences) => {
    const reviewed = await withTimeout(
      run(MODEL, { max_tokens: 256, messages: claimCheckMessages(sentences, lang) }),
      CLAIM_CHECK_TIMEOUT_MS,
    );
    return parseClaimVerdicts(modelText(reviewed), sentences.length);
  });
}

/** Second pass. A timeout, throw, or unreadable verdict drops the claim sentence. */
export async function reviewGenerateResult(
  result: unknown,
  lang: Lang,
  run: (model: string, input: unknown) => Promise<unknown>,
): Promise<unknown> {
  if (typeof result === 'string') return reviewText(result, lang, run);
  if (!result || typeof result !== 'object') return result;
  const next = { ...(result as Record<string, unknown>) };
  if (typeof next.response === 'string') next.response = await reviewText(next.response, lang, run);
  if (Array.isArray(next.choices)) {
    next.choices = await Promise.all(
      next.choices.map(async (choice) => {
        if (!choice || typeof choice !== 'object') return choice;
        const item = { ...(choice as Record<string, unknown>) };
        if (typeof item.text === 'string') item.text = await reviewText(item.text, lang, run);
        if (item.message && typeof item.message === 'object') {
          const message = { ...(item.message as Record<string, unknown>) };
          if (typeof message.content === 'string') message.content = await reviewText(message.content, lang, run);
          item.message = message;
        }
        return item;
      }),
    );
  }
  return next;
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

  const guarded = guardGenerateResult(result, lang, prompt);
  const reviewed = await reviewGenerateResult(guarded, lang, (model, input) => env.AI.run(model, input));
  return json({ result: reviewed });
};
