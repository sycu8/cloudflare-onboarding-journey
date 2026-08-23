import type { BlogPost } from '../blog';

/** Intermediate · Workers — rewritten from Cloudflare Workflows blog themes */
export const postWorkflowsTacVuDaiTren: BlogPost = {
  slug: 'workflows-tac-vu-dai-tren-workers',
  date: '2026-09-16',
  topic: 'workers',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Workflows trên Cloudflare: chạy tác vụ dài hơi trên nền tảng Workers',
    en: 'Workflows on Cloudflare: long-running jobs on the Workers platform',
  },
  description: {
    vi: 'Giải thích Workflows trung cấp: khác gì Worker request ngắn; bước chờ, retry, và pipeline; use case email, xử lý đơn hàng, và tích hợp Developer Platform.',
    en: 'An intermediate Workflows guide: how it differs from short Worker requests; wait/retry steps and pipelines; email, order processing, and Developer Platform integration.',
  },
  excerpt: {
    vi: 'Workflows giống checklist tự động có trí nhớ: bước 1 xong mới bước 2, lỗi thì thử lại, có thể chờ vài giờ — không ép mọi thứ vào một request 30 giây.',
    en: 'Workflows are like a stateful checklist: step two runs after step one, retries on failure, can wait hours — without cramming everything into one 30-second request.',
  },
  keywords: {
    vi: 'Cloudflare Workflows, tác vụ dài Workers, durable execution, pipeline serverless, học Workflows trung cấp',
    en: 'Cloudflare Workflows, long-running Workers tasks, durable execution, serverless pipeline, intermediate Workflows',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao Worker request ngắn không đủ cho mọi việc?',
        en: 'Why a short Worker request is not enough for every job',
      },
      paragraphs: [
        {
          vi: 'Cloudflare Workers xuất sắc với logic gắn request/response: nhận HTTP, xử lý vài trăm millisecond đến vài chục giây, trả kết quả. Nhưng nhiều quy trình thực tế dài hơn và nhiều bước: gửi email chào mừng, đợi người dùng xác nhận, gọi API thanh toán, cập nhật database, gửi thông báo Slack — nếu bước 3 fail, bạn muốn retry bước 3, không chạy lại từ đầu.',
          en: 'Cloudflare Workers excel at request/response logic: receive HTTP, process for milliseconds to tens of seconds, return a result. But many real processes are longer and multi-step: send a welcome email, wait for user confirmation, call a payment API, update the database, notify Slack — if step 3 fails, you want to retry step 3, not restart from scratch.',
        },
        {
          vi: 'Workflows là nền tảng durable execution trên Cloudflare: bạn định nghĩa các bước (steps), hệ thống lưu trạng thái, tự retry theo chính sách, và cho phép sleep/chờ giữa các bước. Trên blog.cloudflare.com, các bài về Workflows và Developer Platform mô tả đây là cách mở rộng Workers từ “hàm một lần” sang “quy trình sống lâu” mà không tự dựng queue + worker + dead-letter bằng tay.',
          en: 'Workflows is durable execution on Cloudflare: you define steps, the platform persists state, retries per policy, and allows sleep/wait between steps. Cloudflare Blog posts on Workflows and the Developer Platform describe this as extending Workers from “one-shot functions” to “long-lived processes” without hand-rolling queues, workers, and dead-letter queues.',
        },
        {
          vi: 'Hãy so sánh: Worker thường giống nhân viên trả lời một câu hỏi tại quầy; Workflows giống hồ sơ xử lý hồ sơ vay — có thể để trên bàn vài ngày, đánh dấu đã xong bước nào, ai phụ trách bước tiếp theo.',
          en: 'Compare: a regular Worker is like staff answering one question at the counter; Workflows is like a loan file — it can sit on the desk for days, marking which steps finished and what comes next.',
        },
      ],
      diagramSlug: 'fullstack-application',
    },
    {
      heading: {
        vi: 'Ba khái niệm cốt lõi: step, state, retry',
        en: 'Three core ideas: step, state, retry',
      },
      paragraphs: [
        {
          vi: 'Step (bước) là đơn vị công việc có tên — ví dụ `chargePayment`, `sendEmail`, `updateInventory`. Mỗi step nên idempotent khi có thể: chạy lại không tạo hai lần charge. State (trạng thái) được Workflows lưu giữa các lần chạy — bạn không phải tự ghi “đang ở bước 2” vào KV nếu platform đã lo.',
          en: 'A step is a named unit of work — for example `chargePayment`, `sendEmail`, `updateInventory`. Each step should be idempotent when possible: reruns should not double-charge. State is persisted between runs — you do not have to write “currently on step 2” to KV if the platform handles it.',
        },
        {
          vi: 'Retry: khi API bên thứ ba timeout, Workflows có thể thử lại với backoff thay vì fail cả pipeline. Sleep: chờ 24 giờ trước email nhắc — không giữ Worker instance “treo” suốt 24 giờ. Đây là điểm khác biệt lớn so với cố nhét `setTimeout` dài trong một invocation.',
          en: 'Retry: when a third-party API times out, Workflows can retry with backoff instead of failing the whole pipeline. Sleep: wait 24 hours before a reminder email — without holding a Worker instance open for 24 hours. That is a major difference from cramming a long `setTimeout` into one invocation.',
        },
        {
          vi: 'Workflows thường kết hợp bindings khác: gọi D1 để ghi đơn hàng, R2 để lưu file export, Workers AI cho bước tóm tắt, Queues cho fan-out nếu cần. Sơ đồ fullstack-application trên hub minh họa Workers, D1, R2, KV, Durable Objects cùng nhau — Workflows là lớp điều phối thời gian dài.',
          en: 'Workflows often combine other bindings: D1 for orders, R2 for export files, Workers AI for a summarization step, Queues for fan-out when needed. The fullstack-application diagram on this hub shows Workers, D1, R2, KV, and Durable Objects together — Workflows is the long-horizon orchestration layer.',
        },
      ],
    },
    {
      heading: {
        vi: 'Use case thực tế: onboarding, đơn hàng, pipeline nội dung',
        en: 'Real use cases: onboarding, orders, content pipelines',
      },
      paragraphs: [
        {
          vi: 'Onboarding user: đăng ký → gửi email xác minh → chờ click → tạo workspace mặc định → ghi audit log. Mỗi bước có thể fail độc lập; user không thấy “lỗi 500” chỉ vì SMTP chậm ở bước email. E-commerce: đặt hàng → reserve inventory → charge → ship notification — nếu charge fail, release inventory ở bước bù trừ.',
          en: 'User onboarding: signup → send verification email → wait for click → create default workspace → write audit log. Each step can fail independently; users do not see “500 error” just because SMTP was slow on the email step. E-commerce: order → reserve inventory → charge → ship notification — if charge fails, release inventory in a compensating step.',
        },
        {
          vi: 'Pipeline nội dung: upload video → transcode (có thể gọi service ngoài) → tạo thumbnail → cập nhật CMS. Workflows phù hợp khi thời gian xử lý vượt giới hạn HTTP một lần. Blog Cloudflare về automation và Workers thường nhấn mạnh: chọn đúng công cụ — không mọi thứ cần Workflows; request ngắn vẫn là Worker thường hoặc Queue đơn giản.',
          en: 'Content pipeline: upload video → transcode (maybe external service) → generate thumbnail → update CMS. Workflows fits when processing exceeds a single HTTP window. Cloudflare Blog automation and Workers posts stress picking the right tool — not everything needs Workflows; short work may stay a plain Worker or simple Queue.',
        },
        {
          vi: 'So với Durable Objects: DO mạnh khi cần stateful object một instance (chat room, game session, coordination). Workflows mạnh khi quy trình là chuỗi bước có thứ tự và thời gian chờ dài. Nhiều kiến trúc dùng cả hai — Workflows gọi DO ở bước cần lock hoặc realtime state.',
          en: 'Versus Durable Objects: DOs shine for single-instance stateful objects (chat room, game session, coordination). Workflows shine for ordered multi-step processes with long waits. Many architectures use both — Workflows calls a DO when a step needs a lock or realtime state.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist trung cấp trước khi chuyển cron hack sang Workflows',
        en: 'Intermediate checklist before moving cron hacks to Workflows',
      },
      paragraphs: [
        {
          vi: 'Một: vẽ sơ đồ bước trên giấy — bao gồm bước bù trừ khi fail (compensation). Hai: đặt tên step rõ ràng và log correlation id xuyên suốt. Ba: test retry bằng cách inject lỗi API giả trong staging. Bốn: định nghĩa timeout và số lần retry tối đa — tránh loop vô hạn. Năm: xem xét idempotency key cho thanh toán và ghi DB.',
          en: 'One: draw steps on paper — including compensation on failure. Two: name steps clearly and log a correlation ID throughout. Three: test retries by injecting fake API errors in staging. Four: define timeouts and max retries — avoid infinite loops. Five: consider idempotency keys for payments and DB writes.',
        },
        {
          vi: 'Deploy qua Wrangler như Workers khác; đọc trang Workflows và lộ trình Developer Platform trên hub. Nếu bạn mới học Workers, hoàn thành bài Workers intro và KV trước — Workflows dễ hiểu hơn khi bạn đã có một API + binding hoạt động.',
          en: 'Deploy via Wrangler like other Workers; read the Workflows product page and Developer Platform track on this hub. If you are new to Workers, finish the Workers intro and KV posts first — Workflows clicks faster once you have a working API + binding.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu platform chạy lại bước này hai lần, tiền hoặc email có bị duplicate không?” Nếu có, sửa idempotency trước khi production. Mở bài gốc blog.cloudflare.com về Workflows để cập nhật giới hạn và pattern mới nhất.',
          en: 'Self-check: “If the platform runs this step twice, do we double-charge or double-email?” If yes, fix idempotency before production. Open original blog.cloudflare.com Workflows posts for the latest limits and patterns.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Workflows có thay Queues không?',
        en: 'Do Workflows replace Queues?',
      },
      answer: {
        vi: 'Không hoàn toàn. Queues tốt cho fan-out và xử lý message độc lập. Workflows tốt cho chuỗi bước có thứ tự, chờ, và retry có cấu trúc. Nhiều hệ thống dùng cả hai.',
        en: 'Not entirely. Queues excel at fan-out and independent messages. Workflows excel at ordered steps, waits, and structured retries. Many systems use both.',
      },
    },
    {
      question: {
        vi: 'Workflows có phù hợp job chạy hàng giờ không?',
        en: 'Are Workflows suitable for jobs that run for hours?',
      },
      answer: {
        vi: 'Workflows hỗ trợ tác vụ dài hơn request Worker thường, với sleep và durable state — nhưng vẫn có giới hạn platform. Job cực dài hoặc compute nặng liên tục có thể cần kiến trúc khác (container, batch bên ngoài). Luôn kiểm tra docs giới hạn hiện tại.',
        en: 'Workflows support longer work than a typical Worker request, with sleep and durable state — but platform limits still apply. Extremely long or heavy continuous compute may need another architecture (containers, external batch). Always check current docs for limits.',
      },
    },
    {
      question: {
        vi: 'Nên học Workflows trước hay Durable Objects trước?',
        en: 'Should I learn Workflows or Durable Objects first?',
      },
      answer: {
        vi: 'Nếu bạn có quy trình nhiều bước (email, thanh toán, pipeline), học Workflows trước. Nếu bạn cần realtime state một object (chat, game), học Durable Objects trước. Cả hai là trung cấp sau Workers cơ bản.',
        en: 'If you have multi-step processes (email, payments, pipelines), learn Workflows first. If you need single-object realtime state (chat, game), learn Durable Objects first. Both are intermediate after basic Workers.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Workflows topics',
      href: 'https://blog.cloudflare.com/tag/workflows/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['workflows', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'kv-key-value-edge-khi-nao-dung',
  ],
  hubLinks: [
    { href: '/products/workflows/', label: { vi: 'Workflows (trang sản phẩm)', en: 'Workflows (product page)' } },
    { href: '/products/workers/', label: { vi: 'Workers (trang sản phẩm)', en: 'Workers (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: ứng dụng serverless', en: 'Use case: build a serverless app' } },
    { href: '/products/durable-objects/', label: { vi: 'So sánh với Durable Objects', en: 'Compare with Durable Objects' } },
  ],
  diagramSlugs: [
    'fullstack-application',
    'serverless-global-apis',
  ],
};
