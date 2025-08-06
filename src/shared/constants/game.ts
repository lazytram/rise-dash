import { PowerUpType } from "../types/powerUps";

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GRAVITY: 0.8,
  JUMP_STRENGTH: -15,
  GROUND_HEIGHT: 50,
  FPS: 120, // Increased back to 120 for better fluidity
  RICE_ROCKET_SPEED: 8,
  RICE_ROCKET_SIZE: 4,
  // Torii constants
  TORII_SPAWN_DISTANCE: 100, // Spawn every 100 meters traveled
  TORII_WIDTH: 60,
  TORII_HEIGHT: 80,
  TORII_PILLAR_WIDTH: 8,
  TORII_TOP_BAR_HEIGHT: 12,
  TORII_BOTTOM_BAR_HEIGHT: 8,
  TORII_CENTER_BAR_HEIGHT: 6,
  // Game start constants
  // Samurai constants
  SAMURAI_MIN_SPAWN_DISTANCE: 50, // Don't spawn samurai before 50 meters
  SAMURAI_WIDTH: 40,
  SAMURAI_HEIGHT: 60,
  SAMURAI_SPEED: -2,
  SAMURAI_LIVES: 3,
  SAMURAI_SHOT_COOLDOWN: 3250,
  SAMURAI_MIN_SPAWN_INTERVAL: 75, // Minimum gap between enemies in meters
  SAMURAI_SPAWN_PROBABILITY: 0.9, // 90% chance for samurai (was 0.7)
  // Samurai bullet constants
  SAMURAI_BULLET_WIDTH: 6,
  SAMURAI_BULLET_HEIGHT: 6,
  SAMURAI_BULLET_SPEED: -2,
  // Shuriken constants (for ninjas)
  SHURIKEN_WIDTH: 8,
  SHURIKEN_HEIGHT: 8,
  SHURIKEN_SPEED: -3,
  // Katana slash constants (for samurais)
  KATANA_SLASH_WIDTH: 120,
  KATANA_SLASH_HEIGHT: 60,
  KATANA_SLASH_SPEED: -3,
  // Speed progression constants
  SPEED_INCREASE_INTERVAL: 150,
  SPEED_INCREASE_PERCENTAGE: 0.015,
  BASE_SUSHI_SPEED: -4,
  BASE_SAMURAI_SPEED: -2,
  BASE_SAMURAI_BULLET_SPEED: -7,
  // Rice rocket ammo constants
  AMMO_RECHARGE_INTERVAL: 1000,
  // Difficulty system constants
  DIFFICULTY_LEVEL_INTERVAL: 1000,
  MAX_DIFFICULTY_LEVEL: 15,

  // Sushi spawn rate progression
  BASE_SUSHI_SPAWN_PROBABILITY: 0.7,
  SUSHI_SPAWN_PROBABILITY_INCREASE: 0.03,
  MAX_SUSHI_SPAWN_PROBABILITY: 0.9,
  // Samurai behavior progression
  BASE_SAMURAI_SHOT_COOLDOWN: 3000,
  SAMURAI_SHOT_COOLDOWN_DECREASE: 200,
  MIN_SAMURAI_SHOT_COOLDOWN: 1000,
  // Ninja constants
  NINJA_WIDTH: 35,
  NINJA_HEIGHT: 50,
  NINJA_SPEED: -3, // Faster than samurai
  NINJA_LIVES: 2,
  NINJA_SHOT_COOLDOWN: 2000,
  NINJA_JUMP_PROBABILITY: 0.3, // 30% chance to jump
  NINJA_JUMP_STRENGTH: -8,
  NINJA_SPAWN_PROBABILITY: 0.9, // 90% chance for ninja (was 0.3)
  // Boss constants
  BOSS_WIDTH: 80,
  BOSS_HEIGHT: 100,
  BOSS_SPEED: -1, // Slower but more dangerous
  BOSS_LIVES: 8,
  BOSS_SHOT_COOLDOWN: 1500,
  BOSS_MULTI_SHOT_COUNT: 3, // Shoots 3 bullets at once
  BOSS_SPAWN_DISTANCE: 1000, // Spawn every 1000 meters
  // Power-up constants
  POWERUP_WIDTH: 30,
  POWERUP_HEIGHT: 30,
  POWERUP_SPAWN_DISTANCE: 200,
  POWERUP_SPAWN_PROBABILITY: 0.3,
  POWERUP_DURATION: 10000, // 10 seconds duration
  // Power-up types
  POWERUP_TYPES: {
    SHIELD: PowerUpType.SHIELD,
    INFINITE_AMMO: PowerUpType.INFINITE_AMMO,
    JUMP_BOOST: PowerUpType.JUMP_BOOST,
    SLOW_MOTION: PowerUpType.SLOW_MOTION,
    MULTI_SHOT: PowerUpType.MULTI_SHOT,
  } as const,
} as const;
