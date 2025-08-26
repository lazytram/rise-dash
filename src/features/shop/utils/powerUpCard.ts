import {
  PowerUpType,
  PowerUpUpgrade,
  PowerUpUpgradeData,
} from "@/shared/types/powerUps";

export type TranslateFn = (key: string) => string;

export const computeMaxLevel = (upgrades: PowerUpUpgradeData["upgrades"]) =>
  Math.max(1, upgrades?.length || 1);

export const clampDisplayLevel = (level: number, maxLevel: number) =>
  Math.min(maxLevel, Math.max(1, Number(level) || 1));

export const computeNextLevel = (currentLevel: number, maxLevel: number) =>
  Math.min(maxLevel, currentLevel + 1);

export const computeProgressPercentage = (
  currentLevel: number,
  maxLevel: number
) => {
  const denominator = Math.max(1, maxLevel - 1);
  const percentage = ((currentLevel - 1) / denominator) * 100;
  return isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
};

export const buildUpgradeDescription = (
  type: PowerUpType,
  currentUpgrade: PowerUpUpgrade | undefined,
  nextUpgrade: PowerUpUpgrade | undefined,
  t: TranslateFn,
  isMaxLevel: boolean
) => {
  if (isMaxLevel) {
    return t("features.powerUps.maxLevelReached");
  }

  if (!currentUpgrade || !nextUpgrade) {
    return "";
  }

  switch (type) {
    case PowerUpType.RICE_ROCKET_AMMO:
      return `${currentUpgrade.ammoCount || 0} → ${nextUpgrade?.ammoCount || 0} ${t(
        "features.powerUps.ammo"
      )}`;
    case PowerUpType.SHIELD:
    case PowerUpType.INFINITE_AMMO:
      return `${(currentUpgrade.duration || 0) / 1000}s → ${
        (nextUpgrade?.duration || 0) / 1000
      }s ${t("features.powerUps.duration")}`;
    case PowerUpType.JUMP_BOOST: {
      const currentJump = (
        ((currentUpgrade.jumpMultiplier || 1) - 1) *
        100
      ).toFixed(0);
      const nextJump = (((nextUpgrade?.jumpMultiplier || 1) - 1) * 100).toFixed(
        0
      );
      return `${(currentUpgrade.duration || 0) / 1000}s, +${currentJump}% → +${nextJump}%`;
    }
    case PowerUpType.SLOW_MOTION: {
      const currentSlow = (
        (1 - (currentUpgrade.slowMultiplier || 1)) *
        100
      ).toFixed(0);
      const nextSlow = ((1 - (nextUpgrade?.slowMultiplier || 1)) * 100).toFixed(
        0
      );
      return `${(currentUpgrade.duration || 0) / 1000}s, -${currentSlow}% → -${nextSlow}%`;
    }
    case PowerUpType.MULTI_SHOT:
      return `${(currentUpgrade.duration || 0) / 1000}s, ${
        currentUpgrade.projectileCount || 0
      } → ${nextUpgrade?.projectileCount || 0} ${t(
        "features.powerUps.projectiles"
      )}`;
    default:
      return "";
  }
};

export const getShortPowerUpName = (type: string, t: TranslateFn) =>
  t(`features.powerUps.shortNames.${type}`);
