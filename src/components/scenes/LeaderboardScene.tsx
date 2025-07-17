"use client";

import { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { LeaderboardContent } from "@/components/game/LeaderboardContent";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const LeaderboardScene = memo(function LeaderboardScene() {
  const { t } = useTranslations();

  return (
    <AuthGuard
      title={t("blockchain.leaderboard")}
      fallbackMessage={t("blockchain.connectWalletToView")}
    >
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <LeaderboardContent />
        </div>
      </div>
    </AuthGuard>
  );
});
