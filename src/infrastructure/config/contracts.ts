import { Address } from "viem";

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Rise Testnet
  riseTestnet: {
    scoreBoard: "0xaf483B1DcE4FEfcDd929D0dc17bbfe5B34e5Bd0a" as Address,
  },
  // Mainnet (when deployed)
  mainnet: {
    scoreBoard: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update when deployed
  },
  // Local development
  localhost: {
    scoreBoard: "0x0000000000000000000000000000000000000000" as Address, // TODO: Update for local testing
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

// Legacy export for backward compatibility
export const SCOREBOARD_CONTRACT_ADDRESS = getScoreBoardAddress();
