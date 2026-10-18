import type { BlogPost } from '../blog';

/** Entry · Security — rewritten from Turnstile docs and blog themes */
export const postTurnstileThayCaptchaBaoVeForm: BlogPost = {
  slug: 'turnstile-thay-captcha-bao-ve-form',
  date: '2026-10-02',
  topic: 'security',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Turnstile là gì? Thay CAPTCHA khó chịu mà vẫn chặn bot trên form',
    en: 'What is Turnstile? Replacing annoying CAPTCHAs while still stopping form bots',
  },
  description: {
    vi: 'Giải thích Turnstile cho người mới: widget Managed, Non-Interactive và Invisible; vì sao phải gọi Siteverify; token một lần; kết hợp rate limiting và WAF.',
    en: 'A beginner Turnstile guide: Managed, Non-Interactive, and Invisible widgets; why Siteverify is mandatory; single-use tokens; combining it with rate limiting and WAF.',
  },
  excerpt: {
    vi: 'Turnstile kiểm tra trình duyệt trước khi form được nhận — thường không bắt khách giải câu đố hình. Nhưng widget trên trang chưa đủ: server phải xác minh token.',
    en: 'Turnstile checks the browser before a form is accepted — usually without making the visitor solve a picture puzzle. The widget on the page is not enough: the server must validate the token.',
  },
  keywords: {
    vi: 'Turnstile là gì, thay CAPTCHA, Siteverify, bảo vệ form đăng ký, Cloudflare Turnstile cho người mới',
    en: 'what is Turnstile, CAPTCHA alternative, Siteverify, protect signup forms, Cloudflare Turnstile beginner',
  },
  sections: [
    {
      heading: {
        vi: 'Form mở là cửa mà bot gõ trước khách thật',
        en: 'An open form is a door bots knock on before real visitors',
      },
      paragraphs: [
        {
          vi: 'Form đăng ký workshop, form liên hệ, form đặt lại mật khẩu đều có cùng vấn đề: ai cũng gọi được endpoint nếu biết URL. Bot gửi hàng nghìn lần, làm đầy database, đốt quota email, hoặc dò mật khẩu. CAPTCHA cổ điển chặn được một phần, nhưng bắt người thật chọn đèn giao thông thì tỷ lệ hoàn thành form giảm — đặc biệt trên điện thoại.',
          en: 'Workshop signups, contact forms, and password resets share one problem: anyone can call the endpoint if they know the URL. Bots submit thousands of times, fill the database, burn email quota, or guess passwords. Classic CAPTCHAs stop some of that, but making real people pick traffic lights lowers completion — especially on a phone.',
        },
        {
          vi: 'Turnstile là thử thách của Cloudflare chạy trong trình duyệt để phân biệt khách và automation. Nó bắt đầu bằng các bài kiểm tra không tương tác: proof-of-work, dò API của trình duyệt, tín hiệu hành vi. Chỉ khi rủi ro cao, widget mới hỏi người dùng tương tác. Tài liệu ghi rõ Turnstile không đọc nội dung form, không lưu tin nhắn của user — nó chỉ xử lý dữ liệu cần cho chức năng bảo mật này.',
          en: 'Turnstile is Cloudflare’s browser challenge for telling visitors from automation. It starts with non-interactive checks: proof-of-work, probing browser APIs, behavior signals. Only when risk is high does the widget ask the person to interact. The docs are explicit that Turnstile does not read form contents or store the user’s messages — it processes only what this security check needs.',
        },
        {
          vi: 'Widget đạt WCAG 2.2 AA, nên đây là lựa chọn dễ chịu hơn CAPTCHA hình ảnh cho site song ngữ. Trên blog.cloudflare.com, Turnstile thường đứng cạnh Bot Management và WAF: nó bảo vệ từng form, không thay lớp chặn request xấu cho cả zone. Hub này dùng Turnstile trên form đăng ký workshop; khi không có secret key ở local, form gửi token `dev-bypass` để dev vẫn thử được.',
          en: 'The widget is WCAG 2.2 AA, so it is a kinder choice than image CAPTCHAs for a bilingual site. On blog.cloudflare.com, Turnstile usually sits next to Bot Management and WAF: it protects a specific form, and does not replace zone-wide blocking of bad requests. This hub uses Turnstile on the workshop signup form; with no local secret key, the form sends a `dev-bypass` token so development can still be tested.',
        },
      ],
      diagramSlug: 'bot-management',
    },
    {
      heading: {
        vi: 'Ba kiểu widget — và vì sao Managed là mặc định hợp lý',
        en: 'Three widget types — and why Managed is the sensible default',
      },
      paragraphs: [
        {
          vi: 'Managed (nên dùng) tự quyết định có hiện checkbox hay không theo mức rủi ro của khách. Non-Interactive hiện widget nhưng khách không cần bấm. Invisible chạy nền, không hiện gì. Invisible có điều kiện: bạn phải dẫn Privacy Addendum của Turnstile trong chính sách riêng tư của site. Cả ba kiểu dùng cùng logic thử thách; khác nhau ở chỗ khách có nhìn thấy widget không.',
          en: 'Managed (the recommended default) decides whether to show a checkbox based on visitor risk. Non-Interactive shows the widget but the visitor does not have to click. Invisible runs in the background with nothing on screen. Invisible has a condition: you must reference Cloudflare’s Turnstile Privacy Addendum in your own privacy policy. All three use the same challenge logic; they differ in whether the visitor sees a widget.',
        },
        {
          vi: 'Khi tạo widget trong dashboard Turnstile bạn nhận sitekey và secret. Sitekey đặt lên HTML, ví dụ `<div class="cf-turnstile" data-sitekey="...">`. Secret chỉ được ở server — Worker secret, biến môi trường Pages, không commit vào git. Hostname của widget phải khớp domain thật; `localhost` tiện lúc dev nhưng không được nằm trong cấu hình production.',
          en: 'Creating a widget in the Turnstile dashboard gives you a sitekey and a secret. The sitekey goes in HTML, for example `<div class="cf-turnstile" data-sitekey="...">`. The secret stays on the server — a Worker secret or Pages environment variable, never committed to git. The widget hostnames must match the real domain; `localhost` is fine while developing and must not remain in the production configuration.',
        },
        {
          vi: 'Từ tháng 8 năm 2026, Turnstile Spin (đã GA) giúp tạo widget và nối Siteverify từ dashboard, Wrangler, hoặc agent trong editor. Spin không đổi mô hình bảo mật: vẫn là sitekey công khai và secret phía server. Nếu widget đã có nhưng chưa có traffic Siteverify, dashboard có thể hiện lối “Fix with Spin” — dấu hiệu phần xác minh server còn thiếu.',
          en: 'Since August 2026, Turnstile Spin (generally available) can create the widget and wire Siteverify from the dashboard, Wrangler, or an agent in your editor. Spin does not change the security model: a public sitekey and a server-side secret. If a widget exists but has no Siteverify traffic, the dashboard can show “Fix with Spin” — a sign the server check is still missing.',
        },
      ],
    },
    {
      heading: {
        vi: 'Siteverify là phần bắt buộc, không phải bước tùy chọn',
        en: 'Siteverify is mandatory, not an optional extra',
      },
      paragraphs: [
        {
          vi: 'Widget trên trình duyệt tạo một token. Token đó có thể giả, hết hạn, hoặc đã dùng. Nếu server tin body client và insert database ngay, bot bỏ qua giao diện và POST thẳng. Bạn phải gọi `https://challenges.cloudflare.com/turnstile/v0/siteverify` từ server, gửi secret và token (field `response`). Chỉ khi `success` là true mới xử lý form.',
          en: 'The browser widget produces a token. That token can be forged, expired, or already used. If the server trusts the client body and inserts into the database immediately, a bot skips the UI and POSTs directly. You must call `https://challenges.cloudflare.com/turnstile/v0/siteverify` from the server with the secret and the token (the `response` field). Process the form only when `success` is true.',
        },
        {
          vi: 'Token hết hạn sau 300 giây và chỉ validate được một lần. Form nhiều bước hoặc SPA giữ nguyên trang sau khi submit phải gọi `turnstile.reset(widgetId)` trước lần thử lại. Nên kiểm tra thêm `hostname` (và `action` nếu bạn đặt) trong kết quả Siteverify, để token sinh ở site khác không dùng lại được. Không gọi Siteverify thì analytics Turnstile hiện số validation bằng không — đó là cấu hình chưa xong, không phải “ít bot”.',
          en: 'Tokens expire after 300 seconds and can be validated only once. A multi-step form or an SPA that stays on the page after submit must call `turnstile.reset(widgetId)` before a retry. Also check `hostname` (and `action` if you set one) in the Siteverify result so a token minted on another site cannot be reused. Skip Siteverify and Turnstile Analytics shows zero validations — that is an unfinished setup, not “few bots”.',
        },
        {
          vi: 'Pre-clearance có thể thêm cookie `cf_clearance`, nhưng token Turnstile vẫn phải qua Siteverify. Đừng log secret, đừng đưa secret vào query string, và đừng để frontend tự gọi Siteverify — kẻ tấn công sẽ thấy secret trong request của trình duyệt.',
          en: 'Pre-clearance can add a `cf_clearance` cookie, but the Turnstile token still has to pass Siteverify. Do not log the secret, do not put it in a query string, and do not let the frontend call Siteverify itself — an attacker would see the secret in the browser request.',
        },
      ],
    },
    {
      heading: {
        vi: 'Turnstile đứng cùng rate limiting và WAF, không đứng một mình',
        en: 'Turnstile stands with rate limiting and WAF, not alone',
      },
      paragraphs: [
        {
          vi: 'Turnstile trả lời “request này có vẻ là người không?”. Rate limiting trả lời “IP hoặc đường dẫn này đã gọi quá nhiều lần chưa?”. WAF trả lời “payload có giống SQLi hay XSS không?”. Ba câu khác nhau. Form login nên có cả ba: Turnstile trên form, rate limit trên `/api/login`, managed ruleset trên zone. Bài bot và bài rate limiting trên hub này đi tiếp từ đây.',
          en: 'Turnstile answers “does this request look like a person?”. Rate limiting answers “has this IP or path called too often?”. WAF answers “does the payload look like SQLi or XSS?”. Three different questions. A login form should have all three: Turnstile on the form, a rate limit on `/api/login`, and a managed ruleset on the zone. The bot and rate-limiting posts on this hub continue from here.',
        },
        {
          vi: 'Checklist tuần đầu: tạo widget Managed cho đúng hostname; nhúng script sớm để token kịp lúc khách bấm gửi; lưu secret bằng `wrangler secret put`, không ghi trong `wrangler.toml`; từ chối request khi Siteverify lỗi mạng thay vì “cho qua cho tiện”; thử submit thật rồi gửi lại đúng token cũ để chắc lần hai bị từ chối.',
          en: 'First-week checklist: create a Managed widget for the right hostnames; load the script early so the token is ready when the visitor submits; store the secret with `wrangler secret put`, not in `wrangler.toml`; reject the request when Siteverify has a network error instead of failing open; submit once for real, then replay the same token and confirm the second call is rejected.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Nếu tôi xóa widget trên HTML nhưng vẫn POST JSON, server có từ chối không?” Nếu không, Turnstile mới chỉ là đồ trang trí. Đọc trang sản phẩm Turnstile, use case bảo vệ website, và docs widget khi bạn cần theme, kích thước compact, hoặc chế độ `execution: execute` cho form nhiều bước.',
          en: 'Self-check: “If I delete the widget from the HTML and still POST JSON, does the server reject it?” If not, Turnstile is decoration. Read the Turnstile product page, the protect-website use case, and the widget docs when you need a theme, the compact size, or `execution: execute` for a multi-step form.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'Chỉ nhúng widget là form đã an toàn chưa?',
        en: 'Is the form safe once the widget is embedded?',
      },
      answer: {
        vi: 'Chưa. Widget tạo token trên trình duyệt. Server phải gọi Siteverify với secret trước khi ghi dữ liệu. Không có bước đó, bot gọi thẳng API.',
        en: 'Not yet. The widget creates a token in the browser. The server must call Siteverify with the secret before writing data. Without that step, a bot calls the API directly.',
      },
    },
    {
      question: {
        vi: 'Nên chọn Invisible hay Managed?',
        en: 'Should I choose Invisible or Managed?',
      },
      answer: {
        vi: 'Managed là mặc định nên dùng: chỉ hỏi tương tác khi rủi ro cao. Invisible giấu hoàn toàn widget, nhưng bạn phải dẫn Turnstile Privacy Addendum trong chính sách riêng tư.',
        en: 'Managed is the recommended default: it asks for interaction only when risk is high. Invisible hides the widget completely, but you must reference the Turnstile Privacy Addendum in your privacy policy.',
      },
    },
    {
      question: {
        vi: 'Token dùng được bao lâu?',
        en: 'How long is a token valid?',
      },
      answer: {
        vi: 'Khoảng 300 giây, và mỗi token chỉ validate một lần. Form ở lại trên trang sau khi gửi phải reset widget trước lần thử tiếp theo.',
        en: 'About 300 seconds, and each token can be validated only once. A form that stays on the page after submit must reset the widget before the next try.',
      },
    },
  ],
  sources: [
    {
      title: 'Cloudflare Docs — Turnstile',
      href: 'https://developers.cloudflare.com/turnstile/',
    },
    {
      title: 'Cloudflare Docs — Server-side validation',
      href: 'https://developers.cloudflare.com/turnstile/get-started/server-side-validation/',
    },
    {
      title: 'The Cloudflare changelog — Turnstile Spin is generally available',
      href: 'https://developers.cloudflare.com/changelog/post/2026-08-10-turnstile-spin-ga/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['turnstile', 'waf'],
  relatedPostSlugs: [
    'bot-management-phan-biet-nguoi-va-bot',
    'rate-limiting-bao-ve-form-login',
    'waf-bao-ve-website-cho-nguoi-moi',
  ],
  hubLinks: [
    { href: '/products/turnstile/', label: { vi: 'Turnstile (trang sản phẩm)', en: 'Turnstile (product page)' } },
    { href: '/products/waf/', label: { vi: 'WAF là gì?', en: 'What is WAF?' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/protect-website/', label: { vi: 'Use case: bảo vệ website', en: 'Use case: protect a website' } },
    { href: '/blog/rate-limiting-bao-ve-form-login/', label: { vi: 'Kết hợp rate limiting', en: 'Combine with rate limiting' } },
  ],
  diagramSlugs: ['bot-management'],
};
