"use client";

import React, { memo } from "react";
import { cn } from "@/shared/utils/cn";
import { TatamiCell } from "./TatamiCell";
import { Cell, MoleInstance } from "../hooks/useTapeRice";

interface TatamiGridProps {
  cells: Cell[];
  moles: MoleInstance[];
  cols: number;
  rows: number;
  onWhack: (cellId: string) => void;
}

export const TatamiGrid: React.FC<TatamiGridProps> = memo(function TatamiGrid({
  cells,
  moles,
  cols,
  rows,
  onWhack,
}) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 96px)`,
    gridTemplateRows: `repeat(${rows}, 96px)`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("grid gap-4 place-content-center mx-auto")}
      style={gridStyle}
    >
      {cells.map((cell) => {
        const active = moles.find((m) => m.cellId === cell.id);
        return (
          <TatamiCell
            key={cell.id}
            id={cell.id}
            isActive={!!active}
            rare={!!active?.rare}
            decoy={!!active?.decoy}
            onClick={onWhack}
          />
        );
      })}
    </div>
  );
});
