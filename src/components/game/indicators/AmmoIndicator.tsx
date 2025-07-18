"use client";

import React from "react";
import { Player } from "@/types/game";
import { useTranslations } from "@/hooks/useTranslations";

interface AmmoIndicatorProps {
  player: Player;
}

export const AmmoIndicator: React.FC<AmmoIndicatorProps> = ({ player }) => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-16 sm:h-18 md:h-20 lg:h-22 flex flex-col justify-center shadow-lg">
      <h3 className="text-blue-100 font-semibold mb-2 text-center text-xs">
        {t("features.gameplay.ammoCount")}
      </h3>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-blue-950/40 rounded-full h-2.5 border border-blue-300/30">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-200 shadow-sm"
            style={{
              width: `${
                (player.riceRocketAmmo / player.maxRiceRocketAmmo) * 100
              }%`,
            }}
          />
        </div>
        <span className="text-cyan-100 text-xs font-mono min-w-[2rem] text-center">
          {player.riceRocketAmmo}/{player.maxRiceRocketAmmo}
        </span>
      </div>
    </div>
  );
};
