import type { LocalizedString } from '../i18n/types';
import rawData from './referenceDiagrams.data.json';

export const REF_ARCH_DIAGRAMS_URL = 'https://developers.cloudflare.com/reference-architecture/diagrams/';
export const REF_ARCH_DIAGRAMS_LLMS_URL = 'https://developers.cloudflare.com/reference-architecture/llms.txt';
export const DIAGRAMS_LAST_SYNCED = '2026-07-23';

export type DiagramCategory =
  | 'ai'
  | 'bots'
  | 'content-delivery'
  | 'iot'
  | 'network'
  | 'sase'
  | 'security'
  | 'serverless'
  | 'storage';

export type DiagramTrack =
  | 'application-services'
  | 'developer-platform'
  | 'cloudflare-one'
  | 'ai-security-adoption'
  | 'operational-excellence'
  | 'cross-cutting';

type RawDiagram = (typeof rawData)[number];

export type ReferenceDiagram = {
  slug: string;
  category: DiagramCategory;
  categoryLabel: LocalizedString;
  title: LocalizedString;
  summary: LocalizedString;
  concepts: string[];
  pageUrl: string;
  images: { url: string; alt: LocalizedString }[];
  primaryImageUrl: string;
  relatedTrack: DiagramTrack;
  featured?: boolean;
};

export const diagramCategoryLabels: Record<DiagramCategory, LocalizedString> = {
  ai: { vi: 'AI', en: 'Artificial Intelligence (AI)' },
  bots: { vi: 'Bot', en: 'Bots' },
  'content-delivery': { vi: 'Phân phối nội dung', en: 'Content Delivery' },
  iot: { vi: 'IoT', en: 'Internet of Things (IoT)' },
  network: { vi: 'Mạng', en: 'Network' },
  sase: { vi: 'SASE / Cloudflare One', en: 'Secure Access Service Edge (SASE)' },
  security: { vi: 'Bảo mật', en: 'Security' },
  serverless: { vi: 'Serverless', en: 'Serverless' },
  storage: { vi: 'Lưu trữ', en: 'Storage' },
};

const categoryTrack: Record<DiagramCategory, DiagramTrack> = {
  ai: 'developer-platform',
  bots: 'application-services',
  'content-delivery': 'application-services',
  iot: 'cross-cutting',
  network: 'application-services',
  sase: 'cloudflare-one',
  security: 'cross-cutting',
  serverless: 'developer-platform',
  storage: 'developer-platform',
};

/** Key terms validated against official diagram pages (developers.cloudflare.com). */
const conceptOverlay: Record<string, string[]> = {
  'ai-rag': ['RAG', 'Vectorize', 'Workers AI', 'Knowledge seeding', 'Embeddings'],
  'ai-composable': ['Workers AI', 'AI Gateway', 'External LLM', 'Composable stack'],
  'bot-management': ['Bot score', 'Super Bot Fight Mode', 'WAF', 'Rate limiting'],
  'distributed-web-performance-architecture': ['CDN', 'Cache', 'Core Web Vitals', 'Smart Shield', 'Argo'],
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2': [
    'Image Resizing',
    'R2',
    'Transformations',
    'Cache',
  ],
  'fullstack-application': ['Workers', 'Pages', 'D1', 'R2', 'KV', 'Durable Objects'],
  'serverless-global-apis': ['Workers', 'D1', 'R2', 'Global API', 'Edge compute'],
  'secure-access-to-saas-applications-with-sase': ['SASE', 'Gateway', 'Access', 'Device posture', 'SaaS'],
  'augment-access-with-serverless': ['Access', 'External Evaluation', 'Workers', 'ZTNA'],
  'cloudflare-one-appliance-deployment': ['Cloudflare One Client', 'WARP', 'MDM', 'On-prem appliance'],
  'securing-data-in-transit': ['Gateway', 'DLP', 'TLS', 'CASB', 'Inline inspection'],
  'api-shield-workflow': [
    'API Shield',
    'Endpoint discovery',
    'Schema validation',
    'mTLS',
    'JWT validation',
    'Rate limiting',
    'Positive security model',
  ],
  'securing-data-at-rest': ['CASB', 'SaaS API', 'Data at rest', 'DLP'],
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit': ['Magic Transit', 'DDoS', 'Anycast', 'Hybrid cloud'],
  'storing-user-generated-content': ['R2', 'Workers', 'UGC', 'Object storage'],
};

