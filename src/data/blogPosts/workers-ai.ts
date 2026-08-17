import type { BlogPost } from '../blog';

/** Entry–intermediate · AI — rewritten from Workers AI / AI platform blog themes */
export const postWorkersAi: BlogPost = {
  slug: 'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
  date: '2026-08-08',
  topic: 'ai',
  level: 'entry',
  readingMinutes: 8,
  title: {
    vi: 'Workers AI là gì? Chạy mô hình AI trên Cloudflare mà không tự quản lý GPU',
    en: 'What is Workers AI? Run AI models on Cloudflare without managing GPUs yourself',
  },
  description: {
    vi: 'Giải thích Workers AI theo ngôn ngữ đời thường: inference là gì, vì sao không cần tự mua GPU, và cách nó gắn với Workers, AI Gateway, Agents trên Developer Platform.',
    en: 'A plain-language guide to Workers AI: what inference means, why you may not need your own GPUs, and how it connects to Workers, AI Gateway, and Agents on the Developer Platform.',
  },
  excerpt: {
    vi: 'Workers AI giống thuê bếp công nghiệp đã sẵn sàng: bạn gọi món (mô hình), nhận kết quả — không phải tự xây nhà bếp GPU.',
    en: 'Workers AI is like renting a ready commercial kitchen: you order a dish (model), get results — without building your own GPU kitchen.',
  },
  keywords: {
    vi: 'Workers AI là gì, chạy AI trên Cloudflare, inference edge, AI không cần GPU, học AI Cloudflare',
    en: 'what is Workers AI, run AI on Cloudflare, edge inference, AI without GPUs, learn Cloudflare AI',
  },
  sections: [
    {
      heading: {
        vi: 'Inference: phần “dùng AI” mà hầu hết sản phẩm cần',
        en: 'Inference: the “use AI” step most products need',
      },
      paragraphs: [
        {
          vi: 'Khi báo chí nói “train mô hình”, đó là giai đoạn rất đắt và chuyên sâu — giống viết sách giáo khoa. Còn hầu hết ứng dụng bạn dùng hàng ngày chỉ cần inference: đưa câu hỏi hoặc ảnh vào mô hình đã có sẵn và nhận câu trả lời. Workers AI tập trung vào inference trên mạng Cloudflare.',
          en: 'When the press talks about “training a model,” that is an expensive, specialist stage — like writing a textbook. Most everyday apps only need inference: send a question or image into an existing model and get an answer. Workers AI focuses on inference on Cloudflare’s network.',
        },
        {
          vi: 'Theo hướng các bài trên blog.cloudflare.com về Workers AI và AI Platform, ý tưởng cốt lõi là: developer gọi API/binding, Cloudflare lo phần chạy mô hình quy mô lớn — kể cả các mô hình open-source frontier — để bạn không phải trở thành kỹ sư GPU mới bắt đầu được.',
          en: 'Following themes from Cloudflare Blog posts on Workers AI and the AI Platform, the core idea is: developers call an API or binding, Cloudflare handles running models at scale — including frontier open-source models — so you do not need to become a GPU engineer just to start.',
        },
        {
          vi: 'Điều này quan trọng với team nhỏ tại Việt Nam và khu vực: bạn có thể thử chatbot nội bộ, tóm tắt tài liệu, phân loại ticket hỗ trợ, hoặc tạo embedding tìm kiếm mà chưa đầu tư cụm máy đắt tiền.',
          en: 'That matters for small teams in Vietnam and beyond: you can try an internal chatbot, document summarization, support-ticket classification, or search embeddings without investing in an expensive GPU cluster first.',
        },
      ],
      diagramSlug: 'ai-composable'
    },
    {
      heading: {
        vi: 'Workers AI nằm ở đâu trong “bức tranh” Developer Platform?',
        en: 'Where Workers AI sits in the Developer Platform picture',
      },
      paragraphs: [
        {
          vi: 'Một Worker nhận request từ người dùng → gọi Workers AI để sinh câu trả lời → có thể lưu lịch sử vào D1 hoặc file vào R2 → trả kết quả về trình duyệt. AI Gateway có thể đứng giữa để quan sát, giới hạn, và định tuyến tới nhiều nhà cung cấp mô hình.',
          en: 'A Worker receives a user request → calls Workers AI to generate an answer → may store history in D1 or files in R2 → returns a result to the browser. AI Gateway can sit in the middle to observe, rate-limit, and route across model providers.',
        },
        {
          vi: 'Khi Cloudflare nói về agents, họ thường nối thêm Durable Objects, Workflows, và SDK chuyên cho agent — vì chatbot “có trí nhớ và công cụ” cần hơn một lần gọi mô hình. Bạn không phải học hết trong ngày; hãy xem Workers AI là bước 1: gọi được một mô hình từ code.',
          en: 'When Cloudflare talks about agents, they often add Durable Objects, Workflows, and an Agents SDK — because a chatbot with memory and tools needs more than one model call. You do not learn it all in a day; treat Workers AI as step one: successfully calling a model from code.',
        },
        {
          vi: 'Trên hub này, hãy nối kiến thức với lộ trình AI Security & Adoption, cheatsheet bảo vệ AI, và use case xây ứng dụng AI. Bảo mật không đứng sau cùng: prompt injection, lộ dữ liệu, và lạm dụng bot là rủi ro thật ngay cả với demo nhỏ.',
          en: 'On this hub, connect the idea to the AI Security & Adoption track, the AI protection cheatsheet, and the build-AI-applications use case. Security is not last: prompt injection, data leakage, and bot abuse are real risks even for small demos.',
        },
      ],
    },
    {
      heading: {
        vi: 'Lộ trình học thực tế trong vài ngày (không cần nền ML)',
        en: 'A practical few-day learning path (no ML degree required)',
      },
      paragraphs: [
        {
          vi: 'Ngày 1: hiểu Worker là gì (đọc bài Workers trong blog này). Ngày 2: chạy ví dụ inference đơn giản theo docs. Ngày 3: thêm AI Gateway để nhìn log và kiểm soát. Ngày 4: viết lại sản phẩm bằng ngôn ngữ người dùng — vì AEO/SEO cũng cần câu trả lời rõ ràng cho câu hỏi “Workers AI là gì?”.',
          en: 'Day 1: understand what a Worker is (read the Workers post in this blog). Day 2: run a simple inference example from the docs. Day 3: add AI Gateway for logs and control. Day 4: rewrite your product story in human language — because AEO/SEO also need a clear answer to “What is Workers AI?”.',
        },
        {
          vi: 'Khi đọc blog.cloudflare.com, hãy tách hai lớp: (1) thông báo sản phẩm / mô hình mới, và (2) nguyên tắc bền vững — chạy gần người dùng, ít tự vận hành hạ tầng, tích hợp platform. Lớp 2 giúp bạn quyết định kiến trúc; lớp 1 giúp bạn cập nhật lựa chọn mô hình.',
          en: 'When reading blog.cloudflare.com, separate two layers: (1) product/model announcements, and (2) durable principles — run near users, less DIY infrastructure, platform integration. Layer 2 guides architecture; layer 1 updates model choices.',
        },
        {
          vi: 'Cuối cùng, đo thành công bằng use case chứ không bằng “chạy được model to”. Một mô hình nhỏ trả lời đúng FAQ nội bộ vẫn giá trị hơn demo hào nhoáng không ai dùng. Giữ chân người xem web cũng vậy: bài viết rõ ràng + đường dẫn học tiếp trên hub quan trọng hơn thuật ngữ thời thượng.',
          en: 'Finally, measure success by use case, not by “we ran a huge model.” A small model that answers internal FAQs well beats a flashy demo nobody uses. The same is true for retaining readers: clear writing plus next-step hub links beats trendy jargon.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Workers AI khác ChatGPT ở chỗ nào?',
        en: 'How is Workers AI different from ChatGPT?',
      },
      answer: {
        vi: 'ChatGPT là sản phẩm chat cho người dùng cuối. Workers AI là nền tảng inference để bạn gắn mô hình vào ứng dụng/API của mình trên Cloudflare, kiểm soát trải nghiệm và tích hợp dữ liệu riêng (với thiết kế phù hợp).',
        en: 'ChatGPT is an end-user chat product. Workers AI is an inference platform for wiring models into your own apps/APIs on Cloudflare, so you control the experience and can integrate your data with a proper design.',
      },
    },
    {
      question: {
        vi: 'Có cần biết Python/ML để dùng Workers AI không?',
        en: 'Do I need Python/ML skills to use Workers AI?',
      },
      answer: {
        vi: 'Không bắt buộc để bắt đầu. Nhiều ví dụ dùng JavaScript/TypeScript với Workers. Hiểu prompt, giới hạn mô hình, và bảo mật dữ liệu quan trọng hơn kiến thức train model.',
        en: 'Not required to start. Many examples use JavaScript/TypeScript with Workers. Understanding prompts, model limits, and data security matters more than training expertise.',
      },
    },
    {
      question: {
        vi: 'Workers AI có thay thế được AI Gateway không?',
        en: 'Does Workers AI replace AI Gateway?',
      },
      answer: {
        vi: 'Không. Workers AI chạy/gọi mô hình; AI Gateway giúp quan sát, kiểm soát và thống nhất đường gọi tới nhiều provider. Chúng bổ sung nhau — xem bài AI Gateway trong blog này.',
        en: 'No. Workers AI runs/calls models; AI Gateway helps you observe, control, and unify calls across providers. They complement each other — see the AI Gateway post in this blog.',
      },
    },
  ],
  sources: [
    {
      title: 'Powering the agents: Workers AI large models (Cloudflare Blog)',
      href: 'https://blog.cloudflare.com/workers-ai-large-models/',
    },
    {
      title: 'Cloudflare’s AI Platform (Cloudflare Blog)',
      href: 'https://blog.cloudflare.com/ai-platform/',
    },
    {
      title: 'The Cloudflare Blog — Workers AI tag',
      href: 'https://blog.cloudflare.com/tag/workers-ai/',
    },
  ],
  relatedTrack: 'ai-security-adoption',
  relatedProductSlugs: ['workers-ai', 'workers', 'ai-gateway'],
  relatedPostSlugs: [
    'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    {
      href: '/products/workers-ai/',
      label: { vi: 'Workers AI là gì? (trang sản phẩm)', en: 'What is Workers AI? (product page)' },
    },
    {
      href: '/tracks/ai-security-adoption/',
      label: { vi: 'Lộ trình AI Security & Adoption', en: 'AI Security & Adoption track' },
    },
    {
      href: '/cheatsheets/ai-protection-portfolio/',
      label: { vi: 'Cheatsheet bảo vệ AI', en: 'AI protection cheatsheet' },
    },
    {
      href: '/use-cases/build-ai-applications/',
      label: { vi: 'Use case: xây ứng dụng AI', en: 'Use case: build AI applications' },
    },
    {
      href: '/tracks/developer-platform/',
      label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' },
    },
  ],
  diagramSlugs: [
    'ai-rag',
    'ai-composable',
  ],
};
