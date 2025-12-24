# Apple Wallet Pass Creator - Monorepo Setup Instructions

## Project Overview

A full-stack web application for creating and customizing Apple Wallet passes with QR codes, barcodes, and images.

**Architecture**: Monorepo with Turborepo

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Infrastructure**: Terraform (AWS)
- **Monorepo Tool**: Turborepo
- **Package Manager**: Yarn (v4+)
- **Node Version**: 24.x LTS

---

## Repository Structure

```
wallet-pass/
├── apps/
│   ├── frontend/                 # React application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── PassEditor/
│   │   │   │   │   ├── PassTypeSelector.tsx
│   │   │   │   │   ├── ColorPicker.tsx
│   │   │   │   │   ├── ImageUploader.tsx
│   │   │   │   │   ├── FieldEditor.tsx
│   │   │   │   │   ├── BarcodeEditor.tsx
│   │   │   │   │   └── PassPreview.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── Sidebar.tsx
│   │   │   │   └── ui/           # Reusable UI components
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       ├── Card.tsx
│   │   │   │       └── Modal.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Editor.tsx
│   │   │   │   ├── Templates.tsx
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePassData.ts
│   │   │   │   ├── useImageUpload.ts
│   │   │   │   └── useApi.ts
│   │   │   ├── store/
│   │   │   │   └── passStore.ts  # Zustand store
│   │   │   ├── types/
│   │   │   │   └── pass.types.ts
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts
│   │   │   │   └── colors.ts
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── backend/                  # Node.js Express API
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── passController.ts
│       │   │   ├── templateController.ts
│       │   │   └── authController.ts
│       │   ├── services/
│       │   │   ├── passGenerator.ts
│       │   │   ├── certificateManager.ts
│       │   │   ├── imageProcessor.ts
│       │   │   ├── qrGenerator.ts
│       │   │   └── s3Service.ts
│       │   ├── models/
│       │   │   ├── Pass.ts
│       │   │   ├── Template.ts
│       │   │   └── User.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── errorHandler.ts
│       │   │   ├── upload.ts
│       │   │   └── validation.ts
│       │   ├── routes/
│       │   │   ├── passRoutes.ts
│       │   │   ├── templateRoutes.ts
│       │   │   └── authRoutes.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   └── validation.ts
│       │   ├── config/
│       │   │   ├── certificates/  # Apple certificates
│       │   │   ├── database.ts
│       │   │   └── env.ts
│       │   ├── types/
│       │   │   └── pass.types.ts
│       │   └── server.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                   # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── pass.types.ts
│   │   │   │   └── api.types.ts
│   │   │   ├── utils/
│   │   │   │   └── validation.ts
│   │   │   └── constants/
│   │   │       └── passConstants.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-components/            # Shared React components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── eslint-config/            # Shared ESLint config
│       ├── index.js
│       └── package.json
│
├── infrastructure/               # Terraform configs
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars
│   │   ├── staging/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars
│   │   └── production/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── terraform.tfvars
│   ├── modules/
│   │   ├── networking/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── compute/              # ECS/EC2/Lambda
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── storage/              # S3, RDS
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── cdn/                  # CloudFront
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── security/             # IAM, Secrets Manager
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   └── README.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-frontend.yml
│   │   ├── deploy-backend.yml
│   │   └── terraform.yml
│   └── INSTRUCTIONS.md           # This file
│
├── package.json                  # Root package.json
├── turbo.json
├── .gitignore
├── .nvmrc
├── .yarnrc.yml
├── .env.example
└── README.md
```

---

## Prerequisites

### Required Software

- **Node.js**: v24.x LTS
- **Yarn**: v4+ (Berry)
- **Terraform**: v1.5+
- **AWS CLI**: v2+
- **Docker**: Latest (for local development)
- **Git**: Latest

### Required Accounts & Credentials

1. **Apple Developer Account** ($99/year)

   - Pass Type ID
   - Team Identifier
   - Signing certificates

2. **AWS Account**

   - Access Key ID
   - Secret Access Key
   - Appropriate IAM permissions

3. **Optional Services**
   - GitHub account (for CI/CD)
   - Sentry (error tracking)
   - Datadog/CloudWatch (monitoring)

---

## Initial Setup

### 1. Node.js Version Management

#### Install Node 24 using nvm

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 24
nvm install 24

# Use Node 24
nvm use 24

# Set as default
nvm alias default 24

