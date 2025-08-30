import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { Tabs } from "@/shared/components/Tabs";
import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";
import {
  ProfileHeader,
  ProfileStats,
  ProfileGameHistory,
  ProfileAchievements,
} from "./index";
import { usePlayerScores, useAchievements } from "./hooks";
import { ProfileShareCard } from "./ProfileShareCard";

export const ProfileContent: React.FC = () => {
  const { t } = useTranslations();
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [shareOpen, setShareOpen] = useState(false);

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
      {isConnected && (
        <div className="flex items-center justify-end mb-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={() => setShareOpen(true)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 md:w-6 md:h-6 text-white/90 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M12 2l1.7 3.9L18 7l-3.3 2.1L13.7 13 12 9.9 10.3 13l-1-3.9L6 7l4.3-1.1L12 2Zm7 10.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1ZM3 13l1.2 2.8L7 17l-2.8 1.2L3 21l-1.2-2.8L-1 17l2.8-1.2L3 13Z"
                />
              </svg>
            }
            className="group relative rounded-full px-6 overflow-hidden ring-1 ring-white/15 hover:ring-white/25 shadow-[0_10px_30px_-10px_rgba(147,197,253,0.5)] hover:shadow-[0_16px_40px_-12px_rgba(167,139,250,0.65)] transition-all duration-300"
          >
            <span className="relative z-10">
              {t("scenes.profile.share.export")}
            </span>
            <span className="pointer-events-none absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400/20 via-fuchsia-400/20 to-purple-400/20" />
          </Button>
        </div>
      )}
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

      {/* Share modal */}
      <Modal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        size="xl"
        className="max-w-4xl max-h-[85vh] overflow-auto self-start mt-4"
        title={t("scenes.profile.share.title")}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div id="profile-share-card" className="w-full max-w-3xl">
              <ProfileShareCard
                playerScores={playerScores}
                walletAddress={address}
                width={1200}
                height={630}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={async () => {
                const wrapper = document.getElementById("profile-share-card");
                const canvas = wrapper?.querySelector(
                  "canvas"
                ) as HTMLCanvasElement | null;
                if (!canvas) return;
                const blob = await new Promise<Blob | null>((resolve) =>
                  canvas.toBlob((b) => resolve(b), "image/png")
                );
                if (!blob) return;
                const file = new File([blob], "rise-dash-profile.png", {
                  type: "image/png",
                });
                const data = {
                  files: [file],
                  title: "Rise Dash",
                  text: "My Rise Dash stats",
                } as ShareData;
                if (navigator.canShare && navigator.canShare(data)) {
                  try {
                    await navigator.share(data);
                    return;
                  } catch {}
                }
                const best = playerScores.length
                  ? Number(playerScores[0].score)
                  : 0;
                const total = playerScores.length;
                const avg = total
                  ? Math.round(
                      playerScores.reduce(
                        (acc, s) => acc + Number(s.score),
                        0
                      ) / total
                    )
                  : 0;
                const tweet = `My Rise Dash stats 🚀\nBest: ${best.toLocaleString()}m • Avg: ${avg.toLocaleString()}m • ${total} games\nBuilt on @rise_chain #RiseDash #Web3Gaming`;
                const text = encodeURIComponent(tweet);
                const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
                window.open(twitterUrl, "_blank", "noopener,noreferrer");
              }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 md:w-6 md:h-6"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M17.64 3H21L13.5 11.6 22 21h-6.04l-4.66-6.1L6 21H2l7.66-8.5L2.22 3h6.04l4.29 5.6L17.64 3Z"
                  />
                </svg>
              }
              iconPosition="right"
              className="rounded-full px-5 bg-black text-white hover:bg-black/90 border border-white/20 shadow-lg hover:shadow-xl tracking-wide"
            >
              {t("scenes.profile.share.shareOnX")}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                const wrapper = document.getElementById("profile-share-card");
                const canvas = wrapper?.querySelector(
                  "canvas"
                ) as HTMLCanvasElement | null;
                if (!canvas) return;
                const url = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = url;
                a.download = "rise-dash-profile.png";
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              iconPosition="right"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M5 20h14" />
                </svg>
              }
              className="rounded-full px-5 bg-white text-foreground hover:bg-white/90 border border-white/20 shadow-lg hover:shadow-xl tracking-wide"
            >
              {t("scenes.profile.share.downloadImage")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
