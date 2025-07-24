import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { GameLogic } from "@/core/game-logic/gameLogic";

interface ScoreDisplayProps {
  distance: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ distance }) => {
  const { t } = useTranslations();

  return (
    <div className="mb-6">
      <Text
        variant="subtitle"
        size="lg"
        className="mb-2 text-white font-semibold"
      >
        {t("features.blockchain.currentScore")}
      </Text>
      <div className="mb-4">
        <div
          className="inline-block px-6 py-3 rounded-lg border-2 border-white/20 shadow-lg"
          style={{
            background: `linear-gradient(to bottom right, #4ade80, #16a34a)`,
          }}
        >
          <span className="text-3xl font-bold text-white">
            {GameLogic.formatDistance(distance)} {t("features.gameplay.meters")}
          </span>
        </div>
      </div>
    </div>
  );
};
