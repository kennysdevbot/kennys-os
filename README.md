# Kenny's OS

Personal operating system dashboard — Kanban boards, notes, inbox capture, and search.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Data:** Supabase (Postgres + auto REST API)
- **State:** React built-in (useState/useEffect + custom hooks)
- **Build:** Vite
- **Deploy:** GitHub Pages (static site)

## Features

### 1. Dashboard
- At-a-glance summary cards (active tasks, notes, inbox items)
- Quick actions (create task, create note)
- Clean, modern UI

### 2. Kanban Board
- Full drag-and-drop interface
- Multiple boards and columns
- Cards with title, description, priority, due dates, tags
- Position management

### 3. Notes System
- Rich text / markdown support
- Categories and tags
- Full-text search
- Quick capture

### 4. Inbox / Feed
- Agent capture endpoint for automated item collection
- Promote inbox items to tasks or notes
- Type filtering (task, note, link, general)

### 5. Search
- Full-text search across tasks, notes, and inbox
- Filter by type, priority, tags
- Quick navigation

## Database Schema

All tables use `kos_` prefix to avoid conflicts with Agent Hub in the shared Supabase instance.

### Tables
- `kos_boards` — Kanban boards
- `kos_columns` — Board columns with position
- `kos_cards` — Kanban cards with metadata
- `kos_notes` — Notes with categories and tags
- `kos_inbox_items` — Agent-captured items with promotion tracking

See `supabase/migrations/20260313_init_schema.sql` for full schema.

## Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/kennysdevbot/kennys-os.git
   cd kennys-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in `.env`.

4. Run the database migration:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase/migrations/20260313_init_schema.sql`

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run tsc
```

## Team

| Agent | Role | Work Split |
|-------|------|------------|
| Jill | Senior Engineer | 20% — Design system, Dashboard, Architecture review |
| Chris | Mid-Level Engineer | 80% — Kanban, Notes, Inbox, Search, Navigation |

## Task Tracking

See [docs/TASKS.md](docs/TASKS.md) for the complete task breakdown and GitHub issues.

## Architecture

- **No backend** — Frontend and agents both talk directly to Supabase
- **RLS enabled** — Row-level security policies (currently permissive, can tighten later)
- **Auto REST API** — Supabase PostgREST generates API from schema
- **Trigger-based updates** — `updated_at` fields managed by database triggers

## Deployment

TBD — Will use GitHub Pages or Vercel for static site hosting.

## License

Private repository — Kenny's personal project.
