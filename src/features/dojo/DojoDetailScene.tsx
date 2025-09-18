"use client";

import { memo, useMemo, useState } from "react";
import { Scene } from "@/shared/components/Scene";
import { useDojoStore } from "@/infrastructure/store/dojoStore";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { cn } from "@/shared/utils/cn";
import { useDojoData } from "./useDojoData";
import { Modal } from "@/shared/components/Modal";
import { SeasonCountdown } from "@/shared/components/SeasonCountdown";
import { SeasonsPanel } from "@/shared/components/SeasonsPanel";
import { SeasonsParticipationCard } from "@/shared/components/SeasonsParticipationCard";
import { useSeasons } from "@/features/seasons/useSeasons";

//

export const DojoDetailScene = memo(function DojoDetailScene() {
  const { selectedHouse } = useDojoStore();
  const { t } = useTranslations();
  const [isAllDojoModalOpen, setAllDojoModalOpen] = useState(false);

  const { metas } = useDojoData();
  const { currentSeason, recentSeasons, participation } = useSeasons();
  const metaMap = useMemo(
    () =>
      metas.reduce<Record<string, (typeof metas)[number]>>((acc, m) => {
        acc[m.key] = m;
        return acc;
      }, {}),
    [metas]
  );
  const meta = selectedHouse ? metaMap[selectedHouse] : undefined;

  return (
    <Scene sceneKey="dojoDetail" config={{ maxWidth: "6xl" }}>
      {!selectedHouse || !meta ? (
        <div className="text-center text-muted-foreground">
          {t("dojoDetail.noSelection")}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header card */}
          <Card className="p-6 relative overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-gradient-to-br",
                meta.gradient
              )}
            />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <meta.Icon className="w-16 h-16" />
                <div>
                  <h2 className="text-2xl font-semibold">
                    {t(`dojo.houses.${meta.key}.title`)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t(`dojo.houses.${meta.key}.motto`)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="glass"
                onClick={() => setAllDojoModalOpen(true)}
              >
                {t("dojoDetail.viewAllDojos")}
              </Button>
            </div>
          </Card>

          {/* Stats grid + season */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="text-sm text-muted-foreground">
                {t("dojoDetail.totalDistance")}
              </div>
              <div className="text-2xl font-bold">123,456 m</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm text-muted-foreground">
                {t("dojoDetail.members")}
              </div>
              <div className="text-2xl font-bold">1,234</div>
            </Card>
            {currentSeason ? (
              <SeasonCountdown
                className="h-full"
                endTimeMs={currentSeason.endTimeMs}
                seasonId={currentSeason.id}
              />
            ) : (
              <SeasonCountdown
                className="h-full"
                endTimeMs={Date.now()}
                seasonId={undefined}
              />
            )}
          </div>

          {/* Charts placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="text-sm font-medium mb-2">
                {t("dojoDetail.progressOverTime")}
              </div>
              <div className="h-40 rounded bg-gradient-to-r from-primary/10 to-transparent" />
            </Card>
            <SeasonsPanel
              className="p-4"
              currentSeason={
                currentSeason
                  ? {
                      id: currentSeason.id,
                      startTimeMs: currentSeason.startTimeMs,
                      endTimeMs: currentSeason.endTimeMs,
                    }
                  : null
              }
              recentSeasons={recentSeasons.map((s) => ({
                id: s.id,
                startTimeMs: s.startTimeMs,
                endTimeMs: s.endTimeMs,
              }))}
            />
            <SeasonsParticipationCard className="p-4" seasons={participation} />
            <Card className="p-5">
              <div className="text-sm font-medium mb-2">
                {t("dojoDetail.topContributors")}
              </div>
              <ol className="space-y-2 text-sm">
                {[
                  { addr: "0xAbc…123", dist: "12,345 m" },
                  { addr: "0xDef…456", dist: "10,210 m" },
                  { addr: "0x987…654", dist: "9,850 m" },
                  { addr: "0x555…aaa", dist: "9,020 m" },
                  { addr: "0x777…333", dist: "8,770 m" },
                ].map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-muted-foreground">#{idx + 1}</span>
                    <span>{it.addr}</span>
                    <span className="font-medium">{it.dist}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <Modal
            isOpen={isAllDojoModalOpen}
            onClose={() => setAllDojoModalOpen(false)}
            title={t("dojoDetail.compareDojosTitle")}
            size="full"
          >
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <ul className="divide-y divide-border">
                {metas
                  .slice()
                  .map((m) => ({
                    ...m,
                    total: "—",
                  }))
                  .slice()
                  .sort((a, b) => a.key.localeCompare(b.key))
                  .map((h) => (
                    <li
                      key={h.key}
                      className={cn(
                        "relative p-4 sm:p-5 flex items-center gap-4 transition-colors hover:bg-white/5",
                        selectedHouse === h.key && "bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 -z-10 bg-gradient-to-br opacity-40",
                          h.gradient
                        )}
                      />
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full ring-2 flex items-center justify-center",
                          h.iconBg
                        )}
                      >
                        <h.Icon className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-lg sm:text-xl font-semibold flex items-center gap-2 flex-wrap">
                          <span className="truncate">{t(h.titleI18nKey)}</span>
                          {selectedHouse === h.key && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary ring-1 ring-primary/30 whitespace-nowrap">
                              {t("dojoDetail.yourDojo")}
                            </span>
                          )}
                        </div>
                        <div className="text-sm sm:text-base text-foreground/80 line-clamp-2">
                          {t(h.mottoI18nKey)}
                        </div>
                      </div>
                      <div className="text-right min-w-[8.5rem] sm:min-w-[9rem]">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {t("dojoDetail.totalDistance")}
                        </div>
                        <div className="text-3xl font-extrabold leading-none tabular-nums">
                          {h.total.replace(" m", "")}
                          <span className="ml-1 text-sm font-semibold align-[0.1em] text-foreground/70">
                            m
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Modal>
        </div>
      )}
    </Scene>
  );
});
