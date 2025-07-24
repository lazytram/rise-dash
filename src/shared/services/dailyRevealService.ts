import { CardReward, CardType, CardRarity } from "@/shared/types/dailyReveal";

export class DailyRevealService {
  private static readonly CARD_REWARDS: CardReward[] = [
    {
      id: "rice-grain",
      type: CardType.RICE_GRAIN,
      rarity: CardRarity.COMMON,
      emoji: "🌾",
      label: "rice_grain",
      value: 10,
      probability: 0.35,
    },
    {
      id: "rice-bowl",
      type: CardType.RICE_BOWL,
      rarity: CardRarity.COMMON,
      emoji: "🍚",
      label: "rice_bowl",
      value: 25,
      probability: 0.25,
    },
    {
      id: "rice-field",
      type: CardType.RICE_FIELD,
      rarity: CardRarity.UNCOMMON,
      emoji: "🍙",
      label: "onigiri",
      value: 50,
      probability: 0.2,
    },
    {
      id: "sushi",
      type: CardType.SUSHI,
      rarity: CardRarity.RARE,
      emoji: "🍣",
      label: "sushi",
      value: 100,
      probability: 0.12,
    },
    {
      id: "ramen",
      type: CardType.RAMEN,
      rarity: CardRarity.EPIC,
      emoji: "🍘",
      label: "rice_cracker",
      value: 250,
      probability: 0.06,
    },
    {
      id: "bento",
      type: CardType.BENTO,
      rarity: CardRarity.LEGENDARY,
      emoji: "🍱",
      label: "bento_box",
      value: 500,
      probability: 0.02,
    },
  ];

  static getCardRewards(): CardReward[] {
    return this.CARD_REWARDS;
  }

  static getCardByType(type: CardType): CardReward | undefined {
    return this.CARD_REWARDS.find((card) => card.type === type);
  }

  static getRandomCard(): CardReward {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const card of this.CARD_REWARDS) {
      cumulativeProbability += card.probability;
      if (random <= cumulativeProbability) {
        return card;
      }
    }

    return this.CARD_REWARDS[0];
  }

  static getRarityLabel(
    rarity: CardRarity,
    t: (key: string) => string
  ): string {
    return t(`scenes.dailyReveal.rarity.${rarity.toLowerCase()}`);
  }
}
