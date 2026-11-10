/** Lesson role in a track. Official labs live beside hub lessons in the flow. */
export type LessonKind = 'knowledge' | 'lab-hub' | 'lab-official';

/**
 * PR1 temporary tags. Knowledge: architecture intros, the Cloudflare One
 * bookends, and the whole ASA and OE tracks. AS/DP follow-along modules and
 * the remaining Cloudflare One click-through modules are hub labs.
 * An explicit `kind` on the lesson wins, so later PRs can retag without
 * changing this list.
 */
const KNOWLEDGE_MODULES = new Set(['as-0', 'dp-0', 'c1-1', 'c1-9']);

export function inferLessonKind(moduleId: string, explicit?: LessonKind): LessonKind {
  if (explicit) return explicit;
  if (KNOWLEDGE_MODULES.has(moduleId) || moduleId.startsWith('asa-') || moduleId.startsWith('oe-')) {
    return 'knowledge';
  }
  if (moduleId.startsWith('as-') || moduleId.startsWith('dp-') || moduleId.startsWith('c1-')) {
    return 'lab-hub';
  }
  return 'knowledge';
}

/** First sentence only, for track lists. Does not add claims beyond the source text. */
export function firstSentence(text: string): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  const match = trimmed.match(/^.*?[.!?។](?:\s|$)/);
  const sentence = (match ? match[0] : trimmed).trim();
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, 177).trimEnd()}…`;
}
