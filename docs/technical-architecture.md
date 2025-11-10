# Architecture Technique - Application de Lecture

## Stack Technique

### Backend
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Validation**: Zod
- **Tests**: Jest

### Frontend
- **Framework**: React 18
- **Build**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Router**: React Router 6
- **Animations**: Framer Motion

## Structure de la Base de Données

### Tables

#### profiles
```sql
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(20) NOT NULL,
    age INTEGER CHECK (age BETWEEN 3 AND 10),
    avatar_key VARCHAR(50) NOT NULL,
    font_preference VARCHAR(20) DEFAULT 'default',
    contrast_mode VARCHAR(10) DEFAULT 'normal',
    reduce_motion BOOLEAN DEFAULT false,
    session_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### progress
```sql
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    world INTEGER CHECK (world BETWEEN 1 AND 3),
    level INTEGER CHECK (level BETWEEN 1 AND 4),
    stars INTEGER CHECK (stars BETWEEN 0 AND 3),
    xp INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    last_played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, world, level)
);
```

#### skills
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    skill_key VARCHAR(50) NOT NULL,
    success_rate DECIMAL(4,3) DEFAULT 0.0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, skill_key)
);
```

#### errors
```sql
CREATE TABLE errors (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    skill_key VARCHAR(50) NOT NULL,
    word VARCHAR(50) NOT NULL,
    expected VARCHAR(50) NOT NULL,
    given VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### rewards
```sql
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    UNIQUE(profile_id)
);
```

#### badges
```sql
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    badge_key VARCHAR(50) NOT NULL,
    level INTEGER DEFAULT 1,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, badge_key)
);
```

#### stickers
```sql
CREATE TABLE stickers (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    sticker_key VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, sticker_key)
);
```

## Structure du Projet

```
lectio/
├── server/                 # Backend Express/TypeScript
│   ├── src/
│   │   ├── config/        # Configuration (DB, env, etc.)
│   │   ├── controllers/   # Logique métier
│   │   ├── middleware/    # Middleware Express
│   │   ├── models/        # Modèles Prisma
│   │   ├── routes/        # Routes API
│   │   ├── services/      # Services métier
│   │   ├── utils/         # Utilitaires
│   │   └── validation/    # Schémas Zod
│   ├── prisma/            # Schémas et migrations Prisma
│   └── tests/             # Tests unitaires et d'intégration
│
├── client/                 # Frontend React
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Composants React
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Pages/Routes
│   │   ├── services/      # Services API
│   │   ├── store/         # State management Zustand
│   │   ├── styles/        # Styles globaux
│   │   └── utils/         # Utilitaires
│   └── tests/             # Tests frontend
│
└── docs/                  # Documentation
```

## API Endpoints

### Profils
- `GET /api/profiles` - Liste des profils
- `POST /api/profiles` - Création profil
- `GET /api/profiles/:id` - Détails profil
- `PATCH /api/profiles/:id` - Mise à jour profil
- `DELETE /api/profiles/:id` - Suppression profil

### Progrès
- `GET /api/progress/:profileId` - Progrès d'un profil
- `POST /api/progress` - Enregistrer progrès
- `PATCH /api/progress/:id` - Mettre à jour progrès

### Erreurs
- `GET /api/errors/:profileId` - Erreurs d'un profil
- `POST /api/errors` - Enregistrer une erreur

### Récompenses
- `GET /api/rewards/:profileId` - Récompenses d'un profil
- `POST /api/rewards` - Ajouter récompense
- `GET /api/rewards/:profileId/badges` - Badges d'un profil
- `GET /api/rewards/:profileId/stickers` - Stickers d'un profil

## Sécurité

- Validation des entrées avec Zod
- Protection CSRF
- Rate limiting
- Sanitization des données
- Logging sécurisé

## Performance

- Indexation PostgreSQL optimisée
- Mise en cache avec Redis (optionnel)
- Pagination des résultats
- Lazy loading des assets
- Code splitting React

## Monitoring

- Logging avec Winston
- Métriques avec Prometheus
- Traces avec OpenTelemetry
- Alerting (à définir)