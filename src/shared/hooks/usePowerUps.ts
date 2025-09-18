import { useState, useEffect, useCallback, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { POWERUPMANAGER_ABI } from "@/infrastructure/blockchain/abis";
import { CONTRACT_ADDRESSES_CURRENT } from "@/infrastructure/config";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";
import { PowerUpType } from "@/shared/types/powerUps";

export type PowerUpLevels = Partial<Record<PowerUpType, number>>;

export interface PowerUpConfig {
  cost: number;
  maxLevel: number;
}

export const usePowerUps = () => {
  const { address } = useAccount();
  // Change from Set<number> to Record<PowerUpType, boolean> for individual loading states
  const [upgradingPowerUps, setUpgradingPowerUps] = useState<
    Record<PowerUpType, boolean>
  >({
    [PowerUpType.SHIELD]: false,
    [PowerUpType.INFINITE_AMMO]: false,
    [PowerUpType.JUMP_BOOST]: false,
    [PowerUpType.SLOW_MOTION]: false,
    [PowerUpType.MULTI_SHOT]: false,
    [PowerUpType.RICE_ROCKET_AMMO]: false,
    [PowerUpType.PHOENIX_PACT]: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [powerUpLevels, setPowerUpLevels] = useState<PowerUpLevels>({});
  const [confirmedTransaction, setConfirmedTransaction] = useState<
    string | null
  >(null);
  const [powerUpConfigs, setPowerUpConfigs] = useState<
    Partial<Record<PowerUpType, PowerUpConfig>>
  >({});
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
    configs: { [powerUpType in PowerUpType]?: PowerUpConfig };
    timestamp: number;
  } | null>(null);
  const CACHE_DURATION = 30000; // 30 seconds cache

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
    error: transactionError,
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
      const powerUpTypeMap: Record<number, PowerUpType> = {
        0: PowerUpType.SHIELD,
        1: PowerUpType.INFINITE_AMMO,
        2: PowerUpType.JUMP_BOOST,
        3: PowerUpType.SLOW_MOTION,
        4: PowerUpType.MULTI_SHOT,
        5: PowerUpType.RICE_ROCKET_AMMO,
        6: PowerUpType.PHOENIX_PACT,
      };
      levels.forEach((level, index) => {
        const powerUpType = powerUpTypeMap[index];
        if (!powerUpType) return;

        // Generic handling for unlockable power-ups:
        // If a power-up requires purchase (unlock-only), interpret blockchain level as (realLevel + 1)
        // and map back to realLevel so 0 means locked until purchased.
        const definition = POWERUP_UPGRADES[powerUpType];
        const isUnlockable = Boolean(
          definition?.requiresPurchase ||
            (definition?.upgrades?.length || 0) === 1
        );
        const mappedLevel = isUnlockable
          ? Math.max(0, (level || 0) - 1)
          : level;

        levelsMap[powerUpType] = mappedLevel;
      });

      // Cache the result
      levelsCacheRef.current = {
        levels: levelsMap,
        timestamp: Date.now(),
      };

      setPowerUpLevels(levelsMap);
      return levelsMap;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Load power-up configuration
  const loadPowerUpConfig = useCallback(
    async (powerUpType: PowerUpType): Promise<PowerUpConfig> => {
      // Convert PowerUpType to powerUpId for blockchain calls
      const powerUpIdMap: Record<PowerUpType, number> = {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.INFINITE_AMMO]: 1,
        [PowerUpType.JUMP_BOOST]: 2,
        [PowerUpType.SLOW_MOTION]: 3,
        [PowerUpType.MULTI_SHOT]: 4,
        [PowerUpType.RICE_ROCKET_AMMO]: 5,
        [PowerUpType.PHOENIX_PACT]: 6,
      };
      const powerUpId = powerUpIdMap[powerUpType];

      try {
        // Call directly without retryWithBackoff to see the exact error
        const config = await blockchainService.getPowerUpConfig(powerUpId);

        // Update cache
        const currentConfigs = configsCacheRef.current?.configs || {};
        currentConfigs[powerUpType] = config;
        configsCacheRef.current = {
          configs: currentConfigs,
          timestamp: Date.now(),
        };

        setPowerUpConfigs((prev) => ({ ...prev, [powerUpType]: config }));
        return config;
      } catch (error) {
        console.error(
          `❌ Error in loadPowerUpConfig for ${powerUpType}:`,
          error
        );
        throw error;
      }
    },
    []
  );

  // Get upgrade cost for a specific power-up
  const getUpgradeCost = useCallback(
    async (powerUpType: PowerUpType): Promise<number> => {
      if (!address) {
        throw new Error("No wallet address");
      }

      // Convert PowerUpType to powerUpId for blockchain calls
      const powerUpIdMap: Record<PowerUpType, number> = {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.INFINITE_AMMO]: 1,
        [PowerUpType.JUMP_BOOST]: 2,
        [PowerUpType.SLOW_MOTION]: 3,
        [PowerUpType.MULTI_SHOT]: 4,
        [PowerUpType.RICE_ROCKET_AMMO]: 5,
        [PowerUpType.PHOENIX_PACT]: 6,
      };
      const powerUpId = powerUpIdMap[powerUpType];

      try {
        // First, check if the power-up is configured
        const config = await blockchainService.getPowerUpConfig(powerUpId);

        if (config.maxLevel === 0) {
          throw new Error(
            `Power-up ${powerUpType} is not configured on blockchain`
          );
        }

        const cost = await retryWithBackoff(() =>
          blockchainService.getPowerUpUpgradeCost(address, powerUpId)
        );

        return cost;
      } catch (error) {
        console.error(
          `❌ Failed to get upgrade cost for ${powerUpType}:`,
          error
        );
        throw error;
      }
    },
    [address]
  );

  // Optimistic update function
  const updatePowerUpLevelOptimistically = useCallback(
    (powerUpType: PowerUpType) => {
      setPowerUpLevels((prev) => ({
        ...prev,
        [powerUpType]: (prev[powerUpType] || 0) + 1,
      }));
    },
    []
  );

  // Upgrade a power-up
  const upgradePowerUp = useCallback(
    async (powerUpType: PowerUpType) => {
      if (!address) {
        console.error("❌ No wallet address");
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("features.blockchain.connectWallet")
        );
        return false;
      }

      // Convert PowerUpType to powerUpId for blockchain calls
      const powerUpIdMap: Record<PowerUpType, number> = {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.INFINITE_AMMO]: 1,
        [PowerUpType.JUMP_BOOST]: 2,
        [PowerUpType.SLOW_MOTION]: 3,
        [PowerUpType.MULTI_SHOT]: 4,
        [PowerUpType.RICE_ROCKET_AMMO]: 5,
        [PowerUpType.PHOENIX_PACT]: 6,
      };
      const powerUpId = powerUpIdMap[powerUpType];

      // Clear any existing toasts before starting
      clearToasts();
      // Set individual loading state for this power-up
      setUpgradingPowerUps((prev) => ({ ...prev, [powerUpType]: true }));

      try {
        // Get current levels to check if upgrade is possible
        const currentLevels = await loadPowerUpLevels();
        const currentLevel = currentLevels[powerUpType] || 0;

        // Get power-up config to check max level
        const config = await loadPowerUpConfig(powerUpType);

        // Also check if power-up is initialized on blockchain
        try {
          const blockchainConfig =
            await blockchainService.getPowerUpConfig(powerUpId);

          // Check if power-up is initialized
          if (blockchainConfig.maxLevel === 0) {
            console.error("❌ Power-up not initialized on blockchain!");
            showError(
              t("common.error"),
              "Power-up not initialized on blockchain"
            );
            return false;
          }
        } catch (error) {
          console.error("❌ Error getting blockchain config:", error);
          showError(t("common.error"), "Failed to get blockchain config");
          return false;
        }

        // Check if power-up is initialized (maxLevel > 0)
        if (config.maxLevel === 0) {
          console.error("❌ Power-up not initialized");
          showError(
            t("common.error"),
            t("scenes.powerUps.powerUpNotInitialized")
          );
          return false;
        }

        if (currentLevel >= config.maxLevel) {
          console.error("❌ Max level reached");
          showError(t("common.error"), t("features.powerUps.maxLevelReached"));
          return false;
        }

        // Get upgrade cost
        const cost = await getUpgradeCost(powerUpType);

        // Check if player has enough RICE
        const riceBalance = await retryWithBackoff(() =>
          blockchainService.getRICEBalance(address)
        );

        if (riceBalance < cost) {
          console.error("❌ Insufficient RICE");
          showErrorRef.current(
            tRef.current("common.error"),
            tRef.current("scenes.powerUps.insufficientRICE")
          );
          return false;
        }

        // Execute the transaction using emergency function (no signature required)
        writeContract({
          address: CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER,
          abi: POWERUPMANAGER_ABI,
          functionName: "upgradePowerUpEmergency",
          args: [address, BigInt(powerUpId)],
        });

        return true;
      } catch {
        showErrorRef.current(
          tRef.current("common.error"),
          tRef.current("scenes.powerUps.errorUpgrading")
        );
        return false;
      } finally {
        // Clear individual loading state for this power-up
        setUpgradingPowerUps((prev) => ({ ...prev, [powerUpType]: false }));
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
      loadPowerUpLevels().catch(() => {});
    }
  }, [address, loadPowerUpLevels]);

  // Handle transaction success (only when confirmed)
  useEffect(() => {
    if (
      isSuccess &&
      hash &&
      !isConfirming &&
      !isError &&
      confirmedTransaction !== hash
    ) {
      setConfirmedTransaction(hash);

      // Only show success toast after transaction is confirmed
      showSuccessRef.current(
        tRef.current("scenes.powerUps.upgradeSuccess"),
        tRef.current("scenes.powerUps.upgradeSuccessMessage"),
        hash,
        "View Transaction"
      );

      // Refresh power-up levels after successful upgrade
      loadPowerUpLevels().catch(() => {});

      // Refresh RICE balance after successful upgrade
      // This will trigger a re-render in components that use useRice
      const event = new CustomEvent("rice-balance-refresh");
      window.dispatchEvent(event);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Check if it's a signature rejection
      const errorMessage = String(
        isError || writeError || transactionError || ""
      );

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
  }, [isError, writeError, transactionError]);

  // Helper function to convert PowerUpType to powerUpId
  const getPowerUpId = useCallback((powerUpType: PowerUpType): number => {
    const powerUpIdMap: Record<PowerUpType, number> = {
      [PowerUpType.SHIELD]: 0,
      [PowerUpType.INFINITE_AMMO]: 1,
      [PowerUpType.JUMP_BOOST]: 2,
      [PowerUpType.SLOW_MOTION]: 3,
      [PowerUpType.MULTI_SHOT]: 4,
      [PowerUpType.RICE_ROCKET_AMMO]: 5,
      [PowerUpType.PHOENIX_PACT]: 6,
    };
    return powerUpIdMap[powerUpType];
  }, []);

  // Wrapper functions that use PowerUpType
  const getUpgradeCostByType = useCallback(
    async (powerUpType: PowerUpType): Promise<number> => {
      return getUpgradeCost(powerUpType);
    },
    [getUpgradeCost]
  );

  const upgradePowerUpByType = useCallback(
    async (powerUpType: PowerUpType): Promise<boolean> => {
      return upgradePowerUp(powerUpType);
    },
    [upgradePowerUp]
  );

  const loadPowerUpConfigByType = useCallback(
    async (powerUpType: PowerUpType): Promise<PowerUpConfig> => {
      return loadPowerUpConfig(powerUpType);
    },
    [loadPowerUpConfig]
  );

  const isUpgradingByType = useCallback(
    (powerUpType: PowerUpType): boolean => {
      return upgradingPowerUps[powerUpType] || false;
    },
    [upgradingPowerUps]
  );

  return {
    powerUpLevels,
    powerUpConfigs,
    isLoading,
    isUpgrading: (powerUpId: number) => {
      // Convert powerUpId back to PowerUpType for checking
      const powerUpTypeMap: Record<number, PowerUpType> = {
        0: PowerUpType.SHIELD,
        1: PowerUpType.INFINITE_AMMO,
        2: PowerUpType.JUMP_BOOST,
        3: PowerUpType.SLOW_MOTION,
        4: PowerUpType.MULTI_SHOT,
        5: PowerUpType.RICE_ROCKET_AMMO,
        6: PowerUpType.PHOENIX_PACT,
      };
      const powerUpType = powerUpTypeMap[powerUpId];
      return powerUpType ? upgradingPowerUps[powerUpType] : false;
    },
    isConfirming,
    upgradePowerUp,
    loadPowerUpLevels,
    loadPowerUpConfig,
    getUpgradeCost,
    // New functions that use PowerUpType
    getUpgradeCostByType,
    upgradePowerUpByType,
    loadPowerUpConfigByType,
    isUpgradingByType,
    getPowerUpId,
    updatePowerUpLevelOptimistically,
  };
};
