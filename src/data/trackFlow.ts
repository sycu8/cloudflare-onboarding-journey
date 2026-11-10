import type { LocalizedString } from '../i18n/types';
import type { Track } from './tracks';
import { getFollowAlongLesson } from './followAlongLessons';
import { getTrackLessons, type FlatTrackLesson } from './trackLessons';
import { developerLabHubPath, developerLabTracks, type DeveloperLabTrack } from './developerLabs';
import { firstSentence, inferLessonKind, type LessonKind } from './lessonKind';

export type FlowItem = {
  key: string;
  kind: LessonKind;
  href: string;
  title: LocalizedString;
  summary?: LocalizedString;
  moduleId: string;
  moduleTitle: LocalizedString;
  duration?: LocalizedString;
  /** Lesson or official-lab keys this item should follow. */
  prerequisiteIds: string[];
};

type LessonExtras = FlatTrackLesson & {
  kind?: LessonKind;
  duration?: LocalizedString;
  prerequisites?: string[];
  dependsOn?: string[];
};

type LabExtras = DeveloperLabTrack & { dependsOn?: string[] };

function lessonDuration(lesson: LessonExtras): LocalizedString | undefined {
  if (lesson.duration) return lesson.duration;
  return getFollowAlongLesson(lesson.id)?.time;
}

function lessonPrereqIds(lesson: LessonExtras, prev: LessonExtras | undefined): string[] {
  const explicit = lesson.prerequisites?.length ? lesson.prerequisites : lesson.dependsOn;
  if (explicit?.length) return [...explicit];
  const kind = inferLessonKind(lesson.moduleId, lesson.kind);
  if (kind === 'lab-hub' && prev && inferLessonKind(prev.moduleId, prev.kind) === 'knowledge') {
    return [prev.id];
  }
  return [];
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

/** Official labs attach after the last lesson of their first hub module until dependsOn is set. */
function labsForPrimaryModule(moduleId: string): LabExtras[] {
  return (developerLabTracks as LabExtras[]).filter((lab) => {
    if (lab.dependsOn?.length) return false;
    return lab.hubModuleIds[0] === moduleId;
  });
}

export function getTrackFlow(trackSlug: Track['slug']): FlowItem[] {
  const lessons = getTrackLessons(trackSlug) as LessonExtras[];
  const items: FlowItem[] = [];

  lessons.forEach((lesson, index) => {
    const prev = lessons[index - 1];
    const kind = inferLessonKind(lesson.moduleId, lesson.kind);
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
      duration: lessonDuration(lesson),
      prerequisiteIds: lessonPrereqIds(lesson, prev),
    });

    const next = lessons[index + 1];
    const endOfModule = !next || next.moduleId !== lesson.moduleId;
    const attached = [
      ...labsExplicitlyAfter(lesson.id),
      ...(endOfModule ? labsForPrimaryModule(lesson.moduleId) : []),
    ];

    for (const lab of attached) {
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
        duration: officialDuration(lab),
        prerequisiteIds: lab.dependsOn?.length ? [...lab.dependsOn] : [lesson.id],
      });
    }
  });

  return items;
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
    (item) => item.kind !== 'knowledge' && item.prerequisiteIds.includes(lessonId),
  );
}
