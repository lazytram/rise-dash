"use client";

import React, { useState, useEffect, memo } from "react";
import { Player } from "@/shared/types/game";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { PowerUpType } from "@/shared/types/powerUps";

interface PowerUpIndicatorProps {
  player: Player;
}

interface ActivePowerUp {
  type: PowerUpType;
  name: string;
  icon: string;
  color: string;
  endTime: number;
}

export const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = memo(
  ({ player }) => {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const { t } = useTranslations();

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100);

      return () => {
        clearInterval(intervalId);
      };
    }, []);

    const calculatePowerUpTimeRemaining = (endTime: number): number => {
      const remaining = endTime - currentTime;
      return Math.max(0, Math.ceil(remaining / 1000));
    };

    const getPowerUpProgress = (powerUp: ActivePowerUp): number => {
      // Get the power-up level from player
      const powerUpLevel = player.powerUpLevels[powerUp.type] || 1;

      // Get the duration from constants based on level
      const powerUpData = POWERUP_UPGRADES[powerUp.type];
      const upgradeData = powerUpData.upgrades.find(
        (upgrade) => upgrade.level === powerUpLevel
      );
      const totalDuration = upgradeData?.duration || 10000; // Fallback to 10s

      // Calculate start time based on actual duration
      const startTime = powerUp.endTime - totalDuration;
      const elapsed = currentTime - startTime;

      return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    };

    // Get active power-ups in priority order
    const getActivePowerUps = (): ActivePowerUp[] => {
      const activePowerUps: ActivePowerUp[] = [];

      if (player.hasShield) {
        activePowerUps.push({
          type: PowerUpType.SHIELD,
          name: t("features.powerUps.shield"),
          icon: POWERUP_UPGRADES[PowerUpType.SHIELD].icon,
          color: "blue",
          endTime: player.powerUpEndTimes.shield,
        });
      }

      if (player.hasInfiniteAmmo) {
        activePowerUps.push({
          type: PowerUpType.INFINITE_AMMO,
          name: t("features.powerUps.infinite_ammo"),
          icon: POWERUP_UPGRADES[PowerUpType.INFINITE_AMMO].icon,
          color: "green",
          endTime: player.powerUpEndTimes.infiniteAmmo,
        });
      }

      if (player.hasJumpBoost) {
        activePowerUps.push({
          type: PowerUpType.JUMP_BOOST,
          name: t("features.powerUps.jump_boost"),
          icon: POWERUP_UPGRADES[PowerUpType.JUMP_BOOST].icon,
          color: "purple",
          endTime: player.powerUpEndTimes.jumpBoost,
        });
      }

      if (player.hasSlowMotion) {
        activePowerUps.push({
          type: PowerUpType.SLOW_MOTION,
          name: t("features.powerUps.slow_motion"),
          icon: POWERUP_UPGRADES[PowerUpType.SLOW_MOTION].icon,
          color: "blue",
          endTime: player.powerUpEndTimes.slowMotion,
        });
      }

      if (player.hasMultiShot) {
        activePowerUps.push({
          type: PowerUpType.MULTI_SHOT,
          name: t("features.powerUps.multi_shot"),
          icon: POWERUP_UPGRADES[PowerUpType.MULTI_SHOT].icon,
          color: "purple",
          endTime: player.powerUpEndTimes.multiShot,
        });
      }

      return activePowerUps;
    };

    const getColorClasses = (color: string) => {
      switch (color) {
        case "blue":
          return {
            bg: "bg-primary/20",
            border: "border-primary/40",
            text: "text-primary",
            progress: "bg-gradient-to-r from-primary to-primary-hover",
          };
        case "green":
          // Use explicit lime green colors for Infinite Ammo without relying on theme tokens
          // #32CD32 (lime green) with lighter variant for gradient
          return {
            bg: "bg-[rgba(50,205,50,0.20)]",
            border: "border-[rgba(50,205,50,0.40)]",
            text: "text-[#32CD32]",
            progress: "bg-[linear-gradient(to_right,#32CD32,#90EE90)]",
          };
        case "orange":
          return {
            bg: "bg-warning/20",
            border: "border-warning/40",
            text: "text-warning",
            progress: "bg-gradient-to-r from-warning to-warning-light",
          };
        case "purple":
          return {
            bg: "bg-primary/20",
            border: "border-primary/40",
            text: "text-primary",
            progress: "bg-gradient-to-r from-primary to-primary-hover",
          };
        default:
          return {
            bg: "bg-primary/20",
            border: "border-primary/40",
            text: "text-primary",
            progress: "bg-gradient-to-r from-primary to-primary-hover",
          };
      }
    };

    const activePowerUps = getActivePowerUps();

    return (
      <div className="glass-light backdrop-blur-sm border border-primary/20 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-22 md:h-24 lg:h-26 flex flex-col shadow-lg">
        <h3 className="text-primary font-semibold text-center text-xs mb-2 flex-shrink-0">
          {t("features.powerUps.title")}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          {activePowerUps.length > 0 ? (
            activePowerUps.map((powerUp) => {
              const colors = getColorClasses(powerUp.color);
              const timeRemaining = calculatePowerUpTimeRemaining(
                powerUp.endTime
              );
              const progress = getPowerUpProgress(powerUp);

              return (
                <div
                  key={powerUp.type}
                  className={`flex flex-col space-y-1.5 ${colors.bg} ${colors.border} rounded-lg p-2 w-full shadow-lg backdrop-blur-sm`}
                >
                  {/* Header with icon and name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`${colors.text} text-sm flex-shrink-0`}>
                        {powerUp.icon}
                      </span>
                      <span className={`${colors.text} font-semibold text-xs`}>
                        {powerUp.name}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar with time */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-full bg-muted/50 rounded-full h-3 border border-muted-foreground/30 overflow-hidden">
                      <div
                        className={`${colors.progress} h-3 rounded-full transition-all duration-300 ease-out shadow-sm`}
                        style={{ width: `${progress}%` }}
                      />
                      {/* Time overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`${colors.text} text-xs font-mono font-bold drop-shadow-sm`}
                        >
                          {timeRemaining}s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })[0] // Show only the first active power-up
          ) : (
            <div className="flex items-center justify-center w-full">
              <span className="text-muted-foreground text-xs font-medium">
                {t("features.powerUps.noActive")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if power-up related properties have changed
    const prevPlayer = prevProps.player;
    const nextPlayer = nextProps.player;

    return (
      prevPlayer.hasShield === nextPlayer.hasShield &&
      prevPlayer.hasInfiniteAmmo === nextPlayer.hasInfiniteAmmo &&
      prevPlayer.hasJumpBoost === nextPlayer.hasJumpBoost &&
      prevPlayer.hasSlowMotion === nextPlayer.hasSlowMotion &&
      prevPlayer.hasMultiShot === nextPlayer.hasMultiShot &&
      prevPlayer.powerUpEndTimes.shield === nextPlayer.powerUpEndTimes.shield &&
      prevPlayer.powerUpEndTimes.infiniteAmmo ===
        nextPlayer.powerUpEndTimes.infiniteAmmo &&
      prevPlayer.powerUpEndTimes.jumpBoost ===
        nextPlayer.powerUpEndTimes.jumpBoost &&
      prevPlayer.powerUpEndTimes.slowMotion ===
        nextPlayer.powerUpEndTimes.slowMotion &&
      prevPlayer.powerUpEndTimes.multiShot ===
        nextPlayer.powerUpEndTimes.multiShot
    );
  }
);

PowerUpIndicator.displayName = "PowerUpIndicator";
