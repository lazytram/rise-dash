import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

const fetchPlayerScores = async (
  address: `0x${string}`
): Promise<PlayerScore[]> => {
  const scores = await blockchainService.getPlayerScores(address);

  // Sort scores by score (descending) and then by timestamp (descending)
  return scores.sort((a, b) => {
    if (a.score !== b.score) {
      return Number(b.score - a.score);
    }
    return Number(b.timestamp - a.timestamp);
  });
};

export const useGameHistory = () => {
  const { address, isConnected } = useAccount();
  const { t } = useTranslations();

  const {
    data: playerScores = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["playerScores", address],
    queryFn: () => fetchPlayerScores(address!),
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const retry = () => {
    refetch();
  };

  // Enhanced error handling with specific error types
  const getErrorMessage = () => {
    if (!error) return null;

    // Handle specific error types
    if (error.message.includes("network")) {
      return t("errors.networkError");
    }
    if (error.message.includes("timeout")) {
      return t("errors.timeoutError");
    }
    if (error.message.includes("unauthorized")) {
      return t("errors.unauthorizedError");
    }

    // Generic error with fallback
    return t("errors.loadingScoresError", {
      fallback: "Error loading player scores",
    });
  };

  return {
    playerScores,
    loading,
    error: getErrorMessage(),
    retry,
  };
};
