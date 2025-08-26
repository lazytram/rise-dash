"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const InstructionsTips: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-gray-100/80 to-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-[#7967e5] to-[#99eafc] rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">💡</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("scenes.instructions.tips.title")}
        </h2>
      </div>
      <ul className="space-y-2">
        <li className="flex items-start p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="w-5 h-5 bg-[#7967e5] rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <Text variant="body" className="text-gray-700 text-sm">
            {t("scenes.instructions.tips.tip1")}
          </Text>
        </li>
        <li className="flex items-start p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="w-5 h-5 bg-[#99eafc] rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
            <span className="text-white text-xs font-bold">2</span>
          </div>
          <Text variant="body" className="text-gray-700 text-sm">
            {t("scenes.instructions.tips.tip2")}
          </Text>
        </li>
        <li className="flex items-start p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="w-5 h-5 bg-[#7967e5] rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <Text variant="body" className="text-gray-700 text-sm">
            {t("scenes.instructions.tips.tip3")}
          </Text>
        </li>
        <li className="flex items-start p-2 bg-white/80 rounded-lg border border-gray-200/50">
          <div className="w-5 h-5 bg-[#99eafc] rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <Text variant="body" className="text-gray-700 text-sm">
            {t("scenes.instructions.tips.tip4")}
          </Text>
        </li>
      </ul>
    </div>
  );
};
