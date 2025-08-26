import React from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { useToastStore } from "@/infrastructure/store/toastStore";

interface ScoreActionsProps {
  onSaveScore: () => void;
  onRestart?: () => void;
  isRecording: boolean;
  isSubmitting: boolean;
  error?: Error | null;
}

// Connection Status Component
const ConnectionStatus: React.FC<{ isConnected: boolean }> = ({
  isConnected,
}) => {
  const { t } = useTranslations();

  if (isConnected) return null;

  return (
    <div className="text-center">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/15 rounded-full border border-red-500/40 backdrop-blur-sm shadow-md">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
        <Text variant="body" className="text-red-700 font-bold text-sm">
          {t("features.blockchain.connectWalletToSave")}
        </Text>
      </div>
    </div>
  );
};

// Save Score Button Component
const SaveScoreButton: React.FC<{
  onSave: () => void;
  isRecording: boolean;
  isSubmitting: boolean;
  isConnected: boolean;
}> = ({ onSave, isRecording, isSubmitting, isConnected }) => {
  const { t } = useTranslations();

  return (
    <Button
      onClick={onSave}
      disabled={isRecording || isSubmitting || !isConnected}
      variant="gradient"
      size="md"
      className="flex-1 py-3 bg-gradient-to-r from-[#7967e5] to-[#99eafc] hover:from-[#6d5ce7] hover:to-[#88d8f0] shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRecording || isSubmitting ? (
        <>
          <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{t("features.blockchain.saving")}</span>
        </>
      ) : (
        <>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full shadow-sm"></div>
          <span>{t("features.blockchain.saveScore")}</span>
        </>
      )}
    </Button>
  );
};

// Restart Button Component
const RestartButton: React.FC<{ onRestart?: () => void }> = ({ onRestart }) => {
  const { t } = useTranslations();

  if (!onRestart) return null;

  return (
    <Button
      onClick={onRestart}
      variant="ghost"
      size="md"
      className="flex-1 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600/50 shadow-lg hover:shadow-xl"
    >
      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full shadow-sm"></div>
      <span>{t("scenes.game.restart")}</span>
    </Button>
  );
};

// Error Display Component
const ErrorDisplay: React.FC<{ error?: Error | null }> = ({ error }) => {
  const { t } = useTranslations();

  if (!error) return null;

  const getErrorMessage = (errorMessage?: string) => {
    if (errorMessage?.includes("User rejected")) {
      return t("features.gameplay.userRejected");
    }
    if (errorMessage?.includes("insufficient funds")) {
      return t("features.gameplay.insufficientFunds");
    }
    if (errorMessage?.includes("network")) {
      return t("features.gameplay.networkError");
    }
    return t("features.gameplay.generalError");
  };

  return (
    <div className="w-full max-w-md p-3 bg-red-500/15 border border-red-500/40 rounded-lg backdrop-blur-sm shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0 shadow-sm"></div>
        <Text variant="body" className="text-red-700 font-bold text-xs">
          {getErrorMessage(error?.message)}
        </Text>
      </div>
    </div>
  );
};

// Main Component
export const ScoreActions: React.FC<ScoreActionsProps> = ({
  onSaveScore,
  onRestart,
  isRecording,
  isSubmitting,
  error,
}) => {
  const { isConnected } = useAccount();
  const { showInfo } = useToastStore();
  const { t } = useTranslations();

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

  return (
    <div className="flex flex-col items-center space-y-4">
      <ConnectionStatus isConnected={isConnected} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md">
        <SaveScoreButton
          onSave={handleSaveClick}
          isRecording={isRecording}
          isSubmitting={isSubmitting}
          isConnected={isConnected}
        />
        <RestartButton onRestart={onRestart} />
      </div>

      <ErrorDisplay error={error} />
    </div>
  );
};
