import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { TutorialSection } from "./TutorialSection";

export const TutorialPowerUps: React.FC = () => {
  const { t } = useTranslations();

  return (
    <TutorialSection
      title={t("scenes.tutorial.powerUps.title")}
      gradientFrom="from-purple-50"
      gradientTo="to-indigo-50"
      borderColor="border-purple-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-semibold">
            🛡️ {t("scenes.tutorial.powerUps.shield")}:
          </span>
          <p className="text-gray-600">
            {t("scenes.tutorial.powerUps.shieldDesc")}
          </p>
        </div>
        <div>
          <span className="font-semibold">
            ∞ {t("scenes.tutorial.powerUps.infiniteAmmo")}:
          </span>
          <p className="text-gray-600">
            {t("scenes.tutorial.powerUps.infiniteAmmoDesc")}
          </p>
        </div>
        <div>
          <span className="font-semibold">
            ⚡ {t("scenes.tutorial.powerUps.jumpBoost")}:
          </span>
          <p className="text-gray-600">
            {t("scenes.tutorial.powerUps.jumpBoostDesc")}
          </p>
        </div>
        <div>
          <span className="font-semibold">
            ⏰ {t("scenes.tutorial.powerUps.slowMotion")}:
          </span>
          <p className="text-gray-600">
            {t("scenes.tutorial.powerUps.slowMotionDesc")}
          </p>
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">
            🎯 {t("scenes.tutorial.powerUps.multiShot")}:
          </span>
          <p className="text-gray-600">
            {t("scenes.tutorial.powerUps.multiShotDesc")}
          </p>
        </div>
      </div>
    </TutorialSection>
  );
};
