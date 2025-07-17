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
    <div className="mt-6 text-center text-sm text-white/70 font-medium">
      {t("common.showing")}{" "}
      <span className="text-white/90 font-semibold">
        {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalEntries)}
      </span>{" "}
      {t("common.of")}{" "}
      <span className="text-white/90 font-semibold">{totalEntries}</span>{" "}
      {t("blockchain.bestScores")}
    </div>
  );
};
