import type { LocalizedString } from '../i18n/types';
import type { LessonKind } from './lessonKind';

type Guide = {
  how: LocalizedString;
  architecture: LocalizedString;
  whenToUse: LocalizedString;
  whenNot: LocalizedString;
  planNotes: LocalizedString;
  terms: { term: string; detail: LocalizedString }[];
};

type KnowledgeLesson = {
  id?: string;
  kind: LessonKind;
  duration: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  guide: Guide;
  prerequisites?: string[];
};

const CHECKED = '2026-11-11';

function t(vi: string, en: string): LocalizedString {
  return { vi, en };
}

function lesson(
  id: string,
  title: LocalizedString,
  body: LocalizedString,
  guide: Guide,
  extra?: Partial<KnowledgeLesson>,
): KnowledgeLesson {
  return {
    ...(id ? { id } : {}),
    kind: 'knowledge',
    duration: t('~12 phút', '~12 min'),
    title,
    body,
    guide,
    ...extra,
  };
}

const source = (url: string) => url;

/** Application Services knowledge lessons. Plan numbers were checked on 2026-11-11. */
export const asArchitectureLesson: KnowledgeLesson = lesson(
  '',
  t(
    'Kiến trúc Application Services và thứ tự làm',
    'Application Services architecture and the build order',
  ),
  t(
    'Khách vào site theo đường: DNS, rồi proxy (đám mây cam), SSL, WAF, cache, rồi mới tới origin. Làm đúng thứ tự đó. Chưa xong nền thì chưa rẽ API Shield hay Load Balancing.',
    'A visitor reaches your site through DNS, then the proxy (orange cloud), SSL, WAF, cache, and only then the origin. Follow that order. Do not branch to API Shield or Load Balancing before the base is in place.',
  ),
  {
    how: t(
      'Cloudflare đứng giữa khách và máy chủ của bạn. Record được proxy thì request HTTP đi qua mạng Cloudflare. Record chỉ DNS (đám mây xám) thì Cloudflare trả địa chỉ, không xem nội dung HTTP — WAF và cache không chạy trên record đó.',
      'Cloudflare sits between the visitor and your server. A proxied record sends HTTP through Cloudflare’s network. A DNS-only record (grey cloud) only returns an address. WAF and cache do not run on that record.',
    ),
    architecture: t(
      'Thứ tự xây: (1) đưa domain lên và rà DNS, (2) bật proxy đúng hostname public, (3) SSL Full (strict) khi origin có chứng chỉ hợp lệ, (4) WAF và rate limit, (5) cache cho file tĩnh. API Shield, Load Balancing và Waiting Room là nhánh sau, khi nền đã chạy.',
      'Build order: (1) onboard the domain and review DNS, (2) proxy the public hostnames, (3) SSL Full (strict) when the origin has a valid certificate, (4) WAF and rate limiting, (5) cache for static files. API Shield, Load Balancing, and Waiting Room come after that base is working.',
    ),
    whenToUse: t(
      'Dùng lộ trình này khi bạn đã có website, web app hoặc API public và muốn Cloudflare đứng trước origin.',
      'Use this path when you already have a website, web app, or public API and you want Cloudflare in front of the origin.',
    ),
    whenNot: t(
      'Đừng bắt đầu bằng API Shield hay Load Balancing nếu zone chưa Active và hostname public chưa Proxied. Hai sản phẩm đó không thay bước DNS và proxy.',
      'Do not start with API Shield or Load Balancing if the zone is not Active and the public hostname is not Proxied. Those products do not replace DNS and the proxy.',
    ),
    planNotes: t(
      `Bắt đầu bằng gói Free cho full setup (đổi nameserver) là đủ để học DNS, proxy và SSL. CNAME setup (partial) chỉ có trên Business và Enterprise — đó không phải Custom Hostnames / SSL for SaaS. Xem bảng ở đầu track. Nguồn: ${source('https://developers.cloudflare.com/dns/zone-setups/')} (${CHECKED}).`,
      `Free is enough to learn DNS, the proxy, and SSL on a full setup (nameserver change). CNAME setup (partial) is Business and Enterprise only — that is not Custom Hostnames / SSL for SaaS. See the table at the top of the track. Source: ${source('https://developers.cloudflare.com/dns/zone-setups/')} (${CHECKED}).`,
    ),
    terms: [
      {
        term: 'Origin',
        detail: t('Máy chủ thật đang giữ website hoặc API của bạn.', 'The server that actually hosts your website or API.'),
      },
      {
        term: 'Proxy',
        detail: t(
          'Đám mây cam. Request HTTP đi qua Cloudflare.',
          'The orange cloud. HTTP requests go through Cloudflare.',
        ),
      },
    ],
  },
  { duration: t('~15 phút', '~15 min') },
);

