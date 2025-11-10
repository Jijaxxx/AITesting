/**
 * Types pour les Reading Games
 * Module autonome suivant l'architecture existante
 */

export type GameType =
  | "sound_to_letter"
  | "gesture_to_letter"
  | "character_sound_matching"
  | "syllable_builder"
  | "word_to_image"
  | "sentence_comprehension";

export interface ReadingGame {
  id?: string | number;
  slug: string;
  title: string;
  description?: string;
  difficulty_level: 1 | 2 | 3;
  game_type: GameType;
  instructions?: string;
  assets?: Record<string, string[]>;
  expected_output?: Record<string, unknown>;
  is_active?: boolean;
  category?: "reading-games";
}

export interface ProgressUpsert {
  userId: string;
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

export interface GameResult {
  stars: 0 | 1 | 2 | 3;
  score: number;
  completed: boolean;
  timeMs?: number;
}

export interface GameProps {
  onFinish: (result: GameResult) => void;
  onQuit: () => void;
  assets?: Record<string, string[]>;
  config?: Record<string, unknown>;
}
