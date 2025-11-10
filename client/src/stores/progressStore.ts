import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Progress {
  id: string;
  profileId: string;
  world: number;
  level: number;
  stars: number;
  xp: number;
  attemptsCount: number;
  lastPlayedAt: string;
}

interface ProgressState {
  progressMap: Record<string, Progress[]>; // profileId -> Progress[]
  setProgress: (profileId: string, progress: Progress[]) => void;
  updateProgress: (profileId: string, progress: Progress) => void;
  getProfileProgress: (profileId: string) => Progress[];
  getLevelProgress: (profileId: string, world: number, level: number) => Progress | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressMap: {},
      setProgress: (profileId, progress) =>
        set((state) => ({
          progressMap: { ...state.progressMap, [profileId]: progress },
        })),
      updateProgress: (profileId, progress) =>
        set((state) => {
          const existing = state.progressMap[profileId] || [];
          const updated = existing.filter(
            (p) => !(p.world === progress.world && p.level === progress.level)
          );
          return {
            progressMap: { ...state.progressMap, [profileId]: [...updated, progress] },
          };
        }),
      getProfileProgress: (profileId) => get().progressMap[profileId] || [],
      getLevelProgress: (profileId, world, level) => {
        const progress = get().progressMap[profileId] || [];
        return progress.find((p) => p.world === world && p.level === level);
      },
    }),
    { name: 'lectio-progress' }
  )
);
