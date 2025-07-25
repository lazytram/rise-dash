import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { Modal } from "@/shared/components/Modal";
import { RewardBreakdown } from "./RewardBreakdown";
import { ScoreCard } from "./ScoreCard";
import { RewardsService } from "../../rewards/rewardsService";

interface ScoreSuccessProps {
  distance: number;
  isNewPersonalBest: boolean;
  onClose?: () => void;
  onRestart?: () => void;
}

export const ScoreSuccess: React.FC<ScoreSuccessProps> = ({
  distance,
  isNewPersonalBest,
  onClose,
  onRestart,
}) => {
  const { t } = useTranslations();

  return (
    <Modal size="lg">
      <div className="h-[520px] sm:h-[580px] flex flex-col relative overflow-hidden p-3 sm:p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 rounded-2xl backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-3 left-3 w-1 h-1 bg-green-400/30 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-emerald-400/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-teal-400/30 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-green-400/50 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Compact Header */}
        <div className="relative text-center mb-3 sm:mb-4">
          <div className="inline-block relative">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg tracking-wide">
              {isNewPersonalBest
                ? t("features.blockchain.newRecord")
                : t("features.blockchain.scoreSaved")}
            </h2>
            <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 mx-auto rounded-full shadow-lg"></div>
            <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-green-400/60 rounded-full animate-pulse"></div>
            <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-teal-400/60 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Compact Success indicator */}
          <div className="mt-2 sm:mt-3">
            <div className="inline-flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30 backdrop-blur-sm">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <Text
                variant="body"
                className="text-green-300 font-semibold text-xs"
              >
                {t("features.gameplay.scoreSavedSuccess")}
              </Text>
            </div>
          </div>
        </div>

        {/* Compact Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch relative">
          {/* Left Column - Score */}
          <div className="flex-1 flex flex-col justify-center">
            <ScoreCard
              distance={distance}
              title={t("features.blockchain.scoreRecorded")}
              subtitle={
                isNewPersonalBest
                  ? t("features.gameplay.newRecordAchieved")
                  : t("features.gameplay.scoreRecorded")
              }
              variant="success"
            />
          </div>

          {/* Right Column - Rewards */}
          <div className="flex-1 flex flex-col justify-center">
            <RewardBreakdown
              rewards={RewardsService.calculateDistanceRewards(distance)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 relative">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {onRestart && (
              <Button
                onClick={onRestart}
                variant="success"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold shadow-xl transform transition-all duration-300 hover:scale-105 rounded-xl border border-emerald-400/30 backdrop-blur-sm group cursor-pointer whitespace-nowrap text-sm sm:text-base"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  <span>{t("scenes.game.restart")}</span>
                </div>
              </Button>
            )}
            {onClose && (
              <Button
                onClick={onClose}
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-xl transform transition-all duration-300 hover:scale-105 rounded-xl border border-blue-400/30 backdrop-blur-sm group cursor-pointer whitespace-nowrap text-sm sm:text-base"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  <span>{t("common.continue")}</span>
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Compact Bottom decorative elements */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          <div className="w-0.5 h-0.5 bg-green-400/40 rounded-full animate-pulse"></div>
          <div className="w-0.5 h-0.5 bg-emerald-400/40 rounded-full animate-pulse delay-200"></div>
          <div className="w-0.5 h-0.5 bg-teal-400/40 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </Modal>
  );
};
