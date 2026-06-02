import type { LocalizedString } from '../i18n/types';

export type FirstWeekDay = {
  day: number;
  title: LocalizedString;
  goal: LocalizedString;
  tasks: LocalizedString[];
  hubLinks: { href: string; label: LocalizedString }[];
};

export const firstWeekIntro: LocalizedString = {
  vi: 'Bạn không cần học hết Cloudflare trong một tuần. Lộ trình 7 ngày này giúp bạn có mental model, chọn đúng track và làm một việc nhỏ có kết quả — phù hợp người đi làm hoặc sinh viên mới tiếp cận.',
  en: 'You do not need to learn all of Cloudflare in one week. This 7-day path gives you a mental model, the right track, and one small win — ideal for professionals or students new to the platform.',
};

export const firstWeekDays: FirstWeekDay[] = [
  {
    day: 1,
    title: { vi: 'Ngày 1 — Cloudflare là gì?', en: 'Day 1 — What is Cloudflare?' },
    goal: {
      vi: 'Hiểu Cloudflare là lớp giữa user và app/network, không phải “chỉ DNS”.',
      en: 'Understand Cloudflare as a layer between users and apps/networks — not “just DNS”.',
    },
    tasks: [
      { vi: 'Đọc Start Here (30 phút)', en: 'Read Start Here (~30 min)' },
      { vi: 'Vẽ sơ đồ: User → Cloudflare → origin/app của bạn', en: 'Sketch: User → Cloudflare → your origin/app' },
      { vi: 'Ghi 1 vấn đề bạn muốn giải (tốc độ, bảo mật, build mới, Zero Trust)', en: 'Write one problem you want to solve (speed, security, new build, Zero Trust)' },
    ],
    hubLinks: [
      { href: '/start-here', label: { vi: 'Start Here', en: 'Start Here' } },
      { href: '/cloudflare-101', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
    ],
  },
  {
    day: 2,
    title: { vi: 'Ngày 2 — Chọn lộ trình', en: 'Day 2 — Pick your track' },
    goal: {
      vi: 'Chọn 1 trong 3 track: Application Services, Developer Platform, Cloudflare One.',
      en: 'Choose one of three tracks: Application Services, Developer Platform, or Cloudflare One.',
    },
    tasks: [
      { vi: 'Làm Choose Your Path (5 phút)', en: 'Complete Choose Your Path (~5 min)' },
      { vi: 'Đọc phần “ai phù hợp” và mental model của track', en: 'Read “who is this for” and the track mental model' },
      { vi: 'Bookmark 1 use case liên quan', en: 'Bookmark one related use case' },
    ],
    hubLinks: [
      { href: '/choose-your-path', label: { vi: 'Chọn lộ trình', en: 'Choose your path' } },
      { href: '/tracks', label: { vi: 'Tất cả lộ trình', en: 'All tracks' } },
    ],
  },
  {
    day: 3,
    title: { vi: 'Ngày 3 — Học module đầu tiên', en: 'Day 3 — First track module' },
    goal: {
      vi: 'Hoàn thành module 1 của track — chỉ lý thuyết + ghi chú, chưa cần production.',
      en: 'Finish module 1 of your track — theory and notes only, no production required yet.',
    },
    tasks: [
      { vi: 'Đọc 2–3 lesson trong module 1', en: 'Read 2–3 lessons in module 1' },
      { vi: 'Ghi 3 thuật ngữ mới vào sổ (hoặc dùng glossary hub)', en: 'Note 3 new terms (or use the hub glossary)' },
      { vi: 'Mở 1 link Developer Docs từ Resource Hub', en: 'Open one Developer Docs link from the Resource Hub' },
    ],
    hubLinks: [
      { href: '/glossary', label: { vi: 'Thuật ngữ', en: 'Glossary' } },
      { href: '/resources#resource-hub', label: { vi: 'Resource Hub', en: 'Resource Hub' } },
    ],
  },
  {
    day: 4,
    title: { vi: 'Ngày 4 — Tình huống thực tế', en: 'Day 4 — Practical use case' },
    goal: {
      vi: 'Áp dụng mental model vào một scenario cụ thể (website, API, serverless, VPN).',
      en: 'Apply the mental model to one scenario (website, API, serverless, VPN).',
    },
    tasks: [
      { vi: 'Đọc 1 use case end-to-end', en: 'Read one use case end-to-end' },
      { vi: 'Liệt kê 3 bước bạn sẽ làm trên project thật', en: 'List 3 steps you would take on a real project' },
      { vi: 'Xem 1 Reference Architecture hoặc repo GitHub gợi ý', en: 'Skim one Reference Architecture doc or suggested GitHub repo' },
    ],
    hubLinks: [
      { href: '/use-cases/protect-website', label: { vi: 'Use cases', en: 'Use cases' } },
      { href: '/resources#reference-architecture', label: { vi: 'Reference Architecture', en: 'Reference Architecture' } },
    ],
  },
  {
    day: 5,
    title: { vi: 'Ngày 5 — Checklist & kiểm tra', en: 'Day 5 — Checklist & knowledge check' },
    goal: {
      vi: 'Tự đánh giá gap — biết mình thiếu gì trước khi đụng production.',
      en: 'Self-assess gaps before touching production.',
    },
    tasks: [
      { vi: 'Tick ít nhất 50% beginner checklist', en: 'Check at least 50% of the beginner checklist' },
      { vi: 'Làm bài kiểm tra 12 câu — đọc giải thích câu sai', en: 'Take the 12-question knowledge check — read explanations for misses' },
      { vi: 'Ghi lại 1 chủ đề cần ôn thêm', en: 'Write down one topic to review' },
    ],
    hubLinks: [
      { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Checklist', en: 'Checklist' } },
      { href: '/quiz/beginner-readiness', label: { vi: 'Bài kiểm tra', en: 'Knowledge check' } },
    ],
  },
  {
    day: 6,
    title: { vi: 'Ngày 6 — Thử tay (sandbox)', en: 'Day 6 — Hands-on (sandbox)' },
    goal: {
      vi: 'Một thao tác nhỏ trên dashboard hoặc Wrangler — không cần hoàn hảo.',
      en: 'One small action in the dashboard or with Wrangler — perfection not required.',
    },
    tasks: [
      {
        vi: 'Application Services: thêm site test / xem DNS & SSL overview',
        en: 'Application Services: add a test site / review DNS & SSL overview',
      },
      {
        vi: 'Developer Platform: `wrangler init` hoặc deploy demo Pages từ template',
        en: 'Developer Platform: `wrangler init` or deploy a Pages demo from a template',
      },
      {
        vi: 'Cloudflare One: xem Zero Trust dashboard & Access policy mẫu',
        en: 'Cloudflare One: explore Zero Trust dashboard & sample Access policy',
      },
      { vi: 'Đăng ký tài khoản free nếu chưa có (không cần thẻ)', en: 'Sign up for a free account if needed (no card required)' },
    ],
    hubLinks: [
      { href: 'https://dash.cloudflare.com/sign-up', label: { vi: 'Đăng ký free', en: 'Sign up free' } },
      { href: '/resources#github', label: { vi: 'Repo mẫu GitHub', en: 'Sample GitHub repos' } },
    ],
  },
  {
    day: 7,
    title: { vi: 'Ngày 7 — Kế hoạch 30 ngày tiếp', en: 'Day 7 — Your next 30 days' },
    goal: {
      vi: 'Chốt 1 mục tiêu production (hoặc lab) và 1 nguồn học chính thức để theo dõi.',
      en: 'Lock one production (or lab) goal and one official learning source to follow.',
    },
    tasks: [
      { vi: 'Viết “Definition of done” cho tuần tới (1 câu)', en: 'Write a one-sentence “definition of done” for next week' },
      { vi: 'Tham gia workshop hub hoặc bookmark Learning Center topic', en: 'Join a hub workshop or bookmark a Learning Center topic' },
      { vi: 'Đọc mục “Cập nhật nền tảng 2026” bên dưới — tránh học tên sản phẩm cũ', en: 'Read “Platform snapshot 2026” below — avoid outdated product names' },
    ],
    hubLinks: [
      { href: '/workshop', label: { vi: 'Workshop', en: 'Workshop' } },
      { href: '/resources#learning-center', label: { vi: 'Learning Center', en: 'Learning Center' } },
    ],
  },
];

export type BeginnerMistake = {
  id: string;
  mistake: LocalizedString;
  why: LocalizedString;
  instead: LocalizedString;
  relatedTrack?: 'application-services' | 'developer-platform' | 'cloudflare-one';
};

export const beginnerMistakes: BeginnerMistake[] = [
  {
    id: 'product-soup',
    mistake: {
      vi: 'Học lẫn lộn tên sản phẩm (WAF, Magic WAN, Vectorize…) trước khi có use case',
      en: 'Memorizing product names (WAF, Magic WAN, Vectorize…) before having a use case',
    },
    why: {
      vi: 'Dễ overwhelm và không biết bắt đầu từ đâu trên dashboard.',
      en: 'Leads to overwhelm and not knowing where to start in the dashboard.',
    },
    instead: {
      vi: 'Bắt đầu từ Start Here → chọn track → 1 use case.',
      en: 'Start at Start Here → pick a track → one use case.',
    },
  },
  {
    id: 'flexible-ssl',
    mistake: {
      vi: 'Dùng SSL/TLS “Flexible” khi origin đã có HTTPS',
      en: 'Using SSL/TLS “Flexible” when origin already serves HTTPS',
    },
    why: {
      vi: 'Có thể gây redirect loop hoặc traffic HTTP nội bộ không mong muốn.',
      en: 'Can cause redirect loops or unintended HTTP between Cloudflare and origin.',
    },
    instead: {
      vi: 'Ưu tiên Full (strict) khi origin có cert hợp lệ.',
      en: 'Prefer Full (strict) when origin has a valid certificate.',
    },
    relatedTrack: 'application-services',
  },
  {
    id: 'cache-login',
    mistake: {
      vi: 'Cache mạnh trang login/checkout có cookie session',
      en: 'Aggressively caching login/checkout pages with session cookies',
    },
    why: {
      vi: 'User A có thể thấy nội dung của User B — lỗi bảo mật nghiêm trọng.',
      en: 'User A might see User B’s content — a serious security issue.',
    },
    instead: {
      vi: 'Cache static assets; bypass cache cho HTML/API động.',
      en: 'Cache static assets; bypass cache for dynamic HTML/API.',
    },
    relatedTrack: 'application-services',
  },
  {
    id: 'kv-as-sql',
    mistake: {
      vi: 'Dùng KV như database quan hệ',
      en: 'Using KV as a relational database',
    },
    why: {
      vi: 'KV eventual consistency, không có query SQL — không phù hợp giao dịch phức tạp.',
      en: 'KV is eventually consistent with no SQL — not for complex transactions.',
    },
    instead: {
      vi: 'Dùng D1 cho dữ liệu có schema; KV cho config/flags/cache nhẹ.',
      en: 'Use D1 for schema’d data; KV for config/flags/light cache.',
    },
    relatedTrack: 'developer-platform',
  },
  {
    id: 'vpn-vs-ztna',
    mistake: {
      vi: 'Coi Zero Trust Access như “VPN mới” — mở full network',
      en: 'Treating Zero Trust Access like a “new VPN” with full network access',
    },
    why: {
      vi: 'Mất lợi ích least-privilege và audit theo từng app.',
      en: 'You lose least-privilege and per-app audit benefits.',
    },
    instead: {
      vi: 'ZTNA: policy theo app + identity; SWG cho Internet browsing.',
      en: 'ZTNA: per-app + identity policies; SWG for Internet browsing.',
    },
    relatedTrack: 'cloudflare-one',
  },
  {
    id: 'argo-name',
    mistake: {
      vi: 'Tìm “Argo Tunnel” trong docs mới',
      en: 'Searching for “Argo Tunnel” in current docs',
    },
    why: {
      vi: 'Tên đã đổi thành Cloudflare Tunnel (`cloudflared`) trong Zero Trust.',
      en: 'Renamed to Cloudflare Tunnel (`cloudflared`) in Zero Trust.',
    },
    instead: {
      vi: 'Dùng Cloudflare Tunnel / `cloudflared` — xem docs Zero Trust connectivity.',
      en: 'Use Cloudflare Tunnel / `cloudflared` — see Zero Trust connectivity docs.',
    },
    relatedTrack: 'cloudflare-one',
  },
];

export type PlatformSnapshotItem = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  docsHref: string;
  status: 'current' | 'renamed' | 'preview';
};

/** Curated “what’s current” for beginners — cross-check with developers.cloudflare.com (2026) */
export const platformSnapshot2026: PlatformSnapshotItem[] = [
  {
    id: 'workers-ai',
    title: { vi: 'Workers AI', en: 'Workers AI' },
    summary: {
      vi: 'Chạy model inference trên mạng Cloudflare qua binding — không cần GPU riêng cho demo nhỏ.',
      en: 'Run model inference on Cloudflare’s network via bindings — no separate GPU for small demos.',
    },
    docsHref: 'https://developers.cloudflare.com/workers-ai/',
    status: 'current',
  },
  {
    id: 'ai-gateway',
    title: { vi: 'AI Gateway', en: 'AI Gateway' },
    summary: {
      vi: 'Quản trị request tới OpenAI/Anthropic và Workers AI: cache, log, rate limit, chi phí.',
      en: 'Govern requests to OpenAI/Anthropic and Workers AI: cache, logs, rate limits, cost.',
    },
    docsHref: 'https://developers.cloudflare.com/ai-gateway/',
    status: 'current',
  },
  {
    id: 'agents-sdk',
    title: { vi: 'Agents SDK', en: 'Agents SDK' },
    summary: {
      vi: 'Build agent có state (chat, workflow) trên Workers + Durable Objects — không chỉ “gọi API LLM một lần”.',
      en: 'Build stateful agents (chat, workflows) on Workers + Durable Objects — not just one-off LLM calls.',
    },
    docsHref: 'https://developers.cloudflare.com/agents/',
    status: 'current',
  },
  {
    id: 'workflows',
    title: { vi: 'Workflows', en: 'Workflows' },
    summary: {
      vi: 'Orchestrate job nhiều bước, durable — thay vì nhồi hết logic vào một Worker dài.',
      en: 'Orchestrate multi-step durable jobs instead of one long Worker script.',
    },
    docsHref: 'https://developers.cloudflare.com/workflows/',
    status: 'current',
  },
  {
    id: 'containers',
    title: { vi: 'Containers on Workers', en: 'Containers on Workers' },
    summary: {
      vi: 'Chạy container khi cần runtime đặc biệt — bổ sung Workers, không thay thế hoàn toàn.',
      en: 'Run containers when you need a specific runtime — complements Workers, not a full replacement.',
    },
    docsHref: 'https://developers.cloudflare.com/containers/',
    status: 'preview',
  },
  {
    id: 'tunnel',
    title: { vi: 'Cloudflare Tunnel', en: 'Cloudflare Tunnel' },
    summary: {
      vi: 'Tên hiện tại của tunnel outbound (`cloudflared`) — không còn gọi Argo Tunnel trong UI mới.',
      en: 'Current name for outbound tunnel (`cloudflared`) — not “Argo Tunnel” in newer UI/docs.',
    },
    docsHref: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/',
    status: 'renamed',
  },
  {
    id: 'hyperdrive',
    title: { vi: 'Hyperdrive', en: 'Hyperdrive' },
    summary: {
      vi: 'Tăng tốc kết nối từ Workers tới Postgres/MySQL bên ngoài — giữ DB hiện có.',
      en: 'Speed up Workers connections to external Postgres/MySQL — keep your existing DB.',
    },
    docsHref: 'https://developers.cloudflare.com/hyperdrive/',
    status: 'current',
  },
  {
    id: 'turnstile',
    title: { vi: 'Turnstile', en: 'Turnstile' },
    summary: {
      vi: 'Chống bot cho form public — luôn verify token phía server (Pages Functions/Worker).',
      en: 'Bot protection for public forms — always verify tokens server-side (Pages Functions/Worker).',
    },
    docsHref: 'https://developers.cloudflare.com/turnstile/',
    status: 'current',
  },
];

export const platformSnapshotNote: LocalizedString = {
  vi: 'Danh sách này cập nhật theo hướng dẫn chính thức đầu 2026. Luôn đối chiếu developers.cloudflare.com trước khi triển khai production.',
  en: 'This list aligns with official guidance as of early 2026. Always cross-check developers.cloudflare.com before production.',
};
