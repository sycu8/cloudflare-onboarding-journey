import type { LocalizedString } from '../i18n/types';
import { blogPosts, type BlogLevel, type BlogTopic } from './blog';

/**
 * Daily blog generation calendar (1 post / day).
 * Published posts are detected by matching `slug` or `date` against `blogPosts`.
 * Extend `blogScheduleQueue` ahead of time so the cron always has a next topic.
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

const TOPIC_ROTATION: BlogTopic[] = ['cdn', 'security', 'workers', 'ai', 'developer-platform'];

/** Planned posts after the initial 6 (which end 2026-08-10). */
export const blogScheduleQueue: BlogScheduleItem[] = [
  {
    date: '2026-08-11',
    slug: 'dns-proxy-dam-may-cam-cho-nguoi-moi',
    topic: 'cdn',
    level: 'entry',
    workingTitle: {
      vi: 'DNS và đám mây cam: proxy Cloudflare giải thích đơn giản',
      en: 'DNS and the orange cloud: Cloudflare proxy explained simply',
    },
    angle: {
      vi: 'Vì sao bật proxy đổi trải nghiệm tốc độ/bảo mật; DNS only vs proxied; lỗi thường gặp.',
      en: 'Why proxying changes speed/security; DNS-only vs proxied; common mistakes.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/dns/', 'https://blog.cloudflare.com/tag/cdn/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['dns', 'cdn', 'proxy'],
  },
  {
    date: '2026-08-12',
    slug: 'ddos-la-gi-cloudflare-bao-ve-the-nao',
    topic: 'security',
    level: 'entry',
    workingTitle: {
      vi: 'DDoS là gì? Cloudflare bảo vệ website thế nào (không thuật ngữ nặng)',
      en: 'What is a DDoS? How Cloudflare protects sites in plain language',
    },
    angle: {
      vi: 'Hình ảnh “đông người chen cửa hàng”; lớp bảo vệ tự động vs cần cấu hình thêm.',
      en: 'Crowd-at-the-door metaphor; automatic protection vs what you still configure.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/ddos/', 'https://blog.cloudflare.com/tag/security/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['ddos', 'waf'],
  },
  {
    date: '2026-08-13',
    slug: 'pages-vs-workers-khi-nao-dung-gi',
    topic: 'workers',
    level: 'entry',
    workingTitle: {
      vi: 'Pages và Workers: khi nào dùng cái nào?',
      en: 'Pages vs Workers: when to use which?',
    },
    angle: {
      vi: 'Site tĩnh/frontend vs API/logic edge; nhiều dự án dùng cả hai.',
      en: 'Static/frontend sites vs edge APIs/logic; many projects use both.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/pages/',
      'https://blog.cloudflare.com/tag/workers/',
    ],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['pages', 'workers'],
  },
  {
    date: '2026-08-14',
    slug: 'vectorize-rag-tim-kiem-tri-thuc-don-gian',
    topic: 'ai',
    level: 'intermediate',
    workingTitle: {
      vi: 'RAG và Vectorize: chatbot “nhớ tài liệu” giải thích dễ hiểu',
      en: 'RAG and Vectorize: teaching a chatbot your documents, explained simply',
    },
    angle: {
      vi: 'Embedding như “tóm tắt số”; vì sao cần DB vector; nối Workers AI.',
      en: 'Embeddings as numeric summaries; why a vector DB; wiring Workers AI.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/vectorize/',
      'https://blog.cloudflare.com/tag/workers-ai/',
    ],
    relatedTrack: 'ai-security-adoption',
    relatedProductSlugs: ['vectorize', 'workers-ai'],
  },
  {
    date: '2026-08-15',
    slug: 'r2-luu-file-khong-phi-egress-cho-nguoi-moi',
    topic: 'developer-platform',
    level: 'entry',
    workingTitle: {
      vi: 'R2 là gì? Lưu file trên Cloudflare mà không “sợ” phí egress',
      en: 'What is R2? Object storage on Cloudflare without egress sticker shock',
    },
    angle: {
      vi: 'So với ổ đĩa hosting; ảnh/backup/static; gắn Workers bằng binding.',
      en: 'Vs classic hosting disks; images/backups/static; Workers bindings.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/r2/', 'https://blog.cloudflare.com/tag/storage/'],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['r2', 'workers'],
  },
  {
    date: '2026-08-16',
    slug: 'cache-rules-vs-page-rules-nguoi-moi',
    topic: 'cdn',
    level: 'intermediate',
    workingTitle: {
      vi: 'Cache Rules: kiểm soát cache không phá giỏ hàng',
      en: 'Cache Rules: control caching without breaking carts',
    },
    angle: {
      vi: 'Quy tắc theo đường dẫn; bypass login/cart; purge khi deploy.',
      en: 'Path-based rules; bypass login/cart; purge on deploy.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/cache/', 'https://blog.cloudflare.com/tag/cdn/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['cdn', 'cache'],
  },
  {
    date: '2026-08-17',
    slug: 'bot-management-phan-biet-nguoi-va-bot',
    topic: 'security',
    level: 'intermediate',
    workingTitle: {
      vi: 'Bot trên website: phân biệt khách thật và bot xấu',
      en: 'Website bots: telling real visitors from bad bots',
    },
    angle: {
      vi: 'Bot tốt (search) vs bot xấu; Turnstile; khi cần Bot Management.',
      en: 'Good bots (search) vs bad bots; Turnstile; when Bot Management helps.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/bots/', 'https://blog.cloudflare.com/tag/security/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['bots', 'turnstile', 'waf'],
  },
  {
    date: '2026-08-18',
    slug: 'd1-sqlite-edge-cho-app-nho',
    topic: 'workers',
    level: 'entry',
    workingTitle: {
      vi: 'D1 là gì? Database SQL nhẹ cho app trên Workers',
      en: 'What is D1? Lightweight SQL for apps on Workers',
    },
    angle: {
      vi: 'Khi nào SQL cần thiết; workshop signup / comments; khác KV.',
      en: 'When SQL is needed; signup/comments examples; vs KV.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/d1/', 'https://blog.cloudflare.com/tag/workers/'],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['d1', 'workers'],
  },
  {
    date: '2026-08-19',
    slug: 'agents-sdk-agent-ai-tren-cloudflare',
    topic: 'ai',
    level: 'intermediate',
    workingTitle: {
      vi: 'AI Agents trên Cloudflare: hơn một lần gọi chatbot',
      en: 'AI Agents on Cloudflare: more than one chatbot call',
    },
    angle: {
      vi: 'Agent cần nhớ + công cụ; Durable Objects/Workflows ở mức khái niệm.',
      en: 'Agents need memory + tools; Durable Objects/Workflows at concept level.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/agents/',
      'https://blog.cloudflare.com/workers-ai-large-models/',
    ],
    relatedTrack: 'ai-security-adoption',
    relatedProductSlugs: ['agents', 'workers-ai', 'durable-objects'],
  },
  {
    date: '2026-08-20',
    slug: 'wrangler-deploy-tu-may-tinh-len-edge',
    topic: 'developer-platform',
    level: 'entry',
    workingTitle: {
      vi: 'Wrangler là gì? Từ code trên máy tới chạy toàn cầu',
      en: 'What is Wrangler? From laptop code to the global edge',
    },
    angle: {
      vi: 'CLI như “cần cẩu deploy”; dev local vs production; secrets không commit.',
      en: 'CLI as a deploy crane; local vs production; never commit secrets.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/developer-platform/',
      'https://blog.cloudflare.com/tag/workers/',
    ],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['workers'],
  },
  {
    date: '2026-08-21',
    slug: 'ssl-tls-https-cloudflare-cho-nguoi-moi',
    topic: 'security',
    level: 'entry',
    workingTitle: {
      vi: 'HTTPS/SSL trên Cloudflare: khóa cửa website giải thích dễ',
      en: 'HTTPS/SSL on Cloudflare: locking the website door, explained simply',
    },
    angle: {
      vi: 'Flexible vs Full; tránh redirect loop; chứng chỉ tự động.',
      en: 'Flexible vs Full; avoid redirect loops; automatic certificates.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/ssl/', 'https://blog.cloudflare.com/tag/security/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['ssl'],
  },
  {
    date: '2026-08-22',
    slug: 'kv-key-value-edge-khi-nao-dung',
    topic: 'workers',
    level: 'entry',
    workingTitle: {
      vi: 'Workers KV: tủ khóa-giá trị nhanh gần người dùng',
      en: 'Workers KV: a fast key-value locker near your users',
    },
    angle: {
      vi: 'Flag cấu hình, session nhẹ; không thay SQL quan hệ.',
      en: 'Config flags, light sessions; not a relational SQL replacement.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/kv/', 'https://blog.cloudflare.com/tag/workers/'],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['kv', 'workers'],
  },
  {
    date: '2026-08-23',
    slug: 'ai-security-prompt-injection-nguoi-moi',
    topic: 'ai',
    level: 'intermediate',
    workingTitle: {
      vi: 'Prompt injection là gì? Bảo vệ ứng dụng AI cơ bản',
      en: 'What is prompt injection? Basic AI app protection',
    },
    angle: {
      vi: 'User nhét lệnh độc vào ô chat; WAF/Gateway/lớp app; không chỉ tin model.',
      en: 'Users stuffing hostile instructions into chat; WAF/Gateway/app layers; do not trust the model alone.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/ai/',
      'https://blog.cloudflare.com/tag/security/',
    ],
    relatedTrack: 'ai-security-adoption',
    relatedProductSlugs: ['ai-gateway', 'waf'],
  },
  {
    date: '2026-08-24',
    slug: 'load-balancing-ha-website-don-gian',
    topic: 'cdn',
    level: 'intermediate',
    workingTitle: {
      vi: 'Load Balancing Cloudflare: khi một server không đủ',
      en: 'Cloudflare Load Balancing: when one origin is not enough',
    },
    angle: {
      vi: 'Chia traffic, health check, failover — ngôn ngữ vận hành nhỏ.',
      en: 'Split traffic, health checks, failover — small-ops language.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/load-balancing/',
      'https://blog.cloudflare.com/tag/cdn/',
    ],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['load-balancing', 'cdn'],
  },
  {
    date: '2026-08-25',
    slug: 'zero-trust-access-thay-vpn-khoi-dau',
    topic: 'security',
    level: 'entry',
    workingTitle: {
      vi: 'Cloudflare Access: vào app nội bộ không cần VPN cũ',
      en: 'Cloudflare Access: reach internal apps without the old VPN',
    },
    angle: {
      vi: 'Xác minh danh tính trước khi vào app; phù hợp team nhỏ bắt đầu Zero Trust.',
      en: 'Verify identity before the app; a gentle Zero Trust start for small teams.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/cloudflare-one/',
      'https://blog.cloudflare.com/tag/zero-trust/',
    ],
    relatedTrack: 'cloudflare-one',
    relatedProductSlugs: ['access', 'zero-trust'],
  },
  {
    date: '2026-08-26',
    slug: 'workflows-tac-vu-dai-tren-workers',
    topic: 'workers',
    level: 'intermediate',
    workingTitle: {
      vi: 'Workflows: chạy việc dài hơi trên nền tảng Workers',
      en: 'Workflows: long-running jobs on the Workers platform',
    },
    angle: {
      vi: 'Khác request ngắn; bước có thể chờ/retry; use case email/pipeline.',
      en: 'Unlike short requests; wait/retry steps; email/pipeline use cases.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/workflows/',
      'https://blog.cloudflare.com/tag/workers/',
    ],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['workflows', 'workers'],
  },
  {
    date: '2026-08-27',
    slug: 'ai-gateway-chi-phi-token-kiem-soat',
    topic: 'ai',
    level: 'intermediate',
    workingTitle: {
      vi: 'Kiểm soát chi phí LLM với AI Gateway (thực tế cho team nhỏ)',
      en: 'Controlling LLM cost with AI Gateway (practical for small teams)',
    },
    angle: {
      vi: 'Log, rate limit, ngân sách; tránh hard-code key; complementary với Workers AI.',
      en: 'Logs, rate limits, budgets; no frontend keys; complements Workers AI.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/ai-platform/',
      'https://blog.cloudflare.com/tag/ai-gateway/',
    ],
    relatedTrack: 'ai-security-adoption',
    relatedProductSlugs: ['ai-gateway', 'workers-ai'],
  },
  {
    date: '2026-08-28',
    slug: 'observability-logs-workers-cho-nguoi-moi',
    topic: 'developer-platform',
    level: 'entry',
    workingTitle: {
      vi: 'Logs & observability trên Cloudflare: biết app đang “khỏe” không',
      en: 'Logs & observability on Cloudflare: knowing if your app is healthy',
    },
    angle: {
      vi: 'Vì sao cần nhìn lỗi sớm; Workers logs; không cần SIEM ngày đầu.',
      en: 'Why early error visibility matters; Workers logs; no SIEM required on day one.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/observability/',
      'https://blog.cloudflare.com/tag/workers/',
    ],
    relatedTrack: 'operational-excellence',
    relatedProductSlugs: ['workers'],
  },
  {
    date: '2026-08-29',
    slug: 'image-optimization-cdn-toc-do',
    topic: 'cdn',
    level: 'entry',
    workingTitle: {
      vi: 'Ảnh nặng làm chậm site: CDN và tối ưu ảnh trên Cloudflare',
      en: 'Heavy images slow sites: CDN and image optimization on Cloudflare',
    },
    angle: {
      vi: 'Cache + resize; mobile; không thay thay nội dung xấu bằng cache thôi.',
      en: 'Cache + resize; mobile; caching alone does not fix oversized assets.',
    },
    sourceHints: ['https://blog.cloudflare.com/tag/images/', 'https://blog.cloudflare.com/tag/cdn/'],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['images', 'cdn'],
  },
  {
    date: '2026-08-30',
    slug: 'rate-limiting-bao-ve-form-login',
    topic: 'security',
    level: 'entry',
    workingTitle: {
      vi: 'Rate limiting: chặn spam form và dò mật khẩu đơn giản',
      en: 'Rate limiting: a simple brake on form spam and password guessing',
    },
    angle: {
      vi: 'Giới hạn số request theo IP/path; kết hợp WAF; false positive.',
      en: 'Cap requests by IP/path; combine with WAF; watch false positives.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/security/',
      'https://blog.cloudflare.com/tag/waf/',
    ],
    relatedTrack: 'application-services',
    relatedProductSlugs: ['rate-limiting', 'waf'],
  },
  {
    date: '2026-08-31',
    slug: 'sandbox-chay-code-an-toan-tren-edge',
    topic: 'developer-platform',
    level: 'intermediate',
    workingTitle: {
      vi: 'Sandbox trên Cloudflare: chạy code không tin cậy an toàn hơn',
      en: 'Cloudflare Sandbox: running untrusted code more safely',
    },
    angle: {
      vi: 'Khi nào cần môi trường tách biệt; agent/code interpreter; khác Workers thường.',
      en: 'When isolation matters; agents/code interpreters; vs regular Workers.',
    },
    sourceHints: [
      'https://blog.cloudflare.com/tag/sandbox/',
      'https://blog.cloudflare.com/tag/developer-platform/',
    ],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['sandbox', 'workers'],
  },
];

export const blogCadenceNote: LocalizedString = {
  vi: 'Lịch biên tập: mỗi ngày 1 bài (múi giờ Việt Nam). Hàng ngày GitHub Actions mở issue “generate” theo lịch; scaffold bằng npm run blog:today.',
  en: 'Editorial cadence: 1 post per day (Vietnam time). A daily GitHub Action opens a generate issue from this schedule; scaffold with npm run blog:today.',
};

function publishedSlugSet(): Set<string> {
  return new Set(blogPosts.map((p) => p.slug));
}

function publishedDateSet(): Set<string> {
  return new Set(blogPosts.map((p) => p.date));
}

export function getScheduleStatus(item: BlogScheduleItem, today = todayInVietnam()): BlogScheduleStatus {
  if (publishedSlugSet().has(item.slug) || publishedDateSet().has(item.date)) return 'published';
  if (item.date <= today) return 'due';
  return 'upcoming';
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

export function getScheduleItemForDate(date: string): BlogScheduleItem | undefined {
  return blogScheduleQueue.find((item) => item.date === date);
}

export function getTodaysScheduleItem(now = new Date()): BlogScheduleItem | undefined {
  return getScheduleItemForDate(todayInVietnam(now));
}

export type TodayBlogAssignment =
  | { kind: 'planned'; item: BlogScheduleItem; status: BlogScheduleStatus }
  | { kind: 'published'; date: string; slug: string; title: { vi: string; en: string } }
  | { kind: 'missing'; date: string };

/** Prefer schedule row; if none, detect an already-published post dated today. */
export function getTodayBlogAssignment(now = new Date()): TodayBlogAssignment {
  const date = todayInVietnam(now);
  const item = getScheduleItemForDate(date);
  if (item) {
    return { kind: 'planned', item, status: getScheduleStatus(item, date) };
  }
  const published = blogPosts.find((p) => p.date === date);
  if (published) {
    return {
      kind: 'published',
      date,
      slug: published.slug,
      title: published.title,
    };
  }
  return { kind: 'missing', date };
}

export function getUpcomingSchedule(limit = 7, now = new Date()): BlogScheduleItem[] {
  const today = todayInVietnam(now);
  return blogScheduleQueue
    .filter((item) => getScheduleStatus(item, today) !== 'published')
    .filter((item) => item.date >= today)
    .slice(0, limit);
}

export function getDueScheduleItems(now = new Date()): BlogScheduleItem[] {
  const today = todayInVietnam(now);
  return blogScheduleQueue.filter((item) => getScheduleStatus(item, today) === 'due');
}

export function buildDailyGeneratePrompt(item: BlogScheduleItem): string {
  return [
    `# Blog daily generate — ${item.date}`,
    '',
    `Slug: \`${item.slug}\``,
    `Topic: ${item.topic} · Level: ${item.level}`,
    '',
    `## Working title`,
    `- VI: ${item.workingTitle.vi}`,
    `- EN: ${item.workingTitle.en}`,
    '',
    `## Angle`,
    `- VI: ${item.angle.vi}`,
    `- EN: ${item.angle.en}`,
    '',
    `## Requirements`,
    `- Rewrite for non-tech / entry–intermediate readers (do not copy blog.cloudflare.com verbatim)`,
    `- Bilingual \`{ vi, en }\` copy throughout`,
    `- Minimum ~400 words per language`,
    `- Include FAQ (3+) for AEO + JSON-LD on the article page`,
    `- On-page backlinks to hub tracks/products/use cases + related blog posts`,
    `- Source links back to blog.cloudflare.com`,
    `- Register the post in \`src/data/blog.ts\` and add smoke route if needed`,
    '',
    `## Source hints`,
    ...item.sourceHints.map((h) => `- ${h}`),
    '',
    `## Suggested related`,
    item.relatedTrack ? `- Track: /tracks/${item.relatedTrack}/` : '- Track: (pick one)',
    ...(item.relatedProductSlugs ?? []).map((s) => `- Product: /products/${s}/`),
    '',
    `## Scaffold`,
    '```bash',
    `npm run blog:scaffold -- --date=${item.date}`,
    '```',
    '',
    `Then write full content in \`src/data/blogPosts/\`, import in \`src/data/blog.ts\`, open PR, merge, deploy.`,
  ].join('\n');
}

/** Suggest next free date after the last scheduled or published date. */
export function suggestNextScheduleDate(): string {
  const dates = [
    ...blogScheduleQueue.map((i) => i.date),
    ...blogPosts.map((p) => p.date),
  ].sort();
  const last = dates[dates.length - 1] ?? todayInVietnam();
  const d = new Date(`${last}T00:00:00+07:00`);
  d.setDate(d.getDate() + 1);
  return todayInVietnam(d);
}

export function nextTopicSuggestion(): BlogTopic {
  const last = blogScheduleQueue[blogScheduleQueue.length - 1]?.topic;
  if (!last) return TOPIC_ROTATION[0];
  const idx = TOPIC_ROTATION.indexOf(last);
  return TOPIC_ROTATION[(idx + 1) % TOPIC_ROTATION.length];
}
