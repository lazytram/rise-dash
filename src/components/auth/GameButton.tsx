"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { memo } from "react";

export const GameButton = memo(function GameButton() {
  const { t } = useTranslations();
  const { navigateTo } = useSceneStore();

  const handleClick = () => {
    navigateTo("game");
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🎮</span>}
      tooltip={t("game.title")}
      gradientFrom="#4ade80"
      gradientTo="#16a34a"
    />
  );
});
