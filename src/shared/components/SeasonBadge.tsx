"use client";

import React, { useMemo } from "react";
import { cn } from "@/shared/utils/cn";

export interface SeasonBadgeProps {
  seasonId: number;
  size?: number; // px
  className?: string;
  showLabel?: boolean;
}

// Small set of vibrant palettes, rotated by season number
const PALETTES: Array<{
  baseA: string;
  baseB: string;
  ring: string;
  accent: string;
  text: string;
}> = [
  {
    baseA: "#6366F1",
    baseB: "#3B82F6",
    ring: "#A78BFA",
    accent: "#22D3EE",
    text: "#0F172A",
  },
  {
    baseA: "#EF4444",
    baseB: "#F59E0B",
    ring: "#FDBA74",
    accent: "#FDE68A",
    text: "#111827",
  },
  {
    baseA: "#10B981",
    baseB: "#34D399",
    ring: "#6EE7B7",
    accent: "#22D3EE",
    text: "#064E3B",
  },
  {
    baseA: "#06B6D4",
    baseB: "#3B82F6",
    ring: "#93C5FD",
    accent: "#A78BFA",
    text: "#0C4A6E",
  },
  {
    baseA: "#F59E0B",
    baseB: "#F97316",
    ring: "#FDBA74",
    accent: "#FDE68A",
    text: "#78350F",
  },
];

export const SeasonBadge: React.FC<SeasonBadgeProps> = ({
  seasonId,
  size = 32,
  className,
  showLabel = false,
}) => {
  const p = PALETTES[(Math.abs(seasonId) || 0) % PALETTES.length];
  const rays = 6 + ((Math.abs(seasonId) || 0) % 6); // 6..11 rays
  const rotation = ((Math.abs(seasonId) || 0) * 17) % 360; // rotate pattern
  const uid = useMemo(
    () => `sb_${seasonId}_${size}_${rays}`,
    [seasonId, size, rays]
  );

  const view = 64; // viewbox size for consistent drawing
  const center = view / 2;
  const outer = center - 2;
  const inner = center - 8;

  // Generate a spiky star path for accent
  const starPath = useMemo(() => {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < rays * 2; i++) {
      const angle =
        ((Math.PI * 2) / (rays * 2)) * i + (rotation * Math.PI) / 180;
      const r = i % 2 === 0 ? inner : inner * 0.6;
      points.push([center + Math.cos(angle) * r, center + Math.sin(angle) * r]);
    }
    return `M ${points
      .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" L ")} Z`;
  }, [rays, rotation, inner, center]);

  return (
    <div
      className={cn("inline-flex items-center gap-2 select-none", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${view} ${view}`}
        aria-hidden={!showLabel}
      >
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={p.baseA} stopOpacity="1" />
            <stop offset="100%" stopColor={p.baseB} stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`${uid}_ring`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.ring} stopOpacity="1" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="1" />
          </linearGradient>
          <filter
            id={`${uid}_shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.2"
              floodColor="#000"
              floodOpacity="0.25"
            />
          </filter>
        </defs>

        {/* Outer disc */}
        <circle
          cx={center}
          cy={center}
          r={outer}
          fill={`url(#${uid}_bg)`}
          filter={`url(#${uid}_shadow)`}
        />

        {/* Decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={outer - 2}
          fill="none"
          stroke={`url(#${uid}_ring)`}
          strokeWidth="2.5"
          strokeDasharray={`${Math.max(20, 28 - (seasonId % 7) * 2)} ${
            10 + (seasonId % 5) * 3
          }`}
          transform={`rotate(${rotation} ${center} ${center})`}
        />

        {/* Star accent */}
        <path d={starPath} fill={p.accent} opacity="0.18" />

        {/* Center medallion */}
        <circle
          cx={center}
          cy={center}
          r={inner * 0.55}
          fill="#fff"
          opacity="0.9"
        />
        <circle
          cx={center}
          cy={center}
          r={inner * 0.52}
          fill={p.ring}
          opacity="0.25"
        />

        {/* Season number */}
        <text
          x={center}
          y={center + 2}
          textAnchor="middle"
          fontSize={inner * 0.5}
          fontWeight={800}
          fill={p.text}
        >
          {seasonId}
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold text-foreground">
          Season {seasonId}
        </span>
      )}
    </div>
  );
};




