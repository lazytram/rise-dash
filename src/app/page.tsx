"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/Header";
import { WelcomeScreen } from "@/components/auth/WelcomeScreen";
import { GameScreen } from "@/components/game/GameScreen";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen flex flex-col items-center justify-center">
      <Header />
      {!isConnected ? <WelcomeScreen /> : <GameScreen />}
    </main>
  );
}
