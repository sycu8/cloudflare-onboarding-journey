import type { RoleRoadmapStep } from '../../types/roadmap';

export type RoleStepEnOverlay = Pick<
  RoleRoadmapStep,
  'objectiveEn' | 'expectedOutcomeEn' | 'exercisesEn'
>;

export const roleStepEnById: Record<string, RoleStepEnOverlay> = {
  'sales-week-1': {
    objectiveEn:
      'Build a basic mental model to explain Cloudflare to non-technical customers — not just DNS.',
    exercisesEn: [
      'Draw User → Cloudflare → Origin and explain it in your own words in 2 minutes.',
      'Read Start Here and write 3 questions customers ask most — compare with the hub.',
      'List 2 business benefits (speed, security, cost) for each track.',
    ],
    expectedOutcomeEn:
      'You can open calls with the "connectivity layer" story instead of listing features.',
  },
  'sales-week-2': {
    objectiveEn:
      'Understand enough to map customer needs (slow site, attacks, exposed API) to the right products.',
    exercisesEn: [
      'Read one "protect website" use case and write a 30-second pitch for an e-commerce customer.',
      'Look up 5 glossary terms: proxy, cache, WAF, bot, rate limiting.',
      'Compare two scenarios: CDN only vs CDN + WAF — note how to tell them apart.',
    ],
    expectedOutcomeEn:
      'You can classify "needs speed" vs "needs security" leads and suggest sensible next steps.',
  },
  'sales-week-3': {
    objectiveEn:
      'Recognize when customers need to build new (serverless) or replace VPN / Zero Trust — without missing opportunities.',
    exercisesEn: [
      'Read the "build serverless app" use case — summarize 3 benefits for a startup CTO.',
      'Read the "replace VPN" use case — list 3 VPN pain points that Cloudflare One addresses.',
      'Pick 1 hypothetical customer (startup / remote enterprise) and suggest the right track.',
    ],
    expectedOutcomeEn:
      'You can qualify customers across all 3 tracks and do not confuse Workers with traditional hosting.',
  },
  'sales-week-4': {
    objectiveEn:
      'Know how to compare plans, use demo guides and the resource hub to move from curiosity to POC or trial.',
    exercisesEn: [
      'Read the Plans page and note when to recommend Pro vs Business for SMB.',
      'Browse Demo Guides — pick 1 demo flow suited to your week-2 customer.',
      'Take the beginner readiness quiz; note 2 weak areas to review before meeting an SE.',
    ],
    expectedOutcomeEn:
      'You have a pre/post demo checklist and know when to invite a Solution Engineer onto the call.',
  },
  'se-week-1': {
    objectiveEn:
      'Build an end-to-end mental model and learn to ask discovery questions before recommending products.',
    exercisesEn: [
      'Draw the request flow from user to origin through Cloudflare — note intervention points (cache, WAF, Workers).',
      'Read 1 Reference Architecture document on Resources and summarize 5 components.',
      'Draft 10 discovery questions for a customer with a website, API, and remote employees.',
    ],
    expectedOutcomeEn:
      'You can describe the overall architecture without jumping straight into detailed configuration.',
  },
  'se-week-2': {
    objectiveEn:
      'Design and explain DNS/proxy/cache configuration for a production website or API.',
    exercisesEn: [
      'Read Application Services track modules 1–2 and map each lesson to 1 design decision.',
      'Look up glossary terms: origin, edge, cache, TTL — write 1 paragraph explaining them to a customer.',
      'Sketch DNS configuration for a domain with www + API subdomain (proxy on/off).',
    ],
    expectedOutcomeEn:
      'You can explain when to enable proxy, which cache rules make sense, and the risks of DNS misconfiguration.',
  },
  'se-week-3': {
    objectiveEn:
      'Recommend protection layers matched to risk level — from basic rules to DDoS and bot mitigation.',
    exercisesEn: [
      'Read the DDoS defense use case — list 3 metrics that prove effectiveness to a customer.',
      'Review the Application Security demo guide — note 5 screens to show in a workshop.',
      'Write a WAF proposal: 3 priority rules for an e-commerce site with a login form.',
    ],
    expectedOutcomeEn:
      'You can distinguish DDoS incidents, bot scraping, and application vulnerabilities — and recommend the right protection layer.',
  },
  'se-week-4': {
    objectiveEn:
      'Design a sound serverless solution — when to use Workers, Pages, KV, D1, and R2.',
    exercisesEn: [
      'Read the deploy static site use case — compare Pages vs traditional hosting on 3 criteria.',
      'Read the build serverless app use case — choose storage (KV/D1/R2) for 2 different scenarios.',
      'Complete the first 2 lessons of the Developer Platform track and note 3 common patterns.',
    ],
    expectedOutcomeEn:
      'You can draw a simple serverless diagram and explain cost vs complexity trade-offs.',
  },
  'se-week-5': {
    objectiveEn:
      'Design secure access for remote users, SaaS, and internal resources without a traditional VPN.',
    exercisesEn: [
      'Read the replace VPN use case — draw before/after: VPN hub vs Zero Trust per-app.',
      'Review the Cloudflare One demo guide — draft a 30-minute demo agenda for an IT manager.',
      'Write 3 sample Access policies: sales team, engineering, contractor.',
    ],
    expectedOutcomeEn:
      'You can present a 2-week Zero Trust pilot roadmap for a 50–200 person organization.',
  },
  'se-week-6': {
    objectiveEn:
      'Combine multiple products into a unified proposal, run a small POC, and prepare handoff documentation.',
    exercisesEn: [
      'Write a 1-page solution proposal: website + API + remote access for a hypothetical customer.',
      'Choose the right Plans tier and explain 3 reasons — not just price.',
      'Take the beginner readiness quiz; build a 15-item pre-go-live checklist.',
    ],
    expectedOutcomeEn:
      'You have a reusable proposal + POC + checklist template for the next customer.',
  },
  'dev-week-1': {
    objectiveEn:
      'Understand request/response and edge vs origin — foundation before writing Workers or deploying Pages.',
    exercisesEn: [
      'Read the Developer Platform section of Cloudflare 101 — note 5 new terms in your notebook.',
      'Look up glossary terms: Worker, edge, origin, KV — explain each in simple terms.',
      'List 3 app types you want to build and match each to Workers vs Pages.',
    ],
    expectedOutcomeEn:
      'You know Workers run at the edge and how they differ from a traditional VPS server.',
  },
  'dev-week-2': {
    objectiveEn:
      'Write a Worker that handles requests, proxies APIs, and applies basic routing patterns.',
    exercisesEn: [
      'Complete the first 3 lessons of the Developer Platform track on Workers.',
      'Read the secure API use case — sketch a Worker in front of origin that validates headers.',
      'Write pseudocode for a Worker: redirect, CORS, and simple cache headers.',
    ],
    expectedOutcomeEn:
      'You can describe Worker code flow from request to response without looking at the dashboard.',
  },
  'dev-week-3': {
    objectiveEn:
      'Distinguish KV (key-value), D1 (SQL), and R2 (object) — choose the right binding for your project.',
    exercisesEn: [
      'Read KV, D1, and R2 product pages — fill in a comparison table: use case, latency, query type.',
      'Design a simple D1 schema for a todo or guestbook app.',
      'Choose storage for an image upload app with metadata — explain why KV alone is not enough.',
    ],
    expectedOutcomeEn:
      'You do not default to D1 for everything — you know when R2 or KV is a better fit.',
  },
  'dev-week-4': {
    objectiveEn:
      'Deploy a static site or small full-stack app with Pages and Functions.',
    exercisesEn: [
      'Read the deploy static site use case — list 5 steps from repo to production.',
      'Complete the Pages lesson in the track — note differences between preview and production.',
      'Sketch repo structure: Pages frontend + API Worker or Functions.',
    ],
    expectedOutcomeEn:
      'You can describe the deploy pipeline from git push to production URL on Pages.',
  },
  'dev-week-5': {
    objectiveEn:
      'Get familiar with stateful edge (Durable Objects) and Workers AI — when to go beyond a stateless Worker.',
    exercisesEn: [
      'Read the Durable Objects product page — name 1 use case that needs state (chat room, counter, lock).',
      'Skim 1 Workers AI tutorial on Developer Docs — summarize the input/output flow.',
      'List 3 things to monitor when a Worker goes to production (errors, latency, quotas).',
    ],
    expectedOutcomeEn:
      'You know when to refactor to Durable Objects instead of cramming logic into a single Worker.',
  },
  'dev-week-6': {
    objectiveEn:
      'Complete a full-stack mini-project, add basic protection, and self-assess production readiness.',
    exercisesEn: [
      'Complete a mini-project: 1 Pages site + 1 API Worker + storage — write a README.',
      'Read the beginner checklist — mark items done and items still missing for your project.',
      'Take the beginner readiness quiz — review wrong answers and update your README.',
    ],
    expectedOutcomeEn:
      'You have 1 portfolio project on Cloudflare and a go-live checklist you can share confidently.',
  },
  'it-week-1': {
    objectiveEn:
      'Understand Cloudflare in your current stack — DNS, proxy, certificates — before touching Zero Trust.',
    exercisesEn: [
      'Draw a traffic diagram: user → current firewall → origin — mark where Cloudflare attaches.',
      'Look up 5 glossary terms: DNS, proxy, origin, certificate, TTL.',
      'List domains/subdomains you manage and classify each as public vs internal.',
    ],
    expectedOutcomeEn:
      'You can explain to your team why changing DNS does not mean "moving hosting".',
  },
  'it-week-2': {
    objectiveEn:
      'Configure DNS safely, cache appropriately, and SSL — reduce incidents from misconfiguration.',
    exercisesEn: [
      'Read the beginner checklist — complete items related to DNS and SSL.',
      'Complete 2 Application Services lessons on DNS and SSL.',
      'Write a 1-page runbook: add a new subdomain with proxy enabled and full SSL cert.',
    ],
    expectedOutcomeEn:
      'You have a reusable DNS/SSL runbook when onboarding a new domain.',
  },
  'it-week-3': {
    objectiveEn:
      'Enable and operate protection layers — WAF rules, DDoS alerts, and basic analytics.',
    exercisesEn: [
      'Read the DDoS defense use case — list 3 alerts to configure.',
      'Review the Application Security demo guide — note the order to enable WAF on a staging site.',
      'Draft 5 priority firewall rules: block country, rate limit login, allow office IP.',
    ],
    expectedOutcomeEn:
      'You have baseline security enabled and know where to check logs when traffic spikes.',
  },
  'it-week-4': {
    objectiveEn:
      'Pilot Access + Gateway for a small group — policies based on identity, not just VPN IP.',
    exercisesEn: [
      'Read Cloudflare One track module 1 — map each step to your internal deployment checklist.',
      'Read the replace VPN use case — write a 10-user pilot plan for 1 week.',
      'Review the Cloudflare One demo guide — capture the flow for adding 1 Access application.',
    ],
    expectedOutcomeEn:
      'You have a Zero Trust pilot plan with owner, timeline, and rollback criteria.',
  },
  'it-week-5': {
    objectiveEn:
      'Standardize operations: compare plans, maintain internal docs, and self-assess before scaling.',
    exercisesEn: [
      'Read Plans — note plan recommendations for your org size and number of domains.',
      'Complete remaining beginner checklist items — export as internal documentation.',
      'Take the beginner readiness quiz; plan 1 week of review for low-scoring areas.',
    ],
    expectedOutcomeEn:
      'You have an operations doc set (runbook + checklist + plan notes) ready for audit or handover.',
  },
  'founder-week-1': {
    objectiveEn:
      'In 1 week, understand what Cloudflare offers startups — ship fast, protect, and scale without a large infra team.',
    exercisesEn: [
      'Write 1 pitch paragraph: what problem does your startup solve — do you need speed, security, or both?',
      'Read 1 use case per track — choose the primary track for the next 6 months.',
      'List 3 risks of having no CDN/WAF from day one (even with just a landing page).',
    ],
    expectedOutcomeEn:
      'You have chosen a primary track and 1 success metric for month one (e.g., time-to-deploy).',
  },
  'founder-week-2': {
    objectiveEn:
      'Get your MVP online with Pages/Workers — prioritize speed over perfection.',
    exercisesEn: [
      'Read the deploy static site use case — plan a 48-hour timeline to put landing + waitlist in production.',
      'Sketch MVP architecture: Pages frontend + 1 Worker endpoint — do not over-engineer.',
      'Complete 2 Developer Platform lessons on Pages/Workers.',
    ],
    expectedOutcomeEn:
      'You have an MVP blueprint deployable in days, without hiring full-time DevOps.',
  },
  'founder-week-3': {
    objectiveEn:
      'Add DNS through Cloudflare, SSL, and basic WAF — avoid incidents when marketing starts.',
    exercisesEn: [
      'Read the beginner checklist — prioritize security items before running ads.',
      'Read the protect website use case — list 5 minimum steps for production.',
      'Write a simple 1-page incident playbook: site down or spam requests.',
    ],
    expectedOutcomeEn:
      'Production domain has SSL + proxy + WAF baseline before scaling marketing.',
  },
  'founder-week-4': {
    objectiveEn:
      'Understand when to upgrade plans, use the resource hub, and self-assess readiness for fundraising or enterprise pilot.',
    exercisesEn: [
      'Read Plans — estimate cost at 10x traffic (Workers requests, bandwidth).',
      'Take the beginner readiness quiz — identify knowledge gaps before hiring an engineer.',
      'Write a 3-month roadmap: next feature + Cloudflare products to add.',
    ],
    expectedOutcomeEn:
      'You have a projected cost table and a product–infrastructure roadmap aligned with your startup stage.',
  },
  'student-week-1': {
    objectiveEn:
      'Build foundations: how web requests work and where Cloudflare sits — learn systematically, not by rote.',
    exercisesEn: [
      'Read Start Here and Cloudflare 101 — summarize 5 key points in your own words.',
      'Look up 8 glossary terms — write 1 everyday example sentence for each.',
      'Draw a diagram of what happens when you open a website in a browser — label DNS and CDN.',
    ],
    expectedOutcomeEn:
      'You can explain to a classmate how Cloudflare differs from hosting.',
  },
  'student-week-2': {
    objectiveEn:
      'Pick 1 of 3 tracks based on interest (web, code, networking) and complete module 1 with notes.',
    exercisesEn: [
      'Read the "who is this for" section of all 3 tracks — pick 1 and explain why.',
      'Complete all of module 1 on your chosen track — write 1 page of notes.',
      'Read 1 use case related to your track — list 3 skills you still need to learn.',
    ],
    expectedOutcomeEn:
      'You have a primary track, module 1 notes, and a list of skills to learn next.',
  },
  'student-week-3': {
    objectiveEn:
      'Apply theory to a concrete scenario — read a use case, look up products, and open official docs.',
    exercisesEn: [
      'Pick 1 end-to-end use case — write a 200-word summary: problem, solution, products used.',
      'Read 2 related product pages — compare when to use each.',
      'Open 1 Developer Docs link from Resources — follow a short tutorial or read carefully for 15 minutes.',
    ],
    expectedOutcomeEn:
      'You have 1 use case summary suitable for a portfolio or class report.',
  },
  'student-week-4': {
    objectiveEn:
      'Self-assess, complete the checklist, and plan next steps (certification, project, internship).',
    exercisesEn: [
      'Take the beginner readiness quiz — record your score and 3 topics to review.',
      'Complete the beginner checklist — capture which items you checked off.',
      'Write a 4-week plan: 1 small project + 2 Developer Docs tutorials.',
    ],
    expectedOutcomeEn:
      'You have a portfolio outline, quiz score, and a clear learning path after 4 weeks.',
  },
};
