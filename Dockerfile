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

# Cache für npm-Packages nutzen
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

# Telemetrie ausschalten & Mehr RAM für den Build freigeben
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Next.js Build Cache persistent zwischen Docker-Builds wiederverwenden
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

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3003

CMD ["node", "server.js"]