export const asDnsLesson: KnowledgeLesson = lesson(
  'as-k-dns',
  t('DNS trên Cloudflare: full setup, CNAME setup, và đám mây cam', 'DNS on Cloudflare: full setup, CNAME setup, and the orange cloud'),
  t(
    'Full setup nghĩa là Cloudflare giữ DNS của domain (bạn đổi nameserver). CNAME setup (còn gọi partial) giữ DNS ở nhà cung cấp cũ và chỉ đưa một số hostname qua Cloudflare. Chỉ bật proxy cho hostname public.',
    'Full setup means Cloudflare holds the domain’s DNS (you change nameservers). CNAME setup (also called partial) keeps DNS at your current provider and sends only some hostnames through Cloudflare. Proxy only public hostnames.',
  ),
  {
    how: t(
      'Ở full setup, registrar trỏ nameserver sang Cloudflare. Cloudflare trả lời mọi bản ghi: A, AAAA, CNAME, MX, TXT. Bản ghi A, AAAA hoặc CNAME có thể Proxied (cam) hoặc DNS only (xám). MX không proxy được. Ở CNAME setup, bạn tạo CNAME bên DNS cũ trỏ tới tên Cloudflare cấp.',
      'On a full setup, the registrar points nameservers at Cloudflare. Cloudflare answers every record: A, AAAA, CNAME, MX, TXT. An A, AAAA, or CNAME can be Proxied (orange) or DNS only (grey). MX cannot be proxied. On a CNAME setup, you create a CNAME at the old DNS that points at the name Cloudflare gives you.',
    ),
    architecture: t(
      'Khách hỏi DNS trước. Nếu record cam, IP trả về là IP Cloudflare và HTTP đi qua proxy. Nếu record xám, IP là origin và Cloudflare không thấy HTTP. Email (MX) phải đi thẳng tới máy mail, không qua proxy web.',
      'The visitor asks DNS first. An orange record returns a Cloudflare IP and HTTP goes through the proxy. A grey record returns the origin IP and Cloudflare never sees the HTTP. Mail (MX) must go straight to the mail server, not through the web proxy.',
    ),
    whenToUse: t(
      'Dùng full setup khi bạn đổi được nameserver. Đó là cách phổ biến, và là cách duy nhất trên Free và Pro. Dùng CNAME setup khi bạn không đổi được DNS chính và chỉ cần proxy vài subdomain.',
      'Use full setup when you can change nameservers. That is the common path, and the only one on Free and Pro. Use CNAME setup when you cannot move authoritative DNS and you only need to proxy a few subdomains.',
    ),
    whenNot: t(
      'Đừng bật proxy cho MX, hay cho hostname chỉ dùng nội bộ. Đừng tắt DNSSEC ở registrar sau khi đã thêm domain nếu bạn chưa đọc hướng dẫn — tắt DNSSEC trước khi chuyển, nếu không domain có thể không phân giải. CNAME setup không phải Cloudflare for SaaS (Custom Hostnames): sản phẩm đó cấp hostname cho khách của bạn, không phải cách đưa zone của bạn lên Cloudflare.',
      'Do not proxy MX, or a hostname that should stay internal. Do not leave DNSSEC on at the registrar in a way that blocks the move — turn DNSSEC off before you switch, or the domain can fail to resolve. CNAME setup is not Cloudflare for SaaS (Custom Hostnames): that product issues hostnames for your customers, it is not how you onboard your own zone.',
    ),
    planNotes: t(
      `CNAME setup (partial) chỉ có trên Business và Enterprise. Free và Pro chỉ dùng full setup. Partial không dùng được với domain đăng ký tại Cloudflare Registrar. Nguồn: ${source('https://developers.cloudflare.com/dns/zone-setups/partial-setup/')} và ${source('https://developers.cloudflare.com/dns/nameservers/update-nameservers/')} (${CHECKED}).`,
      `CNAME setup (partial) is Business and Enterprise only. Free and Pro use full setup only. Partial setup is not supported on Cloudflare Registrar domains. Sources: ${source('https://developers.cloudflare.com/dns/zone-setups/partial-setup/')} and ${source('https://developers.cloudflare.com/dns/nameservers/update-nameservers/')} (${CHECKED}).`,
    ),
    terms: [
      {
        term: 'Nameserver',
        detail: t(
          'Máy chủ mà registrar hỏi để biết domain của bạn nằm ở đâu. Full setup thì đó là nameserver Cloudflare.',
          'The servers your registrar asks to find where the domain lives. On a full setup, those are Cloudflare’s nameservers.',
        ),
      },
      {
        term: 'Đám mây cam / xám',
        detail: t(
          'Cam = Proxied. Xám = DNS only. Chỉ A, AAAA và CNAME mới bật cam được.',
          'Orange = Proxied. Grey = DNS only. Only A, AAAA, and CNAME records can be orange.',
        ),
      },
    ],
  },
  { prerequisites: ['as-0-l1'] },
);

