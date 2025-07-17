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

const MenuButtons = memo(function MenuButtons() {
  return (
    <div className="flex flex-col items-start gap-y-4">
      <GameButton />
      <ProfileButton />
      <LeaderboardButton />
      <InstructionsButton />
    </div>
  );
});

const RightSideButtons = memo(function RightSideButtons() {
  return (
    <div className="flex flex-col items-end gap-y-4">
      <AuthButton />
      <LanguageSelector />
    </div>
  );
});

export const Header = memo(function Header() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { isHydrated, isMounted, isServer } = useHydration();

  const showMenu = useMemo(() => {
    return (
      isMounted &&
      isHydrated &&
      isConnected &&
      session &&
      status === "authenticated"
    );
  }, [isMounted, isHydrated, isConnected, session, status]);

  const containerClassName = useMemo(() => {
    return `flex items-start absolute top-4 left-4 right-4 z-1 ${
      showMenu ? "justify-between" : "justify-end"
    }`;
  }, [showMenu]);

  if (isServer || !isMounted) {
    return <HeaderSkeleton />;
  }

  return (
    <div className={containerClassName}>
      {/* Left side - Game, Profile, Leaderboard and Instructions buttons (only when connected AND authenticated) */}
      {showMenu && <MenuButtons />}

      {/* Right side - Auth and Language */}
      <RightSideButtons />
    </div>
  );
});
