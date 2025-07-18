"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";

export const InstructionsActions: React.FC = () => {
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">🚀</span>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {t("common.playNow")}
        </h2>
      </div>
      <div className="text-center">
        <Button
          onClick={() => setScene(SceneType.GAME)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {t("common.playNow")}
        </Button>
      </div>
    </div>
  );
};
