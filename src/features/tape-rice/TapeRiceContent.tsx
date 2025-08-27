"use client";

import React, { memo, useEffect, useState } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { StatChip } from "@/shared/components/StatChip";
import { Modal } from "@/shared/components/Modal";
import { useRice } from "@/shared/hooks/useRice";
import { useTapeRice } from "./hooks/useTapeRice";
import { TapeRiceLegend } from "./components/TapeRiceLegend";
import { TatamiGrid } from "./components/TatamiGrid";
import { TapeRiceHeader } from "./components/TapeRiceHeader";
import { TapeRiceResultsBar } from "./components/TapeRiceResultsBar";

export const TapeRiceContent: React.FC = memo(() => {
  const { t } = useTranslations();
  const { state, start, stop, reset, handleWhack, formattedTime, cfg } =
    useTapeRice({
      rows: 3,
      cols: 3,
      durationMs: 30_000,
      spawnIntervalMs: 900,
      moleLifetimeMs: 600,
      rareChance: 1 / 30,
      maxConcurrentMoles: 1,
      maxRicePerGame: 30,
    });

  const [open, setOpen] = useState(false);
  const { addRICE, isAdding } = useRice();

  useEffect(() => {
    if (state.finished && state.riceEarned > 0) setOpen(true);
  }, [state.finished, state.riceEarned]);

  const handleSave = async () => {
    await addRICE(state.riceEarned);
    setOpen(false);
  };

  // grid style now encapsulated by TatamiGrid

  return (
    <div className="w-full">
      <TapeRiceHeader
        running={state.running}
        finished={state.finished}
        canReset={
          state.finished ||
          (!state.running && state.timeLeftMs < cfg.durationMs)
        }
        onStart={start}
        onPause={stop}
        onReset={reset}
      />

      <div className="mb-4 flex items-center gap-3 text-sm flex-wrap">
        <StatChip>
          {t("scenes.tapeRice.timer")}: {formattedTime}
        </StatChip>
        <StatChip>
          {t("scenes.tapeRice.score")}: {state.score}
        </StatChip>
        <StatChip>
          {t("scenes.tapeRice.combo")}: {state.combo} (max {state.bestCombo})
        </StatChip>
        <StatChip>
          {t("scenes.tapeRice.rice")}: +{state.riceEarned}
        </StatChip>
        {/* Inline legend at StatChip level */}
        <TapeRiceLegend />
      </div>
      {/* spacing below chips */}
      <div className="mb-2" />

      <TatamiGrid
        cells={state.cells}
        moles={state.moles}
        cols={cfg.cols}
        rows={cfg.rows}
        onWhack={handleWhack}
      />

      <TapeRiceResultsBar
        visible={state.finished}
        score={state.score}
        riceEarned={state.riceEarned}
        onPlayAgain={reset}
      />

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t("scenes.tapeRice.congrats")}
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🍙</div>
            <div className="text-lg font-semibold">
              {t("scenes.tapeRice.riceEarned", { amount: state.riceEarned })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("scenes.tapeRice.summary", {
                time: (state.timeLeftMs / 1000).toFixed(1),
              })}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("common.close")}
            </Button>
            <Button onClick={handleSave} loading={isAdding}>
              {t("features.blockchain.saveScore")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

TapeRiceContent.displayName = "TapeRiceContent";
export default TapeRiceContent;
