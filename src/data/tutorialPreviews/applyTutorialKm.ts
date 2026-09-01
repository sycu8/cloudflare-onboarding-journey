import type {
  TutorialContentBlock,
  TutorialPreview,
  TutorialSection,
} from '../tutorialPreviews';
import { prepareTutorialHtml, sanitizeTutorialHtml } from '../../lib/sanitizeTutorialHtml';
import tutorialKmJson from '../tutorialPreviews.km.json';
import tutorialViJson from '../tutorialPreviews.vi.json';

type TutorialBlockOverlay = {
  type?: string;
  htmlVi?: string;
  htmlKm?: string;
  itemsVi?: string[];
  itemsKm?: string[];
  skip?: boolean;
};

type TutorialSectionOverlay = {
  titleVi?: string;
  titleKm?: string;
  summaryVi?: string;
  summaryKm?: string;
  blocks?: TutorialBlockOverlay[];
};

type TutorialLangOverlay = {
  titleVi?: string;
  titleKm?: string;
  summaryVi?: string;
  summaryKm?: string;
  introKm?: string;
  explanationVi?: string;
  notesVi?: string[];
  notesKm?: string[];
  sections?: Record<string, TutorialSectionOverlay>;
  complete?: boolean;
};

const tutorialKmByPath = tutorialKmJson as Record<string, TutorialLangOverlay>;
const tutorialViByPath = tutorialViJson as Record<string, TutorialLangOverlay>;

function sanitizeBlock(block: TutorialContentBlock): TutorialContentBlock {
  if (block.type === 'paragraph' || block.type === 'note') {
    return {
      ...block,
      html: sanitizeTutorialHtml(block.html),
      ...(block.htmlVi ? { htmlVi: prepareTutorialHtml(block.htmlVi, block.html) } : {}),
      ...(block.htmlKm ? { htmlKm: prepareTutorialHtml(block.htmlKm, block.html) } : {}),
    };
  }
  if (block.type === 'list') {
    return {
      ...block,
      items: block.items.map(sanitizeTutorialHtml),
      ...(block.itemsVi
        ? {
            itemsVi: block.itemsVi.map((item, i) => prepareTutorialHtml(item, block.items[i] ?? item) ?? item),
          }
        : {}),
      ...(block.itemsKm
        ? {
            itemsKm: block.itemsKm.map((item, i) => prepareTutorialHtml(item, block.items[i] ?? item) ?? item),
          }
        : {}),
    };
  }
  return block;
}

function mergeBlock(
  block: TutorialContentBlock,
  overlay?: TutorialBlockOverlay,
): TutorialContentBlock {
  if (!overlay || overlay.skip) return sanitizeBlock(block);
  if (block.type === 'paragraph' || block.type === 'note') {
    if (overlay.type && overlay.type !== block.type) return sanitizeBlock(block);
    return sanitizeBlock({
      ...block,
      ...(overlay.htmlVi ? { htmlVi: overlay.htmlVi } : {}),
      ...(overlay.htmlKm ? { htmlKm: overlay.htmlKm } : {}),
    });
  }
  if (block.type === 'list') {
    return sanitizeBlock({
      ...block,
      ...(overlay.itemsVi ? { itemsVi: overlay.itemsVi } : {}),
      ...(overlay.itemsKm ? { itemsKm: overlay.itemsKm } : {}),
    });
  }
  return block;
}

function mergeSection(
  section: TutorialSection,
  overlay?: TutorialSectionOverlay,
): TutorialSection {
  const blocks = section.blocks.map((block, i) => mergeBlock(block, overlay?.blocks?.[i]));
  if (!overlay) return { ...section, blocks };
  return {
    ...section,
    ...(overlay.titleVi ? { titleVi: overlay.titleVi } : {}),
    ...(overlay.titleKm ? { titleKm: overlay.titleKm } : {}),
    ...(overlay.summaryVi ? { summaryVi: overlay.summaryVi } : {}),
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

function applyOverlay(preview: TutorialPreview, overlay?: TutorialLangOverlay): TutorialPreview {
  if (!overlay) {
    return {
      ...preview,
      sections: preview.sections?.map((section) => ({
        ...section,
        blocks: section.blocks.map(sanitizeBlock),
      })),
    };
  }
  return {
    ...preview,
    ...(overlay.titleVi ? { titleVi: overlay.titleVi } : {}),
    ...(overlay.titleKm ? { titleKm: overlay.titleKm } : {}),
    ...(overlay.summaryVi ? { summaryVi: overlay.summaryVi } : {}),
    ...(overlay.summaryKm ? { summaryKm: overlay.summaryKm } : {}),
    ...(overlay.introKm ? { introKm: overlay.introKm } : {}),
    ...(overlay.explanationVi ? { explanationVi: overlay.explanationVi } : {}),
    ...(overlay.notesVi ? { notesVi: overlay.notesVi } : {}),
    ...(overlay.notesKm ? { notesKm: overlay.notesKm } : {}),
    ...(preview.sections
      ? {
          sections: preview.sections.map((section, sectionIndex) =>
            mergeSection(
              section,
              overlay.sections?.[sectionOverlayKey(preview.sections!, sectionIndex)],
            ),
          ),
        }
      : {}),
  };
}

/** Apply Vietnamese + Khmer overlays, then sanitize HTML so lang wrappers cannot leak. */
export function applyTutorialI18n(preview: TutorialPreview): TutorialPreview {
  const withVi = applyOverlay(preview, tutorialViByPath[preview.path]);
  return applyOverlay(withVi, tutorialKmByPath[preview.path]);
}

/** @deprecated Use applyTutorialI18n */
export const applyTutorialKm = applyTutorialI18n;
