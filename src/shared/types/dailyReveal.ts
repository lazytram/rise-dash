// ================================
// CARD SYSTEM
// ================================

/**
 * Card rarity levels affecting rewards and appearance
 */
export enum CardRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

/**
 * Available card types for daily reveals
 */
export enum CardType {
  RICE_GRAIN = "rice_grain",
  RICE_BOWL = "rice_bowl",
  RICE_FIELD = "rice_field",
  SUSHI = "sushi",
  RAMEN = "ramen",
  BENTO = "bento",
}

/**
 * Card reward configuration
 */
export interface CardReward {
  id: string;
  type: CardType;
  rarity: CardRarity;
  emoji: string;
  label: string;
  value: number;
  probability: number;
}

/**
 * Current card reveal state
 */
export interface CardState {
  isRevealing: boolean;
  selectedCard?: CardReward | null;
  isRevealed: boolean;
}

// ================================
// DAILY REVEAL SYSTEM
// ================================

/**
 * Complete daily reveal system state
 */
export interface DailyRevealState {
  canReveal: boolean;
  lastRevealTime?: number;
  riceBalance: number;
  cardState: CardState;
}
