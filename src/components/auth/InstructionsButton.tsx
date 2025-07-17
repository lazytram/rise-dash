"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { memo } from "react";

export const InstructionsButton = memo(function InstructionsButton() {
  const { t } = useTranslations();
  const { navigateTo } = useSceneStore();

  const handleClick = () => {
    navigateTo("instructions");
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">📖</span>}
      tooltip={t("instructions.title")}
      gradientFrom="#10b981"
      gradientTo="#059669"
    />
  );
});
