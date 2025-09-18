import { DojoHouse } from "@/infrastructure/store/dojoStore";

export interface DojoMeta {
  key: DojoHouse;
  titleI18nKey: string; // e.g., dojo.houses.akaTora.title
  mottoI18nKey: string; // e.g., dojo.houses.akaTora.motto
  gradient: string; // tailwind gradient classes
  iconBg: string; // tailwind bg/ring for icon circle
  Icon: React.ComponentType<{ className?: string }>;
}

export interface DojoAggregate {
  dojo: DojoHouse;
  totalDistance: number; // meters
  members?: number;
  rank?: number;
}

export interface UseDojoDataResult {
  selectedHouse?: DojoHouse;
  metas: DojoMeta[];
  aggregates: DojoAggregate[]; // sorted desc by totalDistance
  isLoading: boolean;
  error?: string;
}


