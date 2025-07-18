"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  LeaderboardStats,
  EmptyLeaderboard,
} from "./leaderboard";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SceneType } from "@/types/scenes";

interface LeaderboardEntryWithRank extends LeaderboardEntry {
  rank: number;
}

export const LeaderboardContent: React.FC = () => {
  const { t } = useTranslations();
  const { isConnected, address } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntryWithRank[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemsPerPage = 10;
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { getLeaderboard, getTotalScores } = useBlockchainScore();

  const loadLeaderboard = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the call
    timeoutRef.current = setTimeout(async () => {
      if (!isConnected) return;

      try {
        loadingRef.current = true;
        setIsLoading(true);
        setHasError(false);
        setErrorMessage(null);

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
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error occurred";
        setErrorMessage(errorMsg);
        // Set default values on error to prevent infinite retries
        setTotalEntries(0);
        setTotalPages(1);
        setLeaderboardData([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }, 300); // 300ms debounce
  }, [isConnected, currentPage, getTotalScores, getLeaderboard, itemsPerPage]);

  useEffect(() => {
    loadLeaderboard();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadLeaderboard]);

  if (!isConnected) {
    return (
      <Container className="py-8">
        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("scenes.leaderboard.title")}
          </h2>
          <Text variant="error" className="mb-4">
            {t("scenes.leaderboard.connectWalletToView")}
          </Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.leaderboard.title")}
          subtitle={t("scenes.leaderboard.subtitle")}
          menuColorKey={SceneType.LEADERBOARD}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner color="white" />
          </div>
        ) : hasError ? (
          <div className="text-center">
            <Text variant="subtitle" className="text-red-400">
              {errorMessage || t("scenes.leaderboard.leaderboardError")}
            </Text>
            <Text variant="caption" className="text-white/60">
              {t("scenes.leaderboard.leaderboardErrorDescription")}
            </Text>
          </div>
        ) : leaderboardData.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          <>
            <LeaderboardTable data={leaderboardData} userAddress={address} />

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
              totalPages={totalPages}
              totalScores={totalEntries}
            />
          </>
        )}
      </Card>
    </Container>
  );
};
