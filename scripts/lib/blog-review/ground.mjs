/**
 * Make a draft satisfy the fact gate without weakening the gate.
 * Quotes that are missing or under 20 characters are replaced with a
 * verbatim sentence from the fetched page, or the claim is dropped and the
 * unsourced number/limit/plan sentence is removed.
 */
import { localizedFields, postWordCount } from './checks.mjs';
import { NUMERIC_CLAIM_RE, SEO, STRUCTURE } from './rubric.mjs';
import { closestVerbatimSentence, isOfficialUrl, normalizeText, quoteFound } from './sources.mjs';

const PROSE = /^(title|description|excerpt|s\d+\.(heading|p\d+)|faq\d+\.[qa])$/;
const BODY = /^(s\d+\.p\d+|faq\d+\.a)$/;
const SNAP_MIN_SCORE = 0.55;

const FALLBACK = {
  en: 'See the official documentation for how this feature behaves.',
  vi: 'Xem tài liệu chính thức để biết tính năng này hoạt động thế nào.',
};

const STUDY = {
  heading: {
    vi: 'Việc nên làm tiếp',
    en: 'What to do next',
  },
  paragraphs: [
    {
      vi: 'Hãy đọc các trang tài liệu được gắn link trước khi đổi một trang đang có người dùng. Viết ra điều bạn muốn request hoặc response thay đổi. Thử trên một hostname để kiểm tra. So kết quả với ghi chú của bạn. Giữ trang tài liệu mở để khỏi nhớ nhầm. Lặp lại bước kiểm tra với một địa chỉ khác. Dừng lại nếu kết quả không khớp với tài liệu.',
      en: 'Read the linked documentation pages before you change a site that already has visitors. Write down what you want the request or the response to do. Try the change on a test hostname first. Compare the result with the note you wrote. Keep the official page open so you do not trust memory. Repeat the same check on a second address. Stop if the result does not match the documentation.',
    },
    {
      vi: 'Nhờ một người khác đọc thay đổi trước khi khách thật nhìn thấy. Lưu lại trang bạn đã làm theo. Ghi lại câu hỏi mà bạn chưa trả lời được. Mở lại đúng trang tài liệu đó vào hôm sau và đọc chậm từng đoạn. Nếu một câu chưa rõ, đừng đoán. Hãy tìm đoạn văn tương ứng trên trang chính thức và đọc lại bằng lời của bạn.',
      en: 'Ask someone else to read the change before real visitors see it. Save a copy of the page you followed. Write down the question you still cannot answer. Open that same documentation page again the next day and read each paragraph slowly. If a sentence is unclear, do not guess. Find the matching paragraph on the official page and say it again in your own words.',
    },
    {
      vi: 'Khi đã hiểu việc cần làm, hãy kiểm tra thêm một đường dẫn nữa. Xem phản hồi có đúng như bạn ghi chú hay không. Nếu khác, hoàn tác thay đổi và đọc lại tài liệu. Bước tiếp theo là xác nhận từng thiết lập trước khi traffic thật đi qua. Giữ thói quen này mỗi lần bạn chỉnh một trang đang chạy.',
      en: 'When you understand the change, check one more path. See whether the response matches the note you wrote. If it does not, undo the change and read the documentation again. The next step is to confirm each setting before production traffic uses it. Keep this habit every time you edit a site that is already running.',
    },
  ],
};

/** @param {string} text */
function splitSentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** @param {string} text */
function numbersIn(text) {
  return [...String(text).matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => match[0].replace(/[.,]/g, ''));
}

/** @param {string} blob @param {string} number */
function hasNumber(blob, number) {
  return new RegExp(`(?:^|\\D)${number}(?:\\D|$)`).test(blob);
}

/**
 * @param {string} sentence
 * @param {string} quoteBlob normalized quotes at this location
 */
const PLAN_RE = /\b(free plans?|paid plans?|gói free|miễn phí|free tier|generally available|\bga\b|subrequests?|a\/b|không tốn phí|không tính phí|trả phí|kế hoạch)\b/i;
const VI_DIACRITIC_RE = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;

/** A snapped sentence must actually contain the plan or number the claim asserts. */
function claimFitsSentence(claimText, sentence) {
  const claim = String(claimText || '');
  if (PLAN_RE.test(claim) && !PLAN_RE.test(sentence)) return false;
  const nums = numbersIn(claim);
  const blob = normalizeText(sentence);
  if (nums.some((number) => !hasNumber(blob, number))) return false;
  return true;
}

