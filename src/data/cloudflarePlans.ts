import type { LocalizedString } from '../i18n/types';

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

/**
 * The old feature matrix came from a non-public spreadsheet and is not rendered.
 * Plan facts belong on the official plans page until each row has a public source.
 */
export const planCategories: PlanCategory[] = [];

export const OFFICIAL_PLANS_URL = 'https://www.cloudflare.com/plans/';
export const PLANS_DOCS_URL = 'https://developers.cloudflare.com/fundamentals/account-and-billing/';

export const plansPageIntro: LocalizedString = {
  vi: 'Cloudflare công bố các gói Free, Pro, Business và Contract trên trang gói chính thức. Hub này không sao chép bảng quyền lợi. Hãy mở trang đó khi bạn cần biết tính năng hoặc giá.',
  en: 'Cloudflare publishes Free, Pro, Business, and Contract plans on its official plans page. This hub does not copy an entitlement matrix. Open that page when you need features or prices.',
  km: 'Cloudflare publishes Free, Pro, Business, and Contract plans on its official plans page. This hub does not copy an entitlement matrix.',
};

export const planTierCards: {
  id: PlanTier;
  name: LocalizedString;
  tagline: LocalizedString;
}[] = [
  {
    id: 'free',
    name: { vi: 'Free', en: 'Free' },
    tagline: {
      vi: 'Mức miễn phí trên trang gói chính thức.',
      en: 'The free level on the official plans page.',
    },
  },
  {
    id: 'pro',
    name: { vi: 'Pro', en: 'Pro' },
    tagline: {
      vi: 'Gói trả phí tự phục vụ. Giá niêm yết trên trang gói.',
      en: 'A self-serve paid plan. The listed price is on the plans page.',
    },
  },
  {
    id: 'business',
    name: { vi: 'Business', en: 'Business' },
    tagline: {
      vi: 'Gói trả phí tự phục vụ cao hơn Pro. Đối chiếu trang gói trước khi chọn.',
      en: 'A higher self-serve paid plan. Check the plans page before you choose.',
    },
  },
  {
    id: 'enterprise',
    name: { vi: 'Contract', en: 'Contract' },
    tagline: {
      vi: 'Gói theo hợp đồng. Điều khoản nằm trên trang gói chính thức.',
      en: 'The contract plan. Terms are on the official plans page.',
    },
  },
];
