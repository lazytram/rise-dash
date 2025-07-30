import { SERVER_CONTRACT_ADDRESSES } from "./contracts";
import { MODULAR_CONTRACTS } from "@/infrastructure/config/contracts";

// Validation to ensure contract addresses are synchronized
export const validateContractAddresses = (): boolean => {
  const serverAddresses = SERVER_CONTRACT_ADDRESSES;
  const clientAddresses = MODULAR_CONTRACTS;

  const mismatches: string[] = [];

  // Check each address
  if (serverAddresses.ADMIN_CONTROLLER !== clientAddresses.ADMIN_CONTROLLER) {
    mismatches.push("ADMIN_CONTROLLER");
  }
  if (serverAddresses.GAME_REGISTRY !== clientAddresses.GAME_REGISTRY) {
    mismatches.push("GAME_REGISTRY");
  }
  if (serverAddresses.RICE_MANAGER !== clientAddresses.RICE_MANAGER) {
    mismatches.push("RICE_MANAGER");
  }
  if (serverAddresses.SCORE_BOARD !== clientAddresses.SCORE_BOARD) {
    mismatches.push("SCORE_BOARD");
  }
  if (serverAddresses.POWER_UP_MANAGER !== clientAddresses.POWER_UP_MANAGER) {
    mismatches.push("POWER_UP_MANAGER");
  }

  if (mismatches.length > 0) {
    console.error("❌ Contract address mismatches detected:", mismatches);
    console.error("Please update the addresses to be synchronized between:");
    console.error("- src/server/config/contracts.ts");
    console.error("- src/infrastructure/config/contracts.ts");
    return false;
  }

  return true;
};
