// Server-side contract configuration
// ⚠️ This file should ONLY be used server-side (API routes, server actions)

import { Address } from "viem";

export const CONTRACT_ADDRESSES = {
  // Rise Testnet
  riseTestnet: {
    scoreBoard: "0xF2dC776b9b71DEC08df3a40861b7DbFb629C9F5a" as Address,
    riceManager: "0xd74e64EcEFCC745845878C215C5BE9D3d368c8bA" as Address,
    powerUpManager: "0xC12889D661c6BeE9930b00241FdAE913e64a5722" as Address,
  },
} as const;

export type ServerContractAddresses = typeof CONTRACT_ADDRESSES;
