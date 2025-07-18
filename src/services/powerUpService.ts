import { POWERUP_UPGRADES } from "@/constants/powerUps";
import { PowerUpLevels, PowerUpType } from "@/types/shop";

export interface PowerUpEffect {
  duration: number;
  speedMultiplier?: number;
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
}

export class LocalPowerUpService implements PowerUpService {
  private levels: PowerUpLevels;
  private riceBalance: number;

  constructor() {
    this.levels = {
      shield: 1,
      infiniteAmmo: 1,
      speedBoost: 1,
      multiShot: 1,
      riceRocketAmmo: 1,
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
      return { duration: 3000 }; // Default fallback
    }

    return {
      duration: upgrade.duration || 3000,
      speedMultiplier: upgrade.speedMultiplier,
      projectileCount: upgrade.projectileCount,
      ammoCount: upgrade.ammoCount,
    };
  }

  getMaxAmmo(): number {
    const effect = this.getPowerUpEffect(PowerUpType.RICE_ROCKET_AMMO);
    return effect.ammoCount || 3;
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
      shield: 1,
      infiniteAmmo: 1,
      speedBoost: 1,
      multiShot: 1,
      riceRocketAmmo: 1,
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
