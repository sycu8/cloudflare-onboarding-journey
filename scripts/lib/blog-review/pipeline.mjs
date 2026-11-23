/**
 * generate → review → (fix → review)* → approved | held
 * Pure orchestration: model calls, fetches and filesystem views are injected
 * so tests run offline and deterministically.
 */
import { groundDraft, stripReviewedSentences } from './ground.mjs';
import { discoverLinkedDocs } from './sources.mjs';
import { MAX_REVIEW_ROUNDS_DEFAULT } from './rubric.mjs';
import { reviewPost } from './review.mjs';
import { afterReview } from './state.mjs';

/**
 * @param {{ sourceHints?: string[], docsHints?: string[] }} item
 * @param {(url: string) => Promise<{ status: number | null, text: string }>} fetchSource
 */
export async function gatherSources(item, fetchSource) {
  const seeds = [...new Set([...(item.docsHints || []), ...(item.sourceHints || [])])];
  /** @type {Record<string, string>} */
  const out = {};
  const seen = new Set();
  const queue = [...seeds];
  while (queue.length && Object.keys(out).length < 8) {
    const url = queue.shift();
    const key = url.replace(/\/$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    const res = await fetchSource(url);
    if (!(res.status === 200 && res.text)) continue;
    out[url] = res.text;
    if (!seeds.some((seed) => seed.replace(/\/$/, '') === key)) continue;
    for (const link of discoverLinkedDocs(url, res.text, 4)) {
      if (!seen.has(link.replace(/\/$/, ''))) queue.push(link);
    }
  }
  return out;
}

/** @param {any} draft */
export function splitDraft(draft) {
  if (!draft || typeof draft !== 'object') throw new Error('model draft must be { post, claims[] }');
  if (draft.post && typeof draft.post === 'object' && Array.isArray(draft.claims)) {
    return { post: draft.post, ledger: { slug: draft.post.slug, claims: draft.claims } };
  }
  if (draft.post && draft.ledger && Array.isArray(draft.ledger.claims)) {
    return { post: draft.post, ledger: { slug: draft.post.slug, claims: draft.ledger.claims } };
  }
  if (draft.slug && Array.isArray(draft.sections) && Array.isArray(draft.claims)) {
    const { claims, ...post } = draft;
    return { post, ledger: { slug: post.slug, claims } };
  }
  throw new Error('model draft must be { post, claims[] }');
}

/**
 * @param {{
 *   item: any,
 *   models: {
 *     generate: (input: { item: any, sources: Record<string, string>, existingSlugs: string[] }) => Promise<unknown>,
 *     review?: (input: { post: any, ledger: any, sources: Record<string, string> }) => Promise<unknown>,
 *     fix: (input: { post: any, ledger: any, report: any, sources: Record<string, string> }) => Promise<unknown>,
 *     name?: string | null,
 *   },
 *   fetchSource: (url: string) => Promise<{ status: number | null, text: string }>,
 *   ctx: import('./checks.mjs').CheckContext,
 *   maxRounds?: number,
 *   requireModelReview?: boolean,
 *   now?: () => Date,
 *   log?: (line: string) => void,
 * }} input
 * @returns {Promise<{ state: 'approved' | 'held', reason: string, post: any, ledger: any, reports: any[] }>}
 */
export async function runPipeline(input) {
  const maxRounds = input.maxRounds ?? MAX_REVIEW_ROUNDS_DEFAULT;
  const log = input.log || (() => {});
  const reports = [];
  let post = null;
  let ledger = null;
  let sources = {};
  try {
    sources = await gatherSources(input.item, input.fetchSource);
    if (!Object.keys(sources).length) {
      return { state: 'held', reason: 'no official source could be fetched for this topic', post, ledger, reports };
    }
    ({ post, ledger } = splitDraft(await input.models.generate({ item: input.item, sources, existingSlugs: [...input.ctx.postSlugs] })));
    ({ post, ledger } = groundDraft(post, ledger, sources));
    if (post.slug !== input.item.slug || post.date !== input.item.date) {
      // The schedule owns slug and date; never let the model move a post.
      post.slug = input.item.slug;
      post.date = input.item.date;
      ledger.slug = input.item.slug;
    }
    post.relatedPostSlugs = (post.relatedPostSlugs || []).filter((slug) => input.ctx.postSlugs.has(slug));
  } catch (error) {
    return { state: 'held', reason: `generation failed: ${error instanceof Error ? error.message : String(error)}`, post, ledger, reports };
  }

  for (let round = 1; ; round += 1) {
    let report;
    let reviewError = null;
    try {
      report = await reviewPost({
        post,
        ledger,
        round,
        ctx: input.ctx,
        fetchSource: input.fetchSource,
        llmReview: input.models.review,
        model: input.models.name ?? null,
        requireModel: input.requireModelReview ?? true,
        now: input.now ? input.now() : undefined,
      });
      reports.push(report);
      if (report.verdict !== 'pass') {
        const stripped = stripReviewedSentences(post, report);
        const failedIds = new Set(
          (report.findings || [])
            .filter((finding) => finding.rule === 'FACT-011')
            .map((finding) => (String(finding.message).match(/\bC\d+\b/) || [])[0])
            .filter(Boolean),
        );
        if (failedIds.size) ledger = { ...ledger, claims: ledger.claims.filter((claim) => !failedIds.has(claim.id)) };
        if (JSON.stringify(stripped) !== JSON.stringify(post) || failedIds.size) {
          post = stripped;
          ({ post, ledger } = groundDraft(post, ledger, sources));
          post.slug = input.item.slug;
          post.date = input.item.date;
          ledger.slug = input.item.slug;
          report = await reviewPost({
            post,
            ledger,
            round,
            ctx: input.ctx,
            fetchSource: input.fetchSource,
            llmReview: input.models.review,
            model: input.models.name ?? null,
            requireModel: input.requireModelReview ?? true,
            now: input.now ? input.now() : undefined,
          });
          reports[reports.length - 1] = report;
        }
      }
    } catch (error) {
      reviewError = error instanceof Error ? error.message : String(error);
    }
    const decision = afterReview({ verdict: report?.verdict, error: reviewError, round, maxRounds });
    log(`round ${round}: ${report?.verdict ?? 'error'} → ${decision.next} (${decision.reason})`);
    if (decision.next !== 'fixing') {
      return { state: decision.next, reason: decision.reason, post, ledger, reports };
    }
    let fixed = false;
    let fixError = 'fix failed';
    for (let attempt = 0; attempt < 2 && !fixed; attempt += 1) {
      try {
        const stripped = stripReviewedSentences(post, report);
        ({ post, ledger } = splitDraft(await input.models.fix({ post: stripped, ledger, report, sources, repair: attempt > 0 })));
        ({ post, ledger } = groundDraft(post, ledger, sources));
        post.slug = input.item.slug;
        post.date = input.item.date;
        ledger.slug = input.item.slug;
        post.relatedPostSlugs = (post.relatedPostSlugs || []).filter((slug) => input.ctx.postSlugs.has(slug));
        fixed = true;
      } catch (error) {
        fixError = error instanceof Error ? error.message : String(error);
      }
    }
    if (!fixed) {
      return { state: 'held', reason: `fix failed: ${fixError}`, post, ledger, reports };
    }
  }
}
