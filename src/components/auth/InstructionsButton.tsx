"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";
import { memo } from "react";

export const InstructionsButton = memo(function InstructionsButton() {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  const handleClick = () => {
    setScene(SceneType.INSTRUCTIONS);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={<span className="text-2xl">📖</span>}
      tooltip={t("scenes.instructions.title")}
      gradientFrom="#a78bfa"
      gradientTo="#8b5cf6"
    />
  );
});
