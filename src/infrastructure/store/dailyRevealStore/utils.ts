import { DailyRevealData } from "./types";

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return "Ready to reveal";

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const isCooldownExpired = (data: DailyRevealData): boolean => {
  if (!data.lastRevealTime) {
    return true; // No previous reveal, can claim
  }

  const now = Date.now();
  const timeSinceLastReveal = now - data.lastRevealTime;

  return timeSinceLastReveal >= COOLDOWN_MS;
};

export const getTimeUntilNextReveal = (data: DailyRevealData): number => {
  if (!data.lastRevealTime) {
    return 0; // Can reveal immediately
  }

  const now = Date.now();
  const timeSinceLastReveal = now - data.lastRevealTime;
  const timeRemaining = COOLDOWN_MS - timeSinceLastReveal;

  return Math.max(0, timeRemaining);
};

export const createInitialData = (canReveal: boolean): DailyRevealData => ({
  canReveal,
  lastRevealTime: undefined,
  lastRevealAmount: undefined,
  lastRevealHash: undefined,
  cardState: {
    isRevealing: false,
    selectedCard: null,
    isRevealed: false,
  },
});
