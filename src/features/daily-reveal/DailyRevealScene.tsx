"use client";

import { memo } from "react";
import { DailyRevealContent } from "./DailyRevealContent";
import { Scene } from "@/shared/components/Scene";

export const DailyRevealScene = memo(function DailyRevealScene() {
  return (
    <Scene sceneKey="dailyReveal">
      <DailyRevealContent />
    </Scene>
  );
});
