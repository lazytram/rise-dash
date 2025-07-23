export enum CardRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export enum CardType {
  RICE_GRAIN = "rice_grain",
  RICE_BOWL = "rice_bowl",
  RICE_FIELD = "rice_field",
  SUSHI = "sushi",
  RAMEN = "ramen",
  BENTO = "bento",
}

export interface CardReward {
  id: string;
  type: CardType;
  rarity: CardRarity;
  emoji: string;
  label: string;
  value: number;
  probability: number;
}

export interface CardState {
  isRevealing: boolean;
  selectedCard?: CardReward | null;
  isRevealed: boolean;
}

export interface DailyRevealState {
  canReveal: boolean;
  lastRevealTime?: number;
  riceBalance: number;
  cardState: CardState;
}