import type { LocalizedString } from '../i18n/types';

/** Public Enterprise plan explainer. Sales steering stays out of this module. */
export const ENTERPRISE_OFFICIAL_URL = 'https://www.cloudflare.com/plans/';
export const ENTERPRISE_DOCS_URL = 'https://developers.cloudflare.com/fundamentals/account-and-billing/';

export const enterprisePageIntro: LocalizedString = {
  vi: 'Gói Contract (Enterprise) trên Cloudflare là gói có hợp đồng, bên cạnh Free, Pro và Business. Trang này chỉ giải thích vai trò của gói đó trong lộ trình học. Danh sách tính năng và giá nằm trên trang gói chính thức.',
  en: 'Cloudflare’s Contract plan (often called Enterprise) sits beside Free, Pro, and Business. This page only explains that role for learners. Feature lists and prices live on the official plans page.',
  km: 'Contract plan (Enterprise) របស់ Cloudflare នៅក្បែរ Free, Pro និង Business។ ទំព័រនេះពន្យល់តួនាទីនោះសម្រាប់អ្នករៀន។ បញ្ជីមុខងារ និងតម្លៃនៅលើទំព័រផ្លូវការ។',
};

export const enterpriseFacts: { title: LocalizedString; body: LocalizedString; source: string }[] = [
  {
    title: { vi: 'Bốn mức gói công khai', en: 'Four public plan levels', km: 'Four public plan levels' },
    body: {
      vi: 'Cloudflare công bố Free, Pro, Business và Contract. Contract là mức dành cho tổ chức cần điều khoản riêng.',
      en: 'Cloudflare publishes Free, Pro, Business, and Contract. Contract is the level for organizations that need their own terms.',
      km: 'Cloudflare publishes Free, Pro, Business, and Contract.',
    },
    source: ENTERPRISE_OFFICIAL_URL,
  },
  {
    title: { vi: 'Không sao chép bảng quyền lợi', en: 'No copied entitlement matrix', km: 'No copied entitlement matrix' },
    body: {
      vi: 'Hub không giữ một bảng quyền lợi riêng. Hãy đọc trang gói chính thức mỗi khi cần biết tính năng nào thuộc gói nào.',
      en: 'This hub does not keep its own entitlement matrix. Read the official plans page whenever you need to know which plan includes a feature.',
      km: 'This hub does not keep its own entitlement matrix.',
    },
    source: ENTERPRISE_OFFICIAL_URL,
  },
  {
    title: { vi: 'Tài liệu tài khoản', en: 'Account documentation', km: 'Account documentation' },
    body: {
      vi: 'Cách tài khoản, zone và billing hoạt động được mô tả trong tài liệu Fundamentals.',
      en: 'How accounts, zones, and billing work is described in the Fundamentals docs.',
      km: 'How accounts, zones, and billing work is described in the Fundamentals docs.',
    },
    source: ENTERPRISE_DOCS_URL,
  },
];
