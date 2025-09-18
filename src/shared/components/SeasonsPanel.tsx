"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { SeasonsHistoryModal } from "./SeasonsHistoryModal";
import { useTranslations } from "@/shared/hooks/useTranslations";

export interface SeasonsPanelProps {
  className?: string;
  currentSeason?: { id: number; startTimeMs: number; endTimeMs: number } | null;
  recentSeasons?: Array<{ id: number; startTimeMs: number; endTimeMs: number }>;
}

export const SeasonsPanel: React.FC<SeasonsPanelProps> = ({
  className = "",
  currentSeason,
  recentSeasons = [],
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { t } = useTranslations();
  const hasSeasons = !!currentSeason || recentSeasons.length > 0;
  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  return (
    <Card className={`p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold text-foreground">
          {t("features.seasons.panel.title")}
        </div>
        {hasSeasons && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsHistoryOpen(true)}
          >
            {t("features.seasons.panel.history")}
          </Button>
        )}
      </div>
      <div className="space-y-5">
        {currentSeason ? (
          <div
            className="rounded-xl px-4 py-3 shadow-sm"
            style={{
              background:
                "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.08) 100%)",
              border: "1px solid rgba(99,102,241,0.35)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                <div className="font-medium text-indigo-900 text-base truncate">
                  Current: S{currentSeason.id}
                </div>
              </div>
              <div className="text-sm text-indigo-900/90 font-medium whitespace-nowrap">
                {fmt(currentSeason.startTimeMs)} <span className="mx-1">→</span>{" "}
                {fmt(currentSeason.endTimeMs)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("features.seasons.panel.noActive")}
          </div>
        )}

        {recentSeasons.length > 0 && (
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2 tracking-wide">
              {t("features.seasons.panel.past")}
            </div>
            <div className="rounded-xl border border-white/60 bg-white/60 max-h-56 overflow-y-auto">
              <ul className="divide-y divide-white/60 text-sm">
                {recentSeasons.map((s) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-2 items-center px-4 py-2.5 hover:bg-white/70"
                  >
                    <div className="font-medium">Season {s.id}</div>
                    <div className="text-right text-foreground/70 font-medium whitespace-nowrap">
                      {fmt(s.startTimeMs)} <span className="mx-1">→</span>{" "}
                      {fmt(s.endTimeMs)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <SeasonsHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </Card>
  );
};
