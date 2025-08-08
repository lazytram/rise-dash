"use client";

import { memo } from "react";
import { InstructionsContent } from "./InstructionsContent";
import { Scene } from "@/shared/components/Scene";

export const InstructionsScene = memo(function InstructionsScene() {
  return (
    <Scene sceneKey="instructions">
      <InstructionsContent />
    </Scene>
  );
});
