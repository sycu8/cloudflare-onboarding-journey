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
  'cloudflare-101': { vi: 'Cloudflare 101', en: 'Cloudflare 101', km: 'Cloudflare 101' },
  'application-services': { vi: 'Application Services', en: 'Application Services', km: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform', km: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One', km: 'Cloudflare One' },
  glossary: { vi: 'Thuật ngữ', en: 'Glossary', km: 'Glossary' },
};

export const beginnerReadinessQuiz: Quiz = {
  id: 'beginner-readiness',
  title: { vi: 'Kiểm tra kiến thức Cloudflare', en: 'Cloudflare knowledge check', km: 'ការត្រួតពិនិត្យចំណេះដឹង Cloudflare' },
  subtitle: {
    vi: 'Ôn lại sau khi đọc Cloudflare 101, lộ trình học hoặc checklist',
    en: 'Review after Cloudflare 101, a learning track, or the checklist',
    km: 'ពិនិត្យឡើងវិញបន្ទាប់ពី Cloudflare 101, ផ្លូវសិក្សា ឬ checklist',
  },
  description: {
    vi: '12 câu trắc nghiệm về mental model, lộ trình và khái niệm cốt lõi (cập nhật 2026). Mỗi câu có giải thích.',
    en: '12 multiple-choice questions on mental models, tracks, and core concepts (2026 refresh). Each answer includes an explanation.',
    km: 'សំណួរជ្រើសរើស 12 សំណួរអំពី mental models, tracks និងគោលគំនិតស្នូល (2026 refresh)។ ចម្លើយនីមួយៗមានការពន្យល់។',
  },
  passingScore: 9,
  questions: [
    {
      id: 'q1',
      topic: 'cloudflare-101',
      prompt: {
        vi: 'Mental model nào phù hợp nhất khi mới học Cloudflare?',
        en: 'What is the best mental model when you are new to Cloudflare?',
        km: 'Mental model ណាល្អបំផុតពេលអ្នកថ្មីចំពោះ Cloudflare?',
      },
      options: [
        { id: 'A', text: { vi: 'Một tập hợp sản phẩm rời rạc', en: 'A collection of unrelated products', km: 'បណ្តុំផលិតផលដែលមិនទាក់ទងគ្នា' } },
        {
          id: 'B',
          text: {
            vi: 'Một lớp nằm giữa users và applications, services hoặc networks',
            en: 'A layer between users and applications, services, or networks',
            km: 'ស្រទាប់រវាង users និង applications, services ឬ networks',
          },
        },
        { id: 'C', text: { vi: 'Chỉ là nhà cung cấp DNS', en: 'Only a DNS provider', km: 'គ្រាន់តែជា DNS provider' } },
        { id: 'D', text: { vi: 'Chỉ là CDN', en: 'Only a CDN', km: 'គ្រាន់តែជា CDN' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Cloudflare xử lý traffic gần user trước khi tới origin — áp dụng bảo mật, cache, routing và compute tại edge.',
        en: 'Cloudflare processes traffic near users before it reaches origin — applying security, cache, routing, and compute at the edge.',
        km: 'Cloudflare ដំណើរការ traffic ក្បែរ users មុនពេលដល់ origin — អនុវត្ត security, cache, routing និង compute នៅ edge។',
      },
      learnMore: { href: '/cloudflare-101', label: { vi: 'Ôn Cloudflare 101', en: 'Review Cloudflare 101', km: 'ពិនិត្យ Cloudflare 101 ឡើងវិញ' } },
    },
    {
      id: 'q2',
      topic: 'application-services',
      prompt: {
        vi: 'Bạn đã có website public và muốn cải thiện bảo mật + tốc độ. Nên bắt đầu từ lộ trình nào?',
        en: 'You have a public website and want better security and speed. Which track should you start with?',
        km: 'អ្នកមាន website សាធារណៈ ហើយចង់បាន security និងល្បឿនល្អជាង។ Track ណាគួរចាប់ផ្តើម?',
      },
      options: [
        { id: 'A', text: { vi: 'Developer Platform', en: 'Developer Platform', km: 'Developer Platform' } },
        { id: 'B', text: { vi: 'Application Services', en: 'Application Services', km: 'Application Services' } },
        { id: 'C', text: { vi: 'Cloudflare One', en: 'Cloudflare One', km: 'Cloudflare One' } },
        { id: 'D', text: { vi: 'Workers AI', en: 'Workers AI', km: 'Workers AI' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Application Services: DNS, proxy, SSL/TLS, WAF, cache — phù hợp bảo vệ và tăng tốc site/API đang chạy.',
        en: 'Application Services covers DNS, proxy, SSL/TLS, WAF, and cache — ideal for protecting and accelerating live sites/APIs.',
        km: 'Application Services គ្របដណ្តប់ DNS, proxy, SSL/TLS, WAF និង cache — សមស្របសម្រាប់ការពារ និងបង្កើនល្បឿន sites/APIs ដែលកំពុងដំណើរការ។',
      },
      learnMore: { href: '/tracks/application-services', label: { vi: 'Xem lộ trình', en: 'View track', km: 'មើលផ្លូវសិក្សា' } },
    },
    {
      id: 'q3',
      topic: 'developer-platform',
      prompt: {
        vi: 'Bạn muốn deploy frontend và API serverless không quản server. Lộ trình nào phù hợp?',
        en: 'You want to deploy a frontend and serverless APIs without managing servers. Which track fits?',
        km: 'អ្នកចង់ deploy frontend និង APIs serverless ដោយមិនគ្រប់គ្រង servers។ Track ណាសម?',
      },
      options: [
        { id: 'A', text: { vi: 'Developer Platform', en: 'Developer Platform', km: 'Developer Platform' } },
        { id: 'B', text: { vi: 'Cloudflare One', en: 'Cloudflare One', km: 'Cloudflare One' } },
        { id: 'C', text: { vi: 'Email Security', en: 'Email Security', km: 'Email Security' } },
        { id: 'D', text: { vi: 'Cloudflare WAN', en: 'Cloudflare WAN', km: 'Cloudflare WAN' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'On-ramp 2026: C3 + Worker, rồi KV/D1/R2. Pages dành cho Git site hiện có — không bắt buộc trước Worker.',
        en: '2026 on-ramp: C3 + Worker, then KV/D1/R2. Pages is for existing Git sites — not required before a Worker.',
        km: '2026 on-ramp៖ C3 + Worker បន្ទាប់មក KV/D1/R2។ Pages សម្រាប់ Git sites ដែលមានស្រាប់ — មិនតម្រូវមុន Worker។',
      },
      learnMore: { href: '/tracks/developer-platform/dp-1-l1', label: { vi: 'Bài Worker đầu tiên', en: 'First Worker lesson', km: 'មេរៀន Worker ដំបូង' } },
    },
    {
      id: 'q4',
      topic: 'cloudflare-one',
      prompt: {
        vi: 'Team cần thay VPN truy cập app nội bộ theo từng ứng dụng. Hướng nào đúng?',
        en: 'Your team needs app-level access instead of a full VPN. What is the right direction?',
        km: 'ក្រុមអ្នកត្រូវការ access កម្រិត app ជំនួស VPN ពេញ។ ទិសដៅណាត្រឹមត្រូវ?',
      },
      options: [
        { id: 'A', text: { vi: 'Chỉ bật CDN cache', en: 'Only enable CDN cache', km: 'បើកតែ CDN cache' } },
        { id: 'B', text: { vi: 'Cloudflare One (Zero Trust / ZTNA)', en: 'Cloudflare One (Zero Trust / ZTNA)', km: 'Cloudflare One (Zero Trust / ZTNA)' } },
        { id: 'C', text: { vi: 'Upload file lên R2', en: 'Upload files to R2', km: 'Upload files ទៅ R2' } },
        { id: 'D', text: { vi: 'Đổi nameserver sang registrar khác', en: 'Move nameservers to another registrar', km: 'ផ្លាស់ nameservers ទៅ registrar ផ្សេង' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Zero Trust cấp quyền theo identity + policy cho từng app — không mở toàn bộ mạng như VPN truyền thống.',
        en: 'Zero Trust grants access per app using identity and policies — not full network access like legacy VPN.',
        km: 'Zero Trust ផ្តល់ access តាម app ដោយប្រើ identity និង policies — មិនមែន network access ពេញដូច VPN បុរាណ។',
      },
      learnMore: { href: '/tracks/cloudflare-one', label: { vi: 'Xem lộ trình', en: 'View track', km: 'មើលផ្លូវសិក្សា' } },
    },
    {
      id: 'q5',
      topic: 'cloudflare-101',
      prompt: {
        vi: 'Luồng traffic đúng cho website đã bật proxy (orange cloud)?',
        en: 'What is the correct traffic flow for a proxied website (orange cloud)?',
        km: 'លំហូរ traffic ត្រឹមត្រូវសម្រាប់ website ដែល proxied (orange cloud) គឺអ្វី?',
      },
      options: [
        { id: 'A', text: { vi: 'User → Origin → Cloudflare', en: 'User → Origin → Cloudflare', km: 'User → Origin → Cloudflare' } },
        { id: 'B', text: { vi: 'User → Cloudflare → Origin', en: 'User → Cloudflare → Origin', km: 'User → Cloudflare → Origin' } },
        { id: 'C', text: { vi: 'Origin → User trực tiếp', en: 'Origin → User directly', km: 'Origin → User ផ្ទាល់' } },
        { id: 'D', text: { vi: 'DNS → Database → Browser', en: 'DNS → Database → Browser', km: 'DNS → Database → Browser' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Request đi qua Cloudflare edge trước — nơi áp dụng SSL, WAF, cache — rồi mới tới origin.',
        en: 'Requests hit the Cloudflare edge first for SSL, WAF, and cache — then reach your origin.',
        km: 'Requests ប៉ះ Cloudflare edge មុនសម្រាប់ SSL, WAF និង cache — បន្ទាប់មកដល់ origin របស់អ្នក។',
      },
      learnMore: { href: '/glossary', label: { vi: 'Xem thuật ngữ Proxy', en: 'See Proxy in glossary', km: 'មើល Proxy ក្នុង Glossary' } },
    },
    {
      id: 'q6',
      topic: 'application-services',
      prompt: {
        vi: 'Origin đã có chứng chỉ HTTPS hợp lệ. SSL/TLS mode nào nên ưu tiên?',
        en: 'Your origin has a valid HTTPS certificate. Which SSL/TLS mode should you prefer?',
        km: 'Origin របស់អ្នកមាន HTTPS certificate ត្រឹមត្រូវ។ SSL/TLS mode ណាគួរជ្រើស?',
      },
      options: [
        { id: 'A', text: { vi: 'Off', en: 'Off', km: 'Off' } },
        { id: 'B', text: { vi: 'Flexible (HTTP tới origin)', en: 'Flexible (HTTP to origin)', km: 'Flexible (HTTP ទៅ origin)' } },
        { id: 'C', text: { vi: 'Full (strict)', en: 'Full (strict)', km: 'Full (strict)' } },
        { id: 'D', text: { vi: 'Không cần SSL', en: 'SSL not needed', km: 'មិនត្រូវការ SSL' } },
      ],
      correct: 'C',
      explanation: {
        vi: 'Full (strict) mã hóa end-to-end và xác thực cert origin — tránh lỗ hổng khi dùng Flexible với origin chỉ HTTPS.',
        en: 'Full (strict) encrypts end-to-end and validates the origin cert — avoid Flexible when origin expects HTTPS.',
        km: 'Full (strict) បម្លែងសម្ងាត់ end-to-end និងផ្ទៀងផ្ទាត់ origin cert — ជៀស Flexible ពេល origin រំពឹង HTTPS។',
      },
      learnMore: { href: '/tracks/application-services/as-2-l1', label: { vi: 'Bài SSL/TLS Full (strict)', en: 'SSL/TLS Full (strict) lesson', km: 'មេរៀន SSL/TLS Full (strict)' } },
    },
    {
      id: 'q7',
      topic: 'glossary',
      prompt: {
        vi: 'Trang có cookie session (giỏ hàng, đăng nhập). Cache nên xử lý thế nào?',
        en: 'A page uses session cookies (cart, login). How should caching be handled?',
        km: 'ទំព័រប្រើ session cookies (cart, login)។ ត្រូវដោះស្រាយ cache យ៉ាងណា?',
      },
      options: [
        { id: 'A', text: { vi: 'Cache mọi thứ với TTL dài nhất', en: 'Cache everything with the longest TTL', km: 'Cache គ្រប់យ៉ាងជាមួយ TTL វែងបំផុត' } },
        { id: 'B', text: { vi: 'Bypass cache cho nội dung động / có cookie', en: 'Bypass cache for dynamic or cookie-based content', km: 'Bypass cache សម្រាប់ content ថាមវន្ត ឬផ្អែកលើ cookie' } },
        { id: 'C', text: { vi: 'Tắt SSL', en: 'Turn off SSL', km: 'បិទ SSL' } },
        { id: 'D', text: { vi: 'Xóa toàn bộ DNS records', en: 'Delete all DNS records', km: 'លុប DNS records ទាំងអស់' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'Cache tốt cho static (CSS, JS, ảnh); bypass tránh lộ dữ liệu cá nhân giữa các user.',
        en: 'Cache static assets (CSS, JS, images); bypass prevents leaking personalized data between users.',
        km: 'Cache static assets (CSS, JS, images); bypass ការពារកុំឱ្យ leak ទិន្នន័យផ្ទាល់ខ្លួនរវាង users។',
      },
      learnMore: { href: '/glossary', label: { vi: 'Thuật ngữ Cache', en: 'Glossary: Cache', km: 'Glossary៖ Cache' } },
    },
    {
      id: 'q8',
      topic: 'developer-platform',
      prompt: {
        vi: 'Lưu đăng ký workshop và kết quả quiz vào bảng SQL nhỏ. Storage nào phù hợp?',
        en: 'You need to store workshop signups and quiz results in small SQL tables. Which storage fits?',
        km: 'អ្នកត្រូវរក្សាទុក workshop signups និងលទ្ធផល quiz ក្នុង SQL tables តូច។ Storage ណាសម?',
      },
      options: [
        { id: 'A', text: { vi: 'KV', en: 'KV', km: 'KV' } },
        { id: 'B', text: { vi: 'D1', en: 'D1', km: 'D1' } },
        { id: 'C', text: { vi: 'CDN cache', en: 'CDN cache', km: 'CDN cache' } },
        { id: 'D', text: { vi: 'DNS only', en: 'DNS only', km: 'DNS only' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'D1 là SQLite trên edge — phù hợp dữ liệu có schema. KV tốt cho key-value đơn giản, không thay SQL.',
        en: 'D1 is SQLite at the edge for structured data. KV is for simple key-value, not relational queries.',
        km: 'D1 គឺ SQLite នៅ edge សម្រាប់ទិន្នន័យមានរចនាសម្ព័ន្ធ។ KV សម្រាប់ key-value សាមញ្ញ មិនមែន relational queries។',
      },
      learnMore: { href: '/tracks/developer-platform', label: { vi: 'Phần storage', en: 'Storage module', km: 'Module storage' } },
    },
    {
      id: 'q9',
      topic: 'application-services',
      prompt: {
        vi: 'WAF trên Cloudflare giúp gì trước hết?',
        en: 'What does the Cloudflare WAF help with first and foremost?',
        km: 'Cloudflare WAF ជួយអ្វីមុនគេបំផុត?',
      },
      options: [
        { id: 'A', text: { vi: 'Thay thế hoàn toàn code application', en: 'Fully replace application code', km: 'ជំនួស application code ទាំងស្រុង' } },
        {
          id: 'B',
          text: { vi: 'Chặn request độc hại trước khi tới origin', en: 'Block malicious requests before they reach origin', km: 'Block requests អាក្រក់មុនពេលដល់ origin' },
        },
        { id: 'C', text: { vi: 'Tạo database backup', en: 'Create database backups', km: 'បង្កើត database backups' } },
        { id: 'D', text: { vi: 'Gửi email marketing', en: 'Send marketing email', km: 'ផ្ញើ marketing email' } },
      ],
      correct: 'B',
      explanation: {
        vi: 'WAF chặn request độc hại tại edge. Bật managed rules ở Simulate/Log 24–48h rồi mới Block — hostname phải Proxied.',
        en: 'WAF blocks malicious requests at the edge. Enable managed rules in Simulate/Log for 24–48h before Block — the hostname must be Proxied.',
        km: 'WAF block requests អាក្រក់នៅ edge។ បើក managed rules ក្នុង Simulate/Log រយៈពេល 24–48h មុន Block — hostname ត្រូវតែ Proxied។',
      },
      learnMore: { href: '/tracks/application-services/as-3-l1', label: { vi: 'Bài WAF managed rules', en: 'WAF managed rules lesson', km: 'មេរៀន WAF managed rules' } },
    },
    {
      id: 'q10',
      topic: 'developer-platform',
      prompt: {
        vi: 'Form đăng ký workshop public cần chống bot. Công cụ nào phù hợp trên Cloudflare?',
        en: 'A public workshop signup form needs bot protection. Which Cloudflare tool fits?',
        km: 'Form ចុះឈ្មោះ workshop សាធារណៈត្រូវការ bot protection។ ឧបករណ៍ Cloudflare ណាសម?',
      },
      options: [
        { id: 'A', text: { vi: 'Turnstile', en: 'Turnstile', km: 'Turnstile' } },
        { id: 'B', text: { vi: 'Cloudflare WAN', en: 'Cloudflare WAN', km: 'Cloudflare WAN' } },
        { id: 'C', text: { vi: 'Cloudflare Tunnel only', en: 'Cloudflare Tunnel only', km: 'Cloudflare Tunnel តែប៉ុណ្ណោះ' } },
        { id: 'D', text: { vi: 'Xóa zone', en: 'Delete the zone', km: 'លុប zone' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'Turnstile xác minh người thật; server verify token trước khi ghi D1 — thay captcha nặng nề.',
        en: 'Turnstile verifies humans; your server validates the token before writing to D1 — lighter than heavy captchas.',
        km: 'Turnstile ផ្ទៀងផ្ទាត់មនុស្ស; server របស់អ្នក validate token មុនសរសេរទៅ D1 — ស្រាលជាង captchas ធ្ងន់។',
      },
      learnMore: { href: '/workshop', label: { vi: 'Trang workshop', en: 'Workshop page', km: 'ទំព័រ Workshop' } },
    },
    {
      id: 'q11',
      topic: 'developer-platform',
      prompt: {
        vi: 'Bạn gọi nhiều provider AI (OpenAI + Workers AI) và cần log, cache, giới hạn chi phí. Công cụ nào phù hợp?',
        en: 'You call multiple AI providers (OpenAI + Workers AI) and need logs, cache, and cost controls. Which tool fits?',
        km: 'អ្នកហៅ AI providers ច្រើន (OpenAI + Workers AI) ហើយត្រូវការ logs, cache និងការគ្រប់គ្រងថ្លៃ។ ឧបករណ៍ណាសម?',
      },
      options: [
        { id: 'A', text: { vi: 'AI Gateway', en: 'AI Gateway', km: 'AI Gateway' } },
        { id: 'B', text: { vi: 'DNS only', en: 'DNS only', km: 'DNS only' } },
        { id: 'C', text: { vi: 'MX record', en: 'MX record', km: 'MX record' } },
        { id: 'D', text: { vi: 'Page Rules (legacy)', en: 'Page Rules (legacy)', km: 'Page Rules (legacy)' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'AI Gateway quản trị request AI tập trung — không thay thế Workers AI mà bổ sung observability và policy.',
        en: 'AI Gateway centralizes AI request governance — it complements Workers AI with observability and policy.',
        km: 'AI Gateway គ្រប់គ្រង AI request កណ្តាល — វាបំពេញ Workers AI ជាមួយ observability និង policy។',
      },
      learnMore: { href: '/first-week#platform-2026', label: { vi: 'Cập nhật 2026', en: '2026 snapshot', km: 'Snapshot 2026' } },
    },
    {
      id: 'q12',
      topic: 'cloudflare-one',
      prompt: {
        vi: 'Expose app nội bộ ra Internet an toàn mà không mở inbound firewall. Giải pháp Cloudflare nào?',
        en: 'Expose an internal app safely without opening inbound firewall ports. Which Cloudflare solution?',
        km: 'បង្ហាញ app ខាងក្នុងឱ្យសុវត្ថិភាពដោយមិនបើក inbound firewall ports។ ដំណោះស្រាយ Cloudflare ណា?',
      },
      options: [
        { id: 'A', text: { vi: 'Cloudflare Tunnel (`cloudflared`)', en: 'Cloudflare Tunnel (`cloudflared`)', km: 'Cloudflare Tunnel (`cloudflared`)' } },
        { id: 'B', text: { vi: 'Chỉ bật CDN cache', en: 'CDN cache only', km: 'CDN cache តែប៉ុណ្ណោះ' } },
        { id: 'C', text: { vi: 'Xóa DNS zone', en: 'Delete DNS zone', km: 'លុប DNS zone' } },
        { id: 'D', text: { vi: 'Flexible SSL', en: 'Flexible SSL', km: 'Flexible SSL' } },
      ],
      correct: 'A',
      explanation: {
        vi: 'Tunnel outbound từ mạng nội bộ — tên cũ “Argo Tunnel” đã đổi; kết hợp Access cho policy.',
        en: 'Outbound tunnel from your network — formerly “Argo Tunnel”; pair with Access for policy.',
        km: 'Tunnel outbound ពី network របស់អ្នក — ពីមុន “Argo Tunnel”; ផ្គូផ្គង Access សម្រាប់ policy។',
      },
      learnMore: { href: '/tracks/cloudflare-one', label: { vi: 'Lộ trình Cloudflare One', en: 'Cloudflare One track', km: 'ផ្លូវសិក្សា Cloudflare One' } },
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
      title: { vi: 'Rất tốt!', en: 'Excellent!', km: 'អស្ចារ្យ!' },
      message: {
        vi: 'Bạn nắm khá vững mental model và cách chọn lộ trình. Hãy áp dụng qua tình huống thực tế.',
        en: 'You have a solid grasp of mental models and track selection. Apply it via a use case next.',
        km: 'អ្នកយល់ច្បាស់ពី mental models និងការជ្រើសរើស track។ អនុវត្តតាម use case បន្ទាប់។',
      },
      primaryCta: { href: '/choose-your-path', label: { vi: 'Chọn lộ trình tiếp', en: 'Choose your next path', km: 'ជ្រើសរើសផ្លូវបន្ទាប់' } },
    };
  }
  if (ratio >= 0.7) {
    return {
      minScore: Math.ceil(total * 0.7),
      title: { vi: 'Khá ổn', en: 'Good progress', km: 'វឌ្ឍនភាពល្អ' },
      message: {
        vi: 'Đa số khái niệm đã rõ. Xem lại các câu sai bên dưới trước khi làm checklist hoặc use case.',
        en: 'Most concepts are clear. Review missed questions below before the checklist or a use case.',
        km: 'គោលគំនិតភាគច្រើនច្បាស់ហើយ។ ពិនិត្យសំណួរដែលខុសខាងក្រោម មុន checklist ឬ use case។',
      },
      primaryCta: { href: '/checklists/beginner-cloudflare-checklist', label: { vi: 'Làm checklist', en: 'Open checklist', km: 'បើក checklist' } },
    };
  }
  return {
    minScore: 0,
    title: { vi: 'Nên ôn thêm', en: 'Keep reviewing', km: 'បន្តពិនិត្យឡើងវិញ' },
    message: {
      vi: 'Đừng lo — hãy đọc lại Cloudflare 101 và một lộ trình, rồi làm lại quiz để củng cố.',
      en: 'No worries — revisit Cloudflare 101 and one track, then retake the quiz to reinforce.',
      km: 'កុំបារម្ភ — ត្រឡប់ទៅ Cloudflare 101 និង track មួយ បន្ទាប់មកធ្វើ quiz ម្តងទៀតដើម្បីពង្រឹង។',
    },
    primaryCta: { href: '/cloudflare-101', label: { vi: 'Ôn Cloudflare 101', en: 'Review Cloudflare 101', km: 'ពិនិត្យ Cloudflare 101 ឡើងវិញ' } },
  };
}
