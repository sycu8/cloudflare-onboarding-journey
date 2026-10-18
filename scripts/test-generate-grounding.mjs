/**
 * Grounding rules for /api/generate must be in the prompt sent to Workers AI,
 * and matching hub lessons must be injected as context.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const { buildGenerateMessages, curatedOnboardingContext, generateSystemPrompt } = await import(
  '../functions/api/generateGrounding.ts'
);
const { basicConfigurationSections } = await import('../src/data/cf101PracticalGuides.ts');
const { guardGenerateResult, onRequestPost, reviewGenerateResult, rewriteInventedNameservers, statedPlan } = await import(
  '../functions/api/generate.ts'
);
const { gatherVerdicts, parseClaimVerdicts, reviewPlanClaims } = await import('../functions/api/planFeatures.ts');

const EN_RULES = [
  'nameserver change and DNS records',
  'orange-cloud proxy toggle',
  'SSL/TLS mode',
  'WAF managed rules and security settings',
  'Pro or above',
  'Log is Enterprise-only',
  'Simulate is not an action',
  'Never invent credentials, passwords, or plugin or API-key steps',
  'There is no DNS password',
  'Do not invent nameserver hostnames',
  'zone’s Overview page',
  'WAF is available on Free',
  'custom rules',
  'no “DNS map” action',
  'Say the next step once',
  'Do not tell the learner to upgrade to Pro or Business for Log',
  'The Cloudflare Managed Ruleset needs Pro or above',
  'Save does not enable every rule',
  'say you are not sure',
];

const VI_RULES = [
  'nameserver và bản ghi DNS',
  'đám mây cam (orange cloud)',
  'SSL/TLS',
  'WAF managed rules',
  'Pro trở lên',
  'Log chỉ có trên Enterprise',
  'Simulate không phải action',
  'Không bịa thông tin đăng nhập, mật khẩu, bước cài plugin, hoặc bước API key',
  'Không có mật khẩu DNS',
  'Không bịa hostname nameserver',
  'trang Overview của zone',
  'Free đã có WAF',
  'custom rules',
  'không hành động “DNS map”',
  'Nói bước tiếp theo một lần',
  'Đừng bảo người học nâng cấp lên Pro hoặc Business',
  'Cloudflare Managed Ruleset cần Pro trở lên',
  'Save không bật mọi rule',
  'không chắc',
];

for (const phrase of EN_RULES) {
  assert.ok(generateSystemPrompt('en').includes(phrase), `en prompt missing: ${phrase}`);
}
for (const phrase of VI_RULES) {
  assert.ok(generateSystemPrompt('vi').includes(phrase), `vi prompt missing: ${phrase}`);
}
assert.doesNotMatch(generateSystemPrompt('en'), /to enable WAF/i);
assert.doesNotMatch(generateSystemPrompt('vi'), /để bật WAF/);

const enMessages = buildGenerateMessages('How do I enable the WAF on WordPress?', 'en');
assert.equal(enMessages[0].role, 'system');
assert.equal(enMessages[0].content, generateSystemPrompt('en'));
assert.match(enMessages[1].content, /Security → Settings/);
assert.match(enMessages[1].content, /Security → Security rules/);
assert.match(enMessages[1].content, /Free Managed Ruleset/);
assert.match(enMessages[1].content, /The Cloudflare Managed Ruleset needs Pro or above/);
assert.match(enMessages[1].content, /is not already on/);
assert.doesNotMatch(enMessages[1].content, /on by default/i);
assert.doesNotMatch(enMessages[1].content, /The default enables/);
assert.match(enMessages[1].content, /Pro or above/);
assert.match(enMessages[1].content, /Enterprise-only/);
assert.match(enMessages[1].content, /Simulate is not an action/);
assert.match(enMessages[1].content, /https:\/\/developers\.cloudflare\.com\/waf\/managed-rules\//);
assert.doesNotMatch(enMessages[1].content, /Security → WAF → Managed rules/);
assert.doesNotMatch(enMessages[1].content, /Log \/ Simulate/);
assert.doesNotMatch(enMessages[1].content, /blocks sensitive paths/i);
assert.match(enMessages.map((message) => message.content).join('\n'), /orange-cloud proxy toggle/);
assert.doesNotMatch(enMessages[1].content, /DNS password/i);

const viMessages = buildGenerateMessages('Làm sao bật WAF cho website WordPress?', 'vi');
assert.equal(viMessages[0].content, generateSystemPrompt('vi'));
assert.match(viMessages[1].content, /Security → Settings/);
assert.match(viMessages[1].content, /Security → Security rules/);
assert.match(viMessages[1].content, /Cloudflare Managed Ruleset cần Pro trở lên/);
assert.match(viMessages[1].content, /không bật sẵn/);
assert.match(viMessages[1].content, /Pro trở lên/);
assert.match(viMessages[1].content, /Simulate không phải action/);
assert.doesNotMatch(viMessages[1].content, /Security → WAF → Managed rules/);
assert.doesNotMatch(viMessages[1].content, /Log \/ Simulate/);
assert.doesNotMatch(viMessages[1].content, /chặn path nhạy cảm/);
assert.match(viMessages.map((message) => message.content).join('\n'), /đám mây cam \(orange cloud\)/);

const dns = curatedOnboardingContext('đổi nameserver và bản ghi DNS', 'vi');
assert.match(dns, /nameserver/i);
assert.match(dns, /dash\.cloudflare\.com/);
assert.match(dns, /Overview/);
assert.match(dns, /một lần/);
assert.match(dns, /dán đúng hai nameserver/);
assert.match(dns, /https:\/\/developers\.cloudflare\.com\/dns\/zone-setups\/full-setup\/setup\//);
assert.doesNotMatch(dns, /ns1\.cloudflare\.com/i);
assert.doesNotMatch(dns, /<tên>\.ns\.cloudflare\.com/);
assert.doesNotMatch(dns, /<name>\.ns\.cloudflare\.com/);
assert.doesNotMatch(dns, /DNS map/);
assert.doesNotMatch(dns, /\*\.ns\.cloudflare\.com/);
const dnsEn = curatedOnboardingContext('change nameservers at the registrar', 'en');
assert.match(dnsEn, /paste the two nameservers/);
assert.equal((dnsEn.match(/change nameservers once/g) ?? []).length, 1);
assert.match(curatedOnboardingContext('Tên miền mua ở Mắt Bão', 'vi'), /dán đúng hai nameserver/);
assert.match(generateSystemPrompt('en'), /paste those two names at the registrar/);
assert.match(generateSystemPrompt('vi'), /dán hai tên đó tại registrar/);
assert.match(generateSystemPrompt('en'), /Logpush is available on Free, Pro, and Business with usage-based pricing/);
assert.match(generateSystemPrompt('en'), /Do not say that Pro lacks Logpush/);
assert.match(generateSystemPrompt('vi'), /Đừng nói Pro không có Logpush/);
assert.match(generateSystemPrompt('en'), /The deployment runs a subset of rules/);
assert.match(generateSystemPrompt('en'), /Plan-feature table/);
assert.match(generateSystemPrompt('en'), /Nameservers come from the zone Overview/);
assert.match(generateSystemPrompt('en'), /credit-card detection, is Enterprise only/);
assert.match(generateSystemPrompt('vi'), /Bảng plan-feature/);
assert.match(generateSystemPrompt('vi'), /Nameserver chỉ lấy từ trang Overview/);
assert.match(generateSystemPrompt('en'), /Business does not lack the Cloudflare Managed Ruleset/);
assert.match(generateSystemPrompt('en'), /Save does not enable every rule/);
assert.match(generateSystemPrompt('vi'), /Business không thiếu Cloudflare Managed Ruleset/);
assert.match(generateSystemPrompt('vi'), /Save không bật mọi rule/);

const freeOwasp = buildGenerateMessages(
  'Tôi dùng gói Free, bật OWASP Core Ruleset ở đâu và nên để action Log trước không?',
  'vi',
);
assert.match(freeOwasp[1].content, /Free đã có WAF/);
assert.match(freeOwasp[1].content, /custom rules/i);
assert.match(freeOwasp[1].content, /OWASP Core Ruleset/);
assert.match(freeOwasp[1].content, /Pro trở lên/);
assert.match(freeOwasp[1].content, /Security → Settings/);
assert.match(freeOwasp[1].content, /Security → Security rules/);
assert.match(freeOwasp[1].content, /Log chỉ có trên Enterprise/);
assert.match(freeOwasp[1].content, /Simulate không phải action/);
assert.doesNotMatch(freeOwasp[1].content, /Security → WAF → Managed rules/);
assert.doesNotMatch(freeOwasp[1].content, /để bật WAF/);

const logFirst = buildGenerateMessages('On the Free plan, should I set the Log action before Block?', 'en');
assert.match(logFirst[1].content, /Free already has WAF/);
assert.match(logFirst[1].content, /custom rules/i);
assert.match(logFirst[1].content, /OWASP Core Ruleset/);
assert.match(logFirst[1].content, /Pro or above/);
assert.match(logFirst[1].content, /Security → Settings/);
assert.match(logFirst[1].content, /Log is Enterprise-only/);
assert.match(logFirst[1].content, /Simulate is not an action/);
assert.doesNotMatch(logFirst[1].content, /to enable WAF/i);

assert.equal(curatedOnboardingContext('How do I log in to the dashboard?', 'en'), '');
assert.match(curatedOnboardingContext('Where is the managed rule set?', 'en'), /The Cloudflare Managed Ruleset needs Pro or above/);
assert.match(curatedOnboardingContext('I am on Free', 'en'), /The Cloudflare Managed Ruleset needs Pro or above/);
assert.match(curatedOnboardingContext('I am on Free', 'en'), /is not already on/);

const unrelated = curatedOnboardingContext('Durable Objects là gì?', 'en');
assert.equal(unrelated, '');
const unrelatedMessages = buildGenerateMessages('Durable Objects là gì?', 'en');
assert.equal(unrelatedMessages[0].content.includes('say you are not sure'), true);
assert.doesNotMatch(unrelatedMessages[1].content, /Managed rules/);

function request(body) {
  return new Request('http://127.0.0.1/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const seen = [];
const res = await onRequestPost({
  request: request({ prompt: 'Làm sao bật WAF cho website WordPress?', lang: 'vi' }),
  env: {
    AI: {
      run: async (model, input) => {
        seen.push({ model, input });
        return { response: 'ok' };
      },
    },
  },
});
assert.equal(res.status, 200);
assert.equal(seen.length, 1);
assert.equal(seen[0].model, '@cf/meta/llama-3.1-8b-instruct-fp8');
const sent = seen[0].input.messages.map((message) => message.content).join('\n');
for (const phrase of VI_RULES) {
  assert.ok(sent.includes(phrase), `Workers AI prompt missing: ${phrase}`);
}
assert.match(sent, /Security → Settings/);
assert.doesNotMatch(sent, /Log \/ Simulate/);
assert.doesNotMatch(sent, /Security → WAF → Managed rules/);
assert.doesNotMatch(sent, /mật khẩu DNS là/);

const wafLab = basicConfigurationSections.find((section) => section.id === 'waf-lab');
assert.ok(wafLab);
const wafCopy = [wafLab.summary.vi, wafLab.summary.en, ...wafLab.bullets.flatMap((bullet) => [bullet.text.vi, bullet.text.en])].join(
  '\n',
);
assert.match(wafCopy, /Free đã có WAF/);
assert.match(wafCopy, /Free already has WAF/);
assert.match(wafCopy, /custom rules/i);
assert.doesNotMatch(wafCopy, /để bật WAF/);
assert.doesNotMatch(wafCopy, /to enable WAF/i);
assert.match(wafCopy, /Security → Settings/);
assert.match(wafCopy, /Security → Security rules/);
assert.match(wafCopy, /Pro trở lên/);
assert.match(wafCopy, /is not already on/);
assert.doesNotMatch(wafCopy, /on by default/i);
assert.doesNotMatch(wafCopy, /The default enables/);
assert.match(wafCopy, /Save does not enable every rule/);
assert.match(wafCopy, /Save không bật mọi rule/);
assert.doesNotMatch(wafCopy, /Save enables all rules/i);
assert.match(wafCopy, /do not upgrade to Pro or Business/i);
assert.match(wafCopy, /Pro or above/);
assert.match(wafCopy, /Simulate không phải action/);
assert.match(wafCopy, /Simulate is not an action/);
assert.equal(wafLab.docsPath, '/waf/managed-rules/');
assert.doesNotMatch(wafCopy, /Log \/ Simulate/);
assert.doesNotMatch(wafCopy, /blocks sensitive paths/i);
assert.doesNotMatch(wafCopy, /chặn path nhạy cảm/);
assert.doesNotMatch(wafCopy, /JS Challenge/);
assert.doesNotMatch(wafCopy, /Security → WAF → Managed rules/);

const robots = readFileSync(join(root, 'public/robots.txt'), 'utf8');
assert.match(robots, /Content-Signal:.*ai-input=no/);

const invented =
  'Hãy copy nguyên hai tên như sau: ns1.cloudflare.com và ns2.cloudflare.com. Ví dụ ada.ns.cloudflare.com.';
const rewritten = rewriteInventedNameservers(invented, 'vi');
assert.doesNotMatch(rewritten, /ns1\.cloudflare\.com/i);
assert.doesNotMatch(rewritten, /ns2\.cloudflare\.com/i);
assert.doesNotMatch(rewritten, /ada\.ns\.cloudflare\.com/i);
assert.match(rewritten, /Overview/);
assert.equal(
  rewriteInventedNameservers('See https://developers.cloudflare.com and dash.cloudflare.com.', 'en'),
  'See https://developers.cloudflare.com and dash.cloudflare.com.',
);

async function generate(body, response) {
  const res = await onRequestPost({
    request: request(body),
    env: {
      AI: {
        run: async (_model, input) => {
          const blob = JSON.stringify(input ?? {});
          if (blob.includes('CLAIM_VERDICTS')) {
            const last = input?.messages?.[input.messages.length - 1]?.content ?? '';
            const ids = typeof last === 'string' ? [...last.matchAll(/^s(\d+)\. /gm)].map((match) => `s${match[1]}`) : [];
            const verdicts = (ids.length ? ids : ['s0']).map((id) => ({ id, v: 'ok' }));
            return { response: JSON.stringify({ verdicts }) };
          }
          return response;
        },
      },
    },
  });
  return { status: res.status, data: await res.json() };
}

const guardedVi = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  {
    response:
      'Hãy copy nguyên hai tên như sau: NS1.cloudflare.com và ns2.cloudflare.com. Hoặc kate.ns.cloudflare.com. Docs: https://developers.cloudflare.com/dns/nameservers/ trên dash.cloudflare.com.',
  },
);
assert.equal(guardedVi.status, 200);
assert.doesNotMatch(guardedVi.data.result.response, /ns1\.cloudflare\.com/i);
assert.doesNotMatch(guardedVi.data.result.response, /ns2\.cloudflare\.com/i);
assert.doesNotMatch(guardedVi.data.result.response, /kate\.ns\.cloudflare\.com/i);
assert.match(guardedVi.data.result.response, /copy hai nameserver đang hiện trên trang Overview của zone/);
assert.match(guardedVi.data.result.response, /developers\.cloudflare\.com/);
assert.match(guardedVi.data.result.response, /dash\.cloudflare\.com/);

const guardedEn = await generate(
  { prompt: 'Change nameservers', lang: 'en' },
  {
    response: 'Set ns12.cloudflare.com at the registrar.',
    choices: [{ message: { content: 'Use foo.ns.cloudflare.com' }, text: 'Also ns.cloudflare.com' }],
  },
);
assert.equal(guardedEn.status, 200);
const guarded = guardGenerateResult(guardedEn.data.result, 'en');
assert.equal(guarded.response, guardedEn.data.result.response);
assert.doesNotMatch(guardedEn.data.result.response, /ns12\.cloudflare\.com/i);
assert.doesNotMatch(guardedEn.data.result.choices[0].message.content, /foo\.ns\.cloudflare\.com/i);
assert.doesNotMatch(guardedEn.data.result.choices[0].text, /ns\.cloudflare\.com/i);
assert.match(guardedEn.data.result.response, /Copy the two nameservers shown on the zone Overview page/);
assert.match(guardedEn.data.result.response, /paste the two nameservers you copied from the zone Overview page/);
assert.doesNotMatch(guardedEn.data.result.response, /Set copy/);
assert.match(guardedEn.data.result.choices[0].message.content, /Overview/);
assert.match(guardedEn.data.result.choices[0].text, /Overview/);

const plain = await generate({ prompt: 'What is orange cloud?', lang: 'en' }, 'Keep the orange cloud on.');
assert.equal(plain.status, 200);
assert.equal(plain.data.result, 'Keep the orange cloud on.');

assert.equal(
  rewriteInventedNameservers('<tên>.ns.cloudflare.com', 'vi'),
  'Hãy copy hai nameserver đang hiện trên trang Overview của zone.',
);
assert.equal(
  rewriteInventedNameservers('Set ns1.cloudflare.com at the registrar.', 'en'),
  'Copy the two nameservers shown on the zone Overview page.',
);
assert.equal(
  rewriteInventedNameservers('See https://ns1.cloudflare.com/docs.', 'en'),
  'Copy the two nameservers shown on the zone Overview page.',
);
for (const sample of [
  'Use _ns1.cloudflare.com.',
  'Use ns1.cloudflare.net.',
  'Use ns1a.cloudflare.com.',
  'Use ns-1.cloudflare.com.',
  `Use ns1${'\u200B'}.cloudflare.com.`,
  'Use ｎｓ１．ｃｌｏｕｄｆｌａｒｅ．ｃｏｍ.',
]) {
  const cleaned = rewriteInventedNameservers(sample, 'en');
  assert.equal(cleaned, 'Copy the two nameservers shown on the zone Overview page.', sample);
  assert.doesNotMatch(cleaned, /cloudflare\.(com|net)/i);
  assert.doesNotMatch(cleaned, /Set copy|https:\/\/copy|<tên>\.copy/);
}

assert.equal(statedPlan('I am on the Business plan'), 'business');
assert.equal(statedPlan('Tôi dùng gói Enterprise'), 'enterprise');
assert.equal(statedPlan('Should I use Log?'), 'unknown');

const businessLog = await generate(
  { prompt: 'I am on the Business plan. Should I change the WAF action to Log?', lang: 'en' },
  { response: 'Yes, change the action to Log and watch events for a day.' },
);
assert.equal(businessLog.status, 200);
assert.match(businessLog.data.result.response, /Log is only available on Enterprise/);
assert.match(businessLog.data.result.response, /Managed Challenge/);
assert.doesNotMatch(businessLog.data.result.response, /change the action to Log/i);
assert.doesNotMatch(businessLog.data.result.response, /upgrade to Pro or Business/i);

const unknownLog = await generate(
  { prompt: 'Nên đổi action sang Log không?', lang: 'vi' },
  { response: 'Hãy đổi action sang Log.' },
);
assert.match(unknownLog.data.result.response, /Log chỉ có trên Enterprise/);
assert.match(unknownLog.data.result.response, /Managed Challenge/);
assert.doesNotMatch(unknownLog.data.result.response, /đổi action sang Log/i);

const enterpriseLog = await generate(
  { prompt: 'I am on the Enterprise plan. Should I change the action to Log?', lang: 'en' },
  { response: 'Change the action to Log, then review Security Events.' },
);
assert.match(enterpriseLog.data.result.response, /Change the action to Log/);

const upgrade = await generate(
  { prompt: 'I am on Free. Can I use Sensitive Data Detection?', lang: 'en' },
  { response: 'Upgrade to Pro or Business for Sensitive Data Detection.' },
);
assert.doesNotMatch(upgrade.data.result.response, /^Upgrade to Pro or Business/);
assert.match(upgrade.data.result.response, /Enterprise-only/);
assert.match(upgrade.data.result.response, /Do not upgrade to Pro or Business/);

const cmrUpgrade = await generate(
  { prompt: 'I am on Free', lang: 'en' },
  { response: 'Upgrade to Pro to turn on the Cloudflare Managed Ruleset.' },
);
assert.equal(cmrUpgrade.data.result.response, 'Upgrade to Pro to turn on the Cloudflare Managed Ruleset.');

const login = await generate(
  { prompt: 'How do I log in?', lang: 'en' },
  { response: 'Log in at dash.cloudflare.com.' },
);
assert.equal(login.data.result.response, 'Log in at dash.cloudflare.com.');

const businessPrompt = 'Tôi dùng gói Business. Tạo custom rule thử nghiệm thế nào?';
const viLogForms = [
  'Trong phần Action, chọn Log để tạo rule thử nghiệm.',
  'Đặt hành động Log cho rule này.',
  'Chọn Log.',
];
for (const response of viLogForms) {
  const sample = await generate({ prompt: businessPrompt, lang: 'vi' }, { response });
  assert.match(sample.data.result.response, /Log chỉ có trên Enterprise/, response);
  assert.match(sample.data.result.response, /Managed Challenge/, response);
  assert.doesNotMatch(sample.data.result.response, /chọn Log|hành động Log/i, response);
  assert.equal((sample.data.result.response.match(/Log chỉ có trên Enterprise/g) ?? []).length, 1, response);
}

const enLogForms = [
  '- run your custom rule in Log mode',
  'Select Log.',
  'Pick Log to test the rule.',
  'Choose Log.',
  'Actions: Block, Log, Managed Challenge.',
];
for (const response of enLogForms) {
  const sample = await generate(
    { prompt: 'I am on the Business plan. How do I test a custom rule?', lang: 'en' },
    { response },
  );
  assert.match(sample.data.result.response, /Log is only available on Enterprise/, response);
  assert.match(sample.data.result.response, /Managed Challenge/, response);
  assert.doesNotMatch(sample.data.result.response, /Log mode|Select Log|Pick Log|Choose Log|Block, Log/i, response);
  assert.equal((sample.data.result.response.match(/Log is only available on Enterprise/g) ?? []).length, 1, response);
}

const doubled = await generate(
  { prompt: 'I am on the Business plan', lang: 'en' },
  { response: 'Select Log to test. Choose Log for the rule.' },
);
assert.equal((doubled.data.result.response.match(/Log is only available on Enterprise/g) ?? []).length, 1);

const upsellAside = await generate(
  { prompt: 'I am on Business', lang: 'en' },
  { response: 'Log and Sensitive Data Detection are the features you want. Upgrade to Pro/Business for these features.' },
);
assert.doesNotMatch(upsellAside.data.result.response, /Upgrade to Pro\/Business for these features/);
assert.match(upsellAside.data.result.response, /Do not upgrade to Pro or Business/);
assert.equal((upsellAside.data.result.response.match(/Do not upgrade to Pro or Business/g) ?? []).length, 1);

const dnsRefusal = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  { response: 'Tôi không chắc.' },
);
assert.match(dnsRefusal.data.result.response, /Overview/);
assert.match(dnsRefusal.data.result.response, /dash\.cloudflare\.com/);
assert.match(dnsRefusal.data.result.response, /registrar/);
assert.match(dnsRefusal.data.result.response, /dán đúng hai nameserver/);
assert.match(dnsRefusal.data.result.response, /full-setup\/setup/);
assert.equal((dnsRefusal.data.result.response.match(/dán đúng hai nameserver/g) ?? []).length, 1);
assert.doesNotMatch(dnsRefusal.data.result.response, /không chắc/);

const keptSteps = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  { response: 'Mở trang Overview của zone và copy hai nameserver.' },
);
assert.match(keptSteps.data.result.response, /Overview/);
assert.match(keptSteps.data.result.response, /dán hai nameserver vừa copy/);
assert.match(keptSteps.data.result.response, /registrar/);
assert.doesNotMatch(keptSteps.data.result.response, /Làm theo các bước sau/);
assert.equal((keptSteps.data.result.response.match(/dán hai nameserver vừa copy/g) ?? []).length, 1);

const alreadyPasted = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  { response: 'Tại registrar, dán hai nameserver vừa copy từ trang Overview của zone.' },
);
assert.equal((alreadyPasted.data.result.response.match(/dán hai nameserver vừa copy/g) ?? []).length, 1);

const pointDomain = await generate(
  { prompt: 'How do I point my domain at Cloudflare?', lang: 'en' },
  { response: 'Open the zone Overview and copy the two names shown there.' },
);
assert.match(pointDomain.data.result.response, /Overview/);
assert.match(pointDomain.data.result.response, /paste the two nameservers you copied/);
assert.equal((pointDomain.data.result.response.match(/paste the two nameservers you copied/g) ?? []).length, 1);

const registrarLock = await generate(
  { prompt: 'What does the registrar lock mean?', lang: 'en' },
  { response: 'The registrar lock stops a transfer.' },
);
assert.equal(registrarLock.data.result.response, 'The registrar lock stops a transfer.');

const otherRefusal = await generate(
  { prompt: 'Durable Objects là gì?', lang: 'vi' },
  { response: 'Tôi không chắc.' },
);
assert.equal(otherRefusal.data.result.response, 'Tôi không chắc.');

const saveClaim = await generate(
  { prompt: 'How do I turn on the Cloudflare Managed Ruleset on Business?', lang: 'en' },
  { response: 'Click Save. Save enables all rules.' },
);
assert.doesNotMatch(saveClaim.data.result.response, /enables all rules/i);
assert.match(saveClaim.data.result.response, /Save does not enable every rule/);

const businessPlan = 'Tôi dùng gói Business. Tạo custom rule thử nghiệm thế nào?';
const enBusiness = 'I am on the Business plan. How do I test a custom rule?';
const reportedLog = [
  'Business có thể dùng Log.',
  'The Business plan supports Log.',
  'Log is available on Business.',
  'Hãy để ở Log.',
  'Actions: Block, Managed Challenge, Log.',
];
for (const response of reportedLog) {
  const sample = await generate({ prompt: response.includes('Business có') || response.includes('để ở') ? businessPlan : enBusiness, lang: response.includes('có') || response.includes('để') ? 'vi' : 'en' }, { response });
  const line = /có|để/.test(response) ? /Log chỉ có trên Enterprise/ : /Log is only available on Enterprise/;
  assert.match(sample.data.result.response, line, response);
  assert.match(sample.data.result.response, /Managed Challenge/, response);
  assert.doesNotMatch(sample.data.result.response, /có thể dùng Log|supports Log|available on Business|để ở Log|Challenge, Log/i, response);
  assert.equal((sample.data.result.response.match(line) ?? []).length, 1, response);
}

const heldOutLog = [
  { prompt: businessPlan, lang: 'vi', response: 'Gói Business hỗ trợ action Log.', banned: /hỗ trợ action Log/ },
  { prompt: enBusiness, lang: 'en', response: 'Pro includes Log.', banned: /includes Log/ },
  { prompt: enBusiness, lang: 'en', response: 'You can leave the action at Log for a day.', banned: /at Log/ },
  { prompt: enBusiness, lang: 'en', response: 'Skip, Allow, or Log.', banned: /or Log/ },
  { prompt: businessPlan, lang: 'vi', response: 'Các action gồm Block, Managed Challenge và Log.', banned: /và Log/ },
];
for (const sampleCase of heldOutLog) {
  const sample = await generate({ prompt: sampleCase.prompt, lang: sampleCase.lang }, { response: sampleCase.response });
  const line = sampleCase.lang === 'vi' ? /Log chỉ có trên Enterprise/ : /Log is only available on Enterprise/;
  assert.match(sample.data.result.response, line, sampleCase.response);
  assert.match(sample.data.result.response, /Managed Challenge/, sampleCase.response);
  assert.doesNotMatch(sample.data.result.response, sampleCase.banned, sampleCase.response);
  assert.equal((sample.data.result.response.match(line) ?? []).length, 1, sampleCase.response);
}

for (const kept of [
  { prompt: enBusiness, lang: 'en', response: 'Log is not available on Business.' },
  { prompt: enBusiness, lang: 'en', response: 'The Business plan does not support Log.' },
  { prompt: businessPlan, lang: 'vi', response: 'Business không có Log.' },
  { prompt: 'Tôi dùng gói Enterprise', lang: 'vi', response: 'Để ở Log.' },
  { prompt: 'I am on the Enterprise plan', lang: 'en', response: 'Log is available on Enterprise.' },
]) {
  const sample = await generate({ prompt: kept.prompt, lang: kept.lang }, { response: kept.response });
  assert.equal(sample.data.result.response, kept.response, kept.response);
}

const reportedSdd = await generate(
  { prompt: 'I am on the Business plan', lang: 'en' },
  { response: 'SDD included with Business.' },
);
assert.doesNotMatch(reportedSdd.data.result.response, /included with Business/i);
assert.match(reportedSdd.data.result.response, /Sensitive Data Detection are Enterprise-only/);
assert.match(reportedSdd.data.result.response, /Do not upgrade to Pro or Business/);
assert.equal((reportedSdd.data.result.response.match(/Do not upgrade to Pro or Business/g) ?? []).length, 1);

for (const sampleCase of [
  { lang: 'en', response: 'Sensitive Data Detection comes with the Business plan.', line: /Enterprise-only/ },
  { lang: 'en', response: 'Pro includes SDD.', line: /Enterprise-only/ },
  { lang: 'vi', response: 'Sensitive Data Detection đã có trong gói Business.', line: /chỉ có trên Enterprise/ },
]) {
  const sample = await generate({ prompt: 'I am on Business', lang: sampleCase.lang }, { response: sampleCase.response });
  assert.doesNotMatch(sample.data.result.response, /comes with the Business plan|includes SDD|đã có trong gói Business/, sampleCase.response);
  assert.match(sample.data.result.response, sampleCase.line, sampleCase.response);
  const upgrade = sampleCase.lang === 'vi' ? /Đừng nâng cấp lên Pro hoặc Business/ : /Do not upgrade to Pro or Business/;
  assert.equal((sample.data.result.response.match(upgrade) ?? []).length, 1, sampleCase.response);
}

for (const kept of [
  { lang: 'en', response: 'Log is only available on Enterprise. On Free, Pro, and Business, use Managed Challenge instead of Log.' },
  { lang: 'vi', response: 'Log chỉ có trên Enterprise. Trên Free, Pro và Business, hãy dùng Managed Challenge thay cho Log.' },
  { lang: 'en', response: 'Log and Sensitive Data Detection are Enterprise-only. Do not upgrade to Pro or Business for them. Use Managed Challenge instead of Log.' },
]) {
  const sample = await generate({ prompt: 'I am on the Business plan', lang: kept.lang }, { response: kept.response });
  assert.equal(sample.data.result.response, kept.response, kept.response);
}

for (const kept of [
  'SDD is not included with Business.',
  'Sensitive Data Detection is Enterprise-only.',
  'Business không hỗ trợ Log.',
]) {
  const sample = await generate({ prompt: 'I am on the Business plan', lang: 'en' }, { response: kept });
  assert.equal(sample.data.result.response, kept, kept);
}

for (const kept of [
  ['Save does not enable every rule. The deployment runs a subset of rules.', 'Save does not enable every rule. The deployment runs a subset of rules.'],
  ['Save doesn\u2019t enable all rules.', "Save doesn't enable all rules.\nThe deployment runs a subset of rules."],
  ['Saving will not turn every rule on.', 'Saving will not turn every rule on.\nThe deployment runs a subset of rules.'],
  ['Save không bật mọi rule.', 'Save không bật mọi rule.\nThe deployment runs a subset of rules.'],
  ['Save không bật tất cả rule.', 'Save không bật tất cả rule.\nThe deployment runs a subset of rules.'],
]) {
  const sample = await generate(
    { prompt: 'How do I turn on the Cloudflare Managed Ruleset on Business?', lang: 'en' },
    { response: kept[0] },
  );
  assert.equal(sample.data.result.response, kept[1], kept[0]);
}

for (const response of ['Sau khi Save, mọi rule đều chạy.', 'Save bật tất cả rule.']) {
  const sample = await generate(
    { prompt: 'Cách bật Cloudflare Managed Ruleset trên Business?', lang: 'vi' },
    { response },
  );
  assert.doesNotMatch(sample.data.result.response, /mọi rule đều chạy|bật tất cả rule/, response);
  assert.match(sample.data.result.response, /Save không bật mọi rule/, response);
  assert.equal((sample.data.result.response.match(/Save không bật mọi rule/g) ?? []).length, 1, response);
}

const owaspFree = await generate(
  { prompt: 'Tôi dùng gói Free. Bật OWASP Core Ruleset ở đâu?', lang: 'vi' },
  { response: 'Bật OWASP Core Ruleset trong Security → Settings.' },
);
assert.doesNotMatch(owaspFree.data.result.response, /Bật OWASP Core Ruleset trong/);
assert.match(owaspFree.data.result.response, /cần Pro trở lên/);
assert.match(owaspFree.data.result.response, /Cloudflare Free Managed Ruleset/);
assert.match(owaspFree.data.result.response, /https:\/\/developers\.cloudflare\.com\/waf\/managed-rules\//);
assert.equal((owaspFree.data.result.response.match(/cần Pro trở lên/g) ?? []).length, 1);

const owaspHeldOut = await generate(
  { prompt: 'I am on the Free plan. Should I deploy the OWASP Core Ruleset?', lang: 'en' },
  { response: 'On the Free plan, deploy the OWASP Core Ruleset for this zone.' },
);
assert.doesNotMatch(owaspHeldOut.data.result.response, /deploy the OWASP Core Ruleset/i);
assert.match(owaspHeldOut.data.result.response, /needs Pro or above/);
assert.match(owaspHeldOut.data.result.response, /not on the Free plan/);
assert.match(owaspHeldOut.data.result.response, /https:\/\/developers\.cloudflare\.com\/waf\/managed-rules\//);

const owaspShort = await generate(
  { prompt: 'On the Free plan, where is the OWASP Core Ruleset?', lang: 'en' },
  { response: 'Enable it under Security → Settings.' },
);
assert.doesNotMatch(owaspShort.data.result.response, /Enable it under Security/);
assert.match(owaspShort.data.result.response, /needs Pro or above/);

const owaspKept = await generate(
  { prompt: 'Tôi dùng gói Free. OWASP Core Ruleset có trên Free không?', lang: 'vi' },
  { response: 'OWASP Core Ruleset cần Pro trở lên.' },
);
assert.equal(owaspKept.data.result.response, 'OWASP Core Ruleset cần Pro trở lên.');

const owaspPro = await generate(
  { prompt: 'I am on the Pro plan. How do I enable the OWASP Core Ruleset?', lang: 'en' },
  { response: 'Turn on the OWASP Core Ruleset under Security → Settings.' },
);
assert.equal(owaspPro.data.result.response, 'Turn on the OWASP Core Ruleset under Security → Settings.');

const owaspRefusal = await generate(
  { prompt: 'Tôi dùng gói Free, bật OWASP Core Ruleset ở đâu?', lang: 'vi' },
  { response: 'Tôi không chắc.' },
);
assert.doesNotMatch(owaspRefusal.data.result.response, /không chắc/);
assert.match(owaspRefusal.data.result.response, /Pro trở lên/);
assert.match(owaspRefusal.data.result.response, /https:\/\/developers\.cloudflare\.com\/waf\/managed-rules\//);
assert.doesNotMatch(owaspRefusal.data.result.response, /Nói rõ plan|Đừng bảo người học/);

const saveContrast = await generate(
  { prompt: 'How do I turn on the Cloudflare Managed Ruleset on Business?', lang: 'en' },
  { response: 'Save enables all rules, not a subset.' },
);
assert.doesNotMatch(saveContrast.data.result.response, /enables all rules/i);
assert.match(saveContrast.data.result.response, /Save does not enable every rule/);
assert.match(saveContrast.data.result.response, /subset of rules/);
assert.equal((saveContrast.data.result.response.match(/subset of rules/g) ?? []).length, 1);

const logLabels = ['- **Log:** record matches on Business', '- Log:', '**Log:**', 'Business: Log'];
for (const response of logLabels) {
  const sample = await generate({ prompt: enBusiness, lang: 'en' }, { response });
  assert.doesNotMatch(sample.data.result.response, /\*\*Log:\*\*|^- Log:|Business: Log/m, response);
  assert.match(sample.data.result.response, /Log is only available on Enterprise/, response);
  assert.equal((sample.data.result.response.match(/Log is only available on Enterprise/g) ?? []).length, 1, response);
}
const logLabelHeld = await generate(
  { prompt: 'I am on the Pro plan. Which custom rule action should I pick?', lang: 'en' },
  { response: 'Pro plan — Log action' },
);
assert.doesNotMatch(logLabelHeld.data.result.response, /Log action/);
assert.match(logLabelHeld.data.result.response, /Managed Challenge/);

const sddEnable = await generate(
  { prompt: 'I am on the Business plan. How do I turn on Sensitive Data Detection?', lang: 'en' },
  { response: 'Turn on Sensitive Data Detection. Upgrade to Business to enable SDD.' },
);
assert.doesNotMatch(sddEnable.data.result.response, /Turn on Sensitive Data Detection/);
assert.doesNotMatch(sddEnable.data.result.response, /Upgrade to Business to enable/);
assert.match(sddEnable.data.result.response, /Enterprise-only/);
assert.match(sddEnable.data.result.response, /Do not upgrade to Pro or Business/);
assert.equal((sddEnable.data.result.response.match(/Do not upgrade to Pro or Business/g) ?? []).length, 1);

const sddHeld = await generate(
  { prompt: 'Tôi dùng gói Pro', lang: 'vi' },
  { response: 'Hãy bật Sensitive Data Detection cho zone này.' },
);
assert.doesNotMatch(sddHeld.data.result.response, /bật Sensitive Data Detection cho zone/);
assert.match(sddHeld.data.result.response, /chỉ có trên Enterprise/);

const sddRefusal = await generate(
  { prompt: 'Sensitive Data Detection có trên Business không?', lang: 'vi' },
  { response: 'Tôi không chắc.' },
);
assert.doesNotMatch(sddRefusal.data.result.response, /không chắc/);
assert.doesNotMatch(sddRefusal.data.result.response, /Nói rõ plan|Đừng bảo người học/);
assert.match(sddRefusal.data.result.response, /Sensitive Data Detection chỉ có trên Enterprise/);
assert.match(sddRefusal.data.result.response, /sensitive-data-detection/);

const cmrFree = await generate(
  { prompt: 'I am on the Free plan. Should I enable managed rules?', lang: 'en' },
  { response: 'On Free, turn on the Cloudflare Managed Ruleset.' },
);
assert.doesNotMatch(cmrFree.data.result.response, /turn on the Cloudflare Managed Ruleset/i);
assert.match(cmrFree.data.result.response, /needs Pro or above/);
assert.match(cmrFree.data.result.response, /not on the Free plan/);
assert.equal((cmrFree.data.result.response.match(/not on the Free plan/g) ?? []).length, 1);

const cmrHeld = await generate(
  { prompt: 'I am on the Free plan', lang: 'en' },
  { response: 'Free includes the Cloudflare Managed Ruleset.' },
);
assert.doesNotMatch(cmrHeld.data.result.response, /Free includes the Cloudflare Managed Ruleset/);
assert.match(cmrHeld.data.result.response, /needs Pro or above/);

const cmrKept = await generate(
  { prompt: 'I am on the Free plan', lang: 'en' },
  { response: 'The Cloudflare Managed Ruleset needs Pro or above.' },
);
assert.equal(cmrKept.data.result.response, 'The Cloudflare Managed Ruleset needs Pro or above.');

const backwardsNs = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  { response: 'Trước hết vào Mắt Bão và đổi nameserver. Sau đó mở Overview để copy hai tên.' },
);
assert.doesNotMatch(backwardsNs.data.result.response, /vào Mắt Bão và đổi nameserver/);
assert.match(backwardsNs.data.result.response, /copy hai nameserver đang hiện trên trang Overview/);
assert.match(backwardsNs.data.result.response, /dán hai nameserver vừa copy/);
const overviewAt = backwardsNs.data.result.response.indexOf('Overview');
const pasteAt = backwardsNs.data.result.response.indexOf('dán hai nameserver');
assert.ok(overviewAt !== -1 && pasteAt !== -1 && overviewAt < pasteAt);
assert.equal((backwardsNs.data.result.response.match(/dán hai nameserver vừa copy/g) ?? []).length, 1);

const backwardsHeld = await generate(
  { prompt: 'Move my domain from Mắt Bão to Cloudflare', lang: 'en' },
  { response: 'Copy the nameservers from Mắt Bão into Cloudflare.' },
);
assert.doesNotMatch(backwardsHeld.data.result.response, /from Mắt Bão into Cloudflare/);
assert.match(backwardsHeld.data.result.response, /Copy the two nameservers shown on the zone Overview page/);
assert.match(backwardsHeld.data.result.response, /paste the two nameservers you copied/);
assert.equal((backwardsHeld.data.result.response.match(/paste the two nameservers you copied/g) ?? []).length, 1);

const orderedNs = await generate(
  { prompt: 'Cách đổi nameserver sang Cloudflare cho tên miền mua ở Mắt Bão', lang: 'vi' },
  {
    response:
      'Mở trang Overview và copy hai nameserver. Tại registrar, dán hai nameserver vừa copy từ trang Overview của zone.',
  },
);
assert.equal((orderedNs.data.result.response.match(/dán hai nameserver vừa copy/g) ?? []).length, 1);
assert.match(orderedNs.data.result.response, /Mở trang Overview và copy hai nameserver/);

const botPro = await generate(
  { prompt: 'I am on the Pro plan. How do I enable Bot Management?', lang: 'en' },
  { response: 'On Pro, enable Bot Management.' },
);
assert.doesNotMatch(botPro.data.result.response, /enable Bot Management/i);
assert.match(botPro.data.result.response, /Enterprise add-on/);
assert.match(botPro.data.result.response, /Super Bot Fight Mode/);

const botKept = await generate(
  { prompt: 'I am on the Pro plan', lang: 'en' },
  { response: 'Super Bot Fight Mode is included on Pro.' },
);
assert.equal(botKept.data.result.response, 'Super Bot Fight Mode is included on Pro.');

const loggingToggle = await generate(
  { prompt: 'I am on the Enterprise plan', lang: 'en' },
  { response: 'Enable the Enterprise Logging toggle.' },
);
assert.doesNotMatch(loggingToggle.data.result.response, /Enable the Enterprise Logging toggle/);
assert.match(loggingToggle.data.result.response, /no Logging toggle/);

const logpushDenied = await generate(
  { prompt: 'I am on the Pro plan. Does Pro include Logpush?', lang: 'en' },
  { response: 'Pro does not include Logpush. You need Enterprise.' },
);
assert.doesNotMatch(logpushDenied.data.result.response, /does not include Logpush|lacks Logpush|need Enterprise/i);
assert.match(logpushDenied.data.result.response, /Logpush is available on Free, Pro, and Business/);
assert.equal((logpushDenied.data.result.response.match(/Logpush is available on Free, Pro, and Business/g) ?? []).length, 1);

const logpushKept = await generate(
  { prompt: 'I am on the Pro plan', lang: 'en' },
  { response: 'Logpush is available on Pro with usage-based pricing.' },
);
assert.equal(logpushKept.data.result.response, 'Logpush is available on Pro with usage-based pricing.');

const owaspDedupe = await generate(
  { prompt: 'Tôi dùng gói Free. Bật OWASP Core Ruleset ở đâu?', lang: 'vi' },
  { response: 'Bật OWASP Core Ruleset trên Free. OWASP Core Ruleset cần Pro trở lên.' },
);
assert.doesNotMatch(owaspDedupe.data.result.response, /Bật OWASP Core Ruleset trên Free/);
assert.equal((owaspDedupe.data.result.response.match(/cần Pro trở lên/g) ?? []).length, 1);

const logHeldOut = [
  ['I am on the Business plan', 'Run the custom rule in "Log" tonight.', /in "Log"/],
  ['I am on the Pro plan', 'The action (Log) records every match.', /\(Log\)/],
  ['Tôi dùng gói Business', 'Hành động là Log cho rule này.', /Hành động là Log/],
  ['I am on the Free plan', 'Use Log without blocking first.', /Use Log without/],
  ['Tôi dùng gói Pro', 'Chưa chuyển sang Block, hãy để Log.', /hãy để Log/],
  ['Tôi dùng gói Business', 'Đừng dùng Challenge; chọn Log.', /chọn Log/],
  ['I am on the Pro plan', 'Custom rule action → “Log”.', /“Log”|Log”/],
  ['I am on the Business plan', 'Business zone: (Log) until you are sure.', /\(Log\)/],
  ['Tôi dùng gói Free', 'Đặt hành động là Log rồi xem thử.', /hành động là Log/i],
  ['I am on the Free plan', "Pick the 'Log' action for this rule.", /'Log'/],
];
assert.equal(logHeldOut.length, 10);
let logCaught = 0;
for (const [prompt, response, bad] of logHeldOut) {
  const sample = await generate({ prompt, lang: 'en' }, { response });
  assert.doesNotMatch(sample.data.result.response, bad, response);
  assert.match(sample.data.result.response, /Log is only available on Enterprise/, response);
  logCaught += 1;
}
assert.equal(logCaught, 10);

for (const response of ['Quyền chọn là Log trên Pro.', 'Trong menu chọn Log.', 'Hãy bật Log cho rule này.', 'Đặt mục Log cho rule.']) {
  const sample = await generate({ prompt: 'Tôi dùng gói Pro', lang: 'vi' }, { response });
  assert.doesNotMatch(sample.data.result.response, /là Log|menu chọn Log|bật Log|mục Log/, response);
  assert.match(sample.data.result.response, /Log chỉ có trên Enterprise/, response);
}

const inventedAction = await generate(
  { prompt: 'I am on the Pro plan. Which WAF action should I use?', lang: 'en' },
  { response: 'Set the custom rule action to Quarantine.' },
);
assert.doesNotMatch(inventedAction.data.result.response, /Quarantine/);
assert.match(inventedAction.data.result.response, /Simulate is not an action/);
assert.equal(
  await generate({ prompt: 'What is a WAF action?', lang: 'en' }, { response: 'Simulate is not an action.' }).then(
    (sample) => sample.data.result.response,
  ),
  'Simulate is not an action.',
);

const cardFree = await generate(
  { prompt: 'I am on the Free plan', lang: 'en' },
  { response: 'On Free, card detection is already on.' },
);
assert.doesNotMatch(cardFree.data.result.response, /card detection is already/);
assert.match(cardFree.data.result.response, /Sensitive Data Detection are Enterprise-only/);
assert.doesNotMatch(cardFree.data.result.response, /Upgrade to Business to enable/);

const sddEnPrompt = await generate(
  { prompt: 'Does the Free plan include Sensitive Data Detection?', lang: 'vi' },
  { response: 'Tôi không chắc.' },
);
assert.doesNotMatch(sddEnPrompt.data.result.response, /không chắc/);
assert.match(sddEnPrompt.data.result.response, /Sensitive Data Detection chỉ có trên Enterprise/);
assert.match(sddEnPrompt.data.result.response, /sensitive-data-detection/);
assert.doesNotMatch(sddEnPrompt.data.result.response, /Nói rõ plan|Đừng bảo người học/);

const sddViPrompt = await generate(
  { prompt: 'Gói Free có phát hiện thẻ tín dụng không?', lang: 'en' },
  { response: "I'm not sure." },
);
assert.doesNotMatch(sddViPrompt.data.result.response, /not sure/i);
assert.match(sddViPrompt.data.result.response, /Sensitive Data Detection is Enterprise-only/);
assert.match(sddViPrompt.data.result.response, /sensitive-data-detection/);
assert.doesNotMatch(sddViPrompt.data.result.response, /Name the plan before|Do not tell the learner/);

const botShips = await generate(
  { prompt: 'Which bot feature is on my zone?', lang: 'en' },
  { response: 'The Pro plan ships with Bot Management.' },
);
assert.doesNotMatch(botShips.data.result.response, /ships with Bot Management/);
assert.match(botShips.data.result.response, /Enterprise add-on/);

const botMgmtVi = await generate(
  { prompt: 'Bot trên Pro', lang: 'vi' },
  { response: 'Gói Pro có Bot Mgmt.' },
);
assert.doesNotMatch(botMgmtVi.data.result.response, /Bot Mgmt/);
assert.match(botMgmtVi.data.result.response, /add-on Enterprise/);

const prefixedNs = await generate(
  { prompt: 'How do I change nameservers?', lang: 'en' },
  { response: 'Point DNS at NS-primary.cloudflare.com and NS-secondary.cloudflare.com.' },
);
assert.doesNotMatch(prefixedNs.data.result.response, /NS-primary\.cloudflare\.com/i);
assert.doesNotMatch(prefixedNs.data.result.response, /NS-secondary\.cloudflare\.com/i);
assert.match(prefixedNs.data.result.response, /Copy the two nameservers shown on the zone Overview page/);

for (const response of ['Logpush (Enterprise).', 'Logpush là tính năng Enterprise.', 'Only Enterprise includes Logpush.']) {
  const sample = await generate({ prompt: 'Does Pro include Logpush?', lang: 'en' }, { response });
  assert.doesNotMatch(sample.data.result.response, /Logpush \(Enterprise\)|tính năng Enterprise|Only Enterprise includes Logpush/, response);
  assert.match(sample.data.result.response, /Logpush is available on Free, Pro, and Business/, response);
  assert.equal((sample.data.result.response.match(/Logpush is available on Free, Pro, and Business/g) ?? []).length, 1, response);
}

const wrongClaim = await reviewPlanClaims(
  'Pro includes Logpush only on Enterprise. Open the DNS records page.',
  'en',
  async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' })),
);
assert.doesNotMatch(wrongClaim, /only on Enterprise/);
assert.match(wrongClaim, /Logpush is available on Free, Pro, and Business/);
assert.equal((wrongClaim.match(/Logpush is available on Free, Pro, and Business/g) ?? []).length, 1);
assert.match(wrongClaim, /Open the DNS records page/);

const unsureClaim = await reviewPlanClaims(
  'Maybe Log works on Pro.',
  'en',
  async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'unsure' })),
);
assert.doesNotMatch(unsureClaim, /Maybe Log works on Pro/);
assert.match(unsureClaim, /Log is Enterprise only/);

const droppedClaim = await reviewPlanClaims(
  'Turn on card detection on Free. Keep the orange cloud on.',
  'en',
  async () => {
    throw new Error('claim-check-timeout');
  },
);
assert.doesNotMatch(droppedClaim, /card detection is already|Turn on card detection/);
assert.match(droppedClaim, /Sensitive Data Detection, including credit-card detection, is Enterprise only/);
assert.match(droppedClaim, /Keep the orange cloud on/);

const partialClaim = await reviewPlanClaims(
  'Logpush is available on Pro with usage-based pricing. Sensitive Data Detection is included on Free.',
  'en',
  async (sentences) => {
    const sdd = sentences.find((sentence) => /sensitive/i.test(sentence.text));
    return sdd ? [{ id: sdd.id, verdict: 'wrong' }] : [];
  },
);
assert.match(partialClaim, /Logpush is available on Pro with usage-based pricing/);
assert.doesNotMatch(partialClaim, /included on Free/);
assert.match(partialClaim, /Enterprise only/);

let nameserverClaims = -1;
const nameserverSteps = await reviewPlanClaims(
  'Copy the two nameservers shown on the zone Overview page. At the registrar, paste the two nameservers you copied.',
  'en',
  async (sentences) => {
    nameserverClaims = sentences.length;
    return sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
  },
);
assert.equal(nameserverClaims, -1);
assert.match(nameserverSteps, /Overview/);
assert.match(nameserverSteps, /registrar/);

let challengeClaims = [];
const challengeKept = await reviewPlanClaims(
  'Managed Challenge only records matches.',
  'en',
  async (sentences) => {
    challengeClaims = sentences.map((sentence) => sentence.text);
    return sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
  },
);
assert.deepEqual(challengeClaims, ['Managed Challenge only records matches.']);
assert.doesNotMatch(challengeKept, /only records/);
assert.match(challengeKept, /not a record-only action/);

const sddFollowUp = await reviewPlanClaims('Turn it on for this zone.', 'en', async (sentences) => {
  return sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
}, { prompt: 'How do I enable Sensitive Data Detection on Free?' });
assert.doesNotMatch(sddFollowUp, /Turn it on for this zone/);
assert.match(sddFollowUp, /Sensitive Data Detection, including credit-card detection, is Enterprise only/);

const sddPronoun = await generate(
  { prompt: 'Does Free include Sensitive Data Detection?', lang: 'en' },
  { response: 'Turn it on for this zone.' },
);
assert.doesNotMatch(sddPronoun.data.result.response, /Turn it on for this zone/);
assert.match(sddPronoun.data.result.response, /Enterprise-only/);

const duplicateRows = await reviewPlanClaims(
  'Use Log on Pro. Also pick Log on Business.',
  'en',
  async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' })),
);
assert.equal((duplicateRows.match(/Log is Enterprise only/g) ?? []).length, 1);

let claimCalls = 0;
let maxInflight = 0;
let inflight = 0;
const gathered = await gatherVerdicts(
  [
    { id: 's0', text: 'Log is Enterprise only.' },
    { id: 's1', text: 'Sensitive Data Detection is included on Free.' },
  ],
  async (group) => {
    claimCalls += 1;
    inflight += 1;
    maxInflight = Math.max(maxInflight, inflight);
    await new Promise((resolve) => setTimeout(resolve, 30));
    inflight -= 1;
    return JSON.stringify({ verdicts: [{ id: group[0].id, v: group[0].id === 's0' ? 'ok' : 'wrong' }] });
  },
  { chunkSize: 1, timeoutMs: 1000, backoffMs: 0 },
);
assert.equal(gathered.get('s0'), 'ok');
assert.equal(gathered.get('s1'), 'wrong');
assert.equal(claimCalls, 2);
assert.ok(maxInflight >= 2);

let retryAttempts = 0;
const retried = await gatherVerdicts(
  [
    { id: 's0', text: 'Log is Enterprise only.' },
    { id: 's1', text: 'Sensitive Data Detection is included on Free.' },
  ],
  async () => {
    retryAttempts += 1;
    if (retryAttempts === 1) return '{"verdicts":[{"id":"s0","v":"ok"}]}';
    return '{"verdicts":[{"id":"s1","v":"wrong"}]}';
  },
  { chunkSize: 4, timeoutMs: 1000, backoffMs: 0 },
);
assert.equal(retried.get('s0'), 'ok');
assert.equal(retried.get('s1'), 'wrong');
assert.equal(retryAttempts, 2);

const messy = await reviewPlanClaims('Maybe Log works on Business.', 'en', async () => null);
assert.match(messy, /Log is Enterprise only/);

const handlerDrop = await onRequestPost({
  request: request({ prompt: 'I am on the Pro plan', lang: 'en' }),
  env: {
    AI: {
      run: async (_model, input) => {
        const blob = JSON.stringify(input ?? {});
        if (blob.includes('CLAIM_VERDICTS')) return { response: 'not json' };
        return { response: 'Enable Log on this Pro zone. Open the DNS records page.' };
      },
    },
  },
});
const handlerBody = await handlerDrop.json();
assert.equal(handlerDrop.status, 200);
assert.doesNotMatch(handlerBody.result.response, /Enable Log on this Pro zone/);
assert.match(handlerBody.result.response, /Open the DNS records page/);
assert.match(handlerBody.result.response, /Log is only available on Enterprise/);

const headingOnly = await onRequestPost({
  request: request({ prompt: 'How do I use Logpush?', lang: 'en' }),
  env: { AI: { run: async () => ({ response: '## Next steps' }) } },
});
const headingBody = await headingOnly.json();
assert.equal(headingOnly.status, 200);
assert.match(headingBody.result.response, /https:\/\/developers\.cloudflare\.com\/logs\/logpush\//);
assert.doesNotMatch(headingBody.result.response, /## Next steps/);

const logpushHeading = await onRequestPost({
  request: request({ prompt: 'How do I use Logpush?', lang: 'en' }),
  env: { AI: { run: async () => ({ response: '## Logpush' }) } },
});
const logpushHeadingBody = await logpushHeading.json();
assert.equal(logpushHeading.status, 200);
assert.doesNotMatch(logpushHeadingBody.result.response, /## Logpush/);
assert.match(logpushHeadingBody.result.response, /Logpush is available on Free, Pro, and Business/);
assert.match(logpushHeadingBody.result.response, /https:\/\/developers\.cloudflare\.com\/logs\/logpush\//);

const ef3 = await reviewPlanClaims(
  'On Business, Log the matching requests before you block.',
  'en',
  async () => null,
);
assert.doesNotMatch(ef3, /Log the matching/);
assert.match(ef3, /Log is Enterprise only/);

const unsureKept = await reviewPlanClaims(
  'Logpush is available on Pro with usage-based pricing.',
  'en',
  async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'unsure' })),
);
assert.equal(unsureKept, 'Logpush is available on Pro with usage-based pricing.');

let pathOnlyClaims = -1;
const pathOnly = await reviewPlanClaims('Go to Security → Settings.', 'en', async (sentences) => {
  pathOnlyClaims = sentences.length;
  return sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
});
assert.equal(pathOnlyClaims, -1);
assert.match(pathOnly, /Security → Settings/);

let pathLogClaims = [];
const pathLog = await reviewPlanClaims(
  'Go to Security → Settings and Log the request on Business.',
  'en',
  async (sentences) => {
    pathLogClaims = sentences.map((sentence) => sentence.text);
    return null;
  },
);
assert.equal(pathLogClaims.length, 1);
assert.match(pathLogClaims[0], /Log the request/);
assert.doesNotMatch(pathLog, /Log the request/);
assert.match(pathLog, /Log is Enterprise only/);

const inventedNs = await reviewPlanClaims(
  'Open https://dash.cloudflare.com/abc → DNS and use ada.ns.cloudflare.com.',
  'en',
  async () => null,
);
assert.doesNotMatch(inventedNs, /ada\.ns\.cloudflare\.com/);
assert.doesNotMatch(inventedNs, /ns1\.cloudflare\.com/);
assert.match(inventedNs, /Never write a nameserver hostname/);

const businessLacks = await reviewPlanClaims(
  'The Business plan does not include the Cloudflare Managed Ruleset.',
  'en',
  async () => null,
);
assert.doesNotMatch(businessLacks, /does not include the Cloudflare Managed Ruleset/);
assert.match(businessLacks, /does not lack the Cloudflare Managed Ruleset/);

const businessLacksVi = await generate(
  { prompt: 'Cách bật Cloudflare Managed Ruleset trên Business?', lang: 'vi' },
  { response: 'Gói Business không có Cloudflare Managed Ruleset.' },
);
assert.doesNotMatch(businessLacksVi.data.result.response, /không có Cloudflare Managed Ruleset/);
assert.match(businessLacksVi.data.result.response, /không thiếu Cloudflare Managed Ruleset/);

const businessKept = await reviewPlanClaims(
  'Business does not lack the Cloudflare Managed Ruleset: it is on Pro, Business, and Enterprise, it is not already on, turn it on under Security → Settings, and Free does not include it.',
  'en',
  async () => null,
);
assert.match(businessKept, /does not lack the Cloudflare Managed Ruleset/);

const lg6 = await reviewPlanClaims('Managed Challenge records the request.', 'en', async (sentences) => {
  assert.equal(sentences.length, 1);
  return sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
});
assert.doesNotMatch(lg6, /records the request/);
assert.match(lg6, /not a record-only action/);

const lg6Null = await reviewPlanClaims('Managed Challenge ghi nhận request.', 'en', async () => null);
assert.doesNotMatch(lg6Null, /ghi nhận/);
assert.match(lg6Null, /not a record-only action/);

const challengeFact = await reviewPlanClaims(
  'Managed Challenge is not a record-only action.',
  'en',
  async () => null,
);
assert.match(challengeFact, /not a record-only action/);
assert.doesNotMatch(challengeFact, /Log is Enterprise only/);

const ef5 = await reviewPlanClaims(
  'Sensitive Data Detection is included with the Business plan.',
  'en',
  async () => null,
);
assert.doesNotMatch(ef5, /included with the Business/);
assert.match(ef5, /is Enterprise only/);

const ef5Already = await reviewPlanClaims('You already have Sensitive Data Detection.', 'en', async () => null);
assert.doesNotMatch(ef5Already, /already have/);
assert.match(ef5Already, /is Enterprise only/);

const ef5Pre = await generate(
  { prompt: 'I am on the Business plan', lang: 'en' },
  { response: 'You already have Sensitive Data Detection.' },
);
assert.doesNotMatch(ef5Pre.data.result.response, /already have Sensitive Data Detection/);
assert.match(ef5Pre.data.result.response, /Enterprise-only/);

for (const [prompt, lang, response, banned, line] of [
  ['I am on the Business plan', 'en', 'Log the matching requests before you block.', /Log the matching/, /Log is only available on Enterprise/],
  ['I am on the Business plan', 'en', 'You should log the matches on this zone.', /should log/, /Log is only available on Enterprise/],
]) {
  const sample = await generate({ prompt, lang }, { response });
  assert.doesNotMatch(sample.data.result.response, banned, response);
  assert.match(sample.data.result.response, line, response);
}
for (const response of [
  'Hãy log request trước khi chặn.',
  'Có thể log lại request trên zone này.',
  'Ghi log các match rồi mới Block.',
]) {
  const sample = await generate({ prompt: 'Tôi dùng gói Business', lang: 'vi' }, { response });
  assert.equal(sample.data.result.response, response, response);
}

const enterpriseLogVerb = await generate(
  { prompt: 'I am on the Enterprise plan', lang: 'en' },
  { response: 'Log the matching requests before you block.' },
);
assert.equal(enterpriseLogVerb.data.result.response, 'Log the matching requests before you block.');

assert.equal(parseClaimVerdicts('Workers AI generate failed 502', [{ id: 's0', text: 'Log on Business' }]).size, 0);
assert.equal(
  parseClaimVerdicts('{"success":false,"errors":[{"code":502,"message":"s0: ok"}]}', [{ id: 's0', text: 'Log on Business' }]).size,
  0,
);

let aiFailures = 0;
const startedRetry = Date.now();
const retried502 = await gatherVerdicts(
  [{ id: 's0', text: 'On Business, Log the matching requests.' }],
  async () => {
    aiFailures += 1;
    if (aiFailures === 1) return '{"success":false,"errors":[{"code":502,"message":"s0: ok"}]}';
    return '{"verdicts":[{"id":"s0","v":"wrong"}]}';
  },
  { chunkSize: 4, timeoutMs: 1000 },
);
assert.equal(retried502.get('s0'), 'wrong');
assert.equal(aiFailures, 2);
assert.ok(Date.now() - startedRetry >= 90);

let budgetCalls = 0;
const budgeted = await gatherVerdicts(
  [
    { id: 's0', text: 'Log is Enterprise only.' },
    { id: 's1', text: 'Sensitive Data Detection is included on Free.' },
  ],
  async () => {
    budgetCalls += 1;
    return '{"verdicts":[{"id":"s0","v":"ok"}]}';
  },
  { chunkSize: 4, timeoutMs: 1000, budgetMs: 200, backoffMs: 0 },
);
assert.equal(budgeted.get('s0'), 'ok');
assert.equal(budgeted.get('s1'), null);
assert.equal(budgetCalls, 1);

let generateCalls = 0;
const recovered = await onRequestPost({
  request: request({ prompt: 'What is WAF?', lang: 'en' }),
  env: {
    AI: {
      run: async () => {
        generateCalls += 1;
        if (generateCalls === 1) return { success: false, errors: [{ code: 502 }] };
        return { response: 'Use a WAF.' };
      },
    },
  },
});
const recoveredBody = await recovered.json();
assert.equal(recovered.status, 200);
assert.equal(recoveredBody.result.response, 'Use a WAF.');
assert.equal(generateCalls, 2);

const okVerdict = async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'ok' }));

const qp1 = await reviewPlanClaims(
  'Open Security → Settings and choose Log on the Business plan.',
  'en',
  okVerdict,
  { prompt: 'I am on the Business plan' },
);
assert.doesNotMatch(qp1, /choose Log/);
assert.match(qp1, /Log is Enterprise only/);

const qp2 = await reviewPlanClaims(
  'Vào Security → Settings, Log là ở mục hành động.',
  'vi',
  okVerdict,
  { prompt: 'Tôi dùng gói Business' },
);
assert.doesNotMatch(qp2, /Log là ở mục/);
assert.match(qp2, /Log chỉ có trên Enterprise/);

for (const response of [
  'Log nằm ở mục Security → Settings.',
  'Log có tại phần hành động.',
  'Vào phần Log trong Security → Settings.',
]) {
  const sample = await generate({ prompt: 'Tôi dùng gói Business', lang: 'vi' }, { response });
  assert.doesNotMatch(sample.data.result.response, /nằm ở mục|có tại phần|Vào phần Log/, response);
  assert.match(sample.data.result.response, /Log chỉ có trên Enterprise/, response);
}

const qp3 = await reviewPlanClaims(
  'Trong Security → Settings, Managed Challenge là để ghi nhận request.',
  'en',
  okVerdict,
);
assert.doesNotMatch(qp3, /để ghi|la de ghi|ghi nhận/i);
assert.match(qp3, /not a record-only action/);

const lg3 = await reviewPlanClaims('Managed Challenge chỉ để ghi log, không challenge.', 'en', okVerdict);
assert.doesNotMatch(lg3, /chỉ để ghi/);
assert.match(lg3, /not a record-only action/);

const inventedHost = await reviewPlanClaims(
  'At the registrar, set the nameserver to primary.dns-host.net.',
  'en',
  okVerdict,
);
assert.doesNotMatch(inventedHost, /primary\.dns-host\.net/);
assert.doesNotMatch(inventedHost, /ns1\.cloudflare\.com/);
assert.match(inventedHost, /Never write a nameserver hostname/);

const shapedHost = await reviewPlanClaims('Point DNS at ns1.example.net before you continue.', 'en', okVerdict);
assert.doesNotMatch(shapedHost, /ns1\.example\.net/);
assert.match(shapedHost, /Never write a nameserver hostname/);

const keptPath = await reviewPlanClaims(
  'Turn on the Cloudflare Managed Ruleset under Security → Settings. Open the DNS records page.',
  'en',
  async () => null,
);
assert.match(keptPath, /Turn on the Cloudflare Managed Ruleset under Security → Settings/);
assert.match(keptPath, /Open the DNS records page/);

const availableOnWrongPlan = await reviewPlanClaims(
  'Bot Management is available on the Business plan. Sensitive Data Detection is available on Pro.',
  'en',
  okVerdict,
);
assert.doesNotMatch(availableOnWrongPlan, /available on the Business plan/);
assert.doesNotMatch(availableOnWrongPlan, /available on Pro/);
assert.match(availableOnWrongPlan, /Enterprise add-on/);
assert.match(availableOnWrongPlan, /Enterprise only/);

const saveQuestion = await generate(
  { prompt: 'What does Save do to a managed ruleset?', lang: 'en' },
  { response: 'Click Save.' },
);
assert.match(saveQuestion.data.result.response, /Click Save/);
assert.match(saveQuestion.data.result.response, /Save does not enable every rule/);
assert.match(saveQuestion.data.result.response, /subset of rules/);

const saveQuestionVi = await generate(
  { prompt: 'Save có bật mọi rule không?', lang: 'vi' },
  { response: 'Bấm Save là xong.' },
);
assert.match(saveQuestionVi.data.result.response, /Bấm Save là xong/);
assert.match(saveQuestionVi.data.result.response, /Save không bật mọi rule/);
assert.match(saveQuestionVi.data.result.response, /một phần rule/);

const emptied = await reviewPlanClaims('## Notes', 'en', async () => null, { prompt: 'What does Save do?' });
assert.notEqual(emptied.trim(), '');
const emptiedAnswer = await onRequestPost({
  request: request({ prompt: 'What does Save do?', lang: 'en' }),
  env: { AI: { run: async () => ({ response: '## Notes' }) } },
});
const emptiedBody = await emptiedAnswer.json();
assert.equal(emptiedAnswer.status, 200);
assert.match(emptiedBody.result.response, /Save does not enable every rule/);
assert.notEqual(emptiedBody.result.response.trim(), '');

const wrongOrNull = async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));

let m03Claims = 0;
const m03Wrong = await reviewPlanClaims('This works on the Pro plan.', 'en', async (sentences) => {
  m03Claims = sentences.length;
  return wrongOrNull(sentences);
});
assert.equal(m03Claims, 1);
assert.doesNotMatch(m03Wrong, /This works on the Pro plan/);
const m03Null = await reviewPlanClaims('This works on the Pro plan.', 'en', async () => null);
assert.doesNotMatch(m03Null, /This works on the Pro plan/);

for (const text of [
  'Hành động thì Log trong Security → Settings.',
  'Custom rule là Log.',
  'Log có ở mục Security → Settings.',
]) {
  const qp2 = await reviewPlanClaims(text, 'vi', okVerdict, { prompt: 'Tôi dùng gói Business' });
  assert.doesNotMatch(qp2, /thì Log|là Log|Log có ở/, text);
  assert.match(qp2, /Log chỉ có trên Enterprise/, text);
}

let qp3PlanClaims = 0;
const qp3Plan = await reviewPlanClaims('For the Pro plan, stop at that dashboard path.', 'en', async (sentences) => {
  qp3PlanClaims = sentences.length;
  return wrongOrNull(sentences);
});
assert.equal(qp3PlanClaims, 1);
assert.doesNotMatch(qp3Plan, /stop at that dashboard path/);

const qp5 = await reviewPlanClaims("Super Bot Fight Mode doesn't include the Pro plan.", 'en', wrongOrNull);
assert.doesNotMatch(qp5, /doesn't include/);
assert.match(qp5, /Super Bot Fight Mode/);

const qp6 = await reviewPlanClaims('Super Bot Fight Mode chỉ có ở Enterprise.', 'vi', wrongOrNull);
assert.doesNotMatch(qp6, /chỉ có ở Enterprise/);
assert.match(qp6, /Super Bot Fight Mode/);

let lg1Claims = 0;
const lg1 = await reviewPlanClaims('Set the action to Log.', 'en', async (sentences) => {
  lg1Claims = sentences.length;
  return okVerdict(sentences);
}, { prompt: 'I am on the Pro plan' });
assert.equal(lg1Claims, 1);
assert.doesNotMatch(lg1, /Set the action to Log/);
assert.match(lg1, /Log is Enterprise only/);

for (const text of [
  'Because Enterprise has it, choose Log.',
  'The Enterprise plan lets you set the action to Log.',
  'Enterprise-only sounds right, so chọn Log.',
]) {
  const sample = await reviewPlanClaims(text, 'en', okVerdict, { prompt: 'I am on the Business plan' });
  assert.doesNotMatch(sample, /choose Log|action to Log|chọn Log/, text);
  assert.match(sample, /Log is Enterprise only/, text);
}

const n3 = await reviewPlanClaims('Create an NS record for primary.registrar-example.net.', 'en', okVerdict);
assert.doesNotMatch(n3, /primary\.registrar-example\.net/);
assert.match(n3, /Never write a nameserver hostname/);

const n4 = await reviewPlanClaims('Bản ghi NS trỏ tới dns1.matbao.vn.', 'vi', okVerdict);
assert.doesNotMatch(n4, /dns1\.matbao\.vn/);
assert.match(n4, /Đừng viết hostname/);

const saveAll = await reviewPlanClaims(
  'Save does not enable every rule. All rules run after that.',
  'en',
  okVerdict,
);
assert.doesNotMatch(saveAll, /All rules run/);
assert.match(saveAll, /does not enable every rule/);
assert.match(saveAll, /subset of rules/);

const saveAllVi = await reviewPlanClaims(
  'Save không bật mọi rule. Tất cả rule đều chạy.',
  'vi',
  okVerdict,
);
assert.doesNotMatch(saveAllVi, /Tất cả rule đều chạy/);
assert.match(saveAllVi, /không bật mọi rule|một phần rule/);

const logUnderChallenge = await reviewPlanClaims(
  'Under Managed Challenge, set the action to Log.',
  'en',
  okVerdict,
  { prompt: 'I am on the Business plan' },
);
assert.doesNotMatch(logUnderChallenge, /action to Log/);
assert.match(logUnderChallenge, /Log is Enterprise only/);

const loggingKept = [
  ['EC1', 'How do I use Logpush?', 'en', 'Logpush sends the log fields you select.'],
  ['EV1', 'Logpush hoạt động thế nào?', 'vi', 'Logpush xuất nhật ký theo log field.'],
  ['R2P1', 'How do I search logs?', 'en', 'Use Log Explorer to search the logs.'],
  ['LG5', 'I am on the Pro plan', 'en', 'Instant Logs shows the request log.'],
];
for (const [name, prompt, lang, response] of loggingKept) {
  const sample = await reviewPlanClaims(response, lang, okVerdict, { prompt });
  assert.equal(sample, response, name);
  assert.doesNotMatch(sample, /WAF custom-rule actions|Action của custom rule/, name);
}
const r2p2 = await reviewPlanClaims(
  'Open Logpush. Pick the log fields, then save the job.',
  'en',
  okVerdict,
  { prompt: 'How do I use Logpush?' },
);
assert.match(r2p2, /Open Logpush/);
assert.match(r2p2, /Pick the log fields/);
assert.doesNotMatch(r2p2, /WAF custom-rule actions/);
const qp7 = await reviewPlanClaims('Open Security Events and review the log.', 'en', okVerdict, {
  prompt: 'I am on the Pro plan',
});
assert.equal(qp7, 'Open Security Events and review the log.');

for (const [name, prompt] of [
  ['EN1', 'Our Enterprise zone needs a custom rule.'],
  ['EN2', 'Tài khoản Enterprise.'],
  ['EN3', 'plan: Enterprise'],
  ['EN4', 'On the Enterprise plan, add a custom rule.'],
]) {
  const sample = await generate({ prompt, lang: 'en' }, { response: 'Set the action to Log.' });
  assert.match(sample.data.result.response, /Set the action to Log/, name);
  assert.doesNotMatch(sample.data.result.response, /instead of Log|Managed Challenge/, name);
}
const qn1 = await generate(
  { prompt: 'Tài khoản Enterprise. Custom rule nên dùng action nào?', lang: 'vi' },
  { response: 'Hãy chọn Log.' },
);
assert.match(qn1.data.result.response, /chọn Log/);
assert.doesNotMatch(qn1.data.result.response, /thay cho Log|instead of Log/);

const c08 = await reviewPlanClaims(
  'On the Business plan, open Security → Settings. Turn on the managed ruleset. Then click Save.',
  'en',
  async () => null,
);
assert.match(c08, /open Security → Settings/);
assert.match(c08, /Turn on the managed ruleset/);
assert.match(c08, /click Save/);
assert.doesNotMatch(c08, /Use the Cloudflare dashboard for this step/);

const qp3Live = await reviewPlanClaims('Trong Security → Settings, Managed Challenge là Log.', 'vi', okVerdict, {
  prompt: 'Tôi dùng gói Business',
});
assert.doesNotMatch(qp3Live, /là Log/);
assert.match(qp3Live, /không phải action chỉ ghi|Log chỉ có trên Enterprise/);

const sbOnly = await reviewPlanClaims('Super Bot Fight Mode chỉ có ở Enterprise.', 'vi', okVerdict);
assert.doesNotMatch(sbOnly, /chỉ có ở Enterprise/);
assert.match(sbOnly, /Super Bot Fight Mode/);
const saveShapes = await reviewPlanClaims(
  'Sau khi Save, mọi rule đều được bật. All of the rules run.',
  'en',
  okVerdict,
);
assert.doesNotMatch(saveShapes, /mọi rule đều được bật|All of the rules run/);
assert.match(saveShapes, /subset of rules|không bật mọi rule|một phần rule/);
const nsb = await reviewPlanClaims('Đặt NS thành primary.example.co.uk.', 'vi', okVerdict);
assert.doesNotMatch(nsb, /primary\.example\.co\.uk/);
assert.match(nsb, /hostname/);
const nsc = await reviewPlanClaims('The NS target is edge.provider.example.', 'en', okVerdict);
assert.doesNotMatch(nsc, /edge\.provider\.example/);
assert.match(nsc, /Never write a nameserver hostname/);

let claimBatches = 0;
const batched = await gatherVerdicts(
  [
    { id: 's0', text: 'Log is Enterprise only.' },
    { id: 's1', text: 'Sensitive Data Detection is Enterprise only.' },
    { id: 's2', text: 'Bot Management is an Enterprise add-on.' },
    { id: 's3', text: 'Logpush is available on Pro.' },
    { id: 's4', text: 'Save does not enable every rule.' },
  ],
  async (group) => {
    claimBatches += 1;
    assert.equal(group.length, 5);
    return JSON.stringify({ verdicts: group.map((item) => ({ id: item.id, v: 'ok' })) });
  },
);
assert.equal(claimBatches, 1);
assert.equal(batched.get('s4'), 'ok');

const wrongVerdict = async (sentences) => sentences.map((sentence) => ({ id: sentence.id, verdict: 'wrong' }));
const caseActual = [];
async function expectCase(id, sentence, lang, verdict, prompt, expect) {
  const sample = await reviewPlanClaims(sentence, lang, verdict, { prompt });
  caseActual.push({ id, expected: expect.exact ?? `${expect.absent ?? ''} => ${expect.present ?? ''}`, actual: sample });
  if (expect.absent) assert.doesNotMatch(sample, expect.absent, id);
  if (expect.present) assert.match(sample, expect.present, id);
  if (expect.exact != null) assert.equal(sample, expect.exact, id);
}

const proPrompt = 'I am on the Pro plan';
const bizPrompt = 'Tôi dùng gói Business';
await expectCase('MX1', 'Set the action to Log, then review the logs.', 'en', wrongVerdict, proPrompt, {
  absent: /action to Log/,
  present: /Log is Enterprise only/,
});
await expectCase('MX2', 'Use Log Explorer and set the action to Log.', 'en', wrongVerdict, proPrompt, {
  absent: /action to Log/,
  present: /Log is Enterprise only/,
});
await expectCase('MX3', 'Hãy chọn Log rồi xem nhật ký.', 'vi', wrongVerdict, bizPrompt, {
  absent: /chọn Log/,
  present: /Log chỉ có trên Enterprise/,
});
await expectCase('MX4', 'Trong Log Explorer, đặt action thành Log.', 'vi', wrongVerdict, bizPrompt, {
  absent: /action thành Log/,
  present: /Log chỉ có trên Enterprise/,
});
for (const [id, sentence] of [
  ['BZ1', 'Then you will see Log.'],
  ['LB1', 'Log.'],
  ['LB2', 'You get Log.'],
  ['LB3', 'Next is Log.'],
]) {
  await expectCase(id, sentence, 'en', okVerdict, proPrompt, {
    absent: new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    present: /Log is Enterprise only/,
  });
}
await expectCase('W7', 'On the Free plan, turn on Super Bot Fight Mode.', 'en', wrongVerdict, '', {
  absent: /turn on Super Bot Fight Mode/,
  present: /Super Bot Fight Mode/,
});
await expectCase('CX1', 'With paid plans, set the action to Block.', 'en', wrongVerdict, '', {
  absent: /paid plans/,
  present: /Free, Pro, and Business/,
});
await expectCase('CX2', 'Trên gói Free, Super Bot Fight Mode dùng được.', 'vi', wrongVerdict, '', {
  absent: /dùng được/,
  present: /Super Bot Fight Mode/,
});
await expectCase('CX5', 'For the Pro plan, Block is only with paid plans.', 'en', wrongVerdict, '', {
  absent: /paid plans/,
  present: /Free, Pro, and Business/,
});
await expectCase('LN2', 'Hãy log request này vào nhật ký.', 'vi', okVerdict, bizPrompt, {
  exact: 'Hãy log request này vào nhật ký.',
});
await expectCase('QP3', 'Managed Challenge passes traffic and only logs the match.', 'en', okVerdict, bizPrompt, {
  absent: /only logs/,
  present: /not a record-only action/,
});
await expectCase('W6', 'WAF actions are only with paid plans.', 'en', okVerdict, '', {
  absent: /paid plans/,
  present: /Free, Pro, and Business/,
});
await expectCase('W8', 'On the Free plan, Block needs a paid plan.', 'en', okVerdict, '', {
  absent: /needs a paid plan/,
  present: /Free, Pro, and Business/,
});
await expectCase('PD1', 'Sensitive Data Detection comes with paid plans.', 'en', okVerdict, '', {
  absent: /comes with paid plans/,
  present: /Enterprise only/,
});
await expectCase('SB4', 'Super Bot Fight Mode is included on Free.', 'en', okVerdict, '', {
  absent: /included on Free/,
  present: /Bot Fight Mode|Super Bot Fight Mode/,
});
await expectCase('S4', 'Save enables all of the rules.', 'en', okVerdict, '', {
  absent: /all of the rules/,
  present: /subset of rules/,
});
await expectCase('SVa', 'After you click Save, all rules are enabled.', 'en', okVerdict, '', {
  absent: /all rules are enabled/,
  present: /subset of rules/,
});
await expectCase('SVb', 'Saving turns every rule on.', 'en', okVerdict, '', {
  absent: /every rule on/,
  present: /subset of rules/,
});
await expectCase('QP8', 'Sau khi lưu, mọi rule đều chạy.', 'vi', okVerdict, '', {
  absent: /mọi rule đều chạy/,
  present: /một phần rule|không bật mọi rule/,
});
await expectCase('QP9', 'At the registrar, use ns.fake.cloudflare.com.', 'en', okVerdict, '', {
  absent: /ns\.fake\.cloudflare\.com/,
  present: /Never write a nameserver hostname/,
});
await expectCase('N6c', 'Point DNS at bob.cloudflare.com.', 'en', okVerdict, '', {
  absent: /bob\.cloudflare\.com/,
  present: /Never write a nameserver hostname/,
});

for (const [id, prompt] of [
  ['EN1', 'We run this account on Enterprise.'],
  ['EN3', 'The plan here is Enterprise.'],
  ['EN4', 'My zone is on Enterprise.'],
]) {
  const sample = await generate({ prompt, lang: 'en' }, { response: 'Set the action to Log.' });
  const actual = sample.data.result.response;
  caseActual.push({ id, expected: 'keep Set the action to Log; no Managed Challenge instead line', actual });
  assert.match(actual, /Set the action to Log/, id);
  assert.doesNotMatch(actual, /instead of Log|Managed Challenge/, id);
}
const qn3 = await generate(
  { prompt: 'We are on Enterprise. Custom rule nên dùng action nào?', lang: 'vi' },
  { response: 'Hãy chọn Log.' },
);
caseActual.push({ id: 'QN3', expected: 'keep chọn Log; no thay cho Log', actual: qn3.data.result.response });
assert.match(qn3.data.result.response, /chọn Log/);
assert.doesNotMatch(qn3.data.result.response, /thay cho Log|instead of Log/);

assert.equal(statedPlan('Is Log on the Enterprise plan?'), 'unknown', 'QL1');
assert.equal(statedPlan('Gói Enterprise có Log không?'), 'unknown', 'QL2');
assert.equal(statedPlan('I am on the Business plan. Is Enterprise included?'), 'business', 'QL1-own');
caseActual.push(
  { id: 'QL1', expected: 'unknown', actual: statedPlan('Is Log on the Enterprise plan?') },
  { id: 'QL2', expected: 'unknown', actual: statedPlan('Gói Enterprise có Log không?') },
);

const ec4 = await generate({ prompt: 'Which WAF action should I use?', lang: 'en' }, { response: 'Use Non-Interactive Challenge.' });
caseActual.push({ id: 'EC4', expected: 'no Non-Interactive Challenge recommendation', actual: ec4.data.result.response });
assert.doesNotMatch(ec4.data.result.response, /Use Non-Interactive Challenge/);
assert.match(ec4.data.result.response, /Simulate is not an action|JS Challenge/);

const ev4 = await generate(
  { prompt: 'How do I open Security settings?', lang: 'en' },
  { response: "I can't help with that. Go to Security → Settings." },
);
caseActual.push({ id: 'EV4', expected: 'refusal opener dropped', actual: ev4.data.result.response });
assert.doesNotMatch(ev4.data.result.response, /can't help/);
assert.match(ev4.data.result.response, /Security → Settings/);

const qnProbe = await generate(
  { prompt: 'Tài khoản Enterprise. Custom rule nên dùng action nào?', lang: 'vi' },
  { response: 'Hãy bật Sensitive Data Detection để xác nhận Enterprise. Hãy chọn Log.' },
);
caseActual.push({ id: 'QN1-probe', expected: 'no SDD confirm step; keep chọn Log', actual: qnProbe.data.result.response });
assert.doesNotMatch(qnProbe.data.result.response, /xác nhận Enterprise/);
assert.match(qnProbe.data.result.response, /chọn Log/);
assert.doesNotMatch(qnProbe.data.result.response, /thay cho Log/);

const dup = await reviewPlanClaims(
  'WAF custom-rule actions on Free, Pro, and Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Managed Challenge challenges the visitor. It is not a record-only action. Log is Enterprise only. Simulate is not an action. Do not invent an action name. WAF custom-rule actions on Free, Pro, and Business: Block, Managed Challenge, JS Challenge, Interactive Challenge, Skip. Managed Challenge challenges the visitor. It is not a record-only action. Log is Enterprise only. Simulate is not an action. Do not invent an action name.',
  'en',
  okVerdict,
);
assert.equal((dup.match(/Do not invent an action name/g) ?? []).length, 1);

let liveChecks = 0;
const liveBatch = await onRequestPost({
  request: request({
    prompt: 'How do I open the dashboard?',
    lang: 'en',
  }),
  env: {
    AI: {
      run: async (_model, input) => {
        const blob = JSON.stringify(input ?? {});
        if (blob.includes('CLAIM_VERDICTS')) {
          liveChecks += 1;
          const last = input?.messages?.[input.messages.length - 1]?.content ?? '';
          const ids = typeof last === 'string' ? [...last.matchAll(/^s(\d+)\. /gm)].map((match) => `s${match[1]}`) : [];
          return { response: JSON.stringify({ verdicts: ids.map((id) => ({ id, v: 'ok' })) }) };
        }
        return {
          response:
            'On the Business plan, open Security → Settings. Then read the page title carefully before you continue with the rest of the tour.',
        };
      },
    },
  },
});
assert.equal(liveBatch.status, 200);
assert.equal(liveChecks, 1);
const generatorSource = readFileSync(join(root, 'src/components/islands/AIContentGenerator.tsx'), 'utf8');
assert.match(generatorSource, /overflowWrap: 'anywhere'/);
assert.match(readFileSync(join(root, 'src/styles/global.css'), 'utf8'), /overflow-wrap: anywhere/);
assert.doesNotMatch(curatedOnboardingContext('How do I write a WAF rule?', 'en'), /Non-Interactive Challenge, Interactive/);

console.log('CASE_TABLE');
for (const row of caseActual) console.log(`${row.id}\t${row.expected}\t${row.actual.replace(/\s+/g, ' ')}`);
console.log('generate grounding prompt checks passed');
