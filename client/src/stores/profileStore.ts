import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  fontSize: 'normal' | 'large';
  contrast: 'normal' | 'high';
  motionReduced: boolean;
  sessionDuration: number; // minutes
}

export interface Profile {
  id: string;
  pseudo: string;
  age: number;
  avatarKey: string;
  settings: Settings;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfile: null,
      setProfiles: (profiles) => set({ profiles }),
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates }
              : state.currentProfile,
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
        })),
    }),
    { name: 'lectio-profiles' }
  )
);
