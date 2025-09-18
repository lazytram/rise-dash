"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useDojoData } from "@/features/dojo/useDojoData";

type PlayerScore = {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
};

interface ProfileShareCardProps {
  playerScores: PlayerScore[];
  walletAddress?: string | null;
  width?: number;
  height?: number;
}

function formatShortAddress(address?: string | null): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function computeStats(playerScores: PlayerScore[]) {
  const best = playerScores.length ? Number(playerScores[0].score) : 0;
  const total = playerScores.length;
  const avg = playerScores.length
    ? Math.round(
        playerScores.reduce((acc, s) => acc + Number(s.score), 0) /
          playerScores.length
      )
    : 0;
  return { best, total, avg };
}

export const ProfileShareCard: React.FC<ProfileShareCardProps> = ({
  playerScores,
  walletAddress,
  width = 1200,
  height = 630,
}) => {
  const { t, locale } = useTranslations();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedHouse, metas } = useDojoData();
  const dojoMeta = useMemo(
    () => metas.find((m) => m.key === selectedHouse),
    [metas, selectedHouse]
  );

  const stats = useMemo(() => computeStats(playerScores), [playerScores]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    // Responsive sizing: fill container width inside modal
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(0.6, "#6366f1");
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * 0.25,
      height * 0.2,
      10,
      width * 0.25,
      height * 0.2,
      Math.max(width, height) * 0.9
    );
    glow.addColorStop(0, "rgba(255,255,255,0.25)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Card container
    const padding = 40;
    const cardX = padding;
    const cardY = padding;
    const cardW = width - padding * 2;
    const cardH = height - padding * 2;

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    roundRect(ctx, cardX + 8, cardY + 12, cardW, cardH, 28, true, false);
    // Gradient border ring
    const borderGrad = ctx.createLinearGradient(
      cardX,
      cardY,
      cardX + cardW,
      cardY + cardH
    );
    borderGrad.addColorStop(0, "rgba(255,255,255,0.55)");
    borderGrad.addColorStop(1, "rgba(255,255,255,0.25)");
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2.5;
    roundRect(ctx, cardX, cardY, cardW, cardH, 26, true, true);

    // Inner highlight border
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    roundRect(
      ctx,
      cardX + 10,
      cardY + 10,
      cardW - 20,
      cardH - 20,
      22,
      false,
      true
    );

    // Header (fun/impactful)
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 54px Inter, ui-sans-serif, system-ui";
    ctx.fillText(t("scenes.profile.shareCard.title"), cardX + 48, cardY + 100);

    ctx.globalAlpha = 0.95;
    ctx.font = "500 26px Inter, ui-sans-serif, system-ui";
    ctx.fillText(
      t("scenes.profile.shareCard.subtitle"),
      cardX + 48,
      cardY + 145
    );
    ctx.globalAlpha = 1;

    // Subtle divider
    ctx.strokeStyle = "rgba(255,255,255,0.20)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 48, cardY + 165);
    ctx.lineTo(cardX + cardW - 48, cardY + 165);
    ctx.stroke();

    // Stats blocks (cleaner)
    const blockY = cardY + 200;
    const blockH = 200;
    const gap = 24;
    const blockW = (cardW - 48 * 2 - gap * 2) / 3;
    const x0 = cardX + 48;

    const blocks: Array<{
      title: string;
      value: number;
      subtitle: string;
      icon: string;
    }> = [
      {
        title: t("scenes.profile.bestScore"),
        value: stats.best,
        subtitle: t("features.gameplay.meters"),
        icon: "🏆",
      },
      {
        title: t("scenes.profile.totalGames"),
        value: stats.total,
        subtitle: t("scenes.profile.gamesPlayed"),
        icon: "🎮",
      },
      {
        title: t("scenes.profile.averageScore"),
        value: stats.avg,
        subtitle: t("features.gameplay.meters"),
        icon: "📊",
      },
    ];

    blocks.forEach((b, i) => {
      const x = x0 + i * (blockW + gap);
      // Minimal glass tile
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.25;
      roundRect(ctx, x, blockY, blockW, blockH, 18, true, true);

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "600 22px Inter, ui-sans-serif, system-ui";
      ctx.fillText(`${b.icon}  ${b.title}`, x + 24, blockY + 42);

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 56px Inter, ui-sans-serif, system-ui";
      ctx.fillText(
        new Intl.NumberFormat(locale).format(b.value),
        x + 24,
        blockY + 110
      );

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "500 22px Inter, ui-sans-serif, system-ui";
      ctx.fillText(b.subtitle, x + 24, blockY + 150);
    });

    // (Top-right dojo badge intentionally removed)

    // Footer
    const footerY = cardY + cardH - 40;
    // Bottom-left: clan badge instead of brand logo (slightly larger)
    if (dojoMeta) {
      drawDojoBadge(ctx, cardX + 48, footerY - 32, dojoMeta, t);
    }
    const wa = formatShortAddress(walletAddress || undefined);
    if (wa) {
      const text = `ID: ${wa}`;
      const w = ctx.measureText(text).width;
      ctx.fillText(text, cardX + cardW - 48 - w, footerY);
    }

    // Logo
    drawRiceLogo(ctx, cardX + cardW - 80, cardY + 80, 56);
  }, [t, locale, playerScores, walletAddress, width, height, stats, dojoMeta]);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto w-full h-auto rounded-2xl border border-white/20 shadow-2xl"
    />
  );
};

