"use client";

import { memo, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LeaderboardButton } from "@/components/auth/LeaderboardButton";
import { GameButton } from "@/components/auth/GameButton";
import { InstructionsButton } from "@/components/auth/InstructionsButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useHydration } from "@/hooks/useHydration";
import { HeaderSkeleton } from "./HeaderSkeleton";

export const Header = memo(function Header() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { isHydrated, isMounted, isServer } = useHydration();

  // Memoize the showMenu calculation to prevent unnecessary re-renders
  const showMenu = useMemo(() => {
    // Ne pas afficher le menu tant que l'hydratation n'est pas complète
    return (
      isMounted &&
      isHydrated &&
      isConnected &&
      session &&
      status === "authenticated"
    );
  }, [isMounted, isHydrated, isConnected, session, status]);

  // Memoize the className to prevent unnecessary re-renders
  const containerClassName = useMemo(() => {
    return `flex items-start absolute top-4 left-4 right-4 z-1 ${
      showMenu ? "justify-between" : "justify-end"
    }`;
  }, [showMenu]);

  // Rendu côté serveur ou pendant l'hydratation - afficher le skeleton
  if (isServer || !isMounted) {
    return <HeaderSkeleton />;
  }

  return (
    <div className={containerClassName}>
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
});
