// ScoreBoard contract ABI
export const SCOREBOARD_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_score", type: "uint256" },
      { internalType: "string", name: "_playerName", type: "string" },
      { internalType: "bytes32", name: "_gameHash", type: "bytes32" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "recordScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_score", type: "uint256" },
      { internalType: "string", name: "_playerName", type: "string" },
      { internalType: "uint256", name: "_riceReward", type: "uint256" },
      { internalType: "bytes32", name: "_gameHash", type: "bytes32" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "recordScoreWithRICE",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_score", type: "uint256" },
      { internalType: "string", name: "_playerName", type: "string" },
      { internalType: "address", name: "_playerAddress", type: "address" },
      { internalType: "bytes32", name: "_gameHash", type: "bytes32" },
    ],
    name: "recordScoreEmergency",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "getPlayerBestScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "getPlayerScores",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "playerName", type: "string" },
          { internalType: "bytes32", name: "gameHash", type: "bytes32" },
        ],
        internalType: "struct ScoreBoard.Score[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_offset", type: "uint256" },
      { internalType: "uint256", name: "_limit", type: "uint256" },
    ],
    name: "getLeaderboard",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "string", name: "playerName", type: "string" },
          { internalType: "address", name: "playerAddress", type: "address" },
        ],
        internalType: "struct ScoreBoard.LeaderboardEntry[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractInfo",
    outputs: [
      { internalType: "address", name: "_gameOwner", type: "address" },
      { internalType: "bool", name: "_paused", type: "bool" },
      {
        internalType: "uint256",
        name: "_minTimeBetweenScores",
        type: "uint256",
      },
      { internalType: "bool", name: "_securityKeySet", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "securityKey", type: "bytes32" }],
    name: "setSecurityKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalScores",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
