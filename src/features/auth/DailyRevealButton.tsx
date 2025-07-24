"use client";

import React from "react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { CircularButton } from "@/shared/components/CircularButton";

export const DailyRevealButton: React.FC = () => {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.DAILY_REVEAL);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🎴</span>}
      tooltip={t("scenes.dailyReveal.title")}
      gradientFrom="#8b5cf6"
      gradientTo="#7c3aed"
    />
  );
};
