"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { memo } from "react";

export const LeaderboardButton = memo(function LeaderboardButton() {
  const { t } = useTranslations();
  const { navigateTo } = useSceneStore();

  const handleClick = () => {
    navigateTo("leaderboard");
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🏆</span>}
      tooltip={t("blockchain.leaderboard")}
      gradientFrom="#fbbf24"
      gradientTo="#d97706"
    />
  );
});
