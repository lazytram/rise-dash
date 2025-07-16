import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { blockchainService } from "@/services/blockchainService";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { Table, TableHeader, TableCell } from "@/components/ui/Table";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

export const ProfileContent: React.FC = () => {
  const { t } = useTranslations();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayerScores = useCallback(async () => {
    try {
      setLoading(true);
      const scores = await blockchainService.getPlayerScores(address!);

      // Sort scores by score (descending) and then by timestamp (descending)
      const sortedScores = scores.sort((a, b) => {
        if (a.score !== b.score) {
          return Number(b.score - a.score);
        }
        return Number(b.timestamp - a.timestamp);
      });

      setPlayerScores(sortedScores);
    } catch (err) {
      console.error("Error loading player scores:", err);
      setError("Error loading player scores");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadPlayerScores();
    }
  }, [isConnected, address, loadPlayerScores]);

  const formatScore = (score: bigint) => {
    return score.toString();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getBestScore = () => {
    if (playerScores.length === 0) return 0;
    return Number(playerScores[0].score);
  };

  const getTotalGames = () => {
    return playerScores.length;
  };

  if (!isConnected) {
    return (
      <Container>
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("profile.title")}
          </h2>
          <Text variant="error" className="mb-4">
            {t("blockchain.connectWalletToView")}
          </Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("profile.title")}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              router.push("/");
            }}
          >
            {t("common.back")}
          </Button>
        </div>

        {/* Profile Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="gradient-purple">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.bestScore")}
            </h3>
            <Text variant="bold" size="2xl">
              {getBestScore()} {t("game.meters")}
            </Text>
          </Card>
          <Card variant="gradient-blue">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.totalGames")}
            </h3>
            <Text variant="bold" size="2xl">
              {getTotalGames()}
            </Text>
          </Card>
          <Card variant="gradient-green">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.averageScore")}
            </h3>
            <Text variant="bold" size="2xl">
              {playerScores.length > 0
                ? Math.round(
                    playerScores.reduce(
                      (acc, score) => acc + Number(score.score),
                      0
                    ) / playerScores.length
                  )
                : 0}{" "}
              {t("game.meters")}
            </Text>
          </Card>
        </div>

        {/* Scores Table Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("profile.gameHistory")}
          </h3>

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
              <Button onClick={loadPlayerScores} variant="primary">
                {t("common.retry")}
              </Button>
            </Box>
          ) : playerScores.length === 0 ? (
            <Box variant="centered">
              <Text variant="subtitle" className="mb-4">
                {t("blockchain.noScoresYet")}
              </Text>
              <Text variant="caption">{t("blockchain.playToEarnScores")}</Text>
            </Box>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <TableHeader>#</TableHeader>
                    <TableHeader>{t("profile.score")}</TableHeader>
                    <TableHeader>{t("profile.date")}</TableHeader>
                    <TableHeader>{t("profile.status")}</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {playerScores.map((score, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="text-gray-600">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-bold text-lg"
                          style={{ color: UI_COLORS.GRADIENT_FROM }}
                        >
                          {formatScore(score.score)} {t("game.meters")}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(score.timestamp)}
                      </TableCell>
                      <TableCell>
                        {index === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t("profile.personalBest")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {t("profile.completed")}
                          </span>
                        )}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Future Sections Placeholder */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("profile.achievements")}
          </h3>
          <Box variant="centered" className="text-gray-500">
            <p>{t("profile.comingSoon")}</p>
          </Box>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Text variant="caption" className="text-center">
            {t("blockchain.scoresOnBlockchain")}
          </Text>
        </div>
      </Card>
    </Container>
  );
};
