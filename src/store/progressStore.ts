import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProgressState {
  completedLessons: string[]; // List of completed lesson IDs
  currentLessonId: string | null; // Currently in progress lesson ID
  xp: number; // User XP
  streak: number; // User Streak
  hasHydrated: boolean;
}

export interface ProgressActions {
  completeLesson: (lessonId: string, xpReward?: number) => void;
  startLesson: (lessonId: string) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  setHasHydrated: (value: boolean) => void;
}

export type ProgressStore = ProgressState & ProgressActions;

const initialCompletedLessons = [
  "es-unit-1-lesson-1",
  "es-unit-1-lesson-2",
  "fr-unit-1-lesson-1",
  "ja-unit-1-lesson-1"
];

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      completedLessons: initialCompletedLessons,
      currentLessonId: "es-unit-1-lesson-3", // Default to Lesson 3 in progress (Ordering Coffee)
      xp: 15,
      streak: 12,
      hasHydrated: false,

      completeLesson: (lessonId, xpReward = 50) =>
        set((state) => {
          const alreadyCompleted = state.completedLessons.includes(lessonId);
          const newCompleted = alreadyCompleted
            ? state.completedLessons
            : [...state.completedLessons, lessonId];
          return {
            completedLessons: newCompleted,
            xp: state.xp + (alreadyCompleted ? 0 : xpReward),
            // Clear current if it is the one completed
            currentLessonId: state.currentLessonId === lessonId ? null : state.currentLessonId,
          };
        }),

      startLesson: (lessonId) =>
        set({
          currentLessonId: lessonId,
        }),

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

      resetProgress: () =>
        set({
          completedLessons: [],
          currentLessonId: null,
          xp: 0,
          streak: 0,
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "vocaba-progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        currentLessonId: state.currentLessonId,
        xp: state.xp,
        streak: state.streak,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useProgressStore;
