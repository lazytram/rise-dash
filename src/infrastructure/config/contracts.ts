import { Address } from "viem";

// Contract addresses for Rise Testnet
export const RISE_TESTNET_ADDRESSES = {
  SCORE_BOARD: "0xF2dC776b9b71DEC08df3a40861b7DbFb629C9F5a",
  RICE_MANAGER: "0xd74e64EcEFCC745845878C215C5BE9D3d368c8bA",
  POWER_UP_MANAGER: "0xC12889D661c6BeE9930b00241FdAE913e64a5722",
  CLAN_REGISTRY: "0x0000000000000000000000000000000000000000",
} as const;

// Get contract address based on current network
export const getContractAddress = (
  contractName: keyof typeof RISE_TESTNET_ADDRESSES
): Address => {
  // For now, always use riseTestnet since that's what we're using
  // In the future, this could be determined by the connected wallet's network
  const addresses = RISE_TESTNET_ADDRESSES;

  return addresses[contractName];
};

// Single source of truth for all contract addresses
export const CONTRACT_ADDRESSES_CURRENT = {
  SCORE_BOARD: getContractAddress("SCORE_BOARD"),
  RICE_MANAGER: getContractAddress("RICE_MANAGER"),
  POWER_UP_MANAGER: getContractAddress("POWER_UP_MANAGER"),
  CLAN_REGISTRY: getContractAddress("CLAN_REGISTRY"),
} as const;

// Convenience functions for specific contracts (kept for backward compatibility)
export const getScoreBoardAddress = (): Address =>
  CONTRACT_ADDRESSES_CURRENT.SCORE_BOARD;
export const getRICEManagerAddress = (): Address =>
  CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER;
export const getPowerUpManagerAddress = (): Address =>
  CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER;
export const getClanRegistryAddress = (): Address =>
  CONTRACT_ADDRESSES_CURRENT.CLAN_REGISTRY;

// Legacy exports for backward compatibility
export const SCOREBOARD_CONTRACT_ADDRESS =
  CONTRACT_ADDRESSES_CURRENT.SCORE_BOARD;
export const RICEMANAGER_CONTRACT_ADDRESS =
  CONTRACT_ADDRESSES_CURRENT.RICE_MANAGER;
export const POWERUPMANAGER_CONTRACT_ADDRESS =
  CONTRACT_ADDRESSES_CURRENT.POWER_UP_MANAGER;

// Modular contracts configuration (using the single source of truth)
export const MODULAR_CONTRACTS = CONTRACT_ADDRESSES_CURRENT;

// ⚠️ ATTENTION: Security keys are PRIVATE and should NEVER be exposed client-side
// They are used only server-side to sign transactions
//
// For the frontend, we only use contract addresses
// Signatures are generated server-side via your API endpoints

// Configuration for registry usage
export const USE_REGISTRY = true; // Use GameRegistry as entry point

// Admin roles
export const ADMIN_ROLES = {
  NONE: 0,
  OPERATOR: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};
