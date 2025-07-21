import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialScoring: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.scoring.title")}
      gradientFrom="from-yellow-50"
      gradientTo="to-amber-50"
      borderColor="border-yellow-500"
    >
      <div className="space-y-1 text-sm">
        <div>• {t("scenes.tutorial.scoring.distance")}</div>
        <div>• {t("scenes.tutorial.scoring.enemies")}</div>
        <div>• {t("scenes.tutorial.scoring.powerUps")}</div>
        <div>• {t("scenes.tutorial.scoring.survival")}</div>
      </div>
    </TutorialSection>
  );
};
