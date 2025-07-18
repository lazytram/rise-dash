"use client";

import React, { useState, useEffect } from "react";
import { Player } from "@/types/game";
import { useTranslations } from "@/hooks/useTranslations";
import { POWERUP_UPGRADES } from "@/constants/powerUps";
import { PowerUpType } from "@/types/shop";

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

export const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = ({
  player,
}) => {
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

  const getPowerUpProgress = (endTime: number): number => {
    const totalDuration = 10000; // 10 seconds from constants
    const remaining = endTime - currentTime;
    const elapsed = totalDuration - remaining;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  // Get active power-ups in priority order
  const getActivePowerUps = (): ActivePowerUp[] => {
    const activePowerUps: ActivePowerUp[] = [];

    if (player.hasShield) {
      activePowerUps.push({
        type: PowerUpType.SHIELD,
        name: t("features.powerUps.shield"),
        icon: POWERUP_UPGRADES.shield.icon,
        color: "blue",
        endTime: player.powerUpEndTimes.shield,
      });
    }

    if (player.hasInfiniteAmmo) {
      activePowerUps.push({
        type: PowerUpType.INFINITE_AMMO,
        name: t("features.powerUps.infiniteAmmo"),
        icon: POWERUP_UPGRADES.infiniteAmmo.icon,
        color: "green",
        endTime: player.powerUpEndTimes.infiniteAmmo,
      });
    }

    if (player.hasSpeedBoost) {
      activePowerUps.push({
        type: PowerUpType.SPEED_BOOST,
        name: t("features.powerUps.speedBoost"),
        icon: POWERUP_UPGRADES.speedBoost.icon,
        color: "orange",
        endTime: player.powerUpEndTimes.speedBoost,
      });
    }

    if (player.hasMultiShot) {
      activePowerUps.push({
        type: PowerUpType.MULTI_SHOT,
        name: t("features.powerUps.multiShot"),
        icon: POWERUP_UPGRADES.multiShot.icon,
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
          bg: "bg-blue-900/40",
          border: "border-blue-400/60",
          text: "text-blue-200",
          progress: "bg-blue-400",
        };
      case "green":
        return {
          bg: "bg-green-900/40",
          border: "border-green-400/60",
          text: "text-green-200",
          progress: "bg-green-400",
        };
      case "orange":
        return {
          bg: "bg-orange-900/40",
          border: "border-orange-400/60",
          text: "text-orange-200",
          progress: "bg-orange-400",
        };
      case "purple":
        return {
          bg: "bg-purple-900/40",
          border: "border-purple-400/60",
          text: "text-purple-200",
          progress: "bg-purple-400",
        };
      default:
        return {
          bg: "bg-gray-900/40",
          border: "border-gray-400/60",
          text: "text-gray-200",
          progress: "bg-gray-400",
        };
    }
  };

  const activePowerUps = getActivePowerUps();

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-violet-800/30 backdrop-blur-sm border border-purple-400/30 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-16 sm:h-18 md:h-20 lg:h-22 flex flex-col justify-center shadow-lg">
      <h3 className="text-purple-100 font-semibold mb-2 text-center text-xs">
        {t("features.powerUps.title")}
      </h3>
      <div className="flex items-center justify-center h-8">
        {activePowerUps.length > 0 ? (
          activePowerUps.map((powerUp) => {
            const colors = getColorClasses(powerUp.color);
            const timeRemaining = calculatePowerUpTimeRemaining(
              powerUp.endTime
            );
            const progress = getPowerUpProgress(powerUp.endTime);

            return (
              <div
                key={powerUp.type}
                className={`flex items-center justify-between ${colors.bg} ${colors.border} rounded-lg p-1.5 w-full shadow-lg`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`${colors.text} text-xs`}>
                    {powerUp.icon}
                  </span>
                  <span className={`${colors.text} font-semibold text-xs`}>
                    {powerUp.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 bg-gray-800/50 rounded-full h-1.5 border border-gray-600/50">
                    <div
                      className={`${colors.progress} h-1.5 rounded-full transition-all duration-200 shadow-sm`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span
                    className={`${colors.text} text-xs font-mono min-w-[1.5rem] text-center`}
                  >
                    {timeRemaining}s
                  </span>
                </div>
              </div>
            );
          })[0] // Show only the first active power-up
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-purple-200/70 text-xs font-medium">
              {t("features.powerUps.noActive")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
