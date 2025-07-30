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
      };
      levels.forEach((level, index) => {
        const powerUpType = powerUpTypeMap[index];
        if (powerUpType) {
          levelsMap[powerUpType] = level;
        }
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
      // Temporarily disable cache for debugging
      // Check cache first
      /*
      if (
        configsCacheRef.current &&
        Date.now() - configsCacheRef.current.timestamp < CACHE_DURATION
      ) {
        return (
          configsCacheRef.current.configs[powerUpType] || {
            cost: 0,
            maxLevel: 0,
          }
        );
      }
      */

      // Convert PowerUpType to powerUpId for blockchain calls
      const powerUpIdMap: Record<PowerUpType, number> = {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.INFINITE_AMMO]: 1,
        [PowerUpType.JUMP_BOOST]: 2,
        [PowerUpType.SLOW_MOTION]: 3,
        [PowerUpType.MULTI_SHOT]: 4,
        [PowerUpType.RICE_ROCKET_AMMO]: 5,
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
      };
      const powerUpId = powerUpIdMap[powerUpType];

      try {
        const cost = await retryWithBackoff(() =>
          blockchainService.getPowerUpUpgradeCost(address, powerUpId)
        );
        return cost;
      } catch (error) {
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

        // Check if power-up is initialized (maxLevel > 0)
        if (config.maxLevel === 0) {
          showError(
            t("common.error"),
            t("scenes.powerUps.powerUpNotInitialized")
          );
          return false;
        }

        if (currentLevel >= config.maxLevel) {
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
          showErrorRef.current(
            tRef.current("common.error"),
            tRef.current("scenes.powerUps.insufficientRICE")
          );
          return false;
        }

        // Generate unique upgrade hash using blockchainService

        const upgradeHash = blockchainService.generatePowerUpHash(
          address,
          powerUpId,
          cost
        ) as `0x${string}`;
        // Get signature from server

        const requestBody = {
          playerAddress: address,
          powerUpId,
          upgradeHash,
          cost,
        };

        const response = await fetch("/api/sign-powerup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Failed to get signature");
        }

        const { signature } = await response.json();
        writeContract({
          address: getPowerUpManagerAddress(),
          abi: POWERUPMANAGER_ABI,
          functionName: "upgradePowerUp",
          args: [address, BigInt(powerUpId), upgradeHash, signature],
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
    }
  }, [
    isSuccess,
    hash,
    isConfirming,
    isError,
    confirmedTransaction,
    loadPowerUpLevels,
  ]);

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
