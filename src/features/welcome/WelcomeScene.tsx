"use client";

import { memo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { SceneContainer } from "@/shared/components/SceneContainer";
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

  const handleInstructionsClick = () => {
    setScene(SceneType.INSTRUCTIONS);
  };

  return (
    <SceneContainer maxWidth="md" className="text-center">
      <WelcomeLogo />
      <WelcomeHeader />

      {isAuthenticated && (
        <WelcomeActions
          onPlayClick={handlePlayClick}
          onProfileClick={handleProfileClick}
          onLeaderboardClick={handleLeaderboardClick}
          onInstructionsClick={handleInstructionsClick}
        />
      )}
    </SceneContainer>
  );
});
