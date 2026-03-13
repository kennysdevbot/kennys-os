# Task Breakdown — Kenny's OS

## Phase 1: Foundation (COMPLETE - Jill)

| # | Task | Agent | Status |
|---|------|-------|--------|
| 1.1 | Create GitHub repo and scaffold | Jill | ✅ Done |
| 1.2 | Set up Vite + React + TypeScript + Tailwind | Jill | ✅ Done |
| 1.3 | Design database schema (Supabase migration) | Jill | ✅ Done |
| 1.4 | Create design system (colors, components) | Jill | ✅ Done |
| 1.5 | Build Dashboard home page | Jill | ✅ Done |

## Phase 2: Kanban Board (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 2.1 | Create Supabase hooks for boards, columns, cards | Chris | p0-critical |
| 2.2 | Build KanbanBoard component (columns + cards) | Chris | p0-critical |
| 2.3 | Implement drag-and-drop (react-beautiful-dnd or dnd-kit) | Chris | p0-critical |
| 2.4 | Create CardModal for create/edit card | Chris | p0-critical |
| 2.5 | Add card metadata (priority, due date, tags) | Chris | p1-high |
| 2.6 | Implement position management (reorder cards/columns) | Chris | p1-high |
| 2.7 | Add board switcher (create/select boards) | Chris | p2-medium |

## Phase 3: Notes System (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 3.1 | Create Supabase hooks for notes | Chris | p0-critical |
| 3.2 | Build NotesList component (grid or list view) | Chris | p0-critical |
| 3.3 | Create NoteEditor modal (title + content) | Chris | p0-critical |
| 3.4 | Add markdown support (react-markdown or similar) | Chris | p1-high |
| 3.5 | Implement categories and tags | Chris | p1-high |
| 3.6 | Add quick capture (floating button or keyboard shortcut) | Chris | p2-medium |

## Phase 4: Inbox / Feed (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 4.1 | Create Supabase hooks for inbox items | Chris | p0-critical |
| 4.2 | Build InboxList component (feed-style view) | Chris | p0-critical |
| 4.3 | Implement promote-to-task action | Chris | p0-critical |
| 4.4 | Implement promote-to-note action | Chris | p0-critical |
| 4.5 | Add type filtering (task, note, link, general) | Chris | p1-high |
| 4.6 | Create agent capture API endpoint (service role) | Chris | p1-high |

## Phase 5: Search (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 5.1 | Implement full-text search hook (cards, notes, inbox) | Chris | p1-high |
| 5.2 | Create SearchBar component (global navigation) | Chris | p1-high |
| 5.3 | Build SearchResults modal (categorized results) | Chris | p1-high |
| 5.4 | Add keyboard shortcut (Cmd+K / Ctrl+K) | Chris | p2-medium |

## Phase 6: Navigation & Layout (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 6.1 | Make Sidebar responsive (mobile hamburger menu) | Chris | p1-high |
| 6.2 | Add keyboard navigation support | Chris | p2-medium |
| 6.3 | Create loading states for all views | Chris | p2-medium |
| 6.4 | Add error boundaries and error handling | Chris | p2-medium |

## Phase 7: CI/CD & Deploy (Chris)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 7.1 | GitHub Actions: lint + type-check on PR | Chris | p1-high |
| 7.2 | GitHub Actions: build + deploy to GitHub Pages | Chris | p1-high |
| 7.3 | Set up custom domain (optional) | Chris | p2-medium |

## Phase 8: Architecture Review (Jill)

| # | Task | Agent | Priority |
|---|------|-------|----------|
| 8.1 | Review Chris's Kanban implementation | Jill | p1-high |
| 8.2 | Review Chris's Notes implementation | Jill | p1-high |
| 8.3 | Review Chris's Inbox implementation | Jill | p1-high |
| 8.4 | Code quality audit (types, patterns, performance) | Jill | p2-medium |
| 8.5 | Final polish and UX improvements | Jill | p2-medium |

## Work Distribution

- **Jill (20%):** Design system, Dashboard, Architecture review
- **Chris (80%):** All feature implementation (Kanban, Notes, Inbox, Search, Navigation)

## Execution Order

1. ✅ Phase 1 (Jill) — Foundation complete
2. Phase 2 (Chris) — Kanban board (highest priority)
3. Phase 3 (Chris) — Notes system
4. Phase 4 (Chris) — Inbox / feed
5. Phase 5 (Chris) — Search
6. Phase 6 (Chris) — Navigation & polish
7. Phase 7 (Chris) — CI/CD
8. Phase 8 (Jill) — Architecture review and final polish

## Dependencies

- Phase 2-6 all depend on Phase 1 (complete)
- Phase 7 can run in parallel once Phase 2 is functional
- Phase 8 depends on Phase 2-6 being complete