/** Vietnamese titles for official diagram pages (source catalog is English-only). */
const viTitleOverlay: Record<string, string> = {
  'ai-asset-creation': 'Tạo tài sản dựa trên nội dung',
  'ai-composable': 'Kiến trúc AI kết hợp (composable)',
  'ai-multivendor-observability-control': 'Quan sát và kiểm soát AI đa nhà cung cấp',
  'ai-rag': 'Retrieval Augmented Generation (RAG)',
  'ai-vibe-coding-platform': 'Nền tảng AI Vibe Coding',
  'ai-video-caption': 'Phụ đề tự động khi tải video',
  'bigquery-workers-ai': 'Đưa dữ liệu BigQuery vào Workers AI',
  'enterprise-ai-agent-workspace': 'Không gian làm việc AI agent cho doanh nghiệp',
  'enterprise-ai-vibe-coding-platform': 'Nền tảng AI Vibe Coding cho doanh nghiệp',
  'bot-management': 'Quản lý bot',
  'distributed-web-performance-architecture': 'Thiết kế kiến trúc hiệu năng web phân tán',
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2':
    'Tối ưu phân phối ảnh với Image Resizing và R2',
  'optimizing-and-securing-connected-transportation-systems':
    'Tối ưu và bảo mật hệ thống giao thông kết nối',
  'bring-your-own-ip-space-to-cloudflare': 'Mang dải IP riêng lên Cloudflare',
  'optimizing-roaming-experience-with-geolocated-ips':
    'Tối ưu roaming thiết bị với IP theo vị trí địa lý',
  'protect-data-center-networks': 'Bảo vệ mạng data center',
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit':
    'Bảo vệ mạng hybrid cloud với Magic Transit',
  'protect-public-networks-with-cloudflare': 'Bảo vệ mạng public với Cloudflare',
  'protecting-sp-networks-from-ddos': 'Bảo vệ mạng ISP và viễn thông khỏi DDoS',
  'augment-access-with-serverless': 'Mở rộng ZTNA bằng ủy quyền ngoài và serverless',
  'cloudflare-one-appliance-deployment': 'Tùy chọn triển khai Cloudflare One Appliance',
  'deploying-self-hosted-voip-services-for-hybrid-users':
    'Triển khai VoIP self-hosted cho user hybrid',
  'gateway-dns-for-isp': 'Lọc DNS cho nhà cung cấp Internet',
  'gateway-for-protective-dns': 'Protective DNS cho cơ quan nhà nước',
  'sase-clientless-access-private-dns': 'Truy cập app nội bộ không cần cài client',
  'secure-access-to-saas-applications-with-sase': 'Truy cập SaaS an toàn với SASE',
  'zero-trust-and-virtual-desktop-infrastructure': 'Zero Trust và hạ tầng desktop ảo (VDI)',
  'securing-data-at-rest': 'Bảo vệ dữ liệu lưu trữ (data at rest)',
  'securing-data-in-transit': 'Bảo vệ dữ liệu đang truyền (data in transit)',
  'securing-data-in-use': 'Bảo vệ dữ liệu đang dùng (data in use)',
  'a-b-testing-using-workers': 'A/B testing với Workers',
  'fullstack-application': 'Ứng dụng fullstack',
  'programmable-platforms': 'Nền tảng lập trình được (programmable platforms)',
  'serverless-etl': 'Pipeline ETL serverless',
  'serverless-global-apis': 'API serverless toàn cầu',
  'serverless-image-content-management': 'Quản lý nội dung ảnh serverless',
  'durable-object-control-data-plane-pattern': 'Pattern control plane / data plane với Durable Objects',
  'egress-free-storage-multi-cloud': 'Object storage không phí egress đa cloud',
  'event-notifications-for-storage': 'Thông báo sự kiện cho lưu trữ',
  'on-demand-object-storage-migration': 'Di chuyển object storage theo nhu cầu',
  'storing-user-generated-content': 'Lưu nội dung do người dùng tạo',
};

