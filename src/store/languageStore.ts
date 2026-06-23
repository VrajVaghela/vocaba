import { create } from "zustand";
import { subscribeWithSelector, persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Platform-aware storage adapter for Zustand persistence
const secureStoreStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(name);
      }
      return null;
    }
    try {
      const value = await SecureStore.getItemAsync(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(name, value);
      }
      return;
    }
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (e) {
      console.warn("SecureStore setItem failed:", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(name);
      }
      return;
    }
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (e) {
      console.warn("SecureStore removeItem failed:", e);
    }
  },
};

export interface LanguageState {
  selectedLanguageId: string | null;
}

export interface LanguageActions {
  setSelectedLanguageId: (id: string | null) => void;
}

export type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedLanguageId: null,
        setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      }),
      {
        name: "vocaba-language-storage",
        storage: createJSONStorage(() => secureStoreStorage),
      }
    )
  )
);
export default useLanguageStore;
