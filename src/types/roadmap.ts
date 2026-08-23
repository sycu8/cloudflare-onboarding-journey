export type ContentRoadmapLevel = 'foundation' | 'beginner' | 'intermediate';

export type ContentRoadmapFilter =
  | 'foundation'
  | 'dns'
  | 'performance'
  | 'security'
  | 'developer'
  | 'zero-trust';

export type ContentRoadmapTopic = {
  id: string;
  titleVi: string;
  titleEn?: string;
  titleKm?: string;
  level: ContentRoadmapLevel;
  estimatedMinutes: number;
  summaryVi: string;
  summaryEn?: string;
  summaryKm?: string;
  whyItMattersVi: string;
  whyItMattersEn?: string;
  whyItMattersKm?: string;
  relatedTutorialPaths?: string[];
  prerequisites: string[];
  relatedCloudflareProducts: string[];
  relatedExistingRoutes: string[];
  sourceUrls: string[];
  filterTags: ContentRoadmapFilter[];
  suggestedExerciseVi?: string;
  suggestedExerciseEn?: string;
  suggestedExerciseKm?: string;
  commonMistakesVi?: string[];
  commonMistakesEn?: string[];
  commonMistakesKm?: string[];
  /** General Internet/network knowledge (not Cloudflare-specific). */
  isGeneralKnowledge?: boolean;
};

export type ContentRoadmapStage = {
  id: string;
  titleVi: string;
  titleEn?: string;
  titleKm?: string;
  descriptionVi: string;
  descriptionEn?: string;
  descriptionKm?: string;
  learnerOutcomeVi: string;
  learnerOutcomeEn?: string;
  learnerOutcomeKm?: string;
  suggestedRoleIds?: RoleId[];
  filterTags: ContentRoadmapFilter[];
  topics: ContentRoadmapTopic[];
};

export type RoleId =
  | 'sales'
  | 'solution-engineer'
  | 'developer'
  | 'it-admin'
  | 'startup-founder'
  | 'student';

export type RoleRoadmapStep = {
  id: string;
  week: number;
  titleVi: string;
  titleEn?: string;
  titleKm?: string;
  objectiveVi: string;
  objectiveEn?: string;
  objectiveKm?: string;
  topics: string[];
  topicsEn?: string[];
  topicsKm?: string[];
  existingRoutes: string[];
  tutorialPaths?: string[];
  recommendedProducts: string[];
  exercisesVi: string[];
  exercisesEn?: string[];
  exercisesKm?: string[];
  expectedOutcomeVi: string;
  expectedOutcomeEn?: string;
  expectedOutcomeKm?: string;
  sourceUrls: string[];
};

export type RoleRoadmap = {
  roleId: RoleId;
  roleNameVi: string;
  roleNameEn?: string;
  roleNameKm?: string;
  descriptionVi: string;
  descriptionEn?: string;
  descriptionKm?: string;
  bestForVi: string[];
  bestForEn?: string[];
  bestForKm?: string[];
  totalWeeks: number;
  startingLevel: 'zero' | 'basic' | 'technical';
  finalOutcomeVi: string;
  finalOutcomeEn?: string;
  finalOutcomeKm?: string;
  primaryTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'mixed';
  steps: RoleRoadmapStep[];
};
