import React from "react";
import Image from "next/image";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { Modal } from "@/shared/components/Modal";
import { GameLogic } from "@/core/game-logic/gameLogic";

interface ScoreSuccessProps {
  distance: number;
  isNewPersonalBest: boolean;
  onClose?: () => void;
}

export const ScoreSuccess: React.FC<ScoreSuccessProps> = ({
  distance,
  isNewPersonalBest,
  onClose,
}) => {
  const { t } = useTranslations();

  return (
    <Modal size="sm">
      <div className="text-center">
        <div className="mb-6">
          <Image
            src="/armchair.png"
            alt="Victory"
            width={95}
            height={95}
            className="mx-auto mb-4 animate-bounce"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {isNewPersonalBest
            ? t("features.blockchain.newRecord")
            : t("features.blockchain.scoreSaved")}
        </h2>
        <Text
          variant="subtitle"
          size="lg"
          className="mb-6 text-white font-medium"
        >
          {t("features.blockchain.scoreRecorded")}:{" "}
          {GameLogic.formatDistance(distance)} {t("features.gameplay.meters")}
        </Text>
        {onClose && (
          <div className="flex justify-center">
            <Button onClick={onClose} variant="primary">
              {t("common.continue")}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
