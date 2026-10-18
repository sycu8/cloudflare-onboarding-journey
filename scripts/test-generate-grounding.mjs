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
const { onRequestPost } = await import('../functions/api/generate.ts');

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
  'không chắc',
];

for (const phrase of EN_RULES) {
  assert.ok(generateSystemPrompt('en').includes(phrase), `en prompt missing: ${phrase}`);
}
for (const phrase of VI_RULES) {
  assert.ok(generateSystemPrompt('vi').includes(phrase), `vi prompt missing: ${phrase}`);
}

const enMessages = buildGenerateMessages('How do I enable the WAF on WordPress?', 'en');
assert.equal(enMessages[0].role, 'system');
assert.equal(enMessages[0].content, generateSystemPrompt('en'));
assert.match(enMessages[1].content, /Security → Settings/);
assert.match(enMessages[1].content, /Security → Security rules/);
assert.match(enMessages[1].content, /Free Managed Ruleset/);
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
assert.match(viMessages[1].content, /Pro trở lên/);
assert.match(viMessages[1].content, /Simulate không phải action/);
assert.doesNotMatch(viMessages[1].content, /Security → WAF → Managed rules/);
assert.doesNotMatch(viMessages[1].content, /Log \/ Simulate/);
assert.doesNotMatch(viMessages[1].content, /chặn path nhạy cảm/);
assert.match(viMessages.map((message) => message.content).join('\n'), /đám mây cam \(orange cloud\)/);

const dns = curatedOnboardingContext('đổi nameserver và bản ghi DNS', 'vi');
assert.match(dns, /nameserver/i);
assert.match(dns, /dash\.cloudflare\.com/);

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
assert.match(wafCopy, /Security → Settings/);
assert.match(wafCopy, /Security → Security rules/);
assert.match(wafCopy, /Pro trở lên/);
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

console.log('generate grounding prompt checks passed');
