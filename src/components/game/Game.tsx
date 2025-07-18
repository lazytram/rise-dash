"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { GameLogic } from "@/utils/gameLogic";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useTranslations } from "@/hooks/useTranslations";
import { GameCanvas } from "./GameCanvas";
import { GameOverScreen } from "./GameOverScreen";
import { GameIndicators } from "./GameIndicators";
import { GameRenderer } from "@/utils/gameRenderer";

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
      riceRockets: [],
      sushis: [],
      samurais: [],
      samuraiBullets: [],
      toriis: [],
      powerUps: [],
      player: GameLogic.resetPlayer(prev.player),
    }));
  }, []);

  const jump = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      player: GameLogic.makePlayerJump(prev.player),
    }));
  }, []);

  const shoot = useCallback(() => {
    setGameState((prev) => GameLogic.addRiceRocket(prev));
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameState.isGameRunning) return;

    setGameState((prev) => GameLogic.updateGameState(prev));
  }, [gameState.isGameRunning]);

  // Custom hooks
  const { handleKeyPress } = useKeyboardControls(
    gameState.isGameRunning,
    gameState.isGameOver,
    jump,
    startGame,
    shoot
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

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(
    () => ({
      distance: t("game.distance"),
      meters: t("game.meters"),
      startMessage: t("game.startMessage"),
      jumpMessage: t("game.jumpMessage"),
      enemyMessage: t("game.enemyMessage"),
      gameOver: t("game.gameOver"),
      finalScore: t("game.finalScore"),
      restartMessage: t("game.restartMessage"),
    }),
    [t]
  );

  // Game rendering
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.render(
        gameState.player,
        gameState.riceRockets,
        gameState.sushis,
        gameState.toriis,
        gameState.samurais,
        gameState.samuraiBullets,
        gameState.powerUps,
        gameState.distance,
        gameState.isGameRunning,
        gameState.isGameOver,
        translations
      );
    }
  }, [gameState, translations]);

  return (
    <div className="flex items-start justify-center">
      <div className="relative">
        <GameCanvas canvasRef={canvasRef} />
        {gameState.isGameOver && (
          <GameOverScreen distance={gameState.distance} onRestart={startGame} />
        )}
      </div>
      {gameState.isGameRunning && !gameState.isGameOver && (
        <GameIndicators
          player={gameState.player}
          difficultyLevel={gameState.difficultyLevel}
        />
      )}
    </div>
  );
};

export default Game;
