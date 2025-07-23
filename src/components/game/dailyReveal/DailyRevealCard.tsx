"use client";

import React, { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useDailyRevealSelectors } from "@/store/dailyRevealStore";
import { Card } from "./Card";
import { RevealButton } from "./RevealButton";
import { isDevelopmentMode } from "./utils";
import { DailyRevealCardProps } from "./types";
import { CountdownTimer } from "./CountdownTimer";
import { useToastStore } from "@/store/toastStore";

export const DailyRevealCard: React.FC<DailyRevealCardProps> = ({
  size = 300,
  className = "",
}) => {
  const {
    canReveal,
    isSpinning,
    selectedCard,
    isRevealed,
    revealCard,
    checkRevealAvailability,
  } = useDailyRevealSelectors();

  const { showSuccess, showError } = useToastStore();
  const { t } = useTranslations();
  const isDevelopment = isDevelopmentMode();

  useEffect(() => {
    const interval = setInterval(checkRevealAvailability, 1000);
    return () => clearInterval(interval);
  }, [checkRevealAvailability]);

  const handleReveal = async () => {
    if (isSpinning || (!isDevelopment && !canReveal)) return;

    try {
      const revealedCard = await revealCard();

      if (revealedCard) {
        if (revealedCard.value > 0) {
          showSuccess(
            t("scenes.dailyReveal.congratulations"),
            t("scenes.dailyReveal.youWon", { amount: revealedCard.value })
          );
        } else {
          showError(
            t("scenes.dailyReveal.tooBad"),
            t("scenes.dailyReveal.nothingWon")
          );
        }
      }
    } catch (error) {
      console.error("Error revealing card:", error);
      showError(
        t("scenes.dailyReveal.error"),
        t("scenes.dailyReveal.revealError")
      );
    }
  };

  const handleCardClick = () => {
    if (!isRevealed && (isDevelopment || canReveal)) {
      handleReveal();
    }
  };

  const isButtonDisabled = isDevelopment ? false : !canReveal || isRevealed;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Card
        card={selectedCard}
        isSpinning={isSpinning}
        isRevealed={isRevealed}
        size={size}
        onClick={handleCardClick}
      />

      <div className="mt-4">
        <CountdownTimer />
      </div>

      {!isSpinning && (
        <div className="mt-3">
          <RevealButton onClick={handleReveal} disabled={isButtonDisabled} />
        </div>
      )}
    </div>
  );
};
