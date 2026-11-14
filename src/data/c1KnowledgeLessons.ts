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
  tip?: LocalizedString;
  hubLink?: string;
  guide: Guide;
  prerequisites?: string[];
};

const CHECKED = '2026-11-14';

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

const dlpNote = {
  vi: `Bộ DLP đầy đủ là add-on của Zero Trust Enterprise. Free và Pay-as-you-go có hai profile sẵn: Financial Information, và Social Security, Insurance, Tax, and Identifier Numbers. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/')}`,
  en: `The full DLP set is an add-on to Zero Trust Enterprise. Free and Pay-as-you-go include two predefined profiles: Financial Information, and Social Security, Insurance, Tax, and Identifier Numbers. Checked ${CHECKED}. Source: ${source('https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/')}`,
};

const aiGatewayNote = {
  vi: `Quét DLP trong AI Gateway miễn phí trên mọi gói. Không có gói Zero Trust thì có hai profile sẵn. Gói Zero Trust có DLP thì mở bộ đầy đủ. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/ai-gateway/reference/pricing/')}`,
  en: `DLP scanning in AI Gateway is free on all plans. Without a Zero Trust subscription you get two predefined profiles. A Zero Trust subscription that includes DLP unlocks the full set. Checked ${CHECKED}. Source: ${source('https://developers.cloudflare.com/ai-gateway/reference/pricing/')}`,
};

export const c1ArchitectureLesson: KnowledgeLesson = lesson(
  '',
  t('Kiến trúc Zero Trust', 'Zero Trust architecture'),
  t(
    'Cloudflare One là nền tảng SASE: mạng và kiểm tra bảo mật nằm cùng một chỗ. Mỗi request bị kiểm tra. Không có quyền vào cả mạng như VPN cũ.',
    'Cloudflare One is a SASE platform: the network and the security checks live in one place. Every request is checked. There is no whole-network pass like an old VPN.',
  ),
  {
    how: t(
      'Người và thiết bị (hoặc cả văn phòng) nối tới Cloudflare. Cloudflare hỏi bạn là ai, thiết bị có khỏe không, bạn được vào app này không, trang này có an toàn không, và có dữ liệu nhạy cảm không. Rồi traffic mới tới Internet, SaaS, hoặc app nội bộ.',
      'People and devices (or a whole office) connect to Cloudflare. Cloudflare asks who you are, whether the device is healthy, whether you may open this app, whether the site is safe, and whether sensitive data is in the traffic. Only then does the traffic go to the Internet, to SaaS, or to a private app.',
    ),
    architecture: t(
      'Thứ tự học: tài khoản và team name, đăng nhập công ty, Cloudflare One Client trên thiết bị, Access cho một app nội bộ, Gateway lọc DNS rồi web, rồi mới DLP, AI, và Cloudflare WAN. AI/MCP chi tiết ở track AI Security. Bài này chỉ là bản đồ.',
      'Learn in this order: the account and team name, company login, the Cloudflare One Client on devices, Access for one private app, Gateway for DNS then the web, and only then DLP, AI, and Cloudflare WAN. The AI Security track covers AI and MCP policy in detail. This page is the map.',
    ),
    whenToUse: t(
      'Dùng lộ trình này khi bạn thay VPN, lọc web cho nhân viên, hoặc đưa app nội bộ ra ngoài mà không mở port inbound.',
      'Use this path when you are replacing a VPN, filtering employee web traffic, or publishing a private app without opening an inbound port.',
    ),
    whenNot: t(
      'Đừng bắt đầu bằng Cloudflare WAN hay bộ DLP đầy đủ. Đừng cấm AI trước khi bạn thấy người đang dùng công cụ nào.',
      'Do not start with Cloudflare WAN or the full DLP set. Do not ban AI tools before you can see which ones people already use.',
    ),
    planNotes: t(
      `Cloudflare One có gói Free và gói trả phí. Từng tính năng phụ thuộc gói. Bài này không gán số chỗ ngồi và không báo giá. Số chỗ và giá xem trang plans và dashboard. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/')} ${source('https://www.cloudflare.com/plans/zero-trust-services/')}`,
      `Cloudflare One has a Free plan and paid plans. Each feature depends on the plan. This lesson does not assign a seat count and is not a price quote. Seats and prices are on the plans page and in the dashboard. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/')} ${source('https://www.cloudflare.com/plans/zero-trust-services/')}`,
    ),
    terms: [
      {
        term: 'SASE',
        detail: t(
          'Mô hình gộp mạng doanh nghiệp và kiểm tra Zero Trust trên một nền tảng.',
          'A model that puts enterprise networking and Zero Trust checks on one platform.',
        ),
      },
      {
        term: 'Zero Trust',
        detail: t(
          'Không tin sẵn. Mỗi request phải chứng minh danh tính và quyền.',
          'Do not trust by default. Each request has to prove identity and permission.',
        ),
      },
    ],
  },
  {
    duration: t('~15 phút', '~15 min'),
    tip: t(
      'Nhiều team làm tài khoản, đăng nhập và thiết bị tuần đầu. Access và Gateway tuần sau. DLP, AI và WAN để sau.',
      'Many teams do the account, login, and devices in week one. Access and Gateway come the next week. DLP, AI, and WAN come later.',
    ),
    hubLink: '/use-cases/cloudflare-one',
  },
);

