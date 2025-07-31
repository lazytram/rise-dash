import {
  Address,
  encodeFunctionData,
  createPublicClient,
  http,
  hashMessage,
  toHex,
} from "viem";
import { riseTestnet } from "wagmi/chains";
import { CONTRACT_ADDRESSES_CURRENT } from "@/infrastructure/config";
import { SCOREBOARD_ABI, RICEMANAGER_ABI, POWERUPMANAGER_ABI } from "./abis";

// Contract addresses are now managed centrally
const SCOREBOARD_CONTRACT_ADDRESS = CONTRACT_ADDRESSES_CURRENT.SCORE_BOARD;
const RICEMANAGER_CONTRACT_ADDRESS = CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER;

// Game Owner Private Key (replace with your private key)
const GAME_AUTH_PRIVATE_KEY = process.env.GAME_AUTH_PRIVATE_KEY || "";

// Security key for signing scores (should be kept secret on the server)
const SECURITY_KEY =
  process.env.NEXT_PUBLIC_SECURITY_KEY || "default_security_key_123";

export interface Score {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

export interface LeaderboardEntry {
  score: bigint;
  playerName: string;
  playerAddress: Address;
}

export interface ContractInfo {
  gameOwner: Address;
  paused: boolean;
  minTimeBetweenScores: bigint;
  securityKeySet: boolean;
}

export interface RICEManagerInfo {
  gameOwner: Address;
  paused: boolean;
  minTimeBetweenOperations: bigint;
  securityKeySet: boolean;
  dailyRevealCooldown: bigint;
}

export class BlockchainService {
  private publicClient = createPublicClient({
    chain: riseTestnet,
    transport: http(),
  });

