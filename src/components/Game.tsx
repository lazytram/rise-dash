"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { GameLogic } from "@/utils/gameLogic";
import { GameRenderer } from "@/utils/gameRenderer";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useTranslations } from "@/hooks/useTranslations";
import { GameCanvas } from "./GameCanvas";
import { GameUI } from "./GameUI";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // Translations
  const { t } = useTranslations();

  const [gameState, setGameState] = useState<GameState>(
    GameLogic.createInitialGameState()
  );

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGameRunning: true,
      isGameOver: false,
      distance: 0,
      player: GameLogic.resetPlayer(prev.player),
    }));
  }, []);

  const jump = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      player: GameLogic.makePlayerJump(prev.player),
    }));
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameState.isGameRunning) return;

    setGameState((prev) => ({
      ...prev,
      player: GameLogic.updatePlayerPhysics(prev.player),
      distance: GameLogic.updateDistance(prev.distance),
    }));
  }, [gameState.isGameRunning]);

  // Custom hooks
  const { handleKeyPress } = useKeyboardControls(
    gameState.isGameRunning,
    jump,
    startGame
  );

  useGameLoop(gameState.isGameRunning, gameLoop);

  // Game initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
    canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      rendererRef.current = new GameRenderer(ctx);
    }
  }, []);

  // Keyboard input handling
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Game rendering
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.render(
        gameState.player,
        gameState.distance,
        gameState.isGameRunning,
        gameState.isGameOver,
        {
          title: t("game.title"),
          distance: t("game.distance"),
          meters: t("game.meters"),
          startMessage: t("game.startMessage"),
          jumpMessage: t("game.jumpMessage"),
        }
      );
    }
  }, [gameState, t]);

  return (
    <div className="flex flex-col items-center">
      <GameCanvas canvasRef={canvasRef} />
      <GameUI gameState={gameState} onStartGame={startGame} />
    </div>
  );
};

export default Game;
