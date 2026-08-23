/**
 * Adds notesEn to tutorialPreviews.data.json from notesVi using precise IT terminology.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = join(root, 'src/data/tutorialPreviews.data.json');
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

const EXACT = {
  'Đây là bản tóm tắt trên Orange Cloud Learning Hub — không thay thế tài liệu chính thức.':
    'This is a summary on Orange Cloud Learning Hub — it does not replace the official documentation.',
  'Luôn mở liên kết «Tài liệu gốc» bên dưới khi cần lệnh CLI, snippet code và ảnh minh họa đầy đủ.':
    'Open the Official docs link below for CLI commands, code snippets, and full screenshots.',
  'Docs Cloudflare cập nhật thường xuyên — đối chiếu ngày «Rà soát lần cuối» trên trang gốc khi triển khai production.':
    'Cloudflare docs change frequently — verify the Last reviewed date on the official page before production use.',
  'Cần tài khoản Cloudflare, Wrangler CLI và (thường) hoàn thành hướng dẫn Get started của Workers/Pages.':
    'Requires a Cloudflare account, Wrangler CLI, and (typically) completing the Workers/Pages Get started guide.',
  'Zero Trust thường cần quyền admin trên tenant Cloudflare One và IdP đã kết nối.':
    'Zero Trust typically requires Cloudflare One tenant admin access and a connected IdP.',
  'Kiểm tra token/API và state backend trước khi chạy trên môi trường production.':
    'Verify API tokens and the state backend before running against production.',
};

function translatePrerequisite(line) {
  const prefix = 'Yêu cầu trước (từ docs):';
  if (!line.startsWith(prefix)) return null;
  let body = line.slice(prefix.length).trim();
  // Remove common Vietnamese fragments mixed into crawled English
  body = body
    .replace(/đã hoàn thành hướng dẫn Get started/gi, 'completed the Get started guide')
    .replace(/Cài đặted/gi, 'Installed')
    .replace(/Một virtual network/gi, 'a virtual network')
    .replace(/\s+/g, ' ')
    .trim();
  return `Prerequisites (from docs): ${body}`;
}

function translateNote(vi) {
  if (EXACT[vi]) return EXACT[vi];
  const prereq = translatePrerequisite(vi);
  if (prereq) return prereq;
  console.warn('Untranslated note:', vi.slice(0, 120));
  return vi;
}

let updated = 0;
for (const preview of Object.values(data)) {
  if (!preview.notesVi?.length) continue;
  preview.notesEn = preview.notesVi.map(translateNote);
  updated++;
}

writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Updated notesEn for ${updated} tutorials`);
