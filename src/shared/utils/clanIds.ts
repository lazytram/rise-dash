import type { DojoHouse } from "@/infrastructure/store/dojoStore";
import { keccak256, toBytes } from "viem";

// Ordered list of dojo houses used across the UI
export const CLAN_HOUSES: DojoHouse[] = [
  "akaTora",
  "aoiTsuru",
  "midoriRyuu",
  "koganeKitsune",
];

// Deterministic bytes32 IDs derived from house keys
export const CLAN_ID_BY_KEY: Record<DojoHouse, `0x${string}`> = {
  akaTora: keccak256(toBytes("akaTora")),
  aoiTsuru: keccak256(toBytes("aoiTsuru")),
  midoriRyuu: keccak256(toBytes("midoriRyuu")),
  koganeKitsune: keccak256(toBytes("koganeKitsune")),
};
