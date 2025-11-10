# Spécification API REST

## Points d'Entrée API

Base URL: `/api` (backend Node.js; PORT configurable)

## Authentification

> MVP sans authentification. CORS restrictif + rate limiting par IP.

## Profils

### `GET /profiles`
Liste les profils enfants.

```typescript
Response 200:
{
  profiles: Array<{
    id: string;
    pseudo: string;
    age: number;
    avatarKey: string;
    settings: ProfileSettings;
    createdAt: string;
  }>;
}
```

### `POST /profiles`
Crée un nouveau profil.

```typescript
Request:
{
  pseudo: string;          // 2-20 chars
  age: number;            // 3-10
  avatarKey: string;      // Clé valide
  settings?: {
    font?: string;        // default|opendyslexic
    contrast?: string;    // normal|high
    reduceMotion?: boolean;
    sessionMinutes?: number; // 5-30
  };
}

Response 201:
{
  id: string;             // ID du profil créé
  pseudo: string;
  age: number;
  avatarKey: string;
  settings: ProfileSettings;
  createdAt: string;
}

Errors:
400 - Validation failed
409 - Pseudo already taken
```

### `PATCH /profiles/:id`
Modifie un profil existant.

```typescript
Request:
{
  pseudo?: string;
  age?: number;
  avatarKey?: string;
  settings?: Partial<ProfileSettings>;
}

Response 200:
{
  id: string;
  // ... données mises à jour
}

Errors:
404 - Profile not found
400 - Validation failed
```

### `DELETE /profiles/:id`
Supprime un profil et ses données associées.

```typescript
Response 204: No Content

Errors:
404 - Profile not found
```

## Progression

### `GET /progress/:profileId`
Récupère la progression d'un profil.

```typescript
Response 200:
{
  worlds: Array<{
    id: number;
    levels: Array<{
      id: number;
      stars: number;
      completed: boolean;
      bestScore: number;
      attempts: number;
      lastPlayedAt: string;
    }>;
  }>;
  currentLevel: {
    world: number;
    level: number;
  };
  totalXP: number;
  skillsProgress: Record<string, number>; // Taux par compétence
}

Errors:
404 - Profile not found
```

### `POST /progress`
Enregistre le résultat d'un niveau.

```typescript
Request:
{
  profileId: string;
  world: number;        // 1-3
  level: number;        // 1-4
  stars: number;        // 0-3
  xp: number;          // XP gagnés
  errors: Array<{      // Erreurs commises
    skillKey: string;  
    count: number;
  }>;
}

Response 201:
{
  stars: number;
  newLevel: boolean;   // Niveau débloqué
  totalXP: number;     // XP total
  rewards?: {          // Récompenses débloquées
    badges?: string[];
    stickers?: string[];
  };
}

Errors:
400 - Validation failed
404 - Profile not found
```

## Récompenses

### `GET /rewards/:profileId`
Liste les récompenses d'un profil.

```typescript
Response 200:
{
  badges: Array<{
    key: string;
    earnedAt: string;
    level: number;
  }>;
  stickers: Array<{
    key: string;
    unlockedAt: string;
  }>;
  totalXP: number;
  currentLevel: number;
}

Errors:
404 - Profile not found
```

### `POST /rewards`
Décerne une récompense.

```typescript
Request:
{
  profileId: string;
  type: 'badge' | 'sticker';
  key: string;         // Identifiant récompense
  level?: number;      // Niveau badge
}

Response 201:
{
  key: string;
  timestamp: string;
  newTotal: number;    // Total de ce type
}

Errors:
400 - Invalid reward
404 - Profile not found
409 - Already earned
```

## Synchronisation

### `POST /sync`
Synchronise les événements stockés offline.

```typescript
Request:
{
  profileId: string;
  events: Array<{
    type: string;      // Type événement
    data: any;         // Données à sync
    timestamp: string;
  }>;
}

Response 200:
{
  processed: number;   // Événements traités
  errors?: Array<{    // Erreurs éventuelles
    index: number;
    error: string;
  }>;
}
```

## Export/Import

### `GET /export/:profileId`
Exporte les données d'un profil.

```typescript
Response 200:
{
  profile: Profile;
  progress: Progress[];
  rewards: Reward;
  errors: Error[];
}

Errors:
404 - Profile not found
```

### `POST /import`
Importe des données de profil.

```typescript
Request:
{
  data: {             // Données exportées
    profile: Profile;
    progress: Progress[];
    rewards: Reward;
    errors: Error[];
  };
  options?: {
    merge?: boolean;  // Fusion ou remplacement
  };
}

Response 201:
{
  profileId: string;  // ID du profil importé
}

Errors:
400 - Invalid data format
409 - Conflict (sans merge)
```

## Gestion Erreurs

Format erreur standard:
```typescript
{
  error: {
    code: string;     // Code erreur
    message: string;  // Message utilisateur
    details?: any;    // Détails techniques
  }
}
```

Codes HTTP:
- 400: Requête invalide
- 404: Ressource non trouvée
- 409: Conflit
- 429: Trop de requêtes
- 500: Erreur serveur

## Limites et Quotas

- Rate limit: 100 req/min par IP
- Payload max: 1 MB
- Batch sync: 50 événements max
- Compression gzip > 1 KB

## Notes d'Implémentation

1. **Validation**
   - Utiliser Zod pour validation requêtes/réponses
   - Sanitizer les entrées (XSS, injection)
   - Valider types et formats stricts

2. **Performance**
   - Cache Redis pour données fréquentes (optionnel)
   - Compression réponses
   - Monitoring temps réponse

3. **Idempotence**
   - POST /progress: idempotent via (profileId+world+level)
   - POST /sync: rejeu sûr des événements
   - Clé idempotence dans headers POST sensibles