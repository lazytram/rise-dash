import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { PowerUpLevels, PowerUpType } from "@/shared/types/powerUps";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import { Address } from "viem";

export interface PowerUpEffect {
  duration: number;
  speedMultiplier?: number;
  jumpMultiplier?: number;
  slowMultiplier?: number;
  projectileCount?: number;
  ammoCount?: number;
}

export interface PowerUpService {
  getPowerUpLevel(type: PowerUpType): number;
  getPowerUpEffect(type: PowerUpType): PowerUpEffect;
  getMaxAmmo(): number;
  canUpgrade(type: PowerUpType, riceBalance: number): boolean;
  getUpgradeCost(type: PowerUpType): number;
  upgrade(type: PowerUpType): boolean;
  resetLevels(): void;
  // New blockchain methods
  loadLevelsFromBlockchain(playerAddress: Address): Promise<void>;
  upgradePowerUpOnBlockchain(
    playerAddress: Address,
    powerUpId: number
  ): Promise<boolean>;
  getPowerUpLevelsFromBlockchain(playerAddress: Address): Promise<number[]>;
  getPowerUpConfigFromBlockchain(
    powerUpType: PowerUpType
  ): Promise<{ cost: number; maxLevel: number }>;
}

export class LocalPowerUpService implements PowerUpService {
  private levels: PowerUpLevels;
  private riceBalance: number;

  constructor() {
    this.levels = {
      [PowerUpType.SHIELD]: 1,
      [PowerUpType.INFINITE_AMMO]: 1,
      [PowerUpType.JUMP_BOOST]: 1,
      [PowerUpType.SLOW_MOTION]: 1,
      [PowerUpType.MULTI_SHOT]: 1,
      [PowerUpType.RICE_ROCKET_AMMO]: 1,
    };
    this.riceBalance = 200;
  }

  getPowerUpLevel(type: PowerUpType): number {
    return this.levels[type] || 1;
  }

  getPowerUpEffect(type: PowerUpType): PowerUpEffect {
    const level = this.getPowerUpLevel(type);
    const upgrade = POWERUP_UPGRADES[type]?.upgrades.find(
      (u) => u.level === level
    );

    if (!upgrade) {
      console.warn(
        `⚠️ No upgrade found for ${type} level ${level}, using default`
      );
      return { duration: 3000 }; // Default fallback
    }

    const effect = {
      duration: upgrade.duration || 3000,
      speedMultiplier: upgrade.speedMultiplier,
      jumpMultiplier: upgrade.jumpMultiplier,
      slowMultiplier: upgrade.slowMultiplier,
      projectileCount: upgrade.projectileCount,
      ammoCount: upgrade.ammoCount,
    };

    return effect;
  }

  getMaxAmmo(): number {
    const effect = this.getPowerUpEffect(PowerUpType.RICE_ROCKET_AMMO);
    const maxAmmo = effect.ammoCount || 3;

    return maxAmmo;
  }

  canUpgrade(type: PowerUpType, riceBalance: number): boolean {
    const currentLevel = this.getPowerUpLevel(type);
    const nextLevel = currentLevel + 1;
    const upgrade = POWERUP_UPGRADES[type]?.upgrades.find(
      (u) => u.level === nextLevel
    );

    return upgrade !== undefined && riceBalance >= upgrade.riceCost;
  }

  getUpgradeCost(type: PowerUpType): number {
    const currentLevel = this.getPowerUpLevel(type);
    const nextLevel = currentLevel + 1;
    const upgrade = POWERUP_UPGRADES[type]?.upgrades.find(
      (u) => u.level === nextLevel
    );

    return upgrade?.riceCost || 0;
  }

  upgrade(type: PowerUpType): boolean {
    if (!this.canUpgrade(type, this.riceBalance)) {
      return false;
    }

    const cost = this.getUpgradeCost(type);
    this.riceBalance -= cost;
    this.levels[type] = this.getPowerUpLevel(type) + 1;

    return true;
  }

  resetLevels(): void {
    this.levels = {
      [PowerUpType.SHIELD]: 1,
      [PowerUpType.INFINITE_AMMO]: 1,
      [PowerUpType.JUMP_BOOST]: 1,
      [PowerUpType.SLOW_MOTION]: 1,
      [PowerUpType.MULTI_SHOT]: 1,
      [PowerUpType.RICE_ROCKET_AMMO]: 1,
    };
  }

  // Getters for external access
  getLevels(): PowerUpLevels {
    return { ...this.levels };
  }

  getRiceBalance(): number {
    return this.riceBalance;
  }

  setRiceBalance(balance: number): void {
    this.riceBalance = balance;
  }

  setLevels(levels: PowerUpLevels): void {
    this.levels = { ...levels };
  }

