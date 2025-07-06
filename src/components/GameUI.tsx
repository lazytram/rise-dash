import { GameState } from "@/types/game";
import { GameLogic } from "@/utils/gameLogic";
import { useTranslations } from "@/hooks/useTranslations";

interface GameUIProps {
  gameState: GameState;
  onStartGame: () => void;
}

export const GameUI = ({ gameState, onStartGame }: GameUIProps) => {
  const { t } = useTranslations();

  return (
    <div className="mt-4 text-center">
      <div className="text-white text-lg mb-2">
        {t("game.distance")}: {GameLogic.formatDistance(gameState.distance)}{" "}
        {t("game.meters")}
      </div>

      {!gameState.isGameRunning && (
        <button
          onClick={onStartGame}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {gameState.isGameOver ? t("game.restart") : t("game.startGame")}
        </button>
      )}

      <div className="text-white text-sm mt-2">{t("game.instructions")}</div>
    </div>
  );
};
