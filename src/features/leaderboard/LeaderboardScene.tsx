"use client";

import { memo } from "react";
import { LeaderboardContent } from "./LeaderboardContent";
import { Scene } from "@/shared/components/Scene";

export const LeaderboardScene = memo(function LeaderboardScene() {
  return (
    <Scene sceneKey="leaderboard">
      <LeaderboardContent />
    </Scene>
  );
});
