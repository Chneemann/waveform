# Syntax directive
# ==============================================================================
# @file Dockerfile
# @description Optimized multi-stage Docker build for Next.js
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Install Dependencies
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./

# Use the cache for npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ------------------------------------------------------------------------------
# Stage 2: Build Application
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Disable Telemetry & Free Up More RAM for the Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Reusing the Next.js build cache across Docker builds
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Execution Server
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the "config" and "db" folders for drizzle-kit into the runner
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/db ./db

# Install drizzle-kit & tsx globally so that npx drizzle-kit works inside the container
RUN npm install -g drizzle-kit tsx

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3003

CMD ["node", "server.js"]