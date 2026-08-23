import type { BlogPost } from '../blog';

/** Intermediate · CDN — rewritten from Load Balancing / HA blog themes */
export const postLoadBalancingHaWebsiteDon: BlogPost = {
  slug: 'load-balancing-ha-website-don-gian',
  date: '2026-09-12',
  topic: 'cdn',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Load Balancing Cloudflare: khi một server không đủ — HA đơn giản cho vận hành nhỏ',
    en: 'Cloudflare Load Balancing: when one origin is not enough — simple HA for small ops',
  },
  description: {
    vi: 'Giải thích Load Balancing trung cấp: chia traffic, health check, failover; khác gì CDN cache; và khi team nhỏ nên cân nhắc HA thay vì “một server duy nhất”.',
    en: 'An intermediate Load Balancing guide: split traffic, health checks, failover; how it differs from CDN cache; and when small teams should consider HA instead of a single origin.',
  },
  excerpt: {
    vi: 'Load Balancing giống mở thêm quầy phục vụ: khách được chỉ vào quầy còn “khỏe”, quầy hỏng thì tự chuyển — website ít sập hơn khi một origin gặp sự cố.',
    en: 'Load Balancing is like opening extra service counters: customers go to healthy ones, and failed counters drop out — your site stays up more often when one origin breaks.',
  },
  keywords: {
    vi: 'Cloudflare Load Balancing, high availability website, health check failover, chia traffic origin, học HA cơ bản',
    en: 'Cloudflare Load Balancing, high availability website, health check failover, split origin traffic, beginner HA',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao CDN cache không đủ khi origin “chết”?',
        en: 'Why CDN cache is not enough when origin dies',
      },
      paragraphs: [
        {
          vi: 'CDN và cache giúp trang tĩnh mở nhanh và giảm tải origin — nhưng nhiều request vẫn phải về server gốc: đăng nhập, thanh toán, API động, hoặc nội dung cá nhân hóa. Nếu bạn chỉ có một origin và máy đó sập (disk full, deploy lỗi, datacenter mất điện), cache không thể “bịa” ra phiên đăng nhập hay đơn hàng mới.',
          en: 'CDN and cache make static pages fast and lighten origin load — but many requests still reach origin: login, checkout, dynamic APIs, or personalized content. If you have only one origin and it fails (disk full, bad deploy, datacenter outage), cache cannot invent a login session or a new order.',
        },
        {
          vi: 'Load Balancing (cân bằng tải) đặt một lớp điều phối trước nhiều origin: chia traffic theo quy tắc, kiểm tra sức khỏe định kỳ (health check), và tự loại server không phản hồi. Trên blog.cloudflare.com, các bài về load balancing và reliability thường kể câu chuyện “một điểm lỗi” — single point of failure — mà team nhỏ hay bỏ qua cho đến ngày traffic tăng hoặc incident đầu tiên.',
          en: 'Load Balancing places a traffic director in front of multiple origins: split traffic by rules, run periodic health checks, and automatically drop unresponsive servers. Cloudflare Blog posts on load balancing and reliability often tell the “single point of failure” story that small teams ignore until traffic grows or the first incident hits.',
        },
        {
          vi: 'Hãy tưởng tượng nhà hàng có một đầu bếp: CDN là khách lấy món có sẵn ở quầy salad; Load Balancing là có hai đầu bếp và quản lý chuyển khách sang bếp còn hoạt động khi một bếp hỏng bếp. Bạn vẫn cần cả hai lớp cho trải nghiệm tốt.',
          en: 'Picture a restaurant with one chef: CDN is guests grabbing pre-made salad; Load Balancing is having two kitchens and sending diners to the working one when a stove fails. You often need both layers for a good experience.',
        },
      ],
      diagramSlug: 'distributed-web-performance-architecture',
    },
    {
      heading: {
        vi: 'Health check và failover: ngôn ngữ vận hành không cần PhD',
        en: 'Health checks and failover: ops language without a PhD',
      },
      paragraphs: [
        {
          vi: 'Health check là Worker hoặc probe của Cloudflare gọi URL trên mỗi origin (ví dụ `/healthz` trả 200). Nếu vài lần liên tiếp fail, origin bị đánh dấu “unhealthy” và ngừng nhận traffic mới. Failover là chuyển request sang origin còn sống hoặc pool dự phòng — có thể ở region khác.',
          en: 'A health check is a Cloudflare probe calling a URL on each origin (for example `/healthz` returning 200). After several failures, the origin is marked unhealthy and stops receiving new traffic. Failover sends requests to surviving origins or a backup pool — possibly in another region.',
        },
        {
          vi: 'Bạn có thể cấu hình trọng số (weighted): 80% traffic tới server mạnh, 20% tới server nhỏ để test. Hoặc geo routing: user châu Á về origin Singapore, user châu Âu về Frankfurt — giảm độ trễ so với một origin duy nhất ở Mỹ.',
          en: 'You can set weights: 80% traffic to the big server, 20% to a smaller canary. Or geo routing: Asian users to a Singapore origin, European users to Frankfurt — lower latency than one US-only origin.',
        },
        {
          vi: 'Điều quan trọng với team nhỏ: health endpoint phải thật — không trả 200 khi database đã chết. Nhiều sự cố production đến từ `/health` luôn OK trong khi app thực tế không login được. Blog Cloudflare về SRE và performance khuyên health check phản ánh dependency quan trọng (DB, queue) ở mức phù hợp độ phức tạp của bạn.',
          en: 'What matters for small teams: the health endpoint must be honest — do not return 200 when the database is dead. Many production incidents come from `/health` always OK while the app cannot log in. Cloudflare Blog SRE and performance posts recommend health checks that reflect important dependencies (DB, queue) at a complexity level you can maintain.',
        },
      ],
    },
    {
      heading: {
        vi: 'Khi nào team nhỏ nên bật Load Balancing?',
        en: 'When should a small team turn on Load Balancing?',
      },
      paragraphs: [
        {
          vi: 'Cân nhắc khi: (1) downtime 30 phút đã gây thiệt hại doanh thu hoặc uy tín; (2) bạn có thể chạy hai origin (hai VM, hai region, hoặc primary + standby); (3) deploy rolling cần một origin nhận traffic trong khi origin kia cập nhật. Chưa cần khi: site tĩnh hoàn toàn, traffic thấp, và bạn chấp nhận restore từ backup trong vài giờ.',
          en: 'Consider it when: (1) 30 minutes of downtime hurts revenue or reputation; (2) you can run two origins (two VMs, two regions, or primary + standby); (3) rolling deploys need one origin serving while the other updates. You may skip it when: the site is fully static, traffic is low, and you accept hours to restore from backup.',
        },
        {
          vi: 'Load Balancing không thay thế backup database hay kiểm thử deploy — nó chỉ giúp traffic không đổ vào server chết. Kết hợp với CDN (cache tĩnh), WAF (lọc request xấu), và monitoring (biết pool nào unhealthy) để có kiến trúc Application Services cân bằng.',
          en: 'Load Balancing does not replace database backups or deploy testing — it only stops sending traffic to dead servers. Combine it with CDN (static cache), WAF (bad request filtering), and monitoring (know which pool is unhealthy) for a balanced Application Services architecture.',
        },
        {
          vi: 'Trên hub này, lộ trình Application Services và trang CDN giúp bạn đặt Load Balancing đúng chỗ trong “bức tranh lớn”. Đừng mua HA vì FOMO — hãy bắt đầu từ health check thật và runbook khi failover xảy ra (ai được thông báo, làm gì với session sticky).',
          en: 'On this hub, the Application Services track and CDN product page help you place Load Balancing in the bigger picture. Do not buy HA from FOMO — start with honest health checks and a failover runbook (who gets paged, what to do about sticky sessions).',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist triển khai đơn giản trong tuần đầu',
        en: 'A simple first-week deployment checklist',
      },
      paragraphs: [
        {
          vi: 'Một: tạo endpoint `/healthz` kiểm tra DB hoặc dependency tối thiểu. Hai: ít nhất hai origin đồng bộ code (cùng version hoặc blue/green có kế hoạch). Ba: cấu hình pool trên Cloudflare Load Balancing với health check interval hợp lý — quá ngắn tốn tài nguyên, quá dài failover chậm. Bốn: test bằng cách tắt một origin trong staging và xác nhận user vẫn vào được.',
          en: 'One: create a `/healthz` endpoint that checks the DB or minimal dependencies. Two: run at least two origins on the same code (same version or a planned blue/green). Three: configure a pool in Cloudflare Load Balancing with sensible health intervals — too aggressive wastes resources, too slow delays failover. Four: test by shutting down one origin in staging and confirm users still get through.',
        },
        {
          vi: 'Năm: document session affinity — nếu app cần sticky session, hiểu Cloudflare và origin xử lý cookie thế nào khi failover. Sáu: kết hợp với Page Rules hoặc Cache Rules để không cache trang cần origin sống. Đọc bài CDN/cache trong blog hub nếu chưa — HA không cứu được trang dynamic bị cache sai.',
          en: 'Five: document session affinity — if the app needs sticky sessions, understand how Cloudflare and origin handle cookies on failover. Six: pair with Page Rules or Cache Rules so dynamic pages are not wrongly cached. Read the CDN/cache posts on this hub if needed — HA cannot fix wrongly cached dynamic pages.',
        },
        {
          vi: 'Mở bài gốc trên blog.cloudflare.com về load balancing để cập nhật tính năng mới (active monitoring, spectrum, multi-cloud). Câu hỏi tự kiểm tra: “Nếu origin A chết lúc 2 giờ sáng, ai thức dậy và quy trình gì?” Nếu chưa có câu trả lời, HA kỹ thuật chưa đủ — cần runbook con người.',
          en: 'Open original blog.cloudflare.com load balancing posts for newer features (active monitoring, Spectrum, multi-cloud). Self-check: “If origin A dies at 2 a.m., who wakes up and what is the process?” If there is no answer, technical HA is incomplete — you need a human runbook.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Load Balancing có thay CDN không?',
        en: 'Does Load Balancing replace a CDN?',
      },
      answer: {
        vi: 'Không. CDN cache và phân phối nội dung tĩnh gần user. Load Balancing điều phối request tới nhiều origin. Hầu hết site production dùng cả hai.',
        en: 'No. CDN caches and delivers static content near users. Load Balancing directs requests across multiple origins. Most production sites use both.',
      },
    },
    {
      question: {
        vi: 'Cần mấy origin tối thiểu để có HA?',
        en: 'How many origins do I need minimum for HA?',
      },
      answer: {
        vi: 'Thực tế ít nhất hai origin (hoặc primary + standby có thể kích hoạt). Một origin + Load Balancing không tạo HA thật — vẫn là single point of failure.',
        en: 'Practically at least two origins (or primary + standby you can activate). One origin plus Load Balancing is not real HA — still a single point of failure.',
      },
    },
    {
      question: {
        vi: 'Health check fail nhưng site vẫn “vào được” — sao?',
        en: 'Health check fails but the site still “works” — why?',
      },
      answer: {
        vi: 'Có thể user đang nhận cache CDN, hoặc health endpoint quá đơn giản không phản ánh lỗi thật. Hãy kiểm tra path động và đồng bộ health với trải nghiệm login/checkout.',
        en: 'Users may be getting CDN cache, or your health endpoint is too shallow to reflect real failure. Test dynamic paths and align health with login/checkout experience.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Load Balancing topics',
      href: 'https://blog.cloudflare.com/tag/load-balancing/',
    },
    {
      title: 'The Cloudflare Blog — CDN topics',
      href: 'https://blog.cloudflare.com/tag/cdn/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['load-balancing', 'cdn'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'waf-bao-ve-website-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    { href: '/products/load-balancing/', label: { vi: 'Load Balancing (trang sản phẩm)', en: 'Load Balancing (product page)' } },
    { href: '/products/cdn/', label: { vi: 'CDN là gì? (trang sản phẩm)', en: 'What is CDN? (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Use case: tăng tốc nội dung', en: 'Use case: accelerate content delivery' } },
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
  ],
  diagramSlugs: [
    'distributed-web-performance-architecture',
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
  ],
};
