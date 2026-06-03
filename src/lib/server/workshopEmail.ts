export type WorkshopEmailBinding = {
  send(message: {
    to: string;
    from: string | { email: string; name?: string };
    subject: string;
    html?: string;
    text?: string;
  }): Promise<{ messageId: string }>;
};

export type MailEnv = {
  /** Optional — Pages does not support send_email in wrangler.toml; REST API is used instead. */
  EMAIL?: WorkshopEmailBinding;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_API_TOKEN?: string;
  WORKSHOP_EMAIL_FROM?: string;
  PUBLIC_SITE_URL?: string;
};

type Lang = 'vi' | 'en';

function siteOrigin(env: MailEnv) {
  return (env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');
}

function parseFromAddress(raw: string): string | { email: string; name?: string } {
  const match = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return raw.trim();
}

function fromAddress(env: MailEnv): string | { email: string; name?: string } {
  const raw = env.WORKSHOP_EMAIL_FROM || 'Cloudflare Starter Hub <onboarding@orangecloud.vn>';
  return parseFromAddress(raw);
}

function fromForRest(from: string | { email: string; name?: string }): string | { address: string; name?: string } {
  if (typeof from === 'string') return from;
  return { address: from.email, name: from.name };
}

async function sendEmailViaRest(
  env: MailEnv,
  payload: { to: string; subject: string; html: string; text: string },
): Promise<boolean> {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const token = env.CLOUDFLARE_EMAIL_API_TOKEN;
  if (!accountId || !token) {
    console.warn('workshop email skipped: set CLOUDFLARE_ACCOUNT_ID (var) and CLOUDFLARE_EMAIL_API_TOKEN (secret)');
    return false;
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: payload.to,
      from: fromForRest(fromAddress(env)),
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    errors?: Array<{ code?: number; message?: string }>;
  } | null;

  if (!res.ok || !data?.success) {
    console.error('workshop email REST failed', res.status, JSON.stringify(data?.errors ?? data));
    return false;
  }
  return true;
}

async function sendEmailViaBinding(
  env: MailEnv,
  payload: { to: string; subject: string; html: string; text: string },
): Promise<boolean> {
  if (!env.EMAIL) return false;
  try {
    await env.EMAIL.send({
      to: payload.to,
      from: fromAddress(env),
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return true;
  } catch (e) {
    const err = e as Error & { code?: string };
    console.error('workshop email binding failed', err.code ?? 'unknown', err.message);
    return false;
  }
}

async function sendEmail(
  env: MailEnv,
  payload: { to: string; subject: string; html: string; text: string },
): Promise<boolean> {
  if (env.EMAIL) return sendEmailViaBinding(env, payload);
  return sendEmailViaRest(env, payload);
}

function layout(body: string, origin: string) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1e293b;max-width:560px;margin:0 auto;padding:24px">
${body}
<p style="margin-top:32px;font-size:12px;color:#64748b"><a href="${origin}/workshop/">Cloudflare Starter Hub</a> · <a href="${origin}/privacy/">Privacy</a></p>
</body></html>`;
}

export async function sendSignupConfirmation(
  env: MailEnv,
  input: {
    name: string;
    email: string;
    language: Lang;
    eventTitle?: { vi: string; en: string } | null;
  },
) {
  const lang = input.language;
  const origin = siteOrigin(env);
  const eventLine =
    input.eventTitle && lang === 'en'
      ? `<p>Event: <strong>${input.eventTitle.en}</strong></p>`
      : input.eventTitle
        ? `<p>Sự kiện: <strong>${input.eventTitle.vi}</strong></p>`
        : '';

  if (lang === 'en') {
    const html = layout(
      `<p>Hi ${input.name},</p>
<p>Thank you for registering your interest in Cloudflare Starter Hub workshops.</p>
${eventLine}
<p>We have saved your details. When a new workshop is scheduled, we will email you with date, format, and registration links.</p>
<p>In the meantime, explore learning tracks and use cases:</p>
<ul>
<li><a href="${origin}/start-here/">Start here</a></li>
<li><a href="${origin}/tracks/">Learning tracks</a></li>
<li><a href="${origin}/use-cases/">Use cases</a></li>
</ul>
<p>See you soon,<br/>Cloudflare Starter Hub</p>`,
      origin,
    );
    return sendEmail(env, {
      to: input.email,
      subject: 'Workshop registration received — Cloudflare Starter Hub',
      html,
      text: `Hi ${input.name},\n\nThank you for registering. We will email you when new workshops are announced.\n\n${origin}/workshop/`,
    });
  }

  const html = layout(
    `<p>Chào ${input.name},</p>
<p>Cảm ơn bạn đã đăng ký quan tâm workshop trên Cloudflare Starter Hub.</p>
${eventLine}
<p>Chúng tôi đã ghi nhận thông tin của bạn. Khi có workshop mới, bạn sẽ nhận email thông báo về thời gian, hình thức và link đăng ký.</p>
<p>Trong lúc chờ, bạn có thể khám phá lộ trình học và tình huống thực tế:</p>
<ul>
<li><a href="${origin}/start-here/">Bắt đầu tại đây</a></li>
<li><a href="${origin}/tracks/">Lộ trình học</a></li>
<li><a href="${origin}/use-cases/">Tình huống thực tế</a></li>
</ul>
<p>Hẹn gặp bạn,<br/>Cloudflare Starter Hub</p>`,
    origin,
  );
  return sendEmail(env, {
    to: input.email,
    subject: 'Đã nhận đăng ký workshop — Cloudflare Starter Hub',
    html,
    text: `Chào ${input.name},\n\nCảm ơn bạn đã đăng ký. Chúng tôi sẽ gửi email khi có workshop mới.\n\n${origin}/workshop/`,
  });
}

export type WorkshopEventMail = {
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  startsAt: string;
  timezone: string;
  format: string;
  location: { vi: string; en: string } | null;
  meetingUrl: string | null;
};

function formatEventWhen(startsAt: string, timezone: string, lang: Lang) {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(new Date(startsAt));
  } catch {
    return startsAt;
  }
}

export async function sendNewWorkshopAnnouncement(
  env: MailEnv,
  input: {
    name: string;
    email: string;
    language: Lang;
    event: WorkshopEventMail;
  },
) {
  const lang = input.language;
  const origin = siteOrigin(env);
  const when = formatEventWhen(input.event.startsAt, input.event.timezone, lang);
  const title = lang === 'en' ? input.event.title.en : input.event.title.vi;
  const desc = lang === 'en' ? input.event.description.en : input.event.description.vi;
  const loc = input.event.location ? (lang === 'en' ? input.event.location.en : input.event.location.vi) : '';

  if (lang === 'en') {
    const html = layout(
      `<p>Hi ${input.name},</p>
<p>A new Cloudflare Starter Hub workshop is now open:</p>
<h2 style="color:#f6821f;margin:16px 0">${title}</h2>
<p><strong>When:</strong> ${when}</p>
${loc ? `<p><strong>Location:</strong> ${loc}</p>` : ''}
${desc ? `<p>${desc}</p>` : ''}
<p><a href="${origin}/workshop/" style="display:inline-block;background:#f6821f;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">View & register</a></p>`,
      origin,
    );
    return sendEmail(env, {
      to: input.email,
      subject: `New workshop: ${title}`,
      html,
      text: `New workshop: ${title}\n${when}\n${origin}/workshop/`,
    });
  }

  const html = layout(
    `<p>Chào ${input.name},</p>
<p>Có workshop mới trên Cloudflare Starter Hub:</p>
<h2 style="color:#f6821f;margin:16px 0">${title}</h2>
<p><strong>Thời gian:</strong> ${when}</p>
${loc ? `<p><strong>Địa điểm:</strong> ${loc}</p>` : ''}
${desc ? `<p>${desc}</p>` : ''}
<p><a href="${origin}/workshop/" style="display:inline-block;background:#f6821f;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Xem & đăng ký</a></p>`,
    origin,
  );
  return sendEmail(env, {
    to: input.email,
    subject: `Workshop mới: ${title}`,
    html,
    text: `Workshop mới: ${title}\n${when}\n${origin}/workshop/`,
  });
}

export async function notifyWorkshopSubscribers(
  env: MailEnv & { DB: D1Database },
  event: WorkshopEventMail,
) {
  const rows = await env.DB.prepare(
    `SELECT s.email, s.name, s.language
     FROM workshop_signups s
     INNER JOIN (
       SELECT email, MAX(created_at) AS latest
       FROM workshop_signups
       GROUP BY email
     ) t ON s.email = t.email AND s.created_at = t.latest`,
  ).all<{ email: string; name: string; language: string }>();

  const recipients = rows.results ?? [];
  let sent = 0;
  for (const row of recipients) {
    const lang: Lang = row.language === 'en' ? 'en' : 'vi';
    const ok = await sendNewWorkshopAnnouncement(env, {
      name: row.name,
      email: row.email,
      language: lang,
      event,
    });
    if (ok) sent++;
  }
  console.log(`workshop announcement: ${sent}/${recipients.length} sent`);
  return sent;
}
