import type { LocalizedString } from '../i18n/types';

export type Cf101Term = {
  term: string;
  definition: LocalizedString;
  /** Public Cloudflare docs or learning-center URL. */
  source: string;
};

export type Cf101TermSection = {
  id: string;
  title: LocalizedString;
  terms: Cf101Term[];
};

const DNS_TYPES = 'https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/';
const DNS_SERVERS = 'https://www.cloudflare.com/learning/dns/dns-server-types/';
const CACHE_RESPONSES = 'https://developers.cloudflare.com/cache/concepts/cache-responses/';

/** Glossary rebuilt from public Cloudflare pages. Terms without a public page were removed. */
export const cf101TerminologySections: Cf101TermSection[] = [
  {
    id: 'basics',
    title: { vi: 'Mạng & edge', en: 'Network & edge' },
    terms: [
      {
        term: 'Edge',
        source: 'https://www.cloudflare.com/learning/cdn/glossary/edge-server/',
        definition: {
          vi: 'Máy chủ ở rìa mạng, gần người dùng hơn origin.',
          en: 'A server at the edge of the network, closer to users than the origin.',
        },
      },
      {
        term: 'POP (Point of Presence)',
        source: 'https://www.cloudflare.com/learning/cdn/glossary/point-of-presence-pop/',
        definition: {
          vi: 'Địa điểm Cloudflare đặt máy chủ để phục vụ người dùng gần đó.',
          en: 'A location where Cloudflare places servers to serve nearby users.',
        },
      },
      {
        term: 'Anycast',
        source: 'https://www.cloudflare.com/learning/cdn/glossary/anycast-network/',
        definition: {
          vi: 'Cùng một địa chỉ IP được công bố từ nhiều nơi, để traffic tới điểm gần nhất.',
          en: 'The same IP address announced from many places, so traffic reaches a nearby site.',
        },
      },
    ],
  },
  {
    id: 'dns-routing',
    title: { vi: 'DNS', en: 'DNS' },
    terms: [
      {
        term: 'Authoritative DNS',
        source: DNS_SERVERS,
        definition: {
          vi: 'Nameserver giữ câu trả lời chính thức cho một zone.',
          en: 'The nameserver that holds the official answers for a zone.',
        },
      },
      {
        term: 'Recursive DNS',
        source: DNS_SERVERS,
        definition: {
          vi: 'Resolver đi hỏi giúp người dùng cho đến khi có câu trả lời.',
          en: 'A resolver that looks up an answer on behalf of the user.',
        },
      },
      {
        term: 'NS Record',
        source: DNS_TYPES,
        definition: { vi: 'Chỉ nameserver của zone.', en: 'Points at the nameservers for a zone.' },
      },
      {
        term: 'MX Record',
        source: DNS_TYPES,
        definition: { vi: 'Chỉ mail server của domain.', en: 'Points at a domain’s mail servers.' },
      },
      {
        term: 'TXT Record',
        source: DNS_TYPES,
        definition: { vi: 'Bản ghi chữ, dùng cho xác minh và SPF.', en: 'A text record, used for verification and SPF.' },
      },
      {
        term: 'A / AAAA',
        source: DNS_TYPES,
        definition: { vi: 'Trỏ tên tới địa chỉ IPv4 hoặc IPv6.', en: 'Points a name at an IPv4 or IPv6 address.' },
      },
      {
        term: 'CNAME',
        source: DNS_TYPES,
        definition: { vi: 'Alias từ tên này sang tên khác.', en: 'An alias from one hostname to another.' },
      },
      {
        term: 'TTL',
        source: 'https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/',
        definition: {
          vi: 'Thời gian resolver được phép nhớ một bản ghi.',
          en: 'How long a resolver may cache a record.',
        },
      },
      {
        term: 'DNSSEC',
        source: 'https://developers.cloudflare.com/dns/dnssec/',
        definition: {
          vi: 'Chữ ký số cho bản ghi DNS để phát hiện giả mạo.',
          en: 'Digital signatures on DNS records so spoofed answers can be detected.',
        },
      },
      {
        term: 'Proxied DNS (orange cloud)',
        source: 'https://developers.cloudflare.com/dns/proxy-status/',
        definition: {
          vi: 'Record được proxy: traffic HTTP đi qua Cloudflare.',
          en: 'A proxied record: HTTP traffic goes through Cloudflare.',
        },
      },
      {
        term: 'DNS only (grey cloud)',
        source: 'https://developers.cloudflare.com/dns/proxy-status/',
        definition: {
          vi: 'Chỉ phân giải DNS; traffic không qua proxy Cloudflare.',
          en: 'DNS resolution only; traffic does not pass through the Cloudflare proxy.',
        },
      },
    ],
  },
  {
    id: 'performance',
    title: { vi: 'Cache & HTTP', en: 'Cache & HTTP' },
    terms: [
      {
        term: 'Purge Cache',
        source: 'https://developers.cloudflare.com/cache/how-to/purge-cache/',
        definition: { vi: 'Xóa bản sao đã cache trên edge.', en: 'Removes cached copies from the edge.' },
      },
      {
        term: 'Brotli and Gzip',
        source: 'https://developers.cloudflare.com/speed/optimization/content/compression/',
        definition: {
          vi: 'Hai cách nén response để giảm dung lượng tải.',
          en: 'Two ways to compress responses so downloads are smaller.',
        },
      },
      {
        term: 'Minification',
        source: 'https://developers.cloudflare.com/speed/optimization/content/content-minification/',
        definition: {
          vi: 'Bỏ ký tự thừa trong HTML, CSS hoặc JavaScript.',
          en: 'Strips extra characters from HTML, CSS, or JavaScript.',
        },
      },
      {
        term: 'TTFB',
        source: 'https://www.cloudflare.com/learning/cdn/glossary/time-to-first-byte-ttfb/',
        definition: {
          vi: 'Thời gian tới byte đầu tiên của response.',
          en: 'Time until the first byte of the response arrives.',
        },
      },
      {
        term: 'HTTP/3',
        source: 'https://www.cloudflare.com/learning/performance/what-is-http3/',
        definition: { vi: 'HTTP chạy trên QUIC.', en: 'HTTP carried over QUIC.' },
      },
      {
        term: 'Tiered Cache',
        source: 'https://developers.cloudflare.com/cache/how-to/tiered-cache/',
        definition: {
          vi: 'Các lớp cache giữa các data center trước khi về origin.',
          en: 'Cache layers between data centers before a request reaches the origin.',
        },
      },
      {
        term: 'Cache HIT / MISS',
        source: CACHE_RESPONSES,
        definition: {
          vi: 'HIT: trả từ cache. MISS: không có bản cache, phải hỏi origin.',
          en: 'HIT: served from cache. MISS: nothing cached, so the origin is contacted.',
        },
      },
    ],
  },
  {
    id: 'security',
    title: { vi: 'WAF', en: 'WAF' },
    terms: [
      {
        term: 'SQL injection',
        source: 'https://www.cloudflare.com/learning/security/threats/sql-injection/',
        definition: {
          vi: 'Chèn câu lệnh SQL vào input để đọc hoặc sửa dữ liệu.',
          en: 'Inserting SQL into input to read or change data.',
        },
      },
      {
        term: 'XSS',
        source: 'https://www.cloudflare.com/learning/security/threats/cross-site-scripting/',
        definition: {
          vi: 'Chèn script vào trang để chạy trong trình duyệt người khác.',
          en: 'Injecting a script into a page so it runs in someone else’s browser.',
        },
      },
      {
        term: 'CSRF',
        source: 'https://www.cloudflare.com/learning/security/threats/cross-site-request-forgery/',
        definition: {
          vi: 'Lừa trình duyệt gửi request bằng phiên đăng nhập sẵn có.',
          en: 'Tricking a browser into sending a request with an existing login.',
        },
      },
      {
        term: 'Managed Ruleset',
        source: 'https://developers.cloudflare.com/waf/managed-rules/',
        definition: {
          vi: 'Bộ rule WAF do Cloudflare viết và cập nhật.',
          en: 'A WAF ruleset written and updated by Cloudflare.',
        },
      },
      {
        term: 'Managed Challenge',
        source: 'https://developers.cloudflare.com/cloudflare-challenges/challenge-types/',
        definition: {
          vi: 'Cloudflare chọn kiểu thử thách phù hợp với request.',
          en: 'Cloudflare chooses a challenge type that fits the request.',
        },
      },
    ],
  },
  {
    id: 'bots',
    title: { vi: 'Bot', en: 'Bots' },
    terms: [
      {
        term: 'Bot Score',
        source: 'https://developers.cloudflare.com/bots/concepts/bot-score/',
        definition: {
          vi: 'Điểm từ 1 đến 99. 1 gần như chắc là tự động; 99 gần như chắc là người.',
          en: 'A score from 1 to 99. 1 is almost certainly automated; 99 is almost certainly a human.',
        },
      },
      {
        term: 'Verified bots',
        source: 'https://developers.cloudflare.com/bots/concepts/bot/verified-bots/',
        definition: {
          vi: 'Bot Cloudflare đã kiểm tra, ví dụ crawler của công cụ tìm kiếm.',
          en: 'Bots Cloudflare has verified, such as search-engine crawlers.',
        },
      },
      {
        term: 'JavaScript Detections',
        source: 'https://developers.cloudflare.com/bots/additional-configurations/javascript-detections/',
        definition: {
          vi: 'Chạy JavaScript để thu thêm tín hiệu về client.',
          en: 'Runs JavaScript to collect extra signals about the client.',
        },
      },
      {
        term: 'Credential stuffing',
        source: 'https://www.cloudflare.com/learning/bots/what-is-credential-stuffing/',
        definition: {
          vi: 'Thử hàng loạt mật khẩu đã lộ lên form đăng nhập.',
          en: 'Trying many leaked passwords against a login form.',
        },
      },
    ],
  },
  {
    id: 'zero-trust',
    title: { vi: 'Cloudflare One', en: 'Cloudflare One' },
    terms: [
      {
        term: 'SSO',
        source: 'https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/',
        definition: {
          vi: 'Đăng nhập một lần qua nhà cung cấp danh tính.',
          en: 'Single sign-on through an identity provider.',
        },
      },
      {
        term: 'SCIM',
        source: 'https://developers.cloudflare.com/cloudflare-one/identity/users/scim/',
        definition: {
          vi: 'Đồng bộ người dùng từ IdP sang Cloudflare.',
          en: 'Provisioning users from an IdP into Cloudflare.',
        },
      },
      {
        term: 'CASB',
        source: 'https://developers.cloudflare.com/cloudflare-one/applications/casb/',
        definition: {
          vi: 'Kiểm tra và kiểm soát ứng dụng SaaS.',
          en: 'Inspects and controls SaaS applications.',
        },
      },
    ],
  },
];
