import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { PowerUpType, PowerUpUpgradeData } from "@/shared/types/powerUps";

interface PowerUpCardBlockchainProps {
  powerUp: PowerUpUpgradeData;
  currentLevel: number;
  onUpgrade: () => void;
  isLoading?: boolean;
  upgradeCost: number;
  isMaxLevel: boolean;
  canAfford: boolean;
  isBalanceLoading?: boolean;
}

export const PowerUpCard: React.FC<PowerUpCardBlockchainProps> = memo(
  ({
    powerUp,
    currentLevel,
    onUpgrade,
    isLoading = false,
    upgradeCost,
    isMaxLevel,
    canAfford,
    isBalanceLoading = false,
  }) => {
    const { t } = useTranslations();

    // Ensure currentLevel is valid (0-10) and handle NaN/undefined
    const validCurrentLevel = Math.max(
      0, // Allow level 0 (no upgrades)
      Math.min(10, Number(currentLevel) || 0)
    );
    const nextLevel = validCurrentLevel + 1;

    // Determine if button should be disabled
    const isButtonDisabled =
      isLoading || isMaxLevel || !canAfford || isBalanceLoading;

    const getUpgradeDescription = () => {
      if (isMaxLevel) {
        return t("features.powerUps.maxLevelReached");
      }

      // Use actual current level for correct upgrade display
      const actualCurrentLevel = Math.max(
        1,
        Math.min(10, Number(currentLevel) || 1)
      );
      const nextLevel = actualCurrentLevel + 1;

      // Get current and next upgrades based on actual current level
      const current = powerUp.upgrades[actualCurrentLevel - 1]; // -1 because array is 0-indexed
      const next = powerUp.upgrades[nextLevel - 1];

      // Safety check: if current upgrade is undefined, return empty string
      if (!current || !next) {
        return "";
      }

      switch (powerUp.type) {
        case PowerUpType.RICE_ROCKET_AMMO:
          return `${current.ammoCount || 0} → ${next?.ammoCount || 0} ${t(
            "features.powerUps.ammo"
          )}`;
        case PowerUpType.SHIELD:
        case PowerUpType.INFINITE_AMMO:
          return `${(current.duration || 0) / 1000}s → ${
            (next?.duration || 0) / 1000
          }s ${t("features.powerUps.duration")}`;
        case PowerUpType.JUMP_BOOST:
          const currentJump = (
            ((current.jumpMultiplier || 1) - 1) *
            100
          ).toFixed(0);
          const nextJump = (((next?.jumpMultiplier || 1) - 1) * 100).toFixed(0);
          return `${
            (current.duration || 0) / 1000
          }s, +${currentJump}% → +${nextJump}%`;
        case PowerUpType.SLOW_MOTION:
          const currentSlow = (
            (1 - (current.slowMultiplier || 1)) *
            100
          ).toFixed(0);
          const nextSlow = ((1 - (next?.slowMultiplier || 1)) * 100).toFixed(0);
          return `${
            (current.duration || 0) / 1000
          }s, -${currentSlow}% → -${nextSlow}%`;
        case PowerUpType.MULTI_SHOT:
          return `${(current.duration || 0) / 1000}s, ${
            current.projectileCount || 0
          } → ${next?.projectileCount || 0} ${t(
            "features.powerUps.projectiles"
          )}`;
        default:
          return "";
      }
    };

    const getProgressPercentage = () => {
      // Level 1 = 0% progress, Level 10 = 100% progress
      // Formula: ((level - 1) / 9) * 100
      const actualCurrentLevel = Math.max(
        1,
        Math.min(10, Number(currentLevel) || 1)
      );
      const percentage = ((actualCurrentLevel - 1) / 9) * 100;
      return isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    };

    const getShortPowerUpName = (type: string) => {
      return t(`features.powerUps.shortNames.${type}`);
    };

    return (
      <div className="glass-light rounded-xl p-5 border border-primary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mr-4 border border-primary/20 flex-shrink-0">
            <span className="text-2xl">{powerUp.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Text
                variant="title"
                size="lg"
                className="text-foreground font-bold leading-tight"
              >
                {getShortPowerUpName(powerUp.type)}
              </Text>
              <div className="bg-primary/10 rounded-lg px-3 py-1 border border-primary/20 flex-shrink-0 ml-3">
                <Text
                  variant="title"
                  size="sm"
                  className="text-primary font-bold"
                >
                  {Math.max(1, Math.min(10, Number(currentLevel) || 1))}/10
                </Text>
              </div>
            </div>
            <Text
              variant="subtitle"
              size="sm"
              className="text-muted-foreground"
            >
              {t(`features.powerUps.description.${powerUp.type}`)}
            </Text>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-primary/10 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary-hover rounded-full h-2 transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Current Stats - Simplified */}
        <div className="mb-4">
          <Text
            variant="subtitle"
            size="sm"
            className="text-muted-foreground font-medium"
          >
            {getUpgradeDescription()}
          </Text>
        </div>

        {/* Upgrade Section - Simplified */}
        <div className="mt-auto">
          {!isMaxLevel ? (
            <div className="space-y-3">
              {/* Upgrade Cost - Simplified */}
              <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3 border border-primary/10">
                <div className="flex items-center space-x-2">
                  <span className="text-primary">💰</span>
                  <Text
                    variant="subtitle"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    {t("features.powerUps.upgradeCost")}
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Text
                    variant="title"
                    size="lg"
                    className="text-foreground font-bold"
                  >
                    {upgradeCost}
                  </Text>
                  <div className="w-5 h-5 flex-shrink-0">
                    <RiceLogo className="w-full h-full" size={20} />
                  </div>
                </div>
              </div>

              {/* Upgrade Button */}
              <Button
                onClick={onUpgrade}
                disabled={isButtonDisabled}
                variant={
                  canAfford && !isBalanceLoading ? "gradient" : "secondary"
                }
                size="sm"
                className={`w-full h-11 transition-all duration-200 ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">
                      {t("features.powerUps.upgrading")}
                    </span>
                  </div>
                ) : isBalanceLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">
                      {t("features.powerUps.loading")}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium">
                    {t("features.powerUps.upgrade")} →{" "}
                    {t("features.powerUps.level")} {nextLevel}
                  </span>
                )}
              </Button>

              {/* Insufficient Rice Warning - Simplified */}
              {!canAfford && !isLoading && !isBalanceLoading && (
                <Text
                  variant="error"
                  size="sm"
                  className="text-error text-center font-medium"
                >
                  {t("features.powerUps.insufficientRice")}
                </Text>
              )}
            </div>
          ) : (
            <div className="text-center bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Text
                variant="title"
                size="lg"
                className="text-primary font-bold"
              >
                {t("features.powerUps.maxLevelReached")}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PowerUpCard.displayName = "PowerUpCard";
