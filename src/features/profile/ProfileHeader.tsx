"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { SceneHeader } from "@/shared/components/SceneHeader";

export const ProfileHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.profile.title")}
      subtitle={t("scenes.profile.subtitle")}
    />
  );
};
