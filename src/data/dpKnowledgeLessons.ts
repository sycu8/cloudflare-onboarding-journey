import type { LocalizedString } from '../i18n/types';
import type { LessonKind } from './lessonKind';

type Guide = {
  how: LocalizedString;
  architecture: LocalizedString;
  whenToUse: LocalizedString;
  whenNot: LocalizedString;
  planNotes: LocalizedString;
  terms: { term: string | LocalizedString; detail: LocalizedString }[];
};

type KnowledgeLesson = {
  id?: string;
  kind: LessonKind;
  duration: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  guide: Guide;
  prerequisites?: string[];
};

const CHECKED = '2026-11-11';

function t(vi: string, en: string): LocalizedString {
  return { vi, en };
}

function lesson(
  id: string,
  title: LocalizedString,
  body: LocalizedString,
  guide: Guide,
  extra?: Partial<KnowledgeLesson>,
): KnowledgeLesson {
  return {
    ...(id ? { id } : {}),
    kind: 'knowledge',
    duration: t('~12 phút', '~12 min'),
    title,
    body,
    guide,
    ...extra,
  };
}

const source = (url: string) => url;

export const dpArchitectureLesson: KnowledgeLesson = lesson(
  '',
  t('Kiến trúc Developer Platform', 'Developer Platform architecture'),
  t(
    'App mới chạy trên Worker. Site Git có sẵn thì dùng Pages. Dữ liệu đi qua binding (KV, D1, R2). AI chỉ làm sau khi secret và storage đã ổn.',
    'A new app runs on a Worker. An existing Git site uses Pages. Data goes through a binding (KV, D1, or R2). Add AI only after secrets and storage are in place.',
  ),
  {
    how: t(
      'Worker là một chương trình nhỏ chạy trên mạng Cloudflare. Bạn không thuê máy chủ. Request vào Worker, Worker gọi binding nếu cần, rồi trả lời. Pages giữ file tĩnh từ Git và có thể gọi Function cùng runtime đó.',
      'A Worker is a small program that runs on Cloudflare’s network. You do not rent a server. A request hits the Worker, the Worker calls a binding if it needs data, then it answers. Pages keeps static files from Git and can call a Function on the same runtime.',
    ),
    architecture: t(
      'Thứ tự học: (1) Worker với C3 và Wrangler, (2) Pages chỉ khi site đã nằm trên Git, (3) chọn KV, D1 hoặc R2, (4) log và Turnstile, (5) Workers AI. Durable Objects, Queues, Workflows và Hyperdrive là nhánh sau, mỗi cái một việc.',
      'Learn in this order: (1) a Worker with C3 and Wrangler, (2) Pages only when the site already lives in Git, (3) pick KV, D1, or R2, (4) logs and Turnstile, (5) Workers AI. Durable Objects, Queues, Workflows, and Hyperdrive come later, one job each.',
    ),
    whenToUse: t(
      'Dùng lộ trình này khi bạn muốn ship API, tool nội bộ hoặc MVP mà không quản máy chủ.',
      'Use this path when you want to ship an API, an internal tool, or an MVP without running a server.',
    ),
    whenNot: t(
      'Đừng bắt đầu API mới bằng Pages Functions. Đừng gọi model trước khi secret nằm trên Worker, không nằm trong code gửi xuống trình duyệt.',
      'Do not start a new API with Pages Functions. Do not call a model before the secret lives on the Worker, not in code sent to the browser.',
    ),
    planNotes: t(
      `Workers Free đủ để học Hello World. Số liệu kiểm tra ${CHECKED}: 100.000 request/ngày và 10 ms CPU trên Free. Gói Paid có trần CPU cao hơn; mức phí tối thiểu ghi trên trang pricing, bài này không báo giá. Nguồn: ${source('https://developers.cloudflare.com/workers/platform/limits/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
      `Workers Free is enough to learn Hello World. Numbers checked ${CHECKED}: 100,000 requests per day and 10 ms of CPU on Free. Paid has a higher CPU ceiling; the monthly minimum is on the pricing page, and this lesson is not a quote. Sources: ${source('https://developers.cloudflare.com/workers/platform/limits/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
    ),
    terms: [
      {
        term: 'Worker',
        detail: t('Chương trình chạy mỗi khi có request, không cần máy chủ riêng.', 'A program that runs when a request arrives, without a server of your own.'),
      },
      {
        term: 'Binding',
        detail: t('Dây nối từ Worker tới KV, D1, R2 hoặc AI. Tên binding nằm trong wrangler.jsonc.', 'The link from a Worker to KV, D1, R2, or AI. The binding name lives in wrangler.jsonc.'),
      },
    ],
  },
  { duration: t('~15 phút', '~15 min') },
);

export const dpWorkerLesson: KnowledgeLesson = lesson(
  'dp-k-worker',
  t('Worker, C3 và Wrangler', 'Workers, C3, and Wrangler'),
  t(
    'C3 tạo project. Wrangler chạy local, đăng nhập và deploy. URL workers.dev là chỗ kiểm tra. Secret không ghi vào file git.',
    'C3 creates the project. Wrangler runs it locally, logs you in, and deploys. The workers.dev URL is the checkpoint. Secrets do not go in git.',
  ),
  {
    how: t(
      'Lệnh `npm create cloudflare` hỏi vài câu rồi tạo `wrangler.jsonc` và `src/`. `wrangler dev` mở máy local. `wrangler deploy` đưa code lên mạng Cloudflare. `wrangler secret put` giữ mật khẩu trên account, không trong file.',
      '`npm create cloudflare` asks a few questions, then creates `wrangler.jsonc` and `src/`. `wrangler dev` opens a local server. `wrangler deploy` puts the code on Cloudflare’s network. `wrangler secret put` keeps a password on the account, not in a file.',
    ),
    architecture: t(
      'Trình duyệt hoặc app gọi URL workers.dev. Cloudflare chạy Worker gần người dùng. Worker chỉ thấy biến và secret mà bạn gắn trong config. `PUBLIC_*` có thể lọt ra client. Secret thì không.',
      'A browser or app calls the workers.dev URL. Cloudflare runs the Worker near the user. The Worker only sees the variables and secrets you attach in config. A `PUBLIC_*` value can leak to the client. A secret does not.',
    ),
    whenToUse: t(
      'Dùng Worker cho API, webhook, form handler, hoặc bất kỳ logic nào không gắn với một site Git có sẵn.',
      'Use a Worker for an API, a webhook, a form handler, or any logic that is not tied to an existing Git site.',
    ),
    whenNot: t(
      'Đừng dùng Worker chỉ để host file tĩnh của một framework đã có trên Git. Việc đó là Pages. Đừng nhét API key vào biến `PUBLIC_*`.',
      'Do not use a Worker only to host the static files of a framework that already lives in Git. That job is Pages. Do not put an API key in a `PUBLIC_*` variable.',
    ),
    planNotes: t(
      `Trang cài Wrangler (${CHECKED}) nói CLI chạy trên bản Node Current, Active hoặc Maintenance. Một learning path cũ vẫn ghi một số phiên bản thấp hơn. Đừng chép số phiên bản cũ vào checklist. Free: 100.000 request/ngày, 10 ms CPU, 50 subrequest mỗi request. Nguồn: ${source('https://developers.cloudflare.com/workers/wrangler/install-and-update/')} ${source('https://developers.cloudflare.com/workers/platform/limits/')}`,
      `The Wrangler install page (${CHECKED}) says the CLI runs on Current, Active, or Maintenance Node.js releases. An older learning path still names a lower release. Do not copy an old version number into the checklist. Free: 100,000 requests per day, 10 ms of CPU, 50 subrequests per request. Sources: ${source('https://developers.cloudflare.com/workers/wrangler/install-and-update/')} ${source('https://developers.cloudflare.com/workers/platform/limits/')}`,
    ),
    terms: [
      {
        term: 'C3',
        detail: t('Công cụ `npm create cloudflare`. Nó dựng project Worker mới.', 'The `npm create cloudflare` tool. It scaffolds a new Worker project.'),
      },
      {
        term: 'wrangler.jsonc',
        detail: t('File cấu hình: tên Worker, binding, và biến không bí mật.', 'The config file: the Worker name, bindings, and non-secret variables.'),
      },
    ],
  },
  { prerequisites: ['dp-0-l1'] },
);

export const dpPagesLesson: KnowledgeLesson = lesson(
  'dp-k-pages',
  t('Pages và Functions', 'Pages and Functions'),
  t(
    'Pages lấy site từ Git, build, rồi giữ file trong output directory. Function là Worker gắn với site đó. Đây không phải khuôn cho API mới.',
    'Pages takes a site from Git, builds it, and keeps the files in the output directory. A Function is a Worker attached to that site. This is not the mold for a new API.',
  ),
  {
    how: t(
      'Bạn nối repo Git. Pages chạy lệnh build (ví dụ `npm run build`) và lấy thư mục output (`dist` với Astro, `build` với một số framework khác). Sai thư mục thì site trắng. Mỗi pull request có URL preview.',
      'You connect a Git repo. Pages runs the build command (for example `npm run build`) and takes the output folder (`dist` for Astro, `build` for some other frameworks). The wrong folder means a blank site. Each pull request gets a preview URL.',
    ),
    architecture: t(
      'File tĩnh đi thẳng từ Pages. Request khớp Function thì tính như một request Worker và dùng chung hạn mức Workers. Hub này là site nội dung trên Pages. API mới thì tách Worker.',
      'Static files come straight from Pages. A request that matches a Function counts as a Worker request and shares the Workers quota. This hub is a content site on Pages. A new API should be its own Worker.',
    ),
    whenToUse: t(
      'Dùng Pages khi site framework đã nằm trên Git và bạn muốn preview theo pull request.',
      'Use Pages when a framework site already lives in Git and you want a preview per pull request.',
    ),
    whenNot: t(
      'Đừng chọn Pages làm bước đầu cho service không có giao diện tĩnh. Đừng đoán tên thư mục output.',
      'Do not pick Pages as the first step for a service with no static UI. Do not guess the output folder name.',
    ),
    planNotes: t(
      `Request Function tính vào hạn mức Workers. Docs lấy ví dụ: 50.000 request Function và 50.000 request Worker dùng hết 100.000 request/ngày của Free. File tĩnh không tính. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/pages/functions/pricing/')}`,
      `Function requests count toward the Workers quota. The docs use this example: 50,000 Function requests plus 50,000 Worker requests use up the Free plan’s 100,000 requests per day. Static files do not count. Checked ${CHECKED}. Source: ${source('https://developers.cloudflare.com/pages/functions/pricing/')}`,
    ),
    terms: [
      {
        term: 'Output directory',
        detail: t('Thư mục chứa site sau khi build. Pages chỉ publish thư mục này.', 'The folder that holds the site after the build. Pages publishes only this folder.'),
      },
      {
        term: 'Function',
        detail: t('Code chạy trên Pages, cùng runtime với Worker.', 'Code that runs on Pages, on the same runtime as a Worker.'),
      },
    ],
  },
  { prerequisites: ['dp-k-worker'] },
);

export const dpStorageLesson: KnowledgeLesson = lesson(
  'dp-k-storage',
  t('KV, D1 và R2', 'KV, D1, and R2'),
  t(
    'Ba chỗ giữ dữ liệu, ba việc khác nhau. KV giữ cặp khóa và giá trị. D1 là SQL nhỏ. R2 giữ file. Chọn sai thì app chạy được lúc demo và hỏng lúc thật.',
    'Three places to keep data, three different jobs. KV keeps a key and a value. D1 is a small SQL database. R2 keeps files. The wrong pick works in a demo and breaks for real.',
  ),
  {
    how: t(
      'KV đọc nhanh theo một key: cờ tính năng, session ngắn, bộ đếm. Nó không hợp giao dịch cần đúng từng dòng. D1 dùng câu SQL và migration. R2 giống kho file: PDF, ảnh, upload. Cả ba gắn vào Worker bằng binding.',
      'KV reads fast by one key: a feature flag, a short session, a counter. It is a poor fit for a transaction that must get every row right. D1 uses SQL and migrations. R2 is a file store: PDFs, images, uploads. All three attach to a Worker with a binding.',
    ),
    architecture: t(
      'Worker không giữ dữ liệu giữa các lần chạy. Binding là cửa ra ngoài. Một app thường dùng một kho chính: SQL thì D1, file thì R2, cờ thì KV. Đừng nhét bảng quan hệ vào KV.',
      'A Worker does not keep data between runs. A binding is the door out. An app usually has one main store: SQL in D1, files in R2, flags in KV. Do not put a relational table in KV.',
    ),
    whenToUse: t(
      'Đọc bài này trước khi tạo namespace, database hoặc bucket. Lab hub ở sau chỉ thao tác đúng loại bạn đã chọn.',
      'Read this before you create a namespace, a database, or a bucket. The hub lab after this page only operates the kind you already chose.',
    ),
    whenNot: t(
      'Đừng dùng KV cho số dư tiền hoặc đơn hàng. Đừng dùng R2 cho một dòng cấu hình nhỏ. Đừng dùng D1 làm kho file.',
      'Do not use KV for a balance or an order. Do not use R2 for one small config line. Do not use D1 as a file store.',
    ),
    planNotes: t(
      `Số trên Free, kiểm tra ${CHECKED}. KV: 100.000 lần đọc/ngày, 1.000 lần ghi/ngày, 1 GB. D1: 5 triệu dòng đọc/ngày, 100.000 dòng ghi/ngày, 5 GB, 10 database. R2: 10 GB-tháng, 1 triệu thao tác Class A và 10 triệu Class B mỗi tháng. Vượt hạn thì lỗi, không phải giá trong bài này. Nguồn: ${source('https://developers.cloudflare.com/kv/platform/pricing/')} ${source('https://developers.cloudflare.com/d1/platform/pricing/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
      `Free-plan numbers, checked ${CHECKED}. KV: 100,000 reads per day, 1,000 writes per day, 1 GB. D1: 5 million rows read per day, 100,000 rows written per day, 5 GB, 10 databases. R2: 10 GB-months, 1 million Class A operations and 10 million Class B operations per month. Past the cap, calls fail. This lesson is not a price. Sources: ${source('https://developers.cloudflare.com/kv/platform/pricing/')} ${source('https://developers.cloudflare.com/d1/platform/pricing/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
    ),
    terms: [
      {
        term: 'KV',
        detail: t('Kho khóa-giá trị. Đọc theo một key, không phải bảng SQL.', 'A key-value store. You read by one key, not with a SQL table.'),
      },
      {
        term: 'Migration',
        detail: t('File SQL đổi cấu trúc D1. Chạy local rồi mới chạy remote.', 'A SQL file that changes the D1 shape. Run it locally, then on the remote database.'),
      },
    ],
  },
  { prerequisites: ['dp-k-pages'] },
);

export const dpOperateLesson: KnowledgeLesson = lesson(
  'dp-k-operate',
  t('Log và Turnstile', 'Logs and Turnstile'),
  t(
    'Worker lỗi thì không có máy chủ để SSH vào. Bạn xem log. Form public cần Turnstile, và token phải được kiểm tra trên server trước khi ghi D1.',
    'When a Worker fails, there is no server to SSH into. You read the logs. A public form needs Turnstile, and the token must be checked on the server before you write to D1.',
  ),
  {
    how: t(
      '`wrangler tail` hiện log lúc bạn gọi API. Dashboard cũng có log. Turnstile hiện thử thách trên form. Server gửi token đó tới Cloudflare. Chỉ khi Cloudflare nói token hợp lệ thì mới INSERT.',
      '`wrangler tail` prints logs while you call the API. The dashboard has logs too. Turnstile shows a check on the form. The server sends that token to Cloudflare. Only when Cloudflare says the token is valid do you INSERT.',
    ),
    architecture: t(
      'Widget trên trang chỉ là nửa đầu. Ai cũng có thể POST thẳng vào API và bỏ qua widget. Nhánh kiểm tra nằm trong Worker hoặc Function, cạnh câu lệnh ghi database.',
      'The widget on the page is only the first half. Anyone can POST straight to the API and skip the widget. The check belongs in the Worker or Function, next to the database write.',
    ),
    whenToUse: t(
      'Bật log trước khi đoán lỗi. Thêm Turnstile khi form ghi dữ liệu thật: đăng ký, liên hệ, OTP.',
      'Turn logs on before you guess at a bug. Add Turnstile when a form writes real data: signup, contact, OTP.',
    ),
    whenNot: t(
      'Đừng coi widget là đủ. Đừng tắt log trên production rồi mới hỏi vì sao API im.',
      'Do not treat the widget as enough. Do not turn logs off in production and then ask why the API is silent.',
    ),
    planNotes: t(
      `Workers Logs có trên Free và Paid. Free (${CHECKED}): 200.000 sự kiện log/ngày, giữ 3 ngày. Bài này không gán gói cho widget Turnstile — xem docs Turnstile và dashboard. Nguồn: ${source('https://developers.cloudflare.com/workers/observability/logs/workers-logs/')}`,
      `Workers Logs exist on Free and Paid. Free (${CHECKED}): 200,000 log events per day, kept for 3 days. This lesson does not assign a plan to the Turnstile widget. Check the Turnstile docs and the dashboard. Source: ${source('https://developers.cloudflare.com/workers/observability/logs/workers-logs/')}`,
    ),
    terms: [
      {
        term: 'wrangler tail',
        detail: t('Lệnh xem log Worker đang chạy, gần như xem trực tiếp.', 'The command that shows logs from a running Worker, close to live.'),
      },
      {
        term: 'Siteverify',
        detail: t('Bước server hỏi Cloudflare xem token Turnstile có thật không.', 'The server step that asks Cloudflare whether a Turnstile token is real.'),
      },
    ],
  },
  { prerequisites: ['dp-k-storage'] },
);

export const dpAiLesson: KnowledgeLesson = lesson(
  'dp-k-ai',
  t('Workers AI, Gateway và agent', 'Workers AI, Gateway, and agents'),
  t(
    'Bài này nói cách gọi model từ Worker. Chính sách dùng AI trong công ty nằm ở track AI Security. Một task rõ trước, chat và nhiều provider sau.',
    'This page is about calling a model from a Worker. Company policy for AI use lives on the AI Security track. One clear task first. Chat and extra providers later.',
  ),
  {
    how: t(
      'Binding AI để Worker gọi model phía server. AI Gateway đứng giữa app và model: thấy request, cache khi hợp, đổi provider mà không đưa key xuống trình duyệt. RAG lấy đoạn tài liệu có nguồn rồi mới hỏi model. Agent là Worker có tool. Mỗi tool cần schema và quyền hẹp.',
      'An AI binding lets the Worker call a model on the server. AI Gateway sits between the app and the model: it can see the request, cache when that is safe, and change provider without sending the key to the browser. RAG fetches a sourced passage, then asks the model. An agent is a Worker with tools. Each tool needs a schema and a narrow permission.',
    ),
    architecture: t(
      'Secret và danh tính người dùng đứng trước endpoint AI. Vector search không phải quyền đọc dữ liệu. Kết quả tìm được vẫn phải qua kiểm tra “user này được xem tài liệu này không”.',
      'The secret and the user’s identity sit in front of the AI endpoint. Vector search is not permission to read data. A search hit still has to pass “is this user allowed to see this document?”.',
    ),
    whenToUse: t(
      'Làm lab AI sau khi Worker và storage đã chạy. Official lab Workers (phần tóm tắt và Gateway), Agents, MCP và Sandbox nằm sau các lab hub của phần này.',
      'Do the AI lab after the Worker and storage already run. The official Workers labs (summary and Gateway), plus Agents, MCP, and Sandbox, come after this part’s hub labs.',
    ),
    whenNot: t(
      'Đừng bắt đầu bằng agent tự gọi nhiều tool. Đừng coi bài này là quy định Shadow AI. Việc đó sang track AI Security.',
      'Do not start with an agent that calls many tools. Do not treat this page as the Shadow AI policy. That belongs on the AI Security track.',
    ),
    planNotes: t(
      `Workers AI (${CHECKED}): 10.000 neuron mỗi ngày, cả Free và Paid. Muốn hơn mức đó thì cần Workers Paid. Vài model lớn chỉ có trên Paid. Bảng giá còn ghi $0.011 / 1.000 neuron — đối chiếu trang pricing, không lấy số này làm báo giá. Vectorize: một câu nói chỉ có trên Paid, một bảng lại có dòng Free. Bài này không gán gói. AI Gateway: không gán gói. Nguồn: ${source('https://developers.cloudflare.com/workers-ai/platform/pricing/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
      `Workers AI (${CHECKED}): 10,000 neurons per day, on both Free and Paid. More than that needs Workers Paid. A few large models are Paid only. The pricing page also lists $0.011 per 1,000 neurons. Check that page. This is not a quote. Vectorize: one sentence says Paid only, and a table still has a Free row. This lesson does not assign a plan. AI Gateway: no plan assigned. Sources: ${source('https://developers.cloudflare.com/workers-ai/platform/pricing/')} ${source('https://developers.cloudflare.com/workers/platform/pricing/')}`,
    ),
    terms: [
      {
        term: 'Neuron',
        detail: t('Đơn vị Workers AI dùng để tính mức gọi model mỗi ngày.', 'The unit Workers AI uses to meter model calls each day.'),
      },
      {
        term: 'RAG',
        detail: t('Lấy đoạn tài liệu liên quan, rồi mới nhờ model trả lời.', 'Fetch a relevant passage, then ask the model to answer.'),
      },
    ],
  },
  { prerequisites: ['dp-k-operate'] },
);

export const dpStatefulLesson: KnowledgeLesson = lesson(
  'dp-k-stateful',
  t('Durable Objects, Queues, Workflows, Hyperdrive', 'Durable Objects, Queues, Workflows, Hyperdrive'),
  t(
    'Bốn sản phẩm, bốn việc. Cả bốn đều có mức Free có hạn, không phải “chỉ Paid”. Chọn một cái khi Worker và storage đã ổn. Đối chiếu dashboard trước khi bật.',
    'Four products, four jobs. All four have a limited Free allowance. They are not “Paid only”. Pick one after the Worker and storage are stable. Check the dashboard before you turn one on.',
  ),
  {
    how: t(
      'Durable Object giữ trạng thái của một thứ, ví dụ một phòng chat. Trên Free chỉ có backend SQLite. Queue nhận việc nền và làm sau. Workflow là chuỗi bước dài, có chỗ ngủ chờ. Hyperdrive nối Worker tới Postgres hoặc MySQL bên ngoài. Nó không thay D1.',
      'A Durable Object keeps the state of one thing, such as one chat room. On Free, only the SQLite backend is available. A queue takes background work and does it later. A Workflow is a long chain of steps, with places to sleep. Hyperdrive connects a Worker to external Postgres or MySQL. It does not replace D1.',
    ),
    architecture: t(
      'Worker thường vô trạng thái. Những sản phẩm này thêm trạng thái, hàng đợi, hoặc đường tới database có sẵn. Gắn một binding, đừng gắn cả bốn cho lab đầu.',
      'A Worker is usually stateless. These products add state, a queue, or a path to a database you already have. Attach one binding. Do not attach all four for the first lab.',
    ),
    whenToUse: t(
      'Đọc để biết mình chưa cần mua gì. Làm lab hub khi một use case thật đã chọn đúng một sản phẩm.',
      'Read this to see what you do not need to buy yet. Do the hub lab when a real use case has picked exactly one product.',
    ),
    whenNot: t(
      'Đừng thêm Durable Object chỉ để lưu một cờ. Việc đó là KV. Đừng dùng Hyperdrive thay database SQL nhỏ. Việc đó là D1.',
      'Do not add a Durable Object just to store one flag. That job is KV. Do not use Hyperdrive instead of a small SQL database. That job is D1.',
    ),
    planNotes: t(
      `Tách từng sản phẩm, kiểm tra ${CHECKED}. Durable Objects: có trên Free, chỉ SQLite; 5 triệu dòng đọc/ngày, 100.000 dòng ghi/ngày, 5 GB. Queues: trang pricing ghi 10.000 thao tác/ngày và giữ tin 24 giờ trên Free. Một tutorial vẫn nói phải có Workers Paid mới bật Queues trong dashboard — xem dashboard. Workflows: có trên Free, 3.000 step/ngày, CPU 10 ms, request dùng chung hạn mức Workers. Hyperdrive: 100.000 query/ngày trên Free. Nguồn: ${source('https://developers.cloudflare.com/durable-objects/platform/pricing/')} ${source('https://developers.cloudflare.com/queues/platform/pricing/')} ${source('https://developers.cloudflare.com/workflows/reference/pricing/')} ${source('https://developers.cloudflare.com/hyperdrive/platform/pricing/')}`,
      `Split by product, checked ${CHECKED}. Durable Objects: on Free, SQLite only; 5 million rows read per day, 100,000 rows written per day, 5 GB. Queues: the pricing page lists 10,000 operations per day and 24-hour retention on Free. One tutorial still says you need Workers Paid to enable Queues in the dashboard. Check the dashboard. Workflows: on Free, 3,000 steps per day, 10 ms of CPU, requests shared with the Workers quota. Hyperdrive: 100,000 queries per day on Free. Sources: ${source('https://developers.cloudflare.com/durable-objects/platform/pricing/')} ${source('https://developers.cloudflare.com/queues/platform/pricing/')} ${source('https://developers.cloudflare.com/workflows/reference/pricing/')} ${source('https://developers.cloudflare.com/hyperdrive/platform/pricing/')}`,
    ),
    terms: [
      {
        term: 'Durable Object',
        detail: t('Một ô nhớ cho một thực thể, ví dụ một phòng hoặc một phiên.', 'A memory cell for one entity, such as one room or one session.'),
      },
      {
        term: 'Hyperdrive',
        detail: t('Cầu từ Worker tới Postgres hoặc MySQL sẵn có. Không phải D1.', 'A bridge from a Worker to existing Postgres or MySQL. Not D1.'),
      },
    ],
  },
  { prerequisites: ['dp-k-ai'] },
);
