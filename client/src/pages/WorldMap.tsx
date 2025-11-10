import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useProfileStore } from '../stores/profileStore';
import { progressApi } from '../services/api';
import PageTransition from '../components/PageTransition';
import { AVATARS } from '../components/AvatarGrid';
import { WORLD_THEMES } from '../config/worldThemes';

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
              {[1, 2, 3].map((world) => {
                const theme = WORLD_THEMES[world as keyof typeof WORLD_THEMES];
                const worldProgress = progress.filter((p) => p.world === world);
                const worldStars = worldProgress.reduce((sum, p) => sum + p.stars, 0);
                
                return (
                  <div 
                    key={world} 
                    className={`card border-4 ${theme.borderColor} bg-gradient-to-br ${theme.color} relative overflow-hidden`}
                  >
                    {/* Décoration avec personnages du thème */}
                    <div className="absolute top-4 right-4 flex gap-2 text-4xl opacity-20">
                      {theme.characters.map((char, i) => (
                        <span key={i}>{char}</span>
                      ))}
                    </div>

                    {/* En-tête du monde */}
                    <div className="mb-6 relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-6xl">{theme.emoji}</span>
                        <h2 className={`font-display text-child-xl font-bold ${theme.textColor}`}>
                          {theme.name}
                        </h2>
                      </div>
                      <p className="text-child-base text-gray-600 mb-2">
                        {theme.description}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-child-sm font-bold text-gray-700">
                          {worldStars} / 12 ⭐
                        </span>
                      </div>
                    </div>

                    {/* Niveaux */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {[1, 2, 3, 4].map((level) => {
                        const levelProgress = progress.find(
                          (p) => p.world === world && p.level === level
                        );
                        const stars = levelProgress?.stars || 0;
                        
                        return (
                          <button
                            key={level}
                            className={`${theme.bgColor} border-2 ${theme.borderColor} rounded-2xl px-6 py-4 font-bold text-child-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95`}
                            onClick={() => window.location.href = `/game/${world}/${level}`}
                          >
                            <div className="mb-2 text-3xl">{theme.characters[level - 1]}</div>
                            <div className={theme.textColor}>Niveau {level}</div>
                            {stars > 0 && (
                              <div className="mt-2 text-xl">
                                {'⭐'.repeat(stars)}
                                {'☆'.repeat(3 - stars)}
                              </div>
                            )}
                            {stars === 0 && (
                              <div className="mt-2 text-gray-400">
                                ☆☆☆
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
