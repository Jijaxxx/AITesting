/**
 * Adaptateur pour les Reading Games
 * Mappe vers les services existants sans modifier la DB
 */

import type { ReadingGame, ProgressUpsert, ProgressView } from './types';
import catalog from './catalog.seed.json';
import { progressApi } from '../../../services/api';

/**
 * Adaptateur qui utilise l'infrastructure existante
 */
export const ReadingGamesAdapter = {
  /**
   * Helpers stockage local (fallback offline)
   */
  getLocalKey(userId: string) {
    return `rg-progress:${userId}`;
  },

  readLocalProgress(userId: string): ProgressView[] {
    try {
      const raw = localStorage.getItem(this.getLocalKey(userId));
      return raw ? (JSON.parse(raw) as ProgressView[]) : [];
    } catch {
      return [];
    }
  },

  writeLocalProgress(userId: string, items: ProgressView[]) {
    try {
      localStorage.setItem(this.getLocalKey(userId), JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  },
  /**
   * Vérifie si l'API est accessible (health check simple)
   */
  async isApiReachable(): Promise<boolean> {
    try {
      // appel léger: GET /progress?profileId=dummy (retournera probablement vide)
      await progressApi.getByProfile('health-check');
      return true;
    } catch {
      return false;
    }
  },
  /**
   * Synchronise la progression locale vers le serveur quand il revient en ligne
   */
  async syncLocalToServer(userId: string): Promise<{ pushed: number; errors: number }> {
    const local = this.readLocalProgress(userId);
    if (!local.length) return { pushed: 0, errors: 0 };
    let pushed = 0;
    let errors = 0;
    for (const item of local) {
      try {
        const level = this.slugToLevel(item.gameSlug);
        await progressApi.upsert({
          profileId: userId,
          world: 4,
          level,
          stars: item.stars,
          xp: item.best_score,
          attemptsCount: 1,
        });
        pushed++;
      } catch (e) {
        errors++;
      }
    }
    if (errors === 0) {
      // Clear local only si tout est poussé
      localStorage.removeItem(this.getLocalKey(userId));
    }
    console.log(`🔄 Sync Reading Games: pushed=${pushed}, errors=${errors}`);
    return { pushed, errors };
  },
  /**
   * Liste tous les jeux Reading Games depuis le catalog
   */
  async listCatalog(): Promise<ReadingGame[]> {
    // Charger depuis le JSON local (pourrait être une API)
    return catalog as unknown as ReadingGame[];
  },

  /**
   * Récupère un jeu par son slug
   */
  async getBySlug(slug: string): Promise<ReadingGame | null> {
    const games = await this.listCatalog();
    return games.find(g => g.slug === slug) || null;
  },

  /**
   * Liste la progression d'un utilisateur pour les Reading Games
   * Utilise l'API de progression existante
   */
  async listUserProgress(userId: string): Promise<ProgressView[]> {
    try {
      // Récupérer toute la progression de l'utilisateur
      const allProgress = await progressApi.getByProfile(userId);
      
      // Filtrer uniquement les jeux Reading Games (world 4 réservé aux Reading Games)
      const readingGamesProgress = allProgress
        .filter((p: any) => p.world === 4) // Convention: world 4 = Reading Games
        .map((p: any) => ({
          gameSlug: this.levelToSlug(p.level), // Convertir level -> slug correct
          stars: p.stars || 0,
          best_score: p.xp || 0,
          completed: p.stars >= 1,
          last_played_at: p.lastPlayedAt || new Date().toISOString(),
        }));

      return readingGamesProgress;
    } catch (error) {
      console.error('Error loading reading games progress:', error);
      // Fallback: lire depuis localStorage
      const local = this.readLocalProgress(userId);
      if (local.length) {
        console.log('📦 Using offline Reading Games progress (localStorage)');
      }
      return local;
    }
  },

  /**
   * Enregistre ou met à jour la progression
   * Utilise l'API de progression existante
   */
  async upsertProgress(p: ProgressUpsert): Promise<ProgressView> {
    try {
      // Convention: utiliser world=4 pour les Reading Games
      // Le level sera dérivé du gameSlug
      const level = this.slugToLevel(p.gameSlug);
      
      const progressData = {
        profileId: p.userId,
        world: 4, // Reading Games = world 4
        level: level,
        stars: p.stars,
        xp: p.score || 0,
        attemptsCount: 1,
      };

      console.log('📊 Saving Reading Games progress:', {
        gameSlug: p.gameSlug,
        level,
        stars: p.stars,
        score: p.score,
        profileId: p.userId,
      });

      await progressApi.upsert(progressData);

      console.log('✅ Progress saved successfully');

      return {
        gameSlug: p.gameSlug,
        stars: p.stars,
        best_score: p.score || 0,
        completed: p.completed || false,
        last_played_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error saving reading games progress (API). Falling back to localStorage:', error);
      // Fallback offline: fusionner et stocker en local
      const current = this.readLocalProgress(p.userId);
      const existingIdx = current.findIndex(x => x.gameSlug === p.gameSlug);
      const newItem: ProgressView = {
        gameSlug: p.gameSlug,
        // Conserver le meilleur nombre d'étoiles
        stars: Math.max(p.stars, existingIdx >= 0 ? current[existingIdx].stars : 0) as 0 | 1 | 2 | 3,
        best_score: Math.max(p.score || 0, existingIdx >= 0 ? current[existingIdx].best_score : 0),
        completed: (p.completed || false) || (existingIdx >= 0 ? current[existingIdx].completed : false),
        last_played_at: new Date().toISOString(),
      };
      if (existingIdx >= 0) {
        current[existingIdx] = newItem;
      } else {
        current.push(newItem);
      }
      this.writeLocalProgress(p.userId, current);
      console.log('💾 Progress saved offline (localStorage). It will be available in UI and can be synced later.');
      return newItem;
    }
  },

  /**
   * Helper: convertit un slug en numéro de niveau
   */
  slugToLevel(slug: string): number {
    const games = [
      'magic-sound',
      'gesture-to-letter',
      'friends-of-sounds',
      'magic-syllables',
      'hidden-words',
      'magic-story',
    ];
    const index = games.indexOf(slug);
    return index >= 0 ? index + 1 : 1;
  },

  /**
   * Helper: convertit un niveau en slug
   */
  levelToSlug(level: number): string {
    const games = [
      'magic-sound',
      'gesture-to-letter',
      'friends-of-sounds',
      'magic-syllables',
      'hidden-words',
      'magic-story',
    ];
    return games[level - 1] || 'magic-sound';
  },
};
