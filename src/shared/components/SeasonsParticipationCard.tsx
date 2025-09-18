"use client";

import React, { useMemo } from "react";
import { Card } from "./Card";
import { useTranslations } from "@/shared/hooks/useTranslations";

export interface SeasonsParticipationCardProps {
  className?: string;
  seasons: Array<{ id: number; distance: number }>;
}

export const SeasonsParticipationCard: React.FC<
  SeasonsParticipationCardProps
> = ({ className = "", seasons }) => {
  const { t } = useTranslations();
  const participated = useMemo(
    () => seasons.filter((s) => s.distance > 0).length,
    [seasons]
  );
  const ITEM_HEIGHT = 44; // px, approx row height
  const maxVisible = 5;
  const maxHeight = ITEM_HEIGHT * maxVisible;
  return (
    <Card className={`p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">
          {t("features.seasons.participation.title")}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("features.seasons.participation.participated")
            .replace("{{count}}", String(participated))
            .replace("{{total}}", String(seasons.length))}
        </div>
      </div>
      <div
        className="rounded-xl border border-white/60 bg-white/60 overflow-y-auto"
        style={{ maxHeight }}
      >
        <ul className="divide-y divide-white/60 text-sm">
          {seasons.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5"
            >
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-300">
                S{s.id}
              </span>
              <div className="font-medium">Season {s.id}</div>
              <div className="text-right text-foreground/80 font-medium whitespace-nowrap">
                {s.distance > 0 ? `${s.distance.toLocaleString()} m` : "—"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
