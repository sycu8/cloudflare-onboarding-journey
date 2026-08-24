import type { BlogPost } from '../blog';

/**
 * Hub update · Application Services + Developer Platform follow-along tracks
 * Announces the pedagogy rewrite aligned with Cloudflare One onboarding style.
 */
export const postCapNhatFollowAlongAsDp: BlogPost = {
  slug: 'cap-nhat-follow-along-application-services-developer-platform',
  date: '2026-08-24',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 8,
  title: {
    vi: 'Cập nhật mới: follow-along Application Services và Developer Platform',
    en: 'What’s new: follow-along Application Services and Developer Platform tracks',
  },
  description: {
    vi: 'Giới thiệu bản cập nhật lộ trình Application Services và Developer Platform trên hub: START HERE, module bắt buộc/tùy chọn, checkpoint làm theo dashboard, và sổ tay golden rules — cùng phong cách với Cloudflare One.',
    en: 'An intro to the Application Services and Developer Platform track updates on this hub: START HERE, required/optional modules, dashboard checkpoints, and golden-rule runbooks — the same pedagogy as Cloudflare One.',
  },
  excerpt: {
    vi: 'Hai lộ trình lớn vừa được viết lại thành follow-along: làm đúng thứ tự trên dashboard, dừng giữa chừng vẫn có giá trị, và biết khi nào mới cần add-on. Đây là bản đồ “làm gì tiếp theo” chứ không phải danh mục sản phẩm.',
    en: 'Two major tracks were rewritten as follow-alongs: work dashboard steps in order, stop mid-path with something useful, and know when add-ons actually matter. This is a “what to do next” map — not a product catalog.',
  },
  keywords: {
    vi: 'Application Services Cloudflare, Developer Platform follow-along, onboarding DNS WAF Workers, lộ trình Cloudflare hub, C3 Wrangler',
    en: 'Cloudflare Application Services, Developer Platform follow-along, DNS WAF Workers onboarding, Cloudflare hub tracks, C3 Wrangler',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao hub viết lại hai track này?',
        en: 'Why rewrite these two tracks?',
      },
      paragraphs: [
        {
          vi: 'Trước đây, Application Services và Developer Platform trên hub nghiêng về “giải thích sản phẩm”. Người học biết CDN, WAF, Workers là gì — nhưng vẫn hỏi: tôi bấm gì trước trên dashboard? Module nào bắt buộc? Khi nào mới cần API Shield hay Durable Objects?',
          en: 'Previously, Application Services and Developer Platform on this hub leaned toward product explainers. Learners knew what CDN, WAF, and Workers were — but still asked: what do I click first in the dashboard? Which modules are required? When do I actually need API Shield or Durable Objects?',
        },
        {
          vi: 'Bản cập nhật lấy cùng mô hình sư phạm với lộ trình Cloudflare One: START HERE (checklist + bảng Free/Paid), module gắn nhãn Required / Recommended / Optional / Reference, mỗi bài có mục tiêu–ai làm–thời gian–checkpoint, và phần tham chiếu golden rules + sổ tay cấu hình.',
          en: 'This update adopts the same pedagogy as the Cloudflare One track: START HERE (checklist + Free/Paid table), modules labeled Required / Recommended / Optional / Reference, each lesson with goal–who–time–checkpoint, plus a reference section of golden rules and a configuration runbook.',
        },
        {
          vi: 'Mục tiêu không phải “biết hết catalog Cloudflare”. Mục tiêu là hoàn thành một đường xương sống an toàn: site proxied + HTTPS đúng, hoặc Worker deploy được + storage đúng — rồi mới rẽ nhánh.',
          en: 'The goal is not “know every Cloudflare product.” The goal is to finish a safe spine: a proxied site with correct HTTPS, or a deployable Worker with the right storage — then branch.',
        },
      ],
      diagramSlug: 'distributed-web-performance-architecture',
    },
    {
      heading: {
        vi: 'Application Services: DNS → proxy → SSL → WAF → cache',
        en: 'Application Services: DNS → proxy → SSL → WAF → cache',
      },
      paragraphs: [
        {
          vi: 'Track dành cho team đã có website, web app hoặc API public. Mental model cố định: Visitor → DNS → Proxy (đám mây cam) → SSL/TLS → WAF / Bot / Rate limit → Cache / Speed → Origin. Proxy tắt = chỉ DNS — WAF và cache không chạy trên HTTP.',
          en: 'This track is for teams with a live website, web app, or public API. The mental model is fixed: Visitor → DNS → Proxy (orange cloud) → SSL/TLS → WAF / Bot / Rate limit → Cache / Speed → Origin. Proxy off = DNS only — WAF and cache do not run on HTTP.',
        },
        {
          vi: 'Phần bắt buộc: (0) kiến trúc & thứ tự, (1) onboard domain + proxy đúng record, (2) SSL/TLS Full (strict) và chống bypass origin, (3) WAF managed Simulate rồi Block, rate limit login, bot cơ bản. Phần khuyến nghị: Cache Rules, Speed/Images, đo hit ratio và Core Web Vitals.',
          en: 'Required parts: (0) architecture & order, (1) onboard the domain and proxy the right records, (2) Full (strict) SSL/TLS and origin lockdown, (3) WAF managed Simulate-then-Block, login rate limits, basic bots. Recommended: Cache Rules, Speed/Images, hit ratio and Core Web Vitals.',
        },
        {
          vi: 'Phần tùy chọn chỉ sau khi nền ổn: API Shield cho API, Load Balancing / Waiting Room / DDoS sâu hơn khi traffic hoặc đa origin thật sự cần. Kết thúc bằng 10 golden rules và sổ tay dashboard — để team không “cấu hình theo cảm xúc” lần sau.',
          en: 'Optional modules come only after the spine is stable: API Shield for APIs, Load Balancing / Waiting Room / deeper DDoS when multi-origin traffic truly needs them. You finish with 10 golden rules and a dashboard runbook — so the next change is not guesswork.',
        },
      ],
    },
    {
      heading: {
        vi: 'Developer Platform: Worker-first, Pages là đường tương thích',
        en: 'Developer Platform: Worker-first, Pages as the compatibility path',
      },
      paragraphs: [
        {
          vi: 'Track 2026 đặt compute mặc định là Workers. On-ramp chính thức: C3 (`npm create cloudflare`) + Wrangler → Hello World trên `*.workers.dev`. App mới không nên bắt đầu bằng Pages Functions nếu bạn đang dựng API/service.',
          en: 'The 2026 track makes Workers the default compute. Official on-ramp: C3 (`npm create cloudflare`) + Wrangler → Hello World on `*.workers.dev`. New apps should not start with Pages Functions if you are building an API or service.',
        },
        {
          vi: 'Thứ tự xương sống: (1) C3/Wrangler + secret đúng chỗ, (2) Pages chỉ khi đã có Git/framework site, (3) chọn storage theo mẫu truy cập — KV (flag/cache nhẹ), D1 (SQL có schema), R2 (file/object), (4) quan sát (`wrangler tail`) + Turnstile cho form public, (5) AI có kiểm soát (Workers AI → AI Gateway → RAG/Agents khi boundary rõ).',
          en: 'Spine order: (1) C3/Wrangler with secrets in the right place, (2) Pages only when you already have a Git/framework site, (3) pick storage by access pattern — KV (flags/light cache), D1 (schema SQL), R2 (files/objects), (4) observe (`wrangler tail`) + Turnstile on public forms, (5) deliberate AI (Workers AI → AI Gateway → RAG/Agents once boundaries are clear).',
        },
        {
          vi: 'Durable Objects, Queues, Workflows, Hyperdrive là optional — chọn đúng một sau khi Worker + storage ổn. Hub này (Pages + Functions + D1) là ví dụ tương thích Git; project mới vẫn ưu tiên Worker-first.',
          en: 'Durable Objects, Queues, Workflows, and Hyperdrive are optional — pick exactly one after Worker + storage are stable. This hub (Pages + Functions + D1) is a Git-compatibility example; new projects still prefer Worker-first.',
        },
      ],
      diagramSlug: 'programmable-platforms',
    },
    {
      heading: {
        vi: 'Cách học hai track trong một tuần (gợi ý thực tế)',
        en: 'How to learn both tracks in one week (a practical sketch)',
      },
      paragraphs: [
        {
          vi: 'Nếu bạn có domain production hoặc staging: ưu tiên Application Services ngày 1–3 (zone Active, proxy, Full strict, WAF Simulate). Ngày 4–5: cache rules cho `/assets`, bypass `/admin` `/checkout`. Song song, mở Developer Platform Phần 0–1 trên máy local — không cần domain.',
          en: 'If you have a production or staging domain: prioritize Application Services on days 1–3 (Active zone, proxy, Full strict, WAF Simulate). Days 4–5: cache rules for `/assets`, bypass `/admin` `/checkout`. In parallel, open Developer Platform Parts 0–1 locally — no domain required.',
        },
        {
          vi: 'Nếu bạn là developer chưa onboard site: làm DP trước đến hết storage (Phần 3), rồi quay lại AS khi gắn custom domain cho Worker/Pages. Use case trên hub là cửa chọn; track mới là đường làm theo.',
          en: 'If you are a developer who has not onboarded a site yet: finish DP through storage (Part 3) first, then return to AS when you attach a custom domain to a Worker/Pages project. Use cases on this hub are doorways; the new tracks are the how-to path.',
        },
        {
          vi: 'Luôn đối chiếu docs chính thức và learning path Cloudflare khi dashboard đổi nhãn. Bài hub giữ mô hình tinh thần ổn định; changelog sản phẩm cho biết tính năng vừa ship.',
          en: 'Always cross-check official docs and Cloudflare learning paths when dashboard labels shift. Hub articles keep the mental model stable; the product changelog tells you what just shipped.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
  ],
  faq: [
    {
      question: {
        vi: 'Follow-along khác bài blog giải thích sản phẩm thế nào?',
        en: 'How is a follow-along different from a product explainer blog post?',
      },
      answer: {
        vi: 'Blog giải thích “là gì / vì sao”. Follow-along nói “làm gì theo thứ tự trên dashboard”, có checkpoint xác nhận, và cho phép dừng sớm mà vẫn có kết quả hữu ích.',
        en: 'Explainers answer “what / why.” Follow-alongs answer “what to click in order,” with checkpoints, and let you stop early with something still useful.',
      },
    },
    {
      question: {
        vi: 'Tôi nên học Application Services hay Developer Platform trước?',
        en: 'Should I learn Application Services or Developer Platform first?',
      },
      answer: {
        vi: 'Có website/API đang chạy → Application Services trước. Đang dựng app/API mới trên edge → Developer Platform trước (Worker + C3). Nhiều team làm song song phần nền của cả hai.',
        en: 'Live website/API → Application Services first. Building a new edge app/API → Developer Platform first (Worker + C3). Many teams run the baselines of both in parallel.',
      },
    },
    {
      question: {
        vi: 'Pages còn được khuyến nghị không?',
        en: 'Is Pages still recommended?',
      },
      answer: {
        vi: 'Có — như đường tương thích cho site Git/framework sẵn có. App/service mới nên Worker-first; Pages Functions khi logic gắn chặt với site đó.',
        en: 'Yes — as the compatibility path for an existing Git/framework site. New apps/services should be Worker-first; use Pages Functions when logic is tightly tied to that site.',
      },
    },
    {
      question: {
        vi: 'Nội dung có thay thế docs Cloudflare không?',
        en: 'Does this replace Cloudflare docs?',
      },
      answer: {
        vi: 'Không. Track trích dẫn learning path và docs chính thức; hub giữ thứ tự và checkpoint. Khi cần chi tiết triển khai mới nhất, luôn mở developers.cloudflare.com.',
        en: 'No. Tracks cite official learning paths and docs; the hub keeps order and checkpoints. For the latest implementation detail, always open developers.cloudflare.com.',
      },
    },
  ],
  sources: [
    {
      title: 'Application security learning path',
      href: 'https://developers.cloudflare.com/learning-paths/application-security/',
    },
    {
      title: 'Workers learning path',
      href: 'https://developers.cloudflare.com/learning-paths/workers/',
    },
    {
      title: 'DNS best practices learning path',
      href: 'https://developers.cloudflare.com/learning-paths/dns-best-practices/',
    },
    {
      title: 'The Cloudflare Blog — Developer Platform',
      href: 'https://blog.cloudflare.com/tag/developer-platform/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['dns', 'cdn', 'waf', 'workers', 'd1', 'r2', 'kv'],
  relatedPostSlugs: [
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'dns-proxy-dam-may-cam-cho-nguoi-moi',
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  ],
  hubLinks: [
    {
      href: '/tracks/application-services/',
      label: {
        vi: 'Lộ trình Application Services (follow-along)',
        en: 'Application Services track (follow-along)',
      },
    },
    {
      href: '/tracks/developer-platform/',
      label: {
        vi: 'Lộ trình Developer Platform (follow-along)',
        en: 'Developer Platform track (follow-along)',
      },
    },
    {
      href: '/tracks/application-services/as-0-l1/',
      label: {
        vi: 'Bắt đầu AS — kiến trúc & thứ tự',
        en: 'Start AS — architecture & order',
      },
    },
    {
      href: '/tracks/developer-platform/dp-0-l1/',
      label: {
        vi: 'Bắt đầu DP — kiến trúc Worker-first',
        en: 'Start DP — Worker-first architecture',
      },
    },
    {
      href: '/use-cases/application-services/',
      label: { vi: 'Use cases Application Services', en: 'Application Services use cases' },
    },
    {
      href: '/use-cases/developer-platform/',
      label: { vi: 'Use cases Developer Platform', en: 'Developer Platform use cases' },
    },
    {
      href: '/changelog/',
      label: { vi: 'Changelog sản phẩm Cloudflare', en: 'Cloudflare product changelog' },
    },
  ],
  diagramSlugs: [
    'distributed-web-performance-architecture',
    'programmable-platforms',
    'fullstack-application',
  ],
};
