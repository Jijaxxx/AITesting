# Reading Games Module

Module de jeux de lecture pour l'application Lectio.

## 📚 Vue d'ensemble

Les Reading Games sont une collection de 6 mini-jeux éducatifs conçus pour enseigner la lecture aux enfants de manière ludique et progressive. Le module suit une architecture modulaire et isolée qui permet une intégration non-disruptive avec l'application existante.

## 🎮 Jeux disponibles

### Phase 1 (Implémenté)
- **✅ MagicSound** (`sound_to_letter`) - Difficulté: 1/3
  - Associer un son à la lettre correspondante
  - 8 rounds, 3 choix par round
  - Système d'étoiles: ≥90% = 3★, ≥70% = 2★, ≥50% = 1★

### Phase 2 (À venir)
- **🚧 GestureToLetter** (`gesture_to_letter`) - Difficulté: 1/3
  - Apprendre les gestes Borel-Maisonny
  
- **🚧 HiddenWords** (`word_to_image`) - Difficulté: 2/3
  - Associer des mots à des images

- **🚧 MagicStory** (`sentence_comprehension`) - Difficulté: 3/3
  - Compréhension de phrases et histoires

### Phase 3 (À venir)
- **🚧 FriendsOfSounds** (`character_sound_matching`) - Difficulté: 1/3
  - Identifier les personnages-sons

- **🚧 MagicSyllables** (`syllable_builder`) - Difficulté: 2/3
  - Construire des syllabes

## 🏗️ Architecture

### Structure des fichiers

```
client/src/features/reading-games/
├── core/
│   ├── types.ts              # Types TypeScript (GameType, ReadingGame, Progress)
│   ├── catalog.seed.json     # Catalogue des 6 jeux avec métadonnées
│   └── adapter.ts            # Adaptateur pour intégration avec services existants
├── games/
│   └── MagicSound.tsx        # Jeu #1: Son vers Lettre (implémenté)
└── ui/
    ├── ReadingGamesHome.tsx  # Page d'accueil listant les jeux
    ├── GameLoader.tsx        # Chargeur dynamique de jeux
    └── ProgressPage.tsx      # Page de progression globale
```

### Pattern d'adaptateur

Le module utilise un **adapter pattern** pour s'intégrer avec les services existants sans modifier la base de données ni casser les fonctionnalités existantes :

```typescript
// Reading Games utilise les mêmes tables mais avec des IDs distincts
ReadingGamesAdapter.upsertProgress({
  userId: profileId,
  gameSlug: 'magic-sound',
  stars: 3,
  score: 95,
  completed: true
})

// ↓ Mappé vers l'API existante ↓

progressApi.upsert({
  profileId: profileId,
  world: 99,  // ID réservé pour Reading Games
  level: 1,   // Dérivé du slug
  stars: 3,
  xp: 950     // score * 10
})
```

### Contrat de données

Tous les jeux implémentent la même interface :

```typescript
interface GameProps {
  onFinish: (data: {
    stars: 0 | 1 | 2 | 3;
    score: number;
    completed: boolean;
  }) => void;
  onQuit: () => void;
  config: ReadingGame;
}
```

## 🚀 Utilisation

### Accès aux Reading Games

1. **Depuis WorldMap** : Bouton "📚 Jeux de Lecture ✨"
2. **Direct** : Navigation vers `/reading-games`

### Routes

- `/reading-games` - Liste des jeux
- `/reading-games/:slug` - Jeu spécifique (ex: `/reading-games/magic-sound`)
- `/reading-games/progress` - Page de progression

### Feature Flag

Le module est contrôlé par un feature flag dans `config/features.ts` :

```typescript
export const FEATURES = {
  READING_GAMES_ENABLED: true,  // Active/désactive le module
}
```

## 📊 Système de progression

### Calcul des étoiles

Chaque jeu calcule les étoiles en fonction du score :

- **3 étoiles** : ≥ 90% de réussite
- **2 étoiles** : ≥ 70% de réussite
- **1 étoile** : ≥ 50% de réussite
- **0 étoile** : < 50% de réussite

### Sauvegarde automatique

La progression est sauvegardée automatiquement via l'adapter :

```typescript
await ReadingGamesAdapter.upsertProgress({
  userId: currentProfile.id,
  gameSlug: 'magic-sound',
  stars: 3,
  score: 95,
  completed: true
})
```

### Affichage de progression

- **Page d'accueil** : Étoiles gagnées par jeu (ex: ⭐⭐☆)
- **Page de progression** : 
  - Total d'étoiles (ex: 15/18)
  - Jeux complétés (ex: 5/6)
  - Pourcentage global (ex: 83%)
  - Détails par jeu avec meilleur score

## 🎨 Design

