import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { PowerUpUpgradeData, PowerUpType } from "@/shared/types/powerUps";

interface PowerUpCardProps {
  powerUp: PowerUpUpgradeData;
  currentLevel: number;
  riceBalance: number;
  onUpgrade: (powerUpType: PowerUpType) => void;
  isLoading?: boolean;
}

export const PowerUpCard: React.FC<PowerUpCardProps> = ({
  powerUp,
  currentLevel,
  riceBalance,
  onUpgrade,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  // Ensure currentLevel is valid (1-10) and handle NaN/undefined
  const validCurrentLevel = Math.max(
    1,
    Math.min(10, Number(currentLevel) || 1)
  );
  const currentUpgrade = powerUp.upgrades[validCurrentLevel - 1];
  const nextUpgrade = powerUp.upgrades[validCurrentLevel];
  const isMaxLevel = validCurrentLevel >= 10;
  const canAfford = nextUpgrade && riceBalance >= nextUpgrade.riceCost;

  const getUpgradeDescription = () => {
    if (isMaxLevel) {
      return t("features.powerUps.maxLevelReached");
    }

    const current = currentUpgrade;
    const next = nextUpgrade;

    // Safety check: if current upgrade is undefined, return empty string
    if (!current) {
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
        const currentJump = (((current.jumpMultiplier || 1) - 1) * 100).toFixed(
          0
        );
        const nextJump = (((next?.jumpMultiplier || 1) - 1) * 100).toFixed(0);
        return `${
          (current.duration || 0) / 1000
        }s, +${currentJump}% → +${nextJump}%`;
      case PowerUpType.SLOW_MOTION:
        const currentSlow = ((1 - (current.slowMultiplier || 1)) * 100).toFixed(
          0
        );
        const nextSlow = ((1 - (next?.slowMultiplier || 1)) * 100).toFixed(0);
        return `${
          (current.duration || 0) / 1000
        }s, -${currentSlow}% → -${nextSlow}%`;
      case PowerUpType.MULTI_SHOT:
        return `${(current.duration || 0) / 1000}s, ${
          current.projectileCount || 0
        } → ${next?.projectileCount || 0} projectiles`;
      default:
        return "";
    }
  };

  const getProgressPercentage = () => {
    const percentage = (validCurrentLevel / 10) * 100;
    return isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
  };

  const getShortPowerUpName = (type: PowerUpType) => {
    return t(`features.powerUps.shortNames.${type}`);
  };

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 border border-white/30 flex-shrink-0">
          <span className="text-2xl drop-shadow-sm">{powerUp.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Text
              variant="title"
              size="lg"
              className="text-white font-bold leading-tight"
            >
              {getShortPowerUpName(powerUp.type)}
            </Text>
            <Text
              variant="title"
              size="lg"
              className="text-white font-bold ml-2 flex-shrink-0"
            >
              {validCurrentLevel}/10
            </Text>
          </div>
          <Text
            variant="subtitle"
            size="sm"
            className="text-white/70 line-clamp-2"
          >
            {t(`features.powerUps.description.${powerUp.type}`)}
          </Text>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-white/80 to-white/60 rounded-full h-2 transition-all duration-500 ease-out"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Current Stats */}
      <div className="mb-4">
        <Text variant="subtitle" size="sm" className="text-white/80">
          {getUpgradeDescription()}
        </Text>
      </div>

      {/* Upgrade Section - Fixed at bottom */}
      <div className="mt-auto">
        {!isMaxLevel ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text variant="subtitle" size="sm" className="text-white/70">
                {t("features.powerUps.upgradeCost")}:
              </Text>
              <div className="flex items-center space-x-1">
                <Text
                  variant="title"
                  size="lg"
                  className="text-white font-bold drop-shadow-lg"
                >
                  {nextUpgrade?.riceCost}
                </Text>
                <div className="w-5 h-5 flex-shrink-0">
                  <RiceLogo className="w-full h-full" size={20} />
                </div>
              </div>
            </div>

            <Button
              onClick={() => onUpgrade(powerUp.type)}
              disabled={!canAfford || isLoading}
              variant={canAfford ? "success" : "secondary"}
              size="sm"
              className={`w-full h-10 transition-all duration-200 ${
                isLoading
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 animate-pulse"
                  : canAfford
                  ? "bg-gradient-to-r from-violet-500/80 to-violet-600/80 hover:from-violet-600 hover:to-violet-700 border border-violet-400/30"
                  : "bg-gradient-to-r from-gray-500/50 to-gray-600/50 border border-gray-400/30"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Upgrading...</span>
                </div>
              ) : (
                <span className="text-sm font-medium">
                  {t("features.powerUps.upgrade")} → Niveau {currentLevel + 1}
                </span>
              )}
            </Button>

            {!canAfford && !isLoading && (
              <Text
                variant="error"
                size="sm"
                className="text-center text-red-700 font-medium drop-shadow-sm"
              >
                {t("features.powerUps.insufficientRice")}
              </Text>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Text
              variant="title"
              size="lg"
              className="text-violet-300 font-bold drop-shadow-sm"
            >
              {t("features.powerUps.maxLevelReached")}
            </Text>
            <Text variant="subtitle" size="sm" className="text-white/60 mt-1">
              Niveau maximum atteint !
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