export const c1AccountLesson: KnowledgeLesson = lesson(
  'c1-k-account',
  t('Tài khoản Cloudflare One', 'The Cloudflare One account'),
  t(
    'Bạn tạo tổ chức Zero Trust, chọn team name, và giữ một admin dự phòng. Team name nằm trong URL đăng nhập. Đổi được, nhưng phải cập nhật IdP và client.',
    'You create a Zero Trust organization, pick a team name, and keep a backup admin. The team name is part of the login URL. You can change it, but you must update the IdP and the client.',
  ),
  {
    how: t(
      'Trong dashboard, chọn Zero Trust, rồi chọn team name. Team domain có dạng https://<team-name>.cloudflareaccess.com. Cloudflare tự thêm đăng nhập Cloudflare làm cách đăng nhập mặc định. Bạn bật 2FA cho admin. Lab sau mới là chỗ bấm từng nút.',
      'In the dashboard, choose Zero Trust, then choose a team name. The team domain looks like https://<team-name>.cloudflareaccess.com. Cloudflare adds its own login as the default method. Turn on 2FA for the admin. The lab after this page is where you click each button.',
    ),
    architecture: t(
      'Admin có role trên account. Nhân viên dùng dịch vụ không cần role đó. Họ cần được phép enroll thiết bị và thỏa policy Access. Giữ ít nhất hai Super Admin. Nếu Access khóa chính dashboard, danh tính dự phòng phải vẫn qua được policy đó.',
      'Admins have a role on the account. Employees who only use the service do not need that role. They need permission to enroll a device and to match an Access policy. Keep at least two Super Admins. If Access sits in front of the dashboard, the backup identity must still satisfy that policy.',
    ),
    whenToUse: t(
      'Đọc bài này trước khi tạo tổ chức. Viết team name, nhóm pilot 5–25 người, và app nội bộ đầu tiên ra giấy.',
      'Read this before you create the organization. Write down the team name, a pilot of 5–25 people, and the first private app.',
    ),
    whenNot: t(
      'Đừng chọn team name cho vui rồi quên. Nếu bật SSO cho dashboard Cloudflare, bạn phải tắt SSO đó trước khi đổi team name.',
      'Do not pick a throwaway team name. If Cloudflare dashboard SSO is on, you must turn that SSO off before you change the team name.',
    ),
    planNotes: t(
      `Trang bắt đầu nói: chọn gói và nhập payment details. Gói Zero Trust Free vẫn cần bước này, và bạn không bị tính phí. Số chỗ ngồi không ghi trên trang đó, nên bài này không chép một con số. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/setup/')} ${source('https://developers.cloudflare.com/cloudflare-one/faq/getting-started-faq/')}`,
      `The get-started page says to select a plan and enter payment details. The Zero Trust Free plan still needs that step, and you are not charged. That page does not state a seat count, so this lesson does not copy one. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/setup/')} ${source('https://developers.cloudflare.com/cloudflare-one/faq/getting-started-faq/')}`,
    ),
    terms: [
      {
        term: 'Team name',
        detail: t(
          'Phần bạn chọn trong team domain, ví dụ acme trong https://acme.cloudflareaccess.com.',
          'The part you choose in the team domain, for example acme in https://acme.cloudflareaccess.com.',
        ),
      },
      {
        term: 'Break-glass',
        detail: t(
          'Admin thứ hai, để một policy sai không khóa cả team.',
          'A second admin, so one bad policy cannot lock the whole team out.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-1-l1'] },
);

export const c1IdentityLesson: KnowledgeLesson = lesson(
  'c1-k-identity',
  t('Đăng nhập công ty (IdP)', 'Company login (the IdP)'),
  t(
    'IdP là hệ thống đăng nhập sẵn có: Entra ID, Okta, hoặc Google. Cloudflare hỏi IdP “người này là ai?” rồi mới cho vào app.',
    'The IdP is the login system you already have: Entra ID, Okta, or Google. Cloudflare asks the IdP who this person is, then decides whether they may open an app.',
  ),
  {
    how: t(
      'Bạn đăng ký một app trên IdP và dán callback https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback. Cloudflare nhận email và group. Policy nên trỏ tới group, không tới từng người. Bài lab sau là chỗ nối và bấm Test.',
      'You register an app in the IdP and paste the callback https://<team-name>.cloudflareaccess.com/cdn-cgi/access/callback. Cloudflare receives the email and the groups. Policies should point at a group, not at each person. The lab after this page is where you connect it and press Test.',
    ),
    architecture: t(
      'Không có IdP thì Access không biết nhóm nào được vào. SCIM, khi bạn bật, đồng bộ user và group khi có người nghỉ. Đăng nhập Cloudflare mặc định vẫn giữ làm đường dự phòng.',
      'Without an IdP, Access cannot tell which group may enter. SCIM, when you turn it on, syncs users and groups when someone leaves. Keep the default Cloudflare login as the backup path.',
    ),
    whenToUse: t(
      'Nối IdP trước khi viết policy theo group và trước khi cho thiết bị enroll.',
      'Connect the IdP before you write a group policy and before you let devices enroll.',
    ),
    whenNot: t(
      'Đừng viết policy theo group khi nút Test chưa hiện group. Đừng để secret của IdP trong chat hoặc trong git.',
      'Do not write a group policy until Test shows the groups. Do not put the IdP secret in chat or in git.',
    ),
    planNotes: t(
      `Trang giới hạn account ghi 50 identity provider trên một account. Trang đó không tách số này theo Free hay Paid, và nói hạn mức có thể tăng trên Enterprise. Bài này không báo giá. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/')}`,
      `The account limits page lists 50 identity providers per account. That page does not split this number by Free or Paid, and it says limits may be increased on Enterprise. This lesson is not a price quote. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/')}`,
    ),
    terms: [
      {
        term: 'IdP',
        detail: t('Identity provider. Hệ thống đăng nhập của công ty.', 'Identity provider. Your company’s login system.'),
      },
      {
        term: 'SCIM',
        detail: t(
          'Cách đồng bộ user và group từ IdP sang Cloudflare khi có người vào hoặc nghỉ.',
          'A way to sync users and groups from the IdP into Cloudflare when someone joins or leaves.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-account'] },
);

export const c1DeviceLesson: KnowledgeLesson = lesson(
  'c1-k-device',
  t('Thiết bị và Cloudflare One Client', 'Devices and the Cloudflare One Client'),
  t(
    'Cloudflare One Client (trước đây gọi là WARP) là app trên máy. Nó đưa traffic tới Cloudflare và báo thiết bị có khỏe không.',
    'The Cloudflare One Client (formerly WARP) is the app on the device. It carries traffic to Cloudflare and reports whether the device is healthy.',
  ),
  {
    how: t(
      'Trước khi cài, bạn cho phép email công ty được enroll. Người dùng đăng nhập Zero Trust, không phải app 1.1.1.1 cho người dùng nhà. Profile quyết định máy công ty gửi gần như mọi traffic, còn máy cá nhân chỉ gửi app công ty. Posture là các kiểm tra như đĩa mã hóa. Lab sau mới cài và tạo profile.',
      'Before anyone installs it, you allow company emails to enroll. The person signs in to Zero Trust, not the consumer 1.1.1.1 app. A profile decides whether a company laptop sends almost all traffic, or a personal device sends only company apps. Posture is a check such as disk encryption. The lab after this page is where you install it and create the profile.',
    ),
    architecture: t(
      'Client là đường vào từ máy người dùng. Văn phòng không cài client thì dùng DNS location hoặc Cloudflare WAN, hai thứ khác bài này. Posture chỉ chạy sau khi máy đã enroll. Đừng gắn posture vào chính policy enroll.',
      'The client is the on-ramp from a person’s device. An office with no client uses a DNS location or Cloudflare WAN, which are different lessons. Posture runs only after the device is enrolled. Do not put a posture check on the enrollment policy itself.',
    ),
    whenToUse: t(
      'Dùng client khi bạn muốn lọc web và kiểm tra thiết bị của nhân viên từ xa.',
      'Use the client when you want to filter the web and check the device for remote employees.',
    ),
    whenNot: t(
      'Đừng bật chế độ “gửi mọi traffic” trên máy cá nhân. Đừng bật kiểm tra HTTPS trước khi máy đã có chứng chỉ Cloudflare.',
      'Do not turn on “send all traffic” on a personal device. Do not turn on HTTPS inspection before the device has the Cloudflare certificate.',
    ),
    planNotes: t(
      `Docs gọi app là Cloudflare One Client và ghi “formerly WARP”. Trang enroll nói posture không dùng được trong policy enroll. Bài này không gán gói cho từng loại posture của hãng thứ ba. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/device-enrollment/')} ${source('https://developers.cloudflare.com/cloudflare-one/networks/connectivity-options/')}`,
      `The docs call the app the Cloudflare One Client and say “formerly WARP”. The enrollment page says posture checks are not supported in an enrollment policy. This lesson does not assign a plan to each third-party posture check. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/device-enrollment/')} ${source('https://developers.cloudflare.com/cloudflare-one/networks/connectivity-options/')}`,
    ),
    terms: [
      {
        term: 'Posture',
        detail: t(
          'Kiểm tra sức khỏe máy, ví dụ đĩa đã mã hóa chưa.',
          'A health check on the device, for example whether the disk is encrypted.',
        ),
      },
      {
        term: 'Split tunnel',
        detail: t(
          'Danh sách traffic đi qua Cloudflare và traffic đi thẳng.',
          'The list of traffic that goes through Cloudflare and traffic that goes direct.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-identity'] },
);

export const c1AccessLesson: KnowledgeLesson = lesson(
  'c1-k-access',
  t('Access và Tunnel', 'Access and Tunnel'),
  t(
    'Access cho đúng người vào đúng app. Tunnel là đường chỉ đi ra từ app nội bộ tới Cloudflare. Không cần mở port trên firewall.',
    'Access lets the right person open the right app. A tunnel is an outbound-only path from a private app to Cloudflare. You do not open a port on the firewall.',
  ),
  {
    how: t(
      'cloudflared chạy trên máy nhìn thấy app và gọi ra Cloudflare. Bạn map một hostname công khai tới cổng của app. Access policy Allow gắn group IdP, và posture nếu cần. Lab sau mới tạo tunnel và policy.',
      'cloudflared runs on a machine that can see the app and calls out to Cloudflare. You map a public hostname to the app’s port. An Allow policy names an IdP group, and posture if you need it. The lab after this page is where you create the tunnel and the policy.',
    ),
    architecture: t(
      'Tunnel dành cho app và dải IP riêng, một chiều tới Cloudflare. Mesh nối host với host. Appliance hoặc Cloudflare WAN dành cho cả văn phòng. Ba thứ có thể đứng cạnh nhau. App nội bộ tự host cần zone trên Cloudflare cho hostname đó.',
      'A tunnel is for an app and a private IP range, one way toward Cloudflare. Mesh connects host to host. An appliance or Cloudflare WAN is for a whole office. The three can sit side by side. A self-hosted private app needs a Cloudflare zone for that hostname.',
    ),
    whenToUse: t(
      'Dùng Access khi bạn muốn thay VPN cho một app, không phải cho cả mạng.',
      'Use Access when you want to replace a VPN for one app, not for the whole network.',
    ),
    whenNot: t(
      'Đừng Allow Everyone. Đừng mở port inbound để “cho chắc”. Đừng dùng Tunnel thay cho cả chi nhánh.',
      'Do not Allow Everyone. Do not open an inbound port “just in case”. Do not use a tunnel in place of a whole branch.',
    ),
    planNotes: t(
      `Trang giới hạn ghi 1.000 tunnel cloudflared trên một account, và 500 application Access. Trang đó không tách các số này theo Free. Bài này không nói Access “chỉ có trên Enterprise”. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/')}`,
      `The limits page lists 1,000 cloudflared tunnels per account, and 500 Access applications. That page does not split those numbers by Free. This lesson does not say Access is Enterprise-only. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/')}`,
    ),
    terms: [
      {
        term: 'ZTNA',
        detail: t(
          'Zero Trust Network Access. Vào từng app, không vào cả mạng.',
          'Zero Trust Network Access. Enter one app, not the whole network.',
        ),
      },
      {
        term: 'Tunnel',
        detail: t(
          'Đường outbound từ app của bạn tới Cloudflare.',
          'An outbound path from your app to Cloudflare.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-device'] },
);

export const c1GatewayLesson: KnowledgeLesson = lesson(
  'c1-k-gateway',
  t('Gateway: lọc DNS và web', 'Gateway: DNS and web filtering'),
  t(
    'Gateway là bộ lọc. DNS chặn tên miền xấu trước. HTTP, sau khi giải mã, mới thấy nội dung trang và file.',
    'Gateway is the filter. DNS blocks a bad name first. HTTP, after decryption, is what can see the page and the file.',
  ),
  {
    how: t(
      'Thứ tự policy HTTP: Do Not Inspect chạy trước, rồi Isolate, rồi Allow, Block và Do Not Scan. DLP nằm ở bước đọc body. Một số app ghim chứng chỉ và Microsoft 365 cần Do Not Inspect. Browser Isolation chạy trang trong trình duyệt từ xa. Lab sau mới tạo policy.',
      'HTTP policy order: Do Not Inspect runs first, then Isolate, then Allow, Block, and Do Not Scan. DLP is the step that reads the body. Certificate-pinned apps and Microsoft 365 need Do Not Inspect. Browser Isolation runs the page in a remote browser. The lab after this page is where you create the policies.',
    ),
    architecture: t(
      'Client hoặc DNS location đưa query và traffic web vào Gateway. Văn phòng không có client vẫn lọc được DNS nếu bạn tạo DNS location. Egress IP riêng là khi SaaS chỉ cho phép IP công ty. Bài này không bắt bạn mua IP đó.',
      'The client, or a DNS location, sends queries and web traffic into Gateway. An office with no client can still filter DNS if you create a DNS location. A dedicated egress IP is for when a SaaS app allowlists your company IP. This lesson does not require you to buy that IP.',
    ),
    whenToUse: t(
      'Bật DNS cho malware và phishing trước. HTTP và giải mã TLS chỉ sau khi máy pilot đã có chứng chỉ và trang vẫn mở được.',
      'Turn on DNS for malware and phishing first. Add HTTP and TLS decryption only after a pilot device has the certificate and sites still open.',
    ),
    whenNot: t(
      'Đừng Block cả một nhóm trang trước khi xem log. Đừng giải mã mọi thứ, kể cả app ghim chứng chỉ.',
      'Do not Block a whole category before you read the logs. Do not decrypt everything, including certificate-pinned apps.',
    ),
    planNotes: t(
      `Protocol detection của Gateway có trên Free và Pay-as-you-go. Trang giới hạn ghi 500 DNS policy và 500 HTTP policy trên một account, và nói hạn mức có thể tăng trên Enterprise. Remote Browser Isolation là add-on của Pay-as-you-go và Enterprise. Bài này không nói Isolation có trên Free. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-one/changelog/gateway/')} ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/')} ${source('https://developers.cloudflare.com/cloudflare-one/traffic-controls/order-of-enforcement/')}`,
      `Gateway protocol detection is available on Free and Pay-as-you-go. The limits page lists 500 DNS policies and 500 HTTP policies per account, and says limits may be increased on Enterprise. Remote Browser Isolation is an add-on to Pay-as-you-go and Enterprise. This lesson does not say Isolation is on Free. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-one/changelog/gateway/')} ${source('https://developers.cloudflare.com/cloudflare-one/account-limits/')} ${source('https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/')} ${source('https://developers.cloudflare.com/cloudflare-one/traffic-controls/order-of-enforcement/')}`,
    ),
    terms: [
      {
        term: 'SWG',
        detail: t('Secure Web Gateway. Tên khác của lớp lọc web.', 'Secure Web Gateway. Another name for the web-filtering layer.'),
      },
      {
        term: 'Do Not Inspect',
        detail: t(
          'Policy bỏ qua giải mã HTTPS cho app sẽ hỏng nếu bị giải mã.',
          'A policy that skips HTTPS decryption for an app that breaks if you decrypt it.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-access'] },
);

export const c1DlpLesson: KnowledgeLesson = lesson(
  'c1-k-dlp',
  t('DLP: dữ liệu nhạy cảm', 'DLP: sensitive data'),
  t(
    'DLP quét traffic web, file SaaS và prompt AI để tìm dữ liệu nhạy cảm. Free và Pay-as-you-go có hai profile sẵn. Bộ đầy đủ là add-on Enterprise.',
    'DLP scans web traffic, SaaS files, and AI prompts for sensitive data. Free and Pay-as-you-go include two predefined profiles. The full set is an Enterprise add-on.',
  ),
  {
    how: t(
      'Gateway phải giải mã HTTPS thì DLP mới đọc được body. Bạn bật profile, gắn vào policy HTTP, và để Allow kèm log trước khi Block. Test scan kiểm tra một đoạn chữ mà không cần gửi traffic thật qua Gateway.',
      'Gateway has to decrypt HTTPS before DLP can read the body. You turn on a profile, attach it to an HTTP policy, and leave Allow with logs on before you Block. Test scan checks a sample without sending live traffic through Gateway.',
    ),
    architecture: t(
      'DLP đứng sau lớp HTTP của Gateway. Nó không thay Gateway. Profile dùng lại: sửa một profile là các policy đang gắn profile đó đổi theo.',
      'DLP sits behind Gateway’s HTTP layer. It does not replace Gateway. Profiles are reused: edit one profile and every policy that uses it changes with it.',
    ),
    whenToUse: t(
      'Dùng hai profile sẵn khi bạn muốn thấy số thẻ hoặc mã định danh trên traffic đã giải mã. Dùng bộ đầy đủ khi bạn cần profile custom, secret, hoặc source code.',
      'Use the two built-in profiles when you want to see card numbers or identifier numbers on decrypted traffic. Use the full set when you need a custom profile, secrets, or source code.',
    ),
    whenNot: t(
      'Đừng Block ngay ngày đầu. Đừng kỳ vọng DLP đọc HTTPS nếu bạn chưa bật giải mã.',
      'Do not Block on day one. Do not expect DLP to read HTTPS if decryption is still off.',
    ),
    planNotes: t(dlpNote.vi, dlpNote.en),
    terms: [
      {
        term: 'DLP',
        detail: t(
          'Data Loss Prevention. Tìm dữ liệu nhạy cảm và chặn hoặc chỉ ghi log.',
          'Data Loss Prevention. It finds sensitive data and either blocks it or only logs it.',
        ),
      },
      {
        term: 'Profile',
        detail: t(
          'Một nhóm quy tắc nhận dạng, ví dụ thông tin tài chính.',
          'A group of detection rules, for example financial information.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-gateway'] },
);

export const c1AiLesson: KnowledgeLesson = lesson(
  'c1-k-ai',
  t('AI trong Zero Trust', 'AI in Zero Trust'),
  t(
    'Ba việc khác nhau: thấy công cụ AI nhân viên đang dùng, chặn dữ liệu nhạy cảm trong prompt, và đặt AI Gateway trước model mà app của bạn gọi.',
    'Three different jobs: see which AI tools employees use, stop sensitive data in a prompt, and put AI Gateway in front of the model your own app calls.',
  ),
  {
    how: t(
      'Gateway và CASB cho bạn danh sách công cụ. DLP trên prompt dùng cùng profile với DLP web. AI Gateway đứng trước nhà cung cấp model. Nó không cần client WARP và không cần giải mã TLS của người dùng. MCP server nội bộ thì đặt sau Access.',
      'Gateway and CASB give you the list of tools. DLP on a prompt uses the same profiles as web DLP. AI Gateway sits in front of the model provider. It does not need the WARP client and it does not need to decrypt the user’s TLS. An internal MCP server goes behind Access.',
    ),
    architecture: t(
      'Làn nhân viên: thấy tool, cho phép tool đã chọn, DLP trên prompt, cô lập upload rủi ro. Làn app bạn xây: AI Gateway, token, và DLP trên request. Làn crawler vào site public là việc khác, không trộn với lọc web cho nhân viên. Chi tiết chính sách nằm ở track AI Security.',
      'The employee lane: see the tools, allow the ones you chose, DLP on the prompt, isolate a risky upload. The lane for an app you build: AI Gateway, a token, and DLP on the request. The crawler lane into your public site is a different job. Do not mix it with employee web filtering. Policy detail lives on the AI Security track.',
    ),
    whenToUse: t(
      'Dùng bài này khi công ty đã có người dùng ChatGPT hoặc khi app của bạn gọi model.',
      'Use this lesson when people at the company already use ChatGPT, or when an app you own calls a model.',
    ),
    whenNot: t(
      'Đừng cấm hết AI rồi mất dấu. Đừng cache hoặc rate-limit gateway đang dùng cho RAG.',
      'Do not ban every AI tool and then lose the trail. Do not cache or rate-limit a gateway you use for RAG.',
    ),
    planNotes: t(
      `${dlpNote.vi} ${aiGatewayNote.vi}`,
      `${dlpNote.en} ${aiGatewayNote.en}`,
    ),
    terms: [
      {
        term: 'AI Gateway',
        detail: t(
          'Cửa trước model. App gọi cửa này thay vì gọi thẳng nhà cung cấp.',
          'The front door for a model. The app calls this door instead of the provider directly.',
        ),
      },
      {
        term: 'MCP',
        detail: t(
          'Cách một agent gọi tool. Tool nội bộ nên đứng sau Access.',
          'A way for an agent to call a tool. An internal tool should sit behind Access.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-dlp'] },
);

export const c1WanLesson: KnowledgeLesson = lesson(
  'c1-k-wan',
  t('Cloudflare WAN', 'Cloudflare WAN'),
  t(
    'Cloudflare WAN (trước đây là Magic WAN) nối cả văn phòng, trung tâm dữ liệu và cloud vào Cloudflare. Không chỉ laptop có client.',
    'Cloudflare WAN (formerly Magic WAN) connects whole offices, data centers, and cloud networks to Cloudflare. Not only laptops that have the client.',
  ),
  {
    how: t(
      'Bạn đưa traffic lên bằng GRE, IPsec, Cloudflare One Appliance, hoặc kết nối riêng (CNI). Tunnel phải khỏe, rồi route và firewall mới có ý nghĩa. Lab sau là sổ tay thao tác, không phải bài này.',
      'You bring traffic up with GRE, IPsec, the Cloudflare One Appliance, or a private connection (CNI). The tunnels have to be healthy before routes and the firewall mean anything. The lab after this page is the click-through notes, not this page.',
    ),
    architecture: t(
      'WAN là đường vào của cả site. Gateway vẫn lọc DNS và HTTP nếu bạn gửi traffic của site qua Gateway. IP trùng giữa hai văn phòng làm hỏng route. Làm một site, thử failover, rồi mới bỏ MPLS.',
      'WAN is the on-ramp for a whole site. Gateway still filters DNS and HTTP if you send that site’s traffic through Gateway. The same private IP range in two offices breaks routing. Do one site, prove failover, and only then retire MPLS.',
    ),
    whenToUse: t(
      'Dùng khi văn phòng hoặc nhà máy phải được lọc như laptop, và bạn đã có hợp đồng Enterprise.',
      'Use it when an office or a plant must be filtered the way a laptop is, and you already have an Enterprise agreement.',
    ),
    whenNot: t(
      'Đừng bắt đầu lộ trình bằng WAN. Đừng đổi mạng production khi chưa có console và cách rollback.',
      'Do not start the path with WAN. Do not change a production network without console access and a rollback.',
    ),
    planNotes: t(
      `Docs ghi “Enterprise-only” và “Cloudflare WAN is an Enterprise-only product.” Liên hệ Cloudflare để mua. Bài này không báo giá. Kiểm tra ${CHECKED}. Nguồn: ${source('https://developers.cloudflare.com/cloudflare-wan/')} ${source('https://developers.cloudflare.com/cloudflare-wan/get-started/')}`,
      `The docs say “Enterprise-only” and “Cloudflare WAN is an Enterprise-only product.” Contact Cloudflare to buy it. This lesson is not a price quote. Checked ${CHECKED}. Sources: ${source('https://developers.cloudflare.com/cloudflare-wan/')} ${source('https://developers.cloudflare.com/cloudflare-wan/get-started/')}`,
    ),
    terms: [
      {
        term: 'On-ramp',
        detail: t(
          'Đường đưa mạng của bạn vào Cloudflare: GRE, IPsec, appliance, hoặc CNI.',
          'The path that brings your network into Cloudflare: GRE, IPsec, an appliance, or CNI.',
        ),
      },
      {
        term: 'CNI',
        detail: t(
          'Cloudflare Network Interconnect. Nối riêng, không đi qua Internet công cộng.',
          'Cloudflare Network Interconnect. A private connection that does not cross the public Internet.',
        ),
      },
    ],
  },
  { prerequisites: ['c1-k-gateway'] },
);

export const c1BestPracticeLesson: KnowledgeLesson = {
  id: 'c1-9-l1',
  kind: 'reference',
  duration: t('~15 phút', '~15 min'),
  title: t('Sổ tay thực hành', 'Practice handbook'),
  body: t(
    'Đây là sổ tay, không phải lab. Thứ tự vẫn là pilot, kiểm tra, rồi mới mở rộng. Mỗi phase một nhóm nhỏ.',
    'This is a handbook, not a lab. The order is still pilot, check, then expand. One small group per phase.',
  ),
  guide: {
    how: t(
      'Giữ thứ tự: tài khoản, IdP, thiết bị, một app Access, Gateway DNS, rồi HTTP. DLP và AI chỉ sau khi giải mã TLS đã chạy trên nhóm pilot. WAN chỉ khi hợp đồng Enterprise đã có.',
      'Keep the order: account, IdP, devices, one Access app, Gateway DNS, then HTTP. DLP and AI come only after TLS decryption works for the pilot group. WAN comes only when the Enterprise agreement is already in place.',
    ),
    architecture: t(
      'Mỗi phase có cửa rollback: tắt policy, rút client khỏi nhóm pilot, hoặc đưa tunnel về trạng thái cũ. Đừng cắt VPN trong một đêm.',
      'Each phase has a rollback door: turn the policy off, remove the client from the pilot group, or put the tunnel back. Do not cut the VPN in one night.',
    ),
    whenToUse: t(
      'Mở trang này khi bạn đã đọc bài kiến thức và cần nhớ thứ tự, không cần bấm dashboard.',
      'Open this page when you have read the knowledge lessons and need the order, not a dashboard click.',
    ),
    whenNot: t(
      'Đừng dùng trang này thay cho bài lab. Menu dashboard đổi tên. Lab và docs là chỗ có đường dẫn nút.',
      'Do not use this page instead of a lab. Dashboard menus get renamed. The labs and the docs are where the button paths live.',
    ),
    planNotes: t(
      `${dlpNote.vi} Cloudflare WAN là sản phẩm Enterprise-only. Kiểm tra ${CHECKED}.`,
      `${dlpNote.en} Cloudflare WAN is an Enterprise-only product. Checked ${CHECKED}.`,
    ),
    terms: [
      {
        term: 'Pilot',
        detail: t('Nhóm nhỏ thử trước, thường 5–25 người.', 'A small group that tries it first, often 5–25 people.'),
      },
    ],
  },
};

export const c1RunbookLesson: KnowledgeLesson = {
  id: 'c1-9-l2',
  kind: 'reference',
  duration: t('~15 phút', '~15 min'),
  title: t('Sổ tay chỗ cấu hình', 'Where to configure it'),
  body: t(
    'Bản đồ chỗ bấm, không phải bảng giá trị mẫu. Tên menu đổi. Nếu không thấy đúng chữ, chọn mục cùng việc.',
    'A map of where to click, not a table of sample values. Menu names change. If the label differs, pick the item that does the same job.',
  ),
  guide: {
    how: t(
      'Team name: Zero Trust, Settings. Enroll thiết bị: Team and Resources, Devices. App Access: Access controls, Applications. Policy HTTP: Traffic policies. Profile DLP: Data loss prevention, Profiles. WAN không có trên Free.',
      'Team name: Zero Trust, Settings. Device enrollment: Team and Resources, Devices. An Access app: Access controls, Applications. An HTTP policy: Traffic policies. A DLP profile: Data loss prevention, Profiles. WAN is not on Free.',
    ),
    architecture: t(
      'Một thay đổi ở profile hoặc group dùng lại sẽ đụng mọi policy đang trỏ tới nó. Sửa profile trên nhóm pilot trước.',
      'A change to a reused profile or group hits every policy that points at it. Change the profile on the pilot group first.',
    ),
    whenToUse: t(
      'Dùng khi bạn đã hiểu bài kiến thức và chỉ cần nhớ màn hình nào giữ thiết đặt nào.',
      'Use it when you already understand the knowledge lesson and only need to remember which screen holds which setting.',
    ),
    whenNot: t(
      'Đừng chép giá trị từ hướng dẫn cộng đồng vào production. Docs và dashboard là nguồn.',
      'Do not paste values from the community guide into production. The docs and the dashboard are the source.',
    ),
    planNotes: t(
      `${dlpNote.vi} ${aiGatewayNote.vi}`,
      `${dlpNote.en} ${aiGatewayNote.en}`,
    ),
    terms: [
      {
        term: 'Runbook',
        detail: t('Sổ tay tra chỗ cấu hình, không phải các bước bắt buộc.', 'A lookup for where a setting lives, not a required click path.'),
      },
    ],
  },
};
