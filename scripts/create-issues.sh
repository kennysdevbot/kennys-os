#!/bin/bash

cd /data/.openclaw/workspace/repos/kennys-os

# Phase 2: Kanban Board (Chris)
gh issue create --title "🔧 [Chris] Create Supabase hooks for boards, columns, cards" --label "chris,p0-critical" --body "Create custom React hooks for:
- useBoards() — fetch all boards
- useColumns(boardId) — fetch columns for a board
- useCards(columnId) — fetch cards for a column
- Mutations: createCard, updateCard, deleteCard, moveCard

Use @supabase/supabase-js and handle loading/error states."

gh issue create --title "🔧 [Chris] Build KanbanBoard component" --label "chris,p0-critical" --body "Create the main Kanban board view:
- Render columns horizontally
- Render cards within columns
- Responsive layout
- Loading and empty states

**Depends on:** Supabase hooks"

gh issue create --title "🔧 [Chris] Implement drag-and-drop" --label "chris,p0-critical" --body "Add drag-and-drop functionality:
- Use dnd-kit or react-beautiful-dnd
- Allow dragging cards between columns
- Update position in Supabase
- Smooth animations

**Depends on:** KanbanBoard component"

gh issue create --title "🔧 [Chris] Create CardModal for create/edit" --label "chris,p0-critical" --body "Build modal for creating and editing cards:
- Title (required)
- Description (optional, textarea)
- Save and cancel actions
- Form validation

**Depends on:** Base Modal component (complete)"

gh issue create --title "🔧 [Chris] Add card metadata (priority, due date, tags)" --label "chris,p1-high" --body "Extend CardModal with:
- Priority dropdown (low, medium, high, critical)
- Due date picker
- Tags input (comma-separated or chips)
- Display metadata in card UI

**Depends on:** CardModal"

gh issue create --title "🔧 [Chris] Implement position management" --label "chris,p1-high" --body "Handle card and column position updates:
- Reorder cards within a column
- Reorder columns within a board
- Calculate new position values
- Persist to Supabase

**Depends on:** Drag-and-drop implementation"

gh issue create --title "🔧 [Chris] Add board switcher" --label "chris,p2-medium" --body "Create board management UI:
- Dropdown or sidebar to switch boards
- Create new board modal
- Rename/delete board actions
- Default board on load

**Depends on:** KanbanBoard component"

# Phase 3: Notes System (Chris)
gh issue create --title "📝 [Chris] Create Supabase hooks for notes" --label "chris,p0-critical" --body "Create custom React hooks for notes:
- useNotes() — fetch all notes with filters
- useNote(id) — fetch single note
- Mutations: createNote, updateNote, deleteNote

Handle loading/error states."

gh issue create --title "📝 [Chris] Build NotesList component" --label "chris,p0-critical" --body "Create notes list view:
- Grid or list layout (toggle)
- Display title, preview, metadata
- Filter by category/tags
- Sort options (date, title)

**Depends on:** Supabase hooks"

gh issue create --title "📝 [Chris] Create NoteEditor modal" --label "chris,p0-critical" --body "Build note editor:
- Title input
- Content textarea (large)
- Save and cancel actions
- Auto-save draft (optional)

**Depends on:** Base Modal component"

gh issue create --title "📝 [Chris] Add markdown support" --label "chris,p1-high" --body "Implement markdown rendering:
- Use react-markdown or similar
- Syntax highlighting for code blocks
- Preview toggle in editor
- Rich text formatting toolbar (optional)

**Depends on:** NoteEditor modal"

gh issue create --title "📝 [Chris] Implement categories and tags" --label "chris,p1-high" --body "Add note organization:
- Category dropdown (create new inline)
- Tags input (chips or comma-separated)
- Filter notes by category/tags
- Display tags as badges

**Depends on:** NoteEditor modal"

gh issue create --title "📝 [Chris] Add quick capture" --label "chris,p2-medium" --body "Create quick note capture:
- Floating button or keyboard shortcut
- Minimal modal (title + save)
- Quick entry to notes list

**Depends on:** NoteEditor modal"

# Phase 4: Inbox (Chris)
gh issue create --title "📥 [Chris] Create Supabase hooks for inbox items" --label "chris,p0-critical" --body "Create custom React hooks for inbox:
- useInboxItems() — fetch all items with filters
- Mutations: createInboxItem, promoteToCard, promoteToNote, deleteInboxItem

Handle promoted status tracking."

gh issue create --title "📥 [Chris] Build InboxList component" --label "chris,p0-critical" --body "Create inbox feed view:
- Feed-style layout
- Display source agent, content, type
- Show promoted status
- Filter by type

**Depends on:** Supabase hooks"

gh issue create --title "📥 [Chris] Implement promote-to-task action" --label "chris,p0-critical" --body "Add promote-to-task flow:
- Button on inbox item
- Open CardModal pre-filled with inbox content
- On save, create card and mark inbox item as promoted
- Link inbox item to card ID

**Depends on:** InboxList + CardModal"

gh issue create --title "📥 [Chris] Implement promote-to-note action" --label "chris,p0-critical" --body "Add promote-to-note flow:
- Button on inbox item
- Open NoteEditor pre-filled with inbox content
- On save, create note and mark inbox item as promoted
- Link inbox item to note ID

