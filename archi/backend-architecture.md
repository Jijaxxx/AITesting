# Architecture Backend

## Structure des Dossiers

```
server/
├── src/
│   ├── controllers/         # Contrôleurs REST
│   │   ├── profiles.ts     # Gestion profils
│   │   ├── progress.ts     # Gestion progression
│   │   ├── rewards.ts      # Gestion récompenses
│   │   └── sync.ts         # Synchronisation
│   │
│   ├── models/             # Modèles (Prisma client wrappers)
│   │   ├── profile.ts      # Accès modèles via Prisma
│   │   ├── progress.ts     # Requêtes liées à la progression
│   │   ├── error.ts        # Requêtes erreurs
│   │   └── reward.ts       # Requêtes récompenses
│   │
│   ├── services/           # Services métier
│   │   ├── profile/        # Service profils
│   │   ├── progress/       # Service progression
│   │   ├── reward/         # Service récompenses
│   │   └── sync/          # Service synchronisation
│   │
│   ├── middleware/         # Middlewares Express
│   │   ├── error.ts       # Gestion erreurs
│   │   ├── validation.ts  # Validation requêtes
│   │   ├── logger.ts      # Logging
│   │   └── metrics.ts     # Métriques (optionnel)
│   │
│   ├── routes/            # Routes API
│   │   ├── profiles.ts    # Routes profils
│   │   ├── progress.ts    # Routes progression
│   │   ├── rewards.ts     # Routes récompenses
│   │   └── sync.ts        # Routes sync
│   │
│   ├── utils/             # Utilitaires
│   │   ├── errors.ts      # Classes d'erreur
│   │   ├── validators.ts  # Validateurs
│   │   └── helpers.ts     # Helpers
│   │
│   └── config/            # Configuration
│       ├── database.ts    # Config MongoDB
│       ├── server.ts      # Config Express
│       └── logger.ts      # Config logging
│
├── seeds/                 # Scripts seed DB
│   ├── skills.ts         # Sons et graphèmes
│   └── levels.ts         # Niveaux et mondes
```

## Architecture des Composants

### Contrôleurs

```typescript
// Base controller
abstract class BaseController {
  protected service: any;
  
  abstract create(req: Request, res: Response): Promise<void>;
  abstract get(req: Request, res: Response): Promise<void>;
  abstract update(req: Request, res: Response): Promise<void>;
  abstract delete(req: Request, res: Response): Promise<void>;
  
  protected handleError(error: Error, res: Response): void;
}

// Profile controller
class ProfileController extends BaseController {
  constructor(private profileService: ProfileService) {
    super();
  }
  
  async create(req: Request, res: Response) {
    const profile = await this.profileService.create(req.body);
    res.status(201).json(profile);
  }
  
  // Autres méthodes...
}
```

### Services

```typescript
// Interface service
interface IProfileService {
  create(data: CreateProfileDTO): Promise<Profile>;
  findById(id: string): Promise<Profile>;
  update(id: string, data: UpdateProfileDTO): Promise<Profile>;
  delete(id: string): Promise<void>;
}

// Implémentation
class ProfileService implements IProfileService {
  constructor(private profileModel: Model<Profile>) {}
  
  async create(data: CreateProfileDTO): Promise<Profile> {
    const profile = new this.profileModel(data);
    return await profile.save();
  }
  
  // Autres méthodes...
}
```

### Modèles

Dans la nouvelle architecture nous utilisons Prisma comme ORM pour PostgreSQL. Les modèles Prisma sont décrits dans `prisma/schema.prisma` et exposés via le client Prisma (`@prisma/client`). Les fichiers dans `src/models` contiennent des wrappers ou fonctions utilitaires qui exécutent des requêtes Prisma (sélection, jointures, transactions, etc.).

Exemple d'accès via Prisma dans un service:

```typescript
import { prisma } from '../prisma/client';

export const createProfile = async (data: CreateProfileDTO) => {
  return await prisma.profile.create({ data });
};
```

## Gestion des Erreurs

### Hiérarchie d'Erreurs

```typescript
// Erreur de base
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Erreurs spécifiques
class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}
```

### Middleware Erreurs

```typescript
// Middleware erreur global
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  // Erreur par défaut
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
};
```

## Validation

### Schémas Zod

```typescript
// Schéma profil
const createProfileSchema = z.object({
  pseudo: z.string().min(2).max(20),
  age: z.number().min(3).max(10),
  avatarKey: z.string(),
  settings: z.object({
    font: z.enum(['default', 'opendyslexic']),
    contrast: z.enum(['normal', 'high']),
    reduceMotion: z.boolean(),
    sessionMinutes: z.number().min(5).max(30)
  }).optional()
});

// Middleware validation
const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new ValidationError(error.message));
    }
  };
};
```

## Configuration

### Variables d'Environnement

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  MONGODB_URI: z.string()
    .startsWith('mongodb+srv://')
    .url(),
  MONGODB_DB_NAME: z.string(),
  CORS_ORIGIN: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error'])
});

export const env = envSchema.parse(process.env);
```

### Configuration Express

```typescript
// config/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './env';

export function configureServer(app: express.Application) {
  // Security
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }));
  
  // Parsing
  app.use(express.json({ limit: '1mb' }));
  
  // Compression
  app.use(compression());
  
  return app;
}
```

## Logging

### Configuration Pino

```typescript
// config/logger.ts
import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Middleware logging
export const requestLogger = pino.expressMixin({
  customProps: (req) => ({
    method: req.method,
    url: req.url
  })
});
```

## Tests

### Configuration Tests

Nous utilisons Jest (ou Vitest) pour les tests unitaires et d'intégration. Un helper `createTestServer` initialise une instance Express avec la configuration (middleware, mocks). Pour les tests d'intégration contre la base de données, utiliser une base PostgreSQL de test ou une instance Docker Postgres isolée et appliquer les migrations avant les tests.

Extrait de configuration Jest/Vitest:

```typescript
// jest.config.ts (exemple)
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/*.test.ts']
};
```

## Performance

### Optimisations PostgreSQL

- Créer des indexes sur les colonnes fréquemment interrogées (`profile_id`, `last_played_at`, `world, level`).
- Utiliser des vues matérialisées si nécessaire pour les rapports.
- Optimiser les requêtes Prisma en limitant les includes et en utilisant des projections.

```sql
CREATE INDEX idx_progress_profile_lastplayed ON progress(profile_id, last_played_at DESC);
CREATE INDEX idx_skills_profile_key ON skills(profile_id, skill_key);
```

### Caching (Optionnel)

```typescript
// services/cache.ts
import { createClient } from 'redis';

const client = createClient();

export class CacheService {
  async get(key: string): Promise<any>;
  async set(key: string, value: any, ttl?: number): Promise<void>;
  async invalidate(pattern: string): Promise<void>;
}
```

## Métriques (Optionnel)

```typescript
// middleware/metrics.ts
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code']
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.route?.path ?? req.path, res.statusCode.toString())
      .observe(duration);
  });
  next();
};
```