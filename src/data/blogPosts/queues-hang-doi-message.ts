import type { BlogPost } from '../blog';

/** Entry · Workers — rewritten from Cloudflare Queues docs and blog themes */
export const postQueuesHangDoiMessageTrenWorkers: BlogPost = {
  slug: 'queues-hang-doi-message-tren-workers',
  date: '2026-09-28',
  topic: 'workers',
  level: 'entry',
  readingMinutes: 8,
  title: {
    vi: 'Cloudflare Queues là gì? Hàng đợi message để Worker không phải làm hết trong một request',
    en: 'What are Cloudflare Queues? A message line so a Worker does not do everything in one request',
  },
  description: {
    vi: 'Giải thích Queues cho người mới: producer gửi message, consumer xử lý theo lô, ack và retry, khác gì Workflows và KV, và khi nào hàng đợi là lựa chọn đúng.',
    en: 'A beginner guide to Queues: producers send messages, consumers process batches, ack and retry, how it differs from Workflows and KV, and when a queue is the right tool.',
  },
  excerpt: {
    vi: 'Queues giống quầy lấy số: request chỉ nộp việc rồi trả lời ngay, còn phần nặng được xử lý phía sau — có xác nhận, thử lại, và không làm mất message giữa đường.',
    en: 'Queues are like a take-a-number counter: the request only files the job and replies, while the heavy work happens later — with acknowledgement, retries, and delivery you can rely on.',
  },
  keywords: {
    vi: 'Cloudflare Queues là gì, hàng đợi Workers, producer consumer, dead letter queue, học Queues cơ bản',
    en: 'what are Cloudflare Queues, Workers message queue, producer consumer, dead letter queue, Cloudflare Queues beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao không nhét mọi việc vào một request Worker?',
        en: 'Why not stuff every job into one Worker request?',
      },
      paragraphs: [
        {
          vi: 'Một form đăng ký workshop, một webhook thanh toán, hay một lần upload ảnh thường kích hoạt nhiều việc phụ: ghi database, gửi email, resize ảnh, gọi API bên thứ ba. Nếu Worker làm hết trong request của người dùng, họ phải chờ, và một bước chậm có thể làm cả request timeout. Người dùng chỉ cần biết “đã nhận”, không cần đứng đợi email đi xong.',
          en: 'A workshop signup, a payment webhook, or an image upload often kicks off side work: write the database, send email, resize the image, call a third-party API. If the Worker does all of that inside the user’s request, they wait, and one slow step can time the whole request out. The user only needs “we received it”, not to stand there until the email has gone.',
        },
        {
          vi: 'Cloudflare Queues là dịch vụ hàng đợi message toàn cầu trên nền tảng Workers. Worker producer gửi một message (ví dụ `{ signupId: "abc" }`) vào queue qua binding. Consumer — thường là một Worker khác — nhận message theo lô và xử lý khi sẵn sàng. Tài liệu chính thức mô tả đây là hàng đợi có guaranteed delivery: message không biến mất chỉ vì consumer đang bận một lúc.',
          en: 'Cloudflare Queues is a global message queue on the Workers platform. A producer Worker sends a message (for example `{ signupId: "abc" }`) through a binding. A consumer — usually another Worker — receives messages in batches and processes them when it is ready. Official docs describe guaranteed delivery: a message does not vanish just because the consumer is busy for a moment.',
        },
        {
          vi: 'Hãy hình dung quầy bánh mì giờ cao điểm. Khách lấy số và đi. Bếp xử lý từng mẻ, không bắt khách đứng trong bếp. Queues tách “nhận việc” khỏi “làm việc”. Đó là lý do các bài trên blog.cloudflare.com về Workers và hàng đợi thường đặt Queues cạnh webhook, email, và pipeline — không phải cạnh cache tĩnh.',
          en: 'Picture a bakery at rush hour. Customers take a number and leave. The kitchen works in batches and does not make customers stand in the kitchen. Queues split “accept the job” from “do the job”. That is why Cloudflare Blog posts on Workers and queues place Queues next to webhooks, email, and pipelines — not next to static cache.',
        },
      ],
      diagramSlug: 'serverless-etl',
    },
    {
      heading: {
        vi: 'Producer, consumer, và hai cách lấy message',
        en: 'Producer, consumer, and two ways to take messages',
      },
      paragraphs: [
        {
          vi: 'Producer là Worker gửi message. Bạn khai báo binding trong cấu hình Wrangler, ví dụ tên binding `SIGNUPS`, rồi gọi `env.SIGNUPS.send(payload)`. Có thể đặt `delivery_delay` để message chưa hiện ra cho consumer ngay — hữu ích khi bạn muốn chờ vài chục giây cho giao dịch hoàn tất trước khi gửi email. Một Worker có thể vừa produce vừa consume nhiều queue.',
          en: 'The producer is the Worker that sends the message. You declare a binding in Wrangler, for example `SIGNUPS`, then call `env.SIGNUPS.send(payload)`. You can set a `delivery_delay` so the message is not visible to the consumer yet — useful when you want a few dozen seconds for a transaction to finish before the email goes out. One Worker can produce to and consume from several queues.',
        },
        {
          vi: 'Consumer kiểu push là cách dễ nhất để bắt đầu: Cloudflare gọi Worker của bạn với một batch message, và consumer tự scale theo lượng việc. Bạn cấu hình `max_batch_size`, `max_batch_timeout`, `max_retries`, và tùy chọn `retry_delay`. Consumer kiểu pull thì ngược lại: hệ thống bên ngoài (không nhất thiết là Workers) tự gọi HTTP để kéo message khi sẵn sàng. Tài liệu pull consumer ghi rõ mức hiện tại là tối đa 5.000 message mỗi giây trên mỗi queue — hợp khi bạn cần hãm tốc độ cho một database cũ.',
          en: 'A push consumer is the easiest start: Cloudflare invokes your Worker with a batch, and the consumer scales with the workload. You configure `max_batch_size`, `max_batch_timeout`, `max_retries`, and optionally `retry_delay`. A pull consumer is the opposite: something outside Workers calls HTTP to pull messages only when it is ready. Pull-consumer docs currently allow up to 5,000 messages per second per queue — a fit when you must throttle into an older database.',
        },
        {
          vi: 'Xử lý xong phải ack (acknowledge) message. Nếu bạn không ack, hoặc gọi retry, message được giao lại. Đó là at-least-once: cùng một việc có thể tới consumer nhiều hơn một lần. Code consumer phải chịu được việc đó — ví dụ ghi “email đã gửi” vào D1 trước khi gửi lại, để lần thứ hai không gửi trùng. Nếu hết `max_retries` mà vẫn lỗi, message đi vào dead-letter queue nếu bạn đã cấu hình; nếu không, message bị bỏ.',
          en: 'When processing finishes you must acknowledge the message. If you do not ack, or you retry, the message is delivered again. That is at-least-once: the same job can reach the consumer more than once. Consumer code has to tolerate that — for example record “email sent” in D1 before sending, so the second delivery does not send a duplicate. After `max_retries` the message goes to a dead-letter queue if you configured one; otherwise it is discarded.',
        },
      ],
    },
    {
      heading: {
        vi: 'Queues khác Workflows, KV và cron như thế nào?',
        en: 'How do Queues differ from Workflows, KV, and cron?',
      },
      paragraphs: [
        {
          vi: 'Cron trên Workers hợp với việc “mỗi giờ chạy một lần” theo lịch. Queues hợp với việc “mỗi sự kiện một message”, số lượng lên xuống theo traffic thật. Workflows hợp khi bạn cần nhiều bước có trạng thái, có thể sleep vài giờ rồi chạy tiếp đúng chỗ đã dừng. Queues không nhớ “bước 3 của hồ sơ này”; nó chỉ giữ message cho đến khi consumer xử lý xong hoặc hết hạn giữ.',
          en: 'A Workers cron fits “run once an hour” on a schedule. Queues fit “one message per event”, with volume that follows real traffic. Workflows fit multi-step work with state, including sleeping for hours and resuming exactly where you stopped. Queues do not remember “step 3 of this case”; they hold a message until the consumer finishes it or retention expires.',
        },
        {
          vi: 'KV là tủ tra cứu: bạn biết khóa, bạn đọc giá trị, và ghi mới có thể mất vài giây mới thấy khắp nơi. Đừng dùng KV như hàng đợi bằng cách nhét danh sách việc vào một key JSON — hai producer ghi cùng lúc sẽ đè nhau. D1 hợp để lưu kết quả đã xử lý (bảng đăng ký, trạng thái email). R2 hợp để giữ file lớn mà message chỉ trỏ tới object key, không nhét cả file vào body message.',
          en: 'KV is a lookup locker: you know the key, you read the value, and a fresh write can take a few seconds to show everywhere. Do not use KV as a queue by stuffing a job list into one JSON key — two producers writing at once will overwrite each other. D1 fits the result after processing (the signup row, the email status). R2 fits large files, with the message pointing at an object key instead of carrying the whole file.',
        },
        {
          vi: 'Một pattern thực tế trên hub này: form workshop nhận request, ghi D1, gửi message `{ signupId }` vào queue, trả 200 ngay. Consumer gửi email xác nhận và retry nếu nhà cung cấp email lỗi. Nếu bạn đã đọc bài Workflows, hãy coi Queues là “băng chuyền việc” và Workflows là “hồ sơ nhiều bước”. Nhiều app dùng cả hai: queue nhận burst, workflow điều phối các bước dài của từng đơn.',
          en: 'A practical pattern on this hub: the workshop form accepts the request, writes D1, sends `{ signupId }` to a queue, and returns 200 immediately. The consumer sends the confirmation email and retries if the email provider fails. If you have read the Workflows post, treat Queues as the “job conveyor” and Workflows as the “multi-step case file”. Many apps use both: the queue absorbs bursts, the workflow orchestrates the long steps of each order.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu an toàn: checklist tuần đầu với Queues',
        en: 'A safe start: first-week Queues checklist',
      },
      paragraphs: [
        {
          vi: 'Một: bắt đầu với một queue, một producer, một push consumer. Đặt tên message rõ (`signup.created`) và payload nhỏ, có id để tra D1. Hai: viết consumer idempotent — chạy hai lần không được gửi hai email hay trừ tiền hai lần. Ba: cấu hình dead-letter queue trước khi production, rồi xem những message nằm đó thay vì để chúng biến mất sau hết số lần retry.',
          en: 'One: start with one queue, one producer, one push consumer. Name the message clearly (`signup.created`) and keep the payload small, with an id you can look up in D1. Two: make the consumer idempotent — running twice must not send two emails or charge twice. Three: configure a dead-letter queue before production, then inspect what lands there instead of letting messages disappear after the last retry.',
        },
        {
          vi: 'Bốn: nhớ hạn giữ message. Bạn có thể chỉnh retention từ 60 giây đến 14 ngày. Trên gói Workers Free, hạn giữ tối đa là 24 giờ chứ không phải 14 ngày; free cũng gồm tới 10.000 queue và 10.000 operations mỗi ngày (đọc, ghi, xóa). Đừng thiết kế luồng “để message nằm hàng tuần” trên free. Năm: log lỗi consumer bằng Workers Logs — bài observability trên hub giải thích vì sao nhìn lỗi sớm quan trọng hơn chờ user báo.',
          en: 'Four: remember retention. You can set it from 60 seconds up to 14 days. On the Workers Free plan the maximum retention is 24 hours, not 14 days; Free also includes up to 10,000 queues and 10,000 operations per day (reads, writes, and deletes). Do not design a flow that leaves messages sitting for weeks on Free. Five: log consumer failures with Workers Logs — the observability post on this hub explains why seeing errors early matters more than waiting for a user report.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu message này được giao hai lần, hệ thống có làm hại user không?” Nếu có, bạn chưa xong phần idempotency — đó không phải lỗi của Queues. Đọc trang sản phẩm Queues, lộ trình Developer Platform, và bài gốc trên blog.cloudflare.com khi bạn cần giới hạn kích thước message hoặc event subscriptions mới nhất.',
          en: 'Self-check: “If this message is delivered twice, can it harm the user?” If yes, idempotency is not finished — that is not a Queues bug. Read the Queues product page, the Developer Platform track, and the original posts on blog.cloudflare.com when you need the latest message-size limits or event subscriptions.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Queues có đảm bảo mỗi message chỉ chạy đúng một lần không?',
        en: 'Do Queues guarantee each message runs exactly once?',
      },
      answer: {
        vi: 'Không. Delivery là at-least-once: message được giữ đến khi ack, và có thể được giao lại khi retry hoặc consumer lỗi giữa chừng. Hãy thiết kế consumer chịu được lần chạy trùng.',
        en: 'No. Delivery is at-least-once: a message is kept until it is acknowledged, and it can be delivered again on retry or if the consumer fails mid-way. Design the consumer to tolerate a duplicate run.',
      },
    },
    {
      question: {
        vi: 'Nên dùng push consumer hay pull consumer?',
        en: 'Should I use a push consumer or a pull consumer?',
      },
      answer: {
        vi: 'Push consumer trên Workers là cách bắt đầu dễ nhất và tự scale. Pull qua HTTP khi phần xử lý nằm ngoài Workers hoặc bạn cần tự khống chế tốc độ lấy message.',
        en: 'A push consumer on Workers is the easiest start and scales on its own. Use HTTP pull when processing lives outside Workers or you must control how fast messages are taken.',
      },
    },
    {
      question: {
        vi: 'Queues có thay Workflows không?',
        en: 'Can Queues replace Workflows?',
      },
      answer: {
        vi: 'Không hoàn toàn. Queues đưa việc từ producer sang consumer. Workflows giữ trạng thái nhiều bước, chờ và retry đúng bước. Nhiều hệ thống dùng queue để nhận burst và workflow để điều phối từng hồ sơ.',
        en: 'Not fully. Queues move work from a producer to a consumer. Workflows keep multi-step state, waits, and per-step retries. Many systems use a queue to absorb bursts and a workflow to orchestrate each case.',
      },
    },
  ],
  sources: [
    {
      title: 'Cloudflare Docs — Queues',
      href: 'https://developers.cloudflare.com/queues/',
    },
    {
      title: 'Cloudflare Docs — Pull consumers',
      href: 'https://developers.cloudflare.com/queues/configuration/pull-consumers/',
    },
    {
      title: 'The Cloudflare Blog — Queues on the Workers Free plan',
      href: 'https://developers.cloudflare.com/changelog/post/2026-02-04-queues-free-plan/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['queues', 'workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'workflows-tac-vu-dai-tren-workers',
    'd1-sqlite-edge-cho-app-nho',
  ],
  hubLinks: [
    { href: '/products/queues/', label: { vi: 'Queues là gì? (trang sản phẩm)', en: 'What are Queues? (product page)' } },
    { href: '/products/workers/', label: { vi: 'Workers là gì? (trang sản phẩm)', en: 'What are Workers? (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: ứng dụng serverless', en: 'Use case: build a serverless app' } },
    { href: '/blog/workflows-tac-vu-dai-tren-workers/', label: { vi: 'So sánh với Workflows', en: 'Compare with Workflows' } },
  ],
  diagramSlugs: ['serverless-etl', 'serverless-global-apis'],
};
