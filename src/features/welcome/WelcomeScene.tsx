"use client";

import { memo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { SceneWrapper } from "@/shared/components/SceneWrapper";
import { WelcomeLogo, WelcomeHeader, WelcomeActions } from "./components";

export const WelcomeScene = memo(function WelcomeScene() {
  const { data: session, status } = useSession();
  const { isConnected } = useAccount();
  const { setScene } = useSceneStore();

  const isAuthenticated = isConnected && session && status === "authenticated";

  const handlePlayClick = () => {
    setScene(SceneType.GAME);
  };

  const handleProfileClick = () => {
    setScene(SceneType.PROFILE);
  };

  const handleLeaderboardClick = () => {
    setScene(SceneType.LEADERBOARD);
  };

  return (
    <SceneWrapper
      maxWidth="lg"
      className="text-center"
      background="pattern"
      padding="xl"
    >
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-8">
        {/* Hero Section */}
        <div className="space-y-8 animate-fade-in-up">
          <WelcomeLogo />
          <WelcomeHeader />
        </div>

        {/* Actions Section */}
        {isAuthenticated && (
          <div className="animate-fade-in-up animation-delay-300">
            <WelcomeActions
              onPlayClick={handlePlayClick}
              onProfileClick={handleProfileClick}
              onLeaderboardClick={handleLeaderboardClick}
            />
          </div>
        )}
      </div>
    </SceneWrapper>
  );
});
