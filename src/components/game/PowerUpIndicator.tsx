"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { useEffect, useState } from "react";
import { Player } from "@/types/game";

interface PowerUpIndicatorProps {
  player: Player;
}

interface PowerUp {
  type: string;
  name: string;
  icon: string;
  remainingTime: number;
}

export const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = ({
  player,
}) => {
  const { t } = useTranslations();
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);

  useEffect(() => {
    const powerUps: PowerUp[] = [];

    if (player.hasShield) {
      powerUps.push({
        type: "shield",
        name: t("features.powerUps.shield"),
        icon: "🛡️",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.shield - Date.now()) / 1000)
        ),
      });
    }

    if (player.hasInfiniteAmmo) {
      powerUps.push({
        type: "infinite_ammo",
        name: t("features.powerUps.infiniteAmmo"),
        icon: "∞",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.infiniteAmmo - Date.now()) / 1000)
        ),
      });
    }

    if (player.hasSpeedBoost) {
      powerUps.push({
        type: "speed_boost",
        name: t("features.powerUps.speedBoost"),
        icon: "⚡",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.speedBoost - Date.now()) / 1000)
        ),
      });
    }

    if (player.hasMultiShot) {
      powerUps.push({
        type: "multi_shot",
        name: t("features.powerUps.multiShot"),
        icon: "3",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.multiShot - Date.now()) / 1000)
        ),
      });
    }

    setActivePowerUps(powerUps);
  }, [player, t]);

  if (activePowerUps.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {activePowerUps.map((powerUp, index) => (
        <div
          key={`${powerUp.type}-${index}`}
          className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm"
        >
          {/* Icon */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
            <span className="text-lg">{powerUp.icon}</span>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="text-xs font-medium">{powerUp.name}</div>
            <div className="text-xs text-gray-300">
              {powerUp.remainingTime}s {t("features.powerUps.remaining")}
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex-1 ml-2">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(0, (powerUp.remainingTime / 10) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
