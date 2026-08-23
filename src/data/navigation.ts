/** Navigation labels — Vietnamese-first, short copy for mobile */
export type NavLabel = { vi: string; en: string; km?: string };

export type NavItem = {
  href: string;
  label: NavLabel;
};

/** Desktop top bar — 6 links max */
export const primaryNavItems: NavItem[] = [
  { href: '/start-here', label: { vi: 'Bắt đầu', en: 'Start', km: 'ចាប់ផ្តើម' } },
  { href: '/cloudflare-101', label: { vi: '101', en: '101', km: '101' } },
  { href: '/tracks', label: { vi: 'Lộ trình', en: 'Tracks', km: 'ផ្លូវសិក្សា' } },
  { href: '/use-cases/', label: { vi: 'Tình huống', en: 'Use cases', km: 'ករណីប្រើប្រាស់' } },
  { href: '/blog/', label: { vi: 'Blog', en: 'Blog', km: 'ប្លុក' } },
  { href: '/resources', label: { vi: 'Tài nguyên', en: 'Resources', km: 'ធនធាន' } },
];

/** Mobile drawer — main links (always visible) */
export const mobileNavPrimary: NavItem[] = [
  { href: '/start-here', label: { vi: 'Bắt đầu', en: 'Start', km: 'ចាប់ផ្តើម' } },
  { href: '/cloudflare-101', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101', km: 'Cloudflare 101' } },
  { href: '/tracks', label: { vi: 'Lộ trình học', en: 'Tracks', km: 'ផ្លូវសិក្សា' } },
  { href: '/use-cases/', label: { vi: 'Tình huống', en: 'Use cases', km: 'ករណីប្រើប្រាស់' } },
  { href: '/blog/', label: { vi: 'Blog', en: 'Blog', km: 'ប្លុក' } },
  { href: '/resources', label: { vi: 'Tài nguyên', en: 'Resources', km: 'ធនធាន' } },
];

/** Mobile drawer — collapsed under "Thêm" */
export const mobileNavMore: NavItem[] = [
  { href: '/workshop', label: { vi: 'Hội thảo', en: 'Workshop', km: 'សិក្ខាសាលា' } },
  { href: '/content-roadmap', label: { vi: 'Lộ trình nội dung', en: 'Content Roadmap', km: 'ផ្លូវមាតិកា' } },
  { href: '/roadmaps', label: { vi: 'Roadmap vai trò', en: 'Role roadmaps', km: 'ផ្លូវតាមតួនាទី' } },
  { href: '/first-week', label: { vi: 'Tuần đầu (7 ngày)', en: 'First week', km: 'សប្តាហ៍ទី ១ (៧ ថ្ងៃ)' } },
  { href: '/choose-your-path', label: { vi: 'Chọn lộ trình', en: 'Choose path', km: 'ជ្រើសរើសផ្លូវ' } },
  { href: '/search', label: { vi: 'Tìm kiếm', en: 'Search', km: 'ស្វែងរក' } },
  { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Checklist', en: 'Checklist', km: 'Checklist' } },
  { href: '/quiz/beginner-readiness', label: { vi: 'Bài kiểm tra', en: 'Quiz', km: 'Quiz' } },
  { href: '/glossary', label: { vi: 'Thuật ngữ', en: 'Glossary', km: 'វចនានុក្រម' } },
  { href: '/changelog', label: { vi: 'Changelog', en: 'Changelog', km: 'Changelog' } },
  { href: '/status', label: { vi: 'System status', en: 'System status', km: 'ស្ថានភាពប្រព័ន្ធ' } },
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
