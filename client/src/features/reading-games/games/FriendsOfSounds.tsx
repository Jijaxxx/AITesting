/**
 * FriendsOfSounds - Niveau 3
 * Jeu : Associer des lettres/sons à des images qui commencent par ce son
 * Type matching/memory game
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhonemeAudio } from '../../../services/phonemeAudio';
import type { GameProps } from '../core/types';

// Définition des paires lettre → image
const SOUND_IMAGE_PAIRS = [
  { letter: 'a', emoji: '✈️', word: 'avion' },
  { letter: 'b', emoji: '🎈', word: 'ballon' },
  { letter: 's', emoji: '🐍', word: 'serpent' },
  { letter: 'm', emoji: '👩', word: 'maman' },
  { letter: 'l', emoji: '🌙', word: 'lune' },
  { letter: 'ch', emoji: '🐱', word: 'chat' },
  { letter: 'f', emoji: '👧', word: 'fille' },
  { letter: 'p', emoji: '🍞', word: 'pain' },
];

interface MatchItem {
  id: string;
  type: 'letter' | 'image';
  letter?: string;
  emoji?: string;
  word?: string;
  matched: boolean;
}

export default function FriendsOfSounds({ onFinish, onQuit }: GameProps) {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const { speakPhoneme } = usePhonemeAudio();

  const PAIRS_COUNT = 5; // 5 paires à trouver

  // Effet qui détecte la fin du jeu dès que toutes les paires sont trouvées
  useEffect(() => {
    if (matchedPairs.length >= PAIRS_COUNT * 2) {
      setGameComplete(true);
    }
  }, [matchedPairs]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Sélectionner 5 paires aléatoires
    const selectedPairs = [...SOUND_IMAGE_PAIRS]
      .sort(() => Math.random() - 0.5)
      .slice(0, PAIRS_COUNT);

    // Créer les items (lettres + images)
    const gameItems: MatchItem[] = [];
    
    selectedPairs.forEach((pair, index) => {
      // Item lettre
      gameItems.push({
        id: `letter-${index}`,
        type: 'letter',
        letter: pair.letter,
        matched: false,
      });
      // Item image
      gameItems.push({
        id: `image-${index}`,
        type: 'image',
        emoji: pair.emoji,
        word: pair.word,
        letter: pair.letter, // Pour vérifier la correspondance
        matched: false,
      });
    });

    // Mélanger les items
    const shuffled = gameItems.sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  const handleItemClick = (itemId: string) => {
    // Ignorer si déjà sélectionné ou matched
    const item = items.find(i => i.id === itemId);
    if (!item || item.matched || selectedItems.includes(itemId)) return;

    // Prononcer le son si c'est une lettre
    if (item.type === 'letter' && item.letter) {
      speakPhoneme(item.letter);
    }

    const newSelected = [...selectedItems, itemId];
    setSelectedItems(newSelected);

    // Si on a sélectionné 2 items, vérifier la correspondance
    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1);
      const item1 = items.find(i => i.id === newSelected[0]);
      const item2 = items.find(i => i.id === newSelected[1]);

      if (item1 && item2) {
        // Vérifier si c'est une paire valide (lettre + image correspondante)
        const isMatch =
          (item1.type === 'letter' && item2.type === 'image' && item1.letter === item2.letter) ||
          (item2.type === 'letter' && item1.type === 'image' && item2.letter === item1.letter);

        if (isMatch) {
          // Match trouvé !
          setScore(prev => prev + 1);
          setMatchedPairs(prev => [...prev, newSelected[0], newSelected[1]]);
          // Marquer comme matched
          setItems(prev =>
            prev.map(item =>
              newSelected.includes(item.id) ? { ...item, matched: true } : item
            )
          );
          // Réinitialiser sélection après un délai
          setTimeout(() => {
            setSelectedItems([]);
          }, 1000);
        } else {
          // Pas de match, réinitialiser après un délai
          setTimeout(() => {
            setSelectedItems([]);
          }, 1000);
        }
      }
    }
  };

  const handleFinish = () => {
    const percentage = Math.round((score / PAIRS_COUNT) * 100);
    let stars: 0 | 1 | 2 | 3 = 0;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    onFinish({
      stars,
      score: percentage,
      completed: stars >= 1,
    });
  };

  if (gameComplete) {
    const percentage = Math.round((score / PAIRS_COUNT) * 100);
    let stars: 0 | 1 | 2 | 3 = 0;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg border-4 border-green-300 bg-white p-8 text-center"
        >
          <h2 className="mb-4 font-display text-child-2xl font-bold text-green-700">
            Excellent ! 🎉
          </h2>
          <div className="mb-6 text-6xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-lg text-gray-700">
            Tu as trouvé <span className="font-bold text-green-600">{score}/{PAIRS_COUNT}</span> paires en{' '}
            <span className="font-bold text-green-600">{attempts}</span> essais !
          </p>
          <p className="mb-8 text-child-md text-gray-600">
            Score : {percentage}%
          </p>
          <div className="flex gap-4">
            <button onClick={onQuit} className="btn btn-secondary flex-1">
              Quitter
            </button>
            <button onClick={handleFinish} className="btn btn-primary flex-1">
              Continuer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold text-green-700">
          Amis des Sons 🎵
        </div>
        <div className="text-child-lg font-bold text-green-700">
          Paires : {score}/{PAIRS_COUNT}
        </div>
      </div>

      {/* Instruction */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 font-display text-child-2xl font-bold text-green-700">
          Associe chaque lettre à son image ! 🔗
        </h2>
        <p className="text-child-md text-gray-600">
          Clique sur une lettre, puis sur l'image qui commence par ce son
        </p>
      </div>

      {/* Grille de matching */}
      <div className="mx-auto grid max-w-4xl grid-cols-5 gap-4">
        {items.map(item => {
          const isSelected = selectedItems.includes(item.id);
          const isMatched = item.matched;

          return (
            <motion.button
              key={item.id}
              onClick={() => !isMatched && handleItemClick(item.id)}
              // Ne pas utiliser disabled, juste ignorer le clic si matched
              className={`card aspect-square border-4 p-4 transition-all relative ${
                isMatched
                  ? 'border-green-400 bg-green-100 opacity-60 pointer-events-none'
                  : isSelected
                  ? 'border-blue-500 bg-blue-100 scale-110'
                  : 'border-gray-300 bg-white hover:scale-110 hover:border-blue-400'
              }`}
              whileHover={!isMatched ? { scale: 1.1 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
            >
              <div className="flex h-full flex-col items-center justify-center">
                {item.type === 'letter' ? (
                  <span className="font-display text-5xl font-bold text-blue-700">
                    {item.letter}
                  </span>
                ) : (
                  <div className="text-center">
                    <div className="mb-2 text-5xl">{item.emoji}</div>
                    <div className="text-child-xs text-gray-600">{item.word}</div>
                  </div>
                )}
              </div>
              {isMatched && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-4xl"
                  style={{ pointerEvents: 'none' }}
                >
                  ✅
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {selectedItems.length === 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="mt-8 text-center text-child-xl font-bold"
          >
            {matchedPairs.includes(selectedItems[0]) ? (
              <span className="text-green-600">✅ Bravo !</span>
            ) : (
              <span className="text-orange-600">❌ Essaie encore !</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
