"use client";

import { ReactNode, memo, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProfileButton } from "@/components/auth/ProfileButton";
import { LeaderboardButton } from "@/components/auth/LeaderboardButton";
import { GameButton } from "@/components/auth/GameButton";
import { InstructionsButton } from "@/components/auth/InstructionsButton";
import { ShopButton } from "@/components/auth/ShopButton";
import { DailyStreakButton } from "@/components/auth/DailyStreakButton";
import { LanguageSelector } from "@/components/LanguageSelector";

// Colonne de gauche - Menu circles
const LeftColumn = memo(function LeftColumn() {
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
        <DailyStreakButton />
        <InstructionsButton />
      </div>
    </div>
  );
});

// Colonne de droite - Settings/Connect
const RightColumn = memo(function RightColumn() {
  return (
    <div className="fixed right-4 top-4 z-30">
      <div className="flex flex-col items-end gap-y-4">
        <AuthButton />
        <LanguageSelector />
      </div>
    </div>
  );
});

// Colonne centrale - Scene principale
const CenterColumn = memo(function CenterColumn({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen z-10 relative bg-transparent">
      <div className="w-full max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
});

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

export const ThreeColumnLayout = memo(function ThreeColumnLayout({
  children,
}: ThreeColumnLayoutProps) {
  return (
    <div className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen relative">
      {/* Colonne de gauche - Menu circles */}
      <LeftColumn />

      {/* Colonne centrale - Scene principale */}
      <CenterColumn>{children}</CenterColumn>

      {/* Colonne de droite - Settings/Connect */}
      <RightColumn />
    </div>
  );
});
