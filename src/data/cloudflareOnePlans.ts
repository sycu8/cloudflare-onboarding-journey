import type { LocalizedString } from '../i18n/types';
import plansData from './cloudflareOnePlans.data.json';

export type CloudflareOnePlanTier = 'free' | 'paygo' | 'enterprise';

export type CloudflareOnePlanCell = string;

export type CloudflareOnePlanFeature = {
  id: string;
  name: LocalizedString;
  free: CloudflareOnePlanCell;
  paygo: CloudflareOnePlanCell;
  enterprise: CloudflareOnePlanCell;
  note?: LocalizedString;
};

export type CloudflareOnePlanCategory = {
  id: string;
  title: LocalizedString;
  features: CloudflareOnePlanFeature[];
};

export const cloudflareOnePlanCategories = plansData.categories as CloudflareOnePlanCategory[];
export const cloudflareOnePaygoEnterpriseHighlights = plansData.highlights as (CloudflareOnePlanFeature & {
  categoryId: string;
})[];

export const CLOUDFLARE_ONE_PRICING_URL = 'https://www.cloudflare.com/plans/zero-trust-services/';
export const CLOUDFLARE_ONE_DASHBOARD_URL = 'https://one.dash.cloudflare.com/';
export const CONTACT_SALES_URL = 'https://www.cloudflare.com/plans/enterprise/contact/';

export const CLOUDFLARE_ONE_PLANS_SOURCE_NOTE: LocalizedString = {
  vi: 'Bảng so sánh dựa trên tab “SASE and Workspace Security” tại cloudflare.com/plans/zero-trust-services/ (snapshot 2026). Giá và add-on thay đổi — luôn đối chiếu trang chính thức và Zero Trust > Settings > Billing trước khi mua.',
  en: 'This matrix follows the “SASE and Workspace Security” tab at cloudflare.com/plans/zero-trust-services/ (2026 snapshot). Pricing and add-ons change — always cross-check the official page and Zero Trust > Settings > Billing before purchasing.',
};

export const cloudflareOnePlansPageIntro: LocalizedString = {
  vi: 'Cloudflare One (Zero Trust / SASE) có ba lớp billing trên trang chính thức: Free (≤50 user), Pay-as-you-go ($7/user/tháng, tự phục vụ), và Contract Plan (Enterprise — giá tùy chỉnh theo user/năm). Trang này tập trung so sánh Pay-as-you-go với Enterprise khi team vượt free tier hoặc cần DLP/CASB/email/SASE network đầy đủ.',
  en: 'Cloudflare One (Zero Trust / SASE) has three billing tiers on the official page: Free (≤50 users), Pay-as-you-go ($7/user/month, self-serve), and Contract (Enterprise — custom annual pricing per user). This page focuses on Pay-as-you-go vs Enterprise when you outgrow Free or need full DLP/CASB/email/SASE networking.',
};

export const cloudflareOnePlanTierCards: {
  id: CloudflareOnePlanTier;
  officialName: LocalizedString;
  tagline: LocalizedString;
  typicalBuyer: LocalizedString;
  pricingHint: LocalizedString;
}[] = [
  {
    id: 'free',
    officialName: { vi: 'Free Plan', en: 'Free Plan' },
    tagline: { vi: 'POC & team nhỏ', en: 'POC & small teams' },
    typicalBuyer: {
      vi: 'Team dưới 50 user hoặc proof-of-concept Enterprise trước khi cam kết hợp đồng.',
      en: 'Teams under 50 users or an Enterprise proof-of-concept before contract commitment.',
    },
    pricingHint: { vi: '$0', en: '$0' },
  },
  {
    id: 'paygo',
    officialName: { vi: 'Pay-as-you-go', en: 'Pay-as-you-go' },
    tagline: { vi: 'SSE self-serve sau 50 user', en: 'Self-serve SSE beyond 50 users' },
    typicalBuyer: {
      vi: 'Team >50 user cần ZTNA + SWG + DLP predefined, SLA 100%, log 30 ngày — không cần phone support hay SASE network add-on.',
      en: 'Teams over 50 users needing ZTNA + SWG + predefined DLP, 100% SLA, and 30-day logs — without phone support or SASE network add-ons.',
    },
    pricingHint: { vi: '$7/user/tháng', en: '$7/user/month' },
  },
  {
    id: 'enterprise',
    officialName: { vi: 'Contract Plan (Enterprise)', en: 'Contract Plan (Enterprise)' },
    tagline: { vi: 'SASE / workspace security đầy đủ', en: 'Full SASE / workspace security' },
    typicalBuyer: {
      vi: 'Tổ chức triển khai DLP custom, CASB mở rộng, email security, RBI, Logpush/SIEM, Magic WAN — cần hợp đồng và Professional Services.',
      en: 'Organizations deploying custom DLP, expanded CASB, email security, RBI, Logpush/SIEM, Magic WAN — needing contracts and Professional Services.',
    },
    pricingHint: {
      vi: 'Giá tùy chỉnh / user / năm',
      en: 'Custom price / user / year',
    },
  },
];

