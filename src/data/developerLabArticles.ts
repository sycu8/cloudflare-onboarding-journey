import type { LocalizedString } from '../i18n/types';
import articlesJson from './developerLabs.articles.data.json';
import {
  type DeveloperLabId,
  type DeveloperLabTrack,
  developerLabHubPath,
  developerLabTracks,
  DEVELOPER_LABS_URL,
} from './developerLabs';
import { tLab } from './developerLabs.vi';
import { tLabKm } from './developerLabs.km';

export type LabBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'p'; html: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'callout'; kind: string; title: string; html: string }
  | { type: 'context'; items: Array<{ label: string; html: string }> }
  | { type: 'youtube'; src: string; title: string }
  | { type: 'challenge'; title: string; html: string };

export type LabArticleJson = {
  id: string;
  step: number;
  sourceUrl: string;
  durationMin: number | null;
  title: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  blocks: LabBlock[];
};

type ArticlesFile = {
  source: string;
  tracks: Record<string, LabArticleJson[]>;
};

const raw = articlesJson as ArticlesFile;

export const DEVELOPER_LABS_SOURCE = raw.source || DEVELOPER_LABS_URL;

export function loc(en: string): LocalizedString {
  return { vi: tLab(en), en, km: tLabKm(en) };
}

export function locList(items: string[]): LocalizedString[] {
  return items.map((item) => loc(item));
}

export function getLabArticles(labId: DeveloperLabId): LabArticleJson[] {
  return raw.tracks[labId] ?? [];
}

export function getLabArticle(labId: DeveloperLabId, stepId: string): LabArticleJson | undefined {
  return getLabArticles(labId).find((article) => article.id === stepId);
}

export function getLabTrackMeta(labId: DeveloperLabId): DeveloperLabTrack | undefined {
  return developerLabTracks.find((track) => track.id === labId);
}

export function getAllLabArticleParams(): Array<{ labId: DeveloperLabId; stepId: string }> {
  const out: Array<{ labId: DeveloperLabId; stepId: string }> = [];
  for (const track of developerLabTracks) {
    for (const article of getLabArticles(track.id)) {
      out.push({ labId: track.id, stepId: article.id });
    }
  }
  return out;
}

export function getAdjacentLabArticles(
  labId: DeveloperLabId,
  stepId: string,
): { prev?: LabArticleJson; next?: LabArticleJson } {
  const articles = getLabArticles(labId);
  const index = articles.findIndex((article) => article.id === stepId);
  if (index < 0) return {};
  return {
    prev: index > 0 ? articles[index - 1] : undefined,
    next: index < articles.length - 1 ? articles[index + 1] : undefined,
  };
}

export function labArticlePath(labId: DeveloperLabId, stepId?: string): string {
  return developerLabHubPath(labId, stepId);
}

export function totalLabArticleCount(): number {
  return developerLabTracks.reduce((sum, track) => sum + getLabArticles(track.id).length, 0);
}
