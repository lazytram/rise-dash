import { Address } from "viem";

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Rise Testnet
  riseTestnet: {
    scoreBoard: "0x86812187fac067E9DA844977161EcF9Df3225Ac0" as Address,
    riceManager: "0x69FAcF1454e0F8a43561697767d956B8E5AA6F50" as Address,
    powerUpManager: "0x77b6097670C4116136cE3270D691427D7b4eA9e7" as Address,
  },
  // Mainnet (when deployed)
  mainnet: {
    scoreBoard: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update when deployed
    riceManager: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update when deployed
    powerUpManager: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update when deployed
  },
  // Local development
  localhost: {
    scoreBoard: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update for local testing
    riceManager: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update for local testing
    powerUpManager: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update for local testing
  },
} as const;

// Get contract address based on current network
export const getContractAddress = (
  contractName: keyof typeof CONTRACT_ADDRESSES.riseTestnet
): Address => {
  // For now, always use riseTestnet since that's what we're using
  // In the future, this could be determined by the connected wallet's network
  const addresses = CONTRACT_ADDRESSES.riseTestnet;

  return addresses[contractName];
};

// Convenience functions for specific contracts
export const getScoreBoardAddress = (): Address =>
  getContractAddress("scoreBoard");

export const getRICEManagerAddress = (): Address =>
  getContractAddress("riceManager");

export const getPowerUpManagerAddress = (): Address =>
  getContractAddress("powerUpManager");

// Legacy export for backward compatibility
export const SCOREBOARD_CONTRACT_ADDRESS = getScoreBoardAddress();

// Modular contracts configuration
export const MODULAR_CONTRACTS = {
  ADMIN_CONTROLLER: "0x78ee7dA36f5D32054781dAFCD06476636c093d4d",
  GAME_REGISTRY: "0x7e6426Ce9bcB77a549F41b7965a7312b2e882773",
  RICE_MANAGER: getRICEManagerAddress(),
  SCORE_BOARD: getScoreBoardAddress(),
  POWER_UP_MANAGER: getPowerUpManagerAddress(),
};

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
