"use client";

import { memo } from "react";
import { InstructionsContent } from "./InstructionsContent";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const InstructionsScene = memo(function InstructionsScene() {
  return (
    <SceneContainer>
      <InstructionsContent />
    </SceneContainer>
  );
});
