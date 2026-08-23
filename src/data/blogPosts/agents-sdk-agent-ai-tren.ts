import type { BlogPost } from '../blog';

/** Intermediate · AI — rewritten from Cloudflare Agents SDK / Workers AI blog themes */
export const postAgentsSdkAgentAiTrenCloudflare: BlogPost = {
  slug: 'agents-sdk-agent-ai-tren-cloudflare',
  date: '2026-09-02',
  topic: 'ai',
  level: 'intermediate',
  readingMinutes: 9,
  title: {
    vi: 'AI Agents trên Cloudflare: hơn một lần gọi chatbot',
    en: 'AI Agents on Cloudflare: more than one chatbot call',
  },
  description: {
    vi: 'Giải thích agent AI cần trí nhớ và công cụ, Agents SDK, Durable Objects và Workflows ở mức khái niệm — viết lại từ blog.cloudflare.com cho người học trung cấp.',
    en: 'Explain why AI agents need memory and tools, the Agents SDK, and Durable Objects / Workflows at a concept level — rewritten from blog.cloudflare.com for intermediate learners.',
  },
  excerpt: {
    vi: 'Chatbot một lần hỏi–đáp khác agent: agent nhớ ngữ cảnh, gọi API, chạy nhiều bước. Cloudflare gom Workers AI, Durable Objects và SDK để bạn build trên edge.',
    en: 'A one-shot Q&A chatbot differs from an agent: agents remember context, call APIs, and run multi-step flows. Cloudflare combines Workers AI, Durable Objects, and an SDK to build at the edge.',
  },
  keywords: {
    vi: 'Cloudflare Agents SDK, AI agent edge, Durable Objects agent, Workers AI agent, học AI trung cấp',
    en: 'Cloudflare Agents SDK, edge AI agent, Durable Objects agent, Workers AI agent, intermediate AI learning',
  },
  sections: [
    {
      heading: {
        vi: 'Agent khác chatbot “một câu một đáp” thế nào?',
        en: 'How is an agent different from a one-shot chatbot?',
      },
      paragraphs: [
        {
          vi: 'Chatbot đơn giản: người dùng gửi prompt → mô hình trả lời → hết phiên. Agent: cùng một “nhân vật” có thể nhớ vài lượt trước, quyết định gọi công cụ (tìm kiếm nội bộ, tạo ticket, đọc D1), và lặp “suy nghĩ → hành động → quan sát” cho đến khi hoàn thành nhiệm vụ.',
          en: 'A simple chatbot: user sends a prompt → model replies → session ends. An agent: the same “persona” may remember prior turns, decide to call tools (internal search, create a ticket, read D1), and loop “think → act → observe” until the task is done.',
        },
        {
          vi: 'Các bài trên blog.cloudflare.com về agents nhấn mạnh inference (Workers AI) chỉ là một phần. Bạn cần state (trạng thái hội thoại), orchestration (điều phối bước), và guardrails (giới hạn tool) — giống nhân viên hỗ trợ thật cần sổ tay và quy trình, không chỉ miệng nói hay.',
          en: 'Cloudflare Blog posts on agents stress that inference (Workers AI) is only one piece. You need state (conversation status), orchestration (step coordination), and guardrails (tool limits) — like a real support agent needs a playbook and process, not only eloquence.',
        },
        {
          vi: 'Trên hub, lộ trình AI Security & Adoption đặt agents sau Workers AI và AI Gateway: trước hết gọi được mô hình an toàn, sau đó mới mở rộng thành agent có tool — tránh “agent tự do” gọi API nhạy cảm không kiểm soát.',
          en: 'On this hub, the AI Security & Adoption track places agents after Workers AI and AI Gateway: first call models safely, then expand into tool-using agents — avoiding an “autonomous” agent hitting sensitive APIs without control.',
        },
      ],
      diagramSlug: 'ai-composable',
    },
    {
      heading: {
        vi: 'Agents SDK và Durable Objects: trí nhớ gắn với một “phiên”',
        en: 'Agents SDK and Durable Objects: memory tied to a session',
      },
      paragraphs: [
        {
          vi: 'Workers stateless — mỗi request có thể là máy khác. Agent cần chỗ lưu hội thoại và biến nội bộ ổn định. Durable Objects (DO) cung cấp một instance có tên (ví dụ theo `userId` hoặc `roomId`) chạy liên tục logic và lưu state trong cùng object đó.',
          en: 'Workers are stateless — each request may land on a different machine. Agents need a stable place for conversation and internal variables. Durable Objects (DO) provide a named instance (e.g. by `userId` or `roomId`) that runs logic and holds state in one place.',
        },
        {
          vi: 'Agents SDK của Cloudflare bọc pattern phổ biến: class Agent kế thừa, hook `onRequest`, tích hợp Workers AI binding, định nghĩa tool mà mô hình được phép gọi. Bạn ít phải tự viết vòng lặp ReAct từ đầu — tập trung vào business rule và dữ liệu được phép đọc.',
          en: 'Cloudflare’s Agents SDK wraps common patterns: extend an Agent class, hook `onRequest`, wire Workers AI bindings, define tools the model may call. You write less of a raw ReAct loop — and focus on business rules and allowed data.',
        },
        {
          vi: 'Hình dung: DO là “căn phòng” cho một cuộc chat; Workers AI là “bộ não” trong phòng; tool là “điện thoại nội bộ” chỉ gọi số đã whitelist. Không whitelist thì agent không được bấm số đó — dù mô hình muốn.',
          en: 'Picture it: the DO is a “room” for one chat; Workers AI is the “brain” in the room; tools are an “internal phone” that only dials whitelisted numbers. No whitelist — the agent cannot dial, even if the model wants to.',
        },
      ],
    },
    {
      heading: {
        vi: 'Workflows và chuỗi bước dài: khi agent cần “quy trình”',
        en: 'Workflows and long chains: when agents need a “process”',
      },
      paragraphs: [
        {
          vi: 'Một số tác vụ agent kéo dài phút hoặc giờ: duyệt tài liệu lớn, chờ phê duyệt người, retry API bên thứ ba. Workflows (khái niệm trên Developer Platform) giúp mô tả chuỗi bước durable — tách khỏi một HTTP request duy nhất — thay vì giữ connection mở hoặc mất state khi Worker timeout.',
          en: 'Some agent tasks last minutes or hours: reviewing large docs, waiting for human approval, retrying third-party APIs. Workflows (a Developer Platform concept) describe durable step chains — separate from a single HTTP request — instead of holding a connection open or losing state on Worker timeout.',
        },
        {
          vi: 'Bạn không cần học Workflows ngày đầu. Thứ tự hợp lý: (1) gọi Workers AI từ Worker, (2) thêm AI Gateway để log và rate limit, (3) chuyển hội thoại vào Agent + DO, (4) khi flow phức tạp, xem Workflows. Blog.cloudflare.com thường publish tính năng theo lớp — hub giúp bạn không nhảy cóc.',
          en: 'You do not need Workflows on day one. A sensible order: (1) call Workers AI from a Worker, (2) add AI Gateway for logging and rate limits, (3) move conversation into Agent + DO, (4) when flows get complex, explore Workflows. blog.cloudflare.com often ships features in layers — the hub helps you avoid skipping steps.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bảo mật agent: tool scope, log và WAF cho endpoint public',
        en: 'Securing agents: tool scope, logs, and WAF for public endpoints',
      },
      paragraphs: [
        {
          vi: 'Mỗi tool nên có mô tả rõ, tham số tối thiểu, và authorization kiểm tra identity trước khi đọc D1/KV. Log prompt và tool call qua AI Gateway (ẩn PII khi cần). Endpoint agent public (`/api/chat`) nên có WAF, rate limiting và — nếu có form — Turnstile cho hành vi bot.',
          en: 'Each tool needs a clear description, minimal parameters, and authorization that checks identity before reading D1/KV. Log prompts and tool calls through AI Gateway (redact PII when needed). Public agent endpoints (`/api/chat`) deserve WAF, rate limiting, and — for forms — Turnstile against bots.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra trước khi ship: “Agent có thể gọi tool nào mà user hiện tại không được phép?” Nếu không chắc, thu hẹp tool list và thêm test. Đọc bài Workers AI và AI Gateway trên hub, rồi mở tag agents trên blog.cloudflare.com cho ví dụ SDK mới nhất.',
          en: 'Pre-ship self-check: “Which tools can this agent call that the current user should not access?” If unsure, narrow the tool list and add tests. Read Workers AI and AI Gateway posts on this hub, then open the agents tag on blog.cloudflare.com for the latest SDK examples.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Agents SDK có bắt buộc Durable Objects không?',
        en: 'Does the Agents SDK require Durable Objects?',
      },
      answer: {
        vi: 'Pattern agent có state trên Cloudflare thường dùng Durable Objects để nhất quán phiên. Bạn có thể thử logic đơn giản stateless trước, nhưng hội thoại nhiều lượt thường cần DO.',
        en: 'Stateful agent patterns on Cloudflare typically use Durable Objects for session consistency. You can prototype simple stateless logic first, but multi-turn chat usually needs DO.',
      },
    },
    {
      question: {
        vi: 'Agent có thay thế Workers AI không?',
        en: 'Do agents replace Workers AI?',
      },
      answer: {
        vi: 'Không. Workers AI cung cấp inference. Agents SDK điều phối nhiều lần gọi mô hình, nhớ context và gọi tool. Chúng bổ sung nhau.',
        en: 'No. Workers AI provides inference. The Agents SDK orchestrates multiple model calls, memory, and tools. They complement each other.',
      },
    },
    {
      question: {
        vi: 'AI Gateway có cần cho agent không?',
        en: 'Do you need AI Gateway for agents?',
      },
      answer: {
        vi: 'Không bắt buộc cho prototype, nhưng production nên có: log, cache, rate limit và chính sách nhà cung cấp mô hình. Hub khuyên Gateway trước khi mở agent ra internet.',
        en: 'Not mandatory for a prototype, but production should use it: logs, cache, rate limits, and provider policies. The hub recommends Gateway before exposing agents to the internet.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Agents topics',
      href: 'https://blog.cloudflare.com/tag/agents/',
    },
    {
      title: 'Powering the agents: Workers AI large models (Cloudflare Blog)',
      href: 'https://blog.cloudflare.com/workers-ai-large-models/',
    },
  ],
  relatedTrack: 'ai-security-adoption',
  relatedProductSlugs: ['agents', 'workers-ai', 'durable-objects'],
  relatedPostSlugs: [
    'workers-ai-chay-mo-hinh-ai-khong-can-tu-quan-ly-gpu',
    'ai-gateway-kiem-soat-va-bao-ve-traffic-ai',
    'waf-bao-ve-website-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/agents/', label: { vi: 'Agents (trang sản phẩm)', en: 'Agents (product page)' } },
    { href: '/products/workers-ai/', label: { vi: 'Workers AI — inference cho agent', en: 'Workers AI — inference for agents' } },
    { href: '/products/ai-gateway/', label: { vi: 'AI Gateway — log và kiểm soát', en: 'AI Gateway — logging and control' } },
    { href: '/tracks/ai-security-adoption/', label: { vi: 'Lộ trình AI Security & Adoption', en: 'AI Security & Adoption track' } },
    { href: '/use-cases/govern-enterprise-ai/', label: { vi: 'Use case: quản trị AI', en: 'Use case: govern AI' } },
  ],
  diagramSlugs: ['ai-composable', 'ai-multivendor-observability-control'],
};
