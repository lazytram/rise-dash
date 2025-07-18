"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";
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
