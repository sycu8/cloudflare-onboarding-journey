import { useEffect } from 'react';
import { bindRoadmapTopicToggles } from './RoadmapProgress';

export default function RoadmapTopicBinder() {
  useEffect(() => {
    bindRoadmapTopicToggles();
  }, []);
  return null;
}
