/**
 * generate → review → (fix → review)* → approved | held
 * Pure orchestration: model calls, fetches and filesystem views are injected
 * so tests run offline and deterministically.
 */
import { MAX_REVIEW_ROUNDS_DEFAULT } from './rubric.mjs';
import { reviewPost } from './review.mjs';
import { afterReview } from './state.mjs';

const SOURCE_CHARS_FOR_PROMPT = 12_000;

/**
 * @param {{ sourceHints?: string[], docsHints?: string[] }} item
 * @param {(url: string) => Promise<{ status: number | null, text: string }>} fetchSource
 */
export async function gatherSources(item, fetchSource) {
  const urls = [...new Set([...(item.docsHints || []), ...(item.sourceHints || [])])];
  /** @type {Record<string, string>} */
  const out = {};
  for (const url of urls) {
    const res = await fetchSource(url);
    if (res.status === 200 && res.text) out[url] = res.text.slice(0, SOURCE_CHARS_FOR_PROMPT);
  }
  return out;
}

/** @param {any} draft */
function splitDraft(draft) {
  if (!draft || typeof draft !== 'object' || !draft.post || !Array.isArray(draft.claims)) {
    throw new Error('model draft must be { post, claims[] }');
  }
  return { post: draft.post, ledger: { slug: draft.post.slug, claims: draft.claims } };
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
    if (post.slug !== input.item.slug || post.date !== input.item.date) {
      // The schedule owns slug and date; never let the model move a post.
      post.slug = input.item.slug;
      post.date = input.item.date;
      ledger.slug = input.item.slug;
    }
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
    } catch (error) {
      reviewError = error instanceof Error ? error.message : String(error);
    }
    const decision = afterReview({ verdict: report?.verdict, error: reviewError, round, maxRounds });
    log(`round ${round}: ${report?.verdict ?? 'error'} → ${decision.next} (${decision.reason})`);
    if (decision.next !== 'fixing') {
      return { state: decision.next, reason: decision.reason, post, ledger, reports };
    }
    try {
      ({ post, ledger } = splitDraft(await input.models.fix({ post, ledger, report, sources })));
      post.slug = input.item.slug;
      post.date = input.item.date;
      ledger.slug = input.item.slug;
    } catch (error) {
      return { state: 'held', reason: `fix failed: ${error instanceof Error ? error.message : String(error)}`, post, ledger, reports };
    }
  }
}
