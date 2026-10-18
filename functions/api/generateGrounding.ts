import { basicConfigurationSections } from '../../src/data/cf101PracticalGuides.ts';

export type GenerateLang = 'vi' | 'en';

type TopicId = 'dns' | 'proxy' | 'ssl' | 'waf';

type Topic = {
  id: TopicId;
  guideId: string;
  pattern: RegExp;
};

/**
 * Dashboard steps copied from the Application Services follow-along lessons
 * (as-1-l1, as-1-l2, as-2-l1, as-3-l1). The worker prompt cannot import that
 * module graph under Node's type-stripping loader, so the lines live here and
 * the practical-guide bullets are still read from cf101PracticalGuides.
 */
const LESSON_STEPS: Record<TopicId, { vi: string[]; en: string[] }> = {
  dns: {
    vi: [
      'Đăng nhập dash.cloudflare.com → Onboard a domain / Add a site.',
      'Review từng record trước khi continue. A/AAAA/CNAME trỏ origin thật; MX cho email; TXT cho SPF/DKIM/DMARC.',
      'Hạ TTL trên DNS cũ (nếu còn quyền) rồi đổi nameserver tại registrar theo đúng hai hostname Cloudflare đưa.',
      'Hai nameserver dạng *.ns.cloudflare.com — copy nguyên, không đoán.',
    ],
    en: [
      'Sign in at dash.cloudflare.com → Onboard a domain / Add a site.',
      'Review every record before continue. A/AAAA/CNAME point at the real origin; MX for email; TXT for SPF/DKIM/DMARC.',
      'Lower TTL on old DNS (if you still can), then change nameservers at the registrar to the two hostnames Cloudflare shows.',
      'Two nameservers like *.ns.cloudflare.com — copy exactly, do not guess.',
    ],
  },
  proxy: {
    vi: [
      'DNS → Records. Bật proxy cho A/AAAA/CNAME của website và API public.',
      'Đám mây cam (Proxied) trên record www và (nếu dùng) apex.',
      'Giữ DNS only (grey cloud) cho MX và hostname không nên qua HTTP proxy (mail).',
      'Xác nhận traffic đi qua Cloudflare bằng header CF-Ray.',
    ],
    en: [
      'DNS → Records. Enable proxy on A/AAAA/CNAME for the public website and API.',
      'Orange cloud (Proxied) on www and (if used) apex.',
      'Keep DNS only (grey cloud) for MX and hostnames that must not hit the HTTP proxy (mail).',
      'Confirm traffic goes through Cloudflare with a CF-Ray header.',
    ],
  },
  ssl: {
    vi: [
      'SSL/TLS → Overview. Nếu origin có cert public hoặc Origin CA hợp lệ: chọn Full (strict).',
      'Tránh Flexible nếu origin chỉ nhận HTTPS — dễ redirect loop.',
      'SSL/TLS → Edge Certificates → Always Use HTTPS = On.',
    ],
    en: [
      'SSL/TLS → Overview. If origin has a public cert or a valid Origin CA cert: choose Full (strict).',
      'Avoid Flexible if origin is HTTPS-only — easy redirect loop.',
      'SSL/TLS → Edge Certificates → Always Use HTTPS = On.',
    ],
  },
  waf: {
    vi: [
      'Nói rõ plan trước khi chỉ bước. Simulate không phải action. Log chỉ có trên Enterprise.',
      'Free: Cloudflare Free Managed Ruleset có trên mọi plan và được bật sẵn trên Free. Không bật Cloudflare Managed Ruleset hay OWASP Core trên Free — hai ruleset đó cần Pro trở lên. Sensitive Data Detection chỉ có trên Enterprise.',
      'Pro và Business: Security → Settings, lọc Web application exploits, bật Cloudflare managed ruleset. OWASP Core là tùy chọn và cũng cần Pro trở lên. Xem deployment settings rồi Save. Mặc định chỉ bật một phần rule. Không override mọi rule sang Block.',
      'Enterprise: cùng đường Security → Settings. Muốn xem rule mới trước khi chặn thì dùng action Log, rồi xem Security Events. Free, Pro và Business không có Log: bắt đầu bằng Managed Challenge, xem Security Events, rồi mới đổi sang Block.',
      'Sau khi đã bật ruleset: Security → Security rules, lọc Managed rules, mở rule có action Execute nếu cần đổi scope hoặc override.',
      'Action thật khi override: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge. Log chỉ Enterprise. Không gọi Simulate.',
      'WAF chỉ thấy HTTP khi hostname đang proxied (đám mây cam). Không bật WAF trong cài đặt WordPress.',
      'Docs: https://developers.cloudflare.com/waf/managed-rules/ https://developers.cloudflare.com/waf/get-started/ https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/ https://developers.cloudflare.com/waf/custom-rules/create-dashboard/ https://developers.cloudflare.com/security/rules/',
    ],
    en: [
      'Name the plan before you give a step. Simulate is not an action. Log is Enterprise-only.',
      'Free: the Cloudflare Free Managed Ruleset is on every plan and is already deployed on Free. Do not turn on the Cloudflare Managed Ruleset or OWASP Core on Free — both need Pro or above. Sensitive Data Detection is Enterprise only.',
      'Pro and Business: Security → Settings, filter by Web application exploits, turn on Cloudflare managed ruleset. OWASP Core is optional and also needs Pro or above. Review the deployment settings, then Save. The default enables a subset of rules. Do not override every rule to Block.',
      'Enterprise: same Security → Settings path. To watch a new rule before blocking, use the Log action, then review Security Events. Free, Pro, and Business have no Log: start with Managed Challenge, review Security Events, then switch to Block.',
      'After a ruleset is on: Security → Security rules, filter Managed rules, and open the rule whose action is Execute when you need to change scope or an override.',
      'Real override actions: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge. Log is Enterprise-only. Do not call anything Simulate.',
      'WAF only sees HTTP when the hostname is proxied (orange cloud). Do not enable WAF inside WordPress settings.',
      'Docs: https://developers.cloudflare.com/waf/managed-rules/ https://developers.cloudflare.com/waf/get-started/ https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/ https://developers.cloudflare.com/waf/custom-rules/create-dashboard/ https://developers.cloudflare.com/security/rules/',
    ],
  },
};

