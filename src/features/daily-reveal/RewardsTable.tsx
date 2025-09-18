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
    <div
      className="w-full max-w-md mx-auto h-[350px] p-3 rounded-xl backdrop-blur-sm flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,193,7,0.12) 0%, rgba(255,138,0,0.10) 100%)",
        border: "1px solid rgba(255,179,0,0.35)",
        boxShadow: "0 8px 18px rgba(255,179,0,0.10)",
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <h3 className="text-xl font-extrabold text-amber-900 text-center tracking-wide">
          {t("scenes.dailyReveal.possibleRewards")}
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 flex-1">
        {sortedRewards.map((reward) => {
          const styles = getRarityStyles(reward.rarity);

          return (
            <div
              key={reward.id}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/85 border hover:bg-white transition-all duration-200 group shadow"
              style={{
                borderColor: styles.borderColor,
                boxShadow: `0 0 8px ${styles.glowColor}20`,
              }}
            >
              <div className="text-lg group-hover:scale-110 transition-transform">
                {reward.emoji}
              </div>

              <div className="text-center">
                <div className="text-gray-900 font-bold text-sm drop-shadow-sm">
                  +{reward.value} RICE
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-800 font-semibold text-xs truncate max-w-full drop-shadow-sm">
                  {t(`scenes.dailyReveal.cards.${reward.label}`)}
                </div>
              </div>

              <div
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm"
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

      {/* Info Box */}
      <div className="mt-3 p-2 bg-white/90 rounded-lg border border-gray-200/60 flex-shrink-0 shadow-sm">
        <div className="text-gray-800 text-xs text-center drop-shadow-sm">
          {t("scenes.dailyReveal.subtitle")}
        </div>
      </div>
    </div>
  );
};
