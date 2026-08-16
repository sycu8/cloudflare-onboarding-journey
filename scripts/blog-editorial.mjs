#!/usr/bin/env node
/**
 * Bi-daily blog editorial helpers (email-centric):
 *   node scripts/blog-editorial.mjs                 → today's assignment
 *   node scripts/blog-editorial.mjs --json
 *   node scripts/blog-editorial.mjs --email-body    → HTML+text payload JSON for sending
 *   node scripts/blog-editorial.mjs --scaffold [--date=YYYY-MM-DD]
 *   node scripts/blog-editorial.mjs --upcoming=14
 *   node scripts/blog-editorial.mjs --prompt [--date=YYYY-MM-DD]
 */
import { createHmac, randomBytes } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { access as accessAsync, mkdir as mkdirAsync, writeFile as writeFileAsync } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const queue = JSON.parse(readFileSync(path.join(root, 'src/data/blogSchedule.data.json'), 'utf8'));

const BLOG_EDITOR_EMAIL = process.env.BLOG_EDITOR_EMAIL || 'sycu.lee@gmail.com';
const BLOG_APPROVE_INBOX = process.env.BLOG_APPROVE_INBOX || 'blog-approve@orangecloud.vn';
const SITE_ORIGIN = (process.env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');

function refreshPublishedFromDisk() {
  const slugs = new Set();
  const dates = new Set();
  for (const f of readdirSync(path.join(root, 'src/data/blogPosts'))) {
    if (!f.endsWith('.ts')) continue;
    const t = readFileSync(path.join(root, 'src/data/blogPosts', f), 'utf8');
    const slug = t.match(/slug:\s*'([^']+)'/)?.[1];
    const date = t.match(/date:\s*'([^']+)'/)?.[1];
    if (slug) slugs.add(slug);
    if (date) dates.add(date);
  }
  return { slugs, dates };
}

const pub = refreshPublishedFromDisk();

