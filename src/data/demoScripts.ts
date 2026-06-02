import type { LocalizedString } from '../i18n/types';

export type DemoStep = {
  title: LocalizedString;
  detail: LocalizedString;
  /** Dashboard navigation path (English labels match dashboard UI) */
  dashboardPath?: string;
};

export type DemoVignette = {
  id: string;
  track: 'application-services' | 'cloudflare-one' | 'platform';
  title: LocalizedString;
  personas: string[];
  valueDriver: LocalizedString;
  opening: LocalizedString;
  whenToUse: LocalizedString;
  dashboardPaths: string[];
  steps: DemoStep[];
  demoTips: LocalizedString[];
  keyTakeaways: LocalizedString[];
  docsLinks: { label: string; href: string }[];
};

export const demoScriptsIntro: LocalizedString = {
  vi: 'Script demo thực chiến — cấu hình theo nhu cầu khách hàng, điều hướng dashboard Cloudflare thật. Nội dung tổng hợp từ tài liệu SE (Advanced Security, Zero Trust, Core Platform).',
  en: 'Field demo scripts — configure to customer needs and walk through the real Cloudflare dashboard. Synthesized from SE playbooks (Advanced Security, Zero Trust, Core Platform).',
};

export const demoScriptsDisclaimer: LocalizedString = {
  vi: 'Tài liệu nội bộ phục vụ học tập và workshop — không thay tài liệu chính thức. Tính năng và menu dashboard có thể đổi; luôn đối chiếu developers.cloudflare.com.',
  en: 'Internal-style learning material for workshops — not a replacement for official docs. Features and dashboard labels may change; always cross-check developers.cloudflare.com.',
};

