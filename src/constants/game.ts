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
} as const;
