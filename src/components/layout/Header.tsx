"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Leaderboard } from "@/components/game/Leaderboard";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { t } = useTranslations();
  const { isConnected } = useAccount();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showProfile = isMounted && isConnected;

  return (
    <>
      <div
        className={`flex items-start absolute top-4 left-4 right-4 z-1 ${
          showProfile ? "justify-between" : "justify-end"
        }`}
      >
        {/* Left side - Profile button (only when connected) */}
        {showProfile && <ProfileButton />}

        {/* Right side - Auth, Language, Leaderboard */}
        <div className="flex flex-col items-end gap-y-4">
          <AuthButton />
          <LanguageSelector />
          <Button
            onClick={() => setShowLeaderboard(true)}
            variant="primary"
            size="sm"
          >
            {t("blockchain.leaderboard")}
          </Button>
        </div>
      </div>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </>
  );
}
