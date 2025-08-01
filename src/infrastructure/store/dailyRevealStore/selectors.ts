import { useDailyRevealStore } from "./index";
import { DailyRevealSelectors } from "./types";
import { formatTimeRemaining } from "./utils";

export const useDailyRevealSelectors = (
  address?: string
): DailyRevealSelectors => {
  const store = useDailyRevealStore();

  const getDataForAddress = (addr: string) => {
    return store.getDataForAddress(addr);
  };

  const getTimeUntilNextRevealForAddress = (addr: string) => {
    return store.getTimeUntilNextReveal(addr);
  };

  if (!address) {
    return {
      canReveal: false,
      isSpinning: false,
      selectedCard: null,
      isRevealed: false,
      timeUntilNextReveal: 0,
      formattedTimeRemaining: "Ready to reveal",
      revealCard: () => Promise.resolve(undefined),
      resetCard: () => {},
    };
  }

  const data = getDataForAddress(address);
  const timeUntilNextReveal = getTimeUntilNextRevealForAddress(address);
  const formattedTimeRemaining = formatTimeRemaining(timeUntilNextReveal);

  return {
    canReveal: data.canReveal,
    isSpinning: data.cardState.isRevealing,
    selectedCard: data.cardState.selectedCard,
    isRevealed: data.cardState.isRevealed,
    timeUntilNextReveal,
    formattedTimeRemaining,
    revealCard: () => store.revealCard(address),
    resetCard: () => store.resetCard(address),
  };
};
