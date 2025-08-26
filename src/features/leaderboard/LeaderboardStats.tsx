import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { AnimatedContainer } from "@/shared/components/AnimatedContainer";

interface LeaderboardStatsProps {
  currentPage: number;
  totalPages: number;
  totalScores: number;
}

export const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({
  currentPage,
  totalPages,
  totalScores,
}) => {
  const { t } = useTranslations();

  return (
    <AnimatedContainer animation="fadeIn" delay={800}>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <Text variant="caption" className="text-gray-700 font-medium">
            {t("common.showing")}{" "}
            <span className="text-gray-900 font-semibold">{currentPage}</span>{" "}
            {t("common.of")}{" "}
            <span className="text-gray-900 font-semibold">{totalPages}</span>{" "}
            <span className="text-gray-700">
              ({totalScores} {t("scenes.leaderboard.bestScores")})
            </span>
          </Text>
        </div>
      </div>
    </AnimatedContainer>
  );
};
