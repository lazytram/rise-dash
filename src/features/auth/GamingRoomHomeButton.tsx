"use client";

import React from "react";
import { Button } from "@/shared/components/Button";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { useTranslations } from "@/shared/hooks/useTranslations";

export const GamingRoomHomeButton: React.FC = () => {
  const { setScene } = useSceneStore();
  const { t } = useTranslations();

  return (
    <Button
      onClick={() => setScene(SceneType.GAMING_ROOM)}
      variant="gradient"
      size="lg"
      className="animate-glow-pulse hover:scale-105 transition-all duration-300 opacity-85 hover:opacity-100"
    >
      {t("scenes.gamingRoom.title")}
    </Button>
  );
};
