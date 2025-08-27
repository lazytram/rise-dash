"use client";

import React, { memo } from "react";
import { cn } from "@/shared/utils/cn";

interface TatamiCellProps {
  id: string;
  rare?: boolean;
  decoy?: boolean;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const TatamiCell: React.FC<TatamiCellProps> = memo(
  ({ id, rare, decoy, isActive, onClick }) => {
    return (
      <button
        onClick={() => onClick(id)}
        className={cn(
          "relative w-24 h-24 rounded-xl transition-all select-none",
          // Woven tatami: grid + subtle diagonal fibers
          "bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.04)_50%,rgba(255,255,255,0.04)_75%,transparent_75%,transparent)]",
          "bg-[length:8px_100%,100%_8px,12px_12px] bg-[position:0_0,0_0,0_0]",
          "bg-emerald-900/30 border border-emerald-600/30 shadow-inner",
          isActive
            ? decoy
              ? "ring-2 ring-destructive shadow-destructive/20 shadow"
              : rare
                ? "ring-2 ring-yellow-400 shadow-yellow-300/30 shadow-lg"
                : "ring-2 ring-primary/60 shadow-primary/20 shadow"
            : "ring-0",
          "hover:scale-[1.03] active:scale-95"
        )}
        aria-pressed={isActive}
      >
        {/* inner well */}
        <div
          className={cn(
            "absolute inset-1 rounded-lg",
            "bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.28),transparent_60%)]",
            "backdrop-blur-[0.5px]"
          )}
        />
        {isActive && (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-3xl",
              rare
                ? "text-yellow-300"
                : decoy
                  ? "text-destructive"
                  : "text-white"
            )}
          >
            {rare ? "🍙" : "🦝"}
          </span>
        )}
      </button>
    );
  }
);

TatamiCell.displayName = "TatamiCell";
