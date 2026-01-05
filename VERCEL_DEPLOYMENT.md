# Deploying to Vercel

This guide explains how to deploy the Wallet Pass application to Vercel, replacing the AWS infrastructure.

## Why Vercel?

- **Simplicity**: No infrastructure management, no Terraform needed
- **Cost-effective**: Free for hobby projects, ~$20/month for pro
- **Built-in features**: CDN, serverless functions, automatic HTTPS
- **Zero configuration**: Git-based deployments
- **Developer experience**: Instant previews, easy rollbacks

### Cost Comparison

| Service | AWS (Lambda) | Vercel |
|---------|--------------|--------|
| Monthly Cost | ~$5-10 (with careful setup) | Free (hobby) / $20 (pro) |
| Setup Complexity | High (Terraform, S3, Lambda, etc.) | Low (Git push) |
| Maintenance | Manual updates | Automatic |
| SSL/HTTPS | Manual setup | Automatic |
| CDN | CloudFront (extra cost) | Included |

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Node.js 20+** installed locally
4. **Yarn 4** installed

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Connect Repository to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Select the repository: `vargamateistvan/wallet-pass`
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click **Deploy**

#### Option B: Via CLI

```bash
cd /path/to/wallet-pass
vercel
```

Follow the prompts:
- Link to existing project or create new
- Select the project settings
- Deploy

### 3. Configure Environment Variables

In the Vercel Dashboard, go to:
**Project Settings → Environment Variables**

Add the following:

```bash
# Required for Apple Wallet Pass generation
PASS_TYPE_IDENTIFIER=pass.com.example.demo
TEAM_IDENTIFIER=DEMO123456

# Optional: Apple certificates (if using real Apple Wallet)
APPLE_WWDR_CERTIFICATE=<base64-encoded-cert>
APPLE_PASS_CERTIFICATE=<base64-encoded-cert>
APPLE_PASS_KEY=<base64-encoded-key>

# Frontend will use Vercel's deployment URL automatically
NODE_ENV=production
```

### 4. Update Frontend API URL

The frontend needs to know the backend URL. Update the Vercel environment variables:

```bash
VITE_API_URL=https://your-project.vercel.app/api
VITE_PASS_TYPE_IDENTIFIER=pass.com.example.demo
VITE_TEAM_IDENTIFIER=DEMO123456
```

Or set them in **Project Settings → Environment Variables** in Vercel Dashboard.

### 5. Deploy

Push to your main branch:

```bash
git add .
git commit -m "feat: migrate to Vercel"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Run `yarn install`
3. Build frontend (`yarn build`)
4. Build backend (`yarn workspace backend build`)
5. Deploy to production

### 6. Verify Deployment

Visit your deployment URL:
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api`
- **Health check**: `https://your-project.vercel.app/health`

## Project Structure for Vercel

```
wallet-pass/
├── vercel.json              # Vercel configuration
├── api/
│   └── index.ts             # Serverless function entry point
├── apps/
│   ├── frontend/
│   │   └── dist/            # Built frontend (output)
│   └── backend/
│       └── src/
│           └── server.ts    # Express app (no server start)
└── package.json             # Root package with vercel-build script
```

## How It Works

1. **Frontend**: Vite builds the React app to `apps/frontend/dist`
2. **Backend**: Express app is wrapped in a Vercel serverless function via `api/index.ts`
3. **Routing**: All `/api/*` requests go to the backend, everything else to frontend
4. **Environment**: Vercel sets `VERCEL=1` env var to prevent Express from starting a server

## Development Workflow

### Local Development

```bash
# Install dependencies
yarn install

# Run frontend and backend concurrently
yarn dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Preview Deployments

Every pull request gets a unique preview URL:
```
https://wallet-pass-git-feature-branch.vercel.app
```

### Production Deployments

Merging to `main` automatically deploys to production:
```
https://wallet-pass.vercel.app
```

## Vercel Configuration Explained

```json
{
  "version": 2,
  "buildCommand": "yarn build",           // Builds both frontend & backend
  "outputDirectory": "apps/frontend/dist", // Frontend static files
  "rewrites": [
    {
      "source": "/api/(.*)",              // API requests
      "destination": "/api"               // → serverless function
    },
    {
      "source": "/(.*)",                  // All other requests
      "destination": "/index.html"        // → frontend SPA
    }
  ]
}
```

## Serverless Storage Options

Since Vercel doesn't include S3, consider these alternatives:

### Option 1: Vercel Blob Storage
```bash
npm i @vercel/blob
```

```typescript
import { put } from '@vercel/blob';

const blob = await put('passes/example.pkpass', file, {
  access: 'public',
});
```

### Option 2: Keep AWS S3 (Hybrid)
- Keep using S3 for file storage
- Only run backend/frontend on Vercel
- Add AWS credentials to Vercel env vars

### Option 3: Cloudinary
```bash
npm i cloudinary
```

Use Cloudinary for image/file storage with generous free tier.

## Migrating from AWS

### What to Keep
- ✅ Express backend code (works as-is)
- ✅ Frontend React code
- ✅ Business logic

### What to Remove
- ❌ `infrastructure/` folder (all Terraform)
- ❌ `scripts/deploy-*.sh` (AWS deployment scripts)
- ❌ AWS Lambda-specific code (`lambda.ts`)
- ❌ AWS SDK dependencies (unless keeping S3)

### What to Update
- ✅ `vercel.json` (already created)
- ✅ `api/index.ts` (serverless entry point)
- ✅ Remove `@aws-sdk/*` from dependencies
- ✅ Update environment variables

## Troubleshooting

### Build Fails

Check build logs in Vercel Dashboard:
```bash
vercel logs <deployment-url>
```

### API Routes Not Working

Ensure `api/index.ts` correctly imports the Express app:
```typescript
import app from '../apps/backend/src/server';
```

### Environment Variables

Variables must be set in Vercel Dashboard, not `.env` files (for production).

### CORS Issues

Update CORS in `apps/backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

## Custom Domain

1. Go to **Project Settings → Domains**
2. Add your custom domain: `wallet-pass.yourdomain.com`
3. Update DNS records as instructed
4. Vercel handles SSL automatically

## Monitoring & Logs

- **Runtime logs**: Vercel Dashboard → Deployments → View Function Logs
- **Analytics**: Built-in (Pro plan)
- **Errors**: Integrated error reporting

## CI/CD with GitHub Actions (Optional)

Vercel handles deployments automatically, but you can add additional checks:

```yaml
name: Quality Checks

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: corepack enable
      - run: yarn install
      - run: yarn test
      - run: yarn lint
```

## Next Steps

1. ✅ Deploy to Vercel
2. Set up environment variables
3. Configure custom domain (optional)
4. Remove AWS infrastructure code
5. Update README.md with new deployment info

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Serverless Functions**: [vercel.com/docs/functions](https://vercel.com/docs/functions)
- **Environment Variables**: [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
