interface LevelTileProps {
  level: number;
  stars: number;
  isLocked?: boolean;
  onPlay: () => void;
}

export default function LevelTile({ level, stars, isLocked = false, onPlay }: LevelTileProps) {
  return (
    <button
      onClick={onPlay}
      disabled={isLocked}
      className={`card transform transition-all hover:scale-105 ${
        isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Numéro du niveau */}
        <div className="rounded-full bg-primary-100 px-6 py-3">
          <span className="font-display text-child-xl font-bold text-primary-700">
            {level}
          </span>
        </div>

        {/* Étoiles */}
        {!isLocked && (
          <div className="flex gap-1">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={`text-3xl ${
                  star <= stars ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* Cadenas si verrouillé */}
        {isLocked && (
          <div className="text-5xl text-gray-400">
            🔒
          </div>
        )}
      </div>
    </button>
  );
}
