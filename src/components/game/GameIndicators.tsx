"use client";

import React from "react";
import { Player, DifficultyLevel } from "@/types/game";
import {
  AmmoIndicator,
  DifficultyIndicator,
  PowerUpIndicator,
  ShimmerBox,
} from "./indicators";

interface GameIndicatorsProps {
  player: Player;
  difficultyLevel: DifficultyLevel;
  isGameStarted?: boolean;
}

export const GameIndicators: React.FC<GameIndicatorsProps> = ({
  player,
  difficultyLevel,
  isGameStarted = false,
}) => {
  // Always show shimmer if game hasn't started
  if (!isGameStarted) {
    return (
      <div className="flex space-x-3 sm:space-x-4 justify-center w-full max-w-2xl mx-auto px-4">
        <ShimmerBox />
        <ShimmerBox />
        <ShimmerBox />
      </div>
    );
  }

  return (
    <div className="flex space-x-3 sm:space-x-4 justify-center w-full max-w-2xl mx-auto px-4">
      <AmmoIndicator player={player} />
      <DifficultyIndicator difficultyLevel={difficultyLevel} />
      <PowerUpIndicator player={player} />
    </div>
  );
};
