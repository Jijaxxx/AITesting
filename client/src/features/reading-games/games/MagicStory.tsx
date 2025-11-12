/**
 * MagicStory - Niveau 6
 * Jeu : Compréhension de phrases simples
 * L'enfant lit une petite phrase et répond à une question de compréhension
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../../hooks/useSpeech';
import type { GameProps } from '../core/types';

// Histoires avec questions de compréhension
const STORIES = [
  {
    sentence: 'Le chat mange du poisson.',
    emoji: '🐱🐟',
    question: 'Que mange le chat ?',
    correctAnswer: 'du poisson',
    wrongAnswers: ['du pain', 'de la viande'],
  },
  {
    sentence: 'Papa lit un livre.',
    emoji: '👨📖',
    question: 'Que fait papa ?',
    correctAnswer: 'il lit',
    wrongAnswers: ['il dort', 'il mange'],
  },
  {
    sentence: 'La lune brille dans le ciel.',
    emoji: '🌙✨',
    question: 'Où brille la lune ?',
    correctAnswer: 'dans le ciel',
    wrongAnswers: ['dans la mer', 'dans la maison'],
  },
  {
    sentence: 'Maman fait un gâteau.',
    emoji: '👩🍰',
    question: 'Que fait maman ?',
    correctAnswer: 'un gâteau',
    wrongAnswers: ['du pain', 'une tarte'],
  },
  {
    sentence: 'Le ballon est rouge.',
    emoji: '🎈🔴',
    question: 'De quelle couleur est le ballon ?',
    correctAnswer: 'rouge',
    wrongAnswers: ['bleu', 'jaune'],
  },
  {
    sentence: 'Le chien court dans le jardin.',
    emoji: '🐕🏃',
    question: 'Où court le chien ?',
    correctAnswer: 'dans le jardin',
    wrongAnswers: ['dans la maison', 'dans la rue'],
  },
  {
    sentence: 'La petite fille joue avec son ours.',
    emoji: '👧🧸',
    question: 'Avec quoi joue la fille ?',
    correctAnswer: 'son ours',
    wrongAnswers: ['sa poupée', 'son ballon'],
  },
  {
    sentence: 'Le soleil se lève le matin.',
    emoji: '☀️🌅',
    question: 'Quand se lève le soleil ?',
    correctAnswer: 'le matin',
    wrongAnswers: ['le soir', 'la nuit'],
  },
];

interface Question {
  sentence: string;
  emoji: string;
  question: string;
  correctAnswer: string;
  choices: string[];
}

export default function MagicStory({ onFinish, onQuit }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showingSentence, setShowingSentence] = useState(true);
  const { speak } = useSpeech();

  const TOTAL_ROUNDS = 6;

  useEffect(() => {
    generateAllQuestions();
  }, []);

  const generateAllQuestions = () => {
    // Sélectionner 6 histoires aléatoires
    const selectedStories = [...STORIES]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);

    const newQuestions = selectedStories.map(story => {
      // Mélanger les choix
      const allChoices = [story.correctAnswer, ...story.wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        sentence: story.sentence,
        emoji: story.emoji,
        question: story.question,
        correctAnswer: story.correctAnswer,
        choices: allChoices,
      };
    });

    setQuestions(newQuestions);
  };

  const handleReadSentence = () => {
    const currentQuestion = questions[currentRound];
    speak(currentQuestion.sentence);
  };

  const handleContinueToQuestion = () => {
    setShowingSentence(false);
  };

  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = questions[currentRound];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setShowingSentence(true);
      if (currentRound + 1 < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameComplete(true);
      }
    }, 2000);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg border-4 border-indigo-300 bg-white p-8 text-center"
        >
          <h2 className="mb-4 font-display text-child-2xl font-bold text-indigo-700">
            Fantastique ! 🎉
          </h2>
          <div className="mb-6 text-6xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-lg text-gray-700">
            Tu as répondu correctement à <span className="font-bold text-indigo-600">{score}/{TOTAL_ROUNDS}</span> questions !
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold text-indigo-700">
          Histoire {currentRound + 1}/{TOTAL_ROUNDS}
        </div>
        <div className="text-child-lg font-bold text-indigo-700">
          Score : {score}/{currentRound}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-auto mb-12 h-4 max-w-2xl overflow-hidden rounded-full bg-white/50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
          initial={{ width: 0 }}
          animate={{ width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Zone de jeu */}
      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {showingSentence ? (
            <motion.div
              key="sentence"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Instruction */}
              <div className="mb-8 text-center">
                <h2 className="mb-4 font-display text-child-2xl font-bold text-indigo-700">
                  Lis la phrase ! 📖
                </h2>
                <button
                  onClick={handleReadSentence}
                  className="btn btn-primary"
                >
                  🔊 Écouter la phrase
                </button>
              </div>

              {/* Affichage de la phrase */}
              <motion.div
                className="card mx-auto mb-8 max-w-2xl border-4 border-indigo-300 bg-white p-12 text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="mb-6 text-7xl">{currentQuestion.emoji}</div>
                <p className="font-display text-child-xl font-bold text-indigo-700">
                  {currentQuestion.sentence}
                </p>
              </motion.div>

              {/* Bouton Continuer */}
              <div className="text-center">
                <button
                  onClick={handleContinueToQuestion}
                  className="btn btn-primary text-child-lg"
                >
                  Passer à la question →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="mb-8 text-center">
                <h2 className="mb-4 font-display text-child-2xl font-bold text-indigo-700">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Rappel de la phrase (petit) */}
              <div className="card mx-auto mb-8 max-w-xl border-2 border-indigo-200 bg-indigo-50 p-4 text-center">
                <p className="text-child-sm text-gray-600 italic">
                  "{currentQuestion.sentence}"
                </p>
              </div>

              {/* Choix de réponses */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {currentQuestion.choices.map((answer, index) => (
                  <motion.button
                    key={index}
                    onClick={() => !feedback && handleAnswer(answer)}
                    disabled={feedback !== null}
                    className={`card border-4 p-6 transition-all ${
                      feedback === 'correct' && answer === currentQuestion.correctAnswer
                        ? 'border-green-400 bg-green-100'
                        : feedback === 'incorrect' && answer === currentQuestion.correctAnswer
                        ? 'border-green-400 bg-green-100'
                        : feedback && answer !== currentQuestion.correctAnswer
                        ? 'border-gray-300 bg-gray-100 opacity-50'
                        : 'border-indigo-300 bg-white hover:scale-110 hover:border-indigo-500'
                    }`}
                    whileHover={!feedback ? { scale: 1.1 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                  >
                    <span className="text-child-lg font-bold text-indigo-700">
                      {answer}
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
                  {feedback === 'correct' ? '✅ Parfait !' : `❌ C'était ${currentQuestion.correctAnswer}`}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
