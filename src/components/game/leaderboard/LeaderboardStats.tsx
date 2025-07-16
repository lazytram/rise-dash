import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface LeaderboardStatsProps {
  currentPage: number;
  totalEntries: number;
  itemsPerPage: number;
}

export const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({
  currentPage,
  totalEntries,
  itemsPerPage,
}) => {
  const { t } = useTranslations();

  return (
    <div className="mt-4 text-center text-sm text-gray-500">
      {t("common.showing")} {(currentPage - 1) * itemsPerPage + 1} -{" "}
      {Math.min(currentPage * itemsPerPage, totalEntries)} {t("common.of")}{" "}
      {totalEntries} {t("blockchain.bestScores")}
    </div>
  );
};
