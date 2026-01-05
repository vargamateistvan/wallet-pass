# Migration from AWS to Vercel - Summary

## ✅ Completed Changes

### Files Created
1. **`vercel.json`** - Vercel configuration for routing and build settings
2. **`api/index.ts`** - Serverless function entry point for backend API
3. **`.vercelignore`** - Files to ignore during Vercel deployment
4. **`VERCEL_DEPLOYMENT.md`** - Complete deployment guide
5. **`.github/workflows/deploy-vercel.yml`** - CI/CD for Vercel (optional)

### Files Modified
1. **`apps/backend/src/server.ts`** - Updated to work with Vercel serverless (no server start when VERCEL=1)
2. **`apps/backend/package.json`** - Replaced AWS dependencies with @vercel/node
3. **`apps/frontend/src/App.tsx`** - Made basename conditional (Vercel vs GitHub Pages)
4. **`package.json`** - Added `vercel-build` script
5. **`README.md`** - Updated to reflect Vercel deployment

### Files Removed
1. **`apps/backend/src/lambda.ts`** - AWS Lambda-specific (no longer needed)

### Dependencies Changed
- ❌ Removed: `@aws-sdk/client-s3`, `@vendia/serverless-express`
- ✅ Added: `@vercel/node`

## 🎯 What to Do Next

### 1. Deploy to Vercel

**Option A: Vercel Dashboard** (Easiest)
```bash
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Vercel auto-detects settings from vercel.json
# 4. Click Deploy
```

**Option B: Vercel CLI**
```bash
npm i -g vercel
cd /Users/mavarga/Documents/wallet-pass
vercel
```

### 2. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```env
PASS_TYPE_IDENTIFIER=pass.com.example.demo
TEAM_IDENTIFIER=DEMO123456
NODE_ENV=production
VITE_API_URL=https://your-project.vercel.app/api
VITE_PASS_TYPE_IDENTIFIER=pass.com.example.demo
VITE_TEAM_IDENTIFIER=DEMO123456
```

### 3. Optional: Setup GitHub Actions

If using the GitHub Actions workflow (`.github/workflows/deploy-vercel.yml`):

Add these secrets to GitHub repository:
- `VERCEL_TOKEN` - From vercel.com/account/tokens
- `VERCEL_ORG_ID` - From Vercel project settings
- `VERCEL_PROJECT_ID` - From Vercel project settings

### 4. Clean Up AWS Infrastructure (Optional)

If no longer using AWS:

```bash
# Destroy AWS resources
cd infrastructure/environments/dev
terraform destroy

# Remove AWS infrastructure files
rm -rf infrastructure/
rm -f scripts/deploy-backend.sh
rm -f scripts/deploy-frontend.sh
rm -f scripts/setup-state-backend.sh
rm -f scripts/terraform-init.sh
rm -f DEPLOYMENT.md
```

Keep these files if you want dual deployment (Vercel + AWS).

## 📊 Benefits of Migration

| Feature | AWS (Before) | Vercel (After) |
|---------|--------------|----------------|
| **Setup Time** | ~2 hours (Terraform, AWS config) | ~5 minutes |
| **Monthly Cost** | ~$5-10 (careful setup needed) | Free (hobby) |
| **SSL/HTTPS** | Manual (ACM, CloudFront) | Automatic |
| **CDN** | CloudFront (extra config) | Included |
| **Deployments** | Manual (scripts) | Git push |
| **Preview URLs** | Not available | Every PR |
| **Rollbacks** | Manual | One click |
| **Maintenance** | Regular updates needed | Automatic |

## 🔧 How It Works

### Before (AWS)
```
GitHub → GitHub Actions → Build → Push to ECR → Deploy Lambda
                                  → Upload to S3 → CloudFront
```

### After (Vercel)
```
GitHub → Vercel (auto-detect) → Build → Deploy
                                       → Serverless Functions
                                       → CDN
```

## 🧪 Testing

### Local Development (unchanged)
```bash
yarn install
yarn dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Preview Deployments
Every pull request automatically gets a preview URL:
```
https://wallet-pass-git-branch-name.vercel.app
```

### Production
Merge to main deploys to:
```
https://wallet-pass.vercel.app
```

## 📝 Storage Options

Since Vercel doesn't include S3, choose one:

### Option 1: Vercel Blob (Recommended)
```bash
yarn add @vercel/blob
```
Free: 500GB bandwidth/month

### Option 2: Keep AWS S3
Keep using S3 for storage, but host app on Vercel.

### Option 3: Cloudinary
Free tier: 25GB storage, 25GB bandwidth

## 🚨 Important Notes

1. **No server.listen() on Vercel** - The server.ts now checks `VERCEL=1` env var
2. **API routes via /api** - All backend routes prefixed with /api
3. **Environment variables** - Set in Vercel Dashboard, not .env files
4. **File uploads** - Need external storage (Vercel Blob, S3, Cloudinary)
5. **Function timeout** - 10s (Hobby), 60s (Pro), 300s (Enterprise)

## 📚 Resources

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Full deployment guide
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## ✨ Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test the deployment
4. Optional: Set up custom domain
5. Optional: Remove AWS infrastructure
6. Optional: Configure GitHub Actions for additional CI checks

---

**Status**: Ready to deploy! 🚀
