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
      <div className="min-h-[70vh] max-h-[85vh] flex flex-col relative overflow-hidden p-4 sm:p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 glass-light rounded-2xl backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-3 left-3 w-1 h-1 bg-primary/30 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-primary/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-primary/30 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-primary/50 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Header with compact styling */}
        <div className="relative text-center mb-4 sm:mb-6">
          <div className="inline-block relative">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 drop-shadow-lg tracking-wide">
              {isNewPersonalBest
                ? t("features.blockchain.newRecord")
                : t("features.blockchain.scoreSaved")}
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto rounded-full shadow-lg"></div>
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Success indicator */}
          <div className="mt-3 sm:mt-4">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50 backdrop-blur-sm shadow-lg">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse shadow-sm"></div>
              <Text variant="body" className="text-green-800 font-bold text-sm">
                {t("features.gameplay.scoreSavedSuccess")}
              </Text>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive grid; matches SaveScore layout */}
        <div className="flex-1 relative pb-16 sm:pb-0 overflow-y-auto lg:overflow-visible">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-start">
            {/* Score Display */}
            <div>
              <ScoreCard
                distance={distance}
                title={t("features.blockchain.scoreRecorded")}
                variant="success"
              />

              {/* View transaction link under the score card */}
              {transactionHash && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() =>
                      window.open(
                        `https://explorer.testnet.riselabs.xyz/tx/${transactionHash}`,
                        "_blank"
                      )
                    }
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500 transition-colors text-sm font-semibold"
                    aria-label={t("features.blockchain.viewTransaction")}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{t("features.blockchain.viewTransaction")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M13 3h8v8h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H13V3z" />
                      <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Rewards and actions */}
            <div>
              <div>
                <RewardBreakdown
                  rewards={RewardsService.calculateDistanceRewards(distance)}
                  isScoreSaved={true}
                />
              </div>

              {/* Actions (desktop/tablet) */}
              <div className="mt-6 sm:mt-8 hidden sm:block lg:sticky lg:top-4">
                <div className="flex justify-center">
                  <Button
                    onClick={onRestart}
                    variant="gradient"
                    size="lg"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#7967e5] to-[#99eafc] hover:from-[#6d5ce7] hover:to-[#88d8f0] shadow-lg hover:shadow-xl"
                  >
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    <span className="text-white font-semibold">
                      {t("features.gameplay.restart")}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile actions (sticky bar) */}
        <div className="sm:hidden fixed left-0 right-0 bottom-0 z-10 px-4 pb-4 pt-3 bg-gradient-to-t from-white/90 to-white/40 backdrop-blur-md border-t border-gray-200/60">
          <div className="max-w-md mx-auto">
            <Button
              onClick={onRestart}
              variant="gradient"
              size="lg"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#7967e5] to-[#99eafc] hover:from-[#6d5ce7] hover:to-[#88d8f0] shadow-lg hover:shadow-xl"
            >
              <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
              <span className="text-white font-semibold">
                {t("features.gameplay.restart")}
              </span>
            </Button>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 pointer-events-none">
          <div className="w-1 h-1 bg-green-400/40 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-green-400/40 rounded-full animate-pulse delay-200"></div>
          <div className="w-1 h-1 bg-green-400/40 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </Modal>
  );
};
