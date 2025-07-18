"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SceneType } from "@/types/scenes";

export const LeaderboardHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.leaderboard.title")}
      subtitle={t("scenes.leaderboard.subtitle")}
      menuColorKey={SceneType.LEADERBOARD}
    />
  );
};
