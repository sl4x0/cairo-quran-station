# GitHub Pages Deployment Guide

This guide explains how to deploy Cairo Quran Station to GitHub Pages with real-time listener count functionality.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 18+ installed

## Quick Deployment (5 minutes)

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/cairo-quran-station.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The site will auto-deploy on every push

### 3. Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://YOUR_USERNAME.github.io/cairo-quran-station
          NEXT_PUBLIC_STREAM_URL: ${{ secrets.STREAM_URL }}
          NEXT_PUBLIC_RADIOJAR_STATION_ID: ${{ secrets.RADIOJAR_STATION_ID }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4. Add Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

```
STREAM_URL = https://n01.radiojar.com/8s5u5tpdtwzuv
RADIOJAR_STATION_ID = 8s5u5tpdtwzuv
```

### 5. Configure Base Path (if using project pages)

If deploying to `username.github.io/cairo-quran-station`, update `next.config.mjs`:

```javascript
const nextConfig = {
  output: "export",
  basePath: "/cairo-quran-station",
  assetPrefix: "/cairo-quran-station",
  // ... rest of config
};
```

## API Compatibility on GitHub Pages

### ✅ What Works

- **RadioJar API**: Works perfectly from client-side
- **Prayer Times API (Aladhan)**: Works with CORS
- **Quran API (AlQuran Cloud)**: Works with CORS
- **All static assets**: Served from GitHub CDN

### ⚠️ Important Notes

1. **Client-Side Only**: All API calls happen in the browser
2. **CORS Required**: APIs must support CORS (all mentioned APIs do)
3. **No Server-Side Rendering**: Static export only
4. **Environment Variables**: Must be prefixed with `NEXT_PUBLIC_`

## Testing Locally Before Deploy

```bash
# Build static export
npm run build

# Test the static site
npx serve out

# Open http://localhost:3000
```

## Troubleshooting

### Issue: 404 on page refresh

**Solution**: GitHub Pages doesn't support client-side routing automatically. Use hash routing or single-page setup (already configured).

### Issue: Assets not loading

**Cause**: Incorrect base path

**Solution**:

- For user/org pages (`username.github.io`): No base path needed
- For project pages (`username.github.io/project`): Set `basePath` in config

### Issue: Listener count not updating

**Possible causes:**

1. RADIOJAR_STATION_ID not set in repository secrets
2. Invalid Station ID
3. API rate limiting

**Solution:**

1. Verify secrets in GitHub Settings
2. Check browser console for errors
3. Monitor API usage

## Custom Domain (Optional)

1. Add `CNAME` file to `public/` folder:

   ```
   quran.yourdomain.com
   ```

2. Update DNS records:

   ```
   Type: CNAME
   Name: quran
   Value: YOUR_USERNAME.github.io
   ```

3. Enable HTTPS in GitHub Pages settings

## Performance Optimization

GitHub Pages serves via CDN, so your site will be fast globally:

- ✅ Automatic HTTPS
- ✅ Global CDN distribution
- ✅ Cached static assets
- ✅ Gzip/Brotli compression

## Monitoring

### Check Deployment Status

- Go to **Actions** tab in GitHub
- View workflow runs
- Check build logs for errors

### Analytics

The app includes Vercel Analytics. For GitHub Pages, consider:

- Google Analytics
- Plausible Analytics
- Cloudflare Web Analytics

## Security

### Environment Variables

**NEVER commit these to Git:**

- `.env.local`
- `.env.production`
- API keys or secrets

**Always use GitHub Secrets for:**

- Stream URLs
- Station IDs
- API keys

### Content Security Policy

Headers in `next.config.mjs` are for development. On GitHub Pages, headers are controlled by GitHub.

For custom headers, use Cloudflare or another CDN.

## Continuous Deployment

Every push to `main` branch will:

1. ✅ Run build
2. ✅ Generate static files
3. ✅ Deploy to GitHub Pages
4. ✅ Update live site (2-5 minutes)

## Alternative: Manual Deployment

```bash
# Build locally
npm run build

# The out/ folder contains your static site
# Upload it to any static host
```

## Support & Resources

- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [RadioJar API Docs](https://www.radiojar.com/developers)

## Checklist

Before deploying, ensure:

- [ ] Repository is public (for free GitHub Pages)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All secrets are configured
- [ ] Base path is correct (if using project pages)
- [ ] CNAME file added (if using custom domain)
- [ ] GitHub Actions workflow is present
- [ ] All dependencies are in package.json

## Production URL

After deployment, your site will be available at:

- User/Org pages: `https://USERNAME.github.io`
- Project pages: `https://USERNAME.github.io/cairo-quran-station`
- Custom domain: `https://quran.yourdomain.com`
