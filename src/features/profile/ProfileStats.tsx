import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { StatsCard } from "@/shared/components/StatsCard";

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

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
      {/* Best Score Card */}
      <StatsCard
        title={t("scenes.profile.bestScore")}
        value={formatNumber(getBestScore())}
        subtitle={t("features.gameplay.meters")}
        icon="🏆"
        variant="gradient"
        className="animate-fade-in-up animation-delay-100"
      />

      {/* Total Games Card */}
      <StatsCard
        title={t("scenes.profile.totalGames")}
        value={formatNumber(getTotalGames())}
        subtitle={t("scenes.profile.gamesPlayed")}
        icon="🎮"
        variant="glass"
        className="animate-fade-in-up animation-delay-200"
      />

      {/* Average Score Card */}
      <StatsCard
        title={t("scenes.profile.averageScore")}
        value={formatNumber(getAverageScore())}
        subtitle={t("features.gameplay.meters")}
        icon="📊"
        variant="glass"
        className="animate-fade-in-up animation-delay-300"
      />
    </div>
  );
};