const viSummaryOverlay: Record<string, string> = {
  'ai-asset-creation':
    'Hệ thống AI kết hợp mô hình sinh văn bản và text-to-image để tạo hình từ text — sinh prompt, kiểm duyệt nội dung và xuất ảnh cho nhiều ứng dụng.',
  'ai-composable':
    'Ứng dụng AI có thể dựng end-to-end trên Cloudflare, hoặc gắn từng dịch vụ vào hạ tầng và dịch vụ bên ngoài.',
  'ai-multivendor-observability-control':
    'Đưa rate limiting, cache và xử lý lỗi lên lớp proxy để áp cấu hình thống nhất cho nhiều dịch vụ và nhà cung cấp inference.',
  'ai-rag':
    'RAG kết hợp retrieval (Vectorize/KV) với Workers AI để chatbot trả lời chính xác hơn — seeding knowledge và query path tách biệt.',
  'ai-vibe-coding-platform':
    'Nền tảng compute serverless độ trễ thấp (Workers) hỗ trợ vibe coding và A/B testing phía server trên Cloudflare.',
  'ai-video-caption':
    'Tích hợp nhận dạng giọng nói khi tải video — phụ đề tự động giúp tiếp cận khán giả khiếm thính hoặc xem bằng ngôn ngữ khác.',
  'bigquery-workers-ai':
    'Kết nối Worker với Google BigQuery rồi chuyển dữ liệu sang Workers AI để chạy mô hình trên GPU serverless.',
  'enterprise-ai-agent-workspace':
    'Kiến trúc tham chiếu để xây workspace AI agent có quản trị, stateful trên Cloudflare.',
  'enterprise-ai-vibe-coding-platform':
    'Kiến trúc tham chiếu để xây nền tảng vibe coding AI có quản trị cho doanh nghiệp trên Cloudflare.',
  'bot-management':
    'Luồng phát hiện, chấm điểm và xử lý bot traffic trên edge — nền tảng cho WAF, rate limit và Bot Management.',
  'distributed-web-performance-architecture':
    'Pattern L7: data flow, cache tiers, deployment models — giảm latency và cải thiện Core Web Vitals.',
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2':
    'Giải pháp tối ưu phân phối ảnh, mở rộng được và hiệu năng cao — Image Resizing kết hợp R2.',
  'optimizing-and-securing-connected-transportation-systems':
    'Các thành phần Cloudflare tối ưu hệ thống giao thông kết nối — giảm latency, tăng độ tin cậy và củng cố bảo mật luồng dữ liệu.',
  'bring-your-own-ip-space-to-cloudflare':
    'Doanh nghiệp mang dải IP của mình lên mạng Cloudflare để nhận bảo mật và hiệu năng, nhưng thế giới vẫn thấy dải IP public của họ.',
  'optimizing-roaming-experience-with-geolocated-ips':
    'Cloudflare dùng mạng di động riêng (APN) để kết nối thiết bị roaming nhiều quốc gia qua breakout Internet theo vùng.',
  'protect-data-center-networks':
    'Kiến trúc tham chiếu dùng Cloudflare WAN, Cloudflare Network Firewall và Gateway để bảo vệ mạng data center.',
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit':
    'Magic Transit cung cấp bảo vệ DDoS in-line trên cloud và tăng tốc traffic cho mọi mạng hướng Internet.',
  'protect-public-networks-with-cloudflare':
    'Magic Transit, Network Firewall và Gateway bảo vệ in-line, tự động, mở rộng được cho mạng public — đa cloud và on-prem.',
  'protecting-sp-networks-from-ddos':
    'Cách nhà cung cấp Internet (ISP) và công ty viễn thông bảo vệ mạng khỏi tấn công DDoS.',
  'augment-access-with-serverless':
    'ZTNA tăng cường policy Access bằng gọi API ngoài và Workers — xác thực và ủy quyền user trước khi vào tài nguyên được bảo vệ.',
  'cloudflare-one-appliance-deployment':
    'Cách triển khai Cloudflare One Appliance và đánh giá các lựa chọn: uplink HA, dual connector, hybrid MPLS, split tunnel, segmentation.',
  'deploying-self-hosted-voip-services-for-hybrid-users':
    'Cloudflare cải thiện so với VPN truyền thống nhờ mạng toàn cầu — kết nối an toàn từ thiết bị user tới SIP server.',
  'gateway-dns-for-isp':
    'Dùng Cloudflare Gateway làm giải pháp lọc DNS cho nhà cung cấp Internet (ISP).',
  'gateway-for-protective-dns':
    'Dùng Cloudflare Gateway làm dịch vụ Protective DNS cho cơ quan nhà nước — forward DNS, threat intel, policy theo nhóm.',
  'sase-clientless-access-private-dns':
    'Cho phép truy cập app private mà không cần triển khai agent trên thiết bị — browser isolation + hostname nội bộ.',
  'secure-access-to-saas-applications-with-sase':
    'Zero Trust cho SaaS: policy theo identity, device posture và network context qua Cloudflare One.',
  'zero-trust-and-virtual-desktop-infrastructure':
    'Hướng dẫn dùng Zero Trust với VDI — cải thiện so với remote access web app truyền thống, bảo mật cao hơn.',
  'securing-data-at-rest':
    'CASB theo API của Cloudflare hoạt động thế nào và bảo vệ dữ liệu đang lưu (data at rest).',
  'securing-data-in-transit':
    'Bảo vệ data in transit với Gateway/DLP — inspect TLS traffic trước khi tới SaaS hoặc Internet.',
  'securing-data-in-use':
    'Remote Browser Isolation (RBI) hoạt động thế nào và bảo vệ dữ liệu đang dùng (data in use).',
  'a-b-testing-using-workers':
    'Workers — compute serverless độ trễ thấp — hỗ trợ A/B testing phía server.',
  'fullstack-application':
    'Ví dụ fullstack trên Developer Platform — Workers/Pages, storage và AI services trong một kiến trúc thực tế.',
  'programmable-platforms':
    'Workers for Platforms cung cấp hạ tầng an toàn, mở rộng, chi phí hợp lý cho nền tảng lập trình được, phủ toàn cầu.',
  'serverless-etl':
    'Pipeline ETL hoàn toàn serverless trên Cloudflare — giảm độ phức tạp, rút thời gian lên production và hạ chi phí.',
  'serverless-global-apis':
    'Ví dụ kiến trúc API serverless trên Cloudflare — compute và data product (Workers, D1, R2) tương tác thế nào.',
  'serverless-image-content-management':
    'Dùng các thành phần hệ sinh thái Cloudflare để dựng giải pháp quản lý ảnh mở rộng được.',
  'durable-object-control-data-plane-pattern':
    'Tách control plane khỏi data plane với Durable Objects — hiệu năng và độ tin cậy cao mà không hy sinh chức năng.',
  'egress-free-storage-multi-cloud':
    'Dùng R2 để object storage đa cloud không phí egress.',
  'event-notifications-for-storage':
    'Dùng Workers hoặc dịch vụ ngoài để nhận thông báo khi dữ liệu thay đổi rồi xử lý phù hợp.',
  'on-demand-object-storage-migration':
    'Dùng công cụ migration của Cloudflare để chuyển dữ liệu giữa các nhà cung cấp object storage.',
  'storing-user-generated-content':
    'Lưu nội dung do người dùng tạo (UGC) trên R2 — kiến trúc nhanh, an toàn, chi phí hợp lý.',
  'api-shield-workflow':
    'Luồng API Shield: discovery endpoint → review → positive security (schema, mTLS, JWT) → chống abuse → giám sát endpoint.',
};

