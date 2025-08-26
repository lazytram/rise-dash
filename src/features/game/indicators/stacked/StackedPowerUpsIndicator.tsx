"use client";

import React, { memo } from "react";
import { Player } from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface Props {
  player: Player;
}

export const StackedPowerUpsIndicator: React.FC<Props> = memo(
  ({ player }) => {
    const { t } = useTranslations();

    const containerClasses =
      "glass-light backdrop-blur-sm border border-primary/20 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-22 md:h-24 lg:h-26 flex flex-col shadow-lg";

    const stacks = player.stackedPowerUps || {};

    // Build stack items dynamically for all stackable power-ups
    const stackableTypes = (Object.values(PowerUpType) as PowerUpType[]).filter(
      (type) => POWERUP_UPGRADES[type]?.stackable
    );
    const items: Array<{ type: PowerUpType; count: number }> = stackableTypes
      .map((type) => ({ type, count: stacks[type] || 0 }))
      .filter((i) => i.count > 0);

    return (
      <div className={containerClasses}>
        <h3 className="text-primary font-semibold text-center text-xs mb-2 flex-shrink-0">
          {t("features.powerUps.stackedTitle")}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          {items.length === 0 ? (
            <span className="text-muted-foreground text-xs font-medium">
              {t("features.powerUps.noStacked")}
            </span>
          ) : (
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
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Re-render only when counts of stackable power-ups change
    const prevStacks = prevProps.player.stackedPowerUps || {};
    const nextStacks = nextProps.player.stackedPowerUps || {};

    const prevPhoenix = prevStacks[PowerUpType.PHOENIX_PACT] || 0;
    const nextPhoenix = nextStacks[PowerUpType.PHOENIX_PACT] || 0;

    return prevPhoenix === nextPhoenix;
  }
);

StackedPowerUpsIndicator.displayName = "StackedPowerUpsIndicator";
