"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GameState } from "@/shared/types/game";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import { GameLogic } from "@/core/game-logic/gameLogic";
import { useKeyboardControls } from "@/shared/hooks/useKeyboardControls";
import { useGameLoop } from "@/shared/hooks/useGameLoop";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useAccount } from "wagmi";
import { loadLevelsFromBlockchain } from "@/shared/services/powerUpService";

import { GameCanvas } from "./GameCanvas";
import { ScoreBoard } from "./ScoreBoard";
import { GameIndicators } from "./GameIndicators";
import { GameRenderer } from "@/core/game-logic/gameRenderer";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const { address } = useAccount();

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
      enemyBullets: [],
      toriis: [],
      ninjas: [],
      bosses: [],
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
    setGameState((prev) => {
      if (!prev.isGameRunning) return prev;
      return GameLogic.updateGameState(prev);
    });
  }, []);

  // Custom hooks
  const { handleKeyPress } = useKeyboardControls(
    gameState.isGameRunning,
    gameState.isGameOver,
    jump,
    startGame,
    shoot
  );

  useGameLoop(gameState.isGameRunning, gameLoop);

  // Load power-up levels from blockchain when address changes
  useEffect(() => {
    if (address) {
      loadLevelsFromBlockchain(address).catch((error) => {
        console.warn("Failed to load power-up levels from blockchain:", error);
      });
    }
  }, [address]);

  // Game initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
    canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (ctx) {
      rendererRef.current = new GameRenderer(ctx);
    }
  }, []);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(
    () => ({
      distance: t("features.gameplay.distance"),
      meters: t("features.gameplay.meters"),
      startMessage: t("scenes.game.startMessage"),
      jumpMessage: t("scenes.game.jumpMessage"),
      enemyMessage: t("scenes.game.enemyMessage"),
      gameOver: t("scenes.game.gameOver"),
      finalScore: t("scenes.game.finalScore"),
      restartMessage: t("scenes.game.restartMessage"),
    }),
    [t]
  );

  // Game rendering
  useEffect(() => {
    if (!rendererRef.current) return;

    rendererRef.current.render(
      gameState.player,
      gameState.riceRockets,
      gameState.sushis,
      gameState.toriis,
      gameState.samurais,
      gameState.enemyBullets,
      gameState.powerUps,
      gameState.distance,
      gameState.isGameRunning,
      gameState.isGameOver,
      translations
    );
  }, [
    gameState.player,
    gameState.riceRockets,
    gameState.sushis,
    gameState.toriis,
    gameState.samurais,
    gameState.enemyBullets,
    gameState.powerUps,
    gameState.distance,
    gameState.isGameRunning,
    gameState.isGameOver,
    translations,
  ]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="relative">
            <GameCanvas canvasRef={canvasRef} />
            {gameState.isGameOver && (
              <ScoreBoard
                distance={GameLogic.formatDistance(gameState.distance)}
                onRestart={startGame}
              />
            )}
          </div>
          {/* Zone réservée pour les indicateurs avec hauteur responsive */}
          <div className="mt-4 sm:mt-6 h-24 sm:h-28 md:h-32 flex items-center justify-center w-full px-4">
            <GameIndicators
              player={gameState.player}
              difficultyLevel={gameState.difficultyLevel}
              isGameStarted={gameState.isGameRunning}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
