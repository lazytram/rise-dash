"use client";

import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { DailyRevealService } from "@/shared/services/dailyRevealService";
import { getRarityStyles } from "./utils";
import { RewardsTableProps } from "./types";

export const RewardsTable: React.FC<RewardsTableProps> = () => {
  const { t } = useTranslations();
  const rewards = DailyRevealService.getCardRewards();

  // Sort rewards by value in ascending order
  const sortedRewards = [...rewards].sort((a, b) => a.value - b.value);

  return (
    <div className="w-full max-w-md mx-auto h-[350px] p-3 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-xl border border-amber-400/30 backdrop-blur-sm flex flex-col">
      {/* Simple Header */}
      <div className="flex-shrink-0 mb-3">
        <h3 className="text-lg font-bold text-amber-700 text-center drop-shadow-sm">
          {t("scenes.dailyReveal.possibleRewards")}
        </h3>
      </div>

      {/* Simple Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 flex-1">
        {sortedRewards.map((reward) => {
          const styles = getRarityStyles(reward.rarity);

          return (
            <div
              key={reward.id}
              className="flex flex-col items-center space-y-1 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm border hover:bg-white/90 transition-all duration-200 group shadow-sm"
              style={{
                borderColor: styles.borderColor,
                boxShadow: `0 0 8px ${styles.glowColor}20`,
              }}
            >
              <div className="text-base group-hover:scale-110 transition-transform">
                {reward.emoji}
              </div>

              <div className="text-center">
                <div className="text-gray-900 font-bold text-xs drop-shadow-sm">
                  +{reward.value} RICE
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-800 font-semibold text-xs truncate max-w-full drop-shadow-sm">
                  {t(`scenes.dailyReveal.cards.${reward.label}`)}
                </div>
              </div>

              <div
                className="px-1 py-0.5 rounded-full text-xs font-bold border shadow-sm"
                style={{
                  backgroundColor: `${styles.borderColor}15`,
                  borderColor: styles.borderColor,
                  color: styles.borderColor,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {DailyRevealService.getRarityLabel(reward.rarity, t)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Info Box */}
      <div className="mt-3 p-2 bg-white/80 rounded-lg border border-gray-200/50 flex-shrink-0 shadow-sm">
        <div className="text-gray-700 text-xs text-center drop-shadow-sm">
          {t("scenes.dailyReveal.subtitle")}
        </div>
      </div>
    </div>
  );
};
