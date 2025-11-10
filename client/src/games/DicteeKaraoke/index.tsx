import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import Timer from '../../components/Timer';

interface Sentence {
  text: string;
  words: string[];
  blanks: number[]; // Indices des mots à compléter
  image: string;
}

const SAMPLE_SENTENCES: Sentence[] = [
  {
    text: 'Le chat mange du chocolat',
    words: ['Le', 'chat', 'mange', 'du', 'chocolat'],
    blanks: [1, 4],
    image: '🐱🍫',
  },
  {
    text: 'La vache donne du lait',
    words: ['La', 'vache', 'donne', 'du', 'lait'],
    blanks: [1, 4],
    image: '🐄🥛',
  },
  {
    text: 'Le lapin mange une carotte',
    words: ['Le', 'lapin', 'mange', 'une', 'carotte'],
    blanks: [1, 4],
    image: '🐰🥕',
  },
  {
    text: 'Le chien joue avec un ballon',
    words: ['Le', 'chien', 'joue', 'avec', 'un', 'ballon'],
    blanks: [1, 5],
    image: '🐶⚽',
  },
  {
    text: 'La poule pond un oeuf',
    words: ['La', 'poule', 'pond', 'un', 'oeuf'],
    blanks: [1, 4],
    image: '🐔🥚',
  },
  {
    text: 'Le lion dort sous un arbre',
    words: ['Le', 'lion', 'dort', 'sous', 'un', 'arbre'],
    blanks: [1, 5],
    image: '🦁🌳',
  },
  {
    text: 'La souris mange du fromage',
    words: ['La', 'souris', 'mange', 'du', 'fromage'],
    blanks: [1, 4],
    image: '🐭🧀',
  },
  {
    text: 'Le cochon aime la boue',
    words: ['Le', 'cochon', 'aime', 'la', 'boue'],
    blanks: [1, 4],
    image: '🐷💧',
  },
];

interface DicteeKaraokeProps {
  onComplete: (score: { correct: number; total: number; timeSpent: number }) => void;
}

export default function DicteeKaraoke({ onComplete }: DicteeKaraokeProps) {
  const { speak } = useSpeech({ rate: 0.7, pitch: 1.0 });
  
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(5);
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showingSentence, setShowingSentence] = useState(true);
  const [startTime] = useState(Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  // Générer une nouvelle phrase
  useEffect(() => {
    if (!gameStarted || round === 0 || round > totalRounds) return;

    const sentence = SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)];
    setCurrentSentence(sentence);
    setUserInputs(sentence.blanks.map(() => ''));
    setFeedback(null);
    setShowingSentence(true);

    // Montrer la phrase complète pendant 5 secondes
    setTimeout(() => {
      speak(sentence.text);
    }, 500);

    setTimeout(() => {
      setShowingSentence(false);
      speak('À toi de compléter !');
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameStarted, totalRounds]);

  const handleStart = () => {
    setGameStarted(true);
    setRound(1);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const handleValidate = () => {
    if (!currentSentence || feedback) return;

    const isCorrect = currentSentence.blanks.every((blankIdx, i) => {
      const correctWord = currentSentence.words[blankIdx].toLowerCase();
      const userWord = userInputs[i].toLowerCase().trim();
      return correctWord === userWord;
    });

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore((prev) => prev + 1);
      speak('Bravo ! Tout est correct ! 🎉');
    } else {
      speak('Presque ! Regarde la correction.');
    }

    setTimeout(() => {
      if (round < totalRounds) {
        setRound((prev) => prev + 1);
      } else {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete({ correct: isCorrect ? score + 1 : score, total: totalRounds, timeSpent });
      }
    }, 4000);
  };

  const handleListenAgain = () => {
    if (currentSentence) {
      speak(currentSentence.text);
    }
  };

  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete({ correct: score, total: totalRounds, timeSpent });
  };

  if (!gameStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="mb-4 font-display text-child-2xl font-bold text-primary-700">
            Dictée-Karaoké
          </h1>
          <p className="mb-2 text-child-lg text-gray-700">
            Lis la phrase, puis complète les mots manquants !
          </p>
        </div>

        <div className="text-8xl">✍️</div>

        <button onClick={handleStart} className="btn-primary">
          Commencer 🚀
        </button>
      </div>
    );
  }

  if (!currentSentence) return null;

  const isAllFilled = userInputs.every(input => input.trim().length > 0);

  return (
    <div className="flex min-h-screen flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="font-display text-child-xl font-bold text-gray-700">
          Phrase {round}/{totalRounds}
        </div>
        <div className="font-display text-child-xl font-bold text-primary-600">
          Score: {score} ⭐
        </div>
      </div>

      <div className="mb-8">
        <Timer durationSeconds={120} onTimeUp={handleTimeUp} isPaused={!!feedback} />
      </div>

      {/* Image */}
      <div className="mb-8 text-center text-8xl">
        {currentSentence.image}
      </div>

      {/* Phrase */}
      <div className="mb-8 flex-1">
        <div className="card mx-auto max-w-4xl p-8">
          {showingSentence ? (
            // Afficher la phrase complète
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center font-display text-child-2xl font-bold text-gray-800"
            >
              {currentSentence.text}
              <div className="mt-4 text-child-base text-gray-600">
                Mémorise bien la phrase...
              </div>
            </motion.div>
          ) : (
            // Afficher la phrase avec blancs
            <div className="flex flex-wrap items-center justify-center gap-3 text-child-xl">
              {currentSentence.words.map((word, idx) => {
                const blankIndex = currentSentence.blanks.indexOf(idx);
                
                if (blankIndex !== -1) {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        value={userInputs[blankIndex]}
                        onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                        disabled={!!feedback}
                        className={`w-40 rounded-2xl border-4 px-4 py-3 text-center font-display text-child-xl font-bold focus:outline-none focus:ring-4 focus:ring-primary-500 ${
                          feedback === 'correct'
                            ? 'border-green-500 bg-green-50'
                            : feedback === 'incorrect'
                            ? userInputs[blankIndex].toLowerCase().trim() === word.toLowerCase()
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-primary-300 bg-white'
                        }`}
                        placeholder="____"
                      />
                      {feedback === 'incorrect' && 
                       userInputs[blankIndex].toLowerCase().trim() !== word.toLowerCase() && (
                        <div className="mt-2 text-center text-child-base text-green-600">
                          → {word}
                        </div>
                      )}
                    </motion.div>
                  );
                }
                
                return (
                  <span key={idx} className="font-display text-child-xl font-bold text-gray-800">
                    {word}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Boutons */}
      {!showingSentence && !feedback && (
        <div className="flex justify-center gap-4">
          <button onClick={handleListenAgain} className="btn-secondary">
            🔊 Réécouter
          </button>
          <button
            onClick={handleValidate}
            disabled={!isAllFilled}
            className={`btn-primary ${!isAllFilled ? 'opacity-50' : ''}`}
          >
            Valider ✅
          </button>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed inset-x-0 bottom-20 mx-auto w-fit rounded-3xl px-12 py-6 text-center ${
              feedback === 'correct'
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            <div className="font-display text-child-2xl font-bold">
              {feedback === 'correct' ? '✅ Parfait !' : '📝 Regarde la correction'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
