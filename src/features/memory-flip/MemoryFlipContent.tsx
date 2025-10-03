"use client";

import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { StatChip } from "@/shared/components/StatChip";
import { MiniGameRewardModal } from "@/shared/components/MiniGameRewardModal";
import { useGameReward } from "@/shared/hooks/useGameReward";
import { cn } from "@/shared/utils/cn";
import { useMemoryFlip } from "./hooks/useMemoryFlip";
import { MemoryCard } from "./components/MemoryCard";

export const MemoryFlipContent: React.FC = memo(() => {
  const { t } = useTranslations();

  const {
    deck,
    gridSize,
    setGridSize,
    handleFlip,
    moves,
    elapsedMs,
    matchedPairs,
    totalPairs,
    finished,
    score,
    riceReward,
    reset,
  } = useMemoryFlip(4, 3);

  // Stable container width so it doesn't jump when changing grid size
  const CELL_SIZE = 100; // must match MemoryCard
  const MAX_COLS = 5; // for 5x4 preset
  const GAP_PX = 8; // gap-2
  const containerWidth = MAX_COLS * CELL_SIZE + (MAX_COLS - 1) * GAP_PX;

  // Modal & save to blockchain
  const reward = useGameReward({
    finished,
    riceAmount: riceReward,
  });

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("scenes.memoryFlip.title")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("scenes.memoryFlip.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-1 p-1 rounded-xl glass border border-primary/20">
            {[
              { c: 4, r: 3 },
              { c: 4, r: 4 },
              { c: 5, r: 4 },
            ].map((opt) => {
              const isActive = gridSize[0] === opt.c && gridSize[1] === opt.r;
              const pairsOpt = (opt.c * opt.r) / 2;
              return (
                <button
                  key={`${opt.c}x${opt.r}`}
                  onClick={() =>
                    setGridSize([opt.c, opt.r] as [number, number])
                  }
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs sm:text-sm border transition-all duration-200",
                    isActive
                      ? "bg-primary-light text-primary border-primary/40 shadow"
                      : "bg-transparent text-foreground/80 border-transparent hover:bg-primary-light/40"
                  )}
                  aria-pressed={isActive}
                >
                  <span className="font-semibold">
                    {opt.c}×{opt.r}
                  </span>
                  <span className="ml-2 text-muted-foreground hidden sm:inline">
                    ({pairsOpt} {t("scenes.memoryFlip.pairs").toLowerCase()})
                  </span>
                </button>
              );
            })}
          </div>
          <Button variant="secondary" size="sm" onClick={reset}>
            {t("scenes.memoryFlip.reset")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-3 text-sm">
        <StatChip>
          {t("scenes.memoryFlip.moves")}: {moves}
        </StatChip>
        <StatChip>
          {t("scenes.memoryFlip.time")}: {(elapsedMs / 1000).toFixed(1)}s
        </StatChip>
        <StatChip>
          {t("scenes.memoryFlip.pairs")}: {matchedPairs}/{totalPairs}
        </StatChip>
      </div>

      {/* Grid */}
      <div
        className={cn("grid gap-2 mx-auto")}
        style={{
          gridTemplateColumns: `repeat(${gridSize[0]}, ${CELL_SIZE}px)`,
          width: `${containerWidth}px`,
          justifyContent: "center",
        }}
      >
        {deck.map((c) => (
          <MemoryCard key={c.id} card={c} onClick={() => handleFlip(c.id)} />
        ))}
      </div>

      {/* Result footer */}
      {finished && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("scenes.memoryFlip.finalScore")}: {score.toFixed(1)}
          </div>
          <div className="text-sm font-semibold gradient-bg text-white px-3 py-1 rounded-lg shadow">
            {t("scenes.memoryFlip.riceEarned", { amount: riceReward })}
          </div>
          <Button onClick={reset}>{t("scenes.memoryFlip.playAgain")}</Button>
        </div>
      )}

      {/* Reward Modal */}
      <MiniGameRewardModal
        isOpen={reward.isOpen}
        onClose={reward.close}
        onSave={reward.save}
        isSaving={reward.isSaving}
        title={t("scenes.memoryFlip.congrats")}
        subtitle={t("scenes.memoryFlip.riceEarned", { amount: riceReward })}
        emoji="🍚"
      >
        {t("scenes.memoryFlip.summary", {
          moves,
          time: (elapsedMs / 1000).toFixed(1),
        })}
      </MiniGameRewardModal>
    </div>
  );
});

MemoryFlipContent.displayName = "MemoryFlipContent";
export default MemoryFlipContent;
