import type { LocalizedString } from '../i18n/types';
import packageData from './enterpriseSuccessPackages.data.json';

export type SuccessPackageTier = 'standard' | 'premiumT1' | 'premiumT2' | 'premiumT3';

export type SuccessPackageCell = string;

export type SuccessPackageFeature = {
  id: string;
  name: LocalizedString;
  standard: SuccessPackageCell;
  premiumT1: SuccessPackageCell;
  premiumT2: SuccessPackageCell;
  premiumT3: SuccessPackageCell;
  note?: LocalizedString;
};

export type SuccessPackageCategory = {
  id: string;
  title: LocalizedString;
  features: SuccessPackageFeature[];
};

export type SuccessPackageMeta = {
  id: SuccessPackageTier;
  name: LocalizedString;
  pricingHint: LocalizedString;
  acvRange: LocalizedString | null;
};

export type SuccessAddOnService = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
};

export const SUCCESS_PACKAGES_SOURCE_NOTE: LocalizedString = {
  vi: 'Nguồn: Cloudflare Support & Success Packages — Asia & Latin America (Solution Brief SOLMKT, 2025). Standard đi kèm mọi hợp đồng Enterprise; Premium (~20% ACV/năm) có 3 tier theo giá trị hợp đồng. Luôn xác nhận entitlement với Sales / đối tác trước khi mua.',
  en: 'Source: Cloudflare Support & Success Packages — Asia & Latin America (Solution Brief SOLMKT, 2025). Standard ships with every Enterprise contract; Premium (~20% ACV/year) has three tiers by contract value. Always confirm entitlements with Sales or your partner before purchase.',
};

export const successPackagesPageIntro: LocalizedString = {
  vi: 'Gói Enterprise bao gồm Standard Success & Support — onboarding modules, hỗ trợ 24/7, phone khẩn cấp, và SLA phản hồi case theo severity (P1 ≤2 giờ). Premium Success là nâng cấp tùy chọn (~20% giá trị hợp đồng/năm) với hàng đợi ưu tiên, SLA nhanh hơn, Named CSM và tối ưu cấu hình sâu hơn — tier Premium phụ thuộc ACV.',
  en: 'Enterprise includes Standard Success & Support — onboarding modules, 24/7 support, emergency phone, and severity-based case response SLAs (P1 ≤2 hours). Premium Success is an optional upgrade (~20% of annual contract value) with a priority queue, faster SLAs, a named CSM, and deeper configuration optimization — Premium tier depends on ACV.',
};

export const successPackagesRegionNote = packageData.regionNote as LocalizedString;
export const successPackageTiers = packageData.packages as SuccessPackageMeta[];
export const successPackageCategories = packageData.categories as SuccessPackageCategory[];
export const successAddOnServices = packageData.addOnServices as SuccessAddOnService[];

export const standardVsPremiumSummary: {
  title: LocalizedString;
  standard: LocalizedString;
  premium: LocalizedString;
} = {
  title: {
    vi: 'Standard vs Premium — tóm tắt nhanh',
    en: 'Standard vs Premium — quick summary',
  },
  standard: {
    vi: 'Đi kèm Enterprise: CSM theo team, SLA P1 ≤2h, webinar tối ưu, credit SLA 10×, không có premium queue hay expert setup session.',
    en: 'Included with Enterprise: team CSM, P1 SLA ≤2h, webinar optimization, 10× SLA credits, no premium queue or expert setup session.',
  },
  premium: {
    vi: 'Mua thêm (~20% ACV): Named CSM, premium queue, SLA P1 ≤1h, expert/focused/tailored sessions theo tier, credit SLA 25×.',
    en: 'Optional add-on (~20% ACV): named CSM, premium queue, P1 SLA ≤1h, expert/focused/tailored sessions by tier, 25× SLA credits.',
  },
};
