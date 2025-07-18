"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { GameLogic } from "@/utils/gameLogic";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useTranslations } from "@/hooks/useTranslations";
import { usePowerUpSync } from "@/hooks/usePowerUpSync";
import { GameCanvas } from "./GameCanvas";
import { GameOverScreen } from "./GameOverScreen";
import { GameIndicators } from "./GameIndicators";
import { GameRenderer } from "@/utils/gameRenderer";
import { PerformanceMonitor } from "@/utils/performanceMonitor";
import { PerformanceDisplay } from "./PerformanceDisplay";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  // Translations
  const { t } = useTranslations();

  const [gameState, setGameState] = useState<GameState>(
    GameLogic.createInitialGameState()
  );

  // Initialize performance monitor only in development
  useEffect(() => {
    if (isDevelopment) {
      performanceMonitorRef.current = new PerformanceMonitor(true);
      performanceMonitorRef.current.start();
    }

    return () => {
      if (isDevelopment && performanceMonitorRef.current) {
        performanceMonitorRef.current.stop();
      }
    };
  }, [isDevelopment]);

  // Sync power-up levels with service
  usePowerUpSync(gameState.player, (updatedPlayer) => {
    setGameState((prev) => ({
      ...prev,
      player: updatedPlayer,
    }));
  });

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

  // Game initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
    canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d", {
      alpha: false, // Disable alpha for better performance
      desynchronized: true, // Reduce latency
    });

    if (ctx) {
      rendererRef.current = new GameRenderer(ctx);
    }
  }, []);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event);

      // Toggle performance display with F3 key only in development
      if (isDevelopment && event.code === "F3") {
        event.preventDefault();
        setShowPerformance((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, isDevelopment]);

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

  // Game rendering - simplified for better performance
  useEffect(() => {
    if (!rendererRef.current) return;

    // Update performance monitor only in development
    if (isDevelopment) {
      performanceMonitorRef.current?.update();
    }

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
  }, [gameState, translations, isDevelopment]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <GameCanvas canvasRef={canvasRef} />
          {gameState.isGameOver && (
            <GameOverScreen
              distance={gameState.distance}
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

      {/* Performance Display - Only in development */}
      {isDevelopment && performanceMonitorRef.current && (
        <PerformanceDisplay
          performanceMonitor={performanceMonitorRef.current}
          isVisible={showPerformance}
        />
      )}

      {/* Performance Toggle Hint - Only in development */}
      {isDevelopment && !showPerformance && (
        <div className="fixed bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-xs">
          {t("scenes.game.performanceHint")}
        </div>
      )}
    </>
  );
};

export default Game;
