import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialControls: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.controls.title")}
      gradientFrom="from-green-50"
      gradientTo="to-emerald-50"
      borderColor="border-green-500"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
            ↑
          </kbd>
          <span className="text-sm">{t("scenes.tutorial.controls.jump")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
            {t("scenes.tutorial.controls.space")}
          </kbd>
          <span className="text-sm">{t("scenes.tutorial.controls.shoot")}</span>
        </div>
      </div>
    </TutorialSection>
  );
};
