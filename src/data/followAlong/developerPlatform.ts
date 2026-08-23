import type { FollowAlongLesson } from './types';
import { t } from './helpers';

const CF_WORKERS_LP = 'https://developers.cloudflare.com/learning-paths/workers/';
const CF_WORKERS_GS = 'https://developers.cloudflare.com/workers/get-started/guide/';
const CF_C3 = 'https://developers.cloudflare.com/learning-paths/workers/get-started/c3-and-wrangler/';
const CF_WRANGLER = 'https://developers.cloudflare.com/workers/wrangler/configuration/';
const CF_SECRETS = 'https://developers.cloudflare.com/workers/configuration/secrets/';
const CF_PAGES = 'https://developers.cloudflare.com/pages/get-started/git-integration/';
const CF_PAGES_FN = 'https://developers.cloudflare.com/pages/functions/';
const CF_KV = 'https://developers.cloudflare.com/kv/';
const CF_D1 = 'https://developers.cloudflare.com/d1/';
const CF_R2 = 'https://developers.cloudflare.com/r2/';
const CF_OBS = 'https://developers.cloudflare.com/workers/observability/';
const CF_TURNSTILE = 'https://developers.cloudflare.com/turnstile/';
const CF_AI = 'https://developers.cloudflare.com/workers-ai/';
const CF_AIG = 'https://developers.cloudflare.com/ai-gateway/';
const CF_VEC = 'https://developers.cloudflare.com/vectorize/';
const CF_AGENTS = 'https://developers.cloudflare.com/agents/';
const CF_DO = 'https://developers.cloudflare.com/durable-objects/';
const CF_Q = 'https://developers.cloudflare.com/queues/';
const CF_WF = 'https://developers.cloudflare.com/workflows/';
const CF_HD = 'https://developers.cloudflare.com/hyperdrive/';
const CF_MIGRATE = 'https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/';

