/** Lesson role in a track. Official labs live beside hub lessons in the flow. */
export type LessonKind = 'knowledge' | 'lab-hub' | 'lab-official' | 'reference';

/**
 * Temporary tags. Knowledge: architecture intros, the Cloudflare One
 * bookends, and the whole ASA and OE tracks. Golden-rule / runbook modules
 * are reference, not labs. Other AS/DP/C1 modules are hub labs.
 * An explicit `kind` on a lesson wins.
 */
const KNOWLEDGE_MODULES = new Set(['as-0', 'dp-0', 'c1-1', 'c1-9']);
const REFERENCE_MODULES = new Set(['as-7', 'dp-7']);

export function inferLessonKind(moduleId: string, explicit?: LessonKind): LessonKind {
  if (explicit) return explicit;
  if (REFERENCE_MODULES.has(moduleId)) return 'reference';
  if (KNOWLEDGE_MODULES.has(moduleId) || moduleId.startsWith('asa-') || moduleId.startsWith('oe-')) {
    return 'knowledge';
  }
  if (moduleId.startsWith('as-') || moduleId.startsWith('dp-') || moduleId.startsWith('c1-')) {
    return 'lab-hub';
  }
  return 'knowledge';
}

/** First integer in a duration string. Shared by the track total and the tests. */
export function parseDurationMinutes(text?: string): number | undefined {
  if (!text) return undefined;
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

/** First sentence only, for track lists. Does not add claims beyond the source text. */
export function firstSentence(text: string): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  const match = trimmed.match(/^.*?[.!?។](?:\s|$)/);
  const sentence = (match ? match[0] : trimmed).trim();
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, 177).trimEnd()}…`;
}
