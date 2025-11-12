/**
 * Chargeur dynamique de jeux Reading Games
 * Sélectionne le bon composant de jeu selon le slug
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../../stores/profileStore';
import { ReadingGamesAdapter } from '../core/adapter';
import type { ReadingGame } from '../core/types';
import PageTransition from '../../../components/PageTransition';

// Import des jeux
import MagicSound from '../games/MagicSound';
import GestureToLetter from '../games/GestureToLetter';
import FriendsOfSounds from '../games/FriendsOfSounds';
import MagicSyllables from '../games/MagicSyllables';
import HiddenWords from '../games/HiddenWords';
import MagicStory from '../games/MagicStory';

interface GameFinishData {
  stars: 0 | 1 | 2 | 3;
  score: number;
  completed: boolean;
}

export default function GameLoader() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentProfile } = useProfileStore();
  const [game, setGame] = useState<ReadingGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGame();
  }, [slug]);

  const loadGame = async () => {
    try {
      if (!slug) {
        setError('Aucun jeu spécifié');
        return;
      }

      const gameData = await ReadingGamesAdapter.getBySlug(slug);
      
      if (!gameData) {
        setError('Jeu non trouvé');
        return;
      }

      setGame(gameData);
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Erreur lors du chargement du jeu');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (data: GameFinishData) => {
    if (!currentProfile || !game) {
      console.error('❌ Cannot save: missing profile or game', { currentProfile, game });
      return;
    }

    try {
      console.log('🎮 Game finished, saving progress...', {
        userId: currentProfile.id,
        gameSlug: game.slug,
        stars: data.stars,
        score: data.score,
        completed: data.completed,
      });

      // Sauvegarder la progression
      await ReadingGamesAdapter.upsertProgress({
        userId: currentProfile.id,
        gameSlug: game.slug,
        stars: data.stars,
        score: data.score,
        completed: data.completed,
      });

      console.log('✅ Progress saved, navigating back...');

      // Retour à la liste des jeux avec message de succès
      navigate('/reading-games', {
        state: { completedGame: game.slug, stars: data.stars },
      });
    } catch (err) {
      console.error('❌ Error saving progress:', err);
      // Retour même en cas d'erreur
      navigate('/reading-games');
    }
  };

  const handleQuit = () => {
    navigate('/reading-games');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mb-4 text-6xl">⏳</div>
            <div className="font-display text-child-xl font-bold text-indigo-700">
              Chargement du jeu...
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (error || !game) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-md text-center"
          >
            <div className="mb-4 text-6xl">❌</div>
            <h2 className="mb-4 font-display text-child-xl font-bold text-red-600">
              {error || 'Jeu non trouvé'}
            </h2>
            <button
              onClick={() => navigate('/reading-games')}
              className="btn btn-primary"
            >
              Retour aux jeux
            </button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Sélection du composant de jeu selon le type
  const renderGame = () => {
    switch (game.game_type) {
      case 'sound_to_letter':
        return (
          <MagicSound
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );

      case 'gesture_to_letter':
        return (
          <GestureToLetter
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );
      
      case 'character_sound_matching':
        return (
          <FriendsOfSounds
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );
      
      case 'syllable_builder':
        return (
          <MagicSyllables
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );
      
      case 'word_to_image':
        return (
          <HiddenWords
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );
      
      case 'sentence_comprehension':
        return (
          <MagicStory
            onFinish={handleFinish}
            onQuit={handleQuit}
            config={game as any}
          />
        );

      default:
        return (
          <div className="flex min-h-screen items-center justify-center">
            <div className="card text-center">
              <p className="text-child-lg text-red-600">
                Type de jeu non reconnu: {game.game_type}
              </p>
              <button onClick={handleQuit} className="btn btn-primary mt-4">
                Retour
              </button>
            </div>
          </div>
        );
    }
  };

  return <PageTransition>{renderGame()}</PageTransition>;
}
