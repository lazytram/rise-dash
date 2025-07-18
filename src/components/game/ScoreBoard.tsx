import React, { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useBlockchainScore } from "@/hooks/useBlockchainScore";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
import { GameLogic } from "@/utils/gameLogic";
import { useToastStore } from "@/store/toastStore";

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
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const { showInfo, clearToasts } = useToastStore();

  // Clear toasts when component mounts
  useEffect(() => {
    clearToasts();
  }, []);

  const { recordScore, checkNewPersonalBest, isRecording, isSuccess, error } =
    useBlockchainScore();

  const handleSaveScore = useCallback(async () => {
    if (isSubmitting || !isConnected) {
      if (!isConnected) {
        showInfo(
          t("blockchain.connectWallet"),
          t("blockchain.connectWalletMessage")
        );
        return;
      }
      return;
    }

    try {
      setIsSubmitting(true);
      // Use a default name based on address
      const defaultName = `Player_${address?.slice(2, 8)}`;

      // Check if it's a new personal best
      const isNewBest = await checkNewPersonalBest(
        GameLogic.formatDistance(distance)
      );
      setIsNewPersonalBest(isNewBest);

      await recordScore(GameLogic.formatDistance(distance), defaultName);
    } catch (err) {
      console.error("Error saving score:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isConnected,
    showInfo,
    t,
    address,
    recordScore,
    checkNewPersonalBest,
    distance,
  ]);

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
          <h2 className="text-2xl font-bold text-white mb-4">
            {isNewPersonalBest
              ? t("blockchain.newRecord")
              : t("blockchain.scoreSaved")}
          </h2>
          <Text
            variant="subtitle"
            size="lg"
            className="mb-6 text-white font-medium"
          >
            {t("blockchain.scoreRecorded")}:{" "}
            {GameLogic.formatDistance(distance)} {t("game.meters")}
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
        <h2 className="text-2xl font-bold text-white mb-6">
          {t("blockchain.saveScore")}
        </h2>

        <div className="mb-6">
          <Text
            variant="subtitle"
            size="lg"
            className="mb-2 text-white font-semibold"
          >
            {t("blockchain.currentScore")}
          </Text>
          <div className="mb-4">
            <div
              className="inline-block px-6 py-3 rounded-lg border-2 border-white/20 shadow-lg"
              style={{
                background: `linear-gradient(to bottom right, #4ade80, #16a34a)`,
              }}
            >
              <span className="text-3xl font-bold text-white">
                {GameLogic.formatDistance(distance)} {t("game.meters")}
              </span>
            </div>
          </div>
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
              disabled={isRecording || isSubmitting}
              variant="primary"
            >
              {isRecording || isSubmitting
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

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 text-red-200 rounded">
            {error?.message || t("blockchain.errorSaving")}
          </div>
        )}
      </div>
    </Modal>
  );
};
