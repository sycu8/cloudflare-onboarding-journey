import type { ContentRoadmapStage, ContentRoadmapTopic } from '../../types/roadmap';
import { topicEnById } from './topicEn';

export function applyTopicEn(topic: ContentRoadmapTopic): ContentRoadmapTopic {
  const en = topicEnById[topic.id];
  if (!en) return topic;
  return { ...topic, ...en };
}

export function applyStageTopicEn(stage: ContentRoadmapStage): ContentRoadmapStage {
  return {
    ...stage,
    topics: stage.topics.map(applyTopicEn),
  };
}
