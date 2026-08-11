import type { BlogPost } from '../blog';

/** Intermediate · Developer Platform — rewritten from Cloudflare Developer Platform blog themes */
export const postDeveloperPlatform: BlogPost = {
  slug: 'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  date: '2026-08-10',
  topic: 'developer-platform',
  level: 'intermediate',
  readingMinutes: 9,
  title: {
    vi: 'Cloudflare Developer Platform: xây ứng dụng toàn cầu mà không tự quản lý server',
    en: 'Cloudflare Developer Platform: build global apps without managing servers yourself',
  },
  description: {
    vi: 'Tổng quan trung cấp về Developer Platform: Workers, lưu trữ, dữ liệu, AI và bảo mật cạnh nhau — cách chọn thành phần khi bạn đã hiểu CDN/WAF cơ bản.',
    en: 'An intermediate overview of the Developer Platform: Workers, storage, data, AI, and security side by side — how to choose building blocks once you know CDN/WAF basics.',
  },
  excerpt: {
    vi: 'Developer Platform giống bộ lego edge: compute (Workers), hộp đựng (R2/KV/D1), AI, và lớp bảo vệ — lắp theo use case thay vì mua cả trung tâm dữ liệu.',
    en: 'The Developer Platform is like an edge Lego set: compute (Workers), storage boxes (R2/KV/D1), AI, and protection layers — assemble by use case instead of buying a whole data center.',
  },
  keywords: {
    vi: 'Cloudflare Developer Platform, Workers R2 D1, xây app serverless, edge platform, học Cloudflare trung cấp',
    en: 'Cloudflare Developer Platform, Workers R2 D1, build serverless apps, edge platform, intermediate Cloudflare',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao “không quản lý server” vẫn là kỹ sư thật?',
        en: 'Why “no servers to manage” is still real engineering',
      },
      paragraphs: [
        {
          vi: 'Serverless không có nghĩa là không có máy chủ — chỉ là bạn không trực tiếp vá OS và thay đĩa. Bạn vẫn thiết kế API, mô hình dữ liệu, giới hạn chi phí, quan sát lỗi, và bảo mật. Developer Platform của Cloudflare gom các khối đó trên cùng mạng đã phục vụ CDN và bảo mật web.',
          en: 'Serverless does not mean no computers exist — it means you are not patching OS disks yourself. You still design APIs, data models, cost limits, error observability, and security. Cloudflare’s Developer Platform colocates those building blocks on the same network that already serves CDN and web security.',
        },
        {
          vi: 'Các bài trên blog.cloudflare.com về Developer Platform, Workers, và AI thường lặp một thông điệp: tích hợp thắng “dụng cụ rời”. Bindings giúp Worker nói chuyện với R2/D1/AI một cách có kiểm soát. Đó là lợi thế khi team nhỏ cần ship nhanh nhưng không muốn mười bảng điều khiển khác nhau.',
          en: 'Cloudflare Blog posts about the Developer Platform, Workers, and AI often repeat one message: integration beats a pile of disconnected tools. Bindings let a Worker talk to R2/D1/AI in a controlled way. That helps small teams ship fast without ten unrelated dashboards.',
        },
        {
          vi: 'Nếu bạn đã đọc các bài CDN, WAF, Workers và AI trong chuỗi này, bạn đang đứng ở điểm nối: Application Services bảo vệ và tăng tốc thứ đang có; Developer Platform giúp bạn xây thứ mới trên edge.',
          en: 'If you have read the CDN, WAF, Workers, and AI posts in this series, you are at the join point: Application Services protect and accelerate what you already have; the Developer Platform helps you build new things on the edge.',
        },
      ],
      diagramSlug: 'programmable-platforms'
    },
    {
      heading: {
        vi: 'Bản đồ thành phần theo câu hỏi sản phẩm (không theo tên marketing)',
        en: 'A component map by product question (not marketing names)',
      },
      paragraphs: [
        {
          vi: 'Cần chạy logic khi có request? → Workers. Cần lưu file/ảnh/backup đối tượng? → R2. Cần key-value đơn giản, đọc nhiều? → KV. Cần SQL cho app vừa? → D1. Cần suy luận AI? → Workers AI (+ AI Gateway khi vận hành). Cần bảo vệ HTTP? → WAF/CDN vẫn nằm trong cùng hệ sinh thái.',
          en: 'Need logic on a request? → Workers. Need object/file/image storage? → R2. Need simple, read-heavy key-value? → KV. Need SQL for a mid-size app? → D1. Need AI inference? → Workers AI (+ AI Gateway for operations). Need HTTP protection? → WAF/CDN still live in the same ecosystem.',
        },
        {
          vi: 'Đừng chọn database vì “nghe hiện đại”. Chọn vì mẫu truy cập: nếu bạn chỉ lưu session flag, KV có thể đủ; nếu bạn cần quan hệ đăng ký workshop và truy vấn, D1 hợp hơn. Hub có use case deploy static site, build serverless app, và build AI applications để bạn đối chiếu.',
          en: 'Do not pick a database because it “sounds modern.” Pick it for access patterns: session flags may fit KV; relational workshop signups fit D1 better. This hub’s deploy-static-site, build-serverless-app, and build-AI-applications use cases help you compare.',
        },
        {
          vi: 'Với SEO/AEO và giữ chân độc giả: mỗi trang sản phẩm trên hub trả lời “là gì / vì sao / khi nào dùng”. Blog này đóng vai trò câu chuyện nối các trang đó — có FAQ, nguồn blog.cloudflare.com, và backlink nội bộ để người đọc không lạc sau định nghĩa đầu tiên.',
          en: 'For SEO/AEO and retention: each product page on this hub answers “what / why / when.” This blog supplies the narrative that connects those pages — with FAQs, blog.cloudflare.com sources, and internal backlinks so readers do not bounce after the first definition.',
        },
      ],
    },
    {
      heading: {
        vi: 'Một lộ trình dự án 2 tuần cho người học trung cấp',
        en: 'A two-week project path for intermediate learners',
      },
      paragraphs: [
        {
          vi: 'Tuần 1: Worker + trang tĩnh (Pages hoặc asset) + một API JSON; thêm WAF/proxy nếu có domain thật. Tuần 2: persistence (D1 hoặc R2), rồi một tính năng AI nhỏ qua Workers AI; bọc AI Gateway nếu bạn gọi mô hình thường xuyên. Viết README bằng tiếng người dùng — đó cũng là luyện AEO.',
          en: 'Week 1: a Worker + static page (Pages or assets) + one JSON API; add WAF/proxy if you have a real domain. Week 2: persistence (D1 or R2), then one small AI feature via Workers AI; wrap AI Gateway if you call models often. Write a human README — that is AEO practice too.',
        },
        {
          vi: 'Khi kẹt, ưu tiên docs chính thức và changelog; dùng bài viết hub để giữ mô hình tinh thần ổn định. Liên kết chéo tới lộ trình Developer Platform, roadmap vai trò Developer, và các bài CDN/WAF/Workers/AI trong blog để tạo vòng học thay vì trang “củi chết”.',
          en: 'When stuck, prefer official docs and the changelog; use hub articles to keep your mental model stable. Cross-link the Developer Platform track, the Developer role roadmap, and the CDN/WAF/Workers/AI posts so learning becomes a loop instead of a dead-end page.',
        },
        {
          vi: 'Mục tiêu không phải “biết hết sản phẩm Cloudflare”. Mục tiêu là chọn đúng 3–5 khối cho một use case, giải thích được cho đồng nghiệp non-tech, và biết chỗ xem nguồn gốc trên blog.cloudflare.com khi nền tảng thay đổi.',
          en: 'The goal is not “know every Cloudflare product.” The goal is to pick the right 3–5 blocks for one use case, explain them to a non-technical teammate, and know where to read originals on blog.cloudflare.com when the platform evolves.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Developer Platform khác “chỉ dùng CDN” như thế nào?',
        en: 'How is the Developer Platform different from “just using the CDN”?',
      },
      answer: {
        vi: 'CDN chủ yếu phân phối và cache nội dung. Developer Platform thêm compute và dịch vụ dữ liệu/AI để bạn xây ứng dụng và API trên cùng mạng edge.',
        en: 'A CDN mainly distributes and caches content. The Developer Platform adds compute plus data/AI services so you can build apps and APIs on the same edge network.',
      },
    },
    {
      question: {
        vi: 'Pages và Workers khác nhau chỗ nào?',
        en: 'What is the difference between Pages and Workers?',
      },
      answer: {
        vi: 'Pages rất mạnh để deploy site/frontend và tích hợp workflow git. Workers là đơn vị compute linh hoạt cho API và logic edge. Nhiều dự án dùng cả hai.',
        en: 'Pages excels at deploying sites/frontends with git workflows. Workers are flexible compute units for APIs and edge logic. Many projects use both.',
      },
    },
    {
      question: {
        vi: 'Tôi nên bắt đầu sản phẩm nào trước trên Developer Platform?',
        en: 'Which Developer Platform product should I start with?',
      },
      answer: {
        vi: 'Hãy bắt đầu với Workers (hoặc Pages nếu bạn ưu tiên site tĩnh), rồi thêm storage khi cần lưu dữ liệu thật. AI là bước tiếp theo khi use case rõ.',
        en: 'Start with Workers (or Pages if you primarily need a static site), then add storage when you must persist real data. Add AI once the use case is clear.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Developer Platform',
      href: 'https://blog.cloudflare.com/tag/developer-platform/',
    },
    {
      title: 'The Cloudflare Blog — Workers',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
    {
      title: 'Cloudflare’s AI Platform (Cloudflare Blog)',
      href: 'https://blog.cloudflare.com/ai-platform/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['workers', 'cdn'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
  ],
  hubLinks: [
    {
      href: '/tracks/developer-platform/',
      label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' },
    },
    {
      href: '/use-cases/developer-platform/',
      label: { vi: 'Use cases Developer Platform', en: 'Developer Platform use cases' },
    },
    {
      href: '/roadmaps/developer/',
      label: { vi: 'Roadmap vai trò Developer', en: 'Developer role roadmap' },
    },
    {
      href: '/changelog/',
      label: { vi: 'Changelog sản phẩm', en: 'Product changelog' },
    },
    {
      href: '/products/workers/',
      label: { vi: 'Workers — khối compute trung tâm', en: 'Workers — central compute block' },
    },
  ],
  diagramSlugs: [
    'fullstack-application',
    'programmable-platforms',
  ],
};
