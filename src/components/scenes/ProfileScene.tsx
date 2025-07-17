"use client";

import { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { ProfileContent } from "@/components/game/ProfileContent";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const ProfileScene = memo(function ProfileScene() {
  const { t } = useTranslations();

  return (
    <AuthGuard
      title={t("profile.title")}
      fallbackMessage={t("blockchain.connectWalletToView")}
    >
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <ProfileContent />
        </div>
      </div>
    </AuthGuard>
  );
});
