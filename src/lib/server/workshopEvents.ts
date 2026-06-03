import { randomId } from './crypto';
import { notifyWorkshopSubscribers } from './workshopEmail';
import type { workshopEventCreateSchema } from '../validation/schemas';
import type { z } from 'zod';

export type EventRow = {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string | null;
  description_en: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  format: string;
  location_vi: string | null;
  location_en: string | null;
  meeting_url: string | null;
  capacity: number | null;
  primary_interest: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export function mapEvent(row: EventRow) {
  return {
    id: row.id,
    title: { vi: row.title_vi, en: row.title_en },
    description: {
      vi: row.description_vi || '',
      en: row.description_en || '',
    },
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    format: row.format,
    location: row.location_vi || row.location_en ? { vi: row.location_vi || '', en: row.location_en || '' } : null,
    meetingUrl: row.meeting_url,
    capacity: row.capacity,
    primaryInterest: row.primary_interest,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedEvents(db: D1Database, now: string) {
  const result = await db
    .prepare(
      `SELECT * FROM workshop_events
       WHERE status = 'published' AND starts_at >= ?
       ORDER BY starts_at ASC
       LIMIT 20`,
    )
    .bind(now)
    .all<EventRow>();
  return result.results ?? [];
}

export async function listAdminEvents(db: D1Database) {
  const result = await db
    .prepare(`SELECT * FROM workshop_events ORDER BY starts_at DESC LIMIT 50`)
    .all<EventRow>();
  return result.results ?? [];
}

type CreateInput = z.infer<typeof workshopEventCreateSchema>;

type CreateEnv = {
  DB: D1Database;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_API_TOKEN?: string;
  WORKSHOP_EMAIL_FROM?: string;
  PUBLIC_SITE_URL?: string;
};

export async function createWorkshopEvent(
  env: CreateEnv,
  data: CreateInput,
  waitUntil: (promise: Promise<unknown>) => void,
) {
  const id = randomId('evt');
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO workshop_events (
      id, title_vi, title_en, description_vi, description_en,
      starts_at, ends_at, timezone, format, location_vi, location_en,
      meeting_url, capacity, primary_interest, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      data.titleVi,
      data.titleEn,
      data.descriptionVi || null,
      data.descriptionEn || null,
      data.startsAt,
      data.endsAt || null,
      data.timezone,
      data.format,
      data.locationVi || null,
      data.locationEn || null,
      data.meetingUrl || null,
      data.capacity ?? null,
      data.primaryInterest ?? null,
      data.status,
      now,
      now,
    )
    .run();

  const row = await env.DB.prepare(`SELECT * FROM workshop_events WHERE id = ?`).bind(id).first<EventRow>();

  if (row && data.status === 'published') {
    waitUntil(
      notifyWorkshopSubscribers(env, {
        title: { vi: row.title_vi, en: row.title_en },
        description: {
          vi: row.description_vi || '',
          en: row.description_en || '',
        },
        startsAt: row.starts_at,
        timezone: row.timezone,
        format: row.format,
        location: row.location_vi || row.location_en ? { vi: row.location_vi || '', en: row.location_en || '' } : null,
        meetingUrl: row.meeting_url,
      }),
    );
  }

  return row ? mapEvent(row) : { id };
}
