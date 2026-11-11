import type { LocalizedString } from '../i18n/types';
import { tracks, type Track } from './tracks';
import { getFollowAlongLesson } from './followAlongLessons';
import { getTrackLessons, type FlatTrackLesson } from './trackLessons';
import { developerLabHubPath, developerLabTracks, type DeveloperLabTrack } from './developerLabs';
import { firstSentence, inferLessonKind, parseDurationMinutes, type LessonKind } from './lessonKind';

export type FlowItem = {
  key: string;
  kind: LessonKind;
  href: string;
  title: LocalizedString;
  summary?: LocalizedString;
  moduleId: string;
  moduleTitle: LocalizedString;
  duration?: LocalizedString;
  /** Minutes this item contributes to the single track total. */
  minutes: number;
  /** Lesson ids this item should follow. Empty on the first lesson of a track. */
  prerequisiteIds: string[];
  isTrackStart: boolean;
};

type LessonExtras = FlatTrackLesson & {
  kind?: LessonKind;
  duration?: LocalizedString;
  prerequisites?: string[];
  dependsOn?: string[];
};

type LabExtras = DeveloperLabTrack & { dependsOn?: string[] };

function moduleDuration(trackSlug: string, moduleId: string): LocalizedString | undefined {
  const track = tracks.find((item) => item.slug === trackSlug);
  return track?.modules.find((mod) => mod.id === moduleId)?.duration;
}

/** Own time, else follow-along time, else the part's duration. */
function lessonDuration(lesson: LessonExtras): LocalizedString | undefined {
  if (lesson.duration && parseDurationMinutes(lesson.duration.vi) != null) return lesson.duration;
  const followAlong = getFollowAlongLesson(lesson.id)?.time;
  if (followAlong && parseDurationMinutes(followAlong.vi) != null) return followAlong;
  const part = moduleDuration(lesson.trackSlug, lesson.moduleId);
  if (part && parseDurationMinutes(part.vi) != null) return part;
  return lesson.duration ?? followAlong ?? part;
}

function lessonPrereqIds(lesson: LessonExtras, earlier: LessonExtras[]): string[] {
  const explicit = lesson.prerequisites?.length ? lesson.prerequisites : lesson.dependsOn;
  if (explicit?.length) return [...explicit];
  const kind = inferLessonKind(lesson.moduleId, lesson.kind);
  if (kind !== 'lab-hub') return [];
  for (let index = earlier.length - 1; index >= 0; index -= 1) {
    const candidate = earlier[index];
    if (inferLessonKind(candidate.moduleId, candidate.kind) === 'knowledge') return [candidate.id];
  }
  return [];
}

function shareMinutes(total: number, count: number, index: number): number {
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return base + (index < remainder ? 1 : 0);
}

function shareLabel(minutes: number): LocalizedString {
  return { vi: `~${minutes} phút`, en: `~${minutes} min` };
}

function officialDuration(lab: DeveloperLabTrack): LocalizedString | undefined {
  if (!lab.labs.length || lab.labs.some((step) => step.durationMin == null)) return undefined;
  const mins = lab.labs.reduce((sum, step) => sum + (step.durationMin ?? 0), 0);
  if (!mins) return undefined;
  return { vi: `~${mins} phút`, en: `~${mins} min` };
}

function labsExplicitlyAfter(lessonId: string): LabExtras[] {
  return (developerLabTracks as LabExtras[]).filter(
    (lab) => !!lab.dependsOn?.length && lab.dependsOn[lab.dependsOn.length - 1] === lessonId,
  );
}

/** Official labs with no dependsOn sit after the last lesson of their first hub module. */
function labsForPrimaryModule(moduleId: string): LabExtras[] {
  return (developerLabTracks as LabExtras[]).filter((lab) => {
    if (lab.dependsOn?.length) return false;
    return lab.hubModuleIds[0] === moduleId;
  });
}

