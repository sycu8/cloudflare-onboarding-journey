/**
 * Generate short Vietnamese summaries, explanations, and notes for tutorial previews.
 */

const PRODUCT_VI = {
  workers: 'Cloudflare Workers',
  pages: 'Cloudflare Pages',
  d1: 'D1 (SQLite serverless)',
  r2: 'R2 Object Storage',
  kv: 'Workers KV',
  queues: 'Queues',
  workflows: 'Workflows',
  'durable-objects': 'Durable Objects',
  hyperdrive: 'Hyperdrive',
  vectorize: 'Vectorize',
  'workers-ai': 'Workers AI',
  'cloudflare-one': 'Cloudflare One (Zero Trust)',
  access: 'Cloudflare Access',
  gateway: 'Gateway',
  tunnel: 'Cloud Tunnel',
  waf: 'WAF',
  turnstile: 'Turnstile',
  terraform: 'Terraform',
  sandbox: 'Sandbox',
  'ai-gateway': 'AI Gateway',
};

const TRACK_CONTEXT_VI = {
  'application-services':
    'Thuộc nhóm Application Services — tập trung bảo vệ, tăng tốc và vận hành ứng dụng/web phía trước origin.',
  'developer-platform':
    'Thuộc Developer Platform — thực hành triển khai code, API và dữ liệu trên edge/serverless.',
  'cloudflare-one':
    'Thuộc Cloudflare One — Zero Trust, truy cập an toàn và kiểm soát traffic người dùng/thiết bị.',
  'cross-cutting': 'Tutorial đa lĩnh vực — kết hợp nhiều sản phẩm Cloudflare.',
};

