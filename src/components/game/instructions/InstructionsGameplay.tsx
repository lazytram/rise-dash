"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";

export const InstructionsGameplay: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">🎯</span>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {t("scenes.instructions.gameplay.title")}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <span className="text-white text-xs font-bold">🏆</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("scenes.instructions.gameplay.objective")}
              </h3>
              <Text variant="body" className="text-white/90">
                {t("scenes.instructions.gameplay.objectiveDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <span className="text-white text-xs font-bold">⚔️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("scenes.instructions.gameplay.enemies")}
              </h3>
              <Text variant="body" className="text-white/90">
                {t("scenes.instructions.gameplay.enemiesDesc")}
              </Text>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <span className="text-white text-xs font-bold">⭐</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("scenes.instructions.gameplay.powerUps")}
              </h3>
              <Text variant="body" className="text-white/90">
                {t("scenes.instructions.gameplay.powerUpsDesc")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
