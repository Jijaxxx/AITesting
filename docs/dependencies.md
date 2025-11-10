# Dépendances recommandées

Ce document liste les dépendances recommandées pour les deux parties de l'application et pourquoi elles sont nécessaires.

## Backend (Node.js / TypeScript / Prisma / PostgreSQL)

- express — Framework HTTP
- @prisma/client — Client Prisma pour accéder à PostgreSQL
- prisma — Outil de migration et génération du client (devDependency)
- pg — driver PostgreSQL
- zod — validation des requêtes
- dotenv — charger les variables d'environnement
- helmet — sécurité des entêtes HTTP
- cors — CORS
- pino — logging

DevDependencies:
- typescript, ts-node, ts-node-dev — exécution et compilation TS
- eslint, prettier — lint & format
- @types/express, @types/node — types

## Frontend (React / Vite)

- react, react-dom — UI
- vite — bundler et dev server
- @vitejs/plugin-react — plugin React
- tailwindcss, postcss, autoprefixer — utilitaires CSS
- axios — client HTTP (ou fetch native)
- zustand — state management léger
- framer-motion — animations

## Commandes d'installation (exemples)

Backend (installer les dépendances listées dans `server/package.json`):

```powershell
cd server
npm install
```

Frontend:

```powershell
cd client
npm install
```

## Notes
- Je recommande d'utiliser `pnpm` ou `npm` selon vos préférences. Pour CI, pins de version précises sont utiles.
- Pour Prisma, il faudra initialiser le `prisma/schema.prisma` et définir `DATABASE_URL` dans `.env`.
