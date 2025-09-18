import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useRice } from "@/shared/hooks/useRice";
import { usePowerUps } from "@/shared/hooks/usePowerUps";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { PowerUpType } from "@/shared/types/powerUps";
import { POWERUP_ORDER } from "@/shared/constants/powerUps";

export interface ShopState {
  riceBalance: number;
  isLoadingBalance: boolean;
  upgradeCosts: Partial<Record<PowerUpType, number>>;
  isLoadingCosts: boolean;
  isUpgrading: Record<PowerUpType, boolean>;
  powerUpLevels: Partial<Record<PowerUpType, number>>;
  powerUpConfigs: Partial<
    Record<PowerUpType, { cost: number; maxLevel: number }>
  >;
  progression: number;
}

export interface ShopActions {
  handleUpgrade: (powerUpType: PowerUpType) => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshCosts: () => Promise<void>;
  canAffordUpgrade: (powerUpType: PowerUpType) => boolean;
  isMaxLevel: (powerUpType: PowerUpType) => boolean;
  getUpgradeCost: (powerUpType: PowerUpType) => number;
  getCurrentLevel: (powerUpType: PowerUpType) => number;
}

export const useShop = (): ShopState & ShopActions => {
  const { t } = useTranslations();
  const { showError } = useToastStore();
  const { checkRICEBalance } = useRice();
  const {
    powerUpLevels,
    powerUpConfigs,
    isUpgradingByType,
    upgradePowerUp,
    getUpgradeCost: getPowerUpUpgradeCost,
    updatePowerUpLevelOptimistically,
  } = usePowerUps();

  // State
  const [riceBalance, setRiceBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [upgradeCosts, setUpgradeCosts] = useState<
    Partial<Record<PowerUpType, number>>
  >({});
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);

  // Use refs to avoid dependency issues
  const showErrorRef = useRef(showError);
  const tRef = useRef(t);
  const checkRICEBalanceRef = useRef(checkRICEBalance);
  const getPowerUpUpgradeCostRef = useRef(getPowerUpUpgradeCost);

  // Update refs when values change
  useEffect(() => {
    showErrorRef.current = showError;
    tRef.current = t;
    checkRICEBalanceRef.current = checkRICEBalance;
    getPowerUpUpgradeCostRef.current = getPowerUpUpgradeCost;
  });

  // Load RICE balance
  const refreshBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const balance = await checkRICEBalanceRef.current();
      setRiceBalance(balance);
    } catch (error) {
      console.error("❌ Failed to load RICE balance:", error);
      showErrorRef.current(
        tRef.current("common.error"),
        tRef.current("scenes.shop.balanceLoadError")
      );
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  // Load upgrade costs
  const refreshCosts = useCallback(async () => {
    setIsLoadingCosts(true);
    try {
      const costs: Partial<Record<PowerUpType, number>> = {};

      for (const powerUpType of POWERUP_ORDER) {
        try {
          const cost = await getPowerUpUpgradeCostRef.current(powerUpType);
          costs[powerUpType] = cost;
        } catch (error) {
          console.error(`❌ Failed to load cost for ${powerUpType}:`, error);
        }
      }
      setUpgradeCosts(costs);
    } catch (error) {
      console.error("❌ Failed to load upgrade costs:", error);
      showErrorRef.current(
        tRef.current("common.error"),
        tRef.current("scenes.shop.costsLoadError")
      );
    } finally {
      setIsLoadingCosts(false);
    }
  }, []);

  // Load initial data only once
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([refreshBalance(), refreshCosts()]);
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Listen for balance refresh events
  useEffect(() => {
    const handleBalanceRefresh = () => {
      refreshBalance();
    };

    window.addEventListener("rice-balance-refresh", handleBalanceRefresh);
    return () => {
      window.removeEventListener("rice-balance-refresh", handleBalanceRefresh);
    };
  }, [refreshBalance]);

  // Handle upgrade with better balance management
  const handleUpgrade = useCallback(
    async (powerUpType: PowerUpType) => {
      try {
        const currentCost = upgradeCosts[powerUpType] || 0;

        // Optimistic updates
        updatePowerUpLevelOptimistically(powerUpType);
        setRiceBalance((prev) => Math.max(0, prev - currentCost));

        const success = await upgradePowerUp(powerUpType);

        if (!success) {
          // Revert optimistic updates on failure
          setRiceBalance((prev) => prev + currentCost);
        } else {
          // Refresh balance after successful upgrade to ensure accuracy
          setTimeout(() => {
            refreshBalance();
          }, 1000); // Small delay to allow blockchain to update
        }
      } catch (error) {
        console.error("Upgrade failed:", error);
        showErrorRef.current(
          tRef.current("scenes.shop.upgradeFailed"),
          tRef.current("scenes.shop.upgradeErrorDescription")
        );
      }
    },
    [
      upgradeCosts,
      updatePowerUpLevelOptimistically,
      upgradePowerUp,
      refreshBalance,
    ]
  );

  // Helper functions
  const canAffordUpgrade = useCallback(
    (powerUpType: PowerUpType): boolean => {
      const cost = upgradeCosts[powerUpType] || 0;
      return riceBalance >= cost;
    },
    [riceBalance, upgradeCosts]
  );

  const isMaxLevel = useCallback(
    (powerUpType: PowerUpType): boolean => {
      const currentLevel = powerUpLevels[powerUpType] || 0;
      const configuredMax = powerUpConfigs[powerUpType]?.maxLevel;
      const fallbackMax = POWERUP_UPGRADES[powerUpType]?.upgrades?.length || 1;
      const effectiveMax = configuredMax ?? fallbackMax;
      return currentLevel >= effectiveMax;
    },
    [powerUpLevels, powerUpConfigs]
  );

  const getUpgradeCost = useCallback(
    (powerUpType: PowerUpType): number => {
      return upgradeCosts[powerUpType] || 0;
    },
    [upgradeCosts]
  );

  const getCurrentLevel = useCallback(
    (powerUpType: PowerUpType): number => {
      return powerUpLevels[powerUpType] || 0;
    },
    [powerUpLevels]
  );

  // Calculate progression percentage (normalized per power-up)
  // - For multi-level power-ups: progress = (level - 1) / (maxLevel - 1)
  // - For unlock-only power-ups (single level): progress = level >= 1 ? 1 : 0
  const progression = useMemo(() => {
    const perPowerUpProgress = POWERUP_ORDER.map((type) => {
      const definition = POWERUP_UPGRADES[type];
      const levelsCount = definition?.upgrades?.length || 1;
      const currentLevel = powerUpLevels[type] ?? 0;

      if (levelsCount <= 1) {
        // Unlock-only: contributes 0 until bought, then 1
        return currentLevel >= 1 ? 1 : 0;
      }

      const numerator = Math.max(0, (currentLevel || 1) - 1);
      const denominator = Math.max(1, levelsCount - 1);
      return Math.min(1, numerator / denominator);
    });

    const avg =
      perPowerUpProgress.reduce((sum, p) => sum + p, 0) /
      Math.max(1, perPowerUpProgress.length);
    return Math.round(avg * 100);
  }, [powerUpLevels]);

  // Create isUpgrading record
  const isUpgrading: Record<PowerUpType, boolean> = POWERUP_ORDER.reduce(
    (acc, powerUpType) => {
      acc[powerUpType] = isUpgradingByType(powerUpType);
      return acc;
    },
    {} as Record<PowerUpType, boolean>
  );

  return {
    // State
    riceBalance,
    isLoadingBalance,
    upgradeCosts,
    isLoadingCosts,
    isUpgrading,
    powerUpLevels,
    powerUpConfigs,
    progression,

    // Actions
    handleUpgrade,
    refreshBalance,
    refreshCosts,
    canAffordUpgrade,
    isMaxLevel,
    getUpgradeCost,
    getCurrentLevel,
  };
};
