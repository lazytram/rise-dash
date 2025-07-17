import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SCENE_COLORS } from "@/constants/colors";

export const ProfileHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      gradientFrom={SCENE_COLORS.PROFILE.GRADIENT_FROM}
      gradientVia={SCENE_COLORS.PROFILE.GRADIENT_VIA}
      gradientTo={SCENE_COLORS.PROFILE.GRADIENT_TO}
    />
  );
};
