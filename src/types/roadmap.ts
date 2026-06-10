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
  whyItMattersVi: string;
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
  learnerOutcomeVi: string;
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
  topics: string[];
  existingRoutes: string[];
  recommendedProducts: string[];
  exercisesVi: string[];
  expectedOutcomeVi: string;
  sourceUrls: string[];
};

export type RoleRoadmap = {
  roleId: RoleId;
  roleNameVi: string;
  roleNameEn?: string;
  descriptionVi: string;
  bestForVi: string[];
  totalWeeks: number;
  startingLevel: 'zero' | 'basic' | 'technical';
  finalOutcomeVi: string;
  primaryTrack: 'application-services' | 'developer-platform' | 'cloudflare-one' | 'mixed';
  steps: RoleRoadmapStep[];
};
