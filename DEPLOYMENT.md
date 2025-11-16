# Deployment (Docker, VPS / OVH)

This guide packages the app (frontend + API + Postgres) into Docker containers and runs them with Docker Compose.

## What you get
- `web`: Nginx serving the built React app, proxies `/api` to the API
- `api`: Node/Express API with Prisma, auto-runs `prisma migrate deploy`
- `postgres`: Postgres 15 with a persistent volume

## Requirements
- Docker and Docker Compose installed on your VPS
- Open port 80 in your firewall (and 5432 only if you need external DB access)

## One-time build and run
From the repository root:

```bash
# Build images
docker compose build

# Start stack (detached)
docker compose up -d

# Check containers
docker compose ps
```

Access the app at: `http://<YOUR_VPS_IP>/`

API is proxied at: `http://<YOUR_VPS_IP>/api`

## Environment variables
The `api` service reads:
- `DATABASE_URL`: Postgres connection (default in compose uses the bundled `postgres` service)
- `PORT`: API port (internal 3000)
- `NODE_ENV`: set to `production`
- `CORS_ORIGIN`: optional, comma-separated origins if you serve API under a different domain than web

If you plan to use an external Postgres, override `DATABASE_URL`, for example:

```
postgresql://user:password@db-host:5432/lectio_mvp?schema=public
```

You can provide overrides via an `.env` file at the repo root and reference in compose, or via `-e` flags.

## Notes on CORS
With the provided Nginx config, the frontend and API share the same origin and path (`/` and `/api`), so no CORS is required. If you separate domains, set `CORS_ORIGIN` with your frontend origin(s).

## Running migrations
The API container runs `prisma migrate deploy` on start before serving traffic.

If you change Prisma schema, rebuild the API image:

```bash
docker compose build api
docker compose up -d api
```

## Logs and troubleshooting
```bash
# Follow logs
docker compose logs -f

# Individual service
docker compose logs -f api

# Check health
curl -s http://<YOUR_VPS_IP>/api/health | jq
```

## TLS (HTTPS)
For HTTPS, put a reverse proxy like Traefik, Caddy, or Nginx Proxy Manager in front, or configure Nginx with certificates on the VPS. Traefik is recommended for automatic Let’s Encrypt.

## Stopping and removal
```bash
docker compose down
# To also delete the DB volume
# docker compose down -v
```
