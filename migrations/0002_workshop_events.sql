-- Workshop events (admin-managed) + link signups to an event

CREATE TABLE IF NOT EXISTS workshop_events (
  id TEXT PRIMARY KEY,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_vi TEXT,
  description_en TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  format TEXT NOT NULL DEFAULT 'online',
  location_vi TEXT,
  location_en TEXT,
  meeting_url TEXT,
  capacity INTEGER,
  primary_interest TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workshop_events_starts_at ON workshop_events(starts_at);
CREATE INDEX IF NOT EXISTS idx_workshop_events_status ON workshop_events(status);

ALTER TABLE workshop_signups ADD COLUMN event_id TEXT;
CREATE INDEX IF NOT EXISTS idx_workshop_signups_event_id ON workshop_signups(event_id);
