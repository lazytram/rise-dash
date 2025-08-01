import { CardReward } from "@/shared/types/dailyReveal";

// Store data per address
export interface DailyRevealData {
  canReveal: boolean;
  lastRevealTime?: number;
  lastRevealAmount?: number;
  lastRevealHash?: string;
  cardState: {
    isRevealing: boolean;
    selectedCard: CardReward | null;
    isRevealed: boolean;
  };
}

export interface DailyRevealStore {
  // Data per address
  dataByAddress: Record<string, DailyRevealData>;

  // Actions
  revealCard: (address: string) => Promise<CardReward | undefined>;
  resetCard: (address: string) => void;
  addRice: (address: string, amount: number) => void;
  checkRevealAvailability: (address: string) => void;
  setLastRevealTime: (
    address: string,
    time: number,
    amount: number,
    hash: string
  ) => void;
  initializeStore: (address: string) => void;
  getDataForAddress: (address: string) => DailyRevealData;
  getTimeUntilNextReveal: (address: string) => number;
  isCooldownExpired: (address: string) => boolean;
  clearReveal: (address: string) => void;
}

export interface DailyRevealSelectors {
  canReveal: boolean;
  isSpinning: boolean;
  selectedCard: CardReward | null;
  isRevealed: boolean;
  timeUntilNextReveal: number;
  formattedTimeRemaining: string;
  revealCard: () => Promise<CardReward | undefined>;
  resetCard: () => void;
}
