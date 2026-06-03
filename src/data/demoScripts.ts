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
  vi: 'Hướng dẫn overview dashboard Cloudflare — giúp khách hàng biết từng khu vực dùng để làm gì, đọc số liệu ra sao, và bước tiếp theo nên là gì. Không phải sales kit hay kịch bản demo.',
  en: 'Cloudflare dashboard overviews — what each area is for, how to read the metrics, and sensible next steps. Not a sales kit or demo script.',
};

export const demoScriptsDisclaimer: LocalizedString = {
  vi: 'Nội dung mang tính định hướng; menu và nhãn trên dashboard có thể thay đổi theo gói và phiên bản. Luôn đối chiếu developers.cloudflare.com và tài liệu chính thức trước khi cấu hình production.',
  en: 'Orientation only — dashboard menus and labels vary by plan and release. Always cross-check developers.cloudflare.com and official docs before production changes.',
};

/** Core platform — account, zone, and request flow overviews */
export const platformDemoVignettes: DemoVignette[] = [
  {
    id: 'core-discovery',
    track: 'platform',
    title: { vi: 'Nền tảng: Account & zone', en: 'Platform: Account & zone' },
    personas: ['IT Manager', 'Dir of Engineering', 'CISO'],
    valueDriver: {
      vi: 'Reverse proxy toàn cầu — bảo mật & hiệu năng gần user, một dashboard.',
      en: 'Global reverse proxy — security and performance near users, single dashboard.',
    },
    opening: {
      vi: 'Cloudflare là reverse proxy anycast giữa end-user và origin: request được xử lý tại PoP gần nhất (hơn 330 thành phố), rồi mới về origin nếu cần.',
      en: 'Cloudflare is an anycast reverse proxy between users and origin: requests are handled at the nearest PoP (330+ cities), then reach origin when needed.',
    },
    whenToUse: {
      vi: 'Khi mới onboard zone hoặc cần giải thích “Cloudflare khác CDN thường thế nào?” trước khi vào Security / Zero Trust.',
      en: 'When a zone is newly onboarded or you need to explain how Cloudflare differs from a basic CDN before Security / Zero Trust.',
    },
    dashboardPaths: ['Account Home', 'Overview (zone)', 'Analytics > Traffic'],
    steps: [
      {
        title: { vi: 'Thông tin zone cần nắm', en: 'Zone context to confirm' },
        detail: {
          vi: 'Domain/zone nào, origin ở đâu (cloud/on-prem), ai quản lý DNS, và mục tiêu chính (bảo mật, tốc độ, VPN/ZT, API).',
          en: 'Which domain/zone, where origin lives (cloud/on-prem), who manages DNS, and primary goals (security, speed, VPN/ZT, APIs).',
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
        vi: 'Sơ đồ luồng request (client → PoP → origin) giúp đọc Analytics và Security Events dễ hơn so với chỉ liệt kê menu.',
        en: 'A simple request-flow diagram (client → PoP → origin) makes Analytics and Security Events easier to read than menu names alone.',
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
      vi: 'Một nơi xem events, WAF, bot và rate limiting — điểm vào Application Security trên zone.',
      en: 'One place for events, WAF, bots, and rate limiting — the Application Security entry point per zone.',
    },
    opening: {
      vi: 'Sau khi onboard DNS/SSL, đi theo “Security route”: Events → WAF → Bots → Rate limiting.',
      en: 'After DNS/SSL onboarding, follow the “Security route”: Events → WAF → Bots → Rate limiting.',
    },
    whenToUse: {
      vi: 'Khi cần xem traffic bị chặn/cho phép, điều tra sự cố, hoặc trước khi chỉnh WAF/bot/rate limit.',
      en: 'When reviewing blocked/allowed traffic, investigating incidents, or before changing WAF, bot, or rate limit settings.',
    },
    dashboardPaths: ['Analytics > Events', 'Security > WAF', 'Security > Bots'],
    steps: [
      {
        title: { vi: 'Security Events / Activity log', en: 'Security Events / Activity log' },
        detail: {
          vi: 'Mở một event: rule khớp, action, quốc gia, bot score (nếu có). Dùng bộ lọc thời gian và rule ID để thu hẹp.',
          en: 'Open an event: matched rule, action, country, bot score (if present). Use time range and rule ID filters to narrow results.',
        },
        dashboardPath: 'Analytics > Events',
      },
      {
        title: { vi: 'WAF managed & custom rules', en: 'WAF managed & custom rules' },
        detail: {
          vi: 'Managed rulesets (OWASP, Cloudflare Managed) + WAF custom rules. Nói thứ tự: specific → general.',
          en: 'Managed rulesets (OWASP, Cloudflare Managed) + WAF custom rules. Mention ordering: specific → general.',
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
        vi: 'Rule mới nên bắt đầu ở Log hoặc Simulate trước khi Block — giảm false positive trên traffic thật.',
        en: 'New rules should start in Log or Simulate before Block — reduces false positives on live traffic.',
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
      vi: 'Giảm latency và tải origin — theo dõi cache hit và tối ưu Speed sau khi đã proxy zone.',
      en: 'Lower latency and origin load — track cache hits and Speed settings after the zone is proxied.',
    },
    opening: {
      vi: 'Application route: Caching overview → Cache Rules → Speed optimizations → (tuỳ chọn) Argo / Images.',
      en: 'Application route: Caching overview → Cache Rules → Speed optimizations → (optional) Argo / Images.',
    },
    whenToUse: {
      vi: 'Khi cần cải thiện tốc độ website, giảm băng thông origin, hoặc đo hiệu quả cache.',
      en: 'When improving site speed, reducing origin bandwidth, or measuring cache effectiveness.',
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
        title: { vi: 'Cache Rules', en: 'Cache Rules' },
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
        vi: 'So sánh Cache Analytics trước/sau khi bật rule — hit ratio và bandwidth saved là chỉ số dễ theo dõi.',
        en: 'Compare Cache Analytics before/after rule changes — hit ratio and bandwidth saved are easy metrics to track.',
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

/** Application Security dashboard overviews → Application Services track */
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
      vi: 'WAF custom rules có thể inspect body (form, JSON) — cùng một capability: payload / POST body / request body matching.',
      en: 'WAF custom rules can inspect the body (forms, JSON) — same capability: payload / POST body / request body matching.',
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
        vi: 'Sau khi tạo rule, kiểm tra Security Events để xác nhận match/block đúng ý (có thể dùng curl hoặc request thật).',
        en: 'After creating a rule, check Security Events to confirm matches/blocks behave as expected (curl or real traffic).',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Body inspection cho abuse cụ thể; payload logging giải thích vì sao managed ruleset bắt request.',
        en: 'Body inspection stops targeted abuse; payload logging explains managed ruleset triggers.',
      },
    ],
    docsLinks: [
      { label: 'WAF custom rules', href: 'https://developers.cloudflare.com/waf/custom-rules/' },
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
      vi: 'Bot score 1 = automated; 2–29 = likely automated; 30–99 = likely human. Score 0 = “not computed” (Bot Management không đánh giá request đó).',
      en: 'Bot score 1 = automated; 2–29 = likely automated; 30–99 = likely human. Score 0 means “not computed” (Bot Management did not evaluate that request).',
    },
    whenToUse: {
      vi: 'Khi có scraping, credential stuffing, hoặc cần phân biệt bot automation vs trình duyệt thật — xem gói có Bot Management đầy đủ hay không.',
      en: 'When facing scraping, credential stuffing, or needing to separate automated bots from real browsers — check plan includes full Bot Management.',
    },
    dashboardPaths: ['Security > Settings (Bot traffic)', 'Analytics > Events'],
    steps: [
      {
        title: { vi: 'Rule theo score', en: 'Rules by score' },
        detail: {
          vi: 'Bắt đầu Log hoặc Managed Challenge cho score 1; theo dõi Challenge Success Rate (<3% CSR tốt). Score 2–9: cân nhắc challenge static assets.',
          en: 'Start with Log or Managed Challenge for score 1; monitor Challenge Success Rate (<3% CSR is good). Score 2–9: consider challenging static assets.',
        },
        dashboardPath: 'Security > Settings (Bot traffic) > Bot Management',
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
    dashboardPaths: ['Security > Web Assets (Discovery/Endpoints)', 'Security rules > Rate limiting rules'],
    steps: [
      {
        title: { vi: 'API Discovery', en: 'API Discovery' },
        detail: {
          vi: 'API Discovery cần traffic “đủ điều kiện” (2xx tại edge, không phải từ Workers, và ~500 requests/10 ngày). Nếu dùng session identifier, hãy chờ ~24h để dữ liệu ổn định.',
          en: 'API Discovery needs “valid” traffic (2xx at the edge, not from Workers, and ~500 requests within 10 days). If you use a session identifier, allow ~24 hours for data to stabilize.',
        },
        dashboardPath: 'Security > Web Assets > Discovery',
      },
      {
        title: { vi: 'Rate limit từ recommendation', en: 'Rate limit from recommendation' },
        detail: {
          vi: 'Rate limit recommendation cần session identifier và đủ traffic; thường yêu cầu ≥50 distinct sessions/24h trong 7 ngày. Sau khi thêm identifier, chờ ~24h để recommendation xuất hiện.',
          en: 'Rate limit recommendations require a session identifier and enough traffic; commonly ≥50 distinct sessions in a 24-hour period (within the last 7 days). After adding an identifier, wait ~24 hours for recommendations to appear.',
        },
      },
      {
        title: { vi: 'Schema / mTLS (nếu bật)', en: 'Schema / mTLS (if enabled)' },
        detail: {
          vi: 'Schema validation cho traffic không khớp contract; mTLS cho client tin cậy — phù hợp fintech SME.',
          en: 'Schema validation for out-of-contract traffic; mTLS for trusted clients — fits fintech SMEs.',
        },
        dashboardPath: 'Security > Web Assets > Schema validation',
      },
    ],
    demoTips: [
      {
        vi: 'Zone mới có thể chưa có endpoint trong vài ngày. Nếu production chưa đủ traffic, dùng staging hoặc chạy synthetic traffic để “seed” Discovery.',
        en: 'New zones can stay empty for days. If production lacks traffic, use staging or synthetic traffic to “seed” Discovery.',
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
          vi: 'Account-level custom rulesets áp cho mọi zone khớp scope — phù hợp baseline chặn country/ASN chung và giảm drift giữa các zone.',
          en: 'Account-level custom rulesets apply to every zone in scope — good for baseline country/ASN blocks and reducing drift across zones.',
        },
      },
    ],
    demoTips: [
      {
        vi: 'Account WAF thường có trên gói cao hơn; zone WAF vẫn áp dụng từng domain — xem /plans để đối chiếu gói.',
        en: 'Account WAF is typically on higher tiers; zone WAF still applies per domain — see /plans for plan comparison.',
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

/** Cloudflare One dashboard overviews → Cloudflare One track */
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
      vi: 'Zero Trust chạy trên mạng Cloudflare — nên nắm luồng user/device → policy trước khi vào Access, Gateway, CASB.',
      en: 'Zero Trust runs on Cloudflare’s network — understand user/device → policy flow before Access, Gateway, or CASB.',
    },
    whenToUse: {
      vi: 'Khi thiết lập Cloudflare One lần đầu: team domain, IdP, và đăng ký thiết bị (WARP).',
      en: 'When setting up Cloudflare One for the first time: team domain, IdP, and device enrollment (WARP).',
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
          vi: 'Ba khu vực thường gặp: Settings (team/IdP/WARP) → Access (ứng dụng) → Gateway (egress Internet).',
          en: 'Three common areas: Settings (team/IdP/WARP) → Access (applications) → Gateway (Internet egress).',
        },
      },
    ],
    demoTips: [
      {
        vi: 'Enroll ít nhất một thiết bị thử trước khi triển khai rộng — enrollment và split tunnel cần kiểm tra trên mạng thật.',
        en: 'Enroll at least one test device before wide rollout — enrollment and split tunnel should be validated on real networks.',
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
          vi: 'User đăng nhập team domain → thấy các ứng dụng được phép trên App Launcher — không cần VPN toàn mạng.',
          en: 'User signs in on the team domain → sees allowed apps on App Launcher — no full-network VPN required.',
        },
        dashboardPath: 'Zero Trust > Access > App Launcher',
      },
    ],
    demoTips: [
      {
        vi: 'Nên tách policy cho app nội bộ (Tunnel) và SaaS (OIDC/SAML) — điều kiện identity/device có thể khác nhau.',
        en: 'Use separate policies for internal apps (Tunnel) vs SaaS (OIDC/SAML) — identity/device conditions often differ.',
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
        vi: 'Gateway (egress Internet) và Access (ứng dụng riêng/SaaS) bổ sung nhau — cùng dashboard Zero Trust.',
        en: 'Gateway (Internet egress) and Access (private/SaaS apps) complement each other — both live in the Zero Trust dashboard.',
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
        vi: 'Kết nối CASB nên thử trên tenant sandbox hoặc môi trường thử — tránh quét production chưa được phê duyệt.',
        en: 'Connect CASB to a sandbox or test tenant first — avoid scanning unapproved production tenants.',
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
      vi: 'Logs gom Access, Gateway và Audit — lọc theo user, app, action, allow/deny để kiểm tra policy.',
      en: 'Logs combine Access, Gateway, and Audit — filter by user, app, action, and allow/deny to verify policies.',
    },
    whenToUse: {
      vi: 'SME có yêu cầu compliance log 90 ngày hoặc tích hợp Splunk/Datadog.',
      en: 'SME requires 90-day compliance logs or Splunk/Datadog integration.',
    },
    dashboardPaths: ['Zero Trust > Insights > Logs', 'Zero Trust > Insights > Logs > Manage Logpush'],
    steps: [
      {
        title: { vi: 'Zero Trust Logs', en: 'Zero Trust Logs' },
        detail: {
          vi: 'Lọc deny/allow — chứng minh policy hoạt động sau khi tạo Access/Gateway rule.',
          en: 'Filter deny/allow — prove policies work after creating Access/Gateway rules.',
        },
        dashboardPath: 'Zero Trust > Insights > Logs',
      },
      {
        title: { vi: 'Logpush (nếu Enterprise)', en: 'Logpush (if Enterprise)' },
        detail: {
          vi: 'Cấu hình destination S3/R2/SIEM — nói rõ gói Business vs Enterprise cho retention.',
          en: 'Configure S3/R2/SIEM destination — clarify Business vs Enterprise for retention.',
        },
        dashboardPath: 'Zero Trust > Insights > Logs > Manage Logpush',
      },
    ],
    demoTips: [
      {
        vi: 'Sau khi đổi policy, mở Logs và lọc decision=deny để xác nhận rule hoạt động như mong đợi.',
        en: 'After policy changes, open Logs and filter decision=deny to confirm rules behave as expected.',
      },
    ],
    keyTakeaways: [
      {
        vi: 'Logpush (nếu có trên gói) đưa log về SIEM — Zero Trust Logs vẫn dùng cho kiểm tra nhanh hàng ngày.',
        en: 'Logpush (where available) feeds SIEMs — Zero Trust Logs remain useful for day-to-day checks.',
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
