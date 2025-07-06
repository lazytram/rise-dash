import { useEffect, useRef } from "react";
import { GAME_CONSTANTS } from "@/constants/game";

export const useGameLoop = (isGameRunning: boolean, gameLoop: () => void) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameRunning) {
      intervalRef.current = setInterval(gameLoop, 1000 / GAME_CONSTANTS.FPS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isGameRunning, gameLoop]);

  return intervalRef;
};