### Palette de couleurs

- **Primaire** : Indigo/Violet (jeux de lecture)
- **Facile** : Vert (difficulté 1)
- **Moyen** : Jaune (difficulté 2)
- **Difficile** : Rouge (difficulté 3)

### Animations

- **Framer Motion** : Transitions de page, cartes animées
- **Confetti** : Célébration des bonnes réponses
- **Hover effects** : Scale 105% au survol

## 🧪 Testing

### Tests manuels Phase 1

- [ ] Navigation : Home → Reading Games → MagicSound
- [ ] Audio : Lecture des sons de phonèmes
- [ ] Gameplay : Sélection des lettres, feedback visuel
- [ ] Scoring : Calcul correct des étoiles (90%, 70%, 50%)
- [ ] Progression : Sauvegarde et affichage correct
- [ ] Navigation retour : Quit et back button fonctionnels
- [ ] Responsive : Mobile, tablette, desktop
- [ ] Accessibilité : Navigation clavier, ARIA labels

### Tests Phase 2/3

- Ajouter tests pour chaque nouveau jeu
- Tests d'intégration multi-jeux
- Tests de performance (temps de chargement)

## 📝 Ajout d'un nouveau jeu

### Étapes

1. **Ajouter définition au catalogue** (`core/catalog.seed.json`)

```json
{
  "slug": "mon-nouveau-jeu",
  "title": "Mon Nouveau Jeu",
  "game_type": "word_to_image",
  "difficulty_level": 2,
  "description": "Description courte",
  "instructions": "Instructions détaillées",
  "assets": {
    "images": ["image1.jpg", "image2.jpg"]
  },
  "expected_output": { "config": "spécifique" }
}
```

2. **Créer composant jeu** (`games/MonNouveauJeu.tsx`)

```typescript
import { useState } from 'react';

interface Props {
  onFinish: (data: { stars: 0 | 1 | 2 | 3; score: number; completed: boolean }) => void;
  onQuit: () => void;
  config: any;
}

export default function MonNouveauJeu({ onFinish, onQuit, config }: Props) {
  // Logique du jeu
  
  const handleComplete = () => {
    const score = 85; // Calculer score
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
    onFinish({ stars, score, completed: true });
  };
  
  return (
    <div>
      {/* UI du jeu */}
      <button onClick={handleComplete}>Terminer</button>
      <button onClick={onQuit}>Quitter</button>
    </div>
  );
}
```

3. **Ajouter au GameLoader** (`ui/GameLoader.tsx`)

```typescript
import MonNouveauJeu from '../games/MonNouveauJeu';

// Dans renderGame()
case 'word_to_image':
  return <MonNouveauJeu onFinish={handleFinish} onQuit={handleQuit} config={game as any} />;
```

4. **Tester**

```bash
# Ouvrir /reading-games
# Cliquer sur le nouveau jeu
# Vérifier gameplay, scoring, sauvegarde
```

## 🔧 Configuration

### Assets

Les assets des jeux doivent être placés dans :

```
client/public/assets/reading-games/
├── audio/
│   ├── a.mp3
│   ├── ch.mp3
│   └── ...
├── images/
│   ├── word1.jpg
│   └── ...
└── gestures/
    ├── f.json
    └── ...
```

### i18n (À implémenter)

Créer fichiers de traduction :

- `client/src/i18n/reading-games.en.json`
- `client/src/i18n/reading-games.fr.json`

## 📈 Roadmap

### ✅ Phase 1 (Complété)
- [x] Types et interfaces
- [x] Catalogue de jeux
- [x] Adapter pattern
- [x] MagicSound game
- [x] ReadingGamesHome UI
- [x] GameLoader dynamique
- [x] ProgressPage
- [x] Routing intégré
- [x] Feature flag

### 🚧 Phase 2 (En cours)
- [ ] GestureToLetter
- [ ] HiddenWords
- [ ] MagicStory
- [ ] i18n EN/FR
- [ ] Tests manuels complets

### ⏳ Phase 3 (Planifié)
- [ ] FriendsOfSounds
- [ ] MagicSyllables
- [ ] SentenceComprehension
- [ ] Tests automatisés
- [ ] Analytics/telemetry
- [ ] Améliorations UX (animations, sons)

## 🤝 Contribution

Lors de l'ajout de nouveaux jeux, respecter :

1. **Interface commune** : Tous les jeux utilisent `GameProps`
2. **Calcul cohérent** : Étoiles basées sur 90/70/50%
3. **UX enfantine** : Gros boutons, couleurs vives, animations
4. **Accessibilité** : ARIA labels, navigation clavier
5. **Performance** : Lazy loading, optimisation des assets

## 📚 Ressources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Router v6](https://reactrouter.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
