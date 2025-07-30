import { Address } from "viem";

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Rise Testnet
  riseTestnet: {
    scoreBoard: "0xCD6e99ee39882607F40da5d9f04E1b91F4c43df4" as Address,
    riceManager: "0x408Bdc391CFC10F21e69FDF2Ff6340aC0A0E2dA9" as Address,
    powerUpManager: "0x77e5734858b72689eA717bc9b16796da6C6841e0" as Address,
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

// Configuration des contrats modulaires
export const MODULAR_CONTRACTS = {
  ADMIN_CONTROLLER: "0x78ee7dA36f5D32054781dAFCD06476636c093d4d",
  GAME_REGISTRY: "0x7e6426Ce9bcB77a549F41b7965a7312b2e882773",
  RICE_MANAGER: "0x408Bdc391CFC10F21e69FDF2Ff6340aC0A0E2dA9",
  SCORE_BOARD: "0xCD6e99ee39882607F40da5d9f04E1b91F4c43df4",
  POWER_UP_MANAGER: "0x77e5734858b72689eA717bc9b16796da6C6841e0",
};

// ⚠️ ATTENTION: Les clés de sécurité sont PRIVÉES et ne doivent JAMAIS être exposées côté client
// Elles sont utilisées uniquement côté serveur pour signer les transactions
//
// Pour le frontend, on utilise seulement les adresses des contrats
// Les signatures sont générées côté serveur via vos API endpoints

// Configuration pour l'utilisation du registre
export const USE_REGISTRY = true; // Utiliser le GameRegistry comme point d'entrée

// Rôles admin
export const ADMIN_ROLES = {
  NONE: 0,
  OPERATOR: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};
