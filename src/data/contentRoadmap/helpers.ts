import type { ContentRoadmapFilter, ContentRoadmapLevel, ContentRoadmapTopic } from '../../types/roadmap';

export const SRC = {
  fundamentals: 'https://developers.cloudflare.com/fundamentals/',
  learning: 'https://www.cloudflare.com/learning/',
  learningDns: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
  learningCdn: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/',
  learningDdos: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/',
  learningSsl: 'https://www.cloudflare.com/learning/ssl/what-is-ssl/',
  dns: 'https://developers.cloudflare.com/dns/',
  cache: 'https://developers.cloudflare.com/cache/',
  ssl: 'https://developers.cloudflare.com/ssl/',
  waf: 'https://developers.cloudflare.com/waf/',
  ddos: 'https://developers.cloudflare.com/ddos-protection/',
  bots: 'https://developers.cloudflare.com/bots/',
  workers: 'https://developers.cloudflare.com/workers/',
  pages: 'https://developers.cloudflare.com/pages/',
  one: 'https://developers.cloudflare.com/cloudflare-one/',
  zeroTrust: 'https://developers.cloudflare.com/cloudflare-one/zero-trust/',
  arch: 'https://developers.cloudflare.com/reference-architecture/',
  mdnHttp: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
  mdnIp: 'https://developer.mozilla.org/en-US/docs/Glossary/IP_address',
} as const;

export function topic(
  id: string,
  titleVi: string,
  titleEn: string,
  summaryVi: string,
  whyItMattersVi: string,
  opts: {
    level?: ContentRoadmapLevel;
    estimatedMinutes?: number;
    summaryEn?: string;
    whyItMattersEn?: string;
    prerequisites?: string[];
    relatedCloudflareProducts?: string[];
    relatedExistingRoutes?: string[];
    relatedTutorialPaths?: string[];
    sourceUrls: string[];
    filterTags: ContentRoadmapFilter[];
    suggestedExerciseVi?: string;
    suggestedExerciseEn?: string;
    commonMistakesVi?: string[];
    commonMistakesEn?: string[];
    isGeneralKnowledge?: boolean;
  },
): ContentRoadmapTopic {
  return {
    id,
    titleVi,
    titleEn,
    level: opts.level ?? 'foundation',
    estimatedMinutes: opts.estimatedMinutes ?? 8,
    summaryVi,
    summaryEn: opts.summaryEn,
    whyItMattersVi,
    whyItMattersEn: opts.whyItMattersEn,
    prerequisites: opts.prerequisites ?? [],
    relatedCloudflareProducts: opts.relatedCloudflareProducts ?? [],
    relatedExistingRoutes: opts.relatedExistingRoutes ?? [],
    relatedTutorialPaths: opts.relatedTutorialPaths,
    sourceUrls: opts.sourceUrls,
    filterTags: opts.filterTags,
    suggestedExerciseVi: opts.suggestedExerciseVi,
    suggestedExerciseEn: opts.suggestedExerciseEn,
    commonMistakesVi: opts.commonMistakesVi,
    commonMistakesEn: opts.commonMistakesEn,
    isGeneralKnowledge: opts.isGeneralKnowledge,
  };
}
