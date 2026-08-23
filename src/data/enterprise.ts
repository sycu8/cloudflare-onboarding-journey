import type { LocalizedString } from '../i18n/types';

/** Hub page: Enterprise advantages, Premium Success, TAM, Professional Services, Indochina partners */

export const ENTERPRISE_OFFICIAL_URL = 'https://www.cloudflare.com/enterprise/';
export const SUCCESS_OFFERINGS_URL = 'https://www.cloudflare.com/success-offerings/';
export const CONTACT_SALES_URL = 'https://www.cloudflare.com/plans/enterprise/contact/';
/** Vietnamese partner support helper (Orange Cloud) */
export const VN_PARTNER_HELPER_URL = 'https://helpr.orangecloud.vn/';

export const enterprisePageIntro: LocalizedString = {
  vi: 'Gói Enterprise không chỉ là “thêm tính năng”: đây là lớp hợp đồng, hỗ trợ và chuyên gia giúp tổ chức triển khai an toàn, tối ưu và mở rộng trên Cloudflare. Trang này giải thích vì sao nâng cấp quan trọng, Premium Success / TAM / Professional Services mang lại gì — và vì sao mua qua đối tác tại Việt Nam (Indochina) thường phù hợp hơn mua trực tiếp nước ngoài.',
  en: 'Enterprise is more than “extra features”: it is the contract, support, and expert layer that helps organizations deploy, harden, and scale on Cloudflare. This page covers why upgrades matter, what Premium Success, TAM, and Professional Services deliver — and why buying through a Vietnam (Indochina) partner is often a better fit than purchasing abroad alone.',
};

export type EnterpriseSection = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  bullets: LocalizedString[];
};

export const enterpriseWhyUpgrade: EnterpriseSection = {
  id: 'why-upgrade',
  title: {
    vi: 'Tầm quan trọng của việc nâng cấp lên Enterprise',
    en: 'Why upgrading to Enterprise matters',
  },
  summary: {
    vi: 'Business phù hợp nhiều SME; Enterprise trở thành lựa chọn khi downtime, compliance, hoặc quy mô sản phẩm vượt mức “tự phục vụ”. Nâng cấp sớm hơn khi rủi ro vận hành đã lớn hơn chi phí gói.',
    en: 'Business fits many SMEs; Enterprise becomes the right choice when downtime, compliance, or product scope outgrow self-serve plans. Upgrade when operational risk already exceeds plan cost.',
  },
  bullets: [
    {
      vi: 'SLA và quyền ưu tiên hỗ trợ — giảm thời gian chờ khi sự cố ảnh hưởng doanh thu hoặc khách hàng.',
      en: 'SLAs and priority support — shorter waits when incidents hit revenue or customers.',
    },
    {
      vi: 'Quyền truy cập sản phẩm và giới hạn cao hơn (WAF nâng cao, Zero Trust mở rộng, API Shield, Bot Management, …) theo hợp đồng.',
      en: 'Higher product entitlements and limits (advanced WAF, expanded Zero Trust, API Shield, Bot Management, and more) per contract.',
    },
    {
      vi: 'Khung hợp đồng, bảo mật và tuân thủ phù hợp doanh nghiệp lớn / regulated — không chỉ “bấm mua trên dashboard”.',
      en: 'Enterprise contracting, security, and compliance posture — not only clicking buy on the dashboard.',
    },
    {
      vi: 'Lớp Success và dịch vụ chuyên gia (Premium Success, TAM, Professional Services) giúp triển khai đúng và dùng hết giá trị gói.',
      en: 'Success and expert services (Premium Success, TAM, Professional Services) so you implement correctly and get full value.',
    },
  ],
};

