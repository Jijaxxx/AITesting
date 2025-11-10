# COPILOT INTEGRATION PROMPT — Add “Reading Games” (non-breaking, plug-in style)

You are an expert full-stack assistant. The app already exists with its own architecture, router, ORM, state management, and DB.
**Goal:** Add a new **top-level category** “Reading Games” containing **six new mini-games** and **group previously created games** under a dedicated category (e.g., “Legacy Games” or an equivalent that fits the project’s taxonomy) **without breaking any existing routes** or data models.

## Guardrails (must follow)

* **Do not refactor global architecture. Do not change existing public APIs or routes.**
* Follow existing **coding style, folder structure, ORM, and test frameworks**. Infer from repo.
* Add code as a **self-contained feature module** (namespaced) to minimize coupling.
* If a DB change is absolutely required, generate a **backward-compatible migration** behind a **feature flag** and **adapter**; otherwise, **reuse existing tables** and models by adding category records only.
* Keep all **naming** in English; strings for UI must go through existing **i18n**.
* Add a top-level **feature flag** `READING_GAMES_ENABLED` (default: enabled in dev).

## What to build (high level)

* A new **category** in the existing “Games” area (or equivalent nav): **Reading Games**.
* **Six mini-games** (self-contained React components, lazy-loaded) with a small shared runtime (context, helpers).
* A **progress** mechanism that reuses the existing progress/score storage if present; otherwise, create a **thin adapter** over the current persistence (no schema changes unless necessary).
* **Group existing games already created by Copilot** into a **distinct category** (“Legacy Games” or “Other Games”) without modifying their slugs or routes; only update their menu placement/metadata.

---

## Files & module layout (follow project conventions; adapt paths)

```
/src/features/reading-games/
  index.ts
  routes.ts
  ui/
    ReadingGamesHome.tsx
    ProgressPage.tsx
    components/
      StarMeter.tsx
      AudioButton.tsx
      BigButton.tsx
      Confetti.tsx
  games/
    MagicSound.tsx              // sound_to_letter
    GestureToLetter.tsx         // gesture_to_letter
    FriendsOfSounds.tsx         // character_sound_matching
    MagicSyllables.tsx          // syllable_builder
    HiddenWords.tsx             // word_to_image
    MagicStory.tsx              // sentence_comprehension
  core/
    types.ts
    config.ts
    adapter.ts                  // persistence & catalog adapters to existing ORM/API
    useReadingGames.tsx         // React context/provider
  assets/reading-games/         // images/audio/json (placeholder paths)
i18n/reading-games.en.json
i18n/reading-games.fr.json
```

> If the repo uses a different structure, mirror it and keep the module sandboxed.

---

## Data contracts (no schema changes unless needed)

```ts
// core/types.ts
export type GameType =
  | "sound_to_letter"
  | "gesture_to_letter"
  | "character_sound_matching"
  | "syllable_builder"
  | "word_to_image"
  | "sentence_comprehension";

export interface ReadingGame {
  id?: string | number;
  slug: string;                 // unique within Reading Games
  title: string;
  description?: string;
  difficulty_level: 1 | 2 | 3;
  game_type: GameType;
  instructions?: string;
  assets?: Record<string, string[]>;
  expected_output?: Record<string, unknown>;
  is_active?: boolean;
  category?: "reading-games";   // used by menu/catalog
}

export interface ProgressUpsert {
  userId: string;               // reuse existing user id type
  gameSlug: string;
  stars: 0 | 1 | 2 | 3;
  score?: number;
  completed?: boolean;
}

export interface ProgressView {
  gameSlug: string;
  stars: 0 | 1 | 2 | 3;
  best_score: number;
  completed: boolean;
  last_played_at: string;
}
```

### Adapter (reuse existing infra)

```ts
// core/adapter.ts
// Implement these by calling existing services/ORM/API.
// If a generic "games" table exists, add a category metadata entry (no breaking change).
export const ReadingGamesAdapter = {
  listCatalog: async (): Promise<ReadingGame[]> => {/* ... */},
  getBySlug: async (slug: string): Promise<ReadingGame | null> => {/* ... */},
  listUserProgress: async (userId: string): Promise<ProgressView[]> => {/* ... */},
  upsertProgress: async (p: ProgressUpsert): Promise<ProgressView> => {/* ... */}
};
```

* If the app already has a **GameCatalog** or **ProgressService**, write a **shim** that maps our contracts to the existing ones (no new tables).
* Only if there is no way to store per-game progress, add a **non-breaking** key-value entry in the existing progress table (e.g., `category='reading'` or `metadata->'reading'`), guarded by the feature flag.

---

## Routing & nav (no route breaks)

* Add a **top-level nav item** “Reading Games”.
* Routes (conform to existing router style):

  * `/reading-games` → list (cards with title, difficulty, star meter)
  * `/reading-games/:slug` → lazy loader that mounts the mini-game by slug
  * `/reading-games/progress` → aggregated progress view
