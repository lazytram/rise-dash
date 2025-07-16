"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";

export function LeaderboardButton() {
  const { t } = useTranslations();

  return (
    <CircularButton
      href="/leaderboard"
      icon={<span className="text-2xl">🏆</span>}
      tooltip={t("blockchain.leaderboard")}
      gradientFrom="#fbbf24"
      gradientTo="#d97706"
    />
  );
}
