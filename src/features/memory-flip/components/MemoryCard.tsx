"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { MemoryCardState } from "../hooks/useMemoryFlip";

interface Props {
  card: MemoryCardState;
  onClick: () => void;
}

export const MemoryCard: React.FC<Props> = ({ card, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-[100px] h-[100px] rounded-lg cursor-pointer",
        "border border-primary/20 glass shadow hover:shadow-md transition-all duration-300 hover:scale-[1.02]",
        card.matched && "ring-1 ring-success/60",
        card.flipped && !card.matched && "bg-background"
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        {card.flipped || card.matched ? card.emoji : "🀫"}
      </div>
      {!card.flipped && !card.matched && (
        <div className="absolute inset-0 gradient-bg opacity-80 rounded-lg" />
      )}
    </button>
  );
};
