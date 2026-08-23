import { applicationServicesFollowAlong } from './followAlong/applicationServices';
import { developerPlatformFollowAlong } from './followAlong/developerPlatform';
import type { FollowAlongLesson } from './followAlong/types';

export type {
  FollowAlongDoc,
  FollowAlongLesson,
  FollowAlongRole,
  FollowAlongStep,
} from './followAlong/types';
export { t } from './followAlong/helpers';

const byId = new Map<string, FollowAlongLesson>(
  [...applicationServicesFollowAlong, ...developerPlatformFollowAlong].map((lesson) => [
    lesson.lessonId,
    lesson,
  ]),
);

export function getFollowAlongLesson(lessonId: string): FollowAlongLesson | undefined {
  return byId.get(lessonId);
}