export const asSslLesson: KnowledgeLesson = lesson(
  'as-k-ssl',
  t('SSL/TLS: mode nào, và vì sao tránh Flexible', 'SSL/TLS: which mode, and why to avoid Flexible'),
  t(
    'Có hai đoạn mã hóa: khách tới Cloudflare, và Cloudflare tới origin. Full (strict) kiểm tra chứng chỉ origin. Flexible chỉ mã hóa đoạn đầu và nói HTTP với origin.',
    'There are two encrypted hops: visitor to Cloudflare, and Cloudflare to the origin. Full (strict) checks the origin certificate. Flexible only encrypts the first hop and talks HTTP to the origin.',
  ),
  {
    how: t(
      'Mode Flexible: khách dùng HTTPS, Cloudflare gọi origin bằng HTTP. Nếu origin tự chuyển mọi HTTP sang HTTPS, trình duyệt bị lặp chuyển hướng. Mode Full: Cloudflare gọi origin bằng HTTPS nhưng không kiểm tra chứng chỉ có hợp lệ hay hết hạn. Mode Full (strict): chứng chỉ origin phải còn hạn, do CA tin cậy hoặc Origin CA của Cloudflare cấp, và tên trên chứng chỉ khớp hostname.',
      'Flexible: the visitor uses HTTPS, and Cloudflare calls the origin over HTTP. If the origin redirects every HTTP request to HTTPS, the browser loops. Full: Cloudflare calls the origin over HTTPS but does not check that the certificate is valid or unexpired. Full (strict): the origin certificate must be unexpired, issued by a public CA or Cloudflare Origin CA, and the name on the certificate must match the hostname.',
    ),
    architecture: t(
      'Chứng chỉ cạnh (Universal SSL) nằm trên Cloudflare, cho hostname đang Proxied. Ở full setup, Universal SSL phủ apex và subdomain một cấp (www), không phủ tên sâu hơn như app.dev.example.com — tên sâu cần chứng chỉ khác. Ở CNAME setup, mỗi subdomain proxied có chứng chỉ Universal SSL riêng. Chứng chỉ origin là chứng chỉ trên máy chủ của bạn, khác với chứng chỉ cạnh.',
      'The edge certificate (Universal SSL) sits on Cloudflare, for hostnames that are Proxied. On a full setup, Universal SSL covers the apex and one subdomain level (www), not a deeper name such as app.dev.example.com — deeper names need another certificate. On a CNAME setup, each proxied subdomain gets its own Universal SSL certificate. The origin certificate is the one on your server. It is not the edge certificate.',
    ),
    whenToUse: t(
      'Dùng Full (strict) khi origin có chứng chỉ hợp lệ. Đó là hướng docs khuyên khi làm được. Origin CA của Cloudflare dùng được nếu origin chưa có chứng chỉ public.',
      'Use Full (strict) when the origin has a valid certificate. That is the mode the docs recommend when you can use it. Cloudflare Origin CA works if the origin does not yet have a public certificate.',
    ),
    whenNot: t(
      'Đừng dùng Flexible khi origin chỉ nhận HTTPS hoặc tự chuyển HTTP sang HTTPS. Đừng dùng Off. Full (không strict) chỉ là bước tạm: Cloudflare không kiểm tra chứng chỉ origin.',
      'Do not use Flexible when the origin accepts only HTTPS or redirects HTTP to HTTPS. Do not use Off. Full (not strict) is only a temporary step: Cloudflare does not validate the origin certificate.',
    ),
    planNotes: t(
      `Các mode SSL là cấu hình zone, không phải bảng giá riêng trong bài này. Universal SSL là chứng chỉ cạnh mặc định cho record Proxied; giới hạn tên miền nằm ở trang limitations. Nguồn: ${source('https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/')} và ${source('https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/')} (${CHECKED}).`,
      `SSL modes are a zone setting, not a separate price in this lesson. Universal SSL is the default edge certificate for Proxied records; hostname coverage is on the limitations page. Sources: ${source('https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/')} and ${source('https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/')} (${CHECKED}).`,
    ),
    terms: [
      {
        term: 'Full (strict)',
        detail: t(
          'HTTPS tới origin, và Cloudflare kiểm tra chứng chỉ origin.',
          'HTTPS to the origin, and Cloudflare checks the origin certificate.',
        ),
      },
      {
        term: 'Origin CA',
        detail: t(
          'Chứng chỉ Cloudflare cấp để cài lên origin. Trình duyệt khách không dùng chứng chỉ này trực tiếp.',
          'A certificate Cloudflare issues for you to install on the origin. Visitors’ browsers do not use this certificate directly.',
        ),
      },
    ],
  },
  { prerequisites: ['as-k-dns'] },
);

