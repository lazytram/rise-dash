"use client";

import { memo } from "react";
import Game from "@/components/game/Game";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const GameScene = memo(function GameScene() {
  return (
    <SceneContainer maxWidth="full" centered={false} className="relative">
      <Game />
    </SceneContainer>
  );
});
