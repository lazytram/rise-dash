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
    <div className="flex flex-col items-center w-full h-full space-y-4 sm:space-y-6">
      {/* Title Section */}
      <div className="text-center">
        <Text
          variant="subtitle"
          size="lg"
          className="text-gray-900 font-bold tracking-wider uppercase text-sm sm:text-base"
        >
          {t("features.gameplay.currentScore")}
        </Text>
      </div>

      {/* Score Card */}
      <div className="flex items-center justify-center w-full">
        <ScoreCard distance={distance} title="" variant="default" />
      </div>
    </div>
  );
};
