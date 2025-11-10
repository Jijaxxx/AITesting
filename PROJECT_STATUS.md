# 📊 Lectio MVP - État du Projet

**Date de génération:** ${new Date().toISOString()}
**Version:** 1.0.0

## ✅ Complété

### 1. Structure Monorepo
- ✅ Package.json root avec scripts concurrents (dev, build, server, client)
- ✅ Configuration Docker Compose (PostgreSQL 15)
- ✅ README.md complet avec instructions détaillées
- ✅ SETUP.md - Guide d'installation pas à pas
- ✅ setup.ps1 - Script PowerShell d'installation automatique
- ✅ .gitignore (préservé de la version précédente)

### 2. Backend (Node.js + Express + Prisma)

#### Configuration
- ✅ `package.json` avec toutes les dépendances (Express 4.21.2, Prisma 5.22.0, Zod 3.25.0, etc.)
- ✅ `tsconfig.json` (ES2022, strict mode)
- ✅ `.env.example` (DATABASE_URL, PORT, CORS_ORIGIN, NODE_ENV)
- ✅ Scripts npm (dev, build, prisma:generate/migrate/studio, seed, test, lint)

#### Prisma Schema (`server/prisma/schema.prisma`)
- ✅ 6 modèles définis:
  - `Profile` - Profil enfant (pseudo, âge, avatar, settings JSON)
  - `Progress` - Progression par niveau (world 1-3, level 1-4, stars 0-3, XP)
  - `ErrorStat` - Statistiques d'erreurs par compétence
  - `Reward` - Récompenses (badges JSON array max 6, stickers JSON array max 12)
  - `Skill` - Compétences (vowel/digraph, samples JSON)
  - `LevelDef` - Définition des niveaux (world, index, game type, skills JSON)
- ✅ Relations avec CASCADE delete
- ✅ Contraintes unique composites (profileId+world+level, profileId+skillKey)
- ✅ Index sur pseudo

#### Seed Data (`server/prisma/seed.ts`)
- ✅ 10 compétences: voyelles (a, e, i, o, u) + digrammes (ch, on, ou, an, in)
- ✅ 12 niveaux répartis sur 3 mondes × 4 niveaux
- ✅ Mapping des compétences par niveau
- ✅ 60 mots CE1 avec associations de compétences (non stockés en DB, pour usage runtime)

#### API REST Express (`server/src/`)

**Serveur principal** (`server.ts`):
- ✅ Helmet (sécurité headers)
- ✅ CORS configuré
- ✅ Rate limiting (100 req/15min)
- ✅ Morgan logging (dev mode)
- ✅ Routes montées (/api/profiles, /progress, /rewards, /sync, /export)
- ✅ Health check endpoint (/health)
- ✅ Error handler global

**Routes** (`routes/`):
- ✅ `profiles.ts` - GET all, GET :id, POST, PATCH :id, DELETE :id
- ✅ `progress.ts` - GET by profileId, POST (upsert), PATCH :id
- ✅ `rewards.ts` - GET :profileId, POST :profileId
- ✅ `sync.ts` - POST (sync offline queue)
- ✅ `export.ts` - GET :profileId (export JSON), POST (import)

**Controllers** (`controllers/`):
- ✅ `profileController.ts` - 5 méthodes (CRUD + limite 4 profils)
- ✅ `progressController.ts` - 3 méthodes (get, upsert, update)
- ✅ `rewardController.ts` - 2 méthodes (get, update)
- ✅ `syncController.ts` - 1 méthode (reconcile offline operations)
- ✅ `exportController.ts` - 2 méthodes (export/import profile complet)

**Validation Zod** (`schemas/index.ts`):
- ✅ `createProfileSchema` (pseudo min 2, max 40; age 3-8; avatarKey; settings)
- ✅ `updateProfileSchema` (partial)
- ✅ `settingsSchema` (fontSize, contrast, motionReduced, sessionDuration 5-30min)
- ✅ `createProgressSchema` (world 1-3, level 1-4, stars 0-3, xp, attempts)
- ✅ `updateProgressSchema` (partial)
- ✅ `createErrorStatSchema` (profileId, skillKey, count)
- ✅ `updateRewardSchema` (badges max 6, stickers max 12)
- ✅ `syncQueueSchema` (operations array with type/data/timestamp)

**Middleware** (`middleware/`):
- ✅ `errorHandler.ts` - Gestion centralisée des erreurs (Zod, Prisma, AppError, 500)
- ✅ AppError class pour erreurs opérationnelles

### 3. Frontend (React 18 + Vite + Tailwind)

