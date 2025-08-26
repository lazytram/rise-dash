import React, { memo } from "react";
import { PowerUpCard } from "../PowerUpCard";
import { POWERUP_ORDER, POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { PowerUpType } from "@/shared/types/powerUps";
import { Loader } from "@/shared/components/Loader";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface PowerUpGridProps {
  isUpgrading: Record<PowerUpType, boolean>;
  powerUpLevels: Partial<Record<PowerUpType, number>>;
  upgradeCosts: Partial<Record<PowerUpType, number>>;
  isLoadingCosts: boolean;
  isLoadingBalance: boolean;
  canAffordUpgrade: (powerUpType: PowerUpType) => boolean;
  isMaxLevel: (powerUpType: PowerUpType) => boolean;
  onUpgrade: (powerUpType: PowerUpType) => Promise<void>;
}

export const PowerUpGrid: React.FC<PowerUpGridProps> = memo(
  ({
    isUpgrading,
    powerUpLevels,
    upgradeCosts,
    isLoadingCosts,
    isLoadingBalance,
    canAffordUpgrade,
    isMaxLevel,
    onUpgrade,
  }) => {
    const { t } = useTranslations();

    if (isLoadingCosts) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="lg" text={t("scenes.shop.loadingCosts")} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {POWERUP_ORDER.map((powerUpType) => {
          const powerUp = POWERUP_UPGRADES[powerUpType];
          const currentLevel = powerUpLevels[powerUpType] || 0;
          const upgradeCost = upgradeCosts[powerUpType] || 0;
          const isMaxLevelReached = isMaxLevel(powerUpType);
          const canAfford = canAffordUpgrade(powerUpType);
          const isLoading = isUpgrading[powerUpType];

          return (
            <PowerUpCard
              key={powerUpType}
              powerUp={powerUp}
              currentLevel={currentLevel}
              onUpgrade={() => onUpgrade(powerUpType)}
              isLoading={isLoading}
              upgradeCost={upgradeCost}
              isMaxLevel={isMaxLevelReached}
              canAfford={canAfford}
              isBalanceLoading={isLoadingBalance}
            />
          );
        })}
      </div>
    );
  }
);

PowerUpGrid.displayName = "PowerUpGrid";
