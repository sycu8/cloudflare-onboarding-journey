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
const { guardGenerateResult, onRequestPost, rewriteInventedNameservers, statedPlan } = await import(
  '../functions/api/generate.ts'
);

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
assert.doesNotMatch(dns, /ns1\.cloudflare\.com/i);
assert.doesNotMatch(dns, /<tên>\.ns\.cloudflare\.com/);
assert.doesNotMatch(dns, /<name>\.ns\.cloudflare\.com/);
assert.doesNotMatch(dns, /DNS map/);
assert.doesNotMatch(dns, /\*\.ns\.cloudflare\.com/);
const dnsEn = curatedOnboardingContext('change nameservers at the registrar', 'en');
assert.equal((dnsEn.match(/change nameservers once/g) ?? []).length, 1);

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
    env: { AI: { run: async () => response } },
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

console.log('generate grounding prompt checks passed');
