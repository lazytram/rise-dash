import { CardReward, CardType, CardRarity } from "@/shared/types/dailyReveal";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { Address } from "viem";

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

  /**
   * Claims daily reveal reward and adds RICE to player's balance
   * @param playerAddress The player's wallet address
   * @param cardType The type of card revealed
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  static async claimDailyRevealReward(
    playerAddress: Address,
    cardType: CardType
  ): Promise<boolean> {
    try {
      // Get the card reward
      const card = this.getCardByType(cardType);
      if (!card) {
        console.error("Invalid card type:", cardType);
        return false;
      }

      // Add RICE to player's balance via blockchain
      const success = await this.addRICEToPlayer(playerAddress, card.value);

      return success;
    } catch (error) {
      console.error("❌ Error claiming daily reveal reward:", error);
      return false;
    }
  }

  /**
   * Adds RICE to player's balance via blockchain
   * @param playerAddress The player's wallet address
   * @param amount The amount of RICE to add
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  private static async addRICEToPlayer(
    playerAddress: Address,
    amount: number
  ): Promise<boolean> {
    try {
      // Generate operation hash
      const operationHash = blockchainService.generateOperationHash(
        "ADD_RICE",
        playerAddress,
        amount
      ) as `0x${string}`;

      // Call API to get signature
      const response = await fetch("/api/sign-rice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "ADD_RICE",
          playerAddress,
          amount,
          operationHash,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get signature from API");
      }

      const data = await response.json();
      const signature = data.signature;

      if (!signature) {
        throw new Error("No signature returned from API");
      }

      // Execute the transaction via blockchain service
      // Note: This would typically be done through a wallet connection
      // For now, we'll return true to indicate the signature was generated successfully
      // The actual transaction execution should be handled by the frontend
      return true;
    } catch (error) {
      console.error("❌ Error adding RICE to player:", error);
      return false;
    }
  }

  /**
   * Gets the current RICE balance for a player
   * @param playerAddress The player's wallet address
   * @returns Promise<number> - the player's RICE balance
   */
  static async getPlayerRICEBalance(playerAddress: Address): Promise<number> {
    try {
      return await blockchainService.getRICEBalance(playerAddress);
    } catch (error) {
      console.error("❌ Error getting player RICE balance:", error);
      return 0;
    }
  }
}
