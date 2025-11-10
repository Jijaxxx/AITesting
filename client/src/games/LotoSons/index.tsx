import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import Timer from '../../components/Timer';

interface Word {
  word: string;
  sound: string; // Le son ciblé (ex: 'a', 'ch', 'on')
  image: string; // Emoji pour représenter le mot
}

// Mots d'exemple pour le jeu (devrait venir de l'API/seed en production)
const SAMPLE_WORDS: Record<string, Word[]> = {
  a: [
    { word: 'avion', sound: 'a', image: '✈️' },
    { word: 'arbre', sound: 'a', image: '🌳' },
    { word: 'ananas', sound: 'a', image: '🍍' },
    { word: 'âne', sound: 'a', image: '🫏' },
  ],
  e: [
    { word: 'éléphant', sound: 'e', image: '🐘' },
    { word: 'étoile', sound: 'e', image: '⭐' },
    { word: 'école', sound: 'e', image: '🏫' },
  ],
  ch: [
    { word: 'chat', sound: 'ch', image: '🐱' },
    { word: 'chien', sound: 'ch', image: '🐶' },
    { word: 'chocolat', sound: 'ch', image: '🍫' },
    { word: 'cheval', sound: 'ch', image: '🐴' },
  ],
};

interface LotoSonsProps {
  targetSound: string; // Son à travailler (ex: 'a', 'ch')
  onComplete: (score: { correct: number; total: number; timeSpent: number }) => void;
}

export default function LotoSons({ targetSound, onComplete }: LotoSonsProps) {
  const { speak, isSpeaking } = useSpeech({ rate: 0.8, pitch: 1.1 });
  
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(5);
  const [options, setOptions] = useState<Word[]>([]);
  const [correctWord, setCorrectWord] = useState<Word | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  // Générer une nouvelle question
  useEffect(() => {
    if (!gameStarted || round === 0 || round > totalRounds) return;

    const targetWords = SAMPLE_WORDS[targetSound] || SAMPLE_WORDS.a;
    const allWords = Object.values(SAMPLE_WORDS).flat();
    
    // Sélectionner un mot correct
    const correct = targetWords[Math.floor(Math.random() * targetWords.length)];
    
    // Sélectionner 3 distracteurs (mots qui n'ont PAS le son cible)
    const distractors = allWords
      .filter((w) => w.sound !== targetSound)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Mélanger le mot correct avec les distracteurs
    const shuffled = [correct, ...distractors].sort(() => Math.random() - 0.5);
    
    setCorrectWord(correct);
    setOptions(shuffled);
    setFeedback(null);

    console.log(`Génération question round ${round}`);

    // Lire le mot après un court délai
    setTimeout(() => {
      speak(`Trouve le mot: ${correct.word}`);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameStarted, targetSound, totalRounds]);

  const handleStart = () => {
    setGameStarted(true);
    
    // Générer la première question
    const targetWords = SAMPLE_WORDS[targetSound] || SAMPLE_WORDS.a;
    const allWords = Object.values(SAMPLE_WORDS).flat();
    
    const correct = targetWords[Math.floor(Math.random() * targetWords.length)];
    const distractors = allWords
      .filter((w) => w.sound !== targetSound)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const shuffled = [correct, ...distractors].sort(() => Math.random() - 0.5);
    
    setCorrectWord(correct);
    setOptions(shuffled);
    setRound(1);
    
    // Lire le premier mot
    setTimeout(() => {
      speak(`Trouve le mot: ${correct.word}`);
    }, 500);
  };

  const handleChoice = (word: Word) => {
    if (feedback || !correctWord) return; // Déjà répondu

    const isCorrect = word.word === correctWord.word;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    console.log(`Round ${round}/${totalRounds} - Réponse: ${isCorrect ? 'correcte' : 'incorrecte'}`);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      speak('Bravo ! 🎉');
    } else {
      speak(`Non, c'était ${correctWord.word}`);
    }

    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
      console.log(`Après timeout - Round actuel: ${round}, Total: ${totalRounds}`);
      if (round < totalRounds) {
        console.log('Passage au round suivant');
        setRound((prev) => prev + 1);
      } else {
        // Jeu terminé
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const finalScore = { correct: score + (isCorrect ? 1 : 0), total: totalRounds, timeSpent };
        console.log('Jeu terminé, score final:', finalScore);
        onComplete(finalScore);
      }
    }, 2000);
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
            Loto des Sons
          </h1>
          <p className="mb-2 text-child-lg text-gray-700">
            Écoute bien le mot et trouve la bonne image !
          </p>
          <p className="text-child-base text-gray-600">
            Son à travailler : <span className="font-bold text-primary-600">{targetSound}</span>
          </p>
        </div>

        <div className="text-8xl">🎯</div>

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
          Question {round}/{totalRounds}
        </div>
        <div className="font-display text-child-xl font-bold text-primary-600">
          Score: {score} ⭐
        </div>
      </div>

      <div className="mb-8">
        <Timer durationSeconds={60} onTimeUp={handleTimeUp} isPaused={!!feedback} />
      </div>

      {/* Question */}
      <div className="mb-8 text-center">
        <button
          onClick={() => correctWord && speak(correctWord.word)}
          disabled={isSpeaking}
          className="btn-secondary flex items-center gap-3"
        >
          <span className="text-3xl">🔊</span>
          <span>Réécouter</span>
        </button>
      </div>

      {/* Options (4 images) */}
      <div className="grid flex-1 grid-cols-2 gap-6">
        {options.map((word) => (
          <motion.button
            key={`${round}-${word.word}`}
            onClick={() => handleChoice(word)}
            disabled={!!feedback}
            className={`card flex flex-col items-center justify-center gap-4 transition-all ${
              feedback === 'correct' && word.word === correctWord?.word
                ? 'ring-8 ring-green-500'
                : feedback === 'incorrect' && word.word === correctWord?.word
                ? 'ring-8 ring-green-500'
                : ''
            }`}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
          >
            <div className="text-8xl">{word.image}</div>
            <div className="text-child-lg font-bold text-gray-700">{word.word}</div>
          </motion.button>
        ))}
      </div>

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
              {feedback === 'correct' ? '✅ Bravo !' : `❌ C'était ${correctWord?.word}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
