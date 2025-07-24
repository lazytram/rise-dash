"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const EmptyLeaderboard: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🏆</div>
      <Text variant="subtitle" className="text-white mb-2">
        {t("scenes.leaderboard.noScoresYet")}
      </Text>
      <p className="text-gray-600 mb-6">
        {t("scenes.leaderboard.playToEarnScores")}
      </p>
      <div className="text-sm text-gray-500">
        {t("scenes.leaderboard.scoresOnBlockchain")}
      </div>
    </div>
  );
};
