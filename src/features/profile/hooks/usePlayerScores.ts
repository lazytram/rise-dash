import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

export const usePlayerScores = () => {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["playerScores", address],
    queryFn: async (): Promise<PlayerScore[]> => {
      if (!address) {
        throw new Error("No address provided");
      }

      const scores = await blockchainService.getPlayerScores(address);

      // Sort scores by score (descending) and then by timestamp (descending)
      return scores.sort((a, b) => {
        if (a.score !== b.score) {
          return Number(b.score - a.score);
        }
        return Number(b.timestamp - a.timestamp);
      });
    },
    enabled: isConnected && !!address,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const invalidatePlayerScores = () => {
    queryClient.invalidateQueries({ queryKey: ["playerScores", address] });
  };

  return {
    ...query,
    invalidatePlayerScores,
  };
};
