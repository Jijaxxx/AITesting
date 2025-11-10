import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProfileStore } from '../stores/profileStore';
import { progressApi } from '../services/api';
import LotoSons from '../games/LotoSons';
import PecheAuxLettres from '../games/PecheAuxLettres';
import CourseDesSyllabes from '../games/CourseDesSyllabes';
import DicteeKaraoke from '../games/DicteeKaraoke';

// Mapping des jeux et compétences par niveau (devrait venir de l'API en production)
const LEVEL_CONFIG: Record<string, { game: string; targetSkill: string }> = {
  '1-1': { game: 'loto_sons', targetSkill: 'a' },
  '1-2': { game: 'peche_lettres', targetSkill: 'e' },
  '1-3': { game: 'course_syllabes', targetSkill: 'i' },
  '1-4': { game: 'dictee_karaoke', targetSkill: 'o' },
  
  '2-1': { game: 'loto_sons', targetSkill: 'ch' },
  '2-2': { game: 'peche_lettres', targetSkill: 'ou' },
  '2-3': { game: 'course_syllabes', targetSkill: 'on' },
  '2-4': { game: 'dictee_karaoke', targetSkill: 'ch' },
  
  '3-1': { game: 'loto_sons', targetSkill: 'an' },
  '3-2': { game: 'peche_lettres', targetSkill: 'in' },
  '3-3': { game: 'course_syllabes', targetSkill: 'an' },
  '3-4': { game: 'dictee_karaoke', targetSkill: 'in' },
};

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

  // Charger le bon jeu selon le niveau
  const levelKey = `${world}-${level}`;
  const config = LEVEL_CONFIG[levelKey] || { game: 'loto_sons', targetSkill: 'a' };

  switch (config.game) {
    case 'loto_sons':
      return <LotoSons targetSound={config.targetSkill} onComplete={handleGameComplete} />;
    case 'peche_lettres':
      return <PecheAuxLettres targetLetter={config.targetSkill} onComplete={handleGameComplete} />;
    case 'course_syllabes':
      return <CourseDesSyllabes onComplete={handleGameComplete} />;
    case 'dictee_karaoke':
      return <DicteeKaraoke onComplete={handleGameComplete} />;
    default:
      return <LotoSons targetSound={config.targetSkill} onComplete={handleGameComplete} />;
  }
}
