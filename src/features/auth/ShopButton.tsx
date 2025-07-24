"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { CircularButton } from "@/shared/components/CircularButton";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { memo } from "react";

export const ShopButton = memo(function ShopButton() {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.SHOP);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">💎</span>}
      tooltip={t("scenes.shop.title")}
      gradientFrom="#8b5cf6"
      gradientTo="#7c3aed"
    />
  );
});
