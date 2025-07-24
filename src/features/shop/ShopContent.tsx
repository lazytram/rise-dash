"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { PowerUpCard } from "./PowerUpCard";
import { POWERUP_UPGRADES, POWERUP_ORDER } from "@/shared/constants/powerUps";
import { PowerUpType } from "@/shared/types/powerUps";
import { useToastStore } from "@/infrastructure/store/toastStore";
import {
  getPowerUpService,
  LocalPowerUpService,
} from "@/shared/services/powerUpService";

export const ShopContent: React.FC = () => {
  const { t } = useTranslations();
  const { showSuccess, showError } = useToastStore();
  const [powerUpLevels, setPowerUpLevels] = useState({
    [PowerUpType.SHIELD]: 1,
    [PowerUpType.INFINITE_AMMO]: 1,
    [PowerUpType.JUMP_BOOST]: 1,
    [PowerUpType.SLOW_MOTION]: 1,
    [PowerUpType.MULTI_SHOT]: 1,
    [PowerUpType.RICE_ROCKET_AMMO]: 1,
  });
  const [riceBalance, setRiceBalance] = useState(200);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Sync with service on mount
  useEffect(() => {
    const service = getPowerUpService() as LocalPowerUpService;
    setPowerUpLevels(service.getLevels());
    setRiceBalance(service.getRiceBalance());
  }, []);

  const handleUpgrade = async (powerUpType: PowerUpType) => {
    setLoadingStates((prev) => ({ ...prev, [powerUpType]: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const service = getPowerUpService() as LocalPowerUpService;
      const powerUp = POWERUP_UPGRADES[powerUpType];
      const currentLevel = powerUpLevels[powerUpType] || 1;
      const nextLevel = currentLevel + 1;
      const upgrade = powerUp.upgrades.find((u) => u.level === nextLevel);

      if (upgrade && riceBalance >= upgrade.riceCost) {
        // Update service
        service.setRiceBalance(riceBalance - upgrade.riceCost);
        service.setLevels({
          ...powerUpLevels,
          [powerUpType]: nextLevel,
        });

        // Update local state
        setRiceBalance(riceBalance - upgrade.riceCost);
        setPowerUpLevels((prev) => ({
          ...prev,
          [powerUpType]: nextLevel,
        }));

        // Success toast
        showSuccess(
          t("scenes.shop.upgradeSuccess"),
          `${t(`features.powerUps.${powerUpType}`)} ${t(
            "scenes.shop.upgradedToLevel",
            {
              level: nextLevel,
            }
          )}`
        );
      } else {
        // Error toast for insufficient funds
        showError(
          t("scenes.shop.upgradeFailed"),
          t("features.powerUps.insufficientRice")
        );
      }
    } catch (error) {
      // Error toast for general failure
      console.error("Upgrade failed:", error);
      showError(
        t("scenes.shop.upgradeFailed"),
        t("scenes.shop.upgradeErrorDescription")
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [powerUpType]: false }));
    }
  };

  return (
    <Container className="py-8">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.shop.title")}
          subtitle={t("scenes.shop.subtitle")}
        />

        {/* RICE Balance Display */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 shadow-lg">
            <Text variant="title" size="3xl" className="text-white font-bold">
              {riceBalance.toLocaleString()} RICE
            </Text>
            <Text variant="body" className="text-white/90 text-sm mt-1">
              {t("scenes.shop.riceBalance")}
            </Text>
          </div>
        </div>

        {/* Power-up Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POWERUP_ORDER.map((powerUpType) => {
            const powerUp = POWERUP_UPGRADES[powerUpType];
            const currentLevel = powerUpLevels[powerUpType] || 1;
            const isLoading = loadingStates[powerUpType] || false;

            return (
              <PowerUpCard
                key={powerUpType}
                powerUp={powerUp}
                currentLevel={currentLevel}
                riceBalance={riceBalance}
                onUpgrade={() => handleUpgrade(powerUpType)}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </Card>
    </Container>
  );
};
