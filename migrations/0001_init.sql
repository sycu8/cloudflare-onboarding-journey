-- Production v1 schema (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS workshop_signups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  primary_interest TEXT NOT NULL,
  question TEXT,
  language TEXT NOT NULL DEFAULT 'vi',
  source_path TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_workshop_signups_email ON workshop_signups(email);
CREATE INDEX IF NOT EXISTS idx_workshop_signups_created_at ON workshop_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_workshop_signups_primary_interest ON workshop_signups(primary_interest);

CREATE TABLE IF NOT EXISTS quiz_submissions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  selected_path TEXT,
  language TEXT NOT NULL DEFAULT 'vi',
  created_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at ON quiz_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_selected_path ON quiz_submissions(selected_path);

CREATE TABLE IF NOT EXISTS feedback_messages (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  page_path TEXT,
  language TEXT NOT NULL DEFAULT 'vi',
  created_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_feedback_messages_created_at ON feedback_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_messages_page_path ON feedback_messages(page_path);

