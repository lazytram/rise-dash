import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { Tabs } from "@/shared/components/Tabs";
import {
  ProfileHeader,
  ProfileStats,
  ProfileGameHistory,
  ProfileAchievements,
} from "./index";
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
      <div className="w-full">
        <ProfileHeader />
        <Text variant="error" className="mb-4">
          {t("scenes.profile.connectWalletToView")}
        </Text>
      </div>
    );
  }

  return (
    <div className="w-full">
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
    </div>
  );
};
