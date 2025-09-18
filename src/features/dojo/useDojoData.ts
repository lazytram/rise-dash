import { useEffect, useMemo, useState } from "react";
import { useDojoStore, DojoHouse } from "@/infrastructure/store/dojoStore";
import { DojoAggregate, DojoMeta, UseDojoDataResult } from "./types";
import { AkaToraIcon } from "@/shared/components/dojo-icons/AkaToraIcon";
import { AoiTsuruIcon } from "@/shared/components/dojo-icons/AoiTsuruIcon";
import { MidoriRyuuIcon } from "@/shared/components/dojo-icons/MidoriRyuuIcon";
import { KoganeKitsuneIcon } from "@/shared/components/dojo-icons/KoganeKitsuneIcon";
import { fetchDojoAggregates } from "./dojoService";

const META_BY_HOUSE: Record<DojoHouse, DojoMeta> = {
  akaTora: {
    key: "akaTora",
    titleI18nKey: "dojo.houses.akaTora.title",
    mottoI18nKey: "dojo.houses.akaTora.motto",
    gradient: "from-red-500/10 to-red-700/10",
    iconBg: "bg-red-100 ring-red-200 text-red-600",
    Icon: AkaToraIcon,
  },
  aoiTsuru: {
    key: "aoiTsuru",
    titleI18nKey: "dojo.houses.aoiTsuru.title",
    mottoI18nKey: "dojo.houses.aoiTsuru.motto",
    gradient: "from-sky-500/10 to-blue-700/10",
    iconBg: "bg-sky-100 ring-sky-200 text-sky-600",
    Icon: AoiTsuruIcon,
  },
  midoriRyuu: {
    key: "midoriRyuu",
    titleI18nKey: "dojo.houses.midoriRyuu.title",
    mottoI18nKey: "dojo.houses.midoriRyuu.motto",
    gradient: "from-emerald-500/10 to-emerald-700/10",
    iconBg: "bg-emerald-100 ring-emerald-200 text-emerald-600",
    Icon: MidoriRyuuIcon,
  },
  koganeKitsune: {
    key: "koganeKitsune",
    titleI18nKey: "dojo.houses.koganeKitsune.title",
    mottoI18nKey: "dojo.houses.koganeKitsune.motto",
    gradient: "from-amber-400/10 to-yellow-600/10",
    iconBg: "bg-amber-100 ring-amber-200 text-amber-600",
    Icon: KoganeKitsuneIcon,
  },
};

export function useDojoData(): UseDojoDataResult {
  const { selectedHouse } = useDojoStore();
  const [aggregates, setAggregates] = useState<DojoAggregate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchDojoAggregates()
      .then((data) => {
        if (!mounted) return;
        const sorted = [...data].sort(
          (a, b) => b.totalDistance - a.totalDistance
        );
        setAggregates(sorted);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(String(e));
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const metas = useMemo(() => Object.values(META_BY_HOUSE), []);

  return {
    selectedHouse,
    metas,
    aggregates,
    isLoading,
    error,
  };
}