export const enterpriseAdvantages: EnterpriseSection = {
  id: 'enterprise-advantages',
  title: {
    vi: 'Ưu điểm chính của gói Enterprise',
    en: 'Core advantages of the Enterprise plan',
  },
  summary: {
    vi: 'So với Free / Pro / Business, Enterprise gắn với kiến trúc nhiều sản phẩm, hỗ trợ theo mức độ nghiêm trọng, và đối tác triển khai — không chỉ bảng giá công khai.',
    en: 'Versus Free / Pro / Business, Enterprise ties to multi-product architecture, severity-based support, and implementation partners — not only a public price list.',
  },
  bullets: [
    {
      vi: 'Mạng toàn cầu + quyền cấu hình sâu hơn cho Application Security, Performance và Cloudflare One.',
      en: 'Global network plus deeper configuration for Application Security, Performance, and Cloudflare One.',
    },
    {
      vi: 'Hỗ trợ enterprise-grade: mức phản hồi theo severity, kênh ưu tiên, và (khi mua kèm) Success / TAM.',
      en: 'Enterprise-grade support: severity-based response, priority channels, and optional Success / TAM.',
    },
    {
      vi: 'Linh hoạt hợp đồng: custom packaging theo nhu cầu, không bị khóa vào một “SKU” cố định trên self-serve.',
      en: 'Contract flexibility: custom packaging for your needs — not locked to a single self-serve SKU.',
    },
    {
      vi: 'Phù hợp khi bạn cần roadmap chung với Cloudflare (và đối tác) thay vì tự học mọi thứ trên docs.',
      en: 'Fits when you need a shared roadmap with Cloudflare (and partners) instead of learning everything alone from docs.',
    },
  ],
};

export const premiumSuccessSection: EnterpriseSection = {
  id: 'premium-success',
  title: {
    vi: 'Premium Success — lớp thành công sau khi ký hợp đồng',
    en: 'Premium Success — post-contract success layer',
  },
  summary: {
    vi: 'Standard Success đi kèm Enterprise; Premium Success là nâng cấp tùy chọn dành cho tổ chức dùng nhiều sản phẩm Cloudflare. Mục tiêu: phản hồi nhanh hơn với sự cố khẩn, tối ưu cấu hình chủ động, và chia sẻ best practices.',
    en: 'Standard Success ships with Enterprise; Premium Success is an optional upgrade for organizations with broader Cloudflare portfolios. Goals: faster urgent response, proactive configuration optimization, and expert best practices.',
  },
  bullets: [
    {
      vi: 'Thời gian phản hồi sự cố khẩn cấp ngắn hơn (theo entitlement Premium — thường dưới một giờ với issue urgent).',
      en: 'Faster urgent-issue response (per Premium entitlement — often under one hour for urgent issues).',
    },
    {
      vi: 'Tối ưu hiệu năng và cấu hình mang tính chủ động — không chỉ chờ ticket.',
      en: 'Proactive performance and configuration optimization — not only waiting on tickets.',
    },
    {
      vi: 'Tiếp cận chuyên gia và best practices; workshop kỹ thuật tùy chỉnh theo tier Premium.',
      en: 'Access to experts and best practices; customized technical workshops by Premium tier.',
    },
    {
      vi: 'Executive / business review định kỳ (EBR) giúp đo adoption và điều chỉnh roadmap sử dụng.',
      en: 'Periodic executive / business reviews (EBRs) to measure adoption and adjust the usage roadmap.',
    },
  ],
};

export const tamSection: EnterpriseSection = {
  id: 'tam',
  title: {
    vi: 'Technical Account Manager (TAM)',
    en: 'Technical Account Manager (TAM)',
  },
  summary: {
    vi: 'TAM là điểm liên hệ kỹ thuật chuyên sâu sau hợp đồng: theo dõi ticket, hỗ trợ escalation, và tư vấn cách dùng sản phẩm để đạt mục tiêu kỹ thuật dài hạn. Thường gắn với gói Premium / focused services — không thay thế Support 24×7 cho mọi ticket.',
    en: 'A TAM is a dedicated post-contract technical point of contact: tracking tickets, helping escalate, and advising on product usage toward long-term technical goals. Usually tied to Premium / focused services — not a replacement for 24×7 Support on every ticket.',
  },
  bullets: [
    {
      vi: 'Primary technical contact: hiểu môi trường của bạn và ưu tiên đúng khi có sự cố.',
      en: 'Primary technical contact: knows your environment and prioritizes correctly during incidents.',
    },
    {
      vi: 'Advocacy nội bộ Cloudflare — đẩy feedback và nhu cầu của bạn tới đúng đội sản phẩm / support.',
      en: 'Internal Cloudflare advocacy — routes your feedback and needs to the right product / support teams.',
    },
    {
      vi: 'Gợi ý chủ động về adoption, cấu hình và roadmap kỹ thuật — giảm “mua nhiều nhưng dùng ít”.',
      en: 'Proactive guidance on adoption, configuration, and technical roadmap — less “bought a lot, used little”.',
    },
    {
      vi: 'Phối hợp với Customer Success và Account Team trong các buổi review dịch vụ.',
      en: 'Partners with Customer Success and the Account Team in service delivery reviews.',
    },
  ],
};

