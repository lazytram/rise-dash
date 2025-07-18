"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";

export const InstructionsControls: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">🎮</span>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {t("scenes.instructions.controls.title")}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">↑</span>
            </div>
            <Text variant="bold" className="font-medium text-white">
              {t("scenes.instructions.controls.jump")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 rounded-lg text-white font-mono font-bold shadow-lg">
            ↑
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">🔥</span>
            </div>
            <Text variant="bold" className="font-medium text-white">
              {t("scenes.instructions.controls.shoot")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-red-400 to-pink-500 px-4 py-2 rounded-lg text-white font-mono font-bold shadow-lg">
            SPACE
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">▶</span>
            </div>
            <Text variant="bold" className="font-medium text-white">
              {t("scenes.instructions.controls.start")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg text-white font-mono font-bold shadow-lg">
            SPACE / ↑
          </span>
        </div>
      </div>
    </div>
  );
};
