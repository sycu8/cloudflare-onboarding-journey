import type { LocalizedString } from '../i18n/types';

export type QuizOption = { id: 'A' | 'B' | 'C' | 'D'; text: LocalizedString };

export type QuizTopic =
  | 'cloudflare-101'
  | 'application-services'
  | 'developer-platform'
  | 'cloudflare-one'
  | 'glossary';

export type QuizQuestion = {
  id: string;
  topic: QuizTopic;
  prompt: LocalizedString;
  options: QuizOption[];
  correct: QuizOption['id'];
  explanation: LocalizedString;
  learnMore?: { href: string; label: LocalizedString };
};

export type Quiz = {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  /** Minimum score to consider "passed" for review purposes */
  passingScore: number;
  questions: QuizQuestion[];
};

export const topicLabels: Record<QuizTopic, LocalizedString> = {
  'cloudflare-101': { vi: 'Cloudflare 101', en: 'Cloudflare 101' },
  'application-services': { vi: 'Application Services', en: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  glossary: { vi: 'Thuật ngữ', en: 'Glossary' },
};

export const beginnerReadinessQuiz: Quiz = {
  id: 'beginner-readiness',
  title: { vi: 'Kiểm tra kiến thức Cloudflare', en: 'Cloudflare knowledge check' },
  subtitle: {
    vi: 'Ôn lại sau khi đọc Cloudflare 101, lộ trình học hoặc checklist',
    en: 'Review after Cloudflare 101, a learning track, or the checklist',
  },
  description: {
    vi: '12 câu trắc nghiệm về mental model, lộ trình và khái niệm cốt lõi (cập nhật 2026). Mỗi câu có giải thích.',
    en: '12 multiple-choice questions on mental models, tracks, and core concepts (2026 refresh). Each answer includes an explanation.',
  },
  passingScore: 9,
  questions: [
    {
      id: 'q1',
      topic: 'cloudflare-101',
      prompt: {
        vi: 'Mental model nào phù hợp nhất khi mới học Cloudflare?',
        en: 'What is the best mental model when you are new to Cloudflare?',
      },
      options: [
        { id: 'A', text: { vi: 'Một tập hợp sản phẩm rời rạc', en: 'A collection of unrelated products' } },
        {
          id: 'B',
          text: {
            vi: 'Một lớp nằm giữa users và applications, services hoặc networks',
            en: 'A layer between users and applications, services, or networks',
          },
        },
        { id: 'C', text: { vi: 'Chỉ là nhà cung cấp DNS', en: 'Only a DNS provider' } },
        { id: 'D', text: { vi: 'Chỉ là CDN', en: 'Only a CDN' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Cloudflare xử lý traffic gần user trước khi tới origin — áp dụng bảo mật, cache, routing và compute tại edge.',
        en: 'Cloudflare processes traffic near users before it reaches origin — applying security, cache, routing, and compute at the edge.',
      },
      learnMore: { href: '/cloudflare-101', label: { vi: 'Ôn Cloudflare 101', en: 'Review Cloudflare 101' } },
    },
    {
      id: 'q2',
      topic: 'application-services',
      prompt: {
        vi: 'Bạn đã có website public và muốn cải thiện bảo mật + tốc độ. Nên bắt đầu từ lộ trình nào?',
        en: 'You have a public website and want better security and speed. Which track should you start with?',
      },
      options: [
        { id: 'A', text: { vi: 'Developer Platform', en: 'Developer Platform' } },
        { id: 'B', text: { vi: 'Application Services', en: 'Application Services' } },
        { id: 'C', text: { vi: 'Cloudflare One', en: 'Cloudflare One' } },
        { id: 'D', text: { vi: 'Workers AI', en: 'Workers AI' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Application Services: DNS, proxy, SSL/TLS, WAF, cache — phù hợp bảo vệ và tăng tốc site/API đang chạy.',
        en: 'Application Services covers DNS, proxy, SSL/TLS, WAF, and cache — ideal for protecting and accelerating live sites/APIs.',
      },
      learnMore: { href: '/tracks/application-services', label: { vi: 'Xem lộ trình', en: 'View track' } },
    },
    {
      id: 'q3',
      topic: 'developer-platform',
      prompt: {
        vi: 'Bạn muốn deploy frontend và API serverless không quản server. Lộ trình nào phù hợp?',
        en: 'You want to deploy a frontend and serverless APIs without managing servers. Which track fits?',
      },
      options: [
        { id: 'A', text: { vi: 'Developer Platform', en: 'Developer Platform' } },
        { id: 'B', text: { vi: 'Cloudflare One', en: 'Cloudflare One' } },
        { id: 'C', text: { vi: 'Email Security', en: 'Email Security' } },
        { id: 'D', text: { vi: 'Magic WAN', en: 'Magic WAN' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'Pages, Workers, KV, D1, R2 — build và deploy trên edge, phù hợp app mới hoặc MVP.',
        en: 'Pages, Workers, KV, D1, and R2 let you build and deploy on the edge — great for new apps or MVPs.',
      },
      learnMore: { href: '/tracks/developer-platform', label: { vi: 'Xem lộ trình', en: 'View track' } },
    },
    {
      id: 'q4',
      topic: 'cloudflare-one',
      prompt: {
        vi: 'Team cần thay VPN truy cập app nội bộ theo từng ứng dụng. Hướng nào đúng?',
        en: 'Your team needs app-level access instead of a full VPN. What is the right direction?',
      },
      options: [
        { id: 'A', text: { vi: 'Chỉ bật CDN cache', en: 'Only enable CDN cache' } },
        { id: 'B', text: { vi: 'Cloudflare One (Zero Trust / ZTNA)', en: 'Cloudflare One (Zero Trust / ZTNA)' } },
        { id: 'C', text: { vi: 'Upload file lên R2', en: 'Upload files to R2' } },
        { id: 'D', text: { vi: 'Đổi nameserver sang registrar khác', en: 'Move nameservers to another registrar' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Zero Trust cấp quyền theo identity + policy cho từng app — không mở toàn bộ mạng như VPN truyền thống.',
        en: 'Zero Trust grants access per app using identity and policies — not full network access like legacy VPN.',
      },
      learnMore: { href: '/tracks/cloudflare-one', label: { vi: 'Xem lộ trình', en: 'View track' } },
    },
    {
      id: 'q5',
      topic: 'cloudflare-101',
      prompt: {
        vi: 'Luồng traffic đúng cho website đã bật proxy (orange cloud)?',
        en: 'What is the correct traffic flow for a proxied website (orange cloud)?',
      },
      options: [
        { id: 'A', text: { vi: 'User → Origin → Cloudflare', en: 'User → Origin → Cloudflare' } },
        { id: 'B', text: { vi: 'User → Cloudflare → Origin', en: 'User → Cloudflare → Origin' } },
        { id: 'C', text: { vi: 'Origin → User trực tiếp', en: 'Origin → User directly' } },
        { id: 'D', text: { vi: 'DNS → Database → Browser', en: 'DNS → Database → Browser' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Request đi qua Cloudflare edge trước — nơi áp dụng SSL, WAF, cache — rồi mới tới origin.',
        en: 'Requests hit the Cloudflare edge first for SSL, WAF, and cache — then reach your origin.',
      },
      learnMore: { href: '/glossary', label: { vi: 'Xem thuật ngữ Proxy', en: 'See Proxy in glossary' } },
    },
    {
      id: 'q6',
      topic: 'application-services',
      prompt: {
        vi: 'Origin đã có chứng chỉ HTTPS hợp lệ. SSL/TLS mode nào nên ưu tiên?',
        en: 'Your origin has a valid HTTPS certificate. Which SSL/TLS mode should you prefer?',
      },
      options: [
        { id: 'A', text: { vi: 'Off', en: 'Off' } },
        { id: 'B', text: { vi: 'Flexible (HTTP tới origin)', en: 'Flexible (HTTP to origin)' } },
        { id: 'C', text: { vi: 'Full (strict)', en: 'Full (strict)' } },
        { id: 'D', text: { vi: 'Không cần SSL', en: 'SSL not needed' } },
      ],
      correct: 'C',
      explanation: {
        vi: 'Full (strict) mã hóa end-to-end và xác thực cert origin — tránh lỗ hổng khi dùng Flexible với origin chỉ HTTPS.',
        en: 'Full (strict) encrypts end-to-end and validates the origin cert — avoid Flexible when origin expects HTTPS.',
      },
      learnMore: { href: '/tracks/application-services', label: { vi: 'Phần SSL trong lộ trình', en: 'SSL module in track' } },
    },
    {
      id: 'q7',
      topic: 'glossary',
      prompt: {
        vi: 'Trang có cookie session (giỏ hàng, đăng nhập). Cache nên xử lý thế nào?',
        en: 'A page uses session cookies (cart, login). How should caching be handled?',
      },
      options: [
        { id: 'A', text: { vi: 'Cache mọi thứ với TTL dài nhất', en: 'Cache everything with the longest TTL' } },
        { id: 'B', text: { vi: 'Bypass cache cho nội dung động / có cookie', en: 'Bypass cache for dynamic or cookie-based content' } },
        { id: 'C', text: { vi: 'Tắt SSL', en: 'Turn off SSL' } },
        { id: 'D', text: { vi: 'Xóa toàn bộ DNS records', en: 'Delete all DNS records' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Cache tốt cho static (CSS, JS, ảnh); bypass tránh lộ dữ liệu cá nhân giữa các user.',
        en: 'Cache static assets (CSS, JS, images); bypass prevents leaking personalized data between users.',
      },
      learnMore: { href: '/glossary', label: { vi: 'Thuật ngữ Cache', en: 'Glossary: Cache' } },
    },
    {
      id: 'q8',
      topic: 'developer-platform',
      prompt: {
        vi: 'Lưu đăng ký workshop và kết quả quiz vào bảng SQL nhỏ. Storage nào phù hợp?',
        en: 'You need to store workshop signups and quiz results in small SQL tables. Which storage fits?',
      },
      options: [
        { id: 'A', text: { vi: 'KV', en: 'KV' } },
        { id: 'B', text: { vi: 'D1', en: 'D1' } },
        { id: 'C', text: { vi: 'CDN cache', en: 'CDN cache' } },
        { id: 'D', text: { vi: 'DNS only', en: 'DNS only' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'D1 là SQLite trên edge — phù hợp dữ liệu có schema. KV tốt cho key-value đơn giản, không thay SQL.',
        en: 'D1 is SQLite at the edge for structured data. KV is for simple key-value, not relational queries.',
      },
      learnMore: { href: '/tracks/developer-platform', label: { vi: 'Phần storage', en: 'Storage module' } },
    },
    {
      id: 'q9',
      topic: 'application-services',
      prompt: {
        vi: 'WAF trên Cloudflare giúp gì trước hết?',
        en: 'What does the Cloudflare WAF help with first and foremost?',
      },
      options: [
        { id: 'A', text: { vi: 'Thay thế hoàn toàn code application', en: 'Fully replace application code' } },
        {
          id: 'B',
          text: { vi: 'Chặn request độc hại trước khi tới origin', en: 'Block malicious requests before they reach origin' },
        },
        { id: 'C', text: { vi: 'Tạo database backup', en: 'Create database backups' } },
        { id: 'D', text: { vi: 'Gửi email marketing', en: 'Send marketing email' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'WAF + managed rules bảo vệ path public (login, API) tại edge — giảm tải và rủi ro cho origin.',
        en: 'WAF and managed rules protect public paths (login, API) at the edge — reducing risk and origin load.',
      },
      learnMore: { href: '/use-cases/secure-api', label: { vi: 'Tình huống bảo vệ API', en: 'Secure API use case' } },
    },
    {
      id: 'q10',
      topic: 'developer-platform',
      prompt: {
        vi: 'Form đăng ký workshop public cần chống bot. Công cụ nào phù hợp trên Cloudflare?',
        en: 'A public workshop signup form needs bot protection. Which Cloudflare tool fits?',
      },
      options: [
        { id: 'A', text: { vi: 'Turnstile', en: 'Turnstile' } },
        { id: 'B', text: { vi: 'Magic WAN', en: 'Magic WAN' } },
        { id: 'C', text: { vi: 'Cloudflare Tunnel only', en: 'Cloudflare Tunnel only' } },
        { id: 'D', text: { vi: 'Xóa zone', en: 'Delete the zone' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'Turnstile xác minh người thật; server verify token trước khi ghi D1 — thay captcha nặng nề.',
        en: 'Turnstile verifies humans; your server validates the token before writing to D1 — lighter than heavy captchas.',
      },
      learnMore: { href: '/workshop', label: { vi: 'Trang workshop', en: 'Workshop page' } },
    },
    {
      id: 'q11',
      topic: 'developer-platform',
      prompt: {
        vi: 'Bạn gọi nhiều provider AI (OpenAI + Workers AI) và cần log, cache, giới hạn chi phí. Công cụ nào phù hợp?',
        en: 'You call multiple AI providers (OpenAI + Workers AI) and need logs, cache, and cost controls. Which tool fits?',
      },
      options: [
        { id: 'A', text: { vi: 'AI Gateway', en: 'AI Gateway' } },
        { id: 'B', text: { vi: 'DNS only', en: 'DNS only' } },
        { id: 'C', text: { vi: 'MX record', en: 'MX record' } },
        { id: 'D', text: { vi: 'Page Rules (legacy)', en: 'Page Rules (legacy)' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'AI Gateway quản trị request AI tập trung — không thay thế Workers AI mà bổ sung observability và policy.',
        en: 'AI Gateway centralizes AI request governance — it complements Workers AI with observability and policy.',
      },
      learnMore: { href: '/first-week#platform-2026', label: { vi: 'Cập nhật 2026', en: '2026 snapshot' } },
    },
    {
      id: 'q12',
      topic: 'cloudflare-one',
      prompt: {
        vi: 'Expose app nội bộ ra Internet an toàn mà không mở inbound firewall. Giải pháp Cloudflare nào?',
        en: 'Expose an internal app safely without opening inbound firewall ports. Which Cloudflare solution?',
      },
      options: [
        { id: 'A', text: { vi: 'Cloudflare Tunnel (`cloudflared`)', en: 'Cloudflare Tunnel (`cloudflared`)' } },
        { id: 'B', text: { vi: 'Chỉ bật CDN cache', en: 'CDN cache only' } },
        { id: 'C', text: { vi: 'Xóa DNS zone', en: 'Delete DNS zone' } },
        { id: 'D', text: { vi: 'Flexible SSL', en: 'Flexible SSL' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'Tunnel outbound từ mạng nội bộ — tên cũ “Argo Tunnel” đã đổi; kết hợp Access cho policy.',
        en: 'Outbound tunnel from your network — formerly “Argo Tunnel”; pair with Access for policy.',
      },
      learnMore: { href: '/tracks/cloudflare-one', label: { vi: 'Lộ trình Cloudflare One', en: 'Cloudflare One track' } },
    },
  ],
};

export const quizzes = [beginnerReadinessQuiz] as const;

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}

export type ScoreTier = {
  minScore: number;
  title: LocalizedString;
  message: LocalizedString;
  primaryCta: { href: string; label: LocalizedString };
};

export function getScoreTier(score: number, total: number): ScoreTier {
  const ratio = score / total;
  if (ratio >= 0.9) {
    return {
      minScore: Math.ceil(total * 0.9),
      title: { vi: 'Rất tốt!', en: 'Excellent!' },
      message: {
        vi: 'Bạn nắm khá vững mental model và cách chọn lộ trình. Hãy áp dụng qua tình huống thực tế.',
        en: 'You have a solid grasp of mental models and track selection. Apply it via a use case next.',
      },
      primaryCta: { href: '/choose-your-path', label: { vi: 'Chọn lộ trình tiếp', en: 'Choose your next path' } },
    };
  }
  if (ratio >= 0.7) {
    return {
      minScore: Math.ceil(total * 0.7),
      title: { vi: 'Khá ổn', en: 'Good progress' },
      message: {
        vi: 'Đa số khái niệm đã rõ. Xem lại các câu sai bên dưới trước khi làm checklist hoặc use case.',
        en: 'Most concepts are clear. Review missed questions below before the checklist or a use case.',
      },
      primaryCta: { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Làm checklist', en: 'Open checklist' } },
    };
  }
  return {
    minScore: 0,
    title: { vi: 'Nên ôn thêm', en: 'Keep reviewing' },
    message: {
      vi: 'Đừng lo — hãy đọc lại Cloudflare 101 và một lộ trình, rồi làm lại quiz để củng cố.',
      en: 'No worries — revisit Cloudflare 101 and one track, then retake the quiz to reinforce.',
    },
    primaryCta: { href: '/cloudflare-101', label: { vi: 'Ôn Cloudflare 101', en: 'Review Cloudflare 101' } },
  };
}
