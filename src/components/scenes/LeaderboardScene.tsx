"use client";

import { memo } from "react";
import { LeaderboardContent } from "@/components/game/LeaderboardContent";

export const LeaderboardScene = memo(function LeaderboardScene() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <LeaderboardContent />
      </div>
    </div>
  );
});
