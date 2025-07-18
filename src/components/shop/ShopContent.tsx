"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { PowerUpCard } from "./PowerUpCard";
import { POWERUP_UPGRADES, POWERUP_ORDER } from "@/constants/powerUps";
import { useToastStore } from "@/store/toastStore";

export const ShopContent: React.FC = () => {
  const { t } = useTranslations();
  const { showSuccess, showError } = useToastStore();
  const [riceBalance, setRiceBalance] = useState(200);
  const [powerUpLevels, setPowerUpLevels] = useState({
    shield: 1,
    infiniteAmmo: 1,
    speedBoost: 1,
    multiShot: 1,
    riceRocketAmmo: 1,
  });
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const handleUpgrade = async (powerUpType: string) => {
    setLoadingStates((prev) => ({ ...prev, [powerUpType]: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const powerUp = POWERUP_UPGRADES[powerUpType];
      const currentLevel =
        powerUpLevels[powerUpType as keyof typeof powerUpLevels];
      const nextLevel = currentLevel + 1;
      const upgrade = powerUp.upgrades.find((u) => u.level === nextLevel);

      if (upgrade && riceBalance >= upgrade.riceCost) {
        setRiceBalance((prev) => prev - upgrade.riceCost);
        setPowerUpLevels((prev) => ({
          ...prev,
          [powerUpType]: nextLevel,
        }));

        // Success toast
        showSuccess(
          t("shop.upgradeSuccess"),
          `${t(`powerUps.${powerUpType}`)} ${t("shop.upgradedToLevel", {
            level: nextLevel,
          })}`,
          undefined,
          undefined
        );
      } else {
        // Error toast for insufficient funds
        showError(t("shop.upgradeFailed"), t("powerUps.insufficientRice"));
      }
    } catch (error) {
      // Error toast for general failure
      console.error("Upgrade failed:", error);
      showError(t("shop.upgradeFailed"), t("shop.upgradeErrorDescription"));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [powerUpType]: false }));
    }
  };

  return (
    <Container className="py-8">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("shop.title")}
          subtitle={t("shop.subtitle")}
          menuColorKey="shop"
        />

        {/* RICE Balance Display */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 shadow-lg">
            <Text variant="title" size="3xl" className="text-white font-bold">
              {riceBalance.toLocaleString()} RICE
            </Text>
            <Text variant="body" className="text-white/90 text-sm mt-1">
              {t("shop.riceBalance")}
            </Text>
          </div>
        </div>

        {/* Power-up Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POWERUP_ORDER.map((powerUpKey) => {
            const powerUp = POWERUP_UPGRADES[powerUpKey];
            const currentLevel =
              powerUpLevels[powerUpKey as keyof typeof powerUpLevels];
            const isLoading = loadingStates[powerUpKey] || false;

            return (
              <PowerUpCard
                key={powerUpKey}
                powerUp={powerUp}
                currentLevel={currentLevel}
                riceBalance={riceBalance}
                onUpgrade={() => handleUpgrade(powerUpKey)}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </Card>
    </Container>
  );
};
