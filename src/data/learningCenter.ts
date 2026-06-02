import type { LocalizedString } from '../i18n/types';

/** Inspired by Cloudflare Learning Center topics — https://www.cloudflare.com/learning/ */
export type LearningTopic = {
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  category: 'security' | 'performance' | 'network' | 'developer' | 'zero-trust' | 'privacy' | 'ai';
  relatedTrack: 'application-services' | 'developer-platform' | 'cloudflare-one';
  /** Official Cloudflare Learning article path (on cloudflare.com/learning) */
  officialPath: string;
};

export const learningCenterIntro: LocalizedString = {
  vi: 'Tài nguyên về an ninh mạng và cách Internet hoạt động — được tổ chức lại theo lộ trình beginner của Cloudflare Starter Hub.',
  en: 'Resources on cyber security and how the Internet works — reorganized for the Cloudflare Starter Hub beginner journey.',
};

export const learningTopics: LearningTopic[] = [
  {
    slug: 'ddos',
    title: { vi: 'DDoS attacks', en: 'DDoS attacks' },
    summary: {
      vi: 'Trong tấn công DDoS, nhiều máy tính phối hợp làm quá tải điểm truy cập, khiến user hợp lệ không dùng được dịch vụ.',
      en: 'In a DDoS attack, many computers work together to overwhelm an access point and prevent legitimate users from using a service.',
    },
    category: 'security',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/',
  },
  {
    slug: 'cdn',
    title: { vi: 'CDNs', en: 'CDNs' },
    summary: {
      vi: 'CDN là mạng server phân tán phục vụ nội dung Internet hiệu quả, cải thiện tốc độ tải và độ tin cậy.',
      en: 'A CDN is a distributed network of servers that efficiently delivers Internet content, improving loading speed and reliability.',
    },
    category: 'performance',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/',
  },
  {
    slug: 'dns',
    title: { vi: 'DNS', en: 'DNS' },
    summary: {
      vi: 'DNS thường được ví như “danh bạ điện thoại” của Internet: ánh xạ tên miền tới địa chỉ IP và nội dung web.',
      en: 'DNS is often called the phone book of the Internet: it maps domain names to IP addresses and web content.',
    },
    category: 'network',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
  },
  {
    slug: 'web-app-security',
    title: { vi: 'Web application security', en: 'Web application security' },
    summary: {
      vi: 'Web app dễ bị tấn công vì bản chất của Internet. Bảo mật web cần tiếp cận toàn diện để giảm thiểu nhiều kiểu tấn công.',
      en: 'Web applications are vulnerable due to the nature of the Internet. Web application security requires a holistic approach to mitigate attacks.',
    },
    category: 'security',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/security/what-is-web-application-security/',
  },
  {
    slug: 'performance',
    title: { vi: 'Performance', en: 'Performance' },
    summary: {
      vi: 'Ứng dụng tải nhanh thường có conversion rate và SEO tốt hơn. Hiểu các yếu tố ảnh hưởng performance là bước quan trọng.',
      en: 'Fast-loading applications see higher conversion rates and better SEO. Understanding performance factors is a key step.',
    },
    category: 'performance',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/performance/why-site-speed-matters/',
  },
  {
    slug: 'serverless',
    title: { vi: 'Serverless', en: 'Serverless' },
    summary: {
      vi: 'Serverless cho phép viết và deploy code mà không phải quản lý hạ tầng. Ngày càng nhiều developer chọn serverless.',
      en: 'Serverless lets you write and deploy code without managing infrastructure. More developers are choosing serverless.',
    },
    category: 'developer',
    relatedTrack: 'developer-platform',
    officialPath: 'https://www.cloudflare.com/learning/serverless/what-is-serverless/',
  },
  {
    slug: 'ssl',
    title: { vi: 'SSL / TLS', en: 'SSL / TLS' },
    summary: {
      vi: 'SSL (nay thường gọi TLS) là giao thức mã hóa chạy trên HTTP để bảo vệ giao tiếp giữa server và client.',
      en: 'SSL (today often TLS) is an encryption protocol on top of HTTP that protects communication between servers and clients.',
    },
    category: 'security',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/ssl/what-is-ssl/',
  },
  {
    slug: 'bots',
    title: { vi: 'Bots', en: 'Bots' },
    summary: {
      vi: 'Bot là ứng dụng tự động duyệt web. Có bot hữu ích, cũng có bot độc hại gây hại cho site và application.',
      en: 'Bots are automated applications that browse the web. Some are helpful; malicious bots can harm sites and applications.',
    },
    category: 'security',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/bots/what-is-a-bot/',
  },
  {
    slug: 'cloud',
    title: { vi: 'The cloud', en: 'The cloud' },
    summary: {
      vi: '“Cloud” là server truy cập qua Internet và phần mềm/database chạy trên đó — đặt tại data center toàn cầu.',
      en: 'The cloud refers to servers accessed over the Internet and the software and databases that run on them in data centers worldwide.',
    },
    category: 'developer',
    relatedTrack: 'developer-platform',
    officialPath: 'https://www.cloudflare.com/learning/cloud/what-is-the-cloud/',
  },
  {
    slug: 'zero-trust',
    title: { vi: 'Zero Trust', en: 'Zero Trust' },
    summary: {
      vi: 'Khác với bảo mật perimeter truyền thống, Zero Trust không tin mặc định user hay device. Mỗi request đều được xác minh.',
      en: 'Unlike traditional perimeter security, Zero Trust trusts no user or device by default. Every request is verified.',
    },
    category: 'zero-trust',
    relatedTrack: 'cloudflare-one',
    officialPath: 'https://www.cloudflare.com/learning/security/what-is-zero-trust/',
  },
  {
    slug: 'sase',
    title: { vi: 'SASE', en: 'SASE' },
    summary: {
      vi: 'SASE kết hợp SD-WAN với các dịch vụ bảo mật cốt lõi, cung cấp trên cloud edge.',
      en: 'SASE combines software-defined WAN with core security services, delivered on the cloud edge.',
    },
    category: 'zero-trust',
    relatedTrack: 'cloudflare-one',
    officialPath: 'https://www.cloudflare.com/learning/access-management/what-is-sase/',
  },
  {
    slug: 'network-layer',
    title: { vi: 'Network layer', en: 'Network layer' },
    summary: {
      vi: 'Network layer là phần trong quá trình truyền thông Internet nơi các mạng trao đổi gói dữ liệu.',
      en: 'The network layer is where different networks exchange packets of data during Internet communications.',
    },
    category: 'network',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/',
  },
  {
    slug: 'privacy',
    title: { vi: 'Privacy', en: 'Privacy' },
    summary: {
      vi: 'Data privacy là khả năng quyết định khi nào, như thế nào và mức độ chia sẻ thông tin cá nhân.',
      en: 'Data privacy is the ability to determine when, how, and to what extent personal information is shared.',
    },
    category: 'privacy',
    relatedTrack: 'cloudflare-one',
    officialPath: 'https://www.cloudflare.com/learning/privacy/what-is-data-privacy/',
  },
  {
    slug: 'video-streaming',
    title: { vi: 'Video streaming', en: 'Video streaming' },
    summary: {
      vi: 'Streaming là truyền liên tục audio/video từ server tới client — từ định dạng file đến live encoding.',
      en: 'Streaming is continuous transmission of audio or video from a server to a client — from file formats to live encoding.',
    },
    category: 'developer',
    relatedTrack: 'developer-platform',
    officialPath: 'https://www.cloudflare.com/learning/video/what-is-streaming/',
  },
  {
    slug: 'email-security',
    title: { vi: 'Email security', en: 'Email security' },
    summary: {
      vi: 'Email security ngăn tấn công qua email, bảo vệ tài khoản khỏi takeover và bảo vệ nội dung email.',
      en: 'Email security prevents email-based attacks, protects accounts from takeover, and secures email contents.',
    },
    category: 'security',
    relatedTrack: 'cloudflare-one',
    officialPath: 'https://www.cloudflare.com/learning/email-security/what-is-email-security/',
  },
  {
    slug: 'ai',
    title: { vi: 'Artificial intelligence (AI)', en: 'Artificial intelligence (AI)' },
    summary: {
      vi: 'AI là khả năng máy tính bắt chước tác vụ nhận thức của con người — LLM, embeddings, vector databases.',
      en: 'AI is a computer’s ability to imitate human cognitive tasks — LLMs, embeddings, and vector databases.',
    },
    category: 'ai',
    relatedTrack: 'developer-platform',
    officialPath: 'https://www.cloudflare.com/learning/ai/what-is-artificial-intelligence/',
  },
  {
    slug: 'domain-registration',
    title: { vi: 'Domain registration', en: 'Domain registration' },
    summary: {
      vi: 'Domain name là chuỗi text ánh xạ tới địa chỉ IP. Hiểu domain và đăng ký domain là bước đầu với public apps.',
      en: 'A domain name maps to an IP address. Understanding domains and registration is a first step for public apps.',
    },
    category: 'network',
    relatedTrack: 'application-services',
    officialPath: 'https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/',
  },
];

export const learningCenterCategories = [
  { id: 'all', label: { vi: 'Tất cả', en: 'All' } },
  { id: 'security', label: { vi: 'Security', en: 'Security' } },
  { id: 'performance', label: { vi: 'Performance', en: 'Performance' } },
  { id: 'network', label: { vi: 'Network', en: 'Network' } },
  { id: 'developer', label: { vi: 'Developer', en: 'Developer' } },
  { id: 'zero-trust', label: { vi: 'Zero Trust', en: 'Zero Trust' } },
  { id: 'ai', label: { vi: 'AI', en: 'AI' } },
] as const;
