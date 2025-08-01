import { useState, useCallback, useEffect, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { SCOREBOARD_ABI } from "@/infrastructure/blockchain/abis";
import { CONTRACT_ADDRESSES_CURRENT } from "@/infrastructure/config";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";

export const useBlockchainScore = () => {
  const { address } = useAccount();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingWithRICE, setIsSavingWithRICE] = useState(false);
  const [bestScore, setBestScore] = useState<bigint>(BigInt(0));
  const { showError, showSuccess, showPending, clearToasts } = useToastStore();
  const { t } = useTranslations();
  const loadBestScoreRef = useRef<(() => Promise<bigint | undefined>) | null>(
    null
  );

  // Use refs to avoid dependency issues
  const showSuccessRef = useRef(showSuccess);
  const tRef = useRef(t);
  const hasShownSuccessRef = useRef(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const saveScore = useCallback(
    async (score: number, playerName: string) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      clearToasts();
      setIsSaving(true);

      try {
        // Check if the contract is properly configured
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getContractInfo()
        );

        if (contractInfo.paused) {
          showError(t("common.error"), t("features.blockchain.contractPaused"));
          return false;
        }

        if (!contractInfo.securityKeySet) {
          showError(
            t("common.error"),
            t("features.blockchain.securityKeyNotConfigured")
          );
          return false;
        }

        // Generate game hash and signature
        const { gameHash, signature } = await retryWithBackoff(() =>
          blockchainService.recordScore(score, playerName, address)
        );

        showPending(
          t("features.blockchain.transactionPending"),
          t("features.blockchain.transactionPendingMessage")
        );

        // Execute the transaction
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.SCORE_BOARD,
          abi: SCOREBOARD_ABI,
          functionName: "recordScore",
          args: [BigInt(score), playerName, gameHash, signature],
        });

        return true;
      } catch (error) {
        console.error("❌ Error saving score:", error);
        showError(t("common.error"), t("features.blockchain.errorSaving"));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const saveScoreWithRICE = useCallback(
    async (score: number, playerName: string, riceReward: number) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      clearToasts();
      setIsSavingWithRICE(true);

      try {
        // Check if the contract is properly configured
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getContractInfo()
        );

        if (contractInfo.paused) {
          showError(t("common.error"), t("features.blockchain.contractPaused"));
          return false;
        }

        if (!contractInfo.securityKeySet) {
          showError(
            t("common.error"),
            t("features.blockchain.securityKeyNotConfigured")
          );
          return false;
        }

        // Generate game hash and signature with RICE reward
        const { gameHash, signature } = await retryWithBackoff(() =>
          blockchainService.recordScoreWithRICE(
            score,
            playerName,
            riceReward,
            address
          )
        );

        showPending(
          t("features.blockchain.transactionPending"),
          t("features.blockchain.transactionPendingMessage")
        );

        // Execute the transaction with RICE reward
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.SCORE_BOARD,
          abi: SCOREBOARD_ABI,
          functionName: "recordScoreWithRICE",
          args: [
            BigInt(score),
            playerName,
            BigInt(riceReward),
            gameHash,
            signature,
          ],
        });

        return true;
      } catch (error) {
        console.error("Error saving score with RICE:", error);
        showError(t("common.error"), t("features.blockchain.errorSaving"));
        return false;
      } finally {
        setIsSavingWithRICE(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const loadBestScore = useCallback(async () => {
    if (!address) return;

    try {
      const score = await retryWithBackoff(() =>
        blockchainService.getPlayerBestScore(address)
      );
      setBestScore(score);
      return score;
    } catch (error) {
      console.error("Error loading best score:", error);
      return BigInt(0);
    }
  }, [address]);

  // Store the function in ref to avoid dependency issues
  loadBestScoreRef.current = loadBestScore;

  // Update refs directly to avoid useEffect dependency issues
  showSuccessRef.current = showSuccess;
  tRef.current = t;

  // Reset success flag when transaction state changes
  if (!isSuccess) {
    hasShownSuccessRef.current = false;
  }

  const isNewPersonalBest = useCallback(
    async (score: number): Promise<boolean> => {
      if (!address) return false;

      try {
        return await retryWithBackoff(() =>
          blockchainService.isNewPersonalBest(address, score)
        );
      } catch (error) {
        console.error("Error checking if new personal best:", error);
        return true; // In case of error, assume it's a new record
      }
    },
    [address]
  );

  // Auto-trigger success toast when transaction is confirmed
  useEffect(() => {
    if (
      isSuccess &&
      hash &&
      !isConfirming &&
      !error &&
      !hasShownSuccessRef.current
    ) {
      hasShownSuccessRef.current = true;
      showSuccessRef.current(
        tRef.current("features.blockchain.transactionSuccess"),
        tRef.current("features.blockchain.scoreSavedSuccessfully"),
        hash,
        tRef.current("features.blockchain.viewTransaction")
      );
      // Reload best score after successful save
      if (loadBestScoreRef.current) {
        loadBestScoreRef.current();
      }
    }
  }, [isSuccess, hash, isConfirming, error]);

  // Handle transaction error
  const handleTransactionError = useCallback(() => {
    if (error) {
      let shortMessage = error.message;

      if (error.message.includes("User rejected")) {
        shortMessage = t("features.blockchain.userRejected");
      } else if (error.message.includes("insufficient funds")) {
        shortMessage = t("features.blockchain.insufficientFunds");
      } else if (error.message.includes("network")) {
        shortMessage = t("features.blockchain.networkError");
      } else {
        shortMessage = error.message.split(".")[0] || error.message;
        if (shortMessage.length > 100) {
          shortMessage = shortMessage.substring(0, 100) + "...";
        }
      }

      showError(
        t("common.error"),
        `${t("features.blockchain.scoreSaveError")}. ${shortMessage}`
      );
    }
  }, [error, showError, t]);

  // Auto-trigger error toast when transaction fails
  useEffect(() => {
    if (error) {
      handleTransactionError();
    }
  }, [error, handleTransactionError]);

  const getLeaderboard = useCallback(async (offset: number, limit: number) => {
    try {
      return await retryWithBackoff(() =>
        blockchainService.getLeaderboard(offset, limit)
      );
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      throw error;
    }
  }, []);

  const getTotalScores = useCallback(async () => {
    try {
      return await retryWithBackoff(() => blockchainService.getTotalScores());
    } catch (error) {
      console.error("Error getting total scores:", error);
      throw error;
    }
  }, []);

  const checkContractConfig = useCallback(async () => {
    try {
      return await retryWithBackoff(() =>
        blockchainService.checkContractConfig()
      );
    } catch (error) {
      console.error("Error checking contract config:", error);
      throw error;
    }
  }, []);

  return {
    saveScore,
    saveScoreWithRICE,
    loadBestScore,
    isNewPersonalBest,
    getLeaderboard,
    getTotalScores,
    checkContractConfig,
    bestScore,
    isSaving: isSaving || isPending || isConfirming,
    isSavingWithRICE: isSavingWithRICE || isPending || isConfirming,
    isSuccess,
    error,
    hash,
    handleTransactionError,
  };
};