export const professionalServicesSection: EnterpriseSection = {
  id: 'professional-services',
  title: {
    vi: 'Professional Services (PS)',
    en: 'Professional Services (PS)',
  },
  summary: {
    vi: 'Professional Services là dịch vụ triển khai / thiết kế theo dự án: giúp go-live nhanh, đúng kiến trúc, và bàn giao vận hành. Phù hợp khi team nội bộ chưa có kinh nghiệm Cloudflare sâu hoặc deadline gấp.',
    en: 'Professional Services are project-based design and deployment engagements: faster go-live, sound architecture, and operational handoff. Ideal when the internal team lacks deep Cloudflare experience or faces a tight deadline.',
  },
  bullets: [
    {
      vi: 'Thiết kế và triển khai (WAF, Zero Trust, CDN/cache, Workers, …) theo scope đã thống nhất.',
      en: 'Design and implement (WAF, Zero Trust, CDN/cache, Workers, and more) against an agreed scope.',
    },
    {
      vi: 'Knowledge transfer: tài liệu, workshop, và bàn giao để team nội bộ tự vận hành sau dự án.',
      en: 'Knowledge transfer: docs, workshops, and handoff so your team can operate after the project.',
    },
    {
      vi: 'Giảm rủi ro misconfiguration phổ biến (DNS/proxy, SSL mode, Access policy, cache bypass sai).',
      en: 'Lowers common misconfiguration risk (DNS/proxy, SSL mode, Access policies, bad cache bypass).',
    },
    {
      vi: 'Có thể kết hợp với đối tác địa phương để triển khai gần timezone và ngôn ngữ của bạn.',
      en: 'Can combine with a local partner for delivery closer to your timezone and language.',
    },
  ],
};

export const partnerVnSection: EnterpriseSection = {
  id: 'partner-vietnam',
  title: {
    vi: 'Gợi ý: dùng dịch vụ của Đối tác tại Việt Nam',
    en: 'Recommendation: work with a Vietnam partner',
  },
  summary: {
    vi: 'Cloudflare cung cấp Success, TAM và Professional Services toàn cầu. Với doanh nghiệp Việt Nam và Indochina, làm việc qua đối tác địa phương giúp hóa đơn, tư vấn tiếng Việt, và phối hợp với Cloudflare local team dễ hơn — đặc biệt khi mua gói Enterprise.',
    en: 'Cloudflare provides Success, TAM, and Professional Services globally. For Vietnam and Indochina businesses, a local partner makes invoicing, Vietnamese-language consulting, and coordination with the Cloudflare local team easier — especially on Enterprise.',
  },
  bullets: [
    {
      vi: 'Đối tác giúp kênh mua Enterprise, làm rõ scope Success / TAM / PS trước khi ký.',
      en: 'Partners help you buy Enterprise and clarify Success / TAM / PS scope before you sign.',
    },
    {
      vi: 'Hỗ trợ viết Support case, triage sự cố, và phối hợp escalation (ví dụ trợ lý case của đối tác).',
      en: 'Help drafting Support cases, triaging incidents, and coordinating escalation (for example a partner case assistant).',
    },
    {
      vi: 'Workshop / onboarding gần timezone Việt Nam — hỏi đáp bằng tiếng Việt khi cần.',
      en: 'Workshops / onboarding near Vietnam timezone — Q&A in Vietnamese when needed.',
    },
    {
      vi: 'Sau khi có hợp đồng Enterprise, đối tác vẫn là cầu nối vận hành hàng ngày bên cạnh kênh Cloudflare chính thức.',
      en: 'After the Enterprise contract, the partner remains a day-to-day ops bridge alongside official Cloudflare channels.',
    },
  ],
};

