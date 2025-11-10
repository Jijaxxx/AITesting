import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import Timer from '../../components/Timer';

interface Syllable {
  syllable: string;
  position: number; // Position correcte dans le mot (0, 1, 2...)
}

interface Word {
  word: string;
  syllables: string[];
  image: string;
}

const SAMPLE_WORDS: Word[] = [
  { word: 'chocolat', syllables: ['cho', 'co', 'lat'], image: '🍫' },
  { word: 'papillon', syllables: ['pa', 'pi', 'llon'], image: '🦋' },
  { word: 'banane', syllables: ['ba', 'nane'], image: '🍌' },
  { word: 'tomate', syllables: ['to', 'mate'], image: '🍅' },
  { word: 'salade', syllables: ['sa', 'lade'], image: '🥗' },
  { word: 'tartine', syllables: ['tar', 'tine'], image: '🍞' },
  { word: 'cerise', syllables: ['ce', 'rise'], image: '🍒' },
  { word: 'citron', syllables: ['ci', 'tron'], image: '🍋' },
  { word: 'orange', syllables: ['o', 'range'], image: '🍊' },
  { word: 'carotte', syllables: ['ca', 'rotte'], image: '🥕' },
  { word: 'animal', syllables: ['a', 'ni', 'mal'], image: '🐾' },
  { word: 'vélo', syllables: ['vé', 'lo'], image: '🚲' },
  { word: 'piano', syllables: ['pi', 'a', 'no'], image: '🎹' },
  { word: 'cadeau', syllables: ['ca', 'deau'], image: '🎁' },
  { word: 'chapeau', syllables: ['cha', 'peau'], image: '🎩' },
];

interface CourseDesSyllabesProps {
  onComplete: (score: { correct: number; total: number; timeSpent: number }) => void;
}

export default function CourseDesSyllabes({ onComplete }: CourseDesSyllabesProps) {
  const { speak } = useSpeech({ rate: 0.7, pitch: 1.1 });
  
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(6);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [shuffledSyllables, setShuffledSyllables] = useState<Syllable[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<Syllable[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  // Générer un nouveau mot
  useEffect(() => {
    if (!gameStarted || round === 0 || round > totalRounds) return;

    const word = SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
    setCurrentWord(word);
    
    const syllablesWithPosition: Syllable[] = word.syllables.map((syl, idx) => ({
      syllable: syl,
      position: idx,
    }));

    setShuffledSyllables(syllablesWithPosition.sort(() => Math.random() - 0.5));
    setSelectedSyllables([]);
    setFeedback(null);

    setTimeout(() => {
      speak(`Remets les syllabes dans l'ordre pour former le mot: ${word.word}`);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameStarted, totalRounds]);

  const handleStart = () => {
    setGameStarted(true);
    setRound(1);
  };

  const handleSyllableClick = (syllable: Syllable) => {
    if (feedback || !currentWord) return;

    const newSelected = [...selectedSyllables, syllable];
    setSelectedSyllables(newSelected);
    setShuffledSyllables((prev) => prev.filter(s => s !== syllable));

    speak(syllable.syllable);

    // Vérifier si le mot est complet
    if (newSelected.length === currentWord.syllables.length) {
      const isCorrect = newSelected.every((syl, idx) => syl.position === idx);
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (isCorrect) {
        setScore((prev) => prev + 1);
        speak('Bravo ! Tu as trouvé le bon ordre ! 🎉');
      } else {
        speak(`Non, le mot est ${currentWord.word}. Essaie encore !`);
      }

      setTimeout(() => {
        if (round < totalRounds) {
          setRound((prev) => prev + 1);
        } else {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          onComplete({ correct: isCorrect ? score + 1 : score, total: totalRounds, timeSpent });
        }
      }, 3000);
    }
  };

  const handleReset = () => {
    if (!currentWord) return;
    
    const syllablesWithPosition: Syllable[] = currentWord.syllables.map((syl, idx) => ({
      syllable: syl,
      position: idx,
    }));

    setShuffledSyllables(syllablesWithPosition.sort(() => Math.random() - 0.5));
    setSelectedSyllables([]);
    setFeedback(null);
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
            Course des Syllabes
          </h1>
          <p className="mb-2 text-child-lg text-gray-700">
            Remets les syllabes dans le bon ordre pour former le mot !
          </p>
        </div>

        <div className="text-8xl">🏃‍♂️</div>

        <button onClick={handleStart} className="btn-primary">
          Commencer 🚀
        </button>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="flex min-h-screen flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="font-display text-child-xl font-bold text-gray-700">
          Mot {round}/{totalRounds}
        </div>
        <div className="font-display text-child-xl font-bold text-primary-600">
          Score: {score} ⭐
        </div>
      </div>

      <div className="mb-8">
        <Timer durationSeconds={90} onTimeUp={handleTimeUp} isPaused={!!feedback} />
      </div>

      {/* Image du mot */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-9xl">{currentWord.image}</div>
        <button
          onClick={() => speak(currentWord.word)}
          className="btn-secondary"
        >
          🔊 Écouter le mot
        </button>
      </div>

      {/* Zone de construction du mot */}
      <div className="mb-8">
        <div className="mb-4 text-center font-display text-child-lg font-bold text-gray-700">
          Forme le mot :
        </div>
        <div className="flex min-h-32 items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-primary-300 bg-primary-50 p-6">
          {selectedSyllables.length === 0 ? (
            <p className="text-child-base text-gray-400">Clique sur les syllabes...</p>
          ) : (
            selectedSyllables.map((syl, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-2xl bg-white px-6 py-4 font-display text-child-xl font-bold text-primary-700 shadow-lg"
              >
                {syl.syllable}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Syllabes disponibles */}
      <div className="flex flex-wrap justify-center gap-4">
        {shuffledSyllables.map((syl, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleSyllableClick(syl)}
            disabled={!!feedback}
            className="card px-8 py-6 font-display text-child-2xl font-bold text-gray-700 transition-transform hover:scale-110"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            {syl.syllable}
          </motion.button>
        ))}
      </div>

      {/* Bouton reset */}
      {selectedSyllables.length > 0 && !feedback && (
        <div className="mt-8 text-center">
          <button onClick={handleReset} className="btn-secondary">
            🔄 Recommencer
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
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="font-display text-child-2xl font-bold">
              {feedback === 'correct' ? '✅ Bravo !' : `❌ C'était ${currentWord.word}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