**Depends on:** InboxList + NoteEditor"

gh issue create --title "📥 [Chris] Add type filtering" --label "chris,p1-high" --body "Implement inbox filters:
- Filter by type (task, note, link, general)
- Filter by promoted status
- Sort by date
- Clear filters action

**Depends on:** InboxList"

gh issue create --title "📥 [Chris] Create agent capture API endpoint" --label "chris,p1-high" --body "Build API endpoint for agents to submit inbox items:
- Use Supabase service role key
- Accept POST with { source_agent, content, type }
- Insert into kos_inbox_items
- Return success/error

Can be a simple Node script or Supabase edge function."

# Phase 5: Search (Chris)
gh issue create --title "🔍 [Chris] Implement full-text search hook" --label "chris,p1-high" --body "Create unified search:
- useSearch(query) hook
- Search across cards, notes, inbox items
- Return categorized results
- Debounce search input

Use Supabase text search or full-text search."

gh issue create --title "🔍 [Chris] Create SearchBar component" --label "chris,p1-high" --body "Build global search bar:
- Input in navigation or header
- Trigger search modal on focus
- Show recent searches (optional)

**Depends on:** Search hook"

gh issue create --title "🔍 [Chris] Build SearchResults modal" --label "chris,p1-high" --body "Create search results UI:
- Categorized by type (cards, notes, inbox)
- Click to navigate to item
- Highlight matching text
- Empty state

**Depends on:** SearchBar + Search hook"

gh issue create --title "🔍 [Chris] Add keyboard shortcut (Cmd+K)" --label "chris,p2-medium" --body "Implement global keyboard shortcut:
- Listen for Cmd+K / Ctrl+K
- Open search modal
- Focus input
- Escape to close

**Depends on:** SearchResults modal"

# Phase 6: Navigation (Chris)
gh issue create --title "📱 [Chris] Make Sidebar responsive" --label "chris,p1-high" --body "Add mobile support:
- Hamburger menu for mobile
- Slide-out sidebar
- Overlay backdrop
- Responsive breakpoints

**Depends on:** Sidebar component (complete)"

gh issue create --title "⌨️ [Chris] Add keyboard navigation" --label "chris,p2-medium" --body "Implement keyboard shortcuts:
- Navigate between views (1-4 for nav items)
- Quick actions (N for new note, T for new task)
- Escape to close modals
- Accessibility support"

gh issue create --title "⏳ [Chris] Create loading states" --label "chris,p2-medium" --body "Add loading indicators:
- Skeleton screens for lists
- Spinner for async actions
- Loading states in hooks
- Smooth transitions"

gh issue create --title "❌ [Chris] Add error boundaries and handling" --label "chris,p2-medium" --body "Implement error handling:
- React error boundaries for views
- Toast notifications for errors
- Retry logic for failed requests
- User-friendly error messages"

# Phase 7: CI/CD (Chris)
gh issue create --title "🚀 [Chris] GitHub Actions: lint + type-check on PR" --label "chris,p1-high" --body "Set up CI pipeline:
- Run on pull requests
- ESLint check
- TypeScript type-check
- Block merge on failure"

gh issue create --title "🚀 [Chris] GitHub Actions: build + deploy to GitHub Pages" --label "chris,p1-high" --body "Set up deployment:
- Run on push to main
- Build production bundle
- Deploy to GitHub Pages
- Set up custom domain (optional)

**Depends on:** CI pipeline"

# Phase 8: Architecture Review (Jill)
gh issue create --title "🎨 [Jill] Architecture Review: Kanban Implementation" --label "jill,p1-high" --body "Review Chris's Kanban board implementation for:
- Code quality and TypeScript usage
- React patterns and hooks
- Component structure
- Performance considerations
- UX/UI polish opportunities

**Depends on:** Kanban implementation (Phase 2) being complete"

gh issue create --title "🎨 [Jill] Architecture Review: Notes Implementation" --label "jill,p1-high" --body "Review Chris's Notes system implementation for:
- Code quality and TypeScript usage
- Markdown rendering approach
- State management
- Performance considerations
- UX/UI polish opportunities

**Depends on:** Notes implementation (Phase 3) being complete"

gh issue create --title "🎨 [Jill] Architecture Review: Inbox Implementation" --label "jill,p1-high" --body "Review Chris's Inbox implementation for:
- Code quality and TypeScript usage
- API endpoint design
- Promotion flow UX
- State management
- Security considerations

**Depends on:** Inbox implementation (Phase 4) being complete"

gh issue create --title "🎨 [Jill] Code quality audit" --label "jill,p2-medium" --body "Full codebase audit:
- TypeScript type coverage
- React patterns consistency
- Component reusability
- Performance optimization opportunities
- Bundle size analysis

**Depends on:** All Phase 2-6 implementations complete"

gh issue create --title "🎨 [Jill] Final polish and UX improvements" --label "jill,p2-medium" --body "Final touches:
- Visual polish (spacing, colors, animations)
- Micro-interactions
- Loading states refinement
- Empty states review
- Accessibility audit

**Depends on:** Architecture reviews complete"

echo "✅ All issues created successfully"
