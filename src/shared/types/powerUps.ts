// ================================
// POWER-UP SYSTEM
// ================================

/**
 * Available power-up types in the game
 */
export enum PowerUpType {
  SHIELD = "shield",
  INFINITE_AMMO = "infinite_ammo",
  JUMP_BOOST = "jump_boost",
  SLOW_MOTION = "slow_motion",
  MULTI_SHOT = "multi_shot",
  RICE_ROCKET_AMMO = "rice_rocket_ammo",
}

/**
 * Individual power-up upgrade configuration
 */
export interface PowerUpUpgrade {
  level: number;
  riceCost: number;
  duration?: number;
  ammoCount?: number;
  speedMultiplier?: number;
  jumpMultiplier?: number;
  slowMultiplier?: number;
  projectileCount?: number;
}

/**
 * Current levels for all power-up types
 */
export interface PowerUpLevels {
  [PowerUpType.SHIELD]: number;
  [PowerUpType.INFINITE_AMMO]: number;
  [PowerUpType.JUMP_BOOST]: number;
  [PowerUpType.SLOW_MOTION]: number;
  [PowerUpType.MULTI_SHOT]: number;
  [PowerUpType.RICE_ROCKET_AMMO]: number;
}

/**
 * Complete power-up configuration with upgrades
 */
export interface PowerUpUpgradeData {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  color: string;
  upgrades: PowerUpUpgrade[];
}

/**
 * Power-up effect configuration
 */
export interface PowerUpEffect {
  duration: number;
  ammoCount?: number;
  speedMultiplier?: number;
  jumpMultiplier?: number;
  slowMultiplier?: number;
  projectileCount?: number;
}

/**
 * Power-up upgrade transaction record
 */
export interface UpgradeTransaction {
  powerUpType: PowerUpType;
  currentLevel: number;
  newLevel: number;
  riceCost: number;
  timestamp: number;
}
