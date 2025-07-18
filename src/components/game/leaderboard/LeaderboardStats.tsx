import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";

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
    <div className="mt-6 text-center">
      <Text variant="subtitle" className="text-white">
        {t("scenes.leaderboard.bestScores")}
      </Text>
      {t("common.showing")}{" "}
      <span className="text-white/90 font-semibold">{currentPage}</span>{" "}
      {t("common.of")}{" "}
      <span className="text-white/90 font-semibold">{totalPages}</span>{" "}
      <span className="text-white/70">
        ({totalScores} {t("scenes.leaderboard.bestScores")})
      </span>
    </div>
  );
};
