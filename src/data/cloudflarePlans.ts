import type { LocalizedString } from '../i18n/types';
import plansData from './cloudflarePlans.data.json';

export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise';

export type PlanCell = string;

export type PlanFeature = {
  id: string;
  name: LocalizedString;
  free: PlanCell;
  pro: PlanCell;
  business: PlanCell;
  enterprise: PlanCell;
  note?: LocalizedString;
};

export type PlanCategory = {
  id: string;
  title: LocalizedString;
  features: PlanFeature[];
};

export const planCategories = plansData.categories as PlanCategory[];
export const businessEnterpriseHighlights = plansData.highlights as (PlanFeature & { categoryId: string })[];

export const PLANS_SOURCE_NOTE: LocalizedString = {
  vi: 'Bảng tính năng mang tính “snapshot”. Dữ liệu ban đầu dựa trên so sánh nội bộ 2025 (Free / Pro / Business / Enterprise) và được rà soát lại cách diễn giải trong 2026. Giá/tên tính năng thay đổi thường xuyên — luôn đối chiếu cloudflare.com/plans và developers.cloudflare.com trước khi ra quyết định.',
  en: 'This feature matrix is a “snapshot”. The baseline originated from a 2025 internal comparison (Free / Pro / Business / Enterprise) and the wording was re-reviewed in 2026. Pricing and feature names change frequently — always cross-check cloudflare.com/plans and developers.cloudflare.com before purchasing decisions.',
};

export const plansPageIntro: LocalizedString = {
  vi: 'Hướng dẫn chọn gói Cloudflare cho doanh nghiệp vừa và nhỏ (SME) đang cân nhắc nâng từ Pro lên Business hoặc Enterprise — kèm bảng so sánh 124 tính năng theo nhóm.',
  en: 'Guide for SMEs evaluating Cloudflare plans — especially upgrading from Pro to Business or Enterprise — with a 124-row feature comparison by category.',
};

export const planTierCards: {
  id: PlanTier;
  name: LocalizedString;
  tagline: LocalizedString;
  typicalBuyer: LocalizedString;
  pricingHint: LocalizedString;
}[] = [
  {
    id: 'free',
    name: { vi: 'Free', en: 'Free' },
    tagline: { vi: 'CDN & DNS cơ bản', en: 'Basic CDN & DNS' },
    typicalBuyer: {
      vi: 'Blog cá nhân, MVP, thử nghiệm — không cần WAF nâng cao hay SLA.',
      en: 'Personal sites, MVPs, experiments — no advanced WAF or SLA needs.',
    },
    pricingHint: { vi: '$0', en: '$0' },
  },
  {
    id: 'pro',
    name: { vi: 'Pro', en: 'Pro' },
    tagline: { vi: 'Website production nhỏ', en: 'Small production sites' },
    typicalBuyer: {
      vi: 'Startup / team nhỏ có domain production, cần WAF managed rules và SSL đầy đủ.',
      en: 'Startups or small teams with production domains needing managed WAF rules and full SSL.',
    },
    pricingHint: {
      vi: 'Giá công bố theo zone/tháng — xem cloudflare.com/plans',
      en: 'Published per-zone monthly pricing — see cloudflare.com/plans',
    },
  },
  {
    id: 'business',
    name: { vi: 'Business', en: 'Business' },
    tagline: { vi: 'SME: bảo mật & hiệu năng chuẩn doanh nghiệp', en: 'SME: standard security & performance' },
    typicalBuyer: {
      vi: 'SME có doanh thu từ web/app, cần SLA 100%, WAF custom rules, cache bypass cookie, PCI — trước khi cần IP ưu tiên hoặc API Shield enterprise.',
      en: 'SMEs with revenue on web/apps needing 100% uptime SLA, custom WAF, cache bypass on cookie, PCI — before needing prioritized IPs or enterprise API Shield.',
    },
    pricingHint: {
      vi: 'Giá công bố cao hơn Pro — thường là bước nâng đầu cho SME',
      en: 'Higher published pricing than Pro — often the first upgrade step for SMEs',
    },
  },
  {
    id: 'enterprise',
    name: { vi: 'Enterprise', en: 'Enterprise' },
    tagline: { vi: 'Quy mô lớn, compliance, kiểm soát sâu', en: 'Scale, compliance, deep control' },
    typicalBuyer: {
      vi: 'Tổ chức cần custom cache keys, purge theo tag/host, Enterprise DDoS, Access/SWG/Zero Trust quy mô, hỗ trợ 24/7 named, hợp đồng & roadmap riêng.',
      en: 'Organizations needing custom cache keys, tag/host purge, Enterprise DDoS, scaled Access/SWG/Zero Trust, 24/7 named support, and custom contracts.',
    },
    pricingHint: {
      vi: 'Giá tùy chỉnh — làm việc với Cloudflare Sales / đối tác',
      en: 'Custom pricing — via Cloudflare Sales or partners',
    },
  },
];

