# Lectio MVP — Application d'apprentissage de la lecture

Application web full-stack pour enfants (3-8 ans) apprenant à lire en français.

## Stack technique

**Frontend**
- React 18 + Vite (SPA, PWA)
- Tailwind CSS + Radix UI + Lucide icons
- Zustand (state management)
- Framer Motion (animations)
- i18next (français + structure i18n)
- Web Speech API (TTS avec fallback)
- PWA: Workbox + manifest + offline support

**Backend**
- Node.js 20+ + Express 4+
- Prisma ORM + PostgreSQL 15+
- Zod (validation)
- Helmet + CORS + rate limiting
- Pino (logs prod) / Morgan (logs dev)

**Base de données**
- PostgreSQL 15+ (local via Docker ou installation native)

## Prérequis

- Node.js 20+ (vous avez v24.11.0 ✅)
- npm 10+ (vous avez 11.6.1 ✅)
- PostgreSQL 15+ ou Docker

## Installation rapide

### 1. Installer les dépendances

```powershell
# À la racine
npm install
npm install

# Installer dépendances client
cd ../client
npm install
cd ..
```

### 2. Lancer PostgreSQL (Docker)

```powershell
docker-compose up -d
```

Ou utilisez votre PostgreSQL local existant.

### 3. Configuration environnement

**server/.env**
```properties
DATABASE_URL="postgresql://XXXXX:XXXXX!@localhost:5432/AiDatabase"
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Deployment (Docker)

See `DEPLOYMENT.md` for a production-ready Docker Compose setup that builds and runs:
- `web` (Nginx + built React client)
- `api` (Express + Prisma, with migrations on start)
- `postgres` (Postgres 15)

Quick start on a VPS:

```bash
docker compose build
docker compose up -d
```

App: `http://<VPS_IP>/` — API proxied at `/api`.

**client/.env**
```properties
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Initialiser la base de données

```powershell
# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations
npm run prisma:migrate

# Insérer les données de seed
npm run seed
```

### 5. Lancer l'application

```powershell
# Démarre backend + frontend en parallèle
npm run dev
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- Prisma Studio : `npm run prisma:studio`

## Scripts disponibles

**Racine**
- `npm run dev` — Lance server + client
- `npm run build` — Build production
- `npm run seed` — Seed la base

**Server**
- `npm run dev` — Lance Express
- `npm run prisma:migrate` — Migrations
- `npm test` — Tests API

**Client**
- `npm run dev` — Lance Vite
- `npm run build` — Build
- `npm test` — Tests Vitest

## Documentation
Voir `archi/` pour l'architecture détaillée.
