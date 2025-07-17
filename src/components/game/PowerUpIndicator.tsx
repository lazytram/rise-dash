"use client";

import { Player } from "@/types/game";
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect, useState } from "react";

interface PowerUpIndicatorProps {
  player: Player;
}

interface PowerUpStatus {
  type: string;
  name: string;
  icon: string;
  remainingTime: number;
  isActive: boolean;
}

export const PowerUpIndicator = ({ player }: PowerUpIndicatorProps) => {
  const { t } = useTranslations();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPowerUpStatus = (): PowerUpStatus[] => {
    const powerUps: PowerUpStatus[] = [
      {
        type: "shield",
        name: t("powerUps.shield"),
        icon: "🛡️",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.shield - currentTime) / 1000)
        ),
        isActive: player.hasShield,
      },
      {
        type: "infinite_ammo",
        name: t("powerUps.infiniteAmmo"),
        icon: "∞",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.infiniteAmmo - currentTime) / 1000)
        ),
        isActive: player.hasInfiniteAmmo,
      },
      {
        type: "speed_boost",
        name: t("powerUps.speedBoost"),
        icon: "⚡",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.speedBoost - currentTime) / 1000)
        ),
        isActive: player.hasSpeedBoost,
      },
      {
        type: "multi_shot",
        name: t("powerUps.multiShot"),
        icon: "3",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.multiShot - currentTime) / 1000)
        ),
        isActive: player.hasMultiShot,
      },
    ];

    return powerUps.filter((powerUp) => powerUp.isActive);
  };

  const activePowerUps = getPowerUpStatus();

  // Add visual feedback when power-up is about to expire
  const getPowerUpStyle = (powerUp: PowerUpStatus) => {
    const isExpiringSoon = powerUp.remainingTime <= 3;
    return {
      borderColor: isExpiringSoon
        ? "rgb(239, 68, 68)"
        : "rgba(255, 255, 255, 0.2)",
      animation: isExpiringSoon ? "pulse 1s infinite" : "none",
    };
  };

  if (activePowerUps.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      {activePowerUps.map((powerUp) => (
        <div
          key={powerUp.type}
          className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white border"
          style={getPowerUpStyle(powerUp)}
        >
          <div className="text-lg">{powerUp.icon}</div>
          <div className="flex flex-col">
            <div className="text-xs font-medium">{powerUp.name}</div>
            <div className="text-xs text-gray-300">
              {powerUp.remainingTime}s {t("powerUps.remaining")}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000"
              style={{
                width: `${Math.max(0, (powerUp.remainingTime / 10) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
