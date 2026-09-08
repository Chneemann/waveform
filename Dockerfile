# Syntax directive specifying the Dockerfile format version.
# ==============================================================================
# @file Dockerfile
# @description Multi-stage Docker build for Next.js production deployments utilizing standalone output and secure user privileges.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Install Dependencies
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package descriptors and install all project dependencies
COPY package*.json ./
RUN npm install

# ------------------------------------------------------------------------------
# Stage 2: Build Application
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from the dependencies stage and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argument aus docker-compose.yml übernehmen
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Build the Next.js application for production
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Execution Server
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

# Create a dedicated system user and group for security isolation
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and optimized standalone bundle from the build stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prepare local persistent storage directory with correct user permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Switch to non-root user
USER nextjs

EXPOSE 3003

# Start the standalone Node.js server
CMD ["node", "server.js"]