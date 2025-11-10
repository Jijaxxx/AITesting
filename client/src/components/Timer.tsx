import { useEffect, useState } from 'react';

interface TimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function Timer({ durationSeconds, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / durationSeconds) * 100;

  // Couleur selon le temps restant
  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Affichage numérique */}
      <div className="font-display text-child-2xl font-bold text-gray-700">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* Barre de progression */}
      <div className="h-6 w-full max-w-md overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Icône horloge animée */}
      <div className={`text-5xl ${timeLeft <= 10 ? 'animate-bounce' : ''}`}>
        ⏱️
      </div>
    </div>
  );
}
