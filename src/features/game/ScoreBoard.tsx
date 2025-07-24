import React, { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useBlockchainScore } from "@/shared/hooks/useBlockchainScore";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Modal } from "@/shared/components/Modal";
import { GameLogic } from "@/core/game-logic/gameLogic";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { ScoreDisplay, ScoreActions, ScoreSuccess } from "./components";

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
  }, [clearToasts]);

  const { recordScore, checkNewPersonalBest, isRecording, isSuccess, error } =
    useBlockchainScore();

  const handleSaveScore = useCallback(async () => {
    if (isSubmitting || !isConnected) {
      if (!isConnected) {
        showInfo(
          t("features.blockchain.connectWallet"),
          t("features.blockchain.connectWalletMessage")
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
      <ScoreSuccess
        distance={distance}
        isNewPersonalBest={isNewPersonalBest}
        onClose={onClose}
      />
    );
  }

  return (
    <Modal size="sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t("features.blockchain.saveScore")}
        </h2>

        <ScoreDisplay distance={distance} />

        <ScoreActions
          onSaveScore={handleSaveScore}
          onClose={onClose}
          isRecording={isRecording}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </Modal>
  );
};
