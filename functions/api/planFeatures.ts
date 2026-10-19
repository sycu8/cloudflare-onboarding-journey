type GenerateLang = 'vi' | 'en';

/**
 * Authoritative plan-feature facts. The system prompt includes this table.
 * The second pass rewrites a sentence from these rows. It does not append.
 */
/** Custom-rule actions. Non-Interactive Challenge and JS Challenge are one action (`js_challenge`). */
export const CUSTOM_RULE_ACTIONS = {
  en: 'WAF custom-rule actions: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge, Skip, and Log. Non-Interactive Challenge and JS Challenge are the same action (js_challenge). Log is Enterprise only.',
  vi: 'Action của custom rule WAF: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge, Skip và Log. Non-Interactive Challenge và JS Challenge là cùng một action (js_challenge). Log chỉ có trên Enterprise.',
} as const;

/** Managed-rule override actions. Skip is a custom-rule action, not an override. */
export const OVERRIDE_ACTIONS = {
  en: 'Managed-rule override actions: Block, Log, Non-Interactive Challenge, Managed Challenge, and Interactive Challenge. Skip is not an override action. Log is Enterprise only.',
  vi: 'Action khi override managed rule: Block, Log, Non-Interactive Challenge, Managed Challenge và Interactive Challenge. Skip không phải action override. Log chỉ có trên Enterprise.',
} as const;

/** Shown only for Free, Pro, or Business when the question is about Log or watching a rule. */
export const LOG_WATCH = {
  en: 'Free, Pro, and Business have no Log action. Start with Managed Challenge, review Security Events, then switch to Block. Managed Challenge challenges real visitors; it does not only record.',
  vi: 'Free, Pro và Business không có action Log. Bắt đầu bằng Managed Challenge, xem Security Events, rồi mới đổi sang Block. Managed Challenge thách thức người truy cập thật, không chỉ ghi lại.',
} as const;

