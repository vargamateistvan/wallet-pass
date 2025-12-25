# GitHub Pages Deployment

## Quick Start

Your frontend is now configured for GitHub Pages deployment!

### Enable GitHub Pages

1. Go to **Settings** → **Pages**: https://github.com/vargamateistvan/wallet-pass/settings/pages
2. Under "Build and deployment", set Source to: **GitHub Actions**
3. Save

### Deploy

Just push to main:
```bash
git add .
git commit -m "Enable GitHub Pages"
git push origin main
```

Your site will be live at: **https://vargamateistvan.github.io/wallet-pass/**

### Configure Backend URL (Optional)

Add repository secrets for production backend:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- `VITE_API_URL`: Your Lambda API Gateway URL
- `VITE_PASS_TYPE_IDENTIFIER`: Your Apple Pass Type ID  
- `VITE_TEAM_IDENTIFIER`: Your Apple Team ID

### Cost

✨ **FREE** - GitHub Pages is free for public repos

---

See [GITHUB_PAGES.md](GITHUB_PAGES.md) for detailed documentation.
