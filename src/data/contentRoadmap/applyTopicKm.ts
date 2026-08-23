import type { ContentRoadmapStage, ContentRoadmapTopic } from '../../types/roadmap';
import { topicKmById } from './topicKm';

export function applyTopicKm(topic: ContentRoadmapTopic): ContentRoadmapTopic {
  const km = topicKmById[topic.id];
  if (!km) return topic;
  return { ...topic, ...km };
}

export function applyStageTopicKm(stage: ContentRoadmapStage): ContentRoadmapStage {
  return {
    ...stage,
    topics: stage.topics.map(applyTopicKm),
  };
}
