import { useEffect, useMemo, useRef, useState } from "react";

export interface MemoryCardState {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const RICE_EMOJIS = [
  "🍙",
  "🍚",
  "🍘",
  "🍥",
  "🍱",
  "🥢",
  "🍵",
  "🥟",
  "🍛",
  "🍣",
];

export function useMemoryFlip(initialCols = 4, initialRows = 3) {
  const [seed, setSeed] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<[number, number]>([
    initialCols,
    initialRows,
  ]);
  const [deck, setDeck] = useState<MemoryCardState[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPairs = useMemo(() => (gridSize[0] * gridSize[1]) / 2, [gridSize]);

  // Seed from server
  useEffect(() => {
    const fetchSeed = async () => {
      try {
        const res = await fetch("/api/memory-flip/seed", { method: "POST" });
        const json = await res.json();
        setSeed(json.seed ?? Math.floor(Math.random() * 1e9));
      } catch {
        setSeed(Math.floor(Math.random() * 1e9));
      }
    };
    fetchSeed();
  }, []);

  // Build deck
  useEffect(() => {
    if (seed == null) return;
    const [cols, rows] = gridSize;
    const neededPairs = (cols * rows) / 2;
    const base = RICE_EMOJIS.slice(0, neededPairs);
    const pairs = seededShuffle([...base, ...base], seed);
    setDeck(
      pairs.map((emoji, idx) => ({
        id: idx,
        emoji,
        flipped: false,
        matched: false,
      }))
    );
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setElapsedMs(0);
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [seed, gridSize]);

  // Timer controlled by running flag
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => setElapsedMs((v) => v + 100), 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const handleFlip = (index: number) => {
    if (deck[index].flipped || deck[index].matched) return;
    if (first !== null && second !== null) return;
    const next = deck.slice();
    next[index] = { ...next[index], flipped: true };
    setDeck(next);
    if (!running) setRunning(true);
    if (first === null) {
      setFirst(index);
      return;
    }
    if (second === null) {
      setSecond(index);
      setMoves((m) => m + 1);
      const a = next[first];
      const b = next[index];
      const isMatch = a.emoji === b.emoji;
      setTimeout(
        () => {
          setDeck((curr) => {
            const copy = curr.slice();
            if (isMatch) {
              copy[first] = { ...copy[first], matched: true };
              copy[index] = { ...copy[index], matched: true };
            } else {
              copy[first] = { ...copy[first], flipped: false };
              copy[index] = { ...copy[index], flipped: false };
            }
            return copy;
          });
          setFirst(null);
          setSecond(null);
        },
        isMatch ? 300 : 700
      );
    }
  };

  const matchedPairs = useMemo(() => {
    const matchedCount = deck.reduce((acc, c) => acc + (c.matched ? 1 : 0), 0);
    return Math.floor(matchedCount / 2);
  }, [deck]);

  const finished = matchedPairs === totalPairs && totalPairs > 0;

  // Stop timer when finished
  useEffect(() => {
    if (!finished) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRunning(false);
  }, [finished]);

  const score = useMemo(() => {
    const penalty = Math.floor(elapsedMs / 1000) * 0.1;
    return Math.max(0, matchedPairs - penalty);
  }, [matchedPairs, elapsedMs]);

  // Reward formula (RICE): depends on grid, time and moves
  // Base scales with number of pairs; penalties for time and extra moves
  const riceReward = useMemo(() => {
    if (!finished) return 0;
    const pairs = totalPairs; // (cols*rows)/2
    const base = Math.max(2, pairs * 2); // e.g. 4x3 -> 12

    const elapsedSec = Math.floor(elapsedMs / 1000);
    const targetTime = 8 + pairs * 3; // generous target in seconds
    const timeOver = Math.max(0, elapsedSec - targetTime);
    const timePenalty = timeOver * 0.25; // 0.25 RICE per extra second

    const optimalMoves = pairs; // perfect play: one move per pair
    const extraMoves = Math.max(0, moves - optimalMoves);
    const movePenalty = extraMoves * 0.5; // 0.5 RICE per extra move

    const raw = base - timePenalty - movePenalty;
    const clamped = Math.max(1, Math.floor(raw));
    const maxCap = pairs * 4; // soft cap by difficulty
    return Math.min(clamped, maxCap);
  }, [finished, totalPairs, elapsedMs, moves]);

  const reset = () => setSeed(Math.floor(Math.random() * 1e9));

  return {
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
  } as const;
}
