"use client";

import { memo, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { ProfileButton } from "@/features/auth/ProfileButton";
import { LeaderboardButton } from "@/features/auth/LeaderboardButton";
import { GameButton } from "@/features/auth/GameButton";
import { InstructionsButton } from "@/features/auth/InstructionsButton";
import { ShopButton } from "@/features/auth/ShopButton";
import { DailyRevealButton } from "@/features/auth/DailyRevealButton";

export const LeftColumn = memo(function LeftColumn() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();

  const showMenu = useMemo(() => {
    return isConnected && session && status === "authenticated";
  }, [isConnected, session, status]);

  if (!showMenu) {
    return null;
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="flex flex-col items-start gap-y-4">
        <GameButton />
        <ProfileButton />
        <LeaderboardButton />
        <ShopButton />
        <DailyRevealButton />
        <InstructionsButton />
      </div>
    </div>
  );
});