  /**
   * Generates a unique hash for the game
   */
  generateGameHash(
    score: number,
    playerName: string,
    playerAddress: Address
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${score}-${playerName}-${playerAddress}-${timestamp}`;
    return hashMessage(message);
  }

  /**
   * Generates a unique hash for the game with RICE reward
   */
  generateGameHashWithRICE(
    score: number,
    playerName: string,
    riceReward: number,
    playerAddress: Address
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = Math.floor(Math.random() * 1000000);
    const message = `${score}-${playerName}-${riceReward}-${playerAddress}-${timestamp}-${random}`;
    // Ensure we return a proper bytes32 hash
    const hash = hashMessage(message);
    return hash.startsWith("0x") ? hash : `0x${hash}`;
  }

  /**
   * Generates a unique hash for daily reveal operations
   */
  generateDailyRevealHash(playerAddress: Address, amount: number): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `DAILY_REVEAL_RICE-${playerAddress}-${amount}-${timestamp}`;
    return hashMessage(message);
  }

  /**
   * Creates a signature for a score using the security key
   */
  async createScoreSignature(
    score: number,
    playerName: string,
    playerAddress: Address,
    gameHash: string
  ): Promise<`0x${string}`> {
    try {
      // Call the API to get the signature from the server
      const response = await fetch("/api/sign-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          playerName,
          playerAddress,
          gameHash,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to get signature from server"
        );
      }

      const data = await response.json();
      return data.signature as `0x${string}`;
    } catch (error) {
      console.error("❌ Error getting signature from server:", error);
      throw new Error("Failed to get signature from server");
    }
  }

  /**
   * Creates a signature for a score with RICE reward using the security key
   */
  async createScoreWithRICESignature(
    score: number,
    playerName: string,
    riceReward: number,
    playerAddress: Address,
    gameHash: string
  ): Promise<`0x${string}`> {
    try {
      // Call the API to get the signature from the server
      const response = await fetch("/api/sign-score-with-rice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          playerName,
          riceReward,
          playerAddress,
          gameHash,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to get signature from server"
        );
      }

      const data = await response.json();
      return data.signature as `0x${string}`;
    } catch (error) {
      console.error("❌ Error getting signature from server:", error);
      throw new Error("Failed to get signature from server");
    }
  }

  /**
   * Records a score on the blockchain - ANY PLAYER CAN CALL WITH VALID SIGNATURE
   */
  async recordScore(
    score: number,
    playerName: string,
    playerAddress: Address
  ): Promise<{ gameHash: `0x${string}`; signature: `0x${string}` }> {
    // Generate a unique hash for this game
    const gameHash = this.generateGameHash(
      score,
      playerName,
      playerAddress
    ) as `0x${string}`;

    // Create the signature
    const signature = await this.createScoreSignature(
      score,
      playerName,
      playerAddress,
      gameHash
    );

    return { gameHash, signature };
  }

  /**
   * Records a score with RICE rewards on the blockchain - ANY PLAYER CAN CALL WITH VALID SIGNATURE
   */
  async recordScoreWithRICE(
    score: number,
    playerName: string,
    riceReward: number,
    playerAddress: Address
  ): Promise<{ gameHash: `0x${string}`; signature: `0x${string}` }> {
    // Generate a unique hash for this game with RICE reward
    const gameHash = this.generateGameHashWithRICE(
      score,
      playerName,
      riceReward,
      playerAddress
    ) as `0x${string}`;

    // Create the signature for score with RICE
    const signature = await this.createScoreWithRICESignature(
      score,
      playerName,
      riceReward,
      playerAddress,
      gameHash
    );

    return { gameHash, signature };
  }

  /**
   * Emergency function to record a score (only game owner)
   */
  async recordScoreEmergency(
    score: number,
    playerName: string,
    playerAddress: Address
  ): Promise<`0x${string}`> {
    if (!GAME_AUTH_PRIVATE_KEY) {
      throw new Error("Game owner private key not configured");
    }

    const gameHash = this.generateGameHash(
      score,
      playerName,
      playerAddress
    ) as `0x${string}`;

    const data = encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "recordScoreEmergency",
      args: [BigInt(score), playerName, playerAddress, gameHash],
    });

    return data;
  }

  /**
   * Sets the security key (only game owner)
   */
  async setSecurityKey(securityKey: string): Promise<`0x${string}`> {
    if (!GAME_AUTH_PRIVATE_KEY) {
      throw new Error("Game owner private key not configured");
    }

    const data = encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "setSecurityKey",
      args: [toHex(securityKey, { size: 32 })],
    });

    return data;
  }

  /**
   * Gets the best score of a player
   */
  async getPlayerBestScore(playerAddress: Address): Promise<bigint> {
    try {
      const result = await this.publicClient.readContract({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "getPlayerBestScore",
        args: [playerAddress],
      });

      return result;
    } catch (error) {
      console.error("Error getting player best score:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Gets all scores of a player
   */
  async getPlayerScores(playerAddress: Address): Promise<Score[]> {
    try {
      const result = await this.publicClient.readContract({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "getPlayerScores",
        args: [playerAddress],
      });

      return result as Score[];
    } catch (error) {
      console.error("Error getting player scores:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Gets the global leaderboard
   */
  async getLeaderboard(
    offset: number,
    limit: number
  ): Promise<LeaderboardEntry[]> {
    try {
      const result = await this.publicClient.readContract({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "getLeaderboard",
        args: [BigInt(offset), BigInt(limit)],
      });

      return result as LeaderboardEntry[];
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Check contract configuration
   */
  async checkContractConfig(): Promise<{
    gameOwner: string;
    securityKeySet: boolean;
    paused: boolean;
  }> {
    try {
      const contractInfo = await this.getContractInfo();

      return {
        gameOwner: contractInfo.gameOwner,
        securityKeySet: contractInfo.securityKeySet,
        paused: contractInfo.paused,
      };
    } catch (error) {
      console.error("Error checking contract config:", error);
      throw error;
    }
  }

  /**
   * Gets the total number of scores in the leaderboard
   */
  async getTotalScores(): Promise<bigint> {
    try {
      const result = await this.publicClient.readContract({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "getTotalScores",
      });

      return result;
    } catch (error) {
      console.error("Error getting total scores:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Gets contract information
   */
  async getContractInfo(): Promise<ContractInfo> {
    try {
      const result = await this.publicClient.readContract({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "getContractInfo",
      });

      return {
        gameOwner: result[0],
        paused: result[1],
        minTimeBetweenScores: result[2],
        securityKeySet: result[3],
      };
    } catch (error) {
      console.error("Error getting contract info:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Checks if a score is a new personal record
   */
  async isNewPersonalBest(
    playerAddress: Address,
    score: number
  ): Promise<boolean> {
    try {
      const currentBest = await this.getPlayerBestScore(playerAddress);
      return BigInt(score) > currentBest;
    } catch (error) {
      console.error("Error checking best score:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      return true; // In case of error, we consider it's a new record
    }
  }

  /**
   * Checks if the game owner private key is configured
   */
  isGameOwnerConfigured(): boolean {
    return !!GAME_AUTH_PRIVATE_KEY;
  }

  /**
   * Checks if the security key is configured
   */
  isSecurityKeyConfigured(): boolean {
    return !!SECURITY_KEY;
  }

  /**
   * Generates a unique hash for RICE operations
   */
  generateOperationHash(
    operation: "ADD_RICE" | "SPEND_RICE" | "DAILY_REVEAL_RICE",
    playerAddress: Address,
    amount: number
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${operation}-${playerAddress}-${amount}-${timestamp}`;
    return hashMessage(message);
  }

