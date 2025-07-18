import { useCallback } from "react";

export const useKeyboardControls = (
  isGameRunning: boolean,
  isGameOver: boolean,
  onJump: () => void,
  onStartGame: () => void,
  onShoot?: () => void
) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      // Don't handle keyboard input when game is over
      // The GameOverScreen handles its own keyboard events
      if (isGameOver) {
        return;
      }

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
      } else if (event.code === "Enter") {
        if (!isGameRunning) {
          onStartGame();
        }
      }
    },
    [isGameRunning, isGameOver, onJump, onStartGame, onShoot]
  );

  return { handleKeyPress };
};
