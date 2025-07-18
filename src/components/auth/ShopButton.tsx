"use client";

import { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useSceneStore } from "@/store/sceneStore";
import { CircularButton } from "@/components/ui/CircularButton";

export const ShopButton = memo(function ShopButton() {
  const { t } = useTranslations();
  const { navigateTo } = useSceneStore();

  const handleClick = () => {
    navigateTo("shop");
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-xl">🏪</span>}
      tooltip={t("shop.title")}
      gradientFrom="#f59e0b"
      gradientTo="#ea580c"
      className="hover:from-yellow-600 hover:to-orange-600"
    />
  );
});
