import type { ContentRoadmapTopic } from '../../types/roadmap';

export type TopicEnOverlay = Pick<
  ContentRoadmapTopic,
  'summaryEn' | 'whyItMattersEn' | 'suggestedExerciseEn' | 'commonMistakesEn'
>;

export const topicEnById: Record<string, Partial<TopicEnOverlay>> = {
  // Stage 0 — Internet & Network Foundations
  'internet-basics': {
    summaryEn:
      'The Internet is a global network connecting billions of devices through shared physical infrastructure and protocols. You do not connect to a single server — your request travels through many networks before reaching its destination.',
    whyItMattersEn:
      'Every Cloudflare product sits on Internet traffic flows — understanding the foundation helps you avoid confusing Cloudflare with hosting or an ISP.',
    suggestedExerciseEn:
      'Draw a diagram: your device → home router → ISP → Internet → destination server.',
    commonMistakesEn: ['Thinking the Internet equals Wi‑Fi or is run by a single company.'],
  },
  'client-server': {
    summaryEn:
      'A client (browser, app) sends a request; a server receives it, processes it, and returns a response. Every web page, API, and video stream follows this model.',
    whyItMattersEn:
      'Cloudflare sits between the client and the origin server — you need to know who sends what and who responds to understand proxy, cache, and WAF.',
    commonMistakesEn: [
      'Assuming "server" only means a physical machine — a server can be a cloud service or a Worker.',
    ],
  },
  'ip-address': {
    summaryEn:
      'An IP address is a numeric identifier devices use to find each other on a network (for example, IPv4 like 192.0.2.1). DNS later maps domain names to IP addresses.',
    whyItMattersEn:
      'When debugging DNS, firewall rules, or origin protection, you often work with IPs — especially A/AAAA records and allowlists.',
    commonMistakesEn: ['Assuming every website has one fixed IP address forever.'],
  },
  port: {
    summaryEn:
      'A port is a logical endpoint on an IP address that distinguishes services (HTTP typically uses 80, HTTPS 443). The same IP can run multiple apps on different ports.',
    whyItMattersEn:
      'Load balancing, firewall rules, and tunnels often reference ports — understanding ports helps you configure origins and health checks correctly.',
    commonMistakesEn: ['Opening too many public ports "for convenience" when they are not needed.'],
  },
  protocol: {
    summaryEn:
      'A protocol is a shared set of rules for two parties to communicate (HTTP, DNS, TLS, and others). Without a common protocol, client and server cannot understand each other.',
    whyItMattersEn:
      'Cloudflare operates at many protocol layers — HTTP cache, TLS termination, DNS proxy — so you need to know each protocol name and role.',
  },
  'tcp-udp': {
    summaryEn:
      'TCP ensures data arrives completely and in order (web, email); UDP prioritizes speed and accepts packet loss (streaming, DNS queries).',
    whyItMattersEn:
      'DDoS mitigation and L4 firewalls distinguish TCP/UDP floods — understanding the difference helps you read attack reports and network rules.',
    commonMistakesEn: ['Thinking UDP is "worse" than TCP — each fits different use cases.'],
  },
  'http-https-basics': {
    summaryEn:
      'HTTP is the protocol for web pages and APIs; HTTPS adds TLS encryption. Requests have a method (GET, POST), headers, and body; responses have status codes.',
    whyItMattersEn:
      'Most traffic through Cloudflare is HTTP/S — cache, WAF, rate limiting, and SSL/TLS mode all operate on HTTP requests.',
    suggestedExerciseEn:
      'Open DevTools → Network, reload a page, and note the method, status, and Host header.',
    commonMistakesEn: ['Only caring about status 200 while ignoring 301/302 redirects or 4xx/5xx errors.'],
  },
  'browser-website-flow': {
    summaryEn:
      'The browser parses the URL, looks up DNS for an IP, establishes TCP/TLS, sends an HTTP request, receives HTML, then loads CSS, JS, and images. Each step can fail or slow down independently.',
    whyItMattersEn:
      'When a site is slow or has SSL errors, you need to know whether the problem is DNS, TLS, or origin — Cloudflare analytics and trace follow this same flow.',
    commonMistakesEn: ['Blaming Cloudflare immediately without identifying which step in the chain failed.'],
  },
  'latency-bandwidth-routing': {
    summaryEn:
      'A packet is a small unit of data on the network; routing chooses the path; latency is delay and bandwidth is capacity. A CDN reduces latency by serving content closer to users.',
    whyItMattersEn:
      'Cloudflare edge and cache optimize latency — understanding these metrics helps you read dashboards and justify CDN value to customers.',
    commonMistakesEn: ['Confusing high bandwidth with low latency — they are independent concepts.'],
  },
  'osi-tcpip-model': {
    summaryEn:
      'Layered models help you place problems correctly: physical, network (IP), transport (TCP/UDP), application (HTTP/DNS). You do not need to memorize them — just know "which layer is failing".',
    whyItMattersEn:
      'WAF is L7, DDoS spans L3/L4/L7, DNS is application layer — mapping the right layer helps you escalate and pick the right Cloudflare product.',
    commonMistakesEn: ['Trying to memorize all 7 OSI layers instead of using the model to troubleshoot.'],
  },
  'public-private-ip': {
    summaryEn:
      'Private IPs (10.x, 192.168.x, and similar) are used on internal LANs; public IPs are reachable from the Internet. NAT often hides private IPs behind a router.',
    whyItMattersEn:
      'Real origins often have private IPs — Cloudflare proxy hides the public origin; Tunnel connects private services to the edge securely.',
    commonMistakesEn: ['Publishing a private IP directly in public DNS.'],
  },
  nat: {
    summaryEn:
      'Network Address Translation lets many internal devices share one public IP to reach the Internet. Home routers and enterprise firewalls commonly perform NAT.',
    whyItMattersEn:
      'Understanding NAT explains why origin IPs should not be exposed and why Tunnel/WARP are useful for internal networks.',
    commonMistakesEn: ['Thinking NAT replaces a firewall — NAT only translates addresses, it does not filter policy.'],
  },
  'firewall-reverse-proxy': {
    summaryEn:
      'A firewall filters traffic by rules (IP, port, protocol). A reverse proxy sits in front of a server, receives requests on its behalf, and forwards them — it can cache, terminate TLS, and run a WAF.',
    whyItMattersEn:
      'Cloudflare operates as a global reverse proxy — this is the core mental model before enabling the orange cloud.',
    commonMistakesEn: [
      'Confusing reverse proxy with forward proxy (browser VPN).',
      'Disabling all internal firewalls because "Cloudflare is already there".',
    ],
  },

  // Stage 1 — DNS & Domain Basics
  'domain-basics': {
    summaryEn:
      'A domain is a memorable name instead of an IP — for example, example.com. A registrar manages ownership; DNS points the domain to the actual service.',
    whyItMattersEn:
      'The first step to onboard Cloudflare is adding a domain and managing a zone — without understanding domains, you confuse registrar, nameserver, and hosting.',
    commonMistakesEn: ['Thinking buying a domain means you already have a website — a domain is only a name; DNS and hosting are separate.'],
  },
  'how-dns-works': {
    summaryEn:
      'When you type a URL, a resolver queries a chain of nameservers from root → TLD → authoritative zone to get an IP or other record. It happens in milliseconds but involves caching.',
    whyItMattersEn:
      'Cloudflare can be authoritative DNS and a proxy — understanding the query flow helps debug "site is unreachable".',
    suggestedExerciseEn: 'Use `dig` or dnschecker.org to look up the A record of a domain you know.',
    commonMistakesEn: ['Changing DNS and expecting the change to appear instantly on every machine.'],
  },
  'recursive-vs-authoritative': {
    summaryEn:
      'A recursive resolver (ISP, 1.1.1.1) gathers answers for the user; an authoritative nameserver gives the official answer for a zone (for example, a zone on Cloudflare).',
    whyItMattersEn:
      'Cloudflare 1.1.1.1 is a public recursive resolver; customer zone DNS is authoritative — these are two different roles.',
    commonMistakesEn: ['Mixing up Cloudflare zone nameservers with the DNS resolver on your laptop.'],
  },
  'dns-record-types': {
    summaryEn:
      'A/AAAA point a hostname to an IP; CNAME aliases to another name; MX handles mail; TXT holds verification/metadata; NS specifies zone nameservers. Each type serves a different purpose.',
    whyItMattersEn:
      'One wrong record can break mail, SSL, or subdomains — reviewing the DNS table is the first exercise in the Application Services track.',
    commonMistakesEn: ['Proxying MX records or using CNAME at the apex without understanding CNAME flattening.'],
  },
  'dns-ttl': {
    summaryEn:
      'TTL (Time To Live) tells resolvers how long to cache a record before asking again. A low TTL means faster changes but more queries.',
    whyItMattersEn:
      'When migrating DNS or changing origin IP, TTL affects propagation time — Cloudflare recommends lowering TTL before cutover.',
    commonMistakesEn: ['Leaving TTL at 86400 then changing IP in an emergency — you must wait for old cache to expire.'],
  },
  'dns-propagation': {
    summaryEn:
      'Propagation is how long resolvers worldwide update their cache after you change a record. It is not magic spreading — old caches expire per TTL and then re-query.',
    whyItMattersEn:
      'Reduces panic when customers report "some places work, some do not" after changing nameservers.',
    commonMistakesEn: ['Changing nameservers repeatedly within a few hours — it makes cache state even messier.'],
  },
  subdomain: {
    summaryEn:
      'A subdomain is the part before the root domain — api.example.com, www.example.com. Each subdomain can have its own records and policies on Cloudflare.',
    whyItMattersEn:
      'Teams often split app, API, and admin by subdomain — you need to know which records to proxy and which rules apply to which hostname.',
  },
  nameserver: {
    summaryEn:
      'A nameserver is the authoritative server that answers DNS for a zone. When you point NS at the registrar to Cloudflare, Cloudflare becomes where you manage records.',
    whyItMattersEn:
      'Onboarding a domain means changing NS or using partial setup — understanding NS avoids confusing it with A records or a hosting control panel.',
    suggestedExerciseEn: 'Compare current NS at the registrar with the NS Cloudflare provides when adding a site.',
    commonMistakesEn: ['Adding a zone in Cloudflare but not updating NS at the registrar.'],
  },
  'dns-only-vs-proxied': {
    summaryEn:
      'Proxied (orange cloud): HTTP/S traffic goes through Cloudflare — cache, WAF, hidden origin IP. DNS only (gray): returns DNS only, no proxy.',
    whyItMattersEn:
      'This is the most important architecture decision on day one — wrong proxy on MX or internal records causes production incidents.',
    commonMistakesEn: ['Proxying every record "to be safe" — mail and some services must stay DNS only.'],
  },
  'common-dns-mistakes': {
    summaryEn:
      'Common issues: duplicate records, wrong CNAME chains, missing SPF/DKIM, accidental proxy, TTL too high during migration, confusing apex vs www.',
    whyItMattersEn:
      'Summarizing real-world mistakes helps you use checklists and write support tickets more effectively.',
    suggestedExerciseEn: 'Review the DNS table of a real domain and note 3 records that should be proxied vs DNS only.',
    commonMistakesEn: ['Editing production DNS without a screenshot first — rollback becomes hard.'],
  },

  // Stage 2 — Website Delivery Basics
  'hosting-basics': {
    summaryEn:
      'Hosting is where website code and files run (VPS, shared hosting, cloud, serverless). Domain + DNS point to hosting; hosting serves content to visitors.',
    whyItMattersEn:
      'Cloudflare does not replace hosting by default — it sits in front of the origin or hosts static assets on Pages/Workers.',
    commonMistakesEn: [
      'Thinking adding Cloudflare means you no longer need a server/origin (except when using Pages/Workers end-to-end).',
    ],
  },
  'origin-server': {
    summaryEn:
      'The origin is the real server/backend holding the app and source data. The CDN/edge copies content or forwards requests to the origin when needed.',
    whyItMattersEn:
      'Cloudflare mental model: user → edge → (cache hit or) origin. Protecting the origin is the goal of cache and DDoS mitigation.',
  },
  'cdn-basics': {
    summaryEn:
      'A CDN (Content Delivery Network) distributes content from many edge locations near users, reducing latency and origin load. Cloudflare runs a global CDN integrated with security.',
    whyItMattersEn:
      'This is the core value prop of Application Services — explaining CDN simply is a basic sales/SE skill.',
    suggestedExerciseEn:
      'Compare load time of a large asset via CDN vs directly from origin (if available).',
  },
  'edge-network': {
    summaryEn:
      'The edge is Cloudflare servers in many cities — handling requests near users: cache, TLS, WAF, Workers. "Running at the edge" means not hitting origin on every request.',
    whyItMattersEn:
      'Developer Platform also deploys logic to the edge — understand how edge differs from traditional cloud regions.',
  },
  'cache-basics': {
    summaryEn:
      'Cache stores copies of responses to serve them faster. CDN cache lives at the edge; browser cache lives on the client. You need clear TTL rules and invalidation strategy.',
    whyItMattersEn:
      'Cache Rules and Purge are daily operations — understanding cache avoids "I deployed but users still see the old version".',
    commonMistakesEn: ['Caching everything including personalized login pages.'],
  },
  'browser-vs-cdn-cache': {
    summaryEn:
      'Browser cache is held by the browser per Cache-Control headers; CDN cache is held by Cloudflare per rules. The two layers are independent — purging CDN does not clear browser cache.',
    whyItMattersEn:
      'Debugging "still seeing old content" requires knowing which layer to purge and which headers are set.',
    commonMistakesEn: ['Using Purge Everything every time instead of purging only the URL/tag you need.'],
  },
  'static-vs-dynamic': {
    summaryEn:
      'Static: files identical for every user (CSS, images, static HTML). Dynamic: changes per user/session (cart, dashboard). CDN cache works best for static; dynamic needs a different strategy.',
    whyItMattersEn:
      'Choosing cache rules and plan tier depends on static/dynamic ratio — wrong classification causes data leaks or missed performance gains.',
  },
  'cache-hit-miss': {
    summaryEn:
      'Hit: edge serves from cache without asking origin. Miss: edge fetches from origin and may store the response. Higher hit ratio means lighter origin and faster site.',
    whyItMattersEn:
      'The CF-Cache-Status header and analytics help tune cache — SEs and IT admins need to read them.',
    suggestedExerciseEn: 'Reload the same URL twice and check CF-Cache-Status in the response headers.',
  },
  'purge-cache': {
    summaryEn:
      'Purge removes cached copies on the edge so the next request fetches fresh content from origin. Options include URL, tag, prefix, or everything (use carefully in production).',
    whyItMattersEn:
      'Releases often include a purge — knowing safe purge methods avoids origin traffic spikes.',
    commonMistakesEn: ['Purging Everything during peak hours — origin can become overloaded.'],
  },
  'image-optimization': {
    summaryEn:
      'Images often dominate page weight. Resize, modern formats (WebP/AVIF), and lazy loading reduce LCP. Cloudflare Images/Polish optimize at the edge.',
    whyItMattersEn:
      'Ecommerce and media use cases — connect performance to specific Cloudflare products.',
  },
  'load-balancing-basics': {
    summaryEn:
      'A load balancer distributes traffic across multiple origins/servers, health-checks them, and fails over when a node is down. It enables HA and horizontal scaling.',
    whyItMattersEn:
      'Cloudflare Load Balancing combines DNS with global health checks — unlike an LB confined to one data center.',
    commonMistakesEn: ['Not configuring health checks — the LB still sends traffic to dead origins.'],
  },

  // Stage 3 — Security Basics
  'tls-ssl-basics': {
    summaryEn:
      'TLS (often called SSL) encrypts the connection between client and server — preventing eavesdropping and tampering. HTTPS = HTTP + TLS.',
    whyItMattersEn:
      'Cloudflare SSL/TLS mode controls encryption user→Cloudflare and Cloudflare→origin — misconfiguration causes mixed content or certificate errors.',
    commonMistakesEn: [
      'Using "Flexible" SSL when origin does not support HTTPS — risk on the Cloudflare→origin leg.',
    ],
  },
  'http-vs-https': {
    summaryEn:
      'HTTP sends plaintext — easy to read or modify in transit. HTTPS is required for login, forms, SEO, and modern browsers (mixed content warnings).',
    whyItMattersEn:
      'Cloudflare Universal SSL gets HTTPS quickly — you still need HTTP→HTTPS redirect and secure cookies.',
  },
  'certificate-basics': {
    summaryEn:
      'A certificate is signed by a CA, proving who owns a domain and holding the public key for TLS. The browser checks the trust chain before connecting.',
    whyItMattersEn:
      'Cloudflare issues edge certs; origin can use Origin CA or Let\'s Encrypt — understanding both layers avoids 525/526 errors.',
    commonMistakesEn: ['Expired origin cert while only checking the cert the browser sees (edge).'],
  },
  'ddos-basics': {
    summaryEn:
      'DDoS (Distributed Denial of Service) floods a service with traffic from many sources until it overloads. Unlike a single attacker — scale and distribution matter.',
    whyItMattersEn:
      'Cloudflare DDoS protection runs automatically at network and HTTP layers — a simple explanation helps customers understand why proxy is needed.',
    commonMistakesEn: ['Thinking an ISP firewall is enough against large application-layer DDoS.'],
  },
  'bot-basics': {
    summaryEn:
      'Bots are automated traffic — good crawlers (Google), scrapers, credential stuffing, form spam. You must distinguish bad bots from necessary ones.',
    whyItMattersEn:
      'Bot Management and Super Bot Fight Mode are important for operations and upsell — understand bots before blocking SEO by mistake.',
    commonMistakesEn: ['Blocking all bots — hurts SEO and monitoring.'],
  },
  'waf-basics': {
    summaryEn:
      'A WAF (Web Application Firewall) inspects HTTP requests and blocks attack patterns (SQLi, XSS, and others) before they reach the app. Unlike network firewalls, it operates at the application layer.',
    whyItMattersEn:
      'Managed Rules and custom rules are the focus of Application Services — know what a WAF is before tuning false positives.',
  },
  'rate-limiting-basics': {
    summaryEn:
      'Rate limiting caps requests by IP, path, header, and similar keys within a time window — reducing brute force, scraping, and protecting APIs.',
    whyItMattersEn:
      'Cloudflare rate limit rules run at the edge — understand the concept before designing rules for login and public APIs.',
  },
  'api-security-basics': {
    summaryEn:
      'Public APIs need auth, schema validation, rate limits, logging, and bot control. OWASP API Security Top 10 is a common checklist.',
    whyItMattersEn:
      'API Shield and the Secure API use case on the hub map directly — foundation for developers and SEs.',
  },
  'captcha-vs-turnstile': {
    summaryEn:
      'Traditional CAPTCHAs require puzzles — poor UX. Cloudflare Turnstile verifies visitors with less friction and integrates with forms and login.',
    whyItMattersEn:
      'Turnstile is a touchpoint for developers and founders — know when to use it instead of reCAPTCHA.',
    suggestedExerciseEn: 'Add a Turnstile widget to a demo form and test valid submit vs bot behavior.',
  },
  'common-web-attacks': {
    summaryEn:
      'SQLi injects database queries; XSS injects scripts into pages; credential stuffing tries leaked passwords; scraping collects data at scale. WAF and bot tools reduce risk but do not replace secure coding.',
    whyItMattersEn:
      'Mapping attack type → Cloudflare control makes discovery calls and incident response clearer.',
    commonMistakesEn: ['Trusting WAF 100% — you still need app patches and input validation at origin.'],
  },
  'security-headers-basics': {
    summaryEn:
      'Headers like HSTS, CSP, X-Frame-Options, and X-Content-Type-Options guide browsers toward safer behavior. Set them at origin or via Transform Rules on Cloudflare.',
    whyItMattersEn:
      'Complements WAF — correct headers reduce clickjacking and downgrade attacks.',
    suggestedExerciseEn: 'Scan a site with securityheaders.com and note 2 headers you should add.',
  },

  // Stage 4 — Cloudflare Mental Model
  'cloudflare-in-traffic-flow': {
    summaryEn:
      'For proxied websites/APIs: visitors send requests to Cloudflare edge first; Cloudflare inspects, caches, or forwards to origin. Not proxied: DNS only, traffic goes straight to origin.',
    whyItMattersEn:
      'The first answer in every discovery call — if you cannot draw the flow, architecture design is hard.',
    suggestedExerciseEn: 'Draw 3 boxes: User, Cloudflare edge, Origin with request/response arrows.',
  },
  'reverse-proxy-model': {
    summaryEn:
      'Cloudflare is a global reverse proxy: terminate TLS, apply policy, cache, then forward to origin. Origin IP can be hidden from the public.',
    whyItMattersEn:
      'All App Services features (WAF, cache, LB) follow this model — not a plugin installed on origin.',
  },
  'orange-vs-gray-cloud': {
    summaryEn:
      'Orange (proxied): traffic through Cloudflare — security + performance. Gray (DNS only): DNS resolution only. Choose per record, not the whole zone at once.',
    whyItMattersEn:
      'The most common newbie proxy mistake — links directly to onboarding checklists.',
    commonMistakesEn: ['Proxying mail records or services that do not support HTTP proxy.'],
  },
  'zone-account-dashboard': {
    summaryEn:
      'An account holds many zones (domains). A zone is the configuration space for DNS, SSL, and rules for one domain. The dashboard is the admin UI — permissions follow account/zone roles.',
    whyItMattersEn:
      'IT admins and founders need to map org structure → accounts so everyone is not sharing one login.',
  },
  'request-flow-through-cloudflare': {
    summaryEn:
      'Typical flow: DNS resolve → TCP/TLS to edge → WAF/bot check → cache lookup → (miss) origin fetch → response to client. Workers can inject logic between steps.',
    whyItMattersEn:
      'Debugging latency and 5xx requires knowing which step stopped the request — trace and Logpush follow this flow.',
  },
  'product-families-overview': {
    summaryEn:
      'Three main families: Application Services (protect/accelerate existing sites & APIs), Developer Platform (build/deploy on Cloudflare), Cloudflare One (Zero Trust, Access, Gateway, WARP for users and networks).',
    whyItMattersEn:
      'Sales and learners choose a path — avoid forcing every product into one use case.',
    suggestedExerciseEn: 'Write down one pain point and map it to which product family fits.',
  },
  'when-to-use-which-product': {
    summaryEn:
      'Public website → App Services first. New serverless app → Developer Platform. Remote employee/SaaS security → Cloudflare One. Many orgs combine them — they are not mutually exclusive.',
    whyItMattersEn:
      'Stage 4 outcome: pick the next track and use case on the hub instead of buying the wrong bundle.',
    suggestedExerciseEn: 'Take the beginner readiness quiz and review the suggested track.',
    commonMistakesEn: [
      'Using Tunnel instead of CDN for a public static website.',
      'Workers only with no WAF for a production API.',
    ],
  },

  // Stage 5 — Application Services Path
  'as-dns': {
    summaryEn:
      'Manage authoritative zone, import records, CNAME flattening, optional DNSSEC. DNS is the entry point for every other App Services feature.',
    whyItMattersEn:
      'First module in the Application Services track — wrong DNS makes every downstream rule meaningless.',
  },
  'as-cdn': {
    summaryEn:
      'Cloudflare CDN integrates with global proxy — no separate CNAME subdomain like traditional CDNs when records are proxied. Optimize static assets and TTFB.',
    whyItMattersEn:
      'Links directly to the accelerate content use case and CDN product page.',
  },
  'as-cache-rules': {
    summaryEn:
      'Cache Rules (replacing legacy Page Rules cache) control TTL, bypass, and cache key by hostname/path/header. Expression-based and easier to audit than legacy rules.',
    whyItMattersEn:
      'Performance tuning skill after onboarding — hit ratio depends on correct rules.',
    commonMistakesEn: ['Bypassing cache for the entire site instead of only dynamic paths.'],
  },
  'as-waf': {
    summaryEn:
      'Managed Rulesets, OWASP core, custom expression-based rules. Runs at edge before origin — logs and events in Security Analytics.',
    whyItMattersEn:
      'Core website/API protection — you need a process to tune false positives.',
  },
  'as-ddos': {
    summaryEn:
      'Automatic L3/L4/L7 protection when proxied. Network-layer mitigation plus HTTP DDoS rules. No manual enable for most customers.',
    whyItMattersEn:
      'Explain during incidents and plan comparisons — unlimited mitigation on many plans.',
  },
  'as-bot-protection': {
    summaryEn:
      'Super Bot Fight Mode, Bot Management, JS detection, and challenges. Balance blocking abuse vs allowing legitimate crawlers.',
    whyItMattersEn:
      'Ecommerce and login forms — connect bot protection with Turnstile.',
  },
  'as-rate-limiting': {
    summaryEn:
      'Rate limiting rules in WAF — count by IP, cookie, path, header. Mitigation: block, challenge, or log.',
    whyItMattersEn:
      'Protect login and APIs — complement with API Shield for schema validation.',
  },
  'as-load-balancing': {
    summaryEn:
      'Global LB with origin pools, geo steering, and health monitors. Combines proxied DNS with automatic failover.',
    whyItMattersEn:
      'Multi-region HA — architecture diagrams on the hub illustrate this pattern.',
  },
  'page-rules-vs-modern-rules': {
    summaryEn:
      'Legacy Page Rules (limited count) — prefer Configuration Rules, Cache Rules, Redirect Rules, Transform Rules. Use Page Rules only for legacy compatibility.',
    whyItMattersEn:
      'Avoid outdated tutorials — modern expression-based rules scale better.',
    commonMistakesEn: ['Creating a new Page Rule instead of an equivalent Cache/Configuration Rule.'],
  },
  'ssl-tls-modes': {
    summaryEn:
      'Off/Flexible/Full/Full (strict) — controls Cloudflare↔origin encryption. Production should use Full (strict) with a valid origin certificate.',
    whyItMattersEn:
      '525/526 errors often come from wrong mode — mandatory onboarding checklist item.',
    commonMistakesEn: ['Flexible SSL with login forms — origin leg traffic is not encrypted.'],
  },
  'origin-protection': {
    summaryEn:
      'Hide origin IP (proxy), allowlist only Cloudflare IPs, Authenticated Origin Pulls, Tunnel for private origin. Reduces bypassing WAF by hitting IP directly.',
    whyItMattersEn:
      'Advanced hardening after WAF — SE roadmap week 3 performance/security.',
    commonMistakesEn: ['Origin IP exposed in email headers or old DNS history.'],
  },

  // Stage 6 — Developer Platform Path
  'dp-pages': {
    summaryEn:
      'Cloudflare Pages hosts static sites plus Functions (Workers) for lightweight full-stack. Git integration, preview deployments, custom domain via Cloudflare zone.',
    whyItMattersEn:
      'Entry point for static deploy and MVP — deploy-static-site use case on the hub.',
    suggestedExerciseEn: 'Deploy a demo Astro/HTML site to Pages and attach a subdomain.',
  },
  'dp-workers': {
    summaryEn:
      'Workers run JavaScript/TypeScript/Wasm at the edge — request handlers, APIs, middleware. No traditional OS server; scales automatically.',
    whyItMattersEn:
      'Foundation of Developer Platform — every binding (KV, D1, etc.) attaches to a Worker script.',
  },
  'dp-workers-routes': {
    summaryEn:
      'Routes map hostname/path to a Worker — via dashboard, wrangler, or Workers for Platforms. Route order and specificity determine which script runs.',
    whyItMattersEn:
      'Attach edge logic to production domains — different scope from Pages Functions.',
    commonMistakesEn: ['Overly broad route `*/*` catching unintended traffic.'],
  },
  'dp-kv': {
    summaryEn:
      'Workers KV is an eventually consistent key-value store, read-heavy — config, session cache, feature flags. Not a replacement for SQL on complex queries.',
    whyItMattersEn:
      'Storage decision tree: KV vs D1 vs R2 — foundation for architecting a mini app.',
  },
  'dp-d1': {
    summaryEn:
      'D1 is serverless SQLite at the edge — relational SQL, suited to small/medium CRUD apps. Bind D1 to a Worker; migrate via wrangler.',
    whyItMattersEn:
      'Replace external DB for MVP — links to build-serverless-app and SaaS patterns.',
    commonMistakesEn: ['Using D1 as a large write-heavy analytics warehouse.'],
  },
  'dp-r2': {
    summaryEn:
      'R2 is S3-compatible object storage with no egress fees via Workers. Store user uploads, assets, backups — combine with Workers presigned URLs.',
    whyItMattersEn:
      'Media and SaaS file upload use cases — R2 architecture on the hub.',
  },
  'dp-queues': {
    summaryEn:
      'Queues decouple producer and consumer — one Worker sends messages, another processes async. Retry and dead letter for background jobs.',
    whyItMattersEn:
      'Email, webhook, batch patterns — replaces crude cron + poll at scale.',
  },
  'dp-durable-objects': {
    summaryEn:
      'Durable Objects are stateful single-threaded instances by ID — chat rooms, counters, realtime coordination. Unlike KV: strong consistency and WebSockets.',
    whyItMattersEn:
      'Realtime and multiplayer — do not use DO for every simple state need.',
    commonMistakesEn: ['Using DO instead of KV for static config — overkill and more expensive.'],
  },
  'dp-workflows': {
    summaryEn:
      'Workflows orchestrate multi-step durable jobs — sleep, retry, human-in-the-loop. Suited to pipelines longer than one Worker invocation.',
    whyItMattersEn:
      'Complements Queues for processes with a clear state machine.',
  },
  'dp-workers-ai-vectorize': {
    summaryEn:
      'Workers AI runs model inference at the edge; Vectorize stores embeddings for semantic search and RAG. The two bindings are often used together in AI pipelines.',
    whyItMattersEn:
      'Build-ai-applications use case and ai-rag architecture on the hub.',
  },
  'dp-fullstack-app': {
    summaryEn:
      'Common pattern: Pages frontend + Functions/Workers API + D1/KV/R2 + Access/Turnstile/WAF for production. Wrangler deploy with staging/prod envs.',
    whyItMattersEn:
      'Developer track capstone — connects all stage 6 topics into one MVP architecture.',
    suggestedExerciseEn:
      'Sketch a todo app architecture: Pages UI + Worker API + D1 + Turnstile.',
    commonMistakesEn: ['Shipping production without WAF/rate limits on a public API.'],
  },

  // Stage 7 — Cloudflare One Path
  'c1-zero-trust': {
    summaryEn:
      'Zero Trust: do not trust the internal network by default — every request must verify identity, device, and policy. "Verify explicitly, least privilege, assume breach".',
    whyItMattersEn:
      'Cloudflare One revolves around Zero Trust — different from a stack that only WAFs public websites.',
  },
  'c1-vpn-vs-ztna': {
    summaryEn:
      'VPN puts users on the entire internal network — large blast radius. ZTNA (Zero Trust Network Access) grants access per app/resource with fine-grained policy.',
    whyItMattersEn:
      'Replace-vpn use case — pitch Cloudflare Access to IT and founders.',
    commonMistakesEn: [
      'Treating WARP as a traditional full-tunnel VPN for all traffic without policy design.',
    ],
  },
  'c1-access': {
    summaryEn:
      'Cloudflare Access protects internal/SaaS apps — users log in via IdP, policy decides allow/deny. No need to open inbound ports on origin.',
    whyItMattersEn:
      'Admin dashboard, staging, internal API — protect-admin pattern in stage 8.',
    suggestedExerciseEn: 'Create a self-hosted Access application demo with an email domain policy.',
  },
  'c1-gateway': {
    summaryEn:
      'Secure Web Gateway — filters DNS/HTTP/network traffic from users (via WARP) by policy: block malware, categories, DLP. SWG replaces uncontrolled browsing.',
    whyItMattersEn:
      'Company-wide security and secure SaaS access — links to products/swg.',
  },
  'c1-warp': {
    summaryEn:
      'The WARP client connects devices to Cloudflare edge — applies Gateway policy and private routing. Device enrollment via Zero Trust dashboard.',
    whyItMattersEn:
      'Remote workforce — pair with secure-remote-users use case.',
    commonMistakesEn: ['Rolling out WARP broadly without a pilot group and exception policies.'],
  },
  'c1-tunnel': {
    summaryEn:
      'cloudflared creates an outbound tunnel from origin/private network to Cloudflare — no inbound firewall holes. Public hostnames route through the tunnel to internal services.',
    whyItMattersEn:
      'Self-hosted homelab or private API — tunnel architecture in SE week 5.',
  },
  'c1-device-posture': {
    summaryEn:
      'Device posture checks the device (OS patch, disk encryption, client version) before allowing Access/Gateway. Policy can require a managed device.',
    whyItMattersEn:
      'Enterprise compliance — different from consumer "password only" access.',
  },
  'c1-idp-integration': {
    summaryEn:
      'Connect Okta, Azure AD, Google Workspace, and others as IdP for Access. SSO, group sync, SCIM provisioning for users/groups.',
    whyItMattersEn:
      'Required for enterprise — do not rely on one-time PIN long term in production.',
    commonMistakesEn: ['Sharing Cloudflare admin access instead of mapping IdP groups into policy.'],
  },
  'c1-saas-security': {
    summaryEn:
      'Control SaaS access (M365, Salesforce, etc.) via Access identity proxy plus CASB for shadow IT detection. Policy by user/group and device.',
    whyItMattersEn:
      'Secure-saas-access use case — links to products/casb.',
  },
  'c1-sase-overview': {
    summaryEn:
      'SASE (Secure Access Service Edge) combines cloud-delivered network and security: ZTNA, SWG, CASB, FWaaS. Cloudflare One positioning within SASE/SSE.',
    whyItMattersEn:
      'Executive and sales conversations — SASE architecture on the hub.',
    suggestedExerciseEn:
      'Read a SASE diagram and map 3 capabilities to Access/Gateway/WARP.',
  },

  // Stage 8 — Practical Use Cases
  'uc-protect-website': {
    summaryEn:
      'Onboard domain, proxy records, SSL Full (strict), WAF managed rules, basic bot fight mode. Architecture: Visitor → DNS + Proxy + Security + Cache → Origin.',
    whyItMattersEn:
      'Most common SMB use case — /use-cases/protect-website has a detailed checklist.',
  },
  'uc-speed-up-website': {
    summaryEn:
      'Enable CDN/cache, Cache Rules for static assets, Polish/Images, HTTP/2/3, early hints. Measure before/after with Web Analytics or Lighthouse.',
    whyItMattersEn:
      'Runs parallel to protect — many customers buy Cloudflare for performance first.',
    suggestedExerciseEn:
      'Compare TTFB/LCP before and after enabling a cache rule for /assets/*.',
  },
  'uc-secure-api': {
    summaryEn:
      'API proxied through Cloudflare: rate limits, WAF OWASP, API Shield schema validation (if available), mTLS/token for partners. Log and alert on anomalies.',
    whyItMattersEn:
      'Developers and SEs — secure-api use case plus api-security product.',
  },
  'uc-stop-bots': {
    summaryEn:
      'Combine Bot Management, login rate limits, Turnstile on forms, geo/rules for abuse patterns. Keep SEO crawler allowlists.',
    whyItMattersEn:
      'Ecommerce and lead forms — links to bot protection in stage 5.',
  },
  'uc-replace-vpn': {
    summaryEn:
      'VPN → ZTNA migration: inventory apps, Access policy per app, WARP deployment, Tunnel for private resources. Pilot with one department before rollout.',
    whyItMattersEn:
      'Cloudflare One flagship — replace-vpn use case and vpn-migration reference.',
  },
  'uc-build-serverless-app': {
    summaryEn:
      'Stack: Pages/Workers + D1/R2/KV, wrangler CI, custom domain, Turnstile + WAF for public API. Preview env for PRs.',
    whyItMattersEn:
      'Developer capstone — build-serverless-app use case.',
    suggestedExerciseEn:
      'Deploy a mini API + static UI and document bindings/env used in wrangler.toml.',
  },
  'uc-protect-admin-dashboard': {
    summaryEn:
      'Do not leave /admin public: Access policy (admin IdP group), optional IP allowlist, WAF path rule, Tunnel if origin is private. Audit Access event logs.',
    whyItMattersEn:
      'Startup and internal tool pattern — combines App Services + Cloudflare One.',
    commonMistakesEn: ['Security through obscurity on /admin-secret URL without Access or strong auth.'],
  },
  'uc-secure-remote-users': {
    summaryEn:
      'Deploy WARP client, Gateway DNS/HTTP filtering, device enrollment, split tunnel vs full tunnel policy. Support playbook when users go offline.',
    whyItMattersEn:
      'Remote HR and BYOD — secure-remote-users use case.',
  },
  'uc-startup-mvp': {
    summaryEn:
      'Typical MVP: Pages marketing + Workers API + D1 + R2 uploads + Turnstile + free/pro plan awareness. Minimal ops; add WAF/Access as you scale.',
    whyItMattersEn:
      'Founder roadmap week 4 — connects cost awareness and architecture patterns.',
    suggestedExerciseEn:
      'Write a one-pager MVP architecture: user flow, Cloudflare products, estimated free-tier cost.',
    commonMistakesEn: ['Over-engineering Durable Objects/Queues before you have real users.'],
  },
};
