import { motion } from 'framer-motion';

interface Badge {
  key: string;
  earnedAt: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

const BADGE_EMOJIS: Record<string, { emoji: string; label: string }> = {
  first_star: { emoji: '⭐', label: 'Première étoile' },
  perfect_score: { emoji: '🏆', label: 'Score parfait' },
  fast_learner: { emoji: '⚡', label: 'Rapide comme l\'éclair' },
  persistent: { emoji: '💪', label: 'Persévérant' },
  reader_pro: { emoji: '📚', label: 'Pro de la lecture' },
  sound_master: { emoji: '🎵', label: 'Maître des sons' },
  syllable_champion: { emoji: '🥇', label: 'Champion des syllabes' },
  letter_fisher: { emoji: '🎣', label: 'Pêcheur de lettres' },
  dictation_expert: { emoji: '✍️', label: 'Expert en dictée' },
  three_worlds: { emoji: '🌍', label: 'Trois mondes complétés' },
};

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p className="text-child-base">Joue pour gagner des badges !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
      {badges.map((badge, index) => {
        const badgeInfo = BADGE_EMOJIS[badge.key] || { emoji: '🎖️', label: 'Badge' };
        return (
          <motion.div
            key={badge.key}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="card flex flex-col items-center gap-2 p-4"
          >
            <div className="text-5xl">{badgeInfo.emoji}</div>
            <p className="text-center text-child-xs font-bold text-gray-700">
              {badgeInfo.label}
            </p>
            <p className="text-center text-xs text-gray-500">
              {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

export { BADGE_EMOJIS };
