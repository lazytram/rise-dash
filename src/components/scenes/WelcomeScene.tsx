"use client";

import { memo } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/store/sceneStore";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SceneType } from "@/types/scenes";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const WelcomeScene = memo(function WelcomeScene() {
  const { data: session, status } = useSession();
  const { isConnected } = useAccount();
  const { setScene } = useSceneStore();
  const { t } = useTranslations();

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

      <Text className="text-4xl font-bold text-white mb-6">
        {t("common.title")}
      </Text>

      <Text className="text-lg text-white mb-2">
        {t("scenes.welcome.subtitle")}
      </Text>
      <Text className="text-lg text-white mb-8">
        {t("scenes.welcome.connectWallet")}
      </Text>

      {isAuthenticated && (
        <div className="flex flex-col items-center w-full space-y-4">
          <div className="flex justify-center w-full">
            <Button
              onClick={handlePlayClick}
              className="w-2/3 max-w-xs bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {t("common.playNow")}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              onClick={handleProfileClick}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("scenes.profile.title")}
            </Button>
            <Button
              onClick={handleLeaderboardClick}
              className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("scenes.leaderboard.title")}
            </Button>
          </div>
          <Button
            onClick={handleInstructionsClick}
            className="w-full cursor-pointer bg-slate-600 hover:bg-slate-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {t("scenes.instructions.title")}
          </Button>
        </div>
      )}
    </SceneContainer>
  );
});
