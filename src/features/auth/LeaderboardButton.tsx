"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { CircularButton } from "@/shared/components/CircularButton";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { memo } from "react";

export const LeaderboardButton = memo(function LeaderboardButton() {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.LEADERBOARD);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🏆</span>}
      tooltip={t("scenes.leaderboard.title")}
      gradientFrom="#fbbf24"
      gradientTo="#f59e0b"
    />
  );
});
