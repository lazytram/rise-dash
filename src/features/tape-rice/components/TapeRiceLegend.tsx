"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";

export const TapeRiceLegend: React.FC = memo(function TapeRiceLegend() {
  const { t } = useTranslations();
  return (
    <div className="flex items-center gap-2 ml-1">
      <div className="px-2 py-1 rounded-lg border border-primary/20 bg-primary-light/10 flex items-center gap-1">
        <span>🦝</span>
        <span className="text-foreground/80 text-xs">
          {t("scenes.tapeRice.legend.hit")}
        </span>
        <span className="ml-1 text-xs font-semibold text-primary">+1</span>
      </div>
      <div className="px-2 py-1 rounded-lg border border-yellow-300/40 bg-yellow-300/10 flex items-center gap-1">
        <span>🍙</span>
        <span className="text-foreground/80 text-xs">
          {t("scenes.tapeRice.legend.rare")}
        </span>
        <span className="ml-1 text-xs font-semibold text-yellow-600">+5</span>
      </div>
    </div>
  );
});
