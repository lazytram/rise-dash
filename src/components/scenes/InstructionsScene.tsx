"use client";

import { memo } from "react";
import { InstructionsContent } from "@/components/game/InstructionsContent";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const InstructionsScene = memo(function InstructionsScene() {
  return (
    <SceneContainer>
      <InstructionsContent />
    </SceneContainer>
  );
});
