import { PowerUpLevels } from "./powerUps";

// ================================
// SHOP SYSTEM
// ================================

/**
 * Shop state management
 */
export interface ShopState {
  riceBalance: number;
  powerUpLevels: PowerUpLevels;
  isLoading: boolean;
  error: string | null;
}
