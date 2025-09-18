import { DojoAggregate } from "./types";
import { DojoHouse } from "@/infrastructure/store/dojoStore";

// TODO: replace with real API call (REST/GraphQL)
export async function fetchDojoAggregates(): Promise<DojoAggregate[]> {
  // Simulated network delay
  await new Promise((r) => setTimeout(r, 200));
  const mock: Array<{ dojo: DojoHouse; totalDistance: number; members: number; rank: number }> = [
    { dojo: "akaTora", totalDistance: 234567, members: 1234, rank: 1 },
    { dojo: "aoiTsuru", totalDistance: 198765, members: 1120, rank: 3 },
    { dojo: "midoriRyuu", totalDistance: 210450, members: 980, rank: 2 },
    { dojo: "koganeKitsune", totalDistance: 205320, members: 1050, rank: 4 },
  ];
  return mock.sort((a, b) => b.totalDistance - a.totalDistance);
}