/** Core platform — discovery & request flow (shared before security / ZT demos) */
export const platformDemoVignettes: DemoVignette[] = [
  {
    id: 'core-discovery',
    track: 'platform',
    title: { vi: 'Discovery & pitch nền tảng', en: 'Platform discovery & pitch' },
    personas: ['IT Manager', 'Dir of Engineering', 'CISO'],
    valueDriver: {
      vi: 'Reverse proxy toàn cầu — bảo mật & hiệu năng gần user, một dashboard.',
      en: 'Global reverse proxy — security and performance near users, single dashboard.',
    },
    opening: {
      vi: 'Cloudflare là reverse proxy anycast giữa end-user và origin: request được xử lý tại PoP gần nhất (~330+ thành phố), rồi mới về origin nếu cần.',
      en: 'Cloudflare is an anycast reverse proxy between users and origin: requests are handled at the nearest PoP (~330+ cities), then reach origin when needed.',
    },
    whenToUse: {
      vi: 'Đầu buổi demo — trước khi vào Security hoặc Zero Trust; khi khách hỏi “Cloudflare khác CDN thường thế nào?”.',
      en: 'Start of any demo — before Security or Zero Trust; when the customer asks how Cloudflare differs from a basic CDN.',
    },
    dashboardPaths: ['Account Home', 'Overview (zone)', 'Analytics > Traffic'],
    steps: [
      {
        title: { vi: 'Câu hỏi discovery', en: 'Discovery questions' },
        detail: {
          vi: 'Domain/zone nào? Origin ở đâu (cloud/on-prem)? Pain: DDoS, bot, API abuse, VPN, compliance? Ai vận hành DNS hôm nay?',
          en: 'Which zones? Where is origin (cloud/on-prem)? Pain: DDoS, bots, API abuse, VPN, compliance? Who runs DNS today?',
        },
      },
      {
        title: { vi: 'Vòng đời request', en: 'Life of a request' },
        detail: {
          vi: 'Client → PoP gần nhất → WAF/custom rule/bot/rate limit → cache hit hoặc forward origin → response. Nhấn mạnh quyết định tại edge trước origin.',
          en: 'Client → nearest PoP → WAF/custom rule/bot/rate limit → cache hit or forward to origin → response. Emphasize edge decisions before origin.',
        },
        dashboardPath: 'Analytics > Security / Traffic',
      },
      {
        title: { vi: 'DNS & proxy (orange cloud)', en: 'DNS & proxy (orange cloud)' },
        detail: {
          vi: 'Cloudflare provision qua DNS: response proxied trỏ về Cloudflare. Không proxy = không áp dụng WAF/cache edge đầy đủ.',
          en: 'Provisioned via DNS: proxied records point to Cloudflare. Without proxy, full edge WAF/cache does not apply.',
        },
        dashboardPath: 'DNS > Records',
      },
      {
        title: { vi: 'SSL/TLS một câu', en: 'SSL/TLS in one minute' },
        detail: {
          vi: 'Edge cert do Cloudflare quản lý hoặc dùng cert origin; Full (strict) khi origin có cert hợp lệ. Origin Certificate tạo từ dashboard nếu cần.',
          en: 'Edge certs managed by Cloudflare or use origin certs; Full (strict) when origin has valid certs. Origin Certificates from dashboard when needed.',
        },
        dashboardPath: 'SSL/TLS > Overview',
      },
    ],
    demoTips: [
      {
        vi: 'Vẽ sơ đồ request flow trước khi click dashboard — khách hàng SME thường nhớ hình hơn menu.',
        en: 'Draw the request flow before clicking the dashboard — SME buyers often remember diagrams over menus.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Một zone = một bộ policy; Account Home gom nhiều zone, Audit log ghi mọi thay đổi API/dashboard.',
        en: 'One zone = one policy set; Account Home groups zones; Audit log records all API/dashboard changes.',
      },
    ],
    docsLinks: [
      { label: 'How Cloudflare works', href: 'https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/' },
      { label: 'Network map', href: 'https://www.cloudflare.com/network/' },
    ],
  },
  {
    id: 'core-security-route',
    track: 'platform',
    title: { vi: 'Dashboard: Security overview', en: 'Dashboard: Security overview' },
    personas: ['Security Engineer', 'CISO'],
    valueDriver: {
      vi: 'Một nơi xem events, WAF, bot, rate limit — phù hợp showcase Application Security.',
      en: 'One place for events, WAF, bots, rate limits — ideal Application Security showcase.',
    },
    opening: {
      vi: 'Sau khi onboard DNS/SSL, đi theo “Security route”: Events → WAF → Bots → Rate limiting.',
      en: 'After DNS/SSL onboarding, follow the “Security route”: Events → WAF → Bots → Rate limiting.',
    },
    whenToUse: {
      vi: 'Chuyển tiếp sang demo Advanced Security; giải thích nơi SOC sẽ làm việc hàng ngày.',
      en: 'Bridge into Advanced Security demo; show where the SOC works day to day.',
    },
    dashboardPaths: ['Security > Events', 'Security > WAF', 'Security > Bots'],
    steps: [
      {
        title: { vi: 'Security Events / Activity log', en: 'Security Events / Activity log' },
        detail: {
          vi: 'Mở event mẫu: rule nào match, action, country, bot score. Chuẩn bị 1–2 event thật (hoặc simulate) trước demo.',
          en: 'Open a sample event: matched rule, action, country, bot score. Prepare 1–2 real (or simulated) events before the demo.',
        },
        dashboardPath: 'Security > Events',
      },
      {
        title: { vi: 'WAF managed & custom rules', en: 'WAF managed & custom rules' },
        detail: {
          vi: 'Managed rulesets (OWASP, CF managed) + Custom rules / Firewall rules. Nói thứ tự: specific → general.',
          en: 'Managed rulesets (OWASP, CF managed) + Custom rules / Firewall rules. Mention ordering: specific → general.',
        },
        dashboardPath: 'Security > WAF',
      },
      {
        title: { vi: 'Account vs Zone scope', en: 'Account vs Zone scope' },
        detail: {
          vi: 'Zone WAF cho từng domain; Account-level WAF (Enterprise) áp policy đồng nhất nhiều zone — quan trọng cho SME đa brand.',
          en: 'Zone WAF per domain; Account-level WAF (Enterprise) applies consistent policy across zones — key for multi-brand SMEs.',
        },
        dashboardPath: 'Application Security > WAF (account)',
      },
    ],
    demoTips: [
      {
        vi: 'Đừng bật Block ngay — show Log/Simulate trước nếu khách lo false positive.',
        en: 'Do not jump to Block — show Log/Simulate first if the customer fears false positives.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Dashboard là “single pane of glass” cho security + performance (Analytics, Cache ở route khác).',
        en: 'The dashboard is the single pane of glass for security plus performance (Analytics, Cache on other routes).',
      },
    ],
    docsLinks: [{ label: 'WAF', href: 'https://developers.cloudflare.com/waf/' }],
  },
  {
    id: 'core-performance-route',
    track: 'platform',
    title: { vi: 'Dashboard: Caching & Speed', en: 'Dashboard: Caching & Speed' },
    personas: ['Web Ops', 'Marketing', 'CTO'],
    valueDriver: {
      vi: 'Giảm latency và origin load — showcase sau Security route.',
      en: 'Lower latency and origin load — showcase after the Security route.',
    },
    opening: {
      vi: 'Application route: Caching overview → Cache Rules → Speed optimizations → (tuỳ chọn) Argo / Images.',
      en: 'Application route: Caching overview → Cache Rules → Speed optimizations → (optional) Argo / Images.',
    },
    whenToUse: {
      vi: 'Khách hỏi “làm sao tăng tốc website” sau khi đã proxy domain.',
      en: 'Customer asks how to speed up the website after the domain is proxied.',
    },
    dashboardPaths: ['Caching > Overview', 'Caching > Cache Rules', 'Speed > Optimization'],
    steps: [
      {
        title: { vi: 'Cache Analytics', en: 'Cache Analytics' },
        detail: {
          vi: 'Hit ratio, bandwidth saved, top colos — so sánh trước/sau rule.',
          en: 'Hit ratio, bandwidth saved, top colos — compare before/after rules.',
        },
        dashboardPath: 'Caching > Analytics',
      },
      {
        title: { vi: 'Demo Cache Rule', en: 'Demo Cache Rule' },
        detail: {
          vi: 'Bypass /admin; cache /assets/* với TTL; show purge on deploy.',
          en: 'Bypass /admin; cache /assets/* with TTL; show purge on deploy.',
        },
        dashboardPath: 'Caching > Cache Rules > Create rule',
      },
      {
        title: { vi: 'Speed tab', en: 'Speed tab' },
        detail: {
          vi: 'Brotli, Early Hints, minify — link tới /content-delivery trong hub.',
          en: 'Brotli, Early Hints, minify — link to /content-delivery in this hub.',
        },
        dashboardPath: 'Speed > Optimization',
      },
    ],
    demoTips: [
      {
        vi: 'Chuẩn bị screenshot hit ratio tăng sau 1 tuần pilot.',
        en: 'Prepare a screenshot of improved hit ratio after a one-week pilot.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Performance và Security cùng orange cloud — một dashboard.',
        en: 'Performance and Security share the orange cloud — one dashboard.',
      },
    ],
    docsLinks: [{ label: 'Cache', href: 'https://developers.cloudflare.com/cache/' }],
  },
];

