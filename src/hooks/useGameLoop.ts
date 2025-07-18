import { useEffect, useRef, useCallback } from "react";
import { GAME_CONSTANTS } from "@/constants/game";

export const useGameLoop = (isGameRunning: boolean, gameLoop: () => void) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<() => void>(gameLoop);
  const targetFrameTime = 1000 / GAME_CONSTANTS.FPS;

  // Update the ref whenever gameLoop changes
  useEffect(() => {
    gameLoopRef.current = gameLoop;
  }, [gameLoop]);

  const animate = useCallback(
    (currentTime: number) => {
      if (!isGameRunning) return;

      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= targetFrameTime) {
        gameLoopRef.current();
        lastTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [isGameRunning, targetFrameTime]
  );

  useEffect(() => {
    if (isGameRunning) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isGameRunning, animate]);

  return animationFrameRef;
};