  // New blockchain methods
  async loadLevelsFromBlockchain(playerAddress: Address): Promise<void> {
    try {
      const blockchainLevels = await this.getPowerUpLevelsFromBlockchain(
        playerAddress
      );

      // Map blockchain levels to local levels
      this.levels = {
        [PowerUpType.SHIELD]: blockchainLevels[0] || 1,
        [PowerUpType.INFINITE_AMMO]: blockchainLevels[1] || 1,
        [PowerUpType.JUMP_BOOST]: blockchainLevels[2] || 1,
        [PowerUpType.SLOW_MOTION]: blockchainLevels[3] || 1,
        [PowerUpType.MULTI_SHOT]: blockchainLevels[4] || 1,
        [PowerUpType.RICE_ROCKET_AMMO]: blockchainLevels[5] || 1,
      };
    } catch (error) {
      console.error("❌ Failed to load levels from blockchain:", error);
      // Keep current levels if blockchain call fails
    }
  }

  async upgradePowerUpOnBlockchain(
    playerAddress: Address,
    powerUpId: number
  ): Promise<boolean> {
    try {
      // Generate upgrade hash
      const upgradeHash = this.generateUpgradeHash(playerAddress, powerUpId);

      // Call API to get signature
      const response = await fetch("/api/sign-powerup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerAddress,
          powerUpId,
          upgradeHash,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get signature from API");
      }

      const data = await response.json();
      const signature = data.signature;

      if (!signature) {
        throw new Error("No signature returned from API");
      }

      // Execute the transaction via blockchain service
      // Note: This would typically be done through a wallet connection
      // For now, we'll return true to indicate the signature was generated successfully
      // The actual transaction execution should be handled by the frontend
      return true;
    } catch {
      return false;
    }
  }

  async getPowerUpLevelsFromBlockchain(
    playerAddress: Address
  ): Promise<number[]> {
    try {
      return await blockchainService.getPowerUpLevels(playerAddress);
    } catch {
      return Array(10).fill(1); // Default levels
    }
  }

  async getPowerUpConfigFromBlockchain(
    powerUpType: PowerUpType
  ): Promise<{ cost: number; maxLevel: number }> {
    try {
      // Convert PowerUpType to powerUpId for blockchain calls
      const powerUpIdMap: Record<PowerUpType, number> = {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.INFINITE_AMMO]: 1,
        [PowerUpType.JUMP_BOOST]: 2,
        [PowerUpType.SLOW_MOTION]: 3,
        [PowerUpType.MULTI_SHOT]: 4,
        [PowerUpType.RICE_ROCKET_AMMO]: 5,
      };
      const powerUpId = powerUpIdMap[powerUpType];

      return await blockchainService.getPowerUpConfig(powerUpId);
    } catch {
      // Use costs from POWERUP_UPGRADES for level 2
      const powerUpConfig = POWERUP_UPGRADES[powerUpType];
      const level2Upgrade = powerUpConfig?.upgrades.find((u) => u.level === 2);
      const level2Cost = level2Upgrade?.riceCost || 100;

      return {
        cost: level2Cost,
        maxLevel: 10,
      };
    }
  }

  private generateUpgradeHash(
    playerAddress: Address,
    powerUpId: number
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `UPGRADE_POWERUP-${playerAddress}-${powerUpId}-${timestamp}`;
    return message; // This should be properly hashed in a real implementation
  }
}

// Singleton instance
let powerUpService: PowerUpService = new LocalPowerUpService();

export const getPowerUpService = (): PowerUpService => {
  return powerUpService;
};

export const setPowerUpService = (service: PowerUpService): void => {
  powerUpService = service;
};

// Convenience functions for easy access
export const getPowerUpLevel = (type: PowerUpType): number => {
  return powerUpService.getPowerUpLevel(type);
};

export const getPowerUpEffect = (type: PowerUpType): PowerUpEffect => {
  return powerUpService.getPowerUpEffect(type);
};

export const getMaxAmmo = (): number => {
  return powerUpService.getMaxAmmo();
};

export const canUpgrade = (type: PowerUpType, riceBalance: number): boolean => {
  return powerUpService.canUpgrade(type, riceBalance);
};

export const getUpgradeCost = (type: PowerUpType): number => {
  return powerUpService.getUpgradeCost(type);
};

export const upgrade = (type: PowerUpType): boolean => {
  return powerUpService.upgrade(type);
};

// New blockchain convenience functions
export const loadLevelsFromBlockchain = async (
  playerAddress: Address
): Promise<void> => {
  return powerUpService.loadLevelsFromBlockchain(playerAddress);
};

export const upgradePowerUpOnBlockchain = async (
  playerAddress: Address,
  powerUpId: number
): Promise<boolean> => {
  return powerUpService.upgradePowerUpOnBlockchain(playerAddress, powerUpId);
};

export const getPowerUpLevelsFromBlockchain = async (
  playerAddress: Address
): Promise<number[]> => {
  return powerUpService.getPowerUpLevelsFromBlockchain(playerAddress);
};

export const getPowerUpConfigFromBlockchain = async (
  powerUpType: PowerUpType
): Promise<{ cost: number; maxLevel: number }> => {
  return powerUpService.getPowerUpConfigFromBlockchain(powerUpType);
};
