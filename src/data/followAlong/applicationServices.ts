import type { FollowAlongLesson } from './types';
import { t } from './helpers';

const CF_ADD_SITE = 'https://developers.cloudflare.com/fundamentals/setup/manage-domains/add-site/';
const CF_DNS = 'https://developers.cloudflare.com/dns/manage-dns-records/';
const CF_PROXY = 'https://developers.cloudflare.com/dns/proxy-status/';
const CF_SSL = 'https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/';
const CF_ORIGIN_CA = 'https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/';
const CF_WAF = 'https://developers.cloudflare.com/waf/managed-rules/';
const CF_RL = 'https://developers.cloudflare.com/waf/rate-limiting-rules/';
const CF_BOTS = 'https://developers.cloudflare.com/bots/';
const CF_CACHE = 'https://developers.cloudflare.com/cache/how-to/cache-rules/';
const CF_APPSEC = 'https://developers.cloudflare.com/learning-paths/application-security/';
const CF_DNS_BP = 'https://developers.cloudflare.com/learning-paths/dns-best-practices/';
const CF_DDOS = 'https://developers.cloudflare.com/learning-paths/prevent-ddos-attacks/';
const CF_LB = 'https://developers.cloudflare.com/learning-paths/load-balancing/';
const CF_API = 'https://developers.cloudflare.com/api-shield/';

