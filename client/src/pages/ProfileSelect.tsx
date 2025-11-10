import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profileStore';
import { profileApi } from '../services/api';

export default function ProfileSelect() {
  const navigate = useNavigate();
  const { profiles, setProfiles, setCurrentProfile } = useProfileStore();

  useEffect(() => {
    // Charger les profils depuis l'API
    profileApi.getAll().then(setProfiles).catch(console.error);
  }, [setProfiles]);

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile(profile);
    navigate(`/world/${profile.id}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-12 font-display text-child-2xl font-bold text-primary-700">
          Choisis ton profil
        </h1>
        <div className="grid grid-cols-2 gap-8">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className="card focus-visible-ring transform transition-transform hover:scale-105"
            >
              <div className="mb-4 text-6xl">{profile.avatarKey}</div>
              <p className="text-child-lg font-bold">{profile.pseudo}</p>
              <p className="text-child-sm text-gray-600">{profile.age} ans</p>
            </button>
          ))}
          {profiles.length < 4 && (
            <button
              onClick={() => navigate('/create-profile')}
              className="card focus-visible-ring border-dashed border-primary-300 bg-primary-50 opacity-70 transition-opacity hover:opacity-100"
            >
              <div className="mb-4 text-6xl">➕</div>
              <p className="text-child-lg font-bold text-primary-700">Nouveau profil</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
