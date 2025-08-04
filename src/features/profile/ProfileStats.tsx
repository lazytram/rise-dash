import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Best Score Card */}
      <Card
        variant="gradient-purple"
        className="relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <Text variant="muted" size="sm" className="text-white/80">
                {t("scenes.profile.bestScore")}
              </Text>
            </div>
          </div>

          <div className="space-y-1">
            <Text variant="bold" size="3xl" className="text-white">
              {formatNumber(getBestScore())}
            </Text>
            <Text variant="muted" size="sm" className="text-white/70">
              {t("features.gameplay.meters")}
            </Text>
          </div>
        </div>
      </Card>

      {/* Total Games Card */}
      <Card
        variant="gradient-blue"
        className="relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <Text variant="muted" size="sm" className="text-white/80">
                {t("scenes.profile.totalGames")}
              </Text>
            </div>
          </div>

          <div className="space-y-1">
            <Text variant="bold" size="3xl" className="text-white">
              {formatNumber(getTotalGames())}
            </Text>
            <Text variant="muted" size="sm" className="text-white/70">
              {t("scenes.profile.gamesPlayed")}
            </Text>
          </div>
        </div>
      </Card>

      {/* Average Score Card */}
      <Card
        variant="gradient-green"
        className="relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <Text variant="muted" size="sm" className="text-white/80">
                {t("scenes.profile.averageScore")}
              </Text>
            </div>
          </div>

          <div className="space-y-1">
            <Text variant="bold" size="3xl" className="text-white">
              {formatNumber(getAverageScore())}
            </Text>
            <Text variant="muted" size="sm" className="text-white/70">
              {t("features.gameplay.meters")}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};
