import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { Modal } from "@/shared/components/Modal";
import { RewardBreakdown } from "./RewardBreakdown";
import { ScoreCard } from "./ScoreCard";
import { RewardsService } from "@/features/rewards/rewardsService";

interface ScoreSuccessProps {
  distance: number;
  isNewPersonalBest: boolean;
  transactionHash?: string;
  onClose?: () => void;
  onRestart?: () => void;
}

export const ScoreSuccess: React.FC<ScoreSuccessProps> = ({
  distance,
  isNewPersonalBest,
  transactionHash,
  onClose,
  onRestart,
}) => {
  const { t } = useTranslations();

  return (
    <Modal
      size="full"
      isOpen={true}
      onClose={onClose || onRestart || (() => {})}
    >
      <div className="h-[500px] sm:h-[550px] flex flex-col relative overflow-hidden p-4 sm:p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a1344]/20 via-[#7967e5]/20 to-[#99eafc]/20 rounded-2xl backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-3 left-3 w-1 h-1 bg-[#7967e5]/30 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-[#99eafc]/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-[#7967e5]/30 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-[#99eafc]/50 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Header with compact styling */}
        <div className="relative text-center mb-4 sm:mb-6">
          <div className="inline-block relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg tracking-wide">
              {isNewPersonalBest
                ? t("features.blockchain.newRecord")
                : t("features.blockchain.scoreSaved")}
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#7967e5] via-[#99eafc] to-[#7967e5] mx-auto rounded-full shadow-lg"></div>
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#7967e5]/60 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#99eafc]/60 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Success indicator */}
          <div className="mt-3 sm:mt-4">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#7967e5]/20 to-[#99eafc]/20 rounded-lg border border-[#7967e5]/30 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-[#99eafc] rounded-full animate-pulse"></div>
              <Text
                variant="body"
                className="text-[#99eafc] font-semibold text-sm"
              >
                {t("features.gameplay.scoreSavedSuccess")}
              </Text>
            </div>
          </div>
        </div>

        {/* Main Content with horizontal layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch relative">
          {/* Left Column - Score */}
          <div className="flex-1 flex flex-col items-center justify-start min-w-0">
            <ScoreCard
              distance={distance}
              title={t("features.blockchain.scoreRecorded")}
              subtitle={
                isNewPersonalBest
                  ? t("features.gameplay.newRecordAchieved")
                  : t("features.gameplay.scoreRecorded")
              }
              variant="success"
              transactionHash={transactionHash}
            />
          </div>

          {/* Right Column - Rewards */}
          <div className="flex-1 flex flex-col items-center justify-start min-w-0">
            <RewardBreakdown
              rewards={RewardsService.calculateDistanceRewards(distance)}
              isScoreSaved
            />
          </div>
        </div>

        {/* Actions with compact spacing */}
        <div className="mt-6 sm:mt-8 relative">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {onRestart && (
              <Button
                onClick={onRestart}
                variant="gradient"
                size="md"
                className="w-48 py-3 bg-gradient-to-r from-[#7967e5] to-[#99eafc] hover:from-[#6d5ce7] hover:to-[#88d8f0] shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                  <span>{t("scenes.game.restart")}</span>
                </div>
              </Button>
            )}
            {onClose && (
              <Button
                onClick={onClose}
                variant="secondary"
                size="md"
                className="w-48 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                  <span>{t("common.continue")}</span>
                </div>
              </Button>
            )}
          </div>
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
