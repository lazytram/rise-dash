import {
  Address,
  encodeFunctionData,
  createPublicClient,
  http,
  hashMessage,
} from "viem";
import { riseTestnet } from "wagmi/chains";

// ScoreBoard contract ABI
export const SCOREBOARD_ABI = [
  {
    inputs: [
      { name: "_score", type: "uint256" },
      { name: "_playerName", type: "string" },
      { name: "_playerAddress", type: "address" },
      { name: "_gameHash", type: "bytes32" },
    ],
    name: "recordScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_player", type: "address" }],
    name: "getPlayerBestScore",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_player", type: "address" }],
    name: "getPlayerScores",
    outputs: [
      {
        components: [
          { name: "score", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "playerName", type: "string" },
          { name: "gameHash", type: "bytes32" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractInfo",
    outputs: [
      { name: "_gameOwner", type: "address" },
      { name: "_paused", type: "bool" },
      { name: "_minTimeBetweenScores", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const SCOREBOARD_CONTRACT_ADDRESS =
  "0x9f119696a4Fc5aCfE5864201ef53E81Caab23ee4" as Address;

// Game Owner Private Key (replace with your private key)
const GAME_OWNER_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_GAME_OWNER_PRIVATE_KEY || "";

export interface Score {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

export interface ContractInfo {
  gameOwner: Address;
  paused: boolean;
  minTimeBetweenScores: bigint;
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
   * Records a score on the blockchain - ONLY GAME OWNER CAN CALL
   */
  async recordScore(
    score: number,
    playerName: string,
    playerAddress: Address
  ): Promise<`0x${string}`> {
    if (!GAME_OWNER_PRIVATE_KEY) {
      throw new Error("Game owner private key not configured");
    }

    // Generate a unique hash for this game
    const gameHash = this.generateGameHash(
      score,
      playerName,
      playerAddress
    ) as `0x${string}`;

    const data = encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score), playerName, playerAddress, gameHash],
    });

    return data;
  }

  /**
   * Gets the best score of a player
   */
  async getPlayerBestScore(playerAddress: Address): Promise<bigint> {
    const result = await this.publicClient.readContract({
      address: SCOREBOARD_CONTRACT_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "getPlayerBestScore",
      args: [playerAddress],
    });

    return result;
  }

  /**
   * Gets all scores of a player
   */
  async getPlayerScores(playerAddress: Address): Promise<Score[]> {
    const result = await this.publicClient.readContract({
      address: SCOREBOARD_CONTRACT_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "getPlayerScores",
      args: [playerAddress],
    });

    return result as Score[];
  }

  /**
   * Gets contract information
   */
  async getContractInfo(): Promise<ContractInfo> {
    const result = await this.publicClient.readContract({
      address: SCOREBOARD_CONTRACT_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "getContractInfo",
    });

    return {
      gameOwner: result[0],
      paused: result[1],
      minTimeBetweenScores: result[2],
    };
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
      return true; // In case of error, we consider it's a new record
    }
  }

  /**
   * Checks if the game owner private key is configured
   */
  isGameOwnerConfigured(): boolean {
    return !!GAME_OWNER_PRIVATE_KEY;
  }
}

export const blockchainService = new BlockchainService();
