import { basicConfigurationSections } from '../../src/data/cf101PracticalGuides.ts';
import { formatPlanFeatureTable } from './planFeatures.ts';

export type GenerateLang = 'vi' | 'en';

type TopicId = 'dns' | 'proxy' | 'ssl' | 'waf' | 'logs' | 'bots';

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
      'Cloudflare tự gán hai nameserver riêng cho từng zone và không đổi được. Mở đúng zone → trang Overview và copy nguyên hai tên đang hiện. Không đoán hostname.',
      'Hạ TTL trên DNS cũ (nếu còn quyền). Tại registrar, dán đúng hai nameserver vừa copy từ trang Overview. Chỉ đổi nameserver một lần. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/',
    ],
    en: [
      'Sign in at dash.cloudflare.com → Onboard a domain / Add a site.',
      'Review every record before continue. A/AAAA/CNAME point at the real origin; MX for email; TXT for SPF/DKIM/DMARC.',
      'Cloudflare assigns two nameservers to each zone and the assignment cannot be changed. Open that zone → Overview page and copy the two names shown there. Do not guess a hostname.',
      'Lower TTL on old DNS (if you still can). At the registrar, paste the two nameservers copied from the zone Overview page, and change nameservers once. https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/',
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
      'Nói rõ plan trước khi chỉ bước. Simulate không phải action. Log chỉ có trên Enterprise. Sensitive Data Detection chỉ có trên Enterprise. Đừng bảo người học nâng cấp lên Pro hoặc Business để có Log hoặc Sensitive Data Detection.',
      'Sensitive Data Detection chỉ có trên Enterprise. Free, Pro và Business không có công tắc Sensitive data detection. Đừng nâng cấp lên Pro hoặc Business để có SDD. Trên Enterprise: Security → Settings, lọc Web application exploits, bật Sensitive data detection. https://developers.cloudflare.com/waf/managed-rules/reference/sensitive-data-detection/',
      'Cloudflare Managed Ruleset cần Pro trở lên. Free đã có WAF: Cloudflare Free Managed Ruleset (bật sẵn) và custom rules. Không bật Cloudflare Managed Ruleset hay OWASP Core Ruleset trên Free.',
      'Pro và Business: Cloudflare Managed Ruleset không bật sẵn. Vào Security → Settings, lọc Web application exploits, rồi bật Cloudflare managed ruleset. OWASP Core là tùy chọn và cũng cần Pro trở lên. Xem deployment settings rồi Save. Save không bật mọi rule. Sau khi bật, chỉ một phần rule chạy. Không override mọi rule sang Block.',
      'Enterprise: cùng đường Security → Settings. Muốn xem rule mới trước khi chặn thì dùng action Log, rồi xem Security Events. Free, Pro và Business không có Log: bắt đầu bằng Managed Challenge, xem Security Events, rồi mới đổi sang Block.',
      'Sau khi đã bật ruleset: Security → Security rules, lọc Managed rules, mở rule có action Execute nếu cần đổi scope hoặc override.',
      'Action thật khi override: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge. Log chỉ Enterprise. Không gọi Simulate.',
      'WAF chỉ thấy HTTP khi hostname đang proxied (đám mây cam). Không bật WAF trong cài đặt WordPress.',
      'Docs: https://developers.cloudflare.com/waf/managed-rules/ https://developers.cloudflare.com/waf/custom-rules/ https://developers.cloudflare.com/ruleset-engine/rules-language/actions/ https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/ https://developers.cloudflare.com/security/rules/',
    ],
    en: [
      'Name the plan before you give a step. Simulate is not an action. Log is Enterprise-only. Sensitive Data Detection is Enterprise-only. Do not tell the learner to upgrade to Pro or Business for Log or Sensitive Data Detection.',
      'Sensitive Data Detection is Enterprise-only. Free, Pro, and Business have no Sensitive data detection toggle. Do not upgrade to Pro or Business for SDD. On Enterprise: Security → Settings, filter Web application exploits, turn on Sensitive data detection. https://developers.cloudflare.com/waf/managed-rules/reference/sensitive-data-detection/',
      'The Cloudflare Managed Ruleset needs Pro or above. Free already has WAF: the Cloudflare Free Managed Ruleset (already on) and custom rules. Do not turn on the Cloudflare Managed Ruleset or the OWASP Core Ruleset on Free.',
      'Pro and Business: the Cloudflare Managed Ruleset is not already on. Go to Security → Settings, filter by Web application exploits, then turn on Cloudflare managed ruleset. OWASP Core is optional and also needs Pro or above. Review the deployment settings, then Save. Save does not enable every rule. After you turn it on, only a subset of rules runs. Do not override every rule to Block.',
      'Enterprise: same Security → Settings path. To watch a new rule before blocking, use the Log action, then review Security Events. Free, Pro, and Business have no Log: start with Managed Challenge, review Security Events, then switch to Block.',
      'After a ruleset is on: Security → Security rules, filter Managed rules, and open the rule whose action is Execute when you need to change scope or an override.',
      'Real override actions: Block, Managed Challenge, Non-Interactive Challenge, Interactive Challenge. Log is Enterprise-only. Do not call anything Simulate.',
      'WAF only sees HTTP when the hostname is proxied (orange cloud). Do not enable WAF inside WordPress settings.',
      'Docs: https://developers.cloudflare.com/waf/managed-rules/ https://developers.cloudflare.com/waf/custom-rules/ https://developers.cloudflare.com/ruleset-engine/rules-language/actions/ https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/ https://developers.cloudflare.com/security/rules/',
    ],
  },
  logs: {
    vi: [
      'Logpush có trên Free, Pro và Business theo giá dùng bao nhiêu tính bấy nhiêu. Chỉ action Log của custom rule WAF là Enterprise-only. Không có công tắc tên Logging. https://developers.cloudflare.com/logs/logpush/pricing/',
    ],
    en: [
      'Logpush is available on Free, Pro, and Business with usage-based pricing. Only the WAF custom-rule Log action is Enterprise-only. There is no Logging toggle. https://developers.cloudflare.com/logs/logpush/pricing/',
    ],
  },
  bots: {
    vi: [
      'Bot Management là add-on Enterprise. Pro và Business dùng Super Bot Fight Mode, không phải Bot Management. Free dùng Bot Fight Mode. https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/',
    ],
    en: [
      'Bot Management is an Enterprise add-on. Pro and Business use Super Bot Fight Mode, not Bot Management. Free uses Bot Fight Mode. https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/',
    ],
  },
};

