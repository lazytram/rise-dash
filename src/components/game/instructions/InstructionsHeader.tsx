"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { SceneHeader } from "@/components/ui/SceneHeader";

export const InstructionsHeader: React.FC = () => {
  const { t } = useTranslations();

  return (
    <SceneHeader
      title={t("scenes.instructions.title")}
      subtitle={t("scenes.instructions.subtitle")}
    />
  );
};