export const smeDecisionGuide: {
  title: LocalizedString;
  bullets: LocalizedString[];
}[] = [
  {
    title: { vi: 'Chọn Business khi…', en: 'Choose Business when…' },
    bullets: [
      {
        vi: 'Bạn cần WAF custom rules, SLA uptime cam kết, và cache rule linh hoạt (ví dụ bypass theo cookie) nhưng chưa cần purge theo tag hoặc IP ưu tiên.',
        en: 'You need custom WAF rules, committed uptime SLA, and flexible cache rules (e.g. bypass on cookie) but not tag-based purge or prioritized IPs.',
      },
      {
        vi: 'Team vận hành nhỏ (1–5 người) quản lý vài zone production, ngân sách cố định hơn Enterprise.',
        en: 'A small ops team (1–5) manages a few production zones with more predictable spend than Enterprise.',
      },
      {
        vi: 'Ưu tiên PCI DSS, image optimization, và hỗ trợ chat 24/7 so với Free/Pro.',
        en: 'You want PCI DSS, image optimization, and 24/7 chat support vs Free/Pro.',
      },
    ],
  },
  {
    title: { vi: 'Chọn Enterprise khi…', en: 'Choose Enterprise when…' },
    bullets: [
      {
        vi: 'Cần Enterprise DDoS, custom cache keys, purge theo tag/host, hoặc routing IP ưu tiên cho traffic quan trọng.',
        en: 'You need Enterprise DDoS, custom cache keys, tag/host purge, or prioritized IP routing for critical traffic.',
      },
      {
        vi: 'Triển khai Zero Trust rộng: Access Premium, Gateway/SWG, Browser Isolation, nhiều identity provider — vượt gói “50 users” của Business.',
        en: 'Broad Zero Trust: Access Premium, Gateway/SWG, Browser Isolation, many IdPs — beyond Business “50 users” style limits.',
      },
      {
        vi: 'Yêu cầu compliance, Logpush đầy đủ, named CSM/TSE, POC kiến trúc, hoặc hợp đồng đa năm với cam kết SLA chi tiết.',
        en: 'You need compliance workflows, full Logpush, named CSM/TSE, architecture POC, or multi-year contracts with detailed SLAs.',
      },
    ],
  },
];

/** Curated SME-facing differences (Business vs Enterprise only) */
export const smeKeyDifferentiators: {
  feature: LocalizedString;
  business: LocalizedString;
  enterprise: LocalizedString;
  whyItMatters: LocalizedString;
}[] = [
  {
    feature: { vi: 'Custom Cache Keys', en: 'Custom Cache Keys' },
    business: { vi: 'Không', en: 'No' },
    enterprise: { vi: 'Có', en: 'Yes' },
    whyItMatters: {
      vi: 'Hữu ích khi nhiều tenant/API dùng chung URL pattern — cache đúng theo header/cookie.',
      en: 'Useful for multi-tenant APIs sharing URL patterns — cache correctly by header/cookie.',
    },
  },
  {
    feature: { vi: 'Enterprise DDoS mitigation', en: 'Enterprise DDoS mitigation' },
    business: { vi: 'Không', en: 'No' },
    enterprise: { vi: 'Có', en: 'Yes' },
    whyItMatters: {
      vi: 'Mục tiêu giảm rủi ro tấn công lớn lên brand/doanh thu trực tuyến.',
      en: 'Reduces risk from large attacks on brand and online revenue.',
    },
  },
  {
    feature: { vi: 'Cache purge (tag / host)', en: 'Cache purge (tag / host)' },
    business: { vi: 'Không', en: 'No' },
    enterprise: { vi: 'Có', en: 'Yes' },
    whyItMatters: {
      vi: 'Deploy nhanh nhiều microsite hoặc SaaS — xóa cache theo nhóm thay vì purge toàn zone.',
      en: 'Faster releases across microsites or SaaS — invalidate by group instead of whole zone.',
    },
  },
  {
    feature: { vi: 'Prioritized IP ranges', en: 'Prioritized IP ranges' },
    business: { vi: 'Không', en: 'No' },
    enterprise: { vi: 'Có', en: 'Yes' },
    whyItMatters: {
      vi: 'Traffic enterprise đi tuyến ưu tiên — ít biến động routing hơn gói thấp.',
      en: 'Enterprise traffic uses prioritized routing — fewer routing surprises vs lower tiers.',
    },
  },
  {
    feature: { vi: 'API Shield', en: 'API Shield' },
    business: { vi: 'Không / hạn chế', en: 'No / limited' },
    enterprise: { vi: 'Custom pricing', en: 'Custom pricing' },
    whyItMatters: {
      vi: 'Bảo vệ API machine-to-machine (schema, mTLS, discovery) — phổ biến ở SME fintech/B2B.',
      en: 'Protects machine-to-machine APIs (schema, mTLS, discovery) — common for fintech/B2B SMEs.',
    },
  },
  {
    feature: { vi: 'Cloudflare Access', en: 'Cloudflare Access' },
    business: { vi: '~50 users included', en: '~50 users included' },
    enterprise: { vi: 'Custom pricing / scale', en: 'Custom pricing / scale' },
    whyItMatters: {
      vi: 'Khi toàn công ty remote cần ZTNA thay VPN — Enterprise scale theo nhân sự & IdP.',
      en: 'When the whole company needs ZTNA instead of VPN — Enterprise scales with headcount and IdPs.',
    },
  },
];

export const OFFICIAL_PLANS_URL = 'https://www.cloudflare.com/plans/';
export const CONTACT_SALES_URL = 'https://www.cloudflare.com/plans/enterprise/contact/';
