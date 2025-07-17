import { useState, useCallback, useEffect, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  blockchainService,
  SCOREBOARD_ABI,
  SCOREBOARD_CONTRACT_ADDRESS,
  LeaderboardEntry,
} from "@/services/blockchainService";
import { useToastStore } from "@/store/toastStore";
import { useTranslations } from "./useTranslations";

export interface UseBlockchainScoreReturn {
  recordScore: (score: number, playerName: string) => Promise<void>;
  getLeaderboard: (
    offset: number,
    limit: number
  ) => Promise<LeaderboardEntry[]>;
  getTotalScores: () => Promise<bigint>;
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
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
    null
  );
  const { t } = useTranslations();
  const { showSuccess, showError, showPending } = useToastStore();

  // Refs to track if toasts have been shown to prevent infinite loops
  const pendingToastShown = useRef<Set<string>>(new Set());
  const successToastShown = useRef<Set<string>>(new Set());
  const errorToastShown = useRef<Set<string>>(new Set());

  // Hook for writing to the blockchain
  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
    reset,
    data: hash,
  } = useWriteContract();

  // Hook for waiting for transaction receipt
  const { isSuccess: isConfirmed, isError: isFailed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

  // Handle transaction status changes and show toasts
  useEffect(() => {
    if (hash && hash !== transactionHash) {
      setTransactionHash(hash);
      if (!pendingToastShown.current.has(hash)) {
        pendingToastShown.current.add(hash);
        showPending(
          t("blockchain.transactionPending"),
          t("blockchain.transactionPendingMessage"),
          hash,
          t("blockchain.viewTransaction")
        );
      }
    }
  }, [hash, showPending, t, transactionHash]);

  useEffect(() => {
    if (isConfirmed && transactionHash) {
      if (!successToastShown.current.has(transactionHash)) {
        successToastShown.current.add(transactionHash);
        showSuccess(
          t("blockchain.transactionSuccess"),
          t("blockchain.transactionSuccessMessage"),
          transactionHash,
          t("blockchain.viewTransaction")
        );
      }
    }
  }, [isConfirmed, transactionHash, showSuccess, t]);

  useEffect(() => {
    if (isFailed && transactionHash) {
      if (!errorToastShown.current.has(transactionHash)) {
        errorToastShown.current.add(transactionHash);
        showError(
          t("blockchain.transactionFailed"),
          t("blockchain.transactionFailedMessage")
        );
      }
    }
  }, [isFailed, transactionHash, showError, t]);

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

  const getLeaderboard = useCallback(
    async (offset: number, limit: number): Promise<LeaderboardEntry[]> => {
      return await blockchainService.getLeaderboard(offset, limit);
    },
    []
  );

  const getTotalScores = useCallback(async (): Promise<bigint> => {
    return await blockchainService.getTotalScores();
  }, []);

  // Enhanced reset function that cleans up toast tracking
  const resetWithCleanup = useCallback(() => {
    pendingToastShown.current.clear();
    successToastShown.current.clear();
    errorToastShown.current.clear();
    reset();
  }, [reset]);

  return {
    recordScore,
    getLeaderboard,
    getTotalScores,
    isLoading,
    isSuccess,
    isError,
    error,
    playerBestScore: playerBestScore || null,
    isNewPersonalBest,
    reset: resetWithCleanup,
    isGameOwnerConfigured: blockchainService.isGameOwnerConfigured(),
  };
}
