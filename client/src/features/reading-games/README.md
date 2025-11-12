# Reading Games Module

Module de jeux de lecture pour l'application Lectio.

# Reading Games Module

Module de jeux de lecture pour l'application Lectio.

## 📚 Vue d'ensemble

Les Reading Games sont une collection de **6 mini-jeux éducatifs** conçus pour enseigner la lecture aux enfants de manière ludique et progressive. Le module suit une architecture modulaire et isolée avec **système de progression séquentielle** : chaque niveau doit être validé (≥1⭐) pour débloquer le suivant.

## 🎮 Jeux Implémentés ✅

Tous les 6 jeux sont **production-ready** avec système de déverrouillage :

### Niveau 1 : 🔊 MagicSound (sound_to_letter)
- **Objectif** : Associer un son phonétique à la lettre correspondante
- **Mécanique** : Écoute du son → choix parmi 3 lettres
- **Phonèmes** : 20 sons (a-z + ch, ou, on, an, in)
- **Rounds** : 8 questions
- **Débloqué** : ✅ Toujours (premier niveau)

### Niveau 2 : � GestureToLetter (gesture_to_letter)
- **Objectif** : Associer un geste Borel-Maisonny à la lettre
- **Mécanique** : Vue d'un geste (emoji + description) → choix parmi 3 lettres
- **Gestes** : 10 gestes différents (f, s, m, l, r, ch, a, o, i, u)
- **Rounds** : 6 questions
- **Débloqué** : Si Niveau 1 ≥ 1⭐

### Niveau 3 : 🎵 FriendsOfSounds (character_sound_matching)
- **Objectif** : Associer lettres et images qui commencent par le même son
- **Mécanique** : Matching game (clic lettre → clic image)
- **Paires** : 8 paires disponibles (a/avion, b/ballon, s/serpent, etc.)
- **Rounds** : 5 paires à trouver
- **Débloqué** : Si Niveau 2 ≥ 1⭐

### Niveau 4 : 🔤 MagicSyllables (syllable_builder)
- **Objectif** : Construire des syllabes en assemblant 2 lettres
- **Mécanique** : Écoute syllabe → sélection de 2 lettres → validation
- **Syllabes** : MA, PA, FA, LA, LI, LO, LU, MI, PI, FI
- **Rounds** : 8 questions
- **Débloqué** : Si Niveau 3 ≥ 1⭐

### Niveau 5 : 📖 HiddenWords (word_to_image)
- **Objectif** : Lire et associer un mot à son image
- **Mécanique** : Vue d'une image → choix parmi 3 mots écrits
- **Mots** : 10 mots (chat, lune, papa, maman, ballon, etc.)
- **Rounds** : 7 questions
- **Débloqué** : Si Niveau 4 ≥ 1⭐

### Niveau 6 : 📗 MagicStory (sentence_comprehension)
- **Objectif** : Lire une phrase et répondre à une question de compréhension
- **Mécanique** : Lecture phrase (+ audio) → question → choix parmi 3 réponses
- **Phrases** : 8 phrases avec questions
- **Rounds** : 6 questions
- **Débloqué** : Si Niveau 5 ≥ 1⭐

## 🏗️ Architecture

### Structure des fichiers

```
client/src/features/reading-games/
├── core/
│   ├── types.ts              # Types TypeScript (GameType, ReadingGame, Progress)
│   ├── catalog.seed.json     # Catalogue des 6 jeux avec métadonnées
│   └── adapter.ts            # Adaptateur avec offline-first + système de déverrouillage
├── games/
│   ├── MagicSound.tsx        # Niveau 1: Son vers Lettre ✅
│   ├── GestureToLetter.tsx   # Niveau 2: Gestes Borel-Maisonny ✅
│   ├── FriendsOfSounds.tsx   # Niveau 3: Matching lettre-image ✅
│   ├── MagicSyllables.tsx    # Niveau 4: Construction de syllabes ✅
│   ├── HiddenWords.tsx       # Niveau 5: Mot vers image ✅
│   └── MagicStory.tsx        # Niveau 6: Compréhension de phrases ✅
├── ui/
│   ├── ReadingGamesHome.tsx  # Page d'accueil avec progression séquentielle
│   ├── GameLoader.tsx        # Chargeur dynamique des 6 jeux
│   └── ProgressPage.tsx      # Page de progression globale
├── PROGRESSION.md            # 📘 Documentation système de progression
└── README.md                 # Ce fichier
```