export const asWafLesson: KnowledgeLesson = lesson(
  'as-k-waf',
  t('WAF, rate limit và bot: ba lớp khác nhau', 'WAF, rate limiting, and bots: three different layers'),
  t(
    'WAF managed chặn kiểu tấn công đã biết. Custom rule là luật bạn viết. Rate limit chặn khi một máy gửi quá nhiều request. Bot Fight, Super Bot Fight và Bot Management là ba sản phẩm bot khác nhau, không phải ba mức của cùng một nút.',
    'Managed WAF blocks known attack patterns. A custom rule is a rule you write. Rate limiting blocks a client that sends too many requests. Bot Fight Mode, Super Bot Fight Mode, and Bot Management are three different bot products, not three levels of one switch.',
  ),
  {
    how: t(
      'Request qua proxy mới vào các lớp này. Custom rule chạy trước. Rate limit chạy sau custom rule. Managed Rules là bộ luật Cloudflare giữ. Bạn có thể để một luật ở Log để xem nó có chặn nhầm không, rồi mới đổi sang Block. Bot Fight Mode (Free) không nằm trong Ruleset Engine nên custom rule không Skip được nó. Super Bot Fight Mode thì Skip được.',
      'These layers only see requests that pass through the proxy. Custom rules run first. Rate limiting runs after custom rules. Managed Rules are the sets Cloudflare maintains. You can leave a rule on Log to see if it would block real users, then switch it to Block. Bot Fight Mode (Free) is not in the Ruleset Engine, so a custom rule cannot Skip it. Super Bot Fight Mode can be skipped.',
    ),
    architecture: t(
      'Nên nghĩ theo path: /login và /api cần rate limit chặt hơn trang tĩnh. Bot Fight Mode áp cả domain, không chọn từng path. Super Bot Fight Mode cũng áp cả domain, nhưng bạn chọn hành động theo nhóm bot (chắc chắn tự động, có thể tự động, bot đã xác minh). Bot Management (add-on Enterprise) cho điểm bot để viết custom rule theo path.',
      'Think by path: /login and /api need a tighter rate limit than a static page. Bot Fight Mode applies to the whole domain, not one path. Super Bot Fight Mode is also domain-wide, but you pick an action per bot group (definitely automated, likely automated, verified bots). Bot Management (an Enterprise add-on) gives a bot score so you can write a custom rule per path.',
    ),
    whenToUse: t(
      'Bật Free Managed Ruleset trên gói Free (nó được gắn sẵn). Viết custom rule khi bạn biết path cần chặn hoặc challenge. Thêm một rate limit cho form hoặc login. Bật Bot Fight Mode trên Free nếu bạn chấp nhận không tạo ngoại lệ.',
      'Turn on the Free Managed Ruleset on the Free plan (it is deployed for you). Write a custom rule when you know a path to block or challenge. Add one rate limiting rule for a form or login. Turn on Bot Fight Mode on Free if you can accept that you cannot make exceptions.',
    ),
    whenNot: t(
      'Đừng đổi sang Block ngay nếu bạn chưa xem Security Events. Đừng kỳ vọng Bot Fight Mode bỏ qua một IP giám sát — nó không Skip được. Đừng mua Bot Management chỉ để bật công tắc bot trên Free: đó là add-on Enterprise.',
      'Do not switch to Block before you have looked at Security Events. Do not expect Bot Fight Mode to ignore a monitoring IP — it cannot be skipped. Do not buy Bot Management just to turn on the Free bot switch: it is an Enterprise add-on.',
    ),
    planNotes: t(
      `Số liệu kiểm tra ${CHECKED}. Custom rule: Free 5, Pro 20, Business 100, Enterprise 1.000. Regex từ Business; action Log chỉ Enterprise. Rate limit: Free 1 luật (đếm 10 giây, action Block), Pro 2, Business 5. Enterprise: bảng docs ghi 100 khi hợp đồng có application security, và footnote nói số luật phụ thuộc hợp đồng. Managed Rules: Free chỉ Free Managed Ruleset (gắn sẵn trên Free); Pro trở lên có Cloudflare Managed Ruleset. Bot Fight Mode trên Free, custom rule không Skip được. Super Bot Fight Mode trên Pro, Business và Enterprise (khi chưa có add-on Bot Management); custom rule với action Skip thì bỏ qua được. Nguồn: ${source('https://developers.cloudflare.com/waf/custom-rules/')} , ${source('https://developers.cloudflare.com/waf/rate-limiting-rules/')} , ${source('https://developers.cloudflare.com/waf/get-started/')} , ${source('https://developers.cloudflare.com/waf/feature-interoperability/')} .`,
      `Numbers checked ${CHECKED}. Custom rules: Free 5, Pro 20, Business 100, Enterprise 1,000. Regex starts on Business; the Log action is Enterprise only. Rate limiting rules: Free 1 (10-second period, Block), Pro 2, Business 5. Enterprise: the docs table shows 100 when the contract includes application security, and a footnote says the count depends on the contract. Managed Rules: Free gets only the Free Managed Ruleset, and it is deployed by default on Free; Pro and above get the Cloudflare Managed Ruleset. Bot Fight Mode is on Free, and a custom rule cannot Skip it. Super Bot Fight Mode is on Pro, Business, and Enterprise when you do not have the Bot Management add-on; a custom rule with the Skip action can bypass it. Sources: ${source('https://developers.cloudflare.com/waf/custom-rules/')} , ${source('https://developers.cloudflare.com/waf/rate-limiting-rules/')} , ${source('https://developers.cloudflare.com/waf/get-started/')} , ${source('https://developers.cloudflare.com/waf/feature-interoperability/')} .`,
    ),
    terms: [
      {
        term: 'Managed Rules',
        detail: t(
          'Bộ luật Cloudflare viết sẵn cho lỗ hổng và kiểu tấn công đã biết.',
          'Rulesets Cloudflare writes for known vulnerabilities and attack patterns.',
        ),
      },
      {
        term: 'Rate limit',
        detail: t(
          'Giới hạn số request của một máy trong một khoảng thời gian.',
          'A cap on how many requests one client can send in a period of time.',
        ),
      },
    ],
  },
  { prerequisites: ['as-k-ssl'] },
);

