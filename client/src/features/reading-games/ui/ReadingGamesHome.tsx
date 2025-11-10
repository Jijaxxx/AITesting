/**
 * Page d'accueil des Reading Games
 * Liste tous les jeux disponibles avec leurs difficultés et progression
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../../stores/profileStore';
import { ReadingGamesAdapter } from '../core/adapter';
import type { ReadingGame, ProgressView } from '../core/types';
import PageTransition from '../../../components/PageTransition';

export default function ReadingGamesHome() {
  const navigate = useNavigate();
  const { currentProfile } = useProfileStore();
  const [games, setGames] = useState<ReadingGame[]>([]);
  const [progress, setProgress] = useState<ProgressView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentProfile]);

  const loadData = async () => {
    try {
      const [gamesData, progressData] = await Promise.all([
        ReadingGamesAdapter.listCatalog(),
        currentProfile ? ReadingGamesAdapter.listUserProgress(currentProfile.id) : Promise.resolve([]),
      ]);
      
      setGames(gamesData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading reading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameProgress = (slug: string): ProgressView | undefined => {
    return progress.find(p => p.gameSlug === slug);
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'from-green-100 to-green-50 border-green-300';
      case 2: return 'from-yellow-100 to-yellow-50 border-yellow-300';
      case 3: return 'from-red-100 to-red-50 border-red-300';
      default: return 'from-gray-100 to-gray-50 border-gray-300';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Facile';
      case 2: return 'Moyen';
      case 3: return 'Difficile';
      default: return '';
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-child-lg">Chargement...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(`/world/${currentProfile?.id}`)}
            className="btn btn-secondary"
          >
            ← Retour
          </button>
          <h1 className="font-display text-child-2xl font-bold text-indigo-700">
            📚 Jeux de Lecture
          </h1>
          <button
            onClick={() => navigate('/reading-games/progress')}
            className="btn btn-primary"
          >
            Ma Progression
          </button>
        </div>

        {/* Description */}
        <div className="mb-12 text-center">
          <p className="text-child-lg text-gray-700">
            Apprends à lire en t'amusant avec 6 jeux magiques !
          </p>
        </div>

        {/* Grille de jeux */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => {
            const gameProgress = getGameProgress(game.slug);
            const stars = gameProgress?.stars || 0;

            return (
              <motion.div
                key={game.slug}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => navigate(`/reading-games/${game.slug}`)}
                  className={`card w-full border-4 bg-gradient-to-br p-6 text-left transition-all hover:scale-105 ${getDifficultyColor(game.difficulty_level)}`}
                >
                  {/* Badge de difficulté */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-child-sm font-bold ${
                      game.difficulty_level === 1 ? 'bg-green-200 text-green-800' :
                      game.difficulty_level === 2 ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {getDifficultyLabel(game.difficulty_level)}
                    </span>
                    {gameProgress?.completed && (
                      <span className="text-2xl">✅</span>
                    )}
                  </div>

                  {/* Titre */}
                  <h3 className="mb-2 font-display text-child-lg font-bold text-gray-800">
                    {game.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-child-sm text-gray-600">
                    {game.description}
                  </p>

                  {/* Étoiles */}
                  <div className="flex items-center gap-1 text-2xl">
                    {'⭐'.repeat(stars)}
                    {'☆'.repeat(3 - stars)}
                  </div>

                  {/* Bouton Jouer */}
                  <div className="mt-4">
                    <span className="inline-block rounded-xl bg-white/80 px-4 py-2 font-bold text-indigo-700">
                      {gameProgress?.completed ? 'Rejouer' : 'Jouer'} →
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
