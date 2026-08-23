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
  level: ContentRoadmapLevel;
  estimatedMinutes: number;
  summaryVi: string;
  summaryEn?: string;
  whyItMattersVi: string;
  whyItMattersEn?: string;
  relatedTutorialPaths?: string[];
  prerequisites: string[];
  relatedCloudflareProducts: string[];
  relatedExistingRoutes: string[];
  sourceUrls: string[];
  filterTags: ContentRoadmapFilter[];
  suggestedExerciseVi?: string;
  commonMistakesVi?: string[];
  /** General Internet/network knowledge (not Cloudflare-specific). */
  isGeneralKnowledge?: boolean;
};

export type ContentRoadmapStage = {
  id: string;
  titleVi: string;
  titleEn?: string;
  descriptionVi: string;
  descriptionEn?: string;
  learnerOutcomeVi: string;
  learnerOutcomeEn?: string;
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
  objectiveVi: string;
  objectiveEn?: string;
  topics: string[];
  existingRoutes: string[];
  tutorialPaths?: string[];
  recommendedProducts: string[];
  exercisesVi: string[];
  exercisesEn?: string[];
  expectedOutcomeVi: string;
  expectedOutcomeEn?: string;
  sourceUrls: string[];
};

export type RoleRoadmap = {
  roleId: RoleId;
  roleNameVi: string;
  roleNameEn?: string;
  descriptionVi: string;
  descriptionEn?: string;
  bestForVi: string[];
  bestForEn?: string[];
  totalWeeks: number;
  startingLevel: 'zero' | 'basic' | 'technical';
  finalOutcomeVi: string;
  finalOutcomeEn?: string;
  primaryTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'mixed';
  steps: RoleRoadmapStep[];
};
