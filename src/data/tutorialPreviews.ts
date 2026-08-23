import type { CloudflareResource } from './cloudflareResources';
import { applyTutorialKm } from './tutorialPreviews/applyTutorialKm';
import previewsJson from './tutorialPreviews.data.json';

export type TutorialContentBlock =
  | { type: 'paragraph'; html: string; htmlKm?: string }
  | { type: 'note'; html: string; htmlKm?: string }
  | { type: 'list'; ordered: boolean; items: string[]; itemsKm?: string[] }
  | { type: 'code'; language: string; code: string };

export type TutorialSection = {
  anchor: string;
  title: string;
  titleVi?: string;
  titleKm?: string;
  level: 2 | 3;
  blocks: TutorialContentBlock[];
  docUrl: string;
  relatedLinks: Array<{ label: string; href: string }>;
  summaryVi?: string;
  summaryEn?: string;
  summaryKm?: string;
};

export type TutorialPreview = {
  path: string;
  slug: string;
  title: string;
  titleVi?: string;
  titleKm?: string;
  url: string;
  contentType: string;
  track: string;
  summaryEn: string;
  summaryKm?: string;
  introEn: string;
  introKm?: string;
  prerequisites: string[];
  stepTitles: string[];
  objectives: string[];
  lastReviewed: string;
  summaryVi: string;
  explanationVi: string;
  notesVi: string[];
  notesEn?: string[];
  notesKm?: string[];
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
  const preview =
    previewsByPath[key.replace(/\/$/, '')] ?? previewsByPath[`${key.replace(/\/$/, '')}/`];
  return preview ? applyTutorialKm(preview) : undefined;
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
  return Object.values(previewsByPath)
    .map(applyTutorialKm)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getTutorialPreviewPaths(): string[] {
  return Object.keys(previewsByPath).map((p) => p.replace(/^\//, '').replace(/\/$/, ''));
}

export function getTutorialDisplayTitle(
  preview: Pick<TutorialPreview, 'title' | 'titleVi' | 'titleKm'>,
  lang: 'vi' | 'en' | 'km' = 'vi',
): string {
  if (lang === 'vi' && preview.titleVi) return preview.titleVi;
  if (lang === 'km' && preview.titleKm) return preview.titleKm;
  return preview.title;
}

export function getTutorialSectionDisplayTitle(
  section: Pick<TutorialSection, 'title' | 'titleVi' | 'titleKm'>,
  lang: 'vi' | 'en' | 'km' = 'vi',
): string {
  if (lang === 'vi' && section.titleVi) return section.titleVi;
  if (lang === 'km' && section.titleKm) return section.titleKm;
  return section.title;
}

/** English section blurb — uses summaryEn when present, else a concise default from the section title. */
export function getTutorialSectionSummaryEn(
  section: Pick<TutorialSection, 'title' | 'summaryVi' | 'summaryEn'>,
): string | undefined {
  if (section.summaryEn) return section.summaryEn;
  if (!section.summaryVi) return undefined;
  return `Read the "${section.title}" section below — open the official docs link for full screenshots and configuration tabs.`;
}

export function getTutorialTitleForResource(
  resource: CloudflareResource,
  lang: 'vi' | 'en' | 'km' = 'vi',
): string {
  const preview = getTutorialPreviewForResource(resource);
  if (preview) return getTutorialDisplayTitle(preview, lang);
  return resource.title;
}
