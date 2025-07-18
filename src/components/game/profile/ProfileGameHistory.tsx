"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";
import { Pagination } from "@/components/ui/Pagination";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

interface ProfileGameHistoryProps {
  playerScores: PlayerScore[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 5;

export const ProfileGameHistory: React.FC<ProfileGameHistoryProps> = ({
  playerScores,
  loading,
}) => {
  const { t } = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Text variant="subtitle">{t("scenes.profile.loadingScores")}</Text>
      </div>
    );
  }

  if (playerScores.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <Text variant="subtitle" className="text-white mb-2">
          {t("scenes.profile.noScoresYet")}
        </Text>
        <Text variant="caption">{t("scenes.profile.playGameToSeeScores")}</Text>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(playerScores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScores = playerScores.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Table with improved styling like leaderboard */}
      <div className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-4 text-center text-sm font-semibold text-white/90 border-b border-white/20">
                  {t("scenes.profile.score")}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white/90 border-b border-white/20">
                  {t("scenes.profile.date")}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white/90 border-b border-white/20">
                  {t("scenes.profile.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentScores.map((score, index) => {
                const globalIndex = startIndex + index;
                const isPersonalBest = globalIndex === 0;

                return (
                  <tr
                    key={globalIndex}
                    className={`hover:bg-white/10 transition-all duration-200 ${
                      isPersonalBest ? "bg-blue-500/20 border-blue-400/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 border-b border-white/10">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-center">
                          <Text variant="bold" className="text-white text-lg">
                            {score.score.toString()}
                          </Text>
                          <Text variant="caption" className="text-white/60">
                            {t("features.gameplay.meters")}
                          </Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-white/10">
                      <div className="text-center">
                        <Text variant="body" className="text-white/80">
                          {new Date(
                            Number(score.timestamp) * 1000
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </Text>
                        <Text variant="caption" className="text-white/60">
                          {new Date(
                            Number(score.timestamp) * 1000
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-white/10">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl">
                          {isPersonalBest ? "🏆" : "✅"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Page info */}
      <div className="text-center">
        <Text variant="caption" className="text-white/60">
          {t("scenes.profile.showingResults", {
            start: startIndex + 1,
            end: Math.min(endIndex, playerScores.length),
            total: playerScores.length,
          })}
        </Text>
      </div>
    </div>
  );
};
