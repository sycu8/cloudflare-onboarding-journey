import type { BlogPost } from '../blog';

/** Entry · Security — rewritten from Cloudflare Access / Zero Trust blog themes */
export const postZeroTrustAccessThayVpn: BlogPost = {
  slug: 'zero-trust-access-thay-vpn-khoi-dau',
  date: '2026-09-14',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Cloudflare Access: vào app nội bộ không cần VPN cũ — khởi đầu Zero Trust cho team nhỏ',
    en: 'Cloudflare Access: reach internal apps without the old VPN — a gentle Zero Trust start',
  },
  description: {
    vi: 'Giải thích Cloudflare Access cho người mới: xác minh danh tính trước khi vào app nội bộ; khác gì VPN truyền thống; và bước đầu Zero Trust phù hợp team nhỏ.',
    en: 'A beginner guide to Cloudflare Access: verify identity before internal apps; how it differs from traditional VPN; and first Zero Trust steps for small teams.',
  },
  excerpt: {
    vi: 'Access giống bảo vệ từng cửa phòng thay vì mở khóa cả tòa nhà: nhân viên đăng nhập, đúng policy mới vào app admin — không cần “nằm trong mạng VPN” là thấy hết.',
    en: 'Access is like guarding each room door instead of unlocking the whole building: staff sign in, policy allows the admin app — no “being on VPN” that exposes everything.',
  },
  keywords: {
    vi: 'Cloudflare Access là gì, Zero Trust cho người mới, thay VPN, ZTNA, bảo mật app nội bộ, học Cloudflare One cơ bản',
    en: 'what is Cloudflare Access, Zero Trust beginner, replace VPN, ZTNA, internal app security, Cloudflare One beginner',
  },
  sections: [
    {
      heading: {
        vi: 'VPN cũ giải quyết gì — và vì sao nhiều team muốn thay?',
        en: 'What the old VPN solved — and why many teams want to replace it',
      },
      paragraphs: [
        {
          vi: 'VPN truyền thống cho phép nhân viên “ở trong mạng công ty” từ xa: máy tính tạo đường hầm tới datacenter, rồi truy cập nội bộ như ngồi văn phòng. Cách này từng hợp lý khi hầu hết app nằm trong LAN và người làm việc chủ yếu tại chỗ.',
          en: 'A traditional VPN lets staff “be on the company network” remotely: the laptop tunnels into the datacenter, then reaches internal apps as if at the office. That made sense when most apps lived on the LAN and people worked on-site.',
        },
        {
          vi: 'Vấn đề hiện đại: một khi vào VPN, attacker có thể quét toàn mạng nội bộ; SaaS (Google, Notion, GitHub) không nằm trong VPN; và quản lý quyền theo “ở trong hay ngoài mạng” quá thô. Zero Trust (không tin mặc định) đảo ngược: mỗi ứng dụng kiểm tra ai bạn là, thiết bị có đủ điều kiện không, rồi mới cho vào — không mở cả tòa nhà.',
          en: 'Modern problems: once on VPN, an attacker may scan the whole internal network; SaaS (Google, Notion, GitHub) is not inside the VPN; and “inside vs outside the network” is too coarse for permissions. Zero Trust flips the model: each application checks who you are and whether the device qualifies before access — without unlocking the whole building.',
        },
        {
          vi: 'Cloudflare Access là lớp ZTNA (Zero Trust Network Access) trên nền Cloudflare One. Trên blog.cloudflare.com, các bài về Access và Zero Trust thường mô tả pattern: người dùng xác thực qua IdP (Google, Microsoft, Okta…), policy quyết định app nào được phép, traffic đi qua Cloudflare thay vì mở port RDP/SSH ra Internet.',
          en: 'Cloudflare Access is a ZTNA (Zero Trust Network Access) layer on Cloudflare One. Cloudflare Blog posts on Access and Zero Trust often describe the pattern: users authenticate via an IdP (Google, Microsoft, Okta…), policy decides which apps are allowed, and traffic flows through Cloudflare instead of exposing RDP/SSH ports to the Internet.',
        },
      ],
      diagramSlug: 'secure-access-to-saas-applications-with-sase',
    },
    {
      heading: {
        vi: 'Access hoạt động như thế nào (không cần biết hết acronym SASE)',
        en: 'How Access works (without memorizing every SASE acronym)',
      },
      paragraphs: [
        {
          vi: 'Bạn đăng ký ứng dụng nội bộ với Access — ví dụ `admin.company.internal` hoặc self-hosted tool. Nhân viên mở URL, Access chuyển họ tới đăng nhập công ty (SSO). Sau khi xác thực, Access kiểm tra policy: nhóm nào được vào, có cần MFA không, thiết bị có WARP/posture đạt chuẩn không. Chỉ khi pass, request mới tới app phía sau — thường qua Cloudflare Tunnel, không cần mở firewall inbound.',
          en: 'You register an internal app with Access — for example `admin.company.internal` or a self-hosted tool. Staff open the URL; Access sends them to company login (SSO). After authentication, Access checks policy: which groups may enter, whether MFA is required, whether device WARP/posture is compliant. Only then does the request reach the app behind — often via Cloudflare Tunnel, without opening inbound firewall holes.',
        },
        {
          vi: 'Tunnel (đường hầm outbound) giống ống thoát một chiều từ server nội bộ ra Cloudflare: app không lộ IP public. Kết hợp Access + Tunnel là pattern phổ biến SME thay VPN cho vài app quan trọng (admin, Grafana, Jenkins) trước khi rollout toàn công ty.',
          en: 'Tunnel is an outbound-only pipe from internal servers to Cloudflare: the app does not expose a public IP. Access + Tunnel is a common SME pattern to replace VPN for a few critical apps (admin, Grafana, Jenkins) before a company-wide rollout.',
        },
        {
          vi: 'Đừng nhầm Access với WAF website public: WAF bảo vệ site khách truy cập; Access bảo vệ app chỉ dành cho nhân viên/đối tác. Cả hai có thể cùng tồn tại trên một tài khoản Cloudflare — vai trò khác nhau.',
          en: 'Do not confuse Access with a public website WAF: WAF protects customer-facing sites; Access protects employee/partner-only apps. Both can live on one Cloudflare account — different jobs.',
        },
      ],
    },
    {
      heading: {
        vi: 'Lợi ích dễ cảm nhận khi team nhỏ bắt đầu Zero Trust',
        en: 'Easy-to-feel benefits when a small team starts Zero Trust',
      },
      paragraphs: [
        {
          vi: 'Một: giảm “mở toàn mạng” — nhân viên nghỉ việc chỉ cần thu hồi quyền app/IdP, không lo họ vẫn nằm trong VPN. Hai: truy cập từng app trên trình duyệt, ít phần mềm VPN client nặng nề (tùy kiến trúc). Ba: log ai vào app nào, lúc nào — hữu ích audit và incident response.',
          en: 'One: less “whole network access” — when someone leaves, revoke app/IdP access without worrying they are still on VPN. Two: per-app browser access, less heavy VPN client software (depending on architecture). Three: logs of who reached which app and when — helpful for audit and incident response.',
        },
        {
          vi: 'Bốn: không expose port quản trị ra Internet — giảm bề mặt tấn công brute force. Năm: nền tảng mở rộng sang Gateway (lọc web), CASB (SaaS), DLP khi công ty lớn hơn — bạn không phải đổi hướng hoàn toàn.',
          en: 'Four: no exposed admin ports on the Internet — smaller brute-force surface. Five: the platform grows into Gateway (web filtering), CASB (SaaS), and DLP as the company scales — without a full rip-and-replace.',
        },
        {
          vi: 'Hub này có lộ trình Cloudflare One và use case thay VPN. Nếu bạn đã đọc bài WAF/CDN, hãy coi Access là “cánh cửa nội bộ” trong cùng hệ sinh thái bảo mật — không phải sản phẩm lạ tách rời.',
          en: 'This hub has a Cloudflare One track and a replace-VPN use case. If you have read the WAF/CDN posts, treat Access as the “internal door” in the same security ecosystem — not a disconnected product.',
        },
      ],
    },
    {
      heading: {
        vi: 'Khởi đầu an toàn: ba bước trong tuần đầu',
        en: 'A safe start: three steps in the first week',
      },
      paragraphs: [
        {
          vi: 'Bước 1: chọn một app ít rủi ro nhưng hữu ích (dashboard nội bộ, wiki) — không bắt đầu bằng database production. Bước 2: kết nối IdP công ty (Google Workspace/Microsoft 365) và bật MFA cho nhóm admin. Bước 3: triển khai Tunnel từ server nội bộ, gắn Access policy “chỉ email @company.com”.',
          en: 'Step 1: pick one low-risk but useful app (internal dashboard, wiki) — do not start with the production database. Step 2: connect company IdP (Google Workspace/Microsoft 365) and enable MFA for admin groups. Step 3: deploy Tunnel from the internal server and attach an Access policy like “only @company.com email.”',
        },
        {
          vi: 'Test với vài người dùng thật trước khi tắt VPN cho app đó. Chuẩn bị runbook: IdP down thì làm gì, ai có break-glass account. Đọc trang Zero Trust và Access trên hub; mở bài gốc blog.cloudflare.com khi cần chi tiết device posture hoặc SaaS integration.',
          en: 'Test with real users before turning off VPN for that app. Prepare a runbook: what if IdP is down, who has break-glass accounts. Read the Zero Trust and Access pages on this hub; open original blog.cloudflare.com posts when you need device posture or SaaS integration detail.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu laptop nhân viên bị đánh cắp khi đã đăng nhập, attacker vào được những app nào?” Nếu câu trả lời là “quá nhiều”, thu hẹp policy và bật session timeout/MFA step-up cho app nhạy cảm.',
          en: 'Self-check: “If an employee laptop is stolen while logged in, which apps can an attacker reach?” If the answer is “too many,” tighten policy and add session timeout/MFA step-up for sensitive apps.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Access có thay hoàn toàn VPN không?',
        en: 'Can Access fully replace VPN?',
      },
      answer: {
        vi: 'Nhiều team thay dần VPN cho truy cập app/web. Một số workload (legacy LAN, in-office printer) có thể vẫn cần VPN hoặc mạng riêng. Lộ trình phổ biến: ZTNA cho app trước, VPN thu hẹp sau.',
        en: 'Many teams gradually replace VPN for app/web access. Some workloads (legacy LAN, office printers) may still need VPN or private network. A common path: ZTNA for apps first, shrink VPN later.',
      },
    },
    {
      question: {
        vi: 'Access khác WAF thế nào?',
        en: 'How is Access different from a WAF?',
      },
      answer: {
        vi: 'WAF bảo vệ website/API public khỏi tấn công web. Access kiểm soát ai được vào ứng dụng riêng (thường nội bộ) qua identity và policy. Cả hai bổ sung nhau.',
        en: 'A WAF protects public websites/APIs from web attacks. Access controls who may reach private apps (usually internal) via identity and policy. They complement each other.',
      },
    },
    {
      question: {
        vi: 'Cần WARP trên máy nhân viên không?',
        en: 'Do employees need WARP on their devices?',
      },
      answer: {
        vi: 'Tùy policy. Nhiều triển khai Access chỉ cần trình duyệt + SSO. WARP/device posture hữu ích khi bạn yêu cầu thiết bị đạt chuẩn trước khi vào app nhạy cảm — xem docs Cloudflare One cho chi tiết.',
        en: 'Depends on policy. Many Access deployments need only browser + SSO. WARP/device posture helps when you require compliant devices before sensitive apps — see Cloudflare One docs for detail.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Cloudflare One topics',
      href: 'https://blog.cloudflare.com/tag/cloudflare-one/',
    },
    {
      title: 'The Cloudflare Blog — Zero Trust topics',
      href: 'https://blog.cloudflare.com/tag/zero-trust/',
    },
  ],
  relatedTrack: 'cloudflare-one',
  relatedProductSlugs: ['access', 'zero-trust'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    { href: '/products/access/', label: { vi: 'Access (trang sản phẩm)', en: 'Access (product page)' } },
    { href: '/products/zero-trust/', label: { vi: 'Zero Trust là gì?', en: 'What is Zero Trust?' } },
    { href: '/tracks/cloudflare-one/', label: { vi: 'Lộ trình Cloudflare One', en: 'Cloudflare One track' } },
    { href: '/use-cases/replace-vpn/', label: { vi: 'Use case: thay thế VPN', en: 'Use case: replace VPN' } },
    { href: '/use-cases/secure-remote-users/', label: { vi: 'Use case: kết nối user an toàn', en: 'Use case: secure remote users' } },
  ],
  diagramSlugs: [
    'secure-access-to-saas-applications-with-sase',
    'augment-access-with-serverless',
  ],
};
