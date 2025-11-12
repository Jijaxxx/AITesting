/**
 * HiddenWords - Niveau 5
 * Jeu : Trouver le mot qui correspond à l'image affichée
 * L'enfant voit une image et doit choisir parmi 3 mots celui qui correspond
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../../hooks/useSpeech';
import type { GameProps } from '../core/types';

// Mots avec leurs images
const WORDS = [
  { word: 'chat', emoji: '🐱', audio: 'chat' },
  { word: 'lune', emoji: '🌙', audio: 'lune' },
  { word: 'papa', emoji: '👨', audio: 'papa' },
  { word: 'maman', emoji: '👩', audio: 'maman' },
  { word: 'ballon', emoji: '🎈', audio: 'ballon' },
  { word: 'maison', emoji: '🏠', audio: 'maison' },
  { word: 'pain', emoji: '🍞', audio: 'pain' },
  { word: 'loup', emoji: '🐺', audio: 'loup' },
  { word: 'fleur', emoji: '🌸', audio: 'fleur' },
  { word: 'soleil', emoji: '☀️', audio: 'soleil' },
];

interface Question {
  targetWord: string;
  emoji: string;
  audio: string;
  choices: string[];
}

export default function HiddenWords({ onFinish, onQuit }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const { speak } = useSpeech();

  const TOTAL_ROUNDS = 7;

  useEffect(() => {
    generateAllQuestions();
  }, []);

  const generateAllQuestions = () => {
    // Sélectionner 7 mots aléatoires
    const selectedWords = [...WORDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);

    const newQuestions = selectedWords.map(wordItem => {
      // Générer 2 autres mots incorrects
      const otherWords = WORDS
        .filter(w => w.word !== wordItem.word)
        .map(w => w.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      // Mélanger les choix
      const allChoices = [wordItem.word, ...otherWords].sort(() => Math.random() - 0.5);

      return {
        targetWord: wordItem.word,
        emoji: wordItem.emoji,
        audio: wordItem.audio,
        choices: allChoices,
      };
    });

    setQuestions(newQuestions);
  };

  const handleAnswer = (selectedWord: string) => {
    const currentQuestion = questions[currentRound];
    const isCorrect = selectedWord === currentQuestion.targetWord;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
      // Prononcer le mot
      speak(currentQuestion.audio);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const handlePlayAudio = () => {
    const currentQuestion = questions[currentRound];
    speak(currentQuestion.audio);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg border-4 border-orange-300 bg-white p-8 text-center"
        >
          <h2 className="mb-4 font-display text-child-2xl font-bold text-orange-700">
            Super ! 🎉
          </h2>
          <div className="mb-6 text-6xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-lg text-gray-700">
            Tu as trouvé <span className="font-bold text-orange-600">{score}/{TOTAL_ROUNDS}</span> mots corrects !
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold text-orange-700">
          Mot {currentRound + 1}/{TOTAL_ROUNDS}
        </div>
        <div className="text-child-lg font-bold text-orange-700">
          Score : {score}/{currentRound}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-auto mb-12 h-4 max-w-2xl overflow-hidden rounded-full bg-white/50">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-red-400"
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
              <h2 className="mb-4 font-display text-child-2xl font-bold text-orange-700">
                Lis et trouve le bon mot ! 📖
              </h2>
              <button
                onClick={handlePlayAudio}
                className="btn btn-primary"
              >
                🔊 Écouter le mot
              </button>
            </div>

            {/* Affichage de l'image */}
            <motion.div
              className="card mx-auto mb-8 max-w-md border-4 border-orange-300 bg-white p-12 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-9xl">{currentQuestion.emoji}</div>
            </motion.div>

            {/* Choix de mots */}
            <div className="mb-8 text-center">
              <p className="mb-4 text-child-md text-gray-600">Quel est ce mot ?</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {currentQuestion.choices.map((word, index) => (
                  <motion.button
                    key={index}
                    onClick={() => !feedback && handleAnswer(word)}
                    disabled={feedback !== null}
                    className={`card border-4 p-6 transition-all ${
                      feedback === 'correct' && word === currentQuestion.targetWord
                        ? 'border-green-400 bg-green-100'
                        : feedback === 'incorrect' && word === currentQuestion.targetWord
                        ? 'border-green-400 bg-green-100'
                        : feedback && word !== currentQuestion.targetWord
                        ? 'border-gray-300 bg-gray-100 opacity-50'
                        : 'border-orange-300 bg-white hover:scale-110 hover:border-orange-500'
                    }`}
                    whileHover={!feedback ? { scale: 1.1 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                  >
                    <span className="font-display text-child-xl font-bold text-orange-700">
                      {word}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center text-child-xl font-bold ${
                  feedback === 'correct' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback === 'correct' ? '✅ Bravo !' : `❌ C'était ${currentQuestion.targetWord}`}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
