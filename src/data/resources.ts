import type { LocalizedString } from '../i18n/types';

export type ResourceCard = {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  type: 'checklist' | 'diagram' | 'slides' | 'lab' | 'external';
  href: string;
  status: 'available' | 'coming-soon';
};

export const resources: ResourceCard[] = [
  {
    slug: 'demo-guides',
    title: { vi: 'Script demo dashboard', en: 'Dashboard demo scripts' },
    description: {
      vi: 'Demo Application Security & Cloudflare One — cấu hình, menu dashboard, bước showcase cho SME.',
      en: 'Application Security & Cloudflare One demos — config paths and SME showcase steps.',
    },
    type: 'external',
    href: '/demo-guides',
    status: 'available',
  },
  {
    slug: 'plan-comparison',
    title: { vi: 'So sánh gói Cloudflare (SME)', en: 'Cloudflare plan comparison (SME)' },
    description: {
      vi: 'Business vs Enterprise: bảng 124 tính năng và gợi ý chọn gói cho doanh nghiệp vừa và nhỏ.',
      en: 'Business vs Enterprise: 124-feature matrix and SME buying guidance.',
    },
    type: 'external',
    href: '/plans',
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
    href: '/use-cases/protect-website',
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
    title: { vi: 'Hands-on labs', en: 'Hands-on labs' },
    description: {
      vi: 'Lab thực hành Pages, Workers, Zero Trust (đang phát triển).',
      en: 'Hands-on labs for Pages, Workers, Zero Trust (in development).',
    },
    type: 'lab',
    href: '/resources#labs',
    status: 'coming-soon',
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
