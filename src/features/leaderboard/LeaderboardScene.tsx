"use client";

import { memo } from "react";
import { LeaderboardContent } from "./LeaderboardContent";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const LeaderboardScene = memo(function LeaderboardScene() {
  return (
    <SceneContainer>
      <LeaderboardContent />
    </SceneContainer>
  );
});
