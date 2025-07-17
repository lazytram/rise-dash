"use client";

import { memo } from "react";
import Game from "@/components/game/Game";

export const GameScene = memo(function GameScene() {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
      {/* Game Component */}
      <Game />
    </div>
  );
});
