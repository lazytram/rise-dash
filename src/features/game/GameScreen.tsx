"use client";

import Game from "./Game";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Scene } from "@/shared/components/Scene";

export function GameScreen() {
  const { t } = useTranslations();

  return (
    <Scene
      sceneKey="game"
      config={{
        showCard: false,
        fullHeight: true,
        padding: "none",
        maxWidth: "full",
      }}
    >
      <div className="w-full">
        <h1 className="text-4xl font-bold text-foreground text-center mb-4">
          {t("common.title")}
        </h1>
        <Game />
      </div>
    </Scene>
  );
}
