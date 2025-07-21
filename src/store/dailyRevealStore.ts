import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyRevealState, CardReward } from "@/types/dailyStreak";
import { DailyStreakService } from "@/services/dailyStreakService";
import { StoreKeys } from "./storeKeys";

interface DailyRevealStore extends DailyRevealState {
  // Actions
  revealCard: () => Promise<CardReward | undefined>;
  resetCard: () => void;
  addRice: (amount: number) => void;
  checkRevealAvailability: () => void;
  setLastRevealTime: (time: number) => void;
}

export const useDailyRevealStore = create<DailyRevealStore>()(
  persist(
    (set, get) => ({
      canReveal: true,
      lastRevealTime: undefined,
      riceBalance: 0,
      cardState: {
        isRevealing: false,
        selectedCard: null,
        isRevealed: false,
      },

      revealCard: async () => {
        const { cardState, canReveal } = get();
        const isDevelopment = process.env.NODE_ENV === "development";

        if (cardState.isRevealing || (!isDevelopment && !canReveal)) return;

        set((state) => ({
          cardState: {
            ...state.cardState,
            isRevealing: true,
            isRevealed: false,
          },
        }));

        // Simulate revealing animation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Get random card
        const selectedCard = DailyStreakService.getRandomCard();

        set((state) => ({
          cardState: {
            ...state.cardState,
            isRevealing: false,
            selectedCard,
            isRevealed: true,
          },
          riceBalance: state.riceBalance + selectedCard.value,
        }));

        // Save reveal time (only in production)
        if (!isDevelopment) {
          get().setLastRevealTime(Date.now());
          get().checkRevealAvailability();
        }

        return selectedCard;
      },

      resetCard: () => {
        set((state) => ({
          cardState: {
            ...state.cardState,
            selectedCard: null,
            isRevealed: false,
          },
        }));
      },

      addRice: (amount: number) => {
        set((state) => ({
          riceBalance: state.riceBalance + amount,
        }));
      },

      checkRevealAvailability: () => {
        const { lastRevealTime } = get();
        const isDevelopment = process.env.NODE_ENV === "development";

        if (isDevelopment) {
          set({ canReveal: true });
          return;
        }

        if (!lastRevealTime) {
          set({ canReveal: true });
          return;
        }

        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const timeDiff = now - lastRevealTime;

        set({ canReveal: timeDiff >= twentyFourHours });
      },

      setLastRevealTime: (time: number) => {
        set({ lastRevealTime: time });
      },
    }),
    {
      name: StoreKeys.DailyRevealStore,
    }
  )
);

// Add computed selectors
export const useDailyRevealSelectors = () => {
  const store = useDailyRevealStore();

  const getTimeUntilNextReveal = () => {
    const { lastRevealTime } = store;
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      return 0; // No cooldown in development
    }

    if (!lastRevealTime) {
      return 0; // Can reveal immediately
    }

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeDiff = now - lastRevealTime;
    const timeRemaining = twentyFourHours - timeDiff;

    return Math.max(0, timeRemaining);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "Ready!";

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
        .toString()
        .padStart(2, "0")}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const timeUntilNextReveal = getTimeUntilNextReveal();

  return {
    ...store,
    isSpinning: store.cardState.isRevealing,
    selectedCard: store.cardState.selectedCard,
    isRevealed: store.cardState.isRevealed,
    timeUntilNextReveal,
    formattedTimeRemaining: formatTimeRemaining(timeUntilNextReveal),
  };
};
