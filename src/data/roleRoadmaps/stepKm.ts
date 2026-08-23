import type { RoleRoadmapStep } from '../../types/roadmap';

export type RoleStepKmOverlay = Pick<
  RoleRoadmapStep,
  'objectiveKm' | 'expectedOutcomeKm' | 'exercisesKm'
>;

export const roleStepKmById: Record<string, RoleStepKmOverlay> = {
  'sales-week-1': {
    objectiveKm:
      'បង្កើត mental model មូលដ្ឋានដើម្បីពន្យល់ Cloudflare ទៅអតិថិជនមិនបច្ចេកទេស — មិនមែនតែ DNS ប៉ុណ្ណោះ។',
    expectedOutcomeKm:
      'អ្នកអាចចាប់ផ្តើមការហៅជាមួយរឿង "connectivity layer" ជំនួសការរាយ feature។',
    exercisesKm: [
      'គូររូប User → Cloudflare → Origin ហើយពន្យល់ដោយពាក្យផ្ទាល់ក្នុង 2 នាទី។',
      'អាន Start Here ហើយសរសេរ 3 សំណួរដែលអតិថិជនសួរញឹកញាប់ — ប្រៀបធៀបជាមួយ hub។',
      'រាយអត្ថប្រយោជន៍អាជីវកម្ម 2 (ល្បឿន, សុវត្ថិភាព, ថ្លៃដើម) សម្រាប់ track នីមួយៗ។',
    ],
  },
  'sales-week-2': {
    objectiveKm:
      'យល់គ្រប់គ្រាន់ដើម្បី map តម្រូវការអតិថិជន (site យឺត, ការវាយប្រហារ, API exposed) ទៅ product ត្រឹមត្រូវ។',
    expectedOutcomeKm:
      'អ្នកអាចចាត់ថ្នាក់ lead "ត្រូវការល្បឿន" ធៀបនឹង "ត្រូវការសុវត្ថិភាព" ហើយស្នើជំហានបន្ទាប់ដែលសមហេតុផល។',
    exercisesKm: [
      'អាន use case "protect website" មួយ ហើយសរសេរ pitch 30 វិនាទីសម្រាប់អតិថិជន e-commerce។',
      'ស្វែងរក glossary 5 ពាក្យ៖ proxy, cache, WAF, bot, rate limiting។',
      'ប្រៀបធៀប 2 scenario៖ CDN តែមួយ vs CDN + WAF — កត់ត្រារបៀបញែកចែកពួកគ្នា។',
    ],
  },
  'sales-week-3': {
    objectiveKm:
      'ស្គាល់ពេលអតិថិជនត្រូវការបង្កើតថ្មី (serverless) ឬជំនួស VPN / Zero Trust — ដោយមិនបាត់ឱកាស។',
    expectedOutcomeKm:
      'អ្នកអាច qualify អតិថិជនឆ្លងកាត់ 3 tracks ទាំងអស់ ហើយកុំច្រឡំ Workers ជាមួយ traditional hosting។',
    exercisesKm: [
      'អាន use case "build serverless app" — សង្ខេបអត្ថប្រយោជន៍ 3 សម្រាប់ startup CTO។',
      'អាន use case "replace VPN" — រាយ 3 pain point របស់ VPN ដែល Cloudflare One ដោះស្រាយ។',
      'ជ្រើសអតិថិជន hypothetical 1 (startup / remote enterprise) ហើយស្នើ track សមស្រប។',
    ],
  },
  'sales-week-4': {
    objectiveKm:
      'ដឹងរបៀប compare plan, ប្រើ demo guides និង resource hub ដើម្បីផ្លាស់ទីពី curiosity ទៅ POC ឬ trial។',
    expectedOutcomeKm:
      'អ្នកមាន demo script មុន/ក្រោយ និង checklist ប្រកាស — ដឹងពេលណាអញ្ជើញ Solution Engineer ចូលការហៅទូរសព្ទ។',
    exercisesKm: [
      'អានទំព័រ Plans ហើយចំណាំពេលណាណែនាំ Pro ធៀប Business សម្រាប់ SMB។',
      'រុករក Demo Guides — ជ្រើស flow demo 1 ដែលសមនឹងអតិថិជន week-2 របស់អ្នក។',
      'ធ្វើ beginner readiness quiz; ចំណាំ 2 ចំណុចខ្សោយដើម្បី review មុនជួប SE។',
    ],
  },
  'se-week-1': {
    objectiveKm: 'បង្កើត mental model ពេញលេញ ហើយរៀនសួរ discovery question មុនណែនាំ product។',
    expectedOutcomeKm:
      'អ្នកអាចពណ៌នាស្ថាបត្យកម្មទាំងមូលដោយមិនចាំបាច់ចូល configuration detail។',
    exercisesKm: [
      'គូរលំហូ request ពី user ទៅ origin តាម Cloudflare — ចំណាំចំណុចបម្លែង (cache, WAF, Workers)។',
      'អាន Reference Architecture doc 1 នៅ Resources ហើយសង្ខេប component 5។',
      'សរសេរ discovery question 10 សម្រាប់អតិថិជនដែលមាន website, API និង remote user។',
    ],
  },
  'se-week-2': {
    objectiveKm: 'រចនា និងពន្យល់ DNS/proxy/cache configuration សម្រាប់ website ឬ API production។',
    expectedOutcomeKm:
      'អ្នកអាចពន្យល់ពេលណា enable proxy, cache rule មានហេតុផល និងហានិភ័យ DNS misconfiguration។',
    exercisesKm: [
      'អាន Application Services track module 1–2 ហើយ map lesson នីមួយទៅ design decision 1។',
      'ស្វែងរក glossary៖ origin, edge, cache, TTL — សរសេរកថាខណ្ឌ 1 ពន្យល់ទៅអតិថិជន។',
      'គូររូប DNS config domain ជាមួយ www + API subdomain (proxy on/off)។',
    ],
  },
  'se-week-3': {
    objectiveKm:
      'ណែនាំ protection layer ដែល match កម្រិតហានិភ័យ — ពី rule មូលដ្ឋាន ទៅ DDoS និង bot mitigation។',
    expectedOutcomeKm:
      'អ្នកអាបំបែក DDoS incident, bot scraping និង app vulnerability — ហើយណែនាំ protection layer ត្រឹមត្រូវ។',
    exercisesKm: [
      'អាន DDoS defense use case — រាយ metric 3 ដែលបង្ហាញអត្ថប្រយោជន៍ដល់អតិថិជន។',
      'ពិនិត្យ Application Security demo guide — ចំណាំ screen 5 សម្រាប់ workshop demo។',
      'សរសេរ WAF proposal៖ rule priority 3 សម្រាប់ e-commerce site ដែលមាន login form។',
    ],
  },
  'se-week-4': {
    objectiveKm: 'រចនា serverless solution ដែលសមរម្យ — ពេលណាប្រើ Workers, Pages, KV, D1, R2។',
    expectedOutcomeKm:
      'អ្នកអាចគូដ្យាក្រាម serverless សាមញ្ញ ហើយពន្យល់ trade-off ធៀបនឹង complexity។',
    exercisesKm: [
      'អាន deploy static site use case — compare Pages ធៀប traditional hosting តាម criteria 3។',
      'អាន serverless app use case — ជ្រើស storage (KV/D1/R2) សម្រាប់ 2 scenario។',
      'បញ្ចប់ 2 lesson ដើម Developer Platform track ហើយចំណាំ pattern 3។',
    ],
  },
  'se-week-5': {
    objectiveKm:
      'រចនា secure access សម្រាប់ remote user, SaaS និង internal resource ដោយគ្មាន traditional VPN។',
    expectedOutcomeKm:
      'អ្នកអាច present Zero Trust pilot roadmap 2 សប្តាហ៍ សម្រាប់ organization 50–200 នាក់។',
    exercisesKm: [
      'អាន replace VPN use case — គូរមុន/ក្រោយ៖ VPN hub vs Zero Trust per-app។',
      'ពិនិត្យ Cloudflare One demo guide — draft agenda trial 30 នាទីសម្រាប់ IT manager។',
      'សរសេរ Access policy template 3៖ sales team, engineering, contractor។',
    ],
  },
  'se-week-6': {
    objectiveKm:
      'រួម product ច្រើនទៅ proposal តែមួយ, run POC តូច ហើយរៀបចំ handoff documentation។',
    expectedOutcomeKm: 'អ្នកមាន proposal + POC + checklist template សម្រាប់អតិថិជនបន្ទាប់។',
    exercisesKm: [
      'សរសេរ solution proposal 1 ទំព័រ៖ website + API + remote access សម្រាប់ hypothetical customer។',
      'ជ្រើស Plans tier ត្រឹមត្រូវ ហើយពន្យល់ហេតុផល 3 — មិនមែនតែតម្លៃទេ។',
      'ធ្វើ beginner readiness quiz; បង្កើត go-live checklist 15 ធាតុ។',
    ],
  },
  'dev-week-1': {
    objectiveKm:
      'យល់ request/response និង edge vs origin — មូលដ្ឋានមុនសរសេរ Worker ឬ deploy Pages។',
    expectedOutcomeKm:
      'អ្នកដឹង Worker run នៅ edge ហើយវាខុសពី VPS server ធម្មតា។',
    exercisesKm: [
      'អាន Developer Platform section នៃ Cloudflare 101 — ចំណាំ term 5 ថ្មីក្នុង notebook។',
      'ស្វែងរក glossary៖ Worker, edge, origin, KV — ពន្យល់នីមួយៗដោយពាក្យសាមញ្ញ។',
      'រាយ app type 3 ដែលអ្នកចង់បង្កើត ហើយ match នីមួយទៅ Workers vs Pages។',
    ],
  },
  'dev-week-2': {
    objectiveKm:
      'សរសេរ Worker handle request, proxy API និង routing pattern មូលដ្ឋាន។',
    expectedOutcomeKm:
      'អ្នកអាចពណ៌នាលំហូ code Worker ពី request ទៅ response ដោយមិនមើល dashboard។',
    exercisesKm: [
      'បញ្ចប់ 3 lesson ដើម Developer Platform track អំពី Workers។',
      'អាន secure API use case — sketch Worker មុខ origin validate header។',
      'សរសេរ pseudocode Worker៖ redirect, CORS និង cache header សាមញ្ញ។',
    ],
  },
  'dev-week-3': {
    objectiveKm:
      'បំបែក KV (key-value), D1 (SQL), R2 (object) — ជ្រើស binding ត្រឹមត្រូវសម្រាប់ project។',
    expectedOutcomeKm:
      'អ្នកមិន default ទៅ D1 សម្រាប់អ្វីគ្រប់យ៉ាង — ដឹងពេល R2 ឬ KV សមជាង។',
    exercisesKm: [
      'អាន product page KV, D1, R2 — បំពេញតារាង compare៖ use case, latency, query type។',
      'រចនា D1 schema សាមញ្ញសម្រាប់ app ដែលអ្នកចង់បង្កើត (ឧ. guestbook)។',
      'ជ្រើស storage សម្រាប់ image upload app ជាមួយ metadata — ពន្យល់ហេតុ KV តែម្នាក់ឯងមិនគ្រប់គ្រាន់។',
    ],
  },
  'dev-week-4': {
    objectiveKm: 'Deploy static site ឬ full-stack app តូចជាមួយ Pages និង Functions។',
    expectedOutcomeKm:
      'អ្នកអាចពណ៌នា deploy pipeline ពី git push ទៅ production URL នៅ Pages។',
    exercisesKm: [
      'អាន deploy static site use case — រាយជំហាន 5 ពី repo ទៅ production។',
      'បញ្ចប់ Pages lesson ក្នុង track — ចំណាំភាពខុសគ្នា preview vs production។',
      'គូររូប repo structure៖ Pages frontend + API Worker/Functions។',
    ],
  },
  'dev-week-5': {
    objectiveKm:
      'ស្គាល់ stateful edge (Durable Objects) និង Workers AI — ពេលណាលើស stateless Worker។',
    expectedOutcomeKm:
      'អ្នកអាចពណ៌នាពេលណា Durable Objects ឬ Workers AI សមស្របសម្រាប់ app idea របស់អ្នក។',
    exercisesKm: [
      'អាន Durable Objects product page — រាយ use case 3 (chat, counter, coordination)។',
      'អាន Workers AI doc — sketch flow៖ user input → AI inference → response។',
      'ជ្រើស project idea 1 ហើយ map component (Worker, DO, AI, Vectorize)។',
    ],
  },
  'dev-week-6': {
    objectiveKm:
      'បញ្ចប់ capstone project, apply security basics (WAF awareness) និង deploy checklist។',
    expectedOutcomeKm:
      'អ្នកមាន project deployed URL + README ពន្យល់ architecture និង next step។',
    exercisesKm: [
      'Deploy capstone project ទៅ Pages ឬ Workers — បង្ហាញ URL preview។',
      'ពិនិត្យ WAF managed rule សម្រាប់ project — ចំណាំ rule 2 ដែល relevant។',
      'ធ្វើ beginner readiness quiz; សរសេរ post-mortem 1 ទំព័រ៖ អ្វីដែលរៀនបាន vs ត្រូវការរៀនបន្ថែម។',
    ],
  },
  'it-week-1': {
    objectiveKm:
      'យល់ traffic flow Cloudflare, DNS/proxy basics និង account structure សម្រាប់ admin day-to-day។',
    expectedOutcomeKm:
      'អ្នកអាចពន្យល់ orange cloud vs gray cloud ដល់ stakeholder មិនបច្ចេកទេស។',
    exercisesKm: [
      'អាន IT Admin track module 1 — ចំណាំ task admin 5 (DNS, SSL, member, audit log)។',
      'ពិនិត្យ DNS table domain test — កត់ record ណា proxied vs DNS-only។',
      'គូររូប traffic flow៖ user → Cloudflare → origin ជាមួយ SSL mode label។',
    ],
  },
  'it-week-2': {
    objectiveKm: 'Configure DNS, SSL/TLS mode, cache និង redirect rule សម្រាប់ production domain។',
    expectedOutcomeKm:
      'អ្នកអាច onboard domain ថ្មី និង verify HTTPS + cache behavior ដោយមិន break mail/API។',
    exercisesKm: [
      'Walk through add-site flow Cloudflare — កត់ត្រា NS change និង SSL mode ដែលជ្រើស។',
      'កំណត់ Page Rule ឬ Redirect Rule 1 — ពិនិត្យ HTTP→HTTPS redirect។',
      'ពិនិត្យ cache rule 1 សម្រាប់ static asset — verify CF-Cache-Status header។',
    ],
  },
  'it-week-3': {
    objectiveKm:
      'Enable WAF, review DDoS event, firewall rule និង bot signal — incident response មូលដ្ឋាន។',
    expectedOutcomeKm:
      'អ្នកអាច triage security alert និង decide escalate vs self-serve rule change។',
    exercisesKm: [
      'អាន WAF managed ruleset doc — ចំណាំ category 3 (OWASP, CVE, sensitive path)។',
      'Simulate (ឬអាន) DDoS event report — រាយ action 3 ក្នុង runbook។',
      'បង្កើត firewall rule block country/IP range test — document rollback plan។',
    ],
  },
  'it-week-4': {
    objectiveKm:
      'Deploy Zero Trust pilot៖ Access policy, Gateway rule, Tunnel ឬ WARP client សម្រាប់ team តូច។',
    expectedOutcomeKm:
      'អ្នកមាន pilot scope document + 1 internal app accessible via Access (ឬ plan documented)។',
    exercisesKm: [
      'អាន Zero Trust getting started — រាយ component 4 (Access, Gateway, Tunnel, WARP)។',
      'Draft Access policy 1 សម្រាប់ internal tool (email domain + MFA)។',
      'ពិនិត្យ Tunnel doc — compare inbound port open vs cloudflared outbound។',
    ],
  },
  'it-week-5': {
    objectiveKm:
      'Plan sizing, runbook, resource hub navigation និង knowledge check មុន production rollout ធំ។',
    expectedOutcomeKm:
      'អ្នកមាន runbook draft + plan tier recommendation សម្រាប់ org size របស់អ្នក។',
    exercisesKm: [
      'Compare plan Free/Pro/Business — ណែនាំ tier 1 សម្រាប់ org hypothetical។',
      'សរសេរ incident runbook 1 ទំព័រ៖ site down, SSL error, DDoS spike។',
      'ធ្វើ beginner readiness quiz; bookmark resource hub link 5 សម្រាប់ team។',
    ],
  },
  'founder-week-1': {
    objectiveKm:
      'Prioritize startup need (speed, cost, security) និង map ទៅ Cloudflare track 3 — build vs buy។',
    expectedOutcomeKm:
      'អ្នកអាចពន្យល់ហេតុអ្វី Cloudflare fit startup MVP vs waiting on dedicated infra team។',
    exercisesKm: [
      'អាន startup founder track intro — ចំណាំ milestone 3 (launch, scale, secure)។',
      'រាយ product need 3 (landing page, API, team access) — match track/layer។',
      'គូររូប simple architecture MVP ជាមួយ Pages + Workers + Access optional។',
    ],
  },
  'founder-week-2': {
    objectiveKm: 'Launch landing page + API តូចជាមួយ Pages/Workers free tier — time-to-market focus។',
    expectedOutcomeKm: 'អ្នកមាន live URL (preview ឬ custom domain) ហើយដឹង cost driver free tier។',
    exercisesKm: [
      'Deploy static site ទៅ Pages ពី template — share preview URL។',
      'Add Worker route 1 (form handler ឬ API stub) — test curl request។',
      'អាន pricing page — កត់ត្រា limit 2 ដែល affect growth path។',
    ],
  },
  'founder-week-3': {
    objectiveKm: 'Add DNS, SSL, WAF managed rule និង DDoS protection សម្រាប់ public launch។',
    expectedOutcomeKm:
      'អ្នក confident site protected baseline មុន marketing push — ដឹង uptime monitoring option។',
    exercisesKm: [
      'Point custom domain ទៅ Pages/Workers — verify HTTPS green lock។',
      'Enable proxied DNS + review SSL mode — document choice Full vs Full (strict)។',
      'Review WAF managed rules ON — កត់ត្រា rule category 2 relevant e-commerce/login។',
    ],
  },
  'founder-week-4': {
    objectiveKm:
      'Compare plan, analytics, next feature roadmap — prepare investor/customer demo narrative។',
    expectedOutcomeKm:
      'អ្នកមាន 5-minute demo script + plan upgrade trigger (traffic, seat, feature) documented។',
    exercisesKm: [
      'Walk plan comparison table — choose tier at 10x traffic hypothetical។',
      'Review Web Analytics ឬ dashboard metric 3 — tie to business KPI 1។',
      'សរសេរ "next 3 Cloudflare features" backlog aligned product roadmap។',
    ],
  },
  'student-week-1': {
    objectiveKm:
      'Build study habit — HTTP/DNS basics, edge vs origin, glossary navigation — foundation week។',
    expectedOutcomeKm:
      'អ្នកអាចពន្យល់ client-server + DNS lookup flow ដោយពាក្យផ្ទាល់ (quiz-ready)។',
    exercisesKm: [
      'Complete Cloudflare 101 terminology tab 1 — flashcard term 5។',
      'Draw browser → DNS → origin diagram — label step 4។',
      'Bookmark glossary + start-here — set weekly study slot calendar។',
    ],
  },
  'student-week-2': {
    objectiveKm: 'Choose track (Application Services / Developer / Cloudflare One) និង start lesson 1។',
    expectedOutcomeKm:
      'អ្នកមាន learning journal entry 1 + track choice rationale 3 bullet។',
    exercisesKm: [
      'Take path selector / read choose-your-path — commit track 1 with reason។',
      'Complete lesson 1 first module chosen track — summary paragraph 1។',
      'Preview use case 1 in track — note product name 3 new to you។',
    ],
  },
  'student-week-3': {
    objectiveKm:
      'Deep dive use case + product page + official doc link — connect theory to real deployment story។',
    expectedOutcomeKm:
      'អ្នកអាច present use case 2-minute summary to peer (recorded or written)។',
    exercisesKm: [
      'Study use case 1 end-to-end — list Cloudflare product 4 used។',
      'Read product page 2 deep dive — compare feature list to use case needs។',
      'Follow official doc link 1 from tutorial preview — note command/snippet 2។',
    ],
  },
  'student-week-4': {
    objectiveKm:
      'Self-assessment, checklist, portfolio note — plan next month learning path។',
    expectedOutcomeKm:
      'អ្នកមាន quiz score + checklist progress + written next-step plan (cert, project, internship prep)។',
    exercisesKm: [
      'Complete beginner readiness quiz — review wrong answers explanation។',
      'Finish beginner checklist 50%+ items — screenshot or list completed។',
      'Write portfolio blurb 1 paragraph៖ "What I learned about Cloudflare this month"។',
    ],
  },
};
