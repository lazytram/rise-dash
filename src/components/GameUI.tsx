import { GameState } from "@/types/game";
import { GameLogic } from "@/utils/gameLogic";

interface GameUIProps {
  gameState: GameState;
  onStartGame: () => void;
}

export const GameUI = ({ gameState, onStartGame }: GameUIProps) => {
  return (
    <div className="mt-4 text-center">
      <div className="text-white text-lg mb-2">
        Distance traveled: {GameLogic.formatDistance(gameState.distance)} meters
      </div>

      {!gameState.isGameRunning && (
        <button
          onClick={onStartGame}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          {gameState.isGameOver ? "Restart" : "Start Game"}
        </button>
      )}

      <div className="text-white text-sm mt-2">Use SPACEBAR to jump!</div>
    </div>
  );
};
