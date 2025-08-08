import React, { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useBlockchainScore } from "@/shared/hooks/useBlockchainScore";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Modal } from "@/shared/components/Modal";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { ScoreDisplay, ScoreActions, ScoreSuccess } from "./components";
import { RewardBreakdown } from "./components/RewardBreakdown";
import { RewardsService } from "../rewards/rewardsService";

interface ScoreBoardProps {
  distance: number;
  onClose?: () => void;
  onRestart?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  distance,
  onClose,
  onRestart,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onRestart) {
      onRestart();
    }
  };
  const { t } = useTranslations();
  const { isConnected, address } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewBestScore, setIsNewBestScore] = useState(false);
  const { showInfo, clearToasts } = useToastStore();

  // Clear toasts when component mounts
  useEffect(() => {
    clearToasts();
  }, [clearToasts]);

  const {
    saveScoreWithRICE,
    isNewPersonalBest,
    isSavingWithRICE,
    isSuccess,
    error,
    hash,
  } = useBlockchainScore();

  const rewards = RewardsService.calculateDistanceRewards(distance);

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

      const defaultName = `Player_${address?.slice(2, 8)}`;
      const isNewBest = await isNewPersonalBest(distance);
      setIsNewBestScore(isNewBest);

      // Record score with RICE rewards in a single transaction
      const success = await saveScoreWithRICE(
        distance,
        defaultName,
        rewards.totalRice
      );

      // If the transaction was initiated successfully, the hook will handle the rest
      // (success/error states are managed by the hook via wagmi)
      if (!success) {
        console.error("Failed to initiate score recording");
      }
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
    isNewPersonalBest,
    distance,
    saveScoreWithRICE,
    rewards.totalRice,
  ]);

  if (isSuccess) {
    return (
      <ScoreSuccess
        distance={distance}
        isNewPersonalBest={isNewBestScore}
        transactionHash={hash}
        onClose={onClose}
        onRestart={onRestart}
      />
    );
  }

  return (
    <Modal size="full" isOpen={true} onClose={handleClose}>
      <div className="h-[500px] sm:h-[550px] flex flex-col relative overflow-hidden p-4 sm:p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a1344]/20 via-[#7967e5]/20 to-[#99eafc]/20 rounded-2xl backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-[#7967e5]/30 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-[#99eafc]/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-[#7967e5]/30 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#99eafc]/50 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Header with compact styling */}
        <div className="relative text-center mb-4 sm:mb-6">
          <div className="inline-block relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg tracking-wide">
              {t("features.blockchain.saveScore")}
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#7967e5] via-[#99eafc] to-[#7967e5] mx-auto rounded-full shadow-lg"></div>
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#7967e5]/60 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#99eafc]/60 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Main Content with horizontal layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch relative">
          {/* Left Column - Score */}
          <div className="flex-1 flex flex-col items-center justify-start min-w-0">
            <ScoreDisplay distance={distance} />
          </div>

          {/* Right Column - Rewards */}
          <div className="flex-1 flex flex-col items-center justify-start min-w-0">
            <RewardBreakdown rewards={rewards} isScoreSaved={isSuccess} />
          </div>
        </div>

        {/* Actions with compact spacing */}
        <div className="mt-6 sm:mt-8 relative">
          <ScoreActions
            onSaveScore={handleSaveScore}
            onRestart={onRestart}
            isRecording={isSavingWithRICE}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-1 h-1 bg-[#7967e5]/40 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-[#99eafc]/40 rounded-full animate-pulse delay-200"></div>
          <div className="w-1 h-1 bg-[#7967e5]/40 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </Modal>
  );
};
