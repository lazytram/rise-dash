// Power-up upgrade types
export enum PowerUpType {
  SHIELD = "shield",
  INFINITE_AMMO = "infiniteAmmo",
  JUMP_BOOST = "jumpBoost", // Renamed from speedBoost
  SLOW_MOTION = "slowMotion", // New power-up
  MULTI_SHOT = "multiShot",
  RICE_ROCKET_AMMO = "riceRocketAmmo",
}

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

export interface PowerUpLevels {
  shield: number;
  infiniteAmmo: number;
  jumpBoost: number;
  slowMotion: number;
  multiShot: number;
  riceRocketAmmo: number;
}

export interface PowerUpUpgradeData {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  color: string;
  upgrades: PowerUpUpgrade[];
}

// Shop types
export interface ShopState {
  riceBalance: number;
  powerUpLevels: PowerUpLevels;
  isLoading: boolean;
  error: string | null;
}

export interface UpgradeTransaction {
  powerUpType: PowerUpType;
  currentLevel: number;
  newLevel: number;
  riceCost: number;
  timestamp: number;
}

// RICE token types
export interface RICEBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface RICEStats {
  distanceRICE: number;
  achievementRICE: number;
  totalRICE: number;
}
