import type { BlogPost } from '../blog';

/** Entry · Workers — rewritten from Cloudflare Workers blog themes */
export const postWorkersIntro: BlogPost = {
  slug: 'cloudflare-workers-la-gi-cho-nguoi-moi',
  date: '2026-08-07',
  topic: 'workers',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Cloudflare Workers là gì? Serverless ở “mép mạng” giải thích đơn giản',
    en: 'What are Cloudflare Workers? Serverless at the edge, explained simply',
  },
  description: {
    vi: 'Workers giúp bạn chạy code gần người dùng mà không thuê máy chủ truyền thống. Bài viết dành cho người mới: use case thực tế, khác gì hosting thường, và lộ trình học tiếp.',
    en: 'Workers let you run code near users without renting traditional servers. A beginner guide: real use cases, how it differs from classic hosting, and what to learn next.',
  },
  excerpt: {
    vi: 'Workers giống thuê “người trực” ngay gần khách hàng: nhận request, xử lý nhanh, trả kết quả — bạn không phải tự mua và bảo trì cả tòa nhà server.',
    en: 'Workers are like stationing helpers near customers: take a request, handle it quickly, return a result — without buying and maintaining a whole server building.',
  },
  keywords: {
    vi: 'Cloudflare Workers là gì, serverless, edge computing, chạy code không server, học Workers cơ bản',
    en: 'what are Cloudflare Workers, serverless, edge computing, run code without servers, Workers beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Server truyền thống vs Workers: khác nhau ở trách nhiệm của bạn',
        en: 'Traditional servers vs Workers: what you are responsible for',
      },
      paragraphs: [
        {
          vi: 'Với server truyền thống hoặc VPS, bạn (hoặc team) thường lo hệ điều hành, bản vá, dung lượng đĩa, và “máy còn sống lúc 3 giờ sáng không”. Với mô hình serverless như Cloudflare Workers, bạn tập trung vào đoạn code xử lý request; Cloudflare lo việc chạy code trên mạng toàn cầu.',
          en: 'With a traditional server or VPS, you (or your team) often own the OS, patches, disk space, and “is the box alive at 3 a.m.?” With serverless like Cloudflare Workers, you focus on the code that handles a request; Cloudflare runs it on a global network.',
        },
        {
          vi: '“Edge” nghĩa là điểm gần người dùng trong mạng Cloudflare. Thay vì mọi logic API phải về một region cố định, Workers có thể thực thi gần nơi request xuất hiện — hữu ích cho xác thực, chuyển hướng, A/B nhẹ, ghép header bảo mật, hoặc API nhỏ.',
          en: '“Edge” means a location closer to the user on Cloudflare’s network. Instead of every API call returning to one fixed region, Workers can run near where the request appears — useful for auth checks, redirects, light A/B tests, security headers, or small APIs.',
        },
        {
          vi: 'Blog chính thức của Cloudflare thường mô tả Workers như viên gạch trung tâm của Developer Platform: từ đó bạn nối thêm R2 (lưu file), D1 (database), KV, AI, và nhiều dịch vụ khác bằng bindings — cách “gắn” tài nguyên vào Worker mà không nhúng secret lung tung trong code frontend.',
          en: 'The official Cloudflare Blog often describes Workers as the center brick of the Developer Platform: from there you attach R2 (object storage), D1 (database), KV, AI, and more via bindings — a way to wire resources into a Worker without scattering secrets in frontend code.',
        },
      ],
      diagramSlug: 'serverless-global-apis'
    },
    {
      heading: {
        vi: 'Ví dụ đời thực cho người chưa phải kỹ sư hệ thống',
        en: 'Real-life examples if you are not a systems engineer',
      },
      paragraphs: [
        {
          vi: 'Ví dụ 1: form đăng ký workshop gửi vào API. Worker nhận dữ liệu, kiểm tra cơ bản, ghi vào D1, trả lời JSON. Bạn không cần mở một server Node.js 24/7 chỉ vì vài chục đăng ký mỗi ngày.',
          en: 'Example 1: a workshop signup form posts to an API. A Worker receives the payload, does basic checks, writes to D1, returns JSON. You do not need a 24/7 Node.js server just for a few dozen signups a day.',
        },
        {
          vi: 'Ví dụ 2: website marketing cần thêm header bảo mật hoặc chuyển ngôn ngữ theo đường dẫn. Worker đứng trước origin, chỉnh response nhanh — giống “lễ tân” sửa hướng dẫn trước khi khách vào bên trong.',
          en: 'Example 2: a marketing site needs security headers or language redirects. A Worker sits in front of origin and adjusts the response quickly — like a receptionist updating directions before guests walk inside.',
        },
        {
          vi: 'Ví dụ 3: tạo API trả QR, rút gọn link, hoặc webhook Slack. Đây là các tutorial phổ biến trên docs Cloudflare — và cũng là lý do hub này có lộ trình Developer Platform cùng trang sản phẩm Workers.',
          en: 'Example 3: an API that returns QR codes, short links, or Slack webhooks. These are common Cloudflare docs tutorials — and why this hub has a Developer Platform track plus a Workers product page.',
        },
      ],
    },
    {
      heading: {
        vi: 'Workers không phải phép màu — giới hạn tư duy giúp bạn chọn đúng',
        en: 'Workers are not magic — healthy limits help you choose well',
      },
      paragraphs: [
        {
          vi: 'Workers rất mạnh cho tác vụ ngắn, gắn với request/response hoặc workflow được thiết kế cho nền tảng. Nếu bạn cần máy ảo chạy tiến trình nặng hàng giờ theo kiểu desktop, đó là bài toán khác (container/VM). Hiểu ranh giới giúp tránh thất vọng.',
          en: 'Workers shine for short tasks tied to request/response or platform-native workflows. If you need a VM running heavy desktop-style jobs for hours, that is a different problem (containers/VMs). Knowing the boundary prevents disappointment.',
        },
        {
          vi: 'Người mới nên bắt đầu từ một Worker “Hello”, rồi nối một binding đơn giản, rồi mới tới AI hoặc hệ thống phức tạp. Đọc tiếp bài Workers AI và Developer Platform trong blog này; đồng thời mở bài gốc trên blog.cloudflare.com khi bạn sẵn sàng đi sâu kiến trúc.',
          en: 'Beginners should start with a “Hello” Worker, then one simple binding, then AI or richer systems. Continue with the Workers AI and Developer Platform posts in this blog; open original Cloudflare Blog architecture posts when you are ready to go deeper.',
        },
        {
          vi: 'Nếu mục tiêu của bạn là giữ chân người học trên hub: hãy dùng Workers như cầu nối từ lý thuyết CDN/WAF sang “tôi có thể xây được thứ gì đó”. Mỗi lần bạn deploy thành công một Worker, khái niệm edge trở nên cụ thể.',
          en: 'If your goal is durable learning on this hub: treat Workers as the bridge from CDN/WAF theory to “I can build something.” Each successful Worker deploy makes the edge concept concrete.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Workers có cần thẻ tín dụng ngay không?',
        en: 'Do I need a credit card to try Workers?',
      },
      answer: {
        vi: 'Cloudflare thường có mức Free để học và thử nghiệm. Luôn kiểm tra bảng giá và giới hạn hiện tại trên trang chính thức trước khi đưa vào production.',
        en: 'Cloudflare typically offers a Free tier for learning and experiments. Always check current pricing and limits on the official site before production use.',
      },
    },
    {
      question: {
        vi: 'Workers thay thế được website WordPress không?',
        en: 'Can Workers replace a WordPress site?',
      },
      answer: {
        vi: 'Không phải lúc nào cũng vậy. Workers giỏi xử lý logic/API/edge; WordPress là CMS đầy đủ. Nhiều đội dùng cả hai: WordPress (hoặc origin khác) phía sau, Workers/CDN/WAF phía trước.',
        en: 'Not always. Workers excel at logic/APIs/edge; WordPress is a full CMS. Many teams use both: WordPress (or another origin) behind, Workers/CDN/WAF in front.',
      },
    },
    {
      question: {
        vi: 'Nên học Workers trước hay CDN/WAF trước?',
        en: 'Should I learn Workers before CDN/WAF?',
      },
      answer: {
        vi: 'Nếu bạn vận hành website có sẵn, học DNS/proxy/CDN/WAF trước sẽ thực tế hơn. Nếu bạn là developer muốn xây API, có thể bắt đầu Workers sớm — vẫn nên hiểu proxy và bảo mật cơ bản.',
        en: 'If you already run a website, DNS/proxy/CDN/WAF first is more practical. If you are a developer building APIs, you can start Workers early — but still learn basic proxy and security ideas.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
    {
      title: 'The Cloudflare Blog — Developer Platform topics',
      href: 'https://blog.cloudflare.com/tag/developer-platform/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['workers'],
  relatedPostSlugs: [
    'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/workers/', label: { vi: 'Workers là gì? (trang sản phẩm)', en: 'What are Workers? (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: ứng dụng serverless', en: 'Use case: build a serverless app' } },
    { href: '/use-cases/deploy-static-site/', label: { vi: 'Use case: deploy static site', en: 'Use case: deploy a static site' } },
    { href: '/roadmaps/developer/', label: { vi: 'Roadmap cho Developer', en: 'Developer role roadmap' } },
  ],
  diagramSlugs: [
    'fullstack-application',
    'serverless-global-apis',
  ],
};
