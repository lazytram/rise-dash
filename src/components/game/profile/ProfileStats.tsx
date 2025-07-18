import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

interface ProfileStatsProps {
  playerScores: PlayerScore[];
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ playerScores }) => {
  const { t } = useTranslations();

  const getBestScore = () => {
    if (playerScores.length === 0) return 0;
    return Number(playerScores[0].score);
  };

  const getTotalGames = () => {
    return playerScores.length;
  };

  const getAverageScore = () => {
    if (playerScores.length === 0) return 0;
    return Math.round(
      playerScores.reduce((acc, score) => acc + Number(score.score), 0) /
        playerScores.length
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card variant="gradient-purple">
        <h3 className="text-sm font-medium opacity-90">
          {t("scenes.profile.bestScore")}
        </h3>
        <Text variant="bold" size="2xl">
          {getBestScore()} {t("features.gameplay.meters")}
        </Text>
      </Card>
      <Card variant="gradient-blue">
        <h3 className="text-sm font-medium opacity-90">
          {t("scenes.profile.totalGames")}
        </h3>
        <Text variant="bold" size="2xl">
          {getTotalGames()}
        </Text>
      </Card>
      <Card variant="gradient-green">
        <h3 className="text-sm font-medium opacity-90">
          {t("scenes.profile.averageScore")}
        </h3>
        <Text variant="bold" size="2xl">
          {getAverageScore()} {t("features.gameplay.meters")}
        </Text>
      </Card>
    </div>
  );
};