#### Configuration
- ✅ `package.json` - React 18.3.1, Vite 6.0.7, Tailwind 3.4.17, Radix UI, Zustand 5.0.3, Framer Motion 11.15.0, i18next 24.2.0
- ✅ `vite.config.ts` - PWA plugin, proxy API, manifest config
- ✅ `tsconfig.json` + `tsconfig.node.json`
- ✅ `tailwind.config.js` - Thème enfant (colors, fonts Comic Neue/Fredoka, fontSize child-*, animations)
- ✅ `postcss.config.js`
- ✅ `index.html` - Meta tags PWA, manifest, titre
- ✅ `.env.example` (VITE_API_BASE_URL)

#### Styles (`src/index.css`)
- ✅ Tailwind @base, @components, @utilities
- ✅ CSS vars pour fontSize et contrast
- ✅ Classes .high-contrast, .large-font, .motion-reduced
- ✅ @media (prefers-reduced-motion)
- ✅ Composants utilitaires (.btn-child, .btn-primary, .btn-secondary, .card, .focus-visible-ring)

#### Structure de code
- ✅ `main.tsx` - React.StrictMode + BrowserRouter
- ✅ `App.tsx` - Routes (/, /world/:profileId, /game/:world/:level, /parent)
- ✅ `i18n/index.ts` - i18next init avec français
- ✅ `i18n/locales/fr.json` - Traductions complètes (app, profile, world, level, game, rewards, parent, settings, accessibility)

#### Stores Zustand (`stores/`)
- ✅ `profileStore.ts` - Profils (max 4), currentProfile, CRUD avec persist
- ✅ `progressStore.ts` - ProgressMap par profileId, upsert, get helpers, persist

#### Services (`services/`)
- ✅ `api.ts` - Fetcher générique, 5 API clients (profileApi, progressApi, rewardApi, syncApi, exportApi)

#### Pages (`pages/`)
- ✅ `ProfileSelect.tsx` - Grille 2×2, fetch API, navigation vers WorldMap
- ✅ `WorldMap.tsx` - 3 mondes × 4 niveaux, affichage étoiles, navigation vers Game
- ✅ `Game.tsx` - Placeholder pour mini-jeux
- ✅ `ParentDashboard.tsx` - Layout dashboard parent (4 cards: progression, stats, export, settings)

### 4. Documentation Préservée
- ✅ `archi/` - Architecture technique (7 fichiers MD)
- ✅ `doc/` - Spécifications fonctionnelles
- ✅ `docs/` - Documentation architecture et dépendances

### 5. DevOps
- ✅ Docker Compose (PostgreSQL 15-alpine, healthcheck, volume pgdata)
- ✅ Scripts PowerShell (setup.ps1 - installation automatique)
- ✅ README.md et SETUP.md détaillés

## ⏳ En Attente / À Implémenter

### 6. Mini-Jeux (client/src/games/)
- ⏳ `LotoSons.tsx` - Jeu 1: Loto des sons (écouter son, identifier image)
- ⏳ `PecheLettres.tsx` - Jeu 2: Pêche aux lettres (attraper lettres qui défilent)
- ⏳ `CourseSyllabes.tsx` - Jeu 3: Course des syllabes (assembler syllabes)
- ⏳ `DicteeKaraoke.tsx` - Jeu 4: Dictée karaoké (écrire mot entendu)
- ⏳ Intégration Web Speech API (TTS)
- ⏳ Timer par mini-jeu
- ⏳ Animations Framer Motion (apparition, succès, erreur)
- ⏳ Système de stars (0-3) et calcul XP

### 7. Composants UI Réutilisables (client/src/components/)
- ⏳ `AvatarGrid.tsx` - Sélection avatar (12 choix)
- ⏳ `BigButton.tsx` - Bouton tactile grand format
- ⏳ `LevelTile.tsx` - Tuile de niveau avec étoiles
- ⏳ `BadgeWall.tsx` - Mur des badges (6 max)
- ⏳ `StickerBook.tsx` - Livre d'autocollants (12 max)
- ⏳ `Timer.tsx` - Chronomètre visuel enfant
- ⏳ `ProgressBar.tsx` - Barre de progression XP
- ⏳ Radix UI Dialog (paramètres, confirmation suppression)
- ⏳ Radix UI Select (sélection profil, âge)
- ⏳ Radix UI Slider (session duration)
- ⏳ Radix UI Switch (settings toggle)

### 8. PWA (Progressive Web App)
- ✅ Manifest configuré dans `vite.config.ts`
- ⏳ Service Worker Workbox (cache stratégies)
- ⏳ Offline queue sync (enregistrer actions offline → sync au retour online)
- ⏳ Icônes PWA (192×192, 512×512)
- ⏳ Apple touch icon

