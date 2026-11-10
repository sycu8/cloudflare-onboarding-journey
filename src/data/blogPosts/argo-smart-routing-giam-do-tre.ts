import type { BlogPost } from '../blog';

/** Entry · CDN — rewritten from Cloudflare Argo Smart Routing and Smart Shield docs */
export const postArgoSmartRoutingGiamDoTre: BlogPost = {
  slug: 'argo-smart-routing-giam-do-tre',
  date: '2026-11-04',
  topic: 'cdn',
  level: 'entry',
  readingMinutes: 8,
  title: {
    vi: 'Argo Smart Routing: đường đi thông minh hơn giữa người dùng và máy chủ gốc',
    en: 'Argo Smart Routing: a smarter path between visitors and your origin',
  },
  description: {
    vi: 'Giải thích Argo Smart Routing cho người mới: vì sao đường Internet công cộng đôi khi chậm, Argo khác cache và Tiered Cache chỗ nào, khi nào nên bật trong Smart Shield, và cách đo trước sau.',
    en: 'A beginner guide to Argo Smart Routing: why the public Internet is sometimes slow, how Argo differs from cache and Tiered Cache, when to turn it on inside Smart Shield, and how to measure before and after.',
  },
  excerpt: {
    vi: 'CDN trả file gần người dùng. Argo lo đoạn đường còn lại tới máy chủ gốc, khi trang không nằm trong cache hoặc trang động phải hỏi origin mỗi lần.',
    en: 'A CDN serves files near the visitor. Argo handles the remaining trip to the origin, when the page is not in cache or a dynamic page must ask the origin every time.',
  },
  keywords: {
    vi: 'Argo Smart Routing là gì, giảm độ trễ, Smart Shield, khác Tiered Cache, đo latency Cloudflare',
    en: 'what is Argo Smart Routing, reduce latency, Smart Shield, Argo vs Tiered Cache, measure Cloudflare latency',
  },
  sections: [
    {
      heading: {
        vi: 'Chậm có khi do đường đi, không chỉ do máy chủ',
        en: 'Slowness is sometimes the path, not only the server',
      },
      paragraphs: [
        {
          vi: 'Người dùng ở xa máy chủ gốc thường thấy web chậm hơn, dù origin không quá tải. Gói tin đi qua Internet công cộng, gặp đoạn nghẽn, rồi mới tới Cloudflare hoặc từ Cloudflare tới origin. CDN giúp nhiều khi file đã nằm ở máy gần người dùng. Trang HTML động, API, hoặc lần đầu chưa có cache vẫn phải đi tới origin. Đoạn đường đó mới là chỗ Argo Smart Routing can thiệp.',
          en: 'Visitors far from the origin often see a slow site even when the origin is not overloaded. Packets cross the public Internet, hit a congested stretch, and only then reach Cloudflare or travel from Cloudflare to the origin. A CDN helps a lot when the file is already on a machine near the visitor. Dynamic HTML, an API, or the first request before cache still has to reach the origin. That stretch is where Argo Smart Routing steps in.',
        },
        {
          vi: 'Tài liệu Argo nói sản phẩm nhìn sự cố mạng theo thời gian thực và đưa traffic web qua đường hiệu quả hơn, né chỗ nghẽn. Kết quả mà Cloudflare mô tả là tải nhanh hơn, ổn định hơn, và đỡ tốn hơn. Lợi ích rõ nhất với người dùng ở xa origin. Trang xử lý website chậm của Cloudflare nói Argo giảm độ trễ trung bình khoảng 30 phần trăm. Đó là mức trung bình họ công bố, không phải lời hứa cho từng site. Site của bạn có thể hơn hoặc kém, nên phải đo.',
          en: 'The Argo docs say the product watches network trouble in real time and sends web traffic over a more efficient path, avoiding congestion. Cloudflare describes the result as faster loads, better reliability, and lower cost. The gain is clearest for visitors far from the origin. The Cloudflare page about slow websites says Argo reduces latency by an average of about 30 percent. That is the average they publish, not a promise for every site. Yours can do better or worse, so measure it.',
        },
        {
          vi: 'Argo hiện nằm trong Smart Shield, lớp Cloudflare dùng để giảm tải cho origin. Gói Smart Shield cơ bản có Smart Tiered Cache và Connection Reuse, chưa gồm Argo. Gói Smart Shield + Argo thêm phần chọn đường, hợp khi khách ở xa máy chủ. Gói Advanced còn có Regional Tiered Cache và Cache Reserve, và cũng gồm Argo. Khách Free, Pro và Business có thể mua Smart Shield hoặc Smart Shield + Argo. Trang Argo nói khách Enterprise có thể xem trước Argo như dịch vụ non-contract: dùng đầy đủ, không tính phí theo lưu lượng, trong thời gian xem trước. Đừng bật một add-on chỉ vì tên nghe nhanh.',
          en: 'Argo now lives inside Smart Shield, the Cloudflare layer that lightens the load on the origin. The base Smart Shield package has Smart Tiered Cache and Connection Reuse, and does not include Argo. Smart Shield + Argo adds the path selection, which fits when visitors are far from the server. The Advanced package also has Regional Tiered Cache and Cache Reserve, and it includes Argo too. Free, Pro, and Business customers can buy Smart Shield or Smart Shield + Argo. The Argo docs say Enterprise customers can preview Argo as a non-contract service: full access, without metered usage fees, during that preview. Do not turn on an add-on only because the name sounds fast.',
        },
      ],
      diagramSlug: 'distributed-web-performance-architecture',
    },
    {
      heading: {
        vi: 'Argo chọn đường. Cache là việc khác',
        en: 'Argo picks a path. Cache is a different job',
      },
      paragraphs: [
        {
          vi: 'Nếu trình duyệt nhận file từ cache gần nhà (`cf-cache-status: HIT`), origin không phải trả file đó. Argo không phải lý do lần HIT đó nhanh. Argo có ích khi request vẫn phải tới origin: lần MISS, trang không được cache, hoặc API động. Tiered Cache giảm số lần origin bị hỏi, bằng cách để một tầng cache phía trên phục vụ nhiều máy gần người dùng. Argo không thay việc đó. Một site chậm vì không cache được CSS vẫn nên sửa Cache Rules trước.',
          en: 'If the browser gets a file from a nearby cache (`cf-cache-status: HIT`), the origin does not have to send that file. Argo is not why that HIT felt fast. Argo helps when the request still has to reach the origin: a MISS, a page that is not cached, or a dynamic API. Tiered Cache cuts how often the origin is asked, by letting an upper cache serve many machines near visitors. Argo does not replace that. A site that is slow because CSS is not cached should fix Cache Rules first.',
        },
        {
          vi: 'Smart Shield chỉ thấy traffic đi qua proxy Cloudflare. Bản ghi DNS chỉ có đám mây xám, tức DNS-only, không đi qua Smart Shield. Muốn Argo có việc để làm, record của website phải được proxy. Origin nằm trong mạng riêng thì tài liệu nói Argo Smart Routing không được hỗ trợ. Đừng lên kế hoạch Argo cho một origin private rồi mới đọc giới hạn đó.',
          en: 'Smart Shield only sees traffic that goes through the Cloudflare proxy. A DNS record with a grey cloud, meaning DNS-only, does not go through Smart Shield. For Argo to have a job, the website record must be proxied. If the origin sits on a private network, the docs say Argo Smart Routing is not supported. Do not plan Argo for a private origin and only then read that limit.',
        },
        {
          vi: 'Khi Argo hoặc Tiered Cache bật, header `cf-ray` mà origin thấy có thể khác `cf-ray` khách nhận. Origin thấy mã của data center đã nối tới origin, không phải data center đã nhận request của khách. Đó là điều tài liệu mô tả, không phải lỗi định tuyến. Số đo thời gian trả lời của origin trong Origin Analytics cũng gồm thời gian đi qua Argo hoặc Tiered Cache nếu bạn đã bật. Nó sẽ cao hơn số mà chính máy chủ đo, vì máy chủ chỉ tính thời gian xử lý của nó.',
          en: 'When Argo or Tiered Cache is on, the `cf-ray` the origin sees can differ from the `cf-ray` the visitor receives. The origin sees the code of the data center that connected to the origin, not the data center that accepted the visitor request. The docs describe that, and it is not a routing bug. Origin response time in Origin Analytics also includes time spent in Argo or Tiered Cache when you have them on. It will be higher than the number the server itself measures, because the server only times its own processing.',
        },
      ],
    },
    {
      heading: {
        vi: 'Khi nào đáng bật, khi nào chưa',
        en: 'When it is worth turning on, and when it is not',
      },
      paragraphs: [
        {
          vi: 'Đáng xem Argo khi khách ở châu lục khác origin, một số đường mạng hay nghẽn, hoặc bạn cần thời gian tới origin đều hơn. Tài liệu xử lý site chậm cũng xếp Argo vào nhóm cách xử lý khi origin ở xa, bên cạnh tăng tỷ lệ cache, Tiered Cache, và đặt origin gần hơn. Nếu người dùng và máy chủ cùng một thành phố, và trang đã cache tốt, Argo ít việc để làm.',
          en: 'Look at Argo when visitors are on another continent from the origin, some network paths congest often, or you need a steadier time to the origin. The slow-website docs also list Argo as a fix when the origin is far away, next to a better cache hit ratio, Tiered Cache, and moving the origin closer. If the visitors and the server share one city, and the pages are already cached well, Argo has less work to do.',
        },
        {
          vi: 'Chưa nên bật khi bạn chưa biết chậm ở đâu. Một truy vấn cơ sở dữ liệu 800 mili giây sẽ vẫn chậm sau khi đường mạng nhanh hơn 30 phần trăm. Sửa app hoặc cache trước. Cũng chưa nên bật để “cho chắc” trên site nội bộ chỉ có người trong nước, nếu biểu đồ chưa cho thấy đường tới origin là nút thắt. Giá nằm trong dashboard, tài liệu không ghi một mức cố định ở trang giới thiệu. Hãy xem gói Smart Shield trước khi bật, vì Argo đi cùng gói đó chứ không còn là một nút riêng biệt như tên cũ.',
          en: 'Wait if you do not yet know where the slowness is. An 800 millisecond database query stays slow after the network path gets 30 percent faster. Fix the app or the cache first. Also wait before turning it on “just in case” for a domestic site, if the charts do not show the path to the origin as the bottleneck. Pricing is in the dashboard. The intro docs do not print one fixed price. Look at the Smart Shield package before you enable it, because Argo now travels with that package rather than as a separate old switch.',
        },
        {
          vi: 'Cách bật trong tài liệu hiện tại: vào dashboard, Speed, rồi Smart Shield, và làm theo hướng dẫn gói. Chọn Smart Shield + Argo khi lý do của bạn là khách ở xa origin. Sau khi bật, Observatory và phân tích Argo là chỗ xem origin có đỡ việc hơn không. Bản xem trước non-contract của Enterprise không có nghĩa là Argo miễn phí mãi. Đọc điều khoản gói của bạn trước khi coi đó là giá dài hạn.',
          en: 'The current docs say to enable it like this: open the dashboard, go to Speed, then Smart Shield, and follow the package guide. Choose Smart Shield + Argo when your reason is visitors far from the origin. After it is on, Observatory and the Argo analytics are where you see whether the origin is doing less work. The Enterprise non-contract preview does not mean Argo stays free. Read your package terms before treating the preview as the long-term price.',
        },
      ],
    },
    {
      heading: {
        vi: 'Đo trước và sau, đừng tin một lần curl',
        en: 'Measure before and after, not one curl',
      },
      paragraphs: [
        {
          vi: 'Trước khi bật, ghi lại ba thứ trong vài ngày có traffic thật. Một: thời gian origin trả header, xem ở Origin Analytics, nhớ là số này gồm cả đường đi. Hai: tỷ lệ cache HIT cho file tĩnh. Ba: một hành trình người dùng thật, ví dụ trang chủ từ mạng nhà và từ điện thoại ngoài văn phòng. Một lệnh curl từ máy bạn chỉ nói về đường của máy đó.',
          en: 'Before you enable it, write down three things across a few days of real traffic. One: how long the origin takes to return headers, in Origin Analytics, remembering that this number includes the path. Two: the cache HIT ratio for static files. Three: one real visitor journey, such as the homepage from a home network and from a phone outside the office. One curl from your laptop only describes that laptop path.',
        },
        {
          vi: 'Sau khi bật, so sánh cùng các số đó, cùng giờ trong tuần nếu được. Phân tích Argo có sẵn để đối chiếu hiệu năng khi có và khi không có Argo. Đừng kết luận sau mười phút. Đường mạng đổi trong ngày. Nếu HIT tăng mà thời gian origin không đổi, bạn vừa sửa cache, không phải vừa thấy Argo. Nếu thời gian origin giảm với khách ở xa mà khách gần origin không đổi, đó đúng hình dạng mà tài liệu mô tả.',
          en: 'After you enable it, compare the same numbers, at the same hour of the week if you can. Argo analytics are there to compare performance with and without Argo. Do not decide after ten minutes. Network paths change during the day. If HIT goes up and origin time stays the same, you fixed cache, you did not just see Argo. If origin time drops for far visitors and stays flat for visitors near the origin, that is the shape the docs describe.',
        },
        {
          vi: 'Câu tự kiểm tra: trang chậm là do file chưa được cache, do app origin, hay do đường tới origin? Chỉ câu thứ ba mới là lý do mở Argo. Đọc trang CDN và Cache Rules trên hub, bài Load Balancing nếu bạn có nhiều origin, và tài liệu Argo cùng Smart Shield khi cần đúng gói. Argo không chặn tấn công và không thay WAF. Nó chỉ chọn đường đi của traffic web đã được proxy.',
          en: 'Self-check: is the slow page an uncached file, a slow origin app, or the path to the origin? Only the third answer is a reason to turn on Argo. Read the CDN and Cache Rules pages on this hub, the Load Balancing post if you have several origins, and the Argo and Smart Shield docs when you need the right package. Argo does not block attacks and does not replace the WAF. It only chooses the path for web traffic that is already proxied.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Argo có thay CDN không?',
        en: 'Does Argo replace a CDN?',
      },
      answer: {
        vi: 'Không. CDN và cache phục vụ nội dung gần người dùng. Argo chọn đường trên mạng Cloudflare cho chặng tới origin. Site nên cache đúng trước, rồi mới xem Argo.',
        en: 'No. The CDN and cache serve content near the visitor. Argo chooses a path on the Cloudflare network for the trip to the origin. Cache the right things first, then look at Argo.',
      },
    },
    {
      question: {
        vi: 'Mọi site đều nhanh hơn khoảng 30 phần trăm à?',
        en: 'Does every site get about 30 percent faster?',
      },
      answer: {
        vi: 'Không. Tài liệu nói mức giảm độ trễ trung bình khoảng 30 phần trăm. Đó là số trung bình, rõ nhất khi người dùng ở xa origin. Hãy đo site của bạn trước và sau.',
        en: 'No. The docs say latency drops by an average of about 30 percent. That is an average, clearest when visitors are far from the origin. Measure your own site before and after.',
      },
    },
    {
      question: {
        vi: 'Origin trong mạng riêng có dùng Argo được không?',
        en: 'Can a private origin use Argo?',
      },
      answer: {
        vi: 'Tài liệu private origins nói Argo Smart Routing không được hỗ trợ cho origin loại này. Đừng bật rồi mới kiểm tra.',
        en: 'The private-origins docs say Argo Smart Routing is not supported for that kind of origin. Do not enable it and check afterwards.',
      },
    },
    {
      question: {
        vi: 'Bật Argo ở đâu trên dashboard?',
        en: 'Where do I enable Argo in the dashboard?',
      },
      answer: {
        vi: 'Tài liệu hiện trỏ tới Speed, rồi Smart Shield, và gói có Argo là Smart Shield + Argo hoặc Advanced. Record DNS của site phải được proxy.',
        en: 'Current docs point to Speed, then Smart Shield. The packages that include Argo are Smart Shield + Argo or Advanced. The site DNS record must be proxied.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Argo',
      href: 'https://blog.cloudflare.com/tag/argo/',
    },
    {
      title: 'Cloudflare Docs — Argo Smart Routing',
      href: 'https://developers.cloudflare.com/argo-smart-routing/',
    },
    {
      title: 'Cloudflare Docs — Smart Shield get started',
      href: 'https://developers.cloudflare.com/smart-shield/get-started/',
    },
    {
      title: 'Cloudflare Docs — Slow website troubleshooting',
      href: 'https://developers.cloudflare.com/speed/troubleshooting/slow-website/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['cdn'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'cache-rules-vs-page-rules-nguoi-moi',
    'load-balancing-ha-website-don-gian',
  ],
  hubLinks: [
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
    { href: '/products/cdn/', label: { vi: 'CDN là gì? (trang sản phẩm)', en: 'What is CDN? (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Use case: tăng tốc nội dung', en: 'Use case: accelerate content delivery' } },
    { href: '/blog/', label: { vi: 'Blog hub', en: 'Blog hub' } },
  ],
  diagramSlugs: ['distributed-web-performance-architecture'],
};
