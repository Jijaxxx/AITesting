# Diagrammes Techniques

## Architecture Globale

```mermaid
graph TB
    subgraph Client ["Client (React SPA)"]
        UI[Interface Utilisateur]
        Store[Store Zustand]
        PWA[Service Worker]
        Games[Mini-jeux Canvas]
        TTS[Moteur TTS]
        IndexedDB[(IndexedDB)]
    end

    subgraph API ["Backend (Express)"]
        Routes[Routes API]
        Controllers[Controllers]
        Services[Services]
        Middleware[Middleware]
    end

    subgraph DB ["Base de données"]
        MongoDB[(MongoDB)]
    end

    UI --> Store
    Store --> PWA
    PWA --> IndexedDB
    Store --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> MongoDB
```

## Flux d'Authentification Parent

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant UI as Interface
    participant S as Store
    participant C as Cache
    
    U->>UI: Clic bouton parent
    UI->>UI: Affiche challenge arithmétique
    U->>UI: Répond au challenge
    UI->>S: Vérifie réponse
    alt Réponse correcte
        S->>C: Stocke accès parent (30min)
        UI->>UI: Affiche espace parent
    else Réponse incorrecte
        UI->>UI: Affiche erreur
    end
```

## Flux de Jeu

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant G as Jeu
    participant S as Store
    participant A as API
    participant DB as MongoDB
    
    U->>G: Commence niveau
    G->>G: Initialise canvas
    G->>S: Charge assets
    
    loop Pendant le jeu
        U->>G: Action joueur
        G->>G: Traite action
        G->>S: Update score/état
    end
    
    G->>S: Fin niveau
    S->>A: POST /progress
    A->>DB: Sauve progression
    A-->>S: Confirme + rewards
    S->>G: Affiche résultats
```

## Synchronisation Offline

```mermaid
sequenceDiagram
    participant C as Client
    participant SW as Service Worker
    participant IDB as IndexedDB
    participant A as API
    
    C->>SW: Action offline
    SW->>IDB: Stock événement
    
    loop Jusqu'à connexion
        SW->>A: Tente sync
        alt En ligne
            A->>A: Traite événements
            A-->>SW: OK
            SW->>IDB: Nettoie queue
        else Hors ligne
            A-->>SW: Erreur
            Note over SW: Réessaie plus tard
        end
    end
```

## Architecture Mini-jeux

```mermaid
classDiagram
    class BaseGame {
        <<abstract>>
        #config: GameConfig
        #canvas: HTMLCanvasElement
        #assets: GameAssets
        +init() Promise
        +start() void
        +pause() void
        +resume() void
        +cleanup() void
    }
    
    class LotoSons {
        -sounds: Map<string, AudioBuffer>
        -images: Map<string, ImageBitmap>
        +init()
        +start()
    }
    
    class PecheLettres {
        -letters: Array<Letter>
        -physics: PhysicsEngine
        +init()
        +start()
    }
    
    BaseGame <|-- LotoSons
    BaseGame <|-- PecheLettres
```

## Flux de Données

```mermaid
graph LR
    subgraph Client
        A[Action User] --> B[Store]
        B --> C[State UI]
        B --> D[IndexedDB]
    end
    
    subgraph Server
        E[API Routes] --> F[Controllers]
        F --> G[Services]
        G --> H[MongoDB]
    end
    
    B --> E
    D --> E
```

## Gestion d'État

```mermaid
stateDiagram-v2
    [*] --> SelectProfile
    SelectProfile --> WorldMap
    WorldMap --> Game
    Game --> Results
    Results --> WorldMap
    WorldMap --> ParentSpace
    ParentSpace --> WorldMap
```

## Pipeline CI/CD (Suggestion)

```mermaid
graph TD
    A[Push] -->|Trigger| B[Build]
    B --> C[Lint]
    C --> D[Test]
    D --> E[Build Assets]
    E --> F[Deploy Dev]
    F --> G[E2E Tests]
    G -->|Manual| H[Deploy Prod]
```

## Modèle de Données

```mermaid
erDiagram
    PROFILE ||--o{ PROGRESS : has
    PROFILE ||--o{ REWARD : earns
    PROFILE ||--o{ ERROR : makes
    
    PROGRESS {
        ObjectId _id
        ObjectId profileId
        int world
        int level
        int stars
        int xp
        date lastPlayedAt
    }
    
    REWARD {
        ObjectId _id
        ObjectId profileId
        array badges
        array stickers
    }
    
    ERROR {
        ObjectId _id
        ObjectId profileId
        string skillKey
        int count
    }
```

## Flux Audio et TTS

```mermaid
sequenceDiagram
    participant G as Game
    participant AS as AudioService
    participant TTS as WebSpeech
    participant Cache as AudioCache
    
    G->>AS: playSound(key)
    AS->>Cache: check cache
    alt In cache
        Cache-->>AS: return buffer
    else Not in cache
        AS->>AS: load audio file
        AS->>Cache: store buffer
    end
    AS-->>G: play completed
    
    G->>AS: speak(text)
    AS->>TTS: synthesize
    alt TTS available
        TTS-->>AS: audio stream
    else TTS failed
        AS->>Cache: load fallback audio
    end
    AS-->>G: speech completed
```

## Système de Récompenses

```mermaid
graph TB
    A[Action Joueur] --> B{Score suffisant?}
    B -->|Oui| C[Calcul Récompense]
    B -->|Non| D[Feedback Encouragement]
    C --> E{Type Récompense}
    E -->|Étoiles| F[Attribution Étoiles]
    E -->|Badge| G[Déblocage Badge]
    E -->|Sticker| H[Déblocage Sticker]
    F --> I[Sauvegarde]
    G --> I
    H --> I
    I --> J[Animation Récompense]
```