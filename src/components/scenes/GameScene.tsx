"use client";

import { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import Game from "@/components/game/Game";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const GameScene = memo(function GameScene() {
  const { t } = useTranslations();

  return (
    <AuthGuard
      title={t("auth.welcomeTitle")}
      fallbackMessage={t("blockchain.connectWalletToSave")}
    >
      <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <Game />
      </div>
    </AuthGuard>
  );
});