/** Vietnamese captions for official figure alts (source catalog is English-only). */
const viAltOverlay: Record<string, string> = {
  'Figure 1: Content-based asset generation': 'Hình 1: Sinh tài sản dựa trên nội dung',
  'Figure 1: Composable AI architecture': 'Hình 1: Kiến trúc AI kết hợp',
  'Multi-vendor AI architecture': 'Kiến trúc AI đa nhà cung cấp',
  'Figure 1: Knowledge seeding': 'Hình 1: Nạp tri thức (knowledge seeding)',
  'Figure 2: Knowledge queries': 'Hình 2: Truy vấn tri thức',
  'Figure 1:  Automatic captioning on upload': 'Hình 1: Phụ đề tự động khi tải lên',
  'Figure 1: Showing a request to a private resource and where  Access can be customized for AuthZ and AuthN':
    'Hình 1: Request tới tài nguyên nội bộ và chỗ Access tùy biến AuthZ / AuthN',
  'Figure 2: Modified origin request including posture details':
    'Hình 2: Request tới origin đã thêm chi tiết posture',
  'Figure 1: Only traffic that has passed the Cloudflare network and relevant policies is authorized to access the SaaS application.':
    'Hình 1: Chỉ traffic đã qua mạng Cloudflare và policy liên quan mới được phép vào ứng dụng SaaS.',
  'Figure 1: How Cloudflare identifies, scores and processes traffic from bots.':
    'Hình 1: Cách Cloudflare nhận diện, chấm điểm và xử lý traffic từ bot.',
  'Figure 1: Data flow overview': 'Hình 1: Tổng quan luồng dữ liệu',
  'Figure 2: Smart Shield Advanced network diagram': 'Hình 2: Sơ đồ mạng Smart Shield Advanced',
  'Figure 3: Data flow - network and content optimization': 'Hình 3: Luồng dữ liệu — tối ưu mạng và nội dung',
  'Figure 1: Securing data from the user device, all the way to the website/API':
    'Hình 1: Bảo vệ dữ liệu từ thiết bị user đến website/API',
  'Figure 2: Various methods of connecting and routing traffic to Cloudflare to secure private traffic.':
    'Hình 2: Các cách kết nối và định tuyến traffic tới Cloudflare để bảo vệ traffic nội bộ.',
  'Figure 3: Example of a Cloudflare policy blocking confidential data uploaded to approved cloud storage.':
    'Hình 3: Ví dụ policy Cloudflare chặn dữ liệu mật tải lên cloud storage đã duyệt.',
  'Figure 4: Upload of file containing sensitive data blocked by Cloudflare DLP':
    'Hình 4: Tải file chứa dữ liệu nhạy cảm bị Cloudflare DLP chặn',
  'Figure 1: Overall solution of user access controls to, and the discovery of, sensitive data.':
    'Hình 1: Giải pháp tổng thể — kiểm soát truy cập user và phát hiện dữ liệu nhạy cảm.',
  'Figure 1: Remote browser connected to private web service using internal hostname':
    'Hình 1: Remote browser kết nối dịch vụ web nội bộ qua hostname nội bộ',
  'Figure 1: Cloudflare Developer Platform': 'Hình 1: Cloudflare Developer Platform',
  'Figure 2: Fullstack application': 'Hình 2: Ứng dụng fullstack',
  'Figure 1:  Traditional single-region architecture': 'Hình 1: Kiến trúc truyền thống một vùng',
  'Figure 2:  Region Earth': 'Hình 2: Region Earth',
  'Figure 3: Serverless global APIs': 'Hình 3: API serverless toàn cầu',
};