export function getTrackFlow(trackSlug: Track['slug']): FlowItem[] {
  const lessons = getTrackLessons(trackSlug) as LessonExtras[];
  const items: FlowItem[] = [];
  const moduleFallbackCounts = new Map<string, number>();

  lessons.forEach((lesson) => {
    const own =
      (lesson.duration && parseDurationMinutes(lesson.duration.vi) != null) ||
      (getFollowAlongLesson(lesson.id)?.time &&
        parseDurationMinutes(getFollowAlongLesson(lesson.id)!.time.vi) != null);
    if (!own) {
      moduleFallbackCounts.set(lesson.moduleId, (moduleFallbackCounts.get(lesson.moduleId) ?? 0) + 1);
    }
  });
  const moduleFallbackSeen = new Map<string, number>();

  lessons.forEach((lesson, index) => {
    const kind = inferLessonKind(lesson.moduleId, lesson.kind);
    const resolved = lessonDuration(lesson);
    const partMinutes = parseDurationMinutes(moduleDuration(lesson.trackSlug, lesson.moduleId)?.vi);
    const usesModule = !(
      (lesson.duration && parseDurationMinutes(lesson.duration.vi) != null) ||
      (getFollowAlongLesson(lesson.id)?.time &&
        parseDurationMinutes(getFollowAlongLesson(lesson.id)!.time.vi) != null)
    );
    let minutes = parseDurationMinutes(resolved?.vi) ?? 0;
    let duration = resolved;
    if (usesModule && partMinutes != null) {
      const count = moduleFallbackCounts.get(lesson.moduleId) ?? 1;
      const seen = moduleFallbackSeen.get(lesson.moduleId) ?? 0;
      minutes = shareMinutes(partMinutes, count, seen);
      moduleFallbackSeen.set(lesson.moduleId, seen + 1);
      duration = shareLabel(minutes);
    }
    items.push({
      key: lesson.id,
      kind,
      href: `/tracks/${lesson.trackSlug}/${lesson.id}/`,
      title: lesson.title,
      summary: {
        vi: firstSentence(lesson.body.vi),
        en: firstSentence(lesson.body.en),
        km: lesson.body.km ? firstSentence(lesson.body.km) : undefined,
      },
      moduleId: lesson.moduleId,
      moduleTitle: lesson.moduleTitle,
      duration,
      minutes,
      prerequisiteIds: lessonPrereqIds(lesson, lessons.slice(0, index)),
      isTrackStart: index === 0,
    });

    const next = lessons[index + 1];
    const endOfModule = !next || next.moduleId !== lesson.moduleId;
    const attached = [
      ...labsExplicitlyAfter(lesson.id),
      ...(endOfModule ? labsForPrimaryModule(lesson.moduleId) : []),
    ];

    for (const lab of attached) {
      const durationLabel = officialDuration(lab);
      items.push({
        key: `official:${lab.id}`,
        kind: 'lab-official',
        href: developerLabHubPath(lab.id),
        title: lab.title,
        summary: {
          vi: firstSentence(lab.description.vi),
          en: firstSentence(lab.description.en),
          km: lab.description.km ? firstSentence(lab.description.km) : undefined,
        },
        moduleId: lesson.moduleId,
        moduleTitle: lesson.moduleTitle,
        duration: durationLabel,
        minutes: parseDurationMinutes(durationLabel?.vi) ?? 0,
        prerequisiteIds: lab.dependsOn?.length ? [...lab.dependsOn] : [lesson.id],
        isTrackStart: false,
      });
    }
  });

  return items;
}

/** One total for the index, the track header, and the sidebar. */
export function sumFlowMinutes(items: FlowItem[]): number {
  return items.reduce((sum, item) => sum + (item.minutes || 0), 0);
}

/** Badge text with the space inside one string, so HTML minification cannot drop it. */
export function estimateBadge(duration: LocalizedString): LocalizedString {
  const strip = (value: string) => value.replace(/^~\s*/, '');
  return {
    vi: `Khoảng ${strip(duration.vi)}`,
    en: `About ${strip(duration.en)}`,
    km: `About ${strip(duration.km ?? duration.en)}`,
  };
}

export function getFlowNeighbors(trackSlug: Track['slug'], key: string) {
  const flow = getTrackFlow(trackSlug);
  const index = flow.findIndex((item) => item.key === key);
  if (index < 0) return { prev: undefined, next: undefined, current: undefined, flow };
  return {
    prev: flow[index - 1],
    next: flow[index + 1],
    current: flow[index],
    flow,
  };
}

/** Hub and official labs that list this lesson as a prerequisite. */
export function labsAfterLesson(trackSlug: Track['slug'], lessonId: string): FlowItem[] {
  return getTrackFlow(trackSlug).filter(
    (item) => item.kind !== 'knowledge' && item.kind !== 'reference' && item.prerequisiteIds.includes(lessonId),
  );
}
