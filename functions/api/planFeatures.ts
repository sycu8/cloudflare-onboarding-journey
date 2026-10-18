type GenerateLang = 'vi' | 'en';

/**
 * Authoritative plan-feature facts. The system prompt includes this table.
 * The second pass rewrites a sentence from these rows. It does not append.
 */
export const PLAN_FEATURE_ROWS = [
  {
    id: 'waf-actions',
    en: 'WAF custom-rule actions on Free, Pro, and Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Managed Challenge challenges the visitor. It is not a record-only action. Log is Enterprise only. Simulate is not an action. Do not invent an action name.',
    vi: 'Action của custom rule WAF trên Free, Pro và Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Managed Challenge thách thức người truy cập, không phải action chỉ ghi. Log chỉ có trên Enterprise. Simulate không phải action. Đừng bịa tên action.',
  },
  {
    id: 'sdd',
    en: 'Sensitive Data Detection, including credit-card detection, is Enterprise only. Free, Pro, and Business have no Sensitive data detection toggle.',
    vi: 'Sensitive Data Detection, kể cả phát hiện thẻ, chỉ có trên Enterprise. Free, Pro và Business không có công tắc Sensitive data detection.',
  },
  {
    id: 'bots',
    en: 'Bot Management is an Enterprise add-on. On Pro and Business, use Super Bot Fight Mode. Free uses Bot Fight Mode.',
    vi: 'Bot Management là add-on Enterprise. Trên Pro và Business, dùng Super Bot Fight Mode. Free dùng Bot Fight Mode.',
  },
  {
    id: 'rulesets',
    en: 'The Cloudflare Managed Ruleset and the OWASP Core Ruleset need Pro or above. Free keeps the Cloudflare Free Managed Ruleset and custom rules.',
    vi: 'Cloudflare Managed Ruleset và OWASP Core Ruleset cần Pro trở lên. Free giữ Cloudflare Free Managed Ruleset và custom rules.',
  },
  {
    id: 'logpush',
    en: 'Logpush is available on Free, Pro, and Business with usage-based pricing, and on Enterprise. Only the WAF custom-rule Log action is Enterprise-only.',
    vi: 'Logpush có trên Free, Pro và Business theo giá dùng bao nhiêu tính bấy nhiêu, và trên Enterprise. Chỉ action Log của custom rule WAF là Enterprise-only.',
  },
  {
    id: 'nameservers',
    en: 'Nameservers come from the zone Overview in the dashboard only. Copy the two names shown there. Never write a nameserver hostname.',
    vi: 'Nameserver chỉ lấy từ trang Overview của zone trên dashboard. Copy đúng hai tên đang hiện. Đừng viết hostname nameserver.',
  },
  {
    id: 'save',
    en: 'Save does not enable every rule. The deployment runs a subset of rules.',
    vi: 'Save không bật mọi rule. Bản deployment chỉ chạy một phần rule.',
  },
  {
    id: 'business-cmr',
    en: 'Business does not lack the Cloudflare Managed Ruleset: it is on Pro, Business, and Enterprise, it is not already on, turn it on under Security → Settings, and Free does not include it.',
    vi: 'Business không thiếu Cloudflare Managed Ruleset: ruleset có trên Pro, Business và Enterprise, chưa bật sẵn, hãy bật trong Security → Settings, và Free không có ruleset này.',
  },
] as const;

export type ClaimVerdict = 'ok' | 'wrong' | 'unsure';

export type ClaimSentence = { id: string; text: string };

export type ClaimCheckCounts = { kept: number; dropped: number; rewritten: number };

export function formatPlanFeatureTable(lang: GenerateLang): string {
  const title = lang === 'en' ? 'Plan-feature table (authoritative):' : 'Bảng plan-feature (chuẩn):';
  return [title, ...PLAN_FEATURE_ROWS.map((row) => `- ${row[lang]}`)].join('\n');
}

function foldFeature(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .normalize('NFKC')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
}

const LOG_ACTION = /\blog\b/;
const LOG_AS_VERB =
  /\blog\s+(?:the|a|an|these|those|matching|matched|request|requests|match|matches|traffic|hits|lai)\b|\b(?:should|can|may|will|must|hay|co the)\s+log\b|\bghi\s+log\b/;
const SDD = /\bsdd\b|sensitive data|card detection|credit card|payment card|the tin dung|phat hien the|du lieu nhay cam/;
const BOT = /\bbot management\b|\bbot mgmt\b|bot-management/;
const RULESET = /\bowasp\b|core ruleset|cloudflare managed ruleset|managed ruleset/;
const LOGPUSH = /\blogpush\b/;
const NAMESERVER = /\bnameservers?\b/;
const PLAN = /\b(?:free|pro|business|enterprise)\b/;
const LOWER_PLAN = /\b(?:free|pro|business)\b/;
const INVENTED = /\b(?:simulate|quarantine|monitor|tarpit|captcha|sinkhole|observe)\b/;
const SAVE_QUANTIFIER = /\b(?:all|every|moi|tat ca|subset|mot phan)\b/;

const CONCRETE_NAMESERVER =
  /(?<![a-z0-9])(?:_?ns(?:-?\d+[a-z]?|-[a-z0-9]+)?|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.ns)\.cloudflare\.(?:com|net)/;

