"use client";

import React from "react";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";

export const DailyStreakButton: React.FC = () => {
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.DAILY_STREAK);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">🎴</span>}
      tooltip="Daily Reveal"
      gradientFrom="#8b5cf6"
      gradientTo="#7c3aed"
    />
  );
};
