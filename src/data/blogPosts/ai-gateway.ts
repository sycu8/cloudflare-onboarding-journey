import type { BlogPost } from '../blog';

/** Intermediate · AI + Security — rewritten from AI Gateway / AI platform blog themes */
export const postAiGateway: BlogPost = {
  slug: 'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
  date: '2026-08-09',
  topic: 'ai',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'AI Gateway là gì? Kiểm soát, quan sát và bảo vệ traffic AI trên Cloudflare',
    en: 'What is AI Gateway? Control, observe, and protect AI traffic on Cloudflare',
  },
  description: {
    vi: 'Giải thích AI Gateway cho người học trung cấp: vì sao không nên gọi mô hình “trần”, cách gateway giúp log/retry/giới hạn, và liên hệ bảo mật ứng dụng AI.',
    en: 'An intermediate explainer of AI Gateway: why you should not call models “raw,” how a gateway helps with logs/retries/limits, and how it ties to AI application security.',
  },
  excerpt: {
    vi: 'AI Gateway giống trung tâm điều phối cuộc gọi tới các “chuyên gia AI”: ghi nhật ký, giới hạn, đổi hướng — để bạn không mất kiểm soát khi app lớn dần.',
    en: 'AI Gateway is like a switchboard for calls to AI specialists: logging, limits, routing — so you keep control as the app grows.',
  },
  keywords: {
    vi: 'AI Gateway Cloudflare, kiểm soát traffic AI, quan sát LLM, bảo mật ứng dụng AI, AI observability',
    en: 'Cloudflare AI Gateway, AI traffic control, LLM observability, AI application security, AI observability',
  },
  sections: [
    {
      heading: {
        vi: 'Vấn đề thật: app AI “chạy được” nhưng không quản trị được',
        en: 'The real problem: AI apps that work but cannot be operated',
      },
      paragraphs: [
        {
          vi: 'Nhiều prototype AI gọi thẳng API nhà cung cấp từ backend. Demo đẹp — rồi production đến: không biết user nào tốn token, lỗi upstream lúc cao điểm, một prompt lỗi làm chi phí nhảy vọt, hoặc dữ liệu nhạy cảm lọt vào log bên thứ ba.',
          en: 'Many AI prototypes call a provider API directly from the backend. The demo looks great — then production arrives: you cannot see which users burn tokens, upstream errors spike, one bad prompt explodes cost, or sensitive data leaks into a third-party log.',
        },
        {
          vi: 'AI Gateway giải quyết lớp “đường ống”: thay vì mỗi service tự gọi mô hình theo cách riêng, bạn đưa traffic AI qua một cửa kiểm soát. Trên blog.cloudflare.com, các bài AI Platform/AI Gateway nhấn mạnh unified API, observability, retry, và khả năng đổi provider với ít thay đổi code.',
          en: 'AI Gateway addresses the “plumbing” layer: instead of every service calling models its own way, you send AI traffic through one control door. Cloudflare Blog posts on the AI Platform/AI Gateway emphasize a unified API, observability, retries, and switching providers with less code churn.',
        },
        {
          vi: 'Với người học trung cấp, đây là bước trưởng thành từ “gọi được LLM” sang “vận hành được sản phẩm AI”. Nó cũng là cầu nối tự nhiên sang bảo mật: bạn khó bảo vệ thứ bạn không nhìn thấy.',
          en: 'For intermediate learners, this is the maturity step from “we can call an LLM” to “we can operate an AI product.” It also bridges into security: you cannot protect what you cannot see.',
        },
      ],
      diagramSlug: 'ai-composable'
    },
    {
      heading: {
        vi: 'Ba việc AI Gateway giúp ngay cả khi bạn chưa phải chuyên gia ML',
        en: 'Three things AI Gateway helps with even if you are not an ML expert',
      },
      paragraphs: [
        {
          vi: 'Quan sát: biết request nào chậm, fail, hoặc bất thường. Giới hạn và kiểm soát: giảm rủi ro một client hoặc bot làm cạn hạn mức. Linh hoạt nhà cung cấp: Workers AI và mô hình bên thứ ba có thể đi qua cùng lớp điều phối — hữu ích khi bạn thử nghiệm chất lượng/giá.',
          en: 'Observability: see which requests are slow, failing, or weird. Limits and control: reduce the risk that one client or bot burns your quota. Provider flexibility: Workers AI and third-party models can share one control layer — useful when you experiment with quality and price.',
        },
        {
          vi: 'Hãy liên hệ với những gì bạn đã học về WAF: WAF canh cửa HTTP chung của website; AI Gateway canh cửa riêng của cuộc gọi mô hình. Cả hai đều là lớp chính sách. Cheatsheet AI Protection trên hub chỉ ra thêm CASB, SWG, RBI và WAF/Bots khi doanh nghiệp dùng AI rộng hơn.',
          en: 'Connect this to what you learned about WAFs: a WAF guards general website HTTP; AI Gateway guards model calls. Both are policy layers. The AI Protection cheatsheet on this hub also points to CASB, SWG, RBI, and WAF/Bots as organizations adopt AI more broadly.',
        },
        {
          vi: 'Khi thiết kế on-page và AEO, hãy trả lời rõ câu hỏi người dùng thật: “Làm sao kiểm soát chi phí ChatGPT/LLM trong công ty?” — AI Gateway là một đáp án kiến trúc, không phải slogan. Link nội bộ tới Workers AI, Workers, và lộ trình AI Security giúp người đọc ở lại học tiếp thay vì thoát sau một định nghĩa.',
          en: 'For on-page and AEO, answer real user questions: “How do we control ChatGPT/LLM cost at work?” — AI Gateway is an architecture answer, not a slogan. Internal links to Workers AI, Workers, and the AI Security track keep readers learning instead of bouncing after one definition.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist trung cấp trước khi đưa AI vào production',
        en: 'An intermediate checklist before production AI',
      },
      paragraphs: [
        {
          vi: 'Một: mọi cuộc gọi mô hình đi qua gateway (hoặc lớp tương đương), không hard-code key trên frontend. Hai: có log đủ để debug nhưng có chính sách dữ liệu — tránh ghi nguyên văn bí mật. Ba: có giới hạn tốc độ và ngân sách. Bốn: có kịch bản khi provider lỗi (retry/fallback). Năm: có lớp bảo vệ ứng dụng (WAF/bot) nếu endpoint public.',
          en: 'One: all model calls go through a gateway (or equivalent), with no API keys in the frontend. Two: logs are good enough to debug but follow a data policy — do not store raw secrets. Three: rate and budget limits exist. Four: you have a provider-failure plan (retry/fallback). Five: application protection (WAF/bots) exists if the endpoint is public.',
        },
        {
          vi: 'Đọc bài gốc trên blog.cloudflare.com để cập nhật tính năng mới; dùng hub này để giữ lộ trình học ổn định. Nếu bạn đang xây agent, hãy xem Developer Platform như “nhà máy” và AI Gateway như “bảng điều khiển điện” — thiếu một trong hai đều khó vận hành bền.',
          en: 'Read original posts on blog.cloudflare.com for newest features; use this hub for a stable learning path. If you are building agents, treat the Developer Platform as the factory and AI Gateway as the electrical control panel — missing either makes reliable ops hard.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'AI Gateway có bắt buộc với Workers AI không?',
        en: 'Is AI Gateway required for Workers AI?',
      },
      answer: {
        vi: 'Không luôn bắt buộc để gọi mô hình, nhưng rất đáng có khi bạn cần quan sát, kiểm soát chi phí, retry, hoặc thống nhất nhiều provider. Production nên coi gateway là mặc định lành mạnh.',
        en: 'Not always required just to call a model, but highly worthwhile for observability, cost control, retries, or unifying providers. Production should treat a gateway as a healthy default.',
      },
    },
    {
      question: {
        vi: 'AI Gateway có thay WAF không?',
        en: 'Does AI Gateway replace a WAF?',
      },
      answer: {
        vi: 'Không. WAF bảo vệ traffic web/API chung. AI Gateway tập trung đường gọi mô hình. Ứng dụng AI public thường cần cả hai lớp.',
        en: 'No. A WAF protects general web/API traffic. AI Gateway focuses on model-call paths. Public AI apps often need both layers.',
      },
    },
    {
      question: {
        vi: 'Nên học AI Gateway trước hay Workers AI trước?',
        en: 'Should I learn AI Gateway or Workers AI first?',
      },
      answer: {
        vi: 'Hãy gọi được một mô hình (Workers AI hoặc provider) trước, rồi thêm Gateway khi bạn cần vận hành thật. Học song song cũng được nếu bạn đã có app.',
        en: 'Get one successful model call first (Workers AI or a provider), then add a Gateway when you need real operations. Learning them together is fine if you already have an app.',
      },
    },
  ],
  sources: [
    {
      title: 'Cloudflare’s AI Platform (Cloudflare Blog)',
      href: 'https://blog.cloudflare.com/ai-platform/',
    },
    {
      title: 'The Cloudflare Blog — AI Gateway topics',
      href: 'https://blog.cloudflare.com/tag/ai-gateway/',
    },
    {
      title: 'The Cloudflare Blog — AI topics',
      href: 'https://blog.cloudflare.com/tag/ai/',
    },
  ],
  relatedTrack: 'ai-security-adoption',
  relatedProductSlugs: ['ai-gateway', 'workers-ai', 'waf'],
  relatedPostSlugs: [
    'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
    'waf-bao-ve-website-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    {
      href: '/products/ai-gateway/',
      label: { vi: 'AI Gateway là gì? (trang sản phẩm)', en: 'What is AI Gateway? (product page)' },
    },
    {
      href: '/cheatsheets/ai-protection-portfolio/',
      label: { vi: 'Cheatsheet AI Protection Portfolio', en: 'AI Protection Portfolio cheatsheet' },
    },
    {
      href: '/tracks/ai-security-adoption/',
      label: { vi: 'Lộ trình AI Security & Adoption', en: 'AI Security & Adoption track' },
    },
    {
      href: '/use-cases/govern-enterprise-ai/',
      label: { vi: 'Use case: quản trị AI doanh nghiệp', en: 'Use case: govern enterprise AI' },
    },
    {
      href: '/products/waf/',
      label: { vi: 'WAF cho endpoint AI public', en: 'WAF for public AI endpoints' },
    },
  ],
  diagramSlugs: [
    'ai-multivendor-observability-control',
    'ai-composable',
  ],
};
