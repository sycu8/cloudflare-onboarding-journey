import type { BlogPost } from '../blog';

/** Entry · Developer Platform — rewritten from Cloudflare Email Service docs */
export const postEmailRoutingVaEmailWorkers: BlogPost = {
  slug: 'email-routing-va-email-workers',
  date: '2026-11-01',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 8,
  title: {
    vi: 'Email Routing và Email Workers: nhận mail tên miền rồi xử lý bằng code',
    en: 'Email Routing and Email Workers: receive mail for your domain, then handle it in code',
  },
  description: {
    vi: 'Giải thích Email Routing cho người mới: chuyển tiếp thư của tên miền tới hộp thư sẵn có, khác Email Sending ở chỗ nào, và khi nào Worker nên đọc người gửi, người nhận rồi chuyển tiếp, trả lời hoặc từ chối.',
    en: 'A beginner guide to Email Routing: forward domain mail to an inbox you already have, how that differs from Email Sending, and when a Worker should read the sender and recipient and then forward, reply, or reject.',
  },
  excerpt: {
    vi: 'Email Routing giống bàn lễ tân của tên miền. Thư đến đúng địa chỉ, Cloudflare chuyển tiếp hoặc đưa cho Worker. Bạn không cần dựng một máy chủ mail cho từng địa chỉ.',
    en: 'Email Routing is the front desk for your domain. Mail arrives at the right address, and Cloudflare forwards it or hands it to a Worker. You do not need a mail server for every address.',
  },
  keywords: {
    vi: 'Email Routing là gì, Email Workers, chuyển tiếp email tên miền, khác Email Sending, học Cloudflare email',
    en: 'what is Email Routing, Email Workers, forward domain email, Email Routing vs Email Sending, Cloudflare email beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Nhận thư và gửi thư là hai việc khác nhau',
        en: 'Receiving mail and sending mail are two different jobs',
      },
      paragraphs: [
        {
          vi: 'Nhiều người mở Cloudflare vì muốn địa chỉ `support@tenmien.com` mà không mua hộp thư mới. Việc đó là nhận thư. Email Routing làm đúng việc này: thư gửi tới tên miền của bạn đi vào Cloudflare, rồi được chuyển tiếp tới Gmail, Outlook hay hộp thư công ty bạn đang dùng. Bạn vẫn đọc thư ở chỗ cũ. Cloudflare không thay hộp thư đó.',
          en: 'Many people open Cloudflare because they want `support@example.com` without buying a new mailbox. That job is receiving mail. Email Routing does that job: mail sent to your domain enters Cloudflare, then it is forwarded to the Gmail, Outlook, or company inbox you already use. You still read mail in the old place. Cloudflare does not replace that mailbox.',
        },
        {
          vi: 'Gửi thư đi là việc khác, tên là Email Sending. Dùng khi app cần gửi xác nhận đơn hàng, mã đăng nhập, hoặc cảnh báo. Tài liệu giá nói gửi tới người nhận bất kỳ cần gói Workers Paid: 3.000 thư một tháng cho mỗi tài khoản, rồi 0,35 USD cho mỗi 1.000 thư. Gửi tới địa chỉ đích đã xác minh thì miễn phí và không tính vào hạn mức đó, kể cả khi bạn chỉ bật Email Routing. Nhận thư qua Routing thì không giới hạn số lượng, trên cả gói Free và Paid.',
          en: 'Sending mail out is a different product, Email Sending. Use it when an app must send an order receipt, a login code, or an alert. The pricing docs say sending to any recipient needs the Workers Paid plan: 3,000 messages a month per account, then 0.35 USD per 1,000. Sends to a verified destination address are free and do not count toward that quota, even if you only turned on Email Routing. Inbound mail through Routing is unlimited on both the Free and Paid plans.',
        },
        {
          vi: 'Muốn dùng Email Routing, tên miền phải dùng DNS của Cloudflare. Lúc gắn tên miền, Cloudflare thêm bản ghi MX để thư đi vào, bản ghi TXT cho SPF, và bản ghi TXT cho DKIM. Trang Route emails ghi chú: thay đổi DNS có thể mất tới 24 giờ mới lan ra toàn cầu, và thường xong trong 5–15 phút nếu tên miền đang dùng DNS Cloudflare. Đừng tắt proxy DNS của website chỉ vì bạn đang sửa email. Website và thư dùng các bản ghi khác nhau.',
          en: 'Email Routing needs Cloudflare DNS for the domain. When you onboard the domain, Cloudflare adds MX records so mail comes in, a TXT record for SPF, and a TXT record for DKIM. The Route emails page notes that DNS changes can take up to 24 hours to propagate globally, and usually finish within 5–15 minutes when the domain uses Cloudflare DNS. Do not turn off the website proxy just because you are editing email. The website and the mailbox use different records.',
        },
      ],
    },
    {
      heading: {
        vi: 'Xác minh hộp thư nhận, rồi mới viết luật chuyển tiếp',
        en: 'Verify the inbox that receives mail, then write the forward rule',
      },
      paragraphs: [
        {
          vi: 'Địa chỉ đích là hộp thư thật sẽ nhận thư chuyển tiếp, ví dụ Gmail của bạn. Bạn phải thêm và bấm liên kết xác minh trong thư Cloudflare gửi tới hộp thư đó. Chưa xác minh thì luật trỏ tới địa chỉ đó bị tắt, để thư không bay tới người lạ. Địa chỉ đích nằm ở cấp tài khoản, dùng lại được cho mọi tên miền trong tài khoản. Tài liệu giới hạn 200 địa chỉ đích mỗi tài khoản và 200 luật mỗi tên miền.',
          en: 'A destination address is the real inbox that will receive the forwarded mail, for example your Gmail. You must add it and click the verify link in the message Cloudflare sends to that inbox. Until it is verified, a rule that points at it stays off, so mail cannot fly to a stranger. Destination addresses live on the account and can be reused for every domain in the account. The docs cap them at 200 destination addresses per account and 200 rules per domain.',
        },
        {
          vi: 'Mỗi luật gắn một mẫu địa chỉ với một hành động. Ba hành động trong dashboard là gửi tới email, gửi tới Worker, hoặc bỏ thư. Một luật chỉ trỏ tới một địa chỉ hoặc một Worker. Muốn một địa chỉ `support@` tới nhiều người, hãy dùng Worker và gọi chuyển tiếp một lần cho mỗi địa chỉ đã xác minh. Nếu hai luật cùng một mẫu địa chỉ, chỉ luật đứng trước trong danh sách được chạy. Dashboard hiện tại nằm ở Compute, rồi Email Service, rồi Email Routing.',
          en: 'Each rule pairs an address pattern with one action. The three dashboard actions are send to an email, send to a Worker, or drop the message. One rule points at one address or one Worker. If `support@` should reach several people, use a Worker and call forward once for each verified address. If two rules share the same address pattern, only the rule listed first runs. The current dashboard path is Compute, then Email Service, then Email Routing.',
        },
        {
          vi: 'Luật catch-all nhận mọi địa chỉ chưa có luật riêng, nếu bạn bật nó. Nếu bật subaddressing, thư tới `support+donhang@` đi theo luật của `support@`. Thử bằng cách gửi từ một hộp thư khác, không gửi từ chính hộp thư đích, vì một số nhà cung cấp bỏ thư trông như tự gửi cho mình. Không thấy thư thì xem mục spam, rồi xem nhật ký hoạt động. Các trạng thái ở đó gồm đã chuyển tiếp, Worker đã xử lý, đã bỏ, bị từ chối, giao thất bại, và lỗi.',
          en: 'A catch-all rule receives every address that has no rule of its own, if you enable it. If subaddressing is on, mail to `support+order@` follows the rule for `support@`. Test by sending from a different mailbox, not from the destination inbox itself, because some providers drop mail that looks like it was sent to itself. If the message is missing, check spam, then the activity log. Statuses there include forwarded, handled by a Worker, dropped, rejected, delivery failed, and error.',
        },
      ],
    },
    {
      heading: {
        vi: 'Email Workers: đọc người gửi, người nhận, rồi quyết định',
        en: 'Email Workers: read the sender and recipient, then decide',
      },
      paragraphs: [
        {
          vi: 'Khi luật chọn gửi tới Worker, Cloudflare gọi hàm `email(message, env, ctx)`. Trong `message` bạn có `from`, `to`, header, và bản thư thô `raw`. Ba việc thường làm là `forward` tới địa chỉ đã xác minh, `reply` để trả lời người gửi, hoặc `setReject` để từ chối với lỗi SMTP. `forward` chỉ thêm được header bắt đầu bằng `X-`. Header khác bị bỏ.',
          en: 'When the rule says send to a Worker, Cloudflare calls `email(message, env, ctx)`. On `message` you get `from`, `to`, the headers, and the raw message in `raw`. The three usual actions are `forward` to a verified address, `reply` to answer the sender, or `setReject` to refuse the message with an SMTP error. `forward` can add only headers that start with `X-`. Other headers are removed.',
        },
        {
          vi: 'Trước khi Worker chạy, Cloudflare đã kiểm tra thư. Từ tháng 7 năm 2025, thư phải qua SPF hoặc có chữ ký DKIM đúng. Trượt cả hai thì bị từ chối, không chuyển tiếp. Thư còn bị từ chối nếu trượt chính sách DMARC của miền người gửi, hoặc IP nằm trong danh sách chặn. Worker nên đọc header `Authentication-Results` đầu tiên có máy chủ `mx.cloudflare.net`. Header cùng tên do người gửi tự gắn thì đừng tin. Thư chuyển tiếp được đóng dấu ARC và viết lại người gửi phong bì theo SRS, để hộp thư đích vẫn thấy kết quả xác thực cũ.',
          en: 'Cloudflare checks the message before the Worker runs. Since July 2025, mail must pass SPF or carry a valid DKIM signature. If both fail, it is rejected and not forwarded. Mail is also rejected when it fails the sender domain DMARC policy, or when the IP is on a block list. The Worker should read the first `Authentication-Results` header whose server is `mx.cloudflare.net`. A header with the same name added by the sender is not one to trust. Forwarded mail gets an ARC seal, and the envelope sender is rewritten with SRS, so the destination inbox can still see the original authentication result.',
        },
        {
          vi: 'Trả lời từ Worker có vài ràng buộc trong tài liệu: thư đến phải có DMARC hợp lệ, mỗi sự kiện chỉ `reply` một lần, người nhận của thư trả lời phải là người gửi ban đầu, và miền người gửi đi phải trùng miền vừa nhận thư. Nếu chuỗi `References` dài quá 100 mục, `reply` ném lỗi, để tránh vòng lặp. Thư lớn hơn 25 MiB bị từ chối từ lúc nhận SMTP. Trên gói Workers Free, handler email dùng chung hạn mức CPU và bộ nhớ. Hết CPU thì nhật ký Worker báo `EXCEEDED_CPU`. Lúc đó nên đơn giản hóa code hoặc lên gói Paid. Đừng nhìn nhầm số liệu: thư gửi bằng binding `send_email` có thể hiện là dropped trong phần Routing dù đã gửi được. Muốn biết thư đi có tới không, xem số liệu Email Sending.',
          en: 'A reply from a Worker has a few limits in the docs: the incoming mail needs valid DMARC, you may call `reply` only once per event, the reply recipient must be the original sender, and the outgoing sender domain must be the domain that just received the mail. If the `References` list is longer than 100 entries, `reply` throws, which stops loops. Messages larger than 25 MiB are rejected at SMTP receipt. On the Workers Free plan, an email handler shares the CPU and memory limits. When CPU runs out, Workers logs show `EXCEEDED_CPU`. Simplify the code or move to Paid. Do not misread the counters: mail sent with the `send_email` binding can show as dropped in the Routing summary even when it was delivered. To see whether outbound mail arrived, use Email Sending metrics.',
        },
      ],
    },
    {
      heading: {
        vi: 'Buổi đầu: một địa chỉ, một hộp thư, một luật',
        en: 'First session: one address, one inbox, one rule',
      },
      paragraphs: [
        {
          vi: 'Một: chọn một địa chỉ ít rủi ro, ví dụ `hello@`, không phải địa chỉ pháp lý hay hóa đơn. Hai: thêm địa chỉ đích và bấm xác minh trước khi lưu luật. Ba: tạo một luật gửi tới email, gửi thử từ hộp thư khác, kiểm tra spam. Bốn: chỉ khi bước đó ổn mới thêm Worker. Worker đầu tiên chỉ ghi log `from`, `to` và tiêu đề, rồi `forward` về cùng địa chỉ đã xác minh. Năm: chạy thử local bằng `wrangler dev`. Wrangler mở đường dẫn cục bộ để bạn POST một thư mẫu vào handler `email`, khỏi gửi thư thật mỗi lần sửa.',
          en: 'One: pick a low-stakes address, such as `hello@`, not a legal or billing address. Two: add the destination address and click verify before you save a rule. Three: create one send-to-email rule, send a test from another inbox, and check spam. Four: add a Worker only after that works. The first Worker should log `from`, `to`, and the subject, then `forward` to the same verified address. Five: try it locally with `wrangler dev`. Wrangler exposes a local path so you can POST a sample message into the `email` handler, instead of sending real mail on every edit.',
        },
        {
          vi: 'Đừng dùng Routing để gửi bản tin hàng loạt. Đó là Email Sending, và danh tiếng miền gửi thư là chuyện riêng. Đừng commit mã bí mật vào git. Đừng tạo hai luật cùng một địa chỉ rồi hy vọng cả hai cùng chạy. Nếu đổi tên Worker, luật cũ mất liên kết, phải sửa luật để trỏ lại. Tắt luật khi muốn dừng tạm. Xóa luật thì địa chỉ đó hết được xử lý.',
          en: 'Do not use Routing to send a bulk newsletter. That is Email Sending, and the sending domain reputation is a separate topic. Do not commit secrets to git. Do not create two rules for the same address and hope both run. If you rename a Worker, the old rule loses its link and you must edit the rule to point at the new name. Disable a rule when you want a pause. Deleting a rule means that address is no longer handled.',
        },
        {
          vi: 'Câu tự kiểm tra: nếu tắt Worker, thư `support@` còn tới hộp thư của bạn không? Nếu không, bạn đang phụ thuộc vào code cho một việc chuyển tiếp đơn giản. Đọc trang Workers trên hub, bài Wrangler, và tài liệu Email Service khi bạn cần `reply` hoặc phân loại thư. Nhật ký hoạt động cho biết thư đã bị từ chối vì xác thực hay chỉ chưa tới hộp thư đích.',
          en: 'Self-check: if you turn the Worker off, does `support@` still reach your inbox? If not, you are depending on code for a simple forward. Read the Workers page on this hub, the Wrangler post, and the Email Service docs when you need `reply` or sorting. The activity log tells you whether a message was rejected for authentication or simply never reached the destination inbox.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Email Routing có phải hộp thư riêng không?',
        en: 'Is Email Routing its own mailbox?',
      },
      answer: {
        vi: 'Không. Routing nhận thư cho tên miền rồi chuyển tiếp tới hộp thư bạn đã có, hoặc đưa cho Worker. Bạn vẫn đọc thư ở Gmail hay hộp thư công ty.',
        en: 'No. Routing receives mail for your domain and forwards it to an inbox you already have, or hands it to a Worker. You still read mail in Gmail or the company inbox.',
      },
    },
    {
      question: {
        vi: 'Khác Email Sending chỗ nào?',
        en: 'How is this different from Email Sending?',
      },
      answer: {
        vi: 'Routing xử lý thư đi vào. Email Sending gửi thư đi ra, như biên nhận hoặc mã đăng nhập. Gửi cho người nhận bất kỳ cần Workers Paid. Nhận thư qua Routing thì không tính theo số lượng đó.',
        en: 'Routing handles mail coming in. Email Sending sends mail out, such as a receipt or a login code. Sending to any recipient needs Workers Paid. Inbound Routing is not metered that way.',
      },
    },
    {
      question: {
        vi: 'Một địa chỉ chuyển tiếp cho nhiều người được không?',
        en: 'Can one address forward to several people?',
      },
      answer: {
        vi: 'Một luật thường chỉ có một đích. Muốn nhiều người nhận, dùng Worker và gọi `forward` một lần cho mỗi địa chỉ đã xác minh. Mọi địa chỉ phải được xác minh trước.',
        en: 'One rule normally has one destination. To reach several people, use a Worker and call `forward` once per verified address. Every address must be verified first.',
      },
    },
    {
      question: {
        vi: 'Gói Workers Free có xử lý được thư không?',
        en: 'Can the Workers Free plan process mail?',
      },
      answer: {
        vi: 'Có. Routing dùng được trên Free và Paid. Handler phức tạp có thể hết CPU trên Free và lỗi `EXCEEDED_CPU`. Khi đó hãy rút gọn code hoặc nâng gói.',
        en: 'Yes. Routing works on Free and Paid. A heavy handler can run out of CPU on Free and fail with `EXCEEDED_CPU`. Simplify the code or upgrade the plan when that happens.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Email Routing',
      href: 'https://blog.cloudflare.com/tag/email-routing/',
    },
    {
      title: 'Cloudflare Docs — Email Service',
      href: 'https://developers.cloudflare.com/email-service/',
    },
    {
      title: 'Cloudflare Docs — Route emails',
      href: 'https://developers.cloudflare.com/email-service/get-started/route-emails/',
    },
    {
      title: 'Cloudflare Docs — Email handler',
      href: 'https://developers.cloudflare.com/email-service/api/route-emails/email-handler/',
    },
    {
      title: 'Cloudflare Docs — Email Service limits',
      href: 'https://developers.cloudflare.com/email-service/platform/limits/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ['workers'],
  relatedPostSlugs: [
    'cloudflare-workers-la-gi-cho-nguoi-moi',
    'wrangler-deploy-tu-may-tinh-len-edge',
    'queues-hang-doi-message-tren-workers',
  ],
  hubLinks: [
    { href: '/products/workers/', label: { vi: 'Workers (trang sản phẩm)', en: 'Workers (product page)' } },
    { href: '/tracks/developer-platform/', label: { vi: 'Lộ trình Developer Platform', en: 'Developer Platform track' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
    { href: '/blog/', label: { vi: 'Blog hub', en: 'Blog hub' } },
  ],
  diagramSlugs: ['serverless-global-apis'],
};