export const asCacheLesson: KnowledgeLesson = lesson(
  'as-k-cache',
  t('Cache: cái gì được lưu, cái gì phải bỏ qua', 'Cache: what to store, and what to skip'),
  t(
    'Cache giữ bản sao ở mạng Cloudflare để origin đỡ phải trả lại. File tĩnh (CSS, JS, ảnh) thường cache được. HTML có đăng nhập hoặc giỏ hàng thì không.',
    'Cache keeps a copy on Cloudflare’s network so the origin does not have to answer again. Static files (CSS, JS, images) are usually safe to cache. HTML with a login or a cart is not.',
  ),
  {
    how: t(
      'Cache Rule quyết định request nào được cache, cache bao lâu, và khóa cache gồm những gì. Record phải Proxied thì rule mới có tác dụng. HIT nghĩa là Cloudflare trả từ cache. MISS nghĩa là phải hỏi origin. Purge xóa bản đã lưu sau khi bạn đổi file.',
      'A Cache Rule decides which requests are cached, for how long, and what is in the cache key. The record must be Proxied or the rule does nothing. HIT means Cloudflare answered from cache. MISS means it had to ask the origin. Purge deletes a stored copy after you change a file.',
    ),
    architecture: t(
      'Tách path: /assets có thể cache lâu. /admin, /checkout, /login thì Bypass. Khóa cache mặc định không gồm cookie riêng của bạn. Khóa theo header, cookie, hoặc query string cụ thể là của Enterprise. Bỏ qua query string, hoặc sắp thứ tự query, thì có trên mọi gói.',
      'Split by path: /assets can cache for a long time. Bypass /admin, /checkout, and /login. The default cache key does not include your private cookies. A key that includes headers, cookies, or specific query strings is Enterprise. Ignoring the query string, or sorting it, is available on every plan.',
    ),
    whenToUse: t(
      'Dùng Cache Rule khi bạn muốn nói rõ: path này cache, path kia không. Đo hit ratio sau khi bật, đừng chỉ nhìn cảm giác.',
      'Use Cache Rules when you want to say, in writing, which path is cached and which is not. Check the hit ratio after you turn them on. Do not trust a feeling.',
    ),
    whenNot: t(
      'Đừng Cache Everything trên HTML có session. Đừng giả Argo Smart Routing hay Cloudflare Images đã có trong gói zone: cả hai là sản phẩm riêng. Giá nằm trên dashboard, bài này không báo giá.',
      'Do not use Cache Everything on HTML that has a session. Do not assume Argo Smart Routing or Cloudflare Images are included in the zone plan: both are separate products. The price is on the dashboard. This lesson is not a quote.',
    ),
    planNotes: t(
      `Cache Rules có trên mọi gói. Số rule (${CHECKED}): Free 10, Pro 25, Business 50, Enterprise 300. Khóa cache theo header, cookie hoặc query cụ thể là Enterprise. Argo Smart Routing là add-on (nay nằm trong Smart Shield); xem giá trên dashboard. Cloudflare Images là sản phẩm riêng — bài này không khẳng định nó nằm trong gói nào. Nguồn: ${source('https://developers.cloudflare.com/cache/how-to/cache-rules/')} và ${source('https://developers.cloudflare.com/cache/how-to/cache-keys/')} .`,
      `Cache Rules exist on every plan. Rule counts (${CHECKED}): Free 10, Pro 25, Business 50, Enterprise 300. A cache key that uses headers, cookies, or specific query strings is Enterprise. Argo Smart Routing is an add-on (now part of Smart Shield); see the price on the dashboard. Cloudflare Images is a separate product — this lesson does not assign it to a plan. Sources: ${source('https://developers.cloudflare.com/cache/how-to/cache-rules/')} and ${source('https://developers.cloudflare.com/cache/how-to/cache-keys/')} .`,
    ),
    terms: [
      {
        term: 'Cache key',
        detail: t(
          'Những phần của request mà Cloudflare dùng để phân biệt hai bản cache.',
          'The parts of a request Cloudflare uses to tell two cached copies apart.',
        ),
      },
      {
        term: 'Purge',
        detail: t('Xóa bản cache cũ sau khi bạn đổi nội dung.', 'Delete an old cached copy after you change the content.'),
      },
    ],
  },
  { prerequisites: ['as-k-waf'] },
);

