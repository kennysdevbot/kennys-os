# Fix for kennys-os Supabase 401 Issue

## What Was the Problem?

The `kos_boards` table (and all other kennys-os tables) **don't exist yet** in the Supabase database.

When the app tries to query:
```
GET https://jtngcypnstmsdyurjtkn.supabase.co/rest/v1/kos_boards?select=*
```

Supabase returns **404 Not Found** (not 401), but this appears as a permission/auth error in the app.

## Root Cause

The migration SQL (`supabase/migrations/20260313_init_schema.sql`) was never run in the Supabase dashboard.

The agent-hub tables (projects, tasks, activity_logs) exist and work because their migration was run manually via the SQL Editor.

kennys-os needs the same treatment.

## The Fix (3 Steps)

### Step 1: Verify Current State

```bash
cd /data/.openclaw/workspace/repos/kennys-os
npm run test:db
```

You should see all tables marked as "NOT FOUND".

### Step 2: Apply the Migration

1. Go to: **https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn/editor**
2. Click **"+ New query"**
3. Name it "kennys-os-init"
4. Run this command to see the SQL:
   ```bash
   npm run migration:show
   ```
5. **Copy everything** between the markers
6. **Paste** into the Supabase SQL Editor
7. Click **RUN** (blue button)
8. Wait for success confirmation (~2-3 seconds)

### Step 3: Verify the Fix

```bash
npm run test:db
```

All 5 tables should now show **✅ OK**.

## What the Migration Creates

### Tables
- **kos_boards** - Kanban boards
- **kos_columns** - Columns within boards (Backlog, In Progress, Done)
- **kos_cards** - Tasks/cards in columns
- **kos_notes** - Note-taking system
- **kos_inbox_items** - Agent capture endpoint

### Security (RLS Policies)
All tables use the same pattern as agent-hub:

```sql
ALTER TABLE kos_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on kos_boards" 
  ON kos_boards 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
```

This allows:
- ✅ **Anon key** (frontend) - full read/write access
- ✅ **Service role** (agents) - full read/write access

### Default Data
Seeds a "Main Board" with 3 columns:
- Backlog (position 0)
- In Progress (position 1)
- Done (position 2)

## Why This Happened

Supabase doesn't auto-run migrations from files. They must be:
1. Pasted into the SQL Editor, OR
2. Run via `supabase db push` (requires Supabase CLI setup)

For simplicity, option #1 (SQL Editor) is recommended.

## Test After Fix

Visit the app:
```bash
npm run dev
```

Then try:
1. Creating a new kanban board
2. Adding columns
3. Creating cards
4. Dragging cards between columns

All should work without 401/404 errors.

## Troubleshooting

### Still getting 401 after migration?

1. **Check .env**:
   ```bash
   cat .env | grep SUPABASE
   ```
   Should match:
   - `VITE_SUPABASE_URL=https://jtngcypnstmsdyurjtkn.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJhbG...` (long JWT token)

2. **Check RLS policies in dashboard**:
   - Go to: https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn/auth/policies
   - Find `kos_boards` table
   - Should have policy: "Allow all operations on kos_boards"

3. **Verify table exists**:
   ```bash
   curl -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
     "https://jtngcypnstmsdyurjtkn.supabase.co/rest/v1/kos_boards?select=*"
   ```
   Should return JSON array (not 404/401).

### Migration says "relation already exists"?

Tables are already there! You're done. Just run `npm run test:db` to verify all 5 tables are accessible.

## Summary

**Issue**: Tables didn't exist → 404 errors interpreted as 401 auth errors

**Fix**: Run migration SQL in Supabase dashboard

**Result**: Tables created with correct RLS policies → app works

**Time**: ~2 minutes
