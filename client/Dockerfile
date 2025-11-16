# --- Build stage ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install deps
COPY client/package*.json ./
RUN npm ci

# Copy source
COPY client/ .

# Build with API base configurable (default /api)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# --- Nginx stage ---
FROM nginx:1.27-alpine AS web

# Nginx config
ARG NGINX_CONF=/etc/nginx/conf.d/default.conf
COPY deploy/nginx/default.conf ${NGINX_CONF}

# Static assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
