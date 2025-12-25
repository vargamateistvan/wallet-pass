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

# Copy built files
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/package.json ./package.json

# Install production dependencies only
COPY --from=dependencies /app/node_modules ./node_modules

# Create certificates directory
RUN mkdir -p ./config/certificates

EXPOSE 3001

CMD ["node", "dist/server.js"]
