"use client";

import React from "react";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { DailyRevealCard } from "./index";
import { RevealButton } from "./RevealButton";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsTable } from "./RewardsTable";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useRice } from "@/shared/hooks/useRice";
import { useDailyRevealSelectors } from "@/infrastructure/store/dailyRevealStore";
import { DailyRevealContentProps } from "./types";

export const DailyRevealContent: React.FC<DailyRevealContentProps> = ({
  className = "",
}) => {
  const { t } = useTranslations();
  const { addRICE } = useRice();
  const { canReveal, isSpinning, selectedCard, isRevealed, revealCard } =
    useDailyRevealSelectors();

  const handleReveal = async () => {
    if (!canReveal || isSpinning) return;

    try {
      await revealCard();

      // Add RICE reward based on the revealed card value
      if (selectedCard && selectedCard.value > 0) {
        try {
          await addRICE(selectedCard.value);
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
    <Container className={`py-6 ${className}`}>
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-4">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.dailyReveal.title")}
          subtitle={t("scenes.dailyReveal.subtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Daily Streak Card */}
          <div className="flex flex-col items-center space-y-4">
            <DailyRevealCard
              size={280}
              onClick={handleReveal}
              card={selectedCard}
              isSpinning={isSpinning}
              isRevealed={isRevealed}
            />
            <RevealButton
              onClick={handleReveal}
              disabled={!canReveal || isSpinning}
            />
            <CountdownTimer />
          </div>

          {/* Rewards Table */}
          <div className="flex flex-col">
            <RewardsTable />
          </div>
        </div>
      </Card>
    </Container>
  );
};
