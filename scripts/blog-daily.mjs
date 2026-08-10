#!/usr/bin/env node
/**
 * Daily blog helpers:
 *   node scripts/blog-daily.mjs              → show today's assignment
 *   node scripts/blog-daily.mjs --json       → machine-readable
 *   node scripts/blog-daily.mjs --issue-body → markdown for GitHub issue
 *   node scripts/blog-daily.mjs --scaffold [--date=YYYY-MM-DD]
 *   node scripts/blog-daily.mjs --upcoming=7
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadSchedule() {
  const modPath = pathToFileURL(path.join(root, 'src/data/blogSchedule.ts')).href;
  // Dynamic import via tsx/node — prefer compiled path through tsx when available
  try {
    return await import(modPath);
  } catch {
    // Fallback: spawn note — caller should use `npx tsx scripts/blog-daily.mjs`
    throw new Error('Failed to import blogSchedule.ts — run via: npx tsx scripts/blog-daily.mjs');
  }
}

function parseArgs(argv) {
  const out = { json: false, issueBody: false, scaffold: false, date: null, upcoming: null };
  for (const a of argv) {
    if (a === '--json') out.json = true;
    else if (a === '--issue-body') out.issueBody = true;
    else if (a === '--scaffold') out.scaffold = true;
    else if (a.startsWith('--date=')) out.date = a.slice('--date='.length);
    else if (a.startsWith('--upcoming=')) out.upcoming = Number(a.slice('--upcoming='.length));
  }
  return out;
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
        vi: 'Giới thiệu (viết tiếp…)',
        en: 'Introduction (continue writing…)',
      },
      paragraphs: [
        {
          vi: 'TODO: viết ≥400 từ tiếng Việt — giải thích cho non-tech, có ví dụ đời thường.',
          en: 'TODO: write ≥400 English words — plain language, everyday examples.',
        },
      ],
    },
  ],
  faq: [
    {
      question: { vi: 'Câu hỏi 1?', en: 'Question 1?' },
      answer: { vi: 'TODO trả lời.', en: 'TODO answer.' },
    },
    {
      question: { vi: 'Câu hỏi 2?', en: 'Question 2?' },
      answer: { vi: 'TODO trả lời.', en: 'TODO answer.' },
    },
    {
      question: { vi: 'Câu hỏi 3?', en: 'Question 3?' },
      answer: { vi: 'TODO trả lời.', en: 'TODO answer.' },
    },
  ],
  sources: [
${sources}
  ],
  relatedTrack: ${track},
  relatedProductSlugs: ${products},
  relatedPostSlugs: [],
  hubLinks: [
    { href: '/blog/', label: { vi: 'Tất cả bài Blog', en: 'All Blog posts' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
};
`;
}

function exportNameFromSlug(slug) {
  const parts = slug.split('-').slice(0, 4);
  const base = parts.map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');
  return `post${base[0].toUpperCase()}${base.slice(1)}`.replace(/[^a-zA-Z0-9_]/g, '');
}

function fileStemFromSlug(slug) {
  return slug.split('-').slice(0, 3).join('-');
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const schedule = await loadSchedule();
  const {
    getTodaysScheduleItem,
    getScheduleItemForDate,
    getUpcomingSchedule,
    getScheduleStatus,
    buildDailyGeneratePrompt,
    todayInVietnam,
    blogCadenceNote,
    getTodayBlogAssignment,
  } = schedule;

  const today = todayInVietnam();
  const item = args.date ? getScheduleItemForDate(args.date) : getTodaysScheduleItem();

  if (args.upcoming != null) {
    const list = getUpcomingSchedule(args.upcoming);
    if (args.json) {
      console.log(JSON.stringify({ today, upcoming: list }, null, 2));
      return;
    }
    console.log(`Upcoming (${list.length}) from ${today}:\n`);
    for (const row of list) {
      console.log(`- ${row.date} [${row.topic}/${row.level}] ${row.slug}`);
      console.log(`  ${row.workingTitle.en}`);
    }
    return;
  }

  if (!item) {
    const assignment = args.date ? null : getTodayBlogAssignment();
    if (assignment?.kind === 'published' && !args.scaffold) {
      const payload = {
        ok: true,
        today,
        status: 'published',
        item: {
          date: assignment.date,
          slug: assignment.slug,
          workingTitle: assignment.title,
        },
        note: 'A post is already published for today.',
      };
      if (args.json) {
        console.log(JSON.stringify(payload, null, 2));
        return;
      }
      if (args.issueBody) {
        console.log(
          `# Blog daily ${today}\n\nAlready published: \`${assignment.slug}\`\n\nNo new generate issue needed.`,
        );
        return;
      }
      console.log(`Blog daily — ${today} (published)`);
      console.log(`Slug:  ${assignment.slug}`);
      console.log(`Title: ${assignment.title.en}`);
      return;
    }

    const msg = {
      ok: false,
      today,
      error: args.date
        ? `No schedule item for ${args.date}. Extend src/data/blogSchedule.ts.`
        : `No schedule item for today (${today}). Extend src/data/blogSchedule.ts.`,
      note: blogCadenceNote.en,
    };
    if (args.json || args.issueBody) {
      console.log(args.json ? JSON.stringify(msg, null, 2) : `# No blog scheduled for ${today}\n\n${msg.error}`);
      process.exitCode = 2;
      return;
    }
    console.error(msg.error);
    process.exitCode = 2;
    return;
  }

  const status = getScheduleStatus(item);

  if (args.issueBody) {
    const body = buildDailyGeneratePrompt(item);
    console.log(body);
    if (status === 'published') {
      console.log('\n\n> Note: this slug/date already appears published in blogPosts — close issue or pick next due item.');
    }
    return;
  }

  if (args.scaffold) {
    if (status === 'published') {
      console.error(`Already published: ${item.slug} (${item.date}). Skipping scaffold.`);
      process.exitCode = 1;
      return;
    }
    const dir = path.join(root, 'src/data/blogPosts');
    await mkdir(dir, { recursive: true });
    const stem = fileStemFromSlug(item.slug);
    const filePath = path.join(dir, `${stem}.ts`);
    if (await fileExists(filePath)) {
      console.error(`File already exists: ${filePath}`);
      process.exitCode = 1;
      return;
    }
    await writeFile(filePath, stubFile(item), 'utf8');
    const exportName = exportNameFromSlug(item.slug);
    console.log(`Scaffolded ${filePath}`);
    console.log(`Next: write full bilingual content, then add to src/data/blog.ts:`);
    console.log(`  import { ${exportName} } from './blogPosts/${stem}';`);
    console.log(`  // include ${exportName} in blogPosts array`);
    return;
  }

  if (args.json) {
    console.log(JSON.stringify({ ok: true, today, status, item }, null, 2));
    return;
  }

  console.log(`Blog daily — ${today} (${status})`);
  console.log(`Date:  ${item.date}`);
  console.log(`Slug:  ${item.slug}`);
  console.log(`Topic: ${item.topic} / ${item.level}`);
  console.log(`Title: ${item.workingTitle.en}`);
  console.log(`       ${item.workingTitle.vi}`);
  console.log(`\n${blogCadenceNote.en}`);
  console.log(`\nScaffold: npm run blog:scaffold -- --date=${item.date}`);
  console.log(`Issue:    npm run blog:issue -- --date=${item.date}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
