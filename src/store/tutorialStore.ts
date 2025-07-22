import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKeys } from "./storeKeys";

interface TutorialStore {
  hasSeenTutorial: boolean;
  markTutorialAsSeen: () => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,

      markTutorialAsSeen: () => {
        set({ hasSeenTutorial: true });
      },

      resetTutorial: () => {
        set({ hasSeenTutorial: false });
      },
    }),
    {
      name: StoreKeys.TutorialStore,
      partialize: (state) => ({
        hasSeenTutorial: state.hasSeenTutorial,
      }),
    }
  )
);
