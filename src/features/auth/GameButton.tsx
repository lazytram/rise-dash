"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { CircularButton } from "@/shared/components/CircularButton";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { memo } from "react";

export const GameButton = memo(function GameButton() {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.GAME);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🎮</span>}
      tooltip={t("common.playNow")}
      gradientFrom="#4ade80"
      gradientTo="#16a34a"
    />
  );
});
