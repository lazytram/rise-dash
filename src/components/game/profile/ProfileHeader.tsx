"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";

export const ProfileHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.profile.title")}
      subtitle={t("scenes.profile.subtitle")}
    />
  );
};
