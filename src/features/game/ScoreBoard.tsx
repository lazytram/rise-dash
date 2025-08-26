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
      <div className="min-h-[70vh] max-h-[85vh] flex flex-col relative overflow-hidden p-4 sm:p-8">
        {/* Light Mode Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 rounded-3xl backdrop-blur-xl border border-gray-200/50 shadow-xl">
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-6 left-6 w-2 h-2 bg-[#7967e5]/30 rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-[#99eafc]/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-8 left-12 w-1 h-1 bg-[#7967e5]/20 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-[#99eafc]/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-8 w-1 h-1 bg-[#7967e5]/15 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/3 right-8 w-1 h-1 bg-[#99eafc]/25 rounded-full animate-pulse delay-800"></div>
          </div>
        </div>

        {/* Enhanced Header */}
        <div className="relative text-center mb-4 sm:mb-8">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 drop-shadow-sm tracking-wide">
              {t("features.blockchain.saveScore")}
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#7967e5] via-[#99eafc] to-[#7967e5] mx-auto rounded-full shadow-md"></div>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-[#7967e5]/40 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#7967e5]/40 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Main Content - Responsive grid; no scroll needed on desktop */}
        <div className="flex-1 relative pb-24 sm:pb-0 overflow-y-auto lg:overflow-visible">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-start">
            {/* Score Display */}
            <div>
              <div className="max-w-md mx-auto w-full">
                <ScoreDisplay distance={distance} />
              </div>
            </div>

            {/* Rewards and Actions */}
            <div>
              <div className="max-w-md mx-auto w-full">
                <RewardBreakdown rewards={rewards} isScoreSaved={false} />
              </div>

              {/* Actions Section (desktop/tablet) */}
              <div className="mt-4 sm:mt-6 hidden sm:block lg:sticky lg:top-4">
                <div className="max-w-md mx-auto">
                  <ScoreActions
                    onSaveScore={handleSaveScore}
                    onRestart={onRestart}
                    isRecording={isSavingWithRICE}
                    isSubmitting={isSubmitting}
                    error={error}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky mobile actions */}
        <div className="sm:hidden fixed left-0 right-0 bottom-0 z-10 px-4 pb-4 pt-3 bg-gradient-to-t from-white/90 to-white/40 backdrop-blur-md border-t border-gray-200/60">
          <div className="max-w-md mx-auto">
            <ScoreActions
              onSaveScore={handleSaveScore}
              onRestart={onRestart}
              isRecording={isSavingWithRICE}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="w-1.5 h-1.5 bg-[#7967e5]/30 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-[#99eafc]/30 rounded-full animate-pulse delay-200"></div>
          <div className="w-1.5 h-1.5 bg-[#7967e5]/30 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </Modal>
  );
};
