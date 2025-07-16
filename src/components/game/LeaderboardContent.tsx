"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/hooks/useTranslations";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useBlockchainScore } from "@/hooks/useBlockchainScore";
import { LeaderboardEntry } from "@/services/blockchainService";
import {
  LeaderboardTable,
  EmptyLeaderboard,
  LeaderboardHeader,
  LeaderboardStats,
} from "./leaderboard";

interface LeaderboardEntryWithRank extends LeaderboardEntry {
  rank: number;
}

export const LeaderboardContent: React.FC = () => {
  const { t } = useTranslations();
  const { isConnected } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntryWithRank[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const itemsPerPage = 10;

  const { getLeaderboard, getTotalScores } = useBlockchainScore();

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!isConnected) return;

      setIsLoading(true);
      try {
        // Get total number of scores
        const total = await getTotalScores();
        setTotalEntries(Number(total));
        setTotalPages(Math.ceil(Number(total) / itemsPerPage));

        // Get leaderboard data for current page
        const offset = (currentPage - 1) * itemsPerPage;
        const data = await getLeaderboard(offset, itemsPerPage);

        // Add rank to each entry
        const rankedData: LeaderboardEntryWithRank[] = data.map(
          (entry, index) => ({
            ...entry,
            rank: offset + index + 1,
          })
        );

        setLeaderboardData(rankedData);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [isConnected, currentPage, getLeaderboard, getTotalScores]);

  if (!isConnected) {
    return (
      <Container>
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("blockchain.leaderboard")}
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
        <LeaderboardHeader />

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner color="white" />
          </div>
        ) : leaderboardData.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          <>
            <LeaderboardTable data={leaderboardData} />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            <LeaderboardStats
              currentPage={currentPage}
              totalEntries={totalEntries}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>
    </Container>
  );
};
