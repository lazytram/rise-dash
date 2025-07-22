"use client";

import { memo } from "react";
import { DailyStreakContent } from "@/components/game/dailyStreak";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const DailyStreakScene = memo(function DailyStreakScene() {
  return (
    <SceneContainer>
      <DailyStreakContent />
    </SceneContainer>
  );
});
