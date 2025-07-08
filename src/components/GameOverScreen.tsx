import React, { useEffect } from "react";
import { GameLogic } from "@/utils/gameLogic";
import { UI_COLORS } from "@/constants/colors";
import { useTranslations } from "@/hooks/useTranslations";

interface GameOverScreenProps {
  distance: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  distance,
  onRestart,
}) => {
  const { t } = useTranslations();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        onRestart();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onRestart]);

  return (
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-10 rounded-lg animate-fade-in">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {t("game.gameOver")}
        </h1>

        <p className="text-xl text-gray-600 mb-4">{t("game.finalScore")}</p>

        <div
          className="text-3xl font-bold mb-6"
          style={{ color: UI_COLORS.GRADIENT_FROM }}
        >
          {GameLogic.formatDistance(distance)} {t("game.meters")}
        </div>

        <p className="text-lg text-gray-600 mb-6">{t("game.restartMessage")}</p>

        <button
          onClick={onRestart}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          {t("game.restart")}
        </button>
      </div>
    </div>
  );
};
