import React, { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useBlockchainScore } from "@/hooks/useBlockchainScore";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
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
      <Modal size="sm">
        <div className="text-center">
          <div className="mb-6">
            <Image
              src="/armchair.png"
              alt="Victory"
              width={95}
              height={95}
              className="mx-auto mb-4 animate-bounce"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isNewPersonalBest
              ? t("blockchain.newRecord")
              : t("blockchain.scoreSaved")}
          </h2>
          <Text variant="subtitle" size="lg" className="mb-6">
            {t("blockchain.scoreRecorded")}: {distance} {t("game.meters")}
          </Text>
          {onClose && (
            <Button onClick={onClose} variant="primary">
              {t("common.continue")}
            </Button>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal size="sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("blockchain.saveScore")}
        </h2>

        <div className="mb-6">
          <Text variant="subtitle" size="lg" className="mb-2">
            {t("blockchain.currentScore")}
          </Text>
          <div
            className="text-3xl font-bold mb-4"
            style={{ color: UI_COLORS.GRADIENT_FROM }}
          >
            {GameLogic.formatDistance(distance)} {t("game.meters")}
          </div>

          {playerBestScore !== null && (
            <Text variant="caption">
              {t("blockchain.bestScore")}: {formatScore(playerBestScore)}{" "}
              {t("game.meters")}
            </Text>
          )}
        </div>

        {!isConnected ? (
          <div className="mb-6">
            <Text variant="error" className="mb-4">
              {t("blockchain.connectWalletToSave")}
            </Text>
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
    </Modal>
  );
};
