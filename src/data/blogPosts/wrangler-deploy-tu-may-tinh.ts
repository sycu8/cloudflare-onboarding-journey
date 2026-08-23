import type { BlogPost } from '../blog';

/** Entry · Developer Platform — rewritten from Wrangler / deploy workflow blog themes */
export const postWranglerDeployTuMayTinhLenEdge: BlogPost = {
  slug: 'wrangler-deploy-tu-may-tinh-len-edge',
  date: '2026-09-04',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Wrangler là gì? Từ code trên máy tính tới chạy toàn cầu trên edge',
    en: 'What is Wrangler? From laptop code to running globally at the edge',
  },
  description: {
    vi: 'Giải thích Wrangler CLI cho người mới: dev local, deploy production, secrets không commit, và mối liên hệ với Workers và Pages.',
    en: 'A beginner guide to the Wrangler CLI: local dev, production deploy, never committing secrets, and how it ties to Workers and Pages.',
  },
  excerpt: {
    vi: 'Wrangler là “cần cẩu” đưa Worker và static site từ máy bạn lên mạng Cloudflare. Hiểu `dev`, `deploy` và secrets giúp bạn ship mà không lộ khóa API.',
    en: 'Wrangler is the crane that lifts Workers and static sites from your machine onto Cloudflare’s network. Understanding `dev`, `deploy`, and secrets helps you ship without leaking API keys.',
  },
  keywords: {
    vi: 'Wrangler là gì, deploy Cloudflare Workers, wrangler deploy, CLI Cloudflare, học Developer Platform',
    en: 'what is Wrangler, deploy Cloudflare Workers, wrangler deploy, Cloudflare CLI, learn Developer Platform',
  },
  sections: [
    {
      heading: {
        vi: 'Wrangler giải quyết vấn đề gì cho developer?',
        en: 'What problem does Wrangler solve for developers?',
      },
      paragraphs: [
        {
          vi: 'Trước khi có Wrangler, deploy lên edge thường nghĩa là dashboard thủ công hoặc script tự viết. Wrangler là CLI chính thức: tạo project (`wrangler init`), chạy local (`wrangler dev`), deploy (`wrangler deploy` hoặc `wrangler pages deploy`), quản lý D1/KV/R2 binding và secrets — một file `wrangler.toml` (hoặc cấu hình tương đương) mô tả môi trường.',
          en: 'Before Wrangler, deploying to the edge often meant manual dashboard clicks or homemade scripts. Wrangler is the official CLI: scaffold (`wrangler init`), run locally (`wrangler dev`), deploy (`wrangler deploy` or `wrangler pages deploy`), manage D1/KV/R2 bindings and secrets — with `wrangler.toml` (or equivalent config) describing the environment.',
        },
        {
          vi: 'Các bài trên blog.cloudflare.com về Developer Platform thường coi Wrangler là “đường vào” cho Workers: bạn viết TypeScript/JavaScript, Wrangler đóng gói và đẩy lên hàng trăm điểm edge. Không cần SSH vào server hay cấu hình nginx chỉ để thử API nhỏ.',
          en: 'Developer Platform posts on blog.cloudflare.com treat Wrangler as the on-ramp to Workers: you write TypeScript/JavaScript, Wrangler bundles and pushes to hundreds of edge locations. No SSH into a server or nginx tuning just to try a small API.',
        },
        {
          vi: 'Trên hub này, workshop signup và quiz chạy qua Pages Functions — local full stack thường là `npm run build` rồi `wrangler pages dev dist`. Astro dev (`npm run dev`) chỉ phục vụ trang tĩnh; API `/api/*` cần Wrangler pages dev.',
          en: 'On this hub, workshop signup and quiz run through Pages Functions — local full stack is often `npm run build` then `wrangler pages dev dist`. Astro dev (`npm run dev`) serves static pages only; `/api/*` needs Wrangler pages dev.',
        },
      ],
      diagramSlug: 'serverless-global-apis',
    },
    {
      heading: {
        vi: 'Local dev vs production: hai “thế giới” cần tách bạch',
        en: 'Local dev vs production: two worlds to keep separate',
      },
      paragraphs: [
        {
          vi: '`wrangler dev` (hoặc `pages dev`) mô phỏng binding local: D1 local, KV preview, biến từ `.dev.vars`. Đây là nơi bạn phá hoại thoải mái. Production dùng binding remote thật — sai migration hoặc xóa nhầm bảng sẽ ảnh hưởng user thật.',
          en: '`wrangler dev` (or `pages dev`) simulates local bindings: local D1, KV preview, variables from `.dev.vars`. This is where you break things safely. Production uses real remote bindings — wrong migrations or accidental table drops hit real users.',
        },
        {
          vi: 'Quy tắc vàng: không copy production secret vào chat Slack; dùng `wrangler secret put KEY` cho production và `.dev.vars` (gitignored) cho local. File `wrangler.toml` trong repo hub dùng bản `.example` — bản thật không commit.',
          en: 'Golden rule: do not paste production secrets into Slack; use `wrangler secret put KEY` for production and `.dev.vars` (gitignored) for local. This hub’s `wrangler.toml` uses a `.example` file — the real one is not committed.',
        },
        {
          vi: 'Preview URL từ Git integration (Pages) cho mỗi PR là “production giả”: dùng binding preview riêng khi có thể, tránh test destructive trên DB production chung.',
          en: 'Preview URLs from Git integration (Pages) per PR are “fake production”: use separate preview bindings when possible; avoid destructive tests on a shared production database.',
        },
      ],
    },
    {
      heading: {
        vi: 'Luồng deploy điển hình: Worker đơn và site Astro + Functions',
        en: 'Typical deploy flows: a single Worker and an Astro site with Functions',
      },
      paragraphs: [
        {
          vi: 'Worker API đơn: `wrangler init` → code trong `src/index.ts` → `wrangler dev` test → `wrangler deploy` → gán route hoặc custom domain trong dashboard. Site tĩnh + API: build frontend (`npm run build`), Functions trong `functions/`, `wrangler pages deploy dist` hoặc push Git để Pages CI deploy.',
          en: 'Single Worker API: `wrangler init` → code in `src/index.ts` → test with `wrangler dev` → `wrangler deploy` → attach a route or custom domain in the dashboard. Static site + API: build frontend (`npm run build`), Functions in `functions/`, `wrangler pages deploy dist` or push Git for Pages CI deploy.',
        },
        {
          vi: 'Sau deploy, `wrangler tail` xem log realtime — hữu ích hơn `console.log` mù khi debug 500 trên production. Kết hợp observability trong dashboard khi traffic tăng.',
          en: 'After deploy, `wrangler tail` streams realtime logs — more useful than blind `console.log` when debugging production 500s. Add dashboard observability as traffic grows.',
        },
        {
          vi: 'Đọc bài Workers intro và Developer Platform trên hub trước khi tối ưu CI phức tạp. Mục tiêu tuần đầu: một lần deploy thành công từ máy bạn, một lần từ Git — hiểu hai đường đó đã đủ cho hầu hết side project.',
          en: 'Read the Workers intro and Developer Platform posts on this hub before optimizing complex CI. Week-one goal: one successful deploy from your laptop, one from Git — knowing both paths is enough for most side projects.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist trước khi bấm deploy lần đầu',
        en: 'Checklist before your first deploy',
      },
      paragraphs: [
        {
          vi: 'Một: `wrangler.toml` có đúng `name` và `compatibility_date`. Hai: binding D1/KV khớp tên trong code (`env.DB`). Ba: secrets đã set remote, không nằm trong Git. Bốn: chạy smoke test local với `wrangler pages dev` nếu site có API. Năm: kiểm tra custom domain và SSL mode (Full strict khi origin có cert hợp lệ).',
          en: 'One: `wrangler.toml` has the right `name` and `compatibility_date`. Two: D1/KV binding names match code (`env.DB`). Three: secrets are set remotely, not in Git. Four: run local smoke tests with `wrangler pages dev` if the site has APIs. Five: check custom domain and SSL mode (Full strict when origin has a valid cert).',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu đẩy nhánh này lên main, có migration D1 nào chạy tự động không?” Nếu có, review file SQL trước. Wrangler giúp deploy nhanh — trách nhiệm review vẫn là của bạn.',
          en: 'Self-check: “If I merge this branch to main, will any D1 migration run automatically?” If yes, review the SQL first. Wrangler makes deploy fast — review responsibility stays yours.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Wrangler khác dashboard deploy chỗ nào?',
        en: 'How is Wrangler different from dashboard deploy?',
      },
      answer: {
        vi: 'Dashboard phù hợp thử nhanh. Wrangler lặp lại được trong CI, version control cấu hình binding, và script hóa secrets — chuẩn cho team và production.',
        en: 'The dashboard suits quick experiments. Wrangler repeats in CI, versions binding config, and scripts secrets — the norm for teams and production.',
      },
    },
    {
      question: {
        vi: 'Có cần Wrangler nếu chỉ dùng Pages Git integration?',
        en: 'Do you need Wrangler if you only use Pages Git integration?',
      },
      answer: {
        vi: 'CI Git có thể deploy không cần Wrangler local hàng ngày, nhưng Wrangler vẫn hữu ích cho `pages dev`, secrets, D1 migrations và debug `tail`.',
        en: 'Git CI can deploy without daily local Wrangler, but Wrangler still helps with `pages dev`, secrets, D1 migrations, and `tail` debugging.',
      },
    },
    {
      question: {
        vi: 'Lỡ commit secret vào Git thì sao?',
        en: 'What if you committed a secret to Git?',
      },
      answer: {
        vi: 'Rotate (đổi) secret ngay trên nhà cung cấp và Cloudflare, xóa khỏi lịch sử Git nếu có thể, và dùng `wrangler secret put` thay vì file plain text. Coi secret đã lộ là compromised.',
        en: 'Rotate the secret immediately on the provider and Cloudflare, remove it from Git history if possible, and use `wrangler secret put` instead of plain files. Treat exposed secrets as compromised.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Developer Platform topics',
      href: 'https://blog.cloudflare.com/tag/developer-platform/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'd1-sqlite-edge-cho-app-nho',
  ],
  hubLinks: [
    { href: '/products/workers/', label: { vi: 'Workers (trang sản phẩm)', en: 'Workers (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/deploy-static-site/', label: { vi: 'Use case: deploy static site', en: 'Use case: deploy a static site' } },
    { href: '/roadmaps/developer/', label: { vi: 'Roadmap Developer', en: 'Developer roadmap' } },
    { href: '/changelog/', label: { vi: 'Changelog sản phẩm', en: 'Product changelog' } },
  ],
  diagramSlugs: ['serverless-global-apis', 'fullstack-application'],
};