export const developerPlatformFollowAlong: FollowAlongLesson[] = [
  {
    lessonId: 'dp-0-l1',
    role: 'required',
    goal: t(
      'Hiểu User → Worker (hoặc Pages) → bindings (KV/D1/R2) → AI Gateway/model và thứ tự xây cho project mới.',
      'See User → Worker (or Pages) → bindings (KV/D1/R2) → AI Gateway/model and the build order for a new project.',
      'មើល User → Worker (ឬ Pages) → bindings (KV/D1/R2) → AI Gateway/model និងលំដាប់ build សម្រាប់ project ថ្មី។',
    ),
    who: t('Developer / full-stack', 'Developer / full-stack', 'Developer / full-stack'),
    time: t('15 phút đọc', '15 min read', '15 នាទីអាន'),
    finishWith: t(
      'Quyết định: app mới bắt đầu bằng Worker + C3; Pages dành cho Git site hiện có; AI/RAG sau khi secret và storage rõ.',
      'Decision: new apps start with a Worker + C3; Pages is for existing Git sites; AI/RAG only after secrets and storage are clear.',
      'ការសម្រេច: app ថ្មីចាប់ផ្តើមតាម Worker + C3; Pages សម្រាប់ Git site ដែលមានស្រាប់; AI/RAG តែប៉ុណ្ណោះបន្ទាប់ពី secret និង storage ច្បាស់។',
    ),
    beforeYouBegin: t('Node.js 18+ và tài khoản Cloudflare. Không bắt buộc có domain.', 'Node.js 18+ and a Cloudflare account. A domain is optional.', 'Node.js 18+ និងគណនី Cloudflare។ Domain គឺ optional។'),
    intro: t(
      'Developer Platform 2026: compute mặc định là Workers. C3 (`npm create cloudflare`) + Wrangler là on-ramp.\n\nUser → Worker hoặc Pages → KV / D1 / R2 / Durable Objects → (tuỳ chọn) AI Gateway → model.\n\nHub này (onboarding.orangecloud.vn) là ví dụ Pages + Functions + D1. Project mới: Worker-first. Dừng sau Worker đầu tiên vẫn có giá trị.',
      'Developer Platform 2026: default compute is Workers. C3 (`npm create cloudflare`) + Wrangler is the on-ramp.\n\nUser → Worker or Pages → KV / D1 / R2 / Durable Objects → (optional) AI Gateway → model.\n\nThis hub (onboarding.orangecloud.vn) is a Pages + Functions + D1 example. New projects: Worker-first. Stopping after the first Worker still leaves something useful.',
      'Developer Platform 2026: compute លំនាំដើមគឺ Workers។ C3 (`npm create cloudflare`) + Wrangler គឺ on-ramp។\n\nUser → Worker ឬ Pages → KV / D1 / R2 / Durable Objects → (optional) AI Gateway → model។\n\nHub នេះ (onboarding.orangecloud.vn) គឺឧទាហរណ៍ Pages + Functions + D1។ Project ថ្មី: Worker-first។ ការឈប់បន្ទាប់ពី Worker ទីមួយនៅតែទុកអ្វីដែលមានប្រយោជន៍។',
    ),
    steps: [
      {
        action: t('Ghi quyết định platform.', 'Write the platform decision.', 'សរសេរការសម្រេច platform។'),
        enter: t(
          'App mới → Worker. Site Git/framework có sẵn → Pages (Phần 2). Cần SQL → D1. File → R2. Flag → KV. AI → sau Phần 1–3.',
          'New app → Worker. Existing Git/framework site → Pages (Part 2). Need SQL → D1. Files → R2. Flags → KV. AI → after Parts 1–3.',
          'App ថ្មី → Worker។ Site Git/framework ដែលមានស្រាប់ → Pages (Part 2)។ ត្រូវការ SQL → D1។ File → R2។ Flag → KV។ AI → បន្ទាប់ពី Parts 1–3។',
        ),
        checkpoint: t('Không bắt đầu bằng Pages Functions nếu bạn đang tạo API/service mới.', 'Do not start with Pages Functions if you are creating a new API/service.', 'កុំចាប់ផ្តើមតាម Pages Functions ប្រសិនបើអ្នកកំពុងបង្កើត API/service ថ្មី។'),
      },
      {
        action: t('Map module: 1 C3/Wrangler + Worker HTTP, 2 Pages compat, 3 storage, 4 operate, 5 AI, 6 optional DO/Queues/Workflows/Hyperdrive, 7 reference.', 'Map modules: 1 C3/Wrangler + Worker HTTP, 2 Pages compat, 3 storage, 4 operate, 5 AI, 6 optional DO/Queues/Workflows/Hyperdrive, 7 reference.', 'Map module: 1 C3/Wrangler + Worker HTTP, 2 Pages compat, 3 storage, 4 operate, 5 AI, 6 optional DO/Queues/Workflows/Hyperdrive, 7 reference។'),
      },
    ],
    watchOuts: [
      t('Nhét secret vào PUBLIC_* hoặc frontend — lộ key.', 'Putting secrets in PUBLIC_* or the frontend leaks keys.', 'ការដាក់ secret ក្នុង PUBLIC_* ឬ frontend លេច key។'),
      t('Chọn KV cho bảng quan hệ — consistency không đủ.', 'Choosing KV for relational tables — consistency is not enough.', 'ការជ្រើស KV សម្រាប់តារាង relational — consistency មិនគ្រប់គ្រាន់។'),
    ],
    tips: [
      t('Official learning path: developers.cloudflare.com/learning-paths/workers/', 'Official learning path: developers.cloudflare.com/learning-paths/workers/', 'ផ្លូវសិក្សាផ្លូវការ: developers.cloudflare.com/learning-paths/workers/'),
      t('Nhãn dashboard Workers & Pages gom một chỗ — tìm Workers để tạo service mới.', 'Dashboard labels group Workers & Pages together — look for Workers to create a new service.', 'Label dashboard ដាក់ Workers & Pages ជាមួយគ្នា — ស្វែងរក Workers ដើម្បីបង្កើត service ថ្មី។'),
    ],
    officialDocs: [
      { label: t('Workers learning path', 'Workers learning path', 'Workers learning path'), url: CF_WORKERS_LP },
      { label: t('Get started', 'Get started', 'Get started'), url: CF_WORKERS_GS },
    ],
  },
  {
    lessonId: 'dp-1-l1',
    role: 'required',
    goal: t(
      'Tạo account (nếu chưa), cài C3, login Wrangler, deploy Hello World lên *.workers.dev.',
      'Create an account (if needed), install C3, log in Wrangler, deploy Hello World to *.workers.dev.',
      'បង្កើតគណនី (ប្រសិនបើត្រូវការ), ដំឡើង C3, log in Wrangler, deploy Hello World ទៅ *.workers.dev។',
    ),
    who: t('Developer', 'Developer', 'Developer'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'URL https://<name>.<subdomain>.workers.dev trả “Hello World”; `wrangler dev` chạy local.',
      'URL https://<name>.<subdomain>.workers.dev returns “Hello World”; `wrangler dev` runs locally.',
      'URL https://<name>.<subdomain>.workers.dev ត្រឡប់ “Hello World”; `wrangler dev` ដំណើរការ locally។',
    ),
    beforeYouBegin: t('Node.js ≥ 18.17; npm; trình duyệt cho OAuth Wrangler.', 'Node.js ≥ 18.17; npm; a browser for Wrangler OAuth.', 'Node.js ≥ 18.17; npm; browser សម្រាប់ Wrangler OAuth។'),
    planNote: t('Workers Free có request limit hàng ngày. Paid Workers tăng limit và thêm features (DO, Queues, …).', 'Workers Free has a daily request cap. Paid Workers raises limits and unlocks features (DO, Queues, …).', 'Workers Free មានដែនកំណត់ request ប្រចាំថ្ងៃ។ Paid Workers លើកដែនកំណត់ និងដោះ feature (DO, Queues, …)។'),
    steps: [
      {
        action: t('Tạo hoặc mở tài khoản Workers: dash.cloudflare.com/sign-up/workers-and-pages.', 'Create or open a Workers account: dash.cloudflare.com/sign-up/workers-and-pages.', 'បង្កើតឬបើកគណនី Workers: dash.cloudflare.com/sign-up/workers-and-pages។'),
        checkpoint: t('Đăng nhập dashboard thấy Workers & Pages.', 'Dashboard login shows Workers & Pages.', 'ការចូល dashboard បង្ហាញ Workers & Pages។'),
      },
      {
        action: t('Tạo project bằng C3 — Hello World, Worker only, TypeScript, chưa deploy từ C3 (ta deploy bằng wrangler).', 'Create a project with C3 — Hello World, Worker only, TypeScript, do not deploy from C3 (we deploy with wrangler).', 'បង្កើត project តាម C3 — Hello World, Worker only, TypeScript, កុំ deploy ពី C3 (យើង deploy តាម wrangler)។'),
        enter: t('npm create cloudflare@latest -- my-first-worker', 'npm create cloudflare@latest -- my-first-worker', 'npm create cloudflare@latest -- my-first-worker'),
        see: t('Câu hỏi: Hello World example → Worker only → TypeScript → git Yes → deploy No.', 'Prompts: Hello World example → Worker only → TypeScript → git Yes → deploy No.', 'សំណួរ៖ Hello World example → Worker only → TypeScript → git Yes → deploy No.'),
      },
      {
        action: t('Login Wrangler và chạy local.', 'Log in Wrangler and run locally.', 'ចូល Wrangler ហើយដំណើរការ locally។'),
        enter: t('cd my-first-worker && npx wrangler login && npx wrangler dev', 'cd my-first-worker && npx wrangler login && npx wrangler dev', 'cd my-first-worker && npx wrangler login && npx wrangler dev'),
        checkpoint: t('http://localhost:8787 hiện Hello World. OAuth Wrangler đã Allow.', 'http://localhost:8787 shows Hello World. Wrangler OAuth was Allowed.', 'http://localhost:8787 បង្ហាញ Hello World។ Wrangler OAuth ត្រូវបាន Allowed។'),
      },
      {
        action: t('Deploy.', 'Deploy.', 'Deploy.'),
        enter: t('npx wrangler deploy', 'npx wrangler deploy', 'npx wrangler deploy'),
        checkpoint: t('curl URL *.workers.dev trả cùng body. Dashboard → Workers & Pages → service vừa tạo.', 'curl the *.workers.dev URL returns the same body. Dashboard → Workers & Pages → the new service.', 'curl URL *.workers.dev ត្រឡប់ body ដូចគ្នា។ Dashboard → Workers & Pages → service ថ្មី។'),
      },
    ],
    watchOuts: [
      t('C3 “deploy Yes” khi bạn chưa đọc wrangler.jsonc — vẫn ổn, nhưng hãy hiểu file config trước production.', 'C3 “deploy Yes” before you read wrangler.jsonc is fine for a lab — understand the config before production.', 'C3 “deploy Yes” មុនពេលអ្នកអាន wrangler.jsonc គឺសមរម្យសម្រាប់ lab — យល់ config មុន production។'),
      t('Nhầm account OAuth nếu có nhiều tài khoản Cloudflare.', 'OAuth into the wrong account if you have several Cloudflare accounts.', 'OAuth ចូល account ខុស បើអ្នកមានគណនី Cloudflare ច្រើន។'),
    ],
    tips: [
      t('Workers learning path bắt đầu bằng C3 + Wrangler — đây là on-ramp chính thức 2026.', 'The Workers learning path starts with C3 + Wrangler — this is the official 2026 on-ramp.', 'Workers learning path ចាប់ផ្តើមដោយ C3 + Wrangler — នេះគឺ on-ramp ផ្លូវការ 2026។'),
    ],
    officialDocs: [
      { label: t('C3 and Wrangler', 'C3 and Wrangler', 'C3 and Wrangler'), url: CF_C3 },
      { label: t('Get started guide', 'Get started guide', 'Get started guide'), url: CF_WORKERS_GS },
    ],
  },
  {
    lessonId: 'dp-1-l2',
    role: 'required',
    goal: t(
      'Hiểu wrangler.jsonc (name, main, compatibility_date), routes, env, và secret — không nhét key vào code hay PUBLIC_*.',
      'Understand wrangler.jsonc (name, main, compatibility_date), routes, env, and secrets — no keys in code or PUBLIC_*.',
      'យល់ wrangler.jsonc (name, main, compatibility_date), routes, env និង secrets — កុំដាក់ key ក្នុង code ឬ PUBLIC_*។',
    ),
    who: t('Developer', 'Developer', 'Developer'),
    time: t('~30 phút', '~30 min', '~30 នាទី'),
    finishWith: t(
      'Một secret đọc được trong Worker; biến không secret trong [vars]; route hoặc workers.dev rõ ràng.',
      'One secret readable in the Worker; non-secret vars in [vars]; workers.dev or a route is explicit.',
      'Secret មួយអាចអានបានក្នុង Worker; vars មិនមែន secret នៅក្នុង [vars]; workers.dev ឬ route ត្រូវច្បាស់។',
    ),
    beforeYouBegin: t('Hello World đã deploy (dp-1-l1). Mở wrangler.jsonc (hoặc wrangler.toml).', 'Hello World is deployed (dp-1-l1). Open wrangler.jsonc (or wrangler.toml).', 'Hello World ត្រូវបាន deploy (dp-1-l1)។ បើក wrangler.jsonc (ឬ wrangler.toml)។'),
    planNote: t('Custom domain trên Worker cần zone trong account (Application Services). workers.dev không cần domain.', 'A custom domain on a Worker needs a zone in the account (Application Services). workers.dev does not need a domain.', 'Custom domain លើ Worker ត្រូវការ zone ក្នុង account (Application Services)។ workers.dev មិនត្រូវការ domain។'),
    steps: [
      {
        action: t('Đọc wrangler.jsonc: name, main (src/index.ts), compatibility_date.', 'Read wrangler.jsonc: name, main (src/index.ts), compatibility_date.', 'អាន wrangler.jsonc: name, main (src/index.ts), compatibility_date។'),
        see: t('Đây là source of truth — sau khi dùng file này, đừng sửa cùng field trên dashboard.', 'This is the source of truth — once you use this file, do not edit the same fields in the dashboard.', 'នេះគឺ source of truth — ពេលប្រើ file នេះហើយ កុំកែ field ដូចគ្នានៅក្នុង dashboard។'),
      },
      {
        action: t('Thêm vars không mật (ví dụ ENVIRONMENT=dev) và deploy.', 'Add a non-secret var (e.g. ENVIRONMENT=dev) and deploy.', 'បន្ថែម var មិនមែន secret (ឧ. ENVIRONMENT=dev) ហើយ deploy។'),
        enter: t('{ "vars": { "ENVIRONMENT": "dev" } } trong wrangler.jsonc', '{ "vars": { "ENVIRONMENT": "dev" } } in wrangler.jsonc', '{ "vars": { "ENVIRONMENT": "dev" } } ក្នុង wrangler.jsonc'),
      },
      {
        action: t('Đặt secret (API token giả trong lab).', 'Set a secret (fake API token in the lab).', 'កំណត់ secret (API token ក្លែងក្នុង lab)។'),
        enter: t('npx wrangler secret put API_TOKEN', 'npx wrangler secret put API_TOKEN', 'npx wrangler secret put API_TOKEN'),
        see: t('Prompt nhập giá trị — không commit vào git. Trong code: env.API_TOKEN.', 'Prompt for the value — do not commit it. In code: env.API_TOKEN.', 'Prompt សម្រាប់ value — កុំ commit។ ក្នុង code: env.API_TOKEN។'),
        checkpoint: t('Worker đọc env.API_TOKEN; repo không chứa token. PUBLIC_* chỉ cho giá trị an toàn trên frontend.', 'Worker reads env.API_TOKEN; the repo has no token. PUBLIC_* is only for frontend-safe values.', 'Worker អាន env.API_TOKEN; repo មិនមាន token។ PUBLIC_* សម្រាប់តែ value សុវត្ថិភាពលើ frontend។'),
      },
      {
        action: t('Nếu có zone: Workers → Settings → Domains & Routes, hoặc routes trong wrangler. Không thì giữ workers.dev.', 'If you have a zone: Workers → Settings → Domains & Routes, or routes in wrangler. Otherwise keep workers.dev.', 'បើមាន zone: Workers → Settings → Domains & Routes ឬ routes ក្នុង wrangler។ បើមិនមាន រក្សា workers.dev។'),
        checkpoint: t('curl hostname đã chọn trả Worker, không nhầm site Pages khác.', 'curl on the chosen hostname hits this Worker, not a different Pages site.', 'curl លើ hostname ដែលជ្រើស ទៅដល់ Worker នេះ មិនមែន Pages site ផ្សេង។'),
      },
    ],
    watchOuts: [
      t('Secret trong wrangler.jsonc vars — vào git và preview log.', 'Secrets in wrangler.jsonc vars land in git and preview logs.', 'Secrets ក្នុង wrangler.jsonc vars ចូល git និង preview logs។'),
      t('compatibility_date cũ — behavior runtime khác docs hiện tại.', 'An old compatibility_date — runtime behavior differs from current docs.', 'compatibility_date ចាស់ — runtime behavior ខុសពី docs បច្ចុប្បន្ន។'),
    ],
    tips: [
      t('Environments (--env staging) khi có preview/production riêng.', 'Use environments (--env staging) when preview/production configs differ.', 'ប្រើ environments (--env staging) ពេល config preview/production ខុសគ្នា។'),
    ],
    officialDocs: [
      { label: t('Wrangler configuration', 'Wrangler configuration', 'Wrangler configuration'), url: CF_WRANGLER },
      { label: t('Secrets', 'Secrets', 'Secrets'), url: CF_SECRETS },
    ],
  },
  {
    lessonId: 'dp-2-l1',
    role: 'recommended',
    goal: t(
      'Deploy site Git lên Pages: build command, output dist, preview mỗi PR — đường tương thích, không phải on-ramp mặc định 2026.',
      'Deploy a Git site to Pages: build command, output dist, preview per PR — the compatibility path, not the default 2026 on-ramp.',
      'Deploy Git site ទៅ Pages: build command, output dist, preview តាម PR — ផ្លូវ compatibility មិនមែន on-ramp លំនាំដើម 2026។',
    ),
    who: t('Frontend engineer / team có repo framework', 'Frontend engineer / team with a framework repo', 'Frontend engineer / team ដែលមាន framework repo'),
    time: t('~30 phút', '~30 min', '~30 នាទី'),
    finishWith: t(
      'Production *.pages.dev (hoặc custom domain); một PR có preview URL.',
      'Production *.pages.dev (or custom domain); one PR has a preview URL.',
      'Production *.pages.dev (ឬ custom domain); PR មួយមាន preview URL។',
    ),
    beforeYouBegin: t(
      'Repo GitHub/GitLab. Biết output directory (Astro: dist, Vite: dist, CRA: build). Worker-first (dp-1) đã hiểu runtime.',
      'GitHub/GitLab repo. You know the output directory (Astro: dist, Vite: dist, CRA: build). Worker-first (dp-1) already explained the runtime.',
      'Repo GitHub/GitLab។ អ្នកដឹង output directory (Astro: dist, Vite: dist, CRA: build)។ Worker-first (dp-1) បានពន្យល់ runtime រួចហើយ។',
    ),
    planNote: t('Pages Free đủ cho site tĩnh. Build minutes và Functions có limit.', 'Pages Free is enough for a static site. Build minutes and Functions have limits.', 'Pages Free គ្រប់គ្រាន់សម្រាប់ static site។ Build minutes និង Functions មាន limits។'),
    steps: [
      {
        action: t('Dashboard → Workers & Pages → Create → Pages → Connect to Git.', 'Dashboard → Workers & Pages → Create → Pages → Connect to Git.', 'Dashboard → Workers & Pages → Create → Pages → Connect to Git.'),
        click: t('Connect to Git → chọn repo → production branch main', 'Connect to Git → pick repo → production branch main', 'Connect to Git → ជ្រើស repo → production branch main'),
      },
      {
        action: t('Framework preset + build command + output directory.', 'Framework preset + build command + output directory.', 'Framework preset + build command + output directory។'),
        enter: t('Build command: npm run build   Output: dist   Node: 18+', 'Build command: npm run build   Output: dist   Node: 18+', 'Build command: npm run build   Output: dist   Node: 18+'),
        checkpoint: t('Build log pass. URL *.pages.dev phục vụ HTML. Sai output = trang trắng/404 — lỗi #1.', 'Build log passes. *.pages.dev serves HTML. Wrong output = blank/404 — the #1 mistake.', 'Build log ឆ្លង។ *.pages.dev បម្រើ HTML។ Output ខុស = blank/404 — កំហុស #1។'),
      },
      {
        action: t('Mở PR nhỏ — xác nhận preview deployment URL khác production.', 'Open a small PR — confirm the preview URL is not production.', 'បើក PR តូច — បញ្ជាក់ថា preview URL មិនមែន production។'),
        checkpoint: t('Reviewer mở preview, không đụng production.', 'A reviewer opens preview without touching production.', 'Reviewer បើក preview ដោយមិនប៉ះ production។'),
      },
      {
        action: t('Ghi chú migrate: project mới nên cân nhắc Workers + static assets; Pages hiện có có guide migrate, không copy-paste vội.', 'Migration note: new projects should consider Workers + static assets; existing Pages have a migrate guide — do not paste blindly.', 'ចំណាំ migrate: project ថ្មីគួរពិចារណា Workers + static assets; Pages ដែលមានស្រាប់មាន migrate guide — កុំ paste ដោយមិនអាន។'),
        see: t(CF_MIGRATE, CF_MIGRATE),
      },
    ],
    watchOuts: [
      t('Env production vs preview: quên biến trên preview khiến PR “chạy khác prod”.', 'Production vs preview env: missing preview vars make the PR behave unlike prod.', 'Env production vs preview: ភ្លេច vars លើ preview ធ្វើឱ្យ PR ដំណើរការខុសពី prod។'),
    ],
    tips: [
      t('Hub này dùng Pages — hợp site nội dung + Functions. API/service mới: Worker (dp-1).', 'This hub uses Pages — a good fit for a content site + Functions. New APIs/services: Worker (dp-1).', 'Hub នេះប្រើ Pages — សមសម្រាប់ content site + Functions។ API/service ថ្មី: Worker (dp-1)។'),
    ],
    officialDocs: [
      { label: t('Pages Git integration', 'Pages Git integration', 'Pages Git integration'), url: CF_PAGES },
      { label: t('Migrate from Pages', 'Migrate from Pages', 'Migrate from Pages'), url: CF_MIGRATE },
    ],
  },
  {
    lessonId: 'dp-2-l2',
    role: 'recommended',
    goal: t(
      'Thêm Pages Function `/api/*` khi logic gắn với site Pages — cùng Workers runtime; biết khi nào tách Worker.',
      'Add a Pages Function on `/api/*` when logic belongs with a Pages site — same Workers runtime; know when to split a Worker.',
      'បន្ថែម Pages Function លើ `/api/*` ពេល logic ជាកម្មសិទ្ធិរបស់ Pages site — runtime Workers ដូចគ្នា; ដឹងពេលណាត្រូវបំបែក Worker។',
    ),
    who: t('Developer giữ site Pages', 'Developer who owns a Pages site', 'Developer ដែលកាន់ Pages site'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      '`GET /api/hello` từ Functions; hiểu binding gắn trên Pages project; không dùng Function cho app mới độc lập.',
      '`GET /api/hello` from Functions; bindings live on the Pages project; you do not use Functions for a brand-new standalone app.',
      '`GET /api/hello` ពី Functions; bindings ស្ថិតលើ Pages project; អ្នកមិនប្រើ Functions សម្រាប់ app standalone ថ្មីទាំងស្រុង។',
    ),
    beforeYouBegin: t('Pages site đã deploy (dp-2-l1) hoặc clone cấu trúc functions/.', 'A Pages site is deployed (dp-2-l1) or you cloned a functions/ layout.', 'Pages site ត្រូវបាន deploy (dp-2-l1) ឬអ្នក clone layout functions/។'),
    steps: [
      {
        action: t('Tạo functions/api/hello.ts export onRequestGet trả JSON.', 'Create functions/api/hello.ts exporting onRequestGet that returns JSON.', 'បង្កើត functions/api/hello.ts export onRequestGet ដែលត្រឡប់ JSON។'),
        enter: t('export const onRequestGet = () => new Response(JSON.stringify({ ok: true }))', 'export const onRequestGet = () => new Response(JSON.stringify({ ok: true }))', 'export const onRequestGet = () => new Response(JSON.stringify({ ok: true }))'),
        checkpoint: t('https://<site>/api/hello trả JSON sau deploy.', 'https://<site>/api/hello returns JSON after deploy.', 'https://<site>/api/hello ត្រឡប់ JSON បន្ទាប់ពី deploy។'),
      },
      {
        action: t('Binding D1/KV: Pages → Settings → Bindings (không hardcode account id trong client).', 'D1/KV bindings: Pages → Settings → Bindings (do not hardcode account ids in the client).', 'Bindings D1/KV: Pages → Settings → Bindings (កុំ hardcode account id ក្នុង client)។'),
      },
      {
        action: t('Tách Worker độc lập khi cần nhiều hostname, middleware phức tạp, hoặc service không gắn UI tĩnh.', 'Split a standalone Worker when you need many hostnames, complex middleware, or a service not tied to static UI.', 'បំបែក Worker standalone ពេលត្រូវការ hostname ច្រើន, middleware ស្មុគស្មាញ ឬ service មិនចងភ្ជាប់ UI static។'),
        checkpoint: t('Bạn giải thích được: Function = Worker runtime cạnh Pages; Worker = đơn vị compute mặc định.', 'You can explain: a Function is the Worker runtime beside Pages; a Worker is the default compute unit.', 'អ្នកអាចពន្យល់បាន៖ Function គឺ Worker runtime ក្បែរ Pages; Worker គឺ compute unit លំនាំដើម។'),
      },
    ],
    watchOuts: [
      t(' wrangler.toml Pages khác Workers (pages_build_output_dir, không có main).', 'Pages wrangler.toml differs from Workers (pages_build_output_dir, no main).', 'wrangler.toml របស់ Pages ខុសពី Workers (pages_build_output_dir, គ្មាន main)។'),
    ],
    tips: [
      t('Cùng quy tắc secret: verify Turnstile server-side trong Function/Worker, không chỉ widget.', 'Same secret rule: verify Turnstile server-side in the Function/Worker, not only the widget.', 'ច្បាប់ secret ដូចគ្នា៖ verify Turnstile server-side ក្នុង Function/Worker មិនត្រឹម widget។'),
    ],
    officialDocs: [{ label: t('Pages Functions', 'Pages Functions', 'Pages Functions'), url: CF_PAGES_FN }],
  },
  {
    lessonId: 'dp-3-l1',
    role: 'required',
    goal: t(
      'Chọn đúng storage rồi dùng KV cho flag/config/cache nhẹ — không dùng KV như SQL.',
      'Pick the right storage, then use KV for flags/config/light cache — not as SQL.',
      'ជ្រើស storage ត្រឹមត្រូវ បន្ទាប់មកប្រើ KV សម្រាប់ flags/config/cache ស្រាល — មិនមែនជា SQL។',
    ),
    who: t('Developer', 'Developer', 'Developer'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Bảng quyết định KV vs D1 vs R2; một namespace KV bind vào Worker; get/put một key.',
      'A KV vs D1 vs R2 decision table; one KV namespace bound to the Worker; get/put one key.',
      'តារាងសម្រេច KV vs D1 vs R2; KV namespace មួយ bind ទៅ Worker; get/put key មួយ។',
    ),
    beforeYouBegin: t('Worker đã deploy (dp-1).', 'A Worker is deployed (dp-1).', 'Worker ត្រូវបាន deploy (dp-1)។'),
    planNote: t('KV, D1, R2 có free tier với limit. Production lớn cần xem pricing.', 'KV, D1, and R2 have free tiers with limits. Large production needs a pricing look.', 'KV, D1 និង R2 មាន free tier ជាមួយ limits។ Production ធំត្រូវមើល pricing។'),
    steps: [
      {
        action: t('Chọn storage trước khi tạo resource.', 'Choose storage before creating a resource.', 'ជ្រើស storage មុនពេលបង្កើត resource។'),
        see: t(
          'KV: key-value, đọc nhiều, eventual consistency — flags, session ngắn. D1: SQL schema, signup/quiz. R2: object/file, PDF, upload. Durable Objects: state mạnh theo instance (Phần 6).',
          'KV: key-value, read-heavy, eventual consistency — flags, short sessions. D1: SQL schema, signup/quiz. R2: objects/files, PDFs, uploads. Durable Objects: strong per-instance state (Part 6).',
          'KV: key-value, read-heavy, eventual consistency — flags, session ខ្លី។ D1: SQL schema, signup/quiz។ R2: objects/files, PDFs, uploads។ Durable Objects: state ខ្លាំងតាម instance (Part 6)។',
        ),
        checkpoint: t('Use case của bạn khớp một cột — không “dùng KV cho mọi thứ”.', 'Your use case matches one column — not “KV for everything”.', 'Use case របស់អ្នកត្រូវនឹងជួរមួយ — មិនមែន “KV for everything”។'),
      },
      {
        action: t('Tạo KV namespace và bind.', 'Create a KV namespace and bind it.', 'បង្កើត KV namespace ហើយ bind។'),
        enter: t('npx wrangler kv namespace create FLAGS', 'npx wrangler kv namespace create FLAGS', 'npx wrangler kv namespace create FLAGS'),
        see: t('Dán id vào wrangler.jsonc kv_namespaces binding FLAGS.', 'Paste the id into wrangler.jsonc kv_namespaces binding FLAGS.', 'បិទភ្ជាប់ id ទៅ wrangler.jsonc kv_namespaces binding FLAGS។'),
      },
      {
        action: t('Put/get một flag.', 'Put/get one flag.', 'Put/get flag មួយ។'),
        enter: t('npx wrangler kv key put --binding=FLAGS maintenance "off" && đọc env.FLAGS.get("maintenance") trong Worker', 'npx wrangler kv key put --binding=FLAGS maintenance "off" && read env.FLAGS.get("maintenance") in the Worker', 'npx wrangler kv key put --binding=FLAGS maintenance "off" && អាន env.FLAGS.get("maintenance") ក្នុង Worker'),
        checkpoint: t('Worker trả giá trị flag. Không dùng KV cho giao dịch tiền / hàng đợi chính xác.', 'Worker returns the flag. Do not use KV for money transactions or exact queues.', 'Worker ត្រឡប់ flag។ កុំប្រើ KV សម្រាប់ប្រតិបត្តិការលុយ ឬ queues ត្រឹមត្រូវ។'),
      },
    ],
    watchOuts: [
      t('KV write chậm lan truyền — không phải source of truth cho inventory.', 'KV writes propagate slowly — not a source of truth for inventory.', 'KV writes ផ្សព្វផ្សាយយឺត — មិនមែន source of truth សម្រាប់ inventory។'),
    ],
    tips: [
      t('Một Worker có thể bind cả ba — chọn theo dữ liệu, không theo thói quen.', 'One Worker can bind all three — choose by data, not habit.', 'Worker មួយអាច bind ទាំងបី — ជ្រើសតាមទិន្នន័យ មិនមែនតាមទម្លាប់។'),
    ],
    officialDocs: [{ label: t('KV', 'KV', 'KV'), url: CF_KV }],
  },
  {
    lessonId: 'dp-3-l2',
    role: 'required',
    goal: t(
      'Tạo D1, chạy migration, query từ Worker — đúng chỗ cho bảng SQL nhỏ (signup, quiz).',
      'Create D1, run a migration, query from the Worker — the right place for small SQL tables (signup, quiz).',
      'បង្កើត D1, រត់ migration, query ពី Worker — កន្លែងត្រឹមត្រូវសម្រាប់តារាង SQL តូច (signup, quiz)។',
    ),
    who: t('Developer', 'Developer', 'Developer'),
    time: t('~30 phút', '~30 min', '~30 នាទី'),
    finishWith: t(
      'Database local + remote; bảng tồn tại sau `wrangler d1 migrations apply`; SELECT từ Worker.',
      'Local + remote database; table exists after `wrangler d1 migrations apply`; SELECT from the Worker.',
      'Database local + remote; តារាងមានបន្ទាប់ពី `wrangler d1 migrations apply`; SELECT ពី Worker។',
    ),
    beforeYouBegin: t('Worker project (dp-1). Đã quyết định D1 (dp-3-l1).', 'Worker project (dp-1). You already chose D1 (dp-3-l1).', 'Worker project (dp-1)។ អ្នកបានជ្រើស D1 រួចហើយ (dp-3-l1)។'),
    steps: [
      {
        action: t('Tạo D1 và bind.', 'Create D1 and bind it.', 'បង្កើត D1 ហើយ bind។'),
        enter: t('npx wrangler d1 create app-db', 'npx wrangler d1 create app-db', 'npx wrangler d1 create app-db'),
        see: t('Thêm d1_databases vào wrangler.jsonc (binding DB, database_name, database_id).', 'Add d1_databases to wrangler.jsonc (binding DB, database_name, database_id).', 'បន្ថែម d1_databases ទៅ wrangler.jsonc (binding DB, database_name, database_id)។'),
      },
      {
        action: t('Viết migration SQL và apply local rồi remote.', 'Write a SQL migration and apply local then remote.', 'សរសេរ SQL migration ហើយ apply local បន្ទាប់មក remote។'),
        enter: t(
          'npx wrangler d1 migrations create app-db init && npx wrangler d1 migrations apply app-db --local && npx wrangler d1 migrations apply app-db --remote',
          'npx wrangler d1 migrations create app-db init && npx wrangler d1 migrations apply app-db --local && npx wrangler d1 migrations apply app-db --remote',
          'npx wrangler d1 migrations create app-db init && npx wrangler d1 migrations apply app-db --local && npx wrangler d1 migrations apply app-db --remote',
        ),
        checkpoint: t('Bảng hiện khi query. Local ≠ remote nếu quên --remote.', 'The table appears when queried. Local ≠ remote if you forget --remote.', 'តារាងលេចឡើងពេល query។ Local ≠ remote បើភ្លេច --remote។'),
      },
      {
        action: t('Trong Worker: env.DB.prepare("SELECT 1").first().', 'In the Worker: env.DB.prepare("SELECT 1").first().', 'ក្នុង Worker: env.DB.prepare("SELECT 1").first()។'),
        checkpoint: t('Endpoint trả hàng. Dùng index khi query theo cột lọc (docs D1 indexes).', 'An endpoint returns a row. Add indexes when you filter by a column (D1 index docs).', 'Endpoint ត្រឡប់ row។ បន្ថែម indexes ពេល filter តាម column (D1 index docs)។'),
      },
    ],
    watchOuts: [
      t('Apply migration chỉ --local rồi deploy — production trống.', 'Applying migrations only with --local then deploying leaves production empty.', 'Apply migrations តែជាមួយ --local បន្ទាប់មក deploy ធ្វើឱ្យ production ទទេ។'),
    ],
    tips: [
      t('Hub workshop signup dùng D1 — cùng pattern verify input rồi INSERT.', 'This hub’s workshop signup uses D1 — same pattern: verify input, then INSERT.', 'Workshop signup របស់ hub នេះប្រើ D1 — pattern ដូចគ្នា៖ verify input បន្ទាប់មក INSERT។'),
    ],
    officialDocs: [{ label: t('D1', 'D1', 'D1'), url: CF_D1 }],
  },
  {
    lessonId: 'dp-3-l3',
    role: 'required',
    goal: t(
      'Tạo bucket R2, bind, put/get một object — file và tài sản, không phải hàng SQL.',
      'Create an R2 bucket, bind it, put/get one object — files and assets, not SQL rows.',
      'បង្កើត R2 bucket, bind, put/get object មួយ — files និង assets មិនមែន SQL rows។',
    ),
    who: t('Developer', 'Developer', 'Developer'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Object trong bucket; Worker đọc được; biết public vs signed access.',
      'An object in the bucket; the Worker can read it; you know public vs signed access.',
      'Object ក្នុង bucket; Worker អាចអានបាន; អ្នកដឹង public vs signed access។',
    ),
    beforeYouBegin: t('Worker project. Quyết định R2 (dp-3-l1).', 'Worker project. You chose R2 (dp-3-l1).', 'Worker project។ អ្នកបានជ្រើស R2 (dp-3-l1)។'),
    steps: [
      {
        action: t('Tạo bucket và bind.', 'Create a bucket and bind it.', 'បង្កើត bucket ហើយ bind។'),
        enter: t('npx wrangler r2 bucket create app-assets', 'npx wrangler r2 bucket create app-assets', 'npx wrangler r2 bucket create app-assets'),
        see: t('r2_buckets trong wrangler.jsonc binding ASSETS.', 'r2_buckets in wrangler.jsonc binding ASSETS.', 'r2_buckets ក្នុង wrangler.jsonc binding ASSETS។'),
      },
      {
        action: t('Upload một file nhỏ và đọc từ Worker (env.ASSETS.get(key)).', 'Upload a small file and read it from the Worker (env.ASSETS.get(key)).', 'Upload file តូច ហើយអានពី Worker (env.ASSETS.get(key))។'),
        enter: t('npx wrangler r2 object put app-assets/hello.txt --file ./hello.txt', 'npx wrangler r2 object put app-assets/hello.txt --file ./hello.txt', 'npx wrangler r2 object put app-assets/hello.txt --file ./hello.txt'),
        checkpoint: t('GET object không 404. Không public cả bucket nếu file user-upload nhạy cảm — dùng signed URL.', 'GET object is not 404. Do not make the whole bucket public if uploads are sensitive — use signed URLs.', 'GET object មិនមែន 404។ កុំធ្វើ bucket ទាំងមូលឱ្យ public បើ uploads រសើប — ប្រើ signed URLs។'),
      },
    ],
    watchOuts: [
      t('Public bucket + PII — lộ dữ liệu. Mặc định private.', 'A public bucket + PII leaks data. Default to private.', 'Bucket public + PII លេចទិន្នន័យ។ លំនាំដើមឱ្យ private។'),
    ],
    tips: [
      t('R2 không tính egress theo kiểu cloud cổ điển — vẫn kiểm soát access.', 'R2 avoids classic cloud egress fees — you still control access.', 'R2 ជៀសវាង egress fees ប្រភេទ cloud បុរាណ — អ្នកនៅតែគ្រប់គ្រង access។'),
    ],
    officialDocs: [{ label: t('R2', 'R2', 'R2'), url: CF_R2 }],
  },
  {
    lessonId: 'dp-4-l1',
    role: 'recommended',
    goal: t(
      'Quan sát Worker: wrangler tail, dashboard logs/metrics — lỗi edge không hiện như server truyền thống.',
      'Observe the Worker: wrangler tail, dashboard logs/metrics — edge errors do not look like a traditional server.',
      'សង្កេត Worker: wrangler tail, dashboard logs/metrics — កំហុស edge មិនមើលទៅដូច server បុរាណ។',
    ),
    who: t('Developer vận hành', 'Developer operating the app', 'Developer ដែលដំណើរការ app'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Một request hiện trong `wrangler tail`; biết mở Observability trên dashboard.',
      'One request appears in `wrangler tail`; you can open Observability in the dashboard.',
      'Request មួយលេចក្នុង `wrangler tail`; អ្នកអាចបើក Observability ក្នុង dashboard។',
    ),
    beforeYouBegin: t('Worker đã deploy. Có thể tạo 4xx/5xx có chủ đích.', 'Worker is deployed. You can trigger a deliberate 4xx/5xx.', 'Worker ត្រូវបាន deploy។ អ្នកអាច trigger 4xx/5xx ដោយចេតនា។'),
    steps: [
      {
        action: t('Chạy tail khi gọi endpoint.', 'Run tail while calling the endpoint.', 'រត់ tail ពេលហៅ endpoint។'),
        enter: t('npx wrangler tail', 'npx wrangler tail', 'npx wrangler tail'),
        checkpoint: t('Log hiện method, path, exception nếu throw. Không đoán trong im lặng.', 'Logs show method, path, and exceptions if you throw. Do not debug in silence.', 'Logs បង្ហាញ method, path និង exceptions បើអ្នក throw។ កុំ debug ក្នុងភាពស្ងៀម។'),
      },
      {
        action: t('Dashboard → Worker → Observability / Metrics: request, CPU, error rate.', 'Dashboard → Worker → Observability / Metrics: requests, CPU, error rate.', 'Dashboard → Worker → Observability / Metrics: requests, CPU, error rate។'),
      },
      {
        action: t('Bật Web Analytics trên site Pages nếu có UI (dp-2) — tách với log Worker.', 'Enable Web Analytics on the Pages site if you have UI (dp-2) — separate from Worker logs.', 'បើក Web Analytics លើ Pages site បើមាន UI (dp-2) — ដាច់ពី Worker logs។'),
      },
    ],
    watchOuts: [
      t('Log PII/secret trong console.log — vào tail và retention.', 'Logging PII/secrets with console.log lands in tail and retention.', 'Log PII/secrets ដោយ console.log ចូល tail និង retention។'),
    ],
    tips: [
      t('Throw có message rõ + status code; catch ở cạnh và log một lần.', 'Throw with a clear message + status code; catch at the edge and log once.', 'Throw ជាមួយ message ច្បាស់ + status code; catch នៅ edge ហើយ log ម្តង។'),
    ],
    officialDocs: [{ label: t('Workers observability', 'Workers observability', 'Workers observability'), url: CF_OBS }],
  },
  {
    lessonId: 'dp-4-l2',
    role: 'recommended',
    goal: t(
      'Bảo vệ form public bằng Turnstile và verify token server-side trước khi ghi D1.',
      'Protect a public form with Turnstile and verify the token server-side before writing to D1.',
      'ការពារ form public ដោយ Turnstile ហើយ verify token server-side មុនពេល write ទៅ D1។',
    ),
    who: t('Developer form / workshop signup', 'Developer of the form / workshop signup', 'Developer នៃ form / workshop signup'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Widget hiện; Function/Worker gọi siteverify; request không token bị từ chối.',
      'Widget visible; Function/Worker calls siteverify; requests without a token are rejected.',
      'Widget មើលឃើញ; Function/Worker ហៅ siteverify; requests គ្មាន token ត្រូវបានបដិសេធ។',
    ),
    beforeYouBegin: t('Có form POST và chỗ ghi D1 (dp-3-l2) hoặc mock.', 'You have a POST form and a D1 write (dp-3-l2) or a mock.', 'អ្នកមាន form POST និង D1 write (dp-3-l2) ឬ mock។'),
    planNote: t('Turnstile có free tier. Secret key không bao giờ lên client.', 'Turnstile has a free tier. The secret key never goes to the client.', 'Turnstile មាន free tier។ Secret key មិនដែលទៅ client។'),
    steps: [
      {
        action: t('Dashboard → Turnstile → Add widget. Lấy site key (public) và secret key.', 'Dashboard → Turnstile → Add widget. Copy the site key (public) and secret key.', 'Dashboard → Turnstile → Add widget។ Copy site key (public) និង secret key។'),
        checkpoint: t('Secret chỉ ở wrangler secret / Pages secret TURNSTILE_SECRET_KEY.', 'Secret lives only in wrangler secret / Pages secret TURNSTILE_SECRET_KEY.', 'Secret ស្ថិតតែក្នុង wrangler secret / Pages secret TURNSTILE_SECRET_KEY។'),
      },
      {
        action: t('Nhúng widget trên form (site key). Server: POST siteverify với secret + token.', 'Embed the widget on the form (site key). Server: POST siteverify with secret + token.', 'បង្កប់ widget លើ form (site key)។ Server: POST siteverify ជាមួយ secret + token។'),
        enter: t('https://challenges.cloudflare.com/turnstile/v0/siteverify', 'https://challenges.cloudflare.com/turnstile/v0/siteverify', 'https://challenges.cloudflare.com/turnstile/v0/siteverify'),
        checkpoint: t('POST không token hoặc token giả → 400. Token thật → INSERT D1. Không tin body client.', 'POST without a token or with a fake token → 400. Real token → D1 INSERT. Do not trust the client body.', 'POST គ្មាន token ឬ token ក្លែង → 400។ Token ពិត → D1 INSERT។ កុំទុកចិត្ត client body។'),
      },
      {
        action: t('Local không có secret: chỉ bypass có chủ đích trong dev (pattern hub: dev-bypass) — không bao giờ trên production.', 'Local without a secret: only a deliberate dev bypass (this hub’s dev-bypass pattern) — never in production.', 'Local គ្មាន secret: តែ dev bypass ដោយចេតនា (pattern dev-bypass របស់ hub នេះ) — កុំប្រើក្នុង production។'),
      },
    ],
    watchOuts: [
      t('Chỉ nhúng widget — attacker POST thẳng API.', 'Widget only — attackers POST straight to the API.', 'តែ widget — attackers POST ត្រង់ទៅ API។'),
    ],
    tips: [
      t('Kết hợp rate limit WAF trên /api/signup nếu form nằm sau zone Application Services.', 'Combine a WAF rate limit on /api/signup if the form sits behind an Application Services zone.', 'រួម WAF rate limit លើ /api/signup បើ form ស្ថិតក្រោយ zone Application Services។'),
    ],
    officialDocs: [{ label: t('Turnstile', 'Turnstile', 'Turnstile'), url: CF_TURNSTILE }],
  },
  {
    lessonId: 'dp-5-l1',
    role: 'recommended',
    goal: t(
      'Gọi Workers AI từ server-side: binding AI, một task rõ, không đưa key model lên client.',
      'Call Workers AI server-side: AI binding, one clear task, no model keys in the client.',
      'ហៅ Workers AI server-side: AI binding, task ច្បាស់មួយ, គ្មាន model keys ក្នុង client។',
    ),
    who: t('Developer AI feature', 'Developer of an AI feature', 'Developer នៃ AI feature'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Endpoint Worker trả output model; wrangler có ai binding; UI chỉ gọi API của bạn.',
      'A Worker endpoint returns model output; wrangler has an ai binding; the UI only calls your API.',
      'Worker endpoint ត្រឡប់ model output; wrangler មាន ai binding; UI ហៅតែ API របស់អ្នក។',
    ),
    beforeYouBegin: t('Worker (dp-1) + secret hygiene (dp-1-l2). Một prompt/task cụ thể (tóm tắt, classify).', 'Worker (dp-1) + secret hygiene (dp-1-l2). One concrete prompt/task (summarize, classify).', 'Worker (dp-1) + secret hygiene (dp-1-l2)។ Prompt/task ជាក់លាក់មួយ (summarize, classify)។'),
    planNote: t('Workers AI có free neurons/ngày. Production: xem usage và AI Gateway.', 'Workers AI has free neurons/day. Production: watch usage and AI Gateway.', 'Workers AI មាន free neurons/day។ Production: មើល usage និង AI Gateway។'),
    steps: [
      {
        action: t('Thêm binding AI trong wrangler.jsonc.', 'Add an AI binding in wrangler.jsonc.', 'បន្ថែម AI binding ក្នុង wrangler.jsonc។'),
        enter: t('{ "ai": { "binding": "AI" } }', '{ "ai": { "binding": "AI" } }', '{ "ai": { "binding": "AI" } }'),
      },
      {
        action: t('Trong Worker: env.AI.run("@cf/...", { prompt }) và trả text. Rate limit input.', 'In the Worker: env.AI.run("@cf/...", { prompt }) and return text. Rate-limit input.', 'ក្នុង Worker: env.AI.run("@cf/...", { prompt }) ហើយត្រឡប់ text។ Rate-limit input។'),
        checkpoint: t('curl endpoint (đã auth nếu public) trả kết quả. Browser không chứa account token.', 'curl the endpoint (authenticated if public) returns a result. The browser holds no account token.', 'curl endpoint (authenticated បើ public) ត្រឡប់ result។ Browser មិនផ្ទុក account token។'),
      },
      {
        action: t('Chưa thêm chat UI nhiều provider — một task xong đã có giá trị.', 'Do not add a multi-provider chat UI yet — one finished task already has value.', 'កុំបន្ថែម chat UI ពហុ provider នៅឡើយ — task មួយដែលចប់មានតម្លៃរួចហើយ។'),
      },
    ],
    watchOuts: [
      t('Expose Workers AI từ client trực tiếp — mất kiểm soát cost và prompt injection không lọc.', 'Exposing Workers AI directly from the client loses cost control and unfiltered prompt injection.', 'លាតត្រដាង Workers AI ផ្ទាល់ពី client បាត់ការគ្រប់គ្រង cost និង prompt injection ដែលមិនបាន filter។'),
    ],
    tips: [
      t('Auth user trước endpoint AI (session, Access, hoặc Turnstile + rate limit).', 'Authenticate the user before the AI endpoint (session, Access, or Turnstile + rate limit).', 'Authenticate អ្នកប្រើ មុន AI endpoint (session, Access ឬ Turnstile + rate limit)។'),
    ],
    officialDocs: [{ label: t('Workers AI', 'Workers AI', 'Workers AI'), url: CF_AI }],
  },
  {
    lessonId: 'dp-5-l2',
    role: 'recommended',
    goal: t(
      'Đặt AI Gateway giữa app và model: log, cache khi phù hợp, đổi provider mà không lộ key.',
      'Place AI Gateway between the app and the model: logs, cache when appropriate, change providers without exposing keys.',
      'ដាក់ AI Gateway រវាង app និង model: logs, cache ពេលសមស្រប, ប្តូរ providers ដោយមិនលាតត្រដាង keys។',
    ),
    who: t('Developer vận hành AI', 'Developer operating AI', 'Developer ដែលដំណើរការ AI'),
    time: t('~25 phút', '~25 min', '~25 នាទី'),
    finishWith: t(
      'Gateway slug; Worker gọi qua gateway; dashboard thấy request.',
      'A gateway slug; the Worker calls through the gateway; the dashboard shows requests.',
      'Gateway slug; Worker ហៅតាម gateway; dashboard បង្ហាញ requests។',
    ),
    beforeYouBegin: t('Đã gọi được model (dp-5-l1) hoặc provider ngoài (OpenAI) với secret trên Worker.', 'You can already call a model (dp-5-l1) or an external provider (OpenAI) with the secret on the Worker.', 'អ្នកអាចហៅ model បានរួច (dp-5-l1) ឬ provider ខាងក្រៅ (OpenAI) ដោយ secret លើ Worker។'),
    planNote: t('AI Gateway có free tier. Authenticated gateway + DLP response là plan cao hơn.', 'AI Gateway has a free tier. Authenticated gateway + response DLP are higher plans.', 'AI Gateway មាន free tier។ Authenticated gateway + response DLP គឺ plan ខ្ពស់ជាង។'),
    steps: [
      {
        action: t('AI → AI Gateway → Create gateway. Copy slug/endpoint.', 'AI → AI Gateway → Create gateway. Copy the slug/endpoint.', 'AI → AI Gateway → Create gateway។ Copy slug/endpoint។'),
      },
      {
        action: t('Trỏ Worker/SDK tới gateway thay vì provider trực tiếp. Key ở Worker hoặc BYOK trên gateway — không ở browser.', 'Point the Worker/SDK at the gateway instead of the provider. Keys stay on the Worker or BYOK on the gateway — not in the browser.', 'ចង្អុល Worker/SDK ទៅ gateway ជំនួស provider។ Keys ស្ថិតលើ Worker ឬ BYOK លើ gateway — មិននៅក្នុង browser។'),
        checkpoint: t('Một request hiện trên Gateway analytics. Đổi model/provider không đổi client.', 'One request appears in Gateway analytics. Changing model/provider does not change the client.', 'Request មួយលេចក្នុង Gateway analytics។ ការប្តូរ model/provider មិនផ្លាស់ប្តូរ client។'),
      },
      {
        action: t('Cache chỉ khi prompt/response an toàn để tái sử dụng. Không cache gateway dùng cho RAG/AI Search.', 'Cache only when prompt/response is safe to reuse. Do not cache a gateway used for RAG/AI Search.', 'Cache តែពេល prompt/response សុវត្ថិភាពសម្រាប់ប្រើឡើងវិញ។ កុំ cache gateway ដែលប្រើសម្រាប់ RAG/AI Search។'),
      },
    ],
    watchOuts: [
      t('Cache + dữ liệu user trong prompt — user B thấy câu trả lời user A.', 'Cache + user data in the prompt — user B sees user A’s answer.', 'Cache + ទិន្នន័យអ្នកប្រើក្នុង prompt — user B ឃើញចម្លើយរបស់ user A។'),
    ],
    tips: [
      t('AI Gateway bổ sung Workers AI — không thay binding AI cho use case thuần Workers AI.', 'AI Gateway complements Workers AI — it does not replace the AI binding for a pure Workers AI use case.', 'AI Gateway បំពេញ Workers AI — វាមិនជំនួស AI binding សម្រាប់ use case Workers AI សុទ្ធ។'),
    ],
    officialDocs: [{ label: t('AI Gateway', 'AI Gateway', 'AI Gateway'), url: CF_AIG }],
  },
  {
    lessonId: 'dp-5-l3',
    role: 'recommended',
    goal: t(
      'Baseline bảo mật app AI: secret, auth, rate limit, validate tool input, guardrails.',
      'AI app security baseline: secrets, auth, rate limits, validate tool input, guardrails.',
      'Baseline សុវត្ថិភាព AI app: secrets, auth, rate limits, validate tool input, guardrails។',
    ),
    who: t('Developer + security reviewer', 'Developer + security reviewer', 'Developer + security reviewer'),
    time: t('~20 phút', '~20 min', '~20 នាទី'),
    finishWith: t(
      'Checklist: không key trên client; endpoint có auth; input truncated/rate-limited; tool không nhận lệnh thô.',
      'Checklist: no client keys; endpoint is authenticated; input truncated/rate-limited; tools do not take raw commands.',
      'Checklist: គ្មាន client keys; endpoint ត្រូវ authenticated; input truncated/rate-limited; tools មិនទទួល raw commands។',
    ),
    beforeYouBegin: t('dp-5-l1 và dp-5-l2. Biết dữ liệu nhạy cảm trong prompt.', 'dp-5-l1 and dp-5-l2. You know what sensitive data can appear in prompts.', 'dp-5-l1 និង dp-5-l2។ អ្នកដឹងថា sensitive data អាចលេចក្នុង prompts។'),
    steps: [
      {
        action: t('Key chỉ Worker secrets / AI Gateway. Auth (cookie, Access, API token) trước inference.', 'Keys only in Worker secrets / AI Gateway. Auth (cookie, Access, API token) before inference.', 'Keys តែក្នុង Worker secrets / AI Gateway។ Auth (cookie, Access, API token) មុន inference។'),
        checkpoint: t('Request không auth → 401. Secret không có trong repo.', 'Unauthenticated request → 401. Secrets are not in the repo.', 'Request មិន authenticated → 401។ Secrets មិនមានក្នុង repo។'),
      },
      {
        action: t('Giới hạn độ dài prompt và request/phút. Validate JSON schema trước khi gọi tool.', 'Cap prompt length and requests/minute. Validate a JSON schema before calling a tool.', 'កំណត់ប្រវែង prompt និង requests/minute។ Validate JSON schema មុនពេលហៅ tool។'),
      },
      {
        action: t('Bật guardrails trên AI Gateway nếu xử lý PII/nội dung rủi ro (plan cho phép).', 'Enable AI Gateway guardrails if you handle PII/risky content (plan permitting).', 'បើក AI Gateway guardrails បើអ្នកដោះស្រាយ PII/risky content (plan អនុញ្ញាត)។'),
      },
    ],
    watchOuts: [
      t('Agent với tool “chạy SQL” không parameterized — injection.', 'An agent with a raw “run SQL” tool — injection.', 'Agent ដែលមាន tool “run SQL” ឆៅ — injection។'),
    ],
    tips: [
      t('Cheatsheet AI protection trên hub bổ sung góc Zero Trust (SWG/DLP) — khác lớp app này.', 'The hub AI protection cheatsheet adds the Zero Trust angle (SWG/DLP) — a different layer from this app.', 'Cheatsheet AI protection របស់ hub បន្ថែមមុំ Zero Trust (SWG/DLP) — ស្រទាប់ខុសពី app នេះ។'),
    ],
    officialDocs: [{ label: t('AI Gateway', 'AI Gateway', 'AI Gateway'), url: CF_AIG }],
  },
  {
    lessonId: 'dp-5-l4',
    role: 'recommended',
    goal: t(
      'RAG: tài liệu trên R2, embeddings Vectorize, retrieve có nguồn — vector search không phải authorization.',
      'RAG: documents on R2, embeddings in Vectorize, sourced retrieve — vector search is not authorization.',
      'RAG៖ documents លើ R2, embeddings ក្នុង Vectorize, retrieve មានប្រភព — vector search មិនមែន authorization។',
    ),
    who: t('Developer RAG', 'RAG developer', 'អ្នកអភិវឌ្ឍ RAG'),
    time: t('~40 phút', '~40 min', '~40 នាទី'),
    finishWith: t(
      'Một document ingest; query trả chunk + nguồn; user không được data chỉ vì nearest neighbor.',
      'One document ingested; a query returns a chunk + source; a user does not get data only because of a nearest neighbor.',
      'Document មួយត្រូវបាន ingest; query ត្រឡប់ chunk + ប្រភព; អ្នកប្រើមិនបានទិន្នន័យគ្រាន់តែព្រោះ nearest neighbor។',
    ),
    beforeYouBegin: t('R2 (dp-3-l3) + Worker AI hoặc provider qua Gateway. Tài liệu không mật (lab).', 'R2 (dp-3-l3) + Worker AI or a provider via Gateway. Non-secret lab documents.', 'R2 (dp-3-l3) + Worker AI ឬ provider តាម Gateway។ Documents lab ដែលមិនសម្ងាត់។'),
    planNote: t('Vectorize có hạn mức; production index tính phí theo dimension/query.', 'Vectorize has limits; production indexes are billed by dimension/query.', 'Vectorize មានដែនកំណត់; production indexes ត្រូវគិតថ្លៃតាម dimension/query។'),
    steps: [
      {
        action: t('Tách ingest và query. Ingest: file → R2 → embed → Vectorize upsert (metadata: path, acl).', 'Split ingest and query. Ingest: file → R2 → embed → Vectorize upsert (metadata: path, acl).', 'បំបែក ingest និង query។ Ingest៖ file → R2 → embed → Vectorize upsert (metadata: path, acl)។'),
        enter: t('npx wrangler vectorize create docs-index --dimensions=<model> --metric=cosine', 'npx wrangler vectorize create docs-index --dimensions=<model> --metric=cosine', 'npx wrangler vectorize create docs-index --dimensions=<model> --metric=cosine'),
      },
      {
        action: t('Query: embed câu hỏi → vector search → filter metadata theo quyền user → chỉ rồi mới gọi model.', 'Query: embed the question → vector search → filter metadata by user ACL → then call the model.', 'Query៖ embed សំណួរ → vector search → filter metadata តាម ACL អ្នកប្រើ → បន្ទាប់មកហៅ model។'),
        checkpoint: t('Câu trả lời có citation (R2 key). User A không retrieve doc của user B dù vector gần.', 'The answer has a citation (R2 key). User A cannot retrieve user B’s doc even if the vector is close.', 'ចម្លើយមាន citation (R2 key)។ User A មិនអាច retrieve doc របស់ user B បានទេ ទោះ vector ជិតក៏ដោយ។'),
      },
    ],
    watchOuts: [
      t('Coi top-k vector là ACL — leak tài liệu nội bộ.', 'Treating top-k vectors as ACL leaks internal documents.', 'ការចាត់ top-k vectors ជា ACL បណ្តាលឱ្យ leak documents ខាងក្នុង។'),
      t('Cache AI Gateway trên RAG gateway — câu trả lời stale/lẫn tenant.', 'Caching AI Gateway on a RAG gateway — stale or cross-tenant answers.', 'Cache AI Gateway លើ RAG gateway — ចម្លើយ stale ឬ cross-tenant។'),
    ],
    tips: [
      t('Bắt đầu một thư mục tài liệu, không phải cả wiki công ty.', 'Start with one document folder, not the whole company wiki.', 'ចាប់ផ្តើមពី folder document មួយ មិនមែន wiki ទាំងក្រុមហ៊ុន។'),
    ],
    officialDocs: [{ label: t('Vectorize', 'Vectorize', 'Vectorize'), url: CF_VEC }],
  },
  {
    lessonId: 'dp-5-l5',
    role: 'recommended',
    goal: t(
      'Agent: tools hẹp, schema input, auth server-side; skill ≠ quyền secret. Agents SDK khi cần state/session.',
      'Agents: narrow tools, input schema, server-side auth; a skill is not secret access. Agents SDK when you need state/session.',
      'Agents៖ tools ចង្អៀត, input schema, auth server-side; skill មិនមែន access សម្ងាត់។ Agents SDK ពេលអ្នកត្រូវការ state/session។',
    ),
    who: t('Developer agent', 'Agent developer', 'អ្នកអភិវឌ្ឍ Agent'),
    time: t('~35 phút', '~35 min', '~35 នាទី'),
    finishWith: t(
      'Một tool (ví dụ “get_order_status”) có schema và check user; không có tool “run_anything”.',
      'One tool (e.g. “get_order_status”) has a schema and a user check; no “run_anything” tool.',
      'Tool មួយ (ឧ. “get_order_status”) មាន schema និងការត្រួតពិនិត្យ user; គ្មាន tool “run_anything”។',
    ),
    beforeYouBegin: t('dp-5-l3 xong. Use case thật sự cần tool (không phải chat tóm tắt).', 'dp-5-l3 done. A real use case that needs a tool (not just summary chat).', 'dp-5-l3 រួចហើយ។ Use case ពិតដែលត្រូវការ tool (មិនមែនត្រឹម chat សង្ខេប)។'),
    steps: [
      {
        action: t('Liệt kê tool tối thiểu. Mỗi tool: tên, JSON schema, authorization, side effect.', 'List the minimum tools. Each tool: name, JSON schema, authorization, side effect.', 'រាយ tools អប្បបរមា។ Tool នីមួយៗ៖ name, JSON schema, authorization, side effect។'),
        checkpoint: t('Không tool nào nhận SQL/shell thô.', 'No tool accepts raw SQL/shell.', 'គ្មាន tool ណាទទួល SQL/shell ឆៅ។'),
      },
      {
        action: t('Implement tool trên Worker (hoặc Agents SDK). Model chỉ được gọi tool đã đăng ký.', 'Implement the tool on the Worker (or Agents SDK). The model may only call registered tools.', 'Implement tool លើ Worker (ឬ Agents SDK)។ Model អាចហៅតែ tools ដែលបានចុះឈ្មោះ។'),
      },
      {
        action: t('Skill/prompt versioned là hướng dẫn — không nhúng API key. Log tool call (dp-4-l1).', 'Versioned skills/prompts are guidance — they do not embed API keys. Log tool calls (dp-4-l1).', 'Skills/prompts មាន version គឺការណែនាំ — ពួកវាមិន embed API keys។ Log tool calls (dp-4-l1)។'),
      },
    ],
    watchOuts: [
      t('Agent tự trị + service token quá rộng — blast radius như admin.', 'An autonomous agent + overly broad service token — blast radius like an admin.', 'Agent ស្វយ័ត + service token ទូលំទូលាយពេក — blast radius ដូច admin។'),
    ],
    tips: [
      t('Durable Objects (dp-6) khi cần session/chat state, không nhét state vào KV global.', 'Durable Objects (dp-6) when you need session/chat state; do not stuff state into global KV.', 'Durable Objects (dp-6) ពេលអ្នកត្រូវការ session/chat state; កុំដាក់ state ចូល global KV។'),
    ],
    officialDocs: [{ label: t('Agents', 'Agents', 'Agents'), url: CF_AGENTS }],
  },
  {
    lessonId: 'dp-6-l1',
    role: 'optional',
    goal: t(
      'Biết khi nào thêm Durable Objects, Queues, Workflows, Hyperdrive — sau khi Worker + storage ổn.',
      'Know when to add Durable Objects, Queues, Workflows, Hyperdrive — after Worker + storage are stable.',
      'ដឹងពេលណាត្រូវបន្ថែម Durable Objects, Queues, Workflows, Hyperdrive — បន្ទាប់ពី Worker + storage មានស្ថិរភាព។',
    ),
    who: t('Developer khi use case đòi hỏi', 'Developer when the use case requires it', 'Developer ពេល use case ត្រូវការ'),
    time: t('~30 phút đọc + lab ngắn một sản phẩm', '~30 min read + a short lab on one product', '~30 នាទីអាន + lab ខ្លីលើផលិតផលមួយ'),
    finishWith: t(
      'Một sản phẩm optional đã map use case; ba cái còn lại “chưa cần”.',
      'One optional product mapped to a use case; the other three are “not yet”.',
      'ផលិតផល optional មួយបាន map ទៅ use case; បីទៀតគឺ “not yet”។',
    ),
    beforeYouBegin: t('Phần 1 và 3 xong. Đừng học cả bốn cùng lúc.', 'Parts 1 and 3 done. Do not learn all four at once.', 'Parts 1 និង 3 រួចហើយ។ កុំរៀនទាំង four ក្នុងពេលតែមួយ។'),
    planNote: t('Durable Objects, Queues, Workflows, Hyperdrive thường cần Workers Paid / giới hạn Free khác nhau — kiểm tra dashboard.', 'Durable Objects, Queues, Workflows, and Hyperdrive usually need Workers Paid / different Free limits — check the dashboard.', 'Durable Objects, Queues, Workflows និង Hyperdrive ជាធម្មតាត្រូវការ Workers Paid / ដែនកំណត់ Free ខុសគ្នា — ពិនិត្យ dashboard។'),
    steps: [
      {
        action: t('Durable Objects: state nhất quán theo object (chat room, booking). SQLite-backed class khi cần query local.', 'Durable Objects: strongly consistent per-object state (chat room, booking). SQLite-backed class when you need local queries.', 'Durable Objects៖ state consistent ខ្លាំងតាម object (chat room, booking)។ Class SQLite-backed ពេលអ្នកត្រូវការ query ក្នុងមូលដ្ឋាន។'),
        see: t(CF_DO, CF_DO),
      },
      {
        action: t('Queues: việc nền, fan-out, retry — không làm HTTP request dài trong Worker.', 'Queues: background work, fan-out, retries — do not hold a long HTTP request in the Worker.', 'Queues៖ ការងារផ្ទៃក្រោយ, fan-out, retries — កុំរក្សា HTTP request វែងក្នុង Worker។'),
        see: t(CF_Q, CF_Q),
      },
      {
        action: t('Workflows: bước dài, durable, sleep/retry có mô hình — onboard/order pipeline.', 'Workflows: long steps, durable, modeled sleep/retry — onboard/order pipelines.', 'Workflows៖ ជំហានវែង, durable, sleep/retry មានគំរូ — onboard/order pipelines។'),
        see: t(CF_WF, CF_WF),
      },
      {
        action: t('Hyperdrive: Postgres/MySQL query nhanh từ Worker (connection pooling). Cần DB public hoặc path VPC.', 'Hyperdrive: faster Postgres/MySQL from a Worker (connection pooling). Needs a public DB or a VPC path.', 'Hyperdrive៖ Postgres/MySQL លឿនជាងពី Worker (connection pooling)។ ត្រូវការ DB សាធារណៈ ឬ path VPC។'),
        see: t(CF_HD, CF_HD),
        checkpoint: t('Bạn chọn đúng một để lab tuần này. Ba cái kia ghi “sau”.', 'You pick exactly one to lab this week. The other three are written down as “later”.', 'អ្នកជ្រើសរើសតែមួយដើម្បី lab សប្តាហ៍នេះ។ បីទៀតសរសេរទុកថា “later”។'),
      },
    ],
    watchOuts: [
      t('Hyperdrive không thay D1 — đó là bridge tới database bên ngoài.', 'Hyperdrive does not replace D1 — it is a bridge to an external database.', 'Hyperdrive មិនជំនួស D1 — វាគឺជា bridge ទៅ database ខាងក្រៅ។'),
    ],
    tips: [
      t('Official course Durable Objects / Workflows trên learning-paths nếu đi sâu.', 'Official Durable Objects / Workflows courses on learning-paths if you go deeper.', 'Courses Durable Objects / Workflows ផ្លូវការលើ learning-paths បើអ្នកចង់ជ្រៅជាង។'),
    ],
    officialDocs: [
      { label: t('Durable Objects', 'Durable Objects', 'Durable Objects'), url: CF_DO },
      { label: t('Queues', 'Queues', 'Queues'), url: CF_Q },
      { label: t('Workflows', 'Workflows', 'Workflows'), url: CF_WF },
      { label: t('Hyperdrive', 'Hyperdrive', 'Hyperdrive'), url: CF_HD },
    ],
  },
  {
    lessonId: 'dp-7-l1',
    role: 'reference',
    goal: t('10 golden rules Developer Platform.', '10 Developer Platform golden rules.', '10 golden rules Developer Platform។'),
    who: t('Mọi developer trên account', 'Every developer on the account', 'Developer គ្រប់រូបលើ account'),
    time: t('15 phút', '15 min', '15 min'),
    finishWith: t('Team đồng ý rule trước khi ship AI/agent.', 'The team agrees the rules before shipping AI/agents.', 'ក្រុមយល់ព្រម rules មុនពេល ship AI/agents។'),
    beforeYouBegin: t('Đã deploy ít nhất một Worker.', 'You have deployed at least one Worker.', 'អ្នកបាន deploy Worker យ៉ាងតិចមួយ។'),
    steps: [
      { action: t('1. App mới: C3 + Worker trước. Pages là compat cho Git site.', '1. New apps: C3 + Worker first. Pages is compat for Git sites.', '1. Apps ថ្មី៖ C3 + Worker មុន។ Pages គឺ compat សម្រាប់ Git sites។') },
      { action: t('2. wrangler.jsonc là source of truth; compatibility_date rõ.', '2. wrangler.jsonc is source of truth; set compatibility_date.', '2. wrangler.jsonc គឺ source of truth; កំណត់ compatibility_date។') },
      { action: t('3. Secret qua wrangler secret — không PUBLIC_*, không commit.', '3. Secrets via wrangler secret — no PUBLIC_*, no commits.', '3. Secrets តាម wrangler secret — គ្មាន PUBLIC_*, គ្មាន commits។') },
      { action: t('4. KV vs D1 vs R2 theo loại dữ liệu, không theo thói quen.', '4. KV vs D1 vs R2 by data type, not habit.', '4. KV vs D1 vs R2 តាមប្រភេទទិន្នន័យ មិនមែនទម្លាប់។') },
      { action: t('5. Migration D1 apply local và remote.', '5. Apply D1 migrations locally and remotely.', '5. Apply D1 migrations locally និង remotely។') },
      { action: t('6. Preview/production env tách; xem build log trước merge.', '6. Split preview/production env; read the build log before merge.', '6. បំបែក preview/production env; អាន build log មុន merge។') },
      { action: t('7. wrangler tail / Observability — đừng debug như server SSH.', '7. wrangler tail / Observability — do not debug like an SSH server.', '7. wrangler tail / Observability — កុំ debug ដូច SSH server។') },
      { action: t('8. Turnstile: verify server-side trước mọi ghi D1.', '8. Turnstile: verify server-side before every D1 write.', '8. Turnstile៖ verify server-side មុន D1 write គ្រប់ដង។') },
      { action: t('9. AI: auth + Gateway; không cache RAG; vector ≠ ACL.', '9. AI: auth + Gateway; no RAG cache; vectors ≠ ACL.', '9. AI៖ auth + Gateway; គ្មាន RAG cache; vectors ≠ ACL។') },
      { action: t('10. Agent tools hẹp, least privilege; optional DO/Queues/Workflows/Hyperdrive sau nền.', '10. Narrow agent tools, least privilege; optional DO/Queues/Workflows/Hyperdrive after the spine.', '10. Agent tools ចង្អៀត, least privilege; optional DO/Queues/Workflows/Hyperdrive បន្ទាប់ពី spine។') },
    ],
    watchOuts: [t('Bắt đầu app mới bằng Pages Functions “vì hub làm vậy” — hub là site nội dung, không phải template API.', 'Starting a new app with Pages Functions “because the hub does” — the hub is a content site, not an API template.', 'ចាប់ផ្តើម app ថ្មីដោយ Pages Functions “ព្រោះ hub ធ្វើដូច្នេះ” — hub គឺជា content site មិនមែន API template។')],
    tips: [t('In rule vào README repo.', 'Paste the rules into the repo README.', 'បិទភ្ជាប់ rules ចូល repo README។')],
    officialDocs: [{ label: t('Workers best practices', 'Workers best practices', 'Workers best practices'), url: 'https://developers.cloudflare.com/workers/best-practices/workers-best-practices/' }],
  },
  {
    lessonId: 'dp-7-l2',
    role: 'reference',
    goal: t('Sổ tay lệnh và path — field-level khi đã hiểu luồng.', 'Command and path runbook — field-level once you know the flow.', 'Command និង path runbook — កម្រិត field ពេលអ្នកស្គាល់លំហូរហើយ។'),
    who: t('Implementer', 'Implementer', 'Implementer'),
    time: t('Tham chiếu', 'Reference', 'ឯកសារយោង'),
    finishWith: t('Copy-paste được lệnh on-ramp.', 'You can copy-paste the on-ramp commands.', 'អ្នកអាច copy-paste commands on-ramp។'),
    beforeYouBegin: t('Đọc dp-7-l1.', 'Read dp-7-l1.', 'អាន dp-7-l1។'),
    steps: [
      { action: t('Scaffold', 'Scaffold', 'Scaffold'), enter: t('npm create cloudflare@latest -- <name>', 'npm create cloudflare@latest -- <name>', 'npm create cloudflare@latest -- <name>') },
      { action: t('Login / dev / deploy', 'Login / dev / deploy', 'Login / dev / deploy'), enter: t('npx wrangler login && npx wrangler dev && npx wrangler deploy', 'npx wrangler login && npx wrangler dev && npx wrangler deploy', 'npx wrangler login && npx wrangler dev && npx wrangler deploy') },
      { action: t('Secret', 'Secret', 'Secret'), enter: t('npx wrangler secret put <NAME>', 'npx wrangler secret put <NAME>', 'npx wrangler secret put <NAME>') },
      { action: t('KV', 'KV', 'KV'), enter: t('npx wrangler kv namespace create FLAGS', 'npx wrangler kv namespace create FLAGS', 'npx wrangler kv namespace create FLAGS') },
      { action: t('D1', 'D1', 'D1'), enter: t('npx wrangler d1 create app-db && npx wrangler d1 migrations apply app-db --local|--remote', 'npx wrangler d1 create app-db && npx wrangler d1 migrations apply app-db --local|--remote', 'npx wrangler d1 create app-db && npx wrangler d1 migrations apply app-db --local|--remote') },
      { action: t('R2', 'R2', 'R2'), enter: t('npx wrangler r2 bucket create app-assets && npx wrangler r2 object put app-assets/<key> --file <path>', 'npx wrangler r2 bucket create app-assets && npx wrangler r2 object put app-assets/<key> --file <path>', 'npx wrangler r2 bucket create app-assets && npx wrangler r2 object put app-assets/<key> --file <path>') },
      { action: t('Observe', 'Observe', 'Observe'), enter: t('npx wrangler tail', 'npx wrangler tail', 'npx wrangler tail') },
      { action: t('Pages Git', 'Pages Git', 'Pages Git'), click: t('Workers & Pages → Create → Pages → Connect to Git → npm run build / dist', 'Workers & Pages → Create → Pages → Connect to Git → npm run build / dist', 'Workers & Pages → Create → Pages → Connect to Git → npm run build / dist') },
      { action: t('Turnstile verify', 'Turnstile verify', 'Turnstile verify'), enter: t('POST https://challenges.cloudflare.com/turnstile/v0/siteverify', 'POST https://challenges.cloudflare.com/turnstile/v0/siteverify', 'POST https://challenges.cloudflare.com/turnstile/v0/siteverify') },
      { action: t('AI binding', 'AI binding', 'AI binding'), enter: t('wrangler.jsonc: "ai": { "binding": "AI" }', 'wrangler.jsonc: "ai": { "binding": "AI" }', 'wrangler.jsonc: "ai": { "binding": "AI" }') },
    ],
    watchOuts: [t('Copy lệnh production vào máy có account sai.', 'Pasting production commands into the wrong account.', 'ការបិទភ្ជាប់ commands production ចូល account ខុស។')],
    tips: [t('Gắn custom domain sau khi Worker ổn trên workers.dev.', 'Attach a custom domain only after the Worker is healthy on workers.dev.', 'ភ្ជាប់ custom domain តែបន្ទាប់ពី Worker មានសុខភាពល្អលើ workers.dev។')],
    officialDocs: [
      { label: t('Wrangler', 'Wrangler', 'Wrangler'), url: CF_WRANGLER },
      { label: t('Get started', 'Get started', 'Get started'), url: CF_WORKERS_GS },
    ],
  },
];
