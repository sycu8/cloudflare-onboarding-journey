-- Blog editorial approve / email cadence tracking

CREATE TABLE IF NOT EXISTS blog_editorial (
  date TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL,
  token_nonce TEXT,
  pr_url TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (date, slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_editorial_status ON blog_editorial(status);
CREATE INDEX IF NOT EXISTS idx_blog_editorial_updated ON blog_editorial(updated_at);
