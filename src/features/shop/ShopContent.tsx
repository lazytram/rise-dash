"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useShop } from "./hooks/useShop";
import { ShopBalance, PowerUpGrid, ShopLoadingState } from "./components";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { SceneHeader } from "@/shared/components/SceneHeader";

export const ShopContent: React.FC = memo(() => {
  const { t } = useTranslations();
  const {
    // State
    riceBalance,
    isLoadingBalance,
    upgradeCosts,
    isLoadingCosts,
    isUpgrading,
    powerUpLevels,
    progression,

    // Actions
    handleUpgrade,
    canAffordUpgrade,
    isMaxLevel,
  } = useShop();

  // Show loading state if both balance and costs are loading
  if (isLoadingBalance && isLoadingCosts) {
    return (
      <Container className="py-6">
        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-xl p-5">
          <SceneHeader
            title={t("scenes.shop.title")}
            subtitle={t("scenes.shop.subtitle")}
          />
          <ShopLoadingState
            isLoadingBalance={isLoadingBalance}
            isLoadingCosts={isLoadingCosts}
          />
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-xl p-5">
        {/* Header */}
        <SceneHeader
          title={t("scenes.shop.title")}
          subtitle={t("scenes.shop.subtitle")}
        />

        {/* Balance Section */}
        <ShopBalance
          riceBalance={riceBalance}
          isLoadingBalance={isLoadingBalance}
          progression={progression}
        />

        {/* Power-up Grid */}
        <PowerUpGrid
          isUpgrading={isUpgrading}
          powerUpLevels={powerUpLevels}
          upgradeCosts={upgradeCosts}
          isLoadingCosts={isLoadingCosts}
          isLoadingBalance={isLoadingBalance}
          canAffordUpgrade={canAffordUpgrade}
          isMaxLevel={isMaxLevel}
          onUpgrade={handleUpgrade}
        />
      </Card>
    </Container>
  );
});

ShopContent.displayName = "ShopContent";
