"use client";

import React, { memo } from "react";
import { DifficultyLevel } from "@/shared/types/game";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface DifficultyIndicatorProps {
  difficultyLevel: DifficultyLevel;
}

export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = memo(
  ({ difficultyLevel }) => {
    const { t } = useTranslations();

    return (
      <div className="bg-gradient-to-br from-[#7967e5]/20 to-[#99eafc]/20 backdrop-blur-sm border border-[#7967e5]/30 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-22 md:h-24 lg:h-26 flex flex-col shadow-lg">
        <h3 className="text-[#99eafc] font-semibold text-center text-xs mb-2 flex-shrink-0">
          {t("features.gameplay.difficulty")}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col space-y-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-[#99eafc]/80 text-xs">
                {t("features.gameplay.level")}
              </span>
              <span className="text-[#99eafc] font-semibold text-xs">
                {difficultyLevel.level}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#99eafc]/80 text-xs">
                {t("features.gameplay.speed")}
              </span>
              <span className="text-[#99eafc] font-semibold text-xs">
                {difficultyLevel.speedMultiplier.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if difficulty-related properties have changed
    const prevDifficulty = prevProps.difficultyLevel;
    const nextDifficulty = nextProps.difficultyLevel;

    return (
      prevDifficulty.level === nextDifficulty.level &&
      prevDifficulty.speedMultiplier === nextDifficulty.speedMultiplier
    );
  }
);

DifficultyIndicator.displayName = "DifficultyIndicator";