# Verify version
node --version  # Should show v24.x.x
```

#### Create `.nvmrc` file

```bash
echo "24" > .nvmrc
```

### 2. Clone Repository

```bash
git clone https://github.com/vargamateistvan/wallet-pass.git
cd wallet-pass
```

### 3. Enable Yarn (Corepack)

```bash
# Enable Corepack (comes with Node.js 24)
corepack enable

# Set Yarn version to latest stable (4.x)
corepack prepare yarn@stable --activate

# Verify Yarn version
yarn --version  # Should show 4.x.x
```

### 4. Install Dependencies

```bash
# Install all workspace dependencies
yarn install
```

### 5. Environment Configuration

#### Root `.env`

```bash
# Create from example
cp .env.example .env

# Edit with your values
NODE_ENV=development
```

#### Frontend `.env` (`apps/frontend/.env`)

```bash
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Wallet Pass Creator
VITE_ENABLE_ANALYTICS=false
```

#### Backend `.env` (`apps/backend/.env`)

```bash
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wallet_pass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wallet_pass
DB_USER=user
DB_PASSWORD=password

# Apple Wallet
APPLE_TEAM_IDENTIFIER=YOUR_TEAM_ID
APPLE_PASS_TYPE_IDENTIFIER=pass.com.yourcompany.passtype
APPLE_WWDR_CERTIFICATE_PATH=./config/certificates/wwdr.pem
APPLE_SIGNER_CERTIFICATE_PATH=./config/certificates/signerCert.pem
APPLE_SIGNER_KEY_PATH=./config/certificates/signerKey.pem
APPLE_SIGNER_KEY_PASSPHRASE=your_passphrase

# AWS S3 (for image storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=wallet-pass-images

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Upload Limits
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/png,image/jpeg

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379
```

---

## Apple Developer Setup

### 1. Create Pass Type ID

1. Log in to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** → **Pass Type IDs**
4. Click **+** to create new Pass Type ID
5. Format: `pass.com.yourcompany.yourapp`

### 2. Generate Certificates

#### A. Create Certificate Signing Request (CSR)

```bash
# On macOS
# Open Keychain Access → Certificate Assistant → Request a Certificate
# Save to disk: CertificateSigningRequest.certSigningRequest
```

#### B. Download Pass Type ID Certificate

1. In Apple Developer Portal → Certificates
2. Click **+** to create new certificate
3. Select **Pass Type ID Certificate**
4. Upload your CSR
5. Download certificate (.cer file)

#### C. Convert Certificates for Node.js

```bash
# Create certificates directory
mkdir -p apps/backend/src/config/certificates

# Download WWDR Certificate
curl -O https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer

# Convert .cer to .pem (WWDR)
openssl x509 -inform DER -in AppleWWDRCAG4.cer -out wwdr.pem

# Export your Pass Type ID certificate from Keychain (.p12)
# Then convert to PEM
openssl pkcs12 -in Certificates.p12 -clcerts -nokeys -out signerCert.pem
openssl pkcs12 -in Certificates.p12 -nocerts -out signerKey.pem

# Move to certificates directory
mv *.pem apps/backend/src/config/certificates/
```

### 3. Get Team Identifier

- Found in Apple Developer Account → Membership details
- Format: `A1B2C3D4E5`

---

## Development

### Start All Services (Turborepo)

```bash
# Start all apps in development mode
yarn dev

# Start specific workspace
yarn workspace frontend dev
yarn workspace backend dev

# Or use Turbo filters
yarn turbo dev --filter=frontend
yarn turbo dev --filter=backend
```

### Manual Start (Multiple Terminals)

```bash
# Terminal 1 - Backend
cd apps/backend
yarn dev

# Terminal 2 - Frontend
cd apps/frontend
yarn dev

# Terminal 3 - Database (Docker)
docker-compose up -d postgres redis
```

### Build All Packages

```bash
# Build all packages
yarn build

# Build specific package
yarn turbo build --filter=shared
yarn turbo build --filter=frontend
yarn turbo build --filter=backend
```

### Run Tests

```bash
# Run all tests
yarn test

# Run tests for specific app
yarn turbo test --filter=backend
yarn turbo test --filter=frontend

# Run with coverage
yarn test:coverage
```

### Linting & Formatting

```bash
# Lint all packages
yarn lint

# Lint specific workspace
yarn turbo lint --filter=frontend

# Format all packages
yarn format

# Type checking
yarn type-check
```

### Clean Build Artifacts

```bash
# Clean all build outputs
yarn clean

# Clean specific workspace
yarn workspace frontend clean
```

---

## Database Setup

### Using PostgreSQL with Docker

```bash
# Start database
docker-compose up -d postgres

