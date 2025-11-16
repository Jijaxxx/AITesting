#!/usr/bin/env bash
set -euo pipefail

# Ensure DATABASE_URL is provided
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set" >&2
  exit 1
fi

# Run migrations (safe for production)
echo "Running prisma migrate deploy..."
./node_modules/.bin/prisma migrate deploy

# Start server
echo "Starting API server..."
exec node dist/server.js
