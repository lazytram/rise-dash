"use client";

import { memo } from "react";
import Image from "next/image";

import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/store/sceneStore";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <Container className="flex flex-col items-center justify-center max-w-md w-full">
        {/* Logo avec image pfp */}
        <div className="mb-8 text-center w-full flex flex-col items-center">
          <div className="w-24 h-24 mb-6 mx-auto">
            <Image
              src="/pfp.png"
              alt="Rise Dash Logo"
              width={96}
              height={96}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <Text className="text-3xl font-bold text-center mb-2">
            {t("auth.welcomeTitle")}
          </Text>
          <Text className="text-lg text-center text-gray-300 mb-8">
            {t("auth.welcomeSubtitle")}
          </Text>
        </div>

        {/* Navigation Buttons (only show when authenticated) */}
        {isAuthenticated ? (
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
        ) : (
          <div className="text-center">
            <Text className="text-lg text-gray-300">
              {t("auth.connectWallet")}
            </Text>
            <Text className="text-sm text-gray-400 mt-2">
              {t("auth.secureConnection")}
            </Text>
          </div>
        )}
      </Container>
    </div>
  );
});