// Extracted: draw a consistent dojo badge
function drawDojoBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dojoMeta: { key: string; titleI18nKey: string },
  t: (k: string) => string
) {
  const colors: Record<string, string> = {
    akaTora: "#ef4444",
    aoiTsuru: "#3b82f6",
    midoriRyuu: "#10b981",
    koganeKitsune: "#f59e0b",
  };
  const color = colors[dojoMeta.key] || "#a78bfa";
  const label = t("dojoDetail.dojoColumn");
  const name = t(dojoMeta.titleI18nKey);
  ctx.font = "600 14px Inter, ui-sans-serif, system-ui";
  const labelW = ctx.measureText(label).width;
  ctx.font = "700 20px Inter, ui-sans-serif, system-ui";
  const nameW = ctx.measureText(name).width;
  const padX = 14,
    chipH = 38,
    emblemW = 22,
    gapTxt = 9;
  const chipW = padX * 2 + emblemW + gapTxt + labelW + gapTxt + nameW;
  const chipGrad = ctx.createLinearGradient(x, y, x + chipW, y);
  chipGrad.addColorStop(0, "rgba(255,255,255,0.06)");
  chipGrad.addColorStop(1, "rgba(255,255,255,0.02)");
  ctx.fillStyle = chipGrad;
  roundRect(ctx, x, y, chipW, chipH, 14, true, false);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, chipW, chipH, 14, false, true);
  // emblem
  const ex = x + padX + emblemW / 2;
  const ey = y + chipH / 2;
  ctx.beginPath();
  ctx.arc(ex, ey, emblemW / 2.35, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  // tiny glyph (logo) inside emblem
  ctx.save();
  ctx.translate(ex, ey);
  if (dojoMeta.key === "akaTora") {
    // tiger face simplified
    ctx.fillStyle = "#ffe4e6";
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, emblemW / 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // stripes
    ctx.beginPath();
    ctx.moveTo(-3, -1);
    ctx.lineTo(-1, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-3, 2);
    ctx.lineTo(-1, 3);
    ctx.stroke();
  } else if (dojoMeta.key === "aoiTsuru") {
    // crane head + beak
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(-1, -1, emblemW / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1, -1);
    ctx.lineTo(6, 0);
    ctx.stroke();
  } else if (dojoMeta.key === "midoriRyuu") {
    // dragon curve
    ctx.strokeStyle = "#065f46";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.quadraticCurveTo(-2, -4, 6, 2);
    ctx.stroke();
  } else if (dojoMeta.key === "koganeKitsune") {
    // fox ears
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(-1, -6);
    ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.fill();
  } else {
    // neutral inner dot fallback
    ctx.beginPath();
    ctx.arc(0, 0, emblemW / 7, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // texts
  let tx = x + padX + emblemW + gapTxt;
  ctx.font = "600 14px Inter, ui-sans-serif, system-ui";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(label, tx, y + chipH / 2 + 5);
  tx += labelW + gapTxt;
  ctx.font = "700 20px Inter, ui-sans-serif, system-ui";
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(name, tx, y + chipH / 2 + 5);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: boolean,
  stroke: boolean
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawRiceLogo(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
) {
  const radius = size / 2;
  const gradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius,
    centerX - radius,
    centerY + radius
  );
  gradient.addColorStop(0, "#4C1D95");
  gradient.addColorStop(0.55, "#7C3AED");
  gradient.addColorStop(1, "#C7D2FE");

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((-15 * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.36, radius * 0.56, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.24, radius * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#F9FAFB";
  ctx.fill();

  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.24, -radius * 0.16);
  ctx.lineTo(radius * 0.24, -radius * 0.16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius * 0.2, 0);
  ctx.lineTo(radius * 0.2, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius * 0.24, radius * 0.16);
  ctx.lineTo(radius * 0.24, radius * 0.16);
  ctx.stroke();
  ctx.restore();
}
