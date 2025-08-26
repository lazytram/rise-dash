"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const InstructionsControls: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-gray-100/80 to-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-[#7967e5] to-[#99eafc] rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">🎮</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("scenes.instructions.controls.title")}
        </h2>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">↑</span>
            </div>
            <Text variant="bold" className="font-medium text-gray-900 text-sm">
              {t("scenes.instructions.controls.jump")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 rounded-lg text-white font-mono font-bold text-sm shadow-lg">
            ↑
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">🔥</span>
            </div>
            <Text variant="bold" className="font-medium text-gray-900 text-sm">
              {t("scenes.instructions.controls.shoot")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-red-400 to-pink-500 px-3 py-1 rounded-lg text-white font-mono font-bold text-sm shadow-lg">
            SPACE
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">▶</span>
            </div>
            <Text variant="bold" className="font-medium text-gray-900 text-sm">
              {t("scenes.instructions.controls.start")}
            </Text>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-lg text-white font-mono font-bold text-sm shadow-lg">
            SPACE / ↑
          </span>
        </div>
      </div>
    </div>
  );
};
