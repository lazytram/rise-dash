import { Address } from "viem";

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Rise Testnet
  riseTestnet: {
    scoreBoard: "0x16360957eF50d2a754c76a16B833d5A1D2c437Cb" as Address,
    riceManager: "0xA19E2a7730bADf428601042b707E4727B26Cc726" as Address,
    powerUpManager: "0xBc4E9C9549864b787dE83af33f86cDFff37C7Ff4" as Address,
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
