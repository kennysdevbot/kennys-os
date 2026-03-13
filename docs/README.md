# Kenny's OS Documentation

This folder contains all documentation for the Kenny's OS project.

## Table of Contents

- **[TASKS.md](./TASKS.md)** - Project task breakdown by phase
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment and CI/CD guide

## Quick Links

### Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. See README.md in project root for setup instructions

### Development

```bash
# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run tsc

# Linting
npm run lint
```

### Project Structure

```
kennys-os/
├── src/
│   ├── components/     # React components
│   │   ├── base/       # Base UI components
│   │   ├── kanban/     # Kanban board components
│   │   ├── notes/      # Notes components
│   │   ├── inbox/      # Inbox components
│   │   ├── search/     # Search components
│   │   ├── layout/     # Layout components
│   │   └── common/     # Common utilities
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── lib/            # Utilities (Supabase client)
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app
├── docs/               # Documentation
├── .github/workflows/  # GitHub Actions
└── supabase/           # Database migrations
```

## Database

The project uses Supabase (PostgreSQL) for data storage.

**Tables:**
- `kos_boards` - Kanban boards
- `kos_columns` - Board columns
- `kos_cards` - Kanban cards
- `kos_notes` - Notes
- `kos_inbox_items` - Inbox items

See `supabase/migrations/20260313_init_schema.sql` for schema details.

## Architecture

### State Management
- React hooks (useState, useEffect)
- Custom hooks for data fetching from Supabase
- No global state manager (keep it simple)

### Styling
- Tailwind CSS v4
- Custom dark theme in `tailwind.config.js`
- CSS variables in `src/index.css`

### Database Access
- All components talk directly to Supabase via custom hooks
- Row-level security (RLS) policies in place
- Auto REST API via PostgREST

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Keep components small and focused
- Use custom hooks for data fetching

### Adding Features
1. Create components in `src/components/`
2. Create hooks in `src/hooks/` for data access
3. Follow existing patterns
4. Add proper TypeScript types
5. Test locally before committing

### Commit Messages
- Format: `type(scope): description`
- Examples:
  - `feat(kanban): add drag-and-drop`
  - `fix(notes): resolve search bug`
  - `docs(deployment): update guide`

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with clear description
3. Reference relevant code/components
