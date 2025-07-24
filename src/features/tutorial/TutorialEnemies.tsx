import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialEnemies: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.enemies.title")}
      gradientFrom="from-red-50"
      gradientTo="to-pink-50"
      borderColor="border-red-500"
    >
      <div className="space-y-2">
        <div>
          <span className="font-semibold">
            {t("scenes.tutorial.enemies.samurai")}:
          </span>
          <span className="text-sm ml-2">
            {t("scenes.tutorial.enemies.samuraiDesc")}
          </span>
        </div>
        <div>
          <span className="font-semibold">
            {t("scenes.tutorial.enemies.ninja")}:
          </span>
          <span className="text-sm ml-2">
            {t("scenes.tutorial.enemies.ninjaDesc")}
          </span>
        </div>
        <div>
          <span className="font-semibold">
            {t("scenes.tutorial.enemies.boss")}:
          </span>
          <span className="text-sm ml-2">
            {t("scenes.tutorial.enemies.bossDesc")}
          </span>
        </div>
      </div>
    </TutorialSection>
  );
};
