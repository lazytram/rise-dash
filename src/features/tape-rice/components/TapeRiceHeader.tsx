"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";

interface TapeRiceHeaderProps {
  running: boolean;
  finished: boolean;
  canReset: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TapeRiceHeader: React.FC<TapeRiceHeaderProps> = memo(
  function TapeRiceHeader({
    running,
    finished,
    canReset,
    onStart,
    onPause,
    onReset,
  }) {
    const { t } = useTranslations();
    return (
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("scenes.tapeRice.title")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("scenes.tapeRice.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {!running && !finished && (
            <Button onClick={onStart}>
              {t("scenes.tapeRice.actions.start")}
            </Button>
          )}
          {running && (
            <Button variant="secondary" onClick={onPause}>
              {t("scenes.tapeRice.actions.pause")}
            </Button>
          )}
          {canReset && (
            <Button variant="secondary" onClick={onReset}>
              {t("scenes.tapeRice.actions.reset")}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
