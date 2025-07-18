import React, { useEffect, useState } from "react";
import { GameLogic } from "@/utils/gameLogic";
import { UI_COLORS } from "@/constants/colors";
import { useTranslations } from "@/hooks/useTranslations";
import { ScoreBoard } from "./ScoreBoard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";

interface GameOverScreenProps {
  distance: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  distance,
  onRestart,
}) => {
  const { t } = useTranslations();
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [canRestart, setCanRestart] = useState(false);

  // Enable restart after 1.5 seconds to prevent accidental restarts
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanRestart(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();

        if (showScoreBoard) {
          setShowScoreBoard(false);
        } else if (canRestart) {
          onRestart();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onRestart, showScoreBoard, canRestart]);

  if (showScoreBoard) {
    return (
      <ScoreBoard
        distance={distance}
        onClose={() => setShowScoreBoard(false)}
      />
    );
  }

  return (
    <Modal size="sm">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {t("game.gameOver")}
        </h1>

        <Text variant="subtitle" size="xl" className="mb-4">
          {t("game.finalScore")}
        </Text>

        <div
          className="text-3xl font-bold mb-6"
          style={{ color: UI_COLORS.GRADIENT_FROM }}
        >
          {GameLogic.formatDistance(distance)} {t("game.meters")}
        </div>

        <Text variant="subtitle" size="lg" className="mb-6">
          {canRestart ? t("game.restartMessage") : "Sauvegarde en cours..."}
        </Text>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => setShowScoreBoard(true)} variant="success">
            {t("blockchain.saveScore")}
          </Button>
          <Button
            onClick={onRestart}
            variant="primary"
            disabled={!canRestart}
            className={!canRestart ? "opacity-50 cursor-not-allowed" : ""}
          >
            {canRestart ? t("game.restart") : "Patientez..."}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
