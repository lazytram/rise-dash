"use client";

import { memo } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useDojoStore, DojoHouse } from "@/infrastructure/store/dojoStore";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { cn } from "@/shared/utils/cn";
import { useDojoData } from "../useDojoData";

// Legacy type removed; data now sourced from useDojoData

const selectionGradient: Record<DojoHouse, string> = {
  akaTora: "from-red-500/90 to-red-700/90",
  aoiTsuru: "from-sky-500/90 to-blue-700/90",
  midoriRyuu: "from-emerald-500/90 to-emerald-700/90",
  koganeKitsune: "from-amber-400/90 to-yellow-600/90",
};

export const DojoSelection = memo(function DojoSelection() {
  const { t } = useTranslations();
  const { selectedHouse, setHouse } = useDojoStore();
  const { setScene } = useSceneStore();
  const { metas } = useDojoData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metas.map((meta) => {
          const isActive = selectedHouse === meta.key;
          return (
            <Card
              key={meta.key}
              className={cn(
                "relative overflow-hidden border border-primary/20 p-5 transition-all duration-300",
                isActive ? "ring-2 ring-primary" : "hover:shadow-lg"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 -z-10 bg-gradient-to-br opacity-20",
                  selectionGradient[meta.key]
                )}
              />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {t(meta.titleI18nKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(meta.mottoI18nKey)}
                  </p>
                </div>
                {meta.Icon ? (
                  <meta.Icon className="w-12 h-12" />
                ) : (
                  <div className="text-4xl" aria-hidden></div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant={isActive ? "primary" : "gradient"}
                  size="sm"
                  onClick={() => {
                    setHouse(meta.key);
                    setScene(SceneType.DOJO_DETAIL);
                  }}
                >
                  {isActive ? t("dojo.selected") : t("dojo.choose")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
