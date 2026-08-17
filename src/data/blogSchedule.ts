import type { LocalizedString } from '../i18n/types';
import { blogPosts, type BlogLevel, type BlogTopic } from './blog';
import queueData from './blogSchedule.data.json';

/**
 * Blog editorial calendar — 1 post every 2 days (Asia/Ho_Chi_Minh).
 * Reminder + approve flow is email-only (sycu.lee@gmail.com).
 */
export type BlogScheduleStatus = 'published' | 'due' | 'upcoming';

export type BlogScheduleItem = {
  /** Target publish date YYYY-MM-DD (Asia/Ho_Chi_Minh calendar) */
  date: string;
  slug: string;
  topic: BlogTopic;
  level: BlogLevel;
  workingTitle: LocalizedString;
  /** Angle for the rewrite — keep non-tech friendly */
  angle: LocalizedString;
  /** blog.cloudflare.com tags or post URLs to rewrite from */
  sourceHints: string[];
  relatedTrack?:
    | 'application-services'
    | 'developer-platform'
    | 'cloudflare-one'
    | 'ai-security-adoption'
    | 'operational-excellence';
  relatedProductSlugs?: string[];
};

export const BLOG_EDITOR_EMAIL = 'sycu.lee@gmail.com';
/** Inbound address for Reply APPROVE (Email Routing → Worker). */
export const BLOG_APPROVE_INBOX = 'blog-approve@orangecloud.vn';

export const blogScheduleQueue: BlogScheduleItem[] = queueData as BlogScheduleItem[];

export const blogCadenceNote: LocalizedString = {
  vi: 'Lịch biên tập: 1 bài / 2 ngày (giờ Việt Nam). Hệ thống gửi email đề xuất tới biên tập viên; reply APPROVE (hoặc bấm Approve) để mở PR đăng bài.',
  en: 'Editorial cadence: 1 post every 2 days (Vietnam time). The system emails the editor a topic; reply APPROVE (or click Approve) to open the publish PR.',
};

function publishedSlugSet(): Set<string> {
  return new Set(blogPosts.map((p) => p.slug));
}

function publishedDateSet(): Set<string> {
  return new Set(blogPosts.map((p) => p.date));
}

/** Calendar date YYYY-MM-DD in Asia/Ho_Chi_Minh. */
export function todayInVietnam(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function getScheduleStatus(item: BlogScheduleItem, today = todayInVietnam()): BlogScheduleStatus {
  if (publishedSlugSet().has(item.slug) || publishedDateSet().has(item.date)) return 'published';
  if (item.date <= today) return 'due';
  return 'upcoming';
}

export function getScheduleItemByDate(date: string): BlogScheduleItem | undefined {
  return blogScheduleQueue.find((item) => item.date === date);
}

export function getScheduleItemBySlug(slug: string): BlogScheduleItem | undefined {
  return blogScheduleQueue.find((item) => item.slug === slug);
}

/** Today's queue row if this calendar day is a scheduled bi-daily slot. */
export function getTodayScheduleItem(today = todayInVietnam()): BlogScheduleItem | undefined {
  return getScheduleItemByDate(today);
}

export function listUpcoming(limit = 14, today = todayInVietnam()): BlogScheduleItem[] {
  return blogScheduleQueue
    .filter((item) => getScheduleStatus(item, today) !== 'published' && item.date >= today)
    .slice(0, limit);
}

export function listDue(today = todayInVietnam()): BlogScheduleItem[] {
  return blogScheduleQueue.filter((item) => getScheduleStatus(item, today) === 'due');
}

export function buildEditorialPrompt(item: BlogScheduleItem): string {
  const sources = item.sourceHints.map((h) => `- ${h}`).join('\n');
  const products = (item.relatedProductSlugs ?? []).map((p) => `- /products/${p}/`).join('\n') || '- (none)';
  return `# Blog bi-daily ${item.date}: \`${item.slug}\`

## Working title
- VI: ${item.workingTitle.vi}
- EN: ${item.workingTitle.en}

## Level / topic
- Topic: **${item.topic}**
- Level: **${item.level}**
- Related track: ${item.relatedTrack ?? 'n/a'}

## Angle
- VI: ${item.angle.vi}
- EN: ${item.angle.en}

## Requirements
- Bilingual \`{ vi, en }\` throughout
- ≥400 words per language in body sections
- FAQ (3+), sources → blog.cloudflare.com, hub backlinks
- Prefer \`diagramSlugs\` from official Reference Architecture diagrams
- Match existing Astro/React patterns in \`src/data/blogPosts/\`

## Source hints
${sources}

## Related product pages
${products}

## Scaffold
\`\`\`bash
npm run blog:scaffold -- --date=${item.date}
\`\`\`
Then register the export in \`src/data/blog.ts\`.
`;
}
