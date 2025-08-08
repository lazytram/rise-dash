"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useShop } from "./hooks/useShop";
import { ShopBalance, PowerUpGrid, ShopLoadingState } from "./components";

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
      <div className="w-full">
        <ShopLoadingState
          isLoadingBalance={isLoadingBalance}
          isLoadingCosts={isLoadingCosts}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
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
    </div>
  );
});

ShopContent.displayName = "ShopContent";
