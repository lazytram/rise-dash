import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { blockchainService } from "@/services/blockchainService";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Box } from "@/components/ui/Box";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";

interface LeaderboardProps {
  onClose?: () => void;
}

interface BestScore {
  playerName: string;
  bestScore: bigint;
  timestamp: bigint;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const { t } = useTranslations();
  const { address, isConnected } = useAccount();
  const [bestScores, setBestScores] = useState<BestScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBestScores = useCallback(async () => {
    try {
      setLoading(true);
      // Get all scores first to extract unique players
      const allScores = await blockchainService.getPlayerScores(address!);

      // Group scores by player and find the best score for each
      const playerBestScores = new Map<string, BestScore>();

      allScores.forEach((score) => {
        const existing = playerBestScores.get(score.playerName);
        if (!existing || score.score > existing.bestScore) {
          playerBestScores.set(score.playerName, {
            playerName: score.playerName,
            bestScore: score.score,
            timestamp: score.timestamp,
          });
        }
      });

      // Convert to array and sort by best score (descending)
      const sortedBestScores = Array.from(playerBestScores.values()).sort(
        (a, b) => Number(b.bestScore - a.bestScore)
      );

      setBestScores(sortedBestScores);
    } catch (err) {
      console.error("Error loading best scores:", err);
      setError("Error loading best scores");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadBestScores();
    }
  }, [isConnected, address, loadBestScores]);

  const formatScore = (score: bigint) => {
    return score.toString();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (!isConnected) {
    return (
      <Modal size="sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("blockchain.leaderboard")}
        </h2>
        <Text variant="error" className="mb-4">
          {t("blockchain.connectWalletToView")}
        </Text>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {t("common.close")}
          </button>
        )}
      </Modal>
    );
  }

  return (
    <Modal size="md" className="max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("blockchain.bestScores")}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <Box variant="centered">
          <LoadingSpinner className="mx-auto mb-4" />
          <Text variant="subtitle">{t("blockchain.loadingScores")}</Text>
        </Box>
      ) : error ? (
        <Box variant="centered">
          <Text variant="error" className="mb-4">
            {error}
          </Text>
          <Button onClick={loadBestScores} variant="primary">
            {t("common.retry")}
          </Button>
        </Box>
      ) : bestScores.length === 0 ? (
        <Box variant="centered">
          <Text variant="subtitle" className="mb-4">
            {t("blockchain.noScoresYet")}
          </Text>
          <Text variant="caption">{t("blockchain.playToEarnScores")}</Text>
        </Box>
      ) : (
        <div className="space-y-4">
          {bestScores.map((bestScore, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: UI_COLORS.GRADIENT_FROM }}
                >
                  {index + 1}
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      bestScore.playerName === address
                        ? "text-purple-600"
                        : "text-gray-800"
                    }`}
                  >
                    {bestScore.playerName}
                  </p>
                  <Text variant="caption">
                    {formatDate(bestScore.timestamp)}
                  </Text>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-xl font-bold"
                  style={{ color: UI_COLORS.GRADIENT_FROM }}
                >
                  {formatScore(bestScore.bestScore)} {t("game.meters")}
                </div>
                <Text variant="caption">{t("blockchain.bestScoreLabel")}</Text>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Text variant="caption" className="text-center">
          {t("blockchain.scoresOnBlockchain")}
        </Text>
      </div>
    </Modal>
  );
};
