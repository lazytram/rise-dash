"use client";

import { memo, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LeaderboardButton } from "@/components/auth/LeaderboardButton";
import { GameButton } from "@/components/auth/GameButton";
import { InstructionsButton } from "@/components/auth/InstructionsButton";
import { ShopButton } from "@/components/auth/ShopButton";
import { DailyRevealButton } from "@/components/auth/DailyRevealButton";

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
