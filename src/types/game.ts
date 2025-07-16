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

export interface SamuraiBullet extends MovableEntity {
  velocityY: number;
}

export type RiceRocket = MovableEntity;
export type Sushi = MovableEntity;
export type Torii = MovableEntity;

export interface GameState {
  player: Player;
  riceRockets: RiceRocket[];
  sushis: Sushi[];
  toriis: Torii[];
  samurais: Samurai[];
  samuraiBullets: SamuraiBullet[];
  distance: number;
  isGameRunning: boolean;
  isGameOver: boolean;
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
