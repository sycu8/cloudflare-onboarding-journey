/**
 * Editorial state machine. Topics in the schedule are approved by default;
 * a post only reaches `approved` after an automated review passes.
 *
 *   scheduled → generating → reviewing ─pass→ approved → published
 *                               │ fail (round < max)
 *                               └→ fixing → reviewing …
 *                               │ fail (round = max) or any error
 *                               └→ held   (never published; editor is emailed)
 *
 * `held_by_editor` (schedule `hold: true` or kill switch) stops a slot before
 * generation. Legacy `emailed` rows are treated as `scheduled`.
 */

export const STATES = ['scheduled', 'generating', 'reviewing', 'fixing', 'approved', 'published', 'held', 'held_by_editor'];

const LEGACY = { emailed: 'scheduled', approved_email: 'scheduled', pr_opened: 'scheduled' };

/** @param {string | null | undefined} status */
export function normalizeStatus(status) {
  if (!status) return 'scheduled';
  return LEGACY[status] || (STATES.includes(status) ? status : 'scheduled');
}

/**
 * Decide what happens after one review round.
 * @param {{ verdict?: 'pass'|'fail', error?: string | null, round: number, maxRounds: number }} input
 * @returns {{ next: 'approved'|'fixing'|'held', reason: string }}
 */
export function afterReview(input) {
  if (input.error) return { next: 'held', reason: `review error: ${input.error}` };
  if (input.verdict === 'pass') return { next: 'approved', reason: 'all rubric thresholds met' };
  if (input.verdict !== 'fail') return { next: 'held', reason: 'review returned no verdict' };
  if (input.round >= input.maxRounds) return { next: 'held', reason: `still failing after ${input.round} review rounds` };
  return { next: 'fixing', reason: `round ${input.round} failed; fixing` };
}

/**
 * Whether a schedule slot may start generation.
 * @param {{ item: { hold?: boolean }, autoEnabled: boolean, alreadyPublished: boolean, requireEmailApproval: boolean, emailApproved: boolean }} input
 */
export function canStart(input) {
  if (input.alreadyPublished) return { ok: false, state: 'published', reason: 'already published' };
  if (!input.autoEnabled) return { ok: false, state: 'held_by_editor', reason: 'BLOG_AUTO_ENABLED is not true (kill switch)' };
  if (input.item?.hold) return { ok: false, state: 'held_by_editor', reason: 'schedule item has hold: true' };
  if (input.requireEmailApproval && !input.emailApproved) {
    return { ok: false, state: 'scheduled', reason: 'BLOG_REQUIRE_EMAIL_APPROVAL=true and no email APPROVE yet' };
  }
  return { ok: true, state: 'generating', reason: 'approved by default' };
}
