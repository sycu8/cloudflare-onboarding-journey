/** Must match `sectionOverlayKey` in src/data/tutorialPreviews/applyTutorialKm.ts */
export function sectionOverlayKey(sections, sectionIndex) {
  const anchor = sections[sectionIndex].anchor;
  let prior = 0;
  for (let j = 0; j < sectionIndex; j++) {
    if (sections[j].anchor === anchor) prior++;
  }
  return prior === 0 ? anchor : `${anchor}#${prior + 1}`;
}