export const applicationServicesFollowAlong: FollowAlongLesson[] = [
  {
    lessonId: 'as-0-l1',
    role: 'required',
    goal: t(
      'Hiểu bức tranh User → DNS/proxy → SSL → WAF/Bot → Cache → Origin và thứ tự xây — trước khi đổi nameserver.',
      'See the picture User → DNS/proxy → SSL → WAF/Bot → Cache → Origin and the order you build it — before you change nameservers.',
      'មើលរូប User → DNS/proxy → SSL → WAF/Bot → Cache → Origin និងលំដាប់ដែលអ្នកសាង — មុនពេលអ្នកប្តូរ nameservers។',
    ),
    who: t('Chủ site / IT / DevOps / Security', 'Site owner / IT / DevOps / Security', 'ម្ចាស់ site / IT / DevOps / Security'),
    time: t('15 phút đọc', '15 min read', '15 នាទីអាន'),
    finishWith: t(
      'Quyết định đã ghi: domain, path login/API đầu tiên, plan, và bạn biết proxy phải bật trước WAF/cache.',
      'Written decisions: domain, first login/API path, plan, and you know proxy must be on before WAF/cache.',
      'ការសម្រេចចិត្តដែលបានសរសេរ៖ domain, path login/API ដំបូង, plan, និងអ្នកដឹងថា proxy ត្រូវតែបើកមុន WAF/cache។',
    ),
    beforeYouBegin: t('Một domain đang phục vụ traffic (hoặc staging). Không cần Worker.', 'A domain already serving traffic (or staging). No Worker required.', 'Domain មួយកំពុង serve traffic រួច (ឬ staging)។ មិនត្រូវការ Worker។'),
    intro: t(
      'Cloudflare Application Services đặt một lớp giữa visitor và origin:\n\nVisitor → DNS (nameserver hoặc CNAME) → Proxy (orange cloud) → SSL/TLS → WAF / Bot / Rate limit → Cache / Speed → Origin.\n\nLàm theo thứ tự. Proxy tắt = Cloudflare chỉ trả lời DNS — WAF và cache không chạy. Dừng sau bất kỳ phần bắt buộc nào vẫn có giá trị (zone + SSL đã là win).',
      'Cloudflare Application Services sits between visitors and origin:\n\nVisitor → DNS (nameservers or CNAME) → Proxy (orange cloud) → SSL/TLS → WAF / Bot / Rate limit → Cache / Speed → Origin.\n\nWork in order. Proxy off = Cloudflare only answers DNS — WAF and cache do not run. Stopping after any required module still leaves something useful (a zone + SSL is already a win).',
      'Cloudflare Application Services ស្ថិតនៅចន្លោះ visitors និង origin៖\n\nVisitor → DNS (nameservers ឬ CNAME) → Proxy (orange cloud) → SSL/TLS → WAF / Bot / Rate limit → Cache / Speed → Origin។\n\nធ្វើតាមលំដាប់។ Proxy បិទ = Cloudflare ឆ្លើយតែ DNS — WAF និង cache មិនរត់។ ការឈប់បន្ទាប់ពី module ណាមួយដែលត្រូវការ នៅតែទុកអ្វីមានប្រយោជន៍ (zone + SSL គឺជា win រួច)។',
    ),
    steps: [
      {
        action: t('Viết bốn quyết định trước khi Add a site.', 'Write four decisions before Add a site.', 'សរសេរការសម្រេចចិត្ត 4 មុន Add a site។'),
        enter: t(
          '1) hostname production (www vs apex)  2) path nhạy cảm đầu tiên (/login hoặc /api)  3) plan hiện tại  4) ai giữ quyền registrar',
          '1) production hostname (www vs apex)  2) first sensitive path (/login or /api)  3) current plan  4) who holds registrar access',
          '1) production hostname (www vs apex)  2) path sensitive ដំបូង (/login ឬ /api)  3) plan បច្ចុប្បន្ន  4) អ្នកណារក្សា registrar access',
        ),
        checkpoint: t('Bốn dòng đã ghi — không đoán khi đang đổi nameserver.', 'Four lines written — do not improvise while changing nameservers.', '4 បន្ទាត់បានសរសេរ — កុំប៉ាន់ស្មានពេលកំពុងប្តូរ nameserver។'),
      },
      {
        action: t('Gắn mỗi lớp với module phía dưới.', 'Map each layer to the modules below.', 'ភ្ជាប់ស្រទាប់នីមួយៗទៅ modules ខាងក្រោម។'),
        see: t(
          'DNS + review = Phần 1. Proxy = Phần 1 bài 2. SSL + origin lock = Phần 2. WAF/rate/bot = Phần 3. Cache/Speed = Phần 4. Observe = Phần 4 bài 4. API Shield và Load Balancing là tùy chọn sau nền.',
          'DNS + review = Part 1. Proxy = Part 1 lesson 2. SSL + origin lock = Part 2. WAF/rate/bot = Part 3. Cache/Speed = Part 4. Observe = Part 4 lesson 4. API Shield and Load Balancing are optional after the spine.',
          'DNS + review = Part 1។ Proxy = Part 1 lesson 2។ SSL + origin lock = Part 2។ WAF/rate/bot = Part 3។ Cache/Speed = Part 4។ Observe = Part 4 lesson 4។ API Shield និង Load Balancing ជាជម្រើសបន្ទាប់ពី spine។',
        ),
      },
      {
        action: t('Chọn use case sau khi xong nền — không trước.', 'Pick a use case after the spine — not before.', 'ជ្រើស use case បន្ទាប់ពី spine — មិនមែនមុន។'),
        see: t(
          'protect-website, secure-api, defend-ddos là cửa chọn. Track này xây DNS→proxy→SSL→WAF trước, rồi mới rẽ API Shield hoặc Load Balancing.',
          'protect-website, secure-api, and defend-ddos are doorways. This track builds DNS→proxy→SSL→WAF first, then branches to API Shield or Load Balancing.',
          'protect-website, secure-api, និង defend-ddos គឺជាច្រក។ Track នេះសាង DNS→proxy→SSL→WAF មុន, រួចសាខាទៅ API Shield ឬ Load Balancing។',
        ),
      },
    ],
    watchOuts: [
      t('Đổi nameserver trước khi review MX/TXT — email và xác thực domain có thể gãy.', 'Changing nameservers before reviewing MX/TXT can break email and domain verification.', 'ការប្តូរ nameservers មុនពិនិត្យ MX/TXT អាចបំបែក email និង domain verification។'),
      t('Bật WAF/cache khi record còn DNS only — không có hiệu lực trên HTTP.', 'Turning on WAF/cache while the record is DNS only has no effect on HTTP.', 'ការបើក WAF/cache ពេល record នៅតែ DNS only មិនមានឥទ្ធិពលលើ HTTP។'),
    ],
    tips: [
      t('Nhiều team: ngày 1 zone + proxy + Full (strict); ngày 2 WAF simulate; tuần 2 cache rules và report.', 'Many teams: day 1 zone + proxy + Full (strict); day 2 WAF simulate; week 2 cache rules and a report.', 'ក្រុមជាច្រើន៖ day 1 zone + proxy + Full (strict); day 2 WAF Simulate; week 2 cache rules និង report។'),
      t('Nhãn menu dashboard có thể đổi — chọn mục tương đương gần nhất.', 'Dashboard labels shift — follow the nearest equivalent.', 'Dashboard labels ផ្លាស់ — តាម equivalent ដែលជិតបំផុត។'),
    ],
    officialDocs: [
      { label: t('Add a site', 'Add a site', 'Add a site'), url: CF_ADD_SITE },
      { label: t('Application security learning path', 'Application security learning path', 'Application security learning path'), url: CF_APPSEC },
      { label: t('DNS best practices', 'DNS best practices', 'DNS best practices'), url: CF_DNS_BP },
    ],
  },
  {
    lessonId: 'as-1-l1',
    role: 'required',
    goal: t(
      'Tạo zone, review mọi DNS record, rồi mới đổi nameserver (hoặc hoàn tất CNAME setup).',
      'Create the zone, review every DNS record, then change nameservers (or finish CNAME setup).',
      'បង្កើត zone, ពិនិត្យ DNS record គ្រប់មួយ, រួចប្តូរ nameservers (ឬបញ្ចប់ CNAME setup)។',
    ),
    who: t('Người giữ quyền registrar + người hiểu origin hiện tại', 'Registrar owner + whoever knows the current origin', 'ម្ចាស់ registrar + អ្នកដែលស្គាល់ origin បច្ចុប្បន្ន'),
    time: t('~30 phút (chờ nameserver tùy registrar)', '~30 min (nameserver wait depends on registrar)', '~30 នាទី (ការរង់ចាំ nameserver អាស្រ័យលើ registrar)'),
    finishWith: t(
      'Zone Active, bảng DNS khớp origin/MX/TXT, screenshot đã lưu để rollback.',
      'Zone Active, DNS table matches origin/MX/TXT, screenshot saved for rollback.',
      'Zone Active, តារាង DNS ត្រូវនឹង origin/MX/TXT, screenshot រក្សាទុកសម្រាប់ rollback។',
    ),
    beforeYouBegin: t(
      'Email nhận được mail Cloudflare; quyền đổi nameserver; danh sách record hiện tại từ DNS cũ (hoặc zone file).',
      'Inbox for Cloudflare mail; permission to change nameservers; current records from the old DNS (or a zone file).',
      'Inbox សម្រាប់ Cloudflare mail; សិទ្ធិប្តូរ nameservers; records បច្ចុប្បន្នពី DNS ចាស់ (ឬ zone file)។',
    ),
    planNote: t('Add a site có trên Free. Business/Enterprise có partial (CNAME) setup nếu không muốn đổi nameserver.', 'Add a site works on Free. Business/Enterprise can use partial (CNAME) setup if you cannot change nameservers.', 'Add a site ដំណើរការលើ Free។ Business/Enterprise អាចប្រើ partial (CNAME) setup ប្រសិនបើអ្នកមិនអាចប្តូរ nameservers។'),
    steps: [
      {
        action: t('Đăng nhập dash.cloudflare.com → Onboard a domain / Add a site.', 'Sign in at dash.cloudflare.com → Onboard a domain / Add a site.', 'ចូលនៅ dash.cloudflare.com → Onboard a domain / Add a site។'),
        click: t('Add a site (hoặc Onboard a domain)', 'Add a site (or Onboard a domain)', 'Add a site (ឬ Onboard a domain)'),
        enter: t('example.com (apex, không có https://)', 'example.com (apex, no https://)', 'example.com (apex, គ្មាន https://)'),
        see: t('Màn chọn plan, rồi Cloudflare quét record hiện có hoặc cho import zone file.', 'Plan picker, then Cloudflare scans existing records or lets you import a zone file.', 'Plan picker, រួច Cloudflare ស្កេន records ដែលមាន ឬឲ្យអ្នក import zone file។'),
      },
      {
        action: t('Chọn plan. Free đủ để học Phần 1–4; nâng cấp sau nếu cần Bot Management / LB.', 'Pick a plan. Free is enough to learn Parts 1–4; upgrade later for Bot Management / LB.', 'ជ្រើស plan។ Free គ្រប់គ្រាន់ដើម្បីរៀន Parts 1–4; upgrade ក្រោយសម្រាប់ Bot Management / LB។'),
        checkpoint: t('Plan đã chọn — bạn biết WAF nâng cao và LB có thể bị greyed out.', 'Plan selected — you know advanced WAF and LB may be greyed out.', 'Plan បានជ្រើស — អ្នកដឹងថា WAF កម្រិតខ្ពស់ និង LB អាច greyed out។'),
      },
      {
        action: t('Review từng record trước khi continue.', 'Review every record before continue.', 'ពិនិត្យ record គ្រប់មួយមុន continue។'),
        see: t('A/AAAA/CNAME trỏ origin thật; MX cho email; TXT cho SPF/DKIM/DMARC/verification; SRV nếu có.', 'A/AAAA/CNAME point at the real origin; MX for email; TXT for SPF/DKIM/DMARC/verification; SRV if any.', 'A/AAAA/CNAME ចង្អុលទៅ origin ពិត; MX សម្រាប់ email; TXT សម្រាប់ SPF/DKIM/DMARC/verification; SRV បើមាន។'),
        checkpoint: t('Không thiếu MX/TXT so với DNS cũ. Chụp screenshot bảng DNS.', 'No missing MX/TXT versus old DNS. Screenshot the DNS table.', 'គ្មាន MX/TXT ខកខានធៀបនឹង DNS ចាស់។ Screenshot តារាង DNS។'),
      },
      {
        action: t('Hạ TTL trên DNS cũ (nếu còn quyền) rồi đổi nameserver tại registrar theo đúng hai hostname Cloudflare đưa.', 'Lower TTL on old DNS (if you still can), then change nameservers at the registrar to the two hostnames Cloudflare shows.', 'បន្ថយ TTL លើ DNS ចាស់ (បើអ្នកនៅអាច), រួចប្តូរ nameservers នៅ registrar ទៅ hostname ពីរដែល Cloudflare បង្ហាញ។'),
        enter: t('Hai nameserver dạng *.ns.cloudflare.com — copy nguyên, không đoán.', 'Two nameservers like *.ns.cloudflare.com — copy exactly, do not guess.', 'Nameservers ពីរដូច *.ns.cloudflare.com — copy ឲ្យត្រឹមត្រូវ, កុំទាយ។'),
        checkpoint: t('Registrar đã lưu NS mới. Dashboard zone chuyển về Active (có thể mất vài phút đến 24–48h).', 'Registrar saved the new NS. Dashboard zone becomes Active (minutes to 24–48h).', 'Registrar បានរក្សា NS ថ្មី។ Dashboard zone ក្លាយ Active (នាទីទៅ 24–48h)។'),
      },
      {
        action: t('Nếu dùng CNAME / partial setup: chỉ hostname bạn chọn đi qua Cloudflare; apex có thể cần CNAME flattening hoặc giữ DNS cũ.', 'If using CNAME / partial setup: only the hostnames you pick go through Cloudflare; apex may need CNAME flattening or stay on old DNS.', 'បើប្រើ CNAME / partial setup៖ មានតែ hostnames ដែលអ្នកជ្រើសទៅកាត់ Cloudflare; apex អាចត្រូវការ CNAME flattening ឬនៅលើ DNS ចាស់។'),
        checkpoint: t('Ít nhất một hostname production resolve về Cloudflare.', 'At least one production hostname resolves to Cloudflare.', 'យ៉ាងហោចណាស់ production hostname មួយ resolve ទៅ Cloudflare។'),
      },
    ],
    watchOuts: [
      t('Đổi NS khi DNSSEC còn DS record ở registrar — resolution có thể fail. Gỡ DS trước, bật DNSSEC lại trên Cloudflare sau.', 'Changing NS while a DS record remains at the registrar can fail resolution. Remove DS first; re-enable DNSSEC on Cloudflare later.', 'ការប្តូរ NS ពេល DS record នៅសល់នៅ registrar អាចធ្វើឲ្យ resolution fail។ លុប DS មុន; បើក DNSSEC ម្តងទៀតលើ Cloudflare ក្រោយ។'),
      t('Import thiếu record verification (Google, Microsoft 365) — mất mail hoặc admin lockout.', 'Missing verification records (Google, Microsoft 365) — lose mail or admin lockout.', 'ខកខាន verification records (Google, Microsoft 365) — បាត់ mail ឬ admin lockout។'),
    ],
    tips: [
      t('Rollback = đổi nameserver về DNS cũ (vì vậy mới cần screenshot).', 'Rollback = point nameservers back at old DNS (that is why you screenshot).', 'Rollback = ចង្អុល nameservers ត្រឡប់ទៅ DNS ចាស់ (នោះហើយជាមូលហេតុដែលអ្នក screenshot)។'),
      t('Xem learning path DNS best practices trước cutover production lớn.', 'Read the DNS best-practices learning path before a large production cutover.', 'អាន DNS best-practices learning path មុន production cutover ធំ។'),
    ],
    officialDocs: [
      { label: t('Add a site', 'Add a site', 'Add a site'), url: CF_ADD_SITE },
      { label: t('DNS records', 'DNS records', 'DNS records'), url: CF_DNS },
      { label: t('DNS best practices', 'DNS best practices', 'DNS best practices'), url: CF_DNS_BP },
    ],
  },
  {
    lessonId: 'as-1-l2',
    role: 'required',
    goal: t(
      'Bật proxy (orange cloud) đúng record HTTP/HTTPS public; giữ DNS only cho mail và hostname nội bộ.',
      'Turn proxy (orange cloud) on for public HTTP/HTTPS records; keep DNS only for mail and internal hostnames.',
      'បើក proxy (orange cloud) សម្រាប់ HTTP/HTTPS records សាធារណៈ; រក្សា DNS only សម្រាប់ mail និង hostnames ខាងក្នុង។',
    ),
    who: t('Người vừa onboard zone', 'Whoever just onboarded the zone', 'អ្នកដែលទើប onboard zone'),
    time: t('~15 phút', '~15 min', '~15 នាទី'),
    finishWith: t(
      'www (và/hoặc apex) proxied; MX/TXT grey-cloud; request HTTPS có header CF-Ray.',
      'www (and/or apex) proxied; MX/TXT grey-cloud; HTTPS request shows a CF-Ray header.',
      'www (និង/ឬ apex) proxied; MX/TXT grey-cloud; HTTPS request បង្ហាញ header CF-Ray។',
    ),
    beforeYouBegin: t('Zone Active (as-1-l1). Biết hostname nào phục vụ website/API.', 'Zone Active (as-1-l1). You know which hostnames serve the website/API.', 'Zone Active (as-1-l1)។ អ្នកដឹងថា hostnames ណា serve website/API។'),
    planNote: t('Proxy status có trên mọi plan.', 'Proxy status is on every plan.', 'Proxy status មានលើគ្រប់ plan។'),
    steps: [
      {
        action: t('DNS → Records. Bật proxy cho A/AAAA/CNAME của website và API public.', 'DNS → Records. Enable proxy on A/AAAA/CNAME for the public website and API.', 'DNS → Records។ បើក proxy លើ A/AAAA/CNAME សម្រាប់ website និង API សាធារណៈ។'),
        click: t('Đám mây cam (Proxied) trên record www và (nếu dùng) apex', 'Orange cloud (Proxied) on www and (if used) apex', 'Orange cloud (Proxied) លើ www និង (បើប្រើ) apex'),
        see: t('Status Proxied — traffic HTTP/S đi qua edge.', 'Status Proxied — HTTP/S traffic goes through the edge.', 'Status Proxied — HTTP/S traffic ឆ្លងកាត់ edge។'),
      },
      {
        action: t('Giữ DNS only (grey cloud) cho MX và hostname không nên qua HTTP proxy (mail, một số VPN/SIP).', 'Keep DNS only (grey cloud) for MX and hostnames that must not hit the HTTP proxy (mail, some VPN/SIP).', 'រក្សា DNS only (grey cloud) សម្រាប់ MX និង hostnames ដែលត្រូវតែមិនបុក HTTP proxy (mail, VPN/SIP ខ្លះ)។'),
        checkpoint: t('Không có MX nào đang Proxied.', 'No MX record is Proxied.', 'គ្មាន MX record ណាជា Proxied។'),
      },
      {
        action: t('Xác nhận traffic đi qua Cloudflare.', 'Confirm traffic goes through Cloudflare.', 'បញ្ជាក់ថា traffic ឆ្លងកាត់ Cloudflare។'),
        enter: t('curl -sI https://www.example.com | grep -i cf-ray', 'curl -sI https://www.example.com | grep -i cf-ray', 'curl -sI https://www.example.com | grep -i cf-ray'),
        checkpoint: t('Có CF-Ray (và thường cf-cache-status). dig/nslookup hostname trỏ Anycast Cloudflare, không còn IP origin nếu record proxied.', 'CF-Ray is present (often cf-cache-status too). dig/nslookup for a proxied hostname shows Cloudflare anycast, not the origin IP.', 'CF-Ray មាន (ជាញឹកញាប់ cf-cache-status ផង)។ dig/nslookup សម្រាប់ hostname ដែល proxied បង្ហាញ Cloudflare anycast, មិនមែន origin IP។'),
      },
    ],
    watchOuts: [
      t('Proxy SMTP/mail — mail gãy. MX luôn DNS only.', 'Proxying SMTP/mail breaks mail. MX stays DNS only.', 'ការធ្វើ proxy SMTP/mail បំបែក mail។ MX នៅតែ DNS only។'),
      t('Hostname nội bộ (staging chỉ VPN) mà bật proxy sẽ lộ qua Internet.', 'Internal hostnames (VPN-only staging) become Internet-facing if proxied.', 'Hostnames ខាងក្នុង (staging តែ VPN) ក្លាយជា Internet-facing បើ proxied។'),
    ],
    tips: [
      t('Proxy là công tắc WAF, cache, SSL edge. Chưa cam = chưa có lớp đó.', 'Proxy is the switch for WAF, cache, and edge SSL. Grey cloud = those layers are off.', 'Proxy គឺជាកុងតាក់សម្រាប់ WAF, cache, និង edge SSL។ Grey cloud = ស្រទាប់ទាំងនោះបិទ។'),
      t('Apex (example.com) proxied được — Cloudflare flatten CNAME khi cần.', 'Apex (example.com) can be proxied — Cloudflare flattens CNAMEs when needed.', 'Apex (example.com) អាច proxied — Cloudflare flatten CNAMEs ពេលត្រូវការ។'),
    ],
    officialDocs: [
      { label: t('Proxy status', 'Proxy status', 'Proxy status'), url: CF_PROXY },
      { label: t('How Cloudflare works', 'How Cloudflare works', 'How Cloudflare works'), url: 'https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/' },
    ],
  },
  {
    lessonId: 'as-2-l1',
    role: 'required',
    goal: t(
      'Chọn SSL/TLS mode đúng — Full (strict) khi origin có cert hợp lệ — và bật Always Use HTTPS.',
      'Pick the right SSL/TLS mode — Full (strict) when the origin has a valid cert — and enable Always Use HTTPS.',
      'ជ្រើស SSL/TLS mode ត្រឹមត្រូវ — Full (strict) ពេល origin មាន cert ត្រឹមត្រូវ — ហើយបើក Always Use HTTPS។',
    ),
    who: t('DevOps / người quản lý chứng chỉ origin', 'DevOps / whoever manages the origin certificate', 'DevOps / អ្នកគ្រប់គ្រង origin certificate'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Mode Full (strict); http:// redirect sang https://; không lỗi cert trên browser incognito.',
      'Mode Full (strict); http:// redirects to https://; no cert errors in an incognito browser.',
      'Mode Full (strict); http:// redirect ទៅ https://; គ្មាន cert error ក្នុង browser incognito។',
    ),
    beforeYouBegin: t('Record production đã Proxied (as-1-l2). Biết origin nhận HTTP hay HTTPS.', 'Production records are Proxied (as-1-l2). You know whether origin expects HTTP or HTTPS.', 'Production records ជា Proxied (as-1-l2)។ អ្នកដឹងថា origin រំពឹង HTTP ឬ HTTPS។'),
    planNote: t('Encryption modes và Universal SSL có trên Free. Advanced Certificate Manager là add-on.', 'Encryption modes and Universal SSL are on Free. Advanced Certificate Manager is an add-on.', 'Encryption modes និង Universal SSL មានលើ Free។ Advanced Certificate Manager គឺ add-on។'),
    steps: [
      {
        action: t('SSL/TLS → Overview. Nếu origin có cert public hoặc Origin CA hợp lệ: chọn Full (strict).', 'SSL/TLS → Overview. If origin has a public cert or a valid Origin CA cert: choose Full (strict).', 'SSL/TLS → Overview។ បើ origin មាន public cert ឬ Origin CA cert ត្រឹមត្រូវ៖ ជ្រើស Full (strict)។'),
        click: t('Full (strict)', 'Full (strict)', 'Full (strict)'),
        see: t('Cloudflare xác thực chứng chỉ origin — không chấp nhận cert tự ký lung tung.', 'Cloudflare validates the origin certificate — random self-signed certs fail.', 'Cloudflare ផ្ទៀងផ្ទាត់ origin certificate — self-signed certs ចៃដន្យ fail។'),
      },
      {
        action: t('Tránh Flexible nếu origin chỉ nhận HTTPS — dễ redirect loop.', 'Avoid Flexible if origin is HTTPS-only — easy redirect loop.', 'ចៀស Flexible បើ origin គឺ HTTPS-only — ងាយបាន redirect loop។'),
        see: t('Flexible = Cloudflare→origin bằng HTTP. Origin redirect lên HTTPS → Cloudflare lại gọi HTTP.', 'Flexible = Cloudflare→origin over HTTP. Origin redirects to HTTPS → Cloudflare calls HTTP again.', 'Flexible = Cloudflare→origin តាម HTTP។ Origin redirect ទៅ HTTPS → Cloudflare ហៅ HTTP ម្តងទៀត។'),
      },
      {
        action: t('Bật Always Use HTTPS và Automatic HTTPS Rewrites.', 'Enable Always Use HTTPS and Automatic HTTPS Rewrites.', 'បើក Always Use HTTPS និង Automatic HTTPS Rewrites។'),
        click: t('SSL/TLS → Edge Certificates → Always Use HTTPS = On', 'SSL/TLS → Edge Certificates → Always Use HTTPS = On', 'SSL/TLS → Edge Certificates → Always Use HTTPS = On'),
        checkpoint: t('curl -sI http://www.example.com trả 301/302 tới https://. Browser incognito không cảnh báo cert.', 'curl -sI http://www.example.com returns 301/302 to https://. Incognito browser shows no cert warning.', 'curl -sI http://www.example.com ត្រឡប់ 301/302 ទៅ https://។ Browser incognito មិនបង្ហាញ cert warning។'),
      },
    ],
    watchOuts: [
      t('Full (không strict) chấp nhận cert tự ký — tiện lab, yếu cho production.', 'Full (not strict) accepts self-signed certs — fine for a lab, weak for production.', 'Full (មិន strict) ទទួល self-signed certs — ល្អសម្រាប់ lab, ខ្សោយសម្រាប់ production។'),
      t('HSTS preload trước khi chắc HTTPS ổn — rollback khó.', 'HSTS preload before HTTPS is stable makes rollback hard.', 'HSTS preload មុន HTTPS ស្ថិរភាពធ្វើឲ្យ rollback ពិបាក។'),
    ],
    tips: [
      t('Test sau mỗi đổi mode. Đây là lỗi #1 sau khi bật proxy.', 'Test after every mode change. This is the #1 issue after enabling proxy.', 'Test បន្ទាប់ពីប្តូរ mode រាល់លើក។ នេះគឺបញ្ហា #1 បន្ទាប់ពីបើក proxy។'),
      t('Chưa có cert origin? Làm bài Origin CA (as-2-l2) rồi quay lại Full (strict).', 'No origin cert yet? Do the Origin CA lesson (as-2-l2), then return to Full (strict).', 'មិនទាន់មាន origin cert? ធ្វើ lesson Origin CA (as-2-l2), រួចត្រឡប់ទៅ Full (strict)។'),
    ],
    officialDocs: [{ label: t('Encryption modes', 'Encryption modes', 'Encryption modes'), url: CF_SSL }],
  },
  {
    lessonId: 'as-2-l2',
    role: 'required',
    goal: t(
      'Cài Origin CA (nếu cần) và chặn truy cập trực tiếp IP origin — attacker không bỏ qua WAF.',
      'Install Origin CA (if needed) and block direct origin-IP access — attackers cannot bypass the WAF.',
      'ដំឡើង Origin CA (បើត្រូវការ) និងទប់ស្កាត់ access origin-IP ផ្ទាល់ — attackers មិនអាច bypass WAF។',
    ),
    who: t('DevOps / network — quyền firewall origin', 'DevOps / network — origin firewall access', 'DevOps / network — origin firewall access'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Origin nhận HTTPS từ Cloudflare; truy cập trực tiếp IP origin bị từ chối hoặc không phục vụ site.',
      'Origin accepts HTTPS from Cloudflare; direct origin-IP access is refused or does not serve the site.',
      'Origin ទទួល HTTPS ពី Cloudflare; access origin-IP ផ្ទាល់ត្រូវបានបដិសេធ ឬមិន serve site។',
    ),
    beforeYouBegin: t('Đã chọn SSL mode (as-2-l1). SSH/console origin hoặc load balancer.', 'SSL mode already chosen (as-2-l1). SSH/console on origin or the load balancer.', 'SSL mode បានជ្រើសរួច (as-2-l1)។ SSH/console លើ origin ឬ load balancer។'),
    planNote: t('Origin CA miễn phí. Authenticated Origin Pulls có trên các plan zone.', 'Origin CA is free. Authenticated Origin Pulls is available on zone plans.', 'Origin CA ឥតគិតថ្លៃ។ Authenticated Origin Pulls មានលើ zone plans។'),
    steps: [
      {
        action: t('Nếu origin chưa có cert public: SSL/TLS → Origin Server → Create Certificate (15 năm, hostnames cần thiết).', 'If origin has no public cert: SSL/TLS → Origin Server → Create Certificate (15 years, required hostnames).', 'បើ origin គ្មាន public cert៖ SSL/TLS → Origin Server → Create Certificate (15 years, hostnames ដែលត្រូវការ)។'),
        click: t('Create Certificate → RSA hoặc ECDSA', 'Create Certificate → RSA or ECDSA', 'Create Certificate → RSA ឬ ECDSA'),
        see: t('PEM cert + private key hiện một lần — lưu vào secret store, cài trên nginx/caddy/load balancer.', 'PEM cert + private key shown once — store in a secret store, install on nginx/caddy/load balancer.', 'PEM cert + private key បង្ហាញម្តង — រក្សាក្នុង secret store, ដំឡើងលើ nginx/caddy/load balancer។'),
      },
      {
        action: t('Cài cert trên origin, reload web server, xác nhận origin lắng nghe 443.', 'Install the cert on origin, reload the web server, confirm origin listens on 443.', 'ដំឡើង cert លើ origin, reload web server, បញ្ជាក់ថា origin ស្តាប់លើ 443។'),
        checkpoint: t('Từ máy có quyền: openssl s_client -connect ORIGIN_IP:443 không lỗi handshake (lab).', 'From a host that can reach it: openssl s_client -connect ORIGIN_IP:443 handshake succeeds (lab).', 'ពី host ដែលអាចទៅដល់៖ openssl s_client -connect ORIGIN_IP:443 handshake ជោគជ័យ (lab)។'),
      },
      {
        action: t('Firewall origin: chỉ cho IP Cloudflare (hoặc bật Authenticated Origin Pulls).', 'Origin firewall: allow only Cloudflare IPs (or enable Authenticated Origin Pulls).', 'Origin firewall៖ អនុញ្ញាតតែ Cloudflare IPs (ឬបើក Authenticated Origin Pulls)។'),
        see: t('Danh sách IP: developers.cloudflare.com/fundamentals/reference/cloudflare-ip-addresses/', 'IP list: developers.cloudflare.com/fundamentals/reference/cloudflare-ip-addresses/', 'IP list: developers.cloudflare.com/fundamentals/reference/cloudflare-ip-addresses/'),
        checkpoint: t('Trình duyệt tới http(s)://ORIGIN_IP không ra được homepage production (timeout, 403, hoặc vhost mặc định).', 'Browser to http(s)://ORIGIN_IP does not serve the production homepage (timeout, 403, or default vhost).', 'Browser ទៅ http(s)://ORIGIN_IP មិន serve homepage production (timeout, 403, ឬ default vhost)។'),
      },
    ],
    watchOuts: [
      t('Lockdown firewall trước khi proxy ổn — tự khóa mình. Làm proxy + SSL xong rồi mới thắt IP.', 'Tightening the firewall before proxy is stable locks you out. Finish proxy + SSL, then lock IPs.', 'ការតឹង firewall មុន proxy ស្ថិរភាពចាក់សោអ្នកចេញ។ បញ្ចប់ proxy + SSL, រួច lock IPs។'),
      t('Quên IPv6 trên origin allowlist nếu visitor/IPv6 đi qua Cloudflare.', 'Forgetting IPv6 on the origin allowlist if visitors/IPv6 traverse Cloudflare.', 'ភ្លេច IPv6 លើ origin allowlist បើ visitors/IPv6 ឆ្លងកាត់ Cloudflare។'),
    ],
    tips: [
      t('Authenticated Origin Pulls mạnh hơn allowlist IP đơn thuần — origin chỉ chấp nhận TLS từ Cloudflare.', 'Authenticated Origin Pulls is stronger than a bare IP allowlist — origin only accepts TLS from Cloudflare.', 'Authenticated Origin Pulls ខ្លាំងជាង IP allowlist ទទេ — origin ទទួលតែ TLS ពី Cloudflare។'),
      t('Giữ console/VPN vào origin — rollback khi allowlist sai.', 'Keep console/VPN to origin — rollback if the allowlist is wrong.', 'រក្សា console/VPN ទៅ origin — rollback បើ allowlist ខុស។'),
    ],
    officialDocs: [
      { label: t('Origin CA', 'Origin CA', 'Origin CA'), url: CF_ORIGIN_CA },
      { label: t('Cloudflare IP addresses', 'Cloudflare IP addresses', 'Cloudflare IP addresses'), url: 'https://developers.cloudflare.com/fundamentals/reference/cloudflare-ip-addresses/' },
    ],
  },
  {
    lessonId: 'as-3-l1',
    role: 'required',
    goal: t(
      'Bật WAF managed rules ở chế độ log/simulate, xem Security Events, rồi mới Block.',
      'Turn on WAF managed rules in log/simulate, watch Security Events, then Block.',
      'បើក WAF managed rules ក្នុង log/Simulate, មើល Security Events, រួច Block។',
    ),
    who: t('Security / DevOps', 'Security / DevOps', 'Security / DevOps'),
    time: t('~20 phút cấu hình + 24–48h quan sát', '~20 min setup + 24–48h watch', '~20 នាទី setup + 24–48h មើល'),
    finishWith: t(
      'Managed ruleset bật; 24–48h log không false positive nặng trên /login và /api; quyết định Block có chủ đích.',
      'Managed ruleset on; 24–48h of logs without heavy false positives on /login and /api; a deliberate Block decision.',
      'Managed ruleset បើក; 24–48h នៃ logs ដោយគ្មាន false positives ធ្ងន់លើ /login និង /api; ការសម្រេច Block ដោយចេតនា។',
    ),
    beforeYouBegin: t('Hostname đã Proxied + HTTPS ổn (Phần 1–2). Biết path login/admin/API.', 'Hostname is Proxied and HTTPS is healthy (Parts 1–2). You know login/admin/API paths.', 'Hostname ជា Proxied និង HTTPS មានសុខភាព (Parts 1–2)។ អ្នកដឹង paths login/admin/API។'),
    planNote: t('WAF managed cơ bản có trên Free/Pro với giới hạn. Ruleset đầy đủ và custom nâng cao tốt hơn ở Business/Enterprise.', 'Basic managed WAF exists on Free/Pro with limits. Fuller rulesets and advanced custom rules are better on Business/Enterprise.', 'WAF managed មូលដ្ឋានមានលើ Free/Pro ជាមួយដែនកំណត់។ Rulesets ពេញ និង custom rules កម្រិតខ្ពស់ល្អជាងលើ Business/Enterprise។'),
    steps: [
      {
        action: t('Security → WAF → Managed rules. Bật Cloudflare Managed Ruleset / OWASP (tên menu có thể là Streamlined WAF).', 'Security → WAF → Managed rules. Enable the Cloudflare Managed Ruleset / OWASP (menu may say Streamlined WAF).', 'Security → WAF → Managed rules។ បើក Cloudflare Managed Ruleset / OWASP (menu អាចនិយាយ Streamlined WAF)។'),
        click: t('Managed rules → Enable', 'Managed rules → Enable', 'Managed rules → Enable'),
      },
      {
        action: t('Đặt action mặc định là Log / Simulate trong 24–48h — không Block ngay trên production lạ.', 'Set the default action to Log / Simulate for 24–48h — do not Block immediately on an unfamiliar production site.', 'កំណត់ default action ទៅ Log / Simulate សម្រាប់ 24–48h — កុំ Block ភ្លាមលើ production site ដែលមិនស្គាល់។'),
        checkpoint: t('Security Events bắt đầu có sự kiện. Lọc path /login, /admin, /api.', 'Security Events starts showing events. Filter paths /login, /admin, /api.', 'Security Events ចាប់ផ្តើមបង្ហាញ events។ Filter paths /login, /admin, /api។'),
      },
      {
        action: t('Sau baseline: chuyển rule ổn định sang Block. Thêm custom rule cho /admin nếu cần (country, AS, hoặc challenge).', 'After a baseline: move stable rules to Block. Add a custom rule for /admin if needed (country, AS, or challenge).', 'បន្ទាប់ពី baseline៖ ផ្លាស់ rules ស្ថិរភាពទៅ Block។ បន្ថែម custom rule សម្រាប់ /admin បើត្រូវការ (country, AS, ឬ challenge)។'),
        click: t('Custom rules → Create rule', 'Custom rules → Create rule', 'Custom rules → Create rule'),
        enter: t('http.request.uri.path contains "/admin" — action Managed Challenge (ví dụ)', 'http.request.uri.path contains "/admin" — action Managed Challenge (example)', 'http.request.uri.path contains "/admin" — action Managed Challenge (example)'),
      },
      {
        action: t('Review false positive: exception cho webhook/payment path nếu bị dính OWASP.', 'Review false positives: exceptions for webhook/payment paths if OWASP hits them.', 'ពិនិត្យ false positives៖ exceptions សម្រាប់ webhook/payment paths បើ OWASP បុកពួកវា។'),
        checkpoint: t('Một ngày không có ticket “checkout chết” trước khi Block rộng.', 'A day without “checkout is dead” tickets before a wide Block.', 'មួយថ្ងៃដោយគ្មាន tickets “checkout is dead” មុន Block ទូលំទូលាយ។'),
      },
    ],
    watchOuts: [
      t('Block toàn bộ managed rules ngày đầu — form và API hợp lệ dễ gãy.', 'Blocking all managed rules on day one easily breaks legitimate forms and APIs.', 'ការធ្វើ Block managed rules ទាំងអស់នៅ day one ងាយបំបែក forms និង APIs ស្របច្បាប់។'),
      t('WAF không chạy nếu hostname còn grey-cloud.', 'WAF does not run if the hostname is still grey-cloud.', 'WAF មិនរត់បើ hostname នៅតែ grey-cloud។'),
    ],
    tips: [
      t('Golden rule: log rồi block — giống Gateway/DLP trên track Cloudflare One.', 'Golden rule: log then block — same idea as Gateway/DLP on the Cloudflare One track.', 'Golden rule៖ log រួច block — គំនិតដូច Gateway/DLP លើ track Cloudflare One។'),
      t('Learning path Application security có thứ tự account → default traffic → WAF.', 'The Application security learning path orders account → default traffic → WAF.', 'Application security learning path តម្រៀប account → default traffic → WAF។'),
    ],
    officialDocs: [
      { label: t('WAF managed rules', 'WAF managed rules', 'WAF managed rules'), url: CF_WAF },
      { label: t('Application security learning path', 'Application security learning path', 'Application security learning path'), url: CF_APPSEC },
    ],
  },
  {
    lessonId: 'as-3-l2',
    role: 'required',
    goal: t(
      'Đặt rate limit có quan điểm trên /login (và form/OTP) để giảm credential stuffing.',
      'Put an opinionated rate limit on /login (and forms/OTP) to cut credential stuffing.',
      'ដាក់ rate limit ដែលមានគំនិតលើ /login (និង forms/OTP) ដើម្បីកាត់ credential stuffing។',
    ),
    who: t('Security', 'Security', 'Security'),
    time: t('~15 phút', '~15 min', '~15 នាទី'),
    finishWith: t(
      'Rule 10 request/phút/IP trên /login (hoặc tương đương) ở Log rồi Challenge/Block.',
      'A 10 request/min/IP rule on /login (or equivalent) in Log, then Challenge/Block.',
      'Rule 10 request/min/IP លើ /login (ឬ equivalent) ក្នុង Log, រួច Challenge/Block។',
    ),
    beforeYouBegin: t('WAF đã bật (as-3-l1). Biết path login/signup/OTP thật (không đoán).', 'WAF is on (as-3-l1). You know the real login/signup/OTP paths (do not guess).', 'WAF បើក (as-3-l1)។ អ្នកដឹង paths login/signup/OTP ពិត (កុំទាយ)។'),
    planNote: t('Rate limiting rules tùy plan — Free có giới hạn số rule. Advanced RL ở plan cao hơn.', 'Rate limiting rules depend on plan — Free has a rule cap. Advanced RL is on higher plans.', 'Rate limiting rules អាស្រ័យលើ plan — Free មាន rule cap។ Advanced RL មានលើ plans ខ្ពស់ជាង។'),
    steps: [
      {
        action: t('Security → WAF → Rate limiting rules → Create rule.', 'Security → WAF → Rate limiting rules → Create rule.', 'Security → WAF → Rate limiting rules → Create rule។'),
        click: t('Create rule', 'Create rule', 'Create rule'),
        enter: t(
          'If: URI Path contains /login  |  With: 10 requests / 1 minute / IP  |  Then: Log (48h) rồi Managed Challenge hoặc Block',
          'If: URI Path contains /login  |  With: 10 requests / 1 minute / IP  |  Then: Log (48h) then Managed Challenge or Block',
          'If: URI Path contains /login  |  With: 10 requests / 1 minute / IP  |  Then: Log (48h) then Managed Challenge or Block',
        ),
      },
      {
        action: t('Thêm rule tương tự cho /signup, /otp, hoặc /api/search nếu bị abuse.', 'Add similar rules for /signup, /otp, or /api/search if abused.', 'បន្ថែម rules ស្រដៀងសម្រាប់ /signup, /otp, ឬ /api/search បើ abused។'),
        checkpoint: t('Tự test: 15 request nhanh từ một IP thấy Log/Challenge. User thường không bị chặn khi gõ mật khẩu 1–2 lần.', 'Self-test: 15 rapid requests from one IP show Log/Challenge. Normal users typing a password once or twice are not blocked.', 'Self-test៖ 15 requests លឿនពី IP មួយបង្ហាញ Log/Challenge។ Users ធម្មតាវាយ password ម្តង ឬពីរដងមិនត្រូវបាន Block។'),
      },
      {
        action: t('Monitor Rate limiting events sau deploy.', 'Monitor Rate limiting events after deploy.', 'Monitor Rate limiting events បន្ទាប់ពី deploy។'),
        see: t('Security Events lọc Rate limit. Điều chỉnh threshold nếu NAT văn phòng dùng chung IP.', 'Security Events filtered to Rate limit. Tune the threshold if an office NAT shares one IP.', 'Security Events filtered ទៅ Rate limit។ Tune threshold បើ office NAT ចែក IP មួយ។'),
      },
    ],
    watchOuts: [
      t('Ngưỡng quá thấp trên IP văn phòng — cả team bị challenge.', 'Too-low thresholds on an office IP challenge the whole team.', 'Thresholds ទាបពេកលើ office IP challenge ក្រុមទាំងមូល។'),
      t('Rate limit theo IP không đủ chống botnet phân tán — kết hợp Bot + WAF.', 'Per-IP rate limits are weak against a distributed botnet — combine Bot + WAF.', 'Rate limits តាម IP ខ្សោយទល់នឹង distributed botnet — រួម Bot + WAF។'),
    ],
    tips: [
      t('10/phút/IP trên /login là điểm bắt đầu, không phải tiêu chuẩn pháp lý — tune theo app.', '10/min/IP on /login is a starting point, not a legal standard — tune to the app.', '10/min/IP លើ /login គឺចំណុចចាប់ផ្តើម, មិនមែនស្តង់ដារច្បាប់ — tune តាម app។'),
      t('Cookie/session counting tốt hơn IP thuần nếu plan hỗ trợ.', 'Cookie/session counting beats raw IP if your plan supports it.', 'Cookie/session counting ល្អជាង IP ទទេ បើ plan របស់អ្នកគាំទ្រ។'),
    ],
    officialDocs: [{ label: t('Rate limiting rules', 'Rate limiting rules', 'Rate limiting rules'), url: CF_RL }],
  },
  {
    lessonId: 'as-3-l3',
    role: 'recommended',
    goal: t(
      'Xem Bot Analytics, bật Bot Fight / Super Bot Fight / Bot Management theo plan, challenge score thấp trên form.',
      'Read Bot Analytics, enable Bot Fight / Super Bot Fight / Bot Management by plan, challenge low scores on forms.',
      'អាន Bot Analytics, បើក Bot Fight / Super Bot Fight / Bot Management តាម plan, challenge scores ទាបលើ forms។',
    ),
    who: t('Security', 'Security', 'Security'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Biết phân bố bot score; rule challenge trên form public; allowlist crawler cần thiết (Googlebot).',
      'You know the bot-score distribution; a challenge rule on public forms; necessary crawlers (Googlebot) allowlisted.',
      'អ្នកដឹង bot-score distribution; challenge rule លើ forms សាធារណៈ; crawlers ចាំបាច់ (Googlebot) ត្រូវបាន allowlisted។',
    ),
    beforeYouBegin: t('Proxy + WAF baseline. Có form public (login, contact, signup).', 'Proxy + WAF baseline. You have a public form (login, contact, signup).', 'Proxy + WAF baseline។ អ្នកមាន form សាធារណៈ (login, contact, signup)។'),
    planNote: t('Bot Fight Mode (Free). Super Bot Fight Mode (Pro+). Bot Management (Enterprise) cho score và JS detections đầy đủ.', 'Bot Fight Mode (Free). Super Bot Fight Mode (Pro+). Bot Management (Enterprise) for full scores and JS detections.', 'Bot Fight Mode (Free)។ Super Bot Fight Mode (Pro+)។ Bot Management (Enterprise) សម្រាប់ scores ពេញ និង JS detections។'),
    steps: [
      {
        action: t('Security → Bots → xem Bot Analytics / score distribution vài ngày traffic.', 'Security → Bots → review Bot Analytics / score distribution for a few days of traffic.', 'Security → Bots → ពិនិត្យ Bot Analytics / score distribution សម្រាប់ traffic ពីរបីថ្ងៃ។'),
        see: t('Tỷ lệ automated vs likely human. Đừng block score giữa nếu chưa hiểu app.', 'Share of automated vs likely human. Do not block mid scores until you understand the app.', 'ចំណែក automated vs likely human។ កុំ Block mid scores រហូតអ្នកយល់ app។'),
      },
      {
        action: t('Bật Bot Fight hoặc Super Bot Fight theo plan. Enterprise: cấu hình Bot Management.', 'Enable Bot Fight or Super Bot Fight by plan. Enterprise: configure Bot Management.', 'បើក Bot Fight ឬ Super Bot Fight តាម plan។ Enterprise៖ configure Bot Management។'),
        click: t('Bots → Get started / Enable', 'Bots → Get started / Enable', 'Bots → Get started / Enable'),
      },
      {
        action: t('Challenge traffic score thấp trên path form — không block toàn site ngày đầu.', 'Challenge low-score traffic on form paths — do not block the whole site on day one.', 'Challenge traffic score ទាបលើ form paths — កុំ Block site ទាំងមូលនៅ day one។'),
        enter: t('cf.bot_management.score lt 30 and http.request.uri.path contains "/signup"', 'cf.bot_management.score lt 30 and http.request.uri.path contains "/signup"', 'cf.bot_management.score lt 30 and http.request.uri.path contains "/signup"'),
        checkpoint: t('SEO/monitoring bot hợp lệ vẫn vào (allowlist nếu cần). Form spam giảm trên Security Events.', 'Legitimate SEO/monitoring bots still get through (allowlist if needed). Form spam drops in Security Events.', 'SEO/monitoring bots ស្របច្បាប់នៅតែចូល (allowlist បើត្រូវការ)។ Form spam ថយក្នុង Security Events។'),
      },
    ],
    watchOuts: [
      t('Block “definitely automated” trên toàn zone — gãy health check và partner integration.', 'Blocking “definitely automated” on the whole zone breaks health checks and partner integrations.', 'ការធ្វើ Block “definitely automated” លើ zone ទាំងមូលបំបែក health checks និង partner integrations។'),
    ],
    tips: [
      t('Turnstile trên form (track Developer Platform) bổ sung, không thay Bot Management.', 'Turnstile on forms (Developer Platform track) complements Bot Management; it does not replace it.', 'Turnstile លើ forms (track Developer Platform) បំពេញ Bot Management; វាមិនជំនួសវា។'),
    ],
    officialDocs: [{ label: t('Bot Management', 'Bot Management', 'Bot Management'), url: CF_BOTS }],
  },
  {
    lessonId: 'as-4-l1',
    role: 'recommended',
    goal: t(
      'Hiểu HIT tại PoP vs MISS về origin — cache static, không cache HTML có session.',
      'Understand PoP HIT vs MISS to origin — cache static assets, do not cache HTML with sessions.',
      'យល់ HIT នៅ PoP vs MISS ទៅ origin — cache static assets, កុំ cache HTML ដែលមាន session។',
    ),
    who: t('DevOps / frontend', 'DevOps / frontend', 'DevOps / frontend'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Biết đọc cf-cache-status; một asset static HIT; một trang login/cart không HIT giữa user.',
      'You can read cf-cache-status; one static asset HITs; a login/cart page does not HIT across users.',
      'អ្នកអាចអាន cf-cache-status; static asset មួយ HIT; ទំព័រ login/cart មិន HIT ឆ្លងកាត់អ្នកប្រើ។',
    ),
    beforeYouBegin: t('Hostname Proxied. Có URL static (/assets/*.js) và URL động.', 'Hostname is Proxied. You have a static URL (/assets/*.js) and a dynamic URL.', 'Hostname គឺ Proxied។ អ្នកមាន URL static (/assets/*.js) និង URL dynamic។'),
    planNote: t('CDN cache có trên mọi plan. Tiered Cache / Argo Smart Routing là add-on hoặc plan cao.', 'CDN cache is on every plan. Tiered Cache / Argo Smart Routing are add-ons or higher plans.', 'CDN cache មានលើគ្រប់ plan។ Tiered Cache / Argo Smart Routing គឺ add-on ឬ plan ខ្ពស់ជាង។'),
    steps: [
      {
        action: t('Gọi asset static hai lần, đọc header.', 'Fetch a static asset twice and read headers.', 'Fetch static asset ដូចគ្នាពីរដងហើយអាន header។'),
        enter: t('curl -sI https://www.example.com/assets/app.js | grep -i cf-cache', 'curl -sI https://www.example.com/assets/app.js | grep -i cf-cache', 'curl -sI https://www.example.com/assets/app.js | grep -i cf-cache'),
        checkpoint: t('Lần hai thường HIT hoặc EXPIRED→HIT. MISS mãi = Cache-Control origin quá ngắn hoặc BYPASS rule.', 'Second fetch is usually HIT or EXPIRED→HIT. Endless MISS = origin Cache-Control too short or a BYPASS rule.', 'Fetch ទីពីរជាធម្មតា HIT ឬ EXPIRED→HIT។ MISS មិនឈប់ = origin Cache-Control ខ្លីពេក ឬ BYPASS rule។'),
      },
      {
        action: t('Gọi trang HTML có cookie session.', 'Fetch an HTML page that sets session cookies.', 'Fetch ទំព័រ HTML ដែល set session cookie។'),
        checkpoint: t('cf-cache-status DYNAMIC hoặc BYPASS — không phục vụ HTML user A cho user B.', 'cf-cache-status DYNAMIC or BYPASS — do not serve user A HTML to user B.', 'cf-cache-status DYNAMIC ឬ BYPASS — កុំ serve HTML របស់ user A ទៅ user B។'),
      },
      {
        action: t('Caching → Configuration: hiểu Standard vs Aggressive; đừng bật Cache Everything trên HTML có session.', 'Caching → Configuration: understand Standard vs Aggressive; do not Cache Everything on session HTML.', 'Caching → Configuration: យល់ Standard vs Aggressive; កុំ Cache Everything លើ session HTML។'),
      },
    ],
    watchOuts: [
      t('Cache Everything trên toàn site — user thấy giỏ hàng của nhau.', 'Cache Everything on the whole site — users see each other’s carts.', 'Cache Everything លើទាំង site — អ្នកប្រើឃើញ cart របស់គ្នា។'),
    ],
    tips: [
      t('HIT tại edge giảm origin và cải thiện LCP cho static.', 'Edge HIT cuts origin load and improves LCP for static assets.', 'HIT លើ edge កាត់បន្ថយ origin load និងធ្វើឱ្យ LCP ប្រសើរសម្រាប់ static assets។'),
    ],
    officialDocs: [
      { label: t('Cache default behavior', 'Cache default behavior', 'Cache default behavior'), url: 'https://developers.cloudflare.com/cache/concepts/default-cache-behavior/' },
    ],
  },
  {
    lessonId: 'as-4-l2',
    role: 'recommended',
    goal: t(
      'Viết Cache Rules: bypass /admin và /checkout; TTL dài cho /assets/*; purge sau release frontend.',
      'Write Cache Rules: bypass /admin and /checkout; long TTL for /assets/*; purge after each frontend release.',
      'សរសេរ Cache Rules: bypass /admin និង /checkout; TTL វែងសម្រាប់ /assets/*; purge បន្ទាប់ពី frontend release នីមួយៗ។',
    ),
    who: t('Frontend / DevOps', 'Frontend / DevOps', 'Frontend / DevOps'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Hai (hoặc ba) Cache Rules có thứ tự; quy trình purge gắn vào release.',
      'Two (or three) ordered Cache Rules; purge is part of the release process.',
      'Two (or three) Cache Rules មានលំដាប់; purge គឺផ្នែកនៃដំណើរការ release។',
    ),
    beforeYouBegin: t('Đã hiểu HIT/MISS (as-4-l1). Biết prefix asset và path nhạy cảm.', 'You understand HIT/MISS (as-4-l1). You know asset prefixes and sensitive paths.', 'អ្នកយល់ HIT/MISS (as-4-l1)។ អ្នកដឹង prefix របស់ asset និង path រសើប។'),
    planNote: t('Số Cache Rules tùy plan. Page Rules là legacy — dùng Cache Rules.', 'Cache Rule count depends on plan. Page Rules are legacy — use Cache Rules.', 'កំណត់ចំនួន Cache Rule អាស្រ័យលើ plan។ Page Rules គឺ legacy — ប្រើ Cache Rules។'),
    steps: [
      {
        action: t('Caching → Cache Rules → Create rule: Bypass cache cho /admin* và /checkout*.', 'Caching → Cache Rules → Create rule: Bypass cache for /admin* and /checkout*.', 'Caching → Cache Rules → Create rule: Bypass cache សម្រាប់ /admin* និង /checkout*។'),
        enter: t('If hostname eq www.example.com AND URI Path starts with /admin OR /checkout → Cache eligibility: Bypass cache', 'If hostname eq www.example.com AND URI Path starts with /admin OR /checkout → Cache eligibility: Bypass cache', 'If hostname eq www.example.com AND URI Path starts with /admin OR /checkout → Cache eligibility: Bypass cache'),
      },
      {
        action: t('Rule thứ hai: Eligible for cache + Edge TTL (ví dụ 1 ngày hoặc 1 tuần) cho /assets/*.', 'Second rule: Eligible for cache + Edge TTL (e.g. 1 day or 1 week) for /assets/*.', 'Rule ទីពីរ: Eligible for cache + Edge TTL (e.g. 1 day or 1 week) សម្រាប់ /assets/*។'),
        enter: t('URI Path starts with /assets/ → Edge TTL: 1 day (override origin nếu origin gửi no-cache nhầm)', 'URI Path starts with /assets/ → Edge TTL: 1 day (override origin if origin mistakenly sends no-cache)', 'URI Path starts with /assets/ → Edge TTL: 1 day (override origin ប្រសិនបើ origin ផ្ញើ no-cache ខុស)'),
      },
      {
        action: t('Đặt rule cụ thể trên rule rộng. Purge sau mỗi release frontend.', 'Put specific rules above broad ones. Purge after each frontend release.', 'ដាក់ rule ជាក់លាក់ខាងលើ rule ទូលំទូលាយ។ Purge បន្ទាប់ពី frontend release នីមួយៗ។'),
        click: t('Caching → Configuration → Purge → Custom purge URL vừa deploy', 'Caching → Configuration → Purge → Custom purge of URLs you just shipped', 'Caching → Configuration → Purge → Custom purge នៃ URL ដែលអ្នកទើប ship'),
        checkpoint: t('HTML admin không HIT. File hashed trong /assets/ HIT. Sau purge, file mới xuất hiện.', 'Admin HTML does not HIT. Hashed files under /assets/ HIT. After purge, new files appear.', 'HTML admin មិន HIT។ File hashed ក្រោម /assets/ HIT។ បន្ទាប់ពី purge, file ថ្មីលេចឡើង។'),
      },
    ],
    watchOuts: [
      t('Purge Everything trên site lớn — stampede về origin. Ưu tiên purge URL hoặc prefix.', 'Purge Everything on a large site stampedes the origin. Prefer URL or prefix purge.', 'Purge Everything លើ site ធំ stampede origin។ ចូលចិត្ត purge URL ឬ prefix។'),
      t('TTL dài trên HTML không có versioned asset — user kẹt bản cũ.', 'Long TTL on unversioned HTML leaves users on a stale page.', 'TTL វែងលើ HTML គ្មាន version រក្សាអ្នកប្រើលើទំព័រ stale។'),
    ],
    tips: [
      t('Hashed filenames (app.abc123.js) cho phép TTL dài an toàn.', 'Hashed filenames (app.abc123.js) make long TTLs safe.', 'Filename hashed (app.abc123.js) ធ្វើឱ្យ TTL វែងមានសុវត្ថិភាព។'),
    ],
    officialDocs: [{ label: t('Cache Rules', 'Cache Rules', 'Cache Rules'), url: CF_CACHE }],
  },
  {
    lessonId: 'as-4-l3',
    role: 'recommended',
    goal: t(
      'Bật tối ưu Speed cơ bản: compression, HTTP/3, Early Hints; cân nhắc Images nếu phục vụ nhiều ảnh.',
      'Turn on basic Speed optimizations: compression, HTTP/3, Early Hints; consider Images if you serve many images.',
      'បើក Speed optimization មូលដ្ឋាន: compression, HTTP/3, Early Hints; ពិចារណា Images ប្រសិនបើអ្នក serve រូបភាពច្រើន។',
    ),
    who: t('Frontend / performance', 'Frontend / performance', 'Frontend / performance'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Brotli/gzip và HTTP/3 bật; biết Images/Polish là lớp tùy plan.',
      'Brotli/gzip and HTTP/3 on; you know Images/Polish are plan-dependent.',
      'Brotli/gzip និង HTTP/3 បើក; អ្នកដឹង Images/Polish អាស្រ័យលើ plan។',
    ),
    beforeYouBegin: t('Cache Rules ổn (as-4-l2). Có trang đo LCP.', 'Cache Rules are in place (as-4-l2). You have a page to measure LCP.', 'Cache Rules នៅនឹងកន្លែង (as-4-l2)។ អ្នកមានទំព័រដើម្បីវាស់ LCP។'),
    planNote: t('Nhiều Speed features trên Pro+. Image Resizing / Cloudflare Images có giá riêng.', 'Many Speed features are on Pro+. Image Resizing / Cloudflare Images are billed separately.', 'Speed feature ច្រើននៅលើ Pro+។ Image Resizing / Cloudflare Images គិតថ្លៃដោយឡែក។'),
    steps: [
      {
        action: t('Speed → Optimization / Content: bật Brotli (và giữ gzip fallback).', 'Speed → Optimization / Content: enable Brotli (keep gzip fallback).', 'Speed → Optimization / Content: បើក Brotli (រក្សា gzip fallback)។'),
        click: t('Brotli On', 'Brotli On', 'Brotli On'),
      },
      {
        action: t('Network: HTTP/3 (QUIC) On; cân nhắc Early Hints (103) nếu origin/HTML hợp lệ.', 'Network: HTTP/3 (QUIC) On; consider Early Hints (103) if origin/HTML is valid.', 'Network: HTTP/3 (QUIC) On; ពិចារណា Early Hints (103) ប្រសិនបើ origin/HTML ត្រឹមត្រូវ។'),
        checkpoint: t('curl --http3 hoặc DevTools Protocol hiện h3. Không regress form/upload.', 'curl --http3 or DevTools Protocol shows h3. Forms/uploads do not regress.', 'curl --http3 ឬ DevTools Protocol បង្ហាញ h3។ Form/upload មិន regress។'),
      },
      {
        action: t('Nếu ảnh lớn: Speed → Image Optimization hoặc Cloudflare Images — WebP/AVIF tại edge.', 'If images are large: Speed → Image Optimization or Cloudflare Images — WebP/AVIF at the edge.', 'ប្រសិនបើរូបភាពធំ: Speed → Image Optimization ឬ Cloudflare Images — WebP/AVIF លើ edge។'),
        see: t('Polish/Mirage/Images tùy plan — test visual trước khi bật lossless trên ảnh y tế/in ấn.', 'Polish/Mirage/Images depend on plan — visual-test before lossless on medical/print images.', 'Polish/Mirage/Images អាស្រ័យលើ plan — visual-test មុន lossless លើរូបភាពវេជ្ជសាស្ត្រ/បោះពុម្ព។'),
      },
    ],
    watchOuts: [
      t('Auto minify JS cũ có thể phá bundle — ưu tiên minify lúc build.', 'Legacy auto-minify can break bundles — prefer minify at build time.', 'Auto-minify បែប legacy អាចបំបែក bundle — ចូលចិត្ត minify ពេល build។'),
    ],
    tips: [
      t('Speed không thay Cache Rules sai. Sửa cache trước, rồi mới bật optimization.', 'Speed does not fix wrong Cache Rules. Fix cache first, then turn on optimizations.', 'Speed មិនជួសជុល Cache Rules ខុស។ ជួសជុល cache មុនបន្ទាប់មកបើក optimization។'),
    ],
    officialDocs: [
      { label: t('Speed optimization', 'Speed optimization', 'Speed optimization'), url: 'https://developers.cloudflare.com/speed/' },
    ],
  },
  {
    lessonId: 'as-4-l4',
    role: 'recommended',
    goal: t(
      'Đọc Caching Analytics và Web Analytics — một báo cáo trước/sau cho stakeholder.',
      'Read Caching Analytics and Web Analytics — one before/after report for stakeholders.',
      'អាន Caching Analytics និង Web Analytics — របាយការណ៍ before/after មួយសម្រាប់ stakeholder។',
    ),
    who: t('DevOps / owner site', 'DevOps / site owner', 'DevOps / site owner'),
    time: t('~20 phút + vài ngày số liệu', '~20 min + a few days of data', '~20 min + ទិន្នន័យពីរបីថ្ងៃ'),
    finishWith: t(
      'Hit ratio và một Web Vital (LCP) trước/sau; Security Events không có spike lạ.',
      'Hit ratio and one Web Vital (LCP) before/after; Security Events has no unexplained spike.',
      'Hit ratio និង Web Vital មួយ (LCP) before/after; Security Events គ្មាន spike គ្មានការពន្យល់។',
    ),
    beforeYouBegin: t('Đã bật proxy vài ngày. Cache Rules đã deploy.', 'Proxy has been on for a few days. Cache Rules are deployed.', 'Proxy ត្រូវបានបើកពីរបីថ្ងៃ។ Cache Rules ត្រូវបាន deploy។'),
    planNote: t('Web Analytics (privacy-first) miễn phí. Web Analytics với RUM/CWV đầy đủ tùy zone. Logpush là plan cao / add-on.', 'Privacy-first Web Analytics is free. Fuller RUM/CWV depends on the zone. Logpush is higher plan / add-on.', 'Web Analytics បែប privacy-first គឺ free។ RUM/CWV ពេញលេញអាស្រ័យលើ zone។ Logpush គឺ plan ខ្ពស់ / add-on។'),
    steps: [
      {
        action: t('Caching → Analytics: ghi hit ratio, top MISS path, bandwidth tiết kiệm.', 'Caching → Analytics: record hit ratio, top MISS paths, bandwidth saved.', 'Caching → Analytics: កត់ត្រា hit ratio, path MISS កំពូល, bandwidth សន្សំ។'),
        checkpoint: t('Một số — ví dụ hit ratio 70%+ trên /assets — để so tuần sau.', 'One number — e.g. 70%+ hit ratio on /assets — to compare next week.', 'លេខមួយ — e.g. hit ratio 70%+ លើ /assets — ដើម្បីប្រៀបធ្មៀបសប្តាហ៍ក្រោយ។'),
      },
      {
        action: t('Analytics → Web Analytics (hoặc Speed → Observability): LCP/INP trước/sau optimization.', 'Analytics → Web Analytics (or Speed → Observability): LCP/INP before/after optimization.', 'Analytics → Web Analytics (ឬ Speed → Observability): LCP/INP before/after optimization។'),
      },
      {
        action: t('Security → Events: xác nhận WAF/rate limit không đốt path hợp lệ.', 'Security → Events: confirm WAF/rate limit is not burning legitimate paths.', 'Security → Events: បញ្ជាក់ WAF/rate limit មិនដុត path ស្របច្បាប់។'),
        checkpoint: t('Báo cáo 5 dòng: hit ratio, LCP, top blocked rule, origin 5xx, hành động tuần tới.', 'A 5-line report: hit ratio, LCP, top blocked rule, origin 5xx, next week’s action.', 'របាយការណ៍ 5-line: hit ratio, LCP, rule blocked កំពូល, origin 5xx, សកម្មភាពសប្តាហ៍ក្រោយ។'),
      },
    ],
    watchOuts: [
      t('Tối ưu không đo — không biết Cache Everything đã hại conversion.', 'Optimizing without measurement hides a Cache Everything that hurt conversion.', 'ការបង្កើនប្រសិទ្ធភាពដោយគ្មានការវាស់លាក់ Cache Everything ដែលធ្វើឱ្យ conversion ខូច។'),
    ],
    tips: [
      t('Đây là chỗ “dừng sau module vẫn có giá trị”: bạn đã có baseline để mở rộng API Shield hoặc LB.', 'This is “stopping still has value”: you have a baseline before API Shield or LB.', 'នេះគឺ “ការឈប់នៅតែមានតម្លៃ”: អ្នកមាន baseline មុន API Shield ឬ LB។'),
    ],
    officialDocs: [
      { label: t('Cache analytics', 'Cache analytics', 'Cache analytics'), url: 'https://developers.cloudflare.com/cache/performance-review/cache-analytics/' },
      { label: t('Web Analytics', 'Web Analytics', 'Web Analytics'), url: 'https://developers.cloudflare.com/web-analytics/' },
    ],
  },
  {
    lessonId: 'as-5-l1',
    role: 'optional',
    goal: t(
      'Bảo vệ API: schema awareness / mTLS / Sequence khi đây là use case — sau khi nền zone đã ổn.',
      'Protect APIs: schema awareness / mTLS / Sequence when that is the use case — after the zone spine is stable.',
      'ការពារ API: schema awareness / mTLS / Sequence ពេលដែលគឺ use case — បន្ទាប់ពី spine របស់ zone មានស្ថិរភាព។',
    ),
    who: t('API owner + Security', 'API owner + Security', 'API owner + Security'),
    time: t('~40 phút (pilot một API)', '~40 min (one API pilot)', '~40 min (pilot API មួយ)'),
    finishWith: t(
      'Một API hostname/path nằm sau WAF; biết bước tiếp theo trên API Shield (schema, JWT, mTLS) theo plan.',
      'One API hostname/path sits behind WAF; you know the next API Shield steps (schema, JWT, mTLS) for your plan.',
      'API hostname/path មួយនៅក្រោយ WAF; អ្នកដឹងជំហាន API Shield បន្ទាប់ (schema, JWT, mTLS) សម្រាប់ plan របស់អ្នក។',
    ),
    beforeYouBegin: t(
      'Phần 1–3 xong. Use case /use-cases/secure-api. Có OpenAPI hoặc danh sách endpoint.',
      'Parts 1–3 done. Use case /use-cases/secure-api. You have OpenAPI or an endpoint list.',
      'Parts 1–3 បញ្ចប់។ Use case /use-cases/secure-api។ អ្នកមាន OpenAPI ឬបញ្ជី endpoint។',
    ),
    planNote: t('API Shield, Sequence, mTLS, JWT validation chủ yếu Enterprise / add-on. Free/Pro vẫn dùng WAF + rate limit trên /api.', 'API Shield, Sequence, mTLS, and JWT validation are mostly Enterprise / add-on. Free/Pro still use WAF + rate limit on /api.', 'API Shield, Sequence, mTLS, និង JWT validation ភាគច្រើនគឺ Enterprise / add-on។ Free/Pro នៅតែប្រើ WAF + rate limit លើ /api។'),
    steps: [
      {
        action: t('Xác nhận API hostname Proxied và không cache response nhạy cảm.', 'Confirm the API hostname is Proxied and sensitive responses are not cached.', 'បញ្ជាក់ API hostname គឺ Proxied ហើយ response រសើបមិនត្រូវបាន cache។'),
        checkpoint: t('Cache Rule Bypass cho /api/* nếu response theo user.', 'Cache Rule Bypass for /api/* if responses are per-user.', 'Cache Rule Bypass សម្រាប់ /api/* ប្រសិនបើ response តាម user។'),
      },
      {
        action: t('Security → WAF: custom rule + rate limit cho /api (ví dụ 100 req/phút/IP ở Log).', 'Security → WAF: custom rule + rate limit for /api (e.g. 100 req/min/IP in Log).', 'Security → WAF: custom rule + rate limit សម្រាប់ /api (e.g. 100 req/min/IP ក្នុង Log)។'),
        enter: t('URI Path starts with /api/', 'URI Path starts with /api/', 'URI Path starts with /api/'),
      },
      {
        action: t('Nếu plan có API Shield: Security → API Shield → upload schema hoặc bật discovery; mTLS cho client máy-to-máy.', 'If the plan includes API Shield: Security → API Shield → upload schema or enable discovery; mTLS for machine-to-machine clients.', 'ប្រសិនបើ plan មាន API Shield: Security → API Shield → upload schema ឬបើក discovery; mTLS សម្រាប់ client machine-to-machine។'),
        see: t('Learning path mTLS / Application security — default traffic security.', 'mTLS / Application security learning path — default traffic security.', 'ផ្លូវសិក្សា mTLS / Application security — default traffic security។'),
        checkpoint: t('Một client không hợp lệ bị chặn; client hợp lệ 200. Endpoint lạ xuất hiện trong discovery (nếu bật).', 'An invalid client is blocked; a valid client gets 200. Unknown endpoints appear in discovery (if enabled).', 'Client មិនត្រឹមត្រូវត្រូវបាន block; client ត្រឹមត្រូវផ្តល់ 200។ Endpoint មិនដឹងលេចឡើងក្នុង discovery (ប្រសិនបើបើក)។'),
      },
    ],
    watchOuts: [
      t('Schema enforce ngày đầu trên API đang đổi — break mobile app. Discover/log trước.', 'Enforcing schema on day one of a changing API breaks mobile apps. Discover/log first.', 'ការអនុវត្ត schema លើថ្ងៃទីមួយនៃ API ដែលកំពុងប្តូរ បំបែក mobile app។ Discover/log មុន។'),
    ],
    tips: [
      t('Không có Enterprise: WAF + rate limit + origin lockdown vẫn là lớp API hợp lệ.', 'Without Enterprise: WAF + rate limit + origin lockdown is still a valid API layer.', 'គ្មាន Enterprise: WAF + rate limit + origin lockdown នៅតែជាស្រទាប់ API ត្រឹមត្រូវ។'),
    ],
    officialDocs: [
      { label: t('API Shield', 'API Shield', 'API Shield'), url: CF_API },
      { label: t('Application security learning path', 'Application security learning path', 'Application security learning path'), url: CF_APPSEC },
    ],
  },
  {
    lessonId: 'as-6-l1',
    role: 'optional',
    goal: t(
      'Thêm Load Balancing và/hoặc chuẩn bị DDoS/Waiting Room khi có nhiều origin hoặc sự kiện traffic — plan-gated.',
      'Add Load Balancing and/or prepare DDoS/Waiting Room when you have many origins or a traffic event — plan-gated.',
      'បន្ថែម Load Balancing និង/ឬរៀបចំ DDoS/Waiting Room ពេលអ្នកមាន origin ច្រើនឬព្រឹត្តិការណ៍ traffic — plan-gated។',
    ),
    who: t('Network / SRE', 'Network / SRE', 'Network / SRE'),
    time: t('~45 phút lab; production cần maintenance window', '~45 min lab; production needs a maintenance window', '~45 min lab; production ត្រូវការ maintenance window'),
    finishWith: t(
      'Hiểu pool/monitor/steering; biết DDoS L3/L4 tự có khi proxied; Waiting Room chỉ khi event.',
      'You understand pool/monitor/steering; you know L3/L4 DDoS is on when proxied; Waiting Room is for events only.',
      'អ្នកយល់ pool/monitor/steering; អ្នកដឹង DDoS L3/L4 បើកពេល proxied; Waiting Room សម្រាប់ event តែប៉ុណ្ណោះ។',
    ),
    beforeYouBegin: t(
      'Phần 1–3 xong. Hai origin (hoặc một origin + fallback) nếu làm LB. Learning path Load Balancing + Prevent DDoS.',
      'Parts 1–3 done. Two origins (or one origin + fallback) if you do LB. Load Balancing + Prevent DDoS learning paths.',
      'Parts 1–3 បញ្ចប់។ Origin ពីរ (ឬ origin មួយ + fallback) ប្រសិនបើអ្នកធ្វើ LB។ ផ្លូវសិក្សា Load Balancing + Prevent DDoS។',
    ),
    planNote: t('Load Balancing là sản phẩm tính phí. Waiting Room thường Business/Enterprise. DDoS unmetered khi traffic đi qua proxy.', 'Load Balancing is a paid product. Waiting Room is typically Business/Enterprise. Unmetered DDoS applies when traffic is proxied.', 'Load Balancing គឺផលិតផលបង់ប្រាក់។ Waiting Room ជាធម្មតា Business/Enterprise។ Unmetered DDoS អនុវត្តពេល traffic ត្រូវបាន proxy។'),
    steps: [
      {
        action: t('Traffic → Load Balancing: tạo monitor (HTTPS, path /health, interval 60s), pool, rồi LB hostname.', 'Traffic → Load Balancing: create a monitor (HTTPS, path /health, interval 60s), a pool, then the LB hostname.', 'Traffic → Load Balancing: បង្កើត monitor (HTTPS, path /health, interval 60s), pool, បន្ទាប់មក LB hostname។'),
        enter: t('Monitor: https://origin/health expect 200  |  Pool: origin-a, origin-b  |  Steering: Off hoặc Dynamic theo nhu cầu', 'Monitor: https://origin/health expect 200  |  Pool: origin-a, origin-b  |  Steering: Off or Dynamic as needed', 'Monitor: https://origin/health expect 200 | Pool: origin-a, origin-b | Steering: Off ឬ Dynamic តាមតម្រូវការ'),
        checkpoint: t('Fail một origin trong lab — monitor Unhealthy, traffic sang origin còn lại. DNS LB hostname Proxied.', 'Fail one origin in the lab — monitor Unhealthy, traffic moves to the remaining origin. LB hostname is Proxied.', 'Fail origin មួយក្នុង lab — monitor Unhealthy, traffic ផ្លាស់ទៅ origin ដែលនៅសល់។ LB hostname គឺ Proxied។'),
      },
      {
        action: t('DDoS: xác nhận hostname Proxied (lớp L3/L4). Application DDoS + WAF/rate limit đã có ở Phần 3.', 'DDoS: confirm the hostname is Proxied (L3/L4 layer). Application DDoS + WAF/rate limit already live in Part 3.', 'DDoS: បញ្ជាក់ hostname គឺ Proxied (ស្រទាប់ L3/L4)។ Application DDoS + WAF/rate limit មានរួចនៅ Part 3។'),
        see: t('Learning path Prevent DDoS attacks — không thay thế origin lockdown.', 'Prevent DDoS attacks learning path — does not replace origin lockdown.', 'ផ្លូវសិក្សា Prevent DDoS attacks — មិនជំនួស origin lockdown។'),
      },
      {
        action: t('Sự kiện (sale, ticket): Waiting Room trên path cụ thể — queue, không để origin 5xx.', 'Events (sale, tickets): Waiting Room on a specific path — queue instead of origin 5xx.', 'Event (sale, ticket): Waiting Room លើ path ជាក់លាក់ — queue ជំនួស origin 5xx។'),
        checkpoint: t('Một path event có Waiting Room template; path còn lại không bị queue.', 'One event path has a Waiting Room template; other paths are not queued.', 'Path event មួយមាន Waiting Room template; path ផ្សេងមិនត្រូវបាន queue។'),
      },
    ],
    watchOuts: [
      t('LB health check đi bypass WAF/geo sai — origin trông healthy trong khi user không vào được.', 'LB health checks that bypass WAF/geo look healthy while users cannot get in.', 'LB health check ដែល bypass WAF/geo មើលទៅ healthy ខណៈអ្នកប្រើចូលមិនបាន។'),
      t('Bật Waiting Room toàn site — lockout. Scope đúng path.', 'Enabling Waiting Room on the whole site is a lockout. Scope the path.', 'ការបើក Waiting Room លើទាំង site គឺ lockout។ Scope path។'),
    ],
    tips: [
      t('Một origin ổn định: chưa cần LB. Làm xong observe (as-4-l4) rồi hãy mua add-on.', 'One stable origin: you do not need LB yet. Finish observe (as-4-l4) before buying the add-on.', 'Origin ស្ថិរភាពមួយ: អ្នកមិនត្រូវការ LB នៅឡើយ។ បញ្ចប់ observe (as-4-l4) មុនទិញ add-on។'),
    ],
    officialDocs: [
      { label: t('Load Balancing learning path', 'Load Balancing learning path', 'Load Balancing learning path'), url: CF_LB },
      { label: t('Prevent DDoS attacks', 'Prevent DDoS attacks', 'Prevent DDoS attacks'), url: CF_DDOS },
      { label: t('Waiting Room', 'Waiting Room', 'Waiting Room'), url: 'https://developers.cloudflare.com/waiting-room/' },
    ],
  },
  {
    lessonId: 'as-7-l1',
    role: 'reference',
    goal: t(
      'Ghi nhớ 10 golden rules rollout Application Services — why và thứ tự, không big-bang.',
      'Internalize 10 Application Services golden rules — why and order, not big-bang.',
      'ចងចាំ golden rules 10 របស់ Application Services — why និងលំដាប់, មិនមែន big-bang។',
    ),
    who: t('Mọi người vận hành zone', 'Anyone operating the zone', 'នរណាម្នាក់ដែលដំណើរការ zone'),
    time: t('15 phút', '15 min', '15 min'),
    finishWith: t('Checklist 10 rule đã review với team.', 'A 10-rule checklist reviewed with the team.', 'Checklist 10-rule ដែលត្រូវបាន review ជាមួយ team។'),
    beforeYouBegin: t('Đã làm Phần 1–3 hoặc đang chuẩn bị cutover.', 'You finished Parts 1–3 or you are preparing a cutover.', 'អ្នកបានបញ្ចប់ Parts 1–3 ឬអ្នកកំពុងរៀបចំ cutover។'),
    steps: [
      {
        action: t('1. Proxy trước WAF/cache — grey-cloud không bảo vệ HTTP.', '1. Proxy before WAF/cache — grey-cloud does not protect HTTP.', '1. Proxy មុន WAF/cache — grey-cloud មិនការពារ HTTP។'),
        checkpoint: t('Mọi hostname public đã cam trước khi bàn rule.', 'Every public hostname is orange before you debate rules.', 'Hostname សាធារណៈទាំងអស់ត្រូវ orange មុនពេលអ្នកជជែក rule។'),
      },
      {
        action: t('2. Review DNS (MX/TXT/DNSSEC) trước đổi nameserver.', '2. Review DNS (MX/TXT/DNSSEC) before changing nameservers.', '2. Review DNS (MX/TXT/DNSSEC) មុនប្តូរ nameserver។'),
      },
      {
        action: t('3. Full (strict) khi origin có cert; không Flexible nếu origin HTTPS-only.', '3. Full (strict) when origin has a cert; no Flexible if origin is HTTPS-only.', '3. Full (strict) ពេល origin មាន cert; កុំ Flexible ប្រសិនបើ origin គឺ HTTPS-only។'),
      },
      {
        action: t('4. Lockdown origin (IP allowlist hoặc AOP) — WAF vô nghĩa nếu bypass IP.', '4. Lock down origin (IP allowlist or AOP) — WAF is meaningless if IPs bypass it.', '4. Lock down origin (IP allowlist ឬ AOP) — WAF គ្មានន័យប្រសិនបើ IP bypass វា។'),
      },
      {
        action: t('5. Log/simulate rồi Block — WAF, rate limit, bot.', '5. Log/simulate then Block — WAF, rate limit, bot.', '5. Log/simulate បន្ទាប់មក Block — WAF, rate limit, bot។'),
      },
      {
        action: t('6. Không cache HTML session; bypass /admin /checkout.', '6. Do not cache session HTML; bypass /admin /checkout.', '6. កុំ cache session HTML; bypass /admin /checkout។'),
      },
      {
        action: t('7. Rate limit path nhạy cảm với ngưỡng có chủ đích (bắt đầu 10/phút/IP trên /login).', '7. Rate-limit sensitive paths with a deliberate threshold (start at 10/min/IP on /login).', '7. Rate-limit path រសើបជាមួយ threshold ដែលចេតនា (ចាប់ផ្តើម 10/min/IP លើ /login)។'),
      },
      {
        action: t('8. Đo hit ratio và Security Events trước khi khoe tối ưu.', '8. Measure hit ratio and Security Events before celebrating optimizations.', '8. វាស់ hit ratio និង Security Events មុនអបអរសាទរ optimization។'),
      },
      {
        action: t('9. API Shield / LB / Waiting Room sau nền — đúng use case và plan.', '9. API Shield / LB / Waiting Room after the spine — right use case and plan.', '9. API Shield / LB / Waiting Room បន្ទាប់ពី spine — use case និង plan ត្រឹមត្រូវ។'),
      },
      {
        action: t('10. Một thay đổi mỗi lần, có rollback (NS cũ, rule disable, purge).', '10. One change at a time, with rollback (old NS, disable rule, purge).', '10. ការផ្លាស់ប្តូរមួយក្នុងមួយពេល, ជាមួយ rollback (NS ចាស់, disable rule, purge)។'),
      },
    ],
    watchOuts: [
      t('Big-bang: đổi NS + WAF Block + Cache Everything cùng lúc — không biết lớp nào gãy.', 'Big-bang: change NS + WAF Block + Cache Everything together — you cannot tell which layer broke.', 'Big-bang: ប្តូរ NS + WAF Block + Cache Everything ជាមួយគ្នា — អ្នកមិនដឹងស្រទាប់ណាខូច។'),
    ],
    tips: [
      t('In 10 rule ra runbook nội bộ. Menu dashboard đổi; rule thì không.', 'Print the 10 rules into an internal runbook. Dashboard menus change; the rules do not.', 'បោះពុម្ព rules 10 ទៅក្នុង runbook ផ្ទៃក្នុង។ Menu dashboard ផ្លាស់ប្តូរ; rules មិនផ្លាស់ប្តូរ។'),
    ],
    officialDocs: [
      { label: t('Application security learning path', 'Application security learning path', 'Application security learning path'), url: CF_APPSEC },
      { label: t('DNS best practices', 'DNS best practices', 'DNS best practices'), url: CF_DNS_BP },
    ],
  },
  {
    lessonId: 'as-7-l2',
    role: 'reference',
    goal: t(
      'Sổ tay field: path dashboard và giá trị mẫu khi đã hiểu luồng.',
      'Field runbook: dashboard paths and sample values once you know the flow.',
      'Runbook នៅទីកន្លែង: path dashboard និងតម្លៃគំរូ ពេលអ្នកដឹងលំហូរ។',
    ),
    who: t('Người implement đang ngồi trong dashboard', 'The implementer sitting in the dashboard', 'អ្នកអនុវត្តដែលអង្គុយក្នុង dashboard'),
    time: t('Tham chiếu — dùng khi làm', 'Reference — use while doing the work', 'Reference — ប្រើពេលធ្វើការងារ'),
    finishWith: t('Biết mở đúng màn hình cho từng bước spine.', 'You can open the right screen for each spine step.', 'អ្នកអាចបើកអេក្រង់ត្រឹមត្រូវសម្រាប់ជំហាន spine នីមួយៗ។'),
    beforeYouBegin: t('Đọc as-7-l1. Có zone trên dash.cloudflare.com.', 'Read as-7-l1. You have a zone on dash.cloudflare.com.', 'អាន as-7-l1។ អ្នកមាន zone លើ dash.cloudflare.com។'),
    steps: [
      {
        action: t('Add site', 'Add site', 'Add site'),
        click: t('dash.cloudflare.com → Onboard a domain / Add a site', 'dash.cloudflare.com → Onboard a domain / Add a site', 'dash.cloudflare.com → Onboard a domain / Add a site'),
        enter: t('Zone apex; plan Free để học', 'Zone apex; Free plan to learn', 'Zone apex; plan Free ដើម្បីរៀន'),
      },
      {
        action: t('DNS review', 'DNS review', 'DNS review'),
        click: t('DNS → Records', 'DNS → Records', 'DNS → Records'),
        enter: t('Đối chiếu MX/TXT với DNS cũ; screenshot', 'Diff MX/TXT vs old DNS; screenshot', 'Diff MX/TXT vs DNS ចាស់; screenshot'),
      },
      {
        action: t('Proxy', 'Proxy', 'Proxy'),
        click: t('DNS → Records → Proxied trên A/CNAME HTTP', 'DNS → Records → Proxied on HTTP A/CNAME', 'DNS → Records → Proxied on HTTP A/CNAME'),
        checkpoint: t('curl -sI https://host | grep -i cf-ray', 'curl -sI https://host | grep -i cf-ray', 'curl -sI https://host | grep -i cf-ray'),
      },
      {
        action: t('SSL mode', 'SSL mode', 'SSL mode'),
        click: t('SSL/TLS → Overview → Full (strict)', 'SSL/TLS → Overview → Full (strict)', 'SSL/TLS → Overview → Full (strict)'),
        enter: t('Always Use HTTPS On', 'Always Use HTTPS On', 'Always Use HTTPS On'),
      },
      {
        action: t('Origin CA + lockdown', 'Origin CA + lockdown', 'Origin CA + lockdown'),
        click: t('SSL/TLS → Origin Server → Create Certificate; firewall allow Cloudflare IPs', 'SSL/TLS → Origin Server → Create Certificate; firewall allow Cloudflare IPs', 'SSL/TLS → Origin Server → Create Certificate; firewall allow Cloudflare IPs'),
      },
      {
        action: t('WAF', 'WAF', 'WAF'),
        click: t('Security → WAF → Managed rules → Log 24–48h → Block', 'Security → WAF → Managed rules → Log 24–48h → Block', 'Security → WAF → Managed rules → Log 24–48h → Block'),
      },
      {
        action: t('Rate limit', 'Rate limit', 'Rate limit'),
        click: t('Security → WAF → Rate limiting rules', 'Security → WAF → Rate limiting rules', 'Security → WAF → Rate limiting rules'),
        enter: t('/login 10 req / 1 min / IP → Log rồi Challenge', '/login 10 req / 1 min / IP → Log then Challenge', '/login 10 req / 1 min / IP → Log បន្ទាប់មក Challenge'),
      },
      {
        action: t('Cache Rules', 'Cache Rules', 'Cache Rules'),
        click: t('Caching → Cache Rules', 'Caching → Cache Rules', 'Caching → Cache Rules'),
        enter: t('Bypass /admin /checkout; cache /assets/* TTL 1d', 'Bypass /admin /checkout; cache /assets/* TTL 1d', 'Bypass /admin /checkout; cache /assets/* TTL 1d'),
      },
      {
        action: t('Observe', 'Observe', 'Observe'),
        click: t('Caching → Analytics; Analytics → Web Analytics; Security → Events', 'Caching → Analytics; Analytics → Web Analytics; Security → Events', 'Caching → Analytics; Analytics → Web Analytics; Security → Events'),
      },
    ],
    watchOuts: [
      t('Nhãn Security / SSL gom lại theo thời gian — tìm “WAF”, “encryption mode”, “cache rules”.', 'Security / SSL labels get regrouped over time — search for “WAF”, “encryption mode”, “cache rules”.', 'Label Security / SSL ត្រូវបានរៀបឡើងវិញតាមពេល — ស្វែងរក “WAF”, “encryption mode”, “cache rules”។'),
    ],
    tips: [
      t('Tự động hóa sau khi tay làm đúng một lần: Terraform / API create zone + rulesets.', 'Automate only after one successful manual pass: Terraform / API create zone + rulesets.', 'ស្វ័យប្រវត្តិតែប៉ុណ្ណោះបន្ទាប់ពីធ្វើដោយដៃជោគជ័យមួយដង: Terraform / API create zone + rulesets។'),
    ],
    officialDocs: [
      { label: t('Add a site', 'Add a site', 'Add a site'), url: CF_ADD_SITE },
      { label: t('WAF managed rules', 'WAF managed rules', 'WAF managed rules'), url: CF_WAF },
    ],
  },
];
