/**
 * Jeu 1: Magic Sound (sound_to_letter)
 * Écoute le son et choisis la lettre correspondante
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameProps, GameResult } from '../core/types';
import { useSpeech } from '../../../hooks/useSpeech';

// Configuration du jeu
const SOUND_TO_LETTER_MAP: Record<string, string[]> = {
  'a': ['a', 'â', 'à'],
  'e': ['e', 'é', 'è', 'ê'],
  'i': ['i', 'î'],
  'o': ['o', 'ô'],
  'u': ['u', 'û'],
  'ch': ['ch'],
  'f': ['f', 'ph'],
  's': ['s', 'ss', 'c'],
};

const SOUNDS = Object.keys(SOUND_TO_LETTER_MAP);

export default function MagicSound({ onFinish, onQuit, config }: GameProps) {
  const roundLength = (config?.roundLength as number) || 8;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentSound, setCurrentSound] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const { speak } = useSpeech({ rate: 0.85, pitch: 1.0 });

  // Générer une nouvelle question
  const generateQuestion = () => {
    const sound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const correctLetter = SOUND_TO_LETTER_MAP[sound][0];
    
    // Générer 2 distracteurs
    const distractors: string[] = [];
    while (distractors.length < 2) {
      const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
      const letter = SOUND_TO_LETTER_MAP[randomSound][0];
      if (letter !== correctLetter && !distractors.includes(letter)) {
        distractors.push(letter);
      }
    }

    const allOptions = [correctLetter, ...distractors].sort(() => Math.random() - 0.5);
    
    setCurrentSound(sound);
    setOptions(allOptions);
    setFeedback(null);
    
    // Lire le son
    setTimeout(() => {
      speak(`Trouve la lettre qui fait le son ${sound}`);
    }, 500);
  };

  useEffect(() => {
    if (round <= roundLength) {
      generateQuestion();
    } else {
      // Calcul des étoiles
      const percentage = (score / roundLength) * 100;
      const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
      
      const result: GameResult = {
        stars: stars as 0 | 1 | 2 | 3,
        score,
        completed: true,
      };
      
      setTimeout(() => onFinish(result), 1500);
    }
  }, [round]);

  const handleChoice = (letter: string) => {
    if (feedback) return; // Empêcher les clics multiples

    const correct = SOUND_TO_LETTER_MAP[currentSound][0];
    const isCorrect = letter === correct;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(score + 1);
      speak('Bravo !');
    } else {
      speak(`Non, c'est ${correct}`);
    }

    setTimeout(() => {
      setRound(round + 1);
    }, 2000);
  };

  if (round > roundLength) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <p className="text-child-lg font-bold">Jeu terminé !</p>
          <p className="text-child-base text-gray-600">Score: {score}/{roundLength}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold">
          Question {round} / {roundLength}
        </div>
        <div className="text-child-base">Score: {score}</div>
      </div>

      {/* Zone de jeu */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <motion.div
          key={round}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 text-center"
        >
          <button
            onClick={() => speak(`Le son ${currentSound}`)}
            className="mb-4 rounded-full bg-purple-500 p-12 text-6xl shadow-2xl transition-transform hover:scale-110"
          >
            🔊
          </button>
          <p className="text-child-lg font-bold text-gray-700">
            Trouve la lettre qui fait le son "{currentSound}"
          </p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-6">
          {options.map((letter, index) => (
            <motion.button
              key={letter}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleChoice(letter)}
              disabled={feedback !== null}
              className={`card aspect-square w-32 text-6xl font-bold transition-all hover:scale-110 ${
                feedback === 'correct' && letter === SOUND_TO_LETTER_MAP[currentSound][0]
                  ? 'bg-green-200 border-green-500'
                  : feedback === 'incorrect' && letter !== SOUND_TO_LETTER_MAP[currentSound][0]
                  ? 'bg-red-200 border-red-500'
                  : ''
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-8 text-center"
          >
            <div className="text-6xl">
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
