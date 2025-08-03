import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";
import { Tabs } from "@/shared/components/Tabs";
import {
  ProfileHeader,
  ProfileStats,
  ProfileGameHistory,
  ProfileAchievements,
} from "./index";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { usePlayerScores, useAchievements } from "./hooks";

export const ProfileContent: React.FC = () => {
  const { t } = useTranslations();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("gameHistory");

  // Use TanStack Query hooks
  const { data: playerScores = [], isLoading: scoresLoading } =
    usePlayerScores();

  const {
    isLoading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useAchievements();

  if (!isConnected) {
    return (
      <Container className="py-8">
        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
          <ProfileHeader />
          <Text variant="error" className="mb-4">
            {t("scenes.profile.connectWalletToView")}
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
          title={t("scenes.profile.title")}
          subtitle={t("scenes.profile.subtitle")}
        />
        <ProfileStats playerScores={playerScores} />

        {/* Tabs Section */}
        <Tabs
          tabs={[
            {
              id: "gameHistory",
              label: t("scenes.profile.gameHistory"),
              content: (
                <ProfileGameHistory
                  playerScores={playerScores}
                  loading={scoresLoading}
                />
              ),
            },
            {
              id: "achievements",
              label: t("scenes.profile.achievements"),
              content: (
                <ProfileAchievements
                  loading={achievementsLoading}
                  error={achievementsError?.message || null}
                  onRetry={refetchAchievements}
                />
              ),
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Card>
    </Container>
  );
};
