import { useState, useEffect, useCallback, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { POWERUPMANAGER_ABI } from "@/infrastructure/blockchain/abis";
import { getPowerUpManagerAddress } from "@/infrastructure/config";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";

export interface PowerUpLevels {
  [powerUpId: number]: number;
}

export interface PowerUpConfig {
  cost: number;
  maxLevel: number;
}

export const usePowerUps = () => {
  const { address } = useAccount();
  const [upgradingPowerUps, setUpgradingPowerUps] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [powerUpLevels, setPowerUpLevels] = useState<PowerUpLevels>({});
  const [confirmedTransaction, setConfirmedTransaction] = useState<
    string | null
  >(null);
  const [powerUpConfigs, setPowerUpConfigs] = useState<{
    [powerUpId: number]: PowerUpConfig;
  }>({});
  const { showError, showSuccess, showPending, clearToasts } = useToastStore();
  const { t } = useTranslations();

  // Use refs to avoid dependency issues
  const showSuccessRef = useRef(showSuccess);
  const showErrorRef = useRef(showError);
  const tRef = useRef(t);

  // Cache for power-up data to avoid unnecessary calls
  const levelsCacheRef = useRef<{
    levels: PowerUpLevels;
    timestamp: number;
  } | null>(null);
  const configsCacheRef = useRef<{
    configs: { [powerUpId: number]: PowerUpConfig };
    timestamp: number;
  } | null>(null);
  const CACHE_DURATION = 0; // Disable cache for debugging

  // Update refs when values change
  useEffect(() => {
    showSuccessRef.current = showSuccess;
    showErrorRef.current = showError;
    tRef.current = t;
  });

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Clear cache when address changes
  useEffect(() => {
    levelsCacheRef.current = null;
    configsCacheRef.current = null;
  }, [address]);

  // Load power-up levels for the current player
  const loadPowerUpLevels = useCallback(async (): Promise<PowerUpLevels> => {
    if (!address) {
      throw new Error("No wallet address");
    }

    // Check cache first
    if (
      levelsCacheRef.current &&
      Date.now() - levelsCacheRef.current.timestamp < CACHE_DURATION
    ) {
      return levelsCacheRef.current.levels;
    }

    setIsLoading(true);
    try {
      const levels = await retryWithBackoff(() =>
        blockchainService.getPowerUpLevels(address)
      );

      const levelsMap: PowerUpLevels = {};
      levels.forEach((level, index) => {
        levelsMap[index] = level;
      });

      // Cache the result
      levelsCacheRef.current = {
        levels: levelsMap,
        timestamp: Date.now(),
      };

      setPowerUpLevels(levelsMap);
      return levelsMap;
    } catch (error) {
      console.error("Error loading power-up levels:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Load power-up configuration
  const loadPowerUpConfig = useCallback(
    async (powerUpId: number): Promise<PowerUpConfig> => {
      // Check cache first
      if (
        configsCacheRef.current &&
        Date.now() - configsCacheRef.current.timestamp < CACHE_DURATION
      ) {
        return (
          configsCacheRef.current.configs[powerUpId] || { cost: 0, maxLevel: 0 }
        );
      }

      try {
        console.log(`🔍 Loading power-up config for ID ${powerUpId}...`);
        const config = await retryWithBackoff(() =>
          blockchainService.getPowerUpConfig(powerUpId)
        );
        console.log(`✅ Power-up config loaded:`, config);

        // Update cache
        const currentConfigs = configsCacheRef.current?.configs || {};
        currentConfigs[powerUpId] = config;
        configsCacheRef.current = {
          configs: currentConfigs,
          timestamp: Date.now(),
        };

        setPowerUpConfigs((prev) => ({ ...prev, [powerUpId]: config }));
        return config;
      } catch (error) {
        console.error(
          `❌ Error loading power-up config for ID ${powerUpId}:`,
          error
        );
        throw error;
      }
    },
    []
  );

  // Get upgrade cost for a specific power-up
  const getUpgradeCost = useCallback(
    async (powerUpId: number): Promise<number> => {
      if (!address) {
        throw new Error("No wallet address");
      }

      try {
        const cost = await retryWithBackoff(() =>
          blockchainService.getPowerUpUpgradeCost(address, powerUpId)
        );
        return cost;
      } catch (error) {
        console.error("Error getting upgrade cost:", error);
        throw error;
      }
    },
    [address]
  );

  // Upgrade a power-up
  const upgradePowerUp = useCallback(
    async (powerUpId: number) => {
      if (!address) {
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("features.blockchain.connectWallet")
        );
        return false;
      }

      // Clear any existing toasts before starting
      clearToasts();
      setUpgradingPowerUps((prev) => new Set(prev).add(powerUpId));

      try {
        // Get current levels to check if upgrade is possible
        const currentLevels = await loadPowerUpLevels();
        const currentLevel = currentLevels[powerUpId] || 0;

        // Get power-up config to check max level
        const config = await loadPowerUpConfig(powerUpId);
        console.log(`✅ Power-up config loaded:`, config);

        // Check if power-up is initialized (maxLevel > 0)
        if (config.maxLevel === 0) {
          showError(t("common.error"), "Power-up not initialized on contract");
          return false;
        }

        if (currentLevel >= config.maxLevel) {
          showError(t("common.error"), t("features.powerUps.maxLevelReached"));
          return false;
        }

        // Get upgrade cost
        const cost = await getUpgradeCost(powerUpId);

        // Check if player has enough RICE
        const riceBalance = await retryWithBackoff(() =>
          blockchainService.getRICEBalance(address)
        );

        if (riceBalance < cost) {
          showErrorRef.current(
            tRef.current("common.error"),
            tRef.current("scenes.powerUps.insufficientRICE")
          );
          return false;
        }

        // Get signature from server (like SaveScore)
        console.log("🔍 Getting signature for power-up upgrade...");
        const response = await fetch("/api/sign-powerup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerAddress: address,
            powerUpId,
            cost,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get signature");
        }

        const { upgradeHash, signature } = await response.json();
        console.log("✅ Got signature:", { upgradeHash, signature });

        // Use the signed function (player will need to sign the transaction)
        console.log("🚀 Calling upgradePowerUp with:", {
          address,
          powerUpId,
          upgradeHash,
          signature,
        });
        writeContract({
          address: getPowerUpManagerAddress(),
          abi: POWERUPMANAGER_ABI,
          functionName: "upgradePowerUp",
          args: [address, BigInt(powerUpId), upgradeHash, signature],
        });

        return true;
      } catch (error) {
        console.error("❌ Error upgrading power-up:", error);
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("scenes.powerUps.errorUpgrading")
        );
        return false;
      } finally {
        setUpgradingPowerUps((prev) => {
          const newSet = new Set(prev);
          newSet.delete(powerUpId);
          return newSet;
        });
      }
    },
    [
      address,
      clearToasts,
      getUpgradeCost,
      loadPowerUpConfig,
      loadPowerUpLevels,
      showError,
      t,
      writeContract,
    ]
  );

  // Load power-up levels on mount
  useEffect(() => {
    if (address) {
      console.log("🔄 Loading power-up levels for address:", address);
      loadPowerUpLevels().catch(console.error);
    }
  }, [address]);

  // Handle transaction success (only when confirmed)
  useEffect(() => {
    if (
      isSuccess &&
      hash &&
      !isConfirming &&
      !isError &&
      confirmedTransaction !== hash
    ) {
      console.log("✅ Transaction confirmed successfully!");
      console.log("🔍 Transaction hash:", hash);
      setConfirmedTransaction(hash);
      showSuccessRef.current(
        tRef.current("scenes.powerUps.upgradeSuccess"),
        tRef.current("scenes.powerUps.upgradeSuccessMessage"),
        hash,
        "View Transaction"
      );

      // Refresh power-up levels after successful upgrade
      console.log("🔄 Refreshing power-up levels after upgrade...");
      loadPowerUpLevels().catch(console.error);
    }
  }, [isSuccess, hash, isConfirming, isError, confirmedTransaction]);

  // Handle transaction confirmation state
  useEffect(() => {
    if (isConfirming && hash) {
      showPending(
        tRef.current("scenes.powerUps.upgrading"),
        tRef.current("scenes.powerUps.upgradingMessage")
      );
    }
  }, [isConfirming, hash, showPending]);

  // Handle transaction errors
  useEffect(() => {
    if (isError || writeError) {
      console.log("❌ Transaction error:", isError || writeError);
      console.log("🔍 Error details:", { isError, writeError });

      // Check if it's a signature rejection
      const errorMessage = String(isError || writeError || "");
      if (
        errorMessage.includes("rejected") ||
        errorMessage.includes("cancelled") ||
        errorMessage.includes("user rejected")
      ) {
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("scenes.powerUps.signatureRejected")
        );
      } else {
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("scenes.powerUps.errorUpgrading")
        );
      }
    }
  }, [isError, writeError]);

  return {
    powerUpLevels,
    powerUpConfigs,
    isLoading,
    isUpgrading: (powerUpId: number) => upgradingPowerUps.has(powerUpId),
    isConfirming,
    upgradePowerUp,
    loadPowerUpLevels,
    loadPowerUpConfig,
    getUpgradeCost,
  };
};
