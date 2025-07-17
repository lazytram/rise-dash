import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SCENE_COLORS } from "@/constants/colors";

export const InstructionsHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("instructions.title")}
      subtitle={t("instructions.subtitle")}
      gradientFrom={SCENE_COLORS.INSTRUCTIONS.GRADIENT_FROM}
      gradientVia={SCENE_COLORS.INSTRUCTIONS.GRADIENT_VIA}
      gradientTo={SCENE_COLORS.INSTRUCTIONS.GRADIENT_TO}
    />
  );
};
