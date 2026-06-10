import type { CloudflareResource } from './cloudflareResources';
import previewsJson from './tutorialPreviews.data.json';

export type TutorialContentBlock =
  | { type: 'paragraph'; html: string }
  | { type: 'note'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string };

export type TutorialSection = {
  anchor: string;
  title: string;
  titleVi?: string;
  level: 2 | 3;
  blocks: TutorialContentBlock[];
  docUrl: string;
  relatedLinks: Array<{ label: string; href: string }>;
  summaryVi?: string;
};

export type TutorialPreview = {
  path: string;
  slug: string;
  title: string;
  titleVi?: string;
  url: string;
  contentType: string;
  track: string;
  summaryEn: string;
  introEn: string;
  prerequisites: string[];
  stepTitles: string[];
  objectives: string[];
  lastReviewed: string;
  summaryVi: string;
  explanationVi: string;
  notesVi: string[];
  stepsVi: string[];
  estimatedMinutes: number;
  sections?: TutorialSection[];
  crawledAt: string;
};

const previewsByPath = previewsJson as Record<string, TutorialPreview>;

export const TUTORIAL_PREVIEWS_LAST_SYNCED =
  Object.values(previewsByPath)
    .map((p) => p.crawledAt)
    .sort()
    .at(-1) ?? '';

/** Hub URL for a resource preview page (path-based, unique). */
export function getTutorialHubPath(resource: Pick<CloudflareResource, 'path'>): string {
  const normalized = resource.path.replace(/^\//, '').replace(/\/$/, '');
  return `/tutorials/${normalized}/`;
}

export function getTutorialPreviewByPath(path: string): TutorialPreview | undefined {
  const key = path.startsWith('/') ? path : `/${path}`;
  return previewsByPath[key.replace(/\/$/, '')] ?? previewsByPath[`${key.replace(/\/$/, '')}/`];
}

export function getTutorialPreviewForResource(
  resource: CloudflareResource,
): TutorialPreview | undefined {
  return getTutorialPreviewByPath(resource.path);
}

export function hasTutorialPreview(resource: Pick<CloudflareResource, 'path'>): boolean {
  return Boolean(getTutorialPreviewByPath(resource.path));
}

export function getAllTutorialPreviews(): TutorialPreview[] {
  return Object.values(previewsByPath).sort((a, b) => a.title.localeCompare(b.title));
}

export function getTutorialPreviewPaths(): string[] {
  return Object.keys(previewsByPath).map((p) => p.replace(/^\//, '').replace(/\/$/, ''));
}

export function getTutorialDisplayTitle(
  preview: Pick<TutorialPreview, 'title' | 'titleVi'>,
  lang: 'vi' | 'en' = 'vi',
): string {
  if (lang === 'vi' && preview.titleVi) return preview.titleVi;
  return preview.title;
}

export function getTutorialSectionDisplayTitle(
  section: Pick<TutorialSection, 'title' | 'titleVi'>,
  lang: 'vi' | 'en' = 'vi',
): string {
  if (lang === 'vi' && section.titleVi) return section.titleVi;
  return section.title;
}

export function getTutorialTitleForResource(
  resource: CloudflareResource,
  lang: 'vi' | 'en' = 'vi',
): string {
  const preview = getTutorialPreviewForResource(resource);
  if (preview) return getTutorialDisplayTitle(preview, lang);
  return resource.title;
}
