import type { BlogPost } from '../blog';

/** Entry · Developer Platform — Workers logs and observability for beginners */
export const postObservabilityLogsWorkersChoNguoiMoi: BlogPost = {
  slug: 'observability-logs-workers-cho-nguoi-moi',
  date: '2026-09-20',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Logs & observability trên Cloudflare: biết app đang “khỏe” không',
    en: 'Logs & observability on Cloudflare: knowing if your app is healthy',
  },
  description: {
    vi: 'Giải thích observability cho người mới: vì sao cần nhìn lỗi sớm, Workers logs và tail, analytics cơ bản — không cần SIEM ngày đầu.',
    en: 'Observability for beginners: why early error visibility matters, Workers logs and tail, basic analytics — no SIEM required on day one.',
  },
  excerpt: {
    vi: 'App edge chạy ở hàng trăm điểm — bạn không SSH vào “một máy” được. Logs và observability là cách biết request có đến, có lỗi, và ai đang gặp vấn đề.',
    en: 'Edge apps run at hundreds of points — you cannot SSH into “one box.” Logs and observability tell you whether requests arrive, fail, and who is affected.',
  },
  keywords: {
    vi: 'Workers logs, observability Cloudflare, wrangler tail, debug Workers, operational excellence',
    en: 'Workers logs, Cloudflare observability, wrangler tail, debug Workers, operational excellence',
  },
  sections: [
    {
      heading: {
        vi: 'Observability là gì — và vì sao edge khác server truyền thống?',
        en: 'What is observability — and why is edge different from traditional servers?',
      },
      paragraphs: [
        {
          vi: 'Observability (quan sát hệ thống) là khả năng hiểu app đang làm gì từ bên ngoài: request có thành công không, chậm ở đâu, lỗi xảy ra khi nào. Với server VPS, bạn có thể mở terminal, đọc file log trên đĩa, hoặc chạy `top` khi có sự cố. Với Cloudflare Workers, code chạy phân tán trên mạng edge — không có “một máy” để SSH.',
          en: 'Observability is the ability to understand what your app is doing from the outside: whether requests succeed, where slowness happens, when errors occur. On a VPS you might open a terminal, read log files on disk, or run `top` during an incident. With Cloudflare Workers, code runs distributed on the edge network — there is no single box to SSH into.',
        },
        {
          vi: 'Đó là lý do logs, metrics và tracing trở thành “mắt và tai” bắt buộc thay vì tùy chọn. Trên blog.cloudflare.com, các bài observability nhấn mạnh: phát hiện lỗi sớm rẻ hơn debug sau khi user đã báo “site lỗi cả ngày”. Người mới không cần xây data lake — chỉ cần biết request có fail và đọc được message lỗi.',
          en: 'That is why logs, metrics, and tracing become mandatory senses rather than optional extras. On blog.cloudflare.com, observability posts stress that catching errors early is cheaper than debugging after users report “the site was broken all day.” Beginners do not need a data lake — just knowing requests fail and reading error messages is enough to start.',
        },
        {
          vi: 'Hub này có lộ trình Operational Excellence cho DevOps/SRE: observability là bước đầu trước incident response và release safety. Bài viết này nối Workers — khối compute phổ biến — với thực hành vận hành hàng ngày.',
          en: 'This hub has an Operational Excellence track for DevOps/SRE: observability is the first step before incident response and release safety. This post connects Workers — the common compute block — to day-to-day operations practice.',
        },
      ],
      diagramSlug: 'serverless-global-apis',
    },
    {
      heading: {
        vi: 'Ba công cụ người mới nên biết trước SIEM',
        en: 'Three tools beginners should know before SIEM',
      },
      paragraphs: [
        {
          vi: 'Workers Observability trong dashboard: xem request, lỗi, và thời gian phản hồi theo Worker. Đây là điểm vào trực quan khi bạn chưa quen CLI. Cloudflare Web Analytics (hoặc analytics traffic tùy setup) cho website: biết traffic tăng hay giảm, trang nào được truy cập — hữu ích khi “API có vẻ lỗi” nhưng bạn chưa biết có phải do không ai gọi.',
          en: 'Workers Observability in the dashboard: see requests, errors, and response time per Worker. This is a visual entry point before you are comfortable with CLI. Cloudflare Web Analytics (or traffic analytics depending on setup) for the site: know whether traffic rises or falls, which pages get hits — useful when “the API seems broken” but you do not know if anyone is calling it.',
        },
        {
          vi: '`wrangler tail` (hoặc tail qua dashboard): stream log thời gian thực từ Worker khi bạn deploy hoặc test. Giống ngồi cạnh “máy” và xem console.log — nhưng cho edge. Khi form signup workshop trên hub trả lỗi 500, tail thường cho thấy binding D1 chưa apply migration hoặc JSON parse fail trong vài giây.',
          en: '`wrangler tail` (or tail via the dashboard): stream real-time logs from a Worker while you deploy or test. Like sitting next to the “machine” watching console.log — but for the edge. When a workshop signup form on this hub returns 500, tail often shows an unapplied D1 migration or JSON parse failure within seconds.',
        },
        {
          vi: 'Structured logging: thay vì in chuỗi lung tung, log JSON với `level`, `message`, `requestId` — sau này filter dễ hơn. Người mới có thể bắt đầu với `console.error` rõ ràng; khi app lớn dần, chuẩn hóa format. Docs Workers Observability giải thích chi tiết — hub trỏ tới docs, blog.cloudflare.com cho câu chuyện sản phẩm.',
          en: 'Structured logging: instead of random strings, log JSON with `level`, `message`, `requestId` — easier to filter later. Beginners can start with clear `console.error`; standardize format as the app grows. Workers Observability docs explain details — the hub points to docs, blog.cloudflare.com for product stories.',
        },
      ],
    },
    {
      heading: {
        vi: 'Kịch bản đời thực: từ “không biết lỗi” đến “sửa trong 10 phút”',
        en: 'Real scenario: from “no idea what failed” to “fixed in ten minutes”',
      },
      paragraphs: [
        {
          vi: 'Kịch bản 1: API đăng ký workshop trả 502 sau deploy. Không có observability, bạn đoán DNS, đoán origin, đoán D1. Với tail + dashboard, bạn thấy exception “DB not ready” — apply migration local/production, xong. Kịch bản 2: trang nhanh bất thường ở một region. Analytics + Worker timing cho biết một fetch upstream chậm — không phải Workers “chậm” mà là API bên thứ ba.',
          en: 'Scenario 1: workshop signup API returns 502 after deploy. Without observability you guess DNS, origin, D1. With tail + dashboard you see exception “DB not ready” — apply migration locally/production, done. Scenario 2: a page is oddly slow in one region. Analytics + Worker timing show a slow upstream fetch — not Workers being “slow” but a third-party API.',
        },
        {
          vi: 'Kịch bản 3: traffic tăng gấp đôi sau chiến dịch marketing. Observability cho biết error rate vẫn thấp — bạn yên tâm scale; hoặc error rate nhảy — bạn rollback hoặc bật rate limit trước khi user flood Twitter. Đó là operational excellence ở mức thực tế, không cần war room.',
          en: 'Scenario 3: traffic doubles after a marketing campaign. Observability shows error rate still low — you scale with confidence; or error rate spikes — you rollback or enable rate limiting before users flood Twitter. That is practical operational excellence without a war room.',
        },
        {
          vi: 'Đọc bài Workers intro và Developer Platform trên blog hub nếu bạn chưa hiểu Workers là gì; quay lại bài này khi bạn đã deploy Worker đầu tiên và cần “nhìn thấy” nó chạy.',
          en: 'Read the Workers intro and Developer Platform posts on this blog hub if you do not yet know what Workers are; return here after your first Worker deploy when you need to “see” it run.',
        },
      ],
    },
    {
      heading: {
        vi: 'Bắt đầu tuần này — checklist người mới',
        en: 'Start this week — a beginner checklist',
      },
      paragraphs: [
        {
          vi: 'Bật Workers Observability cho Worker bạn đang dùng. Chạy `wrangler tail` một lần sau deploy và cố ý gây lỗi (gửi JSON sai) để thấy log xuất hiện. Ghi note: “lỗi signup thường là D1 migration hoặc Turnstile” — tùy app của bạn. Không cần SIEM, Splunk, hay Grafana ngày đầu.',
          en: 'Enable Workers Observability for the Worker you use. Run `wrangler tail` once after deploy and deliberately trigger an error (send bad JSON) to see logs appear. Note: “signup errors are usually D1 migration or Turnstile” — for your app. No SIEM, Splunk, or Grafana required on day one.',
        },
        {
          vi: 'Tiếp theo trên hub: lộ trình Operational Excellence (observability → incident → release safety) và trang sản phẩm Workers. Khi app AI lớn dần, AI Gateway observability là lớp bổ sung — nhưng nền Workers logs vẫn là chỗ bạn debug API và binding.',
          en: 'Next on the hub: Operational Excellence track (observability → incident → release safety) and the Workers product page. As AI apps grow, AI Gateway observability is an extra layer — but Workers logs remain where you debug APIs and bindings.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Observability có tốn nhiều không?',
        en: 'Is observability expensive?',
      },
      answer: {
        vi: 'Bật log và dashboard cơ bản thường nằm trong gói bạn đã dùng; chi phí tăng khi lưu log lâu hoặc volume rất lớn. Người mới nên bắt tail + dashboard trước khi lo data retention phức tạp.',
        en: 'Basic logs and dashboard are usually part of plans you already use; cost rises with long retention or very high volume. Beginners should start with tail + dashboard before worrying about complex retention.',
      },
    },
    {
      question: {
        vi: 'Workers logs thay thế được monitoring server không?',
        en: 'Can Workers logs replace server monitoring?',
      },
      answer: {
        vi: 'Với app chủ yếu trên Workers, logs + analytics là nền. Nếu bạn vẫn có origin hoặc container riêng, cần monitor cả hai lớp — edge và origin.',
        en: 'For apps mostly on Workers, logs + analytics are the foundation. If you still have your own origin or containers, monitor both layers — edge and origin.',
      },
    },
    {
      question: {
        vi: 'Nên học observability trước hay Workers trước?',
        en: 'Should I learn observability or Workers first?',
      },
      answer: {
        vi: 'Deploy một Worker “Hello” trước, rồi học tail và dashboard ngay — observability có ý nghĩa khi bạn có thứ cần quan sát.',
        en: 'Deploy a “Hello” Worker first, then learn tail and dashboard — observability matters when you have something to observe.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Observability topics',
      href: 'https://blog.cloudflare.com/tag/observability/',
    },
    {
      title: 'The Cloudflare Blog — Workers topics',
      href: 'https://blog.cloudflare.com/tag/workers/',
    },
    {
      title: 'Workers Observability (Cloudflare Docs)',
      href: 'https://developers.cloudflare.com/workers/observability/',
    },
  ],
  relatedTrack: 'operational-excellence',
  relatedProductSlugs: ['workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
    'ai-gateway-chi-phi-token-kiem-soat',
  ],
  hubLinks: [
    {
      href: '/tracks/operational-excellence/',
      label: { vi: 'Lộ trình Operational Excellence', en: 'Operational Excellence track' },
    },
    {
      href: '/products/workers/',
      label: { vi: 'Workers (trang sản phẩm)', en: 'Workers (product page)' },
    },
    {
      href: '/use-cases/operational-excellence/',
      label: { vi: 'Use cases Operational Excellence', en: 'Operational Excellence use cases' },
    },
    {
      href: '/tracks/developer-platform/',
      label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' },
    },
    {
      href: '/cloudflare-101/',
      label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' },
    },
  ],
  diagramSlugs: [
    'serverless-global-apis',
    'fullstack-application',
  ],
};
