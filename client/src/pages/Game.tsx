import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProfileStore } from '../stores/profileStore';
import { progressApi } from '../services/api';
import LotoSons from '../games/LotoSons';

export default function Game() {
  const { world, level } = useParams<{ world: string; level: string }>();
  const navigate = useNavigate();
  const { currentProfile } = useProfileStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameScore, setGameScore] = useState<{ correct: number; total: number; timeSpent: number } | null>(null);

  const handleGameComplete = async (score: { correct: number; total: number; timeSpent: number }) => {
    console.log('handleGameComplete appelé avec score:', score);
    setGameScore(score);
    setIsCompleted(true);

    if (!currentProfile || !world || !level) return;

    // Calculer les étoiles (0-3)
    const percentage = (score.correct / score.total) * 100;
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

    // Calculer XP (10 points par bonne réponse + bonus vitesse)
    const baseXP = score.correct * 10;
    const speedBonus = score.timeSpent < 30 ? 20 : score.timeSpent < 45 ? 10 : 0;
    const xp = baseXP + speedBonus;

    console.log('Sauvegarde progression:', { stars, xp, percentage });

    try {
      // Sauvegarder la progression
      await progressApi.upsert({
        profileId: currentProfile.id,
        world: parseInt(world),
        level: parseInt(level),
        stars,
        xp,
      });
      console.log('Progression sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error);
    }
  };

  if (isCompleted && gameScore) {
    const percentage = (gameScore.correct / gameScore.total) * 100;
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="card max-w-2xl text-center">
          <h1 className="mb-8 font-display text-child-2xl font-bold text-primary-700">
            Niveau terminé ! 🎉
          </h1>
          
          <div className="mb-8">
            <div className="mb-4 text-6xl">
              {stars >= 3 && '🏆'}
              {stars === 2 && '🥈'}
              {stars === 1 && '🥉'}
              {stars === 0 && '💪'}
            </div>
            <div className="mb-4 text-5xl">
              {'⭐'.repeat(stars)}
            </div>
            <p className="text-child-lg text-gray-700">
              {gameScore.correct} / {gameScore.total} bonnes réponses
            </p>
            <p className="text-child-base text-gray-600">
              Temps: {gameScore.timeSpent}s
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/world/${currentProfile?.id}`)}
              className="btn-secondary flex-1"
            >
              ← Carte des mondes
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex-1"
            >
              Rejouer 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pour l'instant, tous les niveaux utilisent LotoSons (à adapter selon le level/world)
  return <LotoSons targetSound="a" onComplete={handleGameComplete} />;
}