const TOPICS: Topic[] = [
  {
    id: 'dns',
    guideId: 'dns',
    pattern: /nameserver|\bdns\b|ban ghi|ten mien|\bdomain\b|registrar|\bzone\b/,
  },
  {
    id: 'proxy',
    guideId: 'dns',
    pattern: /orange[\s-]?cloud|dam may|\bproxy\b|proxied|grey cloud|gray cloud/,
  },
  {
    id: 'ssl',
    guideId: 'ssl',
    pattern: /\bssl\b|\btls\b|\bhttps\b|chung chi|certificate|encryption mode|always use https/,
  },
  {
    id: 'waf',
    // Practical-guide waf-lab still says "block now" and lists Log as a general action.
    // Keep that page copy out of the prompt; the plan-gated steps above are the source.
    guideId: '',
    pattern: /\bwaf\b|firewall|tuong lua|managed rule|wordpress|security setting|bao mat/,
  },
];

function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

function text(localized: { vi: string; en: string }, lang: GenerateLang) {
  return localized[lang];
}

/**
 * System prompt: only real Cloudflare controls, and an explicit refusal to invent
 * credentials, passwords, plugins, or API keys.
 */
export function generateSystemPrompt(lang: GenerateLang): string {
  if (lang === 'en') {
    return [
      'You are a Cloudflare learning assistant. Be concise, beginner-friendly, and actionable.',
      '',
      'Grounding rules — follow all of them:',
      '- Only describe Cloudflare steps that really exist: a nameserver change and DNS records, the orange-cloud proxy toggle, the SSL/TLS mode, and WAF managed rules and security settings in the Cloudflare dashboard (dash.cloudflare.com). Gate WAF by plan: Free uses the Cloudflare Free Managed Ruleset; the Cloudflare Managed Ruleset and OWASP Core need Pro or above. Log is Enterprise-only. Simulate is not an action.',
      '- Never invent credentials, passwords, or plugin or API-key steps. There is no DNS password. WAF is not turned on by adding an API key in WordPress settings. Do not invent nameserver hostnames; tell the learner to copy the two names the dashboard shows.',
      '- If you are not sure a control exists, say you are not sure and point the learner to the Cloudflare dashboard or https://developers.cloudflare.com instead of guessing.',
      '- When curated onboarding notes are included, prefer those steps and do not add steps they do not contain.',
    ].join('\n');
  }

  return [
    'Bạn là trợ lý học Cloudflare. Viết ngắn gọn, dễ hiểu cho người mới và có bước hành động rõ ràng.',
    '',
    'Quy tắc bám sự thật — làm đủ các ý sau:',
    '- Chỉ mô tả bước Cloudflare có thật: đổi nameserver và bản ghi DNS, công tắc proxy đám mây cam (orange cloud), chế độ SSL/TLS, và WAF managed rules cùng security settings trong dashboard Cloudflare (dash.cloudflare.com). Gắn WAF theo plan: Free dùng Cloudflare Free Managed Ruleset; Cloudflare Managed Ruleset và OWASP Core cần Pro trở lên. Log chỉ có trên Enterprise. Simulate không phải action.',
    '- Không bịa thông tin đăng nhập, mật khẩu, bước cài plugin, hoặc bước API key. Không có mật khẩu DNS. Không bật WAF bằng cách thêm API key trong phần cài đặt WordPress. Không bịa hostname nameserver; bảo người học copy đúng hai tên mà dashboard hiển thị.',
    '- Nếu không chắc một nút hay một bước có tồn tại, hãy nói là không chắc và hướng người học tới dashboard Cloudflare hoặc https://developers.cloudflare.com, đừng đoán.',
    '- Khi có ghi chú onboarding đi kèm, ưu tiên các bước đó và không thêm bước mà ghi chú không có.',
  ].join('\n');
}

