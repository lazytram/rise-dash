import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import {
  blockchainService,
  SCOREBOARD_ABI,
  SCOREBOARD_CONTRACT_ADDRESS,
} from "@/services/blockchainService";

export interface UseBlockchainScoreReturn {
  recordScore: (score: number, playerName: string) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  playerBestScore: bigint | null;
  isNewPersonalBest: boolean;
  reset: () => void;
  isGameOwnerConfigured: boolean;
}

export function useBlockchainScore(): UseBlockchainScoreReturn {
  const { address } = useAccount();
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);

  // Hook for writing to the blockchain
  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
    reset,
  } = useWriteContract();

  // Hook for reading the player's best score
  const { data: playerBestScore } = useReadContract({
    address: SCOREBOARD_CONTRACT_ADDRESS,
    abi: SCOREBOARD_ABI,
    functionName: "getPlayerBestScore",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const recordScore = useCallback(
    async (score: number, playerName: string) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!blockchainService.isGameOwnerConfigured()) {
        throw new Error(
          "Game owner private key not configured. Only authorized users can save scores."
        );
      }

      try {
        // Check if it's a new personal record
        const isNewBest = await blockchainService.isNewPersonalBest(
          address,
          score
        );
        setIsNewPersonalBest(isNewBest);

        // Send the transaction (only game owner can call this)
        writeContract({
          address: SCOREBOARD_CONTRACT_ADDRESS,
          abi: SCOREBOARD_ABI,
          functionName: "recordScore",
          args: [
            BigInt(score),
            playerName,
            address,
            blockchainService.generateGameHash(
              score,
              playerName,
              address
            ) as `0x${string}`,
          ],
        });
      } catch (err) {
        console.error("Error recording score:", err);
        throw err;
      }
    },
    [address, writeContract]
  );

  return {
    recordScore,
    isLoading,
    isSuccess,
    isError,
    error,
    playerBestScore: playerBestScore || null,
    isNewPersonalBest,
    reset,
    isGameOwnerConfigured: blockchainService.isGameOwnerConfigured(),
  };
}
