"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { GameCanvas } from "./GameCanvas";
import { GameIndicators } from "./GameIndicators";
import { ScoreBoard } from "./ScoreBoard";
import { EnemyInfoModal } from "./components/EnemyInfoModal";
import { EnemyGuideButton } from "./components/EnemyGuideButton";
import { GameLogic } from "@/core/game-logic/gameLogic";
import { GameRenderer } from "@/core/game-logic/gameRenderer";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import { useGameLoop } from "@/shared/hooks/useGameLoop";
import { useKeyboardControls } from "@/shared/hooks/useKeyboardControls";
import { loadLevelsFromBlockchain } from "@/shared/services/powerUpService";
import { GameState } from "@/shared/types/game";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const { address } = useAccount();

  // Translations
  const { t } = useTranslations();

  const [gameState, setGameState] = useState<GameState>(
    GameLogic.createInitialGameState()
  );

  const [showEnemyInfo, setShowEnemyInfo] = useState(false);

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
      loadLevelsFromBlockchain(address).catch((error: unknown) => {
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
      gameState.ninjas,
      gameState.bosses,
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
    gameState.ninjas,
    gameState.bosses,
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

            <EnemyGuideButton
              onClick={() => setShowEnemyInfo(true)}
              isVisible={!gameState.isGameRunning && !gameState.isGameOver}
            />

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

      {/* Enemy Info Modal */}
      <EnemyInfoModal
        isOpen={showEnemyInfo}
        onClose={() => setShowEnemyInfo(false)}
      />
    </>
  );
};

export default Game;
