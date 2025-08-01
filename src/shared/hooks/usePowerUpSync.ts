import { useState, useCallback, useEffect, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { POWERUPMANAGER_ABI } from "@/infrastructure/blockchain/abis";
import { CONTRACT_ADDRESSES_CURRENT } from "@/infrastructure/config";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";
import { PowerUpType } from "@/shared/types/powerUps";

export const usePowerUpSync = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [powerUpLevels, setPowerUpLevels] = useState<number[]>([]);
  const [powerUpConfigs, setPowerUpConfigs] = useState<
    Record<number, { cost: number; maxLevel: number }>
  >({});
  const { showError, showSuccess, showPending } = useToastStore();
  const { t } = useTranslations();
  const hasLoadedRef = useRef(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Load power-up levels from blockchain
  const loadPowerUpLevels = useCallback(async () => {
    if (!address) return;

    // Prevent multiple simultaneous calls
    if (powerUpLevels.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const levels = await retryWithBackoff(() =>
        blockchainService.getPowerUpLevels(address)
      );
      setPowerUpLevels(levels);

      // Note: Removed the loadLevelsFromBlockchain call as it doesn't exist in blockchainService
    } catch {
      showError(t("common.error"), t("features.powerUp.failedToLoadLevels"));
    } finally {
      setIsLoading(false);
    }
  }, [address, showError, t, powerUpLevels.length]);

  // Load power-up configurations from blockchain
  const loadPowerUpConfigs = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (Object.keys(powerUpConfigs).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const configs: Record<number, { cost: number; maxLevel: number }> = {};

      // Load configs for all power-up types
      const powerUpTypes = [
        PowerUpType.SHIELD,
        PowerUpType.INFINITE_AMMO,
        PowerUpType.JUMP_BOOST,
        PowerUpType.SLOW_MOTION,
        PowerUpType.MULTI_SHOT,
        PowerUpType.RICE_ROCKET_AMMO,
      ];

      for (const powerUpType of powerUpTypes) {
        try {
          const powerUpId = getPowerUpIdFromType(powerUpType);
          const config = await retryWithBackoff(() =>
            blockchainService.getPowerUpConfig(powerUpId)
          );
          configs[powerUpId] = config;
        } catch {
          // Use default config
          const powerUpId = getPowerUpIdFromType(powerUpType);
          configs[powerUpId] = { cost: 100, maxLevel: 10 };
        }
      }

      setPowerUpConfigs(configs);
    } catch (error) {
      console.error("❌ Error loading configs:", error);
      showError(t("common.error"), t("features.powerUp.failedToLoadConfigs"));
    } finally {
      setIsLoading(false);
    }
  }, [showError, t, powerUpConfigs]);

  // Upgrade a power-up on blockchain
  const upgradePowerUp = useCallback(
    async (powerUpType: PowerUpType) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      const powerUpId = getPowerUpIdFromType(powerUpType);

      setIsUpgrading(true);
      showPending(
        t("features.powerUp.upgrading"),
        t("features.powerUp.upgradingMessage")
      );

      try {
        // Get current cost for this power-up
        const config = powerUpConfigs[powerUpId];
        if (!config) {
          console.error("❌ No config found for powerUpId:", powerUpId);
          showError(t("common.error"), t("features.powerUp.invalidPowerUp"));
          return false;
        }

        // Generate upgrade hash
        const timestamp = Math.floor(Date.now() / 1000);
        const upgradeHash = `UPGRADE_POWERUP-${address}-${powerUpId}-${timestamp}`;

        // Call API to get signature
        const response = await fetch("/api/sign-powerup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerAddress: address,
            powerUpId,
            upgradeHash,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get signature from API");
        }

        const data = await response.json();
        const signature = data.signature;

        if (!signature) {
          throw new Error("No signature returned from API");
        }

        // Execute the transaction
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
          abi: POWERUPMANAGER_ABI,
          functionName: "upgradePowerUp",
          args: [address, BigInt(powerUpId), BigInt(timestamp), signature],
        });

        return true;
      } catch {
        showError(t("common.error"), t("features.powerUp.upgradeError"));
        return false;
      } finally {
        setIsUpgrading(false);
      }
    },
    [address, powerUpConfigs, showError, showPending, t, writeContract]
  );

  // Get power-up level for a specific type
  const getPowerUpLevel = useCallback(
    (powerUpType: PowerUpType): number => {
      const powerUpId = getPowerUpIdFromType(powerUpType);
      return powerUpLevels[powerUpId] || 1;
    },
    [powerUpLevels]
  );

  // Get upgrade cost for a specific power-up
  const getUpgradeCost = useCallback(
    (powerUpType: PowerUpType): number => {
      const powerUpId = getPowerUpIdFromType(powerUpType);
      const config = powerUpConfigs[powerUpId];
      return config?.cost || 100;
    },
    [powerUpConfigs]
  );

  // Check if power-up can be upgraded
  const canUpgrade = useCallback(
    (powerUpType: PowerUpType): boolean => {
      const powerUpId = getPowerUpIdFromType(powerUpType);
      const currentLevel = powerUpLevels[powerUpId] || 1;
      const config = powerUpConfigs[powerUpId];

      if (!config) return false;

      return currentLevel < config.maxLevel;
    },
    [powerUpLevels, powerUpConfigs]
  );

  // Helper function to map PowerUpType to powerUpId
  const getPowerUpIdFromType = (powerUpType: PowerUpType): number => {
    const powerUpTypeMap: Record<PowerUpType, number> = {
      [PowerUpType.SHIELD]: 0,
      [PowerUpType.INFINITE_AMMO]: 1,
      [PowerUpType.JUMP_BOOST]: 2,
      [PowerUpType.SLOW_MOTION]: 3,
      [PowerUpType.MULTI_SHOT]: 4,
      [PowerUpType.RICE_ROCKET_AMMO]: 5,
    };
    return powerUpTypeMap[powerUpType] || 0;
  };

  // Load data when address changes
  useEffect(() => {
    if (address && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadPowerUpLevels();
      loadPowerUpConfigs();
    }
  }, [address, loadPowerUpLevels, loadPowerUpConfigs]);

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && hash) {
      showSuccess(
        t("features.powerUp.upgradeSuccess"),
        t("features.powerUp.upgradeSuccessMessage"),
        hash,
        "View Transaction"
      );
      // Reload levels after successful upgrade
      loadPowerUpLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash, showSuccess, t]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      showError(t("common.error"), t("features.powerUp.upgradeError"));
    }
  }, [error, showError, t]);

  return {
    powerUpLevels,
    powerUpConfigs,
    getPowerUpLevel,
    getUpgradeCost,
    canUpgrade,
    upgradePowerUp,
    loadPowerUpLevels,
    loadPowerUpConfigs,
    isLoading: isLoading || isPending || isConfirming,
    isUpgrading: isUpgrading || isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
};
