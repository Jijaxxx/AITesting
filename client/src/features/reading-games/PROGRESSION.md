# Reading Games - Guide de Progression

## Vue d'ensemble

Le module Reading Games propose **6 jeux de lecture** organisés en **progression séquentielle**. Chaque niveau doit être complété (au moins 1 étoile) pour débloquer le suivant.

## Système de Niveaux

### Niveau 1 : Sons Magiques (Magic Sound)
- **Type**: `sound_to_letter`
- **Objectif**: Associer un son phonétique à la lettre correspondante
- **Mécanique**: Écoute du son → choix parmi 3 lettres
- **Phonèmes**: 20 sons (a, e, i, o, u, f, s, m, l, r, n, p, t, ch, ou, on, an, in)
- **Rounds**: 8 questions
- **Statut**: ✅ **Toujours débloqué** (premier niveau)

### Niveau 2 : Gestes des Lettres (Gesture to Letter)
- **Type**: `gesture_to_letter`
- **Objectif**: Associer un geste Borel-Maisonny à la lettre
- **Mécanique**: Vue d'un geste (emoji + description) → choix parmi 3 lettres
- **Gestes**: f, s, m, l, r, ch, a, o, i, u (10 gestes)
- **Rounds**: 6 questions
- **Débloqué**: Si Niveau 1 ≥ 1⭐

### Niveau 3 : Amis des Sons (Friends of Sounds)
- **Type**: `character_sound_matching`
- **Objectif**: Associer lettres et images qui commencent par le même son
- **Mécanique**: Jeu de matching (clic lettre → clic image)
- **Paires**: a/avion, b/ballon, s/serpent, m/maman, l/lune, ch/chat, f/fille, p/pain
- **Paires à trouver**: 5
- **Débloqué**: Si Niveau 2 ≥ 1⭐

### Niveau 4 : Syllabes Magiques (Magic Syllables)
- **Type**: `syllable_builder`
- **Objectif**: Construire des syllabes en assemblant 2 lettres
- **Mécanique**: Écoute syllabe → sélection de 2 lettres dans l'ordre → validation
- **Syllabes**: MA, PA, FA, LA, LI, LO, LU, MI, PI, FI
- **Rounds**: 8 questions
- **Débloqué**: Si Niveau 3 ≥ 1⭐

### Niveau 5 : Mots Cachés (Hidden Words)
- **Type**: `word_to_image`
- **Objectif**: Lire et associer un mot à son image
- **Mécanique**: Vue d'une image (emoji) → choix parmi 3 mots écrits
- **Mots**: chat, lune, papa, maman, ballon, maison, pain, loup, fleur, soleil
- **Rounds**: 7 questions
- **Débloqué**: Si Niveau 4 ≥ 1⭐

### Niveau 6 : Histoire Magique (Magic Story)
- **Type**: `sentence_comprehension`
- **Objectif**: Lire une phrase et répondre à une question de compréhension
- **Mécanique**: Lecture phrase (+ audio) → question → choix parmi 3 réponses
- **Phrases**: 8 phrases simples (ex: "Le chat mange du poisson")
- **Rounds**: 6 questions
- **Débloqué**: Si Niveau 5 ≥ 1⭐

## Calcul des Étoiles

Pour **tous les jeux**, les étoiles sont calculées selon le pourcentage de bonnes réponses :

```typescript
const percentage = (score / totalQuestions) * 100;

if (percentage >= 90) stars = 3; // ⭐⭐⭐
else if (percentage >= 70) stars = 2; // ⭐⭐
else if (percentage >= 50) stars = 1; // ⭐
else stars = 0; // Aucune étoile
```

**Règle importante**: Il faut **au moins 1 étoile** (≥50% de bonnes réponses) pour qu'un niveau soit considéré comme "validé" et débloque le suivant.

## Système de Déverrouillage

### Fonction `isGameUnlocked`

```typescript
isGameUnlocked(gameSlug: string, progress: ProgressView[]): boolean {
  const level = this.slugToLevel(gameSlug);
  
  // Niveau 1 toujours débloqué
  if (level === 1) return true;
  
  // Pour les autres, vérifier que le niveau précédent a ≥1 étoile
  const previousSlug = this.levelToSlug(level - 1);
  const previousProgress = progress.find(p => p.gameSlug === previousSlug);
  
  return previousProgress ? previousProgress.stars >= 1 : false;
}
```

### UI des Jeux Verrouillés

Quand un jeu est verrouillé :
- 🔒 Icône de cadenas affiché
- Opacité réduite (60%)
- Bouton "Jouer" désactivé
- Message: `"🔒 Termine "{Nom du jeu précédent}" pour débloquer ce niveau"`
- Curseur `not-allowed`