export const asApiLesson: KnowledgeLesson = lesson(
  'as-k-api',
  t('API Shield và mTLS: khi nào mới cần', 'API Shield and mTLS: when you actually need them'),
  t(
    'Khi proxy và WAF đã chạy, API public vẫn cần rate limit và custom rule. API Shield là bộ công cụ riêng cho API (schema, khám phá endpoint). mTLS là khách xuất trình chứng chỉ. Đừng trộn hai thứ này với CNAME setup.',
    'Once the proxy and WAF are working, a public API still needs rate limiting and custom rules. API Shield is a separate toolkit for APIs (schema, endpoint discovery). mTLS means the client presents a certificate. Do not mix either of these up with CNAME setup.',
  ),
  {
    how: t(
      'Docs nói bộ sản phẩm API Security, gồm API Shield, dành cho khách Enterprise. Bộ đầy đủ là add-on trả phí của Enterprise. Cùng trang đó nói ai cũng có thể dựng Mutual TLS với CA do Cloudflare quản lý. Chi tiết từng tính năng nằm ở trang plans — đối chiếu trước khi kết luận một nút có trên gói của bạn.',
      'The docs say Cloudflare API Security products, including API Shield, are for Enterprise customers. The full suite is an Enterprise paid add-on. The same page says anyone can set up Mutual TLS with a Cloudflare-managed certificate authority. Per-feature detail is on the plans page — check it before you assume a button is on your plan.',
    ),
    architecture: t(
      'Đặt API sau hostname đã Proxied. Rate limit và custom rule là lớp bạn đã có ở bài WAF. API Shield thêm việc biết API có những endpoint nào và schema nào. mTLS thêm việc chỉ nhận client có chứng chỉ. Cả hai không thay WAF.',
      'Put the API on a hostname that is already Proxied. Rate limiting and custom rules are the layers from the WAF lesson. API Shield adds “which endpoints and which schema”. mTLS adds “only clients with a certificate”. Neither replaces the WAF.',
    ),
    whenToUse: t(
      'Đọc bài này khi bạn có API public và muốn biết bước tiếp theo sau WAF. Làm lab hub as-5 sau khi đã hiểu phần này.',
      'Read this when you have a public API and you want to know the step after the WAF. Do the hub lab as-5 after this page.',
    ),
    whenNot: t(
      'Đừng bật API Shield trước khi zone và proxy ổn. Đừng dùng bài này để báo giá add-on. Nếu dashboard không hiện tính năng, tin dashboard và trang plans, không tin trí nhớ.',
      'Do not turn on API Shield before the zone and proxy are stable. Do not use this page as a quote for the add-on. If the dashboard does not show a feature, trust the dashboard and the plans page, not memory.',
    ),
    planNotes: t(
      `API Shield: Enterprise, bộ đầy đủ là add-on. mTLS với CA Cloudflare: docs nói ai cũng dựng được — xem trang sản phẩm trước khi làm lab. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/api-shield/')} và ${source('https://developers.cloudflare.com/api-shield/plans/')} .`,
      `API Shield: Enterprise, and the full suite is an add-on. mTLS with a Cloudflare CA: the docs say anyone can set it up — read the product page before the lab. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/api-shield/')} and ${source('https://developers.cloudflare.com/api-shield/plans/')} .`,
    ),
    terms: [
      {
        term: 'mTLS',
        detail: t(
          'Cả hai phía xuất trình chứng chỉ. Khác với HTTPS thường, nơi chỉ server có chứng chỉ.',
          'Both sides present a certificate. Different from normal HTTPS, where only the server has one.',
        ),
      },
      {
        term: 'Schema',
        detail: t(
          'Bản mô tả request API được phép trông như thế nào.',
          'A description of what an allowed API request looks like.',
        ),
      },
    ],
  },
  { prerequisites: ['as-k-cache'] },
);

