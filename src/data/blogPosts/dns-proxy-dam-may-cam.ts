import type { BlogPost } from '../blog';

/** Entry · CDN — rewritten from Cloudflare DNS / CDN / proxy themes on blog.cloudflare.com */
export const postDnsProxyDamMayCamChoNguoiMoi: BlogPost = {
  slug: 'dns-proxy-dam-may-cam-cho-nguoi-moi',
  date: '2026-08-17',
  topic: 'cdn',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'DNS và đám mây cam: proxy Cloudflare giải thích đơn giản',
    en: 'DNS and the orange cloud: Cloudflare proxy explained simply',
  },
  description: {
    vi: 'Hiểu DNS trên Cloudflare, khác biệt giữa DNS only (đám mây xám) và proxied (đám mây cam), và vì sao bật proxy thay đổi tốc độ lẫn bảo mật website.',
    en: 'Understand Cloudflare DNS, the difference between DNS-only (grey cloud) and proxied (orange cloud), and why proxying changes both speed and security.',
  },
  excerpt: {
    vi: 'Đám mây cam nghĩa là traffic website đi qua mạng Cloudflare trước khi tới server gốc — bạn nhận CDN, bảo vệ và nhiều tính năng hơn so với chỉ trỏ DNS.',
    en: 'The orange cloud means site traffic passes through Cloudflare’s network before your origin — you get CDN, protection, and more than DNS-only pointing.',
  },
  keywords: {
    vi: 'DNS Cloudflare, đám mây cam, proxy Cloudflare, DNS only, CDN cho người mới, trỏ tên miền',
    en: 'Cloudflare DNS, orange cloud, Cloudflare proxy, DNS only, CDN beginner, domain pointing',
  },
  sections: [
    {
      heading: {
        vi: 'DNS là gì — và vì sao nó không phải “toàn bộ website”?',
        en: 'What DNS is — and why it is not “the whole website”',
      },
      paragraphs: [
        {
          vi: 'DNS (Domain Name System) giống cuốn danh bạ của Internet: khi ai đó gõ tên miền của bạn, DNS trả lời “máy chủ nào đang phục vụ site này”. Đó là bước đầu tiên mỗi lần mở trang — nhưng DNS chỉ chỉ đường, không tự làm website nhanh hay an toàn hơn.',
          en: 'DNS (Domain Name System) is the Internet’s phone book: when someone types your domain, DNS answers “which server serves this site.” That is the first step every visit — but DNS only points the way; it does not by itself make a site faster or safer.',
        },
        {
          vi: 'Trên Cloudflare, bạn thêm bản ghi DNS (thường là A hoặc CNAME) cho hostname như www hoặc api. Điểm quan trọng: mỗi bản ghi có thể ở chế độ DNS only (đám mây xám) hoặc proxied (đám mây cam). Hai chế độ này thay đổi đường đi của request — không chỉ địa chỉ IP hiển thị trong danh bạ.',
          en: 'On Cloudflare you add DNS records (usually A or CNAME) for hostnames like www or api. The key detail: each record can be DNS-only (grey cloud) or proxied (orange cloud). Those modes change how requests travel — not only the IP shown in the directory.',
        },
        {
          vi: 'Nhiều người mới nghĩ “đã trỏ DNS qua Cloudflare là xong”. Thực tế, nếu mọi bản ghi vẫn xám, bạn chỉ dùng Cloudflare như DNS manager: traffic đi thẳng tới origin, không qua cache edge, WAF hay lớp chống DDoS tích hợp. Bài trên blog.cloudflare.com về DNS và CDN thường nhấn mạnh sự khác biệt này.',
          en: 'Many beginners think “I pointed DNS to Cloudflare, done.” In practice, if every record stays grey, you only use Cloudflare as a DNS manager: traffic goes straight to origin, without edge cache, WAF, or built-in DDoS layers. Cloudflare Blog posts on DNS and CDN often stress this distinction.',
        },
        {
          vi: 'Ví dụ thực tế: blog cá nhân chỉ cần trỏ tên miền, chưa cần proxy — có thể để xám. Còn cửa hàng online, form đăng ký workshop, hoặc API công khai thường nên bật cam để hưởng lợi từ mạng toàn cầu của Cloudflare.',
          en: 'Real example: a personal blog that only needs domain pointing might stay grey. An online store, signup form, or public API usually benefits from orange-cloud proxying on Cloudflare’s global network.',
        },
      ],
      diagramSlug: 'distributed-web-performance-architecture',
    },
    {
      heading: {
        vi: 'Đám mây cam thay đổi tốc độ và bảo mật thế nào?',
        en: 'How the orange cloud changes speed and security',
      },
      paragraphs: [
        {
          vi: 'Khi proxied, người dùng không nói chuyện trực tiếp với IP origin của bạn. Request đi qua điểm edge Cloudflare gần họ: có thể trả nội dung từ cache, áp quy tắc bảo mật, hoặc chuyển tiếp có kiểm soát về server gốc. Origin IP cũng ít lộ hơn trên Internet công cộng.',
          en: 'When proxied, visitors do not talk directly to your origin IP. Requests hit a nearby Cloudflare edge: content may be served from cache, security rules may apply, or traffic is forwarded in a controlled way to origin. Your origin IP is also less exposed on the public Internet.',
        },
        {
          vi: 'Về tốc độ: file tĩnh (ảnh, CSS, JS) có thể được cache gần người dùng — trang mở nhanh hơn, origin đỡ tải. Về bảo mật: WAF, rate limiting, và lớp chống DDoS có thể hoạt động trước khi request chạm máy chủ của bạn. Đó là lý do “bật cam” thường là bước đầu trên lộ trình Application Services của hub này.',
          en: 'For speed: static files (images, CSS, JS) can be cached near users — pages feel faster and origin load drops. For security: WAF, rate limiting, and DDoS protection can act before requests reach your server. That is why orange-cloud is often step one on this hub’s Application Services track.',
        },
        {
          vi: 'Proxy không thay thế việc bạn cập nhật phần mềm, sao lưu, hay cấu hình HTTPS đúng trên origin. Nó thêm một lớp mạnh ở “cổng vào” — giống có bảo vệ và quầy phân phối trước kho hàng thật.',
          en: 'Proxying does not replace patching software, backups, or correct HTTPS on origin. It adds a strong layer at the front door — like security and a distribution desk before the real warehouse.',
        },
      ],
    },
    {
      heading: {
        vi: 'DNS only vs proxied: khi nào dùng cái nào?',
        en: 'DNS-only vs proxied: when to use which',
      },
      paragraphs: [
        {
          vi: 'DNS only (xám): Cloudflare chỉ trả lời câu hỏi DNS; traffic đi thẳng origin. Phù hợp hostname không cần HTTP proxy — ví dụ mail (MX), một số subdomain chỉ dùng cho dịch vụ bên thứ ba, hoặc giai đoạn thử nghiệm khi bạn chưa sẵn sàng đổi đường đi traffic.',
          en: 'DNS-only (grey): Cloudflare only answers DNS; traffic goes straight to origin. Good for hostnames that should not be HTTP-proxied — e.g. mail (MX), some third-party subdomains, or a trial phase before you change traffic paths.',
        },
        {
          vi: 'Proxied (cam): HTTP/HTTPS qua Cloudflare. Dùng cho website, API công khai, và hầu hết hostname mà bạn muốn cache + bảo vệ. Lưu ý: một số cổng hoặc giao thức đặc biệt có thể cần cấu hình thêm hoặc không proxy được — đọc docs trước khi bật cam cho mọi thứ.',
          en: 'Proxied (orange): HTTP/HTTPS through Cloudflare. Use for websites, public APIs, and most hostnames where you want cache plus protection. Note: some ports or special protocols may need extra config or cannot be proxied — read the docs before orange-clouding everything.',
        },
        {
          vi: 'Chiến lược phổ biến: www và apex (root) proxied; mail và hostname nội bộ xám. api.example.com có thể cam nếu bạn muốn WAF; hoặc xám nếu chỉ team nội bộ truy cập qua VPN. Không có một nút “đúng cho mọi người” — phụ thuộc rủi ro và luồng người dùng.',
          en: 'A common pattern: www and apex proxied; mail and internal hostnames grey. api.example.com might be orange if you want WAF, or grey if only internal VPN access. There is no single button “right for everyone” — it depends on risk and user flows.',
        },
        {
          vi: 'Sau khi đổi chế độ, hãy kiểm tra đăng nhập, form, webhook và thanh toán. Đôi khi IP thật của origin thay đổi trong log vì bạn thấy IP Cloudflare — đó là bình thường khi proxied.',
          en: 'After changing modes, test login, forms, webhooks, and checkout. Sometimes origin logs show Cloudflare IPs instead of visitors — that is normal when proxied.',
        },
      ],
    },
    {
      heading: {
        vi: 'Lỗi thường gặp khi mới bật proxy',
        en: 'Common mistakes when you first enable proxy',
      },
      paragraphs: [
        {
          vi: 'Một: bật cam cho hostname mail hoặc dịch vụ không dùng HTTP — site “lạ” hoặc chứng chỉ lỗi. Hai: quên mở firewall origin cho dải IP Cloudflare (nếu bạn chặn IP lạ) — origin từ chối request hợp lệ. Ba: cache quá mạnh lên trang đăng nhập hoặc giỏ hàng — dùng Cache Rules hoặc bypass cho đường dẫn nhạy cảm.',
          en: 'One: orange-clouding mail or non-HTTP services — things break or certificates fail. Two: forgetting to allow Cloudflare IP ranges on origin firewalls — origin rejects valid traffic. Three: caching too aggressively on login or cart paths — use Cache Rules or bypass for sensitive routes.',
        },
        {
          vi: 'Bốn: nghĩ DNS và CDN là hai sản phẩm tách rời hoàn toàn — trên Cloudflare chúng gắn chặt qua bản ghi proxied. Năm: không purge cache sau deploy — khách vẫn thấy bản cũ dù origin đã mới. Học purge sớm sẽ đỡ “sao mình sửa mà không đổi”.',
          en: 'Four: treating DNS and CDN as totally separate — on Cloudflare they connect through proxied records. Five: skipping cache purge after deploy — visitors still see old content. Learning purge early avoids “I deployed but nothing changed.”',
        },
        {
          vi: 'Tuần đầu nên làm: bật cam cho hostname chính; xác nhận HTTPS và redirect www/apex; đọc bài CDN trên hub; theo dõi Analytics vài ngày. Khi ổn định, thêm WAF baseline và cache rules có chủ đích.',
          en: 'First-week checklist: orange-cloud main hostnames; confirm HTTPS and www/apex redirects; read the CDN post on this hub; watch Analytics for a few days. When stable, add a WAF baseline and deliberate cache rules.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Đám mây xám có nghĩa Cloudflare không hoạt động?',
        en: 'Does a grey cloud mean Cloudflare is not working?',
      },
      answer: {
        vi: 'Cloudflare vẫn quản lý DNS cho bản ghi đó, nhưng HTTP/HTTPS không đi qua proxy. Bạn không có cache edge và các lớp bảo vệ HTTP mặc định cho hostname xám. Đó là lựa chọn có chủ đích, không phải lỗi.',
        en: 'Cloudflare still manages DNS for that record, but HTTP/HTTPS does not pass through the proxy. You do not get edge cache or default HTTP protection layers on grey hostnames. That is intentional, not a bug.',
      },
    },
    {
      question: {
        vi: 'Có cần proxy cả apex (example.com) và www không?',
        en: 'Should you proxy both apex (example.com) and www?',
      },
      answer: {
        vi: 'Thường nên — và cấu hình redirect để chỉ còn một URL chính (www hoặc non-www). Nhiều site proxied cả hai rồi dùng Page Rule hoặc redirect rule để thống nhất. Kiểm tra form và cookie sau khi đổi.',
        en: 'Usually yes — and set a redirect so one canonical URL remains (www or non-www). Many sites proxy both then use a redirect rule to unify. Test forms and cookies after changes.',
      },
    },
    {
      question: {
        vi: 'Bật proxy có làm email (MX) bị lỗi không?',
        en: 'Can enabling proxy break email (MX)?',
      },
      answer: {
        vi: 'Bản ghi MX không nên bật proxy HTTP. Chỉ bản ghi web (A/CNAME cho site) dùng đám mây cam. Giữ MX và các bản ghi mail ở chế độ DNS only theo hướng dẫn nhà cung cấp email.',
        en: 'MX records should not use HTTP proxy. Only web records (A/CNAME for the site) use the orange cloud. Keep MX and mail records DNS-only per your email provider’s guidance.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — DNS topics',
      href: 'https://blog.cloudflare.com/tag/dns/',
    },
    {
      title: 'The Cloudflare Blog — CDN topics',
      href: 'https://blog.cloudflare.com/tag/cdn/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['dns', 'cdn', 'proxy'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'waf-bao-ve-website-cho-nguoi-moi',
    'ddos-la-gi-cloudflare-bao-ve-the-nao',
  ],
  hubLinks: [
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
    { href: '/products/cdn/', label: { vi: 'CDN là gì? (trang sản phẩm)', en: 'What is CDN? (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
    { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Use case: tăng tốc nội dung', en: 'Use case: accelerate content delivery' } },
  ],
  diagramSlugs: [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
};
