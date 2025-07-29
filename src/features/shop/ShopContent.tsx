"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useRice } from "@/shared/hooks/useRice";
import { usePowerUps } from "@/shared/hooks/usePowerUps";
import { Container } from "@/shared/components/Container";
import { Card } from "@/shared/components/Card";
import { Text } from "@/shared/components/Text";
import { SceneHeader } from "@/shared/components/SceneHeader";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { PowerUpCardBlockchain } from "./PowerUpCardBlockchain";
import { POWERUP_UPGRADES, POWERUP_ORDER } from "@/shared/constants/powerUps";
import { useToastStore } from "@/infrastructure/store/toastStore";

export const ShopContent: React.FC = () => {
  const { t } = useTranslations();
  const { showSuccess, showError } = useToastStore();
  const { checkRICEBalance } = useRice();
  const {
    powerUpLevels,
    powerUpConfigs,
    isLoading: isLoadingPowerUps,
    isUpgrading,
    upgradePowerUp,
    loadPowerUpLevels,
    loadPowerUpConfig,
    getUpgradeCost,
  } = usePowerUps();

  const [riceBalance, setRiceBalance] = useState(200);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [upgradeCosts, setUpgradeCosts] = useState<Record<number, number>>({});

  // Load RICE balance and power-up data on mount
  useEffect(() => {
    const loadData = async () => {
      console.log("🔄 Loading shop data...");
      setIsLoadingBalance(true);
      try {
        // Load RICE balance
        const balance = await checkRICEBalance();
        setRiceBalance(balance);
        console.log("✅ RICE balance loaded:", balance);

        // Load power-up levels
        const levels = await loadPowerUpLevels();
        console.log("✅ Power-up levels loaded:", levels);

        // Load power-up configs and costs
        const costs: Record<number, number> = {};
        for (let i = 0; i < 6; i++) {
          try {
            console.log(`🔍 Loading PowerUp ${i}...`);
            const config = await loadPowerUpConfig(i);
            console.log(`✅ PowerUp ${i} config:`, config);

            const cost = await getUpgradeCost(i);
            costs[i] = cost;
            console.log(`✅ PowerUp ${i} upgrade cost:`, cost);
          } catch (error) {
            console.error(`❌ Failed to load power-up ${i} config:`, error);
          }
        }
        setUpgradeCosts(costs);
        console.log("✅ Shop data loaded successfully");
      } catch (error) {
        console.error("❌ Failed to load shop data:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadData();
  }, [checkRICEBalance, loadPowerUpLevels, loadPowerUpConfig, getUpgradeCost]);

  const handleUpgrade = async (powerUpId: number) => {
    try {
      const success = await upgradePowerUp(powerUpId);

      if (success) {
        // Refresh data after successful upgrade
        const balance = await checkRICEBalance();
        setRiceBalance(balance);

        const newLevels = await loadPowerUpLevels();
        const newCost = await getUpgradeCost(powerUpId);
        setUpgradeCosts((prev) => ({ ...prev, [powerUpId]: newCost }));

        showSuccess(
          t("scenes.shop.upgradeSuccess"),
          t("scenes.shop.upgradedToLevel", {
            level: newLevels[powerUpId] || 1,
          })
        );
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      showError(
        t("scenes.shop.upgradeFailed"),
        t("scenes.shop.upgradeErrorDescription")
      );
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
                  {isLoadingBalance ? "..." : riceBalance.toLocaleString()}
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
          {POWERUP_ORDER.map((powerUpType, index) => {
            const powerUp = POWERUP_UPGRADES[powerUpType];
            const powerUpId = index; // Map PowerUpType to powerUpId
            const currentLevel = powerUpLevels[powerUpId] || 0;
            const upgradeCost = upgradeCosts[powerUpId] || 0;
            const isMaxLevel = powerUpConfigs[powerUpId]
              ? currentLevel >= powerUpConfigs[powerUpId].maxLevel
              : false;
            const canAfford = riceBalance >= upgradeCost;
            const isLoading = isUpgrading(powerUpId) || isLoadingPowerUps;

            return (
              <PowerUpCardBlockchain
                key={powerUpType}
                powerUp={powerUp}
                currentLevel={currentLevel}
                onUpgrade={() => handleUpgrade(powerUpId)}
                isLoading={isLoading}
                upgradeCost={upgradeCost}
                isMaxLevel={isMaxLevel}
                canAfford={canAfford}
              />
            );
          })}
        </div>
      </Card>
    </Container>
  );
};
