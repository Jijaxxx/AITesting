import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profileStore';
import { profileApi } from '../services/api';
import AvatarGrid from '../components/AvatarGrid';

export default function CreateProfile() {
  const navigate = useNavigate();
  const { addProfile, setCurrentProfile, profiles } = useProfileStore();
  
  const [pseudo, setPseudo] = useState('');
  const [age, setAge] = useState(5);
  const [avatarKey, setAvatarKey] = useState('avatar_001');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (pseudo.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return;
    }

    if (profiles.length >= 4) {
      setError('Maximum 4 profils atteint');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le profil via l'API
      const newProfile = await profileApi.create({
        pseudo: pseudo.trim(),
        age,
        avatarKey,
      });

      // Ajouter au store local
      addProfile(newProfile);
      setCurrentProfile(newProfile);

      // Rediriger vers la carte des mondes
      navigate(`/world/${newProfile.id}`);
    } catch (err) {
      console.error('Erreur création profil:', err);
      setError('Impossible de créer le profil. Réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="mb-4 font-display text-child-2xl font-bold text-primary-700">
            Créer ton profil
          </h1>
          <p className="text-child-base text-gray-600">
            Choisis ton avatar et dis-nous ton prénom !
          </p>
        </div>

        {/* Sélection avatar */}
        <div className="card">
          <label className="mb-4 block text-child-lg font-bold text-gray-700">
            Choisis ton avatar 🎨
          </label>
          <AvatarGrid selectedKey={avatarKey} onSelect={setAvatarKey} />
        </div>

        {/* Prénom */}
        <div className="card">
          <label htmlFor="pseudo" className="mb-4 block text-child-lg font-bold text-gray-700">
            Ton prénom ✏️
          </label>
          <input
            id="pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full rounded-2xl border-4 border-primary-200 px-6 py-4 text-child-lg focus:border-primary-500 focus:outline-none"
            placeholder="Entre ton prénom..."
            maxLength={40}
            required
            autoFocus
          />
        </div>

        {/* Âge */}
        <div className="card">
          <label htmlFor="age" className="mb-4 block text-child-lg font-bold text-gray-700">
            Ton âge 🎂 : {age} ans
          </label>
          <input
            id="age"
            type="range"
            min="3"
            max="8"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-child-sm text-gray-600">
            <span>3 ans</span>
            <span>8 ans</span>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="rounded-2xl bg-red-100 p-4 text-center text-child-base font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-child flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400"
            disabled={isSubmitting}
          >
            ← Retour
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isSubmitting || !pseudo.trim()}
          >
            {isSubmitting ? 'Création...' : 'C\'est parti ! 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
}
