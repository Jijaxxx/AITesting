import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { progressApi } from '../services/api';

export default function WorldMap() {
  const { profileId } = useParams<{ profileId: string }>();
  const { setProgress, getProfileProgress } = useProgressStore();

  useEffect(() => {
    if (profileId) {
      progressApi.getByProfile(profileId).then((p) => setProgress(profileId, p));
    }
  }, [profileId, setProgress]);

  const progress = profileId ? getProfileProgress(profileId) : [];

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
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
  );
}
