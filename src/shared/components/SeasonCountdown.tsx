"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Text } from "./Text";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { SeasonBadge } from "./SeasonBadge";

export interface SeasonCountdownProps {
  className?: string;
  seasonId?: number;
  endTimeMs: number; // unix ms
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  parts.push(`${hours}h`, `${minutes}m`, `${seconds}s`);
  return parts.join(" ");
}

export const SeasonCountdown: React.FC<SeasonCountdownProps> = ({
  className = "",
  seasonId,
  endTimeMs,
}) => {
  const [now, setNow] = useState<number>(() => Date.now());
  const { t } = useTranslations();
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const remainingMs = useMemo(() => endTimeMs - now, [endTimeMs, now]);
  const finished = remainingMs <= 0;
  const label = finished
    ? t("features.seasons.countdown.finished")
    : t("features.seasons.countdown.endsIn").replace(
        "{{id}}",
        String(seasonId ?? "")
      );
  const totalMs = Math.max(1, endTimeMs - (now - (endTimeMs - remainingMs)));
  const progress = Math.min(
    100,
    Math.max(0, 100 - (remainingMs / totalMs) * 100)
  );

  return (
    <div
      className={`flex items-center justify-center space-x-3 p-3 rounded-xl ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(99,102,241,0.15) 0%, rgba(59,130,246,0.15) 100%)",
        border: "2px solid rgba(99,102,241,0.35)",
        boxShadow:
          "0 6px 16px rgba(99,102,241,0.12), inset 0 0 0 1px rgba(255,255,255,0.22)",
      }}
    >
      <SeasonBadge seasonId={seasonId ?? 0} size={32} />
      <div className="flex flex-col items-start leading-tight w-full">
        <Text className="text-indigo-950 font-semibold text-sm tracking-wide">
          {label}
        </Text>
        <div className="w-full mt-1 h-2.5 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#6366f1,#3b82f6)",
            }}
          />
        </div>
        <Text className="text-indigo-900 font-extrabold text-base mt-1">
          {finished ? "00h 00m 00s" : formatDuration(remainingMs)}
        </Text>
      </div>
    </div>
  );
};