* Register legacy games under **“Legacy Games”** (or the project’s standard category label) **without changing their paths**; only update the menu metadata/grouping.

---

## i18n keys (create both EN & FR files)

* `readingGames.title`, `readingGames.play`, `readingGames.retry`, `readingGames.next`, `readingGames.quit`
* `readingGames.feedback.correct`, `readingGames.feedback.tryAgain`, `readingGames.feedback.greatJob`
* Game titles & instructions per game.

---

## The 6 mini-games (self-contained, no external deps beyond project stack)

### 1) Magic Sound — `sound_to_letter`

**Loop**

* Play phoneme audio → show 3 letter options → pick → feedback with confetti.
* Stars: ≥90% = 3, ≥70% = 2, else 1. Config: `roundLength=8`.

### 2) Gesture to Letter — `gesture_to_letter`

**Loop**

* Show Borel-Maisonny-style gesture animation (Lottie/sprite if available) → pick letter.
* Show stroke-order overlay on success. Stars like Game 1.

### 3) Friends of Sounds — `character_sound_matching`

**Loop**

* Click letter-character → play its sound → drag token to matching picture (word).
* Unlock next character pack after K matches.

### 4) Magic Syllables — `syllable_builder`

**Loop**

* Drag letters to compose target syllable → on success play synthesized syllable and show one example word using it.

### 5) Hidden Words — `word_to_image`

**Loop**

* Show image → 3 written words → choose → advance micro-story scene after 5 correct.

### 6) Magic Story — `sentence_comprehension`

**Loop**

* Render short sentence (TTS optional) → MCQ question about content → star on correct.

> All games expose a common prop contract:
> `onFinish({stars, score, completed})`, `onQuit()`, `assets`, `config`.

---

## Seed/catalog (no DB migration required)

* Create a **catalog JSON** consumed by the adapter (or map to existing CMS/DB):
  `/src/features/reading-games/core/catalog.seed.json`

```json
[
  {"slug":"magic-sound","title":"Magic Sound","game_type":"sound_to_letter","difficulty_level":1,"assets":{"audio":["a.mp3","e.mp3","i.mp3","o.mp3","u.mp3","ch.mp3","f.mp3"]},"expected_output":{"roundLength":8}},
  {"slug":"gesture-to-letter","title":"Gesture to Letter","game_type":"gesture_to_letter","difficulty_level":1,"assets":{"gestures":["f.json","ch.json","s.json"]}},
  {"slug":"friends-of-sounds","title":"Friends of Sounds","game_type":"character_sound_matching","difficulty_level":1,"assets":{"characters":["a.png","b.png","s.png"],"images":["ballon.png","serpent.png","avion.png"]}},
  {"slug":"magic-syllables","title":"Magic Syllables","game_type":"syllable_builder","difficulty_level":2,"expected_output":{"validSyllables":["MA","PA","FA","LA","LI","LO","LU"]}},
  {"slug":"hidden-words","title":"Hidden Words","game_type":"word_to_image","difficulty_level":2,"assets":{"images":["chat.png","lune.png","papa.png"]}},
  {"slug":"magic-story","title":"Magic Story","game_type":"sentence_comprehension","difficulty_level":3,"assets":{"audio":["scene1.mp3","scene2.mp3"]}}
]
```

---

## UX/a11y guidelines

* Tablet-friendly hit areas; keyboard focus/ARIA for selections & drag actions.
* Alt text for phonemes: e.g., `phoneme /f/ (as in “feu”)`.
* Keep sessions short; show **StarMeter** after each round; positive voice prompts.

---

## Telemetry (reuse existing analytics)

Emit:

* `rg_game_started`, `rg_prompt_answered`, `rg_game_finished`
  Payload: `{userId, slug, correct, timeMs, stars, score}`

---

## Feature flag

* Add `READING_GAMES_ENABLED` in app config.
* If disabled, **hide menu** and block routes with a friendly message.

---

## Legacy games grouping

* Find games previously generated by Copilot.
* **Do not change their slugs or routes.**
* Only add/update **menu metadata** to display them under a **“Legacy Games”** (or existing equivalent) category.
* If menu metadata is DB-driven, insert/update category references via existing service; otherwise, add a static grouping config.

---

## Acceptance criteria (checklist)

* [ ] New nav entry **“Reading Games”** appears (flag-gated).
* [ ] `/reading-games` lists 6 cards; each opens and is playable; finishing updates progress via adapter.
* [ ] `/reading-games/progress` summarizes stars and completions per game.
* [ ] Existing/legacy games appear under their **own category** in the UI without route changes.
* [ ] i18n keys exist in EN/FR; a11y works for Game 1 and Game 4 (keyboard).
* [ ] No breaking changes to existing APIs; CI/tests green.

---

**Implement now**: scaffold the feature module, adapters to current services/ORM, routes, UI, catalog loader, i18n keys, and minimal tests. Keep diffs small and localized.
