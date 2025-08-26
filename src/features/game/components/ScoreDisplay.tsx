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
    <div className="flex flex-col items-center w-full h-full space-y-6">
      {/* Title Section */}
      <div className="text-center">
        <Text
          variant="subtitle"
          size="lg"
          className="text-gray-900 font-bold tracking-wider uppercase text-sm sm:text-base"
        >
          {t("features.gameplay.currentScore")}
        </Text>
        <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-[#7967e5] to-[#99eafc] mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Score Card */}
      <div className="flex-1 flex items-center justify-center w-full">
        <ScoreCard
          distance={distance}
          title=""
          variant="default"
        />
      </div>

      {/* Status indicator */}
      <div className="w-full text-center">
        <div className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#7967e5]/15 rounded-full border border-[#7967e5]/40 backdrop-blur-sm shadow-md">
          <div className="w-1.5 h-1.5 bg-[#7967e5] rounded-full animate-pulse shadow-sm"></div>
          <Text
            variant="body"
            className="text-[#7967e5] font-bold text-sm sm:text-base tracking-wide"
          >
            {t("features.gameplay.readyToSave")}
          </Text>
        </div>
      </div>
    </div>
  );
};
