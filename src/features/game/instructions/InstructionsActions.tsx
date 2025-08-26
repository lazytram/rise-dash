"use client";

import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";

export const InstructionsActions: React.FC = () => {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  return (
    <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-[#7967e5] to-[#99eafc] rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">🚀</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("common.playNow")}
        </h2>
      </div>
      <div className="text-center">
        <Button
          onClick={() => setScene(SceneType.GAME)}
          className="bg-gradient-to-r from-[#7967e5] to-[#99eafc] hover:from-[#6d5ce7] hover:to-[#88d8f0] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          {t("common.playNow")}
        </Button>
      </div>
    </div>
  );
};
