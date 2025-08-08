"use client";

import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { DailyRevealCard } from "./index";
import { RevealButton } from "./RevealButton";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsTable } from "./RewardsTable";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useRice } from "@/shared/hooks/useRice";
import {
  useDailyRevealSelectors,
  useDailyRevealStore,
} from "@/infrastructure/store/dailyRevealStore";
import { DailyRevealContentProps } from "./types";

export const DailyRevealContent: React.FC<DailyRevealContentProps> = ({
  className = "",
}) => {
  const { t } = useTranslations();
  const { address } = useAccount();
  const { addRICE, addDailyRevealRICE } = useRice();
  const { canReveal, isSpinning, selectedCard, isRevealed, revealCard } =
    useDailyRevealSelectors(address);
  const { initializeStore } = useDailyRevealStore();

  // Initialize store on component mount
  useEffect(() => {
    if (address) {
      initializeStore(address);
    }
  }, [initializeStore, address]);

  const handleReveal = async () => {
    if (!canReveal || isSpinning || !address) return;

    try {
      // Reveal the card and get the selected card
      const revealedCard = await revealCard();

      // Add RICE reward based on the revealed card value
      if (revealedCard && revealedCard.value > 0) {
        try {
          // In development mode, use addRICE (30s cooldown) for easier testing
          // In production mode, use addDailyRevealRICE (24h cooldown)
          const isDevelopment = process.env.NODE_ENV === "development";
          const addRiceFunction = isDevelopment ? addRICE : addDailyRevealRICE;

          await addRiceFunction(revealedCard.value);
        } catch (error) {
          console.error("Failed to add daily RICE reward:", error);
          // Don't show error to user as this is optional
        }
      }
    } catch (error) {
      console.error("Failed to reveal card:", error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Daily Streak Card */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t("features.dailyReveal.title")}
          </h2>
          <DailyRevealCard
            size={280}
            onClick={handleReveal}
            card={selectedCard}
            isSpinning={isSpinning}
            isRevealed={isRevealed}
          />
          <RevealButton
            onClick={handleReveal}
            disabled={!canReveal || isSpinning || !address}
          />
          <CountdownTimer />
        </div>

        {/* Rewards Table */}
        <div className="flex flex-col">
          <RewardsTable />
        </div>
      </div>
    </div>
  );
};
