import { useEffect, useRef, useCallback } from "react";
import { GAME_CONSTANTS } from "@/constants/game";

export const useGameLoop = (isGameRunning: boolean, gameLoop: () => void) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const targetFrameTime = 1000 / GAME_CONSTANTS.FPS;

  const animate = useCallback(
    (currentTime: number) => {
      if (!isGameRunning) return;

      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= targetFrameTime) {
        gameLoop();
        lastTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [isGameRunning, gameLoop, targetFrameTime]
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
  }, [isGameRunning, gameLoop, animate]);

  return animationFrameRef;
};
