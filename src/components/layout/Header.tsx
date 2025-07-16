"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LeaderboardButton } from "@/components/auth/LeaderboardButton";
import { GameButton } from "@/components/auth/GameButton";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show menu buttons when wallet is connected (SIWE authentication is optional for basic features)
  const showMenu = isMounted && isConnected;

  return (
    <div
      className={`flex items-start absolute top-4 left-4 right-4 z-1 ${
        showMenu ? "justify-between" : "justify-end"
      }`}
    >
      {/* Left side - Game, Profile and Leaderboard buttons (only when connected AND authenticated) */}
      {showMenu && (
        <div className="flex flex-col items-start gap-y-4">
          <GameButton />
          <ProfileButton />
          <LeaderboardButton />
        </div>
      )}

      {/* Right side - Auth and Language */}
      <div className="flex flex-col items-end gap-y-4">
        <AuthButton />
        <LanguageSelector />
      </div>
    </div>
  );
}
