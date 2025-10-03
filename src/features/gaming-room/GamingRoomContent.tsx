"use client";

import React, { memo, useMemo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { cn } from "@/shared/utils/cn";
import { miniGamesRegistry } from "./miniGames.registry";

interface MiniGameItem {
  id: string;
  title: string;
  description: string;
  scene?: SceneType; // target scene if available
  status: "available" | "coming_soon";
  icon?: React.ReactNode;
}

export const GamingRoomContent: React.FC = memo(() => {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  // Resolve the registry with i18n at render time
  const miniGames = useMemo<MiniGameItem[]>(() => {
    return miniGamesRegistry.map((def) => ({
      id: def.id,
      title: t(def.titleKey),
      description: t(def.descriptionKey),
      scene: def.scene,
      status: def.status,
      icon: def.icon ? <span>{def.icon}</span> : undefined,
    }));
  }, [t]);

  const handleOpen = (item: MiniGameItem) => {
    if (item.status === "available" && item.scene) {
      setScene(item.scene);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t("scenes.gamingRoom.title")}
        </h2>
        <p className="text-muted-foreground mt-1">
          {t("scenes.gamingRoom.subtitle")}
        </p>
      </div>

      {/* Responsive auto-fit grid, Apple Store-like */}
      <div
        className={cn(
          "grid gap-4",
          "[grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]"
        )}
      >
        {miniGames.map((item) => (
          <Card
            key={item.id}
            variant="elevated"
            padding="lg"
            hover
            className={cn(
              "flex flex-col justify-between h-full",
              item.status === "coming_soon" && "opacity-85"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate flex-1">
                    {item.title}
                  </h3>
                  {item.status === "available" && (
                    <Badge
                      variant="gradient"
                      size="sm"
                      icon={item.icon ?? <span>🍚</span>}
                    >
                      {t("scenes.gamingRoom.badges.earnRice")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.description}
                </p>
              </div>
              {item.status === "coming_soon" && (
                <Badge variant="glass" size="sm">
                  {t("scenes.gamingRoom.badges.soon")}
                </Badge>
              )}
            </div>

            <div className="mt-6">
              <Button
                size="sm"
                className="w-full"
                disabled={item.status !== "available"}
                onClick={() => handleOpen(item)}
              >
                {item.status === "available"
                  ? t("scenes.gamingRoom.actions.play")
                  : t("scenes.gamingRoom.actions.comingSoon")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

GamingRoomContent.displayName = "GamingRoomContent";
