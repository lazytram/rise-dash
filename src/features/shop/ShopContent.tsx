"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { RiceLogo } from "@/shared/components/RiceLogo";
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
    <Container className="py-6">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-xl p-5">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.shop.title")}
          subtitle={t("scenes.shop.subtitle")}
        />

        {/* RICE Balance Display */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-500 rounded-xl p-4 shadow-lg border border-violet-500/30 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-2">
              {/* Amount and Logo */}
              <div className="flex items-center justify-center space-x-2">
                <Text
                  variant="title"
                  size="3xl"
                  className="text-white font-bold tracking-wide drop-shadow-lg"
                >
                  {riceBalance.toLocaleString()}
                </Text>
                <div className="w-10 h-10 flex-shrink-0 relative">
                  <RiceLogo className="w-full h-full" size={40} />
                  {/* Glow effect around logo */}
                  <div className="absolute inset-0 bg-violet-400/20 rounded-full blur-md -z-10"></div>
                </div>
              </div>

              {/* Rice Balance Label */}
              <Text
                variant="body"
                className="text-white/90 font-medium tracking-wide drop-shadow-sm uppercase text-sm"
              >
                {t("scenes.shop.riceBalance")}
              </Text>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/30 rounded-full" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full" />
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
