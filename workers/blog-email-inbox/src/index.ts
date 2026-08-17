/**
 * Email Routing Worker: receive replies to blog-approve@… and APPROVE posts.
 *
 * Setup (maintainer):
 * 1. Deploy: cd workers/blog-email-inbox && npx wrangler deploy
 * 2. Email Routing rule: blog-approve@orangecloud.vn → this Worker
 * 3. Secrets: BLOG_APPROVE_SECRET (same as Pages), optional SITE_ORIGIN
 */
export interface Env {
  BLOG_APPROVE_SECRET: string;
  SITE_ORIGIN?: string;
  BLOG_EDITOR_EMAIL?: string;
}

const EDITOR = 'sycu.lee@gmail.com';

function extractEmail(from: string): string {
  const m = from.toLowerCase().match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/);
  return m?.[1] ?? from.toLowerCase();
}

function parseSubject(subject: string): { date: string; slug: string } | null {
  const m = subject.match(/(\d{4}-\d{2}-\d{2})\s*:\s*([a-z0-9-]+)/i);
  if (!m) return null;
  return { date: m[1], slug: m[2].toLowerCase() };
}

function hasApprove(text: string): boolean {
  const lines = text
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('>'));
  for (const line of lines.slice(0, 8)) {
    if (/^approve\.?$/i.test(line)) return true;
  }
  return /\bAPPROVE\b/i.test(lines.slice(0, 5).join(' '));
}

async function readTextBody(message: ForwardableEmailMessage): Promise<string> {
  const reader = message.raw.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  let total = 0;
  for (const c of chunks) total += c.length;
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.length;
  }
  const raw = new TextDecoder().decode(all);
  // Prefer text/plain portion if present
  const textPart = raw.match(/Content-Type:\s*text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n\r?\nContent-Type:|$)/i);
  if (textPart?.[1]) return textPart[1];
  return raw;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    const from = extractEmail(message.from);
    const editor = (env.BLOG_EDITOR_EMAIL || EDITOR).toLowerCase();
    if (from !== editor) {
      message.setReject(`Only ${editor} may approve blog posts`);
      return;
    }

    const subject = message.headers.get('subject') || '';
    const parsed = parseSubject(subject);
    if (!parsed) {
      message.setReject('Subject must include YYYY-MM-DD: slug (from the editorial email)');
      return;
    }

    const body = await readTextBody(message);
    if (!hasApprove(body)) {
      message.setReject('Reply with the single word APPROVE to publish/queue the post');
      return;
    }

    const origin = (env.SITE_ORIGIN || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');
    const res = await fetch(`${origin}/api/blog-approve`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-blog-approve-secret': env.BLOG_APPROVE_SECRET,
      },
      body: JSON.stringify({
        date: parsed.date,
        slug: parsed.slug,
        source: 'email-reply',
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error('blog-approve API failed', res.status, t);
      message.setReject(`Approve API failed (${res.status})`);
      return;
    }

    // Accept (drop) — confirmation email is sent by the Pages Function
    console.log('blog approved via email reply', parsed);
  },
};
