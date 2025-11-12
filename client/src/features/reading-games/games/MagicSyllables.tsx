/**
 * MagicSyllables - Niveau 4
 * Jeu : Construire des syllabes en assemblant des lettres
 * L'enfant doit glisser/cliquer les bonnes lettres pour former la syllabe demandée
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../../hooks/useSpeech';
import type { GameProps } from '../core/types';

// Syllabes valides à construire
const SYLLABLES = [
  { syllable: 'MA', letters: ['M', 'A'], audio: 'ma' },
  { syllable: 'PA', letters: ['P', 'A'], audio: 'pa' },
  { syllable: 'FA', letters: ['F', 'A'], audio: 'fa' },
  { syllable: 'LA', letters: ['L', 'A'], audio: 'la' },
  { syllable: 'LI', letters: ['L', 'I'], audio: 'li' },
  { syllable: 'LO', letters: ['L', 'O'], audio: 'lo' },
  { syllable: 'LU', letters: ['L', 'U'], audio: 'lu' },
  { syllable: 'MI', letters: ['M', 'I'], audio: 'mi' },
  { syllable: 'PI', letters: ['P', 'I'], audio: 'pi' },
  { syllable: 'FI', letters: ['F', 'I'], audio: 'fi' },
];

interface Question {
  targetSyllable: string;
  targetLetters: string[];
  audio: string;
  availableLetters: string[];
}

export default function MagicSyllables({ onFinish, onQuit }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const { speak } = useSpeech();

  const TOTAL_ROUNDS = 8;

  useEffect(() => {
    generateAllQuestions();
  }, []);

  const generateAllQuestions = () => {
    // Sélectionner 8 syllabes aléatoires
    const selectedSyllables = [...SYLLABLES]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);

    const newQuestions = selectedSyllables.map(syl => {
      // Générer des lettres distractrices
      const allLetters = ['M', 'A', 'P', 'F', 'L', 'I', 'O', 'U', 'S', 'R'];
      const distractors = allLetters
        .filter(l => !syl.letters.includes(l))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Mélanger les lettres disponibles (bonnes + distractrices)
      const available = [...syl.letters, ...distractors].sort(() => Math.random() - 0.5);

      return {
        targetSyllable: syl.syllable,
        targetLetters: syl.letters,
        audio: syl.audio,
        availableLetters: available,
      };
    });

    setQuestions(newQuestions);
  };

  const handleLetterClick = (letter: string) => {
    if (feedback) return; // Bloquer si déjà validé

    // Maximum 2 lettres pour une syllabe
    if (selectedLetters.length >= 2) return;

    setSelectedLetters(prev => [...prev, letter]);
  };

  const handleRemoveLetter = (index: number) => {
    if (feedback) return;
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleValidate = () => {
    if (selectedLetters.length !== 2) return;

    const currentQuestion = questions[currentRound];
    const userSyllable = selectedLetters.join('');
    const isCorrect = userSyllable === currentQuestion.targetSyllable;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
      // Prononcer la syllabe
      speak(currentQuestion.audio);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedLetters([]);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg border-4 border-pink-300 bg-white p-8 text-center"
        >
          <h2 className="mb-4 font-display text-child-2xl font-bold text-pink-700">
            Magnifique ! 🎉
          </h2>
          <div className="mb-6 text-6xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-lg text-gray-700">
            Tu as formé <span className="font-bold text-pink-600">{score}/{TOTAL_ROUNDS}</span> syllabes correctes !
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onQuit} className="btn btn-secondary">
          ← Quitter
        </button>
        <div className="text-child-lg font-bold text-pink-700">
          Syllabe {currentRound + 1}/{TOTAL_ROUNDS}
        </div>
        <div className="text-child-lg font-bold text-pink-700">
          Score : {score}/{currentRound}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-auto mb-12 h-4 max-w-2xl overflow-hidden rounded-full bg-white/50">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-yellow-400"
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
              <h2 className="mb-4 font-display text-child-2xl font-bold text-pink-700">
                Forme la syllabe ! 🔤
              </h2>
              <button
                onClick={handlePlayAudio}
                className="btn btn-primary"
              >
                🔊 Écouter la syllabe
              </button>
            </div>

            {/* Zone de construction */}
            <div className="card mx-auto mb-8 max-w-md border-4 border-pink-300 bg-white p-8">
              <div className="mb-4 text-center text-child-md text-gray-600">
                Syllabe à former :
              </div>
              <div className="mb-6 flex justify-center gap-4">
                {[0, 1].map(index => (
                  <motion.div
                    key={index}
                    className={`flex h-24 w-24 items-center justify-center rounded-xl border-4 ${
                      selectedLetters[index]
                        ? 'border-pink-400 bg-pink-100'
                        : 'border-dashed border-gray-300 bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {selectedLetters[index] ? (
                      <button
                        onClick={() => handleRemoveLetter(index)}
                        className="font-display text-5xl font-bold text-pink-700"
                        disabled={feedback !== null}
                      >
                        {selectedLetters[index]}
                      </button>
                    ) : (
                      <span className="text-child-lg text-gray-400">?</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Bouton Valider */}
              <button
                onClick={handleValidate}
                disabled={selectedLetters.length !== 2 || feedback !== null}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                Valider
              </button>
            </div>

            {/* Lettres disponibles */}
            <div className="mb-8 text-center">
              <p className="mb-4 text-child-md text-gray-600">Choisis les lettres :</p>
              <div className="flex justify-center gap-3">
                {currentQuestion.availableLetters.map((letter, index) => {
                  const isUsed = selectedLetters.includes(letter);
                  return (
                    <motion.button
                      key={`${letter}-${index}`}
                      onClick={() => !isUsed && handleLetterClick(letter)}
                      disabled={isUsed || feedback !== null}
                      className={`card h-20 w-20 border-4 transition-all ${
                        isUsed
                          ? 'border-gray-300 bg-gray-200 opacity-50'
                          : 'border-pink-300 bg-white hover:scale-110 hover:border-pink-500'
                      }`}
                      whileHover={!isUsed ? { scale: 1.1 } : {}}
                      whileTap={!isUsed ? { scale: 0.95 } : {}}
                    >
                      <span className="font-display text-4xl font-bold text-pink-700">
                        {letter}
                      </span>
                    </motion.button>
                  );
                })}
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
                {feedback === 'correct' ? '✅ Bravo !' : `❌ C'était ${currentQuestion.targetSyllable}`}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
