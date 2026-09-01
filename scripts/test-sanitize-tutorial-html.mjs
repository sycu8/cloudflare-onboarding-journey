import assert from 'node:assert/strict';
import {
  prepareTutorialHtml,
  restoreEnglishTermsFromSource,
  sanitizeTutorialHtml,
} from '../src/lib/sanitizeTutorialHtml.ts';

const en =
  'The <code class="tutorial-inline-code">action</code> attribute. Select <strong>Save and Deploy</strong>.';
const km =
  'គុណលក្ខណៈ <code class="tutorial-inline-code">សកម្មភាព</code>។ ជ្រើស <strong>រក្សាទុក និងដាក់ឱ្យប្រើប្រាស់</strong>។';

const restored = restoreEnglishTermsFromSource(km, en);
assert.match(restored, />action</);
assert.doesNotMatch(restored, /សកម្មភាព/);
assert.match(restored, />Save and Deploy</);

const leaked = 'See <code class="tutorial-inline-code"><form></code> here';
const safe = sanitizeTutorialHtml(leaked);
assert.match(safe, /&lt;form&gt;/);
assert.doesNotMatch(safe, /<code[^>]*><form>/);

const prepared = prepareTutorialHtml(km, en);
assert.ok(prepared?.includes('action'));
assert.ok(prepared?.includes('Save and Deploy'));

console.log('sanitizeTutorialHtml tests passed');
