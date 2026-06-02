import type { LocalizedString } from '../i18n/types';

export type UseCase = {
  slug: 'protect-website' | 'secure-api' | 'build-serverless-app' | 'replace-vpn' | 'secure-remote-users';
  title: LocalizedString;
  problem: LocalizedString;
  architecture: LocalizedString;
  steps?: { vi: string[]; en: string[] };
  bullets?: { vi: string[]; en: string[] };
  commonMistakes?: { vi: { title: string; detail: string }[]; en: { title: string; detail: string }[] };
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one';
  nextCta: { href: string; label: LocalizedString };
};

export const useCases: UseCase[] = [
  {
    slug: 'protect-website',
    title: { vi: 'Bảo vệ website với Cloudflare', en: 'Protect a website with Cloudflare' },
    problem: {
      vi: 'Bạn có public website và muốn giảm downtime, chặn các tấn công phổ biến, cải thiện tốc độ tải trang và hiểu traffic tốt hơn.',
      en: 'You have a public website and want to reduce downtime, block common attacks, improve loading speed, and understand traffic.',
    },
    architecture: {
      vi: 'Visitor → Cloudflare DNS + Proxy + Security + Cache → Origin website',
      en: 'Visitor → Cloudflare DNS + Proxy + Security + Cache → Origin website',
    },
    steps: {
      vi: [
        'Add domain vào Cloudflare',
        'Review DNS records',
        'Proxy đúng records',
        'Set SSL/TLS mode đúng cách',
        'Enable basic security rules',
        'Review cache behavior',
        'Monitor analytics',
      ],
      en: [
        'Add the domain to Cloudflare',
        'Review DNS records',
        'Proxy the right records',
        'Set SSL/TLS mode correctly',
        'Enable basic security rules',
        'Review cache behavior',
        'Monitor analytics',
      ],
    },
    commonMistakes: {
      vi: [
        {
          title: 'Proxy hết mọi thứ mà không hiểu traffic',
          detail: 'Chỉ proxy những record cần đi qua Cloudflare. Các record nội bộ/đặc thù có thể cần giữ “DNS only”.',
        },
        {
          title: 'Chọn sai SSL/TLS mode',
          detail: 'Sai mode dễ gây redirect loop hoặc “invalid certificate”. Hãy hiểu mối quan hệ giữa Cloudflare và chứng chỉ ở origin.',
        },
        {
          title: 'Cache “mù” các trang dynamic',
          detail: 'Không cache trang có user-specific content (login/cart). Bắt đầu với static assets và các trang thật sự cacheable.',
        },
        {
          title: 'Không rate limit login/forms',
          detail: 'Login, signup, OTP, search là path hay bị abuse. Thêm rate limiting theo path trước.',
        },
        {
          title: 'Bỏ quên origin security',
          detail: 'Cloudflare không thay thế hoàn toàn hardening ở origin. Chặn bypass, cập nhật dependencies, và kiểm soát admin endpoints.',
        },
      ],
      en: [
        {
          title: 'Proxying everything without understanding traffic',
          detail: 'Proxy only records that should pass through Cloudflare. Some internal/special records should stay “DNS only”.',
        },
        {
          title: 'Wrong SSL/TLS mode',
          detail: 'Wrong modes can cause redirect loops or “invalid certificate”. Understand how Cloudflare interacts with your origin cert.',
        },
        {
          title: 'Caching dynamic pages blindly',
          detail: 'Avoid caching user-specific pages (login/cart). Start with static assets and truly cacheable pages.',
        },
        {
          title: 'No rate limiting on login or forms',
          detail: 'Login, signup, OTP, search are frequently abused. Add path-based rate limiting early.',
        },
        {
          title: 'Ignoring origin security',
          detail: 'Cloudflare is not a full replacement for origin hardening. Prevent bypass, patch dependencies, and protect admin endpoints.',
        },
      ],
    },
    relatedTrack: 'application-services',
    nextCta: { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Làm checklist', en: 'Complete checklist' } },
  },
  {
    slug: 'secure-api',
    title: { vi: 'Bảo vệ API với Cloudflare', en: 'Secure an API with Cloudflare' },
    problem: {
      vi: 'API thường bị abuse bởi bots, scrapers, credential stuffing, excessive requests và broken clients.',
      en: 'APIs are often abused by bots, scrapers, credential stuffing, excessive requests, and broken clients.',
    },
    architecture: {
      vi: 'Mobile/Web Client → Cloudflare API security controls → API origin',
      en: 'Mobile/Web Client → Cloudflare API security controls → API origin',
    },
    bullets: {
      vi: [
        'WAF + managed rules cho pattern phổ biến',
        'Rate limiting theo endpoint (login, OTP, search, checkout)',
        'Bot protection cho traffic automation xấu',
        'Schema validation cho request/response quan trọng',
        'mTLS/token validation cho internal/auth endpoints',
        'Logging/analytics để thấy top paths & top clients',
      ],
      en: [
        'WAF + managed rules for common patterns',
        'Endpoint-based rate limiting (login, OTP, search, checkout)',
        'Bot protection for harmful automation',
        'Schema validation for critical request/response',
        'mTLS/token validation for internal/auth endpoints',
        'Logging/analytics to see top paths & clients',
      ],
    },
    relatedTrack: 'application-services',
    nextCta: { href: '/quiz/beginner-readiness', label: { vi: 'Làm quiz', en: 'Take quiz' } },
  },
  {
    slug: 'build-serverless-app',
    title: { vi: 'Build serverless app trên Cloudflare', en: 'Build a serverless app on Cloudflare' },
    problem: {
      vi: 'Bạn muốn deploy app nhanh mà không cần quản lý server.',
      en: 'You want to deploy an app quickly without managing servers.',
    },
    architecture: {
      vi: 'User → Cloudflare Pages frontend → Pages Function / Worker API → D1 / KV / R2',
      en: 'User → Cloudflare Pages frontend → Pages Function / Worker API → D1 / KV / R2',
    },
    bullets: {
      vi: [
        'Website: Pages (static-first, cực nhanh)',
        'API: Pages Functions hoặc Workers',
        'Relational data: D1',
        'Config/progress: KV',
        'File storage: R2',
        'Bot protection: Turnstile',
        'Analytics: Cloudflare Web Analytics',
      ],
      en: [
        'Website: Pages (static-first, very fast)',
        'API: Pages Functions or Workers',
        'Relational data: D1',
        'Config/progress: KV',
        'File storage: R2',
        'Bot protection: Turnstile',
        'Analytics: Cloudflare Web Analytics',
      ],
    },
    relatedTrack: 'developer-platform',
    nextCta: { href: '/tracks/developer-platform', label: { vi: 'Xem track Developer Platform', en: 'View Developer Platform track' } },
  },
  {
    slug: 'replace-vpn',
    title: { vi: 'Thay thế VPN bằng Zero Trust access', en: 'Replace VPN with Zero Trust access' },
    problem: {
      vi: 'VPN truyền thống thường cấp quyền truy cập mạng quá rộng, gây friction và không phù hợp cho SaaS/remote work/app-specific access.',
      en: 'Traditional VPN often grants overly broad network access, creates operational friction, and is not ideal for SaaS/remote work/app-specific access.',
    },
    architecture: {
      vi: 'User + device + identity → Cloudflare Zero Trust policy → Private application',
      en: 'User + device + identity → Cloudflare Zero Trust policy → Private application',
    },
    steps: {
      vi: ['Liệt kê internal apps', 'Xác định user groups', 'Kết nối identity provider', 'Define access policies', 'Test với một low-risk app', 'Monitor access logs', 'Mở rộng dần'],
      en: ['List internal apps', 'Identify user groups', 'Connect identity provider', 'Define access policies', 'Test with one low-risk app', 'Monitor access logs', 'Expand gradually'],
    },
    relatedTrack: 'cloudflare-one',
    nextCta: { href: '/tracks/cloudflare-one', label: { vi: 'Xem track Cloudflare One', en: 'View Cloudflare One track' } },
  },
  {
    slug: 'secure-remote-users',
    title: { vi: 'Bảo vệ remote users với Cloudflare One', en: 'Secure remote users with Cloudflare One' },
    problem: {
      vi: 'Users làm việc từ nhiều network, dùng SaaS tools, truy cập internal apps và duyệt Internet ngoài office perimeter.',
      en: 'Users work from many networks, use SaaS tools, access internal apps, and browse the Internet outside the office perimeter.',
    },
    architecture: {
      vi: 'User/device → Cloudflare Zero Trust → SaaS/private app/Internet',
      en: 'User/device → Cloudflare Zero Trust → SaaS/private app/Internet',
    },
    bullets: {
      vi: [
        'Secure Web Gateway: kiểm soát web traffic theo policy',
        'DNS filtering: chặn domain độc hại sớm',
        'CASB: kiểm soát rủi ro SaaS',
        'DLP: giảm rò rỉ dữ liệu',
        'ZTNA: access private apps theo identity/device context',
        'Email security: giảm phishing & malware qua email',
      ],
      en: [
        'Secure Web Gateway: policy-based web traffic control',
        'DNS filtering: block malicious domains early',
        'CASB: manage SaaS risk',
        'DLP: reduce sensitive data leakage',
        'ZTNA: identity/device-context access for private apps',
        'Email security: reduce phishing & email-borne malware',
      ],
    },
    relatedTrack: 'cloudflare-one',
    nextCta: { href: '/workshop', label: { vi: 'Tham gia workshop', en: 'Join workshop' } },
  },
];

export function getUseCase(slug: UseCase['slug']) {
  const found = useCases.find((u) => u.slug === slug);
  if (!found) throw new Error(`Unknown use case: ${slug}`);
  return found;
}

