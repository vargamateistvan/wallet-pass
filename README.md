# Wallet Pass Creator

A full-stack monorepo application for creating and customizing Apple Wallet passes with QR codes, barcodes, and images.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Infrastructure**: Terraform (AWS)
- **Monorepo**: Turborepo
- **Package Manager**: Yarn v4
- **Node Version**: 24.x LTS

## Project Structure

```
wallet-pass/
├── apps/
│   ├── frontend/          # React application
│   └── backend/           # Node.js Express API
├── packages/
│   ├── shared/            # Shared types and utilities
│   ├── ui-components/     # Shared React components
│   └── eslint-config/     # Shared ESLint configuration
├── infrastructure/        # Terraform configurations
└── .github/              # GitHub workflows and documentation
```

## Quick Start

### Prerequisites

- Node.js 24.x LTS
- Yarn 4.x
- Docker (for local database)

### Installation

1. **Install Node 24**
```bash
nvm install 24
nvm use 24
```

2. **Enable Yarn**
```bash
corepack enable
```

3. **Install dependencies**
```bash
yarn install
```

4. **Setup environment variables**
```bash
# Root
cp .env.example .env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env

# Backend
cp apps/backend/.env.example apps/backend/.env
```

5. **Start database (optional)**
```bash
docker-compose up -d postgres redis
```

6. **Start development servers**
```bash
yarn dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Available Scripts

- `yarn dev` - Start all apps in development mode
- `yarn build` - Build all packages and apps
- `yarn test` - Run all tests
- `yarn lint` - Lint all packages
- `yarn type-check` - Type check all packages
- `yarn clean` - Clean all build artifacts

## Development

### Frontend
```bash
cd apps/frontend
yarn dev
```

### Backend
```bash
cd apps/backend
yarn dev
```

## Documentation

For detailed setup instructions and documentation, see [.github/INSTRUCTIONS.md](.github/INSTRUCTIONS.md)

## License

Private - All rights reserved

## Support

For issues or questions, please create an issue in the GitHub repository.
