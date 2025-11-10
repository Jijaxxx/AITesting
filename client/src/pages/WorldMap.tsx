import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useProfileStore } from '../stores/profileStore';
import { progressApi } from '../services/api';
import PageTransition from '../components/PageTransition';
import { AVATARS } from '../components/AvatarGrid';

export default function WorldMap() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { setProgress, getProfileProgress } = useProgressStore();
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    if (profileId) {
      progressApi.getByProfile(profileId).then((p) => setProgress(profileId, p));
    }
  }, [profileId, setProgress]);

  const progress = profileId ? getProfileProgress(profileId) : [];
  
  // Trouver l'emoji de l'avatar
  const getAvatarEmoji = (avatarKey: string): string => {
    const avatar = AVATARS.find(a => a.key === avatarKey);
    return avatar?.emoji || '👤';
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-8">
        {/* Header avec profil et bouton retour */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary flex items-center gap-2"
          >
            ← Retour
          </button>
          
          {currentProfile && (
            <div className="flex items-center gap-3 card px-6 py-3">
              <span className="text-4xl">{getAvatarEmoji(currentProfile.avatarKey)}</span>
              <div>
                <p className="font-bold text-child-lg">{currentProfile.pseudo}</p>
                <p className="text-child-sm text-gray-600">{currentProfile.age} ans</p>
              </div>
            </div>
          )}
        </div>

        {/* Carte des mondes */}
        <div className="flex items-center justify-center">
          <div className="text-center w-full max-w-5xl">
            <h1 className="mb-12 font-display text-child-2xl font-bold text-primary-700">
              Carte des Mondes
            </h1>
            <div className="space-y-8">
              {[1, 2, 3].map((world) => (
                <div key={world} className="card">
                  <h2 className="mb-6 text-child-xl font-bold">
                    Monde {world}
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((level) => {
                      const levelProgress = progress.find(
                        (p) => p.world === world && p.level === level
                      );
                      return (
                        <button
                          key={level}
                          className="btn-primary"
                          onClick={() => window.location.href = `/game/${world}/${level}`}
                        >
                          Niveau {level}
                          {levelProgress && (
                            <div className="mt-2 text-sm">
                              {'⭐'.repeat(levelProgress.stars)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