const featuredSlugs = new Set([
  'fullstack-application',
  'ai-rag',
  'bot-management',
  'distributed-web-performance-architecture',
  'secure-access-to-saas-applications-with-sase',
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  'serverless-global-apis',
  'augment-access-with-serverless',
]);

/**
 * Resolve the <img src> for a reference diagram.
 *
 * Always prefer the locally-committed copy under `public/ref-diagrams/`. We must NOT fall
 * back to Cloudflare's `developers.cloudflare.com/_astro/*` URLs: those are content-hashed
 * (fingerprinted) build assets whose hashes rotate whenever Cloudflare rebuilds their docs,
 * so hotlinking them produces images that 404 without warning. `sourceUrl` is kept in the
 * data purely as provenance for the sync script — never as a render source.
 */
function resolveDiagramImageUrl(image: { file?: string; sourceUrl?: string; url?: string }): string {
  if (image.file) return `/ref-diagrams/${image.file}`;
  // Only accept a non-remote fallback (e.g. an already-local path); never a fingerprinted hotlink.
  const fallback = image.url ?? '';
  if (fallback && !fallback.includes('developers.cloudflare.com/')) return fallback;
  return '';
}

function localizeFigureAlt(enAlt: string, viTitle: string): string {
  const trimmed = enAlt.trim();
  if (!trimmed) return viTitle;
  if (viAltOverlay[trimmed]) return viAltOverlay[trimmed];
  const figure = trimmed.match(/^Figure\s+(\d+)[.:]\s*(.*)$/i);
  if (figure) {
    const rest = figure[2].trim();
    return rest ? `Hình ${figure[1]}: ${rest}` : `Hình ${figure[1]}`;
  }
  return trimmed;
}