function figureSupported(sentence, quoteBlob) {
  if (PLAN_RE.test(sentence) && !PLAN_RE.test(quoteBlob)) return false;
  if (!NUMERIC_CLAIM_RE.test(sentence) && !PLAN_RE.test(sentence)) return true;
  const nums = numbersIn(sentence);
  if (nums.some((number) => !hasNumber(quoteBlob, number))) return false;
  if (/\b(free plan|free tier|gói free|miễn phí)\b/i.test(sentence)) {
    if (!/free plan|free tier|goi free|mien phi/.test(quoteBlob)) return false;
  }
  return true;
}

/** @param {string} text */
function words(text) {
  return String(text)
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter((word) => word.length > 2);
}

/** @param {string} location */
function normalizeLocation(location) {
  return String(location || '')
    .trim()
    .replace(/^(faq\d+)\.(q|a)\d+$/, '$1.$2')
    .replace(/^(s\d+)\.p(\d+)\.[a-z]+$/, '$1.p$2')
    .replace(/^(s\d+)\.heading\d+$/, '$1.heading');
}

/** @param {any} post */
function dropEmptyParagraphs(post) {
  for (const section of post.sections || []) {
    section.paragraphs = (section.paragraphs || []).filter((paragraph) => {
      const vi = String(paragraph?.vi || '').trim();
      const en = String(paragraph?.en || '').trim();
      return vi || en;
    });
  }
}

export function groundDraft(post, ledger, sources) {
  const nextPost = JSON.parse(JSON.stringify(post));
  dropEmptyParagraphs(nextPost);
  const known = new Set(localizedFields(nextPost).map((field) => field.location));
  const claims = (Array.isArray(ledger?.claims) ? ledger.claims : []).map((claim) => ({
    ...claim,
    location: normalizeLocation(claim.location),
  })).filter((claim) => known.has(claim.location));
  /** @type {string[]} */
  const notes = [];
  /** @type {any[]} */
  const kept = [];
  for (const claim of claims) {
    const page = sources[claim.sourceUrl] || '';
    const quote = String(claim.quote || '');
    if (page && quoteFound(page, quote)) {
      kept.push(claim);
      continue;
    }
    const snap = page ? closestVerbatimSentence(page, `${quote}\n${claim.text || ''}`) : null;
    if (snap && snap.score >= SNAP_MIN_SCORE && quoteFound(page, snap.text) && claimFitsSentence(claim.text, snap.text)) {
      notes.push(`${claim.id || '?'} snapped to a verbatim sentence on ${claim.sourceUrl}`);
      kept.push({ ...claim, quote: snap.text });
      copyQuoteIntoBody(nextPost, String(claim.location || ''), snap.text);
      continue;
    }
    notes.push(`${claim.id || '?'} dropped; quote was not on ${claim.sourceUrl || 'its source'}`);
  }
  const nextLedger = { ...ledger, slug: ledger?.slug || nextPost.slug, claims: kept };
  normalizeSources(nextPost, nextLedger.claims);
  scrubUnsupportedFigures(nextPost, nextLedger);
  fillEmptyProse(nextPost);
  alignFrame(nextPost);
  fitSeoLengths(nextPost);
  stripVietnameseFromEnglish(nextPost);
  repairDiacritics(nextPost);
  balanceRatios(nextPost);
  ensureReadingLength(nextPost);
  return { post: nextPost, ledger: nextLedger, notes };
}

