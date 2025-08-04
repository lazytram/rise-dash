"use client";

import React, { useState } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { Pagination } from "@/shared/components/Pagination";
import { Loader } from "@/shared/components/Loader";
import { AnimatedContainer } from "@/shared/components/AnimatedContainer";
import { DataTable } from "@/shared/components/DataTable";
import { StatusIndicator } from "@/shared/components/StatusIndicator";
import { cn } from "@/shared/utils/cn";
import { Box, Button } from "@/shared/components";
import { useGameHistory } from "./hooks/useGameHistory";
import { ProfileSection } from "./ProfileSection";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

const ITEMS_PER_PAGE = 5;

export const ProfileGameHistory: React.FC = () => {
  const { t } = useTranslations();
  const { playerScores, loading, error, retry } = useGameHistory();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(playerScores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScores = playerScores.slice(startIndex, endIndex);

  if (loading) {
    return (
      <ProfileSection>
        <Box variant="centered" className="flex-1">
          <Loader
            size="lg"
            color="gradient"
            text={t("scenes.profile.loadingScores")}
          />
        </Box>
      </ProfileSection>
    );
  }

  if (error) {
    return (
      <ProfileSection>
        <Box variant="centered" className="flex-1">
          <Text variant="error" className="mb-4">
            {error}
          </Text>
          <Button onClick={retry} variant="primary">
            {t("common.retry")}
          </Button>
        </Box>
      </ProfileSection>
    );
  }

  if (playerScores.length === 0) {
    return (
      <AnimatedContainer animation="fadeIn" delay={100}>
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-bounce">📊</div>
          <Text variant="subtitle" className="text-white mb-3">
            {t("scenes.profile.noScoresYet")}
          </Text>
          <Text variant="caption" className="text-white/60">
            {t("scenes.profile.playGameToSeeScores")}
          </Text>
        </div>
      </AnimatedContainer>
    );
  }

  const columns = [
    {
      key: "score",
      header: t("scenes.profile.score"),
      render: (score: PlayerScore, index: number) => {
        const globalIndex = startIndex + index;
        const isPersonalBest = globalIndex === 0;

        return (
          <div className="text-center group-hover:scale-110 transition-transform duration-200">
            <Text
              variant="bold"
              className={cn(
                "text-2xl font-bold",
                isPersonalBest
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                  : "text-white"
              )}
            >
              {score.score.toString()}
            </Text>
            <Text variant="caption" className="text-white/60 mt-1">
              {t("features.gameplay.meters")}
            </Text>
          </div>
        );
      },
    },
    {
      key: "date",
      header: t("scenes.profile.date"),
      render: (score: PlayerScore) => (
        <div className="text-center">
          <Text variant="body" className="text-white/90 font-medium">
            {new Date(Number(score.timestamp) * 1000).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}
          </Text>
          <Text variant="caption" className="text-white/60 mt-1">
            {new Date(Number(score.timestamp) * 1000).toLocaleTimeString(
              "en-GB",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </Text>
        </div>
      ),
    },
    {
      key: "status",
      header: t("scenes.profile.status"),
      render: (score: PlayerScore, index: number) => {
        const globalIndex = startIndex + index;
        const isPersonalBest = globalIndex === 0;

        // Only show status for Personal Best, otherwise return empty
        if (!isPersonalBest) {
          return null;
        }

        return (
          <StatusIndicator
            status="success"
            message={t("scenes.profile.personalBest")}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Table with modern styling */}
      <AnimatedContainer animation="scaleIn" delay={400}>
        <DataTable
          data={currentScores}
          columns={columns}
          highlightRow={(score, index) => {
            const globalIndex = startIndex + index;
            return globalIndex === 0; // Highlight personal best
          }}
          animationDelay={500}
          rowDelay={100}
        />
      </AnimatedContainer>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <AnimatedContainer animation="slideUp" delay={800}>
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

      {/* Enhanced Page info with animation */}
      <AnimatedContainer animation="fadeIn" delay={900}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <Text variant="caption" className="text-white/70 font-medium">
              {t("scenes.profile.showingResults", {
                start: startIndex + 1,
                end: Math.min(endIndex, playerScores.length),
                total: playerScores.length,
              })}
            </Text>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};
