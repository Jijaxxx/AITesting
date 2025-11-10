import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import Timer from '../../components/Timer';

interface Letter {
  letter: string;
  isTarget: boolean;
}

interface PecheAuxLettresProps {
  targetLetter: string; // Lettre à pêcher (ex: 'a', 'b', 'ch')
  onComplete: (score: { correct: number; total: number; timeSpent: number }) => void;
}

export default function PecheAuxLettres({ targetLetter, onComplete }: PecheAuxLettresProps) {
  const { speak } = useSpeech({ rate: 0.8, pitch: 1.1 });
  
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalRounds] = useState(8);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  // Toutes les lettres disponibles
  const allLetters = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'ch', 'ou', 'on', 'an', 'in'];

  // Générer une nouvelle série de lettres
  useEffect(() => {
    if (!gameStarted || round === 0 || round > totalRounds) return;

    // Créer 6 lettres dont 2-3 sont la lettre cible
    const targetCount = Math.random() > 0.5 ? 3 : 2;
    const distractorCount = 6 - targetCount;

    const targets: Letter[] = Array(targetCount).fill(null).map(() => ({
      letter: targetLetter,
      isTarget: true,
    }));

    const distractors: Letter[] = allLetters
      .filter(l => l !== targetLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, distractorCount)
      .map(l => ({ letter: l, isTarget: false }));

    const shuffled = [...targets, ...distractors].sort(() => Math.random() - 0.5);
    setLetters(shuffled);
    setFeedback(null);

    setTimeout(() => {
      speak(`Pêche toutes les lettres ${targetLetter}`);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameStarted, targetLetter, totalRounds]);

  const handleStart = () => {
    setGameStarted(true);
    setRound(1);
  };

  const handleLetterClick = (letter: Letter, index: number) => {
    if (feedback) return;

    const isCorrect = letter.isTarget;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback('correct');
      speak('Bravo ! 🎣');
      
      // Retirer la lettre pêchée
      setLetters((prev) => prev.filter((_, i) => i !== index));

      // Vérifier s'il reste des lettres cibles
      setTimeout(() => {
        setLetters((currentLetters) => {
          const remainingTargets = currentLetters.filter(l => l.isTarget);
          if (remainingTargets.length === 0) {
            // Passer au round suivant
            setTimeout(() => {
              if (round < totalRounds) {
                setRound((prev) => prev + 1);
              } else {
                // Jeu terminé
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                onComplete({ correct: score + 1, total: totalRounds * 3, timeSpent });
              }
            }, 1000);
          }
          return currentLetters;
        });
        setFeedback(null);
      }, 800);
    } else {
      setErrors((prev) => prev + 1);
      setFeedback('incorrect');
      speak(`Non, ce n'est pas ${targetLetter}`);
      
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete({ correct: score, total: totalRounds * 3, timeSpent });
  };

  if (!gameStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="mb-4 font-display text-child-2xl font-bold text-primary-700">
            Pêche aux Lettres
          </h1>
          <p className="mb-2 text-child-lg text-gray-700">
            Pêche toutes les lettres demandées !
          </p>
          <p className="text-child-base text-gray-600">
            Lettre à pêcher : <span className="font-bold text-primary-600">{targetLetter}</span>
          </p>
        </div>

        <div className="text-8xl">🎣</div>

        <button onClick={handleStart} className="btn-primary">
          Commencer 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      {/* Header avec score et timer */}
      <div className="mb-8 flex items-center justify-between">
        <div className="font-display text-child-xl font-bold text-gray-700">
          Manche {round}/{totalRounds}
        </div>
        <div className="flex gap-4">
          <div className="font-display text-child-xl font-bold text-primary-600">
            Pêchées: {score} 🎣
          </div>
          <div className="font-display text-child-xl font-bold text-red-600">
            Erreurs: {errors} ❌
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Timer durationSeconds={90} onTimeUp={handleTimeUp} isPaused={false} />
      </div>

      {/* Consigne */}
      <div className="mb-8 text-center">
        <div className="inline-block rounded-3xl bg-primary-100 px-8 py-4">
          <p className="font-display text-child-xl font-bold text-primary-700">
            Pêche toutes les lettres : <span className="text-4xl">{targetLetter}</span>
          </p>
        </div>
      </div>

      {/* Étang avec les lettres */}
      <div className="relative flex-1 rounded-3xl bg-gradient-to-b from-blue-200 to-blue-400 p-8">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <AnimatePresence>
            {letters.map((letter, index) => (
              <motion.button
                key={`${round}-${index}-${letter.letter}`}
                onClick={() => handleLetterClick(letter, index)}
                disabled={!!feedback}
                className="card flex h-32 w-32 items-center justify-center transition-all hover:scale-110"
                initial={{ scale: 0, y: -100, rotate: -180 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0, y: 100, rotate: 180, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="font-display text-6xl font-bold text-primary-700">
                  {letter.letter}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`fixed inset-x-0 bottom-20 mx-auto w-fit rounded-3xl px-12 py-6 text-center ${
                feedback === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              <div className="font-display text-child-2xl font-bold">
                {feedback === 'correct' ? '🎣 Bravo !' : '❌ Essaie encore !'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
