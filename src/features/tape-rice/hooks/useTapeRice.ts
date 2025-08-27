"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Cell {
  id: string;
  row: number;
  col: number;
}

export interface MoleInstance {
  id: string;
  cellId: string;
  // true = golden onigiri (rare, +5 RICE), false = normal (+1 RICE)
  rare: boolean;
  // decoy moles reset combo and give no rice
  decoy?: boolean;
  // When the mole appeared (ms)
  appearedAtMs: number;
  // When the mole should disappear (ms)
  despawnAtMs: number;
}

export interface TapeRiceState {
  cells: Cell[];
  moles: MoleInstance[];
  timeLeftMs: number;
  score: number;
  riceEarned: number;
  running: boolean;
  startedAtMs?: number;
  finished: boolean;
  combo: number;
  bestCombo: number;
}

export interface UseTapeRiceOptions {
  rows?: number;
  cols?: number;
  durationMs?: number; // default 30s
  spawnIntervalMs?: number; // how often a mole spawns
  moleLifetimeMs?: number; // how long a mole stays visible
  rareChance?: number; // probability in [0,1]
  maxConcurrentMoles?: number; // limit simultaneous moles
  maxRicePerGame?: number; // clamp rice earned per game
  decoyChance?: number; // probability of spawning a decoy trap
}

const DEFAULTS: Required<UseTapeRiceOptions> = {
  rows: 3,
  cols: 3,
  durationMs: 30_000,
  spawnIntervalMs: 900,
  moleLifetimeMs: 600,
  rareChance: 1 / 30,
  maxConcurrentMoles: 1,
  maxRicePerGame: 30,
  decoyChance: 0.2,
};

export function useTapeRice(options?: UseTapeRiceOptions) {
  const cfg = { ...DEFAULTS, ...(options || {}) };

  const [state, setState] = useState<TapeRiceState>(() => {
    const cells: Cell[] = [];
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        cells.push({ id: `${r}-${c}`, row: r, col: c });
      }
    }
    return {
      cells,
      moles: [],
      timeLeftMs: cfg.durationMs,
      score: 0,
      riceEarned: 0,
      running: false,
      finished: false,
      combo: 0,
      bestCombo: 0,
    };
  });

  const timerRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      moles: [],
      timeLeftMs: cfg.durationMs,
      score: 0,
      riceEarned: 0,
      running: false,
      finished: false,
      combo: 0,
      bestCombo: 0,
    }));
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    if (spawnRef.current) window.clearInterval(spawnRef.current);
    timerRef.current = null;
    spawnRef.current = null;
    lastTickRef.current = null;
  }, [cfg.durationMs]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, running: true, finished: false }));
    // spawn loop
    if (spawnRef.current) window.clearInterval(spawnRef.current);
    spawnRef.current = window.setInterval(() => {
      setState((s) => {
        if (!s.running || s.finished) return s;
        // choose a random free cell
        const now = performance.now();
        // sweep expired moles first
        const existing = s.moles.filter((m) => m.despawnAtMs > now);
        if (existing.length >= cfg.maxConcurrentMoles) {
          return { ...s, moles: existing };
        }
        const occupied = new Set(existing.map((m) => m.cellId));
        const free = s.cells.filter((c) => !occupied.has(c.id));
        if (free.length === 0) return s;
        const cell = free[Math.floor(Math.random() * free.length)];
        const decoy = Math.random() < cfg.decoyChance;
        const rare = !decoy && Math.random() < cfg.rareChance;
        const mole: MoleInstance = {
          id: `${now}-${cell.id}-${Math.random().toString(36).slice(2, 8)}`,
          cellId: cell.id,
          rare,
          decoy,
          appearedAtMs: now,
          despawnAtMs: now + cfg.moleLifetimeMs,
        };
        const moles = [...existing, mole];
        return { ...s, moles };
      });
    }, cfg.spawnIntervalMs);

    // timer loop via rAF
    const tick = (t: number) => {
      if (lastTickRef.current == null) lastTickRef.current = t;
      const dt = t - lastTickRef.current;
      lastTickRef.current = t;
      setState((s) => {
        if (!s.running || s.finished) return s;
        const timeLeftMs = Math.max(0, s.timeLeftMs - dt);
        const justFinished = timeLeftMs <= 0;
        const finished = s.finished || justFinished;
        return { ...s, timeLeftMs, finished, running: !finished };
      });
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
  }, [
    cfg.decoyChance,
    cfg.maxConcurrentMoles,
    cfg.moleLifetimeMs,
    cfg.rareChance,
    cfg.spawnIntervalMs,
  ]);

  const stop = useCallback(() => {
    setState((s) => ({ ...s, running: false }));
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    if (spawnRef.current) window.clearInterval(spawnRef.current);
    timerRef.current = null;
    spawnRef.current = null;
    lastTickRef.current = null;
  }, []);

  // auto-stop when finished
  useEffect(() => {
    if (state.finished) {
      stop();
    }
  }, [state.finished, stop]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      if (spawnRef.current) window.clearInterval(spawnRef.current);
    };
  }, []);

  const handleWhack = useCallback(
    (cellId: string) => {
      setState((s) => {
        if (!s.running || s.finished) return s;
        const now = performance.now();
        const idx = s.moles.findIndex(
          (m) => m.cellId === cellId && m.despawnAtMs > now
        );
        if (idx === -1) {
          // miss: reset combo
          return { ...s, combo: 0 };
        }
        const mole = s.moles[idx];
        const moles = s.moles.filter((m) => m !== mole);
        // decoy: no reward, reset combo
        if (mole.decoy) {
          return { ...s, moles, combo: 0 };
        }
        const rice = mole.rare ? 5 : 1;
        const riceEarnedNext = Math.min(
          s.riceEarned + rice,
          cfg.maxRicePerGame
        );
        const delta = riceEarnedNext - s.riceEarned;
        const score = s.score + delta;
        const riceEarned = riceEarnedNext;
        const combo = s.combo + 1;
        const bestCombo = Math.max(s.bestCombo, combo);
        return { ...s, moles, score, riceEarned, combo, bestCombo };
      });
    },
    [cfg.maxRicePerGame]
  );

  const formattedTime = useMemo(
    () => (state.timeLeftMs / 1000).toFixed(1) + "s",
    [state.timeLeftMs]
  );

  return {
    state,
    start,
    stop,
    reset,
    handleWhack,
    formattedTime,
    cfg,
  };
}
