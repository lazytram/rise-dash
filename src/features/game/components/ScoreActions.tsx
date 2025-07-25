import React from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
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
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <Text variant="body" className="text-white/70 font-medium text-sm">
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
    <button
      onClick={onSave}
      disabled={isRecording || isSubmitting || !isConnected}
      className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 border border-violet-400/30 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
    >
      {isRecording || isSubmitting ? (
        <>
          <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{t("features.blockchain.saving")}</span>
        </>
      ) : (
        <>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
          <span>{t("features.blockchain.saveScore")}</span>
        </>
      )}
    </button>
  );
};

// Restart Button Component
const RestartButton: React.FC<{ onRestart?: () => void }> = ({ onRestart }) => {
  const { t } = useTranslations();

  if (!onRestart) return null;

  return (
    <button
      onClick={onRestart}
      className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-emerald-400/30 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
    >
      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
      <span>{t("scenes.game.restart")}</span>
    </button>
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
    <div className="w-full max-w-md p-3 bg-red-500/10 border border-red-400/20 rounded-lg backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse flex-shrink-0"></div>
        <Text variant="body" className="text-red-200/90 font-medium text-xs">
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
