import type { LocalizedString } from '../i18n/types';

export type Cf101Term = {
  term: string;
  definition: LocalizedString;
};

export type Cf101TermSection = {
  id: string;
  title: LocalizedString;
  terms: Cf101Term[];
};

/** Sourced from internal Cloudflare terminology reference (Orange Cloud training). */
export const cf101TerminologySections: Cf101TermSection[] = [
  {
    id: 'basics',
    title: { vi: 'Thuật ngữ cơ bản', en: 'Core terminology' },
    terms: [
      { term: 'Session', definition: { vi: 'Phiên kết nối giữa client và server.', en: 'A connection session between client and server.' } },
      { term: 'Congestion', definition: { vi: 'Nghẽn mạng khi lưu lượng vượt khả năng xử lý.', en: 'Network congestion when traffic exceeds capacity.' } },
      { term: 'Failover', definition: { vi: 'Chuyển sang hệ thống dự phòng khi primary gặp sự cố.', en: 'Switching to a backup system when the primary fails.' } },
      { term: 'Redundancy', definition: { vi: 'Dự phòng — nhiều thành phần thay thế để tăng độ tin cậy.', en: 'Redundancy — spare components to improve reliability.' } },
      { term: 'High Availability (HA)', definition: { vi: 'Hệ thống có tính sẵn sàng cao, giảm downtime.', en: 'High availability — designed to minimize downtime.' } },
      { term: 'Scalability', definition: { vi: 'Khả năng mở rộng khi tải tăng.', en: 'Ability to scale as load grows.' } },
      { term: 'Horizontal Scaling', definition: { vi: 'Mở rộng bằng cách thêm node/máy chủ.', en: 'Scaling out by adding nodes or servers.' } },
      { term: 'Vertical Scaling', definition: { vi: 'Tăng tài nguyên (CPU/RAM) trên một máy.', en: 'Scaling up by adding CPU/RAM to one machine.' } },
      { term: 'SLA', definition: { vi: 'Cam kết dịch vụ (uptime, thời gian phản hồi).', en: 'Service level agreement (uptime, response time).' } },
      { term: 'Multi-region', definition: { vi: 'Hệ thống triển khai trên nhiều khu vực địa lý.', en: 'System deployed across multiple geographic regions.' } },
      { term: 'Socket', definition: { vi: 'Kết nối logic giữa hai endpoint (IP + port).', en: 'Logical connection between two endpoints (IP + port).' } },
      { term: 'Edge', definition: { vi: 'Rìa mạng — điểm Cloudflare xử lý traffic trước origin.', en: 'Network edge — where Cloudflare processes traffic before the origin.' } },
      { term: 'POP (Point of Presence)', definition: { vi: 'Điểm truy cập / data center Cloudflare gần người dùng.', en: 'Point of Presence — Cloudflare data center near users.' } },
    ],
  },
  {
    id: 'dns-routing',
    title: { vi: 'DNS & điều hướng traffic', en: 'DNS & traffic routing' },
    terms: [
      { term: 'Authoritative DNS', definition: { vi: 'Nơi quản lý chính thức bản ghi của domain.', en: 'The official source of truth for a domain’s DNS records.' } },
      { term: 'Recursive DNS', definition: { vi: 'Resolver truy vấn giúp end user (8.8.8.8, 1.1.1.1).', en: 'Resolver that looks up answers on behalf of end users.' } },
      { term: 'Resolver', definition: { vi: 'Máy chủ phân giải DNS.', en: 'DNS resolver server.' } },
      { term: 'NS Record', definition: { vi: 'Khai báo nameserver cho zone.', en: 'Declares nameservers for a zone.' } },
      { term: 'MX Record', definition: { vi: 'Chỉ định mail server.', en: 'Points to mail servers.' } },
      { term: 'TXT Record', definition: { vi: 'Text record — xác thực domain, SPF, DKIM, v.v.', en: 'Text record for verification, SPF, DKIM, etc.' } },
      { term: 'SRV Record', definition: { vi: 'Khai báo service (host, port, protocol).', en: 'Service location record (host, port, protocol).' } },
      { term: 'DNSSEC', definition: { vi: 'Xác thực DNS chống giả mạo bản ghi.', en: 'Cryptographic DNS authentication against spoofing.' } },
      { term: 'Geo Routing', definition: { vi: 'Điều hướng theo vị trí địa lý người dùng.', en: 'Routing based on user geography.' } },
      { term: 'Traffic Steering', definition: { vi: 'Điều hướng thông minh: dynamic, geo, random, weighted.', en: 'Smart steering: dynamic, geo, random, weighted.' } },
      { term: 'Split Horizon DNS', definition: { vi: 'DNS trả kết quả khác nhau theo vùng/mạng nội bộ.', en: 'Different DNS answers for internal vs external clients.' } },
      { term: 'A / AAAA', definition: { vi: 'Bản ghi trỏ IPv4 / IPv6.', en: 'DNS records pointing to IPv4 / IPv6 addresses.' } },
      { term: 'CNAME', definition: { vi: 'Alias trỏ tên miền tới tên khác.', en: 'Canonical name alias to another hostname.' } },
      { term: 'TTL', definition: { vi: 'Time To Live — thời gian cache bản ghi DNS ở resolver.', en: 'Time To Live — how long resolvers cache a DNS record.' } },
      { term: 'Orange Cloud', definition: { vi: 'Proxy bật — traffic đi qua Cloudflare.', en: 'Proxied record — traffic flows through Cloudflare.' } },
      { term: 'Gray Cloud', definition: { vi: 'DNS only — traffic không qua proxy Cloudflare.', en: 'DNS-only — traffic bypasses Cloudflare proxy.' } },
      { term: 'Anycast', definition: { vi: 'Một IP được quảng bá từ nhiều edge — routing tới POP gần nhất.', en: 'One IP announced from many edges — routes to nearest POP.' } },
    ],
  },
  {
    id: 'performance',
    title: { vi: 'Performance & CDN', en: 'Performance & CDN' },
    terms: [
      { term: 'Purge Cache', definition: { vi: 'Xóa cache thủ công trên edge.', en: 'Manually invalidate cached content on the edge.' } },
      { term: 'Compression', definition: { vi: 'Nén response (Brotli, Gzip) để giảm bandwidth.', en: 'Compressing responses (Brotli, Gzip) to save bandwidth.' } },
      { term: 'Brotli', definition: { vi: 'Chuẩn nén hiện đại, thường nhỏ hơn Gzip.', en: 'Modern compression format, often smaller than Gzip.' } },
      { term: 'Gzip', definition: { vi: 'Chuẩn nén phổ biến trên web.', en: 'Common web compression format.' } },
      { term: 'Minification', definition: { vi: 'Rút gọn JS/CSS/HTML (bỏ whitespace).', en: 'Stripping whitespace from JS/CSS/HTML.' } },
      { term: 'Prefetch / Preload', definition: { vi: 'Tải trước hoặc ưu tiên tài nguyên quan trọng.', en: 'Prefetch or prioritize critical assets early.' } },
      { term: 'TTFB', definition: { vi: 'Time To First Byte — thời gian nhận byte đầu từ server.', en: 'Time To First Byte from the server.' } },
      { term: 'HTTP/2', definition: { vi: 'Multiplexing — nhiều request song song trên một kết nối.', en: 'Multiplexed requests over one connection.' } },
      { term: 'HTTP/3', definition: { vi: 'HTTP over QUIC — giảm latency, ổn định hơn trên mạng lossy.', en: 'HTTP over QUIC — lower latency on lossy networks.' } },
      { term: 'QUIC', definition: { vi: 'Giao thức transport trên UDP (nền tảng HTTP/3).', en: 'UDP-based transport protocol (HTTP/3 foundation).' } },
      { term: 'Smart Tiered Cache', definition: { vi: 'Cache nhiều tầng giữa các POP.', en: 'Multi-tier caching between POPs.' } },
      { term: 'Cache DYNAMIC', definition: { vi: 'Cloudflare proxy nhưng không cache — mỗi request về origin.', en: 'Proxied but not cached — every request hits origin.' } },
      { term: 'Cache HIT', definition: { vi: 'Có cache hợp lệ — trả từ edge.', en: 'Valid cache — served from edge.' } },
      { term: 'Cache MISS', definition: { vi: 'Không có cache — fetch đầy đủ từ origin.', en: 'No cache — full fetch from origin.' } },
      { term: 'Cache REVALIDATED', definition: { vi: 'Có cache nhưng kiểm tra origin trước khi trả.', en: 'Cached but revalidated with origin before serving.' } },
    ],
  },
  {
    id: 'security',
    title: { vi: 'Security — WAF & protection', en: 'Security — WAF & protection' },
    terms: [
      { term: 'Behavioral Analysis', definition: { vi: 'Phân tích hành vi request để phát hiện bất thường.', en: 'Analyzing request behavior for anomalies.' } },
      { term: 'Exploit / Vulnerability', definition: { vi: 'Khai thác lỗ hổng / điểm yếu bảo mật.', en: 'Exploit / security vulnerability.' } },
      { term: 'SQL Injection (SQLi)', definition: { vi: 'Chèn SQL độc hại để truy cập dữ liệu trái phép.', en: 'Injecting malicious SQL to access unauthorized data.' } },
      { term: 'XSS', definition: { vi: 'Cross-Site Scripting — chèn JavaScript độc vào trang.', en: 'Cross-Site Scripting — injecting malicious scripts.' } },
      { term: 'CSRF', definition: { vi: 'Lợi dụng session hợp lệ để thực hiện hành động trái phép.', en: 'Forging requests using a victim’s valid session.' } },
      { term: 'RCE', definition: { vi: 'Remote Code Execution — chạy mã từ xa trên server.', en: 'Remote Code Execution on the server.' } },
      { term: 'CVE', definition: { vi: 'Mã định danh lỗ hổng đã công bố.', en: 'Published vulnerability identifier.' } },
      { term: 'Mitigation', definition: { vi: 'Biện pháp giảm thiểu tấn công.', en: 'Measures to reduce attack impact.' } },
      { term: 'False Positive', definition: { vi: 'Chặn nhầm traffic hợp lệ.', en: 'Blocking legitimate traffic by mistake.' } },
      { term: 'Managed Ruleset', definition: { vi: 'Bộ rule WAF do Cloudflare duy trì, cập nhật thường xuyên.', en: 'Cloudflare-maintained WAF rules updated regularly.' } },
      { term: 'Managed Challenge', definition: { vi: 'Cloudflare chọn cơ chế xác minh phù hợp (JS, interactive, v.v.).', en: 'Cloudflare picks the right verification method automatically.' } },
    ],
  },
  {
    id: 'bots',
    title: { vi: 'Bot Management', en: 'Bot Management' },
    terms: [
      { term: 'Headless Browser', definition: { vi: 'Trình duyệt không UI — dùng automation/scraping.', en: 'Browser without UI — used for automation/scraping.' } },
      { term: 'Scraping', definition: { vi: 'Thu thập dữ liệu web tự động.', en: 'Automated web data collection.' } },
      { term: 'Credential Stuffing', definition: { vi: 'Dùng credential rò rỉ để đăng nhập hàng loạt.', en: 'Using leaked credentials for bulk login attempts.' } },
      { term: 'Bot Score', definition: { vi: 'Điểm 1–99: 1 = chắc chắn bot, 30–99 = likely human.', en: 'Score 1–99: 1 = automated, 30–99 = likely human.' } },
      { term: 'Verified Bots', definition: { vi: 'Bot đã xác minh (Googlebot, Bingbot, v.v.).', en: 'Verified crawlers (Googlebot, Bingbot, etc.).' } },
      { term: 'JavaScript Detections', definition: { vi: 'Chạy JS trên mọi request để thu tín hiệu bot liên tục.', en: 'Runs JS on requests to collect ongoing bot signals.' } },
      { term: 'Search engine crawler', definition: { vi: 'Bot lập chỉ mục cho công cụ tìm kiếm.', en: 'Bot that indexes pages for search engines.' } },
      { term: 'AI Crawler', definition: { vi: 'Thu thập nội dung để huấn luyện mô hình AI.', en: 'Collects content to train AI models.' } },
    ],
  },
  {
    id: 'zero-trust',
    title: { vi: 'Zero Trust / ZTNA', en: 'Zero Trust / ZTNA' },
    terms: [
      { term: 'Federation', definition: { vi: 'Liên kết hệ thống xác thực giữa tổ chức.', en: 'Linking identity systems across organizations.' } },
      { term: 'SCIM', definition: { vi: 'Tự động đồng bộ tạo/cập nhật/xóa user giữa IdP và app.', en: 'Automated user provisioning between IdP and apps.' } },
      { term: 'SSO', definition: { vi: 'Single Sign-On — đăng nhập một lần, nhiều app.', en: 'Single Sign-On across applications.' } },
      { term: 'MFA', definition: { vi: 'Xác thực đa yếu tố ngoài mật khẩu.', en: 'Multi-factor authentication beyond passwords.' } },
      { term: 'CASB', definition: { vi: 'Giám sát và kiểm soát truy cập SaaS.', en: 'Cloud Access Security Broker for SaaS.' } },
    ],
  },
];
