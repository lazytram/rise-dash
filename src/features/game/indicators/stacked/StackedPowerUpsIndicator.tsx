"use client";

import React, { memo } from "react";
import { Player } from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface Props {
  player: Player;
}

export const StackedPowerUpsIndicator: React.FC<Props> = memo(({ player }) => {
  const { t } = useTranslations();

  const stacks = player.stackedPowerUps || {};
  const phoenixCount = stacks[PowerUpType.PHOENIX_PACT] || 0;

  const items: Array<{ type: PowerUpType; count: number }> = [];
  if (phoenixCount > 0) {
    items.push({ type: PowerUpType.PHOENIX_PACT, count: phoenixCount });
  }

  if (items.length === 0) {
    return (
      <div className="glass-light backdrop-blur-sm border border-primary/20 rounded-lg p-3 w-24 h-20 flex flex-col shadow-lg items-center justify-center">
        <span className="text-muted-foreground text-xs font-medium">
          {t("features.powerUps.noStacked")}
        </span>
      </div>
    );
  }

  return (
    <div className="glass-light backdrop-blur-sm border border-primary/20 rounded-lg p-3 w-24 sm:w-28 md:w-32 h-20 flex flex-col shadow-lg">
      <h3 className="text-primary font-semibold text-center text-xs mb-2 flex-shrink-0">
        {t("features.powerUps.stackedTitle")}
      </h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {items.map((item) => {
            const meta = POWERUP_UPGRADES[item.type];
            return (
              <div
                key={item.type}
                className="flex items-center space-x-1 bg-primary/10 border border-primary/30 rounded px-2 py-1"
                title={meta.name}
              >
                <span className="text-primary text-sm">{meta.icon}</span>
                <span className="text-primary text-xs font-bold">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

StackedPowerUpsIndicator.displayName = "StackedPowerUpsIndicator";
