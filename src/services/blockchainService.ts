import {
  Address,
  encodeFunctionData,
  createPublicClient,
  http,
  hashMessage,
  toHex,
} from "viem";
import { riseTestnet } from "wagmi/chains";

// ScoreBoard contract ABI
export const SCOREBOARD_ABI = [
  {
    inputs: [
      { name: "_score", type: "uint256" },
      { name: "_playerName", type: "string" },
      { name: "_gameHash", type: "bytes32" },
      { name: "_signature", type: "bytes" },
    ],
    name: "recordScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_score", type: "uint256" },
      { name: "_playerName", type: "string" },
      { name: "_playerAddress", type: "address" },
      { name: "_gameHash", type: "bytes32" },
    ],
    name: "recordScoreEmergency",
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
      { name: "_securityKeySet", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_offset", type: "uint256" },
      { name: "_limit", type: "uint256" },
    ],
    name: "getLeaderboard",
    outputs: [
      {
        components: [
          { name: "score", type: "uint256" },
          { name: "playerName", type: "string" },
          { name: "playerAddress", type: "address" },
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
    name: "getTotalScores",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_securityKey", type: "bytes32" }],
    name: "setSecurityKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const SCOREBOARD_CONTRACT_ADDRESS =
  "0xaf483B1DcE4FEfcDd929D0dc17bbfe5B34e5Bd0a" as Address;

// Game Owner Private Key (replace with your private key)
const GAME_AUTH_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_GAME_OWNER_PRIVATE_KEY || "";

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
   * Creates a signature for a score using the security key
   */
  async createScoreSignature(
    score: number,
    playerName: string,
    playerAddress: Address,
    gameHash: string
  ): Promise<`0x${string}`> {
    if (!GAME_AUTH_PRIVATE_KEY) {
      throw new Error("Game owner private key not configured");
    }

    // Create the message hash that will be signed
    const messageHash = hashMessage(
      `${score}-${playerName}-${playerAddress}-${gameHash}`
    );

    // For now, we'll use a simple approach - in production, this should be done server-side
    // The signature should be created by the server using the game owner's private key
    // This is a placeholder implementation
    const signature = `0x${messageHash.slice(2)}` as `0x${string}`;

    return signature;
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
   * Gets the global leaderboard
   */
  async getLeaderboard(
    offset: number,
    limit: number
  ): Promise<LeaderboardEntry[]> {
    const result = await this.publicClient.readContract({
      address: SCOREBOARD_CONTRACT_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "getLeaderboard",
      args: [BigInt(offset), BigInt(limit)],
    });

    return result as LeaderboardEntry[];
  }

  /**
   * Gets the total number of scores in the leaderboard
   */
  async getTotalScores(): Promise<bigint> {
    const result = await this.publicClient.readContract({
      address: SCOREBOARD_CONTRACT_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "getTotalScores",
    });

    return result;
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
      securityKeySet: result[3],
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
    return !!GAME_AUTH_PRIVATE_KEY;
  }

  /**
   * Checks if the security key is configured
   */
  isSecurityKeyConfigured(): boolean {
    return !!SECURITY_KEY;
  }
}

export const blockchainService = new BlockchainService();
