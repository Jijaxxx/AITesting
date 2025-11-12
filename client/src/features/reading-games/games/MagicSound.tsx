/**
 * Jeu 1: Magic Sound (sound_to_letter)
 * Écoute le son et choisis la lettre correspondante
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameProps, GameResult } from '../core/types';
import { useSpeech } from '../../../hooks/useSpeech';
import { usePhonemeAudio } from '../../../services/phonemeAudio';

// Configuration du jeu - Sons phonétiques français
const SOUND_TO_LETTER_MAP: Record<string, string[]> = {
  // Voyelles simples
  'a': ['a', 'â', 'à'],
  'e': ['e', 'é', 'è', 'ê'],
  'i': ['i', 'î', 'ï'],
  'o': ['o', 'ô'],
  'u': ['u', 'û', 'ù'],
  
  // Consonnes courantes
  'f': ['f', 'ph'],
  's': ['s', 'ss', 'c'],
  'm': ['m', 'mm'],
  'l': ['l', 'll'],
  'r': ['r', 'rr'],
  'n': ['n', 'nn'],
  'p': ['p', 'pp'],
  't': ['t', 'tt'],
  
  // Digraphes et sons complexes (IMPORTANT pour l'apprentissage)
  'ch': ['ch'],      // /ʃ/ - Le son problématique mentionné
  'ou': ['ou', 'où'],
  'on': ['on', 'om'],
  'an': ['an', 'en', 'am', 'em'],
  'in': ['in', 'im', 'ain', 'ein'],
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
  const { speakPhoneme } = usePhonemeAudio();

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
    
    // Lire l'instruction puis le phonème
    setTimeout(() => {
      speak('Trouve la lettre qui fait le son');
      // Puis prononcer le phonème avec le service dédié
      setTimeout(() => {
        speakPhoneme(sound);
      }, 1800);
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

  // Écran de fin avec sauvegarde de la progression
  if (round > roundLength) {
    // Calculer les étoiles
    const percentage = (score / roundLength) * 100;
    let stars: 0 | 1 | 2 | 3 = 0;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-md text-center"
        >
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-4 font-display text-child-xl font-bold text-purple-700">
            Bravo ! Jeu terminé !
          </h2>
          <p className="mb-4 text-child-lg text-gray-700">
            Score: {score}/{roundLength}
          </p>
          <div className="mb-6 text-4xl">
            {'⭐'.repeat(stars)}
            {'☆'.repeat(3 - stars)}
          </div>
          <p className="mb-8 text-child-base text-gray-600">
            {stars === 3 && 'Excellent travail !'}
            {stars === 2 && 'Très bien !'}
            {stars === 1 && 'Bon effort !'}
            {stars === 0 && 'Continue de t\'entraîner !'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onFinish({
                stars,
                score: (score / roundLength) * 100,
                completed: true,
              })}
              className="btn btn-primary"
            >
              Continuer
            </button>
            <button
              onClick={onQuit}
              className="btn btn-secondary"
            >
              Quitter
            </button>
          </div>
        </motion.div>
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
            onClick={() => {
              speak('Le son');
              setTimeout(() => speakPhoneme(currentSound), 800);
            }}
            className="mb-4 rounded-full bg-purple-500 p-12 text-6xl shadow-2xl transition-transform hover:scale-110 active:scale-95"
          >
            🔊
          </button>
          <p className="text-child-lg font-bold text-gray-700">
            Clique pour réécouter le son
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
