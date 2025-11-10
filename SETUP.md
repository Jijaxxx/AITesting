# 🚀 Setup Guide - Lectio MVP

## Prerequisites
✅ Node.js 24.11.0 (verified)
✅ npm 11.6.1 (verified)
✅ PostgreSQL 15+ running on localhost:5432

## Installation Steps

### 1. Install all dependencies (monorepo)
```powershell
npm install
cd server; npm install
cd ../client; npm install
cd ..
```

### 2. Start PostgreSQL (Docker)
```powershell
docker-compose up -d
```

Verify connection:
```powershell
# Check container is running
docker ps

# Test connection (optional, requires psql)
# psql -h localhost -p 5432 -U postgres -d lectio_mvp
```

### 3. Configure server environment
```powershell
# Copy example and edit if needed
cp server/.env.example server/.env
```

Default `.env` values:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lectio_mvp
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Generate Prisma Client & Run Migrations
```powershell
cd server
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed database (12 levels, 10 skills)
```powershell
npm run seed
```

Expected output:
```
🌱 Seeding database...
✅ 10 compétences créées
✅ 12 niveaux créés
📖 60 mots de vocabulaire disponibles
🎉 Seed terminé avec succès!
```

### 6. Start development servers
```powershell
# From root directory
npm run dev
```

This runs:
- Backend (Express) on http://localhost:3000
- Frontend (Vite) on http://localhost:5173

## Verify Installation

### Backend API
Visit http://localhost:3000/health
Should return: `{"status":"ok","timestamp":"..."}`

### Frontend
Visit http://localhost:5173
Should display profile selection page

### Prisma Studio (DB viewer)
```powershell
cd server
npm run prisma:studio
```
Opens at http://localhost:5555

## Troubleshooting

### PostgreSQL connection fails
- Check Docker container: `docker ps`
- Verify port 5432 is not in use
- Check DATABASE_URL in `server/.env`

### TypeScript errors during dev
- Ensure all dependencies installed
- Run `npm run prisma:generate` in server/
- Restart VS Code TypeScript server

### Port conflicts
- Backend (3000) or Frontend (5173) port in use
- Change PORT in `server/.env` or `client/vite.config.ts`

## Next Steps
1. ✅ Backend API functional (profiles, progress, rewards)
2. ⏳ Frontend skeleton created (4 pages: ProfileSelect, WorldMap, Game, ParentDashboard)
3. 🎮 Implement 4 mini-games (loto_sons, peche_lettres, course_syllabes, dictee_karaoke)
4. 🎨 Add animations (Framer Motion), TTS (Web Speech API)
5. 📱 PWA configuration (manifest, service worker with Workbox)
6. ✅ Tests (Vitest unit, Supertest API, Playwright e2e)
7. ♿ Accessibility audit (axe, keyboard navigation, ARIA labels)

## Project Structure
```
.
├── client/             # React 18 + Vite frontend
│   ├── src/
│   │   ├── pages/      # ProfileSelect, WorldMap, Game, ParentDashboard
│   │   ├── components/ # Reusable UI components
│   │   ├── games/      # 4 mini-games
│   │   ├── stores/     # Zustand state management
│   │   ├── services/   # API client
│   │   └── i18n/       # i18next French translations
│   └── package.json
├── server/             # Node.js + Express backend
│   ├── src/
│   │   ├── routes/     # Express routes
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Error handling, validation
│   │   └── schemas/    # Zod validation schemas
│   ├── prisma/
│   │   ├── schema.prisma  # 6 models
│   │   └── seed.ts        # 12 levels + 10 skills
│   └── package.json
├── docker-compose.yml  # PostgreSQL 15
├── package.json        # Monorepo root
└── README.md
```

## Available Scripts

**Root:**
- `npm run dev` - Start both client & server
- `npm run build` - Build both projects
- `npm run server` - Start server only
- `npm run client` - Start client only

**Server:**
- `npm run dev` - Start with tsx watch
- `npm run build` - Compile TypeScript
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database
- `npm run test` - Run Vitest tests

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - ESLint check
- `npm run test` - Run Vitest tests
