import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { blockchainService } from "@/services/blockchainService";
import { useTranslations } from "@/hooks/useTranslations";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Tabs } from "@/components/ui/Tabs";
import {
  ProfileHeader,
  ProfileStats,
  ProfileGameHistory,
  ProfileAchievements,
} from "./profile";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

export const ProfileContent: React.FC = () => {
  const { t } = useTranslations();
  const { address, isConnected } = useAccount();
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gameHistory");

  const loadPlayerScores = useCallback(async () => {
    try {
      setLoading(true);
      const scores = await blockchainService.getPlayerScores(address!);

      // Sort scores by score (descending) and then by timestamp (descending)
      const sortedScores = scores.sort((a, b) => {
        if (a.score !== b.score) {
          return Number(b.score - a.score);
        }
        return Number(b.timestamp - a.timestamp);
      });

      setPlayerScores(sortedScores);
    } catch (err) {
      console.error("Error loading player scores:", err);
      setError("Error loading player scores");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadPlayerScores();
    }
  }, [isConnected, address, loadPlayerScores]);

  if (!isConnected) {
    return (
      <Container>
        <Card>
          <ProfileHeader />
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
        <ProfileHeader />
        <ProfileStats playerScores={playerScores} />

        {/* Tabs Section */}
        <Tabs
          tabs={[
            {
              id: "gameHistory",
              label: t("profile.gameHistory"),
              content: (
                <ProfileGameHistory
                  playerScores={playerScores}
                  loading={loading}
                  error={error}
                  onRetry={loadPlayerScores}
                />
              ),
            },
            {
              id: "achievements",
              label: t("profile.achievements"),
              content: <ProfileAchievements />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Card>
    </Container>
  );
};
