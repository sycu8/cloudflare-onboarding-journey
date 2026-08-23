import type { BlogPost } from '../blog';

/** Intermediate · AI — LLM cost and token control with AI Gateway */
export const postAiGatewayChiPhiToken: BlogPost = {
  slug: 'ai-gateway-chi-phi-token-kiem-soat',
  date: '2026-09-18',
  topic: 'ai',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Kiểm soát chi phí LLM với AI Gateway (thực tế cho team nhỏ)',
    en: 'Controlling LLM cost with AI Gateway (practical for small teams)',
  },
  description: {
    vi: 'Hướng dẫn trung cấp về kiểm soát token và chi phí LLM: log, rate limit, ngân sách, tránh hard-code key — bổ sung cho Workers AI khi app AI lớn dần.',
    en: 'An intermediate guide to token and LLM cost control: logs, rate limits, budgets, no hard-coded keys — complements Workers AI as your AI app grows.',
  },
  excerpt: {
    vi: 'Chi phí LLM không “bùng” vì một đêm — nó tích lũy từ mỗi request không được đếm. AI Gateway giúp bạn nhìn token, giới hạn và cắt sớm trước khi hóa đơn gây choáng.',
    en: 'LLM bills rarely explode overnight — they accumulate from every uncounted request. AI Gateway helps you see tokens, set limits, and cut early before the invoice stuns you.',
  },
  keywords: {
    vi: 'kiểm soát chi phí LLM, AI Gateway token, giới hạn token Cloudflare, ngân sách AI, Workers AI chi phí',
    en: 'LLM cost control, AI Gateway tokens, Cloudflare token limits, AI budget, Workers AI cost',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao “gọi được LLM” chưa đủ để kiểm soát chi phí?',
        en: 'Why “we can call an LLM” is not enough for cost control',
      },
      paragraphs: [
        {
          vi: 'Prototype AI thường gọi API nhà cung cấp trực tiếp: một key trong backend, một endpoint, demo mượt. Khi lên production, bạn mới thấy vấn đề: mỗi user hỏi một câu có thể tốn hàng nghìn token; một bot spam form chat có thể đốt hạn mức trong vài phút; team không biết feature nào “ăn” nhiều token nhất vì không có log tập trung.',
          en: 'AI prototypes often call a provider API directly: one key in the backend, one endpoint, smooth demo. In production you discover the pain: each user question can burn thousands of tokens; a spam bot on a chat form can exhaust quota in minutes; the team cannot tell which feature eats tokens because there is no central log.',
        },
        {
          vi: 'Token là đơn vị tính phí phổ biến của LLM: input (prompt) và output (phản hồi) đều được đếm. Mô hình lớn, prompt dài, hoặc yêu cầu “viết lại cả tài liệu” mỗi lần — chi phí nhân lên nhanh. Trên blog.cloudflare.com, các bài AI Platform nhấn mạnh observability và unified routing: bạn cần một lớp trung gian trước khi mọi service tự gọi mô hình theo cách riêng.',
          en: 'Tokens are the common LLM billing unit: both input (prompt) and output (response) are counted. Larger models, long prompts, or “rewrite the whole document” on every click multiply cost fast. On blog.cloudflare.com, AI Platform posts stress observability and unified routing: you need a middle layer before every service calls models its own way.',
        },
        {
          vi: 'Bài viết này bổ sung cho bài AI Gateway về bảo mật traffic AI trên hub — cùng sản phẩm, nhưng góc nhìn “kế toán và vận hành”: ai được gọi, bao nhiêu, với ngân sách bao nhiêu. Đó là bước trưởng thành từ hackathon sang sản phẩm có thể trả hóa đơn.',
          en: 'This post complements the hub’s AI Gateway security article — same product, but an accounting and operations angle: who calls, how much, with what budget. It is the maturity step from hackathon to a product that can pay its bills.',
        },
      ],
      diagramSlug: 'ai-multivendor-observability-control',
    },
    {
      heading: {
        vi: 'Ba cơ chế AI Gateway giúp bạn kiểm soát token ngay',
        en: 'Three AI Gateway mechanisms that help control tokens right away',
      },
      paragraphs: [
        {
          vi: 'Log và phân tích: gateway ghi nhận request qua một điểm — bạn thấy latency, lỗi, và mức dùng token theo thời gian. Thay vì grep log rải rác trên năm microservice, bạn có bức tranh “đường ống AI” của cả app. Khi CFO hỏi “tháng này chatbot tốn bao nhiêu”, bạn có dữ liệu để trả lời thay vì ước lượng.',
          en: 'Logs and analytics: the gateway records requests at one point — you see latency, errors, and token usage over time. Instead of grepping scattered logs across five microservices, you get a picture of the whole AI pipeline. When finance asks “how much did the chatbot cost this month,” you have data instead of guesses.',
        },
        {
          vi: 'Rate limit và giới hạn: bạn có thể giới hạn số request theo IP, user, hoặc API key — giảm rủi ro một client hoặc bot làm cạn hạn mức. Kết hợp với Workers AI hoặc provider bên thứ ba qua cùng gateway, bạn thử nghiệm mô hình rẻ hơn mà không phải viết lại toàn bộ app: đổi route ở lớp điều phối.',
          en: 'Rate limits and caps: you can limit requests per IP, user, or API key — reducing the risk that one client or bot drains quota. Combined with Workers AI or third-party providers through the same gateway, you experiment with cheaper models without rewriting the whole app: change routing at the control layer.',
        },
        {
          vi: 'Ngân sách và cảnh báo: đặt ngưỡng chi phí hoặc token theo ngày/tuần; khi gần chạm ngưỡng, cắt hoặc chuyển sang mô hình nhẹ hơn. Đây không thay thế quy trình tài chính nội bộ, nhưng ngăn “phát hiện sau khi đã mất tiền” — giống cảnh báo dung lượng điện thoại trước khi hết gói.',
          en: 'Budgets and alerts: set cost or token thresholds per day or week; when you approach the limit, cut traffic or switch to a lighter model. This does not replace internal finance process, but it prevents “discovering the loss after the money is gone” — like a phone data warning before you hit the cap.',
        },
      ],
    },
    {
      heading: {
        vi: 'Thực hành cho team nhỏ: không hard-code key, không cache prompt vô tội vạ',
        en: 'Small-team practice: no hard-coded keys, no reckless prompt caching',
      },
      paragraphs: [
        {
          vi: 'Một: API key nhà cung cấp chỉ ở backend hoặc binding Workers — không đưa ra frontend. AI Gateway là điểm vào chuẩn; mọi cuộc gọi mô hình đi qua đó. Hai: định nghĩa “ai được gọi mô hình nào”: chat công khai dùng mô hình nhỏ; tóm tắt nội bộ mới dùng mô hình lớn. Ba: cache response khi câu hỏi lặp lại — gateway có thể cache — nhưng không cache prompt chứa dữ liệu nhạy cảm.',
          en: 'One: provider API keys live only on the backend or in Worker bindings — never in the frontend. AI Gateway is the standard entry; all model calls go through it. Two: define who gets which model: public chat uses a small model; internal summarization uses a large one. Three: cache responses when questions repeat — the gateway can cache — but do not cache prompts with sensitive data.',
        },
        {
          vi: 'Workers AI bổ sung tốt cho gateway: mô hình chạy trên mạng Cloudflare, giảm phụ thuộc một vendor, và có thể đi qua cùng lớp log/limit. Team nhỏ thường bắt đầu Workers AI cho một use case, thêm gateway khi cần thống kê và giới hạn — không cần SIEM hay data lake ngày đầu.',
          en: 'Workers AI complements the gateway well: models run on Cloudflare’s network, reducing single-vendor lock-in, and can share the same log/limit layer. Small teams often start Workers AI for one use case, then add the gateway when they need stats and limits — no SIEM or data lake required on day one.',
        },
        {
          vi: 'Đọc bài gốc trên blog.cloudflare.com/tag/ai-gateway/ để cập nhật tính năng mới; dùng lộ trình AI Security & Adoption trên hub để không lạc giữa “bảo mật” và “chi phí” — hai mặt của cùng một cửa kiểm soát.',
          en: 'Read originals on blog.cloudflare.com/tag/ai-gateway/ for newest features; use the AI Security & Adoption track on this hub so you do not get lost between “security” and “cost” — two sides of the same control door.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist trước khi mở rộng traffic AI',
        en: 'Checklist before you scale AI traffic',
      },
      paragraphs: [
        {
          vi: 'Có dashboard hoặc export log token theo app/feature. Có rate limit trên endpoint public. Có ngưỡng ngân sách và kịch bản khi chạm ngưỡng (từ chối, queue, hoặc fallback mô hình nhẹ). Có chính sách dữ liệu: log đủ debug nhưng không lưu nguyên văn PII. Có WAF/bot nếu form chat hoặc API AI public — chi phí và abuse thường đi cùng.',
          en: 'You have a dashboard or token log export per app/feature. Public endpoints have rate limits. Budget thresholds exist with a plan when you hit them (reject, queue, or fallback to a lighter model). A data policy exists: logs enough to debug but do not store raw PII. WAF/bots protect public chat forms or AI APIs — cost and abuse often travel together.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu traffic gấp đôi tuần sau, tôi có biết trước hóa đơn tăng bao nhiêu không?” Nếu không, hãy bật observability qua gateway trước khi marketing chạy chiến dịch lớn.',
          en: 'Self-check: “If traffic doubles next week, do I know how much the bill will rise?” If not, turn on gateway observability before marketing runs a big campaign.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'AI Gateway có tính phí riêng ngoài token LLM không?',
        en: 'Does AI Gateway charge separately from LLM tokens?',
      },
      answer: {
        vi: 'Chi phí chính thường vẫn là token từ mô hình (Workers AI hoặc provider). Gateway giúp bạn kiểm soát và giảm lãng phí — xem pricing Cloudflare và nhà cung cấp mô hình để biết chi tiết hiện tại.',
        en: 'The main cost is usually still model tokens (Workers AI or a provider). The gateway helps you control and reduce waste — check Cloudflare and model provider pricing for current details.',
      },
    },
    {
      question: {
        vi: 'Khác gì bài AI Gateway về bảo mật traffic trên hub?',
        en: 'How is this different from the hub’s AI Gateway security post?',
      },
      answer: {
        vi: 'Bài bảo mật nhấn log, retry, và lớp chính sách chung. Bài này nhấn token, ngân sách, rate limit và thực hành chi phí cho team nhỏ. Nên đọc cả hai.',
        en: 'The security post focuses on logs, retries, and general policy layers. This one focuses on tokens, budgets, rate limits, and cost practice for small teams. Read both.',
      },
    },
    {
      question: {
        vi: 'Có thể dùng AI Gateway chỉ với Workers AI không?',
        en: 'Can I use AI Gateway only with Workers AI?',
      },
      answer: {
        vi: 'Có. Gateway hỗ trợ Workers AI và nhiều provider; team nhỏ thường bắt đầu một mô hình, thêm gateway khi cần số liệu và giới hạn.',
        en: 'Yes. The gateway supports Workers AI and multiple providers; small teams often start with one model and add the gateway when they need metrics and limits.',
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
  relatedProductSlugs: ['ai-gateway', 'workers-ai'],
  relatedPostSlugs: [
    'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
    'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    {
      href: '/products/ai-gateway/',
      label: { vi: 'AI Gateway (trang sản phẩm)', en: 'AI Gateway (product page)' },
    },
    {
      href: '/products/workers-ai/',
      label: { vi: 'Workers AI — mô hình trên edge', en: 'Workers AI — models at the edge' },
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
      href: '/cheatsheets/ai-protection-portfolio/',
      label: { vi: 'Cheatsheet AI Protection', en: 'AI Protection cheatsheet' },
    },
  ],
  diagramSlugs: [
    'ai-multivendor-observability-control',
    'ai-composable',
  ],
};
