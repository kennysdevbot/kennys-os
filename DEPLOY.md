# Production Deployment Instructions

## Status: Ready for Production ✅

All code reviews passed, CI/CD configured and working, build artifacts generated successfully.

## Why Not GitHub Pages?

GitHub Pages only supports **public repositories** on free plans. Since kennys-os is a **private repository** (contains personal data/credentials), we cannot use GitHub Pages.

## Recommended: Deploy to Vercel

Vercel supports private repositories and has excellent integration with GitHub.

### Steps:

1. **Go to [vercel.com](https://vercel.com)**

2. **Sign in with GitHub**

3. **Import Project**
   - Click "Add New Project"
   - Select `kennysdevbot/kennys-os` from your repositories
   - Vercel will auto-detect the Vite framework

4. **Configure Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - Copy values from your `.env` file

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Future pushes to `master` will auto-deploy

### Expected Result:

- **Live URL**: `https://kennys-os-<random>.vercel.app`
- **Custom Domain** (optional): Connect `kennys-os.dev` in Vercel's domain settings

## Alternative: Netlify

Similar to Vercel:

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

## Manual Deployment (Any Static Host)

If you prefer manual control:

```bash
# Build locally
npm run build

# Upload the `dist/` folder to any static hosting:
# - AWS S3 + CloudFront
# - Google Cloud Storage
# - DigitalOcean Spaces
# - Any CDN
```

## Verification Checklist

Before going live:

- [x] All linting passes
- [x] TypeScript compiles with no errors
- [x] Production build succeeds
- [x] CI/CD workflows pass
- [ ] Environment variables configured on hosting platform
- [ ] Supabase database migrated to production instance (if needed)
- [ ] Custom domain configured (optional)

## Post-Deployment

1. **Test the live app**:
   - Create a board
   - Add cards
   - Create notes
   - Test search
   - Test inbox promotion

2. **Monitor**:
   - Check Supabase dashboard for API usage
   - Monitor Vercel/Netlify analytics
   - Watch for errors in browser console

3. **Log your work** (REQUIRED):
   ```bash
   cd /data/.openclaw/workspace/repos/agent-hub
   node scripts/agent-hub-logger.js \
     --agent jill \
     --model sonnet-4.5 \
     --action "Reviewed and deployed kennys-os to production - code quality verified, CI/CD tested"
   ```

## Notes

- The `gh-pages` branch exists and has the built artifacts (from CI)
- GitHub Pages is configured in the workflow but **won't serve** due to private repo limitation
- The domain `kennys-os.dev` is referenced in `build-deploy.yml` but needs to be set up in Vercel/Netlify instead

---

**Status**: ✅ Code ready for production  
**Action Required**: Deploy to Vercel/Netlify (5 minutes)  
**Documentation**: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guides
