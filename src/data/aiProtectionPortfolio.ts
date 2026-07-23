import type { LocalizedString } from '../i18n/types';

export type AiProtectionPillar = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  controls: LocalizedString[];
  risks: LocalizedString[];
  productSlugs: string[];
  docsHref: string;
};

export const aiProtectionIntro: LocalizedString = {
  vi: 'Cheatsheet này map rủi ro AI vào các lớp kiểm soát của Cloudflare One, Developer Platform và Application Security. Đây là defense-in-depth, không phải một sản phẩm đơn lẻ hay cam kết loại bỏ mọi rủi ro AI.',
  en: 'This cheatsheet maps AI risks to Cloudflare One, Developer Platform, and Application Security controls. It is defense in depth, not a single product or a guarantee that every AI risk is eliminated.',
};

export const aiProtectionMentalModel: LocalizedString = {
  vi: 'Users & devices → Zero Trust controls → sanctioned AI/SaaS → AI Gateway / application controls → model providers. Thi hành policy ở nhiều lớp: identity, web egress, SaaS posture, prompt/response, API và bot traffic.',
  en: 'Users & devices → Zero Trust controls → sanctioned AI/SaaS → AI Gateway / application controls → model providers. Enforce policy at multiple layers: identity, web egress, SaaS posture, prompt/response, API, and bot traffic.',
};

