import type { ContentRoadmapTopic } from '../../types/roadmap';

export type TopicKmOverlay = Pick<
  ContentRoadmapTopic,
  'summaryKm' | 'whyItMattersKm' | 'suggestedExerciseKm' | 'commonMistakesKm'
>;

export const topicKmById: Record<string, Partial<TopicKmOverlay>> = {
  // Stage 0 — Internet & Network Foundations
  'internet-basics': {
    summaryKm:
      'Internet គឺជាបណ្តាញសកលដែលភ្ជាប់ឧបករណ៍រាប់ពាន់លានតាម infrastructure និង protocol រួម។ អ្នកមិនភ្ជាប់ទៅ server តែមួយទេ — request របស់អ្នកធ្វើដំណើរតាមបណ្តាញជាច្រើនមុនដល់គោលដៅ។',
    whyItMattersKm:
      'ផលិតផល Cloudflare ទាំងអស់ដំណើរការលើ traffic flow របស់ Internet — ការយល់ដឹងពីមូលដ្ឋានជួយអ្នកកុំឱ្យច្រឡំ Cloudflare ជាមួយ hosting ឬ ISP។',
    suggestedExerciseKm:
      'គូររូបភាព៖ ឧបករណ៍របស់អ្នក → router ផ្ទះ → ISP → Internet → server គោលដៅ។',
    commonMistakesKm: ['គិតថា Internet ស្មើ Wi‑Fi ឬដំណើរការដោយក្រុមហ៊ុនតែមួយ។'],
  },
  'client-server': {
    summaryKm:
      'client (browser, app) ផ្ញើ request; server ទទួល ដំណើរការ ហើយបញ្ជូន response។ ទំព័រវេប គ្រប់ API និង video stream ទាំងអស់អនុវត្តតាម model នេះ។',
    whyItMattersKm:
      'Cloudflare ស្ថិតនៅចន្លោះ client និង origin server — អ្នកត្រូវដឹងថាតើអ្នកណាផ្ញើអ្វី និងអ្នកណាឆ្លើយ ដើម្បីយល់ proxy, cache និង WAF។',
    commonMistakesKm: [
      'គិតថា "server" មានន័យតែ machine រូបវន្ត — server អាចជា cloud service ឬ Worker។',
    ],
  },
  'ip-address': {
    summaryKm:
      'IP address គឺជាលេខសម្គាល់ដែលឧបករណ៍ប្រើរកគ្នានៅលើបណ្តាញ (ឧ. IPv4 ដូច 192.0.2.1)។ DNS បន្ទាប់មកភ្ជាប់ domain name ទៅ IP address។',
    whyItMattersKm:
      'ពេល debug DNS, firewall rule ឬ origin protection អ្នកត្រូវធ្វើការជាមួយ IP — ជាពិសេស A/AAAA record និង allowlist។',
    commonMistakesKm: ['គិតថាគេហទំព័រគ្រប់គ្នាមាន IP address ថេរតែមួយជារៀងរហូត។'],
  },
  port: {
    summaryKm:
      'port គឺជា endpoint ឡូជីខលនៅលើ IP address ដែលបំបែក service (HTTP ជាធម្មតាប្រើ 80, HTTPS 443)។ IP ដូចគ្នាអាចដំណើរការ app ច្រើននៅ port ផ្សេងគ្នា។',
    whyItMattersKm:
      'Load balancing, firewall rule និង tunnel រួចជាញឹកញាប់យោង port — ការយល់ port ជួយកំណត់ origin និង health check ឱ្យត្រឹមត្រូវ។',
    commonMistakesKm: ['បើក public port ច្រើនពេក "ដើម្បីងាយ" ពេលមិនចាំបាច់។'],
  },
  protocol: {
    summaryKm:
      'protocol គឺជាសំណុំច្បាប់រួមសម្រាប់ភាគីពីរទាក់ទង (HTTP, DNS, TLS និងផ្សេងៗ)។ ដោយគ្មាន protocol រួម client និង server មិនអាចយល់គ្នា។',
    whyItMattersKm:
      'Cloudflare ដំណើរការនៅ layer protocol ជាច្រើន — HTTP cache, TLS termination, DNS proxy — ដូច្នេះអ្នកត្រូវដឹងឈ្មោះ និងតួនាទី protocol នីមួយៗ។',
  },
  'tcp-udp': {
    summaryKm:
      'TCP ធានាថាទិន្នន័យមកគ្រប់ និងតាមលំដាប់ (web, email); UDP ផ្តល់អាទិភាពល្បឿន ហើយទទួល packet loss (streaming, DNS query)។',
    whyItMattersKm:
      'DDoS mitigation និង L4 firewall បំបែក TCP/UDP flood — ការយល់ភាពខុសគ្នាជួយអ្នកអាន attack report និង network rule។',
    commonMistakesKm: [
      'ច្រឡំ UDP (លឿន, គ្មានការធានាដឹកជញ្ជូន) ជាមួយ TCP (អាចទុកចិត្តបាន) — បណ្តើរកាយ debug latency ខុស។',
    ],
  },
  'http-https-basics': {
    summaryKm:
      'HTTP គឺ protocol សម្រាប់ទំព័រវេប និង API; HTTPS បន្ថែម TLS encryption។ Request មាន method (GET, POST), header និង body; response មាន status code។',
    whyItMattersKm:
      'Traffic ភាគច្រើនតាម Cloudflare គឺ HTTP/S — cache, WAF, rate limiting និង SSL/TLS mode ដំណើរការលើ HTTP request។',
    suggestedExerciseKm:
      'បើក DevTools → Network, reload ទំព័រ ហើយកត់ method, status និង Host header។',
    commonMistakesKm: ['យកចិត្តតែ status 200 ដោយមិនយកចិត្ត redirect 301/302 ឬ error 4xx/5xx។'],
  },
  'browser-website-flow': {
    summaryKm:
      'browser ញែក URL, ស្វែងរក DNS សម្រាប់ IP, បង្កើត TCP/TLS, ផ្ញើ HTTP request, ទទួល HTML, បន្ទាប់មកផ្ទុក CSS, JS និង image។ ជំហាននីមួយៗអាចបរាជ័យ ឬយឺតដោយឯករាជ្យ។',
    whyItMattersKm:
      'ពេលគេហទំព័រយឺត ឬមាន SSL error អ្នកត្រូវដឹងថាបញ្ហាគឺ DNS, TLS ឬ origin — Cloudflare analytics និង trace តាម flow ដូចគ្នានេះ។',
    commonMistakesKm: ['ចោទ Cloudflare ភ្លាមៗដោយមិនកំណត់ថាជំហានណាក្នុង chain បានបរាជ័យ។'],
  },
  'latency-bandwidth-routing': {
    summaryKm:
      'packet គឺឯកតាទិន្នន័យតូចនៅលើបណ្តាញ; routing ជ្រើស path; latency គឺពន្យាពេល និង bandwidth គឺ capacity។ CDN កាត់ latency ដោយផ្តល់ content ក្បែរអ្នកប្រើប្រាស់។',
    whyItMattersKm:
      'Cloudflare edge និង cache បង្កើនប្រសិទ្ធភាព latency — ការយល់ metric ទាំងនេះជួយអ្នកអាន dashboard និងពន្យល់តម្លៃ CDN ដល់អតិថិជន។',
    commonMistakesKm: ['ច្រឡំ bandwidth ខ្ពស់ ជាមួយ latency ទាប — ពួកវាជាគំនិតដាច់ដោយឡែក។'],
  },
  'osi-tcpip-model': {
    summaryKm:
      'model ជាន់ជួយអ្នកដាក់បញ្ហាត្រឹមត្រូវ៖ physical, network (IP), transport (TCP/UDP), application (HTTP/DNS)។ អ្នកមិនចាំបាច់ចងចាំទាំងអស់ — គ្រាន់តែដឹង "layer ណាបានបរាជ័យ"។',
    whyItMattersKm:
      'WAF គឺ L7, DDoS span L3/L4/L7, DNS គឺ application layer — កំណត់ layer ត្រឹមត្រូវជួយ escalate និងជ្រើសផលិតផល Cloudflare ត្រឹម។',
    commonMistakesKm: ['ព្យាយាមចងចាំ OSI layer 7 ទាំងអស់ — គួរប្រើ model ដើម្បី troubleshoot។'],
  },
  'public-private-ip': {
    summaryKm:
      'Private IP (10.x, 192.168.x និងស្រដៀង) ប្រើនៅ LAN ខាងក្នុង; public IP អាចទាក់ទងពី Internet។ NAT រួចជាញឹកញាប់លាក private IP ក្រោយ router។',
    whyItMattersKm:
      'Origin ពិតរួចជាញឹកញាប់មាន private IP — Cloudflare proxy លាក public origin; Tunnel ភ្ជាប់ service ខាងក្នុងទៅ edge ដោយសុវត្ថិភាព។',
    commonMistakesKm: ['បោះ private IP ដោយផ្ទាល់ក្នុង public DNS។'],
  },
  nat: {
    summaryKm:
      'Network Address Translation អោយឧបករណ៍ខាងក្នុងច្រើន share public IP តែមួយដើម្បីទៅ Internet។ Router ផ្ទះ និង enterprise firewall រួចជាញឹកញាប់ធ្វើ NAT។',
    whyItMattersKm:
      'ការយល់ NAT ពន្យល់ហេតុអ្វី origin IP មិនគួរបង្ហាញ និងហេតុ Tunnel/WARP មានប្រយោជន៍សម្រាប់បណ្តាញខាងក្នុង។',
    commonMistakesKm: ['គិតថា NAT ជំនួស firewall — NAT បកប្រែ address តែប៉ុណ្ណោះ មិនតម្រង policy។'],
  },
  'firewall-reverse-proxy': {
    summaryKm:
      'firewall តម្រង traffic តាម rule (IP, port, protocol)។ reverse proxy ស្ថិតមុខ server, ទទួល request ហើយ forward ទៅ server — អាច cache, terminate TLS និងដំណើរការ WAF។',
    whyItMattersKm:
      'Cloudflare ដំណើរការជា global reverse proxy — នេះគឺ mental model ស្នូលមុន enable orange cloud។',
    commonMistakesKm: [
      'ច្រឡំ reverse proxy ជាមួយ forward proxy (browser VPN)។',
      'បិទ firewall ខាងក្នុងទាំងអស់ ព្រោះ "Cloudflare មានរួចហើយ"។',
    ],
  },

  // Stage 1 — DNS & Domain Basics
  'domain-basics': {
    summaryKm:
      'domain គឺឈ្មោះងាយចងចាំ មិនមែន IP — ឧ. example.com។ registrar គ្រប់គ្រង ownership; DNS ភ្ជាប់ domain ទៅ service ពិត។',
    whyItMattersKm:
      'ជំហានដំបូង onboard Cloudflare គឺបន្ថែម domain និងគ្រប់គ្រង zone — ដោយគ្មានការយល់ domain អ្នកច្រឡំ registrar, nameserver និង hosting។',
    commonMistakesKm: ['គិតថាទិញ domain មានន័យថាមានគេហទំព័ររួច — domain គឺឈ្មោះតែប៉ុណ្ណោះ; DNS និង hosting ដាច់ដោយឡែក។'],
  },
  'how-dns-works': {
    summaryKm:
      'ពេលអ្នកវាយ URL, resolver query chain nameserver ពី root → TLD → authoritative zone ដើម្បីទទួល IP ឬ record ផ្សេង។ វាកើតឡើងក្នុង millisecond ប៉ុន្តែមាន caching។',
    whyItMattersKm:
      'Cloudflare អាចជា authoritative DNS និង proxy — ការយល់ query flow ជួយ debug "គេហទំព័រចូលមិនបាន"។',
    suggestedExerciseKm: 'ប្រើ `dig` ឬ dnschecker.org ស្វែងរក A record របស់ domain ដែលអ្នកស្គាល់។',
    commonMistakesKm: ['ផ្លាស់ប្តូរ DNS ហើយរំពឹងថាផ្លាស់ប្តូរនឹងបង្ហាញភ្លាមនៅ machine គ្រប់គ្នា។'],
  },
  'recursive-vs-authoritative': {
    summaryKm:
      'recursive resolver (ISP, 1.1.1.1) ប្រមូលចម្លើយសម្រាប់អ្នកប្រើ; authoritative nameserver ផ្តល់ចម្លើយផ្លូវការសម្រាប់ zone (ឧ. zone នៅ Cloudflare)។',
    whyItMattersKm:
      'Cloudflare 1.1.1.1 គឺ public recursive resolver; zone DNS របស់អតិថិជនគឺ authoritative — នេះជា role ពីរខុសគ្នា។',
    commonMistakesKm: ['ច្រឡំ Cloudflare zone nameserver ជាមួយ DNS resolver នៅ laptop របស់អ្នក។'],
  },
  'dns-record-types': {
    summaryKm:
      'A/AAAA ភ្ជាប់ hostname ទៅ IP; CNAME alias ទៅឈ្មោះផ្សេង; MX ដោះស្រាយ mail; TXT រក្សា verification/metadata; NS បញ្ជាក់ zone nameserver។ ប្រភេទនីមួយៗមានគោលបំណងផ្សេង។',
    whyItMattersKm:
      'record មួយខុសអាចបំបែក mail, SSL ឬ subdomain — ពិនិត្យ DNS table គឺលំហាត់ដំបូងក្នុង Application Services track។',
    commonMistakesKm: ['Proxy MX record ឬប្រើ CNAME នៅ apex ដោយមិនយល់ CNAME flattening។'],
  },
  'dns-ttl': {
    summaryKm:
      'TTL (Time To Live) ប្រាប់ resolver ថាតើ cache record យូរប៉ុណ្ណា មុនសួរម្តងទៀត។ TTL ទាបមានន័យផ្លាស់ប្តូរលឿន ប៉ុន្តែ query ច្រើនជាង។',
    whyItMattersKm:
      'ពេល migrate DNS ឬផ្លាស់ origin IP, TTL ប៉ះពាល់ propagation time — Cloudflare ណែនាំឱ្យបន្ថយ TTL មុន cutover។',
    commonMistakesKm: ['ទុក TTL 86400 ហើយផ្លាស់ IP ក្នុង emergency — ត្រូវរង់ cache ចាស់ឱ្យ expire។'],
  },
  'dns-propagation': {
    summaryKm:
      'propagation គឺរយៈពេល resolver ទូទាំងពិភពលោក update cache បន្ទាប់ពីអ្នកផ្លាស់ record។ វាមិនមែន magic spreading — cache ចាស់ expire តាម TTL ហើយ query ឡើងវិញ។',
    whyItMattersKm:
      'កាត់បន្ថយ panic ពេលអតិថិជនរាយការណ៍ "ខ្លះដំណើរការ ខ្លះមិន" បន្ទាប់ពីផ្លាស់ nameserver។',
    commonMistakesKm: ['ផ្លាស់ nameserver រង្វង់ក្នុងប៉ូន្តរម៉ង់ — ធ្វើឱ្យ cache state ច្របចជាង។'],
  },
  subdomain: {
    summaryKm:
      'subdomain គឺផ្នែកមុខ root domain — api.example.com, www.example.com។ subdomain នីមួយៗអាចមាន record និង policy ផ្ទាល់នៅ Cloudflare។',
    whyItMattersKm:
      'ក្រុមរួចជាញឹកញាប់បំបែក app, API និង admin តាម subdomain — អ្នកត្រូវដឹង record ណា proxy និង rule ណាអនុវត្ត hostname ណា។',
  },
  nameserver: {
    summaryKm:
      'nameserver គឺ authoritative server ដែលឆ្លើយ DNS សម្រាប់ zone។ ពេលអ្នក point NS នៅ registrar ទៅ Cloudflare, Cloudflare ក្លាយជាកន្លែងគ្រប់គ្រង record។',
    whyItMattersKm:
      'Onboard domain មានន័យផ្លាស់ NS ឬ partial setup — ការយល់ NS កុំឱ្យច្រឡំជាមួយ A record ឬ hosting control panel។',
    suggestedExerciseKm: 'ប្រៀបធៀប NS បច្ចុប្បន្ននៅ registrar ជាមួយ NS ដែល Cloudflare ផ្តល់ពេលបន្ថែម site។',
    commonMistakesKm: ['បន្ថែម zone ក្នុង Cloudflare ប៉ុន្តែមិន update NS នៅ registrar។'],
  },
  'dns-only-vs-proxied': {
    summaryKm:
      'Proxied (orange cloud)៖ traffic HTTP/S ឆ្លង Cloudflare — cache, WAF, origin IP លាក។ DNS only (gray)៖ បង្ហើញ DNS តែប៉ុណ្ណោះ គ្មាន proxy។',
    whyItMattersKm:
      'នេះជាការសម្រេច architecture សំខាន់បំផុតថ្ងៃដំបូង — proxy ខុសលើ MX ឬ record ខាងក្នុងបង្ក incident production។',
    commonMistakesKm: ['Proxy record គ្រប់យ៉ាង "ដើម្បីសុវត្ថិភាព" — mail និង service ខ្លះត្រូវ DNS only។'],
  },
  'common-dns-mistakes': {
    summaryKm:
      'បញ្ហាទូទៅ៖ record ស្ទួន, CNAME chain ខុស, SPF/DKIM ខ្វះ, proxy ដោយចំណេឃ, TTL ខ្ពស់ពេល migrate, ច្រឡំ apex vs www។',
    whyItMattersKm:
      'សង្ខេបកំហុសពិតប្រាកដជួយអ្នកប្រើ checklist និងសរសេរ support ticket ប្រសិទ្ធភាពជាង។',
    suggestedExerciseKm: 'ពិនិត្យ DNS table domain ពិត ហើយកត់ 3 record ដែលគួរ proxied vs DNS only។',
    commonMistakesKm: ['កែ DNS production ដោយគ្មាន screenshot មុន — rollback ពិបាក។'],
  },

  // Stage 2 — Website Delivery Basics
  'hosting-basics': {
    summaryKm:
      'hosting គឺកន្លែង code និង file គេហទំព័រដំណើរការ (VPS, shared hosting, cloud, serverless)។ domain + DNS point ទៅ hosting; hosting ផ្តល់ content ដល់ visitor។',
    whyItMattersKm:
      'Cloudflare មិនជំនួស hosting តាម default — វាស្ថិតមុខ origin ឬ host static asset នៅ Pages/Workers។',
    commonMistakesKm: [
      'គិតថាបន្ថែម Cloudflare មានន័យថាមិនចាំបាច់ server/origin (លើកលើង Pages/Workers end-to-end)។',
    ],
  },
  'origin-server': {
    summaryKm:
      'origin គឺ server/backend ពិតដែលរក្សា app និង source data។ CDN/edge copy content ឬ forward request ទៅ origin ពេលចាំបាច់។',
    whyItMattersKm:
      'Cloudflare mental model៖ user → edge → (cache hit ឬ) origin។ ការពារ origin គឺគោលដៅ cache និង DDoS mitigation។',
  },
  'cdn-basics': {
    summaryKm:
      'CDN (Content Delivery Network) ចែកចាយ content ពី edge location ជាច្រើនក្បែរអ្នកប្រើ កាត់ latency និង origin load។ Cloudflare ដំណើរការ global CDN រួម security។',
    whyItMattersKm:
      'នេះជា value prop ស្នូល Application Services — ពន្យល់ CDN សាមញ្ញគឺ skill sales/SE មូលដ្ឋាន។',
    suggestedExerciseKm:
      'ប្រៀបធៀប load time asset ធំ via CDN vs ដោយផ្ទាល់ពី origin (បើមាន)។',
  },
  'edge-network': {
    summaryKm:
      'edge គឺ server Cloudflare នៅទីក្រុងជាច្រើន — ដោះស្រាយ request ក្បែរអ្នកប្រើ៖ cache, TLS, WAF, Workers។ "ដំណើរការនៅ edge" មានន័យមិន hit origin រាល់ request។',
    whyItMattersKm:
      'Developer Platform ក៏ deploy logic ទៅ edge — យល់ edge ខុស cloud region traditional។',
  },
  'cache-basics': {
    summaryKm:
      'cache រក្សា copy response ដើម្បីផ្តល់លឿនជាង។ CDN cache នៅ edge; browser cache នៅ client។ អ្នកត្រូវមាន TTL rule ច្បាស់ និង invalidation strategy។',
    whyItMattersKm:
      'Cache Rules និង Purge គឺប្រតិបត្តិការប្រចាំថ្ងៃ — ការយល់ cache កុំឱ្យ "deploy ហើយ ប៉ុន្តែ user នៅតែឃើញ version ចាស់"។',
    commonMistakesKm: ['Cache ទាំងអស់ រួម login page ផ្ទាល់ខ្លួន។'],
  },
  'browser-vs-cdn-cache': {
    summaryKm:
      'browser cache រក្សាដោយ browser តាម Cache-Control header; CDN cache រក្សាដោយ Cloudflare តាម rule។ ពីរជាន់ដាច់ដោយឡែក — purge CDN មិន លុប browser cache។',
    whyItMattersKm:
      'Debug "នៅតែឃើញ content ចាស់" ត្រូវដឹង layer ណា purge និង header ណាត្រូវ set។',
    commonMistakesKm: ['ប្រើ Purge Everything រាល់ពេល ជំនួស purge URL/tag តែដែលចាំបាច់។'],
  },
  'static-vs-dynamic': {
    summaryKm:
      'Static៖ file ដូចគ្នាសម្រាប់ user គ្រប់គ្នា (CSS, image, static HTML)។ Dynamic៖ ផ្លាស់ប្តូរតាម user/session (cart, dashboard)។ CDN cache ល្អបំផុត static; dynamic ត្រូវការ strategy ផ្សេង។',
    whyItMattersKm:
      'ជ្រើស cache rule និង plan tier អាស្រ័យ static/dynamic ratio — classification ខុសបង្ក data leak ឬ missed performance gain។',
  },
  'cache-hit-miss': {
    summaryKm:
      'Hit៖ edge ផ្តល់ពី cache ដោយមិនសួរ origin។ Miss៖ edge ទាញ ពី origin ហើយអាច store response។ hit ratio ខ្ពស់មានន័យ origin ស្រាល និង site លឿនជាង។',
    whyItMattersKm:
      'CF-Cache-Status header និង analytics ជួយ tune cache — SE និង IT admin ត្រូវអានវា។',
    suggestedExerciseKm: 'Reload URL ដូចគ្នាពីរដង ហើយពិនិត្យ CF-Cache-Status ក្នុង response header។',
  },
  'purge-cache': {
    summaryKm:
      'Purge លុប copy cache នៅ edge ដូច្នេះ request បន្ទាប់ ទាញ content ថ្មីពី origin។ ជម្រើសរួម URL, tag, prefix ឬ everything (ប្រយ័ត្ន production)។',
    whyItMattersKm:
      'Release រួចជាញឹកញាប់មាន purge — ដឹង purge method សុវត្ថិភាពកុំឱ្យ origin traffic spike។',
    commonMistakesKm: ['Purge Everything ពេល peak hour — origin អាច overload។'],
  },
  'image-optimization': {
    summaryKm:
      'image រួចជាញឹកញាប់ dominate page weight។ resize, format ទំនើប (WebP/AVIF) និង lazy loading កាត់ LCP។ Cloudflare Images/Polish optimize នៅ edge។',
    whyItMattersKm:
      'Ecommerce និង media use case — ភ្ជាប់ performance ទៅផលិតផល Cloudflare ជាក់លាក់។',
  },
  'load-balancing-basics': {
    summaryKm:
      'load balancer ចែក traffic ទៅ origin/server ច្រើន, health-check ពួកវា ហើយ failover ពេល node down។ អនុញ្ញាត HA និង horizontal scaling។',
    whyItMattersKm:
      'Cloudflare Load Balancing រួម DNS ជាមួយ global health check — ខុស LB កំណត់ data center តែមួយ។',
    commonMistakesKm: ['មិន កំណត់ health check — LB នៅតែផ្ញើ traffic ទៅ origin ដែល dead។'],
  },

  // Stage 3 — Security Basics
  'tls-ssl-basics': {
    summaryKm:
      'TLS (រួចជាញឹកញាប់ហៅ SSL) អ៊ិនគ្រីប connection រវាង client និង server — ការពារ eavesdropping និង tampering។ HTTPS = HTTP + TLS។',
    whyItMattersKm:
      'Cloudflare SSL/TLS mode គ្រប់គ្រង encryption user→Cloudflare និង Cloudflare→origin — misconfiguration បង្ក mixed content ឬ certificate error។',
    commonMistakesKm: [
      'ប្រើ "Flexible" SSL ពេល origin មិន support HTTPS — risk លើ leg Cloudflare→origin។',
    ],
  },
  'http-vs-https': {
    summaryKm:
      'HTTP ផ្ញើ plaintext — ងាយអាន ឬកែក្នុង transit។ HTTPS ចាំបាច់សម្រាប់ login, form, SEO និង browser ទំនើប (mixed content warning)។',
    whyItMattersKm:
      'Cloudflare Universal SSL ទទួល HTTPS លឿន — អ្នកនៅតែត្រូវ HTTP→HTTPS redirect និង secure cookie។',
  },
  'certificate-basics': {
    summaryKm:
      'certificate ត្រូវ signed ដោយ CA, បញ្ជាក់ថាតើអ្នកណាកាន់ domain និងរក្សា public key សម្រាប់ TLS។ browser ពិនិត្យ trust chain មុន connect។',
    whyItMattersKm:
      'Cloudflare issue edge cert; origin អាចប្រើ Origin CA ឬ Let\'s Encrypt — យល់ layer ទាំងពីរកុំឱ្យ error 525/526។',
    commonMistakesKm: ['Origin cert expire ខណៈពិនិត្យតែ cert ដែល browser ឃើញ (edge)។'],
  },
  'ddos-basics': {
    summaryKm:
      'DDoS (Distributed Denial of Service) flood service ដោយ traffic ពី source ជាច្រើនរហូត overload។ ខុស attacker តែមួយ — scale និង distribution សំខាន់។',
    whyItMattersKm:
      'Cloudflare DDoS protection ដំណើរការ ដោយស្វ័យប្រវត្តិ network និង HTTP layer — ពន្យល់សាមញ្ញជួយអតិថិជនយល់ហេតុអ្វីត្រូវ proxy។',
    commonMistakesKm: ['គិតថា ISP firewall គ្រប់គ្រាន់ប្រឆាំង application-layer DDoS ធំ។'],
  },
  'bot-basics': {
    summaryKm:
      'bot គឺ traffic automated — crawler ល្អ (Google), scraper, credential stuffing, form spam។ ត្រូវបំបែក bot អាក្រក់ពី bot ចាំបាច់។',
    whyItMattersKm:
      'Bot Management និង Super Bot Fight Mode សំខាន់សម្រាប់ operation និង upsell — យល់ bot មុន ទប់ស្កត់ SEO ដោយចំណេឃ។',
    commonMistakesKm: ['ទប់ស្កត់ bot ទាំងអស់ — ប៉ះពាល់ SEO និង monitoring។'],
  },
  'waf-basics': {
    summaryKm:
      'WAF (Web Application Firewall) ពិនិត្យ HTTP request ហើយ ទប់ស្កត់ attack pattern (SQLi, XSS និងផ្សេង) មុនដល់ app។ ខុស network firewall — ដំណើរការ application layer។',
    whyItMattersKm:
      'Managed Rules និង custom rule គឺ focus Application Services — ដឹង WAF គឺអ្វីមុន tune false positive។',
  },
  'rate-limiting-basics': {
    summaryKm:
      'rate limiting cap request តាម IP, path, header និង key ស្រដៀងក្នុង time window — កាត់ brute force, scraping និង ការពារ API។',
    whyItMattersKm:
      'Cloudflare rate limit rule ដំណើរការ នៅ edge — យល់ concept មុន design rule សម្រាប់ login និង public API។',
  },
  'api-security-basics': {
    summaryKm:
      'public API ត្រូវ auth, schema validation, rate limit, logging និង bot control។ OWASP API Security Top 10 គឺ checklist ទូទៅ។',
    whyItMattersKm:
      'API Shield និង Secure API use case នៅ hub ភ្ជាប់ ដោយផ្ទាល់ — foundation សម្រាប់ developer និង SE។',
  },
  'captcha-vs-turnstile': {
    summaryKm:
      'CAPTCHA traditional តម្រូវ puzzle — UX អាក្រក់។ Cloudflare Turnstile ផ្ទៀងផ្ទាត់ visitor ដោយ friction តិច និង ភ្ជាប់ form និង login។',
    whyItMattersKm:
      'Turnstile ជា touchpoint developer និង founder — ដឹងពេលណាប្រើជំនួស reCAPTCHA។',
    suggestedExerciseKm: 'បន្ថែម Turnstile widget ទៅ demo form ហើយ test submit valid vs bot behavior។',
  },
  'common-web-attacks': {
    summaryKm:
      'SQLi inject database query; XSS inject script ទៅ page; credential stuffing សាក password leak; scraping ប្រមូល data at scale។ WAF និង bot tool កាត់ risk ប៉ុន្តែមិនជំនួស secure coding។',
    whyItMattersKm:
      'ភ្ជាប់ attack type → Cloudflare control ធ្វើ discovery call និង incident response ច្បាស់ជាង។',
    commonMistakesKm: ['ជឿ WAF 100% — អ្នកនៅតែត្រូវ app patch និង input validation នៅ origin។'],
  },
  'security-headers-basics': {
    summaryKm:
      'header ដូច HSTS, CSP, X-Frame-Options និង X-Content-Type-Options ណែ browser ទៅ behavior សុវត្ថិភាពជាង។ កំណត់នៅ origin ឬ via Transform Rules នៅ Cloudflare។',
    whyItMattersKm:
      'ជំនួព WAF — header ត្រឹមត្រូវកាត់ clickjacking និង downgrade attack។',
    suggestedExerciseKm: 'Scan site ជាមួយ securityheaders.com ហើយកត់ 2 header ដែលគួរបន្ថែម។',
  },

  // Stage 4 — Cloudflare Mental Model
  'cloudflare-in-traffic-flow': {
    summaryKm:
      'សម្រាប់ website/API proxied៖ visitor ផ្ញើ request ទៅ Cloudflare edge ជាមុន; Cloudflare ពិនិត្យ, cache ឬ forward ទៅ origin។ មិន proxied៖ DNS only, traffic ទៅ origin ដោយផ្ទាល់។',
    whyItMattersKm:
      'ចម្លើយដំបូង discovery call រាល់ដង — បើគូរ flow មិនបាន architecture design ពិបាយ។',
    suggestedExerciseKm: 'គូរ 3 box៖ User, Cloudflare edge, Origin ជាមួយ request/response arrow។',
  },
  'reverse-proxy-model': {
    summaryKm:
      'Cloudflare ជា global reverse proxy៖ terminate TLS, apply policy, cache, បន្ទាប់មក forward ទៅ origin។ origin IP អាចលាកពី public។',
    whyItMattersKm:
      'feature App Services ទាំងអស់ (WAF, cache, LB) តាម model នេះ — មិនមែន plugin install នៅ origin។',
  },
  'orange-vs-gray-cloud': {
    summaryKm:
      'Orange (proxied)៖ traffic ឆ្លង Cloudflare — security + performance។ Gray (DNS only)៖ DNS resolution តែប៉ុណ្ណោះ។ ជ្រើស per record មិនមែន zone ទាំងមូលពេលតែមួយ។',
    whyItMattersKm:
      'កំហុស proxy newbie ទូទៅបំផុត — link ដោយផ្ទាល់ onboarding checklist។',
    commonMistakesKm: ['Proxy mail record ឬ service ដែលមិន support HTTP proxy។'],
  },
  'zone-account-dashboard': {
    summaryKm:
      'account រក្សា zone (domain) ច្រើន។ zone គឺ configuration space DNS, SSL និង rule សម្រាប់ domain មួយ។ dashboard គឺ admin UI — permission តាម account/zone role។',
    whyItMattersKm:
      'IT admin និង founder ត្រូវ ភ្ជាប់ org structure → account ដើម្បីគ្រប់គ្នាមិន share login តែមួយ។',
  },
  'request-flow-through-cloudflare': {
    summaryKm:
      'flow ធម្មតា៖ DNS resolve → TCP/TLS ទៅ edge → WAF/bot check → cache lookup → (miss) origin fetch → response ទៅ client។ Workers inject logic រវាងជំហាន។',
    whyItMattersKm:
      'Debug latency និង 5xx ត្រូវដឹងជំហានណាប បញ្ឈប់ request — trace និង Logpush តាម flow នេះ។',
  },
  'product-families-overview': {
    summaryKm:
      'គ្រួមសំខាន់ 3៖ Application Services (protect/accelerate site & API ដែលមាន), Developer Platform (build/deploy នៅ Cloudflare), Cloudflare One (Zero Trust, Access, Gateway, WARP សម្រាប់ user និង network)។',
    whyItMattersKm:
      'Sales និង learner ជ្រើស path — កុំឱ្យ force product គ្រប់យ៉ាងទៅ use case តែមួយ។',
    suggestedExerciseKm: 'សរសេរ pain point មួយ ហើយ ភ្ជាប់ product family ណាសម។',
  },
  'when-to-use-which-product': {
    summaryKm:
      'Website public → App Services ជាមុន។ app serverless ថ្មី → Developer Platform។ security employee/SaaS remote → Cloudflare One។ org ច្រើនរួមគ្នា — មិន mutually exclusive។',
    whyItMattersKm:
      'Stage 4 outcome៖ ជ្រើស track និង use case បន្ទាប់នៅ hub ជំនួសទិញ bundle ខុស។',
    suggestedExerciseKm: 'ធ្វើ beginner readiness quiz ហើយពិនិត្យ suggested track។',
    commonMistakesKm: [
      'ប្រើ Tunnel ជំនួស CDN សម្រាប់ website static public។',
      'Workers តែប៉ុណ្ណោះ គ្មាន WAF សម្រាប់ API production។',
    ],
  },

  // Stage 5 — Application Services Path
  'as-dns': {
    summaryKm:
      'គ្រប់គ្រង authoritative zone, import record, CNAME flattening, DNSSEC optional។ DNS គឺ entry point feature App Services ផ្សេងទៀតរាល់យ៉ាង។',
    whyItMattersKm:
      'Module ដំបូង Application Services track — DNS ខុសធ្វើ rule downstream គ្មានន័យ។',
  },
  'as-cdn': {
    summaryKm:
      'Cloudflare CDN integrate global proxy — គ្មាន CNAME subdomain ដាច់ដោយឡែកដូច CDN traditional ពេល record proxied។ optimize static asset និង TTFB។',
    whyItMattersKm:
      'Link ដោយផ្ទាល់ accelerate content use case និង CDN product page។',
  },
  'as-cache-rules': {
    summaryKm:
      'Cache Rules (ជំនួស Page Rules cache legacy) គ្រប់ TTL, bypass និង cache key តាម hostname/path/header។ expression-based និង audit ងាយជាង rule legacy។',
    whyItMattersKm:
      'skill tune performance បន្ទាប់ onboarding — hit ratio អាស្រ័យ rule ត្រឹមត្រូវ។',
    commonMistakesKm: ['Bypass cache ទាំង site ជំនួស path dynamic តែប៉ុណ្ណោះ។'],
  },
  'as-waf': {
    summaryKm:
      'Managed Rulesets, OWASP core, custom expression-based rule។ ដំណើរការនៅ edge មុន origin — log និង event ក្នុង Security Analytics។',
    whyItMattersKm:
      'ការពារ website/API ស្នូល — ត្រូវមាន process tune false positive។',
  },
  'as-ddos': {
    summaryKm:
      'L3/L4/L7 protection ដោយស្វ័យប្រវត្តិពេល proxied។ network-layer mitigation រួម HTTP DDoS rule។ customer ភាគច្រើនមិន enable manual។',
    whyItMattersKm:
      'ពន្យល់ពេល incident និង plan comparison — unlimited mitigation plan ជាច្រើន។',
  },
  'as-bot-protection': {
    summaryKm:
      'Super Bot Fight Mode, Bot Management, JS detection និង challenge។ តុល្យភាព block abuse និងអនុញ្ញាត crawler ដែលត្រឹមត្រូវ។',
    whyItMattersKm:
      'Ecommerce និង login form — ភ្ជាប់ bot protection ជាមួយ Turnstile។',
  },
  'as-rate-limiting': {
    summaryKm:
      'rate limiting rule ក្នុង WAF — count តាម IP, cookie, path, header។ mitigation៖ block, challenge ឬ log។',
    whyItMattersKm:
      'ការពារការចូល និង API — ជំនួព API Shield សម្រាប់ schema validation។',
  },
  'as-load-balancing': {
    summaryKm:
      'Global LB ជាមួយ origin pool, geo steering និង health monitor។ រួម proxied DNS ជាមួយ automatic failover។',
    whyItMattersKm:
      'Multi-region HA — architecture diagram នៅ hub បង្ហាញ pattern នេះ។',
  },
  'page-rules-vs-modern-rules': {
    summaryKm:
      'Page Rules legacy (count កំណត់) — សេរីប Configuration Rules, Cache Rules, Redirect Rules, Transform Rules។ Page Rules តែ compatibility legacy។',
    whyItMattersKm:
      'ជៀស tutorial outdated — modern expression-based rule scale ល្អជាង។',
    commonMistakesKm: ['បង្កើត Page Rule ថ្មី ជំនួស Cache/Configuration Rule equivalent។'],
  },
  'ssl-tls-modes': {
    summaryKm:
      'Off/Flexible/Full/Full (strict) — គ្រប Cloudflare↔origin encryption។ production គួរប្រើ Full (strict) ជាមួយ origin certificate valid។',
    whyItMattersKm:
      'error 525/526 រួចជាញឹកញាប់មកពី mode ខុស — checklist onboarding ចាំបាច់។',
    commonMistakesKm: ['Flexible SSL ជាមួយ login form — traffic leg origin មិន encrypted។'],
  },
  'origin-protection': {
    summaryKm:
      'លាក origin IP (proxy), allowlist Cloudflare IP តែប៉ុណ្ណោះ, Authenticated Origin Pulls, Tunnel origin private។ កាត់ bypass WAF ដោយ hit IP ដោយផ្ទាល់។',
    whyItMattersKm:
      'hardening advanced បន្ទាប់ WAF — SE roadmap week 3 performance/security។',
    commonMistakesKm: ['Origin IP បង្ហាញ ក្នុង email header ឬ DNS history ចាស់។'],
  },

  // Stage 6 — Developer Platform Path
  'dp-pages': {
    summaryKm:
      'Cloudflare Pages host static site រួម Functions (Workers) full-stack ស្រាល។ Git integration, preview deployment, custom domain via Cloudflare zone។',
    whyItMattersKm:
      'Entry point static deploy និង MVP — deploy-static-site use case នៅ hub។',
    suggestedExerciseKm: 'Deploy demo Astro/HTML site ទៅ Pages ហើយ ភ្ជាប់ subdomain។',
  },
  'dp-workers': {
    summaryKm:
      'Workers ដំណើរការ JavaScript/TypeScript/Wasm នៅ edge — request handler, API, middleware។ គ្មាន OS server traditional; scale ដោយស្វ័យប្រវត្តិ។',
    whyItMattersKm:
      'Foundation Developer Platform — binding (KV, D1 ជាដើម) ភ្ជាប់ទៅ Worker script។',
  },
  'dp-workers-routes': {
    summaryKm:
      'Route ភ្ជាប់ hostname/path ទៅ Worker — via dashboard, wrangler ឬ Workers for Platforms។ route order និង specificity កំណត់ script ណាដំណើរការ។',
    whyItMattersKm:
      'ភ្ជាប់ edge logic ទៅ production domain — scope ខុស Pages Functions។',
    commonMistakesKm: ['Route `*/*` ទូលាយពេក catch traffic មិនបានចេតនា។'],
  },
  'dp-kv': {
    summaryKm:
      'Workers KV គឺ eventually consistent key-value store, read-heavy — config, session cache, feature flag។ មិនជំនួស SQL query ស្មុគ្សរួច។',
    whyItMattersKm:
      'Storage decision tree៖ KV vs D1 vs R2 — foundation architect mini app។',
  },
  'dp-d1': {
    summaryKm:
      'D1 គឺ serverless SQLite នៅ edge — relational SQL, សមសម្រាប់ CRUD app តូច/មធ្យម។ bind D1 ទៅ Worker; migrate via wrangler។',
    whyItMattersKm:
      'Replace external DB សម្រាប់ MVP — link build-serverless-app និង SaaS pattern។',
    commonMistakesKm: ['ប្រើ D1 ជា analytics warehouse write-heavy ធំ។'],
  },
  'dp-r2': {
    summaryKm:
      'R2 គឺ S3-compatible object storage គ្មាន egress fee via Workers។ store user upload, asset, backup — រួម Workers presigned URL។',
    whyItMattersKm:
      'Media និង SaaS file upload use case — R2 architecture នៅ hub។',
  },
  'dp-queues': {
    summaryKm:
      'Queues decouple producer និង consumer — Worker មួយ send message, មួយទៀត process async។ retry និង dead letter background job។',
    whyItMattersKm:
      'Email, webhook, batch pattern — ជំនួស cron + poll ក្នុង scale។',
  },
  'dp-durable-objects': {
    summaryKm:
      'Durable Objects គឺ stateful single-threaded instance តាម ID — chat room, counter, realtime coordination។ ខុស KV៖ strong consistency និង WebSockets។',
    whyItMattersKm:
      'Realtime និង multiplayer — កុំប្រើ DO state need សាមញ្ញរាល់យ៉ាង។',
    commonMistakesKm: ['ប្រើ DO ជំនួស KV config static — overkill និងថ្លៃជាង។'],
  },
  'dp-workflows': {
    summaryKm:
      'Workflows orchestrate job durable multi-step — sleep, retry, human-in-the-loop។ សមសម្រាប់ pipeline វែងជាង Worker invocation តែមួយ។',
    whyItMattersKm:
      'ជំនួព Queues process មាន state machine ច្បាស់។',
  },
  'dp-workers-ai-vectorize': {
    summaryKm:
      'Workers AI ដំណើរការ model inference នៅ edge; Vectorize store embedding semantic search និង RAG។ binding ទាំងពីររួចជាញឹកញាប់ប្រើរួម AI pipeline។',
    whyItMattersKm:
      'Build-ai-applications use case និង ai-rag architecture នៅ hub។',
  },
  'dp-fullstack-app': {
    summaryKm:
      'Pattern ទូទៅ៖ Pages frontend + Functions/Workers API + D1/KV/R2 + Access/Turnstile/WAF production។ Wrangler deploy staging/prod env។',
    whyItMattersKm:
      'Developer track capstone — ភ្ជាប់ topic stage 6 ទាំងអស់ទៅ MVP architecture តែមួយ។',
    suggestedExerciseKm:
      'Sketch todo app architecture៖ Pages UI + Worker API + D1 + Turnstile។',
    commonMistakesKm: ['Ship production គ្មាន WAF/rate limit លើ public API។'],
  },

  // Stage 7 — Cloudflare One Path
  'c1-zero-trust': {
    summaryKm:
      'Zero Trust៖ កុំ ជឿ network ខាងក្នុង default — request រាល់យ៉ាង ផ្ទៀងផ្ទាត់ identity, device និង policy។ "Verify explicitly, least privilege, assume breach"។',
    whyItMattersKm:
      'Cloudflare One រួម Zero Trust — ខុស stack WAF website public តែប៉ុណ្ណោះ។',
  },
  'c1-vpn-vs-ztna': {
    summaryKm:
      'VPN ដាក់ user លើ network ខាងក្នុងទាំងមូល — blast radius ធំ។ ZTNA (Zero Trust Network Access) ផ្តល់ access per app/resource policy លម្អិត។',
    whyItMattersKm:
      'replace-vpn use case — pitch Cloudflare Access ទៅ IT និង founder។',
    commonMistakesKm: [
      'ចាត់ WARP ជា full-tunnel VPN traditional traffic ទាំងអស់ ដោយគ្មាន policy design។',
    ],
  },
  'c1-access': {
    summaryKm:
      'Cloudflare Access ការពារ app internal/SaaS — user login via IdP, policy សម្រេច allow/deny។ មិនចាំបាច់បើក inbound port origin។',
    whyItMattersKm:
      'Admin dashboard, staging, internal API — protect-admin pattern stage 8។',
    suggestedExerciseKm: 'បង្កើត self-hosted Access application demo ជាមួយ email domain policy។',
  },
  'c1-gateway': {
    summaryKm:
      'Secure Web Gateway — តម្រង DNS/HTTP/network traffic user (via WARP) policy៖ ទប់ស្កត់ malware, category, DLP។ SWG ជំនួស browsing គ្មានការគ្រប់គ្រង។',
    whyItMattersKm:
      'Security company-wide និង secure SaaS access — link products/swg។',
  },
  'c1-warp': {
    summaryKm:
      'WARP client ភ្ជាប់ device ទៅ Cloudflare edge — អនុវត្ត Gateway policy និង private routing។ device enrollment via Zero Trust dashboard។',
    whyItMattersKm:
      'Remote workforce — pair secure-remote-users use case។',
    commonMistakesKm: ['ដំឡើង WARP ទូលាយដោយគ្មាន pilot group និង exception policy។'],
  },
  'c1-tunnel': {
    summaryKm:
      'cloudflared បង្កើត outbound tunnel origin/network private ទៅ Cloudflare — គ្មាន inbound firewall hole។ public hostname route tunnel ទៅ service internal។',
    whyItMattersKm:
      'Self-hosted homelab ឬ private API — tunnel architecture SE week 5។',
  },
  'c1-device-posture': {
    summaryKm:
      'device posture ពិនិត្យ device (OS patch, disk encryption, client version) មុន allow Access/Gateway។ policy អាច require managed device។',
    whyItMattersKm:
      'Enterprise compliance — ខុស access consumer "password only"។',
  },
  'c1-idp-integration': {
    summaryKm:
      'ភ្ជាប់ Okta, Azure AD, Google Workspace ជាដើម IdP Access។ SSO, group sync, SCIM provisioning user/group។',
    whyItMattersKm:
      'Enterprise required — កុំ rely one-time PIN long term production។',
    commonMistakesKm: ['ចែក Cloudflare admin access ជំនួស ភ្ជាប់ IdP group ទៅ policy។'],
  },
  'c1-saas-security': {
    summaryKm:
      'គ្រប់គ្រង SaaS access (M365, Salesforce ជាដើម) via Access identity proxy រួម CASB shadow IT detection។ policy user/group និង device។',
    whyItMattersKm:
      'secure-saas-access use case — link products/casb។',
  },
  'c1-sase-overview': {
    summaryKm:
      'SASE (Secure Access Service Edge) រួម network និង security cloud-delivered៖ ZTNA, SWG, CASB, FWaaS។ Cloudflare One positioning SASE/SSE។',
    whyItMattersKm:
      'Executive និង sales conversation — SASE architecture hub។',
    suggestedExerciseKm:
      'អាន SASE diagram ហើយ ភ្ជាប់ capability 3 ទៅ Access/Gateway/WARP។',
  },

  // Stage 8 — Practical Use Cases
  'uc-protect-website': {
    summaryKm:
      'Onboard domain, proxy record, SSL Full (strict), WAF managed rule, basic bot fight mode។ Architecture៖ Visitor → DNS + Proxy + Security + Cache → Origin។',
    whyItMattersKm:
      'SMB use case ទូទៅបំផុត — /use-cases/protect-website មាន checklist លម្អិត។',
  },
  'uc-speed-up-website': {
    summaryKm:
      'បើក CDN/cache, Cache Rules static asset, Polish/Images, HTTP/2/3, early hints។ វាស់ before/after Web Analytics ឬ Lighthouse។',
    whyItMattersKm:
      'ដំណើរការដូចគ្នាជាមួយ protect — customer ច្រើនទិញ Cloudflare performance ជាមុន។',
    suggestedExerciseKm:
      'ប្រៀបធៀប TTFB/LCP before/after enable cache rule /assets/*។',
  },
  'uc-secure-api': {
    summaryKm:
      'API proxied Cloudflare៖ rate limit, WAF OWASP, API Shield schema validation (បើមាន), mTLS/token partner។ log និង alert anomaly។',
    whyItMattersKm:
      'Developer និង SE — secure-api use case plus api-security product។',
  },
  'uc-stop-bots': {
    summaryKm:
      'រួម Bot Management, login rate limit, Turnstile form, geo/rule abuse pattern។ រក្សា SEO crawler allowlist។',
    whyItMattersKm:
      'Ecommerce និង lead form — link bot protection stage 5។',
  },
  'uc-replace-vpn': {
    summaryKm:
      'VPN → ZTNA migration៖ inventory app, Access policy per app, WARP deployment, Tunnel resource private។ pilot department មួយមុន rollout។',
    whyItMattersKm:
      'Cloudflare One flagship — replace-vpn use case និង vpn-migration reference។',
  },
  'uc-build-serverless-app': {
    summaryKm:
      'Stack៖ Pages/Workers + D1/R2/KV, wrangler CI, custom domain, Turnstile + WAF public API។ preview env PR។',
    whyItMattersKm:
      'Developer capstone — build-serverless-app use case។',
    suggestedExerciseKm:
      'Deploy mini API + static UI ហើយ document binding/env wrangler.toml។',
  },
  'uc-protect-admin-dashboard': {
    summaryKm:
      'កុំទុក /admin public៖ Access policy (admin IdP group), IP allowlist optional, WAF path rule, Tunnel origin private។ audit Access event log។',
    whyItMattersKm:
      'Startup និង internal tool pattern — រួម App Services + Cloudflare One។',
    commonMistakesKm: ['Security through obscurity /admin-secret URL គ្មាន Access ឬ auth ខ្លាំង។'],
  },
  'uc-secure-remote-users': {
    summaryKm:
      'Deploy WARP client, Gateway DNS/HTTP filtering, device enrollment, split tunnel vs full tunnel policy។ support playbook user offline។',
    whyItMattersKm:
      'Remote HR និង BYOD — secure-remote-users use case។',
  },
  'uc-startup-mvp': {
    summaryKm:
      'MVP ធម្មតា៖ Pages marketing + Workers API + D1 + R2 upload + Turnstile + free/pro plan awareness។ ops minimal; add WAF/Access scale។',
    whyItMattersKm:
      'Founder roadmap week 4 — ភ្ជាប់ cost awareness និង architecture pattern។',
    suggestedExerciseKm:
      'សរសេរ one-pager MVP architecture៖ user flow, Cloudflare product, free-tier cost estimate។',
    commonMistakesKm: ['Over-engineer Durable Objects/Queues មុន real user។'],
  },
};
