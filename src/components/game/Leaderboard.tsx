import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { blockchainService } from "@/services/blockchainService";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "../ui/Button";

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
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-20 rounded-lg animate-fade-in">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("blockchain.leaderboard")}
          </h2>
          <p className="text-red-600 mb-4">
            {t("blockchain.connectWalletToView")}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {t("common.close")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-20 rounded-lg animate-fade-in">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl animate-scale-in max-h-[80vh] overflow-y-auto">
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("blockchain.loadingScores")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadBestScores} variant="primary">
              {t("common.retry")}
            </Button>
          </div>
        ) : bestScores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{t("blockchain.noScoresYet")}</p>
            <p className="text-sm text-gray-500">
              {t("blockchain.playToEarnScores")}
            </p>
          </div>
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
                    <p className="text-sm text-gray-500">
                      {formatDate(bestScore.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xl font-bold"
                    style={{ color: UI_COLORS.GRADIENT_FROM }}
                  >
                    {formatScore(bestScore.bestScore)} {t("game.meters")}
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("blockchain.bestScoreLabel")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {t("blockchain.scoresOnBlockchain")}
          </p>
        </div>
      </div>
    </div>
  );
};