export const cloudflareOneDecisionGuide: {
  title: LocalizedString;
  bullets: LocalizedString[];
}[] = [
  {
    title: { vi: 'Chọn Pay-as-you-go khi…', en: 'Choose Pay-as-you-go when…' },
    bullets: [
      {
        vi: 'Bạn vượt 50 user trên Free nhưng vẫn self-serve được — chấp nhận chat/ticket thay vì phone support.',
        en: 'You exceed 50 Free users but can stay self-serve — chat/ticket support is enough vs phone support.',
      },
      {
        vi: 'Use case hẹp: ZTNA + SWG + DLP predefined profiles, log 30 ngày — chưa cần custom DLP hoặc email security.',
        en: 'Narrow use case: ZTNA + SWG + predefined DLP profiles and 30-day logs — no custom DLP or email security yet.',
      },
      {
        vi: 'Ngân sách theo seat rõ ràng ($7/user/tháng) và chưa cần bundle SASE network (Magic WAN / Firewall).',
        en: 'Predictable per-seat spend ($7/user/month) and no SASE network bundle (Magic WAN / Firewall) yet.',
      },
    ],
  },
  {
    title: { vi: 'Chọn Enterprise (Contract) khi…', en: 'Choose Enterprise (Contract) when…' },
    bullets: [
      {
        vi: 'Cần DLP full-featured (custom profiles), CASB unlimited out-of-band, email security, hoặc RBI trong một gói hợp đồng.',
        en: 'You need full-featured DLP (custom profiles), unlimited out-of-band CASB, email security, or RBI under contract.',
      },
      {
        vi: 'Yêu cầu Logpush tới SIEM, retention 6 tháng, phone support, hoặc Professional Services triển khai.',
        en: 'You require Logpush to a SIEM, six-month retention, phone support, or Professional Services for rollout.',
      },
      {
        vi: 'Lộ trình SASE đầy đủ: workspace security + network services (Magic WAN, Magic Firewall) — packaging theo tab Network Services.',
        en: 'Full SASE roadmap: workspace security plus network services (Magic WAN, Magic Firewall) — packaged per the Network Services tab.',
      },
    ],
  },
];

export const cloudflareOneKeyDifferentiators: {
  feature: LocalizedString;
  paygo: LocalizedString;
  enterprise: LocalizedString;
  whyItMatters: LocalizedString;
}[] = [
  {
    feature: { vi: 'DLP profiles', en: 'DLP profiles' },
    paygo: { vi: 'Predefined, giới hạn', en: 'Limited predefined' },
    enterprise: { vi: 'Full-featured (add-on)', en: 'Full-featured (add-on)' },
    whyItMatters: {
      vi: 'Custom DLP cho PII/secret theo classification nội bộ thường là điểm chuyển sang Contract.',
      en: 'Custom DLP for internal PII/secret classifications is often the trigger to move to Contract.',
    },
  },
  {
    feature: { vi: 'CASB integrations', en: 'CASB integrations' },
    paygo: { vi: '2 read-only API', en: '2 read-only API' },
    enterprise: { vi: 'Unlimited OOB (add-on)', en: 'Unlimited OOB (add-on)' },
    whyItMatters: {
      vi: 'Shadow SaaS discovery ở quy mô lớn cần nhiều tích hợp out-of-band hơn self-serve tier.',
      en: 'Large-scale Shadow SaaS discovery needs more out-of-band integrations than the self-serve tier.',
    },
  },
  {
    feature: { vi: 'Log retention & Logpush', en: 'Log retention & Logpush' },
    paygo: { vi: '30 ngày, không Logpush', en: '30 days, no Logpush' },
    enterprise: { vi: '6 tháng + Logpush SIEM', en: '6 months + Logpush to SIEM' },
    whyItMatters: {
      vi: 'Compliance và điều tra sự cố thường cần export log dài hạn — Pay-as-you-go không đủ.',
      en: 'Compliance and incident response often need long-term log export — Pay-as-you-go is not enough.',
    },
  },
  {
    feature: { vi: 'Email security', en: 'Email security' },
    paygo: { vi: 'Không có', en: 'Not available' },
    enterprise: { vi: 'Add-on', en: 'Add-on' },
    whyItMatters: {
      vi: 'Phishing/BEC protection gắn với workspace bundle thường nằm ở Contract, không phải $7 seat.',
      en: 'Phishing/BEC protection in the workspace bundle typically sits on Contract, not the $7 seat.',
    },
  },
  {
    feature: { vi: 'SASE network services', en: 'SASE network services' },
    paygo: { vi: 'Không có', en: 'Not available' },
    enterprise: { vi: 'Add-on (WAN / Firewall)', en: 'Add-on (WAN / Firewall)' },
    whyItMatters: {
      vi: 'Thay MPLS / hub-spoke bằng Magic WAN cần tab Network Services — ngoài Pay-as-you-go workspace tier.',
      en: 'Replacing MPLS / hub-spoke with Magic WAN uses the Network Services tab — beyond Pay-as-you-go workspace tier.',
    },
  },
  {
    feature: { vi: 'Hỗ trợ', en: 'Support' },
    paygo: { vi: 'Chat & ticket', en: 'Chat & ticket' },
    enterprise: { vi: 'Phone + PS add-on', en: 'Phone + PS add-on' },
    whyItMatters: {
      vi: 'Incident khẩn với ZTNA/Gateway outage — phone support và PS thường là lý do Enterprise.',
      en: 'Urgent ZTNA/Gateway incidents — phone support and PS are common Enterprise drivers.',
    },
  },
];
