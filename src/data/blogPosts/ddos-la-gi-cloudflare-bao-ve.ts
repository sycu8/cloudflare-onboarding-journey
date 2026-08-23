import type { BlogPost } from '../blog';

/** Entry · Security — rewritten from Cloudflare DDoS / security themes on blog.cloudflare.com */
export const postDdosLaGiCloudflareBaoVeTheNao: BlogPost = {
  slug: 'ddos-la-gi-cloudflare-bao-ve-the-nao',
  date: '2026-08-19',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'DDoS là gì? Cloudflare bảo vệ website thế nào (không thuật ngữ nặng)',
    en: 'What is a DDoS? How Cloudflare protects your site in plain language',
  },
  description: {
    vi: 'Giải thích tấn công DDoS bằng hình ảnh đời thường, Cloudflare hấp thụ traffic xấu thế nào, và phần nào tự động vs phần bạn vẫn cần cấu hình.',
    en: 'Explain DDoS attacks with everyday metaphors, how Cloudflare absorbs bad traffic, and what is automatic versus what you still configure.',
  },
  excerpt: {
    vi: 'DDoS giống hàng nghìn người chen cửa hàng chỉ để làm tắc — không mua gì. Cloudflare đứng trước cửa, phân loại và chặn làn sóng request vô nghĩa trước origin.',
    en: 'A DDoS is like thousands of people crowding your shop door just to block it — not to buy. Cloudflare stands at the door, sorting and blocking meaningless request waves before your origin.',
  },
  keywords: {
    vi: 'DDoS là gì, chống DDoS Cloudflare, bảo vệ website, tấn công từ chối dịch vụ, bảo mật cho người mới',
    en: 'what is DDoS, Cloudflare DDoS protection, website protection, denial of service attack, beginner security',
  },
  sections: [
    {
      heading: {
        vi: 'DDoS là gì — tại sao website “chết” dù server vẫn bật?',
        en: 'What is DDoS — why does a site “die” while the server is still on?',
      },
      paragraphs: [
        {
          vi: 'DDoS (Distributed Denial of Service) là kiểu tấn công làm website hoặc API quá tải bằng lượng request khổng lồ — thường từ nhiều máy bị lợi dụng hoặc botnet. Mục tiêu không phải đánh cắp mật khẩu ngay lập tức, mà làm dịch vụ chậm hoặc sập để gây thiệt hại uy tín, doanh thu, hoặc che hành vi khác.',
          en: 'DDoS (Distributed Denial of Service) floods a website or API with huge request volume — often from compromised machines or botnets. The goal is not always instant password theft; it is to slow or knock the service offline, hurting reputation, revenue, or masking other activity.',
        },
        {
          vi: 'Hình ảnh dễ nhớ: cửa hàng bình thường nhận vài chục khách/giờ. Một ngày có vài nghìn người đứng chen cửa, hỏi giá vô ích, không vào mua — nhân viên kiệt sức, khách thật không lọt được. Server origin của bạn cũng có giới hạn kết nối và CPU; DDoS khai thác giới hạn đó.',
          en: 'Easy metaphor: a normal shop serves dozens of visitors per hour. One day thousands crowd the door, ask useless questions, never buy — staff exhaust themselves and real customers cannot enter. Your origin server has connection and CPU limits too; DDoS exploits those limits.',
        },
        {
          vi: 'Các bài trên blog.cloudflare.com về DDoS nhấn mạnh quy mô: tấn công lớn có thể vượt sức một máy chủ đơn lẻ hoặc một đường truyền. Đó là lý do nhiều tổ chức đặt lớp bảo vệ trước origin — không chỉ dựa vào hosting “mạnh hơn một chút”.',
          en: 'Cloudflare Blog posts on DDoS stress scale: large attacks can exceed what one server or one uplink can handle. That is why many organizations place protection in front of origin — not only “a slightly bigger hosting plan.”',
        },
      ],
      diagramSlug: 'protect-hybrid-cloud-networks-with-cloudflare-magic-transit',
    },
    {
      heading: {
        vi: 'Cloudflare chặn DDoS ở đâu trong đường đi request?',
        en: 'Where does Cloudflare block DDoS in the request path?',
      },
      paragraphs: [
        {
          vi: 'Khi site được proxy (đám mây cam), traffic đi qua mạng anycast toàn cầu của Cloudflare trước origin. Lớp chống DDoS có thể nhận diện pattern bất thường — burst request, giao thức lạ, amplification — và hấp thụ hoặc lọc gần nguồn tấn công hơn là để mọi thứ đổ về một IP origin duy nhất.',
          en: 'When a site is proxied (orange cloud), traffic hits Cloudflare’s global anycast network before origin. DDoS mitigation can spot abnormal patterns — request bursts, odd protocols, amplification — and absorb or filter closer to the attack source instead of dumping everything on one origin IP.',
        },
        {
          vi: 'Với hầu hết khách hàng proxy HTTP/HTTPS, nhiều biện pháp chạy tự động — bạn không cần “bật nút chống DDoS” riêng cho từng đợt nhỏ. Điều đó khác với WAF tinh chỉnh theo ứng dụng: DDoS tập trung vào khối lượng và hành vi mạng; WAF tập trung vào lỗ hổng HTTP như injection.',
          en: 'For most proxied HTTP/HTTPS customers, many measures run automatically — you do not flip a separate “anti-DDoS switch” for every small wave. That differs from app-tuned WAF: DDoS focuses on volume and network behavior; WAF focuses on HTTP flaws like injection.',
        },
        {
          vi: 'Enterprise hoặc mạng lớn có thể dùng thêm sản phẩm như Magic Transit cho IP range — vượt phạm vi bài này, nhưng cùng triết lý: chặn sớm, phân tán, không để một điểm gãy.',
          en: 'Enterprise or large networks may add products like Magic Transit for IP ranges — beyond this post’s scope, but same philosophy: block early, distribute load, avoid a single breaking point.',
        },
      ],
    },
    {
      heading: {
        vi: 'Tự động vs phần bạn vẫn nên cấu hình',
        en: 'Automatic protection vs what you should still configure',
      },
      paragraphs: [
        {
          vi: 'Tự động (với proxy): lớp chống DDoS network/application cơ bản, anycast hấp thụ traffic, một phần bot và rate anomaly. Bạn vẫn nên: bật đám mây cam cho hostname công khai; giữ origin không lộ IP trực tiếp nếu có thể; theo dõi Security Analytics khi có sự cố.',
          en: 'Automatic (with proxy): baseline network/application DDoS mitigation, anycast absorption, some bot and rate anomaly handling. You should still: orange-cloud public hostnames; avoid exposing origin IP when possible; watch Security Analytics during incidents.',
        },
        {
          vi: 'Cấu hình thêm khi cần: WAF managed rules cho tấn công lớp ứng dụng; rate limiting cho login/API; Bot Management cho chiến dịch quét; firewall origin chỉ cho phép Cloudflare (và IP admin). DDoS “thô” và WAF/bot bổ sung cho nhau — không thay thế.',
          en: 'Extra configuration when needed: WAF managed rules for application-layer attacks; rate limiting on login/API; Bot Management during scan campaigns; origin firewall allowing only Cloudflare (and admin IPs). Raw DDoS mitigation and WAF/bot layers complement each other.',
        },
        {
          vi: 'Nếu bạn mới học Application Services trên hub: thứ tự hợp lý là DNS/proxy → hiểu DDoS tự động → WAF baseline → cache đúng chỗ. Đừng bỏ qua proxy xám rồi thắc mắc vì sao không có lớp bảo vệ HTTP.',
          en: 'If you are new to the Application Services track on this hub: a sensible order is DNS/proxy → understand automatic DDoS → WAF baseline → cache in the right places. Do not stay grey-cloud and wonder why HTTP protection never appears.',
        },
        {
          vi: 'Khi bị tấn công thật: ghi lại thời điểm, hostname, và biểu đồ request; tránh restart origin liên tục mà không xem log; liên hệ support nếu gói của bạn có kênh khẩn cấp. Panic reboot hiếm khi là chiến lược DDoS tốt.',
          en: 'During a real attack: note time, hostname, and request charts; avoid endless origin reboots without reading logs; contact support if your plan has an emergency channel. Panic reboots are rarely a good DDoS strategy.',
        },
      ],
      diagramSlug: 'bot-management',
    },
    {
      heading: {
        vi: 'Dấu hiệu nhận biết và bước đầu tự vệ',
        en: 'Warning signs and first self-defense steps',
      },
      paragraphs: [
        {
          vi: 'Dấu hiệu: trang timeout đồng loạt, CPU origin 100% dù ít người dùng thật, băng thông tăng đột biến, log đầy request giống nhau từ nhiều IP. Có thể là DDoS, crawler hung, hoặc lỗi deploy — cần nhìn dashboard trước khi kết luận.',
          en: 'Signs: widespread timeouts, origin CPU at 100% with few real users, bandwidth spikes, logs full of similar requests from many IPs. Could be DDoS, an aggressive crawler, or a bad deploy — check the dashboard before concluding.',
        },
        {
          vi: 'Bước đầu: xác nhận proxy đang bật; bật “Under Attack Mode” tạm thời nếu Cloudflare gợi ý trong sự cố lớn (có thể thêm challenge cho visitor); siết rate limit đường dẫn bị nhắm; purge cache nếu nội dung tĩnh bị lạm dụng. Đọc bài WAF và CDN trên hub để hiểu lớp kế tiếp.',
          en: 'First steps: confirm proxy is on; temporarily enable Under Attack Mode during major incidents (may add visitor challenges); tighten rate limits on targeted paths; purge cache if static content is abused. Read the WAF and CDN posts on this hub for the next layers.',
        },
        {
          vi: 'Phòng lâu dài: không publish origin IP; dùng CDN/cache cho asset nặng; cập nhật phần mềm; có kế hoạch incident đơn giản (ai xem dashboard, ai nói với khách). DDoS là rủi ro kinh doanh — chuẩn bị nhẹ vẫn tốt hơn học trong đợt tấn công đầu tiên.',
          en: 'Long-term: do not publish origin IP; use CDN/cache for heavy assets; patch software; keep a simple incident plan (who watches the dashboard, who talks to customers). DDoS is a business risk — light preparation beats learning only during the first attack.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'DDoS và hack database có giống nhau không?',
        en: 'Is DDoS the same as hacking a database?',
      },
      answer: {
        vi: 'Không. DDoS nhắm làm dịch vụ quá tải hoặc không truy cập được. Hack database thường là lợi dụng lỗ hổng phần mềm hoặc credential yếu. Cả hai đều nguy hiểm nhưng cần biện pháp khác nhau — WAF và vá lỗi quan trọng cho lớp ứng dụng.',
        en: 'No. DDoS aims to overload or make a service unreachable. Database hacks usually exploit software bugs or weak credentials. Both are serious but need different defenses — WAF and patching matter for the application layer.',
      },
    },
    {
      question: {
        vi: 'Site DNS only (xám) có được bảo vệ DDoS HTTP không?',
        en: 'Does a DNS-only (grey) site get HTTP DDoS protection?',
      },
      answer: {
        vi: 'Lớp bảo vệ HTTP/DDoS qua proxy không áp dụng khi traffic không đi qua Cloudflare. Bạn vẫn dùng DNS Cloudflare, nhưng request thẳng origin — cần biện pháp khác hoặc bật proxy cho hostname web.',
        en: 'HTTP/DDoS protection through the proxy does not apply when traffic does not pass Cloudflare. You still use Cloudflare DNS, but requests hit origin directly — you need other measures or orange-cloud for web hostnames.',
      },
    },
    {
      question: {
        vi: 'Under Attack Mode có ảnh hưởng khách thật không?',
        en: 'Does Under Attack Mode affect real visitors?',
      },
      answer: {
        vi: 'Có thể — thường thêm bước xác minh (challenge) trước khi vào site. Dùng khi đang bị tấn công lớn, tắt lại khi ổn định. Cân bằng giữa bảo vệ và trải nghiệm người dùng.',
        en: 'It can — often by adding a verification challenge before the site loads. Use it during major attacks and turn it off when stable. Balance protection with user experience.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — DDoS topics',
      href: 'https://blog.cloudflare.com/tag/ddos/',
    },
    {
      title: 'The Cloudflare Blog — Security topics',
      href: 'https://blog.cloudflare.com/tag/security/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['ddos', 'waf'],
  relatedPostSlugs: [
    'waf-bao-ve-website-cho-nguoi-moi',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'dns-proxy-dam-may-cam-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/waf/', label: { vi: 'WAF là gì? (trang sản phẩm)', en: 'What is WAF? (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect website' } },
    { href: '/use-cases/defend-ddos-attacks/', label: { vi: 'Use case: chống DDoS', en: 'Use case: defend DDoS attacks' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: [
    'protect-hybrid-cloud-networks-with-cloudflare-magic-transit',
    'bot-management',
  ],
};
