import React from "react";
import { Player } from "@/types/game";
import { Text } from "@/components/ui/Text";
import { useTranslations } from "@/hooks/useTranslations";
import { GAME_CONSTANTS } from "@/constants/game";

interface AmmoIndicatorProps {
  player: Player;
}

export const AmmoIndicator: React.FC<AmmoIndicatorProps> = ({ player }) => {
  const { t } = useTranslations();

  // Calculate recharge progress for the next ammo
  const currentTime = Date.now();
  const timeSinceLastRecharge = currentTime - player.lastAmmoRechargeTime;
  const rechargeProgress = Math.min(
    timeSinceLastRecharge / GAME_CONSTANTS.AMMO_RECHARGE_INTERVAL,
    1
  );
  const isRecharging = player.riceRocketAmmo < player.maxRiceRocketAmmo;

  // Determine if infinite ammo is active
  const isInfiniteAmmo = player.hasInfiniteAmmo;

  return (
    <div className="absolute top-5 left-5 bg-black/70 p-2 rounded-lg border-2 border-orange-500 min-w-[120px]">
      <Text variant="caption" className="text-white/60">
        {t("features.gameplay.riceRockets")}
      </Text>

      {isInfiniteAmmo ? (
        <Text variant="caption" className="text-white/60">
          {t("features.gameplay.infiniteAmmoActive")}
        </Text>
      ) : (
        <Text
          className="text-white text-center mt-0.5 opacity-80 text-xs"
          variant="muted"
          size="xs"
        >
          {player.riceRocketAmmo}/{player.maxRiceRocketAmmo}
        </Text>
      )}

      {/* Ammo bar */}
      <div className="w-full h-1 bg-white/20 rounded mt-1.5 overflow-hidden">
        {isInfiniteAmmo ? (
          <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-400 rounded transition-all duration-300" />
        ) : (
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded transition-all duration-300"
            style={{
              width: `${
                (player.riceRocketAmmo / player.maxRiceRocketAmmo) * 100
              }%`,
            }}
          />
        )}
      </div>

      {/* Recharge indicator */}
      {isRecharging && !isInfiniteAmmo && (
        <div className="w-full h-1 bg-white/20 rounded mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded transition-all duration-300"
            style={{ width: `${rechargeProgress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