# Run migrations
cd apps/backend
yarn migrate:up

# Seed database (optional)
yarn seed
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  pass_type VARCHAR(50) NOT NULL,
  configuration JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Passes table
CREATE TABLE passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  configuration JSONB NOT NULL,
  download_url VARCHAR(500),
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_passes_user_id ON passes(user_id);
CREATE INDEX idx_passes_serial ON passes(serial_number);
```

---

## Infrastructure Setup (Terraform)

### 1. AWS Configuration

```bash
# Configure AWS CLI
aws configure
# Enter your Access Key ID, Secret Access Key, Region

# Verify configuration
aws sts get-caller-identity
```

### 2. Initialize Terraform

```bash
cd infrastructure/environments/dev

# Initialize Terraform
terraform init

# Plan infrastructure changes
terraform plan

# Apply infrastructure
terraform apply
```

### 3. Infrastructure Modules

#### AWS Resources Created:

- **VPC**: Custom VPC with public/private subnets
- **ECS Cluster**: For running backend containers
- **RDS PostgreSQL**: Managed database
- **S3 Buckets**:
  - Image storage
  - Static frontend hosting
- **CloudFront**: CDN for frontend
- **ALB**: Application Load Balancer
- **ElastiCache Redis**: Caching layer
- **Secrets Manager**: For storing sensitive credentials
- **CloudWatch**: Logging and monitoring
- **IAM Roles**: Service roles

---

## Deployment

### CI/CD Pipeline (GitHub Actions)

#### Frontend Deployment

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths:
      - "apps/frontend/**"
      - "packages/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
      - run: corepack enable
      - run: yarn install --immutable
      - run: yarn turbo build --filter=frontend
      - name: Deploy to S3
        run: |
          aws s3 sync apps/frontend/dist/ s3://${{ secrets.S3_BUCKET }} --delete
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

#### Backend Deployment

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - "apps/backend/**"
      - "packages/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
      - run: corepack enable
      - run: yarn install --immutable
      - run: yarn turbo build --filter=backend
      - name: Build Docker image
        run: |
          docker build -t wallet-pass-api:latest apps/backend
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker tag wallet-pass-api:latest ${{ secrets.ECR_REGISTRY }}/wallet-pass-api:latest
          docker push ${{ secrets.ECR_REGISTRY }}/wallet-pass-api:latest
      - name: Update ECS
        run: |
          aws ecs update-service --cluster wallet-pass --service api --force-new-deployment
```

### Manual Deployment

#### Deploy Frontend

```bash
cd apps/frontend

# Build for production
yarn build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Deploy Backend

```bash
cd apps/backend

# Build Docker image
docker build -t wallet-pass-api .

# Tag image
docker tag wallet-pass-api:latest YOUR_ECR_REPO:latest

# Push to ECR
docker push YOUR_ECR_REPO:latest

# Update ECS service
aws ecs update-service --cluster wallet-pass --service api --force-new-deployment
```

---

## Monorepo Configuration

### Root `package.json`

```json
{
  "name": "wallet-pass-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "yarn@4.0.2",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules .turbo"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.1.1",
    "eslint": "^8.55.0",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=24.0.0",
    "yarn": ">=4.0.0"
  }
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": ["VITE_API_URL", "DATABASE_URL", "AWS_REGION"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `.yarnrc.yml`

```yaml
nodeLinker: node-modules

plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
    spec: "@yarnpkg/plugin-workspace-tools"

yarnPath: .yarn/releases/yarn-4.0.2.cjs
```

---

## Key Dependencies