export const asTrafficLesson: KnowledgeLesson = lesson(
  'as-k-traffic',
  t('DDoS, Load Balancing và Waiting Room', 'DDoS, Load Balancing, and Waiting Room'),
  t(
    'Ba việc khác nhau. DDoS protection bật sẵn trên mọi gói khi traffic đi qua Cloudflare. Load Balancing chia traffic sang nhiều origin và là add-on. Waiting Room xếp hàng khi quá đông, không có trên Free và Pro.',
    'Three different jobs. DDoS protection is always on for every plan when traffic goes through Cloudflare. Load Balancing spreads traffic across origins and is an add-on. Waiting Room queues people when a page is too busy. It is not on Free or Pro.',
  ),
  {
    how: t(
      'DDoS L7 (HTTP) và L3/L4 (mạng) chạy tự động, bạn không phải bật. Bảo vệ DDoS cho hạ tầng DNS authoritative chỉ có khi domain dùng full setup, vì CNAME setup không dùng nameserver Cloudflare. Load Balancing theo dõi origin khỏe hay không rồi chuyển traffic. Waiting Room giữ khách trên trang chờ thay vì để origin ngã.',
      'HTTP (L7) and network (L3/L4) DDoS protection run on their own. You do not turn them on. DDoS protection for authoritative DNS only exists on a full setup, because a CNAME setup does not use Cloudflare’s nameservers. Load Balancing watches whether an origin is healthy and moves traffic. Waiting Room holds visitors on a queue page instead of letting the origin fall over.',
    ),
    architecture: t(
      'Một origin ổn và đã Proxied đã có DDoS của Cloudflare. Thêm Load Balancing khi bạn thật sự có nhiều origin hoặc cần failover. Thêm Waiting Room khi một path (bán vé, mở bán) sẽ đông hơn origin chịu nổi. Cả hai đều sau bài cache và WAF, không phải bước đầu.',
      'One healthy, Proxied origin already has Cloudflare’s DDoS protection. Add Load Balancing when you really have several origins or you need failover. Add Waiting Room when one path (a sale, a ticket drop) will be busier than the origin can take. Both come after the cache and WAF lessons, not at the start.',
    ),
    whenToUse: t(
      'Đọc để biết bạn chưa cần mua gì. Làm lab hub as-6 khi bạn đã có hơn một origin, hoặc một sự kiện đông trên một path.',
      'Read this to see what you do not need to buy yet. Do the hub lab as-6 when you already have more than one origin, or a busy event on one path.',
    ),
    whenNot: t(
      'Đừng mua Load Balancing cho một origin duy nhất. Đừng bật Waiting Room cho cả site nếu chỉ một path đông. Đừng kỳ vọng CNAME setup có cùng lớp DDoS cho DNS authoritative như full setup.',
      'Do not buy Load Balancing for a single origin. Do not put Waiting Room on the whole site if only one path is busy. Do not expect a CNAME setup to have the same authoritative-DNS DDoS layer as a full setup.',
    ),
    planNotes: t(
      `Kiểm tra ${CHECKED}. DDoS HTTP và mạng: mọi gói, luôn bật. Waiting Room: không có trên Free và Pro; Business và Enterprise có 1 phòng cơ bản; tính năng nâng cao là add-on Enterprise. Load Balancing: add-on, không nằm trong gói zone — giá trên dashboard, bài này không chép giá. Nguồn: ${source('https://developers.cloudflare.com/waf/feature-interoperability/')} , ${source('https://developers.cloudflare.com/waiting-room/plans/')} , ${source('https://developers.cloudflare.com/load-balancing/')} , ${source('https://developers.cloudflare.com/dns/zone-setups/partial-setup/')} .`,
      `Checked ${CHECKED}. HTTP and network DDoS: every plan, always on. Waiting Room: not on Free or Pro; Business and Enterprise include one basic room; advanced features are an Enterprise add-on. Load Balancing: an add-on, not part of the zone plan — the price is on the dashboard, and this lesson does not copy it. Sources: ${source('https://developers.cloudflare.com/waf/feature-interoperability/')} , ${source('https://developers.cloudflare.com/waiting-room/plans/')} , ${source('https://developers.cloudflare.com/load-balancing/')} , ${source('https://developers.cloudflare.com/dns/zone-setups/partial-setup/')} .`,
    ),
    terms: [
      {
        term: 'Waiting Room',
        detail: t(
          'Trang chờ khi quá nhiều người vào cùng một lúc.',
          'A queue page for when too many people arrive at once.',
        ),
      },
      {
        term: 'Load Balancing',
        detail: t(
          'Chia request sang nhiều origin và bỏ origin đang hỏng.',
          'Spread requests across origins and skip one that is down.',
        ),
      },
    ],
  },
  { prerequisites: ['as-k-api'] },
);
