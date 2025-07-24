"use client";

import { memo } from "react";
import { DailyRevealContent } from "./DailyRevealContent";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const DailyRevealScene = memo(function DailyRevealScene() {
  return (
    <SceneContainer>
      <DailyRevealContent />
    </SceneContainer>
  );
});
