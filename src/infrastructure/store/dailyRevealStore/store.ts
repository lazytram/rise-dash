import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyRevealService } from "@/shared/services/dailyRevealService";
import { StoreKeys } from "../storeKeys";
import { DailyRevealStore } from "./types";
import {
  isCooldownExpired,
  getTimeUntilNextReveal,
  createInitialData,
} from "./utils";

export const useDailyRevealStore = create<DailyRevealStore>()(
  persist(
    (set, get) => ({
      dataByAddress: {},

      getDataForAddress: (address: string) => {
        const state = get();
        if (!state.dataByAddress[address]) {
          // Create initial data without calling isCooldownExpired to avoid recursion
          state.dataByAddress[address] = createInitialData(true);
        }
        return state.dataByAddress[address];
      },

      initializeStore: (address: string) => {
        get().getDataForAddress(address);
        get().checkRevealAvailability(address);
      },

      revealCard: async (address: string) => {
        const data = get().getDataForAddress(address);
        const isDevelopment = process.env.NODE_ENV === "development";

        if (data.cardState.isRevealing || (!isDevelopment && !data.canReveal))
          return;

        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              cardState: {
                ...state.dataByAddress[address].cardState,
                isRevealing: true,
                isRevealed: false,
              },
            },
          },
        }));

        // Simulate revealing animation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Get random card
        const selectedCard = DailyRevealService.getRandomCard();

        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              cardState: {
                ...state.dataByAddress[address].cardState,
                isRevealing: false,
                selectedCard,
                isRevealed: true,
              },
            },
          },
        }));

        // Save reveal time (only in production)
        if (!isDevelopment) {
          get().setLastRevealTime(
            address,
            Date.now(),
            selectedCard.value,
            "daily-reveal"
          );
          get().checkRevealAvailability(address);
        }

        return selectedCard;
      },

      resetCard: (address: string) => {
        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              cardState: {
                ...state.dataByAddress[address].cardState,
                selectedCard: null,
                isRevealed: false,
              },
            },
          },
        }));
      },

      addRice: (address: string, amount: number) => {
        // Rice balance is managed by the blockchain contract
        console.log(`Rice balance updated for ${address}: +${amount} RICE`);
      },

      checkRevealAvailability: (address: string) => {
        const isDevelopment = process.env.NODE_ENV === "development";

        if (isDevelopment) {
          set((state) => ({
            dataByAddress: {
              ...state.dataByAddress,
              [address]: {
                ...state.dataByAddress[address],
                canReveal: true,
              },
            },
          }));
          return;
        }

        const canReveal = get().isCooldownExpired(address);

        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              canReveal,
            },
          },
        }));
      },

      setLastRevealTime: (
        address: string,
        time: number,
        amount: number,
        hash: string
      ) => {
        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              lastRevealTime: time,
              lastRevealAmount: amount,
              lastRevealHash: hash,
            },
          },
        }));
      },

      isCooldownExpired: (address: string) => {
        const data = get().getDataForAddress(address);
        return isCooldownExpired(data);
      },

      getTimeUntilNextReveal: (address: string) => {
        const data = get().getDataForAddress(address);
        return getTimeUntilNextReveal(data);
      },

      clearReveal: (address: string) => {
        set((state) => ({
          dataByAddress: {
            ...state.dataByAddress,
            [address]: {
              ...state.dataByAddress[address],
              lastRevealTime: undefined,
              lastRevealAmount: undefined,
              lastRevealHash: undefined,
              canReveal: true,
            },
          },
        }));
      },
    }),
    {
      name: StoreKeys.DailyRevealStore,
      partialize: (state) => ({
        dataByAddress: state.dataByAddress,
      }),
    }
  )
);
