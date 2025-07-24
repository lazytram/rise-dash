import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialObjective: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.objective.title")}
      gradientFrom="from-blue-50"
      gradientTo="to-purple-50"
      borderColor="border-blue-500"
    >
      <p className="text-gray-700">
        {t("scenes.tutorial.objective.description")}
      </p>
    </TutorialSection>
  );
};