### Services externes

```
client/src/services/
└── phonemeAudio.ts           # Service de prononciation phonétique avancée
```

### Pattern d'adaptateur

Le module utilise un **adapter pattern** pour s'intégrer avec les services existants sans modifier la base de données ni casser les fonctionnalités existantes. Il inclut également :

- **Offline-First** : Sauvegarde automatique dans localStorage si l'API est indisponible
- **Système de déverrouillage** : Logique de progression séquentielle intégrée
- **Synchronisation** : Push automatique des données locales quand l'API revient en ligne

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
  world: 4,   // World 4 réservé pour Reading Games
  level: 1,   // Dérivé du slug (magic-sound = level 1)
  stars: 3,
  xp: 95      // Score stocké comme XP
})

// Vérification déverrouillage
ReadingGamesAdapter.isGameUnlocked('gesture-to-letter', progress)
// → true si 'magic-sound' a au moins 1⭐

// Stockage offline automatique si API indisponible
// localStorage key: 'rg-progress:<userId>'
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

### Progression Séquentielle 🔒

Les jeux sont organisés en **6 niveaux** avec déverrouillage progressif :

1. **Niveau 1 toujours accessible** (MagicSound)
2. **Niveaux 2-6 verrouillés** jusqu'à validation du niveau précédent
3. **Validation** : Obtenir au moins **1 étoile** (≥50% de réussite)
4. **UI verrouillée** : Icône 🔒, opacité réduite, message explicatif

**Exemple de flux** :
```
Niveau 1 (Magic Sound) → Jouer → Score 75% → 2⭐ → Validé ✅
  ↓
Niveau 2 (Gesture to Letter) → Débloqué 🔓 → Jouer
  ↓
Niveau 3 (Friends of Sounds) → Toujours verrouillé 🔒
```

### Calcul des étoiles

Chaque jeu calcule les étoiles en fonction du score :

- **3 étoiles** : ≥ 90% de réussite
- **2 étoiles** : ≥ 70% de réussite
- **1 étoile** : ≥ 50% de réussite
- **0 étoile** : < 50% de réussite

### Sauvegarde automatique (Offline-First)

La progression est sauvegardée **automatiquement** avec fallback offline :

```typescript
// Essai sauvegarde API
await ReadingGamesAdapter.upsertProgress({
  userId: currentProfile.id,
  gameSlug: 'magic-sound',
  stars: 3,
  score: 95,
  completed: true
})

// ❌ Si API indisponible → localStorage automatiquement
// ✅ Quand API revient → bouton "Forcer la synchronisation"
```

**Indicateurs UI** :
- Badge "En ligne" (vert) / "Hors ligne" (rouge)
- Bannière jaune d'avertissement si offline
- Bouton de synchronisation manuelle

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

### ✅ Implémentation Complète (v1.0)
- [x] Types et interfaces
- [x] Catalogue de jeux
- [x] Adapter pattern avec offline-first
- [x] **Système de progression séquentielle**
- [x] **MagicSound** (Niveau 1)
- [x] **GestureToLetter** (Niveau 2)
- [x] **FriendsOfSounds** (Niveau 3)
- [x] **MagicSyllables** (Niveau 4)
- [x] **HiddenWords** (Niveau 5)
- [x] **MagicStory** (Niveau 6)
- [x] ReadingGamesHome UI avec verrouillage
- [x] GameLoader dynamique
- [x] ProgressPage
- [x] Routing intégré
- [x] Feature flag
- [x] PhonemeAudioService (prononciation avancée)
- [x] Documentation complète (PROGRESSION.md)

### 🚀 Améliorations Futures (v2.0)
- [ ] **i18n** : Traductions EN/FR complètes
- [ ] **Analytics** : Tracking des scores, temps de jeu, abandons
- [ ] **Animations** : Effets de déverrouillage, confettis
- [ ] **Assets** : Vrais images Borel-Maisonny, photos au lieu d'emojis
- [ ] **Audio** : Fichiers pré-enregistrés pour meilleure qualité
- [ ] **Mode révision** : Rejouer uniquement les erreurs
- [ ] **Badges** : Système de récompenses (médailles, succès)
- [ ] **Tests automatisés** : Unit + E2E tests

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