/** Advanced Security demo vignettes → Application Services track */
export const applicationSecurityDemos: DemoVignette[] = [
  {
    id: 'payload-inspection',
    track: 'application-services',
    title: { vi: 'Payload inspection (body)', en: 'Payload inspection (body)' },
    personas: ['CISO', 'AppSec', 'SRE'],
    valueDriver: {
      vi: 'Chặn/cho phép theo nội dung POST — không chỉ URL hay IP.',
      en: 'Block/allow based on POST body content — not only URL or IP.',
    },
    opening: {
      vi: 'Firewall rules có thể inspect body (form, JSON) — cùng một capability: payload / POST body / request body matching.',
      en: 'Firewall rules can inspect the body (forms, JSON) — same capability: payload / POST body / request body matching.',
    },
    whenToUse: {
      vi: 'Khách cần rule theo field form (SĐT, mã đơn), loại file upload, hoặc JSON key trong API.',
      en: 'Customer needs rules on form fields (phone, order id), upload types, or JSON keys in APIs.',
    },
    dashboardPaths: ['Security > WAF > Custom rules', 'Security > Events'],
    steps: [
      {
        title: { vi: 'Ví dụ: chặn SĐT lạm dụng', en: 'Example: block abusive phone numbers' },
        detail: {
          vi: 'Expression mẫu: any(http.request.body.form["billing_phone"][*] == "...") — block account spam cùng một số.',
          en: 'Sample: any(http.request.body.form["billing_phone"][*] == "...") — block repeat signup spam with one number.',
        },
        dashboardPath: 'Security > WAF > Custom rules > Create rule',
      },
      {
        title: { vi: 'Giới hạn loại file upload', en: 'Restrict upload file types' },
        detail: {
          vi: 'POST + body match filename — chỉ cho txt/pdf/docx; exe bị 403. Test bằng curl --data-raw.',
          en: 'POST + body match on filename — allow txt/pdf/docx only; exe returns 403. Test with curl --data-raw.',
        },
      },
      {
        title: { vi: 'Payload logging (managed rules)', en: 'Payload logging (managed rules)' },
        detail: {
          vi: 'WAF > Managed rules > Configure payload logging → key pair hoặc public key → Events > Decrypt payload (trong browser, key không gửi server).',
          en: 'WAF > Managed rules > Configure payload logging → key pair or public key → Events > Decrypt payload (in browser; key not sent to server).',
        },
        dashboardPath: 'Security > WAF > Managed rules',
      },
    ],
    demoTips: [
      {
        vi: 'Chuẩn bị curl test 200 vs 403 trước khi share màn hình.',
        en: 'Prepare curl tests for 200 vs 403 before sharing screen.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Body inspection cho abuse cụ thể; payload logging giải thích vì sao managed ruleset bắt request.',
        en: 'Body inspection stops targeted abuse; payload logging explains managed ruleset triggers.',
      },
    ],
    docsLinks: [
      { label: 'Firewall rules', href: 'https://developers.cloudflare.com/waf/custom-rules/' },
      { label: 'Payload logging', href: 'https://developers.cloudflare.com/waf/managed-rules/payload-logging/' },
    ],
  },
  {
    id: 'advanced-rate-limiting',
    track: 'application-services',
    title: { vi: 'Advanced Rate Limiting', en: 'Advanced Rate Limiting' },
    personas: ['CISO', 'Platform Eng', 'SRE'],
    valueDriver: {
      vi: 'Đếm theo IP, cookie, header, JA3, JSON body — không chỉ IP/path cơ bản.',
      en: 'Count by IP, cookie, header, JA3, JSON body — beyond basic IP/path limits.',
    },
    opening: {
      vi: 'Advanced RL kết hợp nhiều “characteristics” và biểu thức đếm tùy chỉnh; có custom response JSON/HTML khi block.',
      en: 'Advanced RL combines multiple characteristics and custom counting expressions; custom JSON/HTML block responses.',
    },
    whenToUse: {
      vi: 'API/login abuse theo session cookie, geo, JA3; cần khuyến nghị ngưỡng từ API Shield.',
      en: 'API/login abuse by session cookie, geo, JA3; need thresholds from API Shield recommendations.',
    },
    dashboardPaths: ['Security > WAF > Rate limiting rules'],
    steps: [
      {
        title: { vi: 'Tạo rule', en: 'Create rule' },
        detail: {
          vi: 'Rule name → If incoming requests match (Fields) → Action Block + optional custom response → Duration → When rate exceeds → With the same value of (characteristics).',
          en: 'Rule name → If incoming requests match (Fields) → Action Block + optional custom response → Duration → When rate exceeds → With the same value of (characteristics).',
        },
        dashboardPath: 'Security > WAF > Rate limiting rules > Create rule',
      },
      {
        title: { vi: 'Characteristics thường dùng', en: 'Common characteristics' },
        detail: {
          vi: 'ip.src, cf.unique_visitor_id (NAT), http.host, path, header/cookie name, cf.bot_management.ja3_hash, lookup_json_string(body).',
          en: 'ip.src, cf.unique_visitor_id (NAT), http.host, path, header/cookie name, cf.bot_management.ja3_hash, lookup_json_string(body).',
        },
      },
      {
        title: { vi: 'Custom counting expression', en: 'Custom counting expression' },
        detail: {
          vi: 'Bật “Use custom counting expression” khi chỉ muốn đếm subset (vd. chỉ /api/*) khác điều kiện match.',
          en: 'Enable “Use custom counting expression” when the counter subset (e.g. only /api/*) differs from the match.',
        },
      },
      {
        title: { vi: 'Lưu ý nội bộ', en: 'Internal note' },
        detail: {
          vi: 'Engine đếm theo colo — session cookie phân tán geo có thể khó chạm ngưỡng; IP thường tập trung một colo.',
          en: 'Counters are per colo — geo-distributed session cookies may hit threshold slowly; IPs often concentrate in one colo.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'API traffic: Block thay vì Challenge — challenge không render trên API client.',
        en: 'API traffic: prefer Block over Challenge — challenges do not render on API clients.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Kết hợp với API Shield “rate limit recommendation” để có ngưỡng theo percentile thực tế.',
        en: 'Pair with API Shield rate limit recommendations for percentile-based thresholds.',
      },
    ],
    docsLinks: [
      { label: 'Rate limiting rules', href: 'https://developers.cloudflare.com/waf/rate-limiting-rules/' },
      { label: 'Best practices', href: 'https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/' },
    ],
  },
  {
    id: 'bot-management',
    track: 'application-services',
    title: { vi: 'Bot Management', en: 'Bot Management' },
    personas: ['CISO', 'Dir of InfoSec'],
    valueDriver: {
      vi: 'Điểm bot 1–99 — phân biệt automation vs browser thật; không thay thế bằng Bot Fight Mode đơn giản.',
      en: 'Bot score 1–99 — separates automation vs real browsers; not replaced by simple Bot Fight Mode.',
    },
    opening: {
      vi: 'Bot score 1 = chắc chắn automated (TLS/header fingerprint, behavioral, JS detection). 2–99 dùng ML (MLv6). Score 0 = Bot Management không chạy trên request đó.',
      en: 'Bot score 1 = certainly automated (TLS/header fingerprint, behavioral, JS detection). 2–99 uses ML (MLv6). Score 0 = Bot Management did not run on that request.',
    },
    whenToUse: {
      vi: 'Scraping, credential stuffing, carding — khách hỏi downgrade Business có đủ Bot Management Enterprise không (thường là không).',
      en: 'Scraping, credential stuffing, carding — customer asks if Business tier equals Enterprise Bot Management (usually no).',
    },
    dashboardPaths: ['Security > Bots', 'Security > Events'],
    steps: [
      {
        title: { vi: 'Rule theo score', en: 'Rules by score' },
        detail: {
          vi: 'Bắt đầu Log hoặc Managed Challenge cho score 1; theo dõi Challenge Success Rate (<3% CSR tốt). Score 2–9: cân nhắc challenge static assets.',
          en: 'Start with Log or Managed Challenge for score 1; monitor Challenge Success Rate (<3% CSR is good). Score 2–9: consider challenging static assets.',
        },
        dashboardPath: 'Security > Bots > Configure Bot Management',
      },
      {
        title: { vi: 'Verified bots', en: 'Verified bots' },
        detail: {
          vi: 'Cho phép Google/Bing/monitoring — radar.cloudflare.com/traffic/verified-bots.',
          en: 'Allow Google/Bing/monitoring — radar.cloudflare.com/traffic/verified-bots.',
        },
      },
      {
        title: { vi: 'Test nhanh', en: 'Quick test' },
        detail: {
          vi: 'curl -svo /dev/null https://yourdomain — bot rule có thể trả 403; so sánh với browser thật.',
          en: 'curl -svo /dev/null https://yourdomain — bot rules may return 403; compare with a real browser.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'Bot score ≠ Threat score — giải thích rõ để tránh nhầm với IP reputation.',
        en: 'Bot score ≠ Threat score — clarify to avoid confusion with IP reputation.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Enterprise Bot Management: path-level, ASN/UA mix, anomaly detection, API abuse — Bot Fight Mode không đủ cho SME phức tạp.',
        en: 'Enterprise Bot Management: path-level, ASN/UA mix, anomaly detection, API abuse — Bot Fight Mode is insufficient for complex SMEs.',
      },
    ],
    docsLinks: [
      { label: 'Bot Management', href: 'https://developers.cloudflare.com/bots/' },
      { label: 'Verified bots', href: 'https://developers.cloudflare.com/bots/reference/verified-bots-policy/' },
    ],
  },
  {
    id: 'api-shield',
    track: 'application-services',
    title: { vi: 'API Shield', en: 'API Shield' },
    personas: ['CISO', 'API Owner', 'SRE'],
    valueDriver: {
      vi: 'Discovery endpoint, schema, mTLS, abuse detection — bảo vệ API không chỉ website.',
      en: 'Endpoint discovery, schema, mTLS, abuse detection — protect APIs not just websites.',
    },
    opening: {
      vi: 'Endpoint Management: lưu endpoint từ Discovery hoặc thủ công → metrics (count, latency, 4xx/5xx, size) + gợi ý rate limit.',
      en: 'Endpoint Management: save endpoints from Discovery or manually → metrics (count, latency, 4xx/5xx, size) + rate limit suggestions.',
    },
    whenToUse: {
      vi: 'SME có mobile app / B2B API; cần sequential abuse detection hoặc schema validation.',
      en: 'SME with mobile app / B2B API; needs sequential abuse detection or schema validation.',
    },
    dashboardPaths: ['Security > API Shield', 'Security > WAF > Rate limiting rules'],
    steps: [
      {
        title: { vi: 'API Discovery', en: 'API Discovery' },
        detail: {
          vi: 'Cấu hình session identifier (header/cookie). ~24h để populate; cần ≥50 session/endpoint. Unauthenticated discovery đang mở rộng.',
          en: 'Configure session identifier (header/cookie). ~24h to populate; needs ≥50 sessions/endpoint. Unauthenticated discovery expanding.',
        },
        dashboardPath: 'Security > API Shield > API Discovery',
      },
      {
        title: { vi: 'Rate limit từ recommendation', en: 'Rate limit from recommendation' },
        detail: {
          vi: 'Click “Rate limit recommendation” trên endpoint → mở Advanced RL với ngưỡng P50/P90/P99 — chọn Block, không Challenge.',
          en: 'Click “Rate limit recommendation” on endpoint → opens Advanced RL with P50/P90/P99 thresholds — choose Block, not Challenge.',
        },
      },
      {
        title: { vi: 'Schema / mTLS (nếu bật)', en: 'Schema / mTLS (if enabled)' },
        detail: {
          vi: 'Schema validation cho traffic không khớp contract; mTLS cho client tin cậy — phù hợp fintech SME.',
          en: 'Schema validation for out-of-contract traffic; mTLS for trusted clients — fits fintech SMEs.',
        },
        dashboardPath: 'Security > API Shield > Schema validation',
      },
    ],
    demoTips: [
      {
        vi: 'Có sẵn 1 zone demo với API traffic thật hoặc staging — Discovery trống làm demo yếu.',
        en: 'Use a demo zone with real or staging API traffic — empty Discovery weakens the demo.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'API Shield + Advanced RL = volumetric + sequential abuse; gắn với kế hoạch Business/Enterprise.',
        en: 'API Shield + Advanced RL = volumetric + sequential abuse; ties to Business/Enterprise plans.',
      },
    ],
    docsLinks: [{ label: 'API Shield', href: 'https://developers.cloudflare.com/api-shield/' }],
  },
  {
    id: 'account-waf',
    track: 'application-services',
    title: { vi: 'Account-level WAF', en: 'Account-level WAF' },
    personas: ['CISO', 'Global platform team'],
    valueDriver: {
      vi: 'Một ruleset cho nhiều zone — triển khai nhất quán cho SME đa thương hiệu.',
      en: 'One ruleset across zones — consistent rollout for multi-brand SMEs.',
    },
    opening: {
      vi: 'Application Security > WAF (account): deploy managed ruleset / OWASP / exposed credentials; chọn execution scope (all requests hoặc filter).',
      en: 'Application Security > WAF (account): deploy managed ruleset / OWASP / exposed credentials; pick execution scope (all requests or filter).',
    },
    whenToUse: {
      vi: 'Khách có >5 zone cùng policy; muốn staging ruleset trước khi apply production.',
      en: 'Customer has >5 zones with same policy; wants ruleset staging before production apply.',
    },
    dashboardPaths: ['Application Security > WAF', 'Security > WAF (zone)'],
    steps: [
      {
        title: { vi: 'Deploy ruleset', en: 'Deploy ruleset' },
        detail: {
          vi: 'Deploy managed ruleset → Edit scope → Deploy. Zone vẫn có thể override nhưng account baseline giảm drift.',
          en: 'Deploy managed ruleset → Edit scope → Deploy. Zones can override but account baseline reduces drift.',
        },
        dashboardPath: 'Application Security > WAF > Deploy ruleset',
      },
      {
        title: { vi: 'Custom rules account-wide', en: 'Account-wide custom rules' },
        detail: {
          vi: 'Firewall rules account level áp cho mọi zone khớp scope — phù hợp chặn country/ASN chung.',
          en: 'Account firewall rules apply to every zone in scope — good for global country/ASN blocks.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'So sánh với /plans — Account WAF thường gắn Enterprise; Business là zone-level.',
        en: 'Cross-link to /plans — Account WAF is often Enterprise; Business is zone-level.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'SME lớn: Account WAF + zone exception = governance; kết hợp Audit log Account Home.',
        en: 'Larger SMEs: Account WAF + zone exceptions = governance; pair with Account Home audit log.',
      },
    ],
    docsLinks: [{ label: 'Account-level WAF', href: 'https://developers.cloudflare.com/waf/account/' }],
  },
];

/** Zero Trust demo vignettes → Cloudflare One track */
export const cloudflareOneDemos: DemoVignette[] = [
  {
    id: 'zt-overview-warp',
    track: 'cloudflare-one',
    title: { vi: 'Overview, Settings & WARP', en: 'Overview, Settings & WARP' },
    personas: ['CISO', 'Head of IT', 'IT Manager'],
    valueDriver: {
      vi: 'Zero Trust trên cùng anycast network — ZTNA + SWG một dashboard với core CF.',
      en: 'Zero Trust on the same anycast network — ZTNA + SWG in one dashboard with core CF.',
    },
    opening: {
      vi: 'Zero Trust chạy trên mạng Cloudflare; demo nên có sơ đồ request flow end-to-end trước khi vào từng product.',
      en: 'Zero Trust runs on Cloudflare’s network; start with an end-to-end request flow diagram before each product.',
    },
    whenToUse: {
      vi: 'Đầu demo Cloudflare One; thiết lập team domain, IdP, device enrollment.',
      en: 'Start of Cloudflare One demo; set up team domain, IdP, device enrollment.',
    },
    dashboardPaths: ['Zero Trust > Settings', 'Zero Trust > My Team > Devices'],
    steps: [
      {
        title: { vi: 'Team domain', en: 'Team domain' },
        detail: {
          vi: 'Chọn teamname.cloudflareaccess.com — App Launcher, IdP callback, access requests. Customize login/block pages.',
          en: 'Choose teamname.cloudflareaccess.com — App Launcher, IdP callbacks, access requests. Customize login/block pages.',
        },
        dashboardPath: 'Zero Trust > Settings > General',
      },
      {
        title: { vi: 'Authentication / IdP', en: 'Authentication / IdP' },
        detail: {
          vi: 'OTP mặc định; thêm Okta/Azure AD/Google Workspace. API/Terraform read-only mode nếu cần change control.',
          en: 'OTP by default; add Okta/Azure AD/Google Workspace. API/Terraform read-only mode for change control.',
        },
        dashboardPath: 'Zero Trust > Settings > Authentication',
      },
      {
        title: { vi: 'WARP client', en: 'WARP client' },
        detail: {
          vi: 'Cài WARP trên laptop/mobile — đưa device traffic vào Cloudflare One (device posture, split tunnel).',
          en: 'Deploy WARP on laptop/mobile — routes device traffic into Cloudflare One (posture, split tunnel).',
        },
        dashboardPath: 'Zero Trust > Settings > WARP Client',
      },
      {
        title: { vi: 'ZT request routes', en: 'ZT request routes' },
        detail: {
          vi: 'Chuẩn bị 3 “route”: Core → Access → Gateway — map slide/script với menu Zero Trust.',
          en: 'Prepare three “routes”: Core → Access → Gateway — map slides/script to Zero Trust menu.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'Có device đã enroll sẵn — demo WARP live tránh timeout enrollment.',
        en: 'Pre-enroll a device — live WARP demo avoids enrollment timeouts.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Team domain + IdP là prerequisite cho Access và Gateway policies.',
        en: 'Team domain + IdP are prerequisites for Access and Gateway policies.',
      },
    ],
    docsLinks: [
      { label: 'Cloudflare One', href: 'https://developers.cloudflare.com/cloudflare-one/' },
      { label: 'WARP', href: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/' },
    ],
  },
  {
    id: 'zt-access-tunnels',
    track: 'cloudflare-one',
    title: { vi: 'Access & Tunnel', en: 'Access & Tunnel' },
    personas: ['CISO', 'Head of IT'],
    valueDriver: {
      vi: 'ZTNA thay VPN — policy theo identity/device, không mở rộng toàn mạng.',
      en: 'ZTNA instead of VPN — policy by identity/device, no full network extension.',
    },
    opening: {
      vi: 'VPN cũ: network-level trust rộng. Access: từng application với policy; Tunnel (cloudflared) kết nối outbound tới app nội bộ.',
      en: 'Legacy VPN: broad network trust. Access: per-application policies; Tunnel (cloudflared) outbound-only to private apps.',
    },
    whenToUse: {
      vi: 'SME muốn thay VPN, expose internal admin, hoặc contractor access có thời hạn.',
      en: 'SME replacing VPN, exposing internal admin, or time-bound contractor access.',
    },
    dashboardPaths: ['Zero Trust > Access > Applications', 'Zero Trust > Networks > Tunnels'],
    steps: [
      {
        title: { vi: 'Tạo Application', en: 'Create application' },
        detail: {
          vi: 'Self-hosted / SaaS / private IP — gắn policy (email domain, group, device posture, MFA).',
          en: 'Self-hosted / SaaS / private IP — attach policy (email domain, group, device posture, MFA).',
        },
        dashboardPath: 'Zero Trust > Access > Applications > Add an application',
      },
      {
        title: { vi: 'Tunnel (cloudflared)', en: 'Tunnel (cloudflared)' },
        detail: {
          vi: 'Tạo tunnel → connector trên VM/K8s → public hostname trỏ service nội bộ — không mở inbound firewall.',
          en: 'Create tunnel → connector on VM/K8s → public hostname to internal service — no inbound firewall holes.',
        },
        dashboardPath: 'Zero Trust > Networks > Tunnels',
      },
      {
        title: { vi: 'App Launcher', en: 'App Launcher' },
        detail: {
          vi: 'User đăng nhập team domain → thấy tile app được phép — showcase UX cho lãnh đạo SME.',
          en: 'User signs in on team domain → sees allowed app tiles — executive-friendly UX.',
        },
        dashboardPath: 'Zero Trust > Access > App Launcher',
      },
    ],
    demoTips: [
      {
        vi: 'Demo 1 app nội bộ qua Tunnel + 1 SaaS (ví dụ Salesforce) với policy khác nhau.',
        en: 'Demo one internal app via Tunnel + one SaaS (e.g. Salesforce) with different policies.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Access + Tunnel = pattern phổ biến SME thay VPN; kết hợp với use case /use-cases/replace-vpn.',
        en: 'Access + Tunnel = common SME VPN replacement; link to /use-cases/replace-vpn.',
      },
    ],
    docsLinks: [
      { label: 'Access', href: 'https://developers.cloudflare.com/cloudflare-one/access/' },
      { label: 'Tunnel', href: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/' },
    ],
  },
  {
    id: 'zt-gateway-dlp',
    track: 'cloudflare-one',
    title: { vi: 'Gateway, RBI & DLP', en: 'Gateway, RBI & DLP' },
    personas: ['CISO', 'Dir of InfoSec'],
    valueDriver: {
      vi: 'SWG — kiểm soát DNS/HTTP, malware, RBI, DLP khi user ra Internet.',
      en: 'SWG — control DNS/HTTP, malware, RBI, DLP for Internet-bound users.',
    },
    opening: {
      vi: 'Gateway bảo vệ mọi user/device đi qua WARP — policies DNS, HTTP, network; RBI cách ly trình duyệt; DLP chặn dữ liệu nhạy cảm.',
      en: 'Gateway protects users/devices via WARP — DNS, HTTP, network policies; RBI isolates the browser; DLP blocks sensitive data.',
    },
    whenToUse: {
      vi: 'Remote workforce, chặn shadow IT, compliance PCI/HIPAA cho traffic ra ngoài.',
      en: 'Remote workforce, block shadow IT, PCI/HIPAA-style compliance for egress traffic.',
    },
    dashboardPaths: ['Zero Trust > Gateway > Firewall policies', 'Zero Trust > Gateway > DLP'],
    steps: [
      {
        title: { vi: 'DNS / HTTP policies', en: 'DNS / HTTP policies' },
        detail: {
          vi: 'Ví dụ: chặn category Social hoặc malware; allow corporate SaaS. Show log Gateway > Logs.',
          en: 'Examples: block Social category or malware; allow corporate SaaS. Show Gateway > Logs.',
        },
        dashboardPath: 'Zero Trust > Gateway > Firewall policies',
      },
      {
        title: { vi: 'Browser Isolation (RBI)', en: 'Browser Isolation (RBI)' },
        detail: {
          vi: 'Policy render site không tin cậy trong remote browser — giảm malware endpoint.',
          en: 'Policy renders untrusted sites in remote browser — reduces endpoint malware.',
        },
        dashboardPath: 'Zero Trust > Browser Isolation',
      },
      {
        title: { vi: 'DLP profiles', en: 'DLP profiles' },
        detail: {
          vi: 'Profile PII/credit card — block hoặc log upload/download qua HTTP.',
          en: 'PII/credit card profiles — block or log uploads/downloads over HTTP.',
        },
        dashboardPath: 'Zero Trust > Gateway > DLP profiles',
      },
    ],
    demoTips: [
      {
        vi: 'WARP phải bật — không có client thì Gateway policy không áp dụng cho device.',
        en: 'WARP must be on — without the client, Gateway policies do not apply to the device.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Gateway + Access = outbound (Internet) + inbound (private apps); pitch “single pane” cho CISO SME.',
        en: 'Gateway + Access = outbound (Internet) + inbound (private apps); “single pane” pitch for SME CISOs.',
      },
    ],
    docsLinks: [
      { label: 'Gateway', href: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/' },
      { label: 'DLP', href: 'https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/' },
    ],
  },
  {
    id: 'zt-casb',
    track: 'cloudflare-one',
    title: { vi: 'CASB & SaaS posture', en: 'CASB & SaaS posture' },
    personas: ['CISO', 'IT Manager'],
    valueDriver: {
      vi: 'Phát hiện shadow SaaS, misconfiguration, data-at-rest risk.',
      en: 'Discover shadow SaaS, misconfiguration, data-at-rest risk.',
    },
    opening: {
      vi: 'CASB scan kết nối SaaS (M365, Google, Salesforce…) — findings + remediation trong Zero Trust dashboard.',
      en: 'CASB scans connected SaaS (M365, Google, Salesforce…) — findings + remediation in Zero Trust dashboard.',
    },
    whenToUse: {
      vi: 'SME đã dùng nhiều SaaS; lo ngại file public link, admin MFA tắt, ứng dụng chưa phê duyệt.',
      en: 'SME on many SaaS apps; worried about public links, admins without MFA, unapproved apps.',
    },
    dashboardPaths: ['Zero Trust > CASB', 'Zero Trust > Gateway > DLP'],
    steps: [
      {
        title: { vi: 'Kết nối integration', en: 'Connect integration' },
        detail: {
          vi: 'OAuth tới tenant SaaS → chạy scan → hiển thị critical/high findings.',
          en: 'OAuth to SaaS tenant → run scan → show critical/high findings.',
        },
        dashboardPath: 'Zero Trust > CASB > Integrations',
      },
      {
        title: { vi: 'Inline DLP + CASB', en: 'Inline DLP + CASB' },
        detail: {
          vi: 'Kết hợp data-at-rest (CASB) với inline DLP (Gateway) trong narrative compliance.',
          en: 'Combine data-at-rest (CASB) with inline DLP (Gateway) in a compliance narrative.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'Dùng sandbox tenant SaaS — đừng quét production customer tenant trên demo công khai.',
        en: 'Use a sandbox SaaS tenant — do not scan a customer production tenant in a public demo.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'CASB bổ sung Access (ai vào app) bằng “app có an toàn không”.',
        en: 'CASB complements Access (who reaches apps) with “is the app configured safely”.',
      },
    ],
    docsLinks: [{ label: 'CASB', href: 'https://developers.cloudflare.com/cloudflare-one/applications/casb/' }],
  },
  {
    id: 'zt-logs',
    track: 'cloudflare-one',
    title: { vi: 'Logs & visibility', en: 'Logs & visibility' },
    personas: ['SOC', 'CISO'],
    valueDriver: {
      vi: 'Audit Access/Gateway — đưa log về SIEM (Logpush).',
      en: 'Audit Access/Gateway — send logs to SIEM (Logpush).',
    },
    opening: {
      vi: 'Demo kết thúc bằng Logs: Access, Gateway, Audit — filter theo user, app, action, decision.',
      en: 'Close the demo with Logs: Access, Gateway, Audit — filter by user, app, action, decision.',
    },
    whenToUse: {
      vi: 'SME có yêu cầu compliance log 90 ngày hoặc tích hợp Splunk/Datadog.',
      en: 'SME requires 90-day compliance logs or Splunk/Datadog integration.',
    },
    dashboardPaths: ['Zero Trust > Logs', 'Analytics & Logs > Logpush'],
    steps: [
      {
        title: { vi: 'Zero Trust Logs', en: 'Zero Trust Logs' },
        detail: {
          vi: 'Lọc deny/allow — chứng minh policy hoạt động sau khi tạo Access/Gateway rule.',
          en: 'Filter deny/allow — prove policies work after creating Access/Gateway rules.',
        },
        dashboardPath: 'Zero Trust > Logs',
      },
      {
        title: { vi: 'Logpush (nếu Enterprise)', en: 'Logpush (if Enterprise)' },
        detail: {
          vi: 'Cấu hình destination S3/R2/SIEM — nói rõ gói Business vs Enterprise cho retention.',
          en: 'Configure S3/R2/SIEM destination — clarify Business vs Enterprise for retention.',
        },
        dashboardPath: 'Analytics & Logs > Logpush',
      },
    ],
    demoTips: [
      {
        vi: 'Tạo 1 policy deny cố ý trước demo để có log “deny” sống động.',
        en: 'Create one intentional deny policy before the demo for a live “deny” log line.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Visibility bán Enterprise: SOC + báo cáo cho ban lãnh đạo SME.',
        en: 'Visibility sells Enterprise: SOC plus reports for SME leadership.',
      },
    ],
    docsLinks: [{ label: 'Logpush', href: 'https://developers.cloudflare.com/logs/logpush/' }],
  },
];

export const allDemoVignettes: DemoVignette[] = [
  ...platformDemoVignettes,
  ...applicationSecurityDemos,
  ...cloudflareOneDemos,
];

export function getDemosForTrack(track: DemoVignette['track']): DemoVignette[] {
  return allDemoVignettes.filter((v) => v.track === track);
}
