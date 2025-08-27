"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";

interface TapeRiceResultsBarProps {
  visible: boolean;
  score: number;
  riceEarned: number;
  onPlayAgain: () => void;
}

export const TapeRiceResultsBar: React.FC<TapeRiceResultsBarProps> = memo(
  function TapeRiceResultsBar({ visible, score, riceEarned, onPlayAgain }) {
    const { t } = useTranslations();
    if (!visible) return null;
    return (
      <div className="mt-6 flex items-center justify-between gap-3 sm:gap-6">
        <div className="text-sm text-muted-foreground ">
          {t("scenes.tapeRice.finalScore")}: {score}
        </div>
        <div className="text-sm font-semibold gradient-bg text-white px-3 py-1 rounded-lg shadow">
          {t("scenes.tapeRice.riceEarned", { amount: riceEarned })}
        </div>
        <Button className="shrink-0" onClick={onPlayAgain}>
          {t("scenes.tapeRice.actions.playAgain")}
        </Button>
      </div>
    );
  }
);