function todayInVietnam(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function statusOf(item, today = todayInVietnam()) {
  if (pub.slugs.has(item.slug) || pub.dates.has(item.date)) return 'published';
  if (item.date <= today) return 'due';
  return 'upcoming';
}

function parseArgs(argv) {
  const out = {
    json: false,
    emailBody: false,
    scaffold: false,
    prompt: false,
    date: null,
    upcoming: null,
    signToken: false,
  };
  for (const a of argv) {
    if (a === '--json') out.json = true;
    else if (a === '--email-body') out.emailBody = true;
    else if (a === '--scaffold') out.scaffold = true;
    else if (a === '--prompt') out.prompt = true;
    else if (a === '--sign-token') out.signToken = true;
    else if (a.startsWith('--date=')) out.date = a.slice('--date='.length);
    else if (a.startsWith('--upcoming=')) out.upcoming = Number(a.slice('--upcoming='.length));
  }
  return out;
}

function exportNameFromSlug(slug) {
  const parts = slug.split('-').filter(Boolean);
  const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return `post${pascal}`;
}

function fileStemFromSlug(slug) {
  const parts = slug.split('-');
  if (parts.length <= 5) return slug;
  return parts.slice(0, 5).join('-');
}

function stubFile(item) {
  const exportName = exportNameFromSlug(item.slug);
  const sources = item.sourceHints
    .map((h) => `    {\n      title: '${h.replace(/'/g, "\\'")}',\n      href: '${h}',\n    },`)
    .join('\n');
  const products = JSON.stringify(item.relatedProductSlugs ?? []);
  const track = item.relatedTrack ? `'${item.relatedTrack}'` : 'undefined';

  return `import type { BlogPost } from '../blog';

/** TODO: expand to ≥400 words/lang · FAQ · hub backlinks · rewrite from sourceHints */
export const ${exportName}: BlogPost = {
  slug: '${item.slug}',
  date: '${item.date}',
  topic: '${item.topic}',
  level: '${item.level}',
  readingMinutes: 7,
  title: {
    vi: ${JSON.stringify(item.workingTitle.vi)},
    en: ${JSON.stringify(item.workingTitle.en)},
  },
  description: {
    vi: ${JSON.stringify(item.angle.vi)},
    en: ${JSON.stringify(item.angle.en)},
  },
  excerpt: {
    vi: ${JSON.stringify(item.angle.vi)},
    en: ${JSON.stringify(item.angle.en)},
  },
  keywords: {
    vi: '${item.topic}, Cloudflare, học Cloudflare',
    en: '${item.topic}, Cloudflare, learn Cloudflare',
  },
  sections: [
    {
      heading: {
        vi: 'Giới thiệu',
        en: 'Introduction',
      },
      paragraphs: [
        {
          vi: ${JSON.stringify(`${item.angle.vi} (TODO: mở rộng ≥400 từ tiếng Việt.)`)},
          en: ${JSON.stringify(`${item.angle.en} (TODO: expand to ≥400 English words.)`)},
        },
      ],
    },
  ],
  faq: [
    {
      question: { vi: 'Câu hỏi mẫu?', en: 'Sample question?' },
      answer: { vi: 'TODO', en: 'TODO' },
    },
  ],
  sources: [
${sources}
  ],
  relatedTrack: ${track},
  relatedProductSlugs: ${products},
  relatedPostSlugs: [],
  hubLinks: [
    { href: '/blog/', label: { vi: 'Blog hub', en: 'Blog hub' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: [],
};
`;
}

async function fileExists(p) {
  try {
    await accessAsync(p);
    return true;
  } catch {
    return false;
  }
}

function buildPrompt(item) {
  const sources = item.sourceHints.map((h) => `- ${h}`).join('\n');
  return `# Blog bi-daily ${item.date}: \`${item.slug}\`

## Working title
- VI: ${item.workingTitle.vi}
- EN: ${item.workingTitle.en}

## Level / topic
- Topic: **${item.topic}** · Level: **${item.level}**
- Track: ${item.relatedTrack ?? 'n/a'}

## Angle
- VI: ${item.angle.vi}
- EN: ${item.angle.en}

## Requirements
- Bilingual \`{ vi, en }\` · ≥400 words/lang · FAQ · sources → blog.cloudflare.com · hub backlinks
- Prefer official \`diagramSlugs\`

## Source hints
${sources}

## Scaffold
\`\`\`bash
npm run blog:scaffold -- --date=${item.date}
\`\`\`
`;
}

function signApproveToken(item, secret) {
  const nonce = randomBytes(8).toString('hex');
  const payload = `${item.date}:${item.slug}:${nonce}`;
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function buildEmailPayload(item, token) {
  const approveUrl = `${SITE_ORIGIN}/api/blog-approve?token=${encodeURIComponent(token)}`;
  const subject = `[Blog] Duyệt bài ${item.date}: ${item.slug}`;
  const titleVi = item.workingTitle.vi;
  const titleEn = item.workingTitle.en;
  const text = `Blog bi-daily — cần duyệt

Ngày: ${item.date}
Slug: ${item.slug}
Tiêu đề (VI): ${titleVi}
Title (EN): ${titleEn}
Topic: ${item.topic} · ${item.level}

Góc viết:
${item.angle.vi}

---
CÁCH DUYỆT (chọn 1):
1) Reply email này với đúng một từ: APPROVE
   (Reply-To: ${BLOG_APPROVE_INBOX})
2) Hoặc mở link Approve:
${approveUrl}

Sau khi approve, hệ thống mở PR scaffold → merge để đăng.

Editor: ${BLOG_EDITOR_EMAIL}
`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1e293b;max-width:560px;margin:0 auto;padding:24px">
<p>Xin chào,</p>
<p>Đến lịch viết bài <strong>2 ngày/lần</strong>:</p>
<h2 style="color:#f6821f;margin:16px 0">${escapeHtml(titleVi)}</h2>
<p><em>${escapeHtml(titleEn)}</em></p>
<p><strong>Ngày:</strong> ${item.date}<br/>
<strong>Slug:</strong> <code>${escapeHtml(item.slug)}</code><br/>
<strong>Topic:</strong> ${escapeHtml(item.topic)} · ${escapeHtml(item.level)}</p>
<p>${escapeHtml(item.angle.vi)}</p>
<p style="margin:24px 0">
  <a href="${approveUrl}" style="display:inline-block;background:#f6821f;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Approve → mở PR đăng bài</a>
</p>
<p>Hoặc <strong>reply email này với chữ <code>APPROVE</code></strong> (Reply-To: ${escapeHtml(BLOG_APPROVE_INBOX)}).</p>
<p style="font-size:12px;color:#64748b">Chỉ gửi tới ${escapeHtml(BLOG_EDITOR_EMAIL)}.</p>
</body></html>`;

  return {
    to: BLOG_EDITOR_EMAIL,
    replyTo: BLOG_APPROVE_INBOX,
    subject,
    text,
    html,
    approveUrl,
    item: {
      date: item.date,
      slug: item.slug,
      topic: item.topic,
      level: item.level,
      workingTitle: item.workingTitle,
    },
  };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const today = todayInVietnam();
  const date = args.date || today;
  const item = queue.find((q) => q.date === date);

  if (args.upcoming != null) {
    const list = queue
      .filter((q) => statusOf(q) !== 'published' && q.date >= today)
      .slice(0, args.upcoming);
    if (args.json) {
      console.log(JSON.stringify({ ok: true, today, cadence: 'every-2-days', items: list }, null, 2));
      return;
    }
    console.log(`Upcoming blog slots (every 2 days) from ${today}:`);
    for (const row of list) {
      console.log(`  ${row.date}  ${row.slug}  [${statusOf(row)}]`);
      console.log(`    ${row.workingTitle.en}`);
    }
    return;
  }

  if (!item) {
    const msg = {
      ok: false,
      today,
      date,
      cadence: 'every-2-days',
      error: `No schedule item for ${date} (bi-daily queue — not every calendar day).`,
      editorEmail: BLOG_EDITOR_EMAIL,
    };
    console.log(JSON.stringify(msg, null, 2));
    process.exitCode = args.emailBody ? 0 : 2;
    return;
  }

  const status = statusOf(item);

  if (args.prompt) {
    console.log(buildPrompt(item));
    return;
  }

  if (args.scaffold) {
    if (status === 'published') {
      console.error(`Already published: ${item.slug}`);
      process.exitCode = 1;
      return;
    }
    const dir = path.join(root, 'src/data/blogPosts');
    await mkdirAsync(dir, { recursive: true });
    const stem = fileStemFromSlug(item.slug);
    const filePath = path.join(dir, `${stem}.ts`);
    if (await fileExists(filePath)) {
      console.error(`File already exists: ${filePath}`);
      process.exitCode = 1;
      return;
    }
    await writeFileAsync(filePath, stubFile(item), 'utf8');
    const exportName = exportNameFromSlug(item.slug);
    console.log(`Scaffolded ${filePath}`);
    console.log(`Next: expand content, then add to src/data/blog.ts:`);
    console.log(`  import { ${exportName} } from './blogPosts/${stem}';`);
    return;
  }

  const secret = process.env.BLOG_APPROVE_SECRET || '';
  let token = null;
  if (args.emailBody || args.signToken) {
    if (!secret) {
      console.error('BLOG_APPROVE_SECRET is required to sign approve tokens');
      process.exitCode = 2;
      return;
    }
    token = signApproveToken(item, secret);
  }

  if (args.emailBody) {
    if (status === 'published') {
      console.log(
        JSON.stringify(
          {
            ok: true,
            skip: true,
            reason: 'already_published',
            today,
            status,
            item: { date: item.date, slug: item.slug, workingTitle: item.workingTitle },
          },
          null,
          2,
        ),
      );
      return;
    }
    const payload = buildEmailPayload(item, token);
    console.log(JSON.stringify({ ok: true, skip: false, today, status, token, email: payload }, null, 2));
    return;
  }

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          today,
          date,
          status,
          cadence: 'every-2-days',
          editorEmail: BLOG_EDITOR_EMAIL,
          item,
          token: args.signToken ? token : undefined,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Blog bi-daily — ${date} [${status}]`);
  console.log(`Slug:  ${item.slug}`);
  console.log(`Title: ${item.workingTitle.en}`);
  console.log(`Editor email: ${BLOG_EDITOR_EMAIL}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
