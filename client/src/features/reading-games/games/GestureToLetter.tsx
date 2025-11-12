/**
 * GestureToLetter - Niveau 2
 * Jeu : L'enfant voit un geste Borel-Maisonny et doit trouver la lettre correspondante
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameProps } from '../core/types';

// Définition des gestes et lettres associées
const GESTURE_DATA = [
  { letter: 'f', gesture: '👆', description: 'Doigt qui monte comme une fumée' },
  { letter: 's', gesture: '🐍', description: 'Serpent qui siffle' },
  { letter: 'm', gesture: '🤱', description: 'Bébé qui dit maman' },
  { letter: 'l', gesture: '👅', description: 'Langue qui sort' },
  { letter: 'r', gesture: '🐶', description: 'Chien qui grogne' },
  { letter: 'ch', gesture: '🤫', description: 'Chut, silence !' },
  { letter: 'a', gesture: '👄', description: 'Bouche grande ouverte' },
  { letter: 'o', gesture: '⭕', description: 'Bouche ronde' },
  { letter: 'i', gesture: '😁', description: 'Sourire' },
  { letter: 'u', gesture: '😮', description: 'Bouche en avant' },
];

interface Question {
  targetLetter: string;
  gesture: string;
  description: string;
  choices: string[];
}

export default function GestureToLetter({ onFinish, onQuit }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const TOTAL_ROUNDS = 6;

  useEffect(() => {
    generateAllQuestions();
  }, []);

  const generateAllQuestions = () => {
    // Sélectionner 6 gestes aléatoires parmi tous
    const shuffled = [...GESTURE_DATA].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, TOTAL_ROUNDS);

    const newQuestions = selected.map(item => {
      // Générer 2 autres choix incorrects
      const otherLetters = GESTURE_DATA
        .filter(g => g.letter !== item.letter)
        .map(g => g.letter);
      
      const wrongChoices = otherLetters
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const allChoices = [item.letter, ...wrongChoices].sort(() => Math.random() - 0.5);

      return {
        targetLetter: item.letter,
        gesture: item.gesture,
        description: item.description,
        choices: allChoices,
      };
    });

    setQuestions(newQuestions);
  };

  const handleAnswer = (selectedLetter: string) => {
    const currentQuestion = questions[currentRound];
    const isCorrect = selectedLetter === currentQuestion.targetLetter;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameComplete(true);
      }
    }, 1500);
  };

  const handleFinish = () => {
    const percentage = Math.round((score / TOTAL_ROUNDS) * 100);
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

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-child-lg">Préparation du jeu...</div>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = Math.round((score / TOTAL_ROUNDS) * 100);
    let stars: 0 | 1 | 2 | 3 = 0;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg border-4 border-purple-300 bg-white p-8 text-center"
        >
          <h2 className="mb-4 font-display text-child-2xl font-bold text-purple-700">
            Bravo ! 🎉
          </h2>
          <div className="mb-6 text-6xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-lg text-gray-700">
            Tu as trouvé <span className="font-bold text-purple-600">{score}/{TOTAL_ROUNDS}</span> gestes corrects !
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

  const currentQuestion = questions[currentRound];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold text-purple-700">
          Question {currentRound + 1}/{TOTAL_ROUNDS}
        </div>
        <div className="text-child-lg font-bold text-purple-700">
          Score : {score}/{currentRound}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-auto mb-12 h-4 max-w-2xl overflow-hidden rounded-full bg-white/50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
          initial={{ width: 0 }}
          animate={{ width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Zone de jeu */}
      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Instruction */}
            <div className="mb-8 text-center">
              <h2 className="mb-4 font-display text-child-2xl font-bold text-purple-700">
                Regarde le geste et trouve la lettre ! 👋
              </h2>
            </div>

            {/* Affichage du geste */}
            <motion.div
              className="card mx-auto mb-8 max-w-md border-4 border-purple-300 bg-white p-12 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="mb-4 text-9xl">{currentQuestion.gesture}</div>
              <p className="text-child-md text-gray-600">{currentQuestion.description}</p>
            </motion.div>

            {/* Choix de réponses */}
            <div className="grid grid-cols-3 gap-6">
              {currentQuestion.choices.map((letter, index) => (
                <motion.button
                  key={index}
                  onClick={() => !feedback && handleAnswer(letter)}
                  disabled={feedback !== null}
                  className={`card border-4 p-8 text-center transition-all ${
                    feedback === 'correct' && letter === currentQuestion.targetLetter
                      ? 'border-green-400 bg-green-100'
                      : feedback === 'incorrect' && letter === currentQuestion.targetLetter
                      ? 'border-green-400 bg-green-100'
                      : feedback && letter !== currentQuestion.targetLetter
                      ? 'border-gray-300 bg-gray-100 opacity-50'
                      : 'border-purple-300 bg-white hover:scale-110 hover:border-purple-500'
                  }`}
                  whileHover={!feedback ? { scale: 1.1 } : {}}
                  whileTap={!feedback ? { scale: 0.95 } : {}}
                >
                  <span className="font-display text-6xl font-bold text-purple-700">
                    {letter}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mt-8 text-center text-child-xl font-bold ${
                  feedback === 'correct' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback === 'correct' ? '✅ Bravo !' : '❌ Essaie encore !'}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
