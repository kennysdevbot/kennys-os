# Kenny's OS - Database Migration Guide

## Problem
The `kos_boards` table (and other kennys-os tables) don't exist in the Supabase database yet, causing 401 errors.

## Solution
Run the migration SQL in the Supabase dashboard.

## Steps

### 1. Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn/editor

### 2. Create New Query
- Click "+ New query" button
- Give it a name like "kennys-os-init"

### 3. Copy Migration SQL
The migration SQL is in: `supabase/migrations/20260313_init_schema.sql`

You can view it with:
```bash
cat supabase/migrations/20260313_init_schema.sql
```

### 4. Paste and Run
- Paste the entire SQL content into the query editor
- Click the **RUN** button (blue button in top right)
- Wait for success message (should take ~2-3 seconds)

### 5. Verify
Run this command to test:
```bash
curl -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  "https://jtngcypnstmsdyurjtkn.supabase.co/rest/v1/kos_boards?select=*"
```

Expected response:
```json
[{"id":"<uuid>","name":"Main Board","created_at":"..."}]
```

## What the Migration Does

Creates 5 tables:
- **kos_boards** - Kanban boards
- **kos_columns** - Board columns (Backlog, In Progress, Done)
- **kos_cards** - Tasks/cards within columns
- **kos_notes** - Note-taking system
- **kos_inbox_items** - Agent capture endpoint

Plus:
- Row Level Security (RLS) policies allowing all operations
- Indexes for performance
- Triggers for auto-updating `updated_at` fields
- Seeds a default "Main Board" with 3 columns

## RLS Policy Pattern

Matches agent-hub's approach:
```sql
ALTER TABLE kos_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on kos_boards" 
  ON kos_boards FOR ALL USING (true) WITH CHECK (true);
```

This allows both anon and service_role keys full access (read/write).

## Troubleshooting

**"relation already exists"**
- Tables already created. You're done! Just test the API.

**"permission denied"**
- Make sure you're logged into the correct Supabase account
- Check you're on the right project (jtngcypnstmsdyurjtkn)

**Still getting 401 after migration**
- Check `.env` has correct `VITE_SUPABASE_ANON_KEY`
- Verify RLS policies were created (check Supabase Dashboard > Authentication > Policies)
- Make sure you're sending the Authorization header with the anon key
