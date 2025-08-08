"use client";

import React from "react";
import { Button } from "@/shared/components/Button";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { useTranslations } from "@/shared/hooks/useTranslations";

export const DailyRevealHomeButton: React.FC = () => {
  const { setScene } = useSceneStore();
  const { t } = useTranslations();

  return (
    <Button
      onClick={() => setScene(SceneType.DAILY_REVEAL)}
      variant="gradient"
      size="lg"
      className="animate-glow-pulse hover:scale-105 transition-all duration-300 opacity-85 hover:opacity-100"
    >
      {t("scenes.dailyReveal.title")}
    </Button>
  );
};
