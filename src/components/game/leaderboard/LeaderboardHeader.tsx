import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SCENE_COLORS } from "@/constants/colors";

export const LeaderboardHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("blockchain.leaderboard")}
      subtitle={t("blockchain.leaderboardSubtitle")}
      gradientFrom={SCENE_COLORS.LEADERBOARD.GRADIENT_FROM}
      gradientVia={SCENE_COLORS.LEADERBOARD.GRADIENT_VIA}
      gradientTo={SCENE_COLORS.LEADERBOARD.GRADIENT_TO}
    />
  );
};