function formatGuide(guideId: string, lang: GenerateLang) {
  const section = basicConfigurationSections.find((item) => item.id === guideId);
  if (!section) return '';
  const lines = [text(section.summary, lang)];
  for (const bullet of section.bullets.slice(0, 3)) {
    lines.push(`- ${text(bullet.text, lang)}`);
  }
  return lines.join('\n');
}

/** Relevant curated onboarding notes for this topic, or '' when nothing in the hub matches. */
export function curatedOnboardingContext(prompt: string, lang: GenerateLang): string {
  const folded = fold(prompt);
  const matched = TOPICS.filter((topic) => topic.pattern.test(folded));
  if (!matched.length) return '';

  const seenGuides = new Set<string>();
  const blocks: string[] = [];
  for (const topic of matched) {
    blocks.push(LESSON_STEPS[topic.id][lang].map((step) => `- ${step}`).join('\n'));
    if (!seenGuides.has(topic.guideId)) {
      seenGuides.add(topic.guideId);
      const guide = formatGuide(topic.guideId, lang);
      if (guide) blocks.push(guide);
    }
  }

  const header =
    lang === 'en'
      ? 'Curated onboarding notes from this hub. Use only these Cloudflare steps when they apply.'
      : 'Ghi chú onboarding có sẵn trên hub. Khi áp dụng, chỉ dùng các bước Cloudflare dưới đây.';

  return `${header}\n\n${blocks.join('\n\n')}`.slice(0, 3500);
}

export function buildGenerateMessages(prompt: string, lang: GenerateLang) {
  const context = curatedOnboardingContext(prompt, lang);
  const task =
    lang === 'en'
      ? `Generate learning content for: ${prompt}\nFormat: 5 bullets + 1 next-step CTA.`
      : `Tạo nội dung học cho chủ đề: ${prompt}\nĐịnh dạng: 5 gạch đầu dòng + 1 CTA bước tiếp theo.`;

  const user = context ? `${task}\n\n${context}` : task;

  return [
    { role: 'system', content: generateSystemPrompt(lang) },
    { role: 'user', content: user },
  ];
}
