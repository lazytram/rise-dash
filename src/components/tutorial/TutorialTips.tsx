import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialTips: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.tips.title")}
      gradientFrom="from-emerald-50"
      gradientTo="to-teal-50"
      borderColor="border-emerald-500"
    >
      <div className="space-y-2 text-sm">
        <div>• {t("scenes.tutorial.tips.tip1")}</div>
        <div>• {t("scenes.tutorial.tips.tip2")}</div>
        <div>• {t("scenes.tutorial.tips.tip3")}</div>
        <div>• {t("scenes.tutorial.tips.tip4")}</div>
      </div>
    </TutorialSection>
  );
};
