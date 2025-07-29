import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  getPowerUpLevelsFromBlockchain,
  getPowerUpConfigFromBlockchain,
  getPowerUpService,
} from "@/shared/services/powerUpService";
import { PowerUpType } from "@/shared/types/powerUps";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";
import { getPowerUpManagerAddress } from "@/infrastructure/config";
import { POWERUPMANAGER_ABI } from "@/infrastructure/blockchain/abis";

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
      console.log("⚠️ Power-up levels already loaded, skipping...");
      return;
    }

    setIsLoading(true);
    try {
      const levels = await retryWithBackoff(() =>
        getPowerUpLevelsFromBlockchain(address)
      );
      setPowerUpLevels(levels);

      // Update local service with blockchain levels
      const service = getPowerUpService();
      await service.loadLevelsFromBlockchain(address);

      console.log("✅ Power-up levels loaded from blockchain:", levels);
    } catch (error) {
      console.error("❌ Error loading power-up levels:", error);
      showError(t("common.error"), t("features.powerUp.failedToLoadLevels"));
    } finally {
      setIsLoading(false);
    }
  }, [address, showError, t]);

  // Load power-up configurations from blockchain
  const loadPowerUpConfigs = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (Object.keys(powerUpConfigs).length > 0) {
      console.log("⚠️ Power-up configs already loaded, skipping...");
      return;
    }

    setIsLoading(true);
    try {
      const configs: Record<number, { cost: number; maxLevel: number }> = {};

      // Load configs for first 6 power-ups
      for (let i = 0; i < 6; i++) {
        try {
          const config = await retryWithBackoff(() =>
            getPowerUpConfigFromBlockchain(i)
          );
          configs[i] = config;
        } catch (error) {
          console.error(`❌ Error loading config for power-up ${i}:`, error);
          // Use default config
          configs[i] = { cost: 100, maxLevel: 10 };
        }
      }

      setPowerUpConfigs(configs);
      console.log("✅ Power-up configs loaded from blockchain:", configs);
    } catch (error) {
      console.error("❌ Error loading power-up configs:", error);
      showError(t("common.error"), t("features.powerUp.failedToLoadConfigs"));
    } finally {
      setIsLoading(false);
    }
  }, [showError, t]);

  // Upgrade a power-up on blockchain
  const upgradePowerUp = useCallback(
    async (powerUpId: number) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      setIsUpgrading(true);
      showPending(
        t("features.powerUp.upgrading"),
        t("features.powerUp.upgradingMessage")
      );

      try {
        // Get current cost for this power-up
        const config = powerUpConfigs[powerUpId];
        if (!config) {
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
          address: getPowerUpManagerAddress(),
          abi: POWERUPMANAGER_ABI,
          functionName: "upgradePowerUp",
          args: [
            address,
            BigInt(powerUpId),
            upgradeHash as `0x${string}`,
            signature,
          ],
        });

        return true;
      } catch (error) {
        console.error("❌ Error upgrading power-up:", error);
        showError(t("common.error"), t("features.powerUp.failedToUpgrade"));
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
  }, [address]); // Remove loadPowerUpLevels and loadPowerUpConfigs from dependencies

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
  }, [isSuccess, hash, showSuccess, t, loadPowerUpLevels]);

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
