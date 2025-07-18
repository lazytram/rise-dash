"use client";

import React from "react";
import { DifficultyLevel } from "@/types/game";
import { useTranslations } from "@/hooks/useTranslations";

interface DifficultyIndicatorProps {
  difficultyLevel: DifficultyLevel;
}

export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficultyLevel,
}) => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-orange-900/20 to-amber-800/30 backdrop-blur-sm border border-orange-400/30 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-16 sm:h-18 md:h-20 lg:h-22 flex flex-col justify-center shadow-lg">
      <h3 className="text-orange-100 font-semibold mb-2 text-center text-xs">
        {t("features.gameplay.difficulty")}
      </h3>
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-orange-50 text-xs">
            {t("features.gameplay.level")}
          </span>
          <span className="text-yellow-300 font-semibold text-xs">
            {difficultyLevel.level}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-orange-50 text-xs">
            {t("features.gameplay.speed")}
          </span>
          <span className="text-emerald-300 font-semibold text-xs">
            {difficultyLevel.speedMultiplier.toFixed(1)}x
          </span>
        </div>
      </div>
    </div>
  );
};
