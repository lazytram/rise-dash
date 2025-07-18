"use client";

import { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { ShopContent } from "@/components/shop/ShopContent";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const ShopScene = memo(function ShopScene() {
  const { t } = useTranslations();

  return (
    <AuthGuard
      title={t("shop.title")}
      fallbackMessage={t("blockchain.connectWalletToView")}
    >
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <ShopContent />
        </div>
      </div>
    </AuthGuard>
  );
});
