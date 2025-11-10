/**
 * Page de progression pour les Reading Games
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../../stores/profileStore';
import { ReadingGamesAdapter } from '../core/adapter';
import type { ReadingGame, ProgressView } from '../core/types';
import PageTransition from '../../../components/PageTransition';

export default function ProgressPage() {
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
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const maxStars = games.length * 3;
  const completedGames = progress.filter(p => p.completed).length;

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
            onClick={() => navigate('/reading-games')}
            className="btn btn-secondary"
          >
            ← Retour aux jeux
          </button>
          <h1 className="font-display text-child-2xl font-bold text-indigo-700">
            📊 Ma Progression
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Stats globales */}
        <div className="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card bg-gradient-to-br from-yellow-100 to-yellow-50 text-center"
          >
            <div className="mb-2 text-5xl">⭐</div>
            <div className="text-child-2xl font-bold text-gray-800">{totalStars}</div>
            <div className="text-child-sm text-gray-600">/ {maxStars} étoiles</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-green-100 to-green-50 text-center"
          >
            <div className="mb-2 text-5xl">✅</div>
            <div className="text-child-2xl font-bold text-gray-800">{completedGames}</div>
            <div className="text-child-sm text-gray-600">/ {games.length} jeux terminés</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-blue-100 to-blue-50 text-center"
          >
            <div className="mb-2 text-5xl">🎯</div>
            <div className="text-child-2xl font-bold text-gray-800">
              {games.length > 0 ? Math.round((totalStars / maxStars) * 100) : 0}%
            </div>
            <div className="text-child-sm text-gray-600">Progression globale</div>
          </motion.div>
        </div>

        {/* Détail par jeu */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-display text-child-xl font-bold text-gray-800">
            Détails par jeu
          </h2>
          
          <div className="space-y-4">
            {games.map((game, index) => {
              const gameProgress = progress.find(p => p.gameSlug === game.slug);
              const stars = gameProgress?.stars || 0;

              return (
                <motion.div
                  key={game.slug}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {gameProgress?.completed ? '✅' : '⏳'}
                    </div>
                    <div>
                      <h3 className="font-bold text-child-lg text-gray-800">
                        {game.title}
                      </h3>
                      <p className="text-child-sm text-gray-600">
                        {game.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-1 text-2xl">
                      {'⭐'.repeat(stars)}
                      {'☆'.repeat(3 - stars)}
                    </div>
                    {gameProgress && (
                      <div className="text-child-sm text-gray-600">
                        Meilleur score: {gameProgress.best_score}
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/reading-games/${game.slug}`)}
                      className="mt-2 rounded-lg bg-indigo-500 px-4 py-1 text-child-sm font-bold text-white hover:bg-indigo-600"
                    >
                      {gameProgress?.completed ? 'Rejouer' : 'Jouer'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
