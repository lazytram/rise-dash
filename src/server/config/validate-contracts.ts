import { CONTRACT_ADDRESSES } from "./contracts";
import { RISE_TESTNET_ADDRESSES as CLIENT_CONTRACT_ADDRESSES } from "@/infrastructure/config/contracts";

// Validation to ensure contract addresses are synchronized
export const validateContractAddresses = (): boolean => {
  const serverAddresses = CONTRACT_ADDRESSES.riseTestnet;
  const clientAddresses = CLIENT_CONTRACT_ADDRESSES;

  const mismatches: string[] = [];

  // Check each address
  if (serverAddresses.scoreBoard !== clientAddresses.SCORE_BOARD) {
    mismatches.push("scoreBoard/SCORE_BOARD");
  }
  if (serverAddresses.riceManager !== clientAddresses.RICE_MANAGER) {
    mismatches.push("riceManager/RICE_MANAGER");
  }
  if (serverAddresses.powerUpManager !== clientAddresses.POWER_UP_MANAGER) {
    mismatches.push("powerUpManager/POWER_UP_MANAGER");
  }

  if (mismatches.length > 0) {
    console.error("❌ Contract address mismatches detected:", mismatches);
    console.error("Please update the addresses to be synchronized between:");
    console.error("- src/server/config/contracts.ts");
    console.error("- src/infrastructure/config/contracts.ts");
    return false;
  }

  console.log("✅ Contract addresses are synchronized");
  return true;
};
