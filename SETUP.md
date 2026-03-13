# Kenny's OS - Setup Instructions

## Prerequisites

- Node.js 20+ installed
- npm or yarn
- Supabase account with project created
- `.env` file with Supabase credentials

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Database Tables

This is the **critical step** that was missing. The database tables must be created.

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Open `supabase/migrations/20260313_init_schema.sql` in your editor
5. Copy the **entire contents**
6. Paste into the Supabase SQL editor
7. Click **"Run"**

**Option B: Via Script**

Run the setup script which checks if tables exist:

```bash
npm run setup:db
```

This script will:
- Check if tables exist
- If not, provide instructions to set them up manually
- If yes, confirm everything is ready

### 4. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### 5. Test the App

Visit `http://localhost:5173` and test:

- ✅ Dashboard loads
- ✅ Click "New Task" button → navigates to Kanban
- ✅ Click "New Note" button → navigates to Notes  
- ✅ Go to Notes page, click "+ New Note" → modal opens
- ✅ Create a note and save it
- ✅ Check that no 401 errors appear in the browser console

## Troubleshooting

### 401 Errors in Console

**Problem:** `Failed to load resource: 401` from Supabase API

**Cause:** Database tables don't exist or RLS policies are misconfigured

**Solution:**
1. Check that all tables were created (step 3 above)
2. Go to Supabase Dashboard → SQL Editor
3. Run `SELECT * FROM kos_boards;` to verify tables exist
4. If they don't exist, run the migration SQL again

### Buttons Don't Work

**Problem:** Clicking buttons doesn't do anything

**Solution:** This was fixed in the latest version. Make sure you're on the latest commit.

Check button handlers:
- Dashboard → "New Task" should navigate to `/kanban`
- Dashboard → "New Note" should navigate to `/notes`
- Notes page → "+ New Note" should open modal

### App Crashes or Won't Load

**Problem:** App shows error or blank screen

**Cause:** Usually missing `.env` variables

**Solution:**
1. Check `.env` file exists
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Check browser console for errors (F12)
4. Restart dev server: `npm run dev`

## Architecture Overview

### Database Structure

```
kos_boards (Kanban boards)
├── kos_columns (Columns within boards)
└── kos_cards (Cards within columns)

kos_notes (Note-taking system)

kos_inbox_items (Captured items from agents)
```

### Frontend Stack

- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- @dnd-kit for drag-and-drop

### Backend

- Supabase (PostgreSQL + PostgREST API)
- Row-Level Security (RLS) policies
- Automatic timestamps and triggers

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run setup:db     # Check database setup status
```

### File Structure

```
src/
├── components/       # React components
│   ├── base/        # Base UI components (Button, Card, Modal, etc.)
│   ├── kanban/      # Kanban board components
│   ├── notes/       # Notes system components
│   ├── search/      # Search components
│   ├── layout/      # Layout components
│   └── common/      # Common components (ErrorBoundary, LoadingSpinner)
├── hooks/           # Custom React hooks (useNotes, useCards, etc.)
├── lib/             # Libraries (supabase client)
├── pages/           # Page components (Dashboard, Notes, Kanban, Inbox)
├── types/           # TypeScript type definitions
└── App.tsx          # Main app component
```

## Deployment

See [DEPLOY.md](DEPLOY.md) for production deployment instructions.

## Next Steps

After setup is complete:

1. ✅ Verify all buttons work
2. ✅ Create a test board and card
3. ✅ Create a test note
4. ✅ Test search functionality
5. 🚀 Deploy to Vercel or other hosting

---

**Status:** ✅ Setup documentation complete  
**Last Updated:** March 13, 2026  
**Verified By:** Chris (Subagent)
