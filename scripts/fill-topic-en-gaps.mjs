/** Fill missing commonMistakesEn / suggestedExerciseEn in topicEn.ts */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const topicEnPath = join(root, 'src/data/contentRoadmap/topicEn.ts');

const MISTAKE_EN: Record<string, string> = {
  'Nghĩ Internet = Wi‑Fi hoặc = một công ty duy nhất vận hành.':
    'Treating the Internet as Wi‑Fi only, or as a single company that runs it.',
  'Nhầm client với server — trình duyệt luôn là client khi bạn duyệt web.':
    'Confusing client and server — the browser is always the client when you browse the web.',
  'Nhầm IP public với private — NAT che giấu private IP phía sau router.':
    'Confusing public and private IP — NAT hides private IPs behind the router.',
  'Nhầm port với protocol — port là số cổng, protocol là quy tắc giao tiếp.':
    'Confusing port with protocol — a port is a socket number; a protocol defines communication rules.',
  'Nhầm TCP (đáng tin) với UDP (nhanh, không đảm bảo) — chọn sai khi debug latency.':
    'Confusing TCP (reliable) with UDP (fast, no delivery guarantee) — leads to wrong latency debugging.',
  'Nhầm HTTP với HTTPS — HTTPS = HTTP + TLS encryption.':
    'Confusing HTTP with HTTPS — HTTPS is HTTP over TLS encryption.',
  'Nhầm latency (độ trễ) với bandwidth (băng thông) — site chậm có thể do routing, không phải Mbps thấp.':
    'Confusing latency (delay) with bandwidth (throughput) — slow sites can be routing issues, not low Mbps.',
  'Nhầm NAT với firewall — NAT dịch địa chỉ; firewall lọc traffic.':
    'Confusing NAT with a firewall — NAT translates addresses; a firewall filters traffic.',
  'Nhầm reverse proxy với forward proxy — Cloudflare là reverse proxy (bảo vệ origin).':
    'Confusing reverse proxy with forward proxy — Cloudflare is a reverse proxy protecting the origin.',
  'Nhầm domain với hosting — domain chỉ là tên; hosting là nơi chạy code/files.':
    'Confusing domain with hosting — a domain is a name; hosting is where code and files run.',
  'Nhầm DNS resolver với authoritative nameserver — resolver hỏi giúp bạn; authoritative trả lời chính thức.':
    'Confusing DNS resolver with authoritative nameserver — resolver queries on your behalf; authoritative gives the official answer.',
  'Nhầm A record với CNAME — A trỏ IP; CNAME trỏ tên khác (alias).':
    'Confusing A record with CNAME — A points to an IP; CNAME is an alias to another name.',
  'Nhầm TTL thấp = DNS nhanh hơn — TTL thấp chỉ giúp thay đổi propagate nhanh, không tăng tốc truy vấn.':
    'Thinking low TTL means faster DNS — low TTL only speeds up change propagation, not query speed.',
  'Nhầm DNS-only (gray cloud) với proxied (orange cloud) — chỉ orange cloud đi qua Cloudflare edge.':
    'Confusing DNS-only (gray cloud) with proxied (orange cloud) — only orange cloud traffic hits Cloudflare edge.',
  'Nhầm CDN với hosting — CDN cache và phân phối; hosting chạy ứng dụng gốc.':
    'Confusing CDN with hosting — CDN caches and distributes; hosting runs the origin application.',
  'Nhầm cache hit với browser cache — CDN cache ở edge; browser cache ở thiết bị user.':
    'Confusing CDN cache hit with browser cache — CDN cache is at the edge; browser cache is on the user device.',
  'Nhầm static với dynamic — static có thể cache lâu; dynamic thường cần origin mỗi request.':
    'Confusing static with dynamic — static assets cache well; dynamic content often needs the origin per request.',
  'Purge toàn bộ cache khi chỉ cần purge URL cụ thể — gây tải origin không cần thiết.':
    'Purging all cache when only specific URLs changed — unnecessary origin load.',
  'Nhầm TLS với SSL — SSL là tên cũ; TLS là giao thức mã hóa hiện đại.':
    'Using SSL and TLS interchangeably without context — TLS is the modern encryption protocol.',
  'Nhầm certificate với private key — cert public; key phải giữ bí mật trên origin.':
    'Confusing certificate with private key — the cert is public; the key must stay secret on the origin.',
  'Nghĩ WAF thay thế patch ứng dụng — WAF bổ sung, không sửa lỗi code.':
    'Expecting WAF to replace app patching — WAF adds a layer; it does not fix code vulnerabilities.',
  'Nhầm bot tốt (Googlebot) với bot xấu — cần allowlist/search bots, chặn scraper/abuse.':
    'Treating all bots the same — allow good bots (e.g. Googlebot); block scrapers and abuse.',
  'Nhầm rate limiting với DDoS mitigation — rate limit per client; DDoS là volumetric attack scale lớn.':
    'Confusing rate limiting with DDoS mitigation — rate limits per client; DDoS is large-scale volumetric attack.',
  'Nhầm orange cloud với gray cloud — orange = proxy + bảo vệ; gray = DNS only.':
    'Confusing orange cloud with gray cloud — orange = proxied + protected; gray = DNS only.',
  'Nhầm Workers với VPS — Workers là serverless edge; không SSH vào máy.':
    'Confusing Workers with a VPS — Workers are serverless at the edge; there is no SSH access.',
  'Nhầm KV với D1 — KV key-value, eventual consistency; D1 là SQL relational.':
    'Confusing KV with D1 — KV is key-value with eventual consistency; D1 is relational SQL.',
  'Nhầm R2 với KV — R2 là object storage (file); KV là key-value nhỏ, latency thấp.':
    'Confusing R2 with KV — R2 is object storage for files; KV is low-latency key-value.',
  'Nhầm VPN truyền thống với ZTNA — VPN mở network; ZTNA cấp quyền theo app/identity.':
    'Confusing traditional VPN with ZTNA — VPN opens the network; ZTNA grants per-app access by identity.',
  'Nhầm Access với Gateway — Access bảo vệ app; Gateway lọc traffic outbound/inbound của device.':
    'Confusing Access with Gateway — Access protects apps; Gateway filters device traffic.',
};

