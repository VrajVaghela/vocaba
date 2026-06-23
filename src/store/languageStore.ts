import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LanguageState {
  selectedLanguageId: string | null;
  // True once the persisted state has finished loading from AsyncStorage.
  // Routing decisions must wait for this so we don't redirect on a stale null.
  hasHydrated: boolean;
}

export interface LanguageActions {
  setSelectedLanguageId: (id: string | null) => void;
  setHasHydrated: (value: boolean) => void;
}

export type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedLanguageId: null,
        hasHydrated: false,
        setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "vocaba-language-storage",
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist the selected language, never the hydration flag.
        partialize: (state) => ({ selectedLanguageId: state.selectedLanguageId }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);

export default useLanguageStore;
