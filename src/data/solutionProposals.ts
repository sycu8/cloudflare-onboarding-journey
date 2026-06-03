import type { LocalizedString } from '../i18n/types';

export type SolutionComponent = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  capabilities: LocalizedString[];
  dashboardHint?: string;
};

export type SolutionProposal = {
  id: string;
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  trackSlug: 'application-services' | 'cloudflare-one';
  tag: LocalizedString;
  executiveSummary: LocalizedString;
  businessObjectives: LocalizedString[];
  approachPillars: LocalizedString[];
  components: SolutionComponent[];
  differentiators: LocalizedString[];
  implementation: LocalizedString[];
  support: LocalizedString[];
  hubLinks: { href: string; label: LocalizedString }[];
};

export const solutionsHubIntro: LocalizedString = {
  vi: 'Tóm tắt proposal mẫu cho ba bộ giải pháp: Application Services (bảo mật & hiệu năng web), Cloudflare One (SASE / Zero Trust), và Email Security — song ngữ Anh–Việt, phù hợp SME và team pre-sales.',
  en: 'Sample proposal summaries for three solution sets: Application Services (web security & performance), Cloudflare One (SASE / Zero Trust), and Email Security — bilingual English–Vietnamese for SMEs and pre-sales teams.',
};

export const solutionsDisclaimer: LocalizedString = {
  vi: 'Nội dung rút gọn từ proposal mẫu (placeholder [Customer Name]). Thay tên khách hàng, phạm vi và giá khi dùng thực tế; không phải hợp đồng pháp lý.',
  en: 'Condensed from sample proposals (placeholder [Customer Name]). Replace customer name, scope, and pricing for real use; not a legal contract.',
};

