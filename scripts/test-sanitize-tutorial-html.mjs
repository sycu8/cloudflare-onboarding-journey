import assert from 'node:assert/strict';
import { protectMarkup, restoreMarkup, markupValuesPresent } from './lib/html-placeholders.mjs';
import { sectionOverlayKey } from './lib/tutorial-overlay-key.mjs';
import {
  prepareTutorialHtml,
  restoreEnglishTermsFromSource,
  sanitizeTutorialHtml,
} from '../src/lib/sanitizeTutorialHtml.ts';

const en =
  'The <code class="tutorial-inline-code">action</code> attribute. Select <strong>Save and Deploy</strong>.';
const km =
  'គុណលក្ខណៈ <code class="tutorial-inline-code">សកម្មភាព</code>។ ជ្រើស <strong>រក្សាទុក និងដាក់ឱ្យប្រើប្រាស់</strong>។';
const vi =
  'Thuộc tính <code class="tutorial-inline-code">hành động</code>. Chọn <strong>Lưu và triển khai</strong>.';

const restoredKm = restoreEnglishTermsFromSource(km, en);
assert.match(restoredKm, />action</);
assert.doesNotMatch(restoredKm, /សកម្មភាព/);
assert.match(restoredKm, />Save and Deploy</);

const restoredVi = restoreEnglishTermsFromSource(vi, en);
assert.match(restoredVi, />action</);
assert.doesNotMatch(restoredVi, /hành động/);
assert.match(restoredVi, />Save and Deploy</);

const leaked = 'See <code class="tutorial-inline-code"><form></code> here';
const safe = sanitizeTutorialHtml(leaked);
assert.match(safe, /&lt;form&gt;/);
assert.doesNotMatch(safe, /<code[^>]*><form>/);

const prepared = prepareTutorialHtml(km, en);
assert.ok(prepared?.includes('action'));
assert.ok(prepared?.includes('Save and Deploy'));

const html =
  'Use <code class="tutorial-inline-code">&lt;form&gt;</code> and <a href="https://formspree.io" class="link">Formspree ↗</a>.';
const { text, placeholders } = protectMarkup(html);
assert.doesNotMatch(text, /<code/);
assert.doesNotMatch(text, /<a /);
assert.doesNotMatch(text, /Formspree/);
assert.match(text, /#PH0#/);
const roundtrip = restoreMarkup(text, placeholders);
assert.equal(roundtrip, html);
assert.equal(markupValuesPresent(roundtrip, placeholders), true);

const spaced = restoreMarkup('Use # PH0 # here', [{ key: '#PH0#', value: '<code>x</code>' }]);
assert.match(spaced, /<code>x<\/code>/);
assert.equal(markupValuesPresent(spaced, [{ key: '#PH0#', value: '<code>x</code>' }]), true);

const sections = [{ anchor: 'overview' }, { anchor: 'setup' }, { anchor: 'overview' }];
assert.equal(sectionOverlayKey(sections, 0), 'overview');
assert.equal(sectionOverlayKey(sections, 1), 'setup');
assert.equal(sectionOverlayKey(sections, 2), 'overview#2');

console.log('sanitizeTutorialHtml + overlay key tests passed');
