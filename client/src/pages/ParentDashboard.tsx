import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { profileApi } from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';
import StickerCollection from '../components/StickerCollection';
import PageTransition from '../components/PageTransition';

interface ProfileData {
  id: string;
  name: string;
  avatarKey: string;
  progress: Array<{
    levelId: number;
    starsEarned: number;
  }>;
  errorStats: Array<{
    skillId: number;
    totalErrors: number;
    totalAttempts: number;
  }>;
  rewards: {
    xp: number;
    badges: string | string[];
    stickers: string | string[];
  };
}

interface ProgressData {
  levelId: number;
  starsEarned: number;
  worldNumber: number;
  levelNumber: number;
}

export default function ParentDashboard() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getById(profileId!);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-child-lg">Chargement...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-child-lg text-gray-600">Profil introuvable</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary mt-4"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalStars = profile.progress.reduce(
    (sum: number, p: any) => sum + p.starsEarned,
    0
  );
  const totalLevelsCompleted = profile.progress.filter(
    (p: any) => p.starsEarned > 0
  ).length;
  const averageAccuracy =
    profile.errorStats.length > 0
      ? (
          (profile.errorStats.reduce(
            (sum: number, e: any) =>
              sum +
              (e.totalAttempts > 0
                ? ((e.totalAttempts - e.totalErrors) / e.totalAttempts) * 100
                : 0),
            0
          ) /
            profile.errorStats.length) 
        ).toFixed(1)
      : '100';

  // Parse badges
  const badges =
    typeof profile.rewards.badges === 'string'
      ? JSON.parse(profile.rewards.badges)
      : profile.rewards.badges || [];

  // Parse stickers
  const stickers =
    typeof profile.rewards.stickers === 'string'
      ? JSON.parse(profile.rewards.stickers)
      : profile.rewards.stickers || [];

  // Organize progress by world
  const progressByWorld: { [key: number]: ProgressData[] } = {};
  profile.progress.forEach((p: any) => {
    const worldNumber = Math.ceil(p.levelId / 4);
    const levelNumber = ((p.levelId - 1) % 4) + 1;
    if (!progressByWorld[worldNumber]) {
      progressByWorld[worldNumber] = [];
    }
    progressByWorld[worldNumber].push({
      levelId: p.levelId,
      starsEarned: p.starsEarned,
      worldNumber,
      levelNumber,
    });
  });

  // Top error categories
  const topErrors = [...profile.errorStats]
    .sort((a, b) => b.totalErrors - a.totalErrors)
    .slice(0, 5);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                ← Retour
              </button>
              <div>
                <h1 className="font-display text-child-xl font-bold text-gray-800">
                  Tableau de bord parental
                </h1>
                <p className="text-child-base text-gray-600">
                  Profil : <span className="font-bold">{profile.name}</span>{' '}
                  {profile.avatarKey}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-yellow-100 to-yellow-50"
            >
              <div className="text-center">
                <div className="mb-2 text-5xl">⭐</div>
                <div className="text-child-2xl font-bold text-gray-800">
                  {totalStars}
                </div>
                <div className="text-child-sm text-gray-600">
                  Étoiles gagnées
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-green-100 to-green-50"
            >
              <div className="text-center">
                <div className="mb-2 text-5xl">📚</div>
                <div className="text-child-2xl font-bold text-gray-800">
                  {totalLevelsCompleted}
                </div>
                <div className="text-child-sm text-gray-600">
                  Niveaux complétés
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-blue-100 to-blue-50"
            >
              <div className="text-center">
                <div className="mb-2 text-5xl">🎯</div>
                <div className="text-child-2xl font-bold text-gray-800">
                  {averageAccuracy}%
                </div>
                <div className="text-child-sm text-gray-600">
                  Précision moyenne
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-purple-100 to-purple-50"
            >
              <div className="text-center">
                <div className="mb-2 text-5xl">💎</div>
                <div className="text-child-2xl font-bold text-gray-800">
                  {profile.rewards.xp}
                </div>
                <div className="text-child-sm text-gray-600">Points XP</div>
              </div>
            </motion.div>
          </div>

          {/* Progress by World */}
          <div className="mb-8 card">
            <h2 className="mb-4 font-display text-child-lg font-bold text-gray-800">
              📊 Progression par monde
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((worldNum) => {
                const worldProgress = progressByWorld[worldNum] || [];
                const worldStars = worldProgress.reduce(
                  (sum, p) => sum + p.starsEarned,
                  0
                );
                const maxStars = 12; // 4 levels × 3 stars

                return (
                  <div key={worldNum} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700">
                        Monde {worldNum}
                      </span>
                      <span className="text-gray-600">
                        {worldStars} / {maxStars} ⭐
                      </span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(worldStars / maxStars) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: worldNum * 0.2 }}
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((levelNum) => {
                        const levelProgress = worldProgress.find(
                          (p) => p.levelNumber === levelNum
                        );
                        const stars = levelProgress?.starsEarned || 0;
                        return (
                          <div
                            key={levelNum}
                            className="flex-1 rounded-lg bg-gray-100 p-2 text-center text-child-sm"
                          >
                            <div className="text-gray-600">
                              Niveau {levelNum}
                            </div>
                            <div className="text-xl">
                              {'⭐'.repeat(stars)}
                              {'☆'.repeat(3 - stars)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Analysis */}
          {topErrors.length > 0 && (
            <div className="mb-8 card">
              <h2 className="mb-4 font-display text-child-lg font-bold text-gray-800">
                📝 Compétences à travailler
              </h2>
              <div className="space-y-3">
                {topErrors.map((error, index) => {
                  const errorRate =
                    error.totalAttempts > 0
                      ? ((error.totalErrors / error.totalAttempts) * 100).toFixed(
                          1
                        )
                      : '0';
                  return (
                    <div
                      key={error.skillId}
                      className="rounded-lg bg-gray-50 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-gray-700">
                          {index + 1}. Compétence #{error.skillId}
                        </span>
                        <span className="text-sm text-red-600">
                          {error.totalErrors} erreurs ({errorRate}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-red-400"
                          style={{ width: `${errorRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mb-8 card">
              <BadgeDisplay badges={badges} />
            </div>
          )}

          {/* Sticker Collection */}
          <div className="card">
            <StickerCollection stickers={stickers} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
