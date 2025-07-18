import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  blockchainService,
  SCOREBOARD_CONTRACT_ADDRESS,
  SCOREBOARD_ABI,
} from "../services/blockchainService";
import { useToastStore } from "../store/toastStore";
import { useTranslations } from "./useTranslations";

// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes("429")) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${
            maxRetries + 1
          })`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // For other errors, don't retry
        throw lastError;
      }
    }
  }

  throw lastError!;
};

export const useBlockchainScore = () => {
  const { address } = useAccount();
  const [isRecording, setIsRecording] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { showError, showSuccess, showPending, clearToasts } = useToastStore();
  const { t } = useTranslations();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Debug logs for transaction status
  useEffect(() => {
    console.log("🔍 Transaction status:", {
      hash,
      isPending,
      isConfirming,
      isSuccess,
      error: error?.message,
    });
  }, [hash, isPending, isConfirming, isSuccess, error]);

  const recordScore = useCallback(
    async (score: number, playerName: string) => {
      console.log("🚀 Starting recordScore with:", {
        score,
        playerName,
        address,
      });

      if (!address) {
        console.log("❌ No address found");
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      // Clear any existing toasts before starting
      clearToasts();
      setIsRecording(true);
      console.log("📝 Setting isRecording to true");

      try {
        // Check if the contract is properly configured
        console.log("🔍 Checking contract info...");
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getContractInfo()
        );
        console.log("📊 Contract info:", contractInfo);

        if (contractInfo.paused) {
          console.log("⏸️ Contract is paused");
          showError(t("common.error"), t("features.blockchain.contractPaused"));
          return false;
        }

        if (!contractInfo.securityKeySet) {
          console.log("🔑 Security key not set");
          showError(
            t("common.error"),
            t("features.blockchain.securityKeyNotConfigured")
          );
          return false;
        }

        // Générer le gameHash
        const gameHash = blockchainService.generateGameHash(
          score,
          playerName,
          address
        ) as `0x${string}`;
        console.log("🔑 Generated gameHash:", gameHash);

        // Appeler l'API pour obtenir la signature
        let signature: `0x${string}` | undefined = undefined;
        try {
          showPending(
            t("features.blockchain.transactionPending"),
            t("features.blockchain.transactionPendingMessage")
          );
          const response = await fetch("/api/sign-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score,
              playerName,
              playerAddress: address,
              gameHash,
            }),
          });
          if (!response.ok) {
            throw new Error("API signature error");
          }
          const data = await response.json();
          signature = data.signature;
          if (!signature) throw new Error("No signature returned");
          console.log("✍️ Received signature:", signature);
        } catch {
          showError(
            t("common.error"),
            t("features.blockchain.errorSaving") + ` (signature)`
          );
          return false;
        }

        // Appeler le smart contract avec la signature
        try {
          writeContract({
            address: SCOREBOARD_CONTRACT_ADDRESS,
            abi: SCOREBOARD_ABI,
            functionName: "recordScore",
            args: [BigInt(score), playerName, gameHash, signature],
          });
          console.log("📤 writeContract called successfully");
        } catch (writeError) {
          console.error("❌ writeContract error:", writeError);
          showError(t("common.error"), t("features.blockchain.errorSaving"));
          return false;
        }

        return true;
      } catch (error) {
        console.error("❌ Error recording score:", error);
        showError(t("common.error"), t("features.blockchain.errorSaving"));
        return false;
      } finally {
        console.log("🏁 Setting isRecording to false");
        setIsRecording(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const checkNewPersonalBest = useCallback(
    async (score: number): Promise<boolean> => {
      if (!address) {
        return false;
      }

      setIsChecking(true);

      try {
        const isNewBest = await retryWithBackoff(() =>
          blockchainService.isNewPersonalBest(address, score)
        );
        return isNewBest;
      } catch (error) {
        console.error("Error checking personal best:", error);
        return false;
      } finally {
        setIsChecking(false);
      }
    },
    [address]
  );

  // Handle transaction status with useEffect to avoid infinite loops
  useEffect(() => {
    if (isSuccess && hash) {
      console.log(
        "🎉 Transaction successful, showing success toast with hash:",
        hash
      );
      showSuccess(
        "Transaction Successful",
        "Your score has been successfully saved!",
        hash,
        "View Transaction"
      );
    }
  }, [isSuccess, hash, showSuccess]);

  useEffect(() => {
    if (error && error.message) {
      console.log("❌ Transaction failed, showing error toast:", error.message);
      showError(
        "Error",
        `Failed to save your score. Please try again.: ${error.message}`
      );
    }
  }, [error, showError]);

  const getLeaderboard = useCallback(async (offset: number, limit: number) => {
    return await retryWithBackoff(() =>
      blockchainService.getLeaderboard(offset, limit)
    );
  }, []);

  const getTotalScores = useCallback(async () => {
    return await retryWithBackoff(() => blockchainService.getTotalScores());
  }, []);

  return {
    recordScore,
    checkNewPersonalBest,
    getLeaderboard,
    getTotalScores,
    isRecording: isRecording || isPending || isConfirming,
    isChecking,
    isSuccess,
    error,
    hash,
  };
};
