import React from "react";
import { DifficultyLevel } from "@/types/game";
import { GameLogic } from "@/utils/gameLogic";
import { Text } from "@/components/ui/Text";
import { useTranslations } from "@/hooks/useTranslations";

interface DifficultyIndicatorProps {
  difficultyLevel: DifficultyLevel;
}

export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficultyLevel,
}) => {
  const { t } = useTranslations();
  const levelName = t(
    `difficulty.${GameLogic.getDifficultyLevelName(difficultyLevel.level)}`
  );

  return (
    <div className="absolute top-5 right-5 bg-black/70 p-2 rounded-lg border-2 border-yellow-500 min-w-[120px]">
      <Text
        className="text-yellow-500 font-bold text-center m-0 text-xs"
        variant="bold"
        size="xs"
      >
        {t("features.gameplay.level")} {difficultyLevel.level}
      </Text>
      <Text
        className="text-white text-center mt-0.5 opacity-80 text-xs"
        variant="muted"
        size="xs"
      >
        {levelName}
      </Text>
      <div className="w-full h-1 bg-white/20 rounded mt-1.5 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded transition-all duration-300" />
      </div>
    </div>
  );
};
