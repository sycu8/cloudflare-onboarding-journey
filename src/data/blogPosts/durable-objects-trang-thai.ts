import type { BlogPost } from '../blog';

/** Intermediate · Workers — rewritten from Durable Objects docs and blog themes */
export const postDurableObjectsPhoiHopTrangThaiEdge: BlogPost = {
  slug: 'durable-objects-phoi-hop-trang-thai-edge',
  date: '2026-09-30',
  topic: 'workers',
  level: 'intermediate',
  readingMinutes: 8,
  title: {
    vi: 'Durable Objects là gì? Một “não” duy nhất cho từng phòng chat, phiên game, hay bộ đếm',
    en: 'What are Durable Objects? One brain per chat room, game session, or counter',
  },
  description: {
    vi: 'Giải thích Durable Objects trung cấp: một instance cho mỗi ID trên toàn cầu, storage SQLite nhất quán, WebSocket và alarm; khác KV, D1 và Queues.',
    en: 'An intermediate Durable Objects guide: one global instance per ID, strongly consistent SQLite storage, WebSockets and alarms; how it differs from KV, D1, and Queues.',
  },
  excerpt: {
    vi: 'Durable Objects giống một nhân viên trực đúng một phòng: mọi tin nhắn của phòng đó đi qua cùng một người, nên không ai đếm ghế hai lần.',
    en: 'A Durable Object is like one attendant assigned to exactly one room: every message for that room goes through the same person, so nobody books the same seat twice.',
  },
  keywords: {
    vi: 'Durable Objects là gì, SQLite Durable Objects, phối hợp trạng thái edge, Durable Objects vs D1, học Durable Objects',
    en: 'what are Durable Objects, SQLite Durable Objects, edge coordination, Durable Objects vs D1, learn Durable Objects',
  },
  sections: [
    {
      heading: {
        vi: 'Vấn đề mà KV và một Worker thường không giải được',
        en: 'The problem KV and a normal Worker usually cannot solve',
      },
      paragraphs: [
        {
          vi: 'Hãy tưởng tượng phòng chat 40 người, hoặc sơ đồ ghế máy bay mà nhiều khách bấm “giữ chỗ” cùng lúc. Nếu mỗi request rơi vào một Worker khác nhau, hai Worker có thể cùng đọc “ghế 12A còn trống” rồi cùng ghi “đã đặt”. KV còn eventual consistency: bản ghi mới có thể chưa tới mọi nơi trong vài giây. Kết quả là double-booking — đúng lỗi mà ứng dụng realtime sợ nhất.',
          en: 'Picture a 40-person chat room, or an airline seat map where several people tap “hold” at once. If each request lands on a different Worker, two Workers can both read “seat 12A is free” and both write “booked”. KV is also eventually consistent: a new write may not be visible everywhere for a few seconds. The result is a double booking — the bug realtime apps fear most.',
        },
        {
          vi: 'Durable Objects giải quyết bằng một quy tắc: với một ID (ví dụ `room:hanoi-01`), chỉ có một instance đang chạy trên toàn cầu. Mọi request tới ID đó được định tuyến tới data center đang sở hữu object. Storage gắn với object là transactional và strongly consistent, và chỉ object đó đọc ghi được — object khác không đụng vào dữ liệu của nó. Bài giới thiệu trên blog.cloudflare.com gọi đây là điểm phối hợp, không phải database dùng chung cho cả app.',
          en: 'Durable Objects solve this with one rule: for a given ID (for example `room:hanoi-01`) there is a single running instance worldwide. Every request for that ID is routed to the data center that owns the object. Storage attached to the object is transactional and strongly consistent, and only that object can read or write it. The introductory post on blog.cloudflare.com treats this as a coordination point, not a database shared by the whole app.',
        },
        {
          vi: 'Object còn có bộ nhớ trong để gom việc trước khi ghi đĩa, WebSocket để giữ kết nối realtime, alarm để tự thức dậy vào một thời điểm, và RPC để Worker gọi method như `room.addMessage()` thay vì tự bịa giao thức. Bộ nhớ trong mất khi object hibernate sau một lúc idle — dữ liệu cần giữ phải được ghi vào storage.',
          en: 'An object also has in-memory state for batching before a disk write, WebSockets for realtime connections, alarms to wake itself at a chosen time, and RPC so a Worker calls a method like `room.addMessage()` instead of inventing a protocol. In-memory state is cleared when the object hibernates after being idle — anything you still need must be written to storage.',
        },
      ],
      diagramSlug: 'durable-object-control-data-plane-pattern',
    },
    {
      heading: {
        vi: 'SQLite trong object: storage nên dùng cho class mới',
        en: 'SQLite inside the object: the storage new classes should use',
      },
      paragraphs: [
        {
          vi: 'Cloudflare khuyến nghị class Durable Object mới dùng SQLite storage backend. Trong Wrangler bạn khai báo migration `new_sqlite_classes`. Bên trong class, `ctx.storage.sql.exec(...)` tạo bảng và ghi dòng ngay cạnh code xử lý — không qua một database network riêng. Class SQLite vẫn dùng được API key-value đồng bộ, alarm, và point-in-time recovery để khôi phục nội dung khoảng 30 ngày.',
          en: 'Cloudflare recommends that new Durable Object classes use the SQLite storage backend. In Wrangler you declare a `new_sqlite_classes` migration. Inside the class, `ctx.storage.sql.exec(...)` creates tables and writes rows next to the code that uses them — not through a separate networked database. SQLite classes can still use the synchronous key-value API, alarms, and point-in-time recovery for roughly the last 30 days.',
        },
        {
          vi: 'Backend key-value cũ vẫn còn để tương thích ngược. Đừng bắt đầu project mới trên backend đó nếu bạn cần bảng, index, hoặc SQL. Input gate và output gate của runtime giúp thao tác storage không bị race kiểu JavaScript xen kẽ request — đây là phần “đúng” mà bài “easy, fast, correct” trên blog Cloudflare nhấn mạnh. Bạn vẫn nên thiết kế method ngắn, rõ, và không giữ khóa logic lâu hơn cần thiết.',
          en: 'The older key-value backend remains for backwards compatibility. Do not start a new project on it if you need tables, indexes, or SQL. The runtime’s input and output gates keep storage operations from the kind of race where JavaScript interleaves requests — the “correct” part the Cloudflare Blog “easy, fast, correct” post emphasizes. You should still keep methods short and not hold logical locks longer than necessary.',
        },
        {
          vi: 'WebSocket Hibernation cho phép object ngủ khi không có tin nhắn mà vẫn giữ kết nối, nên app chat đỡ tốn compute lúc phòng im. Alarm hợp với việc “5 phút nữa đóng phiên nếu không ai nói” hoặc flush bộ đếm về D1. Kết hợp ba thứ — SQL, WebSocket, alarm — là lý do Durable Objects xuất hiện trong kiến trúc chat, game, và rate limit theo từng tenant chứ không phải trong trang marketing tĩnh.',
          en: 'WebSocket Hibernation lets the object sleep when nobody is talking while connections stay open, so a chat app spends less compute when a room is quiet. Alarms fit “close the session in five minutes if nobody speaks” or flushing a counter to D1. SQL, WebSockets, and alarms together are why Durable Objects show up in chat, games, and per-tenant rate limits rather than on a static marketing page.',
        },
      ],
    },
    {
      heading: {
        vi: 'So với D1, KV và Queues — chọn đúng “đơn vị phối hợp”',
        en: 'Versus D1, KV, and Queues — pick the right unit of coordination',
      },
      paragraphs: [
        {
          vi: 'D1 là sản phẩm database quản lý: Worker nói chuyện với SQLite qua mạng, có migration, import/export, HTTP API cho công cụ bên ngoài. SQLite trong Durable Objects là khối compute đặt cạnh storage, và theo thiết kế chỉ Worker truy cập được. Nếu bạn cần một bảng đăng ký workshop cho cả site, D1 thường đúng hơn. Nếu bạn cần “đúng một người giữ ghế của chuyến bay này”, Durable Object đúng hơn.',
          en: 'D1 is a managed database: a Worker talks to SQLite over the network, with migrations, import/export, and an HTTP API for outside tools. SQLite in Durable Objects is compute sitting next to storage, and by design only Workers can reach it. If you need one signup table for the whole site, D1 is usually right. If you need “exactly one actor holding the seats for this flight”, a Durable Object is right.',
        },
        {
          vi: 'KV vẫn thắng khi dữ liệu là flag đọc rất nhiều và bạn chấp nhận vài giây lệch. Queues thắng khi việc cần được đưa ra khỏi request và xử lý sau, có thể trùng lặp một lần. Durable Objects không thay hàng đợi toàn cục: một object singleton cho mọi user trên thế giới sẽ thành nút thắt. Tài liệu “Rules of Durable Objects” nói thẳng: một object cho mỗi đơn vị logic — phòng, phiên, user — không phải một object cho cả công ty.',
          en: 'KV still wins when the data is a read-heavy flag and you can accept a few seconds of lag. Queues win when work must leave the request and run later, even if a delivery is duplicated once. Durable Objects do not replace a global queue: one singleton object for every user on earth becomes a bottleneck. The “Rules of Durable Objects” guide says it directly: one object per logical unit — room, session, user — not one object for the whole company.',
        },
        {
          vi: 'Pattern hay gặp: Worker cổng nhận HTTP, tính ID (`idFromName("flight-842")`), gọi RPC trên stub. Object giữ bảng ghế và WebSocket của khách trên chuyến đó. Việc nặng không cần phối hợp — gửi email vé — đi ra Queues. Báo cáo cuối ngày có thể ghi sang D1. Ba công cụ đứng cạnh nhau trên diagram fullstack của Cloudflare, mỗi thứ một lớp.',
          en: 'A common pattern: a front-door Worker accepts HTTP, computes an ID (`idFromName("flight-842")`), and calls RPC on the stub. The object owns that flight’s seat table and the passengers’ WebSockets. Work that does not need coordination — sending the ticket email — goes out to Queues. An end-of-day report can land in D1. The three tools sit side by side on Cloudflare’s fullstack diagrams, each with its own layer.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist trước khi đưa Durable Objects lên production',
        en: 'Checklist before Durable Objects go to production',
      },
      paragraphs: [
        {
          vi: 'Một: đặt tên ID theo đơn vị phối hợp, và kiểm tra một ID nóng (cả thế giới cùng gọi một object) sẽ không xảy ra. Hai: dùng SQLite cho class mới, tạo index cho cột bạn lọc thường xuyên. Ba: mọi thứ cần sau khi hibernate phải nằm trong storage, không chỉ trong biến bộ nhớ. Bốn: bật WebSocket Hibernation nếu bạn giữ kết nối lâu.',
          en: 'One: name IDs by the unit of coordination, and check that a hot ID (the whole world calling one object) will not happen. Two: use SQLite for new classes, and index columns you filter often. Three: anything needed after hibernation must live in storage, not only in a memory variable. Four: turn on WebSocket Hibernation if you keep connections open for a long time.',
        },
        {
          vi: 'Năm: đừng kỳ vọng công cụ SQL bên ngoài kết nối thẳng vào object như kết nối D1. Sáu: storage SQLite của Durable Objects đã được tính phí (mốc bật billing là đầu tháng 1 năm 2026) — đọc trang pricing hiện tại trước khi giữ dữ liệu lớn trong từng object. Bảy: test bằng `@cloudflare/vitest-pool-workers` để gọi RPC và alarm mà không chờ đồng hồ thật.',
          en: 'Five: do not expect external SQL tools to connect straight into an object the way they can with D1. Six: SQLite storage on Durable Objects is billed (billing started in early January 2026) — read the current pricing page before you keep large data inside each object. Seven: test with `@cloudflare/vitest-pool-workers` so you can call RPC and alarms without waiting on a real clock.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu hai request tới cùng một mili-giây, ai phải thắng?” Nếu câu trả lời là “một nơi duy nhất quyết định”, bạn đang ở đúng sản phẩm. Đọc trang Durable Objects trên hub, bài KV và D1 trong chuỗi blog này, rồi mở docs giới hạn và rules trước khi nhân bản pattern ra nhiều class.',
          en: 'Self-check: “If two requests arrive in the same millisecond, who must win?” If the answer is “one place decides”, you are on the right product. Read the Durable Objects page on this hub, the KV and D1 posts in this series, then the limits and rules docs before you copy the pattern into many classes.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Durable Objects có thay D1 không?',
        en: 'Can Durable Objects replace D1?',
      },
      answer: {
        vi: 'Không cho dữ liệu quan hệ dùng chung toàn app. D1 là database quản lý, có HTTP API và migration. SQLite trong Durable Objects dành cho trạng thái gắn với một ID và chỉ Worker truy cập.',
        en: 'Not for relational data shared by the whole app. D1 is a managed database with an HTTP API and migrations. SQLite in Durable Objects is for state tied to one ID and reached only from Workers.',
      },
    },
    {
      question: {
        vi: 'Một object cho toàn bộ user có được không?',
        en: 'Can I use one object for every user?',
      },
      answer: {
        vi: 'Được về kỹ thuật, nhưng đó là nút thắt. Hãy tạo một object cho mỗi phòng, phiên, hoặc user — đơn vị thực sự cần phối hợp — thay vì một singleton toàn cục.',
        en: 'Technically yes, but it becomes a bottleneck. Create one object per room, session, or user — the unit that actually needs coordination — instead of one global singleton.',
      },
    },
    {
      question: {
        vi: 'Dữ liệu trong RAM của object có bền không?',
        en: 'Is data in the object’s RAM durable?',
      },
      answer: {
        vi: 'Không. Bộ nhớ trong mất khi object hibernate. Những gì cần còn sau đó phải ghi bằng SQL hoặc API storage. Alarm và WebSocket Hibernation không thay việc persist.',
        en: 'No. In-memory state is cleared when the object hibernates. Anything you need later must be written with SQL or the storage API. Alarms and WebSocket Hibernation do not replace persistence.',
      },
    },
  ],
  sources: [
    {
      title: 'Cloudflare Docs — What are Durable Objects?',
      href: 'https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/',
    },
    {
      title: 'Cloudflare Docs — Rules of Durable Objects',
      href: 'https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/',
    },
    {
      title: 'The Cloudflare Blog — Introducing Durable Objects',
      href: 'https://blog.cloudflare.com/introducing-workers-durable-objects/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['durable-objects', 'workers'],
  relatedPostSlugs: [
    'kv-key-value-edge-khi-nao-dung',
    'd1-sqlite-edge-cho-app-nho',
    'queues-hang-doi-message-tren-workers',
  ],
  hubLinks: [
    { href: '/products/durable-objects/', label: { vi: 'Durable Objects (trang sản phẩm)', en: 'Durable Objects (product page)' } },
    { href: '/products/d1/', label: { vi: 'So sánh với D1', en: 'Compare with D1' } },
    { href: '/products/kv/', label: { vi: 'So sánh với KV', en: 'Compare with KV' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/use-cases/build-serverless-app/', label: { vi: 'Use case: ứng dụng serverless', en: 'Use case: build a serverless app' } },
  ],
  diagramSlugs: ['durable-object-control-data-plane-pattern', 'fullstack-application'],
};
