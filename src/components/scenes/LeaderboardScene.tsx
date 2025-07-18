"use client";

import { memo } from "react";
import { LeaderboardContent } from "@/components/game/LeaderboardContent";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const LeaderboardScene = memo(function LeaderboardScene() {
  return (
    <SceneContainer>
      <LeaderboardContent />
    </SceneContainer>
  );
});
