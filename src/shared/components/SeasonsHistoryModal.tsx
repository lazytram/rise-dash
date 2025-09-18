"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { DojoHouse } from "@/infrastructure/store/dojoStore";
import { CLAN_HOUSES, CLAN_ID_BY_KEY } from "@/shared/utils/clanIds";
import { useTranslations } from "@/shared/hooks/useTranslations";

type SeasonMeta = {
  id: number;
  startTimeMs: number;
  endTimeMs: number;
  uri: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SeasonsHistoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  const [seasons, setSeasons] = useState<SeasonMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [totalsBySeason, setTotalsBySeason] = useState<
    Record<number, Record<DojoHouse, number>>
  >({});

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoading(true);
    setError(undefined);
    blockchainService
      .getAllSeasonsMeta()
      .then(async (meta) => {
        if (!mounted) return;
        setSeasons(meta);
        // Load totals for each season for the 4 clans
        const next: Record<number, Record<DojoHouse, number>> = {};
        for (const s of meta) {
          next[s.id] = {
            akaTora: 0,
            aoiTsuru: 0,
            midoriRyuu: 0,
            koganeKitsune: 0,
          };
          await Promise.all(
            CLAN_HOUSES.map(async (h) => {
              const res = await blockchainService.getClanStatsForSeason(
                CLAN_ID_BY_KEY[h],
                s.id
              );
              next[s.id][h] = res.totalDistance;
            })
          );
        }
        if (mounted) setTotalsBySeason(next);
      })
      .catch((e) => mounted && setError(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const houseOrder = useMemo(() => CLAN_HOUSES, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("features.seasons.panel.historyTitle")}
      size="xl"
    >
      {loading && (
        <div className="text-sm text-muted-foreground">
          {t("common.loading") ?? "Loading..."}
        </div>
      )}
      {error && <div className="text-sm text-red-600">{String(error)}</div>}
      {!loading && !error && (
        <div className="space-y-4">
          {seasons.map((s) => {
            const totals = totalsBySeason[s.id] || {};
            return (
              <div key={s.id} className="rounded-xl border bg-white/60">
                <div className="flex items-center justify-between px-4 py-2.5 border-b">
                  <div className="font-semibold">
                    {t("features.seasons.panel.title")} {s.id}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {fmt(s.startTimeMs)} <span className="mx-1">→</span>{" "}
                    {fmt(s.endTimeMs)}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 text-sm">
                  {houseOrder.map((h) => (
                    <div
                      key={h}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 bg-white/70"
                    >
                      <div className="font-medium capitalize">{h}</div>
                      <div className="font-semibold">
                        {(totals[h] ?? 0).toLocaleString()} m
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {seasons.length === 0 && (
            <div className="text-sm text-muted-foreground">
              {t("features.seasons.panel.noHistory")}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