export const applicationServicesProposal: SolutionProposal = {
  id: 'app-services',
  slug: 'application-security',
  title: {
    vi: 'Application Services — Bảo mật & hiệu năng web',
    en: 'Application Services — Web security & performance',
  },
  subtitle: {
    vi: 'Web Security / WAAP — CDN, WAF, Bot, API Shield, DDoS',
    en: 'Web Security / WAAP — CDN, WAF, Bot, API Shield, DDoS',
  },
  trackSlug: 'application-services',
  tag: { vi: 'Application Security', en: 'Application Security' },
  executiveSummary: {
    vi: 'Cloudflare cung cấp mô hình kiểm tra single-pass từ DNS đến Analytics trên một nền tảng thống nhất — giảm service chaining, triển khai rule toàn cầu tức thì, và vận hành qua một dashboard. Giải pháp giúp doanh nghiệp phục vụ người dùng toàn cầu (kể cả Trung Quốc khi cần), giảm gánh nặng vận hành nhờ API, tự động hóa và tích hợp SIEM/SOAR/ITSM.',
    en: 'Cloudflare delivers a single-pass inspection model from DNS through Analytics on one unified platform — eliminating service chaining, enabling instant global rule propagation, and operating through one dashboard. The solution helps organizations serve users globally (including China where required), reduce operational burden through APIs, automation, and SIEM/SOAR/ITSM integrations.',
  },
  businessObjectives: [
    {
      vi: 'Tuân thủ yêu cầu bảo mật web/API trong RFP với khả năng triển khai đã được chứng minh',
      en: 'Meet web/API security RFP requirements with proven deployment capability',
    },
    {
      vi: 'Giảm gánh nặng vận hành: điều khiển bằng API, tự động hóa, visibility native trên mọi ứng dụng',
      en: 'Reduce operational burden: API-driven controls, automation, and native visibility across applications',
    },
    {
      vi: 'Tích hợp hệ thống hiện có (SIEM, SOAR, ITSM) để không gián đoạn team vận hành',
      en: 'Integrate existing systems (SIEM, SOAR, ITSM) without disrupting operations teams',
    },
    {
      vi: 'Hỗ trợ ưu tiên (ví dụ phản hồi 15 phút) và SOC-as-a-Service, tabletop 2 lần/năm',
      en: 'Prioritized support (e.g. 15-minute initial response) and SOC-as-a-Service, twice-yearly tabletop drills',
    },
  ],
  approachPillars: [
    {
      vi: 'Mạng thống nhất, mở rộng, resilient — single-pass inspection, một engine, một dashboard',
      en: 'Unified, scalable, resilient network — single-pass inspection, one engine, one dashboard',
    },
    {
      vi: 'Dễ dùng — tự động hóa cao, self-service, giảm phụ thuộc dịch vụ managed dài hạn',
      en: 'Ease of use — high automation, self-service, less reliance on long-term managed services',
    },
    {
      vi: 'Kiến trúc API-first — tích hợp công cụ và quy trình DevSecOps hiện có',
      en: 'API-first architecture — integrates with existing tools and DevSecOps workflows',
    },
  ],
  components: [
    {
      id: 'cdn-performance',
      title: { vi: 'Hiệu năng ứng dụng', en: 'Application performance' },
      summary: {
        vi: 'CDN toàn cầu, Argo Smart Routing, tối ưu nội dung web, Waiting Room, DNS, Load Balancing, Images, Stream.',
        en: 'Global CDN, Argo Smart Routing, web content optimization, Waiting Room, DNS, load balancing, Images, Stream.',
      },
      capabilities: [
        {
          vi: 'Tiered Cache và Argo để tối ưu đường đi và chi phí egress',
          en: 'Tiered Cache and Argo to optimize paths and egress cost',
        },
        {
          vi: 'Waiting Room cho traffic spike (bán lẻ, sự kiện)',
          en: 'Waiting Room for traffic spikes (retail, events)',
        },
        {
          vi: 'Load Balancing health-checked đa origin / đa DC',
          en: 'Health-checked load balancing across origins and data centers',
        },
      ],
      dashboardHint: 'Caching > Overview, Traffic > Load Balancing',
    },
    {
      id: 'network-ddos',
      title: { vi: 'Lớp mạng & DDoS', en: 'Network layer & DDoS' },
      summary: {
        vi: 'Kiểm soát lớp mạng và mitigated DDoS L3/L4/L7 tích hợp khi proxy qua Cloudflare.',
        en: 'Network-layer controls and integrated L3/L4/L7 DDoS mitigation when proxied through Cloudflare.',
      },
      capabilities: [
        {
          vi: 'Bảo vệ volumetric và application-layer trên cùng nền tảng',
          en: 'Volumetric and application-layer protection on the same platform',
        },
        {
          vi: 'Adaptive Profiling, Botnet Tracking — phòng thủ thích ứng',
          en: 'Adaptive Profiling, Botnet Tracking — adaptive defenses',
        },
      ],
      dashboardHint: 'Security > DDoS',
    },
    {
      id: 'waap',
      title: { vi: 'WAAP (WAF & API)', en: 'WAAP (WAF & API)' },
      summary: {
        vi: 'Web Application and API Protection: managed/custom WAF, Bot Management, Turnstile, Advanced Rate Limiting, API Shield, Page Shield, AI bot controls.',
        en: 'Web Application and API Protection: managed/custom WAF, Bot Management, Turnstile, Advanced Rate Limiting, API Shield, Page Shield, AI bot controls.',
      },
      capabilities: [
        {
          vi: 'WAF ML, Attack Score, OWASP managed rulesets, custom rules theo body/header',
          en: 'WAF ML, Attack Score, OWASP managed rulesets, custom rules on body/headers',
        },
        {
          vi: 'Bot Management (score 1–99), Turnstile cho form công khai',
          en: 'Bot Management (scores 1–99), Turnstile for public forms',
        },
        {
          vi: 'Advanced Rate Limiting: IP, cookie, JA3, JSON body — custom block response',
          en: 'Advanced Rate Limiting: IP, cookie, JA3, JSON body — custom block responses',
        },
        {
          vi: 'API Shield: discovery endpoint, schema, mTLS, khuyến nghị rate limit',
          en: 'API Shield: endpoint discovery, schema, mTLS, rate limit recommendations',
        },
        {
          vi: 'Page Shield — PCI DSS 6.4.3 / 11.6.1 script monitoring',
          en: 'Page Shield — PCI DSS 6.4.3 / 11.6.1 script monitoring',
        },
      ],
      dashboardHint: 'Security > WAF, Security > Bots, Security > API Shield',
    },
    {
      id: 'ssl-origin',
      title: { vi: 'Chứng chỉ & bảo vệ origin', en: 'Certificates & origin protection' },
      summary: {
        vi: 'Quản lý vòng đời TLS tại edge, Origin Certificate, chặn truy cập trực tiếp IP origin.',
        en: 'TLS lifecycle at the edge, Origin Certificates, block direct origin IP access.',
      },
      capabilities: [
        {
          vi: 'Full (strict) TLS user ↔ edge ↔ origin',
          en: 'Full (strict) TLS user ↔ edge ↔ origin',
        },
        {
          vi: 'Analytics, Logpush, Alerts cho SOC',
          en: 'Analytics, Logpush, and alerts for SOC workflows',
        },
      ],
      dashboardHint: 'SSL/TLS, Security > Events, Analytics & Logs',
    },
  ],
  differentiators: [
    {
      vi: 'Threat intelligence quy mô: hàng tỷ IP/ngày, hàng chục triệu RPS — học từ toàn mạng',
      en: 'Threat intelligence at scale: billions of IPs/day, tens of millions of RPS — learns from the whole network',
    },
    {
      vi: 'Kiến trúc hiện đại single-pass — triển khai rule đồng thời toàn cầu',
      en: 'Modern single-pass architecture — deploy rules globally in parallel',
    },
    {
      vi: 'Đổi mới liên tục: Adaptive Profiling, Botnet Tracking, AI bot protections',
      en: 'Continuous innovation: Adaptive Profiling, Botnet Tracking, AI bot protections',
    },
  ],
  implementation: [
    {
      vi: 'Workshop pre-deployment: hiểu topology, domain public-facing',
      en: 'Pre-deployment workshop: understand topology and public-facing domains',
    },
    {
      vi: 'Thiết kế & kế hoạch triển khai WAF theo yêu cầu đã chốt',
      en: 'Design and implementation plan for WAF per finalized requirements',
    },
    {
      vi: 'Migrate policy từ nền tảng cũ (ví dụ Akamai) sang Cloudflare',
      en: 'Migrate policies from legacy platform (e.g. Akamai) to Cloudflare',
    },
    {
      vi: 'Knowledge transfer và cadence dự án với team vận hành',
      en: 'Knowledge transfer and project cadence with operations teams',
    },
  ],
  support: [
    {
      vi: 'Guided onboarding và Customer Success — rút ngắn time-to-value',
      en: 'Guided onboarding and Customer Success — shorten time-to-value',
    },
    {
      vi: 'Premium Success: EBR, best practices, tối ưu security posture',
      en: 'Premium Success: executive business reviews, best practices, security posture optimization',
    },
    {
      vi: 'SOC-as-a-Service: monitoring, alerting thông minh, tabletop drills',
      en: 'SOC-as-a-Service: monitoring, high-fidelity alerting, tabletop drills',
    },
  ],
  hubLinks: [
    { href: '/content-delivery', label: { vi: 'Tối ưu content delivery', en: 'Content delivery guide' } },
    { href: '/demo-guides#application-security', label: { vi: 'Dashboard overview', en: 'Dashboard overview' } },
    { href: '/plans', label: { vi: 'So sánh gói Business / Enterprise', en: 'Business / Enterprise plan comparison' } },
    { href: '/tracks/application-services', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
  ],
};

export const cloudflareOneSaseProposal: SolutionProposal = {
  id: 'cloudflare-one-sase',
  slug: 'cloudflare-one-sase',
  title: {
    vi: 'Cloudflare One — SASE & Zero Trust',
    en: 'Cloudflare One — SASE & Zero Trust',
  },
  subtitle: {
    vi: 'ZTNA, SWG, Access, Tunnel, CASB, DLP, RBI',
    en: 'ZTNA, SWG, Access, Tunnel, CASB, DLP, RBI',
  },
  trackSlug: 'cloudflare-one',
  tag: { vi: 'SASE', en: 'SASE' },
  executiveSummary: {
    vi: 'Cloudflare One là NaaS Zero Trust trên kiến trúc SASE — thay thế tập hợp appliance và WAN bằng một mạng cloud: bảo mật, hiệu năng và kiểm soát qua một giao diện. Cùng nền tảng với WAF/CDN/DDoS nên gom vendor, threat intelligence thời gian thực và policy nhất quán cho user di động, SaaS và hybrid cloud.',
    en: 'Cloudflare One is Zero Trust NaaS on SASE architecture — replacing appliances and WAN sprawl with one cloud network: security, performance, and control through a single interface. Built on the same platform as WAF/CDN/DDoS, it consolidates vendors, delivers real-time threat intelligence, and enforces consistent policy for mobile users, SaaS, and hybrid cloud.',
  },
  businessObjectives: [
    {
      vi: 'Migrate chức năng mạng on-prem sang cloud theo chiến lược SASE, policy thống nhất tại edge',
      en: 'Migrate on-prem networking to cloud per SASE strategy with consistent edge policy',
    },
    {
      vi: 'Single-pass encrypted inspection — Zero Trust, visibility dữ liệu nhạy cảm, threat awareness',
      en: 'Single-pass encrypted inspection — Zero Trust, sensitive-data visibility, threat awareness',
    },
    {
      vi: 'Gom dịch vụ, giảm độ phức tạp, trải nghiệm trong suốt cho end-user',
      en: 'Consolidate services, reduce complexity, transparent end-user experience',
    },
    {
      vi: 'Dịch vụ toàn cầu, SLA hợp đồng, scale theo chi nhánh / cửa hàng',
      en: 'Global service, contractual SLAs, scale with branches and stores',
    },
  ],
  approachPillars: [
    {
      vi: 'Giảm excessive trust — policy theo identity/context, RBI cho web không tin cậy',
      en: 'Reduce excessive trust — identity/context policies, RBI for untrusted web',
    },
    {
      vi: 'Loại bỏ phức tạp — ít VPN và point product, một bộ control cho mọi traffic',
      en: 'Eliminate complexity — fewer VPNs and point products, one control set for all traffic',
    },
    {
      vi: 'Khôi phục visibility — log DNS, HTTP, login, in-app; audit trail điều tra',
      en: 'Restore visibility — DNS, HTTP, login, in-app logs; investigation audit trail',
    },
  ],
  components: [
    {
      id: 'ztna-access',
      title: { vi: 'ZTNA — Cloudflare Access', en: 'ZTNA — Cloudflare Access' },
      summary: {
        vi: 'Thay VPN castle-and-moat: default-deny theo IdP, bảo vệ app self-hosted, SaaS, SSH/RDP, IP nội bộ.',
        en: 'Replace VPN castle-and-moat: default-deny via IdP, protect self-hosted apps, SaaS, SSH/RDP, internal IPs.',
      },
      capabilities: [
        {
          vi: 'Tích hợp Okta / Azure AD / Google Workspace + MFA',
          en: 'Integrate Okta / Azure AD / Google Workspace + MFA',
        },
        {
          vi: 'App Launcher: teamname.cloudflareaccess.com',
          en: 'App Launcher: teamname.cloudflareaccess.com',
        },
        {
          vi: 'Tunnel (cloudflared) outbound — không mở port inbound',
          en: 'Tunnel (cloudflared) outbound — no inbound firewall ports',
        },
      ],
      dashboardHint: 'Zero Trust > Access > Applications, Networks > Tunnels',
    },
    {
      id: 'swg-gateway',
      title: { vi: 'SWG — Cloudflare Gateway', en: 'SWG — Cloudflare Gateway' },
      summary: {
        vi: 'Kiểm soát DNS/HTTP/network cho mọi user qua WARP; malware, category, DLP inline.',
        en: 'DNS/HTTP/network control for all users via WARP; malware, categories, inline DLP.',
      },
      capabilities: [
        {
          vi: 'Firewall policies DNS & HTTP',
          en: 'DNS and HTTP firewall policies',
        },
        {
          vi: 'Remote Browser Isolation (RBI)',
          en: 'Remote Browser Isolation (RBI)',
        },
        {
          vi: 'DLP profiles cho upload/download',
          en: 'DLP profiles for uploads and downloads',
        },
      ],
      dashboardHint: 'Zero Trust > Gateway > Firewall policies',
    },
    {
      id: 'casb-dex',
      title: { vi: 'CASB & DEX', en: 'CASB & DEX' },
      summary: {
        vi: 'CASB: posture SaaS (M365, Google). DEX: giám sát trải nghiệm digital workforce.',
        en: 'CASB: SaaS posture (M365, Google). DEX: digital experience monitoring for workforce.',
      },
      capabilities: [
        {
          vi: 'Phát hiện shadow IT và misconfiguration',
          en: 'Detect shadow IT and misconfiguration',
        },
        {
          vi: 'Kết hợp data-at-rest (CASB) + inline DLP (Gateway)',
          en: 'Combine data-at-rest (CASB) with inline DLP (Gateway)',
        },
      ],
      dashboardHint: 'Zero Trust > CASB',
    },
    {
      id: 'network-warp',
      title: { vi: 'WARP & Network Services', en: 'WARP & Network Services' },
      summary: {
        vi: 'WARP client, device enrollment, Cloudflare WAN (trước đây là Magic WAN) / on-ramp (theo phạm vi proposal), threat intelligence chung.',
        en: 'WARP client, device enrollment, Cloudflare WAN (formerly Magic WAN) / on-ramp (per proposal scope), shared threat intelligence.',
      },
      capabilities: [
        {
          vi: 'Settings: team domain, authentication, device profiles',
          en: 'Settings: team domain, authentication, device profiles',
        },
        {
          vi: 'Journey to SASE: phase VPN offload → ZTNA → SWG → CASB',
          en: 'Journey to SASE: VPN offload → ZTNA → SWG → CASB phases',
        },
      ],
      dashboardHint: 'Zero Trust > Settings > WARP Client',
    },
  ],
  differentiators: [
    {
      vi: 'Một nền tảng SASE + Application Security — không silo policy',
      en: 'One platform for SASE and Application Security — no policy silos',
    },
    {
      vi: 'Mạng anycast nhanh hơn nhiều VPN truyền thống',
      en: 'Anycast network faster than traditional VPN backhaul',
    },
    {
      vi: 'Roadmap “Journey to SASE” 5 phase — consolidate orange, Zero Trust blue',
      en: 'Five-phase “Journey to SASE” roadmap — consolidate (orange), Zero Trust (blue)',
    },
  ],
  implementation: [
    {
      vi: 'Phase 1: Offload VPN cho nhóm pilot (contractor, dev, M&A)',
      en: 'Phase 1: Offload VPN for pilot groups (contractors, dev, M&A)',
    },
    {
      vi: 'Phase 2–3: Access + Gateway cho remote/hybrid workforce',
      en: 'Phases 2–3: Access + Gateway for remote/hybrid workforce',
    },
    {
      vi: 'PoC mẫu và tích hợp SIEM (theo proposal)',
      en: 'Sample PoC and SIEM integrations (per proposal)',
    },
  ],
  support: [
    {
      vi: 'Bảng Support Services theo tier Enterprise — 15 phút initial response (nếu trong hợp đồng)',
      en: 'Support Services table per Enterprise tier — 15-minute initial response (if contracted)',
    },
    {
      vi: 'Customer Success điều phối roadmap SASE transformation',
      en: 'Customer Success orchestrates SASE transformation roadmap',
    },
  ],
  hubLinks: [
    { href: '/demo-guides#cloudflare-one', label: { vi: 'Dashboard overview Zero Trust', en: 'Zero Trust dashboard overview' } },
    { href: '/use-cases/replace-vpn', label: { vi: 'Tình huống thay VPN', en: 'Replace VPN use case' } },
    { href: '/tracks/cloudflare-one', label: { vi: 'Lộ trình Cloudflare One', en: 'Cloudflare One track' } },
  ],
};

export const emailSecurityProposal: SolutionProposal = {
  id: 'email-security',
  slug: 'email-security',
  title: {
    vi: 'Email Security',
    en: 'Email Security',
  },
  subtitle: {
    vi: 'Chống phishing & BEC — mở rộng Zero Trust cho email',
    en: 'Anti-phishing & BEC — extend Zero Trust to email',
  },
  trackSlug: 'cloudflare-one',
  tag: { vi: 'Email Security', en: 'Email Security' },
  executiveSummary: {
    vi: 'Cloudflare Email Security là dịch vụ cloud-native chặn phishing — nguyên nhân ~90% breach dẫn tới thiệt hại tài chính. Kết hợp năng lực native của Microsoft/Google với phòng thủ BEC và phishing chủ động: mục tiêu 99.997% detection efficacy, UI thống nhất cho analyst, giảm chi phí so với SEG legacy.',
    en: 'Cloudflare Email Security is a cloud-native service that stops phishing — the root cause of roughly 90% of breaches leading to financial loss. It complements Microsoft/Google native capabilities with proactive BEC and phishing defense: targeting 99.997% detection efficacy, a unified analyst UI, and lower cost than legacy SEGs.',
  },
  businessObjectives: [
    {
      vi: 'Đạt hiệu quả phát hiện cao (99.997% efficacy trong proposal mẫu)',
      en: 'Achieve high detection efficacy (99.997% in sample proposal)',
    },
    {
      vi: 'Tự động hóa — tiết kiệm giờ analyst, tích hợp M365 / Google workflow',
      en: 'Automation — save analyst hours, integrate with M365 / Google workflows',
    },
    {
      vi: 'Giá trị tốt hơn — thay SEG phức tạp, giảm tuning và hardware',
      en: 'Greater value — replace complex SEGs, reduce tuning and hardware',
    },
    {
      vi: 'Mở rộng Zero Trust sang kênh email — kênh SaaS bị tấn công nhiều nhất',
      en: 'Extend Zero Trust to email — the most attacked SaaS channel',
    },
  ],
  approachPillars: [
    {
      vi: 'Assume breach — hunt infrastructure attacker trước khi email vào inbox',
      en: 'Assume breach — hunt attacker infrastructure before mail hits the inbox',
    },
    {
      vi: 'Never trust — không tin chỉ vì SPF/DKIM pass hay domain uy tín',
      en: 'Never trust — do not trust based on SPF/DKIM alone or reputable domains',
    },
    {
      vi: 'Always verify — sentiment, trust graph, thread analysis cho BEC',
      en: 'Always verify — sentiment, trust graphs, thread analysis for BEC',
    },
  ],
  components: [
    {
      id: 'preemptive-phish',
      title: { vi: 'Chặn phishing chủ động', en: 'Preemptive phishing defense' },
      summary: {
        vi: 'Phish indexing quy mô Internet; chặn chiến dịch trước inbox; phát hiện BEC volume thấp.',
        en: 'Internet-scale phish indexing; block campaigns pre-inbox; detect low-volume BEC.',
      },
      capabilities: [
        {
          vi: 'Lookalike / proximity domain và compromised account visibility',
          en: 'Lookalike / proximity domains and compromised account visibility',
        },
        {
          vi: 'Email Link Isolation — neutralize link đáng ngờ',
          en: 'Email Link Isolation — neutralize suspicious links',
        },
      ],
    },
    {
      id: 'bec',
      title: { vi: 'Business Email Compromise', en: 'Business Email Compromise' },
      summary: {
        vi: 'Phân tích intent, tone, quan hệ sender; chặn wire fraud / supplier takeover.',
        en: 'Intent, tone, sender relationship analysis; block wire fraud / supplier takeover.',
      },
      capabilities: [
        {
          vi: 'Không cần malware signature — BEC Type 1/2/3 patterns',
          en: 'No malware signature required — BEC Type 1/2/3 patterns',
        },
        {
          vi: 'Auto block, quarantine, escalate thông tin tài chính giả mạo',
          en: 'Auto block, quarantine, escalate fraudulent financial messages',
        },
      ],
    },
    {
      id: 'seg-replacement',
      title: { vi: 'Thay / bổ sung SEG & M365', en: 'Replace or augment SEG & M365' },
      summary: {
        vi: 'Vượt SEG và native M365/Google cho targeted phishing; không phụ thuộc volume signature.',
        en: 'Go beyond SEGs and native M365/Google for targeted phishing; not volume-signature dependent.',
      },
      capabilities: [
        {
          vi: 'BOM và integration out-of-the-box (theo proposal)',
          en: 'BOM and out-of-the-box integrations (per proposal)',
        },
        {
          vi: 'Một UI cho hoạt động analyst thay nhiều console',
          en: 'One UI for analyst workflows instead of many consoles',
        },
      ],
      dashboardHint: 'Zero Trust > Email Security (product area)',
    },
  ],
  differentiators: [
    {
      vi: 'Preemptive vs reactive signature — phù hợp targeted phishing',
      en: 'Preemptive vs reactive signatures — suited for targeted phishing',
    },
    {
      vi: 'Phần của Cloudflare One — policy và logging hợp nhất',
      en: 'Part of Cloudflare One — unified policy and logging story',
    },
    {
      vi: 'Giảm SEG hardware và tuning vô hạn',
      en: 'Reduce SEG hardware and endless tuning',
    },
  ],
  implementation: [
    {
      vi: 'Tích hợp tenant M365 hoặc Google Workspace',
      en: 'Integrate M365 or Google Workspace tenant',
    },
    {
      vi: 'Pilot mailbox / phòng ban trước rollout toàn tổ chức',
      en: 'Pilot mailboxes or departments before org-wide rollout',
    },
    {
      vi: 'Chạy song song SEG cũ trong giai đoạn chuyển đổi (nếu cần)',
      en: 'Run parallel with legacy SEG during transition if needed',
    },
  ],
  support: [
    {
      vi: 'Support Services theo bảng Cloudflare Enterprise',
      en: 'Support Services per Cloudflare Enterprise table',
    },
    {
      vi: 'Tham chiếu khách hàng đã triển khai Email Security (proposal mẫu)',
      en: 'Customer references for Email Security deployments (sample proposal)',
    },
  ],
  hubLinks: [
    { href: '/tracks/cloudflare-one', label: { vi: 'Lộ trình Cloudflare One', en: 'Cloudflare One track' } },
    { href: '/demo-guides#cloudflare-one', label: { vi: 'Dashboard overview ZT', en: 'ZT dashboard overview' } },
    { href: 'https://developers.cloudflare.com/cloudflare-one/email-security/', label: { vi: 'Docs Email Security', en: 'Email Security docs' } },
  ],
};

export const allSolutionProposals: SolutionProposal[] = [
  applicationServicesProposal,
  cloudflareOneSaseProposal,
  emailSecurityProposal,
];

export function getSolutionBySlug(slug: string): SolutionProposal | undefined {
  return allSolutionProposals.find((s) => s.slug === slug);
}
