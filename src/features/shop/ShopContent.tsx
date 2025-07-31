"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useRice } from "@/shared/hooks/useRice";
import { usePowerUps } from "@/shared/hooks/usePowerUps";
import { PowerUpCardBlockchain } from "./PowerUpCardBlockchain";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { PowerUpType } from "@/shared/types/powerUps";
import { POWERUP_ORDER, POWERUP_UPGRADES } from "@/shared/constants/powerUps";

export const ShopContent: React.FC = () => {
  const { t } = useTranslations();
  const { showError } = useToastStore();
  const { checkRICEBalance } = useRice();
  const {
    powerUpLevels,
    powerUpConfigs,
    isUpgradingByType,
    upgradePowerUp,
    loadPowerUpLevels,
    loadPowerUpConfig,
    getUpgradeCost,
    updatePowerUpLevelOptimistically,
  } = usePowerUps();

  const [riceBalance, setRiceBalance] = useState(200);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [upgradeCosts, setUpgradeCosts] = useState<
    Partial<Record<PowerUpType, number>>
  >({});

  // Load RICE balance and power-up data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingBalance(true);
      try {
        // Load RICE balance
        const balance = await checkRICEBalance();
        setRiceBalance(balance);

        // Load power-up configs and costs
        const costs: Partial<Record<PowerUpType, number>> = {};
        const powerUpTypes = Object.values(PowerUpType);

        for (const powerUpType of powerUpTypes) {
          try {
            const cost = await getUpgradeCost(powerUpType);
            costs[powerUpType] = cost;
          } catch (error) {
            console.error(
              `❌ Failed to load power-up ${powerUpType} config:`,
              error
            );
          }
        }
        setUpgradeCosts(costs);
      } catch (error) {
        console.error("❌ Failed to load shop data:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadData();
  }, [checkRICEBalance, loadPowerUpLevels, loadPowerUpConfig, getUpgradeCost]);

  // Listen for balance refresh events
  useEffect(() => {
    const handleBalanceRefresh = async () => {
      try {
        const balance = await checkRICEBalance();
        setRiceBalance(balance);
      } catch (error) {
        console.error("❌ Failed to refresh balance in shop:", error);
      }
    };

    window.addEventListener("rice-balance-refresh", handleBalanceRefresh);

    return () => {
      window.removeEventListener("rice-balance-refresh", handleBalanceRefresh);
    };
  }, [checkRICEBalance]);

  const handleUpgrade = async (powerUpType: PowerUpType) => {
    try {
      // Get current cost for optimistic update
      const currentCost = upgradeCosts[powerUpType] || 0;

      // Optimistic updates
      updatePowerUpLevelOptimistically(powerUpType);
      setRiceBalance((prev) => Math.max(0, prev - currentCost));

      const success = await upgradePowerUp(powerUpType);

      if (success) {
        // Don't show success toast here - it will be handled by the hook's useEffect
        // when the transaction is actually confirmed on the blockchain
        // The balance and power-up levels will be refreshed automatically
        // when the transaction is confirmed via the event system
      } else {
        // Revert optimistic updates on failure
        setRiceBalance((prev) => prev + currentCost);
        // Note: power-up level will be reverted when loadPowerUpLevels is called
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      showError(
        t("scenes.shop.upgradeFailed"),
        t("scenes.shop.upgradeErrorDescription")
      );
    }
  };

  return (
    <Container className="py-6">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-xl p-5">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.shop.title")}
          subtitle={t("scenes.shop.subtitle")}
        />

        {/* Balance Section */}
        <div className="mb-8 p-4 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="subtitle" size="sm" className="text-white/70 mb-1">
                {t("scenes.shop.riceBalance")}
              </Text>
              <div className="flex items-center space-x-2">
                <Text
                  variant="title"
                  size="2xl"
                  className="text-white font-bold"
                >
                  {isLoadingBalance ? "..." : riceBalance}
                </Text>
                <div className="w-6 h-6 flex-shrink-0">
                  <RiceLogo className="w-full h-full" size={24} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <Text variant="subtitle" size="sm" className="text-white/70 mb-1">
                {t("scenes.shop.progression")}
              </Text>
              <Text variant="title" size="lg" className="text-white font-bold">
                {Math.round(
                  (Object.values(powerUpLevels).reduce(
                    (sum, level) => sum + Math.max(0, (level || 1) - 1),
                    0
                  ) /
                    (POWERUP_ORDER.length * 9)) * // POWERUP_ORDER.length power-ups × 9 levels (2-10)
                    100
                )}
                %
              </Text>
            </div>
          </div>
        </div>

        {/* Power-up Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POWERUP_ORDER.map((powerUpType) => {
            const powerUp = POWERUP_UPGRADES[powerUpType];
            const currentLevel = powerUpLevels[powerUpType] || 0;
            const upgradeCost = upgradeCosts[powerUpType] || 0;
            const isMaxLevel = powerUpConfigs[powerUpType]
              ? currentLevel >= powerUpConfigs[powerUpType].maxLevel
              : false;
            const canAfford = riceBalance >= upgradeCost;
            const isLoading = isUpgradingByType(powerUpType);

            return (
              <PowerUpCardBlockchain
                key={powerUpType}
                powerUp={powerUp}
                currentLevel={currentLevel}
                onUpgrade={() => handleUpgrade(powerUpType)}
                isLoading={isLoading}
                upgradeCost={upgradeCost}
                isMaxLevel={isMaxLevel}
                canAfford={canAfford}
              />
            );
          })}
        </div>
      </Card>
    </Container>
  );
};
