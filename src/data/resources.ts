import type { LocalizedString } from '../i18n/types';

export type ResourceCard = {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  type: 'checklist' | 'diagram' | 'slides' | 'lab' | 'external';
  href: string;
  status: 'available' | 'coming-soon';
  /** Hidden from HTML, search, and the resource list while sales content is off. */
  commercial?: boolean;
};

export const resources: ResourceCard[] = [
  {
    slug: 'system-status',
    title: { vi: 'System status & incidents', en: 'System status & incidents' },
    description: {
      vi: 'Live từ www.cloudflarestatus.com — sự cố đang mở và lịch sử gần đây.',
      en: 'Live from www.cloudflarestatus.com — open incidents and recent history.',
    },
    type: 'external',
    href: '/status',
    status: 'available',
  },
  {
    slug: 'changelog',
    title: { vi: 'Changelog sản phẩm', en: 'Product changelog' },
    description: {
      vi: 'Cập nhật từ developers.cloudflare.com/changelog — lọc theo sản phẩm và lộ trình hub.',
      en: 'Updates from developers.cloudflare.com/changelog — filter by product and hub track.',
    },
    type: 'external',
    href: '/changelog',
    status: 'available',
  },
  {
    slug: 'support-case-helper',
    title: { vi: 'Trợ lý viết Support case', en: 'Support case assistant' },
    description: {
      vi: 'Biến lỗi Cloudflare thành case gửi Support đầy đủ: mô tả hoặc dán screenshot, gợi ý nguyên nhân, thu thập bằng chứng theo mức ưu tiên P1–P4 và tạo bản nháp (EN/VI). Dữ liệu chỉ nằm trong trình duyệt — đừng nhập secret/API key.',
      en: 'Turn a Cloudflare error into a complete Support case: describe it or attach a screenshot, get likely causes, collect P1–P4 evidence, and generate a draft (EN/VI). Data stays in your browser — never enter secrets/API keys.',
    },
    type: 'external',
    href: 'https://helpr.orangecloud.vn/',
    status: 'available',
  },
  {
    slug: 'content-delivery',
    title: { vi: 'Content delivery & hiệu năng web', en: 'Content delivery & web performance' },
    description: {
      vi: 'Tăng tốc website: CDN, cache rules, Speed, đo LCP — checklist tương tác.',
      en: 'Speed up websites: CDN, cache rules, Speed, LCP measurement — interactive checklist.',
    },
    type: 'external',
    href: '/content-delivery',
    status: 'available',
  },
  {
    slug: 'ai-protection-portfolio',
    title: { vi: 'Cheatsheet bảo vệ AI', en: 'AI Protection Portfolio cheatsheet' },
    description: {
      vi: 'CASB, SWG, RBI, AI Gateway, WAF/Bots và Radar — map rủi ro AI vào các lớp kiểm soát Cloudflare.',
      en: 'CASB, SWG, RBI, AI Gateway, WAF/Bots, and Radar — map AI risks to Cloudflare control layers.',
    },
    type: 'external',
    href: '/cheatsheets/ai-protection-portfolio',
    status: 'available',
  },
  {
    slug: 'solution-proposals',
    title: { vi: 'Proposal bộ giải pháp', en: 'Solution proposals' },
    description: {
      vi: 'App Services, Cloudflare One SASE, Email Security — executive summary và thành phần giải pháp (EN/VI).',
      en: 'App Services, Cloudflare One SASE, Email Security — executive summaries and components (EN/VI).',
    },
    type: 'external',
    href: '/solutions',
    status: 'available',
  },
  {
    slug: 'demo-guides',
    title: { vi: 'Dashboard overview', en: 'Dashboard overview' },
    description: {
      vi: 'Overview Application Security & Cloudflare One — từng mục dashboard dùng để làm gì, không phải sales kit.',
      en: 'Application Security & Cloudflare One overviews — what each dashboard area is for, not a sales kit.',
    },
    type: 'external',
    href: '/demo-guides',
    status: 'available',
  },
  {
    slug: 'plan-comparison',
    title: { vi: 'So sánh gói Cloudflare (SME)', en: 'Cloudflare plan comparison (SME)' },
    description: {
      vi: 'Hub trỏ tới trang gói công khai. Không giữ bảng quyền lợi riêng.',
      en: 'The hub points at the public plans page and does not keep its own entitlement matrix.',
    },
    type: 'external',
    href: '/plans',
    status: 'available',
  },
  {
    slug: 'cloudflare-one-paygo-vs-enterprise',
    title: { vi: 'Cloudflare One: Paygo vs Enterprise', en: 'Cloudflare One: Paygo vs Enterprise' },
    description: {
      vi: 'So sánh Pay-as-you-go và Contract trên trang giá Zero Trust chính thức.',
      en: 'Pay-as-you-go and Contract compared on the official Zero Trust pricing page.',
    },
    type: 'external',
    href: 'https://www.cloudflare.com/plans/zero-trust-services/',
    status: 'available',
    commercial: true,
  },
  {
    slug: 'enterprise-plan',
    title: { vi: 'Gói Contract (Enterprise)', en: 'Contract (Enterprise) plan' },
    description: {
      vi: 'Giải thích ngắn và liên kết tới trang gói công khai.',
      en: 'A short note plus a link to the public plans page.',
    },
    type: 'external',
    href: '/enterprise',
    status: 'available',
  },
  {
    slug: 'beginner-checklist',
    title: { vi: 'Beginner Cloudflare Checklist', en: 'Beginner Cloudflare Checklist' },
    description: {
      vi: 'Checklist tương tác để tự đánh giá mental model và các bước khởi đầu.',
      en: 'Interactive checklist to self-assess your mental model and first steps.',
    },
    type: 'checklist',
    href: '/checklists/beginner-cloudflare-checklist',
    status: 'available',
  },
  {
    slug: 'app-services-checklist',
    title: { vi: 'Application Services Checklist', en: 'Application Services Checklist' },
    description: {
      vi: 'DNS, proxy, SSL/TLS, cache, WAF — các bước baseline cho website/API.',
      en: 'DNS, proxy, SSL/TLS, cache, WAF — baseline steps for websites/APIs.',
    },
    type: 'checklist',
    href: '/tracks/application-services',
    status: 'available',
  },
  {
    slug: 'dev-platform-checklist',
    title: { vi: 'Developer Platform Checklist', en: 'Developer Platform Checklist' },
    description: {
      vi: 'Pages, Workers, KV/D1, R2 — lộ trình deploy app serverless đầu tiên.',
      en: 'Pages, Workers, KV/D1, R2 — your first serverless app deployment path.',
    },
    type: 'checklist',
    href: '/tracks/developer-platform',
    status: 'available',
  },
  {
    slug: 'cloudflare-one-checklist',
    title: { vi: 'Cloudflare One Checklist', en: 'Cloudflare One Checklist' },
    description: {
      vi: 'Zero Trust, ZTNA, SWG — bước đầu cho VPN replacement và secure browsing.',
      en: 'Zero Trust, ZTNA, SWG — first steps for VPN replacement and secure browsing.',
    },
    type: 'checklist',
    href: '/tracks/cloudflare-one',
    status: 'available',
  },
  {
    slug: 'architecture-diagrams',
    title: { vi: 'Architecture diagrams', en: 'Architecture diagrams' },
    description: {
      vi: 'Sơ đồ request flow và use case architecture (đang bổ sung).',
      en: 'Request flow and use case architecture diagrams (being expanded).',
    },
    type: 'diagram',
    href: '/use-cases',
    status: 'available',
  },
  {
    slug: 'workshop-slides',
    title: { vi: 'Workshop slides', en: 'Workshop slides' },
    description: {
      vi: 'Tài liệu workshop beginner (placeholder — sẽ lưu trên R2).',
      en: 'Beginner workshop materials (placeholder — will be stored on R2).',
    },
    type: 'slides',
    href: '/workshop',
    status: 'coming-soon',
  },
  {
    slug: 'hands-on-labs',
    title: { vi: 'Developer Labs (Workers · MCP · Agents · Sandbox)', en: 'Developer Labs (Workers · MCP · Agents · Sandbox)' },
    description: {
      vi: '23 bài lab guided từ labs.cloudflare.dev — Bookmark API, MCP server, Agents SDK, Sandbox. Đọc từng bước trên track Developer Platform.',
      en: '23 guided labs from labs.cloudflare.dev — Bookmark API, MCP server, Agents SDK, Sandbox. Follow each step on the Developer Platform track.',
    },
    type: 'lab',
    href: '/tracks/developer-platform/labs/',
    status: 'available',
  },
  {
    slug: 'first-week',
    title: { vi: 'Tuần đầu (7 ngày)', en: 'First week (7 days)' },
    description: {
      vi: 'Kế hoạch học từng ngày, sai lầm thường gặp và snapshot sản phẩm 2026.',
      en: 'Day-by-day plan, common mistakes, and a 2026 product snapshot.',
    },
    type: 'guide',
    href: '/first-week',
    status: 'available',
  },
  {
    slug: 'cloudflare-resource-hub',
    title: { vi: 'Cloudflare Resource Hub', en: 'Cloudflare Resource Hub' },
    description: {
      vi: 'Chỉ mục docs, blog, community, case studies — liên kết tới phần tương ứng trong hub.',
      en: 'Index of docs, blog, community, case studies — linked to matching hub sections.',
    },
    type: 'external',
    href: '/resources#resource-hub',
    status: 'available',
  },
  {
    slug: 'reference-architecture',
    title: { vi: 'Cloudflare Reference Architecture', en: 'Cloudflare Reference Architecture' },
    description: {
      vi: 'Sơ đồ và kiến trúc tham chiếu: SASE, CDN, Workers, Zero Trust — từ Architecture Center.',
      en: 'Diagrams and reference architectures: SASE, CDN, Workers, Zero Trust — from the Architecture Center.',
    },
    type: 'diagram',
    href: '/resources#reference-architecture',
    status: 'available',
  },
  {
    slug: 'cloudflare-github',
    title: { vi: 'Cloudflare GitHub (open source)', en: 'Cloudflare GitHub (open source)' },
    description: {
      vi: 'Repo chính thức: workers-sdk, cloudflared, agents, vibesdk — kèm gợi ý lab từng repo.',
      en: 'Official repos: workers-sdk, cloudflared, agents, vibesdk — with per-repo lab hints.',
    },
    type: 'external',
    href: '/resources#github',
    status: 'available',
  },
  {
    slug: 'cloudsecop-cloudflare',
    title: { vi: 'CloudSecOp — bài viết Cloudflare thực chiến', en: 'CloudSecOp — Cloudflare field notes' },
    description: {
      vi: '59+ bài từ cloudsecop.net: 2 handbook (Developer Platform, Cloudflare One) và case study production.',
      en: '59+ posts from cloudsecop.net: two handbooks (Developer Platform, Cloudflare One) and production case studies.',
    },
    type: 'external',
    href: '/resources#cloudsecop',
    status: 'available',
  },
  {
    slug: 'cloudflare-learning-center',
    title: { vi: 'Cloudflare Learning Center (official)', en: 'Cloudflare Learning Center (official)' },
    description: {
      vi: 'Bài viết gốc về DDoS, CDN, DNS, Zero Trust, serverless và nhiều chủ đề khác.',
      en: 'Original articles on DDoS, CDN, DNS, Zero Trust, serverless, and more.',
    },
    type: 'external',
    href: 'https://www.cloudflare.com/learning/',
    status: 'available',
  },
];
