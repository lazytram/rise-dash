import React, { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useBlockchainScore } from "@/hooks/useBlockchainScore";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { GameLogic } from "@/utils/gameLogic";

interface ScoreBoardProps {
  distance: number;
  onClose?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  distance,
  onClose,
}) => {
  const { t } = useTranslations();
  const { isConnected, address } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    recordScore,
    isLoading,
    isSuccess,
    isError,
    error,
    playerBestScore,
    isNewPersonalBest,
    isGameOwnerConfigured,
  } = useBlockchainScore();

  const handleSaveScore = useCallback(async () => {
    if (isSubmitting || !isConnected) {
      if (!isConnected) {
        alert(t("blockchain.connectWallet"));
      }
      return;
    }

    try {
      setIsSubmitting(true);
      // Use a default name based on address
      const defaultName = `Player_${address?.slice(2, 8)}`;

      await recordScore(GameLogic.formatDistance(distance), defaultName);
    } catch (err) {
      console.error("Error saving score:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [isConnected, recordScore, distance, isSubmitting, address, t]);

  const formatScore = (score: bigint | null) => {
    if (!score) return "0";
    return score.toString();
  };

  if (isSuccess) {
    return (
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-20 rounded-lg animate-fade-in">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isNewPersonalBest
              ? t("blockchain.newRecord")
              : t("blockchain.scoreSaved")}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t("blockchain.scoreRecorded")}: {distance} {t("game.meters")}
          </p>
          {onClose && (
            <Button onClick={onClose} variant="primary">
              {t("common.continue")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-20 rounded-lg animate-fade-in"
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("blockchain.saveScore")}
        </h2>

        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-2">
            {t("blockchain.currentScore")}
          </p>
          <div
            className="text-3xl font-bold mb-4"
            style={{ color: UI_COLORS.GRADIENT_FROM }}
          >
            {GameLogic.formatDistance(distance)} {t("game.meters")}
          </div>

          {playerBestScore !== null && (
            <div className="text-sm text-gray-500">
              {t("blockchain.bestScore")}: {formatScore(playerBestScore)}{" "}
              {t("game.meters")}
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="mb-6">
            <p className="text-red-600 mb-4">
              {t("blockchain.connectWalletToSave")}
            </p>
            <Button onClick={onClose} variant="secondary">
              {t("common.cancel")}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleSaveScore}
              disabled={isLoading || isSubmitting || !isGameOwnerConfigured}
              variant="primary"
            >
              {isLoading || isSubmitting
                ? t("blockchain.saving")
                : t("blockchain.saveScore")}
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="secondary">
                {t("common.cancel")}
              </Button>
            )}
          </div>
        )}

        {isError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error?.message || t("blockchain.errorSaving")}
          </div>
        )}
      </div>
    </div>
  );
};
