export const TRACK_PROGRESS_KEY = 'cfhub_track_progress';
export const TRACK_PROGRESS_EVENT = 'cfhub-track-progress';

export type TrackProgressMap = Record<string, boolean>;

export function loadTrackProgress(): TrackProgressMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TRACK_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TrackProgressMap;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveTrackProgress(progress: TrackProgressMap) {
  localStorage.setItem(TRACK_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(TRACK_PROGRESS_EVENT));
}

export function toggleTrackProgress(key: string): TrackProgressMap {
  const progress = loadTrackProgress();
  if (progress[key]) delete progress[key];
  else progress[key] = true;
  saveTrackProgress(progress);
  return progress;
}