## Offline-First

Le système de progression fonctionne **hors ligne** :

1. **Sauvegarde locale** : Si l'API est indisponible, la progression est stockée dans `localStorage` avec la clé `rg-progress:<userId>`
2. **Synchronisation** : Bouton "Forcer la synchronisation" pour pousser les données locales vers le serveur quand il revient en ligne
3. **Merge intelligent** : Les meilleurs scores/étoiles sont conservés (jamais de régression)
4. **Indicateur** : Badge "En ligne" (vert) / "Hors ligne" (rouge)

## Flux de Jeu Typique

1. **Utilisateur sur ReadingGamesHome** → voit 6 cartes de jeux
2. **Niveau 1 débloqué** → clique "Jouer"
3. **GameLoader** charge MagicSound
4. **Jeu** : 8 rounds, calcul du score
5. **Écran de fin** : affiche étoiles, score, 2 boutons ("Quitter" / "Continuer")
6. **Clic "Continuer"** → `onFinish` appelé → sauvegarde progression → retour à ReadingGamesHome
7. **Niveau 2 maintenant débloqué** si Niveau 1 ≥ 1⭐

## Architecture Technique

### Adapter Pattern

```typescript
ReadingGamesAdapter.upsertProgress({
  userId: string,
  gameSlug: string,
  stars: 0 | 1 | 2 | 3,
  score: number,
  completed: boolean,
});
```

### Mapping world/level

Convention : `world = 4` pour tous les Reading Games
- `magic-sound` → level 1
- `gesture-to-letter` → level 2
- `friends-of-sounds` → level 3
- `magic-syllables` → level 4
- `hidden-words` → level 5
- `magic-story` → level 6

### Interface GameProps

Tous les jeux implémentent :

```typescript
interface GameProps {
  onFinish: (data: GameFinishData) => void;
  onQuit: () => void;
  config?: ReadingGame; // Optionnel, métadonnées du catalog
}

interface GameFinishData {
  stars: 0 | 1 | 2 | 3;
  score: number;
  completed: boolean;
}
```

## Prononciation Phonétique

Le module utilise **PhonemeAudioService** pour une prononciation pédagogique des sons complexes :

- **Nasales** (on, an, in) : exemples de mots ("bon son ton", "banc tant quand")
- **Digraphes** (ch, ou) : syllabe répétée ("cha cha cha", "cou tout loup")
- **Consonnes simples** : ajout de 'a' ("fa fa fa")
- **Paramètres TTS** : rate 0.6 (très lent), pitch 1.2 (voix enfantine)

## Tests de Progression

Pour tester le système complet :

1. Jouer au Niveau 1 (Magic Sound)
2. Obtenir au moins 50% (≥1⭐)
3. Vérifier que Niveau 2 se débloque
4. Répéter pour les 6 niveaux

**Test du verrouillage** :
1. Vider localStorage : `localStorage.removeItem('rg-progress:<userId>')`
2. Vérifier que seul Niveau 1 est débloqué
3. Tous les autres affichent 🔒

## Améliorations Futures

- [ ] Animations de déverrouillage (confettis, effet "unlock")
- [ ] Badge de progression global (ex: "3/6 niveaux complétés")
- [ ] Statistiques détaillées par niveau (temps moyen, tentatives)
- [ ] Mode révision : rejouer uniquement les questions ratées
- [ ] Système de récompenses cumulées (badges, médailles)
- [ ] Vrai assets graphiques (images Borel-Maisonny, photos au lieu d'emojis)
- [ ] Audio pré-enregistré pour les syllabes (qualité supérieure au TTS)

## Dépannage

### "Niveau 2 toujours verrouillé malgré 3⭐ au Niveau 1"

Vérifier :
```javascript
// Dans la console navigateur
const progress = JSON.parse(localStorage.getItem('rg-progress:<userId>'));
console.log(progress);
// Doit contenir : { gameSlug: 'magic-sound', stars: 3, ... }
```

Si vide → problème de sauvegarde (voir logs console pour erreurs API)

### "Progression non synchronisée après reconnexion"

1. Cliquer sur "Forcer la synchronisation"
2. Vérifier dans Network tab : POST /api/progress doit réussir
3. Si erreur 401 → problème d'authentification
4. Si erreur 500 → backend down

### "Jeu ne charge pas (écran blanc)"

1. Vérifier console : erreurs d'import ?
2. GameLoader.tsx : le switch case a-t-il le bon game_type ?
3. catalog.seed.json : game_type correspond-il au switch ?

---

**Dernière mise à jour** : Implémentation complète des 6 jeux avec système de progression séquentielle
**Statut** : ✅ Tous les niveaux implémentés et testables