/**
 * A nameserver-shaped host on any domain: ns1.example.net, ada.ns.cloudflare.com.
 * Cloudflare assigns <name>.ns.cloudflare.com per zone. A model cannot know that pair,
 * so every concrete host is dropped and the Overview instruction is used instead.
 */
const NS_SHAPED_HOST =
  /(?<![a-z0-9.])(?:_?ns\d*|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.ns)\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+/;

const HOSTNAME =
  /(?<![a-z0-9@])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|vn|dev)(?![a-z0-9])/g;

const DOCS_HOST = /^(?:dash|developers|www)\.cloudflare\.com$/;

/** "Log là ở mục", "nằm ở", "có tại", "ở mục Log", "vào phần Log", "thì Log", "Log có ở". */
const LOG_MENU =
  /\blog\b[\s\S]{0,40}\b(?:la\s+(?:o|nam|tai)|nam o|co tai|co o)\b|\b(?:o muc|vao phan|nam o|co tai)\b[\s\S]{0,40}\blog\b|\b(?:la|thi|is)\s+["'(]*log\b/;

const NEGATION =
  /\b(?:not|no|never|don't|dont|doesn't|doesnt|isn't|isnt|without|khong|chang)\b/;

const ENTERPRISE_ONLY_SHAPE =
  /enterprise-only|only on enterprise|only available on enterprise|chi co tren enterprise|chi co o enterprise|chi co\b[\s\S]{0,20}\benterprise|only enterprise/;

const AVAILABILITY =
  /\b(?:available|included|includes|include|ships with|comes with|supported|ho tro|co tren|co san|only on|chi co)\b/;

function hideLogpush(folded: string): string {
  return folded.replace(/\blog(?:ging)?\s+in\b/g, ' ').replace(/\blogin\b/g, ' ').replace(/logpush/g, ' ');
}

/** NS records, nameservers, or "bản ghi NS", in either language. */
function namesNameserverTopic(folded: string): boolean {
  return /\bnameservers?\b|\bname servers?\b|\bns records?\b|\bban ghi ns\b|\brecord ns\b|\bmay chu ten\b|\bns\b/.test(folded);
}

/** Any concrete nameserver hostname, whatever the sentence calls the record. Docs hosts stay. */
export function hasInventedNameserverHost(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (CONCRETE_NAMESERVER.test(folded) || NS_SHAPED_HOST.test(folded)) return true;
  if (!namesNameserverTopic(folded)) return false;
  HOSTNAME.lastIndex = 0;
  for (const match of folded.matchAll(HOSTNAME)) {
    if (DOCS_HOST.test(match[0])) continue;
    return true;
  }
  return false;
}

/**
 * A nameserver copy/paste step with no concrete hostname.
 * A menu path (→, ->, or a dashboard URL) is not a reason to skip the sentence.
 */
export function isProceduralStep(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (hasInventedNameserverHost(sentence)) return false;
  return NAMESERVER.test(folded) && /overview|registrar|paste|\bdan\b|copy|chep/.test(folded);
}

/** "Managed Challenge only records" is a plan claim. The action challenges; it does not only record. */
export function isManagedChallengeRecordOnly(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (!/managed challenge/.test(folded)) return false;
  if (/not a record-only|not record-only|khong phai action chi ghi|khong chi ghi/.test(folded)) return false;
  return /record-only|records only|only records|just records|only logs|merely records|log-only|log only|chi ghi|chi de ghi|de ghi|ghi nhan|ghi lai|la de ghi|does not challenge|without challenging|khong challenge|records (?:the |a )?(?:match|matches|request|requests|hit|hits)\b/.test(
    folded,
  );
}

/** "Turn it on" / "bật nó" when the prompt or an earlier sentence is about SDD. */
export function isSddPronounFollowUp(sentence: string, context: string): boolean {
  const folded = foldFeature(sentence);
  if (SDD.test(folded)) return false;
  if (!SDD.test(foldFeature(context))) return false;
  return /\b(?:enable|turn|switch)\s+it\b|\bturn it on\b|\bit is included\b|\bit comes with\b|\bbat no\b|\bkich hoat no\b/.test(
    folded,
  );
}

function isSaveClaim(folded: string): boolean {
  return /\bsav(?:e|ing)\b/.test(folded) && SAVE_QUANTIFIER.test(folded) && /\brules?\b/.test(folded);
}

/** "tất cả rule đều chạy" / "all rules run" contradicts the Save row, even without the word Save. */
function claimsAllRulesRun(folded: string): boolean {
  if (!/tat ca (?:cac )?rules? deu chay|all rules run|every rule runs|moi rule deu chay|runs every rule|chay het rule|tat ca rules? chay/.test(folded)) {
    return false;
  }
  return !NEGATION.test(folded);
}

function mentionsManagedRuleset(folded: string): boolean {
  return /cloudflare managed ruleset|managed ruleset/.test(folded);
}

/** The Business plan includes the Cloudflare Managed Ruleset. It does not lack it. */
function businessHasManagedRuleset(folded: string): boolean {
  if (!mentionsManagedRuleset(folded) || !/\bbusiness\b/.test(folded)) return false;
  return /does not lack|do not lack|khong thieu|not missing/.test(folded);
}

/** Says Business is missing the Cloudflare Managed Ruleset. */
export function deniesBusinessManagedRuleset(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (!mentionsManagedRuleset(folded) || !/\bbusiness\b/.test(folded)) return false;
  if (businessHasManagedRuleset(folded)) return false;
  return /does not include|doesn't include|do not include|not included|not available|lacks\b|lack\b|missing|without|khong co|khong bao gom|thieu|khong ho tro|khong dung/.test(
    folded,
  );
}

export function businessManagedRulesetLine(lang: GenerateLang): string {
  return PLAN_FEATURE_ROWS.find((row) => row.id === 'business-cmr')?.[lang] ?? '';
}

/**
 * The learner's own plan: a profile line or a first-person statement.
 * The first match wins. A plan named later, in passing, does not replace it.
 */
function ownPlan(text: string): 'enterprise' | 'business' | 'pro' | 'free' | 'unknown' {
  const folded = foldFeature(text);
  const match =
    /\b(?:i am on|im on|i'm on|i use|i'm using|my plan is|toi dung|toi dang|minh dung|em dung|dang dung goi|dung goi|goi cua toi(?: la)?|plan cua toi(?: la)?)\s+(?:the\s+|goi\s+|la\s+)?(enterprise|business|pro|free)\b/.exec(
      folded,
    );
  const plan = match?.[1];
  if (plan === 'enterprise' || plan === 'business' || plan === 'pro' || plan === 'free') return plan;
  return 'unknown';
}

/** Log named as the action, including "Log là ở mục" and "vào phần Log". */
function logPlanClaim(folded: string): boolean {
  const hidden = hideLogpush(folded);
  if (!LOG_ACTION.test(hidden)) return false;
  if (LOG_AS_VERB.test(hidden) || LOG_MENU.test(hidden)) return true;
  if (PLAN.test(folded) || AVAILABILITY.test(folded)) return true;
  return /\b(?:action|hanh dong|mode|menu|option|muc|chon|select|pick|use|bat)\b/.test(hidden);
}

function featureAvailabilityClaim(folded: string): boolean {
  const feature =
    SDD.test(folded) ||
    BOT.test(folded) ||
    RULESET.test(folded) ||
    LOGPUSH.test(folded) ||
    LOG_ACTION.test(hideLogpush(folded)) ||
    /super bot fight mode|bot fight mode/.test(folded);
  return feature && PLAN.test(folded) && AVAILABILITY.test(folded);
}

/**
 * A sentence the claim check must classify.
 * Every plan mention and every Log mention is a claim, including plan-only sentences
 * and Log with no action word. A hostname-free nameserver paste step is not a claim.
 */
export function mentionsPlanOrFeature(sentence: string, context = ''): boolean {
  if (hasInventedNameserverHost(sentence)) return true;
  if (isProceduralStep(sentence)) return false;
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  if (PLAN.test(folded) || LOG_ACTION.test(hidden)) return true;
  if (claimsAllRulesRun(folded)) return true;
  if (isManagedChallengeRecordOnly(sentence)) return true;
  if (isSddPronounFollowUp(sentence, context)) return true;
  if (isSaveClaim(folded)) return true;
  if (NAMESERVER.test(folded) || (namesNameserverTopic(folded) && hasInventedNameserverHost(sentence))) return true;
  if (INVENTED.test(folded) && /\b(?:action|hanh dong|mode)\b/.test(folded)) return true;
  if (logPlanClaim(folded)) return true;
  if (featureAvailabilityClaim(folded)) return true;
  if (SDD.test(folded) && (PLAN.test(folded) || /\b(?:enable|turn|bat|already|included)\b/.test(folded))) return true;
  if (BOT.test(folded) && (PLAN.test(folded) || /\b(?:enable|turn|bat|included|available)\b/.test(folded))) return true;
  if (/super bot fight mode|bot fight mode/.test(folded) && (PLAN.test(folded) || NEGATION.test(folded) || ENTERPRISE_ONLY_SHAPE.test(folded))) {
    return true;
  }
  if (LOGPUSH.test(folded) && (PLAN.test(folded) || AVAILABILITY.test(folded) || /\benterprise\b/.test(folded))) return true;
  if (RULESET.test(folded)) {
    if (/\b(?:available|included|includes|only on|not on|needs pro|pro or above|pro tro len|khong co|lacks|lack|upgrade|nang cap)\b/.test(folded)) {
      return true;
    }
    if (/\bfree\b/.test(folded) && /\b(?:enable|turn on|bat|deploy|include|available|co)\b/.test(folded)) return true;
  }
  return false;
}

/** The sentence already states a table fact. */
export function tableConfirms(sentence: string): boolean {
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  if (/\bnot an action\b|\bkhong phai action\b/.test(folded) && /simulate/.test(folded)) return true;
  if (
    LOG_ACTION.test(hidden) &&
    /instead of|thay cho/.test(folded) &&
    /managed challenge/.test(folded) &&
    !/only records|record-only|chi ghi/.test(folded)
  ) {
    return true;
  }
  if (
    LOG_ACTION.test(hidden) &&
    /enterprise/.test(folded) &&
    /only|chi co|enterprise-only|instead of|thay cho|khong co tren/.test(folded) &&
    !/\b(?:use|chon|select|pick|bat|dat)\s+log\b/.test(hidden)
  ) {
    return true;
  }
  if (LOGPUSH.test(folded) && /available|co tren|usage-based|dung bao nhieu|included/.test(folded) && LOWER_PLAN.test(folded)) {
    if (!/does not|khong co|lacks|enterprise-only|chi co tren enterprise|only enterprise|only on enterprise/.test(folded)) return true;
  }
  if (
    LOGPUSH.test(folded) &&
    /available|co tren|included/.test(folded) &&
    /\benterprise\b/.test(folded) &&
    !/only|chi\b|enterprise-only/.test(folded)
  ) {
    return true;
  }
  if (
    LOG_ACTION.test(hidden) &&
    LOWER_PLAN.test(folded) &&
    /not available|does not support|does not include|isn't available|isnt available|khong co|khong ho tro/.test(folded)
  ) {
    return true;
  }
  if (
    LOG_ACTION.test(hidden) &&
    /\benterprise\b/.test(folded) &&
    /available|included|co tren/.test(folded) &&
    !LOWER_PLAN.test(folded) &&
    !/not available|does not|khong/.test(folded)
  ) {
    return true;
  }
  if (SDD.test(folded) && /enterprise/.test(folded) && !LOWER_PLAN.test(folded)) return true;
  if (
    SDD.test(folded) &&
    LOWER_PLAN.test(folded) &&
    /not included|not available|does not|isn't included|isnt included|khong co|khong ho tro|no toggle|khong bao gom/.test(folded)
  ) {
    return true;
  }
  if (BOT.test(folded) && /enterprise/.test(folded) && /add-on|addon/.test(folded) && !LOWER_PLAN.test(folded)) return true;
  if (businessHasManagedRuleset(folded)) return true;
  if (
    RULESET.test(folded) &&
    AVAILABILITY.test(folded) &&
    /\b(?:pro|business|enterprise)\b/.test(folded) &&
    !/\bfree\b/.test(folded) &&
    !/does not|khong|lacks\b|lack\b|not available|not included/.test(folded)
  ) {
    return true;
  }
  if (BOT.test(folded) && /\benterprise\b/.test(folded) && !LOWER_PLAN.test(folded) && !/not available|does not|khong/.test(folded)) {
    return true;
  }
  if (
    /super bot fight mode/.test(folded) &&
    /\b(?:pro|business)\b/.test(folded) &&
    /\b(?:included|include|available|use|dung)\b/.test(folded) &&
    !/\bfree\b/.test(folded) &&
    !NEGATION.test(folded) &&
    !ENTERPRISE_ONLY_SHAPE.test(folded)
  ) {
    return true;
  }
  if (/managed challenge/.test(folded) && /not a record-only|not record-only|khong phai action chi ghi/.test(folded)) return true;
  if (RULESET.test(folded) && /pro or above|pro tro len|needs pro|can pro|not on the free|khong co tren/.test(folded)) {
    return true;
  }
  if (
    isSaveClaim(folded) &&
    /\b(?:not|no|never|don't|dont|doesn't|doesnt|isn't|isnt|khong)\b|subset|mot phan/.test(folded) &&
    !/enables all|bat tat ca|bat moi/.test(folded)
  ) {
    return true;
  }
  if (NAMESERVER.test(folded) && /overview/.test(folded) && /copy|chep/.test(folded) && !hasInventedNameserverHost(sentence)) {
    return true;
  }
  return false;
}

/** Log named as an action in a Managed Challenge step. The action challenges; it is not Log. */
function logUnderManagedChallenge(sentence: string): boolean {
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  if (!/managed challenge/.test(folded) || !LOG_ACTION.test(hidden)) return false;
  return !/instead of|thay cho|not a record-only|khong phai action chi ghi|enterprise only|enterprise-only|chi co tren enterprise|have no log|khong co log|\bno log\b/.test(
    folded,
  );
}

/**
 * Log paired with a non-Enterprise plan, or with no plan when the learner is not on Enterprise.
 * The table must confirm it. Otherwise it is a contradiction, including when the verdict is ok.
 */
function logGrantUnconfirmed(sentence: string, context: string): boolean {
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  if (!LOG_ACTION.test(hidden) || tableConfirms(sentence)) return false;
  if (NEGATION.test(folded) || /instead of|thay cho/.test(folded)) return false;
  // A passing mention of Enterprise does not make the learner an Enterprise user.
  if (ownPlan(context) === 'enterprise' && !LOWER_PLAN.test(folded)) return false;
  return LOWER_PLAN.test(folded) || ownPlan(context) !== 'enterprise';
}

/** The sentence conflicts with the table. This wins over an ok verdict. */
export function tableContradicts(sentence: string, context = ''): boolean {
  if (tableConfirms(sentence)) return false;
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  if (hasInventedNameserverHost(sentence)) return true;
  if (deniesBusinessManagedRuleset(sentence)) return true;
  if (isManagedChallengeRecordOnly(sentence)) return true;
  if (isSddPronounFollowUp(sentence, context) && (LOWER_PLAN.test(folded) || /\b(?:enable|turn|bat|kich hoat)\b/.test(folded))) {
    return true;
  }
  if (LOGPUSH.test(folded) && /enterprise/.test(folded) && !(/available|usage-based|dung bao nhieu/.test(folded) && LOWER_PLAN.test(folded))) {
    return true;
  }
  if (LOGPUSH.test(folded) && LOWER_PLAN.test(folded) && /does not|khong co|lacks|khong bao gom/.test(folded)) return true;
  if (SDD.test(folded) && LOWER_PLAN.test(folded) && !/not|khong|no toggle|khong co/.test(folded)) return true;
  if (BOT.test(folded) && LOWER_PLAN.test(folded) && !/not|khong|instead|super bot/.test(folded)) return true;
  if (
    isSaveClaim(folded) &&
    /\b(?:all|every|moi|tat ca)\b/.test(folded) &&
    !/\b(?:not|no|never|don't|dont|doesn't|doesnt|isn't|isnt|khong)\b|subset|mot phan/.test(folded)
  ) {
    return true;
  }
  if (claimsAllRulesRun(folded)) return true;
  if (logUnderManagedChallenge(sentence)) return true;
  if (logGrantUnconfirmed(sentence, context)) return true;
  const enterpriseUse = ownPlan(context) === 'enterprise' && !LOWER_PLAN.test(folded);
  if (
    LOG_ACTION.test(hidden) &&
    !enterpriseUse &&
    (LOWER_PLAN.test(folded) ||
      LOG_AS_VERB.test(hidden) ||
      LOG_MENU.test(hidden) ||
      /\b(?:use|using|chon|select|pick|choose|bat|dat)\s+["'(]*log\b/.test(hidden)) &&
    !/instead of|thay cho|not available|does not|khong co|khong ho tro|enterprise-only|only available on enterprise|chi co tren enterprise/.test(
      folded,
    )
  ) {
    return true;
  }
  if (INVENTED.test(folded) && /\b(?:action|hanh dong|mode)\b/.test(folded) && !/not an action|khong phai action/.test(folded)) {
    return true;
  }
  if (
    RULESET.test(folded) &&
    /\bfree\b/.test(folded) &&
    /\b(?:enable|turn on|bat|deploy|include|available|co)\b/.test(folded) &&
    !/\b(?:not|no|never|don't|dont|doesn't|doesnt|khong|without)\b/.test(folded)
  ) {
    return true;
  }
  if (featureAvailabilityClaim(folded) && !tableConfirms(sentence)) return true;
  return false;
}

/** Replace a wrong sentence with the table rows it touches. Unknown claims return ''. */
export function rewriteFromTable(sentence: string, lang: GenerateLang, context = ''): string {
  const folded = foldFeature(sentence);
  const hidden = hideLogpush(folded);
  const ids: Array<(typeof PLAN_FEATURE_ROWS)[number]['id']> = [];
  if (
    LOG_ACTION.test(hidden) ||
    isManagedChallengeRecordOnly(sentence) ||
    (INVENTED.test(folded) && /\b(?:action|hanh dong|mode)\b/.test(folded))
  ) {
    ids.push('waf-actions');
  }
  if (SDD.test(folded) || isSddPronounFollowUp(sentence, context)) ids.push('sdd');
  if (BOT.test(folded) || /super bot fight mode|bot fight mode/.test(folded)) ids.push('bots');
  if (deniesBusinessManagedRuleset(sentence)) ids.push('business-cmr');
  else if (RULESET.test(folded)) ids.push('rulesets');
  if (LOGPUSH.test(folded)) ids.push('logpush');
  if (NAMESERVER.test(folded) || hasInventedNameserverHost(sentence)) ids.push('nameservers');
  if (isSaveClaim(folded) || claimsAllRulesRun(folded)) ids.push('save');
  if (!ids.length && PLAN.test(folded)) return '';
  const lines = ids.map((id) => PLAN_FEATURE_ROWS.find((row) => row.id === id)?.[lang] ?? '').filter(Boolean);
  return lines.join(' ');
}

const VERDICT_WORD: Record<string, ClaimVerdict> = {
  ok: 'ok',
  okay: 'ok',
  correct: 'ok',
  true: 'ok',
  yes: 'ok',
  wrong: 'wrong',
  false: 'wrong',
  bad: 'wrong',
  incorrect: 'wrong',
  unsure: 'unsure',
  unknown: 'unsure',
  uncertain: 'unsure',
};

function asVerdict(value: unknown): ClaimVerdict | null {
  if (typeof value !== 'string') return null;
  return VERDICT_WORD[value.trim().toLowerCase()] ?? null;
}

function absorbVerdict(found: Map<string, ClaimVerdict>, ids: Set<string>, id: unknown, verdict: unknown) {
  if (typeof id !== 'string' && typeof id !== 'number') return;
  const key = String(id).trim().toLowerCase();
  const normalized = /^s\d+$/.test(key) ? key : `s${key}`;
  if (!ids.has(normalized) && !ids.has(key)) return;
  const parsed = asVerdict(verdict);
  if (!parsed) return;
  found.set(ids.has(normalized) ? normalized : key, parsed);
}

function absorbJson(value: unknown, found: Map<string, ClaimVerdict>, ids: Set<string>) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!item || typeof item !== 'object') continue;
      const record = item as Record<string, unknown>;
      absorbVerdict(found, ids, record.id ?? record.sentenceId ?? record.i ?? record.n, record.v ?? record.verdict ?? record.label ?? record.result);
    }
    return;
  }
  const record = value as Record<string, unknown>;
  if (record.verdicts && typeof record.verdicts === 'object') absorbJson(record.verdicts, found, ids);
  if (record.claims && typeof record.claims === 'object') absorbJson(record.claims, found, ids);
  for (const [key, item] of Object.entries(record)) {
    if (!/^s?\d+$/.test(key)) continue;
    absorbVerdict(found, ids, key, item);
  }
}

/** A Workers AI error body, including HTTP 502, is not a verdict. */
export function isAiErrorText(raw: string): boolean {
  const text = raw.trim();
  if (!text) return false;
  if (/"success"\s*:\s*false/i.test(text)) return true;
  if (/\b5028\b/.test(text)) return true;
  return /\b502\b/.test(text) && /error|failed|workers ai|bad gateway|unavailable/i.test(text);
}

/** Read id-keyed verdicts out of messy model text. A missing id stays missing. A 502 body stays empty. */
export function parseClaimVerdicts(raw: string, claims: ClaimSentence[]): Map<string, ClaimVerdict> {
  const found = new Map<string, ClaimVerdict>();
  if (isAiErrorText(raw)) return found;
  const ids = new Set(claims.map((claim) => claim.id));
  const text = raw.replace(/```(?:json)?/gi, '');
  const objStart = text.indexOf('{');
  const objEnd = text.lastIndexOf('}');
  if (objStart >= 0 && objEnd > objStart) {
    try {
      absorbJson(JSON.parse(text.slice(objStart, objEnd + 1)), found, ids);
    } catch {
      /* try the line scan */
    }
  }
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');
  if (arrStart >= 0 && arrEnd > arrStart) {
    try {
      absorbJson(JSON.parse(text.slice(arrStart, arrEnd + 1)), found, ids);
    } catch {
      /* line scan still runs */
    }
  }
  for (const line of text.split(/\n/)) {
    const match = line.match(
      /\b(s\d+)\b\s*[:=,\-–]?\s*["']?(ok|okay|correct|true|yes|wrong|false|bad|incorrect|unsure|unknown|uncertain)\b/i,
    );
    if (!match || !ids.has(match[1].toLowerCase())) continue;
    const verdict = asVerdict(match[2]);
    if (verdict) found.set(match[1].toLowerCase(), verdict);
  }
  return found;
}

function splitSentences(line: string): string[] {
  return line.split(/(?<=[.!?])\s+/).filter((part) => part.length > 0);
}

export function isHeadingLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return /^(#{1,6}\s+\S.*|[*_]{2}[^*_\n]+[*_]{2}\s*:?)$/.test(trimmed) || /^[A-Za-z0-9][^.]{0,48}:\s*$/.test(trimmed);
}

export function isHeadingOnly(text: string): boolean {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length === 0 || lines.every(isHeadingLine);
}

/** Drop a heading whose following body was removed, and collapse duplicate lines. */
export function dropEmptyHeadings(text: string): string {
  const lines = text.split('\n').map((line) => line.replace(/[ \t]{2,}/g, ' ').replace(/\s+$/g, ''));
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (isHeadingLine(line)) {
      const next = lines.slice(i + 1).find((item) => item.trim());
      if (!next || isHeadingLine(next)) continue;
    }
    if (kept[kept.length - 1] === line) continue;
    kept.push(line);
  }
  return kept.join('\n').trim();
}

export function claimSentences(text: string, prompt = ''): ClaimSentence[] {
  const found: ClaimSentence[] = [];
  const prior: string[] = [];
  for (const line of text.split('\n')) {
    for (const sentence of splitSentences(line)) {
      const context = `${prompt}\n${prior.join(' ')}`;
      if (mentionsPlanOrFeature(sentence, context)) found.push({ id: `s${found.length}`, text: sentence });
      prior.push(sentence);
    }
  }
  return found;
}

export function claimCheckMessages(claims: ClaimSentence[], lang: GenerateLang) {
  const ask =
    lang === 'en'
      ? 'Classify each sentence id against the plan-feature table. Reply with JSON only: {"verdicts":[{"id":"s0","v":"ok"}]}. Use the sentence id, not the array position. ok means the sentence matches the table. wrong means it contradicts the table. unsure means you cannot tell. CLAIM_VERDICTS'
      : 'Phân loại từng id câu theo bảng plan-feature. Chỉ trả JSON: {"verdicts":[{"id":"s0","v":"ok"}]}. Dùng id của câu, không dùng vị trí trong mảng. ok là câu đúng với bảng. wrong là câu trái bảng. unsure là không chắc. CLAIM_VERDICTS';
  return [
    { role: 'system', content: `${ask}\n\n${formatPlanFeatureTable(lang)}` },
    { role: 'user', content: claims.map((claim) => `${claim.id}. ${claim.text}`).join('\n') },
  ];
}

const CLAIM_CHECK_TIMEOUT_MS = 3500;
const CLAIM_CHECK_BUDGET_MS = 8000;
const RETRY_MIN_REMAINING_MS = 400;

/** One jittered backoff, 100–400ms, before the single claim-check retry. */
export function retryBackoffMs(): number {
  return 100 + Math.floor(Math.random() * 301);
}

export function waitMs(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function chunkClaims<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

/**
 * Classify claims in parallel batches, keyed by sentence id.
 * A timeout, 502, or parse miss leaves that id null and does not move the others.
 * Missing ids are retried once, after a jittered backoff, while the budget remains.
 */
export async function gatherVerdicts(
  claims: ClaimSentence[],
  ask: (group: ClaimSentence[]) => Promise<string>,
  options?: { chunkSize?: number; timeoutMs?: number; budgetMs?: number; backoffMs?: number },
): Promise<Map<string, ClaimVerdict | null>> {
  const chunkSize = options?.chunkSize ?? 4;
  const timeoutMs = options?.timeoutMs ?? CLAIM_CHECK_TIMEOUT_MS;
  const budgetMs = options?.budgetMs ?? CLAIM_CHECK_BUDGET_MS;
  const started = Date.now();
  const remaining = () => budgetMs - (Date.now() - started);
  const map = new Map<string, ClaimVerdict | null>();
  const fill = async (group: ClaimSentence[]) => {
    const chunks = chunkClaims(group, chunkSize);
    await Promise.all(
      chunks.map(async (chunk) => {
        const slice = Math.min(timeoutMs, remaining());
        if (slice < 50) {
          for (const claim of chunk) if (!map.has(claim.id)) map.set(claim.id, null);
          return;
        }
        try {
          const raw = await withTimeout(ask(chunk), slice);
          if (isAiErrorText(raw)) {
            for (const claim of chunk) if (!map.has(claim.id)) map.set(claim.id, null);
            return;
          }
          const parsed = parseClaimVerdicts(raw, chunk);
          for (const claim of chunk) map.set(claim.id, parsed.get(claim.id) ?? map.get(claim.id) ?? null);
        } catch {
          for (const claim of chunk) if (!map.has(claim.id)) map.set(claim.id, null);
        }
      }),
    );
  };
  await fill(claims);
  const missing = claims.filter((claim) => map.get(claim.id) == null);
  if (!missing.length || remaining() <= RETRY_MIN_REMAINING_MS) return map;
  const backoff = options?.backoffMs ?? retryBackoffMs();
  await waitMs(Math.min(backoff, Math.max(0, remaining() - RETRY_MIN_REMAINING_MS)));
  if (remaining() <= 50) return map;
  await fill(missing);
  return map;
}

type SentenceAction = 'kept' | 'dropped' | 'rewritten';

function resolveSentence(
  sentence: string,
  verdict: ClaimVerdict | null | undefined,
  lang: GenerateLang,
  context: string,
): { text: string; action: SentenceAction } {
  // The table wins over the model. A contradiction is rewritten even when the verdict is ok.
  // An "available on plan X" claim that the table does not confirm is rewritten too.
  // Null or unsure keeps a sentence only when the table confirms it.
  // Term-free sentences are not claims, so they never reach this function.
  if (tableContradicts(sentence, context) || (featureAvailabilityClaim(foldFeature(sentence)) && !tableConfirms(sentence))) {
    const forced = rewriteFromTable(sentence, lang, context);
    if (!forced) return { text: '', action: 'dropped' };
    if (foldFeature(forced) === foldFeature(sentence)) return { text: sentence, action: 'kept' };
    return { text: forced, action: 'rewritten' };
  }
  if (verdict === 'ok' || tableConfirms(sentence)) return { text: sentence, action: 'kept' };
  const replacement = rewriteFromTable(sentence, lang, context);
  if (!replacement) return { text: '', action: 'dropped' };
  if (foldFeature(replacement) === foldFeature(sentence)) return { text: sentence, action: 'kept' };
  return { text: replacement, action: 'rewritten' };
}

/**
 * Apply one verdict per sentence id. A null or unsure verdict keeps a sentence
 * only when the table confirms it. Every other claim is rewritten or dropped.
 * Term-free sentences are left as they are.
 */
export function applyClaimVerdicts(
  text: string,
  lang: GenerateLang,
  verdicts: Map<string, ClaimVerdict | null>,
  prompt = '',
): { text: string; counts: ClaimCheckCounts } {
  const counts: ClaimCheckCounts = { kept: 0, dropped: 0, rewritten: 0 };
  const prior: string[] = [];
  let claimIndex = 0;
  const seen = new Set<string>();
  const next = text
    .split('\n')
    .map((line) =>
      splitSentences(line)
        .map((sentence) => {
          const context = `${prompt}\n${prior.join(' ')}`;
          prior.push(sentence);
          if (!mentionsPlanOrFeature(sentence, context)) return sentence;
          const id = `s${claimIndex}`;
          claimIndex += 1;
          const verdict = verdicts.has(id) ? verdicts.get(id) : null;
          const resolved = resolveSentence(sentence, verdict ?? null, lang, context);
          const folded = foldFeature(resolved.text);
          if (resolved.action === 'rewritten' && folded && seen.has(folded)) {
            counts.rewritten += 1;
            return '';
          }
          if (folded) seen.add(folded);
          counts[resolved.action] += 1;
          return resolved.text;
        })
        .filter(Boolean)
        .join(' '),
    )
    .join('\n');
  return { text: dropEmptyHeadings(next), counts };
}

export function shortDocsFallback(prompt: string, lang: GenerateLang): string {
  const folded = foldFeature(prompt);
  let url = 'https://developers.cloudflare.com';
  if (/logpush/.test(folded)) url = 'https://developers.cloudflare.com/logs/logpush/';
  else if (SDD.test(folded)) url = 'https://developers.cloudflare.com/waf/managed-rules/reference/sensitive-data-detection/';
  else if (/nameserver|mat bao/.test(folded)) url = 'https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/';
  else if (/bot/.test(folded)) url = 'https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/';
  else if (/owasp|managed ruleset|\bwaf\b|\blog\b/.test(folded)) url = 'https://developers.cloudflare.com/waf/custom-rules/';
  return lang === 'en'
    ? `Use the Cloudflare dashboard for this step. Docs: ${url}`
    : `Dùng dashboard Cloudflare cho bước này. Tài liệu: ${url}`;
}

/** Rows that answer the prompt. Used when the model answer was dropped or never addressed Save. */
export function tableRowsForPrompt(prompt: string, lang: GenerateLang): string[] {
  const folded = foldFeature(prompt);
  const ids: Array<(typeof PLAN_FEATURE_ROWS)[number]['id']> = [];
  if (/\bsave\b|\bluu\b/.test(folded)) ids.push('save');
  if (SDD.test(folded)) ids.push('sdd');
  if (LOGPUSH.test(folded)) ids.push('logpush');
  if (BOT.test(folded) || /super bot|bot fight/.test(folded)) ids.push('bots');
  if (RULESET.test(folded)) ids.push('rulesets');
  if (NAMESERVER.test(folded) || /mat bao/.test(folded)) ids.push('nameservers');
  if (LOG_ACTION.test(hideLogpush(folded)) || /managed challenge|\bwaf\b|custom rule/.test(folded)) ids.push('waf-actions');
  return ids.map((id) => PLAN_FEATURE_ROWS.find((row) => row.id === id)?.[lang] ?? '').filter(Boolean);
}

/** A short answer built from the plan table, plus the docs link. Never empty. */
export function tableDerivedFallback(prompt: string, lang: GenerateLang): string {
  const lines = tableRowsForPrompt(prompt, lang);
  const docs = shortDocsFallback(prompt, lang);
  return lines.length ? `${lines.join(' ')} ${docs}` : docs;
}

export function statesSaveFact(text: string): boolean {
  const folded = foldFeature(text);
  return /does not enable every rule|subset of rules|khong bat moi rule|mot phan rule/.test(folded);
}

/** Save questions get the table row even when the model only said "Click Save." */
export function ensureSaveAnswer(text: string, prompt: string, lang: GenerateLang): string {
  if (!/\bsave\b|\bluu\b/.test(foldFeature(prompt))) return text;
  if (statesSaveFact(text)) return text;
  const line = PLAN_FEATURE_ROWS.find((row) => row.id === 'save')?.[lang] ?? '';
  const trimmed = text.trim();
  if (!trimmed || isHeadingOnly(trimmed)) return tableDerivedFallback(prompt, lang);
  return `${trimmed}\n${line}`;
}

/**
 * Second pass. The classifier may return a partial id map or throw.
 * Counts are logged as kept, dropped, and rewritten.
 */
export async function reviewPlanClaims(
  text: string,
  lang: GenerateLang,
  classify: (sentences: ClaimSentence[]) => Promise<Array<{ id: string; verdict: ClaimVerdict | null }> | null>,
  options?: { prompt?: string },
): Promise<string> {
  const prompt = options?.prompt ?? '';
  const claims = claimSentences(text, prompt);
  if (!claims.length) {
    console.log('claim check kept=0 dropped=0 rewritten=0');
    return finishClaimReview(dropEmptyHeadings(text), prompt, lang);
  }
  const verdicts = new Map<string, ClaimVerdict | null>();
  try {
    const listed = await classify(claims);
    if (listed) {
      for (const item of listed) verdicts.set(item.id, item.verdict);
    }
  } catch {
    /* each claim stays null */
  }
  for (const claim of claims) if (!verdicts.has(claim.id)) verdicts.set(claim.id, null);
  const applied = applyClaimVerdicts(text, lang, verdicts, prompt);
  console.log(
    `claim check kept=${applied.counts.kept} dropped=${applied.counts.dropped} rewritten=${applied.counts.rewritten}`,
  );
  return finishClaimReview(applied.text, prompt, lang);
}

/** A dropped or heading-only answer becomes a table row. Save questions always get the Save row. */
function finishClaimReview(text: string, prompt: string, lang: GenerateLang): string {
  let next = text.trim();
  if (!next || isHeadingOnly(next)) next = tableDerivedFallback(prompt, lang);
  next = ensureSaveAnswer(next, prompt, lang);
  if (!next.trim()) next = tableDerivedFallback(prompt, lang);
  return next;
}
