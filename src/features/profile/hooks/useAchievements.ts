import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  icon: string;
}

export const useAchievements = () => {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ["achievements", address],
    queryFn: async (): Promise<Achievement[]> => {
      if (!address) {
        throw new Error("No address provided");
      }

      // TODO: Implement actual achievements loading logic
      // For now, return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return [
        {
          id: "first-game",
          name: "First Game",
          description: "Complete your first game",
          unlocked: true,
          unlockedAt: new Date(),
          icon: "🎮",
        },
        {
          id: "score-1000",
          name: "Score 1000",
          description: "Score 1000 meters in a single game",
          unlocked: false,
          icon: "🏆",
        },
        {
          id: "score-5000",
          name: "Score 5000",
          description: "Score 5000 meters in a single game",
          unlocked: false,
          icon: "👑",
        },
      ];
    },
    enabled: isConnected && !!address,
    staleTime: 60000, // Consider data stale after 1 minute
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
