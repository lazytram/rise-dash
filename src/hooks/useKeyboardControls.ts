import { useCallback } from "react";

export const useKeyboardControls = (
  isGameRunning: boolean,
  onJump: () => void,
  onStartGame: () => void
) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        if (isGameRunning) {
          onJump();
        } else {
          onStartGame();
        }
      }
    },
    [isGameRunning, onJump, onStartGame]
  );

  return { handleKeyPress };
};
