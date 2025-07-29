import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { createPublicClient, http } from "viem";
import { riseTestnet } from "@/infrastructure/config/riseTestnet";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { SCOREBOARD_ABI } from "@/infrastructure/blockchain/abis";
import { getScoreBoardAddress } from "@/infrastructure/config";
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
          address: getScoreBoardAddress(),
          abi: SCOREBOARD_ABI,
          functionName: "recordScore",
          args: [BigInt(score), playerName, gameHash, signature],
        });

        return true;
      } catch (error) {
        console.error("❌ Error saving score:", error);
        showError(t("common.error"), t("features.blockchain.errorSavingScore"));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const saveScoreWithRICE = useCallback(
    async (score: number, playerName: string, riceReward: number) => {
      console.log("🔍 saveScoreWithRICE called with:", {
        score,
        playerName,
        riceReward,
        address,
      });

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

        console.log("🔍 About to call writeContract with:", {
          address: getScoreBoardAddress(),
          functionName: "recordScoreWithRICE",
          args: [
            BigInt(score),
            playerName,
            BigInt(riceReward),
            gameHash,
            signature,
          ],
        });

        console.log("🔍 Current address:", address);
        console.log("🔍 Contract address:", getScoreBoardAddress());

        // Execute the transaction with RICE reward
        const result = writeContract({
          address: getScoreBoardAddress(),
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

        console.log("🔍 writeContract result:", result);
        console.log("🔍 writeContract called successfully");
        console.log(
          "🔍 Current states - isPending:",
          isPending,
          "error:",
          error,
          "hash:",
          hash
        );

        return true;
      } catch (error) {
        console.error("❌ Error saving score with RICE:", error);
        showError(
          t("common.error"),
          t("features.blockchain.errorSavingScoreWithRICE")
        );
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
      console.error("❌ Error loading best score:", error);
      return BigInt(0);
    }
  }, [address]);

  const isNewPersonalBest = useCallback(
    async (score: number): Promise<boolean> => {
      if (!address) return false;

      try {
        return await retryWithBackoff(() =>
          blockchainService.isNewPersonalBest(address, score)
        );
      } catch (error) {
        console.error("❌ Error checking if new personal best:", error);
        return true; // In case of error, assume it's a new record
      }
    },
    [address]
  );

  // Handle transaction success
  const handleTransactionSuccess = useCallback(() => {
    if (isSuccess && hash) {
      showSuccess(
        t("features.blockchain.transactionSuccess"),
        t("features.blockchain.scoreSavedSuccess"),
        hash,
        "View Transaction"
      );
      // Reload best score after successful save
      loadBestScore();
    }
  }, [isSuccess, hash, showSuccess, t, loadBestScore]);

  // Handle transaction error
  const handleTransactionError = useCallback(() => {
    if (error) {
      console.log("🔍 Transaction error detected:", error);
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

  // Debug: Monitor transaction states
  useEffect(() => {
    console.log("🔍 Transaction state changed:", {
      isPending,
      isConfirming,
      isSuccess,
      error,
      hash,
    });

    // If transaction failed (not pending, not confirming, not success, no error)
    if (!isPending && !isConfirming && !isSuccess && !error && hash) {
      console.log("🔍 Transaction seems to have failed silently. Hash:", hash);

      // Try to get transaction details via RPC
      console.log("🔍 Checking transaction details via RPC...");

      // Use the public client to get transaction details
      const publicClient = createPublicClient({
        chain: riseTestnet,
        transport: http(),
      });

      publicClient
        .getTransactionReceipt({ hash: hash as `0x${string}` })
        .then((receipt) => {
          console.log("🔍 Transaction receipt:", receipt);

          if (receipt.status === "success") {
            console.log("✅ Transaction succeeded!");
          } else {
            console.log("❌ Transaction failed!");
            console.log("🔍 Gas used:", receipt.cumulativeGasUsed.toString());
            console.log("🔍 Logs:", receipt.logs);

            // Try to get the revert reason
            publicClient
              .getTransaction({ hash: hash as `0x${string}` })
              .then((tx) => {
                console.log("🔍 Transaction details:", tx);
              })
              .catch((err) => {
                console.log("🔍 Could not get transaction details:", err);
              });
          }
        })
        .catch((err) => {
          console.log("🔍 Could not get transaction receipt:", err);
        });
    }
  }, [isPending, isConfirming, isSuccess, error, hash]);

  const getLeaderboard = useCallback(async (offset: number, limit: number) => {
    try {
      return await retryWithBackoff(() =>
        blockchainService.getLeaderboard(offset, limit)
      );
    } catch (error) {
      console.error("❌ Error loading leaderboard:", error);
      throw error;
    }
  }, []);

  const getTotalScores = useCallback(async () => {
    try {
      return await retryWithBackoff(() => blockchainService.getTotalScores());
    } catch (error) {
      console.error("❌ Error getting total scores:", error);
      throw error;
    }
  }, []);

  const checkContractConfig = useCallback(async () => {
    try {
      return await retryWithBackoff(() =>
        blockchainService.checkContractConfig()
      );
    } catch (error) {
      console.error("❌ Error checking contract config:", error);
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
    handleTransactionSuccess,
    handleTransactionError,
  };
};
