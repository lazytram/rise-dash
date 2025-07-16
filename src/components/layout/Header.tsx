"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LeaderboardButton } from "@/components/auth/LeaderboardButton";
import { GameButton } from "@/components/auth/GameButton";
import { InstructionsButton } from "@/components/auth/InstructionsButton";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show menu buttons only when wallet is connected AND user has signed the SIWE message
  const showMenu =
    isMounted && isConnected && session && status === "authenticated";

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`flex items-start absolute top-4 left-4 right-4 z-1 ${
        showMenu ? "justify-between" : "justify-end"
      }`}
    >
      {/* Left side - Game, Profile, Leaderboard and Instructions buttons (only when connected AND authenticated) */}
      {showMenu && (
        <div className="flex flex-col items-start gap-y-4">
          <GameButton />
          <ProfileButton />
          <LeaderboardButton />
          <InstructionsButton />
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
