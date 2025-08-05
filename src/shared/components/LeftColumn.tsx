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
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20">
      {/* Enhanced glassmorphism container */}
      <div className="backdrop-blur-xl bg-white/15 border border-white/25 hover:bg-white/25 transition-all duration-500 rounded-3xl shadow-2xl hover:shadow-3xl">
        {/* Navigation menu with improved spacing */}
        <div className="flex flex-col items-center gap-y-4 p-5">
          <GameButton />
          <ProfileButton />
          <LeaderboardButton />
          <ShopButton />
          <DailyRevealButton />
          <InstructionsButton />
        </div>

        {/* Enhanced decorative accents */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>

        {/* Side accents */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full"></div>
      </div>
    </div>
  );
});
