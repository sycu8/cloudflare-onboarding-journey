type GenerateLang = 'vi' | 'en';

/**
 * Authoritative plan-feature facts. The system prompt includes this table.
 * The second-pass claim check rewrites or drops a sentence from these rows.
 * It never appends a correction after the original sentence.
 */
export const PLAN_FEATURE_ROWS = [
  {
    id: 'waf-actions',
    en: 'WAF custom-rule actions on Free, Pro, and Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Log is Enterprise only. Simulate is not an action. Do not invent an action name.',
    vi: 'Action của custom rule WAF trên Free, Pro và Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Log chỉ có trên Enterprise. Simulate không phải action. Đừng bịa tên action.',
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
] as const;

export type ClaimVerdict = 'ok' | 'wrong' | 'unsure';

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
const SDD = /\bsdd\b|sensitive data|card detection|credit card|payment card|the tin dung|phat hien the|du lieu nhay cam/;
const BOT = /\bbot management\b|\bbot mgmt\b|bot-management/;
const RULESET = /\bowasp\b|core ruleset|cloudflare managed ruleset|managed ruleset/;
const LOGPUSH = /\blogpush\b/;
const NAMESERVER = /\bnameservers?\b/;
const PLAN = /\b(?:free|pro|business|enterprise)\b/;
const INVENTED =
  /\b(?:simulate|quarantine|monitor|tarpit|captcha|sinkhole|observe)\b/;

/** A sentence the claim check must classify. Bare "WAF" or "orange cloud" does not qualify. */
export function mentionsPlanOrFeature(sentence: string): boolean {
  const folded = foldFeature(sentence).replace(/\blog(?:ging)?\s+in\b/g, ' ').replace(/\blogin\b/g, ' ');
  const hidden = folded.replace(/logpush/g, ' ');
  return (
    PLAN.test(folded) ||
    SDD.test(folded) ||
    BOT.test(folded) ||
    RULESET.test(folded) ||
    LOGPUSH.test(folded) ||
    NAMESERVER.test(folded) ||
    INVENTED.test(folded) ||
    LOG_ACTION.test(hidden)
  );
}

/** Replace a wrong or unsure sentence with the table rows it touches. Unknown claims are dropped. */
export function rewriteFromTable(sentence: string, lang: GenerateLang): string {
  const folded = foldFeature(sentence).replace(/\blog(?:ging)?\s+in\b/g, ' ');
  const hidden = folded.replace(/logpush/g, ' ');
  const ids: Array<(typeof PLAN_FEATURE_ROWS)[number]['id']> = [];
  if (LOG_ACTION.test(hidden) || (INVENTED.test(folded) && /\b(?:action|hanh dong|mode)\b/.test(folded))) ids.push('waf-actions');
  if (SDD.test(folded)) ids.push('sdd');
  if (BOT.test(folded)) ids.push('bots');
  if (RULESET.test(folded)) ids.push('rulesets');
  if (LOGPUSH.test(folded)) ids.push('logpush');
  if (NAMESERVER.test(folded)) ids.push('nameservers');
  if (!ids.length && PLAN.test(folded)) return '';
  const lines = ids.map((id) => PLAN_FEATURE_ROWS.find((row) => row.id === id)?.[lang] ?? '');
  return lines.filter(Boolean).join(' ');
}

export function parseClaimVerdicts(raw: string, count: number): ClaimVerdict[] | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let data: unknown;
  try {
    data = JSON.parse(match[0]);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object' || !Array.isArray((data as { verdicts?: unknown }).verdicts)) return null;
  const list = (data as { verdicts: unknown[] }).verdicts;
  if (list.length !== count) return null;
  const verdicts: ClaimVerdict[] = [];
  for (const item of list) {
    if (item !== 'ok' && item !== 'wrong' && item !== 'unsure') return null;
    verdicts.push(item);
  }
  return verdicts;
}

function splitSentences(line: string): string[] {
  return line.split(/(?<=[.!?])\s+/).filter((part) => part.length > 0);
}

function cleanup(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').replace(/\s+$/g, ''))
    .filter((line) => line.trim() !== '')
    .join('\n')
    .trim();
}

/**
 * Apply verdicts in place. wrong and unsure rewrite from the table or drop.
 * A missing verdict list drops every plan or feature sentence. Nothing is appended.
 */
export function applyClaimVerdicts(text: string, lang: GenerateLang, verdicts: ClaimVerdict[] | null): string {
  let index = 0;
  const next = text
    .split('\n')
    .map((line) =>
      splitSentences(line)
        .map((sentence) => {
          if (!mentionsPlanOrFeature(sentence)) return sentence;
          if (!verdicts) return '';
          const verdict = verdicts[index++];
          if (verdict === 'ok') return sentence;
          if (verdict === 'wrong' || verdict === 'unsure') return rewriteFromTable(sentence, lang);
          return '';
        })
        .filter(Boolean)
        .join(' '),
    )
    .join('\n');
  return cleanup(next);
}

export function claimCheckMessages(sentences: string[], lang: GenerateLang) {
  const ask =
    lang === 'en'
      ? 'Classify each sentence against the plan-feature table. Reply with JSON only: {"verdicts":["ok","wrong","unsure"]}. ok means the sentence matches the table. wrong means it contradicts the table. unsure means you cannot tell. CLAIM_VERDICTS'
      : 'Phân loại từng câu theo bảng plan-feature. Chỉ trả JSON: {"verdicts":["ok","wrong","unsure"]}. ok là câu đúng với bảng. wrong là câu trái bảng. unsure là không chắc. CLAIM_VERDICTS';
  return [
    { role: 'system', content: `${ask}\n\n${formatPlanFeatureTable(lang)}` },
    { role: 'user', content: sentences.map((sentence, i) => `${i}. ${sentence}`).join('\n') },
  ];
}

export function claimSentences(text: string): string[] {
  const found: string[] = [];
  for (const line of text.split('\n')) {
    for (const sentence of splitSentences(line)) {
      if (mentionsPlanOrFeature(sentence)) found.push(sentence);
    }
  }
  return found;
}

/** Fail closed: a thrown classifier or a null verdict list drops plan and feature sentences. */
export async function reviewPlanClaims(
  text: string,
  lang: GenerateLang,
  classify: (sentences: string[]) => Promise<ClaimVerdict[] | null>,
): Promise<string> {
  const sentences = claimSentences(text);
  if (!sentences.length) return text;
  try {
    const verdicts = await classify(sentences);
    return applyClaimVerdicts(text, lang, verdicts);
  } catch {
    return applyClaimVerdicts(text, lang, null);
  }
}
