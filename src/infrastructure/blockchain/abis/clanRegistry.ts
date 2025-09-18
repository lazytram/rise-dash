export const CLANREGISTRY_ABI = [
  {
    type: "function",
    name: "currentSeasonId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getSeasonTimes",
    stateMutability: "view",
    inputs: [
      { name: "seasonId", type: "uint256" },
    ],
    outputs: [
      { name: "startTime", type: "uint64" },
      { name: "endTime", type: "uint64" },
      { name: "uri", type: "string" },
    ],
  },
  {
    type: "function",
    name: "getClanStats",
    stateMutability: "view",
    inputs: [{ name: "clanId", type: "bytes32" }],
    outputs: [
      { name: "members", type: "uint256" },
      { name: "totalDistance", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getClanStatsForSeason",
    stateMutability: "view",
    inputs: [
      { name: "clanId", type: "bytes32" },
      { name: "seasonId", type: "uint256" },
    ],
    outputs: [
      { name: "members", type: "uint256" },
      { name: "totalDistance", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getClanIds",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "ids", type: "bytes32[]" }],
  },
  {
    type: "function",
    name: "getPlayerSeasonDistances",
    stateMutability: "view",
    inputs: [
      { name: "player", type: "address" },
      { name: "seasonIds", type: "uint256[]" },
    ],
    outputs: [{ name: "distances", type: "uint256[]" }],
  },
] as const;
