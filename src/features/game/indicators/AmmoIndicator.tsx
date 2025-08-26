"use client";

import React, { memo } from "react";
import { Player } from "@/shared/types/game";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface AmmoIndicatorProps {
  player: Player;
}

export const AmmoIndicator: React.FC<AmmoIndicatorProps> = memo(
  ({ player }) => {
    const { t } = useTranslations();

    return (
      <div className="glass-light backdrop-blur-sm border border-primary/20 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-22 md:h-24 lg:h-26 flex flex-col shadow-lg">
        <h3 className="text-primary font-semibold text-center text-xs mb-2 flex-shrink-0">
          {t("features.gameplay.ammoCount")}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2 w-full">
            <div className="flex-1 bg-primary/20 rounded-full h-2.5 border border-primary/30">
              <div
                className="bg-gradient-to-r from-primary to-primary-hover h-2.5 rounded-full transition-all duration-200 shadow-sm"
                style={{
                  width: `${
                    (player.riceRocketAmmo / player.maxRiceRocketAmmo) * 100
                  }%`,
                }}
              />
            </div>
            <span className="text-primary text-xs font-mono min-w-[2rem] text-center">
              {player.riceRocketAmmo}/{player.maxRiceRocketAmmo}
            </span>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if ammo-related properties have changed
    const prevPlayer = prevProps.player;
    const nextPlayer = nextProps.player;

    return (
      prevPlayer.riceRocketAmmo === nextPlayer.riceRocketAmmo &&
      prevPlayer.maxRiceRocketAmmo === nextPlayer.maxRiceRocketAmmo
    );
  }
);

AmmoIndicator.displayName = "AmmoIndicator";
