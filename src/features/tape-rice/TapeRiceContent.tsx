"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { StatChip } from "@/shared/components/StatChip";
import { MiniGameRewardModal } from "@/shared/components/MiniGameRewardModal";
import { useGameReward } from "@/shared/hooks/useGameReward";
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

  const reward = useGameReward({
    finished: state.finished,
    riceAmount: state.riceEarned,
  });

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

      <MiniGameRewardModal
        isOpen={reward.isOpen}
        onClose={reward.close}
        onSave={reward.save}
        isSaving={reward.isSaving}
        title={t("scenes.tapeRice.congrats")}
        subtitle={t("scenes.tapeRice.riceEarned", { amount: state.riceEarned })}
        emoji="🍙"
      >
        {t("scenes.tapeRice.summary", {
          time: (state.timeLeftMs / 1000).toFixed(1),
        })}
      </MiniGameRewardModal>
    </div>
  );
});

TapeRiceContent.displayName = "TapeRiceContent";
export default TapeRiceContent;
