import type { BlogPost } from '../blog';

/** Intermediate · Developer Platform — Cloudflare Sandbox for untrusted code */
export const postSandboxChayCodeAnToan: BlogPost = {
  slug: 'sandbox-chay-code-an-toan-tren-edge',
  date: '2026-09-26',
  topic: 'developer-platform',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Sandbox trên Cloudflare: chạy code không tin cậy an toàn hơn',
    en: 'Cloudflare Sandbox: running untrusted code more safely',
    km: 'Cloudflare Sandbox៖ រត់ code មិនទុកចិត្តបានយ៉ាងសុវត្ថិភាពជាង',
  },
  description: {
    vi: 'Giải thích trung cấp về Sandbox SDK: khi nào cần cách ly code user/agent, khác Workers thường thế nào, và liên hệ agent code interpreter trên edge.',
    en: 'An intermediate explainer of the Sandbox SDK: when user/agent code needs isolation, how it differs from regular Workers, and agent code interpreters at the edge.',
  },
  excerpt: {
    vi: 'Workers chạy code bạn deploy — tin cậy. Khi user hoặc agent gửi script cần thực thi, bạn cần “hộp cát” tách biệt: Sandbox trên Cloudflare là lớp đó.',
    en: 'Workers run code you deploy — trusted. When users or agents send scripts to execute, you need a separate sandbox: Cloudflare Sandbox is that layer.',
    km: 'Workers រត់ code ដែលអ្នក deploy — ទុកចិត្តបាន។ នៅពេលអ្នកប្រើ ឬ agent ផ្ញើ script ត្រូវប្រតិបត្តិ អ្នកត្រូវការ sandbox ដាច់ដោយឡែក៖ Cloudflare Sandbox គឺជាស្រទាប់នោះ។',
  },
  keywords: {
    vi: 'Cloudflare Sandbox, chạy code an toàn edge, agent code interpreter, cách ly code user, Sandbox SDK',
    en: 'Cloudflare Sandbox, safe code execution edge, agent code interpreter, user code isolation, Sandbox SDK',
  },
  sections: [
    {
      heading: {
        vi: 'Workers thường vs code không tin cậy: ranh giới quan trọng',
        en: 'Regular Workers vs untrusted code: an important boundary',
      },
      paragraphs: [
        {
          vi: 'Cloudflare Workers chạy JavaScript/Wasm do bạn viết và deploy — bạn tin code đó. Mô hình isolate của Workers mạnh cho request/response ngắn, nhưng khi sản phẩm cho phép user chạy Python snippet, agent tự sinh shell command, hoặc “code interpreter” trong chat AI, bạn đang thực thi input không tin cậy.',
          en: 'Cloudflare Workers run JavaScript/Wasm you write and deploy — you trust that code. The Workers isolate model is strong for short request/response work, but when your product lets users run Python snippets, agents generate shell commands, or a chat AI includes a “code interpreter,” you are executing untrusted input.',
        },
        {
          vi: 'Chạy untrusted code trong cùng context với logic chính rủi ro: đọc secret binding, truy cập network không mong muốn, hoặc treo tài nguyên. Sandbox SDK trên Cloudflare cung cấp môi trường cách ly — container-like trên nền Workers — để chạy script trong “hộp” riêng, giới hạn hơn Worker production của bạn.',
          en: 'Running untrusted code in the same context as core logic risks reading secret bindings, unwanted network access, or hanging resources. The Cloudflare Sandbox SDK provides an isolated environment — container-like on the Workers platform — to run scripts in a separate “box,” more constrained than your production Worker.',
        },
        {
          vi: 'Trên blog.cloudflare.com/tag/sandbox/, Cloudflare mô tả use case agent và developer platform: khi AI agent cần thực thi tool do user hoặc model đề xuất, isolation không phải tùy chọn mà là yêu cầu kiến trúc. Bài này nối Sandbox với Workers intro và Developer Platform trên hub.',
          en: 'On blog.cloudflare.com/tag/sandbox/, Cloudflare describes agent and developer platform use cases: when an AI agent must run tools proposed by users or models, isolation is an architecture requirement, not an option. This post connects Sandbox to Workers intro and Developer Platform on the hub.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
    {
      heading: {
        vi: 'Khi nào nên dùng Sandbox — và khi nào Workers đủ',
        en: 'When to use Sandbox — and when Workers alone is enough',
      },
      paragraphs: [
        {
          vi: 'Dùng Workers thường khi: API của bạn, redirect, auth check, ghép header, gọi D1/R2, inference Workers AI với prompt bạn kiểm soát. Dùng Sandbox khi: user upload code để chạy; agent loop “generate → execute → observe”; tutorial platform “chạy thử JavaScript/Python”; CI preview chạy script build trong môi trường tách.',
          en: 'Use regular Workers when: your API, redirects, auth checks, header injection, D1/R2 calls, Workers AI inference with prompts you control. Use Sandbox when: users upload code to run; agent loops “generate → execute → observe”; tutorial platforms “try JavaScript/Python”; CI previews running build scripts in isolation.',
        },
        {
          vi: 'Sandbox không thay thế Containers cho workload dài hàng giờ hoặc desktop GUI — nó nhắm tác vụ thực thi script có giới hạn thời gian và tài nguyên, gắn với workflow agent hoặc dev tool. Hiểu ranh giới giúp chọn đúng sản phẩm: Workers, Sandbox, Containers — mỗi cái một bài toán.',
          en: 'Sandbox does not replace Containers for multi-hour jobs or desktop GUIs — it targets time- and resource-bounded script execution tied to agent or dev-tool workflows. Knowing the boundary helps pick the right product: Workers, Sandbox, Containers — each solves a different problem.',
        },
        {
          vi: 'Kết hợp AI Gateway + Workers AI + Sandbox: Gateway kiểm soát chi phí và log LLM; Workers AI suy luận; Sandbox chạy tool code agent sinh ra — stack phổ biến cho agent platform trung cấp.',
          en: 'Combine AI Gateway + Workers AI + Sandbox: Gateway controls LLM cost and logs; Workers AI infers; Sandbox runs tool code the agent generates — a common stack for intermediate agent platforms.',
        },
      ],
    },
    {
      heading: {
        vi: 'Thiết kế an toàn cơ bản cho Sandbox workload',
        en: 'Basic safe design for Sandbox workloads',
      },
      paragraphs: [
        {
          vi: 'Một: không đưa production secret vào Sandbox instance — dùng token scoped ngắn hạn nếu script cần gọi API ngoài. Hai: timeout cứng và giới hạn CPU/memory — script treo không kéo sập Worker chính. Ba: log output sandbox riêng, không trộn với log user session. Bốn: validate input trước khi exec — Sandbox không thay validation.',
          en: 'One: do not put production secrets in the Sandbox instance — use short-lived scoped tokens if scripts need external APIs. Two: hard timeouts and CPU/memory caps — a hung script should not take down the main Worker. Three: log sandbox output separately from user session logs. Four: validate input before exec — Sandbox does not replace validation.',
        },
        {
          vi: 'Năm: rate limit endpoint kích hoạt sandbox — abuse “free code runner” rất phổ biến. Sáu: network policy: chỉ allowlist domain cần thiết. Docs Sandbox trên developers.cloudflare.com/sandbox/ chi tiết API — hub có trang sản phẩm Sandbox trong Cloudflare 101.',
          en: 'Five: rate limit the endpoint that triggers sandbox — abuse of “free code runners” is common. Six: network policy: allowlist only required domains. Sandbox docs at developers.cloudflare.com/sandbox/ detail the API — the hub lists Sandbox in Cloudflare 101.',
        },
        {
          vi: 'Sơ đồ fullstack-application trên reference architecture gắn Workers, Pages, D1, R2 — Sandbox thường ngồi trong lớp compute khi app fullstack có tính năng “chạy code”.',
          en: 'The fullstack-application reference diagram ties Workers, Pages, D1, R2 — Sandbox usually sits in the compute layer when a fullstack app has a “run code” feature.',
        },
      ],
    },
    {
      heading: {
        vi: 'Lộ trình học: từ Worker đến Sandbox',
        en: 'Learning path: from Worker to Sandbox',
      },
      paragraphs: [
        {
          vi: 'Bước 1: deploy Worker hello và một API đơn giản (hub: Workers intro). Bước 2: thêm Workers AI hoặc agent đơn giản. Bước 3: khi agent cần “run tool”, đọc Sandbox docs và thử SDK với script an toàn (ví dụ tính toán số, không network). Bước 4: thêm rate limit, observability, và AI Gateway nếu agent gọi LLM.',
          en: 'Step 1: deploy a hello Worker and simple API (hub: Workers intro). Step 2: add Workers AI or a simple agent. Step 3: when the agent needs to “run tools,” read Sandbox docs and try the SDK with safe scripts (e.g. math, no network). Step 4: add rate limits, observability, and AI Gateway if the agent calls LLMs.',
        },
        {
          vi: 'Đọc blog.cloudflare.com/tag/developer-platform/ cho câu chuyện sản phẩm; lộ trình Developer Platform trên hub giữ thứ tự học ổn định. Sandbox là chủ đề trung cấp — đừng nhảy vào trước khi hiểu Workers và binding cơ bản.',
          en: 'Read blog.cloudflare.com/tag/developer-platform/ for product stories; the Developer Platform track on the hub keeps learning order stable. Sandbox is intermediate — do not jump in before understanding Workers and basic bindings.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Sandbox có thay Workers không?',
        en: 'Does Sandbox replace Workers?',
      },
      answer: {
        vi: 'Không. Workers là nền compute chính; Sandbox là môi trường cách ly cho code không tin cậy. App thường dùng Worker làm orchestrator gọi Sandbox.',
        en: 'No. Workers are the main compute base; Sandbox is an isolated environment for untrusted code. Apps usually use a Worker as orchestrator calling Sandbox.',
      },
    },
    {
      question: {
        vi: 'Sandbox có liên quan Containers không?',
        en: 'Is Sandbox related to Containers?',
      },
      answer: {
        vi: 'Cùng họ “cách ly mạnh hơn isolate Worker”, nhưng Sandbox nhắm script ngắn cho agent/dev tool; Containers nhắm image và runtime dài hơn. Chọn theo workload.',
        en: 'Both are “stronger isolation than a Worker isolate,” but Sandbox targets short scripts for agents/dev tools; Containers target images and longer runtimes. Choose by workload.',
      },
    },
    {
      question: {
        vi: 'Agent AI có bắt buộc Sandbox không?',
        en: 'Is Sandbox mandatory for AI agents?',
      },
      answer: {
        vi: 'Không bắt buộc cho mọi agent — agent chỉ đọc LLM không cần exec code. Khi agent thực thi tool/code do user/model sinh ra, isolation (Sandbox hoặc tương đương) nên là mặc định.',
        en: 'Not mandatory for every agent — read-only LLM agents need no code exec. When agents run tools/code from users/models, isolation (Sandbox or equivalent) should be the default.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Sandbox topics',
      href: 'https://blog.cloudflare.com/tag/sandbox/',
    },
    {
      title: 'The Cloudflare Blog — Developer Platform topics',
      href: 'https://blog.cloudflare.com/tag/developer-platform/',
    },
    {
      title: 'Cloudflare Sandbox SDK (Cloudflare Docs)',
      href: 'https://developers.cloudflare.com/sandbox/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['sandbox', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'ai-gateway-chi-phi-token-kiem-soat',
  ],
  hubLinks: [
    {
      href: '/products/sandbox/',
      label: { vi: 'Sandbox SDK (trang sản phẩm)', en: 'Sandbox SDK (product page)' },
    },
    {
      href: '/products/workers/',
      label: { vi: 'Workers — compute nền', en: 'Workers — base compute' },
    },
    {
      href: '/tracks/developer-platform/',
      label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' },
    },
    {
      href: '/use-cases/developer-platform/',
      label: { vi: 'Use cases Developer Platform', en: 'Developer Platform use cases' },
    },
    {
      href: '/products/agents/',
      label: { vi: 'Agents trên Cloudflare', en: 'Agents on Cloudflare' },
    },
  ],
  diagramSlugs: [
    'fullstack-application',
    'programmable-platforms',
  ],
};