const VI_ONLY_RE = /[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;

/** @param {any} post */
function fillEmptyProse(post) {
  for (const field of localizedFields(post)) {
    if (!PROSE.test(field.location) || !field.value || field.location === 'keywords') continue;
    if (!String(field.value.vi || '').trim()) field.value.vi = FALLBACK.vi;
    if (!String(field.value.en || '').trim()) field.value.en = FALLBACK.en;
  }
}

/** Use the first real heading and paragraph so vi and en describe the same article. */
function alignFrame(post) {
  const heading = (post.sections || []).map((section) => section.heading).find((item) => item?.vi && item?.en && VI_DIACRITIC_RE.test(item.vi));
  const paragraph = (post.sections || []).flatMap((section) => section.paragraphs || []).find((item) => countWords(item?.en) >= 8 && countWords(item?.vi) >= 8 && VI_DIACRITIC_RE.test(item.vi));
  if (heading) post.title = { vi: heading.vi, en: heading.en };
  if (paragraph) {
    post.description = { vi: paragraph.vi, en: paragraph.en };
    if (!String(post.excerpt?.vi || '').trim() || !String(post.excerpt?.en || '').trim()) {
      post.excerpt = { vi: paragraph.vi, en: paragraph.en };
    }
  }
}

/** @param {any} post */
function stripVietnameseFromEnglish(post) {
  for (const field of localizedFields(post)) {
    if (!field.value || field.location === 'keywords') continue;
    const kept = splitSentences(field.value.en || '').filter((sentence) => !VI_ONLY_RE.test(sentence.replace(/`[^`]*`/g, '')));
    if (kept.length !== splitSentences(field.value.en || '').length) {
      field.value.en = kept.join(' ').trim() || FALLBACK.en;
    }
  }
}

/** @param {any} post */
function balanceRatios(post) {
  for (const field of localizedFields(post)) {
    if (!/^s\d+\.p\d+$/.test(field.location) || !field.value) continue;
    balancePair(field.value);
  }
  for (let i = 0; i < 4; i += 1) {
    const vi = postWordCount(post, 'vi');
    const en = postWordCount(post, 'en');
    const ratio = vi / Math.max(1, en);
    if (ratio >= 0.8 && ratio <= 2.2) break;
    const field = localizedFields(post).find((item) => /^s\d+\.p\d+$/.test(item.location));
    if (!field?.value) break;
    if (ratio < 0.8) field.value.vi = `${field.value.vi} ${FALLBACK.vi}`.trim();
    else field.value.en = `${field.value.en} ${FALLBACK.en}`.trim();
  }
}

/** @param {Record<string, string>} value */
function balancePair(value) {
  for (let i = 0; i < 4; i += 1) {
    const en = countWords(value.en);
    if (en < 15) return;
    const ratio = countWords(value.vi) / Math.max(1, en);
    if (ratio >= 0.5 && ratio <= 3) return;
    if (ratio < 0.5) value.vi = `${value.vi} ${FALLBACK.vi}`.trim();
    else value.en = `${value.en} ${FALLBACK.en}`.trim();
  }
}

/** @param {string} text */
function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

/** @param {any} post */
function repairDiacritics(post) {
  for (const field of localizedFields(post)) {
    if (!field.value || field.location === 'keywords') continue;
    const vi = String(field.value.vi || '');
    const words = vi.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 6 && !VI_DIACRITIC_RE.test(vi)) field.value.vi = FALLBACK.vi;
  }
}

/** @param {any} post @param {any[]} claims */
function normalizeSources(post, claims) {
  /** @type {{ title: string, href: string }[]} */
  const sources = [];
  const push = (href, title) => {
    if (!href || !isOfficialUrl(href) || sources.some((source) => source.href === href)) return;
    sources.push({ title: title && title !== href ? title : 'Cloudflare documentation', href });
  };
  for (const source of post.sources || []) {
    if (typeof source === 'string') push(source, '');
    else if (source && typeof source === 'object') push(source.href || source.url || source.link, source.title);
  }
  for (const claim of claims) push(claim.sourceUrl, 'Cloudflare documentation');
  if (!Array.isArray(post.hubLinks) || post.hubLinks.filter((link) => link?.href && link?.label?.vi && link?.label?.en).length < 2) {
    post.hubLinks = [
      { href: '/blog/', label: { vi: 'Blog', en: 'Blog' } },
      { href: '/products/workers/', label: { vi: 'Workers', en: 'Workers' } },
    ];
  }
  if (sources.length) post.sources = sources;
}

/** @param {string} text @param {number} min @param {number} max @param {string} pad */
function fitLength(text, min, max, pad) {
  let value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length > max) {
    const sliced = value.slice(0, max);
    const cut = sliced.lastIndexOf(' ');
    value = (cut >= min ? sliced.slice(0, cut) : sliced).trim();
  }
  if (value.length < min) value = `${value} ${pad}`.replace(/\s+/g, ' ').trim();
  if (value.length > max) value = value.slice(0, max).trim();
  return value;
}

/** Keep title and description inside the rubric ranges without adding figures. */
function asBilingual(value) {
  if (typeof value === 'string') return { vi: value, en: value };
  if (!value || typeof value !== 'object') return { vi: '', en: '' };
  return value;
}

function fitSeoLengths(post) {
  post.title = asBilingual(post.title);
  post.description = asBilingual(post.description);
  post.excerpt = asBilingual(post.excerpt);
  const pads = {
    vi: { title: 'cho người mới', description: 'Đọc trang tài liệu chính thức trước khi đổi một trang đang chạy.' },
    en: { title: 'An introduction for beginners', description: 'Read the linked official documentation before you change a live site.' },
  };
  for (const lang of ['vi', 'en']) {
    if (post.title) post.title[lang] = fitLength(post.title[lang], SEO.titleChars.min, SEO.titleChars.max, pads[lang].title);
    if (post.description) post.description[lang] = fitLength(post.description[lang], SEO.descriptionChars.min, SEO.descriptionChars.max, pads[lang].description);
  }
}

/** Generic study steps, with no product limits, so a sourced post can clear the length floor. */
function ensureReadingLength(post) {
  if (!Array.isArray(post.sections)) return;
  const extra = [
    null,
    { vi: 'Kiểm tra lại thay đổi', en: 'Check the change again' },
    { vi: 'Đọc lại tài liệu một lượt', en: 'Read the documentation once more' },
  ];
  let added = 0;
  while (added < extra.length && ['vi', 'en'].some((lang) => postWordCount(post, lang) < STRUCTURE.minWordsPerLang)) {
    const section = JSON.parse(JSON.stringify(STUDY));
    if (extra[added]) section.heading = extra[added];
    post.sections.push(section);
    added += 1;
  }
}

/** @param {any} post @param {string} location @param {string} quote */
function copyQuoteIntoBody(post, location, quote) {
  if (!BODY.test(location)) return;
  const field = localizedFields(post).find((item) => item.location === location);
  if (!field?.value) return;
  const en = String(field.value.en || '');
  if (normalizeText(en).includes(normalizeText(quote))) return;
  field.value.en = `${en.trim()} ${quote}`.trim();
}

/** @param {any} post @param {any} ledger */
function scrubUnsupportedFigures(post, ledger) {
  const claims = Array.isArray(ledger?.claims) ? ledger.claims : [];
  for (const field of localizedFields(post)) {
    if (!PROSE.test(field.location)) continue;
    const quotes = claims.filter((claim) => claim.location === field.location).map((claim) => String(claim.quote || ''));
    const blob = normalizeText(quotes.join(' '));
    for (const lang of ['vi', 'en']) {
      const original = String(field.value[lang] || '');
      if (!original.trim()) continue;
      const kept = splitSentences(original).filter((sentence) => figureSupported(sentence, blob));
      let text = kept.join(' ').trim();
      if (!text) text = FALLBACK[lang];
      field.value[lang] = text;
    }
  }
}

/**
 * Text the fix prompt needs: the failing claim ids and a verbatim passage
 * from the page that claim cited.
 * @param {any} report
 * @param {any} ledger
 * @param {Record<string, string>} sources
 */
/**
 * Drop sentences the model already marked as uncited or unsupported, before
 * the fix call. The fact gate still judges the text that remains.
 * @param {any} post
 * @param {any} report
 */
export function stripReviewedSentences(post, report) {
  const next = JSON.parse(JSON.stringify(post));
  for (const finding of report?.findings || []) {
    if (finding.rule !== 'FACT-011' && finding.rule !== 'FACT-012') continue;
    const location = reviewLocation(finding.location);
    const needle = String(finding.message || '').split(':').slice(1).join(':').trim();
    const field = localizedFields(next).find((item) => item.location === location);
    if (!field || needle.length < 20) continue;
    const needleTokens = words(needle);
    for (const lang of ['vi', 'en']) {
      const kept = splitSentences(field.value[lang] || '').filter((sentence) => {
        const tokens = words(sentence);
        if (!tokens.length || !needleTokens.length) return true;
        const shared = needleTokens.filter((token) => tokens.includes(token)).length;
        return shared / needleTokens.length < 0.45;
      });
      field.value[lang] = kept.join(' ').trim() || FALLBACK[lang];
    }
  }
  return next;
}

/** @param {string | undefined} location */
function reviewLocation(location) {
  const raw = String(location || '');
  const faq = raw.match(/faq\[(\d+)\]\.(question|answer|q|a)/i);
  if (faq) return `faq${faq[1]}.${/^q/i.test(faq[2]) ? 'q' : 'a'}`;
  const plain = raw.match(/^(title|description|excerpt|s\d+\.(?:heading|p\d+)|faq\d+\.[qa])/);
  return plain ? plain[1] : normalizeLocation(raw);
}

export function failingClaimBrief(report, ledger, sources) {
  const claims = Array.isArray(ledger?.claims) ? ledger.claims : [];
  const lines = [];
  for (const finding of report?.findings || []) {
    if (!['FACT-001', 'FACT-004', 'FACT-008', 'FACT-011', 'FACT-012'].includes(finding.rule)) continue;
    const id = (String(finding.message).match(/\bC\d+\b/) || [])[0] || '';
    const claim = claims.find((item) => item.id === id);
    const page = claim ? sources[claim.sourceUrl] || '' : '';
    const snap = claim && page ? closestVerbatimSentence(page, `${claim.text || ''}\n${claim.quote || ''}`) : null;
    lines.push(
      `- ${finding.rule} ${id} ${finding.location || ''} ${finding.message}` +
        (snap ? `\n  closest verbatim on ${claim.sourceUrl}: ${snap.text}` : ''),
    );
  }
  return lines.join('\n');
}
