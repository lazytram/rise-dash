"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { Pagination } from "@/shared/components/Pagination";
import { Loader } from "@/shared/components/Loader";
import { AnimatedContainer } from "@/shared/components/AnimatedContainer";
import { useBlockchainScore } from "@/shared/hooks/useBlockchainScore";
import { LeaderboardEntry } from "@/infrastructure/blockchain/blockchainService";
import { LeaderboardTable, LeaderboardStats, EmptyLeaderboard } from "./index";

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
        console.log("total", total);
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
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" delay={100}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("scenes.leaderboard.title")}
          </h2>
          <Text variant="error" className="mb-4">
            {t("scenes.leaderboard.connectWalletToView")}
          </Text>
        </AnimatedContainer>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatedContainer animation="scaleIn" delay={100}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader
              size="lg"
              color="gradient"
              text={t("scenes.leaderboard.loadingScores")}
            />
          </div>
        ) : hasError ? (
          <AnimatedContainer animation="fadeIn" delay={200}>
            <div className="text-center">
              <Text variant="subtitle" className="text-red-400">
                {errorMessage || t("scenes.leaderboard.leaderboardError")}
              </Text>
              <Text variant="caption" className="text-white/60">
                {t("scenes.leaderboard.leaderboardErrorDescription")}
              </Text>
            </div>
          </AnimatedContainer>
        ) : leaderboardData.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          <div className="space-y-8">
            <LeaderboardTable data={leaderboardData} userAddress={address} />

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <AnimatedContainer animation="slideUp" delay={600}>
                <div className="flex justify-center">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      className="gap-3"
                    />
                  </div>
                </div>
              </AnimatedContainer>
            )}

            <LeaderboardStats
              currentPage={currentPage}
              totalPages={totalPages}
              totalScores={totalEntries}
            />
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};
