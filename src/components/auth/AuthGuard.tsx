"use client";

import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/store/sceneStore";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface AuthGuardProps {
  children: ReactNode;
  title: string;
  fallbackMessage?: string;
}

export const AuthGuard = ({
  children,
  title,
  fallbackMessage,
}: AuthGuardProps) => {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { navigateTo } = useSceneStore();
  const { t } = useTranslations();

  const isAuthenticated = isConnected && session && status === "authenticated";

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Text className="text-2xl font-bold text-white mb-4">{title}</Text>
          <Text className="text-lg text-white/80 mb-6">
            {fallbackMessage || t("blockchain.connectWalletToView")}
          </Text>
          <Button
            onClick={() => navigateTo("welcome")}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {t("common.backToWelcome")}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
