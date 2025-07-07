import { useCallback } from "react";

export const useKeyboardControls = (
  isGameRunning: boolean,
  onJump: () => void,
  onStartGame: () => void,
  onShoot?: () => void
) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.code === "ArrowUp") {
        if (isGameRunning) {
          onJump();
        } else {
          onStartGame();
        }
      } else if (event.code === "Space") {
        if (isGameRunning && onShoot) {
          onShoot();
        } else if (!isGameRunning) {
          onStartGame();
        }
      }
    },
    [isGameRunning, onJump, onStartGame, onShoot]
  );

  return { handleKeyPress };
};
