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
    nextCta: { href: '/content-delivery', label: { vi: 'Tối ưu tốc độ website', en: 'Speed up your website' } },
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
    commonMistakes: {
      vi: [
        {
          title: 'Deploy production trước khi test preview URL',
          detail: 'Mỗi PR có preview Pages — dùng để QA trước khi merge vào branch production.',
        },
        {
          title: 'Binding D1/KV/R2 thiếu trên production env',
          detail: 'Binding có thể khác giữa preview và production trong Pages settings. Kiểm tra cả hai environment.',
        },
        {
          title: 'Worker chạy logic nặng không phù hợp isolate',
          detail: 'CPU-bound dài hoặc dependency lớn có thể cần Containers hoặc tách service — đừng nhồi hết vào một Worker.',
        },
      ],
      en: [
        {
          title: 'Shipping production before testing preview URLs',
          detail: 'Each PR gets a Pages preview — use it for QA before merging to the production branch.',
        },
        {
          title: 'Missing D1/KV/R2 bindings on production env',
          detail: 'Bindings can differ between preview and production in Pages settings. Verify both environments.',
        },
        {
          title: 'Heavy logic unsuitable for Worker isolates',
          detail: 'Long CPU-bound work or huge deps may need Containers or a split service — do not cram everything into one Worker.',
        },
      ],
    },
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
    commonMistakes: {
      vi: [
        {
          title: 'Coi Zero Trust là “VPN mới” với full network access',
          detail: 'ZTNA cấp quyền theo app, không phải subnet. User không nên thấy toàn bộ mạng nội bộ sau khi login.',
        },
        {
          title: 'Không log và audit Access sessions',
          detail: 'Thiếu log khiến không điều tra được sự cố. Bật logging và review định kỳ ai vào app nào.',
        },
        {
          title: 'Policy không có owner và ngày review',
          detail: 'Policy cũ tích tụ quyền thừa. Mỗi app policy cần owner và lịch review hàng quý.',
        },
      ],
      en: [
        {
          title: 'Treating Zero Trust as a “new VPN” with full network access',
          detail: 'ZTNA grants per-app access, not subnets. Users should not see the entire internal network after login.',
        },
        {
          title: 'No Access session logging or audit',
          detail: 'Missing logs make incidents hard to investigate. Enable logging and review who accessed which apps.',
        },
        {
          title: 'Policies without owners or review dates',
          detail: 'Stale policies accumulate excess access. Each app policy needs an owner and quarterly review.',
        },
      ],
    },
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
    commonMistakes: {
      vi: [
        {
          title: 'Chỉ bật SWG mà không có ZTNA cho app nội bộ',
          detail: 'Remote user vẫn cần VPN nếu app private chưa publish qua Access. Kết hợp SWG + ZTNA theo use case.',
        },
        {
          title: 'Block quá aggressive gây false positive',
          detail: 'DNS/HTTP policy chặn domain hợp pháp (CDN, update server) làm user không làm việc được. Pilot log-only trước.',
        },
        {
          title: 'Bỏ qua email security trong remote work',
          detail: 'Phishing qua email vẫn là vector chính. Gateway email hoặc Area 1 bổ sung cho SWG browsing.',
        },
      ],
      en: [
        {
          title: 'SWG only without ZTNA for internal apps',
          detail: 'Remote users still need VPN if private apps are not published via Access. Combine SWG + ZTNA by use case.',
        },
        {
          title: 'Over-aggressive blocking causing false positives',
          detail: 'DNS/HTTP policies blocking legitimate domains (CDNs, update servers) block work. Pilot in log-only mode first.',
        },
        {
          title: 'Ignoring email security for remote work',
          detail: 'Phishing via email remains a top vector. Add Gateway email or Area 1 alongside SWG browsing.',
        },
      ],
    },
    nextCta: { href: '/workshop', label: { vi: 'Tham gia workshop', en: 'Join workshop' } },
  },
];

export type UseCaseTrack = UseCase['relatedTrack'];

export const useCaseTrackLabels: Record<
  UseCaseTrack,
  { title: LocalizedString; headline: LocalizedString; trackHref: string }
> = {
  'application-services': {
    title: { vi: 'Application Services', en: 'Application Services' },
    headline: {
      vi: 'Website, API public, CDN, WAF, SSL/TLS và performance.',
      en: 'Websites, public APIs, CDN, WAF, SSL/TLS, and performance.',
    },
    trackHref: '/tracks/application-services',
  },
  'developer-platform': {
    title: { vi: 'Developer Platform', en: 'Developer Platform' },
    headline: {
      vi: 'Pages, Workers, D1, KV, R2, Turnstile và deploy serverless.',
      en: 'Pages, Workers, D1, KV, R2, Turnstile, and serverless deploy.',
    },
    trackHref: '/tracks/developer-platform',
  },
  'cloudflare-one': {
    title: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    headline: {
      vi: 'Zero Trust, ZTNA, SWG, remote users và thay thế VPN.',
      en: 'Zero Trust, ZTNA, SWG, remote users, and VPN replacement.',
    },
    trackHref: '/tracks/cloudflare-one',
  },
};

export const useCaseTrackOrder: UseCaseTrack[] = [
  'application-services',
  'developer-platform',
  'cloudflare-one',
];

export function getUseCasesByTrack(track: UseCaseTrack): UseCase[] {
  return useCases.filter((u) => u.relatedTrack === track);
}

export function getUseCase(slug: UseCase['slug']) {
  const found = useCases.find((u) => u.slug === slug);
  if (!found) throw new Error(`Unknown use case: ${slug}`);
  return found;
}

