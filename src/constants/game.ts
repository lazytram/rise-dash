export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GRAVITY: 0.8,
  JUMP_STRENGTH: -15,
  GROUND_HEIGHT: 50,
  FPS: 60,
  RICE_ROCKET_SPEED: 8,
  RICE_ROCKET_SIZE: 4,
  SUSHI_SPEED: -4,
  SUSHI_SPAWN_DISTANCE: 150,
  // Torii constants
  TORII_SPAWN_DISTANCE: 100, // Spawn every 100 meters traveled
  TORII_WIDTH: 60,
  TORII_HEIGHT: 80,
  TORII_PILLAR_WIDTH: 8,
  TORII_TOP_BAR_HEIGHT: 12,
  TORII_BOTTOM_BAR_HEIGHT: 8,
  TORII_CENTER_BAR_HEIGHT: 6,
  // Sushi spawn constants
  SUSHI_MIN_SPAWN_DISTANCE: 600,
  SUSHI_MAX_SPAWN_DISTANCE: 900,
  SUSHI_SPAWN_PROBABILITY: 0.7,
  // Game start constants
  INITIAL_SUSHI_SPAWN_DISTANCE: 100, // First Torii at 500 meters
  // Samurai constants
  SAMURAI_SPAWN_DISTANCE: 50, // Spawn every 50 meters
  SAMURAI_MIN_SPAWN_DISTANCE: 15, // Don't spawn samurai before 15 meters
  SAMURAI_WIDTH: 40,
  SAMURAI_HEIGHT: 60,
  SAMURAI_SPEED: -2,
  SAMURAI_LIVES: 3,
  SAMURAI_SHOT_COOLDOWN: 3000, // 3 seconds (increased from 2)
  // Samurai bullet constants
  SAMURAI_BULLET_WIDTH: 6,
  SAMURAI_BULLET_HEIGHT: 6,
  SAMURAI_BULLET_SPEED: -2, // Reduced speed for easier dodging
  // Speed progression constants
  SPEED_INCREASE_INTERVAL: 100, // Every 100 meters
  SPEED_INCREASE_PERCENTAGE: 0.025, // 2.5% increase
  BASE_SUSHI_SPEED: -4, // Base speed for sushi
  BASE_SAMURAI_SPEED: -2, // Base speed for samurai
  BASE_SAMURAI_BULLET_SPEED: -7, // Increased base speed for samurai bullets (shurikens)
  // Enhanced sushi spacing constants
  SUSHI_SPACING_VARIANCE: 0.4, // 40% variance in spacing
  // Rice rocket ammo constants
  MAX_RICE_ROCKET_AMMO: 10, // Maximum ammo capacity
  AMMO_RECHARGE_INTERVAL: 1000, // Recharge 1 ammo every 1 second
  // Difficulty system constants
  DIFFICULTY_LEVEL_INTERVAL: 1000, // New difficulty level every 500 meters
  MAX_DIFFICULTY_LEVEL: 15, // Maximum difficulty level
  // Enemy spawn rate progression
  BASE_SAMURAI_SPAWN_DISTANCE: 50,
  SAMURAI_SPAWN_DISTANCE_DECREASE: 5, // Decrease spawn distance by 5m per level
  MIN_SAMURAI_SPAWN_DISTANCE: 20, // Minimum spawn distance
  // Sushi spawn rate progression
  BASE_SUSHI_SPAWN_PROBABILITY: 0.8,
  SUSHI_SPAWN_PROBABILITY_INCREASE: 0.05, // Increase probability by 5% per level
  MAX_SUSHI_SPAWN_PROBABILITY: 0.95, // Maximum spawn probability
  // Samurai behavior progression
  BASE_SAMURAI_SHOT_COOLDOWN: 3000,
  SAMURAI_SHOT_COOLDOWN_DECREASE: 200, // Decrease cooldown by 200ms per level
  MIN_SAMURAI_SHOT_COOLDOWN: 1000, // Minimum cooldown
  // New enemy types (for future implementation)
  NINJA_UNLOCK_DISTANCE: 1000, // Ninjas appear after 1000m
  BOSS_UNLOCK_DISTANCE: 2000, // Boss appears after 2000m
  // Ninja constants
  NINJA_WIDTH: 35,
  NINJA_HEIGHT: 50,
  NINJA_SPEED: -3, // Faster than samurai
  NINJA_LIVES: 2,
  NINJA_SHOT_COOLDOWN: 2000, // Shoots more frequently
  NINJA_JUMP_PROBABILITY: 0.3, // 30% chance to jump
  NINJA_JUMP_STRENGTH: -8,
  // Boss constants
  BOSS_WIDTH: 80,
  BOSS_HEIGHT: 100,
  BOSS_SPEED: -1, // Slower but more dangerous
  BOSS_LIVES: 8,
  BOSS_SHOT_COOLDOWN: 1500, // Very frequent shots
  BOSS_MULTI_SHOT_COUNT: 3, // Shoots 3 bullets at once
  // Power-up constants
  POWERUP_WIDTH: 30,
  POWERUP_HEIGHT: 30,
  POWERUP_SPAWN_DISTANCE: 200, // Spawn every 200m
  POWERUP_SPAWN_PROBABILITY: 0.3, // 30% chance to spawn
  POWERUP_DURATION: 10000, // 10 seconds duration
  // Power-up types
  POWERUP_TYPES: {
    SHIELD: "shield",
    INFINITE_AMMO: "infinite_ammo",
    SPEED_BOOST: "speed_boost",
    MULTI_SHOT: "multi_shot",
  } as const,
} as const;