const TOPICS: Topic[] = [
  {
    id: 'dns',
    // The public DNS accordion summary says "DNS map", which the model repeats as a filler step.
    guideId: '',
    pattern: /nameserver|\bdns\b|ban ghi|ten mien|\bdomain\b|registrar|\bzone\b|mat bao/,
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
    // The public waf-lab accordion uses the same plan-gated steps. Keep them out of
    // the prompt so the model does not see the notes twice.
    guideId: '',
    pattern:
      /\bwaf\b|firewall|tuong lua|managed rule|rule set|wordpress|security setting|bao mat|owasp|ruleset|core rule|\blog\b(?!\s+in\b)|simulate|goi free|free plan|on free|sensitive data|\bsdd\b|du lieu nhay cam|phat hien the|the tin dung|card detection|credit card/,
  },
  {
    id: 'logs',
    guideId: '',
    pattern: /logpush|\blogging\b/,
  },
  {
    id: 'bots',
    guideId: '',
    pattern: /bot management|super bot|bot fight/,
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
      '- Only describe Cloudflare steps that really exist: a nameserver change and DNS records, the orange-cloud proxy toggle, the SSL/TLS mode, and WAF managed rules and security settings in the Cloudflare dashboard (dash.cloudflare.com). WAF is available on Free: the Cloudflare Free Managed Ruleset and custom rules. The Cloudflare Managed Ruleset needs Pro or above. The OWASP Core Ruleset needs Pro or above. Log is Enterprise-only. Sensitive Data Detection is Enterprise-only. Simulate is not an action.',
      '- Never invent credentials, passwords, or plugin or API-key steps. There is no DNS password. WAF is not turned on by adding an API key in WordPress settings. Do not invent nameserver hostnames. Never write a concrete nameserver hostname. Tell the learner to copy the two nameservers shown on that zone’s Overview page, then paste those two names at the registrar. A guessed pair takes the domain and its email offline.',
      '- Do not tell the learner to upgrade to Pro or Business for Log or Sensitive Data Detection. Both are Enterprise-only. When the plan is not Enterprise, use Managed Challenge instead of Log. The Cloudflare Managed Ruleset is not already on for Pro or Business. Save does not enable every rule. The deployment runs a subset of rules.',
      '- Logpush is available on Free, Pro, and Business with usage-based pricing. Only the WAF custom-rule Log action is Enterprise-only. Do not say that Pro lacks Logpush. There is no Logging toggle. Bot Management is an Enterprise add-on; on Pro and Business use Super Bot Fight Mode. https://developers.cloudflare.com/logs/logpush/pricing/',
      '- If you are not sure a control exists, say you are not sure and point the learner to the Cloudflare dashboard or https://developers.cloudflare.com instead of guessing.',
      '- When curated onboarding notes are included, use only those steps. Do not add filler steps the notes do not contain: no DNS cache, no DNS buffer, and no “DNS map” action. Say the next step once. Do not repeat it.',
      '',
      formatPlanFeatureTable('en'),
    ].join('\n');
  }

  return [
    'Bạn là trợ lý học Cloudflare. Viết ngắn gọn, dễ hiểu cho người mới và có bước hành động rõ ràng.',
    '',
    'Quy tắc bám sự thật — làm đủ các ý sau:',
    '- Chỉ mô tả bước Cloudflare có thật: đổi nameserver và bản ghi DNS, công tắc proxy đám mây cam (orange cloud), chế độ SSL/TLS, và WAF managed rules cùng security settings trong dashboard Cloudflare (dash.cloudflare.com). Free đã có WAF: Cloudflare Free Managed Ruleset và custom rules. Cloudflare Managed Ruleset cần Pro trở lên. OWASP Core Ruleset cần Pro trở lên. Log chỉ có trên Enterprise. Sensitive Data Detection chỉ có trên Enterprise. Simulate không phải action.',
      '- Không bịa thông tin đăng nhập, mật khẩu, bước cài plugin, hoặc bước API key. Không có mật khẩu DNS. Không bật WAF bằng cách thêm API key trong phần cài đặt WordPress. Không bịa hostname nameserver. Không viết hostname nameserver cụ thể. Bảo người học copy đúng hai nameserver đang hiện trên trang Overview của zone đó, rồi dán hai tên đó tại registrar. Đoán sai cặp nameserver làm tên miền và email ngừng phân giải.',
      '- Đừng bảo người học nâng cấp lên Pro hoặc Business để có Log hoặc Sensitive Data Detection. Cả hai chỉ có trên Enterprise. Khi plan không phải Enterprise, dùng Managed Challenge thay cho Log. Cloudflare Managed Ruleset không bật sẵn trên Pro hoặc Business. Save không bật mọi rule. Bản deployment chỉ chạy một phần rule.',
      '- Logpush có trên Free, Pro và Business theo giá dùng bao nhiêu tính bấy nhiêu. Chỉ action Log của custom rule WAF là Enterprise-only. Đừng nói Pro không có Logpush. Không có công tắc tên Logging. Bot Management là add-on Enterprise; trên Pro và Business dùng Super Bot Fight Mode. https://developers.cloudflare.com/logs/logpush/pricing/',
    '- Nếu không chắc một nút hay một bước có tồn tại, hãy nói là không chắc và hướng người học tới dashboard Cloudflare hoặc https://developers.cloudflare.com, đừng đoán.',
    '- Khi có ghi chú onboarding đi kèm, chỉ dùng các bước đó. Không thêm bước đệm mà ghi chú không có: không bộ đệm DNS, không DNS cache, và không hành động “DNS map”. Nói bước tiếp theo một lần. Đừng lặp lại.',
    '',
    formatPlanFeatureTable('vi'),
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
      ? `Generate learning content for: ${prompt}\nFormat: 5 bullets + 1 next-step CTA. Say the next step once. Do not repeat it.`
      : `Tạo nội dung học cho chủ đề: ${prompt}\nĐịnh dạng: 5 gạch đầu dòng + 1 CTA bước tiếp theo. Nói bước tiếp theo một lần. Đừng lặp lại.`;

  const user = context ? `${task}\n\n${context}` : task;

  return [
    { role: 'system', content: generateSystemPrompt(lang) },
    { role: 'user', content: user },
  ];
}
