import React from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { useToastStore } from "@/infrastructure/store/toastStore";

interface ScoreActionsProps {
  onSaveScore: () => void;
  onClose?: () => void;
  isRecording: boolean;
  isSubmitting: boolean;
  error?: Error | null;
}

export const ScoreActions: React.FC<ScoreActionsProps> = ({
  onSaveScore,
  onClose,
  isRecording,
  isSubmitting,
  error,
}) => {
  const { t } = useTranslations();
  const { isConnected } = useAccount();
  const { showInfo } = useToastStore();

  const handleSaveClick = () => {
    if (!isConnected) {
      showInfo(
        t("features.blockchain.connectWallet"),
        t("features.blockchain.connectWalletMessage")
      );
      return;
    }
    onSaveScore();
  };

  if (!isConnected) {
    return (
      <div className="mb-6">
        <Text variant="error" className="mb-4">
          {t("features.blockchain.connectWalletToSave")}
        </Text>
        <Button onClick={onClose} variant="secondary">
          {t("common.cancel")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleSaveClick}
          disabled={isRecording || isSubmitting}
          variant="primary"
        >
          {isRecording || isSubmitting
            ? t("features.blockchain.saving")
            : t("features.blockchain.saveScore")}
        </Button>
        {onClose && (
          <Button onClick={onClose} variant="secondary">
            {t("common.cancel")}
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 text-red-200 rounded">
          {error?.message || t("features.blockchain.errorSaving")}
        </div>
      )}
    </>
  );
};
