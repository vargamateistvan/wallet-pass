# Deploying Frontend to GitHub Pages

This project is configured to automatically deploy the frontend to GitHub Pages.

## Automatic Deployment

Every push to the `main` branch automatically triggers a GitHub Pages deployment.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository settings: https://github.com/vargamateistvan/wallet-pass/settings/pages
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save the settings

### 2. Configure Secrets (Optional)

Add these secrets in your repository settings if you want to use a custom backend:

Go to: https://github.com/vargamateistvan/wallet-pass/settings/secrets/actions

- `VITE_API_URL`: Your Lambda API Gateway URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com`)
- `VITE_PASS_TYPE_IDENTIFIER`: Your Apple Pass Type ID
- `VITE_TEAM_IDENTIFIER`: Your Apple Team ID

If not set, the app will use default demo values.

### 3. Trigger Deployment

Push to main branch:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Or manually trigger the workflow:
1. Go to: https://github.com/vargamateistvan/wallet-pass/actions
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"

### 4. Access Your Site

After deployment completes (2-3 minutes), your site will be available at:

**https://vargamateistvan.github.io/wallet-pass/**

## Local Development with GitHub Pages Base Path

To test the GitHub Pages base path locally:

```bash
cd apps/frontend
GITHUB_PAGES=true yarn dev
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to `apps/frontend/public/` with your domain:
   ```
   passes.yourdomain.com
   ```

2. Configure DNS:
   - Add a CNAME record pointing to `vargamateistvan.github.io`

3. Update `vite.config.ts`:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/' : '/',
   ```

## Cost

**FREE** ✨ - GitHub Pages is free for public repositories with:
- 1GB storage
- 100GB bandwidth/month
- Unlimited builds

## Architecture

```
GitHub Repo → GitHub Actions → Build → GitHub Pages (CDN)
     ↓
   Push to main
     ↓
   Automatically builds and deploys
```

## Troubleshooting

### Deployment Failed

Check the Actions tab: https://github.com/vargamateistvan/wallet-pass/actions

### 404 on Page Refresh

GitHub Pages serves a SPA, so you might need to handle routing. The build already includes a 404.html that redirects to index.html.

### Assets Not Loading

Make sure the base path is correct in `vite.config.ts`. For GitHub Pages under a repository name, it should be `/wallet-pass/`.