export const aiProtectionPillars: AiProtectionPillar[] = [
  {
    id: 'casb',
    title: { vi: 'CASB: AI security posture & Shadow AI', en: 'CASB: AI security posture and Shadow AI' },
    summary: { vi: 'Dùng CASB để phát hiện SaaS/AI chưa được phê duyệt, kiểm tra posture và tìm rủi ro về user hoặc access token. Kết hợp DLP để phát hiện sensitive content.', en: 'Use CASB to discover unsanctioned SaaS/AI, assess posture, and find user or access-token risks. Pair it with DLP for sensitive-content detection.' },
    controls: [{ vi: 'Inventory app, Shadow AI và security findings', en: 'Inventory applications, Shadow AI, and security findings' }, { vi: 'Scan misconfiguration, sensitive-data exposure và compliance posture', en: 'Scan misconfiguration, sensitive-data exposure, and compliance posture' }, { vi: 'Review activity/logs để hỗ trợ điều tra sau sự cố', en: 'Review activity and logs to support incident investigation' }],
    risks: [{ vi: 'Data loss/misuse qua unsanctioned AI', en: 'Data loss or misuse through unsanctioned AI' }, { vi: 'Key/token hygiene yếu và compliance gaps', en: 'Weak key/token hygiene and compliance gaps' }],
    productSlugs: ['casb', 'dlp'],
    docsHref: 'https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/saas-apps/',
  },
  {
    id: 'swg-rbi',
    title: { vi: 'SWG & RBI: kiểm soát AI trên web', en: 'SWG and RBI: control AI use on the web' },
    summary: { vi: 'Secure Web Gateway tạo visibility về AI tools trên traffic web và có thể steer user từ dịch vụ không được phê duyệt sang sanctioned alternative. Remote Browser Isolation giảm rủi ro upload file vào AI web app.', en: 'Secure Web Gateway provides visibility into AI tools in web traffic and can steer users from unsanctioned services to approved alternatives. Remote Browser Isolation reduces the risk of file uploads to AI web apps.' },
    controls: [{ vi: 'Discover/inventory AI destinations qua DNS và HTTP policy', en: 'Discover and inventory AI destinations through DNS and HTTP policy' }, { vi: 'Block, allow hoặc redirect theo policy và identity', en: 'Block, allow, or redirect by policy and identity' }, { vi: 'Dùng RBI cho browsing/upload risk cao', en: 'Use RBI for high-risk browsing and uploads' }],
    risks: [{ vi: 'Thiếu visibility để quản trị AI adoption', en: 'Missing visibility for AI adoption governance' }, { vi: 'Data loss từ Shadow AI và file upload', en: 'Data loss from Shadow AI and file uploads' }],
    productSlugs: ['swg', 'gateway', 'browser-isolation', 'warp'],
    docsHref: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/',
  },
  {
    id: 'ai-gateway',
    title: { vi: 'AI Gateway: routing, guardrails & audit', en: 'AI Gateway: routing, guardrails, and audit' },
    summary: { vi: 'Đặt AI Gateway giữa application và provider để route model động, quan sát request, cache khi phù hợp và áp dụng guardrails. Gateway không thay thế application authorization hay WAF.', en: 'Place AI Gateway between an application and providers for dynamic model routing, request visibility, appropriate caching, and guardrails. The gateway does not replace application authorization or a WAF.' },
    controls: [{ vi: 'Dynamic routing/fallback để giảm failed request do provider capacity', en: 'Dynamic routing and fallback to reduce failed requests from provider capacity' }, { vi: 'Logs, analytics và audit metadata; tránh log sensitive prompt không cần thiết', en: 'Logs, analytics, and audit metadata; avoid logging sensitive prompts unnecessarily' }, { vi: 'Guardrails/DLP policy theo cấu hình và plan', en: 'Guardrails and DLP policy subject to configuration and plan' }],
    risks: [{ vi: 'Service exhaustion và LLM request failure', en: 'Service exhaustion and failed LLM requests' }, { vi: 'Data misuse và thiếu audit visibility', en: 'Data misuse and missing audit visibility' }],
    productSlugs: ['ai-gateway'],
    docsHref: 'https://developers.cloudflare.com/ai-gateway/',
  },
  {
    id: 'app-security',
    title: { vi: 'Application Security: WAF, Firewall for AI & Bots', en: 'Application Security: WAF, Firewall for AI, and bots' },
    summary: { vi: 'Bảo vệ AI application endpoint khỏi malicious automation và prompt/response risk. Firewall for AI là một lớp WAF; Bot Management và AI Crawl Control bảo vệ content/public endpoint, theo plan.', en: 'Protect AI application endpoints from malicious automation and prompt/response risk. Firewall for AI is a WAF layer; Bot Management and AI Crawl Control protect content and public endpoints, subject to plan.' },
    controls: [{ vi: 'Detect/block/moderate unsafe prompt, prompt injection và sensitive response theo policy', en: 'Detect, block, or moderate unsafe prompts, prompt injection, and sensitive responses by policy' }, { vi: 'Bot Analytics, AI Labyrinth và controls cho verified/unverified AI bots', en: 'Bot Analytics, AI Labyrinth, and controls for verified or unverified AI bots' }, { vi: 'Rate limit public AI endpoint và verify user input server-side', en: 'Rate-limit public AI endpoints and verify user input server-side' }],
    risks: [{ vi: 'PII leak, harmful prompt và prompt injection', en: 'PII leaks, harmful prompts, and prompt injection' }, { vi: 'Unauthorized AI crawling, bot abuse và export cost', en: 'Unauthorized AI crawling, bot abuse, and export cost' }],
    productSlugs: ['waf', 'bots', 'rate-limiting', 'turnstile'],
    docsHref: 'https://developers.cloudflare.com/waf/ai/',
  },
  {
    id: 'radar-sase',
    title: { vi: 'Radar & Cloudflare One (SASE) foundation', en: 'Radar and Cloudflare One (SASE) foundation' },
    summary: { vi: 'Radar là threat/intelligence reference cho AI crawler awareness, không phải enforcement control. Cloudflare One kết hợp Access (ZTNA), Gateway/SWG, Tunnel, WARP, DLP, RBI và CASB để áp dụng policy theo identity, device và traffic.', en: 'Radar is a threat-intelligence reference for AI crawler awareness, not an enforcement control. Cloudflare One combines Access (ZTNA), Gateway/SWG, Tunnel, WARP, DLP, RBI, and CASB to apply policy by identity, device, and traffic.' },
    controls: [{ vi: 'Dùng Radar để hiểu AI crawler trends và security context', en: 'Use Radar to understand AI crawler trends and security context' }, { vi: 'Bắt đầu với Access/identity, sau đó rollout SWG, DLP và CASB theo risk', en: 'Start with Access and identity, then roll out SWG, DLP, and CASB according to risk' }],
    risks: [{ vi: 'Thiếu situation awareness và policy foundation', en: 'Missing situation awareness and policy foundation' }, { vi: 'Rollout AI control không nhất quán', en: 'Inconsistent rollout of AI controls' }],
    productSlugs: ['access', 'ztna', 'tunnel', 'warp', 'dlp', 'casb'],
    docsHref: 'https://radar.cloudflare.com/',
  },
];

export const aiProtectionChecklist: LocalizedString[] = [
  { vi: 'Inventory sanctioned/unsanctioned AI tools và data classification', en: 'Inventory sanctioned and unsanctioned AI tools and data classifications' },
  { vi: 'Áp identity + least privilege trước khi expose AI app/tool', en: 'Apply identity and least privilege before exposing an AI app or tool' },
  { vi: 'Chọn egress policy: allow, block hoặc steer AI destinations', en: 'Choose egress policy: allow, block, or steer AI destinations' },
  { vi: 'Giữ model/tool credentials trong server-side secrets', en: 'Keep model and tool credentials in server-side secrets' },
  { vi: 'Log/audit có mục đích; review retention và sensitive data', en: 'Log and audit with purpose; review retention and sensitive data' },
];
