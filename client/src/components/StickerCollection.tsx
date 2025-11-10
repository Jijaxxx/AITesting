import { motion } from 'framer-motion';

interface StickerCollectionProps {
  stickers: string[];
}

const ALL_STICKERS = [
  '🌟', '⭐', '✨', '💫', '🎉', '🎊', '🎈', '🎁',
  '🦄', '🌈', '☀️', '🌙', '⚡', '💎', '👑', '🏆',
  '🐱', '🐶', '🐰', '🦁', '🐼', '🦊', '🐻', '🐯',
  '🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍊', '🍋',
  '🚀', '✈️', '🚁', '🛸', '⛵', '🚗', '🚲', '🏍️',
  '❤️', '💛', '💚', '💙', '💜', '🧡', '🤎', '🖤',
];

export default function StickerCollection({ stickers }: StickerCollectionProps) {
  const earnedSet = new Set(stickers);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-child-lg font-bold text-gray-700">
          Ma collection de stickers
        </h3>
        <div className="rounded-full bg-primary-100 px-4 py-2 font-bold text-primary-700">
          {stickers.length} / {ALL_STICKERS.length}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-10">
        {ALL_STICKERS.map((sticker, index) => {
          const isEarned = earnedSet.has(sticker);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.02,
                type: 'spring',
                stiffness: 150,
              }}
              whileHover={isEarned ? { scale: 1.3, rotate: 15 } : {}}
              className={`card aspect-square flex items-center justify-center text-4xl transition-all ${
                isEarned
                  ? 'cursor-pointer'
                  : 'grayscale opacity-30 cursor-not-allowed'
              }`}
              title={isEarned ? 'Gagné !' : 'Pas encore gagné'}
            >
              {sticker}
            </motion.div>
          );
        })}
      </div>

      {stickers.length === 0 && (
        <div className="rounded-2xl bg-primary-50 p-8 text-center">
          <p className="text-child-base text-gray-600">
            Joue et gagne des étoiles pour débloquer des stickers ! 🎮
          </p>
        </div>
      )}
    </div>
  );
}

export { ALL_STICKERS };
