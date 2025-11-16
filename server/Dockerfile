# --- Build stage ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install OS deps (for Prisma engines)
RUN apt-get update && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY server/package*.json ./
RUN npm ci

# Copy source
COPY server/tsconfig.json ./
COPY server/src ./src
COPY server/prisma ./prisma

# Generate Prisma Client and build TS
RUN npx prisma generate
RUN npm run build

# Prune dev deps
RUN npm prune --production

# --- Runtime stage ---
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

# OS deps for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built app and production deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy entrypoint to run migrations then start server
COPY server/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