### Frontend (`apps/frontend/package.json`)

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.14.0",
    "axios": "^1.6.2",
    "react-dropzone": "^14.2.3",
    "react-color": "^2.19.3",
    "qrcode.react": "^3.1.0",
    "react-barcode": "^1.4.6",
    "tailwindcss": "^3.3.6",
    "lucide-react": "^0.294.0",
    "@wallet-pass/shared": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.3.3",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@wallet-pass/eslint-config": "workspace:*"
  }
}
```

### Backend (`apps/backend/package.json`)

```json
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src --ext ts",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "migrate:up": "node dist/migrations/up.js",
    "seed": "node dist/seeds/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "passkit-generator": "^3.7.0",
    "pg": "^8.11.3",
    "typeorm": "^0.3.17",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.1",
    "qrcode": "^1.5.3",
    "@aws-sdk/client-s3": "^3.450.0",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "@wallet-pass/shared": "workspace:*"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "@types/bcrypt": "^5.0.2",
    "@types/multer": "^1.4.11",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.3",
    "@wallet-pass/eslint-config": "workspace:*"
  }
}
```

### Shared Package (`packages/shared/package.json`)

```json
{
  "name": "@wallet-pass/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

## Docker Configuration

### `docker-compose.yml` (Development)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: wallet_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/wallet_pass
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./apps/backend:/app/apps/backend
      - ./packages:/app/packages
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

### Backend `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare yarn@stable --activate

FROM base AS dependencies
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN yarn install --immutable

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=dependencies /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN yarn turbo build --filter=backend

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=dependencies /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

---

## Testing Strategy

### Backend Tests

```bash
# apps/backend/jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ]
};
```

### Frontend Tests

```bash
# apps/frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts'
  }
});
```

---

## Monitoring & Logging

### CloudWatch Setup

- Application logs
- API metrics
- Error tracking
- Performance monitoring

### Structured Logging (Winston)

```typescript
// apps/backend/src/utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
```

---

## Security Checklist

- [ ] Environment variables secured
- [ ] Apple certificates stored securely (AWS Secrets Manager)
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] Authentication & authorization
- [ ] File upload size limits
- [ ] Content Security Policy headers
- [ ] Dependency vulnerability scanning

---

## Troubleshooting

### Common Issues

#### 1. Yarn Installation Issues

```bash
# Clear Yarn cache
yarn cache clean

# Rebuild lockfile
rm yarn.lock
yarn install

# Check Node version
node --version  # Must be 24.x
```

#### 2. Turborepo Cache Issues

```bash
# Clear Turbo cache
yarn turbo clean
rm -rf .turbo

# Force rebuild without cache
yarn turbo build --force
```

#### 3. Pass Generation Fails

- Verify Apple certificates are correct
- Check certificate paths in .env
- Ensure pass.json is valid
- Validate image sizes and formats

#### 4. Database Connection Failed

- Check DATABASE_URL
- Verify PostgreSQL is running: `docker ps`
- Check network connectivity
- Verify credentials

#### 5. Workspace Dependencies

```bash
# Check workspace integrity
yarn workspaces list

# Deduplicate dependencies
yarn dedupe

# Rebuild specific workspace
yarn workspace backend rebuild
```

---

## Performance Optimization

### Turborepo Caching

- Turbo automatically caches build outputs
- Shared cache across team (remote caching)
- Incremental builds

### Yarn PnP (Plug'n'Play)

```yaml
# .yarnrc.yml
nodeLinker: pnp # Alternative to node_modules
```

---

## Resources

### Documentation

- [Apple Wallet Developer Guide](https://developer.apple.com/wallet/)
- [PassKit Package Format](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Yarn Berry Documentation](https://yarnpkg.com/)
- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/)
- [AWS Terraform Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

### Tools

- [PKPass Validator](https://pkpassvalidator.com/)
- [Passkit Visual Designer](https://developer.apple.com/wallet/passkit/)

---

## Quick Start Commands

```bash
# 1. Setup Node 24
nvm install 24 && nvm use 24

# 2. Enable Yarn
corepack enable

# 3. Install dependencies
yarn install

# 4. Setup environment
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env

# 5. Start database
docker-compose up -d postgres redis

# 6. Run migrations
yarn workspace backend migrate:up

# 7. Start development
yarn dev
```

---

## Next Steps

1. **Initialize Project Structure**

   ```bash
   yarn init -w
   ```

2. **Setup Apps**

   ```bash
   # Frontend
   cd apps && yarn create vite frontend --template react-ts

   # Backend
   mkdir -p apps/backend/src
   ```

3. **Setup Shared Packages**

   ```bash
   mkdir -p packages/shared/src
   mkdir -p packages/ui-components/src
   mkdir -p packages/eslint-config
   ```

4. **Install Turborepo**

   ```bash
   yarn add turbo -D -W
   ```

5. **Configure Terraform**

   ```bash
   cd infrastructure/environments/dev
   terraform init
   ```

6. **Setup Apple Certificates**

   - Follow Apple Developer Setup section

7. **Start Development**
   ```bash
   yarn dev
   ```

---

## Support

For issues, questions, or contributions:

- Create an issue in the GitHub repository
- Review existing documentation
- Check troubleshooting section
- Consult Turborepo and Yarn documentation

---

**Last Updated**: December 24, 2025
**Version**: 1.0.0
**Node Version**: 24.x
**Yarn Version**: 4.x
**Turborepo Version**: 2.x
