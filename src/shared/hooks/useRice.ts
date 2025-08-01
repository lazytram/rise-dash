import { useState, useEffect, useCallback, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { RICEMANAGER_ABI } from "@/infrastructure/blockchain/abis";
import { CONTRACT_ADDRESSES_CURRENT } from "@/infrastructure/config";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";
import {
  ApiErrorResponse,
  isDailyRevealCooldownError,
} from "@/shared/types/api";

export const useRice = () => {
  const { address } = useAccount();
  const [isAdding, setIsAdding] = useState(false);
  const [isSpending, setIsSpending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { showError, showSuccess, showPending, clearToasts } = useToastStore();
  const { t } = useTranslations();

  // Use refs to avoid dependency issues
  const showSuccessRef = useRef(showSuccess);
  const showErrorRef = useRef(showError);
  const tRef = useRef(t);

  // Throttling for blockchain calls
  const lastCallTimeRef = useRef(0);
  const THROTTLE_DELAY = 500; // 500ms between calls

  // Cache for RICE balance to avoid unnecessary calls
  const balanceCacheRef = useRef<{ balance: number; timestamp: number } | null>(
    null
  );
  const CACHE_DURATION = 30000; // 30 seconds cache

  // Update refs when values change
  useEffect(() => {
    showSuccessRef.current = showSuccess;
    showErrorRef.current = showError;
    tRef.current = t;
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Throttle function to prevent too frequent blockchain calls
  const throttleCall = useCallback(() => {
    const now = Date.now();
    if (now - lastCallTimeRef.current < THROTTLE_DELAY) {
      return false;
    }
    lastCallTimeRef.current = now;
    return true;
  }, []);

  // Check if cached balance is still valid
  const isCacheValid = useCallback(() => {
    if (!balanceCacheRef.current) return false;
    return Date.now() - balanceCacheRef.current.timestamp < CACHE_DURATION;
  }, []);

  // Clear cache when address changes
  useEffect(() => {
    balanceCacheRef.current = null;
  }, [address]);

  const addRICE = useCallback(
    async (amount: number) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      // Clear any existing toasts before starting
      clearToasts();
      setIsAdding(true);

      try {
        // Check if the contract is properly configured
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getRICEManagerInfo()
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

        // Generate operation hash
        const operationHash = blockchainService.generateOperationHash(
          "ADD_RICE",
          address,
          amount
        ) as `0x${string}`;

        // Call API to get signature
        let signature: `0x${string}` | undefined = undefined;
        try {
          showPending(
            t("features.blockchain.transactionPending"),
            t("features.blockchain.transactionPendingMessage")
          );
          const response = await fetch("/api/sign-rice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operation: "ADD_RICE",
              playerAddress: address,
              amount,
              operationHash,
            }),
          });
          if (!response.ok) {
            throw new Error("API signature error");
          }
          const data = await response.json();
          signature = data.signature;
          if (!signature) throw new Error("No signature returned");
        } catch {
          showError(
            t("common.error"),
            t("features.blockchain.errorAddingRICE") + ` (signature)`
          );
          return false;
        }

        // Execute the transaction
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER,
          abi: RICEMANAGER_ABI,
          functionName: "addRICE",
          args: [address, BigInt(amount), operationHash, signature],
        });

        // Use setTimeout to avoid blocking
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Invalidate cache to force refresh on next check
        balanceCacheRef.current = null;

        return true;
      } catch (error) {
        console.error("❌ Error adding RICE:", error);
        showError(t("common.error"), t("features.blockchain.errorAddingRICE"));
        return false;
      } finally {
        setIsAdding(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const addDailyRevealRICE = useCallback(
    async (amount: number) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      // Clear any existing toasts before starting
      clearToasts();
      setIsAdding(true);

      try {
        // Check if the contract is properly configured
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getRICEManagerInfo()
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

        // Generate operation hash for daily reveal
        const operationHash = blockchainService.generateOperationHash(
          "DAILY_REVEAL_RICE",
          address,
          amount
        ) as `0x${string}`;

        // Call API to get signature for daily reveal
        let signature: `0x${string}` | undefined = undefined;
        try {
          showPending(
            t("features.blockchain.transactionPending"),
            t("features.blockchain.transactionPendingMessage")
          );
          const response = await fetch("/api/sign-daily-reveal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerAddress: address,
              amount,
              operationHash,
            }),
          });

          if (!response.ok) {
            const errorData = (await response.json()) as ApiErrorResponse;

            // Handle cooldown error specifically with type safety
            if (
              response.status === 429 &&
              isDailyRevealCooldownError(errorData)
            ) {
              showError(
                t("common.error"),
                `${t("features.blockchain.dailyRevealCooldown")}. ${t(
                  "features.blockchain.nextRevealIn",
                  { time: errorData.nextRevealIn }
                )}`
              );
              return false;
            }

            throw new Error("API signature error");
          }

          const data = await response.json();
          signature = data.signature;
          if (!signature) throw new Error("No signature returned");
        } catch {
          showError(
            t("common.error"),
            t("features.blockchain.errorAddingRICE") + ` (signature)`
          );
          return false;
        }

        // Execute the transaction using addDailyRevealRICE function
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER,
          abi: RICEMANAGER_ABI,
          functionName: "addDailyRevealRICE",
          args: [address, BigInt(amount), operationHash, signature],
        });

        // Use setTimeout to avoid blocking
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Invalidate cache to force refresh on next check
        balanceCacheRef.current = null;

        return true;
      } catch (error) {
        console.error("❌ Error adding daily reveal RICE:", error);
        showError(t("common.error"), t("features.blockchain.errorAddingRICE"));
        return false;
      } finally {
        setIsAdding(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const spendRICE = useCallback(
    async (amount: number) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      // Clear any existing toasts before starting
      clearToasts();
      setIsSpending(true);

      try {
        // Check if the contract is properly configured
        const contractInfo = await retryWithBackoff(() =>
          blockchainService.getRICEManagerInfo()
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

        // Check if player has enough RICE
        const balance = await retryWithBackoff(() =>
          blockchainService.getRICEBalance(address)
        );

        if (balance < amount) {
          showError(
            t("common.error"),
            t("features.blockchain.insufficientRICE")
          );
          return false;
        }

        // Generate operation hash
        const operationHash = blockchainService.generateOperationHash(
          "SPEND_RICE",
          address,
          amount
        ) as `0x${string}`;

        // Call API to get signature
        let signature: `0x${string}` | undefined = undefined;
        try {
          showPending(
            t("features.blockchain.transactionPending"),
            t("features.blockchain.transactionPendingMessage")
          );
          const response = await fetch("/api/sign-rice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operation: "SPEND_RICE",
              playerAddress: address,
              amount,
              operationHash,
            }),
          });
          if (!response.ok) {
            throw new Error("API signature error");
          }
          const data = await response.json();
          signature = data.signature;
          if (!signature) throw new Error("No signature returned");
        } catch {
          showError(
            t("common.error"),
            t("features.blockchain.errorSpendingRICE") + ` (signature)`
          );
          return false;
        }

        // Call smart contract with signature
        try {
          writeContract({
            address: CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER,
            abi: RICEMANAGER_ABI,
            functionName: "spendRICE",
            args: [address, BigInt(amount), operationHash, signature],
          });
        } catch (writeError) {
          console.error("❌ writeContract error:", writeError);
          showError(
            t("common.error"),
            t("features.blockchain.errorSpendingRICE")
          );
          return false;
        }

        return true;
      } catch (error) {
        console.error("❌ Error spending RICE:", error);
        showError(
          t("common.error"),
          t("features.blockchain.errorSpendingRICE")
        );
        return false;
      } finally {
        setIsSpending(false);
      }
    },
    [address, showError, showPending, clearToasts, t, writeContract]
  );

  const checkRICEBalance = useCallback(async (): Promise<number> => {
    if (!address) {
      throw new Error("No wallet address");
    }

    // Check cache first
    if (isCacheValid()) {
      return balanceCacheRef.current!.balance;
    }

    // Throttle blockchain calls
    if (!throttleCall()) {
      if (balanceCacheRef.current) {
        return balanceCacheRef.current.balance;
      }
      // Return 0 instead of throwing error when throttled and no cache
      return 0;
    }

    setIsChecking(true);
    try {
      const balance = await retryWithBackoff(() =>
        blockchainService.getRICEBalance(address)
      );

      // Cache the result
      balanceCacheRef.current = {
        balance,
        timestamp: Date.now(),
      };

      return balance;
    } catch (error) {
      console.error("Error checking RICE balance:", error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, [address, throttleCall, isCacheValid]);

  // Handle transaction status with useEffect to avoid infinite loops
  useEffect(() => {
    if (isSuccess && hash) {
      showSuccessRef.current(
        tRef.current("features.blockchain.transactionSuccess"),
        tRef.current("features.blockchain.riceOperationSuccess"),
        hash,
        "View Transaction"
      );
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error && error.message) {
      // Extract a shorter, more readable error message
      let shortMessage = error.message;

      // If it's a user rejection, show a friendly message
      if (error.message.includes("User rejected")) {
        shortMessage = tRef.current("features.blockchain.userRejected");
      } else if (error.message.includes("insufficient funds")) {
        shortMessage = tRef.current("features.blockchain.insufficientFunds");
      } else if (error.message.includes("network")) {
        shortMessage = tRef.current("features.blockchain.networkError");
      } else {
        // Take only the first part of the error message
        shortMessage = error.message.split(".")[0] || error.message;
        if (shortMessage.length > 100) {
          shortMessage = shortMessage.substring(0, 100) + "...";
        }
      }

      showErrorRef.current(
        tRef.current("common.error"),
        `${tRef.current(
          "features.blockchain.riceOperationError"
        )}. ${shortMessage}`
      );
    }
  }, [error]);

  // Function to invalidate cache and force refresh
  const invalidateBalanceCache = useCallback(() => {
    balanceCacheRef.current = null;
  }, []);

  // Listen for balance refresh events (e.g., after power-up upgrades)
  useEffect(() => {
    const handleBalanceRefresh = () => {
      invalidateBalanceCache();
    };

    window.addEventListener("rice-balance-refresh", handleBalanceRefresh);

    return () => {
      window.removeEventListener("rice-balance-refresh", handleBalanceRefresh);
    };
  }, [invalidateBalanceCache]);

  return {
    addRICE,
    addDailyRevealRICE,
    spendRICE,
    checkRICEBalance,
    invalidateBalanceCache,
    isAdding: isAdding || isPending || isConfirming,
    isSpending: isSpending || isPending || isConfirming,
    isChecking,
    isSuccess,
    error,
    hash,
  };
};
