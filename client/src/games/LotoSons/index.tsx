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
    { word: 'araignée', sound: 'a', image: '🕷️' },
    { word: 'abeille', sound: 'a', image: '🐝' },
    { word: 'auto', sound: 'a', image: '🚗' },
    { word: 'ballon', sound: 'a', image: '⚽' },
    { word: 'banane', sound: 'a', image: '🍌' },
    { word: 'chapeau', sound: 'a', image: '🎩' },
    { word: 'château', sound: 'a', image: '🏰' },
    { word: 'lapin', sound: 'a', image: '🐰' },
    { word: 'cadeau', sound: 'a', image: '🎁' },
    { word: 'bateau', sound: 'a', image: '⛵' },
  ],
  e: [
    { word: 'éléphant', sound: 'e', image: '🐘' },
    { word: 'étoile', sound: 'e', image: '⭐' },
    { word: 'école', sound: 'e', image: '🏫' },
    { word: 'échelle', sound: 'e', image: '🪜' },
    { word: 'écureuil', sound: 'e', image: '🐿️' },
    { word: 'épée', sound: 'e', image: '⚔️' },
    { word: 'hérisson', sound: 'e', image: '🦔' },
    { word: 'dé', sound: 'e', image: '🎲' },
    { word: 'bébé', sound: 'e', image: '👶' },
    { word: 'télé', sound: 'e', image: '📺' },
    { word: 'café', sound: 'e', image: '☕' },
    { word: 'clé', sound: 'e', image: '🔑' },
  ],
  i: [
    { word: 'igloo', sound: 'i', image: '🛖' },
    { word: 'île', sound: 'i', image: '🏝️' },
    { word: 'taxi', sound: 'i', image: '🚕' },
    { word: 'lit', sound: 'i', image: '🛏️' },
    { word: 'souris', sound: 'i', image: '🐭' },
    { word: 'pizza', sound: 'i', image: '🍕' },
    { word: 'kiwi', sound: 'i', image: '🥝' },
    { word: 'fusil', sound: 'i', image: '🔫' },
    { word: 'ski', sound: 'i', image: '⛷️' },
    { word: 'livre', sound: 'i', image: '📚' },
    { word: 'bijou', sound: 'i', image: '💎' },
  ],
  o: [
    { word: 'oiseau', sound: 'o', image: '🐦' },
    { word: 'orange', sound: 'o', image: '🍊' },
    { word: 'os', sound: 'o', image: '🦴' },
    { word: 'moto', sound: 'o', image: '🏍️' },
    { word: 'robot', sound: 'o', image: '🤖' },
    { word: 'vélo', sound: 'o', image: '🚲' },
    { word: 'domino', sound: 'o', image: '🎲' },
    { word: 'piano', sound: 'o', image: '🎹' },
    { word: 'photo', sound: 'o', image: '📷' },
    { word: 'pot', sound: 'o', image: '🏺' },
    { word: 'taureau', sound: 'o', image: '🐂' },
  ],
  u: [
    { word: 'usine', sound: 'u', image: '🏭' },
    { word: 'lune', sound: 'u', image: '🌙' },
    { word: 'tortue', sound: 'u', image: '🐢' },
    { word: 'jus', sound: 'u', image: '🧃' },
    { word: 'pull', sound: 'u', image: '🧥' },
    { word: 'bus', sound: 'u', image: '🚌' },
    { word: 'chute', sound: 'u', image: '⬇️' },
    { word: 'légume', sound: 'u', image: '🥕' },
    { word: 'flute', sound: 'u', image: '🎵' },
    { word: 'plume', sound: 'u', image: '🪶' },
  ],
  ch: [
    { word: 'chat', sound: 'ch', image: '🐱' },
    { word: 'chien', sound: 'ch', image: '🐶' },
    { word: 'chocolat', sound: 'ch', image: '🍫' },
    { word: 'cheval', sound: 'ch', image: '🐴' },
    { word: 'chaussure', sound: 'ch', image: '👟' },
    { word: 'vache', sound: 'ch', image: '🐄' },
    { word: 'chemise', sound: 'ch', image: '👔' },
    { word: 'chenille', sound: 'ch', image: '🐛' },
    { word: 'pêche', sound: 'ch', image: '🍑' },
    { word: 'mouche', sound: 'ch', image: '🪰' },
    { word: 'bouche', sound: 'ch', image: '👄' },
    { word: 'chameau', sound: 'ch', image: '🐫' },
  ],
  on: [
    { word: 'lion', sound: 'on', image: '🦁' },
    { word: 'ballon', sound: 'on', image: '🎈' },
    { word: 'cochon', sound: 'on', image: '🐷' },
    { word: 'camion', sound: 'on', image: '🚚' },
    { word: 'citron', sound: 'on', image: '🍋' },
    { word: 'mouton', sound: 'on', image: '🐑' },
    { word: 'bonbon', sound: 'on', image: '🍬' },
    { word: 'dragon', sound: 'on', image: '🐉' },
    { word: 'avion', sound: 'on', image: '✈️' },
    { word: 'melon', sound: 'on', image: '🍈' },
    { word: 'tonton', sound: 'on', image: '👨' },
  ],
  ou: [
    { word: 'loup', sound: 'ou', image: '🐺' },
    { word: 'poule', sound: 'ou', image: '🐔' },
    { word: 'mouton', sound: 'ou', image: '🐑' },
    { word: 'chou', sound: 'ou', image: '🥬' },
    { word: 'coucou', sound: 'ou', image: '👋' },
    { word: 'hibou', sound: 'ou', image: '🦉' },
    { word: 'genou', sound: 'ou', image: '🦵' },
    { word: 'joue', sound: 'ou', image: '😊' },
    { word: 'roue', sound: 'ou', image: '⚙️' },
    { word: 'bougie', sound: 'ou', image: '🕯️' },
    { word: 'douche', sound: 'ou', image: '🚿' },
  ],
  an: [
    { word: 'éléphant', sound: 'an', image: '🐘' },
    { word: 'serpent', sound: 'an', image: '🐍' },
    { word: 'dent', sound: 'an', image: '🦷' },
    { word: 'gant', sound: 'an', image: '🧤' },
    { word: 'orange', sound: 'an', image: '🍊' },
    { word: 'ambulance', sound: 'an', image: '🚑' },
    { word: 'diamant', sound: 'an', image: '💎' },
    { word: 'volcan', sound: 'an', image: '🌋' },
    { word: 'pantalon', sound: 'an', image: '👖' },
    { word: 'enfant', sound: 'an', image: '👧' },
  ],
  in: [
    { word: 'lapin', sound: 'in', image: '🐰' },
    { word: 'pain', sound: 'in', image: '🍞' },
    { word: 'sapin', sound: 'in', image: '🎄' },
    { word: 'requin', sound: 'in', image: '🦈' },
    { word: 'poussin', sound: 'in', image: '🐣' },
    { word: 'jardin', sound: 'in', image: '🌻' },
    { word: 'pin', sound: 'in', image: '🌲' },
    { word: 'moulin', sound: 'in', image: '⚙️' },
    { word: 'raisin', sound: 'in', image: '🍇' },
    { word: 'main', sound: 'in', image: '✋' },
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
