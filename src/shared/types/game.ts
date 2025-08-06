import { PowerUpType, PowerUpLevels } from "./powerUps";

// ================================
// CORE ENTITIES
// ================================

/**
 * Player entity with position, physics, and power-up states
 */
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
  hasJumpBoost: boolean;
  hasSlowMotion: boolean;
  hasMultiShot: boolean;
  powerUpEndTimes: {
    shield: number;
    infiniteAmmo: number;
    jumpBoost: number;
    slowMotion: number;
    multiShot: number;
  };
  // Power-up levels
  powerUpLevels: PowerUpLevels;
}

/**
 * Base interface for all movable game entities
 */
export interface MovableEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

// ================================
// ENEMY ENTITIES
// ================================

/**
 * Samurai enemy with shooting capabilities
 */
export interface Samurai extends MovableEntity {
  lives: number;
  maxLives: number;
  lastShotTime: number;
  shotCooldown: number;
}

/**
 * Ninja enemy with jumping and shooting capabilities
 */
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

/**
 * Boss enemy with multiple phases and enhanced capabilities
 */
export interface Boss extends MovableEntity {
  lives: number;
  maxLives: number;
  lastShotTime: number;
  shotCooldown: number;
  phase: number;
  lastPhaseChange: number;
}

// ================================
// PROJECTILE TYPES
// ================================

export enum ProjectileType {
  SHURIKEN = "shuriken",
  KATANA_SLASH = "katana_slash",
  BOSS_BULLET = "boss_bullet",
}

/**
 * Projectile fired by enemy entities (samurai, ninja, boss)
 */
export interface EnemyBullet extends MovableEntity {
  velocityY: number;
  projectileType: ProjectileType;
}

// ================================
// POWER-UP ENTITIES
// ================================

/**
 * Power-up item that can be collected by the player
 */
export interface PowerUp extends MovableEntity {
  type: PowerUpType;
  duration: number;
}

// ================================
// COLLECTIBLE ENTITIES
// ================================

/**
 * Rice rocket projectile fired by the player
 */
export type RiceRocket = MovableEntity;

/**
 * Sushi collectible that increases score
 */
export type Sushi = MovableEntity;

/**
 * Torii gate decoration and obstacle
 */
export type Torii = MovableEntity;

// ================================
// GAME SYSTEMS
// ================================

/**
 * Difficulty configuration that scales with distance
 */
export interface DifficultyLevel {
  level: number;
  speedMultiplier: number;
  sushiSpawnProbability: number;
  samuraiShotCooldown: number;
  samuraiLives: number;
  enemyBulletspeed: number;
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

/**
 * Complete game state containing all entities and game status
 */
export interface GameState {
  player: Player;
  riceRockets: RiceRocket[];
  sushis: Sushi[];
  toriis: Torii[];
  samurais: Samurai[];
  ninjas: Ninja[];
  bosses: Boss[];
  enemyBullets: EnemyBullet[];
  powerUps: PowerUp[];
  distance: number;
  isGameRunning: boolean;
  isGameOver: boolean;
  difficultyLevel: DifficultyLevel;
  lastEnemySpawnDistance: number; // Track the last enemy spawn distance
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
  // Torii constants
  TORII_SPAWN_DISTANCE: number;
  TORII_WIDTH: number;
  TORII_HEIGHT: number;
  TORII_PILLAR_WIDTH: number;
  TORII_TOP_BAR_HEIGHT: number;
  TORII_BOTTOM_BAR_HEIGHT: number;
  TORII_CENTER_BAR_HEIGHT: number;
}

export interface DistanceReward {
  distance: number;
  riceReward: number;
  description: string;
}

export interface GameRewards {
  totalDistance: number;
  totalRice: number;
  distanceRewards: DistanceReward[];
}
