-- Contact submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 2),
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL CHECK (length(message) >= 10),
  budget TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'unread'
);

-- Guestbook entries table
CREATE TABLE guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 2),
  message TEXT NOT NULL CHECK (length(message) >= 5 AND length(message) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rate_limits_lookup ON rate_limits (ip_hash, action, created_at DESC);
CREATE INDEX idx_guestbook_created_at ON guestbook_entries (created_at DESC);
CREATE INDEX idx_contact_status ON contact_submissions (status, created_at DESC);

-- RLS: contact_submissions (service role only)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON contact_submissions
  USING (auth.role() = 'service_role');

-- RLS: guestbook (public read, insert only)
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_can_read" ON guestbook_entries FOR SELECT USING (true);
CREATE POLICY "anyone_can_insert" ON guestbook_entries FOR INSERT WITH CHECK (true);

-- RLS: rate_limits (service only)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON rate_limits
  USING (auth.role() = 'service_role');
