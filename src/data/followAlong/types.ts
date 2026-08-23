import type { LocalizedString } from '../../i18n/types';

export type FollowAlongRole = 'required' | 'recommended' | 'optional' | 'deep-dive' | 'reference';

export type FollowAlongStep = {
  action: LocalizedString;
  see?: LocalizedString;
  enter?: LocalizedString;
  click?: LocalizedString;
  checkpoint?: LocalizedString;
};

export type FollowAlongDoc = {
  label: LocalizedString;
  url: string;
};

export type FollowAlongLesson = {
  lessonId: string;
  role: FollowAlongRole;
  goal: LocalizedString;
  who: LocalizedString;
  time: LocalizedString;
  finishWith: LocalizedString;
  beforeYouBegin: LocalizedString;
  planNote?: LocalizedString;
  intro?: LocalizedString;
  steps: FollowAlongStep[];
  watchOuts: LocalizedString[];
  tips: LocalizedString[];
  officialDocs: FollowAlongDoc[];
};