const EXERCISE_EN: Record<string, string> = {
  'Vẽ sơ đồ: máy bạn → router nhà → ISP → Internet → server đích.':
    'Draw: your device → home router → ISP → Internet → destination server.',
  'Mở DevTools → Network, reload trang, xem request đầu tiên (document) và response headers.':
    'Open DevTools → Network, reload the page, inspect the first document request and response headers.',
  'Tra cứu IP public của bạn (whatismyip) và so với IP local (ipconfig/ifconfig).':
    'Look up your public IP (whatismyip) and compare it to your local IP (ipconfig/ifconfig).',
  'Liệt kê 3 protocol bạn dùng hàng ngày (HTTP, DNS, TLS…) và mục đích mỗi cái.':
    'List 3 protocols you use daily (HTTP, DNS, TLS…) and what each one does.',
  'Dùng `dig` hoặc online DNS lookup tra A record của domain bạn biết.':
    'Use `dig` or an online DNS lookup to query the A record of a domain you know.',
  'So sánh TTL cao vs thấp trên một record — ghi trade-off cache vs agility.':
    'Compare high vs low TTL on one record — note the cache vs agility trade-off.',
  'Bật/tắt orange cloud trên một subdomain test — quan sát IP trả về thay đổi.':
    'Toggle orange cloud on a test subdomain — observe the resolved IP change.',
  'Kiểm tra Cache-Control header trên asset static vs HTML dynamic.':
    'Check Cache-Control headers on a static asset vs dynamic HTML.',
  'Chạy securityheaders.com hoặc DevTools Security tab trên site HTTPS.':
    'Run securityheaders.com or DevTools Security tab on an HTTPS site.',
  'Đọc 1 managed WAF rule trong dashboard (chỉ đọc, chưa bật block).':
    'Read one managed WAF rule in the dashboard (read only — do not enable block yet).',
  'Deploy Hello World Worker qua dashboard hoặc Wrangler — xem request log.':
    'Deploy a Hello World Worker via dashboard or Wrangler — review request logs.',
  'Tạo Access policy cho một app nội bộ test (email OTP hoặc IdP).':
    'Create an Access policy for a test internal app (email OTP or IdP).',
};

async function main() {
  const { topicEnById } = await import('../src/data/contentRoadmap/topicEn.ts');
  let patched = 0;

  for (let i = 0; i <= 8; i++) {
    const mod = await import(`../src/data/contentRoadmap/stage${i}.ts`);
    const stage = mod[`stage${i}`];
    for (const t of stage.topics) {
      const en = topicEnById[t.id] ?? {};
      let changed = false;

      if (t.commonMistakesVi?.length && !en.commonMistakesEn?.length) {
        en.commonMistakesEn = t.commonMistakesVi.map(
          (m) => MISTAKE_EN[m] ?? m.replace(/^Nhầm /, 'Confusing ').replace(/^Nghĩ /, 'Assuming '),
        );
        changed = true;
      }
      if (t.suggestedExerciseVi && !en.suggestedExerciseEn) {
        en.suggestedExerciseEn = EXERCISE_EN[t.suggestedExerciseVi] ?? en.suggestedExerciseEn;
        changed = true;
      }
      if (changed) {
        topicEnById[t.id] = en;
        patched++;
      }
    }
  }

  if (patched === 0) {
    console.log('No topicEn gaps to patch');
    return;
  }

  // Re-serialize topicEn.ts is complex — write gaps to a patch file instead
  const gaps: Record<string, unknown> = {};
  for (const [id, en] of Object.entries(topicEnById)) {
    if (en.commonMistakesEn || en.suggestedExerciseEn) gaps[id] = en;
  }
  writeFileSync(join(root, 'scripts/topic-en-gaps.json'), JSON.stringify(gaps, null, 2));
  console.log(`Found ${patched} topics needing EN gap fill — see scripts/topic-en-gaps.json`);
}

main().catch(console.error);
