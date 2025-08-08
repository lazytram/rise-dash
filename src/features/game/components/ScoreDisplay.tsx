import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { ScoreCard } from "./ScoreCard";

interface ScoreDisplayProps {
  distance: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ distance }) => {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ScoreCard
        distance={distance}
        title={t("features.gameplay.currentScore")}
        variant="default"
      />

      {/* Status indicator */}
      <div className="mt-auto text-center">
        <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#7967e5]/10 rounded-full border border-[#7967e5]/20 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-[#99eafc] rounded-full animate-pulse"></div>
          <Text
            variant="body"
            className="text-[#99eafc]/70 font-medium text-xs sm:text-sm tracking-wide"
          >
            {t("features.gameplay.readyToSave")}
          </Text>
        </div>
      </div>
    </div>
  );
};
