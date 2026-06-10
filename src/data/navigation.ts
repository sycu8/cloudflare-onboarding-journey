/** Navigation labels — Vietnamese-first, short copy for mobile */
export type NavLabel = { vi: string; en: string };

export type NavItem = {
  href: string;
  label: NavLabel;
};

/** Desktop top bar — 6 links max */
export const primaryNavItems: NavItem[] = [
  { href: '/start-here', label: { vi: 'Bắt đầu', en: 'Start' } },
  { href: '/cloudflare-101', label: { vi: '101', en: '101' } },
  { href: '/tracks', label: { vi: 'Lộ trình', en: 'Tracks' } },
  { href: '/use-cases/', label: { vi: 'Tình huống', en: 'Use cases' } },
  { href: '/resources', label: { vi: 'Tài nguyên', en: 'Resources' } },
  { href: '/workshop', label: { vi: 'Hội thảo', en: 'Workshop' } },
];

/** Mobile drawer — main links (always visible) */
export const mobileNavPrimary: NavItem[] = [
  { href: '/start-here', label: { vi: 'Bắt đầu', en: 'Start' } },
  { href: '/cloudflare-101', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  { href: '/tracks', label: { vi: 'Lộ trình học', en: 'Tracks' } },
  { href: '/use-cases/', label: { vi: 'Tình huống', en: 'Use cases' } },
  { href: '/resources', label: { vi: 'Tài nguyên', en: 'Resources' } },
];

/** Mobile drawer — collapsed under "Thêm" */
export const mobileNavMore: NavItem[] = [
  { href: '/content-roadmap', label: { vi: 'Content Roadmap', en: 'Content Roadmap' } },
  { href: '/roadmaps', label: { vi: 'Roadmap vai trò', en: 'Role roadmaps' } },
  { href: '/first-week', label: { vi: 'Tuần đầu (7 ngày)', en: 'First week' } },
  { href: '/choose-your-path', label: { vi: 'Chọn lộ trình', en: 'Choose path' } },
  { href: '/workshop', label: { vi: 'Hội thảo', en: 'Workshop' } },
  { href: '/search', label: { vi: 'Tìm kiếm', en: 'Search' } },
  { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Checklist', en: 'Checklist' } },
  { href: '/quiz/beginner-readiness', label: { vi: 'Bài kiểm tra', en: 'Quiz' } },
  { href: '/glossary', label: { vi: 'Thuật ngữ', en: 'Glossary' } },
  { href: '/changelog', label: { vi: 'Changelog', en: 'Changelog' } },
  { href: '/status', label: { vi: 'System status', en: 'System status' } },
];

/** @deprecated Use primaryNavItems — kept for any legacy imports */
export const navItems = [
  ...primaryNavItems,
  { href: '/first-week', label: { vi: 'Tuần đầu', en: 'First week' } },
  { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Checklist', en: 'Checklist' } },
  { href: '/quiz/beginner-readiness', label: { vi: 'Bài kiểm tra', en: 'Quiz' } },
  { href: '/glossary', label: { vi: 'Thuật ngữ', en: 'Glossary' } },
] as const;

export const mobileNavItems = [...mobileNavPrimary, ...mobileNavMore] as const;