  /**
   * Generates a unique hash for PowerUp operations
   */
  async getPlayerNonce(playerAddress: Address): Promise<number> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
        abi: POWERUPMANAGER_ABI,
        functionName: "playerNonces",
        args: [playerAddress],
      });
      return Number(result);
    } catch (error) {
      console.error("Error getting player nonce:", error);
      return 0;
    }
  }

  /**
   * Gets RICE balance for a player
   */
  async getRICEBalance(playerAddress: Address): Promise<number> {
    try {
      const result = await this.publicClient.readContract({
        address: RICEMANAGER_CONTRACT_ADDRESS,
        abi: RICEMANAGER_ABI,
        functionName: "getBalance",
        args: [playerAddress],
      });

      return Number(result); // RICEManager now uses RICE units directly
    } catch (error) {
      console.error("Error getting RICE balance:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Gets RICEManager contract information
   */
  async getRICEManagerInfo(): Promise<RICEManagerInfo> {
    try {
      const result = await this.publicClient.readContract({
        address: RICEMANAGER_CONTRACT_ADDRESS,
        abi: RICEMANAGER_ABI,
        functionName: "getContractInfo",
      });

      return {
        gameOwner: result[0],
        paused: result[1],
        minTimeBetweenOperations: result[2],
        securityKeySet: result[3],
        dailyRevealCooldown: result[4],
      };
    } catch (error) {
      console.error("Error getting RICEManager contract info:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw error;
    }
  }

  /**
   * Checks if player can claim daily reveal
   */
  async canClaimDailyReveal(playerAddress: Address): Promise<boolean> {
    try {
      const result = await this.publicClient.readContract({
        address: RICEMANAGER_CONTRACT_ADDRESS,
        abi: RICEMANAGER_ABI,
        functionName: "canClaimDailyReveal",
        args: [playerAddress],
      });

      return result as boolean;
    } catch (error) {
      console.error("Error checking daily reveal eligibility:", error);
      return true; // In case of error, allow claiming
    }
  }

  /**
   * Gets time until next daily reveal can be claimed
   */
  async getTimeUntilNextDailyReveal(playerAddress: Address): Promise<number> {
    try {
      const result = await this.publicClient.readContract({
        address: RICEMANAGER_CONTRACT_ADDRESS,
        abi: RICEMANAGER_ABI,
        functionName: "getTimeUntilNextDailyReveal",
        args: [playerAddress],
      });

      return Number(result);
    } catch (error) {
      console.error("Error getting time until next daily reveal:", error);
      return 0; // In case of error, return 0
    }
  }

  /**
   * Gets power-up levels for a player
   */
  async getPowerUpLevels(playerAddress: Address): Promise<number[]> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
        abi: POWERUPMANAGER_ABI,
        functionName: "getPowerUpLevels",
        args: [playerAddress],
      });

      const resultArray = result as bigint[];
      return resultArray.map((level) => Number(level));
    } catch (error) {
      console.error("Error getting power-up levels:", error);

      // If the function returns empty data, return default levels (all 0)
      if (
        error instanceof Error &&
        error.message.includes("could not decode result data")
      ) {
        return Array(10).fill(0);
      }

      // For CORS errors or network issues, return default levels instead of throwing
      if (
        error instanceof Error &&
        (error.message.includes("CORS") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("HTTP request failed") ||
          error.message.includes("429"))
      ) {
        console.warn(
          "⚠️ Network error getting power-up levels, using default levels"
        );
        return Array(10).fill(0);
      }

      throw error;
    }
  }

  /**
   * Gets power-up configuration (cost and max level)
   */
  async getPowerUpConfig(
    powerUpId: number
  ): Promise<{ cost: number; maxLevel: number }> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
        abi: POWERUPMANAGER_ABI,
        functionName: "getPowerUpConfig",
        args: [BigInt(powerUpId)],
      });

      const resultArray = result as [bigint, bigint];
      return {
        cost: Number(resultArray[0]), // Cost is now directly in RICE
        maxLevel: Number(resultArray[1]),
      };
    } catch (error) {
      console.error(
        `❌ Error getting power-up config for ID ${powerUpId}:`,
        error
      );

      // Log the actual error for debugging
      console.error(
        `❌ Error getting power-up config for ID ${powerUpId}:`,
        error
      );

      // Don't return default values, let the error propagate
      throw error;
    }
  }

  /**
   * Gets the cost to upgrade a power-up for a specific player
   */
  async getPowerUpUpgradeCost(
    playerAddress: Address,
    powerUpId: number
  ): Promise<number> {
    try {
      const cost = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
        abi: POWERUPMANAGER_ABI,
        functionName: "getPowerUpUpgradeCost",
        args: [playerAddress, BigInt(powerUpId)],
      });

      // Cost is now directly in RICE (no conversion needed)
      return Number(cost);
    } catch (error) {
      console.error(
        `❌ Error getting power-up upgrade cost for powerUpId ${powerUpId}:`,
        error
      );

      // If the function returns empty data or 0, it means the power-up is not initialized
      if (
        error instanceof Error &&
        error.message.includes("could not decode result data")
      ) {
        console.error(
          `❌ Power-up ${powerUpId} is not initialized on blockchain`
        );
        throw new Error(
          `Power-up ${powerUpId} is not initialized on blockchain`
        );
      }

      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      // Don't return default costs - let the error propagate
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
