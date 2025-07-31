import React from "react";
import { Text } from "../../../shared/components/Text";
import { StatusIndicator } from "../../../shared/components/StatusIndicator";
import { GameRewards } from "../../../shared/types/game";
import { useTranslations } from "../../../shared/hooks/useTranslations";
import { RiceLogo } from "../../../shared/components/RiceLogo";

interface RewardBreakdownProps {
  rewards: GameRewards;
  isScoreSaved?: boolean;
}

export const RewardBreakdown: React.FC<RewardBreakdownProps> = ({
  rewards,
  isScoreSaved = false,
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Enhanced Title */}
      <div className="mb-3 sm:mb-4 text-center">
        <Text
          variant="subtitle"
          size="lg"
          className="text-white/90 font-semibold tracking-wider uppercase text-xs sm:text-sm"
        >
          {t("features.gameplay.distanceRewards")}
        </Text>
        <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mt-1 sm:mt-2 rounded-full"></div>
      </div>

      {/* Total Rewards Card */}
      <div className="relative group w-full max-w-xs mb-3 sm:mb-4">
        <div className="relative bg-gradient-to-br from-orange-600/90 via-yellow-600/90 to-amber-600/90 rounded-lg p-4 sm:p-5 shadow-xl border border-orange-400/40 backdrop-blur-md transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-orange-500/30 group-hover:border-orange-300/60">
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            {/* Total Amount */}
            <div className="flex items-center space-x-2">
              <RiceLogo size={20} className="sm:w-5 sm:h-5 text-white/90" />
              <div className="flex items-baseline space-x-1 sm:space-x-2">
                <Text
                  variant="title"
                  size="2xl"
                  className="sm:text-3xl text-white font-bold tracking-wide drop-shadow-lg"
                >
                  {rewards.totalRice}
                </Text>
                <Text
                  variant="body"
                  className="text-white/80 font-medium text-xs sm:text-sm tracking-wide"
                >
                  RICE
                </Text>
              </div>
            </div>

            {/* Total Earned Label */}
            <Text
              variant="body"
              className="text-white/70 font-medium text-xs tracking-wide uppercase"
            >
              {t("features.gameplay.totalEarned")}
            </Text>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1.5 w-0.5 h-0.5 bg-orange-300/60 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-1.5 w-0.5 h-0.5 bg-yellow-300/60 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Enhanced Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-yellow-500/20 to-amber-500/30 rounded-lg blur-lg -z-10 group-hover:blur-xl transition-all duration-500"></div>
      </div>

      {/* Milestones Breakdown */}
      <div className="w-full max-w-xs mb-3 sm:mb-4">
        <div className="mb-2 sm:mb-3 text-center">
          <Text
            variant="body"
            className="text-white/80 font-medium text-xs tracking-wide uppercase"
          >
            {t("features.gameplay.milestonesReached")}
          </Text>
        </div>

        <div className="max-h-20 sm:max-h-24 overflow-y-auto space-y-1.5 sm:space-y-2 pr-1">
          {rewards.distanceRewards.slice(0, 3).map((reward, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 sm:p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2">
                <RiceLogo size={12} className="sm:w-3 sm:h-3 text-white/70" />
                <Text
                  variant="body"
                  className="text-white/80 font-medium text-xs"
                >
                  {t("features.gameplay.partialReward", {
                    distance: reward.distance,
                  })}
                </Text>
              </div>
              <div className="flex items-center space-x-1">
                <Text
                  variant="body"
                  className="text-white font-semibold text-xs sm:text-sm"
                >
                  +{reward.riceReward}
                </Text>
                <RiceLogo size={12} className="sm:w-3 sm:h-3 text-white/70" />
              </div>
            </div>
          ))}
          {rewards.distanceRewards.length > 3 && (
            <div className="text-center py-1.5 sm:py-2">
              <Text
                variant="body"
                className="text-white/60 font-medium text-xs"
              >
                {t("features.gameplay.moreMilestones", {
                  count: rewards.distanceRewards.length - 3,
                })}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-auto text-center">
        <StatusIndicator
          status={isScoreSaved ? "success" : "warning"}
          message={t(
            isScoreSaved
              ? "features.blockchain.rewardsRetrieved"
              : "features.blockchain.rewardsAvailable"
          )}
        />
      </div>
    </div>
  );
};
