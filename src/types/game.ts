export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  color: string;
  riceRocketAmmo: number;
  maxRiceRocketAmmo: number;
  lastAmmoRechargeTime: number;
  // Power-up states
  hasShield: boolean;
  hasInfiniteAmmo: boolean;
  hasSpeedBoost: boolean;
  hasMultiShot: boolean;
  powerUpEndTimes: {
    shield: number;
    infiniteAmmo: number;
    speedBoost: number;
    multiShot: number;
  };
  // Power-up levels
  powerUpLevels: {
    shield: number;
    infiniteAmmo: number;
    speedBoost: number;
    multiShot: number;
    riceRocketAmmo: number;
  };
}

export interface MovableEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

export interface Samurai extends MovableEntity {
  lives: number;
  maxLives: number;
  lastShotTime: number;
  shotCooldown: number;
}

export interface Ninja extends MovableEntity {
  lives: number;
  maxLives: number;
  lastShotTime: number;
  shotCooldown: number;
  velocityY: number;
  isJumping: boolean;
  jumpCooldown: number;
  lastJumpTime: number;
}

export interface Boss extends MovableEntity {
  lives: number;
  maxLives: number;
  lastShotTime: number;
  shotCooldown: number;
  phase: number; // Boss phases for different attack patterns
  lastPhaseChange: number;
}

export interface SamuraiBullet extends MovableEntity {
  velocityY: number;
}

export interface PowerUp extends MovableEntity {
  type: "shield" | "infinite_ammo" | "speed_boost" | "multi_shot";
  duration: number;
}

export type RiceRocket = MovableEntity;
export type Sushi = MovableEntity;
export type Torii = MovableEntity;

export interface DifficultyLevel {
  level: number;
  speedMultiplier: number;
  samuraiSpawnDistance: number;
  sushiSpawnProbability: number;
  samuraiShotCooldown: number;
  samuraiLives: number;
  samuraiBulletSpeed: number;
  // New enemy parameters
  ninjaSpawnDistance: number;
  ninjaShotCooldown: number;
  ninjaLives: number;
  bossSpawnDistance: number;
  bossShotCooldown: number;
  bossLives: number;
  // Power-up parameters
  powerUpSpawnProbability: number;
}

export interface GameState {
  player: Player;
  riceRockets: RiceRocket[];
  sushis: Sushi[];
  toriis: Torii[];
  samurais: Samurai[];
  ninjas: Ninja[];
  bosses: Boss[];
  samuraiBullets: SamuraiBullet[];
  powerUps: PowerUp[];
  distance: number;
  isGameRunning: boolean;
  isGameOver: boolean;
  difficultyLevel: DifficultyLevel;
}

export interface GameConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  GRAVITY: number;
  JUMP_STRENGTH: number;
  GROUND_HEIGHT: number;
  FPS: number;
  RICE_ROCKET_SPEED: number;
  RICE_ROCKET_SIZE: number;
  SUSHI_SPEED: number;
  SUSHI_SPAWN_DISTANCE: number;
  // Torii constants
  TORII_SPAWN_DISTANCE: number;
  TORII_WIDTH: number;
  TORII_HEIGHT: number;
  TORII_PILLAR_WIDTH: number;
  TORII_TOP_BAR_HEIGHT: number;
  TORII_BOTTOM_BAR_HEIGHT: number;
  TORII_CENTER_BAR_HEIGHT: number;
  // Sushi spawn constants
  SUSHI_MIN_SPAWN_DISTANCE: number;
  SUSHI_MAX_SPAWN_DISTANCE: number;
  SUSHI_SPAWN_PROBABILITY: number;
  // Game start constants
  INITIAL_SUSHI_SPAWN_DISTANCE: number;
}
