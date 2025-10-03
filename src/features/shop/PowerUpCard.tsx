import React, { memo, useMemo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { PowerUpUpgradeData } from "@/shared/types/powerUps";
import {
  buildUpgradeDescription,
  clampDisplayLevel,
  computeMaxLevel,
  computeNextLevel,
  computeProgressPercentage,
  getShortPowerUpName as getShortPowerUpNameHelper,
} from "./utils/powerUpCard";
import { ProgressBar } from "./components/ProgressBar";
import { LoadingIndicator } from "./components/LoadingIndicator";

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

    const upgrades = useMemo(() => powerUp.upgrades ?? [], [powerUp.upgrades]);

    const maxLevel = useMemo(() => computeMaxLevel(upgrades), [upgrades]);

    const boundedCurrentLevel = useMemo(
      () => clampDisplayLevel(currentLevel, maxLevel),
      [currentLevel, maxLevel]
    );

    const nextLevel = useMemo(
      () => computeNextLevel(boundedCurrentLevel, maxLevel),
      [boundedCurrentLevel, maxLevel]
    );

    const currentUpgrade = useMemo(
      () => upgrades[boundedCurrentLevel - 1],
      [upgrades, boundedCurrentLevel]
    );

    const nextUpgrade = useMemo(
      () => upgrades[nextLevel - 1],
      [upgrades, nextLevel]
    );

    const isUnlockOnly = useMemo(
      () => Boolean(powerUp.requiresPurchase) || upgrades.length === 1,
      [powerUp.requiresPurchase, upgrades.length]
    );

    // Important: use the raw currentLevel to determine unlocked state for unlock-only power-ups
    // because clampDisplayLevel maps 0 -> 1 for display purposes.
    const isActuallyUnlocked = useMemo(
      () => (isUnlockOnly ? currentLevel >= 1 : boundedCurrentLevel >= 1),
      [isUnlockOnly, currentLevel, boundedCurrentLevel]
    );

    const isButtonDisabled = useMemo(() => {
      const disabledByState = isLoading || isBalanceLoading || !canAfford;
      // For unlock-only power-ups, hide/disable the button once unlocked (use raw level)
      if (isUnlockOnly && isActuallyUnlocked) return true;
      return disabledByState || isMaxLevel;
    }, [
      isLoading,
      isBalanceLoading,
      canAfford,
      isUnlockOnly,
      isActuallyUnlocked,
      isMaxLevel,
    ]);

    const progressPercentage = useMemo(() => {
      if (isUnlockOnly) {
        return isActuallyUnlocked ? 100 : 0;
      }
      return computeProgressPercentage(boundedCurrentLevel, maxLevel);
    }, [isUnlockOnly, isActuallyUnlocked, boundedCurrentLevel, maxLevel]);

    const upgradeDescription = useMemo(
      () =>
        buildUpgradeDescription(
          powerUp.type,
          currentUpgrade,
          nextUpgrade,
          t,
          isMaxLevel
        ),
      [powerUp.type, currentUpgrade, nextUpgrade, t, isMaxLevel]
    );

    const shortName = useMemo(
      () => getShortPowerUpNameHelper(powerUp.type, t),
      [powerUp.type, t]
    );

    return (
      <div className="glass-light rounded-xl p-5 border border-primary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mr-4 border border-primary/20 flex-shrink-0">
            <span className="text-2xl">{powerUp.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Text
                  variant="title"
                  size="lg"
                  className="text-foreground font-bold leading-tight"
                >
                  {shortName}
                </Text>
                {isUnlockOnly && isActuallyUnlocked ? (
                  <span className="hidden sm:inline-flex items-center text-[10px] uppercase tracking-wide text-emerald-700/80 bg-emerald-500/10 border border-emerald-600/30 px-1.5 py-0.5 rounded">
                    {t("features.powerUps.unlocked")}
                  </span>
                ) : null}
                {powerUp.stackable ? (
                  <span className="hidden sm:inline-flex items-center text-[10px] uppercase tracking-wide text-primary/80 border border-primary/30 px-1.5 py-0.5 rounded">
                    {t("features.powerUps.stackable")}
                  </span>
                ) : null}
              </div>
              {maxLevel > 1 ? (
                <div className="bg-primary/10 rounded-lg px-3 py-1 border border-primary/20 flex-shrink-0 ml-3">
                  <Text
                    variant="title"
                    size="sm"
                    className="text-primary font-bold"
                  >
                    {Math.max(1, Math.min(maxLevel, Number(currentLevel) || 1))}
                    /{maxLevel}
                  </Text>
                </div>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground">
              {t(`features.powerUps.description.${powerUp.type}`)}
            </div>
            {isUnlockOnly && isActuallyUnlocked ? (
              <span className="mt-2 inline-flex sm:hidden items-center text-[10px] uppercase tracking-wide text-emerald-700/80 bg-emerald-500/10 border border-emerald-600/30 px-1.5 py-0.5 rounded">
                {t("features.powerUps.unlocked")}
              </span>
            ) : null}
            {powerUp.stackable ? (
              <span className="mt-2 inline-flex sm:hidden items-center text-[10px] uppercase tracking-wide text-primary/80 border border-primary/30 px-1.5 py-0.5 rounded">
                {t("features.powerUps.stackable")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar percentage={progressPercentage} />

        {/* Current Stats - Simplified */}
        <div className="mb-4">
          <Text
            variant="subtitle"
            size="sm"
            className="text-muted-foreground font-medium"
          >
            {upgradeDescription}
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
              {!isUnlockOnly || !isActuallyUnlocked ? (
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
                    <LoadingIndicator
                      label={t("features.powerUps.upgrading")}
                    />
                  ) : isBalanceLoading ? (
                    <LoadingIndicator label={t("features.powerUps.loading")} />
                  ) : (
                    <span className="text-sm font-medium">
                      {isUnlockOnly
                        ? t("features.powerUps.unlock")
                        : `${t("features.powerUps.upgrade")} → ${t(
                            "features.powerUps.level"
                          )} ${nextLevel}`}
                    </span>
                  )}
                </Button>
              ) : (
                <div className="text-center bg-emerald-500/10 rounded-lg p-3 border border-emerald-600/20">
                  <span className="inline-flex items-center text-[12px] font-medium text-emerald-700">
                    {t("features.powerUps.unlocked")}
                  </span>
                </div>
              )}

              {/* Insufficient Rice Warning - Simplified */}
              {!isUnlockOnly &&
                !canAfford &&
                !isLoading &&
                !isBalanceLoading && (
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
            <div className="text-center bg-primary/5 rounded-lg p-3 border border-primary/10">
              <span className="inline-flex items-center text-[12px] font-medium text-primary/80">
                {t("features.powerUps.maxLevelReached")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PowerUpCard.displayName = "PowerUpCard";
