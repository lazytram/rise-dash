import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";

export const useRiceBalance = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToastStore();
  const { t } = useTranslations();

  // Cache for balance to avoid unnecessary calls
  const balanceCacheRef = useRef<{ balance: number; timestamp: number } | null>(
    null
  );
  const CACHE_DURATION = 30000; // 30 seconds cache

  // Check if cached balance is still valid
  const isCacheValid = useCallback(() => {
    if (!balanceCacheRef.current) return false;
    return Date.now() - balanceCacheRef.current.timestamp < CACHE_DURATION;
  }, []);

  // Clear cache when address changes
  useEffect(() => {
    balanceCacheRef.current = null;
  }, [address]);

  const loadBalance = useCallback(async () => {
    if (!address) return;

    // Check cache first
    if (isCacheValid()) {
      setBalance(balanceCacheRef.current!.balance);
      return balanceCacheRef.current!.balance;
    }

    setIsLoading(true);
    try {
      const riceBalance = await retryWithBackoff(() =>
        blockchainService.getRICEBalance(address)
      );

      // Cache the result
      balanceCacheRef.current = {
        balance: riceBalance,
        timestamp: Date.now(),
      };

      setBalance(riceBalance);
      return riceBalance;
    } catch (error) {
      console.error("❌ Error loading RICE balance:", error);
      showError(
        t("common.error"),
        t("features.blockchain.errorLoadingBalance")
      );
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [address, isCacheValid, showError, t]);

  const refreshBalance = useCallback(async () => {
    // Clear cache to force refresh
    balanceCacheRef.current = null;
    return await loadBalance();
  }, [loadBalance]);

  // Auto-load balance when address changes
  useEffect(() => {
    if (address) {
      loadBalance();
    } else {
      setBalance(0);
    }
  }, [address, loadBalance]);

  return {
    balance,
    isLoading,
    loadBalance,
    refreshBalance,
  };
};
