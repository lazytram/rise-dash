"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { SceneHeader } from "@/shared/components/SceneHeader";

export const InstructionsHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.instructions.title")}
      subtitle={t("scenes.instructions.subtitle")}
    />
  );
};
