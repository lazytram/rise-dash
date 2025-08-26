"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const InstructionsGameplay: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-gray-100/80 to-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-[#7967e5] to-[#99eafc] rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">🎯</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("scenes.instructions.gameplay.title")}
        </h2>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">🏆</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {t("scenes.instructions.gameplay.objective")}
              </h3>
              <Text variant="body" className="text-gray-700 text-sm">
                {t("scenes.instructions.gameplay.objectiveDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">⚔️</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {t("scenes.instructions.gameplay.enemies")}
              </h3>
              <Text variant="body" className="text-gray-700 text-sm">
                {t("scenes.instructions.gameplay.enemiesDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">⭐</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {t("scenes.instructions.gameplay.powerUps")}
              </h3>
              <Text variant="body" className="text-gray-700 text-sm">
                {t("scenes.instructions.gameplay.powerUpsDesc")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