export type IndochinaBenefit = {
  id: string;
  title: LocalizedString;
  detail: LocalizedString;
};

/** Three headline benefits of buying Enterprise in Indochina via a partner */
export const indochinaEnterpriseBenefits: IndochinaBenefit[] = [
  {
    id: 'vat-invoice',
    title: {
      vi: 'Xuất hóa đơn VAT hợp lệ từ đối tác',
      en: 'Valid VAT invoices from the partner',
    },
    detail: {
      vi: 'Doanh nghiệp Việt Nam cần hóa đơn VAT hợp lệ để hạch toán và hoàn thuế. Mua qua đối tác Indochina giúp xuất hóa đơn đúng quy định — tránh khó khăn khi thanh toán trực tiếp nước ngoài.',
      en: 'Vietnamese companies need valid VAT invoices for accounting and tax. Buying through an Indochina partner yields compliant invoicing — avoiding friction of paying a foreign entity directly.',
    },
  },
  {
    id: 'consult-implement-support',
    title: {
      vi: 'Được hỗ trợ tư vấn, triển khai và hỗ trợ',
      en: 'Consulting, implementation, and ongoing support',
    },
    detail: {
      vi: 'Đối tác đồng hành từ tư vấn chọn gói / kiến trúc, triển khai (DNS, WAF, Zero Trust, …) đến hỗ trợ vận hành sau go-live — gần ngôn ngữ và giờ làm việc của bạn.',
      en: 'The partner walks with you from plan / architecture advice, through implementation (DNS, WAF, Zero Trust, and more), to post–go-live ops support — closer to your language and working hours.',
    },
  },
  {
    id: 'local-cloudflare-team',
    title: {
      vi: 'Cloudflare local team tham gia xử lý và hỗ trợ',
      en: 'Cloudflare local team joins troubleshooting and support',
    },
    detail: {
      vi: 'Khi mua và vận hành qua kênh khu vực Indochina, bạn dễ được Cloudflare local team phối hợp nhảy vào xử lý sự cố và hỗ trợ trong quá trình sử dụng — bổ sung cho Support / Success toàn cầu.',
      en: 'Buying and operating through the Indochina channel makes it easier for the Cloudflare local team to jump in on incidents and ongoing support — complementing global Support / Success.',
    },
  },
];

export const enterpriseTopicNav: { id: string; label: LocalizedString }[] = [
  { id: 'why-upgrade', label: { vi: 'Vì sao nâng cấp', en: 'Why upgrade' } },
  { id: 'enterprise-advantages', label: { vi: 'Ưu điểm Enterprise', en: 'Enterprise advantages' } },
  { id: 'premium-success', label: { vi: 'Premium Success', en: 'Premium Success' } },
  { id: 'tam', label: { vi: 'TAM', en: 'TAM' } },
  { id: 'professional-services', label: { vi: 'Professional Services', en: 'Professional Services' } },
  { id: 'partner-vietnam', label: { vi: 'Đối tác Việt Nam', en: 'Vietnam partner' } },
  { id: 'indochina', label: { vi: '3 ưu điểm Indochina', en: '3 Indochina benefits' } },
];

export const enterpriseSourceNote: LocalizedString = {
  vi: 'Nội dung tổng hợp theo hướng dẫn Success Offerings và Enterprise của Cloudflare, kết hợp góc nhìn mua qua đối tác Indochina. Entitlement cụ thể (SLA, TAM, PS) phụ thuộc hợp đồng — luôn xác nhận với Sales / đối tác trước khi mua.',
  en: 'Summarized from Cloudflare Success Offerings and Enterprise guidance, plus an Indochina partner buying lens. Exact entitlements (SLA, TAM, PS) depend on your contract — always confirm with Sales / your partner before purchase.',
};

export const allEnterpriseSections: EnterpriseSection[] = [
  enterpriseWhyUpgrade,
  enterpriseAdvantages,
  premiumSuccessSection,
  tamSection,
  professionalServicesSection,
  partnerVnSection,
];
