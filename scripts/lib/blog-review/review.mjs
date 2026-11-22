/**
 * One review round: deterministic checks + fetched-source quote verification
 * + (optional) model verdicts → a report that validates against
 * REVIEW_REPORT_SCHEMA. Fail closed: anything missing or unverifiable fails.
 */
import { runDeterministicChecks } from './checks.mjs';
import {
  CATEGORIES,
  CATEGORY_THRESHOLDS,
  OVERALL_MIN,
  RUBRIC_VERSION,
  SEVERITY_PENALTY,
} from './rubric.mjs';
import { LLM_REVIEW_SCHEMA, REVIEW_REPORT_SCHEMA, validate } from './schema.mjs';
import { isOfficialUrl, normalizeText, quoteFound } from './sources.mjs';

/**
 * @param {import('./checks.mjs').Finding[]} findings
 */
export function scoreCategories(findings) {
  const categories = {};
  for (const category of CATEGORIES) {
    const mine = findings.filter((f) => f.category === category);
    const blocker = mine.some((f) => f.severity === 'blocker');
    const penalty = mine.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0);
    const score = blocker ? 0 : Math.max(0, 100 - penalty);
    const threshold = CATEGORY_THRESHOLDS[category];
    categories[category] = { score, threshold, pass: !blocker && score >= threshold };
  }
  const overallScore = Math.round(CATEGORIES.reduce((s, c) => s + categories[c].score, 0) / CATEGORIES.length);
  const verdict = CATEGORIES.every((c) => categories[c].pass) && overallScore >= OVERALL_MIN ? 'pass' : 'fail';
  return { categories, overallScore, verdict };
}

/**
 * @param {{
 *   post: any,
 *   ledger: any,
 *   round: number,
 *   ctx: import('./checks.mjs').CheckContext,
 *   fetchSource?: (url: string) => Promise<{ status: number | null, text: string }>,
 *   llmReview?: (input: { post: any, ledger: any, sources: Record<string, string> }) => Promise<unknown>,
 *   model?: string | null,
 *   now?: Date,
 *   requireModel?: boolean,
 * }} input
 */
export async function reviewPost(input) {
  const { post, ledger, round, ctx } = input;
  const findings = runDeterministicChecks(post, ledger, ctx);
  const add = (rule, category, severity, message, location, fix) =>
    findings.push({ rule, category, severity, message, ...(location ? { location } : {}), ...(fix ? { fix } : {}) });

  const claimsIn = Array.isArray(ledger?.claims) ? ledger.claims : [];
  const sourceUrls = [...new Set([...(post.sources || []).map((s) => s.href), ...claimsIn.map((c) => c.sourceUrl)])].filter(Boolean);
  /** @type {{ url: string, official: boolean, status: number | null }[]} */
  const sourcesChecked = [];
  /** @type {Record<string, string>} */
  const sourceText = {};
  const network = typeof input.fetchSource === 'function';
  if (!network) {
    add('FACT-006', 'factual', 'blocker', 'Sources were not fetched (offline run); a post can not pass without source verification.');
  }
  for (const url of sourceUrls) {
    const official = isOfficialUrl(url);
    let status = null;
    if (network && official) {
      const res = await input.fetchSource(url);
      status = res.status;
      sourceText[url] = res.text || '';
      if (status !== 200) add('FACT-007', 'factual', 'blocker', `Source did not load (HTTP ${status ?? 'error'}): ${url}`);
    }
    sourcesChecked.push({ url, official, status });
  }

  const claims = claimsIn.map((c) => {
    const found = network && Boolean(sourceText[c.sourceUrl]) && quoteFound(sourceText[c.sourceUrl], c.quote);
    return {
      id: String(c.id),
      text: String(c.text || ''),
      location: String(c.location || ''),
      sourceUrl: String(c.sourceUrl || ''),
      quote: String(c.quote || ''),
      quoteFound: found,
      verdict: found ? 'supported' : 'unverifiable',
    };
  });
  for (const c of claims) {
    if (network && !c.quoteFound) {
      add('FACT-008', 'factual', 'blocker', `Claim ${c.id}: quote not found verbatim on ${c.sourceUrl}.`, c.location,
        'Copy the exact sentence from the official page, or fix/remove the claim.');
    }
  }

  // Model pass: judges whether each quote really supports its claim, and lists uncited claims.
  let model = input.model ?? null;
  if (input.llmReview) {
    let raw;
    try {
      raw = await input.llmReview({ post, ledger, sources: sourceText });
    } catch (error) {
      raw = null;
      add('FACT-009', 'factual', 'blocker', `Model review failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (raw != null) {
      const errors = validate(LLM_REVIEW_SCHEMA, raw);
      if (errors.length) {
        add('FACT-009', 'factual', 'blocker', `Model review output invalid: ${errors.slice(0, 3).join('; ')}`);
      } else {
        const verdicts = new Map(raw.claims.map((c) => [c.id, c]));
        for (const c of claims) {
          const v = verdicts.get(c.id);
          if (!v) {
            c.verdict = 'unverifiable';
            add('FACT-010', 'factual', 'blocker', `Model gave no verdict for claim ${c.id}.`, c.location);
            continue;
          }
          // Code-verified quote is required; the model can only downgrade.
          if (c.quoteFound) c.verdict = v.verdict;
          if (v.note) c.note = v.note;
          if (c.verdict !== 'supported') {
            add('FACT-011', 'factual', 'blocker', `Claim ${c.id} is ${c.verdict}: ${v.note || c.text}`, c.location,
              'Rewrite the sentence so it says exactly what the source says.');
          }
        }
        for (const u of raw.uncitedClaims) {
          add('FACT-012', 'factual', 'blocker', `Uncited Cloudflare claim: ${u.text}`, u.location, 'Add a ledger claim with an official quote, or remove it.');
        }
        for (const f of raw.findings) {
          add(`LLM-${String(CATEGORIES.indexOf(f.category) + 1).padStart(3, '0')}`, f.category, f.severity, f.message, f.location, f.fix);
        }
      }
    }
  } else if (input.requireModel) {
    add('FACT-009', 'factual', 'blocker', 'No model reviewer configured; claim support and uncited claims were not judged.');
  }

  const { categories, overallScore, verdict } = scoreCategories(findings);
  const report = {
    schemaVersion: 1,
    rubricVersion: RUBRIC_VERSION,
    slug: post.slug,
    date: post.date,
    round,
    reviewedAt: (input.now || new Date()).toISOString(),
    reviewer: { deterministic: true, model, network },
    verdict,
    overallScore,
    categories,
    claims,
    findings,
    sourcesChecked,
  };
  const schemaErrors = validate(REVIEW_REPORT_SCHEMA, report);
  if (schemaErrors.length) {
    // Never let a malformed report pass.
    report.verdict = 'fail';
    report.findings.push({ rule: 'META-001', category: 'factual', severity: 'blocker', message: `Report schema: ${schemaErrors[0]}` });
  }
  return report;
}

/** Short excerpt of source text around the quote, for prompts. */
export function excerptAround(text, quote, radius = 600) {
  const hay = normalizeText(text);
  const needle = normalizeText(quote).slice(0, 60);
  const at = needle ? hay.indexOf(needle) : -1;
  if (at < 0) return hay.slice(0, radius * 2);
  return hay.slice(Math.max(0, at - radius), at + needle.length + radius);
}
