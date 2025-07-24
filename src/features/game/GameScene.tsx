"use client";

import { memo } from "react";
import Game from "./Game";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const GameScene = memo(function GameScene() {
  return (
    <SceneContainer maxWidth="full" centered={true} className="relative">
      <Game />
    </SceneContainer>
  );
});
