# Deployment Guide

## GitHub Pages (Recommended)

### Prerequisites
- GitHub repository with GitHub Pages enabled
- Custom domain (optional)

### Automatic Deployment

The project uses GitHub Actions to automatically:
1. Run lint checks on every push/PR
2. Build the project
3. Deploy to GitHub Pages on pushes to `master` branch

**Workflows:**
- `.github/workflows/lint.yml` - Lint & type check
- `.github/workflows/build-deploy.yml` - Build & deploy

### Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# The `dist/` folder is ready to deploy
# Upload to GitHub Pages or any static host
```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Under "Branch", select `gh-pages` and `/ (root)`
4. (Optional) Add custom domain under "Custom domain"

The workflow will automatically push to the `gh-pages` branch.

### Environment Variables

The app uses environment variables for Supabase configuration:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are loaded from `.env` locally and should be set in your deployment platform's environment variables.

## Alternative Hosting Options

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist"]
```

## CI/CD Checks

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Building
```bash
npm run build
```

## Custom Domain Setup

To use a custom domain (e.g., `kennys-os.dev`):

1. Add CNAME record to your domain:
   - Name: `kennys-os`
   - Type: `CNAME`
   - Value: `kennysdevbot.github.io`

2. Update `.github/workflows/build-deploy.yml` with your domain:
   ```yaml
   cname: your-domain.com
   ```

3. GitHub will automatically create/update the `CNAME` file in the `gh-pages` branch.

## Monitoring & Logs

- **GitHub Actions**: Check workflow runs in repository → Actions
- **Build logs**: Click on a workflow run to see detailed logs
- **Deployment errors**: Check GitHub Pages in repository Settings

## Environment-Specific Configuration

Create different `.env` files for different environments:
- `.env` - Local development
- `.env.production` - Production settings

Vite automatically loads the correct file based on `--mode` flag:
```bash
npm run build -- --mode production
```
