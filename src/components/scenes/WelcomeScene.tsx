"use client";

import { memo } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/store/sceneStore";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export const WelcomeScene = memo(function WelcomeScene() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { navigateTo } = useSceneStore();
  const { t } = useTranslations();

  const isAuthenticated = isConnected && session && status === "authenticated";

  const handleStartGame = () => {
    navigateTo("game");
  };

  const handleViewProfile = () => {
    navigateTo("profile");
  };

  const handleViewLeaderboard = () => {
    navigateTo("leaderboard");
  };

  const handleViewInstructions = () => {
    navigateTo("instructions");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center max-w-md w-full text-center">
        {/* Logo avec image pfp */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-400 via-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto p-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-purple-900/50 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/40 to-transparent rounded-full"></div>
            <Image
              src="/pfp.png"
              alt="Rise Dash Logo"
              width={96}
              height={96}
              className="rounded-full object-cover relative z-10"
              priority
            />
          </div>
        </div>

        {/* Titre principal */}
        <Text className="text-4xl font-bold text-white mb-6">
          {t("auth.welcomeTitle")}
        </Text>

        {/* Sous-titre */}
        <Text className="text-lg text-white mb-2">
          {t("auth.welcomeSubtitle")}
        </Text>
        <Text className="text-lg text-white mb-8">
          {t("auth.connectWallet")}
        </Text>

        {/* Navigation Buttons (only show when authenticated) */}
        {isAuthenticated && (
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="flex justify-center w-full">
              <Button
                onClick={handleStartGame}
                className="w-2/3 max-w-xs bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 cursor-pointer"
              >
                {t("common.playNow")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={handleViewProfile}
                variant="secondary"
                className="w-full cursor-pointer"
              >
                {t("profile.title")}
              </Button>
              <Button
                onClick={handleViewLeaderboard}
                variant="secondary"
                className="w-full cursor-pointer"
              >
                {t("blockchain.leaderboard")}
              </Button>
            </div>
            <Button
              onClick={handleViewInstructions}
              variant="ghost"
              className="w-full cursor-pointer"
            >
              {t("instructions.title")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
