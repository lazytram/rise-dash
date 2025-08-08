"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const InstructionsGameplay: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-[#7967e5]/20 to-[#99eafc]/20 rounded-xl p-4 border border-[#7967e5]/30 backdrop-blur-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-[#7967e5] to-[#99eafc] rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">🎯</span>
        </div>
        <h2 className="text-lg font-semibold text-white">
          {t("scenes.instructions.gameplay.title")}
        </h2>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-white/10 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">🏆</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                {t("scenes.instructions.gameplay.objective")}
              </h3>
              <Text variant="body" className="text-white/90 text-sm">
                {t("scenes.instructions.gameplay.objectiveDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">⚔️</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                {t("scenes.instructions.gameplay.enemies")}
              </h3>
              <Text variant="body" className="text-white/90 text-sm">
                {t("scenes.instructions.gameplay.enemiesDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">⭐</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                {t("scenes.instructions.gameplay.powerUps")}
              </h3>
              <Text variant="body" className="text-white/90 text-sm">
                {t("scenes.instructions.gameplay.powerUpsDesc")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