### 9. Tests
- ⏳ **Backend (Vitest + Supertest)**:
  - Tests unitaires controllers (profil, progression, rewards)
  - Tests d'intégration API (routes)
  - Tests Prisma (seed, migrations)
- ⏳ **Frontend (Vitest + Testing Library)**:
  - Tests composants (AvatarGrid, LevelTile, etc.)
  - Tests stores Zustand (profileStore, progressStore)
  - Tests pages (ProfileSelect, WorldMap)
- ⏳ **E2E (Playwright)**:
  - Parcours utilisateur complet (création profil → jeu → progression)
  - Offline/online sync
  - Export/import
- ⏳ **Accessibilité (axe-core)**:
  - Tests automatisés WCAG 2.2 AA
  - Navigation clavier
  - Lecteurs d'écran

### 10. Intégration Continue
- ⏳ Husky hooks (pre-commit: lint-staged)
- ⏳ lint-staged (ESLint + Prettier)
- ⏳ commitlint (conventional commits)
- ⏳ GitHub Actions (CI: tests, build, deploy)

### 11. Fonctionnalités Parent Dashboard
- ⏳ Graphiques de progression (recharts ou chartjs)
- ⏳ Export CSV/JSON par profil
- ⏳ Import JSON (restauration)
- ⏳ Statistiques d'erreurs (top 5 compétences à travailler)
- ⏳ Temps de jeu par profil
- ⏳ Configuration globale app

### 12. Déploiement
- ⏳ Dockerfile client (Nginx Alpine)
- ⏳ Dockerfile server (Node Alpine)
- ⏳ Docker Compose production (3 services: db, server, client)
- ⏳ Variables d'environnement production
- ⏳ Configuration HTTPS (Let's Encrypt)
- ⏳ Scripts de backup PostgreSQL

## 📊 Statistiques Projet

### Fichiers générés (nouveaux)
- **Backend:** 15 fichiers TypeScript
- **Frontend:** 15 fichiers TypeScript/TSX/CSS/Config
- **Configuration:** 7 fichiers (package.json, docker-compose, etc.)
- **Documentation:** 2 fichiers (SETUP.md, setup.ps1)
- **Total:** ~39 nouveaux fichiers

### Lignes de code (estimation)
- **Backend (server/):** ~1,200 lignes
- **Frontend (client/):** ~800 lignes
- **Config + Docs:** ~500 lignes
- **Total:** ~2,500 lignes

### Modèles de données
- **6 modèles Prisma**
- **12 niveaux de jeu**
- **10 compétences (vowels + digraphs)**
- **60 mots CE1**

### API Endpoints
- **14 endpoints REST** (5 routes × ~3 méthodes)

## 🚀 Prochaines Étapes Recommandées

1. **Installation & Vérification**
   ```powershell
   .\setup.ps1  # Installation automatique
   npm run dev  # Démarrage dev
   ```
   Vérifier:
   - http://localhost:3000/health → `{"status":"ok"}`
   - http://localhost:5173 → Interface profils

2. **Implémenter 1 Mini-Jeu (MVP)**
   - Commencer par `LotoSons.tsx` (le plus simple)
   - Intégrer Web Speech API
   - Système de stars + calcul XP
   - Enregistrement progression

3. **Composants UI de Base**
   - `AvatarGrid` pour création profil
   - `LevelTile` pour WorldMap
   - `Timer` pour les jeux

4. **Tests Unitaires Backend**
   - profileController tests
   - progressController tests
   - Routes integration tests

5. **PWA Offline**
   - Service Worker
   - Offline queue
   - Sync logic

6. **Tests E2E**
   - Playwright setup
   - Scénario principal

7. **Déploiement**
   - Docker production
   - CI/CD GitHub Actions

## 📋 Checklist Validation

### Backend ✅
- [x] Express server configured
- [x] Prisma schema (6 models)
- [x] Seed script (12 levels, 10 skills)
- [x] 14 API endpoints
- [x] Zod validation
- [x] Error handling middleware
- [x] Health check

### Frontend ⏳
- [x] React + Vite setup
- [x] Tailwind custom theme
- [x] 4 pages (ProfileSelect, WorldMap, Game, ParentDashboard)
- [x] Zustand stores (profile, progress)
- [x] API service layer
- [x] i18n French translations
- [ ] 4 mini-games implemented
- [ ] UI components library
- [ ] Accessibility (ARIA, keyboard nav)

### DevOps ✅
- [x] Docker Compose (PostgreSQL)
- [x] Setup script (PowerShell)
- [x] Documentation (README, SETUP)
- [ ] Tests (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Production deployment

---

**État global:** 60% complété (infrastructure + API ✅, jeux + tests ⏳)
