-- Kenny's OS Database Schema
-- Tables prefixed with kos_ to avoid conflicts with Agent Hub

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Boards table
CREATE TABLE kos_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Columns table
CREATE TABLE kos_columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES kos_boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cards table
CREATE TABLE kos_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID NOT NULL REFERENCES kos_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notes table
CREATE TABLE kos_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inbox items table (agent capture endpoint)
CREATE TABLE kos_inbox_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_agent TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('task', 'note', 'link', 'general')),
  promoted_to TEXT CHECK (promoted_to IN ('card', 'note')),
  promoted_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_kos_columns_board_id ON kos_columns(board_id);
CREATE INDEX idx_kos_cards_column_id ON kos_cards(column_id);
CREATE INDEX idx_kos_cards_due_date ON kos_cards(due_date);
CREATE INDEX idx_kos_notes_category ON kos_notes(category);
CREATE INDEX idx_kos_inbox_promoted ON kos_inbox_items(promoted_to, promoted_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to cards
CREATE TRIGGER update_kos_cards_updated_at
  BEFORE UPDATE ON kos_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to notes
CREATE TRIGGER update_kos_notes_updated_at
  BEFORE UPDATE ON kos_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- For now: Allow all operations (can tighten later with auth)

ALTER TABLE kos_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kos_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kos_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kos_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kos_inbox_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (basic policy, tighten later)
CREATE POLICY "Allow all operations on kos_boards" ON kos_boards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kos_columns" ON kos_columns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kos_cards" ON kos_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kos_notes" ON kos_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kos_inbox_items" ON kos_inbox_items FOR ALL USING (true) WITH CHECK (true);

-- Insert default board and columns
INSERT INTO kos_boards (name) VALUES ('Main Board');

INSERT INTO kos_columns (board_id, name, position)
SELECT id, 'Backlog', 0 FROM kos_boards WHERE name = 'Main Board'
UNION ALL
SELECT id, 'In Progress', 1 FROM kos_boards WHERE name = 'Main Board'
UNION ALL
SELECT id, 'Done', 2 FROM kos_boards WHERE name = 'Main Board';
