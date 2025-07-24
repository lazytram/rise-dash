"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { SceneHeader } from "@/shared/components/SceneHeader";

export const LeaderboardHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.leaderboard.title")}
      subtitle={t("scenes.leaderboard.subtitle")}
    />
  );
};
