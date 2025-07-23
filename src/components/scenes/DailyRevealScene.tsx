"use client";

import { memo } from "react";
import { DailyRevealContent } from "@/components/game/dailyReveal";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const DailyRevealScene = memo(function DailyRevealScene() {
  return (
    <SceneContainer>
      <DailyRevealContent />
    </SceneContainer>
  );
});
