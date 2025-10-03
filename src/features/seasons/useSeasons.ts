"use client";

import { useEffect, useMemo, useState } from "react";
import type { SeasonMeta, SeasonParticipation } from "./types";
import { seasonsService } from "./seasonsService";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { useAccount } from "wagmi";

export type UseSeasonsResult = {
  loading: boolean;
  error?: string;
  currentSeason?: SeasonMeta | null;
  recentSeasons: SeasonMeta[];
  participation: SeasonParticipation[];
};

export function useSeasons(): UseSeasonsResult {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [seasons, setSeasons] = useState<SeasonMeta[]>([]);
  const [currentId, setCurrentId] = useState<number | undefined>();
  const [participation, setParticipation] = useState<SeasonParticipation[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(undefined);
    (async () => {
      try {
        const [metaList, cid] = await Promise.all([
          seasonsService.fetchAllMeta(),
          blockchainService.getCurrentSeasonId(),
        ]);
        if (!mounted) return;
        setSeasons(metaList);
        setCurrentId(cid || undefined);
        // Load player participation if address present
        if (address && metaList.length > 0) {
          const ids = metaList.map((m) => m.id);
          const distances = await blockchainService.getPlayerSeasonDistances(
            address,
            ids
          );
          if (!mounted) return;
          setParticipation(
            ids.map((id, idx) => ({ id, distance: distances[idx] || 0 }))
          );
        } else {
          setParticipation([]);
        }
      } catch (e) {
        if (!mounted) return;
        setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [address]);

  const currentSeason = useMemo(() => {
    if (!currentId || seasons.length === 0) return undefined;
    return seasons.find((s) => s.id === currentId) || null;
  }, [currentId, seasons]);

  const recentSeasons = useMemo(() => {
    if (!currentId) return seasons.slice().sort((a, b) => b.id - a.id);
    return seasons
      .filter((s) => s.id !== currentId)
      .slice()
      .sort((a, b) => b.id - a.id);
  }, [seasons, currentId]);

  return { loading, error, currentSeason, recentSeasons, participation };
}
