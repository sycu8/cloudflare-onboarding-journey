import type {
  TutorialContentBlock,
  TutorialPreview,
  TutorialSection,
} from '../tutorialPreviews';
import tutorialKmJson from '../tutorialPreviews.km.json';

type TutorialKmBlockOverlay =
  | { type: 'paragraph' | 'note'; htmlKm?: string; skip?: boolean }
  | { type: 'list'; ordered?: boolean; itemsKm?: string[]; skip?: boolean }
  | { type: 'code'; skip?: boolean };

type TutorialKmSectionOverlay = {
  titleKm?: string;
  summaryKm?: string;
  blocks?: TutorialKmBlockOverlay[];
};

type TutorialKmOverlay = {
  titleKm?: string;
  summaryKm?: string;
  introKm?: string;
  notesKm?: string[];
  sections?: Record<string, TutorialKmSectionOverlay>;
  complete?: boolean;
};

const tutorialKmByPath = tutorialKmJson as Record<string, TutorialKmOverlay>;

function mergeBlock(
  block: TutorialContentBlock,
  overlay?: TutorialKmBlockOverlay,
): TutorialContentBlock {
  if (!overlay || overlay.skip) return block;
  if (block.type === 'paragraph' || block.type === 'note') {
    if (overlay.type === block.type && overlay.htmlKm) {
      return { ...block, htmlKm: overlay.htmlKm };
    }
    return block;
  }
  if (block.type === 'list') {
    if (overlay.type === 'list' && overlay.itemsKm) {
      return { ...block, itemsKm: overlay.itemsKm };
    }
    return block;
  }
  return block;
}

function mergeSection(
  section: TutorialSection,
  overlay?: TutorialKmSectionOverlay,
): TutorialSection {
  if (!overlay) return section;
  const blocks = section.blocks.map((block, i) => mergeBlock(block, overlay.blocks?.[i]));
  return {
    ...section,
    ...(overlay.titleKm ? { titleKm: overlay.titleKm } : {}),
    ...(overlay.summaryKm ? { summaryKm: overlay.summaryKm } : {}),
    blocks,
  };
}

function sectionOverlayKey(sections: TutorialSection[], sectionIndex: number): string {
  const anchor = sections[sectionIndex].anchor;
  let prior = 0;
  for (let j = 0; j < sectionIndex; j++) {
    if (sections[j].anchor === anchor) prior++;
  }
  return prior === 0 ? anchor : `${anchor}#${prior + 1}`;
}

export function applyTutorialKm(preview: TutorialPreview): TutorialPreview {
  const km = tutorialKmByPath[preview.path];
  if (!km) return preview;
  return {
    ...preview,
    ...(km.titleKm ? { titleKm: km.titleKm } : {}),
    ...(km.summaryKm ? { summaryKm: km.summaryKm } : {}),
    ...(km.introKm ? { introKm: km.introKm } : {}),
    ...(km.notesKm ? { notesKm: km.notesKm } : {}),
    ...(preview.sections && km.sections
      ? {
          sections: preview.sections.map((section, sectionIndex) =>
            mergeSection(
              section,
              km.sections?.[sectionOverlayKey(preview.sections!, sectionIndex)],
            ),
          ),
        }
      : {}),
  };
}
