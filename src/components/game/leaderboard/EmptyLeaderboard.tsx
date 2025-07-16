import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";

export const EmptyLeaderboard: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🏆</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {t("blockchain.noScoresYet")}
      </h3>
      <p className="text-gray-600 mb-6">{t("blockchain.playToEarnScores")}</p>
      <Button variant="primary" onClick={() => (window.location.href = "/")}>
        {t("common.playNow")}
      </Button>
    </div>
  );
};
