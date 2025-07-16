"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";

export const InstructionsTips: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">💡</span>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {t("instructions.tips.title")}
        </h2>
      </div>
      <ul className="space-y-3">
        <li className="flex items-start p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <Text variant="body" className="text-white/90 leading-relaxed">
            {t("instructions.tips.tip1")}
          </Text>
        </li>
        <li className="flex items-start p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <span className="text-white text-xs font-bold">2</span>
          </div>
          <Text variant="body" className="text-white/90 leading-relaxed">
            {t("instructions.tips.tip2")}
          </Text>
        </li>
        <li className="flex items-start p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <Text variant="body" className="text-white/90 leading-relaxed">
            {t("instructions.tips.tip3")}
          </Text>
        </li>
        <li className="flex items-start p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <Text variant="body" className="text-white/90 leading-relaxed">
            {t("instructions.tips.tip4")}
          </Text>
        </li>
      </ul>
    </div>
  );
};
