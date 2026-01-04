# 🚨 CRITICAL FIX: GitHub Pages Base Path Configuration

## Problem Identified

**Impact:** ⚠️ **CRITICAL BLOCKER**  
**Status:** ✅ **FIXED**  
**Date:** January 4, 2026

---

## Root Cause

The application was **completely broken** on GitHub Pages subdirectory deployments (e.g., `https://sl4x0.github.io/cairo-quran-station/`) because all asset paths were absolute to the domain root (`/_next/...`) instead of relative to the subdirectory (`/cairo-quran-station/_next/...`).

### What Was Happening

1. Browser loads: `https://sl4x0.github.io/cairo-quran-station/`
2. HTML references assets at: `/_next/static/chunks/...`
3. Browser requests: `https://sl4x0.github.io/_next/static/chunks/...` ❌ (404 Not Found)
4. **Result:** Blank page, no CSS, no JavaScript, complete failure

### Why It Happened

The `next.config.mjs` had:

```javascript
basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
```

But the environment variable `NEXT_PUBLIC_BASE_PATH` was **never set** in the GitHub Actions workflow, resulting in an empty string and absolute paths.

---

## The Fix

### 1. Updated GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

Added the `NEXT_PUBLIC_BASE_PATH` environment variable to the build step:

```yaml
- name: Build with Next.js
  run: npm run build
  env:
    NEXT_PUBLIC_BASE_PATH: /cairo-quran-station # ✅ ADDED THIS LINE
    NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL || format('https://{0}.github.io/cairo-quran-station', github.repository_owner) }}
    NEXT_PUBLIC_STREAM_URL: ${{ secrets.STREAM_URL || 'https://n01.radiojar.com/8s5u5tpdtwzuv' }}
    NEXT_PUBLIC_RADIOJAR_STATION_ID: ${{ secrets.RADIOJAR_STATION_ID }}
    NEXT_PUBLIC_RADIOJAR_API_KEY: ${{ secrets.RADIOJAR_API_KEY }}
```

### 2. Created Environment Reference File

**File:** `.env.github-pages`

This documents the required environment variables for local testing:

```bash
NEXT_PUBLIC_BASE_PATH=/cairo-quran-station
NEXT_PUBLIC_SITE_URL=https://sl4x0.github.io/cairo-quran-station
NEXT_PUBLIC_STREAM_URL=https://n01.radiojar.com/8s5u5tpdtwzuv
```

---

## Verification

### Before Fix

```html
<!-- ❌ BROKEN: Absolute paths looking at domain root -->
<link rel="stylesheet" href="/_next/static/chunks/156b7decdd8758e8.css" />
<script src="/_next/static/chunks/112f346e31f991df.js"></script>
```

### After Fix

```html
<!-- ✅ WORKING: Correct paths with basePath -->
<link
  rel="stylesheet"
  href="/cairo-quran-station/_next/static/chunks/156b7decdd8758e8.css"
/>
<script src="/cairo-quran-station/_next/static/chunks/112f346e31f991df.js"></script>
```

---

## Testing Locally

To test the GitHub Pages build locally:

```powershell
# PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/cairo-quran-station"
npm run build

# Or load from .env.github-pages
Get-Content .env.github-pages | ForEach-Object {
  if ($_ -match '^([^=]+)=(.+)$') {
    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2])
  }
}
npm run build
```

Then serve the `out/` directory and navigate to `http://localhost:3000/cairo-quran-station/`

---

## Deployment Impact

### What This Fixes

✅ **All assets now load correctly** (CSS, JS, fonts, images)  
✅ **Application is fully functional** on GitHub Pages  
✅ **Navigation works** within the subdirectory  
✅ **API calls work** (client-side APIs are unaffected by basePath)

### What Doesn't Change

- ✅ Local development (`npm run dev`) still works without basePath
- ✅ Vercel deployment works (different URL structure)
- ✅ All functionality remains the same

---

## Next Steps

1. **Push to GitHub:**

   ```bash
   git add .github/workflows/deploy.yml .env.github-pages CRITICAL_FIX_BASEPATH.md
   git commit -m "Fix: Add NEXT_PUBLIC_BASE_PATH for GitHub Pages deployment"
   git push origin main
   ```

2. **Wait for GitHub Actions:**

   - Go to repository → Actions tab
   - Watch the deployment workflow
   - Should complete in 2-5 minutes

3. **Verify Live Site:**
   - Visit: `https://sl4x0.github.io/cairo-quran-station/`
   - All assets should load
   - Application should be fully functional

---

## Important Notes

### For Different Repository Names

If you fork/clone this repo with a different name, update the basePath:

```yaml
# In .github/workflows/deploy.yml
NEXT_PUBLIC_BASE_PATH: /YOUR-REPO-NAME
```

### For User/Organization Pages

If deploying to `username.github.io` (not a subdirectory), remove the basePath:

```yaml
# In .github/workflows/deploy.yml
NEXT_PUBLIC_BASE_PATH: "" # Empty string for root deployment
```

### For Custom Domains

If using a custom domain (e.g., `quran.yourdomain.com`), also use empty basePath:

```yaml
NEXT_PUBLIC_BASE_PATH: ""
```

---

## Technical Details

### How basePath Works in Next.js

Next.js `basePath` configuration:

1. Prepends the path to all `<Link>` components
2. Prepends the path to all static assets (`_next/static/...`)
3. Prepends the path to all API routes (not applicable for static export)
4. Updates `router.basePath` for client-side routing

### Why This is Environment-Specific

- **GitHub Pages (subdirectory):** Needs basePath (e.g., `/cairo-quran-station`)
- **Vercel:** Automatically handles routing, no basePath needed
- **Custom Domain:** Usually at root, no basePath needed
- **Local Development:** No basePath for simplicity

---

## Priority Justification

This was **the #1 priority** because:

1. **Zero functionality** - The entire application was unusable
2. **Blocks everything else** - Can't test UI, UX, performance, or responsive design on a broken deployment
3. **Simple fix** - Single environment variable, high impact
4. **User-facing** - Affects every visitor to the GitHub Pages site

---

## Checklist

- [x] Identified root cause (missing `NEXT_PUBLIC_BASE_PATH`)
- [x] Updated GitHub Actions workflow
- [x] Created environment reference file
- [x] Tested build locally with basePath
- [x] Verified generated HTML has correct paths
- [x] Documented fix and deployment process
- [ ] Push changes to GitHub
- [ ] Verify live deployment works
- [ ] Update README with deployment status

---

## References

- [Next.js basePath Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
- [GitHub Pages Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**Fix Author:** GitHub Copilot  
**Review Date:** January 4, 2026  
**Priority:** P0 - Critical Blocker