export const PLAN_FEATURE_ROWS = [
  {
    id: 'waf-actions',
    en: `${CUSTOM_RULE_ACTIONS.en} ${OVERRIDE_ACTIONS.en} Managed Challenge challenges the visitor. It is not a record-only action. Skip is not a record-only action. Simulate is not an action. Do not invent an action name.`,
    vi: `${CUSTOM_RULE_ACTIONS.vi} ${OVERRIDE_ACTIONS.vi} Managed Challenge thách thức người truy cập, không phải action chỉ ghi. Skip không phải action chỉ ghi. Simulate không phải action. Đừng bịa tên action.`,
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

function sentenceParts(text: string): string[] {
  return foldFeature(text)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** The custom-rule sentence or the override sentence, including each sentence inside them. */
export function isSharedActionSentence(sentence: string): boolean {
  const folded = foldFeature(sentence).replace(/\s+/g, ' ').trim();
  const blobs = [CUSTOM_RULE_ACTIONS.en, CUSTOM_RULE_ACTIONS.vi, OVERRIDE_ACTIONS.en, OVERRIDE_ACTIONS.vi, LOG_WATCH.en, LOG_WATCH.vi];
  return blobs.some((blob) => sentenceParts(blob).includes(folded) || foldFeature(blob).replace(/\s+/g, ' ').trim() === folded);
}

/** A sentence of the WAF action row, including the shared lists and the record-only denials. */
export function isWafActionsAnswer(sentence: string): boolean {
  const folded = foldFeature(sentence).replace(/\s+/g, ' ').trim();
  if (!folded) return false;
  const row = PLAN_FEATURE_ROWS.find((item) => item.id === 'waf-actions');
  if (!row) return false;
  return [row.en, row.vi].some((blob) => {
    const whole = foldFeature(blob).replace(/\s+/g, ' ').trim();
    return whole === folded || sentenceParts(blob).includes(folded);
  });
}

/** A sentence copied from the plan table, including each sentence inside a row. */
function isPlanTableSentence(sentence: string): boolean {
  const folded = foldFeature(sentence).replace(/\s+/g, ' ').trim();
  if (!folded) return false;
  return PLAN_FEATURE_ROWS.some((row) =>
    [row.en, row.vi].some((blob) => {
      const whole = foldFeature(blob).replace(/\s+/g, ' ').trim();
      return whole === folded || sentenceParts(blob).includes(folded);
    }),
  );
}

/**
 * Denies Log, Super Bot Fight Mode, or Bot Management on a lower plan and places it on Enterprise.
 * Any wording, including passive voice.
 */
function placesDeniedFeatureOnEnterprise(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (!/\blog\b|super bot fight mode|\bbot management\b/.test(folded)) return false;
  if (!/\b(?:free|pro|business)\b/.test(folded) || !/\benterprise\b/.test(folded)) return false;
  return /\b(?:not|no|never|without|khong|isn't|isnt|doesn't|doesnt|aren't|arent|unavailable|lacks|lack|missing|excluded|reserved|limited)\b|\bonly\b[\s\S]{0,32}\benterprise\b|\benterprise\b[\s\S]{0,32}\bonly\b/.test(
    folded,
  );
}

/** A Logpush question must not be answered with the WAF action row. */
export function asksLogpush(text: string): boolean {
  const folded = foldFeature(text);
  return /\blogpush\b|request logs|http logs|logs to r2|\br2\b/.test(folded) && /\blog/.test(folded);
}

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
  /\blog\s+(?:the|a|an|these|those|matching|matched|request|requests|match|matches|traffic|hits)\b|\b(?:should|can|may|will|must)\s+log\b/;
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
  /(?<![a-z0-9@])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?![a-z0-9])/g;

const DOCS_HOST = /^(?:dash|developers|www)\.cloudflare\.com$/;

/** "Log là ở mục", "nằm ở", "có tại", "ở mục Log", "vào phần Log", "thì Log", "Log có ở". */
const LOG_MENU =
  /\blog\b[\s\S]{0,40}\b(?:la\s+(?:o|nam|tai)|nam o|co tai|co o)\b|\b(?:o muc|vao phan|nam o|co tai)\b[\s\S]{0,40}\blog\b|\b(?:la|thi|is)\s+["'(]*log\b/;

const NEGATION =
  /\b(?:not|no|never|don't|dont|doesn't|doesnt|isn't|isnt|without|khong|chang)\b/;

const ENTERPRISE_ONLY_SHAPE =
  /enterprise-only|only on enterprise|only available on enterprise|chi co tren enterprise|chi co o enterprise|chi co\b[\s\S]{0,20}\benterprise|only enterprise/;

const AVAILABILITY =
  /\b(?:available|included|includes|include|ships with|comes with|supported|ho tro|co tren|co san|only on|chi co|dung duoc|paid plans?|with paid)\b|chi\b[\s\S]{0,24}\bduoc\b/;

function hideLogpush(folded: string): string {
  return folded.replace(/\blog(?:ging)?\s+in\b/g, ' ').replace(/\blogin\b/g, ' ').replace(/logpush/g, ' ');
}

/** Logging products are not the WAF custom-rule action named Log. */
function hideLoggingProducts(folded: string): string {
  return hideLogpush(folded)
    .replace(/\blog explorer\b/g, ' ')
    .replace(/\binstant logs?\b/g, ' ')
    .replace(/\blog fields?\b/g, ' ')
    .replace(/\bnhat ky\b/g, ' ')
    .replace(/\blogs\b/g, ' ')
    .replace(/\blogging\b/g, ' ');
}

function isLoggingProduct(folded: string): boolean {
  return /\blogpush\b|\blog explorer\b|\binstant logs?\b|\blog fields?\b|\blogs\b|\bnhat ky\b|\blogging\b/.test(folded);
}

/** Vietnamese noun or verb uses of log. They are not the WAF action named Log. */
function stripViLogUses(text: string): string {
  return text
    .replace(/\bghi\s+log\b/gi, ' ')
    .replace(/\blog\s+lại\b/gi, ' ')
    .replace(/\blog\s+lai\b/gi, ' ')
    .replace(/\b(?:hãy|hay|có thể|co the|nên|nen|vui lòng|vui long)\s+log\b/gi, ' ')
    .replace(/\b(?:xem|đọc|doc|mở|mo|tải|tai|xuất|xuat|gửi|gui)\s+(?:các\s+|cac\s+|cái\s+|cai\s+)?log\b/gi, ' ')
    .replace(/\blog\s+(?:các|cac|những|nhung|này|nay|đó|do)\b/gi, ' ');
}

/** Hide Logpush, logs, log fields, Log Explorer, Instant Logs, nhật ký, and Log in. */
export function hideLoggingProductTokens(text: string): string {
  return text
    .replace(/\blog(?:ging)?\s+in\b/gi, ' ')
    .replace(/\blogin\b/gi, ' ')
    .replace(/logpush/gi, ' ')
    .replace(/\blog explorer\b/gi, ' ')
    .replace(/\binstant logs?\b/gi, ' ')
    .replace(/\blog fields?\b/gi, ' ')
    .replace(/nhật ký/gi, ' ')
    .replace(/\blogs\b/gi, ' ')
    .replace(/\blogging\b/gi, ' ');
}

/**
 * A capital-L Log that is not Logpush, Log in, logs, Log Explorer, Instant Logs, or nhật ký.
 * No action word is required. The table decides whether the sentence stays.
 */
export function hasCapitalLogGrant(sentence: string): boolean {
  return /\bLog\b/.test(stripViLogUses(hideLoggingProductTokens(sentence)));
}

/**
 * The WAF/firewall rule action Log, after logging-product tokens are hidden.
 * A sentence can mention logs and still be a Log grant. Vietnamese noun or verb
 * uses of log are not the action.
 */
export function isWafLogAction(sentence: string): boolean {
  const hidden = stripViLogUses(hideLoggingProducts(foldFeature(sentence)));
  if (!/\blog\b/.test(hidden)) return false;
  if (LOG_AS_VERB.test(hidden) || LOG_MENU.test(hidden)) return true;
  if (/\b(?:action|hanh dong|mode)\b[\s\S]{0,32}\blog\b|\blog\b[\s\S]{0,16}\b(?:action|hanh dong|mode)\b/.test(hidden)) {
    return true;
  }
  if (
    /\b(?:chon|select|pick|choose|set|dat|bat|use|using|enable|kich hoat|dung|su dung|gan|ap dung|chuyen|lua)\b[\s\S]{0,32}\blog\b/.test(
      hidden,
    )
  ) {
    return true;
  }
  if (/\bset\s+(?:it\s+|the action\s+)?to\s+log\b|\bo\s+log\b|\bat\s+log\b|\bsang\s+log\b|\bde\s+log\b/.test(hidden)) {
    return true;
  }
  return (
    /(?:^|[,/;|]|\b(?:and|or|va|hoac)\s+)\s*log\b/.test(hidden) &&
    /\b(?:block|challenge|skip|allow|rule|action|hanh dong)\b/.test(hidden)
  );
}

/** NS records, nameservers, or "bản ghi NS", in either language. */
function namesNameserverTopic(folded: string): boolean {
  return /\bnameservers?\b|\bname servers?\b|\bns records?\b|\bban ghi ns\b|\brecord ns\b|\bmay chu ten\b|\bns\b/.test(folded);
}

/**
 * Any concrete nameserver hostname, whatever the sentence calls the record. Docs hosts stay.
 * The host has to be in the sentence. DNS or registrar words may be only in the prompt.
 */
export function hasInventedNameserverHost(sentence: string, context = ''): boolean {
  const folded = foldFeature(sentence);
  if (CONCRETE_NAMESERVER.test(folded) || NS_SHAPED_HOST.test(folded)) return true;
  const scope = `${folded}\n${foldFeature(context)}`;
  if (disallowedCloudflareHost(folded, scope)) return true;
  if (!namesNameserverTopic(scope)) return false;
  HOSTNAME.lastIndex = 0;
  for (const match of folded.matchAll(HOSTNAME)) {
    if (DOCS_HOST.test(match[0])) continue;
    return true;
  }
  return false;
}

/** Any *.cloudflare.com host in the sentence when the sentence or the prompt is about DNS. */
function disallowedCloudflareHost(sentenceFolded: string, scope: string): boolean {
  if (!/\bdns\b|registrar|nameserver|name server|ban ghi|mat bao/.test(scope)) return false;
  HOSTNAME.lastIndex = 0;
  for (const match of sentenceFolded.matchAll(HOSTNAME)) {
    if (!/(?:^|\.)cloudflare\.com$/.test(match[0])) continue;
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

const MC_DENIAL =
  /not a record-only|not record-only|does not only record|doesn't only record|doesnt only record|khong phai action chi ghi|khong chi ghi|challenges the visitor|challenges real visitors|thach thuc nguoi/;

/** Managed Challenge lets traffic through, notes a request, or only records it. Any verb, any order. */
export function isManagedChallengeRecordOnly(sentence: string, context = ''): boolean {
  if (isSharedActionSentence(sentence)) return false;
  const folded = foldFeature(sentence);
  if (MC_DENIAL.test(folded)) return false;
  const named = /managed challenge/.test(folded);
  const fromContext = !named && /managed challenge/.test(foldFeature(context));
  if (!named && !fromContext) return false;
  const letsThrough = /traffic|luu luong|request|visitor|nguoi/.test(folded) && /through|qua\b|pass|let|allow|cho\b/.test(folded);
  const noting = /ghi nhan|danh dau|\bnot(?:e|es|ing)\b|\bflags?\b|\bmarks?\b/.test(folded);
  const onlyRecording =
    /record-only|only records|only record|just records|merely records|only logs|only logging|chi ghi|chi log|records only|\brecord(?:s|ing)?\b|chi\b[\s\S]{0,20}\b(?:ghi|log)\b/.test(
      folded,
    );
  if (!named) return letsThrough || noting || onlyRecording || /only logs|only records|chi ghi|khong chan/.test(folded);
  return letsThrough || noting || onlyRecording;
}

/** Skip described as count, record, log, watch, theo dõi, or ghi. Any word order. A denial stays. */
function isSkipRecordOnly(sentence: string, context = ''): boolean {
  if (isSharedActionSentence(sentence)) return false;
  const folded = foldFeature(sentence);
  if (/not a record-only|not record-only|khong phai action chi ghi|is not a record|does not record|doesn't record|does not log|does not count|does not watch|khong ghi|khong theo doi/.test(folded)) {
    return false;
  }
  if (/\b(?:not|no|never|doesn't|doesnt|does not|isn't|isnt|khong)\b[\s\S]{0,48}\b(?:record|log|count|watch|ghi|theo doi)\b/.test(folded)) {
    return false;
  }
  const named = /\bskip\b/.test(folded);
  const fromContext = !named && /\bskip\b/.test(foldFeature(context));
  if (!named && !fromContext) return false;
  return /\b(?:count|counts|counting|record|records|recording|log|logs|logging|watch|watches|watching|theo doi|ghi)\b/.test(folded);
}

/** Skip is not a managed-rule override action. */
function listsSkipAsOverride(folded: string): boolean {
  if (!/\bskip\b/.test(folded) || !/override/.test(folded)) return false;
  return !/not an override|is not an override|khong phai action override|khong phai override/.test(folded);
}

/** Non-Interactive Challenge and JS Challenge are one real action. A denial is a claim. */
function deniesJsChallenge(folded: string): boolean {
  if (!/non-interactive challenge|js challenge/.test(folded)) return false;
  return /not an action|khong phai action|not a custom-rule|khong phai action cua|is not a real|isn't a real/.test(folded);
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

/** "tất cả rule đều chạy" / "all rules are on" contradicts the Save row, even without the word Save. */
function claimsAllRulesRun(folded: string): boolean {
  const clauses = folded.split(/\s*(?:,|;|\b(?:but|however|nhung)\b)\s*/).filter(Boolean);
  return clauses.some((clause) => {
    if (NEGATION.test(clause)) return false;
    if (/rule nao cung|bat het|chay het/.test(clause)) return true;
    if (/luu xong|sau khi luu/.test(clause) && /\b(?:bat|chay|rules?|moi|tat ca)\b/.test(clause)) return true;
    const all = /\b(?:all|every|moi|tat ca)\b/.test(clause);
    const rules = /\brules?\b/.test(clause);
    if (!all || !rules) return false;
    return /\b(?:enabled|enable|enables|active|activates|run|runs|running|chay|bat|hoat dong)\b|\b(?:are|is|gets|get|becomes|become|stay|stays|turned)\s+on\b|\bturns?\b[\s\S]{0,32}\bon\b/.test(
      clause,
    );
  });
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

type LearnerPlan = 'enterprise' | 'business' | 'pro' | 'free' | 'unknown';

function asLearnerPlan(value: string | undefined): LearnerPlan {
  if (value === 'enterprise' || value === 'business' || value === 'pro' || value === 'free') return value;
  return 'unknown';
}

/** Keep đừng distinct from dùng so a warning is not read as the learner's plan. */
function foldPlanText(text: string): string {
  const marked = text
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/đừng/gi, ' dungneg ');
  return marked.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd');
}

/**
 * The learner's plan, in order:
 * 1. profile or onboarding-selected plan (`plan: Enterprise`)
 * 2. a first-person statement
 * 3. a declarative on/with/gói sentence about their own account or zone
 * A plan named only inside a question about another plan does not count.
 */
function planClauses(text: string): string[] {
  return foldPlanText(text)
    .split(/[,;]|(?<=[.!?\n])/)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

const PLAN_WORD = /\b(enterprise|business|pro|free)\b/;
/** Stop the gap before a second choice, a list comma, or a question word. */
const PLAN_GAP_STOP = /\b(?:or|hay|vs|where|what|which|how|whose|does|do|did|can|could|is|are|co|khong|nao)\b|[,;]/;
/** A plan after these words is not the learner's plan. */
const PLAN_NOT_OWNED = /\b(?:not|n't|isnt|isn't|arent|aren't|khong phai|or|hay|vs|switch to|upgrade to|consider(?:ing)?|can nhac|hoi ve|chuyen sang)\b/;

/** A cue that already names the relationship. A short gap may sit before the plan. */
const STRONG_CUE =
  /\b(?:i am on|i'm on|im on|i'm using|im using|i am using|we are on|we're on|we are running|we're running|my plan is|our plan is|we run|dang dung goi|dang dung)\b/g;

/**
 * Bare cues own a plan only when it follows directly, or through on / using / dùng / ở gói / là / "an X customer".
 * Any other word in between means the plan is not owned.
 */
const BARE_CUE = /\b(?:we are|we're|chung toi|chung ta|toi dang|minh dang|em dang)\b/g;

const PLAN_NAME = 'enterprise|business|pro|free';

/**
 * "I use X" names a plan when X is the plan itself, "the X plan", or "gói X".
 * "I use Log" is a verb object, not a plan.
 */
function directUsePlan(clause: string): LearnerPlan {
  const match =
    new RegExp(
      `\\b(?:i use|i'm using|im using|i am using|toi dung|minh dung|em dung)\\s+(?:the\\s+(${PLAN_NAME})\\s+plan|goi\\s+(${PLAN_NAME})|(${PLAN_NAME})\\s+plan|(${PLAN_NAME})\\b)`,
    ).exec(clause);
  return asLearnerPlan(match?.[1] || match?.[2] || match?.[3] || match?.[4]);
}

function firstPlanInGap(gap: string): LearnerPlan {
  const plan = PLAN_WORD.exec(gap);
  if (!plan || plan.index === undefined) return 'unknown';
  const before = gap.slice(0, plan.index);
  if (PLAN_NOT_OWNED.test(before)) return 'unknown';
  return asLearnerPlan(plan[1]);
}

function strongCuePlan(clause: string): LearnerPlan {
  STRONG_CUE.lastIndex = 0;
  for (const cue of clause.matchAll(STRONG_CUE)) {
    const start = (cue.index ?? 0) + cue[0].length;
    const rest = clause.slice(start);
    const stop = PLAN_GAP_STOP.exec(rest);
    const gap = (stop ? rest.slice(0, stop.index) : rest).slice(0, 32);
    const plan = firstPlanInGap(gap);
    if (plan !== 'unknown') return plan;
  }
  return 'unknown';
}

function bareCuePlan(clause: string): LearnerPlan {
  BARE_CUE.lastIndex = 0;
  const directPlan = new RegExp(`^(?:the\\s+|goi\\s+)?(${PLAN_NAME})\\b`);
  const viaPlan = new RegExp(
    `^(?:on|using|dung|o goi|la)\\s+(?:the\\s+|goi\\s+|an\\s+)?(${PLAN_NAME})\\b|^an\\s+(${PLAN_NAME})\\s+(?:customer|account)\\b`,
  );
  for (const cue of clause.matchAll(BARE_CUE)) {
    const rest = clause.slice((cue.index ?? 0) + cue[0].length).trim();
    const direct = directPlan.exec(rest);
    if (direct) return asLearnerPlan(direct[1]);
    const via = viaPlan.exec(rest);
    if (via) return asLearnerPlan(via[1] || via[2]);
  }
  return 'unknown';
}

/** The first plan after a first-person cue. Bare cues do not skip over other words. */
function firstPersonPlan(clause: string): LearnerPlan {
  const direct = directUsePlan(clause);
  if (direct !== 'unknown') return direct;
  const strong = strongCuePlan(clause);
  if (strong !== 'unknown') return strong;
  return bareCuePlan(clause);
}

/**
 * A pure plan question does not state the learner's plan.
 * "I'm on Enterprise, where is Log?" is not pure: the first-person plan still counts.
 */
function isPurePlanQuestion(clause: string): boolean {
  const asks =
    /\?\s*$/.test(clause) ||
    /^\s*(?:is|are|can|could|do|does|did|what|which|how|whose|where)\b/.test(clause) ||
    /\bco\b[\s\S]{0,48}\bkhong\b/.test(clause);
  if (!asks) return false;
  return firstPersonPlan(clause) === 'unknown';
}

export function resolveLearnerPlan(text: string): LearnerPlan {
  const allClauses = planClauses(text);
  const clauses = allClauses.filter((clause) => !isPurePlanQuestion(clause));
  const folded = clauses.join(' ');
  const profile =
    /\b(?:selected plan|onboarding plan|profile plan|learner plan|plan da chon|goi da chon)\s*[:=]?\s*(enterprise|business|pro|free)\b|\bplan\s*[:=]\s*(enterprise|business|pro|free)\b/.exec(
      folded,
    );
  const fromProfile = asLearnerPlan(profile?.[1] || profile?.[2]);
  if (fromProfile !== 'unknown') return fromProfile;
  // A plan inside a question still counts: "I'm on Enterprise, where is Log?"
  // A pure plan question ("Is Log on Enterprise?") was already removed.
  for (const clause of allClauses) {
    const fromQuestion = firstPersonPlan(clause);
    if (fromQuestion !== 'unknown') return fromQuestion;
    const customerHere = new RegExp(`\\b(${PLAN_NAME})\\s+customer\\s+here\\b`).exec(clause);
    if (customerHere) return asLearnerPlan(customerHere[1]);
    const ownAccount = new RegExp(`\\btai khoan cua minh la\\s+(${PLAN_NAME})\\b`).exec(clause);
    if (ownAccount) return asLearnerPlan(ownAccount[1]);
  }

  for (const clause of clauses) {
    const planHere =
      /\b(?:the\s+)?plan\s+here\s+is\s+(enterprise|business|pro|free)\b|\b(?:plan|goi)\s+here\b[\s\S]{0,24}\b(enterprise|business|pro|free)\b|\bgoi\s+(?:o\s+)?day(?:\s+la)?\s+(enterprise|business|pro|free)\b/.exec(
        clause,
      );
    const fromHere = asLearnerPlan(planHere?.[1] || planHere?.[2] || planHere?.[3]);
    if (fromHere !== 'unknown') return fromHere;
    const owned =
      /\btai khoan\s+(enterprise|business|pro|free)\b|\b(?:our|my)\s+(enterprise|business|pro|free)\s+(?:zone|site|account)\b|\b(?:my|our)\s+(?:zone|site|account)\s+is\s+(?:on\s+(?:the\s+)?|an\s+)?(enterprise|business|pro|free)\b|\b(?:is|am)\s+an\s+(enterprise|business|pro|free)\s+(?:customer|account)\b|\b(?:tai khoan|goi|plan|site|account)\s+(?:cua toi\s+|cua minh\s+)?la\s+(enterprise|business|pro|free)\b|\b(?:zone|site|account|tai khoan)\s+(?:cua toi|cua minh)\b[\s\S]{0,16}\b(enterprise|business|pro|free)\b/.exec(
        clause,
      );
    const fromOwned = asLearnerPlan(owned?.[1] || owned?.[2] || owned?.[3] || owned?.[4] || owned?.[5] || owned?.[6]);
    if (fromOwned !== 'unknown') return fromOwned;
    const declared =
      /\b(?:on|with)\s+(?:the\s+|goi\s+)?(enterprise|business|pro|free)\s+(?:plan|zone|account|goi)\b|\bgoi\s+(enterprise|business|pro|free)\b|^(?:the\s+)?(enterprise|business|pro|free)\s+plan\b|\b(enterprise|business|pro|free)\s+here\b/.exec(
        clause,
      );
    const fromDeclared = asLearnerPlan(declared?.[1] || declared?.[2] || declared?.[3] || declared?.[4]);
    if (fromDeclared !== 'unknown') return fromDeclared;
  }
  return 'unknown';
}

function ownPlan(text: string): LearnerPlan {
  return resolveLearnerPlan(text);
}

/** A how-to step that names a plan only as context, not as an availability claim. */
function isPlanContextOnly(folded: string): boolean {
  if (!PLAN.test(folded)) return false;
  if (AVAILABILITY.test(folded) || ENTERPRISE_ONLY_SHAPE.test(folded)) return false;
  if (/\b(?:works on|lacks|lack|missing|upgrade|nang cap|not on|khong ho tro|khong bao gom|only)\b/.test(folded)) {
    return false;
  }
  return /\b(?:on|with|goi|for)\b/.test(folded);
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
  if (isManagedChallengeRecordOnly(sentence, context)) return true;
  if (isSkipRecordOnly(sentence, context) || listsSkipAsOverride(foldFeature(sentence)) || deniesJsChallenge(foldFeature(sentence))) {
    return true;
  }
  if (namesUnknownAction(sentence)) return true;
  if (outputGuardRow(sentence, context)) return true;
  if (hasInventedNameserverHost(sentence, context)) return true;
  if (isProceduralStep(sentence)) return false;
  const folded = foldFeature(sentence);
  if (PLAN.test(folded) || isWafLogAction(sentence) || hasCapitalLogGrant(sentence)) return true;
  if (actionsPaidOnly(folded) || sbfmOnFree(folded)) return true;
  if (/\bpaid plans?\b/.test(folded) && (SDD.test(folded) || /\bwaf\b|\bactions?\b|\bblock\b/.test(folded))) return true;
  if (claimsAllRulesRun(folded)) return true;
  if (isSddPronounFollowUp(sentence, context)) return true;
  if (planForbidsGatedFeature(sentence, context)) return true;
  if (isSaveClaim(folded)) return true;
  if (NAMESERVER.test(folded) || (namesNameserverTopic(folded) && hasInventedNameserverHost(sentence, context))) return true;
  if (namesInventedAction(folded)) return true;
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

/** A ruleset sentence that already matches the table: Pro or above, not on Free, or Free's own ruleset. */
function confirmsRulesetPlan(folded: string): boolean {
  if (!/managed ruleset|\bmanaged rules\b|\bowasp\b|\bwaf\b/.test(folded)) return false;
  const saysOn = /\b(?:already on|already enabled|are active|are running|on by default)\b/.test(folded) && !/not already|isn't already|isnt already/.test(folded);
  if (saysOn && !/free managed ruleset/.test(folded)) return false;
  if (/do not turn on|don't turn on|not on the free|khong bat|not already on|isn't already|isnt already/.test(folded)) {
    return true;
  }
  if (/free managed ruleset|free already has waf|free da co waf/.test(folded)) return true;
  return /need(?:s)? pro|pro or above|pro tro len/.test(folded);
}

/** The sentence already states a table fact. */
export function tableConfirms(sentence: string): boolean {
  if (isSharedActionSentence(sentence) || isPlanTableSentence(sentence) || placesDeniedFeatureOnEnterprise(sentence)) return true;
  if (confirmsRulesetPlan(foldFeature(sentence))) return true;
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
  if (/super bot fight mode/.test(folded) && /\bfree\b/.test(folded) && (NEGATION.test(folded) || /not on|khong co|khong dung/.test(folded))) {
    return true;
  }
  if (/bot fight mode/.test(folded) && /\bfree\b/.test(folded) && !/super bot fight mode/.test(folded)) return true;
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
function sbfmOnFree(folded: string): boolean {
  if (!/super bot fight mode/.test(folded) || !/\bfree\b/.test(folded)) return false;
  if (NEGATION.test(folded) || /not on|khong co|khong dung|instead/.test(folded)) return false;
  return true;
}

const PLAN_OR_PAID = /\b(?:free|pro|business|enterprise|paid|paying)\b/;
const ACTION_OR_RULESET =
  /\b(?:actions?|hanh dong|block|managed challenge|interactive challenge|non-interactive challenge|js challenge|skip|managed ruleset|managed rules|\bwaf\b)\b/;

/** A plan (or paid/paying) named in the same sentence as an action or a ruleset. */
function namesPlanAndControl(folded: string): boolean {
  return PLAN_OR_PAID.test(folded) && ACTION_OR_RULESET.test(folded);
}

function actionsPaidOnly(folded: string): boolean {
  if (namesPlanAndControl(folded)) return true;
  const control = ACTION_OR_RULESET.test(folded) || /\bcustom rules?\b/.test(folded);
  if (!control) return false;
  if (/\b(?:need|needs|require|requires|required)\b/.test(folded) && PLAN_OR_PAID.test(folded)) return true;
  if (/\bonly works? on\b/.test(folded) && PLAN_OR_PAID.test(folded)) return true;
  if (/\bpaying\b/.test(folded)) return true;
  if (/\b(?:active|enabled) on free\b/.test(folded)) return true;
  return false;
}

const KNOWN_ACTION_TARGET =
  /^(?:block|managed challenge|non interactive challenge|js challenge|interactive challenge|skip|log)\b/;

/**
 * An action name that is not in the table. Checked before logging-product tokens are hidden,
 * so "Logging" and "logging-only" stay visible. "Do not invent an action name" is not a claim.
 */
function cleanActionToken(raw: string): string {
  return raw
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:choose|pick|set|use|using|select|chon|dat|dung)\s+/, '')
    .trim();
}

/**
 * Only the name after "action … to / là / thành", or the name in "action <Name>".
 * The noun before "action" is not the action name.
 */
function actionNameTokens(folded: string): string[] {
  const found: string[] = [];
  const patterns = [
    /\b(?:action|hanh dong)\b(?:\s+[a-z0-9-]+){0,4}?\s+(?:to|la|thanh|sang|named|called)\s+([a-z0-9-]+(?:\s+[a-z0-9-]+){0,3})/g,
    /\b(?:action|hanh dong)\s+(?!to\b|la\b|thanh\b|sang\b|named\b|called\b|of\b|for\b|only\b|at\b|as\b|in\b|on\b|with\b|from\b|the\b|a\b|an\b|this\b|that\b|gom\b|include(?:s|d)?\b|including\b|are\b|is\b|list\b|following\b)([a-z0-9-]+(?:\s+[a-z0-9-]+){0,2})/g,
  ];
  for (const pattern of patterns) {
    for (const match of folded.matchAll(pattern)) {
      const token = cleanActionToken(match[1] ?? '');
      if (token) found.push(token);
    }
  }
  return found;
}

function namesUnknownAction(sentence: string): boolean {
  const folded = foldFeature(sentence);
  if (isSharedActionSentence(sentence)) return false;
  if (/\bnot an action\b|\bkhong phai action\b|\bdo not invent\b|\bdung bia\b|\bdungneg bia\b/.test(folded)) return false;
  if (/not a record-only|not record-only|khong phai action chi ghi/.test(folded)) return false;
  if (/\b(?:logging-only|log-only|logging only)\b/.test(folded) && /\b(?:action|hanh dong)\b/.test(folded)) return true;
  const stop =
    /^(?:name|names|the|custom|override|only|enterprise|visitor|record|records|invent|real|waf|same|following|custom rule|custom-rule|rule|firewall rule|waf rule)$/;
  const purpose = /^(?:watch|watching|trial|trialing|review|testing)$/;
  return actionNameTokens(folded).some(
    (target) => !stop.test(target) && !purpose.test(target) && !KNOWN_ACTION_TARGET.test(target),
  );
}

/** Free keeps the Cloudflare Free Managed Ruleset. The full Managed Ruleset is Pro and above. */
function freePaidRulesetOn(sentence: string, context: string): boolean {
  const folded = foldFeature(sentence);
  if (/free managed ruleset|free managed rules\b/.test(folded)) return false;
  if (!/managed ruleset|\bmanaged rules\b/.test(folded)) return false;
  const statesOn = /\b(?:already on|is on|turned on|is enabled|already enabled|active|running|by default|bat san|da bat|dang bat)\b/;
  const onMatch = statesOn.exec(folded);
  const beforeOn = onMatch ? folded.slice(Math.max(0, onMatch.index - 24), onMatch.index) : '';
  const saysOn = Boolean(onMatch) && !/\b(?:not|n't|isnt|isn't|aren't|arent|khong|chua)\b/.test(beforeOn);
  const learnerFree = ownPlan(`${context}\n${sentence}`) === 'free' || /\bfree\b/.test(folded);
  const learnerPaid =
    ownPlan(sentence) === 'pro' || ownPlan(sentence) === 'business' || ownPlan(sentence) === 'enterprise';
  if (!learnerFree || (learnerPaid && !/\bfree\b/.test(folded))) return false;
  if (/\b(?:pro|business|enterprise)\b/.test(folded) && !saysOn && !/\bfree\b/.test(folded)) return false;
  // "already on" wins even when another clause in the sentence is negated.
  if (saysOn) return true;
  if (NEGATION.test(folded)) return false;
  if (/needs pro|pro or above|pro tro len|not on the free|khong co tren|does not include|not included/.test(folded)) return false;
  return /\b(?:turn on|enable|hay bat)\b/.test(folded);
}

/**
 * Log, SDD, Bot Management, or the paid Managed Ruleset granted while the learner's plan forbids it.
 * The plan comes from the prompt, not only from a plan word in the sentence.
 */
function planForbidsGatedFeature(sentence: string, context: string): 'sdd' | 'bots' | 'rulesets' | null {
  if (tableConfirms(sentence)) return null;
  const folded = foldFeature(sentence);
  if (freePaidRulesetOn(sentence, context)) return 'rulesets';
  const plan = ownPlan(context);
  if (plan === 'unknown' || plan === 'enterprise') return null;
  if (NEGATION.test(folded) || /instead of|thay cho|not available|does not|khong co|khong ho tro|enterprise-only|enterprise only|chi co tren enterprise/.test(folded)) {
    return null;
  }
  const grant = /\b(?:enable|turn|bat|kich hoat|use|using|included|include|includes|available|already|get|gets|have|has|comes with|ships with)\b/;
  if (!grant.test(folded)) return null;
  if (SDD.test(folded)) return 'sdd';
  if (BOT.test(folded) && !/super bot fight mode/.test(folded)) return 'bots';
  return null;
}

function logGrantUnconfirmed(sentence: string, context: string): boolean {
  const folded = foldFeature(sentence);
  const hidden = stripViLogUses(hideLoggingProducts(folded));
  const planNamesLog = PLAN.test(folded) && /\blog\b/.test(hidden) && !isPlanContextOnly(folded);
  if (!isWafLogAction(sentence) && !hasCapitalLogGrant(sentence) && !planNamesLog) return false;
  if (tableConfirms(sentence)) return false;
  if (NEGATION.test(folded) || /instead of|thay cho/.test(folded)) return false;
  if (ownPlan(context) === 'enterprise' && !LOWER_PLAN.test(folded)) return false;
  return LOWER_PLAN.test(folded) || ownPlan(context) !== 'enterprise';
}

/** CAPTCHA, a disallowed WAF menu, Enterprise "already on", or "without blocking" except Log. */
function outputGuardRow(sentence: string, context: string): 'waf-actions' | 'rulesets' | null {
  const folded = foldFeature(sentence);
  if (/captcha|puzzle/.test(folded) && /managed challenge|non-interactive challenge|js challenge|interactive challenge/.test(folded)) {
    return 'waf-actions';
  }
  if (
    /without blocking|khong chan/.test(folded) &&
    /custom rule|\brule\b|\btest/.test(folded) &&
    !/\b(?:log action|to log|action log)\b/.test(folded) &&
    !/\baction\b[\s\S]{0,24}\blog\b/.test(folded)
  ) {
    return 'waf-actions';
  }
  if (
    /\benterprise\b/.test(folded) &&
    /managed ruleset|\bmanaged rules\b/.test(folded) &&
    !/free managed|not already|isn't already|isnt already|chua bat|khong bat san/.test(folded) &&
    /already on|is enabled|already enabled|bat san|da bat/.test(folded)
  ) {
    return 'rulesets';
  }
  if (/→|->/.test(sentence) && /\bwaf\b|custom rule|firewall|security/.test(foldFeature(`${context}\n${sentence}`))) {
    const paths = foldFeature(sentence).match(/[a-z0-9 ]{0,32}(?:→|->)\s*[a-z0-9 ]{1,32}/g) ?? [];
    if (paths.some((path) => !/security\s*(?:→|->)\s*(?:security rules|settings)\b/.test(path))) return 'waf-actions';
  }
  return null;
}

/** The sentence conflicts with the table. This wins over an ok verdict. */
export function tableContradicts(sentence: string, context = ''): boolean {
  const prompt = context.split('\n')[0] ?? '';
  if (asksLogpush(prompt) && isWafActionsAnswer(sentence)) return true;
  if (tableConfirms(sentence)) return false;
  const folded = foldFeature(sentence);
  if (outputGuardRow(sentence, context)) return true;
  if (hasInventedNameserverHost(sentence, context)) return true;
  if (deniesBusinessManagedRuleset(sentence)) return true;
  if (isManagedChallengeRecordOnly(sentence, context)) return true;
  if (isSkipRecordOnly(sentence, context) || listsSkipAsOverride(folded) || deniesJsChallenge(folded) || namesUnknownAction(sentence)) {
    return true;
  }
  if (planForbidsGatedFeature(sentence, context)) return true;
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
  if (sbfmOnFree(folded)) return true;
  if (actionsPaidOnly(folded)) return true;
  if (SDD.test(folded) && /\bpaid plans?\b/.test(folded) && !NEGATION.test(folded) && !/\benterprise\b/.test(folded)) return true;
  if (
    /super bot fight mode/.test(folded) &&
    (ENTERPRISE_ONLY_SHAPE.test(folded) ||
      (NEGATION.test(folded) && PLAN.test(folded)) ||
      (/\benterprise\b/.test(folded) && !/\b(?:pro|business)\b/.test(folded) && !NEGATION.test(folded)))
  ) {
    return true;
  }
  const enterpriseUse = ownPlan(context) === 'enterprise' && !LOWER_PLAN.test(folded);
  if (
    isWafLogAction(sentence) &&
    !enterpriseUse &&
    !/instead of|thay cho|not available|does not|khong co|khong ho tro|enterprise-only|only available on enterprise|chi co tren enterprise/.test(
      folded,
    )
  ) {
    return true;
  }
  if (namesInventedAction(folded)) return true;
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
function namesInventedAction(folded: string): boolean {
  if (!INVENTED.test(folded)) return false;
  if (/\bnot an action\b|\bkhong phai action\b/.test(folded)) return false;
  return /\b(?:action|hanh dong|mode|use|using|chon|select|pick|choose|set|dung|dat)\b/.test(folded);
}

/** A named WAF action that is not in the table, including a logging-only name. */
export function claimsUnknownWafAction(sentence: string): boolean {
  return namesUnknownAction(sentence) || namesInventedAction(foldFeature(sentence));
}

export function rewriteFromTable(sentence: string, lang: GenerateLang, context = ''): string {
  const folded = foldFeature(sentence);
  const hidden = stripViLogUses(hideLoggingProducts(folded));
  const planNamesLog = PLAN.test(folded) && /\blog\b/.test(hidden) && !isPlanContextOnly(folded);
  const ids: Array<(typeof PLAN_FEATURE_ROWS)[number]['id']> = [];
  const logpushQuestion = asksLogpush(context);
  if (
    !logpushQuestion &&
    (isWafLogAction(sentence) ||
      hasCapitalLogGrant(sentence) ||
      planNamesLog ||
      isManagedChallengeRecordOnly(sentence, context) ||
      isSkipRecordOnly(sentence, context) ||
      listsSkipAsOverride(folded) ||
      deniesJsChallenge(folded) ||
      namesInventedAction(folded) ||
      namesUnknownAction(sentence) ||
      actionsPaidOnly(folded))
  ) {
    ids.push('waf-actions');
  }
  const guarded = outputGuardRow(sentence, context);
  if (guarded) ids.push(guarded);
  const forbidden = planForbidsGatedFeature(sentence, context);
  if (forbidden === 'sdd') ids.push('sdd');
  if (forbidden === 'bots') ids.push('bots');
  if (forbidden === 'rulesets') ids.push('rulesets');
  if (SDD.test(folded) || isSddPronounFollowUp(sentence, context)) ids.push('sdd');
  if (BOT.test(folded) || /super bot fight mode|bot fight mode/.test(folded)) ids.push('bots');
  if (deniesBusinessManagedRuleset(sentence)) ids.push('business-cmr');
  else if (RULESET.test(folded)) ids.push('rulesets');
  if (LOGPUSH.test(folded)) ids.push('logpush');
  if (NAMESERVER.test(folded) || hasInventedNameserverHost(sentence, context)) ids.push('nameservers');
  if (isSaveClaim(folded) || claimsAllRulesRun(folded)) ids.push('save');
  if (!ids.length && PLAN.test(folded)) return '';
  const unique = [...new Set(ids)];
  const lines = unique.map((id) => PLAN_FEATURE_ROWS.find((row) => row.id === id)?.[lang] ?? '').filter(Boolean);
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
    if (/^\s*(?:\d+[.)]|[-*•])\s*$/.test(line)) continue;
    if (isHeadingLine(line)) {
      const next = lines.slice(i + 1).find((item) => item.trim() && !/^\s*(?:\d+[.)]|[-*•])\s*$/.test(item));
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
  const chunkSize = options?.chunkSize ?? Math.max(claims.length, 1);
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

function settle(sentence: string, lang: GenerateLang, context: string): { text: string; action: SentenceAction } {
  const forced = rewriteFromTable(sentence, lang, context);
  if (!forced) return { text: '', action: 'dropped' };
  if (foldFeature(forced) === foldFeature(sentence)) return { text: sentence, action: 'kept' };
  return { text: forced, action: 'rewritten' };
}

function resolveSentence(
  sentence: string,
  verdict: ClaimVerdict | null | undefined,
  lang: GenerateLang,
  context: string,
): { text: string; action: SentenceAction } {
  // A wrong verdict never keeps the sentence. The table row replaces it, or it is dropped.
  if (verdict === 'wrong') return settle(sentence, lang, context);
  // The table wins over ok. An unconfirmed availability claim is rewritten too.
  if (tableContradicts(sentence, context) || (featureAvailabilityClaim(foldFeature(sentence)) && !tableConfirms(sentence))) {
    return settle(sentence, lang, context);
  }
  if (verdict === 'ok' || tableConfirms(sentence)) return { text: sentence, action: 'kept' };
  // Null or unsure keeps a how-to that does not grant Log, SDD, Bot Management, or a paid ruleset.
  if (!failsClosedOnUnsure(sentence, context)) return { text: sentence, action: 'kept' };
  return settle(sentence, lang, context);
}

function failsClosedOnUnsure(sentence: string, context: string): boolean {
  const folded = foldFeature(sentence);
  if (tableConfirms(sentence)) return false;
  const enterpriseLog = ownPlan(context) === 'enterprise' && !LOWER_PLAN.test(folded);
  if ((hasCapitalLogGrant(sentence) || isWafLogAction(sentence)) && !enterpriseLog) return true;
  if (logGrantUnconfirmed(sentence, context)) return true;
  if (PLAN.test(folded) && (AVAILABILITY.test(folded) || /\b(?:works on|lacks|lack|missing|not on|khong ho tro|khong bao gom)\b/.test(folded))) {
    return true;
  }
  if (SDD.test(folded) && /\b(?:enable|turn|included|include|available|already|have|has|get|comes)\b/.test(folded)) return true;
  if (BOT.test(folded) && !/super bot fight mode/.test(folded)) return true;
  if (freePaidRulesetOn(sentence, context) || actionsPaidOnly(folded)) return true;
  if (featureAvailabilityClaim(folded)) return true;
  if (claimsAllRulesRun(folded) || isSaveClaim(folded) || hasInventedNameserverHost(sentence, context)) return true;
  if (isManagedChallengeRecordOnly(sentence, context) || isSkipRecordOnly(sentence, context) || namesUnknownAction(sentence)) return true;
  return false;
}

/** "It …" after the sentence it referred to was removed. A named feature can stand alone. */
export function isDanglingPronounSentence(sentence: string): boolean {
  const folded = foldFeature(sentence).replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '');
  if (!/^(?:it|that|this|they|no)\b/.test(folded)) return false;
  return !/\b(?:log|super bot|bot management|sensitive data|managed challenge|managed rules|block|skip|\bwaf\b|ruleset)\b/.test(
    folded,
  );
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
    .map((line) => {
      const emitted: string[] = [];
      let antecedentKept = true;
      for (const sentence of splitSentences(line)) {
        if (!antecedentKept && isDanglingPronounSentence(sentence)) {
          antecedentKept = true;
          continue;
        }
        const context = `${prompt}\n${prior.join(' ')}`;
        prior.push(sentence);
        if (!mentionsPlanOrFeature(sentence, context)) {
          antecedentKept = true;
          emitted.push(sentence);
          continue;
        }
        const id = `s${claimIndex}`;
        claimIndex += 1;
        const verdict = verdicts.has(id) ? verdicts.get(id) : null;
        const resolved = resolveSentence(sentence, verdict ?? null, lang, context);
        const folded = foldFeature(resolved.text);
        if (resolved.action === 'rewritten' && folded && seen.has(folded)) {
          counts.rewritten += 1;
          antecedentKept = false;
          continue;
        }
        if (folded) seen.add(folded);
        counts[resolved.action] += 1;
        antecedentKept = resolved.action === 'kept' && Boolean(resolved.text.trim());
        if (resolved.text.trim()) emitted.push(resolved.text);
      }
      return emitted.filter(Boolean).join(' ');
    })
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
  if (!asksLogpush(prompt) && (LOG_ACTION.test(hideLogpush(folded)) || /managed challenge|\bwaf\b|custom rule/.test(folded))) {
    ids.push('waf-actions');
  }
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
/** One copy of each plan-table row. A later sentence that repeats a row id is dropped. */
function isLogOnlyFact(folded: string): boolean {
  return /log is only available on enterprise|log is enterprise only|log chi co tren enterprise/.test(folded);
}

/** One copy of each sentence. The two "Log is only on Enterprise" wordings count as one fact. */
export function dedupePlanRows(text: string): string {
  const seenSentences = new Set<string>();
  let seenLogOnly = false;
  return text
    .split('\n')
    .map((line) =>
      splitSentences(line)
        .filter((sentence) => {
          const folded = foldFeature(sentence);
          if (!folded || seenSentences.has(folded)) return false;
          if (isLogOnlyFact(folded)) {
            if (seenLogOnly) return false;
            seenLogOnly = true;
          }
          seenSentences.add(folded);
          return true;
        })
        .join(' '),
    )
    .filter((line) => line.trim())
    .join('\n');
}

/** A rewritten action list is its own line. The rest of that row stays on the same line. */
export function detachActionRows(text: string): string {
  const start = /WAF custom-rule actions:|Action của custom rule WAF:/;
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? '';
    const match = start.exec(line);
    if (!match || match.index === undefined) {
      out.push(line);
      continue;
    }
    const before = line.slice(0, match.index).trim();
    let row = line.slice(match.index).trim();
    while (i + 1 < lines.length && isWafActionsAnswer((lines[i + 1] ?? '').trim())) {
      i += 1;
      row = `${row} ${(lines[i] ?? '').trim()}`.trim();
    }
    const marker = before.replace(/\s+/g, '');
    if (!before || /^[-*•]$/.test(marker) || /^\d+[.)]$/.test(marker)) out.push(row);
    else {
      out.push(before);
      out.push(row);
    }
  }
  return out.join('\n');
}

function finishClaimReview(text: string, prompt: string, lang: GenerateLang): string {
  let next = dedupePlanRows(detachActionRows(dropEmptyHeadings(text.trim())));
  if (!next || isHeadingOnly(next)) next = tableDerivedFallback(prompt, lang);
  next = ensureSaveAnswer(next, prompt, lang);
  if (!next.trim()) next = tableDerivedFallback(prompt, lang);
  return dedupePlanRows(detachActionRows(dropEmptyHeadings(next)));
}