/** @param {string} path */
function detectProduct(path) {
  const seg = path.replace(/^\//, '').split('/')[0] ?? '';
  return PRODUCT_VI[seg] ? seg : null;
}

/** @param {string} text */
function localizeDescription(text) {
  if (!text) return '';
  let s = text.trim();
  const rules = [
    [/^Learn how to /i, 'Bạn sẽ học cách '],
    [/^In this tutorial, you will learn how to /i, 'Trong tutorial này, bạn sẽ '],
    [/^In this guide, you will /i, 'Trong hướng dẫn này, bạn sẽ '],
    [/^This tutorial (walks you through|shows you how to) /i, 'Tutorial này hướng dẫn bạn '],
    [/^This guide (walks you through|shows you how to) /i, 'Hướng dẫn này chỉ cách '],
    [/^You will (learn|build|create|deploy|set up) /i, 'Bạn sẽ $1 '],
    [/^Build a /i, 'Xây dựng '],
    [/^Deploy an? /i, 'Triển khai '],
    [/^This tutorial explains how to /i, 'Tutorial này hướng dẫn cách '],
    [/^Create a /i, 'Tạo '],
    [/^Configure /i, 'Cấu hình '],
    [/^Protect /i, 'Bảo vệ '],
    [/^Secure /i, 'Bảo mật '],
    [/^Migrate /i, 'Di chuyển '],
    [/^Connect /i, 'Kết nối '],
    [/\busing Cloudflare Workers\b/gi, 'bằng Cloudflare Workers'],
    [/\busing Cloudflare Pages\b/gi, 'bằng Cloudflare Pages'],
    [/\bon Cloudflare Workers\b/gi, 'trên Cloudflare Workers'],
    [/\bon Cloudflare Pages\b/gi, 'trên Cloudflare Pages'],
    [/\bD1 database\b/gi, 'cơ sở dữ liệu D1'],
    [/\bR2\b/g, 'R2'],
  ];
  for (const [re, rep] of rules) s = s.replace(re, rep);
  if (!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(s)) {
    s = `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
    if (!s.endsWith('.')) s += '.';
  }
  return s;
}

/** Curated page titles for featured / high-traffic tutorials */
const CURATED_TITLES_BY_PATH = {
  '/fundamentals/manage-domains/add-multiple-sites-automation':
    'Thêm nhiều site vào Cloudflare bằng automation',
  '/workers/tutorials/deploy-an-express-app':
    'Triển khai ứng dụng Express.js trên Cloudflare Workers',
  '/workers/tutorials/build-a-jamstack-app': 'Xây dựng ứng dụng Jamstack trên Cloudflare',
  '/pages/tutorials/build-an-api-with-pages-functions':
    'Xây dựng API với Pages Functions',
  '/cloudflare-one/tutorials/clientless-access-private-dns':
    'Truy cập clientless tới DNS private qua Cloudflare Access',
  '/use-cases/solutions/protecting-sp-networks-from-ddos':
    'Bảo vệ mạng SP khỏi tấn công DDoS',
};

const SECTION_TITLES_VI = {
  overview: 'Tổng quan',
  introduction: 'Giới thiệu',
  'before you start': 'Trước khi bắt đầu',
  'quick start': 'Bắt đầu nhanh',
  prerequisites: 'Yêu cầu trước',
  'next steps': 'Bước tiếp theo',
  conclusion: 'Kết luận',
  summary: 'Tóm tắt',
  troubleshooting: 'Xử lý sự cố',
  'related resources': 'Tài nguyên liên quan',
  'related products': 'Sản phẩm liên quan',
  objectives: 'Mục tiêu',
  'what you will learn': 'Bạn sẽ học được gì',
  'what you will build': 'Bạn sẽ xây dựng',
  'get started': 'Bắt đầu',
  deployment: 'Triển khai',
  'test locally': 'Kiểm thử cục bộ',
  'deploy to cloudflare workers': 'Triển khai lên Cloudflare Workers',
  'deploy to production': 'Triển khai production',
  'clean up': 'Dọn dẹp',
  cleanup: 'Dọn dẹp',
  'related links': 'Liên kết liên quan',
};

const TITLE_PHRASE_VI = [
  [/^Deploy an? /i, 'Triển khai '],
  [/^Build an? /i, 'Xây dựng '],
  [/^Create an? /i, 'Tạo '],
  [/^Connect /i, 'Kết nối '],
  [/^Protect /i, 'Bảo vệ '],
  [/^Secure /i, 'Bảo mật '],
  [/^Configure /i, 'Cấu hình '],
  [/^Migrate /i, 'Di chuyển '],
  [/^Implement /i, 'Triển khai '],
  [/^Set up /i, 'Thiết lập '],
  [/^Add /i, 'Thêm '],
  [/^Convert /i, 'Chuyển đổi '],
  [/^Import /i, 'Import '],
  [/^Export /i, 'Export '],
  [/^Integrate /i, 'Tích hợp '],
  [/^Replace /i, 'Thay thế '],
  [/^Optimize /i, 'Tối ưu '],
  [/^Handle /i, 'Xử lý '],
  [/^Generate /i, 'Tạo '],
  [/^Upload /i, 'Upload '],
  [/^Download /i, 'Tải '],
  [/^Use /i, 'Sử dụng '],
  [/^Run /i, 'Chạy '],
  [/\bapplication\b/gi, 'ứng dụng'],
  [/\bapplications\b/gi, 'ứng dụng'],
  [/\bproject\b/gi, 'dự án'],
  [/\bprojects\b/gi, 'dự án'],
  [/\bdatabase\b/gi, 'cơ sở dữ liệu'],
  [/\bAPI\b/g, 'API'],
  [/\bwith Cloudflare\b/gi, 'với Cloudflare'],
  [/\bon Cloudflare Workers\b/gi, 'trên Cloudflare Workers'],
  [/\bon Cloudflare Pages\b/gi, 'trên Cloudflare Pages'],
  [/\busing Cloudflare Workers\b/gi, 'bằng Cloudflare Workers'],
  [/\busing Cloudflare Pages\b/gi, 'bằng Cloudflare Pages'],
  [/\bCloudflare One Client\b/gi, 'Cloudflare One Client'],
  [/\bZero Trust\b/gi, 'Zero Trust'],
  [/\bthrough automation\b/gi, 'bằng automation'],
  [/\bmultiple sites\b/gi, 'nhiều site'],
  [/\bprivate DNS\b/gi, 'DNS private'],
  [/\bheadless Linux\b/gi, 'Linux headless'],
  [/\bfor your\b/gi, 'cho'],
  [/\bto your\b/gi, 'vào'],
  [/\bfrom\b/gi, 'từ'],
  [/\band\b/gi, 'và'],
  [/\bwith\b/gi, 'với'],
  [/\bthe\b/gi, ''],
  [/\ba\b/gi, ''],
  [/\ban\b/gi, ''],
];

const STEP_TITLE_PATTERNS = [
  [/^Create a new (.+)$/i, 'Tạo $1 mới'],
  [/^Create (.+)$/i, 'Tạo $1'],
  [/^Install (.+) and dependencies$/i, 'Cài đặt $1 và các dependency'],
  [/^Install (.+)$/i, 'Cài đặt $1'],
  [/^Initialize (.+)$/i, 'Khởi tạo $1'],
  [/^Implement (.+)$/i, 'Triển khai $1'],
  [/^Test locally$/i, 'Kiểm thử cục bộ'],
  [/^Test production deployment$/i, 'Kiểm thử trên production'],
  [/^Deploy to Cloudflare Workers$/i, 'Triển khai lên Cloudflare Workers'],
  [/^Deploy (.+)$/i, 'Triển khai $1'],
  [/^Configure (.+)$/i, 'Cấu hình $1'],
  [/^Set up (.+)$/i, 'Thiết lập $1'],
  [/^Add (.+)$/i, 'Thêm $1'],
  [/^Update (.+)$/i, 'Cập nhật $1'],
  [/^Delete (.+)$/i, 'Xóa $1'],
  [/^Remove (.+)$/i, 'Gỡ $1'],
  [/^Verify (.+)$/i, 'Xác minh $1'],
  [/^Connect (.+)$/i, 'Kết nối $1'],
];

/** @param {string} title @param {string} [path] */
export function translateTitleVi(title, path = '') {
  const t = title.trim();
  if (!t) return '';

  const normalizedPath = path.replace(/\/$/, '');
  if (CURATED_TITLES_BY_PATH[normalizedPath]) return CURATED_TITLES_BY_PATH[normalizedPath];

  const lower = t.toLowerCase();
  if (SECTION_TITLES_VI[lower]) return SECTION_TITLES_VI[lower];

  for (const [re, rep] of STEP_TITLE_PATTERNS) {
    if (re.test(t)) {
      let s = t.replace(re, rep);
      for (const [pre, post] of TITLE_PHRASE_VI) s = s.replace(pre, post);
      s = s.replace(/\s{2,}/g, ' ').trim();
      return polishViTitle(s.charAt(0).toUpperCase() + s.slice(1));
    }
  }

  let s = t;
  for (const [re, rep] of TITLE_PHRASE_VI) s = s.replace(re, rep);
  s = s.replace(/\s{2,}/g, ' ').trim();

  if (s !== t) return polishViTitle(s.charAt(0).toUpperCase() + s.slice(1));
  return t;
}

/** @param {string} s */
function polishViTitle(s) {
  return s
    .replace(/Cloudflare Workers dự án mới/gi, 'dự án Cloudflare Workers mới')
    .replace(/Cloudflare Pages dự án mới/gi, 'dự án Cloudflare Pages mới')
    .replace(/Tạo D1 cơ sở dữ liệu/gi, 'Tạo cơ sở dữ liệu D1')
    .replace(/Tạo database schema/gi, 'Tạo schema cơ sở dữ liệu')
    .replace(/Initialize Express ứng dụng/gi, 'Khởi tạo ứng dụng Express')
    .replace(/Implement read operations/gi, 'Triển khai thao tác đọc (read)')
    .replace(/Implement create operation/gi, 'Triển khai thao tác tạo (create)')
    .replace(/Implement update operation/gi, 'Triển khai thao tác cập nhật (update)')
    .replace(/Implement delete operation/gi, 'Triển khai thao tác xóa (delete)')
    .replace(/Deploy read operations/gi, 'Triển khai thao tác đọc (read)')
    .replace(/Deploy write operations/gi, 'Triển khai thao tác ghi (write)')
    .replace(/Triển khai read operations/gi, 'Triển khai thao tác đọc (read)')
    .replace(/Triển khai write operations/gi, 'Triển khai thao tác ghi (write)')
    .replace(/read operations/gi, 'thao tác đọc (read)')
    .replace(/write operations/gi, 'thao tác ghi (write)')
    .replace(/create operation/gi, 'thao tác tạo (create)')
    .replace(/update operation/gi, 'thao tác cập nhật (update)')
    .replace(/delete operation/gi, 'thao tác xóa (delete)')
    .replace(/\bnew\b/gi, 'mới')
    .replace(/\boperations\b/gi, 'thao tác')
    .replace(/\boperation\b/gi, 'thao tác');
}

/** @param {string} text */
function localizePrerequisite(text) {
  if (!text?.trim()) return '';
  let s = cleanPrerequisiteText(text);
  const rules = [
    [/^A Cloudflare account\.?$/i, 'Tài khoản Cloudflare'],
    [/^Cloudflare account\.?$/i, 'Tài khoản Cloudflare'],
    [/A Cloudflare account/gi, 'Tài khoản Cloudflare'],
    [/Cloudflare account/gi, 'tài khoản Cloudflare'],
    [/Wrangler CLI installed/gi, 'Đã cài Wrangler CLI'],
    [/Wrangler CLI/gi, 'Wrangler CLI'],
    [/Node\.js(?:\s+\d[\d.]*)?/gi, 'Node.js'],
    [/npm or yarn/gi, 'npm hoặc yarn'],
    [/Get started guide/gi, 'hướng dẫn Get started'],
    [/Workers\/Pages/gi, 'Workers/Pages'],
    [/completed the/gi, 'đã hoàn thành'],
    [/You must/gi, 'Bạn cần'],
    [/You will need/gi, 'Bạn cần'],
    [/Before you begin/gi, 'Trước khi bắt đầu'],
    [/Sign up for/gi, 'Đăng ký'],
    [/Install/gi, 'Cài đặt'],
    [/Configure/gi, 'Cấu hình'],
    [/Create/gi, 'Tạo'],
    [/Enable/gi, 'Bật'],
    [/Access to/gi, 'Quyền truy cập'],
    [/An existing/gi, 'Một'],
    [/A valid/gi, 'Một'],
  ];
  for (const [re, rep] of rules) s = s.replace(re, rep);
  return s.replace(/\s{2,}/g, ' ').trim();
}

/** @param {string} s */
function cleanPrerequisiteText(s) {
  return s.replace(/\s+/g, ' ').trim();
}

/** @param {string} title */
export function translateSectionTitleVi(title) {
  const t = title.trim();
  const numbered = t.match(/^(\d+)\.\s*(.+)$/);
  if (numbered) {
    const vi = translateTitleVi(numbered[2]);
    return `${numbered[1]}. ${vi}`;
  }
  const lower = t.toLowerCase();
  if (SECTION_TITLES_VI[lower]) return SECTION_TITLES_VI[lower];
  return translateTitleVi(t);
}

/** @param {string} title */
function titleHintVi(title) {
  return translateSectionTitleVi(title);
}

/**
 * @param {{ title: string; path: string; track: string; contentType: string }} resource
 * @param {ReturnType<import('./parse-tutorial-md.mjs').parseTutorialMarkdown>} extracted
 */
export function generateTutorialPreviewVi(resource, extracted) {
  const productKey = detectProduct(resource.path);
  const productVi = productKey ? PRODUCT_VI[productKey] : 'Cloudflare';
  const trackCtx = TRACK_CONTEXT_VI[resource.track] ?? TRACK_CONTEXT_VI['cross-cutting'];

  const baseDesc = extracted.descriptionEn || extracted.introEn;
  let summaryVi = localizeDescription(baseDesc);
  if (!summaryVi || summaryVi === baseDesc) {
    summaryVi = `Tóm tắt thực hành: ${titleHintVi(resource.title)} trên ${productVi}.`;
    if (baseDesc && baseDesc.length > 20) {
      summaryVi += ` ${truncatePlain(baseDesc, 180)}`;
    }
  }

  const explanationVi = [
    trackCtx,
    `Tutorial «${titleHintVi(extracted.titleEn || resource.title)}» giúp bạn làm quen luồng triển khai thật — phù hợp đọc trước khi mở tài liệu gốc tiếng Anh.`,
    extracted.stepCount > 0
      ? `Docs gốc chia khoảng ${extracted.stepCount} bước chính; bản tóm tắt dưới đây giúp bạn nắm khung trước khi làm theo từng lệnh.`
      : 'Đọc phần tóm tắt và lưu ý trước — sau đó mở docs gốc để copy lệnh và cấu hình chi tiết.',
  ].join(' ');

  /** @type {string[]} */
  const notesVi = [
    'Đây là bản tóm tắt trên Orange Cloud Learning Hub — không thay thế tài liệu chính thức.',
    'Luôn mở liên kết «Tài liệu gốc» bên dưới khi cần lệnh CLI, snippet code và ảnh minh họa đầy đủ.',
  ];

  if (extracted.prerequisites.length) {
    notesVi.push(
      `Yêu cầu trước (từ docs): ${extracted.prerequisites.map(localizePrerequisite).join(' · ')}`,
    );
  } else if (/workers|pages|wrangler|d1|r2|kv/i.test(resource.path)) {
    notesVi.push(
      'Cần tài khoản Cloudflare, Wrangler CLI và (thường) hoàn thành hướng dẫn Get started của Workers/Pages.',
    );
  }

  if (/access|gateway|warp|zero-trust|cloudflare-one/i.test(resource.path)) {
    notesVi.push('Zero Trust thường cần quyền admin trên tenant Cloudflare One và IdP đã kết nối.');
  }

  if (/terraform|pulumi/i.test(resource.path)) {
    notesVi.push('Kiểm tra token/API và state backend trước khi chạy trên môi trường production.');
  }

  notesVi.push(
    'Docs Cloudflare cập nhật thường xuyên — đối chiếu ngày «Rà soát lần cuối» trên trang gốc khi triển khai production.',
  );

  const stepsVi = extracted.stepTitles.map((step, i) => {
    const localized = localizeDescription(step);
    return localized !== step ? localized : `Bước ${i + 1}: ${step}`;
  });

  const estimatedMinutes = Math.min(
    120,
    Math.max(10, extracted.stepCount * 8 + (extracted.prerequisites.length ? 5 : 0)),
  );

  const sectionSummariesVi = (extracted.sections ?? []).map((section) =>
    summarizeSectionVi(section.title, section.blocks),
  );

  const titleVi = translateTitleVi(extracted.titleEn || resource.title, resource.path);

  return {
    titleVi,
    summaryVi: truncate(summaryVi, 320),
    explanationVi: truncate(explanationVi, 480),
    notesVi: notesVi.slice(0, 6),
    stepsVi,
    estimatedMinutes,
    sectionSummariesVi,
  };
}

/**
 * @param {string} title
 * @param {Array<{ type: string; html?: string; items?: string[] }>} blocks
 */
export function summarizeSectionVi(title, blocks) {
  const firstPara = blocks.find((b) => b.type === 'paragraph' || b.type === 'note');
  const raw =
    firstPara?.type === 'list'
      ? firstPara.items?.[0] ?? ''
      : (firstPara?.html ?? '').replace(/<[^>]+>/g, ' ');

  const localized = localizeDescription(raw);
  if (localized && localized !== raw && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(localized)) {
    return truncate(localized, 280);
  }

  const hint = titleHintVi(title.replace(/^\d+\.\s*/, ''));
  return `Phần «${hint}» — đọc hướng dẫn bên dưới, dùng liên kết docs gốc để xem ảnh minh họa và tab cấu hình đầy đủ.`;
}

/** @param {string} s @param {number} max */
function truncate(s, max) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

/** @param {string} s @param {number} max */
function truncatePlain(s, max) {
  const t = s.replace(/\s+/g, ' ').trim();
  return truncate(t, max);
}
