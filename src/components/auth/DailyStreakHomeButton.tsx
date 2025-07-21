"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";
import { useTranslations } from "@/hooks/useTranslations";

export const DailyStreakHomeButton: React.FC = () => {
  const { setScene } = useSceneStore();
  const { t } = useTranslations();

  return (
    <Button
      onClick={() => setScene(SceneType.DAILY_STREAK)}
      variant="primary"
      className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-700 hover:to-indigo-700 border border-purple-400/30 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
    >
      <span className="text-2xl mr-3">🎴</span>
      {t("scenes.dailyStreak.title")}
    </Button>
  );
};