function toDiagram(raw: RawDiagram): ReferenceDiagram {
  const category = raw.category as DiagramCategory;
  const viTitle = viTitleOverlay[raw.slug] ?? raw.title;
  const images = raw.images.map((img) => ({
    url: resolveDiagramImageUrl(img),
    alt: {
      vi: localizeFigureAlt(img.alt || '', viTitle),
      en: img.alt || raw.title,
    },
  }));
  return {
    slug: raw.slug,
    category,
    categoryLabel: diagramCategoryLabels[category] ?? { vi: category, en: category },
    title: { vi: viTitle, en: raw.title },
    summary: {
      vi: viSummaryOverlay[raw.slug] ?? raw.desc,
      en: raw.desc,
    },
    concepts: conceptOverlay[raw.slug] ?? [],
    pageUrl: raw.pageUrl,
    images,
    primaryImageUrl: images[0]?.url ?? '',
    relatedTrack: categoryTrack[category] ?? 'cross-cutting',
    featured: featuredSlugs.has(raw.slug),
  };
}

export const referenceDiagrams: ReferenceDiagram[] = rawData.map(toDiagram);

export const hubPageDiagramSlugs: Record<string, string[]> = {
  '/start-here': [
    'bot-management',
    'fullstack-application',
    'secure-access-to-saas-applications-with-sase',
  ],
  '/content-delivery': [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
  '/cloudflare-101': ['ai-composable', 'bot-management', 'fullstack-application'],
};

export const trackDiagramSlugs: Record<
  Exclude<DiagramTrack, 'cross-cutting'>,
  string[]
> = {
  'application-services': [
    'distributed-web-performance-architecture',
    'bot-management',
    'securing-data-in-transit',
  ],
  'developer-platform': ['fullstack-application', 'ai-rag', 'serverless-global-apis'],
  'cloudflare-one': [
    'secure-access-to-saas-applications-with-sase',
    'augment-access-with-serverless',
    'cloudflare-one-appliance-deployment',
  ],
  'ai-security-adoption': [
    'ai-multivendor-observability-control',
    'secure-access-to-saas-applications-with-sase',
    'ai-rag',
  ],
  'operational-excellence': [
    'distributed-web-performance-architecture',
    'bot-management',
    'serverless-global-apis',
  ],
};

export const useCaseDiagramSlugs: Record<string, string[]> = {
  'protect-website': ['bot-management', 'distributed-web-performance-architecture'],
  'secure-api': ['api-shield-workflow'],
  'defend-ddos-attacks': ['bot-management', 'distributed-web-performance-architecture'],
  'accelerate-content-delivery': [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
  'ecommerce-security-performance': ['bot-management', 'distributed-web-performance-architecture'],
  'media-streaming-delivery': [
    'serverless-image-content-management',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
  'build-serverless-app': ['fullstack-application', 'serverless-global-apis'],
  'deploy-static-site': ['fullstack-application', 'serverless-global-apis'],
  'build-ai-applications': ['ai-rag', 'ai-multivendor-observability-control'],
  'build-saas-platform': ['programmable-platforms', 'fullstack-application'],
  'replace-vpn': [
    'secure-access-to-saas-applications-with-sase',
    'sase-clientless-access-private-dns',
  ],
  'secure-remote-users': [
    'cloudflare-one-appliance-deployment',
    'zero-trust-and-virtual-desktop-infrastructure',
  ],
  'secure-saas-access': [
    'secure-access-to-saas-applications-with-sase',
    'sase-clientless-access-private-dns',
  ],
  'company-wide-security': [
    'secure-access-to-saas-applications-with-sase',
    'gateway-for-protective-dns',
  ],
};

/** Map Reference Architecture hub card slug → diagram slug (when paths differ). */
export const refArchItemDiagramSlug: Record<string, string> = {
  'fullstack-workers': 'fullstack-application',
  'ai-rag': 'ai-rag',
  'serverless-global-apis': 'serverless-global-apis',
  'bot-management': 'bot-management',
  'distributed-web-performance': 'distributed-web-performance-architecture',
  'saas-access-sase': 'secure-access-to-saas-applications-with-sase',
  'r2-egress-free': 'egress-free-storage-multi-cloud',
  cdn: 'distributed-web-performance-architecture',
  sase: 'secure-access-to-saas-applications-with-sase',
};

export function getDiagramBySlug(slug: string): ReferenceDiagram | undefined {
  return referenceDiagrams.find((d) => d.slug === slug);
}

export function getDiagramForRefArchItem(itemSlug: string): ReferenceDiagram | undefined {
  const diagramSlug = refArchItemDiagramSlug[itemSlug];
  if (diagramSlug) return getDiagramBySlug(diagramSlug);
  return referenceDiagrams.find((d) => d.slug === itemSlug);
}

export function getDiagramsByCategory(category: DiagramCategory): ReferenceDiagram[] {
  return referenceDiagrams.filter((d) => d.category === category);
}

export function getFeaturedDiagrams(limit = 8): ReferenceDiagram[] {
  return referenceDiagrams.filter((d) => d.featured).slice(0, limit);
}

export function getDiagramsForTrack(
  track: Exclude<DiagramTrack, 'cross-cutting'>,
  limit = 3,
): ReferenceDiagram[] {
  return trackDiagramSlugs[track]
    .map((slug) => getDiagramBySlug(slug))
    .filter((d): d is ReferenceDiagram => !!d)
    .slice(0, limit);
}

export function getDiagramsForHubPage(path: string): ReferenceDiagram[] {
  const slugs = hubPageDiagramSlugs[path] ?? [];
  return slugs.map((s) => getDiagramBySlug(s)).filter((d): d is ReferenceDiagram => !!d);
}

export function getDiagramsForUseCase(useCaseSlug: string): ReferenceDiagram[] {
  const slugs = useCaseDiagramSlugs[useCaseSlug] ?? [];
  return slugs.map((s) => getDiagramBySlug(s)).filter((d): d is ReferenceDiagram => !!d);
}

/** Diagrams whose official concept tags mention this product (see productPages diagramProductSlugs). */
export function getDiagramsForProduct(productSlug: string, limit = 2): ReferenceDiagram[] {
  const matches: ReferenceDiagram[] = [];
  for (const d of referenceDiagrams) {
    const tagged = diagramProductSlugsFromConcepts(d.slug);
    if (tagged.includes(productSlug)) matches.push(d);
  }
  if (matches.length > 0) return matches.slice(0, limit);
  return referenceDiagrams
    .filter((d) => d.slug.includes(productSlug.replace(/-/g, '')) || d.concepts.some((c) =>
      c.toLowerCase().replace(/\s+/g, '-') === productSlug ||
      c.toLowerCase().replace(/\s+/g, '-') === productSlug.replace(/s$/, ''),
    ))
    .slice(0, limit);
}

/** Inline mirror of productPages diagramProductSlugs to avoid circular imports. */
const productDiagramMap: Record<string, string[]> = {
  'ai-composable': ['workers-ai', 'ai-gateway', 'agents'],
  'ai-rag': ['workers-ai', 'vectorize', 'ai-search'],
  'bot-management': ['bots', 'waf', 'rate-limiting'],
  'fullstack-application': ['workers', 'pages', 'd1', 'r2', 'kv', 'durable-objects'],
  'serverless-global-apis': ['workers', 'd1', 'r2'],
  'distributed-web-performance-architecture': ['cache', 'cdn', 'speed'],
  'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2': ['images', 'r2', 'cache'],
  'secure-access-to-saas-applications-with-sase': ['access', 'gateway', 'sase', 'zero-trust'],
  'augment-access-with-serverless': ['access', 'workers', 'ztna'],
  'cloudflare-one-appliance-deployment': ['warp', 'gateway'],
  'securing-data-in-transit': ['gateway', 'dlp', 'casb', 'ssl'],
  'securing-data-at-rest': ['casb', 'dlp'],
  'protect-hybrid-cloud-networks-with-cloudflare-magic-transit': ['ddos', 'cloudflare-wan'],
  'storing-user-generated-content': ['r2', 'workers'],
};

function diagramProductSlugsFromConcepts(diagramSlug: string): string[] {
  return productDiagramMap[diagramSlug] ?? [];
}
